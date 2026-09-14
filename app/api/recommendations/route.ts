import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

// GEMINI_API_KEY must be set server-side (e.g. .env.local) — the previous
// `new GoogleGenAI()` call with no config was the reason nothing came back:
// every request was failing auth before it reached the model.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// DNS/network blips (EAI_AGAIN, ETIMEDOUT, connection resets) are transient —
// retrying a couple of times with a short backoff clears most of them
// without surfacing an error to the user at all. Non-network errors (bad
// API key, invalid model, schema failures) are NOT retried — those won't
// succeed on attempt 2 either, so we fail fast instead of wasting time.
const RETRYABLE_CODES = new Set(["EAI_AGAIN", "ENOTFOUND", "ETIMEDOUT", "ECONNRESET"]);

async function generateContentWithRetry(
  params: Parameters<typeof ai.models.generateContent>[0],
  attempts = 3
) {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (err) {
      lastError = err;
      const code = (err as { cause?: { code?: string }; code?: string })?.cause?.code
        ?? (err as { code?: string })?.code;
      const isRetryable = code ? RETRYABLE_CODES.has(code) : false;
      if (!isRetryable || attempt === attempts - 1) throw err;
      console.warn(`[gemini] ${code} on attempt ${attempt + 1}/${attempts}, retrying...`);
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
  throw lastError;
}

const RecommendationSchema = {
  type: Type.OBJECT,
  properties: {
    recommendations: {
      type: Type.ARRAY,
      minItems: 12,
      description: "At least 12 distinct, tailored final-year project topics.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "short kebab-case slug, unique within this response" },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
          difficulty: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Advanced"] },
          matchScore: { type: Type.NUMBER, description: "0-100 fit score, varied realistically — not all 90+" },
          rationale: { type: Type.STRING },
          domainTags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "1-3 short domain labels the dashboard uses for filtering, e.g. ['Web Development']",
          },
        },
        required: ["id", "title", "description", "techStack", "difficulty", "matchScore", "rationale", "domainTags"],
      },
    },
  },
  required: ["recommendations"],
};

// The onboarding form saves { major, technicalSkills, careerGoals, preferredDomain,
// complexityPreference } — this route previously read { skills, careerGoal, domain },
// which don't exist on that object, so studentProfile.skills.join(...) threw on every
// request. Reading both spellings makes this route work regardless of which one is live.
interface StudentProfilePayload {
  major?: string;
  technicalSkills?: string[];
  skills?: string[];
  careerGoals?: string;
  careerGoal?: string;
  preferredDomain?: string;
  domain?: string;
  complexityPreference?: string;
}

function normalizeProfile(payload: StudentProfilePayload) {
  const skills = payload.technicalSkills ?? payload.skills ?? [];
  return {
    major: (payload.major ?? "").trim(),
    skills: Array.isArray(skills) ? skills : [],
    careerGoals: (payload.careerGoals ?? payload.careerGoal ?? "").trim(),
    domain: (payload.preferredDomain ?? payload.domain ?? "").trim(),
    complexity: payload.complexityPreference ?? "Any",
  };
}

export async function POST(req: Request) {
  let body: StudentProfilePayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const profile = normalizeProfile(body);

  if (!profile.major || profile.skills.length === 0 || !profile.careerGoals || !profile.domain) {
    return NextResponse.json(
      { error: "Missing required profile fields (major, skills, career goals, domain)" },
      { status: 400 }
    );
  }

  try {
    const response = await generateContentWithRetry({
      model: "gemini-3.6-flash",
      contents: `Generate customized final-year project recommendations for the following student profile:
- Major: ${profile.major}
- Key Skills: ${profile.skills.join(", ")}
- Domain Interest: ${profile.domain}
- Career Goal: ${profile.careerGoals}
- Preferred Complexity: ${profile.complexity}

Provide AT LEAST 12 actionable, modern, and distinct project ideas — aim for as many genuinely
distinct, high-quality ideas as you can find for this profile, but never pad the list with
near-duplicate variations of the same idea just to hit a higher count. Vary difficulty and
matchScore realistically across the set instead of clustering every score near 100.`,
      config: {
        systemInstruction:
          "You are an academic project advisor. Output structured JSON strictly adhering to the schema provided — no markdown fences, no commentary.",
        responseMimeType: "application/json",
        responseSchema: RecommendationSchema,
        temperature: 0.9,
        // A 12+ item array with full descriptions/rationale per item is
        // meaningfully larger than the previous 6-item response — without
        // raising this, a longer response risks getting cut off mid-JSON,
        // which would fail JSON.parse below and surface as a 502.
        maxOutputTokens: 8192,
      },
    });

    const raw = response.text;
    if (!raw) {
      return NextResponse.json({ error: "Empty response from Gemini" }, { status: 502 });
    }

    let data: { recommendations?: unknown };
    try {
      data = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "Gemini returned malformed JSON" }, { status: 502 });
    }

    if (!Array.isArray(data.recommendations) || data.recommendations.length < 12) {
      return NextResponse.json({ error: "Gemini did not return at least 12 recommendations" }, { status: 502 });
    }

    // Defensive de-dupe in case the model repeats an id across items.
    const seen = new Set<string>();
    const recommendations = (data.recommendations as Array<{ id: string }>).filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });

    // Dashboard reads `data.recommendations` — the old `{ projects: [...] }` shape
    // meant `setProjects(data.recommendations)` on the dashboard was always undefined.
    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("Gemini Recommendation Error:", error);
    // TEMPORARY: surfaces the real error to the client for local debugging.
    // Remove `details` (or gate it behind NODE_ENV !== "production") before shipping.
    const details = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "Failed to generate recommendations", details }, { status: 500 });
  }
}


// import { GoogleGenAI, Type } from "@google/genai";
// import { NextResponse } from "next/server";

// // GEMINI_API_KEY must be set server-side (e.g. .env.local) — the previous
// // `new GoogleGenAI()` call with no config was the reason nothing came back:
// // every request was failing auth before it reached the model.
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// const RecommendationSchema = {
//   type: Type.OBJECT,
//   properties: {
//     recommendations: {
//       type: Type.ARRAY,
//       minItems: 6,
//       description: "At least 6 distinct, tailored final-year project topics.",
//       items: {
//         type: Type.OBJECT,
//         properties: {
//           id: { type: Type.STRING, description: "short kebab-case slug, unique within this response" },
//           title: { type: Type.STRING },
//           description: { type: Type.STRING },
//           techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
//           difficulty: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Advanced"] },
//           matchScore: { type: Type.NUMBER, description: "0-100 fit score, varied realistically — not all 90+" },
//           rationale: { type: Type.STRING },
//           domainTags: {
//             type: Type.ARRAY,
//             items: { type: Type.STRING },
//             description: "1-3 short domain labels the dashboard uses for filtering, e.g. ['Web Development']",
//           },
//         },
//         required: ["id", "title", "description", "techStack", "difficulty", "matchScore", "rationale", "domainTags"],
//       },
//     },
//   },
//   required: ["recommendations"],
// };

// // The onboarding form saves { major, technicalSkills, careerGoals, preferredDomain,
// // complexityPreference } — this route previously read { skills, careerGoal, domain },
// // which don't exist on that object, so studentProfile.skills.join(...) threw on every
// // request. Reading both spellings makes this route work regardless of which one is live.
// interface StudentProfilePayload {
//   major?: string;
//   technicalSkills?: string[];
//   skills?: string[];
//   careerGoals?: string;
//   careerGoal?: string;
//   preferredDomain?: string;
//   domain?: string;
//   complexityPreference?: string;
// }

// function normalizeProfile(payload: StudentProfilePayload) {
//   const skills = payload.technicalSkills ?? payload.skills ?? [];
//   return {
//     major: (payload.major ?? "").trim(),
//     skills: Array.isArray(skills) ? skills : [],
//     careerGoals: (payload.careerGoals ?? payload.careerGoal ?? "").trim(),
//     domain: (payload.preferredDomain ?? payload.domain ?? "").trim(),
//     complexity: payload.complexityPreference ?? "Any",
//   };
// }

// export async function POST(req: Request) {
//   let body: StudentProfilePayload;
//   try {
//     body = await req.json();
//   } catch {
//     return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
//   }

//   const profile = normalizeProfile(body);

//   if (!profile.major || profile.skills.length === 0 || !profile.careerGoals || !profile.domain) {
//     return NextResponse.json(
//       { error: "Missing required profile fields (major, skills, career goals, domain)" },
//       { status: 400 }
//     );
//   }

//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-3.6-flash",
//       contents: `Generate customized final-year project recommendations for the following student profile:
// - Major: ${profile.major}
// - Key Skills: ${profile.skills.join(", ")}
// - Domain Interest: ${profile.domain}
// - Career Goal: ${profile.careerGoals}
// - Preferred Complexity: ${profile.complexity}

// Provide AT LEAST 6 actionable, modern, and distinct project ideas. Vary difficulty and matchScore
// realistically across the set instead of clustering every score near 100.`,
//       config: {
//         systemInstruction:
//           "You are an academic project advisor. Output structured JSON strictly adhering to the schema provided — no markdown fences, no commentary.",
//         responseMimeType: "application/json",
//         responseSchema: RecommendationSchema,
//         temperature: 0.9,
//       },
//     });

//     const raw = response.text;
//     if (!raw) {
//       return NextResponse.json({ error: "Empty response from Gemini" }, { status: 502 });
//     }

//     let data: { recommendations?: unknown };
//     try {
//       data = JSON.parse(raw);
//     } catch {
//       return NextResponse.json({ error: "Gemini returned malformed JSON" }, { status: 502 });
//     }

//     if (!Array.isArray(data.recommendations) || data.recommendations.length < 6) {
//       return NextResponse.json({ error: "Gemini did not return at least 6 recommendations" }, { status: 502 });
//     }

//     // Defensive de-dupe in case the model repeats an id across items.
//     const seen = new Set<string>();
//     const recommendations = (data.recommendations as Array<{ id: string }>).filter((item) => {
//       if (seen.has(item.id)) return false;
//       seen.add(item.id);
//       return true;
//     });

//     // Dashboard reads `data.recommendations` — the old `{ projects: [...] }` shape
//     // meant `setProjects(data.recommendations)` on the dashboard was always undefined.
//     return NextResponse.json({ recommendations });
//   } catch (error) {
//     console.error("Gemini Recommendation Error:", error);
//     // TEMPORARY: surfaces the real error to the client for local debugging.
//     // Remove `details` (or gate it behind NODE_ENV !== "production") before shipping.
//     const details = error instanceof Error ? error.message : String(error);
//     return NextResponse.json({ error: "Failed to generate recommendations", details }, { status: 500 });
//   }
// }



// import { GoogleGenAI, Type } from '@google/genai';
// import { NextResponse } from 'next/server';

// const ai = new GoogleGenAI();

// const RecommendationSchema = {
//   type: Type.OBJECT,
//   properties: {
//     projects: {
//       type: Type.ARRAY,
//       description: 'List of at least 6 tailored project topics.',
//       items: {
//         type: Type.OBJECT,
//         properties: {
//           id: { type: Type.STRING },
//           title: { type: Type.STRING },
//           description: { type: Type.STRING },
//           techStack: { 
//             type: Type.ARRAY, 
//             items: { type: Type.STRING } 
//           },
//           difficulty: { type: Type.STRING },
//           matchScore: { type: Type.NUMBER },
//           rationale: { type: Type.STRING },
//         },
//         required: ['id', 'title', 'description', 'techStack', 'difficulty', 'matchScore', 'rationale'],
//       },
//     },
//   },
//   required: ['projects'],
// };

// export async function POST(req: Request) {
//   try {
//     const studentProfile = await req.json();

//     const response = await ai.models.generateContent({
//       model: 'gemini-2.5-flash',
//       contents: `Generate customized final-year project recommendations for the following student profile:
//         - Major: ${studentProfile.major}
//         - Key Skills: ${studentProfile.skills.join(', ')}
//         - Domain Interest: ${studentProfile.domain}
//         - Career Goal: ${studentProfile.careerGoal}
        
//         Provide AT LEAST 6 actionable, modern, and distinct project ideas.`,
//       config: {
//         systemInstruction: 'You are an academic project advisor. Output structured JSON strictly adhering to the schema provided.',
//         responseMimeType: 'application/json',
//         responseSchema: RecommendationSchema,
//       },
//     });

//     const data = JSON.parse(response.text || '{}');
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error('Gemini Recommendation Error:', error);
//     return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 });
//   }
// };


// import { NextRequest, NextResponse } from 'next/server';
// import { z } from 'zod';
// import { getGeminiRecommendation } from '@/app/lib/ai/gemini';

// export const runtime = 'nodejs';

// const requestSchema = z.object({
//     skills: z.string().min(1, 'Skills are required'),
//     interests: z.string().min(1, 'Interests are required'),
//     level: z.string().optional(),
// });

// interface RecommendedProject {
//     title: string;
//     description: string;
//     tags: string[];
//     matchReason: string;
// }

// function buildPrompt(skills: string, interests: string, level?: string): string {
//     return `You are an academic project advisor. A student has this profile:
// - Skills: ${skills}
// - Interests: ${interests}
// ${level ? `- Level: ${level}` : ''}

// Generate EXACTLY 6 distinct final-year capstone project ideas tailored to this student.
// Respond with ONLY a JSON array, no markdown fences, no commentary, matching:
// [{ "title": string, "description": string, "tags": string[], "matchReason": string }]`;
// }

// function parseRecommendations(raw: string): RecommendedProject[] {
//     const cleaned = raw.replace(/```json|```/g, '').trim();
//     const parsed = JSON.parse(cleaned);
//     if (!Array.isArray(parsed)) throw new Error('Expected an array of recommendations');
//     return parsed;
// }

// export async function POST(req: NextRequest) {
//     if (!process.env.GEMINI_API_KEY) {
//         console.error('GEMINI_API_KEY is not set');
//         return NextResponse.json(
//             { error: 'Recommendation service is not configured' },
//             { status: 500 }
//         );
//     }

//     let body: unknown;
//     try {
//         body = await req.json();
//     } catch {
//         return NextResponse.json({ error: 'Request body must be valid JSON' }, { status: 400 });
//     }

//     const parsedBody = requestSchema.safeParse(body);
//     if (!parsedBody.success) {
//         return NextResponse.json(
//             { error: 'Invalid profile data', details: parsedBody.error.flatten().fieldErrors },
//             { status: 400 }
//         );
//     }

//     const { skills, interests, level } = parsedBody.data;

//     try {
//         const raw = await getGeminiRecommendation(buildPrompt(skills, interests, level));

//         if (!raw) {
//             return NextResponse.json(
//                 { error: 'No response from recommendation engine' },
//                 { status: 502 }
//             );
//         }

//         const recommendations = parseRecommendations(raw);

//         if (recommendations.length < 6) {
//             console.warn(`Expected 6+ recommendations, got ${recommendations.length}`);
//         }

//         return NextResponse.json({ recommendations }, { status: 200 });
//     } catch (err) {
//         console.error('Gemini recommendation error:', err);
//         return NextResponse.json(
//             { error: 'Failed to generate recommendations. Please try again.' },
//             { status: 500 }
//         );
//     }
// }


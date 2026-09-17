import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("Gemini Recommendation Error:", error);
    const details = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "Failed to generate recommendations", details }, { status: 500 });
  }
}


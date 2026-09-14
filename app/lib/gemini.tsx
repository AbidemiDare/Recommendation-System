import { GoogleGenAI, Type } from "@google/genai";
import { RecommendationResponseSchema } from "./validation";
import type { StudentProfile, RecommendationResponse } from "./types";

// GEMINI_API_KEY must be set server-side only (never exposed to the client).
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Enforced JSON Schema — Gemini's structured output mode will only ever
// return data matching this shape, so no markdown fences or preamble to strip.
const recommendationSchema = {
  type: Type.OBJECT,
  properties: {
    recommendations: {
      type: Type.ARRAY,
      minItems: 6,
      items: {
        type: Type.OBJECT,
        properties: {
          id: {
            type: Type.STRING,
            description: "Short kebab-case slug, unique within this response (e.g. 'campus-lost-found-app')",
          },
          title: { type: Type.STRING },
          description: {
            type: Type.STRING,
            description: "2-4 sentence summary of what the project is and what it does",
          },
          techStack: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Concrete technologies, e.g. 'Next.js', 'PostgreSQL', 'TensorFlow' — not general skills",
          },
          difficulty: {
            type: Type.STRING,
            enum: ["Beginner", "Intermediate", "Advanced"],
          },
          rationale: {
            type: Type.STRING,
            description: "Why this specific project fits this specific student's skills, goals, or domain interest",
          },
          matchScore: {
            type: Type.NUMBER,
            description: "0-100 fit score against the student profile. Vary realistically — not all 90+.",
          },
          domainTags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "1-3 short domain labels for filtering, e.g. ['Web Development', 'Machine Learning']",
          },
        },
        required: ["id", "title", "description", "techStack", "difficulty", "rationale", "matchScore", "domainTags"],
      },
    },
  },
  required: ["recommendations"],
};

function buildPrompt(profile: StudentProfile): string {
  return `You are an academic project advisor for final-year Computer Science / IT students.

Student profile:
- Major: ${profile.major}
- Technical skills: ${(profile.technicalSkills ?? []).join(", ")}
- Career goals: ${profile.careerGoals}
- Preferred domain: ${profile.preferredDomain}
- Preferred complexity: ${profile.complexityPreference}

Recommend AT LEAST 6 distinct, high-quality final-year project topics tailored to this profile.

Rules:
- Every project must be realistically buildable and defensible by a single student in one academic term.
- Vary the topics — do not propose 6 variations of the same idea.
- techStack must list concrete technologies the student would actually use, not restated skills.
- matchScore must reflect genuine fit against the stated skills and goals; spread the scores realistically instead of clustering near 90-100.
- rationale must reference specific parts of the student's profile (a named skill, a stated goal, or the chosen domain) — no generic praise like "this is a great project for you".
- If preferredComplexity is "Any", vary difficulty levels across the set rather than defaulting to one tier.
- Prefer project ideas with a genuine data, logic, or systems component over pure CRUD/UI wrappers, unless the student's profile points specifically toward frontend/design work.

Return only the structured JSON described by the response schema.`;
}

export async function generateRecommendations(profile: StudentProfile): Promise<RecommendationResponse> {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: buildPrompt(profile),
    config: {
      responseMimeType: "application/json",
      responseSchema: recommendationSchema,
      temperature: 0.9,
    },
  });

  const raw = response.text;
  if (!raw) {
    throw new Error("Empty response from Gemini");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Gemini returned malformed JSON");
  }

  const result = RecommendationResponseSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(`Gemini response failed validation: ${result.error.message}`);
  }

  // Defensive de-dupe in case the model repeats an id across items.
  const seen = new Set<string>();
  const recommendations = result.data.recommendations.filter((project) => {
    if (seen.has(project.id)) return false;
    seen.add(project.id);
    return true;
  });

  return { recommendations };
}



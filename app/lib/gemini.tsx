import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? "" });
const MODEL_CANDIDATES = ["gemini-3.6-flash", "gemini-2.0-flash", "gemini-1.5-flash"];

export const recommendationSchema = {
  type: Type.OBJECT,
  properties: {
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          whyThisMatches: { type: Type.STRING },
          matchScore: { type: Type.INTEGER },
          techStack: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          difficulty: { type: Type.STRING },
          keyFeatures: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: [
          "id",
          "title",
          "description",
          "whyThisMatches",
          "matchScore",
          "techStack",
          "difficulty",
        ],
      },
    },
  },
  required: ["recommendations"],
} as const;

export async function getRecommendations(prompt: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  let lastError: unknown = null;

  for (const model of MODEL_CANDIDATES) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: recommendationSchema,
        },
      });

      return response.text ?? "{}";
    } catch (error) {
      lastError = error;
      console.warn(`Gemini model ${model} failed, trying next fallback:`, error);
    }
  }

  throw lastError ?? new Error("Gemini recommendation generation failed");
}


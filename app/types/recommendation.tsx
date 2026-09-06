// types/recommendation.ts
export interface RecommendedProject {
  id: string;
  title: string;
  description: string;
  whyThisMatches?: string;
  matchScore: number; // e.g., 95 for 95% match
  techStack: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  keyFeatures: string[];
}

export interface RecommendationResponse {
  recommendations: RecommendedProject[];
}
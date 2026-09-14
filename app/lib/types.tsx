// Re-exports the canonical StudentProfile from auth.ts rather than defining
// a second, possibly-drifting copy of it here — this file only owns the one
// type auth.ts doesn't: the shape of a single AI-generated recommendation.
export type { StudentProfile } from "./auth";

export interface ProjectRecommendation {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  matchScore: number;
  rationale: string;
  domainTags?: string[];
}

export interface RecommendationResponse {
  recommendations: ProjectRecommendation[];
}

// What gets written to localStorage["savedProjects"] when a project is
// bookmarked — the full recommendation plus when it was saved. Both
// recommendation-dashboard.tsx (writer) and the Saved page (reader) import
// this one definition rather than each keeping their own drifting copy.
export interface SavedProject extends ProjectRecommendation {
  savedAt: string; // ISO date string
}



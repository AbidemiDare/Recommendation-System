import { z } from "zod";

export const StudentProfileSchema = z.object({
  major: z.string().trim().min(2, "Major is required"),
  technicalSkills: z.array(z.string().trim().min(1)).min(1, "Add at least one skill"),
  careerGoals: z.string().trim().min(5, "Tell us a bit about your career goals"),
  preferredDomain: z.string().trim().min(2, "Preferred domain is required"),
  complexityPreference: z.enum(["Beginner", "Intermediate", "Advanced", "Any"]),
});

export const ProjectRecommendationSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  techStack: z.array(z.string()).min(1),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  rationale: z.string().min(1),
  matchScore: z.number().min(0).max(100),
  domainTags: z.array(z.string()),
});

// The Gemini responseSchema already forces this shape, but we validate again
// on our side — never trust a model's output as implicitly safe/well-formed.
export const RecommendationResponseSchema = z.object({
  recommendations: z.array(ProjectRecommendationSchema).min(6),
});

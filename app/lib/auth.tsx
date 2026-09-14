// Named "auth" to match the existing import path (`@/app/lib/auth`) that
// profile/page.tsx already expected — it doesn't do authentication, it's
// the read/write helper for the locally-stored student profile.
//
// This is a superset type: onboarding, the profile page, and the
// recommendation route each read a different subset of these fields off
// the same "student" object. Worth consolidating to one canonical shape
// (and dropping the unused half) once the app settles.

export interface StudentProfile {
  // Personal info — used by the profile page
  id?: string;
  name: string;
  email?: string;
  matricNumber?: string;
  department: string;
  level: string;
  interests?: string[];
  skills?: string[];

  // Recommendation-engine fields — used by /api/recommendations
  major?: string;
  technicalSkills?: string[];
  careerGoals?: string;
  preferredDomain?: string;
  complexityPreference?: "Beginner" | "Intermediate" | "Advanced" | "Any";
}

export const STUDENT_STORAGE_KEY = "student";

export function readStudentProfile(): StudentProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STUDENT_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StudentProfile;
  } catch {
    return null;
  }
}

export function saveStudentProfile(profile: StudentProfile): void {
  if (typeof window === "undefined") return;
  // Merge rather than replace: the profile page only ever constructs an
  // object with its own 8 fields (id/name/email/matricNumber/department/
  // level/interests/skills), and a plain overwrite would silently delete
  // major/technicalSkills/careerGoals/preferredDomain/complexityPreference
  // that onboarding wrote — which is exactly what was breaking
  // /api/recommendations after a visit to /profile.
  const current = readStudentProfile();
  const merged = { ...current, ...profile };
  localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(merged));
}


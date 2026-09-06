export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  matricNumber: string;
  department: string;
  level: string;
  interests: string[];
  skills: string[];
}

export const STUDENT_STORAGE_KEY = "student";

export function normalizeStudentProfile(profile?: Partial<StudentProfile> | null): StudentProfile {
  const base: StudentProfile = {
    id: typeof profile?.id === "string" ? profile.id : "student-1",
    name: typeof profile?.name === "string" ? profile.name : "",
    email: typeof profile?.email === "string" ? profile.email : "",
    matricNumber: typeof profile?.matricNumber === "string" ? profile.matricNumber : "",
    department: typeof profile?.department === "string" ? profile.department : "",
    level: typeof profile?.level === "string" ? profile.level : "",
    interests: Array.isArray(profile?.interests)
      ? profile.interests.filter((item): item is string => typeof item === "string")
      : [],
    skills: Array.isArray(profile?.skills)
      ? profile.skills.filter((item): item is string => typeof item === "string")
      : [],
  };

  return base;
}

export function readStudentProfile(): StudentProfile | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(STUDENT_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return normalizeStudentProfile(JSON.parse(raw) as Partial<StudentProfile>);
  } catch (error) {
    console.error("Failed to parse stored student profile", error);
    return null;
  }
}

export function saveStudentProfile(profile: Partial<StudentProfile>): StudentProfile {
  const nextProfile = normalizeStudentProfile({
    ...(readStudentProfile() ?? {}),
    ...profile,
  });

  if (typeof window !== "undefined") {
    localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(nextProfile));
  }

  return nextProfile;
}

export function logoutDemoStudent(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STUDENT_STORAGE_KEY);
  }
}

export function loginDemoStudent(profile: Partial<StudentProfile>): StudentProfile {
  return saveStudentProfile(profile);
}

export function getDemoStudent(): StudentProfile | null {
  return readStudentProfile();
}
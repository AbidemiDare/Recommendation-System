"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { clearSession } from "@/app/lib/session";
import { saveStudentProfile, type StudentProfile } from "@/app/lib/auth";
import { createClient } from "@/app/lib/supabase/client";
import { INTEREST_PRESETS } from "@/app/lib/interests";
import { ChoiceGroup, Field, TagPicker, inputClass } from "@/app/Components/Formcontrols";

const SKILL_PRESETS = [
  "JavaScript", "TypeScript", "Python", "React", "Next.js", "Node.js",
  "Java", "SQL", "Machine Learning", "Flutter", "Firebase", "Django",
] as const;
const LEVELS = ["100 Level", "200 Level", "300 Level", "400 Level", "500 Level"] as const;
const COMPLEXITY = ["Beginner", "Intermediate", "Advanced", "Any"] as const;
type Complexity = (typeof COMPLEXITY)[number];

type Loaded = StudentProfile;

export default function OnboardingPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Loaded | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/auth/login");
        return;
      }

      // maybeSingle: no error if the row doesn't exist yet
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (cancelled) return;

      // Google puts the name in user_metadata (full_name or name)
      const meta = user.user_metadata ?? {};

      setProfile({
        id: user.id,
        name: data?.full_name || meta.full_name || meta.name || "",
        email: data?.email || user.email || "",
        matricNumber: data?.matric_number ?? "",
        department: data?.department ?? "",
        level: data?.level ?? "",
        interests: data?.interests ?? [],
        skills: data?.skills ?? [],
        careerGoals: data?.career_goals ?? "",
        complexityPreference: data?.complexity_preference ?? "Any",
      });
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F8FB]">
        <p className="text-sm text-gray-500">Loading your profile...</p>
      </main>
    );
  }

  return <OnboardingForm existing={profile} />;
}

function OnboardingForm({ existing }: { existing: Loaded }) {
  const router = useRouter();

  const [matricNumber, setMatricNumber] = useState(existing.matricNumber ?? "");
  const [department, setDepartment] = useState(existing.department ?? "");
  const [level, setLevel] = useState(existing.level ?? "");
  const [skills, setSkills] = useState<string[]>(existing.skills ?? []);
  const [interests, setInterests] = useState<string[]>(existing.interests ?? []);
  const [careerGoals, setCareerGoals] = useState(existing.careerGoals ?? "");
  const [complexity, setComplexity] = useState<Complexity>(existing.complexityPreference ?? "Any");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const next: Record<string, string> = {};
    if (!matricNumber.trim()) next.matricNumber = "Enter your matric number.";
    if (!department.trim()) next.department = "Enter your department.";
    if (!level) next.level = "Pick your current level.";
    if (skills.length === 0) next.skills = "Pick or add at least one skill.";
    if (!careerGoals.trim()) next.careerGoals = "Tell us what you want this project to lead to.";
    if (interests.length === 0) next.interests = "Pick or add at least one interest.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  if (!validate()) return;
  setSubmitting(true);

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    router.replace("/auth/login");
    return;
  }

  // upsert so accounts created before the signup trigger still get a row
  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
      full_name: existing.name,  
    email: user.email,
    matric_number: matricNumber.trim(),
    department: department.trim(),
    level,
    interests,
    skills,
    career_goals: careerGoals.trim(),
    complexity_preference: complexity,
  });

  if (error) {
    setErrors({ form: error.message });
    setSubmitting(false);
    return;
  }

  clearSession();

  // Keep the localStorage copy in sync for pages not migrated yet.
  // If your original handler already had a saveStudentProfile call, keep that one instead.
  saveStudentProfile({
    ...existing,
    matricNumber: matricNumber.trim(),
    department: department.trim(),
    level,
    skills,
    interests,
    careerGoals: careerGoals.trim(),
    complexityPreference: complexity,
  });

  router.push("/dashboard");
}

  const invalid = (key: string) => (errors[key] ? true : undefined);

  return (
    <main className="min-h-screen bg-[#F8F8FB] px-5 py-8">
      <div className="mx-auto max-w-xl">
        <header className="mb-8">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563EB]/10">
            <GraduationCap className="h-6 w-6 text-[#2563EB]" aria-hidden />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Hi {existing.name.split(" ")[0] || "there"}, tell us about your skills
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Your details help us match you with final-year project ideas worth building.
          </p>
        </header>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field id="matric" label="Matric number" error={errors.matricNumber}>
              <input
                id="matric" value={matricNumber} autoComplete="off"
                onChange={(e) => setMatricNumber(e.target.value)}
                placeholder="e.g. 190805021" aria-invalid={invalid("matricNumber")}
                className={`${inputClass} h-14 px-4`}
              />
            </Field>
            <Field id="department" label="Department" error={errors.department}>
              <input
                id="department" value={department} autoComplete="off"
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Computer Science" aria-invalid={invalid("department")}
                className={`${inputClass} h-14 px-4`}
              />
            </Field>
          </div>

          <ChoiceGroup
            id="level" legend="Level" options={LEVELS} value={level}
            onChange={setLevel} format={(l) => l.replace(" Level", "")} error={errors.level}
          />

          <TagPicker
            id="skills" legend="Technical skills" presets={SKILL_PRESETS}
            value={skills} onChange={setSkills}
            placeholder="Add a skill not listed above" error={errors.skills}
          />

          <Field id="goals" label="Career goals" error={errors.careerGoals}>
            <textarea
              id="goals" rows={3} value={careerGoals}
              onChange={(e) => setCareerGoals(e.target.value)}
              placeholder="e.g. I want to work as a backend engineer at a fintech company"
              aria-invalid={invalid("careerGoals")}
              className={`${inputClass} px-4 py-3`}
            />
          </Field>

          <TagPicker
            id="interests" legend="Interests"
            hint="Pick as many as apply. Your interests have the biggest effect on your matches."
            presets={INTEREST_PRESETS} value={interests} onChange={setInterests}
            placeholder="Add an interest not listed above" error={errors.interests}
          />

          <ChoiceGroup
            id="complexity" legend="Preferred complexity" options={COMPLEXITY}
            value={complexity} onChange={setComplexity}
          />

          {errors.form && (
  <p role="alert" className="text-sm text-red-600">{errors.form}</p>
)}

          <button
            type="submit" disabled={submitting}
            className="h-14 w-full rounded-xl bg-[#2563EB] text-sm font-semibold text-white transition-colors hover:bg-[#1d4fd1] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
          >
            {submitting ? "Saving..." : "Get my recommendations"}
          </button>
        </form>
      </div>
    </main>
  );
}


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Plus, X } from "lucide-react";
import { clearSession } from "@/app/lib/session";
import { readStudentProfile } from "@/app/lib/auth";
import { INTEREST_PRESETS } from "../lib/interests";

const SKILL_PRESETS = [
  "JavaScript", "TypeScript", "Python", "React", "Next.js", "Node.js",
  "Java", "SQL", "Machine Learning", "Flutter", "Firebase", "Django",
];

const LEVEL_OPTIONS = ["100 Level", "200 Level", "300 Level", "400 Level", "500 Level"];

const COMPLEXITY_OPTIONS = ["Beginner", "Intermediate", "Advanced", "Any"] as const;

type LoadedProfile = {
  identity: { name: string; email: string };
  initial: {
    matricNumber: string;
    department: string;
    level: string;
    skills: string[];
    interests: string[];
  };
};

export default function OnboardingForm() {
  const router = useRouter();

  // A single piece of state instead of `identity` + `checkingIdentity` +
  // five separate prefill setters. The effect below now does exactly ONE
  // setState call, so there's no cascading-render warning.
  const [profile, setProfile] = useState<LoadedProfile | "checking">("checking");

  useEffect(() => {
    const existing = readStudentProfile();
    if (!existing?.name || !existing?.email) {
      // Redirecting is a call to an external system (the router), not a
      // setState — fine to do synchronously in the effect.
      router.push("/signup");
      return;
    }

    setProfile({
      identity: { name: existing.name, email: existing.email },
      initial: {
        matricNumber: existing.matricNumber ?? "",
        department: existing.department ?? "",
        level: existing.level ?? "",
        skills: Array.isArray(existing.skills) ? existing.skills : [],
        interests: Array.isArray(existing.interests) ? existing.interests : [],
      },
    });
  }, [router]);

  if (profile === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F8FB]">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  // Mounted only once we actually have data, so its own state can be
  // initialized straight from props — no effect required.
  return <OnboardingFields identity={profile.identity} initial={profile.initial} />;
}

function OnboardingFields({
  identity,
  initial,
}: {
  identity: { name: string; email: string };
  initial: LoadedProfile["initial"];
}) {
  const router = useRouter();

  const [matricNumber, setMatricNumber] = useState(initial.matricNumber);
  const [level, setLevel] = useState(initial.level);
  const [department, setDepartment] = useState(initial.department);
  const [skills, setSkills] = useState<string[]>(initial.skills);
  const [skillInput, setSkillInput] = useState("");
  const [careerGoals, setCareerGoals] = useState("");
  const [interests, setInterests] = useState<string[]>(initial.interests);
  const [interestInput, setInterestInput] = useState("");
  const [complexity, setComplexity] = useState<(typeof COMPLEXITY_OPTIONS)[number]>("Any");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function toggleSkill(skill: string) {
    setSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]));
  }

  function addCustomSkill() {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setSkillInput("");
  }

  function removeSkill(skill: string) {
    setSkills((prev) => prev.filter((s) => s !== skill));
  }

  function toggleInterest(interest: string) {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  }

  function addCustomInterest() {
    const trimmed = interestInput.trim();
    if (trimmed && !interests.some((i) => i.toLowerCase() === trimmed.toLowerCase())) {
      setInterests((prev) => [...prev, trimmed]);
    }
    setInterestInput("");
  }

  function removeInterest(interest: string) {
    setInterests((prev) => prev.filter((i) => i !== interest));
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!matricNumber.trim()) next.matricNumber = "Enter your matric number";
    if (!level) next.level = "Pick your current level";
    if (!department.trim()) next.department = "Enter your department";
    if (skills.length === 0) next.skills = "Pick or add at least one skill";
    if (!careerGoals.trim()) next.careerGoals = "Tell us where you want this to lead";
    if (interests.length === 0) next.interests = "Pick or add at least one interest";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const profile = {
      name: identity.name,
      email: identity.email,
      matricNumber: matricNumber.trim(),
      department: department.trim(),
      level,
      interests,
      skills,

      major: department.trim(),
      technicalSkills: skills,
      careerGoals: careerGoals.trim(),
      preferredDomain: interests[0] ?? "",
      complexityPreference: complexity,
    };

    setSubmitting(true);
    clearSession();
    localStorage.setItem("student", JSON.stringify(profile));
    router.push("/recommendations");
  }

  const customSkills = skills.filter((s) => !SKILL_PRESETS.includes(s));
  const customInterests = interests.filter((i) => !INTEREST_PRESETS.includes(i));

  return (
    <div className="min-h-screen bg-[#F8F8FB] px-5 py-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-8">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563EB]/10">
            <GraduationCap className="h-6 w-6 text-[#2563EB]" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Hi {identity.name.split(" ")[0]}, tell us about your skills
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            A few academic and interest details so we can match you with final-year project ideas worth building.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
             <div>
               <label className="mb-2 block text-sm font-medium text-gray-700">Matric number</label>
              <input
                type="text"
                value={matricNumber}
                onChange={(e) => setMatricNumber(e.target.value)}
                placeholder="e.g. 190805021"
                className="h-14 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              />
              {errors.matricNumber && <p className="mt-1 text-xs text-red-500">{errors.matricNumber}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Computer Science"
                className="h-14 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              />
              {errors.department && <p className="mt-1 text-xs text-red-500">{errors.department}</p>}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Level</label>
            <div className="grid grid-cols-5 gap-2">
              {LEVEL_OPTIONS.map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`h-11 rounded-xl border text-xs font-medium transition-colors ${
                    level === lvl
                      ? "border-[#2563EB] bg-[#2563EB] text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-[#2563EB]/40"
                  }`}
                >
                  {lvl.replace(" Level", "")}
                </button>
              ))}
            </div>
            {errors.level && <p className="mt-1 text-xs text-red-500">{errors.level}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Technical skills</label>
            <div className="mb-3 flex flex-wrap gap-2">
              {SKILL_PRESETS.map((skill) => (
                <button
                  type="button"
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    skills.includes(skill)
                      ? "border-[#2563EB] bg-[#2563EB] text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-[#2563EB]/40"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomSkill();
                  }
                }}
                placeholder="Add a skill not listed above"
                className="h-11 flex-1 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              />
              <button
                type="button"
                onClick={addCustomSkill}
                aria-label="Add skill"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-[#2563EB]/40"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {customSkills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {customSkills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700"
                  >
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {errors.skills && <p className="mt-1 text-xs text-red-500">{errors.skills}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Career goals</label>
            <textarea
              value={careerGoals}
              onChange={(e) => setCareerGoals(e.target.value)}
              placeholder="e.g. I want to work as a backend engineer at a fintech company"
              rows={3}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
            />
            {errors.careerGoals && <p className="mt-1 text-xs text-red-500">{errors.careerGoals}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Interests</label>
            <p className="mb-3 text-xs text-gray-500">Pick as many as apply — this is what drives your matches.</p>
            <div className="mb-3 flex flex-wrap gap-2">
              {INTEREST_PRESETS.map((interest) => (
                <button
                  type="button"
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    interests.includes(interest)
                      ? "border-[#2563EB] bg-[#2563EB] text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-[#2563EB]/40"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomInterest();
                  }
                }}
                placeholder="Add an interest not listed above"
                className="h-11 flex-1 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              />
              <button
                type="button"
                onClick={addCustomInterest}
                aria-label="Add interest"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-[#2563EB]/40"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {customInterests.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {customInterests.map((interest) => (
                  <span
                    key={interest}
                    className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700"
                  >
                    {interest}
                    <button type="button" onClick={() => removeInterest(interest)} aria-label={`Remove ${interest}`}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {errors.interests && <p className="mt-1 text-xs text-red-500">{errors.interests}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Preferred complexity</label>
            <div className="grid grid-cols-4 gap-2">
              {COMPLEXITY_OPTIONS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setComplexity(c)}
                  className={`h-11 rounded-xl border text-xs font-medium transition-colors ${
                    complexity === c
                      ? "border-[#2563EB] bg-[#2563EB] text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-[#2563EB]/40"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="h-14 w-full rounded-xl bg-[#2563EB] text-sm font-semibold text-white transition-colors hover:bg-[#1d4fd1] disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Get my recommendations"}
          </button>
        </form>
      </div>
    </div>
  );
}


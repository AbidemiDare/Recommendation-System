"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Plus, X } from "lucide-react";
import { clearSession } from "@/app/lib/session";

const SKILL_PRESETS = [
  "JavaScript", "TypeScript", "Python", "React", "Next.js", "Node.js",
  "Java", "SQL", "Machine Learning", "Flutter", "Firebase", "Django",
];

const DOMAIN_PRESETS = [
  "Web Development", "Mobile Apps", "Machine Learning", "Cybersecurity",
  "Data Science", "IoT", "Cloud Computing", "Blockchain",
];

const LEVEL_OPTIONS = ["100 Level", "200 Level", "300 Level", "400 Level", "500 Level"];

const COMPLEXITY_OPTIONS = ["Beginner", "Intermediate", "Advanced", "Any"] as const;

export default function OnboardingForm() {
  const router = useRouter();

  // Personal info — feeds the Profile page's "Personal information" section
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [matricNumber, setMatricNumber] = useState("");
  const [level, setLevel] = useState("");

  // Academic / recommendation-engine inputs — feeds /api/recommendations
  const [department, setDepartment] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [careerGoals, setCareerGoals] = useState("");
  const [domain, setDomain] = useState("");
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

  function validate() {
    const next: Record<string, string> = {};
    if (!fullName.trim()) next.fullName = "Enter your full name";
    if (!email.trim()) next.email = "Enter your email";
    if (!matricNumber.trim()) next.matricNumber = "Enter your matric number";
    if (!level) next.level = "Pick your current level";
    if (!department.trim()) next.department = "Enter your department";
    if (skills.length === 0) next.skills = "Pick or add at least one skill";
    if (!careerGoals.trim()) next.careerGoals = "Tell us where you want this to lead";
    if (!domain.trim()) next.domain = "Pick a preferred domain";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    // The profile page (app/(layout)/profile) and the recommendation route
    // (app/api/recommendations) grew independently and read different key
    // names off the same "student" object. Rather than rewrite either
    // consumer, this saves both sets of keys pointing at the same values —
    // e.g. `department` and `major` are the same string under two names.
    // Worth consolidating onto one shared type later once things settle.
    const profile = {
      // Personal info (profile page)
      name: fullName.trim(),
      email: email.trim(),
      matricNumber: matricNumber.trim(),
      department: department.trim(),
      level,
      interests: [domain],
      skills,

      // Recommendation-engine fields (route.ts / dashboard)
      major: department.trim(),
      technicalSkills: skills,
      careerGoals: careerGoals.trim(),
      preferredDomain: domain,
      complexityPreference: complexity,
    };

    setSubmitting(true);
    // Clear whatever the previous profile (if any) left behind — saved
    // projects and cached recommendations belong to that profile, not this
    // one, and would otherwise leak into a completely different student's
    // session. Cleared first, then the new profile is written immediately
    // after, so this never wipes the submission that's actually in progress.
    clearSession();
    localStorage.setItem("student", JSON.stringify(profile));
    router.push("/recommendations");
  }

  const customSkills = skills.filter((s) => !SKILL_PRESETS.includes(s));

  return (
    <div className="min-h-screen bg-[#F8F8FB] px-5 py-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-8">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563EB]/10">
            <GraduationCap className="h-6 w-6 text-[#2563EB]" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Tell us about you</h1>
          <p className="mt-1 text-sm text-gray-500">
            A few details so we can match you with final-year project ideas worth building.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Full name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Damilare Adebayo"
              className="h-14 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
            />
            {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. you@student.unilag.edu.ng"
              className="h-14 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

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
            <label className="mb-2 block text-sm font-medium text-gray-700">Preferred domain</label>
            <div className="flex flex-wrap gap-2">
              {DOMAIN_PRESETS.map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDomain(d)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    domain === d
                      ? "border-[#2563EB] bg-[#2563EB] text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-[#2563EB]/40"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            {errors.domain && <p className="mt-1 text-xs text-red-500">{errors.domain}</p>}
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


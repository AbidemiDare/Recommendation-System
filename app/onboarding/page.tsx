"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveStudentProfile } from "@/app/lib/auth";

const INTEREST_OPTIONS = [
  "Artificial Intelligence",
  "Machine Learning",
  "Web Development",
  "Mobile Development",
  "Cybersecurity",
  "Data Science",
  "Cloud Computing",
  "Blockchain",
  "Internet of Things",
  "Game Development",
  "UI/UX Design",
  "Computer Vision",
];

const SKILL_OPTIONS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Java",
  "SQL",
  "MongoDB",
  "Firebase",
  "Figma",
  "Git",
  "Flutter",
  "TensorFlow",
];

export default function Onboarding() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [matricNumber, setMatricNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("");
  const [interests, setInterests] = useState("");
  const [skills, setSkills] = useState("");
  const [customInterest, setCustomInterest] = useState("");

  const toggleTag = (
    value: string,
    current: string,
    setter: (v: string) => void
  ) => {
    const parts = current
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    const exists = parts.some((p) => p.toLowerCase() === value.toLowerCase());

    const next = exists
      ? parts.filter((p) => p.toLowerCase() !== value.toLowerCase())
      : [...parts, value];

    setter(next.join(", "));
  };

  const isTagSelected = (value: string, current: string) =>
    current
      .split(",")
      .map((p) => p.trim().toLowerCase())
      .includes(value.toLowerCase());

  // Anything the student typed that isn't one of the preset pills —
  // shown as its own removable chip row.
  const getCustomTags = (current: string, presets: string[]) =>
    current
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean)
      .filter(
        (p) => !presets.some((preset) => preset.toLowerCase() === p.toLowerCase())
      );

  const addCustomInterest = () => {
    const trimmed = customInterest.trim();
    if (!trimmed) return;
    if (!isTagSelected(trimmed, interests)) {
      toggleTag(trimmed, interests, setInterests);
    }
    setCustomInterest("");
  };

  const saveProfile = () => {
    const student = saveStudentProfile({
      id: "student-1",
      name,
      email,
      matricNumber,
      department,
      level,
      interests: interests
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean),
      skills: skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });

    if (student) {
      router.push("/recommendation");
    }
  };

  const inputClass =
    "h-14 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30";

  const pillClass = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-xs font-medium transition ${
      active
        ? "border-[#2563EB] bg-[#2563EB] text-white"
        : "border-slate-200 bg-white text-slate-700 hover:border-[#2563EB]/50"
    }`;

  const customInterestTags = getCustomTags(interests, INTEREST_OPTIONS);

  return (
    <main className="max-w-xl mx-auto px-6 py-12 space-y-5">
      <h1 className="text-3xl font-bold text-slate-900">Complete Your Profile</h1>

      <input
        placeholder="Full Name"
        className={inputClass}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          type="email"
          placeholder="Email"
          className={inputClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Matric Number"
          className={inputClass}
          value={matricNumber}
          onChange={(e) => setMatricNumber(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          placeholder="Department"
          className={inputClass}
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />

        <input
          placeholder="Level"
          className={inputClass}
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        />
      </div>

      <input
        placeholder="Interests (comma separated)"
        className={inputClass}
        value={interests}
        onChange={(e) => setInterests(e.target.value)}
      />

      <div className="flex flex-wrap gap-2">
        {INTEREST_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => toggleTag(option, interests, setInterests)}
            className={pillClass(isTagSelected(option, interests))}
          >
            {option}
          </button>
        ))}
      </div>

      {customInterestTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {customInterestTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag, interests, setInterests)}
              className={pillClass(true)}
              title="Click to remove"
            >
              {tag} ✕
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          placeholder="Don't see your interest? Type it here"
          className={`${inputClass} h-11 text-xs`}
          value={customInterest}
          onChange={(e) => setCustomInterest(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustomInterest();
            }
          }}
        />
        <button
          type="button"
          onClick={addCustomInterest}
          className="rounded-xl border border-[#2563EB] px-4 text-sm font-semibold text-[#2563EB] transition hover:bg-[#2563EB]/5"
        >
          Add
        </button>
      </div>

      <input
        placeholder="Skills (comma separated)"
        className={inputClass}
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      />

      <div className="flex flex-wrap gap-2">
        {SKILL_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => toggleTag(option, skills, setSkills)}
            className={pillClass(isTagSelected(option, skills))}
          >
            {option}
          </button>
        ))}
      </div>

      <button
        onClick={saveProfile}
        className="h-14 w-full rounded-xl bg-[#2563EB] px-6 text-sm font-semibold text-white transition hover:bg-[#1d4fd1] active:scale-95 sm:w-auto sm:px-6 sm:py-3"
      >
        Submit
         </button>
    </main>
  );
}


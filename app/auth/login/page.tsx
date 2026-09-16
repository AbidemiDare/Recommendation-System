"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, User } from "lucide-react";
import BackgroundCircles from "../../Components/BackgroundCircles";
import { readStudentProfile, saveStudentProfile } from "@/app/lib/auth";

export default function Login() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedName) {
    setError("Please enter your full name.");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    setError("Please enter a valid email address.");
    return;
  }

  setIsSubmitting(true);

  const existing = readStudentProfile();
  const isReturningStudent =
    existing?.email?.trim().toLowerCase() === trimmedEmail;

  if (isReturningStudent) {
    saveStudentProfile({
      ...existing,
      name: trimmedName,
      email: trimmedEmail,
    });
    router.push("/dashboard");
    return;
  }

  setIsSubmitting(false);
  setError("Account not found. Please sign up to get started.");
};  

  //   const existing = readStudentProfile();
  //   const isReturningStudent =
  //     existing?.email?.trim().toLowerCase() === trimmedEmail;

  //   if (isReturningStudent) {
  //     // Same student, same browser — keep their saved interests, skills,
  //     // department, etc. and just refresh the name in case it changed.
  //     saveStudentProfile({
  //       ...existing,
  //       name: trimmedName,
  //       email: trimmedEmail,
  //     });
  //     router.push("/dashboard");
  //     return;
  //   }

  //   // New identity on this browser — start a fresh profile. Department,
  //   // level, interests and skills get filled in during onboarding.
  //   saveStudentProfile({
  //     id: existing?.id ?? "student-1",
  //     name: trimmedName,
  //     email: trimmedEmail,
  //     matricNumber: "",
  //     department: "",
  //     level: "",
  //     interests: [],
  //     skills: [],
  //   });
  //   router.push("/onboarding");
  // };

  {error && (
  <p className="text-sm text-red-600">
    {error}
    {error.startsWith("Account not found") && (
      <>
        {" "}
        <Link href="/signup" className="font-semibold underline">
          Sign up
        </Link>
      </>
    )}
  </p>
)}

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F8F8F8] px-6 py-10 font-sans">
      <BackgroundCircles />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
            <Image src="/robot.png" width={56} height={56} alt="Robot" className="object-contain" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
          <h1 className="text-center text-2xl font-bold text-[#1E293B]">Welcome back</h1>
          <p className="mt-2 text-center text-sm text-[#64748B]">
            Log in with your name and email to pick up where you left off.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">Full name</label>
              <div className="flex h-14 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 transition focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/30">
                <User size={16} className="shrink-0 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Damilare Adebayo"
                  className="w-full text-sm text-slate-900 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">Email</label>
              <div className="flex h-14 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 transition focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/30">
                <Mail size={16} className="shrink-0 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@student.unilag.edu.ng"
                  className="w-full text-sm text-slate-900 outline-none"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-14 w-full cursor-pointer rounded-2xl bg-[#2563EB] text-base font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {isSubmitting ? "Logging in..." : "Continue"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-[#64748B] sm:text-base">
          New here?{" "}
          <Link href="/signup" className="font-semibold text-[#2563EB] hover:underline">
            Get started
          </Link>
        </p>
      </div>
    </section>
  );
}
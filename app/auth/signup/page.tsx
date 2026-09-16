"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, User } from "lucide-react";
import { readStudentProfile, saveStudentProfile } from "@/app/lib/auth";
import BackgroundCircles from "@/app/Components/BackgroundCircles";

export default function Signup() {
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
    const alreadyHasAccount =
      existing?.email?.trim().toLowerCase() === trimmedEmail;

    if (alreadyHasAccount) {
      // Don't overwrite their existing profile/interests — send them to
      // log in instead of silently resetting onboarding progress.
      setIsSubmitting(false);
      setError("An account with this email already exists.");
      return;
    }

    // Base identity only — department, level, interests and skills get
    // filled in on the onboarding form that follows.
    saveStudentProfile({
      id: existing?.id ?? "student-1",
      name: trimmedName,
      email: trimmedEmail,
      matricNumber: "",
      department: "",
      level: "",
      interests: [],
      skills: [],
    });

    router.push("/onboarding");
  };

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
          <h1 className="text-center text-2xl font-bold text-[#1E293B]">Create your account</h1>
          <p className="mt-2 text-center text-sm text-[#64748B]">
            Enter your name and email to get started. You&apos;ll set up your
            profile next.
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

            {error && (
              <p className="text-sm text-red-600">
                {error}
                {error.startsWith("An account") && (
                  <>
                    {" "}
                    <Link href="/auth/login" className="font-semibold underline">
                      Log in instead
                    </Link>
                  </>
                )}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-14 w-full cursor-pointer rounded-2xl bg-[#2563EB] text-base font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {isSubmitting ? "Creating account..." : "Continue"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-[#64748B] sm:text-base">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#2563EB] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
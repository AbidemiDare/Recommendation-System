"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { FaMicrosoft } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { getDemoStudent, loginDemoStudent } from "@/app/lib/auth";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const nextProfile = loginDemoStudent({
        id: "demo-student",
        name: email.split("@")[0] || "Demo Student",
        email,
        matricNumber: "STU-0000",
        department: "Computer Science",
        level: "400 Level",
        interests: ["AI", "Web Development"],
        skills: ["JavaScript", "React", "Python"],
      });

      if (nextProfile) {
        router.push("/dashboard");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="h-screen overflow-hidden bg-[#f8f8f8] px-6 flex items-center justify-center text-black">
      <div className="w-full max-w-sm space-y-4">

        <Link
          href="/"
          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white border border-gray-200"
        >
          <ChevronLeft size={18} />
        </Link>

        <div className="mt-2 mb-4">
          <h1 className="text-2xl font-bold text-[#1A1A1A]">
            Welcome back! 👋
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Sign in to continue
          </p>
        </div>

        {error && (
          <div className="px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-sm font-medium text-[#374151]">
              Email Address
            </label>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-[#374151]">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <div className="mt-1 text-right">
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-[#2563EB]"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-[#2563EB] text-white font-semibold transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="flex items-center gap-4 my-4">
          <div className="h-px flex-1 bg-gray-300" />
          <span className="text-xs text-gray-500 whitespace-nowrap">
            or continue with
          </span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>

        <div className="space-y-2">
          <button className="w-full h-12 rounded-xl flex items-center justify-center gap-2 border border-gray-300 bg-white font-medium hover:bg-gray-50 transition">
            <FcGoogle size={20} />
            Continue with Google
          </button>

          <button className="w-full h-12 rounded-xl flex items-center justify-center gap-2 border border-gray-300 bg-white font-medium hover:bg-gray-50 transition">
            <FaMicrosoft />
            Continue with Microsoft
          </button>
        </div>

        <p className="text-center text-xs text-[#6B7280]">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="font-semibold text-[#2563EB]">
            Sign Up
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;




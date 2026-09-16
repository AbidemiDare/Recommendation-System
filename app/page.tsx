"use client";

import BackgroundCircles from "./Components/BackgroundCircles";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F8F8F8] px-6 py-10 font-sans">

      {/* Background Decorations */}
      <BackgroundCircles />

      <div className="relative z-10 w-full max-w-md text-center">

        {/* Robot Icon */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg">

            <Image
              src="/robot.png"
              width={70}
              height={70}
              alt="Robot"
              className="object-contain"
            />

          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold leading-tight text-[#1E293B] sm:text-4xl">
          AI-Based Student Project Recommendation System
        </h1>

        {/* Description */}
        <p className="mt-5 text-base leading-7 text-[#64748B] sm:text-lg">
          Discover smart project ideas tailored to your skills,
          interests, and academic goals.
        </p>

        {/* Button */}
        <div className="mt-10">
          <Link href="/auth/signup">
            <button className="h-14 w-full cursor-pointer rounded-2xl bg-[#2563EB] text-base font-semibold text-white transition hover:bg-blue-700">
              Get Started
            </button>
          </Link>
        </div>
      
        <p className="mt-6 text-sm text-[#64748B] sm:text-base">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-[#2563EB] hover:underline"
          >
            Login
          </Link>
        </p>

      </div>

    </section>
  );
}


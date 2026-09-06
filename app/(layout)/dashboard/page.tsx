"use client";

import Link from "next/link";
import { BellCheck, Bookmark, Stethoscope } from "lucide-react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { readStudentProfile } from "@/app/lib/auth";

export default function DashboardPage() {
  const student = readStudentProfile();
``
  const stats = [
    {
      id: 1,
      label: "Recommended Projects",
      value: 12,
      icon: <FcGoogle size={24} />,
      bg: "bg-blue-50",
    },
    {
      id: 2,
      label: "Saved Ideas",
      value: 5,
      icon: <Bookmark size={20} className="text-purple-600" />,
      bg: "bg-purple-50",
    },
    {
      id: 3,
      label: "Feedback Submitted",
      value: 3,
      icon: <Bookmark size={20} className="text-indigo-600" />,
      bg: "bg-indigo-50",
    },
    {
      id: 4,
      label: "New Announcements",
      value: 2,
      icon: <BellCheck size={20} className="text-emerald-600" />,
      bg: "bg-emerald-50",
    },
  ];

  const topMatches = [
    {
      id: 1,
      title: "AI-Powered Health Assistant Chatbot",
      tags: ["AI", "Healthcare", "NLP"],
      matchPercentage: "95%",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      id: 2,
      title: "Smart Medical Diagnosis System",
      tags: ["AI", "Healthcare", "ML"],
      matchPercentage: "91%",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-8 ml-64 p-8">
      <section>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1D4ED8] via-[#2563EB] to-[#38BDF8] px-6 py-8 text-white sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-16 left-10 h-40 w-40 rounded-full bg-cyan-300/20 blur-2xl" />

          <div className="relative flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-100 sm:text-sm">
                AI Recommendations
              </p>

              <h2 className="mt-2 text-3xl font-bold leading-tight lg:text-5xl">
                Discover Your Next Project
              </h2>

              <p className="mt-4 text-sm leading-6 text-blue-100 sm:text-base">
                {student?.name
                  ? `Welcome back, ${student.name.split(" ")[0]}. Get personalized project recommendations based on your skills, interests, and academic strengths.`
                  : "Get personalized project recommendations based on your skills, interests, and academic strengths."}
              </p>

              <Link
                href="/recommendation"
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50 sm:w-fit"
              >
                View Recommendations
              </Link>
            </div>

            <div className="hidden lg:block">
              <Image src="/robot.png" alt="AI Robot" width={280} height={280} className="object-contain" />
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">At a Glance</h3>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.id} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
                {stat.icon}
              </div>

              <div>
                <h4 className="text-xl font-bold text-gray-900">{stat.value}</h4>
                <p className="text-xs font-medium text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Top Matches</h3>
          <Link href="/recommendation" className="text-sm font-medium text-blue-600 hover:underline">
            View All
          </Link>
        </div>

        <div className="space-y-4">
          {topMatches.map((project) => (
            <div key={project.id} className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${project.iconBg} ${project.iconColor}`}>
                <Stethoscope size={22} />
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-gray-900 sm:text-base">{project.title}</h4>

                <div className="mt-2 flex flex-wrap gap-2">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={`${project.id}-${tag}-${idx}`}
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        tag === "AI"
                          ? "bg-blue-50 text-blue-600"
                          : tag === "Healthcare"
                            ? "bg-green-50 text-green-600"
                            : "bg-purple-50 text-purple-600"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <span className="shrink-0 rounded-lg bg-green-50 px-2 py-1 text-sm font-bold text-green-600">
                {project.matchPercentage}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}



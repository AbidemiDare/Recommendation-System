"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BellCheck, Bookmark, Lightbulb, MessageSquare, Sparkles } from "lucide-react";
import { readStudentProfile } from "@/app/lib/auth";
import type { StudentProfile } from "@/app/lib/auth";
import { SAVED_KEY, RECOMMENDATIONS_CACHE_KEY } from "@/app/lib/session";

interface DashboardProject {
  id: string;
  title: string;
  matchScore: number;
  domainTags?: string[];
}

interface CachedRecommendations {
  profileSnapshot: string;
  recommendations: DashboardProject[];
}

// Gemini-generated domainTags are arbitrary strings, not a fixed set — a
// hash-based palette pick works for any tag, unlike hardcoding colors for
// two literal strings ("AI", "Healthcare") and letting everything else
// fall through to the same default.
const TAG_COLORS = [
  "bg-blue-50 text-blue-600",
  "bg-green-50 text-green-600",
  "bg-purple-50 text-purple-600",
  "bg-amber-50 text-amber-600",
  "bg-rose-50 text-rose-600",
];

function tagColor(tag: string) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash = (hash + tag.charCodeAt(i)) % TAG_COLORS.length;
  return TAG_COLORS[hash];
}

export default function DashboardPage() {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [savedCount, setSavedCount] = useState(0);
  const [recommendationsCount, setRecommendationsCount] = useState(0);
  const [topMatches, setTopMatches] = useState<DashboardProject[]>([]);

  // Deferred to useEffect deliberately — reading localStorage during render
  // causes a server/client hydration mismatch (see note above).
  useEffect(() => {
    setStudent(readStudentProfile());

    const savedRaw = localStorage.getItem(SAVED_KEY);
    if (savedRaw) {
      try {
        // toggleSave in recommendation-dashboard.tsx now stores full project
        // objects (not just IDs), so they survive independently of the
        // sessionStorage-backed recommendations cache — only .length is
        // needed here, but the type should reflect what's actually stored.
        setSavedCount((JSON.parse(savedRaw) as DashboardProject[]).length);
      } catch {
        setSavedCount(0);
      }
    }

    // sessionStorage, matching where recommendation-dashboard.tsx now writes
    // this cache — must stay in sync, or this page reads an empty bucket.
    const cacheRaw = sessionStorage.getItem(RECOMMENDATIONS_CACHE_KEY);
    if (cacheRaw) {
      try {
        const cache: CachedRecommendations = JSON.parse(cacheRaw);
        setRecommendationsCount(cache.recommendations.length);
        setTopMatches(
          [...cache.recommendations].sort((a, b) => b.matchScore - a.matchScore).slice(0, 2)
        );
      } catch {
        setRecommendationsCount(0);
      }
    }
  }, []);

  const stats: { id: number; label: string; value: number | string; icon: React.ReactNode; bg: string }[] = [
    {
      id: 1,
      label: "Recommended Projects",
      value: recommendationsCount,
      icon: <Sparkles size={20} className="text-blue-600" />,
      bg: "bg-blue-50",
    },
    {
      id: 2,
      label: "Saved Ideas",
      value: savedCount,
      icon: <Bookmark size={20} className="text-purple-600" />,
      bg: "bg-purple-50",
    },
    {
      id: 3,
      label: "Feedback Submitted",
      // No feedback feature exists anywhere in this app yet — showing a
      // real number here would be fabricated data, not a bug fix.
      value: "—",
      icon: <MessageSquare size={20} className="text-indigo-600" />,
      bg: "bg-indigo-50",
    },
    {
      id: 4,
      label: "New Announcements",
      // Same as above — no announcements feature exists to source this from.
      value: "—",
      icon: <BellCheck size={20} className="text-emerald-600" />,
      bg: "bg-emerald-50",
    },
  ];

  return (
    // NOTE: `lg:pl-72` matches the value used in your real profile/page.tsx.
    // The original `ml-64` here was a different value for presumably the
    // same sidebar — worth confirming against your actual sidebar/layout
    // component's real width rather than trusting either hardcoded number.
    <div className="space-y-8 lg:pl-72 p-8">
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
                href="/recommendations"
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
          <Link href="/recommendations" className="text-sm font-medium text-blue-600 hover:underline">
            View All
          </Link>
        </div>

        {topMatches.length > 0 ? (
          <div className="space-y-4">
            {topMatches.map((project) => (
              <Link
                key={project.id}
                href="/recommendations"
                className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md hover:border-[#2563EB]/30"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Lightbulb size={22} />
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 sm:text-base">{project.title}</h4>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {(project.domainTags ?? []).map((tag) => (
                      <span key={tag} className={`rounded-full px-2 py-1 text-xs font-medium ${tagColor(tag)}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <span className="shrink-0 rounded-lg bg-green-50 px-2 py-1 text-sm font-bold text-green-600">
                  {project.matchScore}%
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center">
            <p className="text-sm text-gray-500">
              No recommendations yet — generate your first set to see your top matches here.
            </p>
            <Link
              href="/recommendations"
              className="mt-3 inline-flex items-center justify-center rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1d4fd1]"
            >
              Get recommendations
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}


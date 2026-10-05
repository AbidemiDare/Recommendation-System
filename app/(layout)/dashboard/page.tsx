"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BellCheck, Bookmark, Lightbulb, MessageSquare, Sparkles } from "lucide-react";
import { createClient } from "@/app/lib/supabase/client";
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
  const [firstName, setFirstName] = useState<string | null>(null);
  const [savedCount, setSavedCount] = useState(0);
  const [recommendationsCount, setRecommendationsCount] = useState(0);
  const [topMatches, setTopMatches] = useState<DashboardProject[]>([]);

  useEffect(() => {
    let cancelled = false;

    // Counts come from the same browser storage the Recommendations page writes to
    const savedRaw = localStorage.getItem(SAVED_KEY);
    if (savedRaw) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSavedCount((JSON.parse(savedRaw) as DashboardProject[]).length);
      } catch {
        setSavedCount(0);
      }
    }

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

    // Name comes from Supabase, so it also works right after a Google login
    async function loadName() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      const full = data?.full_name || user.user_metadata?.full_name || user.user_metadata?.name;
      if (!cancelled && full?.trim()) setFirstName(full.trim().split(" ")[0]);
    }
    loadName();

    return () => {
      cancelled = true;
    };
  }, []);

  const stats: { id: number; label: string; value: number | string; icon: React.ReactNode; bg: string }[] = [
    { id: 1, label: "Recommended Projects", value: recommendationsCount, icon: <Sparkles size={20} className="text-blue-600" />, bg: "bg-blue-50" },
    { id: 2, label: "Saved Ideas", value: savedCount, icon: <Bookmark size={20} className="text-purple-600" />, bg: "bg-purple-50" },
    { id: 3, label: "Feedback Submitted", value: "—", icon: <MessageSquare size={20} className="text-indigo-600" />, bg: "bg-indigo-50" },
    { id: 4, label: "New Announcements", value: "—", icon: <BellCheck size={20} className="text-emerald-600" />, bg: "bg-emerald-50" },
  ];

  return (
    <div className="space-y-8 lg:p-8 lg:pl-72">
      <section>
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#1D4ED8] via-[#2563EB] to-[#38BDF8] px-6 py-8 text-white sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-16 left-10 h-40 w-40 rounded-full bg-cyan-300/20 blur-2xl" />

          <div className="relative flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-100 sm:text-sm">
                AI Recommendations
              </p>
              <h1 className="mt-2 text-3xl font-bold leading-tight lg:text-5xl">
                Discover Your Next Project
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                {firstName
                  ? `Welcome back, ${firstName}. Get personalized project recommendations based on your skills, interests, and academic strengths.`
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
              <Image src="/robot.png" alt="AI robot illustration" width={280} height={280} priority className="object-contain" />
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">At a Glance</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.id} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>{stat.icon}</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-xs font-medium text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Top Matches</h2>
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
                className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-[#2563EB]/30 hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Lightbulb size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 sm:text-base">{project.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(project.domainTags ?? []).map((tag) => (
                      <span key={`${project.id}-${tag}`} className={`rounded-full px-2 py-1 text-xs font-medium ${tagColor(tag)}`}>
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
              className="mt-3 inline-flex items-center justify-center rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1d4fd1]"
            >
              Get recommendations
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

// 'use client';

// import Link from "next/link";
// import Image from "next/image";
// import { redirect } from "next/navigation";
// import {
//   BellCheck,
//   Bookmark,
//   Lightbulb,
//   MessageSquare,
//   Sparkles,
// } from "lucide-react";
// import { createClient } from "@/app/lib/supabase/server"
// interface Profile {
//   id: string;
//   full_name: string | null;
//   institution: string | null;
//   programme: string | null;
//   academic_level: string | null;
//   skills: string[] | null;
//   interests: string[] | null;
//   preferred_domains: string[] | null;
//   consent_to_ai_processing: boolean;
// }

// interface Project {
//   id: string;
//   title: string;
//   domain: string | null;
//   required_skills: string[] | null;
// }

// interface RecommendationRow {
//   id: string;
//   project_id: string;
//   recommendation_score: number | null;
//   created_at: string;
//   projects: Project | null;
// }

// interface DashboardProject {
//   id: string;
//   title: string;
//   matchScore: number;
//   domainTags: string[];
// }

// const TAG_COLORS = [
//   "bg-blue-50 text-blue-600",
//   "bg-green-50 text-green-600",
//   "bg-purple-50 text-purple-600",
//   "bg-amber-50 text-amber-600",
//   "bg-rose-50 text-rose-600",
// ];

// function tagColor(tag: string) {
//   let hash = 0;

//   for (let index = 0; index < tag.length; index += 1) {
//     hash = (hash + tag.charCodeAt(index)) % TAG_COLORS.length;
//   }

//   return TAG_COLORS[hash];
// }

// function getFirstName(fullName: string | null) {
//   if (!fullName?.trim()) return null;

//   return fullName.trim().split(" ")[0];
// }

// export default async function DashboardPage() {
//   const supabase = await createClient();

//   const {
//     data: { claims },
//   } = await supabase.auth.getClaims();

//   if (!claims?.sub) {
//     redirect("/auth/sign-in");
//   }

//   const userId = claims.sub;

//   const [
//     profileResult,
//     savedProjectsResult,
//     recommendationsCountResult,
//     recommendationHistoryResult,
//   ] = await Promise.all([
//     supabase
//       .from("profiles")
//       .select(
//         `
//           id,
//           full_name,
//           institution,
//           programme,
//           academic_level,
//           skills,
//           interests,
//           preferred_domains,
//           consent_to_ai_processing
//         `
//       )
//       .eq("id", userId)
//       .single(),

//     supabase
//       .from("saved_projects")
//       .select("*", { count: "exact", head: true })
//       .eq("student_id", userId),

//     supabase
//       .from("recommendation_history")
//       .select("*", { count: "exact", head: true })
//       .eq("student_id", userId),

//     supabase
//       .from("recommendation_history")
//       .select(
//         `
//           id,
//           project_id,
//           recommendation_score,
//           created_at,
//           projects (
//             id,
//             title,
//             domain,
//             required_skills
//           )
//         `
//       )
//       .eq("student_id", userId)
//       .order("recommendation_score", { ascending: false })
//       .order("created_at", { ascending: false })
//       .limit(10),
//   ]);

//   const profile = profileResult.data as Profile | null;

//   const savedCount = savedProjectsResult.count ?? 0;
//   const recommendationsCount = recommendationsCountResult.count ?? 0;

//   const recommendationRows =
//     (recommendationHistoryResult.data as RecommendationRow[] | null) ?? [];

//   /*
//    * The history table may contain multiple recommendation records
//    * for the same project because students can generate recommendations
//    * more than once. This keeps only the highest-scored/latest record
//    * for each project before showing the top two on the dashboard.
//    */
//   const uniqueProjects = new Map<string, DashboardProject>();

//   for (const recommendation of recommendationRows) {
//     const project = recommendation.projects;

//     if (!project || uniqueProjects.has(project.id)) {
//       continue;
//     }

//     const domainTags = [
//       ...(project.domain ? [project.domain] : []),
//       ...(project.required_skills ?? []).slice(0, 2),
//     ];

//     uniqueProjects.set(project.id, {
//       id: project.id,
//       title: project.title,
//       matchScore: Math.round(Number(recommendation.recommendation_score ?? 0)),
//       domainTags,
//     });
//   }

//   const topMatches = Array.from(uniqueProjects.values())
//     .sort((first, second) => second.matchScore - first.matchScore)
//     .slice(0, 2);

//   const firstName = getFirstName(profile?.full_name ?? null);

//   const stats = [
//     {
//       id: 1,
//       label: "Recommended Projects",
//       value: recommendationsCount,
//       icon: <Sparkles size={20} className="text-blue-600" />,
//       bg: "bg-blue-50",
//     },
//     {
//       id: 2,
//       label: "Saved Ideas",
//       value: savedCount,
//       icon: <Bookmark size={20} className="text-purple-600" />,
//       bg: "bg-purple-50",
//     },
//     {
//       id: 3,
//       label: "Feedback Submitted",
//       value: "—",
//       icon: <MessageSquare size={20} className="text-indigo-600" />,
//       bg: "bg-indigo-50",
//     },
//     {
//       id: 4,
//       label: "New Announcements",
//       value: "—",
//       icon: <BellCheck size={20} className="text-emerald-600" />,
//       bg: "bg-emerald-50",
//     },
//   ];

//   return (
//     <div className="space-y-8 lg:p-8 lg:pl-72">
//       <section>
//         <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#1D4ED8] via-[#2563EB] to-[#38BDF8] px-6 py-8 text-white sm:px-8 sm:py-10 lg:px-12 lg:py-12">
//           <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
//           <div className="absolute -bottom-16 left-10 h-40 w-40 rounded-full bg-cyan-300/20 blur-2xl" />

//           <div className="relative flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
//             <div>
//               <p className="text-xs font-semibold uppercase tracking-widest text-blue-100 sm:text-sm">
//                 AI Recommendations
//               </p>

//               <h1 className="mt-2 text-3xl font-bold leading-tight lg:text-5xl">
//                 Discover Your Next Project
//               </h1>

//               <p className="mt-4 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
//                 {firstName
//                   ? `Welcome back, ${firstName}. Get personalized project recommendations based on your skills, interests, and academic strengths.`
//                   : "Complete your profile and get personalized project recommendations based on your skills, interests, and academic strengths."}
//               </p>

//               <div className="mt-6 flex flex-col gap-3 sm:flex-row">
//                 <Link
//                   href="/recommendations"
//                   className="inline-flex w-full items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50 sm:w-fit"
//                 >
//                   View Recommendations
//                 </Link>

//                 {!profile?.consent_to_ai_processing && (
//                   <Link
//                     href="/profile"
//                     className="inline-flex w-full items-center justify-center rounded-xl border border-white/40 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20 sm:w-fit"
//                   >
//                     Complete your profile
//                   </Link>
//                 )}
//               </div>
//             </div>

//             <div className="hidden lg:block">
//               <Image
//                 src="/robot.png"
//                 alt="AI robot illustration"
//                 width={280}
//                 height={280}
//                 priority
//                 className="object-contain"
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       <section>
//         <h2 className="mb-4 text-lg font-semibold text-gray-900">
//           At a Glance
//         </h2>

//         <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
//           {stats.map((stat) => (
//             <div
//               key={stat.id}
//               className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
//             >
//               <div
//                 className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}
//               >
//                 {stat.icon}
//               </div>

//               <div>
//                 <h3 className="text-xl font-bold text-gray-900">
//                   {stat.value}
//                 </h3>
//                 <p className="text-xs font-medium text-gray-500">
//                   {stat.label}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       <section>
//         <div className="mb-4 flex items-center justify-between">
//           <h2 className="text-lg font-semibold text-gray-900">Top Matches</h2>

//           <Link
//             href="/recommendations"
//             className="text-sm font-medium text-blue-600 hover:underline"
//           >
//             View All
//           </Link>
//         </div>

//         {topMatches.length > 0 ? (
//           <div className="space-y-4">
//             {topMatches.map((project) => (
//               <Link
//                 key={project.id}
//                 href={`/recommendations?project=${project.id}`}
//                 className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-[#2563EB]/30 hover:shadow-md"
//               >
//                 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
//                   <Lightbulb size={22} />
//                 </div>

//                 <div className="min-w-0 flex-1">
//                   <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
//                     {project.title}
//                   </h3>

//                   {project.domainTags.length > 0 && (
//                     <div className="mt-2 flex flex-wrap gap-2">
//                       {project.domainTags.map((tag) => (
//                         <span
//                           key={`${project.id}-${tag}`}
//                           className={`rounded-full px-2 py-1 text-xs font-medium ${tagColor(tag)}`}
//                         >
//                           {tag}
//                         </span>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 <span className="shrink-0 rounded-lg bg-green-50 px-2 py-1 text-sm font-bold text-green-600">
//                   {project.matchScore}%
//                 </span>
//               </Link>
//             ))}
//           </div>
//         ) : (
//           <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center">
//             <p className="text-sm text-gray-500">
//               No recommendations yet — generate your first set to see your top
//               matches here.
//             </p>

//             <Link
//               href="/recommendations"
//               className="mt-3 inline-flex items-center justify-center rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1d4fd1]"
//             >
//               Get recommendations
//             </Link>
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }


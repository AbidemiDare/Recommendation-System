// app/recommendation/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { readStudentProfile } from "@/app/lib/auth";
import { RecommendedProject } from "@/app/types/recommendation";

export default function RecommendationPage() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<RecommendedProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<RecommendedProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availabilityMessage, setAvailabilityMessage] = useState<string | null>(null);

  useEffect(() => {
    const studentData = readStudentProfile();

    if (!studentData) {
      router.push("/onboarding");
      return;
    }

    // 2. Fetch recommendations automatically using the saved profile
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(studentData),
        });

        if (!res.ok) {
          throw new Error("Failed to fetch recommendations");
        }

        const data = await res.json();
        setRecommendations(data.recommendations || []);
        setAvailabilityMessage(data.message || null);
      } catch (err) {
        console.error("Error generating recommendations:", err);
        setError("Could not generate recommendations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [router]);

  return (
    <main className="max-w-4xl ml-64 p-8 mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Recommended Projects</h1>
          <p className="text-slate-600 text-sm mt-1">
            Tailored based on your skills and academic interests.
          </p>
        </div>
        <button
          onClick={() => router.push("/onboarding")}
          className="text-xs font-semibold text-[#2563EB] hover:underline"
        >
          Edit Profile
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2563EB] border-t-transparent"></div>
          <p className="text-slate-600 text-sm font-medium">
            Analyzing your profile and matching optimal projects...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Recommendations Grid */}
      {!loading && !error && (
        <>
          {availabilityMessage && (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              {availabilityMessage}
            </div>
          )}

          {recommendations.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
              No suitable projects were found for this profile.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="p-5 border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-[#2563EB]/40 transition cursor-pointer bg-white flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs px-2.5 py-1 bg-blue-50 text-[#2563EB] rounded-full font-semibold border border-blue-100">
                    {project.matchScore}% Match
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{project.difficulty}</span>
                </div>

                <h3 className="font-bold text-lg text-slate-900">{project.title}</h3>
                <p className="text-slate-600 text-sm mt-2 line-clamp-2">{project.description}</p>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-4">
                {project.techStack?.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl max-w-lg w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold text-slate-900">{selectedProject.title}</h2>
              <span className="text-xs px-2.5 py-1 bg-blue-50 text-[#2563EB] rounded-full font-semibold">
                {selectedProject.matchScore}% Match
              </span>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">{selectedProject.description}</p>

            {selectedProject.whyThisMatches && (
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
                <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-900 mb-1">
                  Why this matches
                </h4>
                <p className="text-sm text-slate-700">{selectedProject.whyThisMatches}</p>
              </div>
            )}

            {selectedProject.keyFeatures && selectedProject.keyFeatures.length > 0 && (
              <div>
                <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-900 mb-2">
                  Key Features:
                </h4>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                  {selectedProject.keyFeatures.map((feat, i) => (
                    <li key={i}>{feat}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => setSelectedProject(null)}
              className="mt-4 w-full bg-[#2563EB] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#1d4fd1] transition"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </main>
  );
}



// // app/recommendation/page.tsx
// "use client";

// import { useState } from "react";
// import { RecommendedProject } from "@/app/types/recommendation";

// export default function RecommendationPage() {
//   const [recommendations, setRecommendations] = useState<RecommendedProject[]>([]);
//   const [selectedProject, setSelectedProject] = useState<RecommendedProject | null>(null);
//   const [loading, setLoading] = useState(false);

//   // Submit handler for Onboarding Form
//   const handleOnboardingSubmit = async (formData: Record<string, unknown>) => {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/recommendations", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();
//       setRecommendations(data.recommendations || []);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       {loading && <p className="text-blue-600">Generating personalized recommendations...</p>}

//       {/* Recommendations Cards Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
//         {recommendations.map((project) => (
//           <div
//             key={project.id}
//             onClick={() => setSelectedProject(project)}
//             className="p-5 border rounded-xl shadow-sm hover:shadow-md transition cursor-pointer bg-white"
//           >
//             <div className="flex justify-between items-center mb-2">
//               <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
//                 {project.matchScore}% Match
//               </span>
//               <span className="text-xs text-gray-500">{project.difficulty}</span>
//             </div>

//             <h3 className="font-bold text-lg text-gray-900">{project.title}</h3>
//             <p className="text-gray-600 text-sm mt-1 line-clamp-2">{project.description}</p>

//             <div className="flex flex-wrap gap-1 mt-3">
//               {project.techStack.map((tech) => (
//                 <span key={tech} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
//                   {tech}
//                 </span>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Selected Project Detail Modal */}
//       {selectedProject && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
//           <div className="bg-white p-6 rounded-xl max-w-lg w-full space-y-4">
//             <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
//             <p className="text-gray-700">{selectedProject.description}</p>

//             <div>
//               <h4 className="font-semibold text-sm text-gray-900 mb-1">Key Features:</h4>
//               <ul className="list-disc list-inside text-sm text-gray-600">
//                 {selectedProject.keyFeatures?.map((feat, i) => (
//                   <li key={i}>{feat}</li>
//                 ))}
//               </ul>
//             </div>

//             <button
//               onClick={() => setSelectedProject(null)}
//               className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// "use client";

// import { useState } from "react";

// // Define the shape of a recommendation item
// interface RecommendationItem {
//   id: string;
//   title: string;
//   description: string;
//   matchScore: number;
//   suggestedTechStack: string[];
//   reasoning: string;
// }

// export default function RecommendationPage() {
//   const [loading, setLoading] = useState<boolean>(false);
//   // Type the state array explicitly instead of defaulting to any[]
//   const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);

//   const fetchRecommendations = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/recommendations", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           studentSkills: ["React", "TypeScript", "Python"],
//           studentInterests: ["Web Development", "Artificial Intelligence"],
//           careerGoal: "Full-Stack AI Engineer",
//         }),
//       });

//       const data: { recommendations: RecommendationItem[] } = await res.json();
//       setRecommendations(data.recommendations);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6">
//       <button
//         onClick={fetchRecommendations}
//         disabled={loading}
//         className="px-4 py-2 bg-blue-600 text-white rounded-md"
//       >
//         {loading ? "Generating..." : "Get Dynamic Recommendations"}
//       </button>

//       <div className="mt-6 space-y-4">
//         {/* 'item' is now inferred automatically as RecommendationItem */}
//         {recommendations.map((item) => (
//           <div key={item.id} className="p-4 border rounded-lg shadow-sm">
//             <h3 className="font-bold text-lg">{item.title} ({item.matchScore}% Match)</h3>
//             <p className="text-gray-600 mt-1">{item.description}</p>
//             <p className="text-sm text-blue-500 mt-2">
//               <strong>Reasoning:</strong> {item.reasoning}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


// // "use client";

// // import { useState } from "react";

// // export default function RecommendationPage() {
// //   const [loading, setLoading] = useState(false);
// //   const [recommendations, setRecommendations] = useState([]);

// //   const fetchRecommendations = async () => {
// //     setLoading(true);
// //     try {
// //       const res = await fetch("/api/recommendations", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           studentSkills: ["React", "TypeScript", "Python"],
// //           studentInterests: ["Web Development", "Artificial Intelligence"],
// //           careerGoal: "Full-Stack AI Engineer",
// //         }),
// //       });

// //       const data = await res.json();
// //       setRecommendations(data.recommendations);
// //     } catch (err) {
// //       console.error(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="p-6">
// //       <button
// //         onClick={fetchRecommendations}
// //         disabled={loading}
// //         className="px-4 py-2 bg-blue-600 text-white rounded-md"
// //       >
// //         {loading ? "Generating..." : "Get Dynamic Recommendations"}
// //       </button>

// //       <div className="mt-6 space-y-4">
// //         {recommendations.map((item: any) => (
// //           <div key={item.id} className="p-4 border rounded-lg shadow-sm">
// //             <h3 className="font-bold text-lg">{item.title} ({item.matchScore}% Match)</h3>
// //             <p className="text-gray-600 mt-1">{item.description}</p>
// //             <p className="text-sm text-blue-500 mt-2"><strong>Reasoning:</strong> {item.reasoning}</p>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }



// // 'use client';

// // import { useEffect, useMemo, useState } from 'react';
// // import {
// //   BarChart3, Bookmark, BookmarkCheck, Brain, ChevronLeft, Cpu,
// //   FlaskConical, Globe, Search, ShieldCheck, Smartphone, Sparkles,
// // } from 'lucide-react';
// // import { useRouter } from 'next/navigation';

// // interface Project {
// //   id: number;
// //   title: string;
// //   matchPercentage: number;
// //   tags: string[];
// //   summary: string;
// // }

// // const SAVED_KEY = 'savedProjectIds';

// // function getCategoryIcon(tags: string[]) {
// //   if (tags.includes('AI') || tags.includes('NLP')) return Brain;
// //   if (tags.includes('Web') || tags.includes('Frontend')) return Globe;
// //   if (tags.includes('Data') || tags.includes('Analytics')) return BarChart3;
// //   if (tags.includes('IoT') || tags.includes('Hardware')) return Cpu;
// //   if (tags.includes('Security')) return ShieldCheck;
// //   return Smartphone;
// // }

// // function getMatchStyles(percentage: number) {
// //   if (percentage >= 90) return { text: 'text-emerald-600', dot: 'bg-emerald-500' };
// //   if (percentage >= 80) return { text: 'text-blue-600', dot: 'bg-blue-500' };
// //   return { text: 'text-amber-600', dot: 'bg-amber-500' };
// // }

// // // Guards against malformed items from the AI response (missing/wrong-typed fields)
// // // so a bad entry renders nothing instead of crashing the match badge or icon lookup.
// // function isValidProject(p: unknown): p is Project {
// //   if (!p || typeof p !== 'object') return false;
// //   const project = p as Record<string, unknown>;
// //   return (
// //     typeof project.id === 'number' &&
// //     typeof project.title === 'string' &&
// //     typeof project.matchPercentage === 'number' &&
// //     typeof project.summary === 'string' &&
// //     Array.isArray(project.tags) &&
// //     project.tags.every((t) => typeof t === 'string')
// //   );
// // }

// // export default function Recommendations() {
// //   const router = useRouter();
// //   const [projects, setProjects] = useState<Project[] | null>(null);

// //   // Lazy initialize status synchronously to check for profile before render.
// //   // This avoids calling `setStatus('no-profile')` directly in `useEffect`.
// //   const [status, setStatus] = useState<'loading' | 'ready' | 'no-profile' | 'error'>(() => {
// //     if (typeof window === 'undefined') return 'loading';
// //     try {
// //       const raw = localStorage.getItem('student');
// //       return raw ? 'loading' : 'no-profile';
// //     } catch {
// //       return 'no-profile';
// //     }
// //   });

// //   const [query, setQuery] = useState('');
// //   const [activeFilter, setActiveFilter] = useState('All');

// //   // Lazy initializer reads localStorage synchronously during the initial render
// //   // (not in an effect) — avoids the extra render pass React warns about.
// //   // Guarded for SSR, where `window`/`localStorage` don't exist.
// //   const [saved, setSaved] = useState<Set<number>>(() => {
// //     if (typeof window === 'undefined') return new Set();
// //     try {
// //       const rawSaved = localStorage.getItem(SAVED_KEY);
// //       if (rawSaved) {
// //         const ids: number[] = JSON.parse(rawSaved);
// //         return new Set(ids);
// //       }
// //     } catch (err) {
// //       console.error('Failed to read saved projects:', err);
// //     }
// //     return new Set();
// //   });

// //   useEffect(() => {
// //     // If no profile exists, skip fetching entirely
// //     if (status === 'no-profile') return;

// //     const controller = new AbortController();

// //     let raw: string | null = null;
// //     try {
// //       raw = localStorage.getItem('student');
// //     } catch (err) {
// //       console.error('Failed to read student profile:', err);
// //     }

// //     if (!raw) {
// //       return;
// //     }

// //     let student: unknown;
// //     try {
// //       student = JSON.parse(raw);
// //     } catch (err) {
// //       console.error('Stored student profile is corrupted:', err);
// //       setStatus('error');
// //       return;
// //     }

// //     fetch('/api/recommendations', {
// //       method: 'POST',
// //       headers: { 'Content-Type': 'application/json' },
// //       body: JSON.stringify(student),
// //       signal: controller.signal,
// //     })
// //       .then((res) => {
// //         if (!res.ok) throw new Error('Request failed');
// //         return res.json();
// //       })
// //       .then((data: unknown) => {
// //         const validProjects = Array.isArray(data) ? data.filter(isValidProject) : [];
// //         setProjects(validProjects);
// //         setStatus('ready');
// //       })
// //       .catch((err: unknown) => {
// //         if (err instanceof DOMException && err.name === 'AbortError') return; // component unmounted mid-fetch, ignore
// //         console.error('Failed to fetch AI recommendations:', err);
// //         setStatus('error');
// //       });

// //     return () => controller.abort();
// //   }, [status]);

// //   const toggleSaved = (id: number) => {
// //     setSaved((prev) => {
// //       const next = new Set(prev);
// //       if (next.has(id)) next.delete(id);
// //       else next.add(id);

// //       try {
// //         localStorage.setItem(SAVED_KEY, JSON.stringify(Array.from(next)));
// //       } catch (err) {
// //         console.error('Failed to persist saved projects:', err);
// //       }

// //       return next;
// //     });
// //   };

// //   const filters = useMemo(() => {
// //     if (!projects) return ['All', 'High Match'];
// //     const tags = new Set<string>();
// //     projects.forEach((p) => p.tags.forEach((t) => tags.add(t)));
// //     return ['All', 'High Match', ...Array.from(tags)];
// //   }, [projects]);

// //   const filtered = useMemo(() => {
// //     if (!projects) return [];
// //     return projects.filter((project) => {
// //       const matchesFilter =
// //         activeFilter === 'All' ||
// //         (activeFilter === 'High Match'
// //           ? project.matchPercentage >= 90
// //           : project.tags.includes(activeFilter));

// //       const q = query.trim().toLowerCase();
// //       const matchesQuery =
// //         q.length === 0 ||
// //         project.title.toLowerCase().includes(q) ||
// //         project.tags.some((tag) => tag.toLowerCase().includes(q));

// //       return matchesFilter && matchesQuery;
// //     });
// //   }, [projects, activeFilter, query]);

// //   return (
// //     <div className="min-h-screen bg-[#F8F8FB] lg:pl-72">
// //       <div className="mx-auto max-w-5xl px-6 py-8 lg:px-10 lg:py-10">
// //         <div className="mb-6 flex items-center justify-between lg:justify-start lg:gap-4">
// //           <button
// //             aria-label="Go back"
// //             onClick={() => router.back()}
// //             className="text-slate-700 transition hover:text-[#2563EB] lg:hidden"
// //           >
// //             <ChevronLeft />
// //           </button>

// //           <div className="text-center lg:text-left">
// //             <h1 className="text-xl font-bold text-slate-900 lg:text-2xl">Recommendations</h1>
// //             <p className="text-xs text-slate-500 lg:text-sm">
// //               {status === 'ready' ? `${filtered.length} of ${projects!.length} projects` : 'AI-matched for you'}
// //             </p>
// //           </div>

// //           <FlaskConical className="text-slate-700 lg:ml-auto" />
// //         </div>

// //         {status === 'no-profile' && (
// //           <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
// //             <Sparkles className="text-slate-300" size={28} />
// //             <p className="font-medium text-slate-700">Complete your profile first</p>
// //             <p className="text-sm text-slate-500">We need your interests and skills to generate recommendations.</p>
// //             <button
// //               onClick={() => router.push('/onboarding')}
// //               className="mt-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d4fd1]"
// //             >
// //               Go to Onboarding
// //             </button>
// //           </div>
// //         )}

// //         {status === 'loading' && (
// //           <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
// //             {Array.from({ length: 4 }).map((_, i) => (
// //               <div key={i} className="animate-pulse rounded-2xl border border-slate-100 bg-white p-4">
// //                 <div className="flex gap-4">
// //                   <div className="h-12 w-12 shrink-0 rounded-xl bg-slate-100" />
// //                   <div className="flex-1 space-y-2">
// //                     <div className="h-4 w-3/4 rounded bg-slate-100" />
// //                     <div className="h-3 w-full rounded bg-slate-100" />
// //                     <div className="h-3 w-2/3 rounded bg-slate-100" />
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}

// //         {status === 'error' && (
// //           <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
// //             <Sparkles className="text-slate-300" size={28} />
// //             <p className="font-medium text-slate-700">Couldn&apos;t generate recommendations</p>
// //             <p className="text-sm text-slate-500">Something went wrong reaching the AI. Try again.</p>
// //             <button
// //               onClick={() => window.location.reload()}
// //               className="mt-2 rounded-xl border border-[#2563EB] px-5 py-2.5 text-sm font-semibold text-[#2563EB] transition hover:bg-[#2563EB]/5"
// //             >
// //               Retry
// //             </button>
// //           </div>
// //         )}

// //         {status === 'ready' && (
// //           <>
// //             <div className="relative mb-5">
// //               <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
// //               <input
// //                 type="search"
// //                 value={query}
// //                 onChange={(e) => setQuery(e.target.value)}
// //                 placeholder="Search projects or tags..."
// //                 className="h-14 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30 lg:max-w-md"
// //               />
// //             </div>

// //             <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
// //               {filters.map((filter) => {
// //                 const isActive = activeFilter === filter;
// //                 return (
// //                   <button
// //                     key={filter}
// //                     onClick={() => setActiveFilter(filter)}
// //                     className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition active:scale-95 ${
// //                       isActive
// //                         ? 'bg-[#2563EB] text-white'
// //                         : 'border border-slate-200 bg-white text-slate-700 hover:border-[#2563EB]/40'
// //                     }`}
// //                   >
// //                     {filter}
// //                   </button>
// //                 );
// //               })}
// //             </div>

// //             {filtered.length > 0 ? (
// //               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
// //                 {filtered.map((project) => {
// //                   const Icon = getCategoryIcon(project.tags);
// //                   const isSaved = saved.has(project.id);
// //                   const matchStyles = getMatchStyles(project.matchPercentage);

// //                   return (
// //                     <div key={project.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md">
// //                       <div className="flex gap-4">
// //                         <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
// //                           <Icon size={22} className="text-[#2563EB]" />
// //                         </div>

// //                         <div className="flex-1">
// //                           <h3 className="font-semibold leading-6 text-slate-900">{project.title}</h3>
// //                           <p className="mt-1 text-sm leading-5 text-slate-500">{project.summary}</p>

// //                           <div className="mt-3 flex flex-wrap gap-2">
// //                             {project.tags.map((tag) => (
// //                               <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
// //                                 {tag}
// //                               </span>
// //                             ))}
// //                           </div>
// //                         </div>

// //                         <div className="flex flex-col items-end justify-between">
// //                           <span className={`flex items-center gap-1 text-sm font-semibold ${matchStyles.text}`}>
// //                             <span className={`h-1.5 w-1.5 rounded-full ${matchStyles.dot}`} />
// //                             {project.matchPercentage}%
// //                           </span>

// //                           <button
// //                             onClick={() => toggleSaved(project.id)}
// //                             aria-label={isSaved ? 'Remove from saved projects' : 'Save project'}
// //                             className={`transition active:scale-90 ${isSaved ? 'text-[#2563EB]' : 'text-slate-400 hover:text-[#2563EB]'}`}
// //                           >
// //                             {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
// //                           </button>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   );
// //                 })}
// //               </div>
// //             ) : (
// //               <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
// //                 <Sparkles className="text-slate-300" size={28} />
// //                 <p className="font-medium text-[#700]">No projects match that search</p>
// //                 <p className="text-sm text-slate-500">Try a different keyword or clear the active filter.</p>
// //               </div>
// //             )}
// //           </>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }



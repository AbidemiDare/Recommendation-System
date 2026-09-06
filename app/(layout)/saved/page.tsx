'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Bookmark,
  BookmarkX,
  Brain,
  ChevronLeft,
  Clock,
  Cpu,
  Globe,
  Search,
  ShieldCheck,
  Smartphone,
  TrendingUp,
} from 'lucide-react';

interface SavedProject {
  id: number;
  title: string;
  matchPercentage: number;
  tags: string[];
  summary: string;
  savedAt: string; // ISO date
}

const INITIAL_SAVED: SavedProject[] = [
  {
    id: 1,
    title: 'AI-Powered Course Advisor Chatbot',
    matchPercentage: 95,
    tags: ['AI', 'NLP'],
    summary:
      "Conversational agent that recommends electives based on a student's transcript and stated interests.",
    savedAt: '2026-07-20',
  },
  {
    id: 3,
    title: 'Predictive Model for Student Dropout Risk',
    matchPercentage: 89,
    tags: ['AI', 'Data'],
    summary: 'ML pipeline that flags at-risk students from attendance and grade patterns.',
    savedAt: '2026-07-18',
  },
  {
    id: 6,
    title: 'Secure Result Verification Portal',
    matchPercentage: 78,
    tags: ['Security', 'Web'],
    summary: 'Blockchain-anchored portal for verifying academic transcripts and certificates.',
    savedAt: '2026-07-12',
  },
];

const SORTS = ['Recently saved', 'Highest match'] as const;
type Sort = (typeof SORTS)[number];

function getCategoryIcon(tags: string[]) {
  if (tags.includes('AI')) return Brain;
  if (tags.includes('Web') || tags.includes('Frontend')) return Globe;
  if (tags.includes('Data') || tags.includes('Analytics')) return BarChart3;
  if (tags.includes('IoT') || tags.includes('Hardware')) return Cpu;
  if (tags.includes('Security')) return ShieldCheck;
  return Smartphone;
}

function getMatchStyles(percentage: number) {
  if (percentage >= 90) return { text: 'text-emerald-600', dot: 'bg-emerald-500' };
  if (percentage >= 80) return { text: 'text-blue-600', dot: 'bg-blue-500' };
  return { text: 'text-amber-600', dot: 'bg-amber-500' };
}

function formatSavedDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function Saved() {
  const [saved, setSaved] = useState<SavedProject[]>(INITIAL_SAVED);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<Sort>('Recently saved');

  const unsave = (id: number) => {
    setSaved((prev) => prev.filter((project) => project.id !== id));
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = saved.filter(
      (project) =>
        q.length === 0 ||
        project.title.toLowerCase().includes(q) ||
        project.tags.some((tag) => tag.toLowerCase().includes(q))
    );

    return [...filtered].sort((a, b) =>
      sort === 'Highest match'
        ? b.matchPercentage - a.matchPercentage
        : new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
    );
  }, [saved, query, sort]);

  return (
    <div className="min-h-screen bg-[#F8F8FB] lg:pl-72">
      <div className="mx-auto max-w-5xl px-6 py-8 lg:px-10 lg:py-10">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between lg:justify-start lg:gap-4">
          <button
            aria-label="Go back"
            className="text-slate-700 transition hover:text-[#2563EB] lg:hidden"
          >
            <ChevronLeft />
          </button>

          <div className="text-center lg:text-left">
            <h1 className="text-xl font-bold text-slate-900 lg:text-2xl">Saved</h1>
            <p className="text-xs text-slate-500 lg:text-sm">
              {saved.length} project{saved.length === 1 ? '' : 's'} bookmarked
            </p>
          </div>

          <Bookmark className="text-slate-700 lg:ml-auto" />
        </div>

        {saved.length > 0 && (
          <>
            {/* Search */}
            <div className="relative mb-5">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search saved projects..."
                className="h-14 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30 lg:max-w-md"
              />
            </div>

            {/* Sort toggle */}
            <div className="mb-6 flex gap-2">
              {SORTS.map((option) => {
                const isActive = sort === option;
                const Icon = option === 'Highest match' ? TrendingUp : Clock;
                return (
                  <button
                    key={option}
                    onClick={() => setSort(option)}
                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition active:scale-95 ${
                      isActive
                        ? 'bg-[#2563EB] text-white'
                        : 'border border-slate-200 bg-white text-slate-700 hover:border-[#2563EB]/40'
                    }`}
                  >
                    <Icon size={14} />
                    {option}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Saved project cards */}
        {saved.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <Bookmark className="text-slate-300" size={28} />
            <p className="font-medium text-slate-700">No saved projects yet</p>
            <p className="text-sm text-slate-500">
              Bookmark projects from Recommendations to find them here later.
            </p>
            <Link
              href="/recommendation"
              className="mt-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1d4fd1] active:scale-95"
            >
              Browse recommendations
            </Link>
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <Search className="text-slate-300" size={28} />
            <p className="font-medium text-slate-700">No matches for that search</p>
            <p className="text-sm text-slate-500">Try a different keyword.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {visible.map((project) => {
              const Icon = getCategoryIcon(project.tags);
              const matchStyles = getMatchStyles(project.matchPercentage);

              return (
                <div
                  key={project.id}
                  className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                      <Icon size={22} className="text-[#2563EB]" />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold leading-6 text-slate-900">{project.title}</h3>
                      <p className="mt-1 text-sm leading-5 text-slate-500">{project.summary}</p>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                          >
                            {tag}
                          </span>
                        ))}
                        <span className="text-xs text-slate-400">
                          Saved {formatSavedDate(project.savedAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <span className={`flex items-center gap-1 text-sm font-semibold ${matchStyles.text}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${matchStyles.dot}`} />
                        {project.matchPercentage}%
                      </span>

                      <button
                        onClick={() => unsave(project.id)}
                        aria-label="Remove from saved projects"
                        className="text-slate-400 transition hover:text-red-500 active:scale-90"
                      >
                        <BookmarkX size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// 'use client';

// import { Bookmark, ChevronLeft, Stethoscope } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// const projects = [
//   {
//     id: 1,
//     title: 'AI-Powered Health Assistant Chatbot',
//     match: '95%',
//     tags: ['AI', 'Healthcare', 'NLP'],
//   },
//   {
//     id: 2,
//     title: 'Medical Appointment Booking System',
//     match: '92%',
//     tags: ['Web', 'Healthcare', 'Frontend'],
//   },
//   {
//     id: 3,
//     title: 'Smart Disease Prediction Platform',
//     match: '89%',
//     tags: ['AI', 'Data', 'ML'],
//   },
//   {
//     id: 4,
//     title: 'Remote Patient Monitoring Dashboard',
//     match: '87%',
//     tags: ['Healthcare', 'Dashboard', 'IoT'],
//   },
//   {
//     id: 5,
//     title: 'Healthcare Recommendation Engine',
//     match: '84%',
//     tags: ['AI', 'Data', 'Analytics'],
//   },
// ];

// const Saved = () => {
//   const router = useRouter();

//   return (
//     <div className="min-h-screen bg-slate-50 px-5 py-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <button onClick={() => router.back()}>
//           <ChevronLeft
//             size={24}
//             className="text-slate-700 cursor-pointer"
//           />
//         </button>

//         <h1 className="text-xl font-bold text-slate-900">
//           Saved Projects
//         </h1>

//         <div className="w-6" />
//       </div>

//       {/* Filter Tabs */}
//       <div className="flex gap-3 mb-6">
//         <button className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium">
//           All Saved
//         </button>

//         <button className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-medium">
//           Interested
//         </button>
//       </div>

//       {/* Project Cards */}
//       <div className="space-y-4">
//         {projects.map((project) => (
//           <div
//             key={project.id}
//             className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200"
//           >
//             <div className="flex gap-4">
//               {/* Icon */}
//               <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
//                 <Stethoscope
//                   size={22}
//                   className="text-green-600"
//                 />
//               </div>

//               {/* Content */}
//               <div className="flex-1">
//                 <h3 className="font-semibold text-slate-900 leading-6">
//                   {project.title}
//                 </h3>

//                 <div className="flex items-center gap-2 mt-2">
//                   <span className="text-green-600 text-sm font-semibold">
//                     {project.match} Match
//                   </span>
//                 </div>

//                 <div className="flex flex-wrap gap-2 mt-3">
//                   {project.tags.map((tag) => (
//                     <span
//                       key={tag}
//                       className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
//                     >
//                       {tag}
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               {/* Bookmark */}
//               <button className="self-start text-blue-600">
//                 <Bookmark
//                   size={20}
//                   fill="currentColor"
//                 />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Saved;



// // 'use client'

// // import { Bookmark, ChevronLeft, Stethoscope } from "lucide-react";

// // const projects = [
// //   {
// //     id: 1,
// //     title: 'AI-Powered Health Assistant Chatbot',
// //     match: '95%',
// //     tags: ['AI', 'Healthcare', 'NLP'],
// //   },
// //   {
// //     id: 2,
// //     title: 'Medical Appointment Booking System',
// //     match: '92%',
// //     tags: ['Web', 'Healthcare', 'Frontend'],
// //   },
// //   {
// //     id: 3,
// //     title: 'Smart Disease Prediction Platform',
// //     match: '89%',
// //     tags: ['AI', 'Data', 'ML'],
// //   },
// //   {
// //     id: 4,
// //     title: 'Remote Patient Monitoring Dashboard',
// //     match: '87%',
// //     tags: ['Healthcare', 'Dashboard', 'IoT'],
// //   },
// //   {
// //     id: 5,
// //     title: 'Healthcare Recommendation Engine',
// //     match: '84%',
// //     tags: ['AI', 'Data', 'Analytics'],
// //   },
// // ];

// // const Saved = () => {
// //     return (
// //         <div>
// //             {/* Header & back to home icon */}
// //               <div className="flex items-center justify-between mb-6">
// //                     <ChevronLeft className="cursor-pointer text-slate-700" />
// //                     <h1 className="text-xl font-bold text-slate-900">
// //                       Saved Projects
// //                     </h1>
// //             </div>

// //             <div>
// //                 <button>All Saved</button>
// //                 <button>Interested</button>
// //             </div>

// //         {/* Project Cards */}
// //       <div className="space-y-4">
// //         {projects.map((project) => (
// //           <div
// //             key={project.id}
// //             className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200"
// //           >
// //             <div className="flex gap-4">
// //               {/* Icon */}
// //               <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
// //                 <Stethoscope
// //                   size={22}
// //                   className="text-green-600"
// //                 />
// //               </div>

// //               {/* Content */}
// //               <div className="flex-1">
// //                 <h3 className="font-semibold text-slate-900 leading-6">
// //                   {project.title}
// //                 </h3>

// //                 <div className="flex flex-wrap gap-2 mt-3">
// //                   {project.tags.map((tag) => (
// //                     <span
// //                       key={tag}
// //                       className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700"
// //                     >
// //                       {tag}
// //                     </span>
// //                   ))}
// //                 </div>
// //               </div>

// //               {/* Match + Bookmark */}
// //               <div className="flex flex-col items-end justify-between">
// //                 <span className="text-green-600 font-semibold text-sm">
// //                   {project.match}
// //                 </span>

// //                 <button className="text-slate-500 hover:text-blue-600 transition">
// //                   <Bookmark size={20} />
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //         </div>
// //     )
// // }


// // export default Saved;
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
} from "lucide-react";
import type { SavedProject } from "@/app/lib/types";
import { SAVED_KEY } from "@/app/lib/session";

const SORTS = ["Recently saved", "Highest match"] as const;
type Sort = (typeof SORTS)[number];

function getCategoryIcon(tags: string[]) {
  if (tags.includes("AI") || tags.includes("Machine Learning")) return Brain;
  if (tags.includes("Web Development") || tags.includes("Frontend")) return Globe;
  if (tags.includes("Data Science") || tags.includes("Analytics")) return BarChart3;
  if (tags.includes("IoT") || tags.includes("Hardware")) return Cpu;
  if (tags.includes("Cybersecurity") || tags.includes("Security")) return ShieldCheck;
  return Smartphone;
}

function getMatchStyles(score: number) {
  if (score >= 90) return { text: "text-emerald-600", dot: "bg-emerald-500" };
  if (score >= 80) return { text: "text-blue-600", dot: "bg-blue-500" };
  return { text: "text-amber-600", dot: "bg-amber-500" };
}

function formatSavedDate(iso?: string) {
  if (!iso) return "recently";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function Saved() {
  const [saved, setSaved] = useState<SavedProject[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("Recently saved");

  // Deferred to useEffect (not a lazy useState initializer) to match the
  // hydration-safe pattern used everywhere else in this app — reading
  // localStorage during render causes a server/client mismatch.
  useEffect(() => {
    const raw = localStorage.getItem(SAVED_KEY);
    if (raw) {
      try {
        setSaved(JSON.parse(raw));
      } catch {
        setSaved([]);
      }
    }
  }, []);

  // Writes back to localStorage, not just component state — otherwise a
  // removal here would be undone the next time this page (re)reads storage,
  // and the Recommendations page's bookmark icons would never learn about it.
  const unsave = (id: string) => {
    setSaved((prev) => {
      const next = prev.filter((project) => project.id !== id);
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      return next;
    });
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = saved.filter(
      (project) =>
        q.length === 0 ||
        project.title.toLowerCase().includes(q) ||
        (project.domainTags ?? []).some((tag) => tag.toLowerCase().includes(q))
    );

    return [...filtered].sort((a, b) =>
      sort === "Highest match"
        ? b.matchScore - a.matchScore
        : new Date(b.savedAt ?? 0).getTime() - new Date(a.savedAt ?? 0).getTime()
    );
  }, [saved, query, sort]);

  return (
    <div className="min-h-screen bg-[#F8F8FB] lg:pl-72">
      <div className="mx-auto max-w-5xl px-6 py-8 lg:px-10 lg:py-10">
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
              {saved.length} project{saved.length === 1 ? "" : "s"} bookmarked
            </p>
          </div>

          <Bookmark className="text-slate-700 lg:ml-auto" />
        </div>

        {saved.length > 0 && (
          <>
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

            <div className="mb-6 flex gap-2">
              {SORTS.map((option) => {
                const isActive = sort === option;
                const Icon = option === "Highest match" ? TrendingUp : Clock;
                return (
                  <button
                    key={option}
                    onClick={() => setSort(option)}
                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition active:scale-95 ${
                      isActive
                        ? "bg-[#2563EB] text-white"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-[#2563EB]/40"
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

        {saved.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <Bookmark className="text-slate-300" size={28} />
            <p className="font-medium text-slate-700">No saved projects yet</p>
            <p className="text-sm text-slate-500">
              Bookmark projects from Recommendations to find them here later.
            </p>
            <Link
              href="/recommendations"
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
              const Icon = getCategoryIcon(project.domainTags ?? []);
              const matchStyles = getMatchStyles(project.matchScore);

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
                      <p className="mt-1 text-sm leading-5 text-slate-500">{project.description}</p>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {(project.domainTags ?? []).map((tag) => (
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
                        {project.matchScore}%
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


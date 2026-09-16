"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck, ChevronDown, Loader2, RefreshCw } from "lucide-react";
import type { StudentProfile, ProjectRecommendation, SavedProject } from "@/app/lib/types";
import { useDelayedLoading } from "@/components/loading/Preloader";
import { SAVED_KEY, RECOMMENDATIONS_CACHE_KEY } from "@/app/lib/session";

// Shape written here and read by the Dashboard page's "Recommended Projects"
// count and "Top Matches" section — keep this in sync with dashboard/page.tsx
// if either side changes.
interface CachedRecommendations {
  profileSnapshot: string;
  recommendations: ProjectRecommendation[];
}

function difficultyStyles(difficulty: string) {
  switch (difficulty) {
    case "Beginner":
      return "bg-emerald-50 text-emerald-700";
    case "Intermediate":
      return "bg-amber-50 text-amber-700";
    case "Advanced":
      return "bg-rose-50 text-rose-700";
    default:
      return "bg-gray-50 text-gray-700";
  }
}

type Status = "idle" | "loading" | "error" | "done";

export default function RecommendationDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [projects, setProjects] = useState<ProjectRecommendation[]>([]);
  const [saved, setSaved] = useState<SavedProject[]>([]);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isLoading = status === "idle" || status === "loading";
  const showLoader = useDelayedLoading(isLoading);

  // Load the profile saved by the onboarding form, and any previously saved projects.
  useEffect(() => {
    const raw = localStorage.getItem("student");
    if (!raw) {
      router.push("/onboarding");
      return;
    }
    // Local-storage hydration must happen after mount to avoid SSR mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfile(JSON.parse(raw));

    const savedRaw = localStorage.getItem(SAVED_KEY);
    if (savedRaw) setSaved(JSON.parse(savedRaw));
  }, [router]);

  // Reuse a cached result for this exact profile instead of refetching every
  // time this page remounts (e.g. after visiting Dashboard, Profile, or
  // Saved). If the profile has changed since the cache was written — say,
  // after an edit on the Profile page — fetch fresh instead.
  //
  // sessionStorage, not localStorage: this cache is meant to survive
  // navigation and refreshes within the same browser session, but reset
  // once the tab/browser is closed. The student profile and saved projects
  // stay in localStorage since those should persist across sessions.
  useEffect(() => {
    if (!profile) return;

    const cacheRaw = sessionStorage.getItem(RECOMMENDATIONS_CACHE_KEY);
    if (cacheRaw) {
      try {
        const cache: CachedRecommendations = JSON.parse(cacheRaw);
        if (cache.profileSnapshot === JSON.stringify(profile)) {
          // Cached data is restored after mount from sessionStorage.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setProjects(cache.recommendations);
          setStatus("done");
          return;
        }
      } catch {
        // Malformed cache — fall through and fetch fresh.
      }
    }

    // AbortController ties the request's lifetime to this effect's — if the
    // user navigates away (or the profile changes again) before Gemini
    // responds, the fetch is cancelled instead of resolving later and
    // calling setStatus/setProjects on an unmounted component.
    const controller = new AbortController();
    fetchRecommendations(profile, controller.signal);
    return () => controller.abort();
  }, [profile]);

  async function fetchRecommendations(p: StudentProfile, signal?: AbortSignal) {
    setStatus("loading");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
        signal,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error ?? `Request failed with status ${res.status}`);
      }
      setProjects(data.recommendations);
      // Writing this is what makes the Dashboard page's "Recommended
      // Projects" count and "Top Matches" actually populate — nothing was
      // writing to this key before, so Dashboard had nothing to read.
      sessionStorage.setItem(
        RECOMMENDATIONS_CACHE_KEY,
        JSON.stringify({ profileSnapshot: JSON.stringify(p), recommendations: data.recommendations })
      );
      setStatus("done");
    } catch (err) {
      // An aborted request is an intentional cancellation (unmount or a
      // fresh profile superseding this one), not a real failure — showing
      // an error screen for it would be wrong.
      if (err instanceof DOMException && err.name === "AbortError") return;
      setErrorMessage(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }

  function toggleTag(tag: string) {
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function toggleSave(project: ProjectRecommendation) {
    setSaved((prev) => {
      const isSaved = prev.some((p) => p.id === project.id);
      const next = isSaved
        ? prev.filter((p) => p.id !== project.id)
        : [...prev, { ...project, savedAt: new Date().toISOString() }];
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      return next;
    });
  }

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach((p) => (p.domainTags ?? []).forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeTags.length === 0) return projects;
    return projects.filter((p) => (p.domainTags ?? []).some((t) => activeTags.includes(t)));
  }, [projects, activeTags]);

  if (status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F8F8FB] px-5 text-center">
        <p className="text-sm text-gray-600">Something went wrong generating your recommendations.</p>
        {errorMessage && <p className="max-w-md text-xs text-gray-400">{errorMessage}</p>}
        <button
          onClick={() => profile && fetchRecommendations(profile)}
          className="flex h-11 items-center gap-2 rounded-xl bg-[#2563EB] px-4 text-sm font-semibold text-white"
        >
          <RefreshCw className="h-4 w-4" /> Try again
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F8F8FB] px-5 py-8 lg:ml-64">
        <div className="mx-auto flex min-h-72 max-w-5xl items-center justify-center">
          {showLoader && (
            <div role="status" aria-live="polite" className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
              <Loader2 className="h-5 w-5 animate-spin text-[#2563EB]" />
              <p className="text-sm text-gray-500">Matching projects that fits your profile...</p>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8FB] lg:px-5 py-2 lg:py-8 lg:ml-64">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Your project matches</h1>
            <p className="mt-1 text-sm text-gray-500">
              {filteredProjects.length} of {projects.length} projects shown
            </p>
          </div>
          <button
            onClick={() => profile && fetchRecommendations(profile)}
            className="flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 hover:border-[#2563EB]/40"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Regenerate
          </button>
        </div>

        {allTags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTags.includes(tag)
                    ? "border-[#2563EB] bg-[#2563EB] text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-[#2563EB]/40"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const isExpanded = expandedId === project.id;
            const isSaved = saved.some((p) => p.id === project.id);
            return (
              <div key={project.id} className="flex flex-col rounded-xl border border-gray-200 bg-white p-5">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${difficultyStyles(project.difficulty)}`}>
                    {project.difficulty}
                  </span>
                  <button onClick={() => toggleSave(project)} aria-label="Save project">
                    {isSaved ? (
                      <BookmarkCheck className="h-5 w-5 text-[#2563EB]" />
                    ) : (
                      <Bookmark className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>

                <h3 className="mb-1.5 text-base font-semibold text-gray-900">{project.title}</h3>
                <p className="mb-3 text-sm leading-relaxed text-gray-600">{project.description}</p>

                <div className="mb-3 flex flex-wrap gap-1.5">
                  {project.techStack.slice(0, 4).map((tech) => (
                    <span key={tech} className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mb-3 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-[#2563EB]" style={{ width: `${project.matchScore}%` }} />
                  </div>
                  <span className="text-xs font-medium text-gray-500">{project.matchScore}% match</span>
                </div>

                <button
                  onClick={() => setExpandedId(isExpanded ? null : project.id)}
                  className="mt-auto flex items-center justify-center gap-1 rounded-xl border border-gray-200 py-2 text-xs font-medium text-gray-600 hover:border-[#2563EB]/40"
                >
                  {isExpanded ? "Hide details" : "Why this project?"}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </button>

                {isExpanded && (
                  <div className="mt-3 rounded-xl bg-[#F8F8FB] p-3 text-xs leading-relaxed text-gray-600">
                    {project.rationale}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}



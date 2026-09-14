// Single source of truth for the storage keys that were previously
// hardcoded independently in three separate files (recommendation-dashboard.tsx,
// dashboard/page.tsx, saved/page.tsx) with zero shared reference — exactly
// the kind of drift that caused the earlier localStorage/sessionStorage
// mismatch bug. Every file that reads or writes these should import them
// from here instead of redeclaring the string literal.
import { STUDENT_STORAGE_KEY } from "./auth";

export const SAVED_KEY = "savedProjects";
export const RECOMMENDATIONS_CACHE_KEY = "cachedRecommendations";

/**
 * Wipes every piece of user-specific client-side state this app stores:
 * the student profile and saved/bookmarked projects (localStorage), and
 * the recommendations cache (sessionStorage).
 *
 * Call this in exactly two places:
 * 1. On explicit logout — the only point in an app with no real accounts
 *    where "a new user" unambiguously begins.
 * 2. At the start of a fresh onboarding submission — so a new profile
 *    never inherits a previous profile's saved projects or cached
 *    recommendations, which have no relevance to a different profile.
 *
 * Deliberately NOT called on tab close: the student profile and saved
 * projects are meant to survive that (they're in localStorage on purpose).
 * Only the recommendations cache is tab-scoped, via sessionStorage, and
 * the browser already clears that on its own — no code needed for that part.
 */
export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STUDENT_STORAGE_KEY);
  localStorage.removeItem(SAVED_KEY);
  sessionStorage.removeItem(RECOMMENDATIONS_CACHE_KEY);
}
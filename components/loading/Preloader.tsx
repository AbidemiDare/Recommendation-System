"use client";

import { useEffect, useState } from "react";

const PRELOADER_DELAY = 2000;

export function useDelayedLoading(isLoading: boolean, delay = PRELOADER_DELAY) {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (!isLoading) return;

    const timer = window.setTimeout(() => setShowLoader(true), delay);
    return () => window.clearTimeout(timer);
  }, [delay, isLoading]);

  return isLoading && showLoader;
}

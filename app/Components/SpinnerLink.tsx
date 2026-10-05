"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type Props = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

export default function SpinnerLink({ href, className = "", children }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    // Let ctrl/cmd/shift-click and middle-click open new tabs normally
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

    e.preventDefault();
    if (pending) return;
    startTransition(() => router.push(href));
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      aria-busy={pending}
      className={`${className} aria-busy:pointer-events-none aria-busy:opacity-80`}
    >
      {pending && (
        <span
          aria-hidden="true"
          className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </Link>
  );
}
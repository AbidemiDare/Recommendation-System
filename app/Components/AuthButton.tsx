"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <p>{session.user?.email}</p>
        <button onClick={() => signOut()}>
          Sign Out
        </button>
      </>
    );
  }

  return (
    <button onClick={() => signIn()}>
      Sign In
    </button>
  );
}
"use client";

import Link from "next/link";
import { AuthShell, linkClass } from "@/app/Components/AuthShell";
import AuthForm from "@/app/Components/auth-form";
import SpinnerLink from "@/app/Components/SpinnerLink";

export default function Signup() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Sign up, then you'll set up your skills and interests."
      footer={
        <>
          Already have an account?{" "}
          <SpinnerLink href="/auth/login" className={linkClass}>Log in</SpinnerLink>
        </>
      }
    >
      <AuthForm mode="sign-up" />
    </AuthShell>
  );
}



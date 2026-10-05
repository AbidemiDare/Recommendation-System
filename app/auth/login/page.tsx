"use client";

import Link from "next/link";
import { AuthShell, linkClass } from "@/app/Components/AuthShell";
import AuthForm from "@/app/Components/auth-form";
import SpinnerLink from "@/app/Components/SpinnerLink";

export default function Login() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to see your project recommendations."
      footer={
        <>
          New here?{" "}
          <SpinnerLink href="/auth/signup" className={linkClass}>Create an account</SpinnerLink>
        </>
      }
    >
      <AuthForm mode="sign-in" />
    </AuthShell>
  );
}


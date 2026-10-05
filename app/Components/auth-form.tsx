"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, User, Lock } from "lucide-react";
import { createClient } from "@/app/lib/supabase/client";
import { saveStudentProfile, readStudentProfile } from "@/app/lib/auth";
import { AuthField, FormError, buttonClass } from "@/app/Components/AuthShell";
import { FaGoogle } from "react-icons/fa";
import SpinnerLink from "@/app/Components/SpinnerLink";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const busy = loading || isPending;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setInfo("");

    const trimmedEmail = email.trim().toLowerCase();
    if (mode === "sign-up" && !name.trim()) return setError("Enter your full name.");
    if (!EMAIL_RE.test(trimmedEmail)) return setError("Enter a valid email address.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");

    setLoading(true);

    if (mode === "sign-up") {
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: { full_name: name.trim() },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        // keep your existing onboarding flow working
        const existing = readStudentProfile();
        saveStudentProfile({
          id: data.user?.id ?? existing?.id ?? "student-1",
          name: name.trim(),
          email: trimmedEmail,
          matricNumber: existing?.matricNumber ?? "",
          department: existing?.department ?? "",
          level: existing?.level ?? "",
          interests: existing?.interests ?? [],
          skills: existing?.skills ?? [],
        });

        if (data.session) {
          // email confirmation disabled in Supabase
          startTransition(() => {
            router.push("/onboarding");
            router.refresh();
          });
          return; // keep the loader up until the new page is ready
        }
        setInfo("Account created. Check your email to confirm your account.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        startTransition(() => {
          router.push("/dashboard");
          router.refresh();
        });
        return;
      }
    }

    setLoading(false);
  }

  async function handleGoogle() {
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
          queryParams: { prompt: "select_account" },
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 space-y-4">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {mode === "sign-up" && (
          <AuthField
            id="name" label="Full name" icon={User} type="text"
            autoComplete="name" value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Abidemi Oluwadamilare"
          />
        )}
        <AuthField
          id="email" label="Email" icon={Mail} type="email"
          autoComplete="email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@student.unilag.edu.ng"
        />
        <AuthField
          id="password" label="Password" icon={Lock} type="password"
          autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
        />

        {error && <FormError message={error} />}
        {info && <p className="text-sm text-green-600">{info}</p>}

        <button type="submit" disabled={busy} aria-busy={busy} className={buttonClass}>
          {busy ? "Please wait..." : mode === "sign-in" ? "Sign in" : "Create account"}
        </button>
      </form>

      {/* Divider */}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs font-medium uppercase tracking-wider text-gray-500">
            or
          </span>
        </div>
      </div>

      {/* Google button */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={busy}
        className="flex w-full items-center lg:cursor-pointer justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 active:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <FaGoogle />
        {mode === "sign-in" ? "Sign in with Google" : "Sign up with Google"}
      </button>

      {/* {busy && <Link> label={mode === "sign-in" ? "Signing you in..." : "Creating your account..."} </Link>} */}
    </div>
  );
}


// "use client";

// import { useState, useTransition } from "react";
// import { useRouter } from "next/navigation";
// import { Mail, User, Lock } from "lucide-react";
// import { createClient } from "@/app/lib/supabase/client";
// import { saveStudentProfile, readStudentProfile } from "@/app/lib/auth";
// import { AuthField, FormError, buttonClass } from "@/app/Components/AuthShell";
// import { FaGoogle } from "react-icons/fa";
// import SpinnerLink from "@/app/Components/SpinnerLink";

// const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// function Spinner() {
//   return (
//     <span
//       aria-hidden="true"
//       className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
//     />
//   );
// }

// export default function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
//   const router = useRouter();
//   const supabase = createClient();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [info, setInfo] = useState("");
//   const [loading, setLoading] = useState(false);
// const [isPending, startTransition] = useTransition();
// const busy = loading || isPending;

//   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     setError("");
//     setInfo("");

//     const trimmedEmail = email.trim().toLowerCase();
//     if (mode === "sign-up" && !name.trim()) return setError("Enter your full name.");
//     if (!EMAIL_RE.test(trimmedEmail)) return setError("Enter a valid email address.");
//     if (password.length < 8) return setError("Password must be at least 8 characters.");

//     setLoading(true);

//     if (mode === "sign-up") {
//       const { data, error } = await supabase.auth.signUp({
//         email: trimmedEmail,
//         password,
//         options: {
//           data: { full_name: name.trim() },
//           emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
//         },
//       });

//       if (error) {
//         setError(error.message);
//       } else {
//         // keep your existing onboarding flow working
//         const existing = readStudentProfile();
//         saveStudentProfile({
//           id: data.user?.id ?? existing?.id ?? "student-1",
//           name: name.trim(),
//           email: trimmedEmail,
//           matricNumber: existing?.matricNumber ?? "",
//           department: existing?.department ?? "",
//           level: existing?.level ?? "",
//           interests: existing?.interests ?? [],
//           skills: existing?.skills ?? [],
//         });

//         if (data.session) {
//           // email confirmation disabled in Supabase
//            startTransition(() => {
//           router.push("/onboarding");
//           router.refresh();
//            });
//         } else {
//           setInfo("Account created. Check your email to confirm your account.");
//         }
//       }
//     } else {
//       const { error } = await supabase.auth.signInWithPassword({
//         email: trimmedEmail,
//         password,
//       });
//       if (error) setError(error.message);
//       else {
//          startTransition(() => {
//         router.push("/dashboard");
//         router.refresh();
//          });
//          return;
//       }
//     }

//     setLoading(false);
//   }

//   async function handleGoogle() {
//     setError("");
//     setLoading(true);
//     const { error } = await supabase.auth.signInWithOAuth({
//       provider: "google",
//       options: {
//         redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
//       },
//     });
//     if (error) {
//       setError(error.message);
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="mt-8 space-y-4">
//       <form onSubmit={handleSubmit} noValidate className="space-y-4">
//         {mode === "sign-up" && (
//           <AuthField
//             id="name" label="Full name" icon={User} type="text"
//             autoComplete="name" value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Damilare Adebayo"
//           />
//         )}
//         <AuthField
//           id="email" label="Email" icon={Mail} type="email"
//           autoComplete="email" value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="you@student.unilag.edu.ng"
//         />
//         <AuthField
//           id="password" label="Password" icon={Lock} type="password"
//           autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="At least 8 characters"
//         />

//         {error && <FormError message={error} />}
//         {info && <p className="text-sm text-green-600">{info}</p>}

//         <button
//   type="submit"
//   disabled={busy}
//   aria-busy={busy}
//   className={`${buttonClass} flex items-center justify-center`}
// >
//   {busy && <SpinnerLink />}
//   {busy
//     ? "Please wait..."
//     : mode === "sign-in" ? "Sign in" : "Create account"}
// </button>

//         {/* <button type="submit" disabled={loading} className={buttonClass}>
//           {loading
//             ? "Please wait..."
//             : mode === "sign-in" ? "Sign in" : "Create account"}
//         </button> */}
//       </form>

//             {/* Divider */}
//       <div className="relative py-2">
//         <div className="absolute inset-0 flex items-center" aria-hidden="true">
//           <div className="w-full border-t border-gray-200" />
//         </div>
//         <div className="relative flex justify-center">
//           <span className="bg-white px-3 text-xs font-medium uppercase tracking-wider text-gray-500">
//             or
//           </span>
//         </div>
//       </div>

//       {/* Google button */}
//       <button
//         type="button"
//         onClick={handleGoogle}
//         disabled={loading}
//         className="flex w-full items-center lg:cursor-pointer justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 active:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
//       >
//         <FaGoogle />
//           {mode === "sign-in" ? "Sign in with Google" : "Sign up with Google"}
//       </button>

//       {/* <button
//         type="button"
//         onClick={handleGoogle}
//         disabled={loading}
//         className={buttonClass}
//       >
//         Continue with Google
//       </button> */}
//     </div>
//   );
// }


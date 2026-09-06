"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { FaMicrosoft } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { saveStudentProfile } from "@/app/lib/auth";

const Signup = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    saveStudentProfile({
      id: "demo-student",
      name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      matricNumber: "",
      department: "",
      level: "",
      interests: [],
      skills: [],
    });

    router.push("/onboarding");
  };

  return (
    <section className="min-h-screen bg-[#F8F8FB] text-black px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mx-auto w-full max-w-md lg:max-w-lg">

        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white"
        >
          <ChevronLeft size={20} />
        </Link>

        {/* Header */}
        <div className="mt-8 mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A]">
            Create account ✨
          </h1>

          <p className="mt-2 text-sm md:text-base text-[#6B7280]">
            Sign up to get started
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>

          {/* Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="mb-2 block text-sm font-medium text-[#374151]"
              >
                First name
              </label>

              <input
                id="firstName"
                type="text"
                placeholder="John"
                value={form.firstName}
                onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
                className="h-14 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="mb-2 block text-sm font-medium text-[#374151]"
              >
                Last name
              </label>

              <input
                id="lastName"
                type="text"
                placeholder="Doe"
                value={form.lastName}
                onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
                className="h-14 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#374151]"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              className="h-14 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#374151]"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                className="h-14 w-full rounded-xl border border-gray-200 bg-white px-4 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <p className="mt-2 text-xs text-[#9CA3AF]">
              Must be at least 8 characters
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-[#374151]"
            >
              Confirm password
            </label>

            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                className="h-14 w-full rounded-xl border border-gray-200 bg-white px-4 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3">
            <input
              id="terms"
              type="checkbox"
              className="mt-1 h-4 w-4 accent-blue-600"
            />

            <label
              htmlFor="terms"
              className="text-sm leading-6 text-[#6B7280]"
            >
              I agree to the{" "}
              <Link
                href="/terms"
                className="font-medium text-[#2563EB]"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-medium text-[#2563EB]"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="h-14 w-full rounded-xl bg-[#2563EB] font-semibold text-white transition hover:bg-blue-700"
          >
            Create Account
          </button>
        </form>

        {/* Divider */}
        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-300" />

          <span className="whitespace-nowrap text-sm text-gray-500">
            or continue with
          </span>

          <div className="h-px flex-1 bg-gray-300" />
        </div>

        {/* Social */}
        <div className="space-y-3">
          <button className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white font-medium transition hover:bg-gray-50">
            <FcGoogle size={22} />
            Continue with Google
          </button>

          <button className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white font-medium transition hover:bg-gray-50">
            <FaMicrosoft />
            Continue with Microsoft
          </button>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-[#6B7280]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#2563EB]"
          >
            Log in
          </Link>
        </p>

      </div>
    </section>
  );
};

export default Signup;



// "use client";

// import { useState } from "react";
// import { ChevronLeft, Eye, EyeOff } from "lucide-react";
// import Link from "next/link";
// import { FaGithub } from "react-icons/fa";
// import { FcGoogle } from "react-icons/fc";
// import { signIn } from "next-auth/react";

// const Signup = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   return (
//     <section className="min-h-screen bg-[#F8F8FB] px-6 py-6 text-black">
//       <div className="mx-auto max-w-sm">

//         {/* Back Button */}
//         <Link
//           href="/"
//           className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200"
//         >
//           <ChevronLeft size={20} />
//         </Link>

//         {/* Header */}
//         <div className="mt-4 mb-8">
//           <h1 className="text-3xl font-bold text-[#1A1A1A]">
//             Create account ✨
//           </h1>
//           <p className="mt-2 text-sm text-[#6B7280]">
//             Sign up to get started
//           </p>
//         </div>
//         {/* Form */}
//         <form className="space-y-5" onSubmit={(e) => {
//           e.preventDefault()
//         }}
//       >
//           {/* Name Row */}
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label
//                 htmlFor="firstName"
//                 className="block mb-2 text-sm font-medium text-[#374151]"
//               >
//                 First name
//               </label>
//               <input
//                 id="firstName"
//                 type="text"
//                 placeholder="John"
//                 className="w-full h-14 px-4 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="lastName"
//                 className="block mb-2 text-sm font-medium text-[#374151]"
//               >
//                 Last name
//               </label>
//               <input
//                 id="lastName"
//                 type="text"
//                 placeholder="Doe"
//                 className="w-full h-14 px-4 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//               />
//             </div>
//           </div>

//           {/* Email */}
//           <div>
//             <label
//               htmlFor="email"
//               className="block mb-2 text-sm font-medium text-[#374151]"
//             >
//               Email address
//             </label>
//             <input
//               id="email"
//               type="email"
//               placeholder="example@email.com"
//               className="w-full h-14 px-4 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label
//               htmlFor="password"
//               className="block mb-2 text-sm font-medium text-[#374151]"
//             >
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Create a password"
//                 className="w-full h-14 px-4 pr-12 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//             <p className="mt-1.5 text-xs text-[#9CA3AF]">
//               Must be at least 8 characters
//             </p>
//           </div>

//           {/* Confirm Password */}
//           <div>
//             <label
//               htmlFor="confirmPassword"
//               className="block mb-2 text-sm font-medium text-[#374151]"
//             >
//               Confirm password
//             </label>
//             <div className="relative">
//               <input
//                 id="confirmPassword"
//                 type={showConfirm ? "text" : "password"}
//                 placeholder="Re-enter your password"
//                 className="w-full h-14 px-4 pr-12 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirm(!showConfirm)}
//                 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//           </div>

//           {/* Terms Checkbox */}
//           <div className="flex items-start gap-3 pt-1">
//             <input
//               id="terms"
//               type="checkbox"
//               className="mt-0.5 w-4 h-4 accent-blue-600 cursor-pointer shrink-0"
//             />
//             <label htmlFor="terms" className="text-sm text-[#6B7280] leading-relaxed cursor-pointer">
//               I agree to the{" "}
//               <Link href="/terms" className="font-medium text-[#2563EB]">
//                 Terms of Service
//               </Link>{" "}
//               and{" "}
//               <Link href="/privacy" className="font-medium text-[#2563EB]">
//                 Privacy Policy
//               </Link>
//             </label>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full h-14 rounded-xl bg-[#2563EB] text-white font-semibold transition hover:bg-blue-700"
//           >
//             Create Account
//           </button>
//         </form>

//         {/* Divider */}
//         <div className="flex items-center gap-4 my-8">
//           <div className="h-px flex-1 bg-gray-400" />
//           <span className="text-sm text-gray-500 whitespace-nowrap">
//             or continue with
//           </span>
//           <div className="h-px flex-1 bg-gray-400" />
//         </div>

//         {/* Social Buttons */}
//         <div className="space-y-3">
//           <button onClick={() => signIn("google")} className="w-full h-14 rounded-xl flex items-center justify-center gap-x-1 border space-x-4 border-gray-300 bg-white font-medium hover:bg-gray-50 transition">
//             <span><FcGoogle size={22} /></span>
//             Continue with Google
//           </button>

//           <button onClick={() => signIn("github")} className="w-full h-14 rounded-xl flex items-center justify-center gap-x-1 border border-gray-300 bg-white font-medium hover:bg-gray-50 transition">
//             <span><FaGithub /></span>
//             Continue with GitHub
//           </button>
//         </div>

//         {/* Footer */}
//         <p className="mt-8 text-center text-sm text-[#6B7280]">
//           Already have an account?{" "}
//           <Link href="/auth/login" className="font-semibold text-[#2563EB]">
//             Log in
//           </Link>
//         </p>

//       </div>
//     </section>
//   );
// };

// export default Signup;

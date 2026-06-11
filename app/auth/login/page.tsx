import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { FaMicrosoft } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  return (
    <section className="min-h-screen bg-[#F8F8FB] px-6 py-10 text-black">
      <div className="mx-auto max-w-sm">

        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200"
        >
          <ChevronLeft size={20} />
        </Link>

        {/* Header */}
        <div className="mt-8 mb-10">
          <h1 className="text-3xl font-bold text-[#1A1A1A]">
            Welcome back! 👋
          </h1>

          <p className="mt-2 text-sm text-[#6B7280]">
            Sign in to continue
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6">

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-[#374151]"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="example@email.com"
              className="w-full h-14 px-4 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-[#374151]"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full h-14 px-4 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <div className="mt-2 text-right">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-[#2563EB]"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full h-14 rounded-xl bg-[#2563EB] text-white font-semibold transition hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="h-px flex-1 bg-gray-400" />

          <span className="text-sm text-gray-500 whitespace-nowrap">
            or continue with
          </span>

          <div className="h-px flex-1 bg-gray-400" />
        </div>

        {/* Social Buttons */}
        <div className="space-y-3">
          <button className="w-full h-14 rounded-xl flex items-center justify-center gap-x-1 border space-x-4 border-gray-300 bg-white font-medium hover:bg-gray-50 transition">
            <span> <FcGoogle size={22} /> </span>
            Continue with Google
          </button>

          <button
            className="w-full h-14 rounded-xl flex items-center justify-center gap-x-1 border border-gray-300 bg-white font-medium hover:bg-gray-50 transition"
          >
           <span><FaMicrosoft/></span> 
            Continue with Microsoft
          </button>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-[#6B7280]">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#2563EB]"
          >
            Sign Up
          </Link>
        </p>

      </div>
    </section>
  );
};

export default Login;

// import { ChevronLeft } from "lucide-react";
// import Link from "next/link";

// const login = () => {
//     return (
//         <div className="text-black bg-[#F8F8FB] min-h-screen px-6 pt-10 w-full">
//             <div className="max-w-90 mx-auto">
//             <span><ChevronLeft /></span>

//             <div className="mt-4 mb-8">
//             <h3 className="text-[24px] text-[#404040] font-bold">Welcome back!👋</h3>
//             <p className="text-gray-500 text-sm mt-2">Sign in to continue</p>
//             </div>

//             <div className="mt-4">
//                 <div className="flex flex-col">
//                 <label htmlFor="email address" className="text-[14px] leading-4 mb-1 font-500 text-[#374151]">Email address:</label>
//                 <input type="email" name="email address" id="email address" className="w-full h-12 px-4 border border-gray-200 bg-white rounded-xl text-[12px] text-gray" placeholder="example@email.com"/>
//                 </div>

//                 <div className="flex flex-col mt-6">
//                 <label className="text-[14px] leading-4 mb-1 font-500 text-[#374151]" htmlFor="password">Password</label> 
//                 <input type="password" name="password" id="password" className="w-full h-12 px-4 border border-gray-200 bg-white rounded-xl text-[12px] text-gray" placeholder="Enter your password..."/>
//                 </div>

//                 <p className="text-md text-right text-blue-500 text-[14px] pt-1 font-medium">Forgot Password?</p>

//                 <button className="bg-[#2563EB] mb-4 mt-8 h-12 w-full rounded-[14px] text-[#ffffff] text-[16px] font-semibold">Login</button>

//                 <div className="flex flex-row items-center justify-center gap-y-2">
//                     <hr className="w-full h-1 bg-gray-100"/>
//                     <p className="text-[14px] text-[1a1a1a]/20">or continue with</p>
//                     <hr className="w-full h-1 bg-gray-100"/>
//                 </div>

//                 <div className="flex flex-col gap-y-2">
//                     <span></span>
//                     <button className="mb-1 border border-gray-400 h-12 w-full rounded-[14px] text-[#000000] text-[16px] font-semibold">Continue with Google</button>
//                     <button className="h-12 border border-gray-400 w-full rounded-[14px] text-[#000000] text-[16px] font-semibold">Continue with Microsoft</button>
//                 </div>

//                 <div className="grid place-items-center w-full">
//                     <p className="text-[14px] text-[#6B7280]">Don&apos;t have an account? <Link href="" className="text-[14px] font-semibold text-[#3B5BFF]">Sign up</Link></p>
//                 </div>

//             </div>
//             </div>
//         </div>
//     );
// }

// export default login;
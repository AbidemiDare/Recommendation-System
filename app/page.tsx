import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import BackgroundCircles from "./Components/BackgroundCircles";

export const metadata: Metadata = {
  title: "Student Project Recommender",
  description:
    "Get project ideas matched to your skills, interests, and academic goals.",
};

const steps = [
  {
    title: "Tell us about you",
    text: "Pick your skills, interests, and course level.",
  },
  {
    title: "We match projects",
    text: "The model ranks ideas by how well they fit your profile.",
  },
  {
    title: "Start building",
    text: "See the tools, difficulty, and time each project needs.",
  },
];

const sample = [
  { name: "Campus Lost & Found App", tags: ["React", "Firebase"], match: 94 },
  { name: "Study Group Matcher", tags: ["Python", "NLP"], match: 88 },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F8F8F8] px-6 py-12 font-sans">
      <BackgroundCircles />

      <div className="relative z-10 mx-auto grid w-full max-w-5xl items-center gap-12 lg:min-h-[80vh] lg:grid-cols-2">
        {/* Left: message and actions */}
        <section className="text-center lg:text-left">
          <div className="mb-6 flex justify-center lg:justify-start">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
              <Image
                src="/robot.png"
                width={56}
                height={56}
                alt=""
                priority
                className="object-contain"
              />
            </div>
          </div>

          <h1 className="text-3xl font-bold leading-tight text-[#1E293B] sm:text-4xl lg:text-5xl">
            Find a student project that fits you
          </h1>

          <p className="mx-auto mt-5 max-w-md text-base leading-7 text-[#64748B] sm:text-lg lg:mx-0">
            Share your skills, interests, and goals. Get a ranked list of
            project ideas you can start this week.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/auth/signup"
              className="flex h-14 items-center justify-center rounded-2xl bg-[#2563EB] px-8 text-base font-semibold text-white transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
            >
              Create free account
            </Link>
          </div>

          <div className="flex items-center gap-x-2 mt-6 text-sm text-[#64748B] sm:text-base">
            Already have an account?{" "}
          <div>
            <Link
              href="/auth/login"
              className="font-semibold text-[#2563EB] hover:underline focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
              >
              Log in
            </Link>
          </div>
          </div>
        </section>

        {/* Right: live-looking preview of the product output */}
        <section aria-label="Example recommendations" className="space-y-6">
          <div className="rounded-3xl bg-white p-5 shadow-lg">
            <p className="mb-4 text-sm font-semibold text-[#1E293B]">
              Example: Python, web dev, interested in health
            </p>
            <ul className="space-y-3">
              {sample.map((p) => (
                <li
                  key={p.name}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-[#F1F5F9] p-4"
                >
                  <div>
                    <p className="font-semibold text-[#1E293B]">{p.name}</p>
                    <p className="mt-1 text-sm text-[#64748B]">
                      {p.tags.join(", ")}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#DBEAFE] px-3 py-1 text-sm font-semibold text-[#1D4ED8]">
                    {p.match}% match
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <ol className="space-y-4">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-[#1E293B]">{s.title}</p>
                  <p className="text-sm text-[#64748B]">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}



// "use client";

// import BackgroundCircles from "./Components/BackgroundCircles";
// import Link from "next/link";
// import Image from "next/image";

// export default function Home() {
//   return (
//     <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F8F8F8] px-6 py-10 font-sans">

//       {/* Background Decorations */}
//       <BackgroundCircles />

//       <div className="relative z-10 w-full max-w-md text-center">

//         {/* Robot Icon */}
//         <div className="mb-8 flex justify-center">
//           <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg">

//             <Image
//               src="/robot.png"
//               width={70}
//               height={70}
//               alt="Robot"
//               className="object-contain"
//             />

//           </div>
//         </div>

//         {/* Heading */}
//         <h1 className="text-3xl font-bold leading-tight text-[#1E293B] sm:text-4xl">
//           AI-Based Student Project Recommendation System
//         </h1>

//         {/* Description */}
//         <p className="mt-5 text-base leading-7 text-[#64748B] sm:text-lg">
//           Discover smart project ideas tailored to your skills,
//           interests, and academic goals.
//         </p>

//         {/* Button */}
//         <div className="mt-10">
//           <Link href="/auth/signup">
//             <button className="h-14 w-full cursor-pointer rounded-2xl bg-[#2563EB] text-base font-semibold text-white transition hover:bg-blue-700">
//               Get Started
//             </button>
//           </Link>
//         </div>
      
//         <p className="mt-6 text-sm text-[#64748B] sm:text-base">
//           Already have an account?{" "}
//           <Link
//             href="/auth/login"
//             className="font-semibold text-[#2563EB] hover:underline"
//           >
//             Login
//           </Link>
//         </p>

//       </div>

//     </section>
//   );
// }


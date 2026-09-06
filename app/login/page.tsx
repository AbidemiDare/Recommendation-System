"use client";

import { useRouter } from "next/navigation";
import { getDemoStudent, loginDemoStudent } from "../lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const continueAsDemo = () => {
    const existingProfile = getDemoStudent();

    if (existingProfile && existingProfile.name) {
      router.push("/onboarding");
      return;
    }

    loginDemoStudent({
      id: "demo-student",
      name: "Demo Student",
      email: "demo@student.edu",
      matricNumber: "STU-0000",
      department: "Computer Science",
      level: "400 Level",
      interests: ["AI", "Web Development"],
      skills: ["JavaScript", "React", "Python"],
    });

    router.push("/onboarding");
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <button
        onClick={continueAsDemo}
        className="px-8 py-4 rounded-xl bg-blue-600 text-white"
      >
        Continue as Demo Student
      </button>
    </main>
  );
}
import { NextResponse } from "next/server";
import { getRecommendations } from "@/app/lib/gemini";
import { RecommendedProject } from "@/app/types/recommendation";

const FALLBACK_PROJECTS: RecommendedProject[] = [
  {
    id: "proj-1",
    title: "AI Medical Image Classifier",
    description:
      "Build a model that classifies medical images to support early diagnosis and clinical decision-making.",
    whyThisMatches:
      "Strong match for students with Python, ML, and healthcare interests who want hands-on AI + analytics work.",
    matchScore: 94,
    techStack: ["Python", "TensorFlow", "React"],
    difficulty: "Advanced",
    keyFeatures: [
      "Dataset preprocessing and image augmentation",
      "Model training and validation pipeline",
      "Interactive dashboard for results visualization",
    ],
  },
  {
    id: "proj-2",
    title: "E-Commerce Recommendation Engine",
    description:
      "Create a recommendation system that suggests relevant products based on user behavior and preferences.",
    whyThisMatches:
      "Perfect for students interested in personalization, data science, and product-driven AI systems.",
    matchScore: 91,
    techStack: ["Next.js", "Python", "TailwindCSS"],
    difficulty: "Intermediate",
    keyFeatures: [
      "Collaborative filtering logic",
      "Personalized product cards",
      "Analytics dashboard for click-through performance",
    ],
  },
  {
    id: "proj-3",
    title: "Student Progress Tracker",
    description:
      "Develop a system to track academic milestones, coursework progress, and performance insights for students.",
    whyThisMatches:
      "A practical fit for students who want a web app with analytics and a clear, real-world user story.",
    matchScore: 88,
    techStack: ["TypeScript", "React", "Node.js"],
    difficulty: "Beginner",
    keyFeatures: [
      "Progress dashboard and visual summaries",
      "Course and assignment tracking",
      "Alerts for academic milestones",
    ],
  },
  {
    id: "proj-4",
    title: "Intelligent Learning Assistant",
    description:
      "Build a chatbot or assistant that helps students find content, summarize notes, and recommend learning paths.",
    whyThisMatches:
      "Good fit for students who enjoy NLP, chat interfaces, and practical educational technology applications.",
    matchScore: 86,
    techStack: ["Python", "React", "FastAPI"],
    difficulty: "Intermediate",
    keyFeatures: [
      "Prompt-driven educational assistant",
      "Course material summarization",
      "Personalized study recommendations",
    ],
  },
  {
    id: "proj-5",
    title: "Cybersecurity Awareness Dashboard",
    description:
      "Design a security monitoring dashboard that highlights vulnerabilities, logs, and best-practice recommendations.",
    whyThisMatches:
      "Strong option for students with interest in cybersecurity, dashboards, and systems/defense tooling.",
    matchScore: 84,
    techStack: ["Node.js", "React", "Python"],
    difficulty: "Advanced",
    keyFeatures: [
      "Threat summary analytics",
      "Security posture reporting",
      "User-friendly alert monitoring view",
    ],
  },
  {
    id: "proj-6",
    title: "Smart Campus Navigation System",
    description:
      "Create a location-aware campus guide that helps students find facilities, services, and accessible routes.",
    whyThisMatches:
      "A practical fit for students interested in mobile development, maps, and user-centered campus technology.",
    matchScore: 82,
    techStack: ["Flutter", "Firebase", "Google Maps API"],
    difficulty: "Intermediate",
    keyFeatures: [
      "Interactive campus map",
      "Searchable facilities and services",
      "Accessible route suggestions",
    ],
  },
  {
    id: "proj-7",
    title: "IoT-Based Smart Agriculture Monitor",
    description:
      "Monitor soil and environmental conditions with connected sensors and a dashboard for agricultural decisions.",
    whyThisMatches:
      "Well suited to students interested in IoT, embedded systems, data collection, and sustainability.",
    matchScore: 80,
    techStack: ["Python", "Arduino", "MQTT", "React"],
    difficulty: "Advanced",
    keyFeatures: [
      "Real-time sensor readings",
      "Environmental threshold alerts",
      "Historical data visualizations",
    ],
  },
  {
    id: "proj-8",
    title: "Blockchain Certificate Verification Platform",
    description:
      "Build a tamper-resistant platform for issuing and verifying academic certificates online.",
    whyThisMatches:
      "A focused option for students interested in blockchain, security, and verifiable digital records.",
    matchScore: 78,
    techStack: ["TypeScript", "Next.js", "Solidity"],
    difficulty: "Advanced",
    keyFeatures: [
      "Certificate issuance workflow",
      "Public verification page",
      "Tamper-evident record references",
    ],
  },
];

const PROJECT_BY_ID = new Map(FALLBACK_PROJECTS.map((project) => [project.id, project]));

function normalizeStudentProfile(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return {
      name: "Student",
      interests: [],
      skills: [],
      department: "",
      level: "",
    };
  }

  const student = payload as Record<string, unknown>;

  return {
    name: typeof student.name === "string" ? student.name : "Student",
    interests: Array.isArray(student.interests)
      ? student.interests.filter((item): item is string => typeof item === "string")
      : typeof student.interests === "string"
        ? student.interests
            .split(",")
            .map((part) => part.trim())
            .filter(Boolean)
        : [],
    skills: Array.isArray(student.skills)
      ? student.skills.filter((item): item is string => typeof item === "string")
      : typeof student.skills === "string"
        ? student.skills
            .split(",")
            .map((part) => part.trim())
            .filter(Boolean)
        : [],
    department: typeof student.department === "string" ? student.department : "",
    level: typeof student.level === "string" ? student.level : "",
  };
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const student = normalizeStudentProfile(payload);

    const prompt = `
      You are an expert academic project advisor.

      Student profile:
      ${JSON.stringify(student, null, 2)}

      Recommend up to 5 final-year computer science project ideas that best fit this student.
      Use the following constraints:
      - Match the student's skills, interests, academic performance, and career goals closely.
      - Prioritize projects that are realistic for a university final-year deliverable.
      - Include a project title, concise description, short explanation of why it matches, match score from 70 to 99, relevant tech stack, difficulty, and 3 key features.
      - Return valid JSON in the format: { "recommendations": [ ... ] }
      - Rank and return as many suitable projects as possible, with a target of 8.
      - Only recommend projects from this catalog. Never invent a project or project ID.

      Available project catalog:
      ${JSON.stringify(FALLBACK_PROJECTS, null, 2)}
    `;

    try {
      const rawResponse = await getRecommendations(prompt);
      const parsed = JSON.parse(rawResponse);

      const recommendations = Array.isArray(parsed?.recommendations)
        ? parsed.recommendations
            .map((project: unknown): RecommendedProject | null => {
              if (!project || typeof project !== "object") return null;

              const candidate = project as Partial<RecommendedProject>;
              const catalogProject = PROJECT_BY_ID.get(String(candidate.id));
              if (!catalogProject) return null;

              return {
                ...catalogProject,
                whyThisMatches: candidate.whyThisMatches
                  ? String(candidate.whyThisMatches)
                  : catalogProject.whyThisMatches,
                matchScore: Number.isFinite(Number(candidate.matchScore))
                  ? Math.max(0, Math.min(100, Number(candidate.matchScore)))
                  : catalogProject.matchScore,
              };
            })
            .filter((project: RecommendedProject | null): project is RecommendedProject => project !== null)
        : [];

      if (recommendations.length > 0) {
        return NextResponse.json({
          recommendations,
          message:
            recommendations.length < 8
              ? `Only ${recommendations.length} suitable projects are available.`
              : undefined,
        });
      }
    } catch (modelError) {
      console.error("Gemini generation failed, using fallback recommendations:", modelError);
    }

    return NextResponse.json({
      recommendations: FALLBACK_PROJECTS,
      message:
        FALLBACK_PROJECTS.length < 8
          ? `Only ${FALLBACK_PROJECTS.length} suitable projects are available.`
          : undefined,
    });
  } catch (error) {
    console.error("Recommendation route error:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}



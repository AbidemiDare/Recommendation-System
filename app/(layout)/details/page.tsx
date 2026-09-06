"use client";

import { useState } from "react";
import {
  Bookmark,
  ChevronLeft,
  MoreHorizontal,
  Stethoscope,
} from "lucide-react";

const Details = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <ChevronLeft className="cursor-pointer text-slate-700" />

          <h2 className="font-bold text-lg text-slate-900">
            Project Details
          </h2>

          <MoreHorizontal className="text-slate-700" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32">
        {/* Project Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border">
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
              <Stethoscope
                size={40}
                className="text-green-600"
              />
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-xl text-slate-900 leading-7">
                AI-Powered Health Assistant Chatbot
              </h3>

              <p className="mt-2 text-green-600 font-semibold">
                95% Match
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                  AI
                </span>

                <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                  Healthcare
                </span>

                <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium">
                  NLP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-between mt-8 border-b">
          {["overview", "requirements", "techstack"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 capitalize font-medium transition-colors ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-500"
              }`}
            >
              {tab === "techstack" ? "Tech Stack" : tab}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-blue-600 mb-3">
              Project Overview
            </h3>

            <p className="text-slate-600 leading-7">
              An intelligent chatbot that provides preliminary
              health consultation and guidance using Natural
              Language Processing (NLP) techniques.
            </p>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">
                Objectives
              </h3>

              <ul className="list-disc pl-5 space-y-3 text-slate-600">
                <li>
                  Provide preliminary health consultation.
                </li>
                <li>
                  Understand user queries using NLP.
                </li>
                <li>
                  Suggest possible remedies and precautions.
                </li>
                <li>
                  Maintain user chat history.
                </li>
                <li>
                  Ensure privacy and security of user data.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Requirements */}
        {activeTab === "requirements" && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-blue-600 mb-3">
              Requirements
            </h3>

            <ul className="list-disc pl-5 space-y-3 text-slate-600">
              <li>Authentication System</li>
              <li>Chat Interface</li>
              <li>Database Integration</li>
              <li>Health Knowledge Base</li>
              <li>API Integration</li>
            </ul>
          </div>
        )}

        {/* Tech Stack */}
        {activeTab === "techstack" && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-blue-600 mb-3">
              Recommended Tech Stack
            </h3>

            <div className="flex flex-wrap gap-3">
              {[
                "Next.js",
                "TypeScript",
                "Node.js",
                "MongoDB",
                "OpenAI API",
                "Tailwind CSS",
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 bg-slate-100 rounded-full text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <button className="w-14 h-14 rounded-xl border flex items-center justify-center">
            <Bookmark />
          </button>

          <button className="flex-1 h-14 rounded-xl bg-blue-600 text-white font-semibold">
            I'm Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default Details;

// 'use client'

// import { Bookmark, ChevronLeft, Dot, Stethoscope } from "lucide-react";


// const Details = () => {
//         return (
//             <div className="w-full h-screen px-6 pt-5">
//                 <div className='flex items-center justify-between'>
//                     <ChevronLeft/>
//                     <h4 className="text-[16px] font-bold">Project Details</h4>
//                     <Dot />
//                 </div>

//                 {/* Project details */}
//                 <div>

//           {/* Project Card */}
//           <div className="mt-6">
//             <div className="flex justify-between gap-4">
//               <div className="w-24 h-24 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
//                 <Stethoscope size={64} />
//               </div>

//               <div className="flex-1">
//                 <h4 className="font-semibold text-2xl text-[#111827]">
//                   AI-Powered Health Assistant Chatbot
//                 </h4>

//                 <span className="font-semibold text-green-600 text-sm">
//                     95% Match
//                 </span>

//                 <div className="flex flex-wrap gap-2 mt-2">
//                   <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
//                     AI
//                   </span>

//                   <span className="px-2 py-1 bg-green-50 text-green-600 rounded-full text-xs">
//                     Healthcare
//                   </span>

//                   <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded-full text-xs">
//                     NLP
//                   </span>

//                 </div>
//               </div>


//             </div>
//           </div>
//           {/* ENd of project card */}

//           {/* Tabs */}
//           <div className="flex flex-row items-center justify-between mt-8">
//             <button>Overview</button>
//             <button>Requirements</button>
//             <button>Tech Stack</button>
//           </div>

//           {/* Tab details */}
//           <div className="mt-6">
//             <h3 className="text-[24px] font-semibold mb-2 text-blue-600">Project Overview</h3>
//             <p className="text-[16px] font-normal text-black leading-7">An intelligent chatbot that provides preliminary health consultation and guidance using natural language processing</p>

//             <div className="mt-6">
//                 <h3 className="text-[24px] font-semibold mb-2 text-blue-600">Objectives</h3>
//                 <ul className="list-disc px-6">
//                     <li>Provides preliminary health consultation</li>
//                     <li>Use NLP for understanding user queries</li>
//                     <li>Suggests possible remedies and precautions</li>
//                     <li>Maintain user chat history</li>
//                     <li>Ensure data privacy and security</li>
//                 </ul>
//             </div>

//             <div className="w-full absolute bottom-0 left-0 gap-y-10 px-6 flex flex-row justify-between items-center">
//                 <Bookmark size={32}/>
//                 <button className="bg-[#2563EB] mb-4 h-14 w-full rounded-[14px] text-[#ffffff] text-[16px] font-semibold">I&apos;m interested</button>
//             </div>
//           </div>
// {/* end of tab details */}

//              </div>

//          </div>
//     )
// }

// export default Details;
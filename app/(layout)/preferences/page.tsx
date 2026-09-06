// 'use client'
"use client";

import { useState } from "react";
import { ChevronLeft, Search } from "lucide-react";

const skills = [
  "Python",
  "JavaScript",
  "C++",
  "SQL",
  "React",
  "Node.js",
  "Machine Learning",
  "Data Analysis",
  "UI/UX Design",
  "Figma",
];

const Preferences = () => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((item) => item !== skill)
        : [...prev, skill]
    );
  };

  const filteredSkills = skills.filter((skill) =>
    skill.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 px-5 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <ChevronLeft className="cursor-pointer text-slate-700" />

        <h1 className="text-xl font-bold text-slate-900">
          Recommendations
        </h1>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          What are your skills?
        </h2>

        <p className="text-slate-500 mb-6">
          Select the skills you have or are familiar with.
        </p>

        {/* Search */}
        <div className="relative mb-8">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            placeholder="Search skills"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 rounded-xl border border-slate-200 bg-white pl-11 pr-4 outline-none focus:border-blue-500"
          />
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-3 mb-10">
          {filteredSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => toggleSkill(skill)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${
                  selectedSkills.includes(skill)
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-slate-200 text-slate-700 hover:border-blue-500"
                }`}
            >
              {skill}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          type="button"
          className="w-full h-14 rounded-[14px] bg-[#2563EB] text-white text-base font-semibold"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Preferences;


// import { ChevronLeft } from "lucide-react";


// const Preferences = () => {
//         return (
//             <div>
//               <div className="flex items-center justify-between mb-6">
//                 <ChevronLeft className="cursor-pointer text-slate-700" />

//         <h1 className="text-xl font-bold text-slate-900">
//           Recommendations
//         </h1>

//       </div>

//       <div>
//         <h3>What are your skills?? </h3>
//         <p>Select the skills you have or are familiar with.</p>

//         <div>
//           <input type="search" name="search" id="search" placeholder="Search skills" />
//         </div>

//         {/* Popular skills */}
//         <div>
//             {/* Skill */}
//             <div>
//               <h4>Python</h4>
//             </div>
//             {/* Skill */}
//             <div>
//               <h4>JavaScript</h4>
//             </div>
//             {/* Skill */}
//             <div>
//               <h4>C++</h4>
//             </div>
//             {/* Skill */}
//             <div>
//               <h4>SQL</h4>
//             </div>
//             {/* Skill */}
//             <div>
//               <h4>React</h4>
//             </div>
//             {/* Skill */}
//             <div>
//               <h4>Node.JS</h4>
//             </div>
//             {/* Skill */}
//             <div>
//               <h4>Machine Learning</h4>
//             </div>
//             {/* Skill */}
//             <div>
//               <h4>Data Analysis</h4>
//             </div>
//             {/* Skill */}
//             <div>
//               <h4>UI/UX Design</h4>
//             </div>
//             {/* Skill */}
//             <div>
//               <h4>Figma</h4>
//             </div>
//         </div>
//       {/* End of popular skills */}

//       <div>
//         <button type="submit" className="bg-[#2563EB] mb-4 h-14 w-full rounded-[14px] text-[#ffffff] text-[16px] font-semibold">Next</button>
//       </div>

//       </div>
//             </div>
//         )
// }


// export default Preferences;
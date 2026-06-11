'use client';

import {
  Bell,
  Menu,
  Stethoscope,
  Bookmark,
} from "lucide-react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import MenuBar from "../Components/Menubar";

const Dashboard = () => {
  return (
    <main className="min-h-screen bg-[#F8F8FB] px-6 pt-10 pb-24">

      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <button className="p-2 rounded-lg bg-white shadow-sm">
          <Menu size={20} />
        </button>

        <button className="p-2 rounded-lg bg-white shadow-sm">
          <Bell size={20} />
        </button>
      </header>

      {/* Welcome Section */}
      <section className="mb-6">
        <h1 className="text-3xl font-bold text-[#111827]">
          Hello, Adeniyi 👋
        </h1>

        <p className="mt-2 text-sm text-[#6B7280]">
          Let&apos;s find great project ideas for you.
        </p>
      </section>

      {/* AI Recommendation Banner */}
      <section
        className="relative overflow-hidden rounded-3xl p-5 mb-8"
        style={{
          background:
            "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
        }}
      >
        <div className="absolute -top-10 -right-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 right-12 w-24 h-24 rounded-full bg-white/5" />

        <div className="flex items-center justify-between gap-4 relative z-10">
          <div>
            <h2 className="text-white font-semibold text-lg">
              AI Recommendations
            </h2>

            <p className="text-white/80 text-sm mt-2 max-w-[220px]">
              Get personalized project ideas based on your profile and interests.
            </p>

            <button className="mt-4 bg-white text-indigo-600 font-medium px-4 py-2 rounded-xl text-sm">
              View Recommendations
            </button>
          </div>

          <Image
            src="/robot.png"
            width={100}
            height={100}
            alt="Robot"
            className="object-contain"
          />
        </div>
      </section>

      {/* At a Glance */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-[#111827] mb-4">
          At a Glance
        </h3>

        <div className="grid grid-cols-2 gap-4">

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <FcGoogle size={24} />
              </div>

              <div>
                <h4 className="text-xl font-bold text-[#111827]">
                  12
                </h4>

                <p className="text-sm text-[#6B7280]">
                  Recommended Projects
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                <Bookmark size={20} />
              </div>

              <div>
                <h4 className="text-xl font-bold text-[#111827]">
                  5
                </h4>

                <p className="text-sm text-[#6B7280]">
                  Saved Ideas
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Top Matches */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#111827]">
            Top Matches
          </h3>

          <button className="text-sm font-medium text-blue-600">
            View All
          </button>
        </div>

        <div className="space-y-4">

          {/* Project Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">

            <div className="flex justify-between gap-4">

              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                <Stethoscope size={22} />
              </div>

              <div className="flex-1">

                <h4 className="font-semibold text-[#111827]">
                  AI-Powered Health Assistant Chatbot
                </h4>

                <div className="flex flex-wrap gap-2 mt-2">

                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                    AI
                  </span>

                  <span className="px-2 py-1 bg-green-50 text-green-600 rounded-full text-xs">
                    Healthcare
                  </span>

                  <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded-full text-xs">
                    NLP
                  </span>

                </div>
              </div>

              <span className="font-semibold text-green-600 text-sm">
                95%
              </span>

            </div>
          </div>

          {/* Project Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">

            <div className="flex justify-between gap-4">

              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                <Stethoscope size={22} />
              </div>

              <div className="flex-1">

                <h4 className="font-semibold text-[#111827]">
                  Smart Medical Diagnosis System
                </h4>

                <div className="flex flex-wrap gap-2 mt-2">

                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                    AI
                  </span>

                  <span className="px-2 py-1 bg-green-50 text-green-600 rounded-full text-xs">
                    Healthcare
                  </span>

                  <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded-full text-xs">
                    ML
                  </span>

                </div>
              </div>

              <span className="font-semibold text-green-600 text-sm">
                91%
              </span>

            </div>
          </div>

        </div>
      </section>

      <MenuBar />
    </main>
  );
};

export default Dashboard;



// 'use client';

// import { Bell, Bookmark, Menu, Stethoscope } from "lucide-react";
// import Image from "next/image";
// import MenuBar from "../Components/Menubar";
// import { FcGoogle } from "react-icons/fc";

// const Dashboard = () => {
// return (
//     <div className="bg-[#] w-full h-screen px-6">
//       <div className="flex justify-between items-center pb-5 pt-10">
//         <Menu size={20}/>
//         <Bell size={20}/>
//       </div>

//       <div className="">
//         <h2 className="font-bold text-3xl text-black mb-2">Hello, Adeniyi 👋</h2>
//         <h5 className="text-sm text-[#687280]">Let&apos;s find great project ideas for you</h5>
//       </div>

//     {/* AI Recommendations */}
//       <div>
//           <div className="relative p-5 overflow-hidden my-4 rounded-2xl mx-auto flex items-center justify-between"
//       style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}>

//       {/* Decorative circles */} 
//       <div className="absolute -top-6 -right-4 w-28 h-28 rounded-full bg-white/10" />
//       <div className="absolute -bottom-8 right-16 w-20 h-20 rounded-full bg-white/5" />

//       {/* Text + Button */}
//       <div className="z-10 flex-1">
//         <h3 className="text-white font-medium text-[15px] mb-1">AI Recommendations</h3>
//         <p className="text-white/75 text-xs leading-relaxed mb-4">
//           Get personalized project ideas based on your profile.
//         </p>
//         <button className="bg-white text-indigo-600 text-xs font-medium px-4 py-2 rounded-xl">
//           View Recommendations
//         </button>
//       </div>

//       {/* Robot illustration — swap with your own image/SVG */}
//       <div className="z-10 w-20 ml-3 shrink-0">
//         <Image src="/robot.png" width={500} height={320} alt="AI robot" />
//       </div>
//       </div>
//     </div>

//       <div className="mt-4">
//           <h3 className="font-medium text-[18px] mb-1 text-blue/80">At a Glance</h3>
//           {/* Glance cards */}
//           <div className="grid grid-cols-2 gap-2 text-[13px]">

//             {/* Glance cards */}
//               <div className="oklch(80.9% 0.105 251.813) p-3 flex items-center justify-center gap-x-4">
//                 <span className="bg-[#24354AC]"><FcGoogle size={24}/></span>
//                 <div className="flex flex-col gap-y-1">
//                 <span className="text-black font-semibold text-[16px]">12</span>
//                 <h4 className="flex flex-col text-sm">Recommended Projects</h4>
//                 </div>
//               </div>
//             {/* End of glance card */}

//           </div>
//           {/* End of glance cards */}
//       </div>
//       {/* End of at a glance */}

//       <div>
//         <div className="flex justify-between items-center mt-6">
//           <h3>Top matches for you</h3>
//           <h4>View all</h4>
//         </div>

//         <div>
//           {/* card */}
//             <div>
//               <div className="flex items-center pt-3 pb-2 gap-y-2 justify-between">
//                 <div className=""><Stethoscope /></div>
//                 <div >
//                 <h4 className="text-[14px] flex items-center justify-center flex-wrap">AI-Powered Health Assistant Chatbot</h4>
//                 <div className="flex items-center justify-between">
//                   <p className="text-[12px]">AI</p>
//                   <p className="text-[12px]">Healthcare</p>
//                   <p className="text-[12px]">NLP</p>
//                 </div>
//                 </div>
//               <p className="text-[12px]">95% Match</p>
//               </div>
//             </div>
//           {/* End of card */}

//           {/* card */}
//             <div>
//               <div className="flex items-center pt-3 pb-2 gap-y-2 justify-between">
//                 <div className=""><Stethoscope /></div>
//                 <div >
//                 <h4 className="text-[18px] text-center flex items-center justify-center flex-wrap">AI-Powered Health Assistant Chatbot</h4>
//                 <div className="flex items-center justify-between">
//                   <p className="text-[12px]">AI</p>
//                   <p className="text-[12px]">Healthcare</p>
//                   <p className="text-[12px]">NLP</p>
//                 </div>
//                 </div>
//               <p className="text-[12px]">95% Match</p>
//               </div>
//             </div>
//             {/* End of card */}
            
//         </div>

//       <MenuBar/>
//       </div>

//     </div>
// )
// }

// export default Dashboard;
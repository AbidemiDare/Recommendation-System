"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { readStudentProfile } from "@/app/lib/auth";

const DEFAULT_NAME = "there";

export default function Header() {
  const [name, setName] = useState(DEFAULT_NAME);

  useEffect(() => {
    const student = readStudentProfile();
    if (student?.name) {
      setName(student.name.split(" ")[0]);
    }
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-slate-50/80 backdrop-blur lg:ml-0">
      <div className="flex items-center justify-between p-6">
        <div>
          <h2 className="text-2xl font-bold">Hello, {name} 👋</h2>
          <p className="text-gray-500">Let&apos;s find your next project.</p>
        </div>

        <button className="rounded-full bg-white p-3 shadow">
          <Bell size={20} />
        </button>
      </div>
    </header>
  );
}

// "use client";

// import { Bell } from "lucide-react";

// export default function Header() {
//   return (
//     <header className="sticky top-0 z-40 bg-slate-50/80 backdrop-blur lg:ml-0">

//       <div className="flex items-center justify-between p-6">

//         <div>

//           <h2 className="text-2xl font-bold">
//             Hello, {name} 👋
//           </h2>

//           <p className="text-gray-500">
//             Let&apos;s find your next project.
//           </p>

//         </div>

//         <button className="rounded-full bg-white p-3 shadow">

//           <Bell size={20} />

//         </button>

//       </div>

//     </header>
//   );
// }
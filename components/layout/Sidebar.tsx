"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/constants/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 bg-blue-900 text-white border-r">

      <div className="w-full p-6">

        <h1 className="text-2xl font-bold">
          AI Project
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Recommendation System
        </p>

        <nav className="mt-10 space-y-2">

          {navigation.map((item) => {

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition

                ${
                  pathname === item.href
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-slate-100 hover:text-black"
                }
                `}
              >

                <Icon size={20} />

                {item.title}

              </Link>
            );
          })}

        </nav>

      </div>

    </aside>
  );
}
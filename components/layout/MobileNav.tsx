"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/constants/navigation";

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="
      lg:hidden
      fixed
      bottom-0
      left-0
      right-0
      bg-white
      border-t
      flex
      justify-around
      py-3
      z-50"
    >
      {navigation.slice(0, 5).map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center text-xs

            ${
              pathname === item.href
                ? "text-indigo-600"
                : "text-gray-500"
            }
            `}
          >
            <Icon size={20} />

            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
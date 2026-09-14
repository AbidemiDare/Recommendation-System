import {
  Home,
  Compass,
  // Bookmark,
  User,
  BarChart3,
  // Settings,
} from "lucide-react";

export const navigation = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Recommendations",
    href: "/recommendations",
    icon: Compass,
  },
  {
    title: "Saved",
    href: "/saved",
    icon: BarChart3,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
];
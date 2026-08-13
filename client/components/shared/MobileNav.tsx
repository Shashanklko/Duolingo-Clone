"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, Target, ShoppingBag, User } from "lucide-react";

const items = [
  { label: "Learn", href: "/learn", icon: Home },
  { label: "Leaderboards", href: "/leaderboards", icon: Trophy },
  { label: "Quests", href: "/quests", icon: Target },
  { label: "Shop", href: "/shop", icon: ShoppingBag },
  { label: "Profile", href: "/profile", icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-[64px] bg-white dark:bg-[#131f24] border-t-2 border-gray-200 dark:border-gray-800 flex items-center justify-around z-40">
      {items.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center gap-y-1 p-2 transition ${
              isActive ? "text-[#1cb0f6]" : "text-gray-400"
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-[10px] font-extrabold uppercase tracking-wide">
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

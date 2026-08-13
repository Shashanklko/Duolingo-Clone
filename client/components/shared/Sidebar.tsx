"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Trophy, 
  User, 
  Target, 
  ShoppingBag, 
  MoreHorizontal,
  GraduationCap,
  ShieldCheck,
  Settings,
  HelpCircle,
  Sparkles,
  BookOpen
} from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import GuidebookModal from "@/components/modals/GuidebookModal";

const navItems = [
  { label: "Learn", href: "/learn", icon: Home },
  { label: "Leaderboards", href: "/leaderboards", icon: Trophy },
  { label: "Quests", href: "/quests", icon: Target },
  { label: "Shop", href: "/shop", icon: ShoppingBag },
  { label: "Profile", href: "/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isGuidebookOpen, setIsGuidebookOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close "More" popover on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <aside 
        className="hidden md:flex flex-col w-[256px] h-screen fixed left-0 top-0 px-4 py-6 z-40 border-r-2"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-color)",
        }}
      >
        {/* Logo Branding */}
        <Link href="/learn" className="flex items-center px-4 mb-6 group">
          <div className="relative w-[135px] h-[38px] transition-transform group-hover:scale-105">
            <Image 
              src="https://d35aaqx5ub95lt.cloudfront.net/images/splash/f92d5f2f7d56636846861c458c0d0b6c.svg" 
              alt="Duolingo Logo" 
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Main Navigation Links */}
        <nav className="flex flex-col gap-y-1.5 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-x-4 px-4 py-3 rounded-2xl font-bold uppercase tracking-wider text-sm transition-all duration-150 ${
                  isActive
                    ? "bg-[#1cb0f6]/10 text-[#1cb0f6] border-2 border-[#1cb0f6]"
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 border-2 border-transparent"
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? "text-[#1cb0f6]" : "text-gray-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Guidebook Button */}
          <button
            onClick={() => setIsGuidebookOpen(true)}
            className="flex items-center gap-x-4 px-4 py-3 rounded-2xl font-bold uppercase tracking-wider text-sm transition-all duration-150 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 border-2 border-transparent cursor-pointer w-full text-left"
          >
            <BookOpen className="w-6 h-6 text-gray-400" />
            <span>Guidebook</span>
          </button>

          {/* "More" Popover Menu Button */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className={`flex items-center gap-x-4 px-4 py-3 rounded-2xl font-bold uppercase tracking-wider text-sm transition-all duration-150 w-full cursor-pointer ${
                isMoreOpen
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-700"
                  : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 border-2 border-transparent"
              }`}
              type="button"
            >
              <MoreHorizontal className="w-6 h-6 text-gray-400" />
              <span>More</span>
            </button>

            {/* Popover Card */}
            {isMoreOpen && (
              <div 
                className="absolute left-0 bottom-14 w-[220px] rounded-2xl p-3 shadow-2xl border-2 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-y-1 z-50"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <Link
                  href="/english-test"
                  onClick={() => setIsMoreOpen(false)}
                  className="flex items-center gap-x-3 px-3 py-2.5 rounded-xl font-bold text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <GraduationCap className="w-5 h-5 text-[#ce82ff]" />
                  <span>English Test</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setIsMoreOpen(false)}
                  className="flex items-center gap-x-3 px-3 py-2.5 rounded-xl font-bold text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <Settings className="w-5 h-5 text-gray-400" />
                  <span>Settings</span>
                </Link>

                <Link
                  href="/quiz"
                  onClick={() => setIsMoreOpen(false)}
                  className="flex items-center gap-x-3 px-3 py-2.5 rounded-xl font-bold text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <span>Practice Quiz</span>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Guidebook Modal */}
      <GuidebookModal 
        isOpen={isGuidebookOpen} 
        onClose={() => setIsGuidebookOpen(false)} 
        title="Unit Guidebook"
        description="Key phrases and grammar tips"
      />
    </>
  );
}

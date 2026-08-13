"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import CourseDropdown from "@/components/shared/CourseDropdown";
import { useAuthModal } from "@/lib/store";

export default function Navbar() {
  const { openLogin } = useAuthModal();

  return (
    <header className="w-full h-[70px] border-b-2 border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 sm:px-10 bg-white dark:bg-[#131f24] sticky top-0 z-40">
      {/* Brand Logo */}
      <Link href="/" className="flex items-center gap-x-3 group">
        <div className="relative w-9 h-9 transition-transform group-hover:scale-110">
          <Image
            src="https://d35aaqx5ub95lt.cloudfront.net/images/duolingo-logo-icon.svg"
            alt="Duolingo Logo"
            fill
            className="object-contain"
          />
        </div>
        <span className="font-black text-2xl tracking-tighter text-[#58cc02]">
          duolingo
        </span>
      </Link>

      {/* Right Controls */}
      <div className="flex items-center gap-x-4">
        <CourseDropdown />
        <button
          onClick={openLogin}
          className="px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-widest bg-[#1cb0f6] text-white hover:bg-[#1899d6] border-b-4 border-[#1899d6] active:border-b-0 active:translate-y-[2px] transition cursor-pointer"
        >
          Sign In
        </button>
      </div>
    </header>
  );
}

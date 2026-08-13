"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#131f24] text-gray-400 py-10 border-t-2 border-[#202f36]">
      <div className="max-w-[1056px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-y-6">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 font-extrabold text-xs uppercase tracking-wider">
          <Link href="/learn" className="hover:text-white transition">Learn</Link>
          <Link href="/courses/all" className="hover:text-white transition">Courses</Link>
          <Link href="/leaderboards" className="hover:text-white transition">Leaderboard</Link>
          <Link href="/quests" className="hover:text-white transition">Quests</Link>
          <Link href="/shop" className="hover:text-white transition">Shop</Link>
          <Link href="/settings" className="hover:text-white transition">Settings</Link>
        </div>
        <p className="text-xs font-bold opacity-60">
          © {new Date().getFullYear()} Duolingo Clone. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

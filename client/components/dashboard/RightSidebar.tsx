"use client";

import Link from "next/link";
import { Lock, Zap } from "lucide-react";
import HeaderStats from "@/components/shared/HeaderStats";
import { useAuthModal } from "@/lib/store";
import { useUser } from "@/contexts/UserContext";

export function RightSidebar() {
  const { openLogin, openSignup } = useAuthModal();
  const { user, logoutUser, xp } = useUser();

  return (
    <div className="hidden lg:flex w-[368px] sticky top-6 flex-col gap-y-6 z-30">
      
      {/* Top Stats Row */}
      <HeaderStats />

      {/* Unlock Leaderboards Card */}
      <div 
        className="rounded-2xl p-6 flex flex-col gap-y-4 border-2"
        style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
      >
        <h3 className="font-extrabold text-lg" style={{ color: "var(--text-primary)" }}>
          Unlock Leaderboards!
        </h3>
        <div className="flex items-center gap-x-4">
          <div className="w-[60px] h-[60px] bg-[#ffc800]/20 rounded-2xl flex items-center justify-center text-[#ffc800]">
            <Lock className="w-8 h-8 stroke-[2.5]" />
          </div>
          <p className="text-sm font-bold opacity-80 leading-tight" style={{ color: "var(--text-secondary)" }}>
            Complete 3 lessons to enter your first weekly league!
          </p>
        </div>
      </div>

      {/* Daily Quests Card */}
      <div 
        className="rounded-2xl p-6 flex flex-col gap-y-4 border-2"
        style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-lg" style={{ color: "var(--text-primary)" }}>
            Daily Quests
          </h3>
          <Link href="/quests" className="uppercase font-extrabold text-[#1cb0f6] text-[13px] hover:text-[#1899d6] transition">
            View All
          </Link>
        </div>
        <div className="flex items-center gap-x-4 mt-2">
          <Zap className="w-10 h-10 text-yellow-400 fill-yellow-400" />
          <div className="flex flex-col w-full gap-y-2">
            <span className="font-extrabold text-sm" style={{ color: "var(--text-primary)" }}>
              Earn 50 XP
            </span>
            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-4 relative overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-yellow-400 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (xp / 50) * 100)}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold text-gray-700 dark:text-gray-200 z-10">
                {Math.min(50, xp)} / 50
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile State Card: Guest vs Authenticated User */}
      {user.isGuest ? (
        <div 
          className="rounded-2xl p-6 flex flex-col gap-y-4 border-2"
          style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
        >
          <h3 className="font-extrabold text-lg" style={{ color: "var(--text-primary)" }}>
            Create a profile to save your progress!
          </h3>
          <div className="flex flex-col gap-y-3 mt-2">
            <button 
              onClick={openSignup}
              className="w-full py-3.5 rounded-xl bg-[#58cc02] hover:bg-[#46a302] text-white font-extrabold uppercase tracking-widest text-xs transition-all cursor-pointer border-b-4 border-[#46a302] active:border-b-0 active:translate-y-[2px]"
            >
              Create a Profile
            </button>
            <button 
              onClick={openLogin}
              className="w-full py-3.5 rounded-xl bg-[#1cb0f6] hover:bg-[#1899d6] text-white font-extrabold uppercase tracking-widest text-xs transition-all cursor-pointer border-b-4 border-[#1899d6] active:border-b-0 active:translate-y-[2px]"
            >
              Sign In
            </button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-[#58cc02]/40 bg-[#58cc02]/10 rounded-2xl p-6 flex flex-col gap-y-4">
          <div className="flex items-center gap-x-4">
            <div className="w-12 h-12 rounded-full bg-[#58cc02] text-white font-extrabold text-xl flex items-center justify-center shadow-md">
              👤
            </div>
            <div className="flex flex-col">
              <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">{user.name}</h3>
              <p className="text-xs font-bold text-[#58cc02]">
                {user.email || "Logged in • Progress saved"}
              </p>
            </div>
          </div>
          <button
            onClick={logoutUser}
            className="w-full py-2.5 rounded-xl border-2 border-red-500/40 text-[#ff4b4b] hover:bg-red-500/10 font-extrabold uppercase tracking-widest text-xs transition cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      )}
      
    </div>
  );
}

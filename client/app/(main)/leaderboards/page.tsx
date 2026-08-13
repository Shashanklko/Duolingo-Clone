"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Flame, Gem, Heart, Trophy, Crown, ArrowUp } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import CourseDropdown from "@/components/shared/CourseDropdown";

const SEEDED_LEARNERS = [
  { rank: 1, name: "Carlos M.", xp: 520, avatar: "👨🏻‍🦱", badge: "🥇", isCurrent: false },
  { rank: 2, name: "Elena R.", xp: 410, avatar: "👩🏻", badge: "🥈", isCurrent: false },
  { rank: 3, name: "Duo Fanatic", xp: 320, avatar: "🦉", badge: "🥉", isCurrent: false },
  { rank: 4, name: "Sofia T.", xp: 210, avatar: "👩🏼", badge: null, isCurrent: false },
  { rank: 5, name: "Mateo G.", xp: 180, avatar: "🧔🏻‍♂️", badge: null, isCurrent: false },
  { rank: 6, name: "Lucia B.", xp: 140, avatar: "👧🏻", badge: null, isCurrent: false },
  { rank: 7, name: "Alejandro C.", xp: 110, avatar: "👨🏽", badge: null, isCurrent: false },
  { rank: 8, name: "Isabella K.", xp: 95, avatar: "👩🏽", badge: null, isCurrent: false },
];

export default function LeaderboardsPage() {
  const { xp, streak, gems, hearts, isSuper } = useUser();

  // Combine user into leaderboard list dynamically
  const currentUserEntry = {
    rank: 0,
    name: "You (Learner)",
    xp: xp,
    avatar: "👤",
    isCurrent: true,
    badge: null as string | null,
  };

  const allLearners = [...SEEDED_LEARNERS, currentUserEntry]
    .sort((a, b) => b.xp - a.xp)
    .map((player, idx) => {
      let badge = null;
      if (idx === 0) badge = "🥇";
      if (idx === 1) badge = "🥈";
      if (idx === 2) badge = "🥉";
      return { ...player, rank: idx + 1, badge };
    });

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6 max-w-[1056px] mx-auto pt-6 pb-12">
      {/* Right Sidebar */}
      <div className="hidden lg:flex w-[368px] sticky top-6 flex-col gap-y-6">
        <div className="flex items-center justify-between px-4 w-full h-[40px]">
          <CourseDropdown />
          <div className="flex items-center gap-x-2 text-gray-400 font-bold p-2 rounded-xl">
            <Flame className="w-5 h-5 fill-none text-gray-400" />
            <span>{streak}</span>
          </div>
          <div className="flex items-center gap-x-2 text-[#1cb0f6] font-bold p-2 rounded-xl">
            <Gem className="w-5 h-5 fill-[#1cb0f6] text-[#1cb0f6]" />
            <span>{gems}</span>
          </div>
          <div className="flex items-center gap-x-2 text-[#ff4b4b] font-bold p-2 rounded-xl">
            <Heart className="w-5 h-5 fill-[#ff4b4b] text-[#ff4b4b]" />
            <span>{isSuper ? "∞" : hearts}</span>
          </div>
        </div>

        {/* Info Card */}
        <div
          className="rounded-2xl p-6 flex flex-col gap-y-3 relative overflow-hidden"
          style={{ border: "2px solid var(--border-color)" }}
        >
          <span className="text-[#1cb0f6] font-bold text-xs uppercase tracking-widest">
            SAPPHIRE LEAGUE
          </span>
          <h3 className="font-extrabold text-lg" style={{ color: "var(--text-primary)" }}>
            Top 3 advance to Ruby League!
          </h3>
          <p className="text-sm font-medium leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Complete lessons, earn XP, and climb the leaderboard before Sunday!
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full flex flex-col items-center">
        <div className="w-full max-w-[600px] flex flex-col items-center gap-y-6">
          
          {/* Header Trophy Banner */}
          <div className="flex flex-col items-center gap-y-3 mt-4 text-center">
            <div className="w-20 h-20 rounded-full bg-[#ffc800]/20 border-4 border-[#ffc800] flex items-center justify-center text-[#ffc800] shadow-lg">
              <Trophy className="w-10 h-10 fill-current" />
            </div>
            <h1 className="text-3xl font-extrabold" style={{ color: "var(--text-primary)" }}>
              Sapphire League
            </h1>
            <p className="text-sm font-bold text-[#58cc02] flex items-center gap-x-1">
              <ArrowUp className="w-4 h-4 stroke-[3]" />
              Top 3 players advance to the next league
            </p>
          </div>

          <div className="w-full h-[2px] bg-gray-200 dark:bg-gray-800 my-2" />

          {/* Leaderboard Table */}
          <div className="w-full flex flex-col gap-y-2">
            {allLearners.map((player) => (
              <div
                key={`${player.name}-${player.rank}`}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all ${
                  player.isCurrent
                    ? "border-[#1cb0f6] bg-[#1cb0f6]/10 font-extrabold shadow-sm"
                    : "border-gray-200 dark:border-[#2f434c] bg-white dark:bg-[#131f24]"
                }`}
              >
                <div className="flex items-center gap-x-4">
                  {/* Rank Number / Medal */}
                  <span className="w-8 text-center font-extrabold text-lg" style={{ color: "var(--text-muted)" }}>
                    {player.badge || player.rank}
                  </span>

                  {/* Avatar */}
                  <span className="text-3xl">{player.avatar}</span>

                  {/* Name */}
                  <span className="font-extrabold text-base" style={{ color: "var(--text-primary)" }}>
                    {player.name}
                  </span>
                </div>

                {/* XP */}
                <div className="font-extrabold text-sm" style={{ color: "var(--text-muted)" }}>
                  {player.xp} XP
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

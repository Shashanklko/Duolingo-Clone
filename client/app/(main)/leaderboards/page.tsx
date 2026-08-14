"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Flame, Gem, Heart, Trophy, ArrowUp } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { fetchLeaderboardApi } from "@/lib/api";
import HeaderStats from "@/components/shared/HeaderStats";

export default function LeaderboardsPage() {
  const { xp, streak, gems, hearts, isSuper } = useUser();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboardApi(1).then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        const AVATARS = ["🦉", "👩🏻", "👨🏻‍🦱", "👦🏽", "👧🏼", "🧔🏻‍♂️", "🧑🏾‍🦱", "👩🏽", "👨🏼", "👧🏻"];
        const formatted = data.map((item, idx) => {
          let badge = null;
          if (idx === 0) badge = "🥇";
          if (idx === 1) badge = "🥈";
          if (idx === 2) badge = "🥉";
          return {
            rank: item.rank || idx + 1,
            name: item.is_current_user ? "You (Learner)" : item.name,
            xp: item.is_current_user ? xp : item.xp,
            avatar: item.is_current_user ? "👤" : (AVATARS[idx % AVATARS.length]),
            badge,
            isCurrent: item.is_current_user,
          };
        });
        setLeaderboard(formatted.sort((a, b) => b.xp - a.xp));
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [xp]);

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6 max-w-[1056px] mx-auto pt-6 pb-12 font-sans">
      {/* Right Sidebar */}
      <div className="hidden lg:flex w-[368px] sticky top-6 flex-col gap-y-6">
        <HeaderStats />

        {/* Info Card */}
        <div
          className="rounded-2xl p-6 flex flex-col gap-y-3 relative overflow-hidden"
          style={{ border: "2px solid var(--border-color, #202f36)" }}
        >
          <span className="text-[#1cb0f6] font-bold text-xs uppercase tracking-widest">
            SAPPHIRE LEAGUE
          </span>
          <h3 className="font-extrabold text-lg" style={{ color: "var(--text-primary, #ffffff)" }}>
            Top 3 advance to Ruby League!
          </h3>
          <p className="text-sm font-medium leading-relaxed" style={{ color: "var(--text-secondary, #9ca3af)" }}>
            Complete lessons, earn XP, and climb the leaderboard before Sunday!
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full flex flex-col items-center">
        {/* Mobile Header Stats */}
        <div className="lg:hidden w-full max-w-[600px] mb-4">
          <HeaderStats />
        </div>

        <div className="w-full max-w-[600px] flex flex-col items-center gap-y-6">
          
          {/* Header Trophy Banner */}
          <div className="flex flex-col items-center gap-y-3 mt-4 text-center">
            <div className="w-20 h-20 rounded-full bg-[#ffc800]/20 border-4 border-[#ffc800] flex items-center justify-center text-[#ffc800] shadow-lg">
              <Trophy className="w-10 h-10 fill-current" />
            </div>
            <h1 className="text-3xl font-extrabold" style={{ color: "var(--text-primary, #ffffff)" }}>
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
            {leaderboard.map((player, idx) => (
              <div
                key={`${player.name}-${idx}`}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all ${
                  player.isCurrent
                    ? "border-[#1cb0f6] bg-[#1cb0f6]/10 font-extrabold shadow-sm ring-2 ring-[#1cb0f6]/30"
                    : "border-gray-200 dark:border-[#2f434c] bg-white dark:bg-[#131f24]"
                }`}
              >
                <div className="flex items-center gap-x-4">
                  {/* Rank Number / Medal */}
                  <span className="w-8 text-center font-extrabold text-lg" style={{ color: "var(--text-muted, #9ca3af)" }}>
                    {player.badge || player.rank}
                  </span>

                  {/* Avatar */}
                  <span className="text-3xl">{player.avatar}</span>

                  {/* Name */}
                  <span className="font-extrabold text-base" style={{ color: "var(--text-primary, #ffffff)" }}>
                    {player.name}
                  </span>
                </div>

                {/* XP */}
                <div className="font-extrabold text-sm" style={{ color: "var(--text-muted, #9ca3af)" }}>
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

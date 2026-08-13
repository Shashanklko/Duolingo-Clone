"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Flame, 
  Gem, 
  Heart, 
  Zap,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  Trophy,
  Gift
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import HeaderStats from "@/components/shared/HeaderStats";
import { playCorrectSound } from "@/lib/sounds";

export default function QuestsPage() {
  const { xp, streak, completedLessons, addGems } = useUser();
  const [claimedQuests, setClaimedQuests] = useState<string[]>([]);

  const quests = [
    {
      id: "quest_10_xp",
      title: "Earn 10 XP",
      target: 10,
      current: Math.min(10, xp),
      rewardGems: 20,
      isComplete: xp >= 10,
      icon: <Zap className="w-8 h-8 text-yellow-400 fill-yellow-400 flex-shrink-0" />
    },
    {
      id: "quest_50_xp",
      title: "Earn 50 XP",
      target: 50,
      current: Math.min(50, xp),
      rewardGems: 50,
      isComplete: xp >= 50,
      icon: <Award className="w-8 h-8 text-orange-400 fill-orange-400 flex-shrink-0" />
    },
    {
      id: "quest_lessons",
      title: "Complete 2 Lessons",
      target: 2,
      current: Math.min(2, completedLessons.length),
      rewardGems: 30,
      isComplete: completedLessons.length >= 2,
      icon: <Sparkles className="w-8 h-8 text-[#1cb0f6] fill-[#1cb0f6] flex-shrink-0" />
    },
    {
      id: "quest_streak",
      title: "Reach a 3-Day Streak",
      target: 3,
      current: Math.min(3, streak),
      rewardGems: 40,
      isComplete: streak >= 3,
      icon: <Flame className="w-8 h-8 text-[#ff9600] fill-[#ff9600] flex-shrink-0" />
    },
  ];

  const handleClaim = (questId: string, rewardGems: number) => {
    if (claimedQuests.includes(questId)) return;
    addGems(rewardGems);
    playCorrectSound();
    setClaimedQuests((prev) => [...prev, questId]);
  };

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6 max-w-[1056px] mx-auto pt-6 pb-12">
      {/* Right Sidebar for desktop */}
      <div className="hidden lg:flex w-[368px] sticky top-6 flex-col gap-y-6">
        
        {/* Top Stats Row */}
        <HeaderStats />

        {/* Monthly Challenges Card */}
        <div 
          className="rounded-2xl p-6 flex flex-col gap-y-4 relative overflow-hidden"
          style={{ border: "2px solid var(--border-color)", backgroundColor: "var(--bg-secondary)" }}
        >
          <div className="flex justify-between items-start z-10">
            <h3 className="font-extrabold text-lg" style={{ color: "var(--text-primary)" }}>
              Monthly Badge Challenge!
            </h3>
          </div>
          
          <div className="z-10 flex flex-col gap-y-6">
            <p className="text-sm font-bold opacity-80" style={{ color: "var(--text-secondary)" }}>
              Complete 10 quests this month to earn the exclusive August Duo Badge!
            </p>
            <Link
              href="/learn"
              className="w-full py-3 text-center rounded-xl bg-[#1cb0f6] hover:bg-[#1899d6] text-white font-extrabold uppercase tracking-widest text-sm transition-all border-b-4 border-[#1899d6] active:border-b-0 active:translate-y-[2px]"
            >
              Start a Lesson
            </Link>
          </div>

          <div className="absolute top-4 right-4 w-[70px] h-[70px]">
             <div className="w-full h-full bg-yellow-400 rounded-full border-4 border-yellow-500 flex items-center justify-center shadow-xl rotate-12">
               <Trophy className="w-8 h-8 text-white fill-white" />
             </div>
          </div>
        </div>
        
        {/* Footer Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-4 px-4 text-xs font-bold text-gray-500 uppercase">
          <Link href="#" className="hover:text-gray-300 transition">About</Link>
          <Link href="#" className="hover:text-gray-300 transition">Blog</Link>
          <Link href="#" className="hover:text-gray-300 transition">Store</Link>
          <Link href="#" className="hover:text-gray-300 transition">Efficacy</Link>
          <Link href="#" className="hover:text-gray-300 transition">Careers</Link>
          <Link href="#" className="hover:text-gray-300 transition">Investors</Link>
          <Link href="#" className="hover:text-gray-300 transition">Terms</Link>
          <Link href="#" className="hover:text-gray-300 transition">Privacy</Link>
        </div>
      </div>

      {/* Main Quests Area */}
      <div className="flex-1 w-full flex flex-col items-center">
        <div className="w-full max-w-[600px] flex flex-col gap-y-8">
          
          {/* Welcome Banner */}
          <div className="w-full bg-gradient-to-r from-[#ce82ff] to-[#a53bfa] rounded-3xl p-6 sm:p-8 flex items-center justify-between shadow-xl relative overflow-hidden min-h-[160px] text-white">
            <div className="flex flex-col gap-y-3 z-10 w-2/3">
              <div className="flex items-center gap-x-2 text-yellow-300 font-extrabold text-xs uppercase tracking-widest">
                <Gift className="w-4 h-4 fill-current" />
                DAILY REWARDS
              </div>
              <h1 className="text-3xl font-extrabold">Daily Quests</h1>
              <p className="text-sm font-bold opacity-90 leading-relaxed">
                Complete daily quests to earn bonus gems and streak protection!
              </p>
            </div>
            
            <div className="absolute -right-4 bottom-0 w-[140px] h-[140px] z-10">
              <img src="https://d35aaqx5ub95lt.cloudfront.net/images/goals/2b5a211d830a24fab92e291d50f65d1d.svg" alt="Duo Chest" className="w-full h-full object-contain" />
            </div>
          </div>
          
          {/* Daily Quests Header */}
          <div className="flex items-center justify-between w-full border-b-2 border-gray-200 dark:border-gray-800 pb-4">
            <h2 className="text-2xl font-extrabold" style={{ color: "var(--text-primary)" }}>Active Quests</h2>
            <div className="flex items-center gap-x-2 text-yellow-500 font-extrabold uppercase tracking-wider text-xs">
              <Clock className="w-4 h-4" />
              <span>Refreshes Daily</span>
            </div>
          </div>

          {/* Quests List */}
          <div className="flex flex-col gap-y-4">
            {quests.map((q) => {
              const isClaimed = claimedQuests.includes(q.id);
              const pct = Math.min(100, Math.floor((q.current / q.target) * 100));

              return (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  style={{ 
                    backgroundColor: "var(--bg-secondary)", 
                    borderColor: "var(--border-color)" 
                  }}
                >
                  <div className="flex items-center gap-x-4">
                    {q.icon}
                    <div className="flex flex-col gap-y-1.5 w-full min-w-[200px]">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-base" style={{ color: "var(--text-primary)" }}>
                          {q.title}
                        </span>
                        <span className="text-xs font-extrabold text-gray-400">
                          {q.current} / {q.target}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3.5 relative overflow-hidden">
                        <div 
                          className="absolute inset-y-0 left-0 bg-yellow-400 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Claim Button / Status */}
                  <div className="flex items-center justify-end">
                    {isClaimed ? (
                      <div className="flex items-center gap-x-1.5 text-[#58cc02] font-extrabold text-sm uppercase tracking-wide px-4 py-2 rounded-xl bg-[#58cc02]/10 border-2 border-[#58cc02]">
                        <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                        Claimed
                      </div>
                    ) : q.isComplete ? (
                      <button
                        onClick={() => handleClaim(q.id, q.rewardGems)}
                        className="px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-widest bg-[#58cc02] text-white hover:bg-[#46a302] border-b-4 border-[#46a302] active:border-b-0 active:translate-y-[2px] transition cursor-pointer flex items-center gap-x-1.5"
                      >
                        <Gem className="w-4 h-4 fill-current" />
                        <span>Claim +{q.rewardGems}</span>
                      </button>
                    ) : (
                      <div className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 font-extrabold text-xs uppercase tracking-wider border-2 border-gray-200 dark:border-gray-700">
                        In Progress
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}

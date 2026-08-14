"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Flame, Gem, Heart, Trophy, User, Calendar, ShieldCheck, Award } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import HeaderStats from "@/components/shared/HeaderStats";

export default function ProfilePage() {
  const { xp, streak, gems, hearts, isSuper, achievements, unlockedUnits } = useUser();

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6 max-w-[1056px] mx-auto pt-6 pb-12">
      {/* Right Sidebar */}
      <div className="hidden lg:flex w-[368px] sticky top-6 flex-col gap-y-6">
        <HeaderStats />
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full flex flex-col items-center">
        {/* Mobile Header Stats */}
        <div className="lg:hidden w-full max-w-[600px] mb-4">
          <HeaderStats />
        </div>

        <div className="w-full max-w-[600px] flex flex-col gap-y-8">
          
          {/* User Header Profile Card */}
          <div className="w-full flex items-center justify-between p-6 sm:p-8 rounded-3xl border-2 border-gray-200 dark:border-[#2f434c] bg-white dark:bg-[#131f24]">
            <div className="flex items-center gap-x-6">
              <div className="w-20 h-20 rounded-full bg-[#58cc02]/20 border-4 border-[#58cc02] flex items-center justify-center text-4xl shadow-md">
                👤
              </div>
              <div className="flex flex-col gap-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold" style={{ color: "var(--text-primary)" }}>
                  Learner
                </h1>
                <div className="flex items-center gap-x-2 text-xs font-bold text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Joined August 2026</span>
                </div>
                <div className="flex items-center gap-x-2 text-xs font-bold text-[#1cb0f6] mt-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Learning Spanish • Unit {unlockedUnits.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="flex flex-col gap-y-4">
            <h2 className="text-xl font-extrabold" style={{ color: "var(--text-primary)" }}>
              Statistics
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Day Streak */}
              <div className="p-5 rounded-2xl border-2 border-gray-200 dark:border-[#2f434c] bg-white dark:bg-[#131f24] flex items-center gap-x-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950 text-[#ff9600] flex items-center justify-center">
                  <Flame className="w-7 h-7 fill-current" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-2xl" style={{ color: "var(--text-primary)" }}>
                    {streak}
                  </span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                    Day Streak
                  </span>
                </div>
              </div>

              {/* Total XP */}
              <div className="p-5 rounded-2xl border-2 border-gray-200 dark:border-[#2f434c] bg-white dark:bg-[#131f24] flex items-center gap-x-4">
                <div className="w-12 h-12 rounded-2xl bg-yellow-100 dark:bg-yellow-950 text-[#ffc800] flex items-center justify-center">
                  <Trophy className="w-7 h-7 fill-current" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-2xl" style={{ color: "var(--text-primary)" }}>
                    {xp}
                  </span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                    Total XP
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements & Badges System */}
          <div className="flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold" style={{ color: "var(--text-primary)" }}>
                Achievements
              </h2>
              <div className="text-xs font-bold text-[#1cb0f6] uppercase tracking-wide flex items-center gap-x-1">
                <Award className="w-4 h-4" />
                <span>{achievements.filter((a) => a.unlocked).length}/{achievements.length} Unlocked</span>
              </div>
            </div>

            <div className="flex flex-col gap-y-4">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${
                    ach.unlocked
                      ? "border-[#58cc02] bg-[#58cc02]/10"
                      : "border-gray-200 dark:border-[#2f434c] bg-white dark:bg-[#131f24]"
                  }`}
                >
                  <div className="flex items-center gap-x-4">
                    <span className="text-4xl">{ach.icon}</span>
                    <div className="flex flex-col gap-y-1">
                      <h3 className="font-extrabold text-base" style={{ color: "var(--text-primary)" }}>
                        {ach.title}
                      </h3>
                      <p className="text-xs font-bold text-gray-400">
                        {ach.description}
                      </p>
                      
                      {/* Progress Bar */}
                      <div className="w-48 bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden mt-1">
                        <div
                          className="bg-[#58cc02] h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(ach.progress / ach.maxProgress) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="font-extrabold text-xs text-gray-400">
                    {ach.progress}/{ach.maxProgress}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

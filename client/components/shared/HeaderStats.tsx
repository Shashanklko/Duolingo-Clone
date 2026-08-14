"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Flame, Gem, Heart, Lock, Sparkles, Check } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import CourseDropdown from "@/components/shared/CourseDropdown";

export default function HeaderStats() {
  const { streak, gems, hearts, isSuper, refillHearts, spendGems, buySuper, practicedToday, streakHistory } = useUser();

  const [activePopover, setActivePopover] = useState<"streak" | "gems" | "hearts" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActivePopover(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRefillHearts = () => {
    if (hearts >= 5) return;
    if (spendGems(350)) {
      refillHearts();
      setActivePopover(null);
    }
  };

  const handleGetSuper = () => {
    buySuper();
    setActivePopover(null);
  };

  // Compute dynamic 7-day week (Sunday to Saturday) relative to today
  const weekDays = React.useMemo(() => {
    const now = new Date();
    const currentDayIdx = now.getDay();
    return ["S", "M", "T", "W", "T", "F", "S"].map((dayName, idx) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (currentDayIdx - idx));
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const dayNum = String(d.getDate()).padStart(2, "0");
      const dateStr = `${y}-${m}-${dayNum}`;
      const isToday = idx === currentDayIdx;
      const isPast = idx < currentDayIdx;
      const isFuture = idx > currentDayIdx;

      const daysAgo = currentDayIdx - idx;
      const coveredByStreak = streak > 0 && (
        practicedToday ? (daysAgo >= 0 && daysAgo < streak) : (daysAgo > 0 && daysAgo <= streak)
      );
      const isCompleted = isToday ? practicedToday : (streakHistory.includes(dateStr) || coveredByStreak);

      return {
        name: dayName,
        dateStr,
        isToday,
        isPast,
        isFuture,
        isCompleted,
      };
    });
  }, [streak, practicedToday, streakHistory]);

  return (
    <div className="flex items-center justify-between px-4 w-full h-[40px] relative z-30" ref={containerRef}>
      {/* 1. Course Flag Dropdown */}
      <CourseDropdown />

      {/* 2. Streak Button & Popover */}
      <div className="relative">
        <button
          onClick={() => setActivePopover(activePopover === "streak" ? null : "streak")}
          className={`flex items-center gap-x-2 font-bold p-2 rounded-xl transition cursor-pointer ${
            activePopover === "streak"
              ? "bg-[#ff9600]/10 text-[#ff9600]"
              : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
          type="button"
        >
          <Flame
            className={`w-5 h-5 transition-all ${
              practicedToday
                ? "fill-[#ff9600] text-[#ff9600] drop-shadow-[0_0_8px_rgba(255,150,0,0.7)] scale-110"
                : streak > 0
                ? "fill-[#ff9600]/70 text-[#ff9600]"
                : "text-gray-400"
            }`}
          />
          <span style={{ color: "var(--text-primary)" }}>{streak}</span>
        </button>

        {activePopover === "streak" && (
          <div
            className="absolute top-12 left-1/2 -translate-x-1/2 z-[100] w-[310px] rounded-2xl p-5 shadow-2xl border-2 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-y-4"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-color)",
            }}
          >
            {/* Arrow Tail */}
            <div
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-t-2 border-l-2"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
              }}
            />

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h3 className="font-extrabold text-xl" style={{ color: "var(--text-primary)" }}>
                  {streak} day streak
                </h3>
                <p className="text-xs font-bold text-gray-400 mt-1 leading-snug">
                  {practicedToday
                    ? "You completed a lesson today! Keep the flame burning tomorrow."
                    : streak > 0
                    ? "Do a lesson today to keep your streak going!"
                    : "Do a lesson today to start your streak!"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/60 flex items-center justify-center text-[#ff9600] flex-shrink-0">
                <Flame className={`w-7 h-7 ${streak > 0 ? "fill-current" : ""}`} />
              </div>
            </div>

            {/* Days Row */}
            <div className="bg-gray-100 dark:bg-[#131f24] p-3 rounded-2xl flex items-center justify-around">
              {weekDays.map((day, idx) => (
                <div key={idx} className="flex flex-col items-center gap-y-1.5">
                  <span
                    className={`text-xs font-black ${
                      day.isToday
                        ? "text-[#ff9600]"
                        : day.isCompleted
                        ? "text-[#ff9600]/80"
                        : "text-gray-400"
                    }`}
                  >
                    {day.name}
                  </span>
                  {day.isCompleted ? (
                    <div className="w-7 h-7 rounded-full bg-[#ff9600] text-white flex items-center justify-center shadow-md shadow-orange-500/25 animate-in zoom-in duration-200">
                      <Flame className="w-4 h-4 fill-white" />
                    </div>
                  ) : day.isToday ? (
                    <div className="w-7 h-7 rounded-full border-2 border-[#ff9600] border-dashed bg-[#ff9600]/10 flex items-center justify-center animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-[#ff9600]" />
                    </div>
                  ) : day.isPast ? (
                    <div className="w-7 h-7 rounded-full border-2 border-gray-300 dark:border-gray-700 bg-transparent flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:border-gray-700" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full border-2 border-gray-200 dark:border-gray-800 bg-transparent" />
                  )}
                </div>
              ))}
            </div>

            {/* Streak Society Card */}
            {streak >= 7 ? (
              <div className="p-4 rounded-2xl border-2 border-yellow-400/40 bg-yellow-400/10 flex items-center gap-x-4">
                <Sparkles className="w-8 h-8 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <h4 className="font-extrabold text-sm text-yellow-500">
                    Streak Society Member 🎉
                  </h4>
                  <p className="text-xs font-bold opacity-80" style={{ color: "var(--text-secondary)" }}>
                    You have achieved a 7+ day streak! Exclusive VIP rewards active.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl border-2 border-gray-200 dark:border-[#2f434c] flex items-center gap-x-4">
                <Lock className="w-8 h-8 text-gray-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <h4 className="font-extrabold text-sm" style={{ color: "var(--text-primary)" }}>
                    Streak Society
                  </h4>
                  <p className="text-xs font-bold text-gray-400">
                    Reach a 7 day streak to join the Streak Society ({7 - streak} days to go).
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Gems Button & Popover */}
      <div className="relative">
        <button
          onClick={() => setActivePopover(activePopover === "gems" ? null : "gems")}
          className={`flex items-center gap-x-2 text-[#1cb0f6] font-bold p-2 rounded-xl transition cursor-pointer ${
            activePopover === "gems" ? "bg-[#1cb0f6]/10" : "hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
          type="button"
        >
          <Gem className="w-5 h-5 fill-[#1cb0f6]" />
          <span>{gems}</span>
        </button>

        {activePopover === "gems" && (
          <div
            className="absolute top-12 left-1/2 -translate-x-1/2 z-[100] w-[280px] rounded-2xl p-5 shadow-2xl border-2 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-y-4"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-color)",
            }}
          >
            {/* Arrow Tail */}
            <div
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-t-2 border-l-2"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
              }}
            />

            <div className="flex items-center gap-x-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-[#1cb0f6] text-3xl">
                💎
              </div>
              <div className="flex flex-col">
                <h3 className="font-extrabold text-xl" style={{ color: "var(--text-primary)" }}>
                  Gems
                </h3>
                <p className="text-xs font-bold text-gray-400">
                  You have {gems} gems
                </p>
              </div>
            </div>

            <Link
              href="/shop"
              onClick={() => setActivePopover(null)}
              className="w-full py-3 rounded-xl font-extrabold text-center uppercase tracking-widest text-sm bg-[#1cb0f6] hover:bg-[#1899d6] text-white border-b-4 border-[#1899d6] active:border-b-0 active:translate-y-[2px] transition"
            >
              Go to Shop
            </Link>
          </div>
        )}
      </div>

      {/* 4. Hearts Button & Popover */}
      <div className="relative">
        <button
          onClick={() => setActivePopover(activePopover === "hearts" ? null : "hearts")}
          className={`flex items-center gap-x-2 text-[#ff4b4b] font-bold p-2 rounded-xl transition cursor-pointer ${
            activePopover === "hearts" ? "bg-[#ff4b4b]/10" : "hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
          type="button"
        >
          <Heart className="w-5 h-5 fill-[#ff4b4b]" />
          <span>{isSuper ? "∞" : hearts}</span>
        </button>

        {activePopover === "hearts" && (
          <div
            className="absolute top-12 right-0 z-[100] w-[300px] rounded-2xl p-5 shadow-2xl border-2 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-y-4"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-color)",
            }}
          >
            {/* Arrow Tail */}
            <div
              className="absolute -top-2 right-6 w-3 h-3 rotate-45 border-t-2 border-l-2"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
              }}
            />

            <h3 className="font-extrabold text-xl text-center" style={{ color: "var(--text-primary)" }}>
              Hearts
            </h3>

            {/* Visual Hearts Bar */}
            <div className="flex justify-center gap-x-2 my-1 text-2xl">
              {isSuper ? (
                <span className="font-extrabold text-[#ce82ff] text-3xl">∞</span>
              ) : (
                Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < hearts ? "text-[#ff4b4b]" : "opacity-20 grayscale"}>
                    ❤️
                  </span>
                ))
              )}
            </div>

            <p className="text-xs font-bold text-center text-gray-400">
              {isSuper
                ? "You have unlimited hearts with Super Duolingo!"
                : hearts === 5
                ? "You still have full hearts! Keep on learning"
                : `Next heart in 4 hours`}
            </p>

            {/* Action Items */}
            <div className="flex flex-col gap-y-2 mt-2">
              {!isSuper ? (
                <button
                  onClick={handleGetSuper}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-[#2f434c] flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                >
                  <div className="flex items-center gap-x-2">
                    <Sparkles className="w-5 h-5 text-[#ce82ff] fill-current" />
                    <span className="font-extrabold text-sm uppercase tracking-wide" style={{ color: "var(--text-primary)" }}>
                      Unlimited Hearts
                    </span>
                  </div>
                  <span className="font-extrabold text-xs text-[#ce82ff] uppercase tracking-wide">
                    Get Super
                  </span>
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-[#ce82ff]/10 border-2 border-[#ce82ff] flex items-center justify-between text-[#ce82ff] font-extrabold text-xs uppercase tracking-wide">
                  <span>Super Active</span>
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}

              {!isSuper && hearts < 5 && (
                <button
                  onClick={handleRefillHearts}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-[#2f434c] flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                >
                  <div className="flex items-center gap-x-2">
                    <Heart className="w-5 h-5 text-[#ff4b4b] fill-current" />
                    <span className="font-extrabold text-sm uppercase tracking-wide" style={{ color: "var(--text-primary)" }}>
                      Refill Hearts
                    </span>
                  </div>
                  <div className="flex items-center gap-x-1 font-extrabold text-xs text-[#1cb0f6]">
                    <Gem className="w-4 h-4 fill-current" />
                    <span>350</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

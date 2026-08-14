"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Flame, Gem, Heart, Shield, Zap, Sparkles, Check, Store } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { playCorrectSound, playWrongSound } from "@/lib/sounds";
import { purchaseShopItemApi } from "@/lib/api";
import HeaderStats from "@/components/shared/HeaderStats";

export default function ShopPage() {
  const { gems, hearts, isSuper, refillHearts, spendGems, buySuper } = useUser();
  const [streakFreezeCount, setStreakFreezeCount] = useState(0);
  const [doubleXpActive, setDoubleXpActive] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleRefillHearts = async () => {
    if (hearts >= 5) {
      setMessage("Your hearts are already full!");
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    if (spendGems(350)) {
      refillHearts();
      playCorrectSound();
      purchaseShopItemApi("hearts_refill", 350);
      setMessage("Hearts refilled!");
    } else {
      playWrongSound();
      setMessage("Not enough gems!");
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleBuyStreakFreeze = async () => {
    if (spendGems(200)) {
      setStreakFreezeCount((prev) => prev + 1);
      playCorrectSound();
      purchaseShopItemApi("streak_freeze", 200);
      setMessage("Streak Freeze equipped!");
    } else {
      playWrongSound();
      setMessage("Not enough gems!");
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleBuyDoubleXp = async () => {
    if (spendGems(150)) {
      setDoubleXpActive(true);
      playCorrectSound();
      purchaseShopItemApi("double_xp", 150);
      setMessage("2x XP Boost activated for 15 mins!");
    } else {
      playWrongSound();
      setMessage("Not enough gems!");
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleGetSuper = () => {
    buySuper();
    playCorrectSound();
    purchaseShopItemApi("super_sub", 0);
    setMessage("Welcome to Super Duolingo! Unlimited Hearts activated!");
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6 max-w-[1056px] mx-auto pt-6 pb-12 font-sans">
      {/* Right Sidebar Stats */}
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
          
          {/* Notification Toast */}
          {message && (
            <div className="w-full bg-[#1cb0f6] text-white font-extrabold text-center py-3 rounded-2xl shadow-lg animate-in fade-in duration-200">
              {message}
            </div>
          )}

          {/* Super Duolingo Hero Card */}
          <div className="w-full rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#ce82ff] to-[#a53bfa] text-white flex flex-col gap-y-4 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-x-2 text-yellow-300 font-extrabold uppercase text-xs tracking-widest">
              <Sparkles className="w-4 h-4 fill-current" />
              SUPER DUOLINGO
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold leading-snug">
              {isSuper ? "You have Super Duolingo!" : "Upgrade to Super for Unlimited Hearts"}
            </h2>

            <p className="text-sm font-bold opacity-90 leading-relaxed max-w-[400px]">
              {isSuper
                ? "Enjoy unlimited hearts, zero ads, and unlimited legendary attempts!"
                : "No interruptions, zero ads, and unlimited lesson attempts."}
            </p>

            {!isSuper ? (
              <button
                onClick={handleGetSuper}
                className="w-fit mt-2 px-8 py-3.5 rounded-2xl font-extrabold uppercase tracking-widest text-sm bg-white text-[#a53bfa] hover:bg-gray-100 border-b-4 border-gray-300 active:border-b-0 active:translate-y-[4px] transition cursor-pointer shadow-md"
              >
                Get Unlimited Hearts
              </button>
            ) : (
              <div className="flex items-center gap-x-2 bg-white/20 w-fit px-4 py-2 rounded-xl font-bold text-sm">
                <Check className="w-5 h-5 text-yellow-300 stroke-[3]" />
                Super Active
              </div>
            )}
          </div>

          {/* Power-Ups Section */}
          <div className="flex flex-col gap-y-4">
            <h2 className="text-xl font-extrabold" style={{ color: "var(--text-primary)" }}>
              Power-Ups
            </h2>
            <div className="w-full h-[2px] bg-gray-200 dark:bg-gray-800" />

            {/* Refill Hearts */}
            <div className="flex items-center justify-between p-5 rounded-2xl border-2 border-gray-200 dark:border-[#2f434c] bg-white dark:bg-[#131f24]">
              <div className="flex items-center gap-x-4">
                <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950 flex items-center justify-center text-[#ff4b4b]">
                  <Heart className="w-8 h-8 fill-current" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-extrabold text-base" style={{ color: "var(--text-primary)" }}>
                    Refill Hearts
                  </h3>
                  <p className="text-xs font-bold text-gray-500">
                    Get full hearts so you can worry less about mistakes
                  </p>
                </div>
              </div>

              <button
                onClick={handleRefillHearts}
                className="px-5 py-2.5 rounded-xl font-extrabold text-sm uppercase tracking-wide bg-[#1cb0f6] text-white hover:bg-[#1899d6] border-b-4 border-[#1899d6] active:border-b-0 active:translate-y-[2px] transition cursor-pointer flex items-center gap-x-2"
              >
                <Gem className="w-4 h-4 fill-current" />
                <span>350</span>
              </button>
            </div>

            {/* Streak Freeze */}
            <div className="flex items-center justify-between p-5 rounded-2xl border-2 border-gray-200 dark:border-[#2f434c] bg-white dark:bg-[#131f24]">
              <div className="flex items-center gap-x-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-[#1cb0f6]">
                  <Shield className="w-8 h-8 fill-current" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-extrabold text-base" style={{ color: "var(--text-primary)" }}>
                    Streak Freeze {streakFreezeCount > 0 && `(${streakFreezeCount} Equipped)`}
                  </h3>
                  <p className="text-xs font-bold text-gray-500">
                    Allows your streak to remain intact if you miss a day
                  </p>
                </div>
              </div>

              <button
                onClick={handleBuyStreakFreeze}
                className="px-5 py-2.5 rounded-xl font-extrabold text-sm uppercase tracking-wide bg-[#1cb0f6] text-white hover:bg-[#1899d6] border-b-4 border-[#1899d6] active:border-b-0 active:translate-y-[2px] transition cursor-pointer flex items-center gap-x-2"
              >
                <Gem className="w-4 h-4 fill-current" />
                <span>200</span>
              </button>
            </div>

            {/* Double XP Boost */}
            <div className="flex items-center justify-between p-5 rounded-2xl border-2 border-gray-200 dark:border-[#2f434c] bg-white dark:bg-[#131f24]">
              <div className="flex items-center gap-x-4">
                <div className="w-14 h-14 rounded-2xl bg-yellow-100 dark:bg-yellow-950 flex items-center justify-center text-[#ffc800]">
                  <Zap className="w-8 h-8 fill-current" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-extrabold text-base" style={{ color: "var(--text-primary)" }}>
                    2x XP Boost {doubleXpActive && "(Active)"}
                  </h3>
                  <p className="text-xs font-bold text-gray-500">
                    Earn double XP for 15 minutes of lesson practice
                  </p>
                </div>
              </div>

              <button
                onClick={handleBuyDoubleXp}
                className="px-5 py-2.5 rounded-xl font-extrabold text-sm uppercase tracking-wide bg-[#1cb0f6] text-white hover:bg-[#1899d6] border-b-4 border-[#1899d6] active:border-b-0 active:translate-y-[2px] transition cursor-pointer flex items-center gap-x-2"
              >
                <Gem className="w-4 h-4 fill-current" />
                <span>150</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

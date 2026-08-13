"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthModal } from "@/lib/store";

export default function HeroSection() {
  const { openSignup, openLogin } = useAuthModal();

  return (
    <section className="w-full max-w-[1056px] mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-12">
      {/* Duo Owl Mascot Illustration */}
      <div className="relative w-[280px] sm:w-[360px] h-[280px] sm:h-[360px] flex items-center justify-center">
        <Image
          src="https://d35aaqx5ub95lt.cloudfront.net/images/splash/540026e64c3db36034e3415c1fb9cb68.svg"
          alt="Duolingo World"
          fill
          className="object-contain animate-bounce"
        />
      </div>

      {/* Hero Call to Action Text & Buttons */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-[480px]">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-gray-900 dark:text-white leading-tight">
          The free, fun, and effective way to learn a language!
        </h1>

        <div className="mt-8 flex flex-col w-full gap-y-3 sm:max-w-[330px]">
          <Link
            href="/learn"
            className="w-full py-4 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] text-white font-extrabold uppercase tracking-widest text-sm transition-all border-b-4 border-[#46a302] active:border-b-0 active:translate-y-[2px] shadow-lg text-center"
          >
            Get Started
          </Link>

          <button
            onClick={openLogin}
            className="w-full py-4 rounded-2xl bg-white dark:bg-[#131f24] hover:bg-gray-100 dark:hover:bg-gray-800 text-[#1cb0f6] font-extrabold uppercase tracking-widest text-sm transition-all border-2 border-gray-200 dark:border-[#202f36] border-b-4 border-b-gray-300 dark:border-b-[#202f36] active:border-b-2 active:translate-y-[2px] cursor-pointer"
          >
            I ALREADY HAVE AN ACCOUNT
          </button>
        </div>
      </div>
    </section>
  );
}

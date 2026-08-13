"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthModal } from "@/lib/store";

export default function HeroSection() {
  const { openLogin } = useAuthModal();

  return (
    <section className="w-full max-w-[1056px] mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-12">
      {/* Duo Characters Splash Graphic */}
      <div className="relative w-[300px] sm:w-[420px] h-[300px] sm:h-[420px] flex items-center justify-center">
        <Image
          src="https://d35aaqx5ub95lt.cloudfront.net/images/splash/540026e64c3db36034e3415c1fb9cb68.svg"
          alt="Duolingo Characters"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Hero Content Right Side */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-[500px]">
        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-gray-800 leading-[1.2]">
          The most fun way to learn languages, chess, and more!
        </h1>

        <div className="mt-8 flex flex-col w-full gap-y-3 sm:max-w-[340px]">
          <Link
            href="/learn"
            className="w-full py-3.5 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] text-white font-extrabold uppercase tracking-widest text-sm transition-all border-b-4 border-[#46a302] active:border-b-0 active:translate-y-[2px] shadow-md text-center flex items-center justify-center"
          >
            GET STARTED
          </Link>

          <button
            onClick={openLogin}
            className="w-full py-3.5 rounded-2xl bg-white hover:bg-gray-50 text-[#1cb0f6] font-extrabold uppercase tracking-widest text-sm transition-all border-2 border-gray-200 border-b-4 border-b-gray-300 active:border-b-2 active:translate-y-[2px] cursor-pointer"
            type="button"
          >
            I ALREADY HAVE AN ACCOUNT
          </button>
        </div>
      </div>
    </section>
  );
}

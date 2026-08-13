"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function BottomCtaSection() {
  return (
    <section className="w-full max-w-[1056px] mx-auto px-6 py-20 flex flex-col items-center text-center gap-y-6">
      <div className="relative w-[180px] h-[180px]">
        <Image
          src="https://d35aaqx5ub95lt.cloudfront.net/images/splash/540026e64c3db36034e3415c1fb9cb68.svg"
          alt="Start Learning"
          fill
          className="object-contain"
        />
      </div>

      <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white max-w-[600px]">
        Learn a language with Duolingo anytime, anywhere.
      </h2>

      <Link
        href="/learn"
        className="w-full sm:w-[320px] py-4 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] text-white font-extrabold uppercase tracking-widest text-sm transition-all border-b-4 border-[#46a302] active:border-b-0 active:translate-y-[2px] shadow-lg"
      >
        Get Started Now
      </Link>
    </section>
  );
}

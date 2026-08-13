"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function EnglishTestSection() {
  return (
    <section className="w-full bg-[#ce82ff]/10 py-16 border-y-2 border-[#ce82ff]/20">
      <div className="max-w-[1056px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex flex-col text-center md:text-left max-w-[500px] gap-y-3">
          <div className="flex items-center justify-center md:justify-start gap-x-2 text-[#ce82ff] font-extrabold uppercase text-xs tracking-widest">
            <GraduationCap className="w-5 h-5" />
            DUOLINGO ENGLISH TEST
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">
            Certify your English proficiency online
          </h2>
          <p className="text-sm font-bold opacity-80 text-gray-600 dark:text-gray-300 leading-relaxed">
            Accepted by over 4,500 universities worldwide. Fast, affordable, and convenient.
          </p>
        </div>

        <Link
          href="/english-test"
          className="px-8 py-4 rounded-2xl font-extrabold uppercase tracking-widest text-sm bg-[#ce82ff] hover:bg-[#b565e6] text-white border-b-4 border-[#9d4dce] active:border-b-0 active:translate-y-[2px] transition shadow-lg"
        >
          Take The Test
        </Link>
      </div>
    </section>
  );
}

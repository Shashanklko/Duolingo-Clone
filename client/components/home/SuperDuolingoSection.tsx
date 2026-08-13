"use client";

import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function SuperDuolingoSection() {
  return (
    <section className="w-full bg-[#131f24] py-16 text-white border-y-2 border-[#202f36]">
      <div className="max-w-[1056px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex flex-col text-center md:text-left max-w-[500px] gap-y-4">
          <div className="flex items-center justify-center md:justify-start gap-x-2 text-yellow-300 font-extrabold uppercase text-xs tracking-widest">
            <Sparkles className="w-4 h-4 fill-current" />
            SUPER DUOLINGO
          </div>
          <h2 className="text-3xl font-black">
            Upgrade your progress with Super Duolingo
          </h2>
          <p className="text-sm font-bold opacity-80 leading-relaxed">
            Fast-track your language goals with zero ads, unlimited hearts, and personalized practice review.
          </p>
        </div>

        <Link
          href="/shop"
          className="px-8 py-4 rounded-2xl font-extrabold uppercase tracking-widest text-sm bg-gradient-to-r from-[#ce82ff] to-[#a53bfa] hover:opacity-90 text-white border-b-4 border-[#8923d8] active:border-b-0 active:translate-y-[2px] transition shadow-xl"
        >
          Try Super For Free
        </Link>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import Image from "next/image";

export default function LearnAnytimeSection() {
  return (
    <section className="w-full max-w-[1056px] mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-12">
      <div className="flex flex-col text-center md:text-left max-w-[500px]">
        <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
          effective and efficient
        </h2>
        <p className="mt-4 text-base font-bold text-gray-500 leading-relaxed">
          Our courses effectively and efficiently teach reading, listening, and speaking skills. Check out our latest research!
        </p>
      </div>

      <div className="relative w-[260px] h-[260px] flex items-center justify-center flex-shrink-0">
        <Image
          src="https://d35aaqx5ub95lt.cloudfront.net/images/splash/2d216503c1edfe7e71350a80e15f8e52.svg"
          alt="Research"
          fill
          className="object-contain"
        />
      </div>
    </section>
  );
}

"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ALL_COURSES } from "@/lib/store";

export default function LanguageRibbon() {
  const topLanguages = ALL_COURSES.slice(0, 10);

  return (
    <div className="w-full border-y-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-[#131f24] py-4 overflow-x-auto">
      <div className="max-w-[1056px] mx-auto px-6 flex items-center justify-between gap-x-8 min-w-max">
        {topLanguages.map((course) => (
          <Link
            key={course.id}
            href={`/learn`}
            className="flex items-center gap-x-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition group"
          >
            <Image
              src={`https://flagcdn.com/w40/${course.flagCode}.png`}
              alt={course.name}
              width={28}
              height={20}
              className="rounded-sm object-cover border"
              onError={(e) => {
                (e.target as any).src = "https://flagcdn.com/w40/un.png";
              }}
            />
            <span className="font-extrabold text-xs uppercase tracking-wider text-gray-600 dark:text-gray-300 group-hover:text-[#1cb0f6] transition">
              {course.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

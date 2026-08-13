"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const RIBBON_ITEMS = [
  { name: "ENGLISH", flagCode: "us" },
  { name: "CHESS", icon: "♟️" },
  { name: "MATH", icon: "➕" },
  { name: "SPANISH", flagCode: "es" },
  { name: "FRENCH", flagCode: "fr" },
  { name: "GERMAN", flagCode: "de" },
  { name: "ITALIAN", flagCode: "it" },
  { name: "PORTUGUESE", flagCode: "br" },
  { name: "JAPANESE", flagCode: "jp" },
  { name: "ARABIC", flagCode: "sa" },
  { name: "KOREAN", flagCode: "kr" },
  { name: "RUSSIAN", flagCode: "ru" },
];

export default function LanguageRibbon() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -240 : 240;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full border-t border-b border-gray-200 bg-white py-3.5 relative overflow-hidden">
      <div className="max-w-[1056px] mx-auto px-10 flex items-center relative">
        {/* Left Scroll Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 z-10 p-1 text-gray-400 hover:text-gray-600 transition cursor-pointer"
          type="button"
        >
          <ChevronLeft className="w-5 h-5 stroke-[3]" />
        </button>

        {/* Scrollable Ribbon */}
        <div
          ref={scrollRef}
          className="flex items-center gap-x-8 overflow-x-auto scrollbar-none py-1 scroll-smooth w-full px-4"
          style={{ scrollbarWidth: "none" }}
        >
          {RIBBON_ITEMS.map((item) => (
            <Link
              key={item.name}
              href="/learn"
              className="flex items-center gap-x-2.5 flex-shrink-0 hover:opacity-80 transition group"
            >
              {item.flagCode ? (
                <Image
                  src={`https://flagcdn.com/w40/${item.flagCode}.png`}
                  alt={item.name}
                  width={24}
                  height={18}
                  className="rounded-sm object-cover border border-gray-300"
                  onError={(e) => {
                    (e.target as any).src = "https://flagcdn.com/w40/un.png";
                  }}
                />
              ) : (
                <span className="text-base">{item.icon}</span>
              )}
              <span className="font-black text-[13px] uppercase tracking-wider text-gray-500 group-hover:text-gray-900 transition">
                {item.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Right Scroll Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 z-10 p-1 text-gray-400 hover:text-gray-600 transition cursor-pointer"
          type="button"
        >
          <ChevronRight className="w-5 h-5 stroke-[3]" />
        </button>
      </div>
    </div>
  );
}

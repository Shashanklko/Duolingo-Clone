"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Globe } from "lucide-react";
import { useAuthModal } from "@/lib/store";

export default function Navbar() {
  const { openLogin } = useAuthModal();
  const [siteLangOpen, setSiteLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("ENGLISH");

  const siteLanguages = ["ENGLISH", "HINDI (हिंदी)", "SPANISH (ESPAÑOL)", "FRENCH (FRANÇAIS)", "GERMAN (DEUTSCH)"];

  return (
    <header className="w-full h-[70px] bg-white border-b border-gray-200 flex items-center justify-between px-6 sm:px-12 sticky top-0 z-50">
      {/* Brand Logo */}
      <Link href="/" className="flex items-center gap-x-3 group">
        <div className="relative w-9 h-9 transition-transform group-hover:scale-105">
          <Image
            src="https://d35aaqx5ub95lt.cloudfront.net/images/duolingo-logo-icon.svg"
            alt="Duolingo Logo"
            fill
            className="object-contain"
          />
        </div>
        <span className="font-black text-2xl tracking-tighter text-[#58cc02]">
          duolingo
        </span>
      </Link>

      {/* Right Site Language Dropdown */}
      <div className="relative">
        <button
          onClick={() => setSiteLangOpen(!siteLangOpen)}
          className="flex items-center gap-x-2 text-xs font-extrabold tracking-widest text-gray-400 hover:text-gray-600 transition uppercase cursor-pointer py-2 px-3 rounded-xl hover:bg-gray-100"
          type="button"
        >
          <span>SITE LANGUAGE: {currentLang}</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {siteLangOpen && (
          <div className="absolute top-12 right-0 z-[100] w-[220px] bg-white rounded-2xl p-2 shadow-2xl border-2 border-gray-200 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-y-1">
            {siteLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setCurrentLang(lang.split(" ")[0]);
                  setSiteLangOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold uppercase transition ${
                  currentLang === lang.split(" ")[0]
                    ? "bg-[#1cb0f6]/10 text-[#1cb0f6]"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

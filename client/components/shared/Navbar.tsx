"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useAuthModal, useCourseStore } from "@/lib/store";
import { useTranslation } from "react-i18next";

export const LANGUAGES = [
  { code: "US", name: "English", country: "us" },
  { code: "IN", name: "Hindi (हिंदी)", country: "in" },
  { code: "ES", name: "Español", country: "es" },
  { code: "FR", name: "Français", country: "fr" },
  { code: "DE", name: "Deutsch", country: "de" },
  { code: "IT", name: "Italiano", country: "it" },
  { code: "BR", name: "Português", country: "br" },
  { code: "JP", name: "日本語", country: "jp" },
  { code: "KR", name: "한국어", country: "kr" },
  { code: "AR", name: "العربية", country: "sa" },
  { code: "BD", name: "বাংলা", country: "bd" },
  { code: "CZ", name: "Čeština", country: "cz" },
  { code: "GR", name: "Ελληνικά", country: "gr" },
  { code: "HU", name: "Magyar", country: "hu" },
  { code: "ID", name: "Bahasa Indonesia", country: "id" },
  { code: "NL", name: "Nederlands", country: "nl" },
  { code: "IN2", name: "ਪੰਜਾਬੀ", country: "in" },
  { code: "PL", name: "Polski", country: "pl" },
  { code: "RO", name: "Română", country: "ro" },
  { code: "RU", name: "Русский", country: "ru" },
  { code: "SE", name: "Svenska", country: "se" },
  { code: "IN3", name: "தமிழ்", country: "in" },
  { code: "IN4", name: "తెలుగు", country: "in" },
  { code: "PH", name: "Tagalog", country: "ph" },
  { code: "TR", name: "Türkçe", country: "tr" },
  { code: "UA", name: "Українською", country: "ua" },
  { code: "AR2", name: "اردو", country: "pk" },
  { code: "VN", name: "Tiếng Việt", country: "vn" },
  { code: "CN", name: "中文", country: "cn" },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { setSpeakerLanguage } = useCourseStore();
  const [siteLangOpen, setSiteLangOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    function handleScroll() {
      setScrolled(window.scrollY > 250);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeCode = mounted ? i18n.language : "US";
  const currentLang = LANGUAGES.find((l) => l.code === activeCode) || LANGUAGES.find((l) => l.code === "US")!;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSiteLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (code: string) => {
    const mappedCode = code.replace(/\d+$/, "") === "IN" ? "IN" :
                       code === "AR2" ? "AR" : code;
    i18n.changeLanguage(mappedCode);
    setSpeakerLanguage(mappedCode.toLowerCase());
    setSiteLangOpen(false);
  };

  return (
    <header className="w-full h-[70px] bg-white border-b border-gray-200 sticky top-0 z-50 flex items-center justify-center transition-all">
      <div className="w-full max-w-[1056px] px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center group">
          <div className="relative w-[130px] h-[38px] transition-transform group-hover:scale-105">
            <Image
              src="https://d35aaqx5ub95lt.cloudfront.net/images/splash/f92d5f2f7d56636846861c458c0d0b6c.svg"
              alt="Duolingo Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Right Header Area */}
        <div className="flex items-center">
          
          {scrolled ? (
            /* Scrolled: REPLACES SITE LANGUAGE WITH GET STARTED BUTTON */
            <Link
              href="/courses/all"
              className="px-6 py-2.5 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] text-white font-extrabold uppercase tracking-widest text-xs transition-all border-b-4 border-[#46a302] active:border-b-0 active:translate-y-[2px] shadow-md cursor-pointer animate-in fade-in zoom-in-95 duration-200"
            >
              {t("hero.getStarted") || "GET STARTED"}
            </Link>
          ) : (
            /* Not Scrolled: SITE LANGUAGE Dropdown Menu */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setSiteLangOpen(!siteLangOpen)}
                className="flex items-center gap-x-2 text-xs font-extrabold tracking-widest text-gray-400 hover:text-gray-600 transition uppercase cursor-pointer py-2 px-3 rounded-xl hover:bg-gray-100"
                type="button"
              >
                <span>SITE LANGUAGE: {currentLang.name.split(" ")[0].toUpperCase()}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${siteLangOpen ? "rotate-180" : ""}`} />
              </button>

              {siteLangOpen && (
                <div className="absolute top-14 right-0 z-[100] w-[540px] sm:w-[580px] bg-white rounded-3xl p-5 shadow-2xl border-2 border-gray-200 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-3 px-1">
                    Site language:
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-[65vh] overflow-y-auto pr-1 scrollbar-thin">
                    {LANGUAGES.map((lang) => {
                      const isActive = currentLang.code === lang.code;
                      return (
                        <button
                          key={lang.code + lang.name}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`flex items-center gap-x-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                            isActive
                              ? "bg-[#1cb0f6]/10 text-[#1cb0f6] border-2 border-[#1cb0f6]/30"
                              : "hover:bg-gray-100 text-gray-700 border-2 border-transparent"
                          }`}
                          type="button"
                        >
                          <img
                            src={`https://flagcdn.com/w40/${lang.country}.png`}
                            alt={lang.name}
                            className="w-6 h-4.5 object-cover rounded-[3px] shadow-sm flex-shrink-0"
                          />
                          <span className="truncate">{lang.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </header>
  );
}

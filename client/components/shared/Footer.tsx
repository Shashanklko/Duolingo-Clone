"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const footerSections = [
  {
    titleKey: "footer.aboutUs",
    links: [
      ["Courses", "/courses/all"],
      ["Mission", "#"],
      ["Approach", "#"],
      ["Efficacy", "#"],
      ["Duolingo Handbook", "#"],
      ["Research", "#"],
      ["Careers", "#"],
      ["Brand guidelines", "#"],
      ["Store", "/shop"],
      ["Press", "#"],
      ["Investors", "#"],
      ["Contact us", "#"],
    ],
  },
  {
    titleKey: "footer.products",
    links: [
      ["Duolingo", "/learn"],
      ["Duolingo for Schools", "#"],
      ["Duolingo English Test", "/english-test"],
      ["Podcast", "#"],
      ["Duolingo for Business", "#"],
      ["Super Duolingo", "/shop"],
      ["Gift Super Duolingo", "/shop"],
      ["Duolingo Max", "/shop"],
    ],
  },
  {
    titleKey: "footer.apps",
    links: [
      ["Duolingo for Android", "#"],
      ["Duolingo for iOS", "#"],
    ],
  },
  {
    titleKey: "footer.helpSupport",
    links: [
      ["Duolingo FAQs", "#"],
      ["Schools FAQs", "#"],
      ["Duolingo English Test FAQs", "#"],
      ["Status", "#"],
    ],
  },
  {
    titleKey: "footer.privacyTerms",
    links: [
      ["Community guidelines", "#"],
      ["Terms", "#"],
      ["Privacy", "#"],
      ["Do Not Sell My Personal Information", "#"],
    ],
  },
  {
    titleKey: "Social",
    links: [
      ["Blog", "#"],
      ["Instagram", "#"],
      ["TikTok", "#"],
      ["Twitter", "#"],
      ["YouTube", "#"],
      ["LinkedIn", "#"],
    ],
  },
];

const FOOTER_LANGUAGES = [
  { code: "AR", name: "العربية", flag: "🇸🇦" },
  { code: "BD", name: "বাংলা", flag: "🇧🇩" },
  { code: "CZ", name: "Čeština", flag: "🇨🇿" },
  { code: "DE", name: "Deutsch", flag: "🇩🇪" },
  { code: "GR", name: "Ελληνικά", flag: "🇬🇷" },
  { code: "US", name: "English", flag: "🇺🇸" },
  { code: "ES", name: "Español", flag: "🇪🇸" },
  { code: "FR", name: "Français", flag: "🇫🇷" },
  { code: "IN", name: "हिंदी", flag: "🇮🇳" },
  { code: "HU", name: "Magyar", flag: "🇭🇺" },
  { code: "ID", name: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "IT", name: "Italiano", flag: "🇮🇹" },
  { code: "JP", name: "日本語", flag: "🇯🇵" },
  { code: "KR", name: "한국어", flag: "🇰🇷" },
  { code: "NL", name: "Nederlands", flag: "🇳🇱" },
  { code: "PL", name: "Polski", flag: "🇵🇱" },
  { code: "BR", name: "Português", flag: "🇧🇷" },
  { code: "RO", name: "Română", flag: "🇷🇴" },
  { code: "RU", name: "Русский", flag: "🇷🇺" },
  { code: "SE", name: "Svenska", flag: "🇸🇪" },
  { code: "PH", name: "Tagalog", flag: "🇵🇭" },
  { code: "TR", name: "Türkçe", flag: "🇹🇷" },
  { code: "UA", name: "Українською", flag: "🇺🇦" },
  { code: "VN", name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "CN", name: "中文", flag: "🇨🇳" },
];

export default function Footer() {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLangChange = (code: string) => {
    i18n.changeLanguage(code);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#58CC02] text-white">
      <div className="mx-auto max-w-[1200px] px-6 pb-4 pt-6 sm:px-10">

        {/* ── LINK COLUMNS ── */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-6">
          {footerSections.map((section) => (
            <div key={section.titleKey}>
              <h3 className="mb-1.5 text-xs font-black uppercase tracking-wide">
                {section.titleKey === "Social" ? "Social" : (mounted ? t(section.titleKey) : section.titleKey)}
              </h3>
              <ul className="space-y-[2px]">
                {section.links.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[11px] font-semibold leading-snug text-white/80 transition-colors hover:text-white hover:underline"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── DIVIDER ── */}
        <div className="my-3 h-px w-full bg-white/20" />

        {/* ── SITE LANGUAGE ── */}
        <div>
          <h3 className="mb-1 text-[10px] font-black uppercase tracking-wider">
            {mounted ? t("footer.siteLanguage") : "Site language:"}
          </h3>
          <div className="flex flex-wrap gap-x-2.5 gap-y-0.5">
            {FOOTER_LANGUAGES.map((lang) => {
              const isActive = mounted && i18n.language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLangChange(lang.code)}
                  className={`text-[10px] font-semibold leading-tight transition-colors hover:text-white hover:underline ${
                    isActive
                      ? "text-white underline font-bold"
                      : "text-white/75"
                  }`}
                >
                  {lang.flag} {lang.name}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </footer>
  );
}
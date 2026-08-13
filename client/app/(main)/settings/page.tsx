"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Flame, 
  Gem, 
  Heart, 
  ChevronDown
} from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { languages } from "@/lib/constants";
import { useTheme } from "@/contexts/ThemeContext";

import HeaderStats from "@/components/shared/HeaderStats";

type Tab = "preferences" | "privacy";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>("preferences");

  // Toggle states for Preferences
  const [soundEffects, setSoundEffects] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [motivational, setMotivational] = useState(true);
  const [listening, setListening] = useState(true);

  // Toggle states for Privacy
  const [publicProfile, setPublicProfile] = useState(true);
  const [personalizedAds, setPersonalizedAds] = useState(true);

  const activeLangCode = i18n.language?.toUpperCase() || "US";

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6 max-w-[1056px] mx-auto pt-6 pb-12">
      {/* Right Sidebar */}
      <div className="hidden lg:flex w-[368px] sticky top-6 flex-col gap-y-6">
        
        {/* Top Stats Row */}
        <HeaderStats />

        {/* Account Card */}
        <div 
          className="border-2 rounded-2xl p-5 flex flex-col gap-y-1 transition-colors"
          style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-secondary)" }}
        >
          <h3 className="font-bold text-lg mb-3" style={{ color: "var(--text-primary)" }}>Account</h3>
          <button
            onClick={() => setActiveTab("preferences")}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition cursor-pointer ${
              activeTab === "preferences"
                ? "bg-[#1cb0f6]/10 text-[#1cb0f6]"
                : "hover:bg-gray-500/10"
            }`}
            style={{ color: activeTab === "preferences" ? "#1cb0f6" : "var(--text-secondary)" }}
          >
            Preferences
          </button>
          <button
            onClick={() => setActiveTab("privacy")}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition cursor-pointer ${
              activeTab === "privacy"
                ? "bg-[#1cb0f6]/10 text-[#1cb0f6]"
                : "hover:bg-gray-500/10"
            }`}
            style={{ color: activeTab === "privacy" ? "#1cb0f6" : "var(--text-secondary)" }}
          >
            Privacy settings
          </button>
        </div>
        
        {/* Footer Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-4 px-4 text-xs font-bold text-gray-500 uppercase">
          <Link href="#" className="hover:text-gray-300 transition">About</Link>
          <Link href="#" className="hover:text-gray-300 transition">Blog</Link>
          <Link href="#" className="hover:text-gray-300 transition">Store</Link>
          <Link href="#" className="hover:text-gray-300 transition">Efficacy</Link>
          <Link href="#" className="hover:text-gray-300 transition">Careers</Link>
          <Link href="#" className="hover:text-gray-300 transition">Investors</Link>
          <Link href="#" className="hover:text-gray-300 transition">Terms</Link>
          <Link href="#" className="hover:text-gray-300 transition">Privacy</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full">
        <div className="w-full max-w-[600px]">
          
          {activeTab === "preferences" && (
            <div className="flex flex-col gap-y-10">
              <h1 className="text-3xl font-extrabold" style={{ color: "var(--text-primary)" }}>Preferences</h1>

              {/* Site Language */}
              <div className="flex flex-col gap-y-2">
                <h2 className="text-lg font-bold mb-2" style={{ color: "var(--text-secondary)" }}>Language</h2>
                <div className="w-full h-[2px] mb-4" style={{ backgroundColor: "var(--border-color)" }} />
                
                <div className="flex flex-col gap-y-3">
                  <span className="font-bold text-[15px]" style={{ color: "var(--text-primary)" }}>Site language</span>
                  <div className="relative w-full max-w-[300px]">
                    <select
                      value={activeLangCode}
                      onChange={(e) => i18n.changeLanguage(e.target.value)}
                      className="w-full appearance-none border-2 rounded-xl px-4 py-3 font-bold text-sm tracking-wide cursor-pointer focus:outline-none focus:border-[#1cb0f6] transition"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-primary)",
                      }}
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name} ({lang.en})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Lesson Experience */}
              <div className="flex flex-col gap-y-2">
                <h2 className="text-lg font-bold mb-2" style={{ color: "var(--text-secondary)" }}>Lesson experience</h2>
                <div className="w-full h-[2px] mb-4" style={{ backgroundColor: "var(--border-color)" }} />
                
                <ToggleRow label="Sound effects" enabled={soundEffects} onToggle={() => setSoundEffects(!soundEffects)} />
                <ToggleRow label="Animations" enabled={animations} onToggle={() => setAnimations(!animations)} />
                <ToggleRow label="Motivational messages" enabled={motivational} onToggle={() => setMotivational(!motivational)} />
                <ToggleRow label="Listening exercises" enabled={listening} onToggle={() => setListening(!listening)} />
              </div>

              {/* Appearance */}
              <div className="flex flex-col gap-y-2">
                <h2 className="text-lg font-bold mb-2" style={{ color: "var(--text-secondary)" }}>Appearance</h2>
                <div className="w-full h-[2px] mb-4" style={{ backgroundColor: "var(--border-color)" }} />
                
                <div className="flex flex-col gap-y-3">
                  <span className="font-bold text-[15px]" style={{ color: "var(--text-primary)" }}>Dark mode</span>
                  <div className="relative w-full max-w-[300px]">
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value as "system" | "dark" | "light")}
                      className="w-full appearance-none border-2 rounded-xl px-4 py-3 font-bold text-sm uppercase tracking-wide cursor-pointer focus:outline-none focus:border-[#1cb0f6] transition"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <option value="system">System Default</option>
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="flex flex-col gap-y-10">
              <h1 className="text-3xl font-extrabold" style={{ color: "var(--text-primary)" }}>Privacy settings</h1>

              <div className="flex flex-col gap-y-8">
                <div className="flex items-start justify-between gap-x-8">
                  <div className="flex flex-col gap-y-2">
                    <span className="font-bold text-[15px]" style={{ color: "var(--text-primary)" }}>Make my profile public</span>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-[400px]">
                      Allow others to find your profile and follow you. Allows you to follow others. Enrolls you in public leaderboards.
                    </p>
                  </div>
                  <Toggle enabled={publicProfile} onToggle={() => setPublicProfile(!publicProfile)} />
                </div>

                <div className="flex items-start justify-between gap-x-8">
                  <div className="flex flex-col gap-y-2">
                    <span className="font-bold text-[15px]" style={{ color: "var(--text-primary)" }}>Personalized ads</span>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-[400px]">
                      Tracking and personalization for advertising
                    </p>
                  </div>
                  <Toggle enabled={personalizedAds} onToggle={() => setPersonalizedAds(!personalizedAds)} />
                </div>

                <button className="w-fit px-6 py-3 rounded-2xl bg-[#1cb0f6] text-white font-bold uppercase tracking-widest text-sm cursor-pointer hover:bg-[#1899d6] transition border-b-4 border-[#1899d6] active:border-b-0 active:translate-y-[2px]">
                  Save Changes
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, enabled, onToggle }: { label: string; enabled: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between py-4">
      <span className="font-bold text-[15px]" style={{ color: "var(--text-primary)" }}>{label}</span>
      <Toggle enabled={enabled} onToggle={onToggle} />
    </div>
  );
}

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-[52px] h-[28px] rounded-full transition-colors duration-300 flex-shrink-0 ${
        enabled ? "bg-[#1cb0f6]" : "bg-[#37464f]"
      }`}
    >
      <div
        className={`absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white shadow-md transition-transform duration-300 ${
          enabled ? "translate-x-[26px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

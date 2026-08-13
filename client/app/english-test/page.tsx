"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Sparkles, 
  ShieldCheck, 
  Globe, 
  Clock, 
  ArrowLeft, 
  Bell, 
  CheckCircle2 
} from "lucide-react";

export default function EnglishTestPage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-between"
      style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      {/* Header Bar */}
      <header 
        className="w-full border-b-2 px-6 py-4 flex items-center justify-between"
        style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}
      >
        <Link href="/" className="flex items-center gap-x-3 hover:opacity-90 transition">
          <div className="w-9 h-9 rounded-full bg-[#58cc02] flex items-center justify-center text-white font-extrabold text-lg">
            🌐
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#58cc02]">
            Duolingo English Test
          </span>
        </Link>

        <Link 
          href="/learn" 
          className="flex items-center gap-x-2 px-4 py-2 rounded-xl bg-white/5 border border-gray-700 hover:bg-white/10 text-sm font-extrabold text-[#1cb0f6] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Learn</span>
        </Link>
      </header>

      {/* Main Hero Banner Container */}
      <main className="flex-1 max-w-[900px] w-full px-6 py-16 flex flex-col items-center justify-center text-center">
        <div 
          className="w-full p-8 sm:p-14 rounded-3xl border-2 shadow-2xl flex flex-col items-center gap-y-8 relative overflow-hidden"
          style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-secondary)" }}
        >
          {/* Subtle Glow Background Accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#58cc02]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-x-2 px-4 py-2 rounded-full bg-[#ffd900]/15 border-2 border-[#ffd900]/40 text-[#ffd900] animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span className="font-black text-xs uppercase tracking-widest">Feature Coming Soon</span>
          </div>

          {/* Title & Description */}
          <div className="flex flex-col items-center gap-y-3 max-w-[650px]">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white">
              Duolingo English Test
            </h1>
            <p className="text-lg font-medium text-gray-400 leading-relaxed pt-2">
              Certify your English proficiency online. We are putting the finishing touches on our adaptive 1-hour test platform. Get notified when we launch!
            </p>
          </div>

          {/* Email Notify Form */}
          <div className="w-full max-w-[480px]">
            {subscribed ? (
              <div className="p-4 rounded-2xl bg-[#58cc02]/20 border-2 border-[#58cc02] text-[#58cc02] font-extrabold text-base flex items-center justify-center gap-x-3 animate-in fade-in">
                <CheckCircle2 className="w-6 h-6" />
                <span>You're on the list! We'll notify you first.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-5 py-4 rounded-2xl border-2 bg-white/5 font-semibold text-base text-white placeholder-gray-500 focus:outline-none focus:border-[#58cc02] transition"
                  style={{ borderColor: "var(--border-color)" }}
                />
                <button
                  type="submit"
                  className="px-8 py-4 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] text-white font-extrabold text-sm uppercase tracking-widest border-b-4 border-[#46a302] active:border-b-0 active:translate-y-[4px] transition cursor-pointer flex items-center justify-center gap-x-2 shadow-lg"
                >
                  <Bell className="w-4 h-4" />
                  <span>Notify Me</span>
                </button>
              </form>
            )}
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full pt-6 border-t-2 border-white/10">
            <div className="flex flex-col items-center text-center gap-y-2 p-3">
              <ShieldCheck className="w-8 h-8 text-[#58cc02]" />
              <h3 className="font-extrabold text-base text-white">5,000+ Universities</h3>
              <p className="text-xs font-semibold text-gray-400">Accepted worldwide for admission</p>
            </div>

            <div className="flex flex-col items-center text-center gap-y-2 p-3">
              <Clock className="w-8 h-8 text-[#1cb0f6]" />
              <h3 className="font-extrabold text-base text-white">48-Hour Results</h3>
              <p className="text-xs font-semibold text-gray-400">Fast online score verification</p>
            </div>

            <div className="flex flex-col items-center text-center gap-y-2 p-3">
              <Globe className="w-8 h-8 text-[#ffd900]" />
              <h3 className="font-extrabold text-base text-white">Take Anytime</h3>
              <p className="text-xs font-semibold text-gray-400">1-hour test from your computer</p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 w-full sm:w-auto">
            <Link href="/learn">
              <button 
                type="button"
                className="w-full sm:w-[280px] py-4 rounded-2xl bg-[#1cb0f6] hover:bg-[#1899d6] text-white font-extrabold text-sm uppercase tracking-widest border-b-4 border-[#1899d6] active:border-b-0 active:translate-y-[4px] transition cursor-pointer shadow-lg"
              >
                Go to Learning Path
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs font-semibold text-gray-500 border-t-2" style={{ borderColor: "var(--border-color)" }}>
        © 2026 Duolingo Clone. All rights reserved.
      </footer>
    </div>
  );
}

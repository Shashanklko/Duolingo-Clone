"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function LearnAnytimeSection() {
  const { t } = useTranslation();
  const [bgLottie, setBgLottie] = useState(null);
  const [fgLottie, setFgLottie] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load background Lottie animation (c02b5f75d9ec48815e6a964f641a9fe2.json)
    const p1 = fetch("/lottie/c02b5f75d9ec48815e6a964f641a9fe2.json")
      .then((res) => res.json())
      .then(setBgLottie)
      .catch((err) => console.error("Error loading bg Lottie:", err));

    // Load foreground floating elements Lottie animation (c16e90b93e35750c893be4b58720cef2.json)
    const p2 = fetch("/lottie/c16e90b93e35750c893be4b58720cef2.json")
      .then((res) => res.json())
      .then(setFgLottie)
      .catch((err) => console.error("Error loading fg Lottie:", err));

    Promise.all([p1, p2]).then(() => setIsLoaded(true));
  }, []);

  // Scroll listener to move fgLottie (p2) smoothly with scroll parallax
  useEffect(() => {
    function handleScroll() {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        // Calculate relative scroll position when section is in view
        const offset = (window.innerHeight - rect.top) * 0.08;
        setScrollY(offset);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="w-full relative overflow-hidden bg-[#dcf4ff] flex flex-col items-center justify-start pt-10 sm:pt-14 pb-24 min-h-screen">
      
      {/* 0. Top Smooth Gradient Fade-In Overlay */}
      <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-white via-white/80 to-transparent z-20 pointer-events-none" />

      {/* 1. Lottie Background Layer (c02b5f75d9ec48815e6a964f641a9fe2.json) */}
      {bgLottie && (
        <div className={`absolute inset-0 w-full h-full pointer-events-none z-0 flex items-center justify-center transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
          <Lottie 
            animationData={bgLottie} 
            loop={true} 
            className="w-full h-full object-cover scale-115"
          />
        </div>
      )}

      {/* 2. Lottie Floating Elements Layer (c16e90b93e35750c893be4b58720cef2.json - p2) with Scroll Parallax */}
      {fgLottie && (
        <div 
          style={{ transform: `translateY(${scrollY}px)` }}
          className={`absolute inset-0 w-full h-full pointer-events-none z-10 flex items-center justify-center transition-all duration-300 ease-out ${isLoaded ? "opacity-100" : "opacity-0"}`}
        >
          <Lottie 
            animationData={fgLottie} 
            loop={true} 
            className="w-full h-full object-contain scale-110"
          />
        </div>
      )}

      {/* 3. Main Text & Store Buttons Overlay */}
      <div className={`relative z-30 flex flex-col items-center text-center px-6 max-w-[950px] mx-auto pointer-events-auto transition-all duration-1000 delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        
        {/* Title */}
        <h2 className="text-5xl sm:text-6xl lg:text-[68px] font-black text-[#042c54] tracking-tight leading-tight mb-8 drop-shadow-sm">
          {t("learnAnytime.title")}
        </h2>

        {/* Download Buttons Row */}
        <div className="flex flex-row items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto">
          
          {/* App Store Button */}
          <Link
            href="#"
            className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200/90 shadow-lg px-7 py-3.5 sm:px-8 sm:py-4 rounded-2xl flex items-center justify-center gap-x-3.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <svg className="w-7 h-7 sm:w-8 sm:h-8 fill-current text-gray-900" viewBox="0 0 384 512">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-92.1zM276.9 84.1c23.5-27.9 38-66.7 33.4-106-32.9 2-71.9 21.6-94.8 48.7-19.8 23-37.5 61.6-32.1 99.8 36.6 2.7 70.1-14.7 93.5-42.5z"/>
            </svg>
            <div className="flex flex-col text-left">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-gray-500 leading-none">
                {t("learnAnytime.downloadAppStore")}
              </span>
              <span className="text-base sm:text-lg font-black text-gray-900 leading-tight">
                {t("learnAnytime.appStore")}
              </span>
            </div>
          </Link>

          {/* Google Play Button */}
          <Link
            href="#"
            className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200/90 shadow-lg px-7 py-3.5 sm:px-8 sm:py-4 rounded-2xl flex items-center justify-center gap-x-3.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <svg className="w-7 h-7 sm:w-8 sm:h-8 fill-current text-gray-900" viewBox="0 0 512 512">
              <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
            </svg>
            <div className="flex flex-col text-left">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-gray-500 leading-none">
                {t("learnAnytime.getItOn")}
              </span>
              <span className="text-base sm:text-lg font-black text-gray-900 leading-tight">
                {t("learnAnytime.googlePlay")}
              </span>
            </div>
          </Link>

        </div>
      </div>

    </section>
  );
}

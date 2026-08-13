"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useAuthModal } from "@/lib/store";
import { useTranslation } from "react-i18next";
import { RibbonItem } from "./LanguageRibbon";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface HeroSectionProps {
  selectedItem?: RibbonItem | null;
}

export default function HeroSection({ selectedItem }: HeroSectionProps) {
  const { openLogin } = useAuthModal();
  const { t } = useTranslation();
  const [lottieData, setLottieData] = useState(null);

  useEffect(() => {
    fetch("/lottie/50bda50231c0bce1584e982cebfe8f33.json")
      .then((res) => res.json())
      .then(setLottieData)
      .catch((err) => console.error("Error loading Hero Lottie:", err));
  }, []);

  return (
    <section className="w-full max-w-[1056px] mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-12 bg-white">
      {/* Duo Animated Lottie Mascot Graphic */}
      <div className="relative w-[380px] sm:w-[520px] lg:w-[580px] h-[380px] sm:h-[520px] lg:h-[580px] flex items-center justify-center flex-shrink-0">
        {lottieData ? (
          <Lottie 
            animationData={lottieData} 
            loop={true} 
            className="w-full h-full object-contain"
          />
        ) : (
          <img
            src="https://d35aaqx5ub95lt.cloudfront.net/images/splash/540026e64c3db36034e3415c1fb9cb68.svg"
            alt="Duolingo Characters"
            className="w-full h-full object-contain"
          />
        )}
      </div>

      {/* Hero Content Right Side */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-[480px]">
        <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black tracking-tight text-gray-800 leading-[1.2] transition-all duration-300">
          {selectedItem ? (
            <>
              Learn {selectedItem.label} in just 5 minutes a day. <span className="text-[#58cc02]">For free.</span>
            </>
          ) : (
            t("hero.title")
          )}
        </h1>

        <div className="mt-8 flex flex-col w-full gap-y-3 sm:max-w-[340px]">
          <Link
            href="/courses/all"
            className="w-full py-3.5 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] text-white font-extrabold uppercase tracking-widest text-sm transition-all border-b-4 border-[#46a302] active:border-b-0 active:translate-y-[2px] shadow-md text-center flex items-center justify-center cursor-pointer"
          >
            {t("hero.getStarted")}
          </Link>

          <button
            onClick={openLogin}
            className="w-full py-3.5 rounded-2xl bg-white hover:bg-gray-50 text-[#1cb0f6] font-extrabold uppercase tracking-widest text-sm transition-all border-2 border-gray-200 border-b-4 border-b-gray-300 active:border-b-2 active:translate-y-[2px] cursor-pointer"
            type="button"
          >
            {t("hero.alreadyHaveAccount")}
          </button>
        </div>
      </div>
    </section>
  );
}

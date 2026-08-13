"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAuthModal } from "@/lib/store";
import { useTranslation } from "react-i18next";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function SuperDuolingoSection() {
  const { openSignup } = useAuthModal();
  const { t } = useTranslation();
  const [lottieData, setLottieData] = useState(null);

  useEffect(() => {
    fetch("/lottie/904f242fe2ab5477e3b97928d3e1cb89.json")
      .then((res) => res.json())
      .then(setLottieData)
      .catch((err) => console.error("Error loading Super Duo Lottie:", err));
  }, []);

  return (
    <section className="w-full bg-[#080720] py-16 sm:py-24 text-white overflow-hidden relative min-h-screen flex items-center">
      <div className="max-w-[1056px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Left Side: Animated Super Duo Mascot (904f242fe2ab5477e3b97928d3e1cb89.json) */}
        <div className="relative w-[320px] sm:w-[460px] h-[280px] sm:h-[380px] flex items-center justify-center flex-shrink-0">
          {lottieData ? (
            <Lottie
              animationData={lottieData}
              loop={true}
              className="w-full h-full object-contain scale-110"
            />
          ) : (
            <img
              src="https://d35aaqx5ub95lt.cloudfront.net/images/super/super-duo-hero.svg"
              alt="Super Duolingo Duo Mascot"
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {/* Right Side: Futuristic Super Duolingo Typography & Trial CTA */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-[540px]">
          
          <span className="italic font-black text-xl sm:text-2xl tracking-widest text-white uppercase mb-1 drop-shadow-md">
            {t("super.powerUp")}
          </span>

          <h2 className="text-4xl sm:text-5xl lg:text-[58px] font-black italic tracking-wider bg-gradient-to-r from-[#44ffb1] via-[#00d2ff] to-[#e600ff] bg-clip-text text-transparent uppercase mb-8 leading-none drop-shadow-xl">
            SUPER DUOLINGO
          </h2>

          <button
            onClick={openSignup}
            className="px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-sm bg-white hover:bg-gray-100 text-[#080720] border-b-4 border-gray-300 active:border-b-0 active:translate-y-[2px] shadow-2xl transition cursor-pointer"
            type="button"
          >
            {t("super.tryFree")}
          </button>
        </div>

      </div>
    </section>
  );
}

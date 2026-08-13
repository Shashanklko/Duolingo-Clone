"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function EnglishTestSection() {
  const { t } = useTranslation();
  const [lottieData, setLottieData] = useState(null);

  useEffect(() => {
    fetch("/lottie/2c6db87220e7de95124c1a2882afd64f.json")
      .then((res) => res.json())
      .then(setLottieData)
      .catch((err) => console.error("Error loading English Test Lottie:", err));
  }, []);

  return (
    <section className="w-full bg-white py-16 sm:py-24">
      <div className="max-w-[1056px] mx-auto px-6 flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        
        {/* Left Side: Title, Description & Certify Button */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-[500px]">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#58cc02] tracking-tight leading-tight mb-4">
            {t("englishTest.title")}
          </h2>

          <p className="text-sm sm:text-base font-bold text-gray-500 leading-relaxed mb-8">
            {t("englishTest.desc")}
          </p>

          <Link
            href="/english-test"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-extrabold uppercase tracking-widest text-xs text-[#1cb0f6] bg-white hover:bg-gray-50 border-2 border-gray-200 border-b-4 border-b-gray-300 active:border-b-2 active:translate-y-[2px] transition text-center cursor-pointer shadow-sm"
          >
            {t("englishTest.certifyBtn")}
          </Link>
        </div>

        {/* Right Side: Animated Lottie Graphic (2c6db87220e7de95124c1a2882afd64f.json) */}
        <div className="relative w-[320px] sm:w-[420px] h-[280px] sm:h-[380px] flex items-center justify-center flex-shrink-0">
          {lottieData ? (
            <Lottie
              animationData={lottieData}
              loop={true}
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              src="https://d35aaqx5ub95lt.cloudfront.net/images/splash/c8dbfb52bc5cebe364b4c6e944747eb4.svg"
              alt="Duolingo English Test Mascot"
              className="w-full h-full object-contain"
            />
          )}
        </div>

      </div>
    </section>
  );
}

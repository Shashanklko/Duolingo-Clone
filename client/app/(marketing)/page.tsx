"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import HeroSection from "@/components/home/HeroSection";
import LanguageRibbon, { RibbonItem } from "@/components/home/LanguageRibbon";
import FeatureSection from "@/components/home/FeatureSection";
import SuperDuolingoSection from "@/components/home/SuperDuolingoSection";
import LearnAnytimeSection from "@/components/home/LearnAnytimeSection";
import EnglishTestSection from "@/components/home/EnglishTestSection";
import BottomCtaSection from "@/components/home/BottomCtaSection";

export default function MarketingPage() {
  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = useState<RibbonItem | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const handleSelectItem = (item: RibbonItem) => {
    setSelectedItem(item);
    // Smooth scroll up to hero section when ribbon item is clicked
    if (heroRef.current) {
      heroRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full flex flex-col flex-1 bg-white">
      <Navbar />
      
      <div ref={heroRef}>
        <HeroSection selectedItem={selectedItem} />
      </div>

      {/* If a language is chosen, replace the ribbon with the single line banner */}
      {selectedItem ? (
        <div className="w-full bg-white border-t border-b border-gray-200 py-4 flex items-center justify-center animate-in fade-in duration-200">
          <div 
            onClick={() => setSelectedItem(null)} 
            className="flex items-center gap-x-3 px-6 text-center cursor-pointer group hover:opacity-80 transition"
            title="Click to view all languages"
          >
            {selectedItem.flagCode ? (
              <Image
                src={`https://flagcdn.com/w40/${selectedItem.flagCode}.png`}
                alt={selectedItem.label}
                width={28}
                height={21}
                className="rounded-sm object-cover border border-gray-300 shadow-sm flex-shrink-0"
              />
            ) : (
              <span className="text-xl">{selectedItem.icon}</span>
            )}
            <span className="text-gray-600 font-extrabold text-sm sm:text-base tracking-tight group-hover:text-gray-900 transition">
              The world&apos;s most popular way to learn {selectedItem.label} online
            </span>
          </div>
        </div>
      ) : (
        <LanguageRibbon 
          selectedItem={selectedItem}
          onSelectItem={handleSelectItem}
        />
      )}
      
      <FeatureSection 
        title={t("features.freeFunTitle")}
        description={t("features.freeFunDesc")}
        lottiePath="/lottie/aea5aff1143a9410b81448245ad7c839.json" 
        reverse={true}
      />

      <FeatureSection 
        title={t("features.scienceTitle")}
        description={t("features.scienceDesc")}
        lottiePath="/lottie/71b01cd301b53ec9879f2d06eb85f5db.json" 
        reverse={false}
      />
      
      <FeatureSection 
        title={t("features.motivatedTitle")}
        description={t("features.motivatedDesc")}
        lottiePath="/lottie/82f26795696242931a7b905b4918eb1e.json" 
        reverse={true}
      />
      
      <FeatureSection 
        title={t("features.personalizedTitle")}
        description={t("features.personalizedDesc")}
        lottiePath="/lottie/e97b1cde32a58c629a0193eea36ddaab.json"
        reverse={false}
      />
      <LearnAnytimeSection />
      <SuperDuolingoSection />
      <EnglishTestSection />
      <BottomCtaSection />
      <Footer />
    </div>
  );
}

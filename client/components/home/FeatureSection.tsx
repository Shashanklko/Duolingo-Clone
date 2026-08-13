"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import AnimatedLottie from "@/components/shared/AnimatedLottie";

const DEFAULT_FEATURES = [
  {
    title: "free. fun. effective.",
    description: "Learning with Duolingo is fun, and research shows that it works! With quick, bite-sized lessons, you'll earn points and unlock new levels while gaining real-world communication skills.",
    highlightText: "research shows that it works",
    image: "https://d35aaqx5ub95lt.cloudfront.net/images/splash/2d216503c1edfe7e71350a80e15f8e52.svg",
    lottiePath: "/lottie/aea5aff1143a9410b81448245ad7c839.json",
  },
  {
    title: "backed by science",
    description: "We use a combination of research-backed teaching methods and delightful content to create courses that effectively teach reading, writing, listening, and speaking skills!",
    highlightText: null,
    image: "https://d35aaqx5ub95lt.cloudfront.net/images/splash/540026e64c3db36034e3415c1fb9cb68.svg",
    lottiePath: "/lottie/71b01cd301b53ec9879f2d06eb85f5db.json",
  },
  {
    title: "stay motivated",
    description: "We make it easy to form a habit of language learning with game-like features, fun challenges, and reminders from our friendly mascot, Duo the owl.",
    highlightText: null,
    image: "https://d35aaqx5ub95lt.cloudfront.net/images/splash/9463c6396f9bf1d02c7713437e411f1c.svg",
    lottiePath: "/lottie/82f26795696242931a7b905b4918eb1e.json",
  },
];

interface FeatureSectionProps {
  title?: string;
  description?: string;
  lottiePath?: string;
  reverse?: boolean;
}

export default function FeatureSection({
  title,
  description,
  lottiePath,
  reverse = false,
}: FeatureSectionProps) {
  const [lottieData, setLottieData] = useState(null);

  useEffect(() => {
    if (lottiePath) {
      fetch(lottiePath)
        .then((res) => res.json())
        .then(setLottieData)
        .catch(() => {});
    }
  }, [lottiePath]);

  if (title && description) {
    return (
      <section className="w-full max-w-[1056px] mx-auto px-6 py-12">
        <div className={`flex flex-col md:flex-row items-center justify-between gap-12 w-full ${reverse ? "md:flex-row-reverse" : ""}`}>
          <div className="relative w-[300px] h-[300px] flex items-center justify-center flex-shrink-0">
            {lottieData ? (
              <AnimatedLottie animationData={lottieData} className="w-full h-full" />
            ) : (
              <Image
                src="https://d35aaqx5ub95lt.cloudfront.net/images/splash/540026e64c3db36034e3415c1fb9cb68.svg"
                alt={title}
                fill
                className="object-contain"
              />
            )}
          </div>
          <div className="flex flex-col text-center md:text-left max-w-[500px]">
            <h2 className="text-3xl sm:text-4xl font-black text-[#58cc02] tracking-tight leading-tight">
              {title}
            </h2>
            <p className="mt-4 text-base sm:text-lg font-bold text-gray-500 leading-relaxed">
              {title.includes("free") ? (
                <>
                  Learning with Duolingo is fun, and <span className="text-[#1cb0f6] font-extrabold">research shows that it works</span>! With quick, bite-sized lessons, you'll earn points and unlock new levels while gaining real-world communication skills.
                </>
              ) : (
                description
              )}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-[1056px] mx-auto px-6 py-16 flex flex-col gap-y-24">
      {DEFAULT_FEATURES.map((feat, idx) => (
        <div
          key={feat.title}
          className={`flex flex-col md:flex-row items-center justify-between gap-12 ${
            idx % 2 === 1 ? "md:flex-row-reverse" : ""
          }`}
        >
          <div className="relative w-[300px] h-[300px] flex items-center justify-center flex-shrink-0">
            <Image
              src={feat.image}
              alt={feat.title}
              fill
              className="object-contain"
            />
          </div>

          <div className="flex flex-col text-center md:text-left max-w-[500px]">
            <h2 className="text-3xl sm:text-4xl font-black text-[#58cc02] tracking-tight leading-tight">
              {feat.title}
            </h2>
            <p className="mt-4 text-base sm:text-lg font-bold text-gray-500 leading-relaxed">
              {feat.highlightText ? (
                <>
                  Learning with Duolingo is fun, and <span className="text-[#1cb0f6] font-extrabold">research shows that it works</span>! With quick, bite-sized lessons, you'll earn points and unlock new levels while gaining real-world communication skills.
                </>
              ) : (
                feat.description
              )}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}

"use client";

import React from "react";
import Image from "next/image";

const DEFAULT_FEATURES = [
  {
    title: "free. fun. effective.",
    description: "Learning with Duolingo is fun, and research shows that it works! With quick, bite-sized lessons, you'll earn points and unlock new levels while gaining real-world communication skills.",
    image: "https://d35aaqx5ub95lt.cloudfront.net/images/splash/2d216503c1edfe7e71350a80e15f8e52.svg",
  },
  {
    title: "backed by science",
    description: "We use a combination of research-backed teaching methods and delightful content to create courses that effectively teach reading, writing, listening, and speaking skills!",
    image: "https://d35aaqx5ub95lt.cloudfront.net/images/splash/540026e64c3db36034e3415c1fb9cb68.svg",
  },
  {
    title: "stay motivated",
    description: "We make it easy to form a habit of language learning with game-like features, fun challenges, and reminders from our friendly mascot, Duo the owl.",
    image: "https://d35aaqx5ub95lt.cloudfront.net/images/splash/9463c6396f9bf1d02c7713437e411f1c.svg",
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
  if (title && description) {
    return (
      <section className="w-full max-w-[1056px] mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className={`flex flex-col md:flex-row items-center justify-between gap-12 w-full ${reverse ? "md:flex-row-reverse" : ""}`}>
          <div className="relative w-[240px] h-[240px] flex items-center justify-center flex-shrink-0">
            <Image
              src="https://d35aaqx5ub95lt.cloudfront.net/images/splash/540026e64c3db36034e3415c1fb9cb68.svg"
              alt={title}
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col text-center md:text-left max-w-[500px]">
            <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
              {title}
            </h2>
            <p className="mt-4 text-base font-bold text-gray-500 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-[1056px] mx-auto px-6 py-16 flex flex-col gap-y-20">
      {DEFAULT_FEATURES.map((feat, idx) => (
        <div
          key={feat.title}
          className={`flex flex-col md:flex-row items-center justify-between gap-12 ${
            idx % 2 === 1 ? "md:flex-row-reverse" : ""
          }`}
        >
          <div className="relative w-[260px] h-[260px] flex items-center justify-center flex-shrink-0">
            <Image
              src={feat.image}
              alt={feat.title}
              fill
              className="object-contain"
            />
          </div>

          <div className="flex flex-col text-center md:text-left max-w-[500px]">
            <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
              {feat.title}
            </h2>
            <p className="mt-4 text-base font-bold text-gray-500 leading-relaxed">
              {feat.description}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}

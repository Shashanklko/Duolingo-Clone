"use client";

import dynamic from "next/dynamic";
import React from "react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function AnimatedLottie({
  animationData,
  className = "w-full h-full",
  loop = true,
}: {
  animationData: any;
  className?: string;
  loop?: boolean;
}) {
  if (!animationData) return null;

  return <Lottie animationData={animationData} loop={loop} className={className} />;
}

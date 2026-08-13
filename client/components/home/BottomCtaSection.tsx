"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});

export default function BottomCtaSection() {
  const { t } = useTranslation();
  const [bgLottie, setBgLottie] = useState(null);
  const [phoneOwlLottie, setPhoneOwlLottie] = useState(null);

  useEffect(() => {
    fetch("/lottie/9b9c41cb3a201cad24a2f18f90f4d564.json")
      .then((res) => res.json())
      .then(setBgLottie)
      .catch((err) =>
        console.error("Error loading Bottom CTA bg Lottie:", err)
      );

    fetch("/lottie/98fa4e2fa26d365936333da24aba7e36.json")
      .then((res) => res.json())
      .then(setPhoneOwlLottie)
      .catch((err) =>
        console.error("Error loading Bottom CTA phone owl Lottie:", err)
      );
  }, []);

  return (
    <section className="relative flex w-full flex-col items-center overflow-hidden bg-white pt-10 text-center sm:pt-14">

      {/* ================= TITLE ================= */}
      <h2
        className="
          relative
          z-30
          mb-3
          max-w-[950px]
          px-6
          text-4xl
          font-black
          leading-[1.05]
          tracking-tight
          text-[#58cc02]
          sm:text-5xl
          lg:text-6xl
        "
      >
        learn a language <br /> with duolingo
      </h2>

      {/* ================= BUTTON ================= */}
      <Link
        href="/courses/all"
        className="
           relative
           z-50
           -mb-8
           rounded-xl
           border-b-[5px]
           border-[#46a302]
           bg-[#58cc02]
           px-16
           py-4
           text-[15px]
           font-extrabold
           uppercase
           tracking-[0.2em]
           text-white
           shadow-lg
           transition-all
           hover:bg-[#4db800]
           active:translate-y-[3px]
           active:border-b-0
           sm:-mb-10
           sm:px-20
           sm:py-5
           sm:text-base
        "
      >
        {t("bottomCta.getStarted")}
      </Link>

      {/* ================= ARTWORK ================= */}
      <div
        className="
          relative
          -mb-1
          -mt-2
          h-[560px]
          w-full
          overflow-hidden
          sm:h-[655px]
          md:h-[740px]
          lg:h-[810px]
        "
      >
        {/* Small green base to fill gap between wave bottom and footer */}
        <div className="absolute bottom-0 left-0 right-0 z-0 h-[25%] bg-[#58CC02]" />

        {/* ================= BACKGROUND ART ================= */}
        {bgLottie && (
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              z-10
              flex
              items-center
              justify-center
              overflow-hidden
            "
          >
            <Lottie
              animationData={bgLottie}
              loop
              autoplay
              className="
                h-full
                w-[250vw]
                min-w-[250vw]
                max-w-none
                -translate-y-[175px]
                scale-[1.3]
                object-cover
                sm:w-[220vw]
                sm:min-w-[220vw]
                sm:-translate-y-[195px]
                sm:scale-[1.25]
                md:w-[200vw]
                md:min-w-[200vw]
                md:-translate-y-[210px]
                md:scale-[1.2]
                lg:w-[180vw]
                lg:min-w-[180vw]
                lg:-translate-y-[230px]
                lg:scale-[1.15]
              "
            />
          </div>
        )}

        {/* ================= PHONE + OWL ================= */}
        {phoneOwlLottie && (
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              z-20
              flex
              items-center
              justify-center
            "
          >
            <Lottie
              animationData={phoneOwlLottie}
              loop
              autoplay
              className="
                h-full
                w-full
                -translate-y-[165px]
                scale-[1.12]
                object-contain
                sm:-translate-y-[180px]
                sm:scale-[1.10]
                md:-translate-y-[200px]
                md:scale-[1.08]
                lg:-translate-y-[220px]
                lg:scale-[1.06]
              "
            />
          </div>
        )}
      </div>
    </section>
  );
}
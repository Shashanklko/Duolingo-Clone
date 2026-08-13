"use client";
import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";

const lotties = [
  "2c6db87220e7de95124c1a2882afd64f.json",
  "50bda50231c0bce1584e982cebfe8f33.json",
  "71b01cd301b53ec9879f2d06eb85f5db.json",
  "82f26795696242931a7b905b4918eb1e.json",
  "904f242fe2ab5477e3b97928d3e1cb89.json",
  "98fa4e2fa26d365936333da24aba7e36.json",
  "9b9c41cb3a201cad24a2f18f90f4d564.json",
  "aea5aff1143a9410b81448245ad7c839.json",
  "c02b5f75d9ec48815e6a964f641a9fe2.json",
  "c16e90b93e35750c893be4b58720cef2.json",
  "e97b1cde32a58c629a0193eea36ddaab.json"
];

const LottieViewer = ({ name }: { name: string }) => {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    fetch('/lottie/' + name).then(res => res.json()).then(setData).catch(() => {});
  }, [name]);
  return (
    <div className="border border-black p-4 m-4 flex flex-col items-center">
      <h3>{name}</h3>
      <div className="w-[400px] h-[400px] bg-gray-100 flex items-center justify-center relative overflow-hidden">
        {data && <Lottie animationData={data} loop={true} className="w-full h-full" />}
      </div>
    </div>
  );
};

export default function LottieTest() {
  return (
    <div className="flex flex-wrap w-full bg-white min-h-screen text-black">
      {lotties.map(name => <LottieViewer key={name} name={name} />)}
    </div>
  );
}

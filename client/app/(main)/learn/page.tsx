"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { UNITS, UnitItem } from "./_data/units";
import { UnitHeader } from "@/components/dashboard/UnitHeader";
import { SkillNode } from "@/components/dashboard/SkillNode";
import { RightSidebar } from "@/components/dashboard/RightSidebar";
import { fetchUnitsApi } from "@/lib/api";
import { useCourseStore } from "@/lib/store";
import { useUser } from "@/contexts/UserContext";
import { Lock } from "lucide-react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const CHARACTER_ASSETS: Record<string, string> = {
  duo: "https://d35aaqx5ub95lt.cloudfront.net/images/splash/540026e64c3db36034e3415c1fb9cb68.svg",
  lily: "https://d35aaqx5ub95lt.cloudfront.net/images/splash/2d216503c1edfe7e71350a80e15f8e52.svg",
  falstaff: "https://d35aaqx5ub95lt.cloudfront.net/images/splash/9463c6396f9bf1d02c7713437e411f1c.svg",
  junior: "https://d35aaqx5ub95lt.cloudfront.net/images/splash/f92d5f2f7d56636846861c458c0d0b6c.svg",
};

export default function Home() {
  const [unitsData, setUnitsData] = useState<UnitItem[]>(UNITS);
  const [duoLottie, setDuoLottie] = useState(null);
  const [lockToast, setLockToast] = useState<string | null>(null);
  
  const activeCourseId = useCourseStore((s) => s.activeCourseId);
  const { completedLessons } = useUser();

  useEffect(() => {
    fetch("/lottie/82f26795696242931a7b905b4918eb1e.json")
      .then((res) => res.json())
      .then(setDuoLottie)
      .catch(() => {});
  }, []);

  // Refetch units whenever active course changes
  useEffect(() => {
    fetchUnitsApi(activeCourseId).then((apiUnits) => {
      if (apiUnits && apiUnits.length > 0) {
        const formatted = apiUnits.map((u: any, uIdx: number) => {
          const fallback = UNITS[uIdx % UNITS.length];
          return {
            title: u.title || fallback.title,
            description: u.description || fallback.description,
            color: u.color || fallback.color,
            character: fallback.character,
            characterSide: fallback.characterSide,
            characterNodeIndex: fallback.characterNodeIndex,
            nodes: (u.skills && u.skills.length > 0) ? u.skills.map((s: any, sIdx: number) => ({
              id: s.id,
              title: s.title,
              lessonId: s.lesson_id || s.id,
              icon: s.icon || (sIdx === 3 ? "chest" : sIdx === 5 ? "trophy" : "star"),
              status: s.status,
              position: fallback.nodes[sIdx % fallback.nodes.length]?.position || 0,
            })) : fallback.nodes,
          };
        });
        setUnitsData(formatted);
      } else {
        setUnitsData(UNITS);
      }
    });
  }, [activeCourseId]);

  // Apply strict sequential locking rules based on completedLessons
  let currentUnlockedFound = false;
  const processedUnits = unitsData.map((unit: any) => {
    const processedNodes = unit.nodes.map((node: any) => {
      const sId = String(node.lessonId || node.id);
      const isCompleted = completedLessons.includes(sId);

      let status: "completed" | "current" | "locked" = "locked";

      if (isCompleted) {
        status = "completed";
      } else if (!currentUnlockedFound) {
        status = "current";
        currentUnlockedFound = true; // Only the VERY FIRST incomplete level is unlocked ("current")!
      } else {
        status = "locked";
      }

      return { ...node, status };
    });

    return { ...unit, nodes: processedNodes };
  });

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6 max-w-[1056px] mx-auto pt-6 pb-12 relative font-sans">
      {/* Lock Toast Alert */}
      {lockToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-[#ff4b4b] text-white px-6 py-3 rounded-2xl font-extrabold text-sm shadow-2xl z-50 animate-bounce flex items-center gap-x-2 border-2 border-white">
          <Lock className="w-4 h-4" />
          <span>{lockToast}</span>
        </div>
      )}

      {/* Right Sidebar for desktop (Stats & Cards) */}
      <RightSidebar />

      {/* Main Learning Path */}
      <div className="flex-1 w-full flex flex-col items-center">
        <div className="w-full max-w-[500px] flex flex-col items-center gap-y-12 pb-48">
          
          {processedUnits.map((unit: any, index: number) => {
            const charSide = unit.characterSide || (index % 2 === 0 ? "right" : "left");
            const charType = unit.character || (index === 0 ? "duo" : index === 1 ? "lily" : index === 2 ? "falstaff" : "junior");
            const charNodeIdx = unit.characterNodeIndex ?? 2;

            return (
              <div key={index} className="w-full flex flex-col items-center">
                <UnitHeader 
                  title={unit.title} 
                  description={unit.description} 
                  color={unit.color} 
                />
                
                <div className="w-full relative flex flex-col items-center gap-y-[34px] mt-10">
                  {unit.nodes.map((node: any, nodeIndex: number) => {
                    const overallLevelNumber = index * 6 + nodeIndex + 1;
                    const isLocked = node.status === "locked";
                    const showCharacter = nodeIndex === charNodeIdx;

                    return (
                      <div key={nodeIndex} className="relative w-full flex justify-center hover:z-50">
                        
                        {/* Side Character Mascot sitting on Pedestal (Opposite of curve) */}
                        {showCharacter && (
                          <div 
                            className={`absolute top-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-300 pointer-events-none z-10 drop-shadow-2xl ${
                              charSide === "right" ? "left-[calc(50%+115px)]" : "right-[calc(50%+115px)]"
                            }`}
                          >
                            <div className="w-[125px] sm:w-[140px] h-[125px] sm:h-[140px] flex items-center justify-center">
                              {charType === "duo" && duoLottie ? (
                                <Lottie 
                                  animationData={duoLottie} 
                                  loop={true}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <img 
                                  src={CHARACTER_ASSETS[charType] || CHARACTER_ASSETS.duo} 
                                  alt="Duolingo Character Mascot" 
                                  className="w-full h-full object-contain" 
                                  onError={(e) => {
                                    (e.target as any).src = "https://d35aaqx5ub95lt.cloudfront.net/images/splash/540026e64c3db36034e3415c1fb9cb68.svg";
                                  }}
                                />
                              )}
                            </div>
                            {/* Circular Base/Pedestal */}
                            <div className="w-[84px] h-[20px] bg-[#182329] border-2 border-[#2b383f] rounded-full -mt-3 shadow-inner" />
                          </div>
                        )}

                        <Link
                          href={isLocked ? "#" : (node.icon === 'fast-forward' ? '/quiz' : `/lesson/${node.lessonId || (nodeIndex + 1)}`)}
                          onClick={(e) => {
                            if (isLocked) {
                              e.preventDefault();
                              setLockToast("Complete previous levels first to unlock!");
                              setTimeout(() => setLockToast(null), 2500);
                            }
                          }}
                          className={`relative cursor-pointer block transition-transform group ${
                            isLocked ? "opacity-75 cursor-not-allowed" : "hover:scale-105"
                          }`}
                        >
                          {/* START Tooltip */}
                          {node.status === 'current' && (
                            <div 
                              className="absolute -top-11 left-1/2 -translate-x-1/2 font-black text-xs px-4 py-2 rounded-xl border-2 z-20 whitespace-nowrap animate-bounce uppercase tracking-wider shadow-lg cursor-pointer group-hover:opacity-0 transition-opacity"
                              style={{ 
                                backgroundColor: "var(--tooltip-bg, #202f36)", 
                                borderColor: "var(--border-color, #37464f)",
                                color: "#58cc02" 
                              }}
                            >
                              START
                              <div 
                                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
                                style={{ 
                                  backgroundColor: "var(--tooltip-bg, #202f36)", 
                                  borderBottom: "2px solid var(--border-color, #37464f)", 
                                  borderRight: "2px solid var(--border-color, #37464f)" 
                                }}
                              />
                            </div>
                          )}

                          {/* Hover Level Badge Tooltip */}
                          <div 
                            className="absolute -top-14 left-1/2 -translate-x-1/2 font-extrabold text-xs px-4 py-2.5 rounded-xl border-2 z-50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none uppercase tracking-wider shadow-2xl flex items-center gap-x-1.5"
                            style={{ 
                              backgroundColor: "var(--bg-secondary, #18272c)", 
                              borderColor: "var(--border-color, #202f36)",
                              color: "var(--text-primary, #ffffff)" 
                            }}
                          >
                            <span className="text-[#1cb0f6] font-black">Level {overallLevelNumber}</span>
                            {node.title && <span className="opacity-80 text-gray-400">• {node.title}</span>}
                            {isLocked && <span className="text-[#ff4b4b] font-black">🔒 (LOCKED)</span>}
                            <div 
                              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
                              style={{ 
                                backgroundColor: "var(--bg-secondary, #18272c)", 
                                borderBottom: "2px solid var(--border-color, #202f36)", 
                                borderRight: "2px solid var(--border-color, #202f36)" 
                              }}
                            />
                          </div>
                          
                          {/* JUMP HERE Tooltip */}
                          {node.icon === 'fast-forward' && (
                            <div 
                              className="absolute -top-11 left-1/2 -translate-x-1/2 font-black text-xs px-4 py-2 rounded-xl border-2 z-20 whitespace-nowrap uppercase tracking-wider shadow-lg cursor-pointer group-hover:opacity-0 transition-opacity"
                              style={{ 
                                backgroundColor: "var(--bg-secondary, #18272c)", 
                                borderColor: "var(--border-color, #202f36)",
                                color: "#ce82ff" 
                              }}
                            >
                              JUMP HERE?
                              <div 
                                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
                                style={{ 
                                  backgroundColor: "var(--bg-secondary, #18272c)", 
                                  borderBottom: "2px solid var(--border-color, #202f36)", 
                                  borderRight: "2px solid var(--border-color, #202f36)" 
                                }}
                              />
                            </div>
                          )}

                          <SkillNode 
                            status={node.status} 
                            position={node.position} 
                            icon={node.icon} 
                            color={unit.color}
                          />
                        </Link>
                      </div>
                    );
                  })}
                </div>
                
                {/* Unit Separator */}
                {index < processedUnits.length - 1 && (
                  <div className="flex items-center w-full my-10">
                    <div className="flex-1 h-[2px]" style={{ backgroundColor: "var(--separator, #202f36)" }} />
                    <span className="mx-4 font-extrabold text-xs uppercase tracking-wider text-gray-400">
                      {processedUnits[index + 1]?.description || UNITS[index + 1]?.description}
                    </span>
                    <div className="flex-1 h-[2px]" style={{ backgroundColor: "var(--separator, #202f36)" }} />
                  </div>
                )}
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}

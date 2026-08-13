"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { UNITS } from "./_data/units";
import { UnitHeader } from "@/components/dashboard/UnitHeader";
import { SkillNode } from "@/components/dashboard/SkillNode";
import { RightSidebar } from "@/components/dashboard/RightSidebar";
import { fetchUnitsApi } from "@/lib/api";
import { useCourseStore } from "@/lib/store";
import { useUser } from "@/contexts/UserContext";
import { Lock } from "lucide-react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function Home() {
  const [unitsData, setUnitsData] = useState<any[]>(UNITS);
  const [duoLottie, setDuoLottie] = useState(null);
  const [lockToast, setLockToast] = useState<string | null>(null);
  
  const activeCourseId = useCourseStore((s) => s.activeCourseId);
  const { completedLessons } = useUser();

  useEffect(() => {
    fetch("/lottie/82f26795696242931a7b905b4918eb1e.json")
      .then((res) => res.json())
      .then(setDuoLottie);
  }, []);

  // Refetch units whenever the active course changes
  useEffect(() => {
    fetchUnitsApi(activeCourseId).then((apiUnits) => {
      if (apiUnits && apiUnits.length > 0) {
        const formatted = apiUnits.map((u: any) => ({
          title: u.title,
          description: u.description,
          color: u.color,
          nodes: (u.skills && u.skills.length > 0) ? u.skills.map((s: any) => ({
            id: s.id,
            title: s.title,
            lessonId: s.lesson_id || s.id,
            icon: s.icon,
            status: s.status,
            position: s.position,
            character: s.character,
          })) : [
            { id: 1, title: "Level 1", icon: "star", status: "locked", position: 0 },
            { id: 2, title: "Level 2", icon: "star", status: "locked", position: 1 },
            { id: 3, title: "Level 3", icon: "trophy", status: "locked", position: 0 },
          ],
        }));
        setUnitsData(formatted);
      } else {
        setUnitsData(UNITS);
      }
    });
  }, [activeCourseId]);

  // Apply strict sequential locking rules based on completedLessons
  let currentUnlockedFound = false;
  const processedUnits = unitsData.map((unit: any, uIdx: number) => {
    const processedNodes = unit.nodes.map((node: any, nIdx: number) => {
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
    <div className="flex flex-row-reverse gap-[48px] px-6 max-w-[1056px] mx-auto pt-6 pb-12 relative">
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
            const isUnitUnlocked = unit.nodes.some((n: any) => n.status === "current" || n.status === "completed") || index === 0;

            return (
              <div key={index} className="w-full flex flex-col items-center">
                <UnitHeader 
                  title={unit.title} 
                  description={unit.description} 
                  color={unit.color} 
                />
                
                <div className="w-full relative flex flex-col items-center gap-y-[30px] mt-10">
                  {unit.nodes.map((node: any, nodeIndex: number) => {
                    const overallLevelNumber = index * 5 + nodeIndex + 1;
                    const isLocked = node.status === "locked";

                    return (
                      <div key={nodeIndex} className="relative w-full flex justify-center hover:z-50">
                        {/* Character SVG / Lottie - colored for active/unlocked unit, grayscale for locked unit */}
                        {node.character && (
                          <div 
                            className={`absolute top-1/2 -translate-y-1/2 w-[130px] h-[130px] transition-all duration-300 pointer-events-none z-10 ${
                              node.position <= 0 ? "left-[calc(50%+70px)]" : "right-[calc(50%+70px)]"
                            } ${
                              !isUnitUnlocked ? "filter grayscale brightness-50 opacity-40" : "drop-shadow-xl"
                            }`}
                          >
                            {duoLottie ? (
                              <Lottie 
                                animationData={duoLottie} 
                                loop={true}
                                className="w-full h-full"
                              />
                            ) : (
                              <img 
                                src="https://d35aaqx5ub95lt.cloudfront.net/images/pathCharacters/dark/c4419cac8477c25a1761abbf438cf531.svg" 
                                alt="Duo" 
                                className="w-full h-full object-contain" 
                              />
                            )}
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
                              className="absolute -top-10 left-1/2 -translate-x-1/2 font-bold text-sm px-4 py-2 rounded-xl border-2 z-20 whitespace-nowrap animate-bounce uppercase tracking-wide cursor-pointer group-hover:opacity-0 transition-opacity"
                              style={{ 
                                backgroundColor: "var(--tooltip-bg)", 
                                borderColor: "var(--border-color)",
                                color: "#58cc02" 
                              }}
                            >
                              START
                              <div 
                                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
                                style={{ 
                                  backgroundColor: "var(--tooltip-bg)", 
                                  borderBottom: "2px solid var(--border-color)", 
                                  borderRight: "2px solid var(--border-color)" 
                                }}
                              />
                            </div>
                          )}

                          {/* Hover Level Badge Tooltip (Positioned with high z-index & offset so it renders ON TOP of everything) */}
                          <div 
                            className="absolute -top-14 left-1/2 -translate-x-1/2 font-extrabold text-xs px-4 py-2.5 rounded-xl border-2 z-50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none uppercase tracking-wider shadow-2xl flex items-center gap-x-1.5"
                            style={{ 
                              backgroundColor: "var(--bg-secondary)", 
                              borderColor: "var(--border-color)",
                              color: "var(--text-primary)" 
                            }}
                          >
                            <span className="text-[#1cb0f6] font-black">Level {overallLevelNumber}</span>
                            {node.title && <span className="opacity-80 text-gray-400">• {node.title}</span>}
                            {isLocked && <span className="text-[#ff4b4b] font-black">🔒 (LOCKED)</span>}
                            <div 
                              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
                              style={{ 
                                backgroundColor: "var(--bg-secondary)", 
                                borderBottom: "2px solid var(--border-color)", 
                                borderRight: "2px solid var(--border-color)" 
                              }}
                            />
                          </div>
                          
                          {/* JUMP HERE Tooltip */}
                          {node.icon === 'fast-forward' && (
                            <div 
                              className="absolute -top-10 left-1/2 -translate-x-1/2 font-bold text-sm px-4 py-2 rounded-xl border-2 z-20 whitespace-nowrap uppercase tracking-wide cursor-pointer group-hover:opacity-0 transition-opacity"
                              style={{ 
                                backgroundColor: "var(--bg-secondary)", 
                                borderColor: "var(--border-color)",
                                color: "#ce82ff" 
                              }}
                            >
                              JUMP HERE?
                              <div 
                                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
                                style={{ 
                                  backgroundColor: "var(--bg-secondary)", 
                                  borderBottom: "2px solid var(--border-color)", 
                                  borderRight: "2px solid var(--border-color)" 
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
                {index < UNITS.length - 1 && (
                  <div className="flex items-center w-full my-8 mt-12">
                    <div className="flex-1 h-[2px]" style={{ backgroundColor: "var(--separator)" }} />
                    <span className="mx-4 font-bold text-sm" style={{ color: "var(--text-muted)" }}>{processedUnits[index + 1]?.description || UNITS[index + 1]?.description}</span>
                    <div className="flex-1 h-[2px]" style={{ backgroundColor: "var(--separator)" }} />
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

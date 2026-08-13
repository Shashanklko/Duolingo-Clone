"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Check } from "lucide-react";
import { useCourseStore, ALL_COURSES } from "@/lib/store";

export default function CourseDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { activeCourseId, myCourses, customCourses, setActiveCourse } = useCourseStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const allAvailable = [...ALL_COURSES, ...customCourses];
  const enrolledCourses = allAvailable.filter((c) => myCourses.includes(c.id));
  const currentCourse = (mounted ? allAvailable.find((c) => c.id === activeCourseId) : ALL_COURSES[0]) || ALL_COURSES[0];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Flag Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center p-1.5 rounded-xl border-2 transition cursor-pointer ${
          isOpen
            ? "border-[#1cb0f6] bg-[#1cb0f6]/10"
            : "border-gray-300 dark:border-[#37464f] hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
        type="button"
      >
        <Image
          src={`https://flagcdn.com/w40/${currentCourse.flagCode}.png`}
          alt={currentCourse.name}
          width={32}
          height={24}
          className="rounded-md object-cover"
          onError={(e) => {
            (e.target as any).src = "https://flagcdn.com/w40/un.png";
          }}
        />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div
          className="absolute top-12 left-0 z-[100] w-[240px] rounded-2xl p-4 shadow-2xl border-2 animate-in fade-in zoom-in-95 duration-150"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-color)",
          }}
        >
          {/* Arrow Tail */}
          <div
            className="absolute -top-2 left-5 w-3 h-3 rotate-45 border-t-2 border-l-2"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-color)",
            }}
          />

          <div className="text-xs font-extrabold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
            MY COURSES
          </div>

          {/* Course List */}
          <div className="flex flex-col gap-y-1 mb-3 max-h-[260px] overflow-y-auto">
            {enrolledCourses.map((course) => {
              const isSelected = course.id === activeCourseId;

              return (
                <button
                  key={course.id}
                  onClick={() => {
                    setActiveCourse(course.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition font-bold text-sm cursor-pointer ${
                    isSelected
                      ? "bg-[#1cb0f6]/10 text-[#1cb0f6]"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-x-3">
                    <Image
                      src={`https://flagcdn.com/w40/${course.flagCode}.png`}
                      alt={course.name}
                      width={28}
                      height={20}
                      className="rounded-sm object-cover border"
                      onError={(e) => {
                        (e.target as any).src = "https://flagcdn.com/w40/un.png";
                      }}
                    />
                    <span>{course.name}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#1cb0f6] stroke-[3]" />}
                </button>
              );
            })}
          </div>

          <div className="w-full h-[1px] bg-gray-200 dark:bg-gray-700 my-2" />

          {/* Add New Course Button */}
          <Link
            href="/courses/all"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-x-3 px-3 py-2.5 rounded-xl font-bold text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <div className="w-7 h-7 rounded-lg border-2 border-dashed border-gray-400 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <span>Add unlisted course</span>
          </Link>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useCourseStore, ALL_COURSES, type CourseOption } from "@/lib/store";
import { fetchCoursesApi } from "@/lib/api";
import { Users, BookOpen, Check, Trash2 } from "lucide-react";

interface CourseWithMeta extends CourseOption {
  learners?: string | null;
}

export default function CoursesAllPage() {
  const router = useRouter();
  const { activeCourseId, setActiveCourse, removeCourse, myCourses } = useCourseStore();
  const [courses, setCourses] = useState<CourseWithMeta[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    fetchCoursesApi().then((apiCourses) => {
      if (apiCourses && apiCourses.length > 0) {
        setCourses(apiCourses.map((c: any) => ({
          id: c.language_code,
          name: c.name,
          flagCode: c.flag_code,
          learners: c.learners || "10.5M learners",
        })));
      } else {
        setCourses(ALL_COURSES.map((c) => ({ ...c, learners: "10.5M learners" })));
      }
    });
  }, []);

  const handleCourseClick = (courseId: string) => {
    setActiveCourse(courseId);
    router.push("/learn");
  };

  const handleRemoveCourse = (e: React.MouseEvent, courseId: string) => {
    e.stopPropagation();
    removeCourse(courseId);
  };

  const isEnrolled = (id: string) => myCourses.includes(id) || activeCourseId === id;

  return (
    <div className="w-full flex flex-col flex-1 bg-white min-h-screen font-sans">
      <Navbar />

      {/* Hero Header */}
      <div className="w-full bg-gradient-to-b from-[#58cc02]/5 via-[#58cc02]/3 to-white pt-16 pb-10 px-6 text-center">
        <div className="max-w-[988px] mx-auto">
          <h1 className="text-[36px] sm:text-[44px] lg:text-[48px] font-black text-[#3c3c3c] leading-tight mb-3 tracking-tight">
            Language courses made by experts
          </h1>
          <p className="text-[17px] sm:text-[19px] text-[#777] font-bold max-w-[640px] mx-auto">
            Choose from over {courses.length} language courses.
          </p>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="flex-1 px-6 pb-24">
        <div className="max-w-[988px] mx-auto">
          {/* Section Bar */}
          <div className="flex items-center justify-between gap-3 mb-8">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-[#58cc02] stroke-[2.5]" />
              <h2 className="text-[20px] font-black text-[#3c3c3c] uppercase tracking-wide">
                ALL COURSES
              </h2>
              <span className="bg-[#e5e5e5] text-[#777] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                {courses.length} LANGUAGES
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {courses.map((course) => {
              const enrolled = isEnrolled(course.id);
              const isSelected = activeCourseId === course.id;
              const hovered = hoveredId === course.id;

              return (
                <div
                  key={course.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleCourseClick(course.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleCourseClick(course.id);
                  }}
                  onMouseEnter={() => setHoveredId(course.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`group relative flex flex-col items-center justify-center p-5 pb-5 rounded-2xl border-2 transition-all duration-200 bg-white cursor-pointer ${
                    isSelected
                      ? "border-[#58cc02] ring-2 ring-[#58cc02]/30 shadow-lg shadow-[#58cc02]/10"
                      : enrolled
                      ? "border-[#58cc02]/50 hover:border-[#58cc02]"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-200/60"
                  } active:scale-[0.98] min-h-[175px]`}
                >
                  {/* Remove / Un-enroll Course Button (Top Left) */}
                  {enrolled && (
                    <button
                      onClick={(e) => handleRemoveCourse(e, course.id)}
                      title="Remove course"
                      className="absolute top-2.5 left-2.5 w-6 h-6 bg-gray-100 hover:bg-[#ff4b4b] text-gray-400 hover:text-white rounded-full flex items-center justify-center transition-all cursor-pointer z-10 opacity-70 hover:opacity-100"
                      type="button"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Enrolled / Active Checkmark Badge (Top Right) */}
                  {enrolled && (
                    <div className="absolute top-2.5 right-2.5 w-6 h-6 bg-[#58cc02] rounded-full flex items-center justify-center shadow-md">
                      <Check className="w-4 h-4 text-white stroke-[3]" />
                    </div>
                  )}

                  {/* Flag Image */}
                  <div className={`mb-3 transition-transform duration-200 ${hovered ? "scale-110" : ""}`}>
                    <Image
                      src={`https://flagcdn.com/w80/${course.flagCode}.png`}
                      alt={course.name}
                      width={64}
                      height={46}
                      className="rounded-xl shadow-sm object-cover border border-gray-100"
                      style={{ width: 64, height: 46 }}
                      onError={(e) => {
                        (e.target as any).src = "https://flagcdn.com/w80/un.png";
                      }}
                    />
                  </div>

                  {/* Course Name */}
                  <h3 className="font-black text-[#3c3c3c] text-[16px] mb-1 group-hover:text-[#1cb0f6] transition leading-tight text-center">
                    {course.name}
                  </h3>

                  {/* Learner Count */}
                  {course.learners && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Users className="w-3 h-3 text-[#afafaf]" />
                      <p className="text-[#afafaf] font-bold text-[12px]">
                        {course.learners}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

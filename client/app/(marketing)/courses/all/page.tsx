"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useCourseStore, ALL_COURSES, type CourseOption } from "@/lib/store";
import { fetchCoursesApi } from "@/lib/api";
import { Users, BookOpen, ChevronRight, PlusCircle, Globe, Sparkles, X } from "lucide-react";

interface CourseWithMeta extends CourseOption {
  learners?: string | null;
}

export default function CoursesAllPage() {
  const router = useRouter();
  const { setActiveCourse, myCourses, customCourses, addCustomCourse } = useCourseStore();
  const [courses, setCourses] = useState<CourseWithMeta[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Unlisted course modal state
  const [showModal, setShowModal] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customFlag, setCustomFlag] = useState("un");

  useEffect(() => {
    fetchCoursesApi().then((apiCourses) => {
      let baseCourses: CourseWithMeta[] = [];
      if (apiCourses && apiCourses.length > 0) {
        baseCourses = apiCourses.map((c: any) => ({
          id: c.language_code,
          name: c.name,
          flagCode: c.flag_code,
          learners: c.learners,
        }));
      } else {
        baseCourses = ALL_COURSES.map((c) => ({ ...c, learners: null }));
      }

      // Merge user custom/unlisted courses
      const merged = [...baseCourses];
      customCourses.forEach((cc) => {
        if (!merged.some((existing) => existing.id === cc.id)) {
          merged.push({
            id: cc.id,
            name: cc.name,
            flagCode: cc.flagCode,
            learners: "Custom Course",
            isCustom: true,
          });
        }
      });

      setCourses(merged);
    });
  }, [customCourses]);

  const handleCourseClick = (courseId: string) => {
    setActiveCourse(courseId);
    router.push("/learn");
  };

  const handleAddCustomCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    const code = customName.trim().toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 10);
    addCustomCourse(customName, code, customFlag);
    setShowModal(false);
    setCustomName("");
    router.push("/learn");
  };

  const isEnrolled = (id: string) => myCourses.includes(id);

  return (
    <div className="w-full flex flex-col flex-1 bg-white min-h-screen">
      <Navbar />

      {/* Hero Header */}
      <div className="w-full bg-gradient-to-b from-[#58cc02]/5 to-white pt-20 pb-12 px-6">
        <div className="max-w-[988px] mx-auto text-center">
          <h1 className="text-[40px] md:text-[48px] font-extrabold text-[#3c3c3c] leading-tight mb-4">
            Language courses made by experts
          </h1>
          <p className="text-[18px] text-[#777] font-medium max-w-[600px] mx-auto">
            Choose from over {courses.length} languages, or add an unlisted custom course.
          </p>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="flex-1 px-6 pb-20">
        <div className="max-w-[988px] mx-auto">
          {/* Section Label */}
          <div className="flex items-center justify-between gap-3 mb-8">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-[#58cc02]" />
              <h2 className="text-[22px] font-extrabold text-[#3c3c3c] uppercase tracking-wide">
                All courses
              </h2>
              <span className="bg-[#e5e5e5] text-[#777] text-xs font-extrabold px-2.5 py-1 rounded-full uppercase">
                {courses.length} languages
              </span>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-x-2 bg-[#1cb0f6] text-white text-sm font-extrabold px-4 py-2.5 rounded-2xl hover:bg-[#1899d6] transition border-b-4 border-[#1899d6] active:border-b-0 active:translate-y-[2px] cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Unlisted Course</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {courses.map((course) => {
              const enrolled = isEnrolled(course.id);
              const hovered = hoveredId === course.id;

              return (
                <button
                  key={course.id}
                  onClick={() => handleCourseClick(course.id)}
                  onMouseEnter={() => setHoveredId(course.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`group relative flex flex-col items-center justify-center p-5 pb-4 rounded-2xl border-2 transition-all duration-200 bg-white cursor-pointer ${
                    enrolled
                      ? "border-[#58cc02]/40 hover:border-[#58cc02] hover:shadow-lg hover:shadow-[#58cc02]/10"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-200/60"
                  } active:scale-[0.97]`}
                >
                  {/* Enrolled badge */}
                  {enrolled && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-[#58cc02] rounded-full flex items-center justify-center">
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}

                  {/* Flag */}
                  <div className={`mb-3 transition-transform duration-200 ${hovered ? "scale-110" : ""}`}>
                    <Image
                      src={`https://flagcdn.com/w80/${course.flagCode}.png`}
                      alt={course.name}
                      width={72}
                      height={54}
                      className="rounded-lg shadow-sm object-cover"
                      style={{ width: 72, height: 54 }}
                      onError={(e) => {
                        (e.target as any).src = "https://flagcdn.com/w80/un.png";
                      }}
                    />
                  </div>

                  {/* Course Name */}
                  <h3 className="font-extrabold text-[#4b4b4b] text-[16px] mb-1 group-hover:text-[#3c3c3c] transition leading-tight text-center">
                    {course.name}
                  </h3>

                  {/* Learner Count */}
                  {course.learners && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Users className="w-3 h-3 text-[#afafaf]" />
                      <p className="text-[#afafaf] font-semibold text-[12px]">
                        {course.learners}
                      </p>
                    </div>
                  )}

                  {/* Hover CTA */}
                  <div className={`flex items-center gap-1 mt-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                  } ${enrolled ? "text-[#58cc02]" : "text-[#1cb0f6]"}`}>
                    <span>{enrolled ? "Continue" : "Start course"}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}

            {/* Unlisted Course Card Option */}
            <button
              onClick={() => setShowModal(true)}
              className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-[#1cb0f6] bg-[#1cb0f6]/5 hover:bg-[#1cb0f6]/10 hover:border-[#1cb0f6] transition-all cursor-pointer group text-center min-h-[160px]"
            >
              <div className="w-12 h-12 rounded-full bg-[#1cb0f6] text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <PlusCircle className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-[#1cb0f6] text-[15px] mb-1">
                Unlisted Course
              </h3>
              <p className="text-xs text-gray-500 font-bold">Add any custom language</p>
            </button>
          </div>
        </div>
      </div>

      {/* Unlisted Course Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-[440px] w-full relative shadow-2xl border-2 border-gray-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-x-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#1cb0f6]/10 flex items-center justify-center text-[#1cb0f6]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-xl text-[#3c3c3c]">Add Unlisted Course</h3>
                <p className="text-xs font-bold text-gray-400">Start learning any custom language</p>
              </div>
            </div>

            <form onSubmit={handleAddCustomCourseSubmit} className="flex flex-col gap-y-4 mt-4">
              <div>
                <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wide mb-1">
                  Language Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sanskrit, Tamil, Swahili, Latin"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 font-bold text-sm focus:border-[#1cb0f6] focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wide mb-1">
                  Country Flag Code (2 letters)
                </label>
                <input
                  type="text"
                  placeholder="e.g. in, ke, vn, tr, un"
                  value={customFlag}
                  onChange={(e) => setCustomFlag(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 font-bold text-sm focus:border-[#1cb0f6] focus:outline-none transition uppercase"
                />
              </div>

              <div className="flex gap-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-2xl border-2 border-gray-200 font-extrabold text-sm text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-[#58cc02] text-white font-extrabold text-sm hover:bg-[#46a302] border-b-4 border-[#46a302] active:border-b-0 active:translate-y-[2px] transition cursor-pointer"
                >
                  Start Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

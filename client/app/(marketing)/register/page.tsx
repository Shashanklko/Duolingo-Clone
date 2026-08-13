"use client";

import React from "react";
import Navbar from "@/components/shared/Navbar";
import { Calculator, TowerControl } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCourseStore } from "@/lib/store";

export default function RegisterPage() {
  const router = useRouter();
  const setActiveCourse = useCourseStore((s) => s.setActiveCourse);

  const courses = [
    { name: "Spanish", learners: "42M learners", code: "es", courseId: "es" },
    { name: "French", learners: "22.8M learners", code: "fr", courseId: "fr" },
    { name: "Chess", learners: null, code: "chess", courseId: null },
    { name: "English", learners: "20.8M learners", code: "us", courseId: null },
    { name: "Japanese", learners: "18.2M learners", code: "jp", courseId: "jp" },
    { name: "German", learners: "15.9M learners", code: "de", courseId: "de" },
    { name: "Math", learners: null, code: "math", courseId: null },
    { name: "Hindi", learners: "13.9M learners", code: "in", courseId: "hi" },
  ];

  const handleCourseSelect = (courseId: string | null) => {
    if (courseId) {
      setActiveCourse(courseId);
    }
    router.push('/learn');
  };

  return (
    <div className="w-full min-h-screen flex flex-col flex-1 bg-white">
      <Navbar />
      
      <div className="flex-1 flex flex-col items-center pt-16 px-6">
        <h1 className="text-[32px] font-extrabold text-[#4b4b4b] mb-12">
          I want to learn...
        </h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-[988px] w-full">
          {courses.map((course) => (
            <button
              key={course.name}
              onClick={() => handleCourseSelect(course.courseId)}
              className="group flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-2xl hover:bg-gray-100 hover:border-gray-300 active:border-b-2 active:mt-[2px] transition-all bg-white relative cursor-pointer"
            >
              <div className="mb-4">
                {course.code === "chess" ? (
                  <div className="w-[60px] h-[45px] bg-[#00d073] rounded-lg flex items-center justify-center shadow-sm">
                    <TowerControl className="w-8 h-8 text-white stroke-[2.5]" />
                  </div>
                ) : course.code === "math" ? (
                  <div className="w-[60px] h-[45px] bg-[#1cb0f6] rounded-lg flex items-center justify-center shadow-sm">
                    <Calculator className="w-8 h-8 text-white stroke-[2.5]" />
                  </div>
                ) : (
                  <img 
                    src={`https://flagcdn.com/w80/${course.code}.png`}
                    alt={course.name}
                    className="w-[60px] h-[45px] object-cover rounded-lg shadow-sm"
                  />
                )}
              </div>
              
              <h3 className="font-extrabold text-[#4b4b4b] text-[17px] mb-1 group-hover:text-gray-900 transition">
                {course.name}
              </h3>
              
              {course.learners && (
                <p className="text-[#afafaf] font-medium text-[15px]">
                  {course.learners}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

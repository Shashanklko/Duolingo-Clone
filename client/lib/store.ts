import { create } from 'zustand';

type AuthModalState = {
  isOpen: boolean;
  type: 'login' | 'signup';
  signupStep: 'age' | 'profile';
  openLogin: () => void;
  openSignup: () => void;
  closeModal: () => void;
  setSignupStep: (step: 'age' | 'profile') => void;
};

export const useAuthModal = create<AuthModalState>((set) => ({
  isOpen: false,
  type: 'login',
  signupStep: 'age',
  openLogin: () => set({ isOpen: true, type: 'login' }),
  openSignup: () => set({ isOpen: true, type: 'signup', signupStep: 'age' }),
  closeModal: () => set({ isOpen: false }),
  setSignupStep: (step) => set({ signupStep: step }),
}));

// ── Course Store ──────────────────────────────────────────────────────
export interface CourseOption {
  id: string;
  name: string;
  flagCode: string;
  isCustom?: boolean;
}

export const ALL_COURSES: CourseOption[] = [
  { id: "en", name: "English", flagCode: "us" },
  { id: "es", name: "Spanish", flagCode: "es" },
  { id: "hi", name: "Hindi", flagCode: "in" },
  { id: "fr", name: "French", flagCode: "fr" },
  { id: "de", name: "German", flagCode: "de" },
  { id: "it", name: "Italian", flagCode: "it" },
  { id: "pt", name: "Portuguese", flagCode: "br" },
  { id: "nl", name: "Dutch", flagCode: "nl" },
  { id: "jp", name: "Japanese", flagCode: "jp" },
  { id: "ar", name: "Arabic", flagCode: "sa" },
  { id: "cs", name: "Czech", flagCode: "cz" },
  { id: "cy", name: "Welsh", flagCode: "gb-wls" },
  { id: "da", name: "Danish", flagCode: "dk" },
  { id: "el", name: "Greek", flagCode: "gr" },
  { id: "he", name: "Hebrew", flagCode: "il" },
  { id: "hu", name: "Hungarian", flagCode: "hu" },
  { id: "id", name: "Indonesian", flagCode: "id" },
  { id: "ko", name: "Korean", flagCode: "kr" },
  { id: "la", name: "Latin", flagCode: "va" },
  { id: "nb", name: "Norwegian", flagCode: "no" },
  { id: "pl", name: "Polish", flagCode: "pl" },
];

type CourseState = {
  activeCourseId: string;
  myCourses: string[];          // IDs the user has added
  customCourses: CourseOption[]; // Unlisted courses added by user
  setActiveCourse: (id: string) => void;
  addCourse: (id: string) => void;
  addCustomCourse: (name: string, languageCode: string, flagCode?: string) => void;
};

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export const useCourseStore = create<CourseState>((set) => ({
  activeCourseId: loadFromStorage<string>("duo-active-course", "en"),
  myCourses: loadFromStorage<string[]>("duo-my-courses", ["en", "es", "hi"]),
  customCourses: loadFromStorage<CourseOption[]>("duo-custom-courses", []),

  setActiveCourse: (id) => {
    set((state) => {
      const myCourses = state.myCourses.includes(id)
        ? state.myCourses
        : [...state.myCourses, id];
      try {
        localStorage.setItem("duo-active-course", JSON.stringify(id));
        localStorage.setItem("duo-my-courses", JSON.stringify(myCourses));
      } catch {}
      return { activeCourseId: id, myCourses };
    });
  },

  addCourse: (id) => {
    set((state) => {
      if (state.myCourses.includes(id)) return state;
      const myCourses = [...state.myCourses, id];
      try {
        localStorage.setItem("duo-my-courses", JSON.stringify(myCourses));
      } catch {}
      return { myCourses };
    });
  },

  addCustomCourse: (name, languageCode, flagCode) => {
    const code = languageCode.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 10);
    const newCourse: CourseOption = {
      id: code,
      name: name.trim(),
      flagCode: flagCode || "un",
      isCustom: true,
    };
    set((state) => {
      const updatedCustom = [...state.customCourses.filter((c) => c.id !== code), newCourse];
      const updatedMy = [...state.myCourses.filter((id) => id !== code), code];
      try {
        localStorage.setItem("duo-custom-courses", JSON.stringify(updatedCustom));
        localStorage.setItem("duo-active-course", JSON.stringify(code));
        localStorage.setItem("duo-my-courses", JSON.stringify(updatedMy));
      } catch {}
      return {
        customCourses: updatedCustom,
        activeCourseId: code,
        myCourses: updatedMy,
      };
    });
  },
}));

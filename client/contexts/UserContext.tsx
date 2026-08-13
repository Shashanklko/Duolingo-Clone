"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUserApi, syncProgressApi } from "@/lib/api";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  isGuest: boolean;
}

interface UserContextType {
  user: UserProfile;
  xp: number;
  streak: number;
  hearts: number;
  gems: number;
  isSuper: boolean;
  unlockedUnits: number[];
  completedLessons: string[];
  achievements: Achievement[];
  loginUser: (name?: string, email?: string) => void;
  logoutUser: () => void;
  addXp: (amount: number) => void;
  addGems: (amount: number) => void;
  addStreak: (days?: number) => void;
  deductHeart: () => void;
  refillHearts: () => void;
  spendGems: (amount: number) => boolean;
  buySuper: () => void;
  unlockNextUnit: (unitNumber: number) => void;
  completeLesson: (lessonId: string) => void;
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: "wildfire",
    title: "Wildfire",
    description: "Reach a 3-day streak",
    icon: "🔥",
    progress: 1,
    maxProgress: 3,
    unlocked: false,
  },
  {
    id: "sage",
    title: "Sage",
    description: "Earn 100 XP",
    icon: "⚡",
    progress: 50,
    maxProgress: 100,
    unlocked: false,
  },
  {
    id: "scholar",
    title: "Scholar",
    description: "Complete 5 lessons",
    icon: "🎓",
    progress: 1,
    maxProgress: 5,
    unlocked: false,
  },
  {
    id: "champion",
    title: "Champion",
    description: "Unlock Unit 2",
    icon: "🏆",
    progress: 1,
    maxProgress: 2,
    unlocked: false,
  },
];

const DEFAULT_USER: UserProfile = {
  name: "Guest Learner",
  email: "",
  isGuest: true,
};

const DEFAULT_CONTEXT_VALUE: UserContextType = {
  user: DEFAULT_USER,
  xp: 50,
  streak: 3,
  hearts: 5,
  gems: 500,
  isSuper: false,
  unlockedUnits: [1],
  completedLessons: [],
  achievements: DEFAULT_ACHIEVEMENTS,
  loginUser: () => {},
  logoutUser: () => {},
  addXp: () => {},
  addGems: () => {},
  addStreak: () => {},
  deductHeart: () => {},
  refillHearts: () => {},
  spendGems: () => true,
  buySuper: () => {},
  unlockNextUnit: () => {},
  completeLesson: () => {},
};

const UserContext = createContext<UserContextType>(DEFAULT_CONTEXT_VALUE);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [xp, setXp] = useState<number>(50);
  const [streak, setStreak] = useState<number>(3);
  const [hearts, setHearts] = useState<number>(5);
  const [gems, setGems] = useState<number>(500);
  const [isSuper, setIsSuper] = useState<boolean>(false);
  const [unlockedUnits, setUnlockedUnits] = useState<number[]>([1]);
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("duo-completed-lessons");
        return raw ? JSON.parse(raw) : [];
      }
    } catch {}
    return [];
  });
  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);

  // Load saved user from localStorage on mount & sync from FastAPI
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("duo-user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      // localStorage unavailable
    }
  }, []);

  const loginUser = (name?: string, email?: string) => {
    const newUser: UserProfile = {
      name: name || "Learner",
      email: email || "learner@duolingo.clone",
      isGuest: false,
    };
    setUser(newUser);
    try {
      localStorage.setItem("duo-user", JSON.stringify(newUser));
    } catch (e) {}
    loginUserApi(newUser.name, newUser.email);
  };

  const logoutUser = () => {
    setUser(DEFAULT_USER);
    try {
      localStorage.removeItem("duo-user");
    } catch (e) {}
  };

  const addXp = (amount: number) => {
    setXp((prev) => {
      const nextXp = prev + amount;
      setAchievements((achs) =>
        achs.map((a) =>
          a.id === "sage"
            ? {
                ...a,
                progress: Math.min(nextXp, a.maxProgress),
                unlocked: nextXp >= a.maxProgress,
              }
            : a
        )
      );
      syncProgressApi({ xp: nextXp, streak, hearts, gems });
      return nextXp;
    });
  };

  const addGems = (amount: number) => {
    setGems((prev) => {
      const nextGems = prev + amount;
      syncProgressApi({ xp, streak, hearts, gems: nextGems });
      return nextGems;
    });
  };

  const addStreak = (days: number = 1) => {
    setStreak((prev) => {
      const nextStreak = prev + days;
      syncProgressApi({ xp, streak: nextStreak, hearts, gems });
      return nextStreak;
    });
  };

  const deductHeart = () => {
    if (isSuper) return;
    setHearts((prev) => Math.max(0, prev - 1));
  };

  const refillHearts = () => {
    setHearts(5);
  };

  const spendGems = (amount: number): boolean => {
    if (gems >= amount) {
      setGems((prev) => {
        const next = prev - amount;
        syncProgressApi({ xp, streak, hearts, gems: next });
        return next;
      });
      return true;
    }
    return false;
  };

  const buySuper = () => {
    setIsSuper(true);
    setHearts(5);
  };

  const unlockNextUnit = (unitNumber: number) => {
    if (!unlockedUnits.includes(unitNumber)) {
      setUnlockedUnits((prev) => [...prev, unitNumber]);
      setAchievements((achs) =>
        achs.map((a) =>
          a.id === "champion"
            ? { ...a, progress: 2, unlocked: true }
            : a
        )
      );
    }
  };

  const completeLesson = (lessonId: string) => {
    const sId = String(lessonId);
    setCompletedLessons((prev) => {
      if (!prev.includes(sId)) {
        const nextLessons = [...prev, sId];
        try {
          localStorage.setItem("duo-completed-lessons", JSON.stringify(nextLessons));
        } catch {}
        setAchievements((achs) =>
          achs.map((a) =>
            a.id === "scholar"
              ? {
                  ...a,
                  progress: Math.min(nextLessons.length, a.maxProgress),
                  unlocked: nextLessons.length >= a.maxProgress,
                }
              : a
          )
        );
        return nextLessons;
      }
      return prev;
    });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        xp,
        streak,
        hearts,
        gems,
        isSuper,
        unlockedUnits,
        completedLessons,
        achievements,
        loginUser,
        logoutUser,
        addXp,
        addGems,
        addStreak,
        deductHeart,
        refillHearts,
        spendGems,
        buySuper,
        unlockNextUnit,
        completeLesson,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  return context || DEFAULT_CONTEXT_VALUE;
}

"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { loginUserApi, syncProgressApi, fetchUserProfileApi } from "@/lib/api";

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
  id?: number;
  name: string;
  email: string;
  isGuest: boolean;
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDaysDifference(date1: string, date2: string): number {
  try {
    const d1 = new Date(date1 + "T00:00:00");
    const d2 = new Date(date2 + "T00:00:00");
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

interface UserContextType {
  user: UserProfile;
  xp: number;
  streak: number;
  hearts: number;
  gems: number;
  isSuper: boolean;
  lastActiveDate: string | null;
  streakHistory: string[];
  practicedToday: boolean;
  unlockedUnits: number[];
  completedLessons: string[];
  achievements: Achievement[];
  loginUser: (name?: string, email?: string) => void;
  logoutUser: () => void;
  addXp: (amount: number) => void;
  addGems: (amount: number) => void;
  addStreak: (days?: number) => void;
  recordDailyActivity: (lessonId?: string | number, xpBonus?: number, gemsBonus?: number) => { nextStreak: number; nextXp: number; nextGems: number };
  deductHeart: () => void;
  refillHearts: () => void;
  spendGems: (amount: number) => boolean;
  buySuper: () => void;
  unlockNextUnit: (unitNumber: number) => void;
  completeLesson: (lessonId: string) => void;
  resetGuestData: () => void;
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: "wildfire",
    title: "Wildfire",
    description: "Reach a 3-day streak",
    icon: "🔥",
    progress: 0,
    maxProgress: 3,
    unlocked: false,
  },
  {
    id: "sage",
    title: "Sage",
    description: "Earn 100 XP",
    icon: "⚡",
    progress: 0,
    maxProgress: 100,
    unlocked: false,
  },
  {
    id: "scholar",
    title: "Scholar",
    description: "Complete 5 lessons",
    icon: "🎓",
    progress: 0,
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
  name: "Learner",
  email: "",
  isGuest: true,
};

const DEFAULT_CONTEXT_VALUE: UserContextType = {
  user: DEFAULT_USER,
  xp: 0,
  streak: 0,
  hearts: 5,
  gems: 500,
  isSuper: false,
  lastActiveDate: null,
  streakHistory: [],
  practicedToday: false,
  unlockedUnits: [1],
  completedLessons: [],
  achievements: DEFAULT_ACHIEVEMENTS,
  loginUser: () => {},
  logoutUser: () => {},
  addXp: () => {},
  addGems: () => {},
  addStreak: () => {},
  recordDailyActivity: () => ({ nextStreak: 0, nextXp: 0, nextGems: 0 }),
  deductHeart: () => {},
  refillHearts: () => {},
  spendGems: () => true,
  buySuper: () => {},
  unlockNextUnit: () => {},
  completeLesson: () => {},
  resetGuestData: () => {},
};

const UserContext = createContext<UserContextType>(DEFAULT_CONTEXT_VALUE);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [xp, setXp] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [hearts, setHearts] = useState<number>(5);
  const [gems, setGems] = useState<number>(500);
  const [isSuper, setIsSuper] = useState<boolean>(false);
  const [unlockedUnits, setUnlockedUnits] = useState<number[]>([1]);
  const [lastActiveDate, setLastActiveDate] = useState<string | null>(null);
  const [streakHistory, setStreakHistory] = useState<string[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);

  // Compute if today is completed
  const todayStr = useMemo(() => getTodayDateString(), []);
  const practicedToday = useMemo(() => {
    return lastActiveDate === todayStr;
  }, [lastActiveDate, todayStr]);

  // Load initial local data & sync with backend API
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("duo-user");
        if (storedUser) setUser(JSON.parse(storedUser));

        const storedXp = localStorage.getItem("duo-xp");
        if (storedXp !== null) setXp(Number(storedXp));

        const storedHearts = localStorage.getItem("duo-hearts");
        if (storedHearts !== null) setHearts(Number(storedHearts));

        const storedGems = localStorage.getItem("duo-gems");
        if (storedGems !== null) setGems(Number(storedGems));

        const storedLessons = localStorage.getItem("duo-completed-lessons");
        if (storedLessons) setCompletedLessons(JSON.parse(storedLessons));

        const storedLastActive = localStorage.getItem("duo-last-active-date");
        const storedHistory = localStorage.getItem("duo-streak-history");
        const storedStreak = localStorage.getItem("duo-streak");

        const historyArr = storedHistory ? JSON.parse(storedHistory) : [];
        setStreakHistory(historyArr);

        if (storedStreak !== null && storedLastActive) {
          const numStreak = Number(storedStreak);
          const currentToday = getTodayDateString();
          const diffDays = getDaysDifference(storedLastActive, currentToday);

          if (storedLastActive === currentToday) {
            // Already practiced today
            setStreak(numStreak);
            setLastActiveDate(storedLastActive);
          } else if (diffDays === 1 && storedLastActive < currentToday) {
            // Practiced yesterday, streak is alive and pending today's lesson
            setStreak(numStreak);
            setLastActiveDate(storedLastActive);
          } else if (diffDays > 1 && storedLastActive < currentToday) {
            // Missed a day: streak resets to 0
            setStreak(0);
            setLastActiveDate(storedLastActive);
            localStorage.setItem("duo-streak", "0");
          } else {
            setStreak(numStreak);
            setLastActiveDate(storedLastActive);
          }
        }
      }
    } catch (e) {
      console.warn("Error loading local storage state:", e);
    }

    // Backend sync
    fetchUserProfileApi(1).then((apiUser) => {
      if (apiUser) {
        setUser((prev) => ({
          id: apiUser.id,
          name: apiUser.name || prev.name,
          email: apiUser.email || prev.email,
          isGuest: apiUser.is_guest ?? prev.isGuest,
        }));
        if (apiUser.xp !== undefined) {
          setXp(apiUser.xp);
          localStorage.setItem("duo-xp", String(apiUser.xp));
        }
        if (apiUser.streak !== undefined) {
          setStreak(apiUser.streak);
          localStorage.setItem("duo-streak", String(apiUser.streak));
        }
        if (apiUser.hearts !== undefined) {
          setHearts(apiUser.hearts);
          localStorage.setItem("duo-hearts", String(apiUser.hearts));
        }
        if (apiUser.gems !== undefined) {
          setGems(apiUser.gems);
          localStorage.setItem("duo-gems", String(apiUser.gems));
        }
        if (apiUser.last_active_date) {
          setLastActiveDate(apiUser.last_active_date);
          localStorage.setItem("duo-last-active-date", apiUser.last_active_date);
        }
        if (Array.isArray(apiUser.completed_lesson_ids) && apiUser.completed_lesson_ids.length > 0) {
          const stringIds = apiUser.completed_lesson_ids.map(String);
          setCompletedLessons((prev) => {
            const merged = Array.from(new Set([...prev, ...stringIds]));
            localStorage.setItem("duo-completed-lessons", JSON.stringify(merged));
            return merged;
          });
        }
      }
    }).catch(() => {});
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

  const resetGuestData = () => {
    try {
      localStorage.removeItem("duo-user");
      localStorage.removeItem("duo-completed-lessons");
      localStorage.removeItem("duo-streak");
      localStorage.removeItem("duo-last-active-date");
      localStorage.removeItem("duo-streak-history");
      localStorage.removeItem("duo-xp");
      localStorage.removeItem("duo-gems");
      localStorage.removeItem("duo-hearts");
      localStorage.removeItem("duo-unlocked-units");
    } catch (e) {}

    setUser(DEFAULT_USER);
    setXp(0);
    setStreak(0);
    setHearts(5);
    setGems(500);
    setIsSuper(false);
    setLastActiveDate(null);
    setStreakHistory([]);
    setUnlockedUnits([1]);
    setCompletedLessons([]);
    setAchievements(DEFAULT_ACHIEVEMENTS);
  };

  const logoutUser = () => {
    resetGuestData();
  };

  const addXp = (amount: number) => {
    setXp((prev) => {
      const nextXp = prev + amount;
      try {
        localStorage.setItem("duo-xp", String(nextXp));
      } catch {}
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
      syncProgressApi({ xp: nextXp, streak, hearts, gems, last_active_date: lastActiveDate || undefined });
      return nextXp;
    });
  };

  const addGems = (amount: number) => {
    setGems((prev) => {
      const nextGems = prev + amount;
      try {
        localStorage.setItem("duo-gems", String(nextGems));
      } catch {}
      syncProgressApi({ xp, streak, hearts, gems: nextGems, last_active_date: lastActiveDate || undefined });
      return nextGems;
    });
  };

  const addStreak = (days: number = 1) => {
    const today = getTodayDateString();
    setStreak((prev) => {
      const nextStreak = prev + days;
      setLastActiveDate(today);
      try {
        localStorage.setItem("duo-streak", String(nextStreak));
        localStorage.setItem("duo-last-active-date", today);
      } catch {}
      syncProgressApi({ xp, streak: nextStreak, hearts, gems, last_active_date: today });
      return nextStreak;
    });
  };

  const deductHeart = () => {
    if (isSuper) return;
    setHearts((prev) => {
      const nextHearts = Math.max(0, prev - 1);
      try {
        localStorage.setItem("duo-hearts", String(nextHearts));
      } catch {}
      syncProgressApi({ xp, streak, hearts: nextHearts, gems, last_active_date: lastActiveDate || undefined });
      return nextHearts;
    });
  };

  const refillHearts = () => {
    setHearts(5);
    try {
      localStorage.setItem("duo-hearts", "5");
    } catch {}
    syncProgressApi({ xp, streak, hearts: 5, gems, last_active_date: lastActiveDate || undefined });
  };

  const spendGems = (amount: number): boolean => {
    if (gems >= amount) {
      setGems((prev) => {
        const next = prev - amount;
        try {
          localStorage.setItem("duo-gems", String(next));
        } catch {}
        syncProgressApi({ xp, streak, hearts, gems: next, last_active_date: lastActiveDate || undefined });
        return next;
      });
      return true;
    }
    return false;
  };

  const buySuper = () => {
    setIsSuper(true);
    setHearts(5);
    try {
      localStorage.setItem("duo-hearts", "5");
    } catch {}
    syncProgressApi({ xp, streak, hearts: 5, gems, last_active_date: lastActiveDate || undefined });
  };

  const unlockNextUnit = (unitNumber: number) => {
    if (!unlockedUnits.includes(unitNumber)) {
      setUnlockedUnits((prev) => {
        const nextUnits = [...prev, unitNumber];
        try {
          localStorage.setItem("duo-unlocked-units", JSON.stringify(nextUnits));
        } catch {}
        return nextUnits;
      });
      setAchievements((achs) =>
        achs.map((a) =>
          a.id === "champion"
            ? { ...a, progress: 2, unlocked: true }
            : a
        )
      );
    }
  };

  const recordDailyActivity = (lessonId?: string | number, xpBonus: number = 20, gemsBonus: number = 10) => {
    const currentToday = getTodayDateString();
    let nextStreak = streak;

    // Check if streak needs incrementing or initializing
    if (lastActiveDate !== currentToday) {
      if (lastActiveDate && getDaysDifference(lastActiveDate, currentToday) === 1 && streak > 0) {
        // Continued from yesterday
        nextStreak = streak + 1;
      } else {
        // Starting fresh today (day 1)
        nextStreak = 1;
      }
      setStreak(nextStreak);
      setLastActiveDate(currentToday);
      try {
        localStorage.setItem("duo-streak", String(nextStreak));
        localStorage.setItem("duo-last-active-date", currentToday);
      } catch {}

      setStreakHistory((prev) => {
        const updated = prev.includes(currentToday) ? prev : [...prev, currentToday];
        try {
          localStorage.setItem("duo-streak-history", JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }

    const nextXp = xp + xpBonus;
    const nextGems = gems + gemsBonus;
    setXp(nextXp);
    setGems(nextGems);
    try {
      localStorage.setItem("duo-xp", String(nextXp));
      localStorage.setItem("duo-gems", String(nextGems));
    } catch {}

    let numId: number | undefined = undefined;
    let nextLessons = completedLessons;

    if (lessonId !== undefined) {
      const sId = String(lessonId);
      numId = parseInt(sId, 10);
      if (!completedLessons.includes(sId)) {
        nextLessons = [...completedLessons, sId];
        setCompletedLessons(nextLessons);
        try {
          localStorage.setItem("duo-completed-lessons", JSON.stringify(nextLessons));
        } catch {}
      }
    }

    setAchievements((achs) =>
      achs.map((a) => {
        if (a.id === "wildfire") {
          return {
            ...a,
            progress: Math.min(nextStreak, a.maxProgress),
            unlocked: nextStreak >= a.maxProgress,
          };
        }
        if (a.id === "sage") {
          return {
            ...a,
            progress: Math.min(nextXp, a.maxProgress),
            unlocked: nextXp >= a.maxProgress,
          };
        }
        if (a.id === "scholar") {
          return {
            ...a,
            progress: Math.min(nextLessons.length, a.maxProgress),
            unlocked: nextLessons.length >= a.maxProgress,
          };
        }
        return a;
      })
    );

    // Sync to backend SQLite database
    syncProgressApi({
      xp: nextXp,
      streak: nextStreak,
      hearts,
      gems: nextGems,
      completed_lesson_id: !isNaN(numId!) ? numId : undefined,
      last_active_date: currentToday,
    });

    return { nextStreak, nextXp, nextGems };
  };

  const completeLesson = (lessonId: string) => {
    recordDailyActivity(lessonId, 20, 10);
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
        lastActiveDate,
        streakHistory,
        practicedToday,
        unlockedUnits,
        completedLessons,
        achievements,
        loginUser,
        logoutUser,
        addXp,
        addGems,
        addStreak,
        recordDailyActivity,
        deductHeart,
        refillHearts,
        spendGems,
        buySuper,
        unlockNextUnit,
        completeLesson,
        resetGuestData,
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

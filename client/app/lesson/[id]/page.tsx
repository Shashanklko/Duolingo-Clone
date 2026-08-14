"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { X, Heart, CheckCircle2, XCircle, ThumbsUp, ThumbsDown, Flag, Flame } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { 
  playCorrectSound, 
  playWrongSound, 
  playClickSound, 
  playLessonCompleteSound 
} from "@/lib/sounds";
import { useUser } from "@/contexts/UserContext";
import { useCourseStore } from "@/lib/store";
import WordBankExercise from "@/components/exercises/WordBankExercise";
import { fetchLessonApi } from "@/lib/api";

const QUESTION_TRANSLATIONS: Record<string, Record<string, string>> = {
  hi: {
    "Translate this sentence": "इस वाक्य का अनुवाद करें",
    "Select the correct translation": "सही अनुवाद का चयन करें",
    "NEW WORD": "नया शब्द",
    "TRANSLATE THIS SENTENCE": "इस वाक्य का अनुवाद करें",
  },
  es: {
    "Translate this sentence": "Traduce esta oración",
    "Select the correct translation": "Selecciona la traducción correcta",
    "NEW WORD": "NUEVA PALABRA",
    "TRANSLATE THIS SENTENCE": "TRADUCE ESTA ORACIÓN",
  },
  fr: {
    "Translate this sentence": "Traduisez cette phrase",
    "Select the correct translation": "Sélectionnez la bonne traduction",
    "NEW WORD": "NOUVEAU MOT",
    "TRANSLATE THIS SENTENCE": "TRADUISEZ CETTE PHRASE",
  },
  de: {
    "Translate this sentence": "Übersetze diesen Satz",
    "Select the correct translation": "Wähle die richtige Übersetzung",
    "NEW WORD": "NEUES WORT",
    "TRANSLATE THIS SENTENCE": "ÜBERSETZE DIESEN SATZ",
  },
};

function formatQuestionForSpeaker(q: string, speakerLang: string): string {
  if (!speakerLang || speakerLang === "en") return q;
  
  if (QUESTION_TRANSLATIONS[speakerLang]?.[q]) {
    return QUESTION_TRANSLATIONS[speakerLang][q];
  }

  if (speakerLang === "hi") {
    if (q.startsWith('Which one of these is')) {
      const match = q.match(/Which one of these is "(.*?)"\?/);
      if (match) return `इनमें से "${match[1]}" कौन सा है?`;
      return "इनमें से सही विकल्प चुनें";
    }
    if (q.startsWith('How do you say')) {
      const match = q.match(/How do you say "(.*?)" in (.*?)\?/);
      if (match) return `${match[2]} में "${match[1]}" कैसे कहते हैं?`;
      return "सही अनुवाद बताएं";
    }
    if (q.startsWith('What does')) {
      const match = q.match(/What does "(.*?)" mean\?/);
      if (match) return `"${match[1]}" का क्या अर्थ है?`;
      return "इसका क्या अर्थ है?";
    }
  }

  if (speakerLang === "es") {
    if (q.startsWith('Which one of these is')) {
      const match = q.match(/Which one of these is "(.*?)"\?/);
      if (match) return `¿Cuál de estos es "${match[1]}"?`;
    }
    if (q.startsWith('How do you say')) {
      const match = q.match(/How do you say "(.*?)" in (.*?)\?/);
      if (match) return `¿Cómo se dice "${match[1]}" en ${match[2]}?`;
    }
  }

  return q;
}

const ENCOURAGEMENTS = [
  "Super impressive!", 
  "Amazing!", 
  "You're on fire!", 
  "Great job!", 
  "Excellent!", 
  "Awesome!"
];

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// ─── 5 Questions Per Level Dataset ──────────────────────────────
const LEVEL_EXERCISES: Record<string, Array<any>> = {
  // Level 1: Cafe & Food
  "1": [
    {
      type: "image_choice",
      badge: "NEW WORD",
      question: 'Which one of these is "tea"?',
      options: [
        { id: 1, label: "café", image: "☕", key: "1" },
        { id: 2, label: "té", image: "🍵", key: "2" },
        { id: 3, label: "taco", image: "🌮", key: "3" },
      ],
      correctId: 2,
    },
    {
      type: "image_choice",
      badge: "NEW WORD",
      question: 'Which one of these is "water"?',
      options: [
        { id: 1, label: "leche", image: "🥛", key: "1" },
        { id: 2, label: "jugo", image: "🧃", key: "2" },
        { id: 3, label: "agua", image: "💧", key: "3" },
      ],
      correctId: 3,
    },
    {
      type: "word_bank",
      badge: "TRANSLATE THIS SENTENCE",
      question: "Translate this sentence",
      promptText: "Un café, por favor",
      words: ["A", "coffee", "tea", "please", "with", "milk"],
      correctAnswer: ["A", "coffee", "please"],
    },
    {
      type: "multiple_choice",
      badge: "",
      question: 'How do you say "thank you" in Spanish?',
      options: [
        { id: 1, label: "Adiós", key: "1" },
        { id: 2, label: "Gracias", key: "2" },
        { id: 3, label: "Por favor", key: "3" },
        { id: 4, label: "Hola", key: "4" },
      ],
      correctId: 2,
    },
    {
      type: "multiple_choice",
      badge: "",
      question: 'What does "un té con leche" mean?',
      options: [
        { id: 1, label: "A coffee with sugar", key: "1" },
        { id: 2, label: "A tea with milk", key: "2" },
        { id: 3, label: "Water please", key: "3" },
        { id: 4, label: "Good morning", key: "4" },
      ],
      correctId: 2,
    },
  ],

  // Level 2: Greetings & Say Goodbye
  "2": [
    {
      type: "multiple_choice",
      badge: "NEW WORD",
      question: 'How do you say "hello" in Spanish?',
      options: [
        { id: 1, label: "Adiós", key: "1" },
        { id: 2, label: "¡Hola!", key: "2" },
        { id: 3, label: "Gracias", key: "3" },
        { id: 4, label: "Por favor", key: "4" },
      ],
      correctId: 2,
    },
    {
      type: "image_choice",
      badge: "NEW WORD",
      question: 'Which one of these is "apple"?',
      options: [
        { id: 1, label: "manzana", image: "🍎", key: "1" },
        { id: 2, label: "pan", image: "🍞", key: "2" },
        { id: 3, label: "queso", image: "🧀", key: "3" },
      ],
      correctId: 1,
    },
    {
      type: "word_bank",
      badge: "TRANSLATE THIS SENTENCE",
      question: "Translate this sentence",
      promptText: "Buenos días, mucho gusto",
      words: ["Good", "morning", "night", "nice", "to", "meet", "you"],
      correctAnswer: ["Good", "morning", "nice", "to", "meet", "you"],
    },
    {
      type: "multiple_choice",
      badge: "",
      question: 'How do you say "goodbye" in Spanish?',
      options: [
        { id: 1, label: "Hola", key: "1" },
        { id: 2, label: "Buenas noches", key: "2" },
        { id: 3, label: "Hasta luego", key: "3" },
        { id: 4, label: "De nada", key: "4" },
      ],
      correctId: 3,
    },
    {
      type: "multiple_choice",
      badge: "",
      question: 'What does "por favor" mean?',
      options: [
        { id: 1, label: "Thank you", key: "1" },
        { id: 2, label: "Please", key: "2" },
        { id: 3, label: "You're welcome", key: "3" },
        { id: 4, label: "See you later", key: "4" },
      ],
      correctId: 2,
    },
  ],

  // Level 3: Practice & Review
  "3": [
    {
      type: "image_choice",
      badge: "NEW WORD",
      question: 'Which one of these is "bread"?',
      options: [
        { id: 1, label: "pan", image: "🍞", key: "1" },
        { id: 2, label: "leche", image: "🥛", key: "2" },
        { id: 3, label: "arroz", image: "🍚", key: "3" },
      ],
      correctId: 1,
    },
    {
      type: "multiple_choice",
      badge: "",
      question: 'How do you say "you\'re welcome" in Spanish?',
      options: [
        { id: 1, label: "De nada", key: "1" },
        { id: 2, label: "Gracias", key: "2" },
        { id: 3, label: "Por favor", key: "3" },
        { id: 4, label: "Disculpe", key: "4" },
      ],
      correctId: 1,
    },
    {
      type: "word_bank",
      badge: "TRANSLATE THIS SENTENCE",
      question: "Translate this sentence",
      promptText: "Yo quiero un café",
      words: ["I", "want", "like", "a", "coffee", "tea"],
      correctAnswer: ["I", "want", "a", "coffee"],
    },
    {
      type: "image_choice",
      badge: "",
      question: 'Which one of these is "milk"?',
      options: [
        { id: 1, label: "jugo", image: "🧃", key: "1" },
        { id: 2, label: "leche", image: "🥛", key: "2" },
        { id: 3, label: "agua", image: "💧", key: "3" },
      ],
      correctId: 2,
    },
    {
      type: "multiple_choice",
      badge: "",
      question: 'What is "yes" in Spanish?',
      options: [
        { id: 1, label: "No", key: "1" },
        { id: 2, label: "Sí", key: "2" },
        { id: 3, label: "Tal vez", key: "3" },
        { id: 4, label: "Nunca", key: "4" },
      ],
      correctId: 2,
    },
  ],

  // Level 4: Travel & Directions
  "4": [
    {
      type: "multiple_choice",
      badge: "NEW PHRASE",
      question: 'How do you say "where is the bathroom?"',
      options: [
        { id: 1, label: "¿Dónde está el baño?", key: "1" },
        { id: 2, label: "¿Cómo estás?", key: "2" },
        { id: 3, label: "¿Cuánto cuesta?", key: "3" },
        { id: 4, label: "¿Qué tal?", key: "4" },
      ],
      correctId: 1,
    },
    {
      type: "image_choice",
      badge: "",
      question: 'Which one of these is "taxi"?',
      options: [
        { id: 1, label: "autobús", image: "🚌", key: "1" },
        { id: 2, label: "taxi", image: "🚕", key: "2" },
        { id: 3, label: "tren", image: "🚆", key: "3" },
      ],
      correctId: 2,
    },
    {
      type: "word_bank",
      badge: "TRANSLATE THIS SENTENCE",
      question: "Translate this sentence",
      promptText: "Un boleto a Madrid",
      words: ["A", "ticket", "bus", "to", "Madrid", "Barcelona"],
      correctAnswer: ["A", "ticket", "to", "Madrid"],
    },
    {
      type: "multiple_choice",
      badge: "",
      question: 'What does "el hotel" mean?',
      options: [
        { id: 1, label: "The airport", key: "1" },
        { id: 2, label: "The hotel", key: "2" },
        { id: 3, label: "The station", key: "3" },
        { id: 4, label: "The restaurant", key: "4" },
      ],
      correctId: 2,
    },
    {
      type: "multiple_choice",
      badge: "",
      question: 'How do you say "airport" in Spanish?',
      options: [
        { id: 1, label: "Aeropuerto", key: "1" },
        { id: 2, label: "Estación", key: "2" },
        { id: 3, label: "Calle", key: "3" },
        { id: 4, label: "Ciudad", key: "4" },
      ],
      correctId: 1,
    },
  ],

  // Level 5: Trophy Mastery
  "5": [
    {
      type: "word_bank",
      badge: "MASTER REVIEW",
      question: "Translate this sentence",
      promptText: "Buenas noches, gracias",
      words: ["Good", "night", "morning", "thank", "you", "please"],
      correctAnswer: ["Good", "night", "thank", "you"],
    },
    {
      type: "image_choice",
      badge: "",
      question: 'Which one of these is "sugar"?',
      options: [
        { id: 1, label: "azúcar", image: "🍬", key: "1" },
        { id: 2, label: "sal", image: "🧂", key: "2" },
        { id: 3, label: "pimienta", image: "🌶️", key: "3" },
      ],
      correctId: 1,
    },
    {
      type: "multiple_choice",
      badge: "",
      question: 'What is "excuse me" in Spanish?',
      options: [
        { id: 1, label: "Disculpe", key: "1" },
        { id: 2, label: "Gracias", key: "2" },
        { id: 3, label: "Hola", key: "3" },
        { id: 4, label: "Por favor", key: "4" },
      ],
      correctId: 1,
    },
    {
      type: "word_bank",
      badge: "TRANSLATE THIS SENTENCE",
      question: "Translate this sentence",
      promptText: "Una mesa para dos",
      words: ["A", "table", "chair", "for", "two", "three"],
      correctAnswer: ["A", "table", "for", "two"],
    },
    {
      type: "multiple_choice",
      badge: "",
      question: 'How do you say "see you tomorrow"?',
      options: [
        { id: 1, label: "Hasta luego", key: "1" },
        { id: 2, label: "Hasta mañana", key: "2" },
        { id: 3, label: "Buenas tardes", key: "3" },
        { id: 4, label: "Adiós", key: "4" },
      ],
      correctId: 2,
    },
  ],
};

type FeedbackState = "none" | "correct" | "wrong";

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const levelId = (params?.id as string) || "1";

  const { addXp, addGems, deductHeart, hearts: userHearts, unlockNextUnit, completeLesson, streak, recordDailyActivity } = useUser();
  const { speakerLanguage } = useCourseStore();

  const [exercises, setExercises] = useState<Array<any>>(() => {
    return LEVEL_EXERCISES[levelId] || LEVEL_EXERCISES["1"] || [];
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<FeedbackState>("none");
  const [hearts, setHearts] = useState(5);
  const [xpEarned, setXpEarned] = useState(0);
  const [lessonComplete, setLessonComplete] = useState(false);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [showHeartsModal, setShowHeartsModal] = useState(false);
  const [encouragement, setEncouragement] = useState("");
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [duoLottie, setDuoLottie] = useState(null);

  useEffect(() => {
    // If local exercises for levelId exist, set them immediately
    if (LEVEL_EXERCISES[levelId]) {
      setExercises(LEVEL_EXERCISES[levelId]);
    } else {
      setExercises(LEVEL_EXERCISES["1"] || []);
    }

    fetchLessonApi(levelId).then((apiLesson) => {
      if (apiLesson && apiLesson.exercises && apiLesson.exercises.length > 0) {
        const apiExercises = apiLesson.exercises.map((ex: any) => {
          if (ex.type === "word_bank") {
            const rawPrompt = ex.question.includes('"') 
              ? ex.question.split('"')[1] 
              : (ex.question.includes(":") ? ex.question.split(":")[1].trim() : ex.question);
            return {
              type: "word_bank",
              badge: "TRANSLATE THIS SENTENCE",
              question: ex.question,
              promptText: rawPrompt,
              words: Array.isArray(ex.options) ? ex.options : [],
              wordBank: Array.isArray(ex.options) ? ex.options : [],
              correctAnswer: ex.correct_answer ? ex.correct_answer.split(" ") : [],
            };
          } else if (ex.type === "select_translation") {
            const formattedOptions = Array.isArray(ex.options) ? ex.options.map((opt: any, oIdx: number) => ({
              id: oIdx + 1,
              label: typeof opt === "string" ? opt : opt.text || "Option",
              key: String(oIdx + 1),
            })) : [];
            const correctIndex = Array.isArray(ex.options) ? ex.options.findIndex((opt: any) => (typeof opt === "string" ? opt : opt.text) === ex.correct_answer) : -1;
            return {
              type: "multiple_choice",
              badge: "SELECT TRANSLATION",
              question: ex.question,
              options: formattedOptions,
              correctId: correctIndex !== -1 ? correctIndex + 1 : 1,
            };
          } else {
            const formattedOptions = Array.isArray(ex.options) ? ex.options.map((opt: any, oIdx: number) => ({
              id: oIdx + 1,
              label: typeof opt === "string" ? opt : opt.text || "Option",
              image: typeof opt === "object" && opt.image ? opt.image : "✨",
              key: String(oIdx + 1),
            })) : [];
            const correctIndex = Array.isArray(ex.options) ? ex.options.findIndex((opt: any) => (typeof opt === "string" ? opt : opt.text) === ex.correct_answer) : -1;
            return {
              type: "image_choice",
              badge: "PRACTICE",
              question: ex.question,
              options: formattedOptions,
              correctId: correctIndex !== -1 ? correctIndex + 1 : 1,
            };
          }
        });
        setExercises(apiExercises);
      }
    }).catch(() => {});
  }, [levelId]);

  useEffect(() => {
    fetch("/lottie/98fa4e2fa26d365936333da24aba7e36.json")
      .then((r) => r.json())
      .then(setDuoLottie)
      .catch(() => {});
  }, []);

  if (exercises.length === 0) {
    return (
      <div className="min-h-screen bg-[#131f24] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-[#58cc02] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-extrabold text-sm tracking-wider uppercase text-gray-400">Loading Lesson...</p>
      </div>
    );
  }

  const exercise = exercises[currentIndex];
  const progress = (currentIndex / exercises.length) * 100;

  const handleSelect = (id: number) => {
    if (feedback !== "none") return;
    playClickSound();
    setSelected(id);
  };

  const handleSelectWord = (word: string) => {
    if (feedback !== "none") return;
    playClickSound();
    setSelectedWords((prev) => [...prev, word]);
  };

  const handleRemoveWord = (word: string, index: number) => {
    if (feedback !== "none") return;
    playClickSound();
    setSelectedWords((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCheck = () => {
    let isCorrect = false;

    if (exercise.type === "word_bank") {
      if (selectedWords.length === 0) return;
      const userAns = selectedWords.join(" ");
      const targetAns = (exercise.correctAnswer as string[]).join(" ");
      isCorrect = userAns.toLowerCase() === targetAns.toLowerCase();
    } else {
      if (selected === null) return;
      isCorrect = selected === exercise.correctId;
    }

    if (isCorrect) {
      playCorrectSound();
      setFeedback("correct");
      setXpEarned((prev) => prev + 10);
      const msg = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
      setEncouragement(msg);
      setShowEncouragement(true);
      setTimeout(() => setShowEncouragement(false), 2500);
    } else {
      playWrongSound();
      setFeedback("wrong");
      deductHeart();
      const newHearts = Math.max(0, hearts - 1);
      setHearts(newHearts);
      if (newHearts === 0) {
        setTimeout(() => setShowHeartsModal(true), 600);
      }
    }
  };

  const handleContinue = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelected(null);
      setSelectedWords([]);
      setFeedback("none");
    } else {
      playLessonCompleteSound();
      const res = recordDailyActivity(levelId, 20, 25);
      unlockNextUnit(Number(levelId) + 1);
      setLessonComplete(true);
    }
  };

  // ─── Lesson Complete Screen ──────────────────────────────────
  if (lessonComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: "var(--bg-primary)" }}>
        <div className="flex flex-col items-center gap-y-6 text-center max-w-[420px]">
          {duoLottie && (
            <div className="w-[150px] h-[150px]">
              <Lottie animationData={duoLottie} loop={true} className="w-full h-full" />
            </div>
          )}
          <h1 className="text-4xl font-extrabold text-[#ffd900]">Lesson Complete!</h1>
          <p className="text-lg font-bold text-gray-400">You completed all 5 exercises!</p>
          <div className="flex items-center justify-center gap-x-6 sm:gap-x-8 mt-4">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-[#1cb0f6]">+20 XP</span>
              <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>XP Earned</span>
            </div>
            <div className="w-[2px] h-[40px]" style={{ backgroundColor: "var(--border-color)" }} />
            <div className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-[#ff9600] flex items-center gap-x-1">
                <Flame className="w-7 h-7 fill-[#ff9600]" />
                {streak > 0 ? streak : 1}
              </span>
              <span className="text-xs font-bold uppercase tracking-wide text-[#ff9600]">Day Streak</span>
            </div>
            <div className="w-[2px] h-[40px]" style={{ backgroundColor: "var(--border-color)" }} />
            <div className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-[#ff4b4b]">{hearts}</span>
              <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Hearts Left</span>
            </div>
          </div>
          <Link href="/learn" className="w-full mt-6">
            <button className="w-full py-4 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] text-white font-bold uppercase tracking-widest text-lg border-b-4 border-[#46a302] active:border-b-0 active:translate-y-[4px] transition-all cursor-pointer shadow-xl">
              Continue Learning
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const isCheckDisabled = exercise.type === "word_bank" ? selectedWords.length === 0 : selected === null;

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: "var(--bg-primary)" }}>

      {/* Quit Confirmation Modal */}
      {showQuitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div 
            className="w-full max-w-[400px] rounded-2xl p-8 flex flex-col items-center gap-y-5 mx-4 shadow-2xl animate-in zoom-in-95"
            style={{ backgroundColor: "var(--bg-secondary)", border: "2px solid var(--border-color)" }}
          >
            <div className="w-[100px] h-[100px] -mt-2">
              {duoLottie ? (
                <Lottie animationData={duoLottie} loop={true} className="w-full h-full" />
              ) : (
                <img src="https://d35aaqx5ub95lt.cloudfront.net/images/pathCharacters/dark/c4419cac8477c25a1761abbf438cf531.svg" alt="Duo" className="w-full h-full object-contain" />
              )}
            </div>
            <p className="text-center font-extrabold text-xl leading-tight" style={{ color: "var(--text-primary)" }}>
              Wait, don't go! You'll lose your progress if you quit now
            </p>
            <button
              onClick={() => setShowQuitModal(false)}
              className="w-full py-3.5 rounded-2xl bg-[#1cb0f6] hover:bg-[#1899d6] text-white font-bold uppercase tracking-widest transition-all border-b-4 border-[#1899d6] active:border-b-0 active:translate-y-[4px] cursor-pointer"
            >
              Keep Learning
            </button>
            <button
              onClick={() => router.push("/learn")}
              className="font-bold uppercase tracking-widest text-sm transition hover:opacity-70 cursor-pointer"
              style={{ color: "#ff4b4b" }}
            >
              End Session
            </button>
          </div>
        </div>
      )}

      {/* Out of Hearts Modal */}
      {showHeartsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div 
            className="w-full max-w-[400px] rounded-2xl p-8 flex flex-col items-center gap-y-5 mx-4 shadow-2xl"
            style={{ backgroundColor: "var(--bg-secondary)", border: "2px solid var(--border-color)" }}
          >
            <div className="w-[100px] h-[100px]">
              {duoLottie ? (
                <Lottie animationData={duoLottie} loop={true} className="w-full h-full" />
              ) : (
                <img src="https://d35aaqx5ub95lt.cloudfront.net/images/pathCharacters/dark/c4419cac8477c25a1761abbf438cf531.svg" alt="Duo" className="w-full h-full object-contain" />
              )}
            </div>
            <p className="text-center font-extrabold text-xl leading-tight" style={{ color: "var(--text-primary)" }}>
              You ran out of hearts. Have a free refill on us to keep going!
            </p>
            <button
              onClick={() => { setHearts(5); setShowHeartsModal(false); }}
              className="w-full py-3.5 rounded-2xl bg-[#1cb0f6] hover:bg-[#1899d6] text-white font-bold uppercase tracking-widest transition-all border-b-4 border-[#1899d6] active:border-b-0 active:translate-y-[4px] cursor-pointer"
            >
              Refill for Free
            </button>
          </div>
        </div>
      )}

      {/* Duo Encouragement Pop-up */}
      {showEncouragement && (
        <div className="fixed bottom-24 left-6 z-40 flex items-end gap-x-3 animate-in slide-in-from-left-10 duration-500">
          <div className="w-[80px] h-[80px]">
            {duoLottie ? (
              <Lottie animationData={duoLottie} loop={false} className="w-full h-full" />
            ) : (
              <img src="https://d35aaqx5ub95lt.cloudfront.net/images/pathCharacters/dark/c4419cac8477c25a1761abbf438cf531.svg" alt="Duo" className="w-full h-full object-contain" />
            )}
          </div>
          <div 
            className="px-4 py-2.5 rounded-2xl font-bold text-sm mb-4"
            style={{ backgroundColor: "var(--bg-secondary)", border: "2px solid var(--border-color)", color: "var(--text-primary)" }}
          >
            {encouragement}
          </div>
        </div>
      )}
      
      {/* Top Bar: X, Progress, Question Counter, Hearts */}
      <div className="flex items-center gap-x-4 px-6 py-4 max-w-[900px] mx-auto w-full">
        <button onClick={() => setShowQuitModal(true)} className="cursor-pointer">
          <X className="w-7 h-7 transition hover:opacity-70" style={{ color: "var(--text-muted)" }} />
        </button>
        
        {/* Progress Bar */}
        <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ backgroundColor: "var(--border-color)" }}>
          <div 
            className="h-full rounded-full bg-[#58cc02] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="font-extrabold text-sm" style={{ color: "var(--text-muted)" }}>
          {currentIndex + 1} / {exercises.length}
        </span>
        
        <div className="flex items-center gap-x-1">
          <Heart className="w-7 h-7 fill-[#ff4b4b] text-[#ff4b4b]" />
          <span className="font-extrabold text-[#ff4b4b] text-lg">{hearts}</span>
        </div>
      </div>

      {/* Exercise Content */}
      <div className="flex-1 flex flex-col items-center justify-start px-6 pt-8 max-w-[700px] mx-auto w-full pb-28">
        
        {/* Badge */}
        {exercise.badge && (
          <div className="self-start mb-3 flex items-center gap-x-2">
            <div className="w-6 h-6 rounded-full bg-[#1cb0f6] flex items-center justify-center">
              <span className="text-white text-xs font-bold">✦</span>
            </div>
            <span className="text-[#ce82ff] font-extrabold text-sm uppercase tracking-widest">
              {formatQuestionForSpeaker(exercise.badge, speakerLanguage)}
            </span>
          </div>
        )}
        
        {/* Render Exercise Type */}
        {exercise.type === "word_bank" ? (
          <WordBankExercise
            question={formatQuestionForSpeaker(exercise.question, speakerLanguage)}
            promptText={exercise.promptText}
            words={exercise.words}
            selectedWords={selectedWords}
            onSelectWord={handleSelectWord}
            onRemoveWord={handleRemoveWord}
            disabled={feedback !== "none"}
          />
        ) : (
          <>
            <h1 className="self-start text-2xl font-extrabold mb-8" style={{ color: "var(--text-primary)" }}>
              {formatQuestionForSpeaker(exercise.question, speakerLanguage)}
            </h1>

            {exercise.type === "image_choice" ? (
              <div className="grid grid-cols-3 gap-4 w-full">
                {exercise.options.map((opt: any) => {
                  const isSelected = selected === opt.id;
                  const isCorrect = feedback !== "none" && opt.id === exercise.correctId;
                  const isWrong = feedback === "wrong" && isSelected;
                  
                  let borderColor = "var(--border-color)";
                  let bgColor = "transparent";
                  if (isCorrect) { borderColor = "#58cc02"; bgColor = "rgba(88,204,2,0.1)"; }
                  else if (isWrong) { borderColor = "#ff4b4b"; bgColor = "rgba(255,75,75,0.1)"; }
                  else if (isSelected && feedback === "none") { borderColor = "#1cb0f6"; bgColor = "rgba(28,176,246,0.08)"; }

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelect(opt.id)}
                      className="relative h-[180px] rounded-2xl border-2 border-b-4 flex flex-col items-center justify-center p-4 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                      style={{ borderColor, backgroundColor: bgColor }}
                    >
                      {opt.image && (typeof opt.image === "string" && (opt.image.startsWith("http") || opt.image.startsWith("/"))) ? (
                        <img src={opt.image} alt={opt.label} className="w-[70px] h-[70px] object-contain mb-2" />
                      ) : (
                        <span className="text-6xl mb-4">{opt.image}</span>
                      )}
                      <div className="flex items-center justify-between w-full px-1">
                        <span className="font-bold text-[15px]" style={{ color: "var(--text-primary)" }}>{opt.label}</span>
                        <span 
                          className="text-xs font-bold w-6 h-6 rounded-lg flex items-center justify-center"
                          style={{ 
                            backgroundColor: isSelected ? "#1cb0f6" : "var(--bg-secondary)", 
                            color: isSelected ? "white" : "var(--text-muted)",
                            border: `2px solid ${isSelected ? "#1cb0f6" : "var(--border-color)"}`
                          }}
                        >
                          {opt.key}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-y-3 w-full">
                {exercise.options.map((opt: any) => {
                  const isSelected = selected === opt.id;
                  const isCorrect = feedback !== "none" && opt.id === exercise.correctId;
                  const isWrong = feedback === "wrong" && isSelected;
                  
                  let borderColor = "var(--border-color)";
                  let bgColor = "transparent";
                  if (isCorrect) { borderColor = "#58cc02"; bgColor = "rgba(88,204,2,0.1)"; }
                  else if (isWrong) { borderColor = "#ff4b4b"; bgColor = "rgba(255,75,75,0.1)"; }
                  else if (isSelected && feedback === "none") { borderColor = "#1cb0f6"; bgColor = "rgba(28,176,246,0.08)"; }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelect(opt.id)}
                      className="w-full flex items-center gap-x-4 px-6 py-4 rounded-2xl border-2 border-b-4 transition-all text-left cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                      style={{ borderColor, backgroundColor: bgColor }}
                    >
                      <span 
                        className="text-sm font-bold w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ 
                          backgroundColor: isSelected ? "#1cb0f6" : "var(--bg-secondary)", 
                          color: isSelected ? "white" : "var(--text-muted)",
                          border: `2px solid ${isSelected ? "#1cb0f6" : "var(--border-color)"}`
                        }}
                      >
                        {opt.key}
                      </span>
                      <span className="font-bold text-[15px]" style={{ color: "var(--text-primary)" }}>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Feedback Bar */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-30 w-full px-6 py-5 transition-colors duration-300"
        style={{ 
          borderTop: "2px solid var(--border-color)",
          backgroundColor: feedback === "correct" 
            ? "rgba(88,204,2,0.18)" 
            : feedback === "wrong" 
            ? "rgba(255,75,75,0.18)" 
            : "var(--bg-card)"
        }}
      >
        <div className="max-w-[700px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-x-4">
            {feedback === "correct" && (
              <>
                <CheckCircle2 className="w-12 h-12 text-[#58cc02] fill-[#58cc02] stroke-white" />
                <div className="flex flex-col">
                  <span className="font-extrabold text-[#58cc02] text-xl">Correct!</span>
                  <div className="flex items-center gap-x-4 mt-1">
                    <button className="flex items-center gap-x-1 text-[#58cc02] font-bold text-xs uppercase hover:opacity-70 transition cursor-pointer">
                      <ThumbsUp className="w-4 h-4" /> Like
                    </button>
                    <button className="flex items-center gap-x-1 text-[#58cc02] font-bold text-xs uppercase hover:opacity-70 transition cursor-pointer">
                      <ThumbsDown className="w-4 h-4" /> Dislike
                    </button>
                    <button className="flex items-center gap-x-1 text-[#58cc02] font-bold text-xs uppercase hover:opacity-70 transition cursor-pointer">
                      <Flag className="w-4 h-4" /> Report
                    </button>
                  </div>
                </div>
              </>
            )}
            {feedback === "wrong" && (
              <>
                <XCircle className="w-12 h-12 text-[#ff4b4b] fill-[#ff4b4b] stroke-white" />
                <div className="flex flex-col">
                  <span className="font-extrabold text-[#ff4b4b] text-xl">Incorrect</span>
                  <span className="text-[#ff4b4b] font-bold text-sm mt-1">
                    Correct answer: {exercise.type === "word_bank" ? (exercise.correctAnswer as string[]).join(" ") : exercise.options.find((o: any) => o.id === exercise.correctId)?.label}
                  </span>
                </div>
              </>
            )}
          </div>

          {feedback === "none" ? (
            <button
              onClick={handleCheck}
              disabled={isCheckDisabled}
              className={`px-8 py-3.5 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all cursor-pointer ${
                !isCheckDisabled
                  ? "bg-[#58cc02] hover:bg-[#46a302] text-white border-b-4 border-[#46a302] active:border-b-0 active:translate-y-[4px]"
                  : "cursor-not-allowed"
              }`}
              style={isCheckDisabled ? { backgroundColor: "var(--border-color)", color: "var(--text-muted)" } : {}}
            >
              Check
            </button>
          ) : (
            <button
              onClick={handleContinue}
              className={`px-8 py-3.5 rounded-2xl font-bold uppercase tracking-widest text-sm border-b-4 active:border-b-0 active:translate-y-[4px] transition-all cursor-pointer ${
                feedback === "correct"
                  ? "bg-[#58cc02] hover:bg-[#46a302] text-white border-[#46a302]"
                  : "bg-[#ff4b4b] hover:bg-[#ea2b2b] text-white border-[#ea2b2b]"
              }`}
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

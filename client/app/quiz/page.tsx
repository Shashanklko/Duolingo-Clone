"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { X, CheckCircle2, XCircle, BookOpen, Compass, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import WordBankExercise from "@/components/exercises/WordBankExercise";
import MatchPairsExercise from "@/components/exercises/MatchPairsExercise";
import { playClickSound, playCorrectSound, playWrongSound, playLessonCompleteSound } from "@/lib/sounds";
import { useUser } from "@/contexts/UserContext";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// ─── Step 1 Options ──────────────────────────────────────────────
const PROFICIENCY_LEVELS = [
  { level: 1, bars: 1, label: "I'm new to Spanish" },
  { level: 2, bars: 2, label: "I know some common words" },
  { level: 3, bars: 3, label: "I can have basic conversations" },
  { level: 4, bars: 4, label: "I can talk about various topics" },
  { level: 5, bars: 5, label: "I can discuss most topics in detail" },
];

function BarsIcon({ count, active }: { count: number; active: boolean }) {
  const totalBars = 4;
  return (
    <div className="flex items-end gap-x-[3px] h-[20px]">
      {Array.from({ length: totalBars }).map((_, i) => (
        <div
          key={i}
          className="w-[4px] rounded-sm transition-colors"
          style={{
            height: `${8 + i * 4}px`,
            backgroundColor: i < count ? "#1cb0f6" : "var(--border-color)",
          }}
        />
      ))}
    </div>
  );
}

// ─── Placement Questions ──────────────────────────────────────────
const PLACEMENT_QUESTIONS = [
  {
    type: "image_choice",
    question: 'Which one of these is "water"?',
    options: [
      { id: 1, label: "leche", image: "🥛" },
      { id: 2, label: "jugo", image: "🧃" },
      { id: 3, label: "agua", image: "💧" },
    ],
    correctId: 3,
  },
  {
    type: "word_bank",
    question: 'Write this in English',
    promptText: "Un café por favor",
    words: ["A", "coffee", "please", "tea", "water", "sugar", "and"],
    correctAnswer: ["A", "coffee", "please"],
  },
  {
    type: "match_pairs",
    question: "Tap the matching pairs",
    pairs: [
      { id: "es-1", text: "hola", matchId: "m-1" },
      { id: "en-1", text: "hello", matchId: "m-1" },
      { id: "es-2", text: "gracias", matchId: "m-2" },
      { id: "en-2", text: "thank you", matchId: "m-2" },
      { id: "es-3", text: "agua", matchId: "m-3" },
      { id: "en-3", text: "water", matchId: "m-3" },
      { id: "es-4", text: "pan", matchId: "m-4" },
      { id: "en-4", text: "bread", matchId: "m-4" },
    ],
  },
];

type Step = "proficiency" | "path_choice" | "placement_quiz" | "result";
type FeedbackState = "none" | "correct" | "wrong";

export default function QuizPage() {
  const router = useRouter();

  // Navigation / Progress State
  const [step, setStep] = useState<Step>("proficiency");
  const [selectedProficiency, setSelectedProficiency] = useState<number | null>(null);
  const [pathChoice, setPathChoice] = useState<"scratch" | "placement" | null>(null);

  // Placement Quiz State
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedImageChoice, setSelectedImageChoice] = useState<number | null>(null);
  const [wordBankSelected, setWordBankSelected] = useState<string[]>([]);
  const [matchPairsCompleted, setMatchPairsCompleted] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>("none");

  // Modal / Assets
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [animationData, setAnimationData] = useState<any>(null);
  const [placedUnit, setPlacedUnit] = useState<number>(1);

  useEffect(() => {
    fetch("/lottie/98fa4e2fa26d365936333da24aba7e36.json")
      .then((res) => res.json())
      .then(setAnimationData);
  }, []);

  // Calculate overall progress bar percentage
  let progressPercentage = 20; // Step 1
  if (step === "path_choice") progressPercentage = 40;
  if (step === "placement_quiz") {
    progressPercentage = 40 + ((questionIndex + 1) / PLACEMENT_QUESTIONS.length) * 45;
  }
  if (step === "result") progressPercentage = 100;

  // Handle Step 1 -> Step 2
  const handleProficiencySubmit = () => {
    playClickSound();
    setStep("path_choice");
  };

  const { recordDailyActivity } = useUser();

  // Handle Step 2 Choice
  const handlePathChoiceSubmit = () => {
    playClickSound();
    if (pathChoice === "scratch") {
      setPlacedUnit(1);
      playLessonCompleteSound();
      recordDailyActivity(1, 10, 10);
      setStep("result");
    } else {
      setStep("placement_quiz");
      setQuestionIndex(0);
    }
  };

  // Select Word Bank item
  const handleSelectWord = (word: string) => {
    if (feedback !== "none") return;
    playClickSound();
    setWordBankSelected([...wordBankSelected, word]);
  };

  // Remove Word Bank item
  const handleRemoveWord = (word: string, index: number) => {
    if (feedback !== "none") return;
    playClickSound();
    const next = [...wordBankSelected];
    next.splice(index, 1);
    setWordBankSelected(next);
  };

  // Check Placement Exercise Answer
  const currentQuestion = PLACEMENT_QUESTIONS[questionIndex];

  const handleCheckAnswer = () => {
    if (feedback !== "none") {
      // Advance to next question
      setFeedback("none");
      setSelectedImageChoice(null);
      setWordBankSelected([]);
      setMatchPairsCompleted(false);

      if (questionIndex + 1 < PLACEMENT_QUESTIONS.length) {
        setQuestionIndex(questionIndex + 1);
      } else {
        // Complete placement test! Determine placement level
        setPlacedUnit(selectedProficiency && selectedProficiency >= 3 ? 2 : 1);
        playLessonCompleteSound();
        recordDailyActivity(1, 20, 25);
        setStep("result");
      }
      return;
    }

    // Evaluate answer
    let isCorrect = false;

    if (currentQuestion.type === "image_choice") {
      isCorrect = selectedImageChoice === currentQuestion.correctId;
    } else if (currentQuestion.type === "word_bank") {
      isCorrect =
        wordBankSelected.join(" ") === (currentQuestion as any).correctAnswer?.join(" ");
    } else if (currentQuestion.type === "match_pairs") {
      isCorrect = matchPairsCompleted;
    }

    if (isCorrect) {
      playCorrectSound();
      setFeedback("correct");
    } else {
      playWrongSound();
      setFeedback("wrong");
    }
  };

  const isCheckDisabled = () => {
    if (feedback !== "none") return false;
    if (currentQuestion?.type === "image_choice") return selectedImageChoice === null;
    if (currentQuestion?.type === "word_bank") return wordBankSelected.length === 0;
    if (currentQuestion?.type === "match_pairs") return !matchPairsCompleted;
    return true;
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* ─── TOP BAR WITH PROGRESS BAR ────────────────────────────────────── */}
      <div className="flex items-center gap-x-4 px-6 py-4 max-w-[1000px] w-full mx-auto">
        <button
          onClick={() => setShowQuitModal(true)}
          className="p-1 rounded-lg transition hover:opacity-70"
          style={{ color: "var(--text-muted)" }}
        >
          <X className="w-7 h-7 stroke-[2.5]" />
        </button>

        {/* Dynamic Progress Bar */}
        <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-3.5 rounded-full overflow-hidden relative">
          <div
            className="bg-[#58cc02] h-full rounded-full transition-all duration-500 ease-out relative"
            style={{ width: `${progressPercentage}%` }}
          >
            {/* Glossy line effect */}
            <div className="absolute top-1 left-2 right-2 h-[3px] bg-white/30 rounded-full" />
          </div>
        </div>
      </div>

      {/* ─── MAIN STEP CONTENT ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        
        {/* STEP 1: PROFICIENCY SELECTION */}
        {step === "proficiency" && (
          <div className="w-full max-w-[550px] flex flex-col items-center animate-in fade-in duration-300">
            {/* Duo Character with Speech Bubble */}
            <div className="flex items-start gap-x-4 mb-8 w-full">
              <div className="w-[100px] h-[100px] flex-shrink-0">
                {animationData && (
                  <Lottie animationData={animationData} loop={true} className="w-full h-full" />
                )}
              </div>
              <div
                className="relative mt-4 px-5 py-3 rounded-2xl font-bold text-[16px] shadow-sm"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  border: "2px solid var(--border-color)",
                  color: "var(--text-primary)",
                }}
              >
                How much Spanish do you know?
                <div
                  className="absolute left-[-8px] top-4 w-4 h-4 rotate-45"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    borderLeft: "2px solid var(--border-color)",
                    borderBottom: "2px solid var(--border-color)",
                  }}
                />
              </div>
            </div>

            {/* Proficiency Options */}
            <div className="flex flex-col gap-y-3 w-full">
              {PROFICIENCY_LEVELS.map((item) => (
                <button
                  key={item.level}
                  onClick={() => {
                    playClickSound();
                    setSelectedProficiency(item.level);
                  }}
                  className="w-full flex items-center gap-x-5 px-6 py-4 rounded-2xl transition-all cursor-pointer text-left font-bold text-[15px]"
                  style={{
                    border:
                      selectedProficiency === item.level
                        ? "2px solid #1cb0f6"
                        : "2px solid var(--border-color)",
                    backgroundColor:
                      selectedProficiency === item.level
                        ? "rgba(28, 176, 246, 0.1)"
                        : "transparent",
                    color: "var(--text-primary)",
                  }}
                >
                  <BarsIcon count={item.bars} active={selectedProficiency === item.level} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: PATH CHOICE (Scratch vs Find level) */}
        {step === "path_choice" && (
          <div className="w-full max-w-[550px] flex flex-col items-center animate-in fade-in duration-300">
            {/* Duo Speech Bubble */}
            <div className="flex items-start gap-x-4 mb-8 w-full">
              <div className="w-[100px] h-[100px] flex-shrink-0">
                {animationData && (
                  <Lottie animationData={animationData} loop={true} className="w-full h-full" />
                )}
              </div>
              <div
                className="relative mt-4 px-5 py-3 rounded-2xl font-bold text-[16px] shadow-sm"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  border: "2px solid var(--border-color)",
                  color: "var(--text-primary)",
                }}
              >
                Now let’s find the best place to start!
                <div
                  className="absolute left-[-8px] top-4 w-4 h-4 rotate-45"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    borderLeft: "2px solid var(--border-color)",
                    borderBottom: "2px solid var(--border-color)",
                  }}
                />
              </div>
            </div>

            {/* Path Choice Cards */}
            <div className="flex flex-col gap-y-4 w-full">
              <button
                onClick={() => {
                  playClickSound();
                  setPathChoice("scratch");
                }}
                className="w-full flex items-center gap-x-5 p-6 rounded-2xl border-2 transition-all cursor-pointer text-left"
                style={{
                  border:
                    pathChoice === "scratch"
                      ? "2px solid #1cb0f6"
                      : "2px solid var(--border-color)",
                  backgroundColor:
                    pathChoice === "scratch" ? "rgba(28, 176, 246, 0.1)" : "transparent",
                }}
              >
                <div className="w-14 h-14 rounded-2xl bg-[#ffc800] flex items-center justify-center text-white flex-shrink-0 shadow-md">
                  <BookOpen className="w-8 h-8 stroke-[2.5]" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-extrabold text-[17px]" style={{ color: "var(--text-primary)" }}>
                    Start from scratch
                  </h3>
                  <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                    Take the easiest lesson of the Spanish course
                  </p>
                </div>
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  setPathChoice("placement");
                }}
                className="w-full flex items-center gap-x-5 p-6 rounded-2xl border-2 transition-all cursor-pointer text-left"
                style={{
                  border:
                    pathChoice === "placement"
                      ? "2px solid #1cb0f6"
                      : "2px solid var(--border-color)",
                  backgroundColor:
                    pathChoice === "placement" ? "rgba(28, 176, 246, 0.1)" : "transparent",
                }}
              >
                <div className="w-14 h-14 rounded-2xl bg-[#1cb0f6] flex items-center justify-center text-white flex-shrink-0 shadow-md">
                  <Compass className="w-8 h-8 stroke-[2.5]" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-extrabold text-[17px]" style={{ color: "var(--text-primary)" }}>
                    Find my level
                  </h3>
                  <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                    Let Duo recommend where you should start learning
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PLACEMENT QUIZ EXERCISES */}
        {step === "placement_quiz" && (
          <div className="w-full max-w-[600px] flex flex-col items-center animate-in fade-in duration-300">
            {currentQuestion.type === "image_choice" && (
              <div className="w-full flex flex-col gap-y-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold" style={{ color: "var(--text-primary)" }}>
                  {currentQuestion.question}
                </h2>
                <div className="grid grid-cols-3 gap-4 w-full mt-4">
                  {currentQuestion.options?.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        if (feedback !== "none") return;
                        playClickSound();
                        setSelectedImageChoice(option.id);
                      }}
                      className={`p-6 rounded-2xl border-2 border-b-4 flex flex-col items-center justify-center gap-y-4 transition-all cursor-pointer ${
                        selectedImageChoice === option.id
                          ? "border-[#1cb0f6] bg-[#1cb0f6]/10 text-[#1cb0f6]"
                          : "border-gray-200 dark:border-[#2f434c] bg-white dark:bg-[#131f24] hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-6xl">{option.image}</span>
                      <span className="font-extrabold text-lg" style={{ color: "var(--text-primary)" }}>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentQuestion.type === "word_bank" && (
              <WordBankExercise
                question={currentQuestion.question}
                promptText={currentQuestion.promptText}
                words={currentQuestion.words || []}
                selectedWords={wordBankSelected}
                onSelectWord={handleSelectWord}
                onRemoveWord={handleRemoveWord}
                disabled={feedback !== "none"}
              />
            )}

            {currentQuestion.type === "match_pairs" && (
              <MatchPairsExercise
                question={currentQuestion.question}
                pairs={currentQuestion.pairs || []}
                onComplete={() => setMatchPairsCompleted(true)}
                disabled={feedback !== "none"}
              />
            )}
          </div>
        )}

        {/* STEP 4: PLACEMENT RESULT SCREEN */}
        {step === "result" && (
          <div className="w-full max-w-[500px] flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
            <div className="w-[180px] h-[180px] mb-6">
              {animationData && (
                <Lottie animationData={animationData} loop={true} className="w-full h-full" />
              )}
            </div>

            <div className="flex items-center gap-x-2 text-[#ffc800] font-extrabold uppercase tracking-widest text-sm mb-2">
              <Sparkles className="w-5 h-5 fill-current" />
              Placement Complete!
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold mb-3" style={{ color: "var(--text-primary)" }}>
              {placedUnit === 2 ? "You unlocked Unit 2!" : "You're starting at Unit 1!"}
            </h1>

            <p className="text-base font-medium mb-8 max-w-[400px]" style={{ color: "var(--text-muted)" }}>
              {placedUnit === 2
                ? "Great job! Based on your test score, we've placed you directly into Unit 2 with a +50 XP bonus!"
                : "Perfect! We've prepared the foundational Spanish lessons to get you speaking fast."}
            </p>

            <div className="flex items-center gap-x-4 bg-yellow-500/10 border-2 border-[#ffc800] rounded-2xl px-6 py-4 mb-8">
              <span className="text-3xl">⚡</span>
              <div className="text-left">
                <div className="font-extrabold text-[#ffc800] text-lg">+50 XP EARNED</div>
                <div className="text-xs font-bold opacity-80" style={{ color: "var(--text-primary)" }}>
                  PLACEMENT ASSESSMENT BONUS
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── BOTTOM CONTROL BAR & FEEDBACK DRAWER ─────────────────────────── */}
      <div
        className={`w-full transition-all ${
          feedback === "correct"
            ? "bg-[#d7ffb8] dark:bg-[#1f3a1d] border-t-2 border-[#58cc02]"
            : feedback === "wrong"
            ? "bg-[#ffd8d8] dark:bg-[#3a1d1d] border-t-2 border-[#ff4b4b]"
            : "border-t-2 border-gray-200 dark:border-[#2f434c]"
        }`}
      >
        <div className="max-w-[1000px] mx-auto px-6 py-5 flex items-center justify-between">
          {/* Feedback message */}
          {feedback === "correct" && (
            <div className="flex items-center gap-x-4 text-[#58cc02] font-extrabold text-xl">
              <CheckCircle2 className="w-9 h-9 fill-current text-white dark:text-[#1f3a1d]" />
              <span>Great job!</span>
            </div>
          )}

          {feedback === "wrong" && (
            <div className="flex items-center gap-x-4 text-[#ff4b4b] font-extrabold text-lg">
              <XCircle className="w-9 h-9 fill-current text-white dark:text-[#3a1d1d]" />
              <div className="flex flex-col">
                <span>Correct solution:</span>
                <span className="font-bold text-base text-gray-800 dark:text-gray-200">
                  {currentQuestion?.type === "word_bank"
                    ? currentQuestion.correctAnswer?.join(" ")
                    : "agua"}
                </span>
              </div>
            </div>
          )}

          {feedback === "none" && <div />}

          {/* Action Button */}
          {step === "proficiency" && (
            <button
              disabled={selectedProficiency === null}
              onClick={handleProficiencySubmit}
              className={`px-8 py-3.5 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all cursor-pointer ${
                selectedProficiency !== null
                  ? "bg-[#58cc02] hover:bg-[#46a302] text-white border-b-4 border-[#46a302] active:border-b-0 active:translate-y-[4px]"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          )}

          {step === "path_choice" && (
            <button
              disabled={pathChoice === null}
              onClick={handlePathChoiceSubmit}
              className={`px-8 py-3.5 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all cursor-pointer ${
                pathChoice !== null
                  ? "bg-[#58cc02] hover:bg-[#46a302] text-white border-b-4 border-[#46a302] active:border-b-0 active:translate-y-[4px]"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          )}

          {step === "placement_quiz" && (
            <button
              disabled={isCheckDisabled()}
              onClick={handleCheckAnswer}
              className={`px-8 py-3.5 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all cursor-pointer ${
                feedback === "wrong"
                  ? "bg-[#ff4b4b] hover:bg-[#d93838] text-white border-b-4 border-[#d93838] active:border-b-0 active:translate-y-[4px]"
                  : feedback === "correct"
                  ? "bg-[#58cc02] hover:bg-[#46a302] text-white border-b-4 border-[#46a302] active:border-b-0 active:translate-y-[4px]"
                  : isCheckDisabled()
                  ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                  : "bg-[#58cc02] hover:bg-[#46a302] text-white border-b-4 border-[#46a302] active:border-b-0 active:translate-y-[4px]"
              }`}
            >
              {feedback !== "none" ? "Continue" : "Check"}
            </button>
          )}

          {step === "result" && (
            <button
              onClick={() => router.push("/learn")}
              className="px-8 py-3.5 rounded-2xl font-bold uppercase tracking-widest text-sm bg-[#58cc02] hover:bg-[#46a302] text-white border-b-4 border-[#46a302] active:border-b-0 active:translate-y-[4px] transition-all cursor-pointer flex items-center gap-x-2"
            >
              <span>Continue to Learn</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* ─── QUIT CONFIRMATION MODAL ────────────────────────────────────── */}
      {showQuitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-[400px] rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            <div className="w-[120px] h-[120px] mb-4">
              {animationData && (
                <Lottie animationData={animationData} loop={true} className="w-full h-full" />
              )}
            </div>

            <h2 className="text-2xl font-extrabold mb-2" style={{ color: "var(--text-primary)" }}>
              Wait, don’t go!
            </h2>
            <p className="text-sm font-medium mb-6" style={{ color: "var(--text-muted)" }}>
              You’ll lose your progress if you quit now
            </p>

            <div className="flex flex-col gap-y-3 w-full">
              <button
                onClick={() => setShowQuitModal(false)}
                className="w-full py-3.5 rounded-2xl font-extrabold uppercase tracking-widest text-white bg-[#1cb0f6] hover:bg-[#1899d6] border-b-4 border-[#1899d6] active:border-b-0 active:translate-y-[4px] transition cursor-pointer"
              >
                Keep Learning
              </button>
              <button
                onClick={() => router.push("/learn")}
                className="w-full py-3.5 rounded-2xl font-extrabold uppercase tracking-widest text-[#ff4b4b] hover:bg-red-500/10 transition cursor-pointer"
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

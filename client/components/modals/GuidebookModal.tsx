"use client";

import React from "react";
import { X, Volume2, BookOpen, Lightbulb } from "lucide-react";
import { speakText } from "@/lib/sounds";
import { useCourseStore } from "@/lib/store";

interface GuidebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  color?: string;
}

interface PhraseItem {
  target: string;
  english: string;
}

const GUIDEBOOK_DATA: Record<string, {
  unit1: PhraseItem[];
  unit2: PhraseItem[];
  grammarTipTitle: string;
  grammarTipText: string;
  grammarTipItems: string[];
}> = {
  hi: {
    unit1: [
      { target: "एक कॉफ़ी, कृपया", english: "A coffee, please" },
      { target: "दूध के साथ चाय", english: "A tea with milk" },
      { target: "धन्यवाद", english: "Thank you" },
      { target: "कृपया", english: "Please" },
      { target: "आपका स्वागत है", english: "You're welcome" },
    ],
    unit2: [
      { target: "नमस्ते! आप कैसे हैं?", english: "Hello! How are you?" },
      { target: "सुप्रभात", english: "Good morning" },
      { target: "शुभ रात्रि", english: "Good night" },
      { target: "आपसे मिलकर खुशी हुई", english: "Nice to meet you" },
      { target: "फिर मिलेंगे", english: "See you later" },
    ],
    grammarTipTitle: "हिंदी व्याकरण: लिंग और शब्द रूप",
    grammarTipText: "हिंदी में सभी संज्ञाएँ पुल्लिंग या स्त्रीलिंग होती हैं।",
    grammarTipItems: [
      "पुल्लिंग शब्दों के साथ 'एक' का प्रयोग (जैसे एक आदमी, एक सेब)",
      "स्त्रीलिंग शब्दों के साथ वाक्य की क्रिया बदलती है (जैसे वह पीती है)"
    ]
  },
  es: {
    unit1: [
      { target: "Un café, por favor", english: "A coffee, please" },
      { target: "Un té con leche", english: "A tea with milk" },
      { target: "Gracias", english: "Thank you" },
      { target: "Por favor", english: "Please" },
      { target: "De nada", english: "You're welcome" },
    ],
    unit2: [
      { target: "¡Hola! ¿Cómo estás?", english: "Hello! How are you?" },
      { target: "Buenos días", english: "Good morning" },
      { target: "Buenas noches", english: "Good night" },
      { target: "Mucho gusto", english: "Nice to meet you" },
      { target: "Hasta luego", english: "See you later" },
    ],
    grammarTipTitle: "Grammar Tip: Un vs Una",
    grammarTipText: "In Spanish, nouns are either masculine or feminine.",
    grammarTipItems: [
      "Use un for masculine words (e.g. un café, un té)",
      "Use una for feminine words (e.g. una leche, una manzana)"
    ]
  },
  fr: {
    unit1: [
      { target: "Un café, s'il vous plaît", english: "A coffee, please" },
      { target: "Un thé au lait", english: "A tea with milk" },
      { target: "Merci", english: "Thank you" },
      { target: "S'il vous plaît", english: "Please" },
      { target: "De rien", english: "You're welcome" },
    ],
    unit2: [
      { target: "Bonjour ! Comment allez-vous ?", english: "Hello! How are you?" },
      { target: "Bonjour", english: "Good morning" },
      { target: "Bonne nuit", english: "Good night" },
      { target: "Enchanté", english: "Nice to meet you" },
      { target: "À bientôt", english: "See you later" },
    ],
    grammarTipTitle: "Grammaire : Un vs Une",
    grammarTipText: "En français, les noms sont masculins ou féminins.",
    grammarTipItems: [
      "Utilisez un pour le masculin (ex. un café)",
      "Utilisez une pour le féminin (ex. une pomme)"
    ]
  },
  de: {
    unit1: [
      { target: "Einen Kaffee, bitte", english: "A coffee, please" },
      { target: "Tee mit Milch", english: "Tea with milk" },
      { target: "Danke", english: "Thank you" },
      { target: "Bitte", english: "Please" },
      { target: "Gern geschehen", english: "You're welcome" },
    ],
    unit2: [
      { target: "Hallo! Wie geht es dir?", english: "Hello! How are you?" },
      { target: "Guten Morgen", english: "Good morning" },
      { target: "Gute Nacht", english: "Good night" },
      { target: "Schön dich kennenzulernen", english: "Nice to meet you" },
      { target: "Bis später", english: "See you later" },
    ],
    grammarTipTitle: "Grammatik: Ein vs Eine",
    grammarTipText: "Im Deutschen gibt es männliche, weibliche und sächliche Nomen.",
    grammarTipItems: [
      "Verwende ein für männlich & sächlich (z.B. ein Kaffee, ein Haus)",
      "Verwende eine für weiblich (z.B. eine Milch, eine Frau)"
    ]
  },
  it: {
    unit1: [
      { target: "Un caffè, per favore", english: "A coffee, please" },
      { target: "Tè con latte", english: "Tea with milk" },
      { target: "Grazie", english: "Thank you" },
      { target: "Per favore", english: "Please" },
      { target: "Prego", english: "You're welcome" },
    ],
    unit2: [
      { target: "Ciao! Come stai?", english: "Hello! How are you?" },
      { target: "Buongiorno", english: "Good morning" },
      { target: "Buonanotte", english: "Good night" },
      { target: "Piacere di conoscerti", english: "Nice to meet you" },
      { target: "A dopo", english: "See you later" },
    ],
    grammarTipTitle: "Grammatica: Un vs Una",
    grammarTipText: "In italiano i nomi sono maschili o femminili.",
    grammarTipItems: [
      "Usa un per i nomi maschili (es. un caffè)",
      "Usa una per i nomi femminili (es. una mela)"
    ]
  },
  pt: {
    unit1: [
      { target: "Um café, por favor", english: "A coffee, please" },
      { target: "Chá com leite", english: "Tea with milk" },
      { target: "Obrigado", english: "Thank you" },
      { target: "Por favor", english: "Please" },
      { target: "De nada", english: "You're welcome" },
    ],
    unit2: [
      { target: "Olá! Como vai?", english: "Hello! How are you?" },
      { target: "Bom dia", english: "Good morning" },
      { target: "Boa noite", english: "Good night" },
      { target: "Prazer em conhecer", english: "Nice to meet you" },
      { target: "Até logo", english: "See you later" },
    ],
    grammarTipTitle: "Gramática: Um vs Uma",
    grammarTipText: "Em português os substantivos são masculinos ou femininos.",
    grammarTipItems: [
      "Use um para masculino (ex. um café)",
      "Use uma para feminino (ex. uma maçã)"
    ]
  },
  jp: {
    unit1: [
      { target: "コーヒーをお願いします", english: "A coffee, please" },
      { target: "ミルクティー", english: "Tea with milk" },
      { target: "ありがとう", english: "Thank you" },
      { target: "お願いします", english: "Please" },
      { target: "どういたしまして", english: "You're welcome" },
    ],
    unit2: [
      { target: "こんにちは！お元気ですか？", english: "Hello! How are you?" },
      { target: "おはようございます", english: "Good morning" },
      { target: "おやすみなさい", english: "Good night" },
      { target: "はじめまして", english: "Nice to meet you" },
      { target: "またね", english: "See you later" },
    ],
    grammarTipTitle: "文法: 「〜をください」と「です・ます」",
    grammarTipText: "日本語の注文と丁寧な表現の基本です。",
    grammarTipItems: [
      "「〜をお願いします」で丁寧に注文できます",
      "「です」は述語を丁寧に表します"
    ]
  },
  ar: {
    unit1: [
      { target: "قهوة من فضلك", english: "A coffee, please" },
      { target: "شاي بالحليب", english: "Tea with milk" },
      { target: "شكرا", english: "Thank you" },
      { target: "من فضلك", english: "Please" },
      { target: "عفوا", english: "You're welcome" },
    ],
    unit2: [
      { target: "مرحبا! كيف حالك؟", english: "Hello! How are you?" },
      { target: "صباح الخير", english: "Good morning" },
      { target: "تصبح على خير", english: "Good night" },
      { target: "تشرفنا", english: "Nice to meet you" },
      { target: "إلى اللقاء", english: "See you later" },
    ],
    grammarTipTitle: "قواعد اللغة: المذكر والمؤنث",
    grammarTipText: "في اللغة العربية الأسماء إما مذكر أو مؤنث.",
    grammarTipItems: [
      "استخدم التاء المربوطة عادةً للمؤنث",
      "تتغير الأفعال حسب الفاعل المذكر أو المؤنث"
    ]
  },
  ko: {
    unit1: [
      { target: "커피 한 잔 주세요", english: "A coffee, please" },
      { target: "밀크티", english: "Tea with milk" },
      { target: "감사합니다", english: "Thank you" },
      { target: "제발", english: "Please" },
      { target: "천만에요", english: "You're welcome" },
    ],
    unit2: [
      { target: "안녕하세요! 어떻게 지내세요?", english: "Hello! How are you?" },
      { target: "좋은 아침입니다", english: "Good morning" },
      { target: "잘 자요", english: "Good night" },
      { target: "반갑습니다", english: "Nice to meet you" },
      { target: "나중에 봐요", english: "See you later" },
    ],
    grammarTipTitle: "문법 팁: 존댓말 표현",
    grammarTipText: "한국어에서는 정중한 어미 표현이 중요합니다.",
    grammarTipItems: [
      "'~주세요'는 요청할 때 사용합니다",
      "'~입니다 / ~예요'는 정중한 서술어입니다"
    ]
  },
  ru: {
    unit1: [
      { target: "Кофе, пожалуйста", english: "A coffee, please" },
      { target: "Чай с молоком", english: "Tea with milk" },
      { target: "Спасибо", english: "Thank you" },
      { target: "Пожалуйста", english: "Please" },
      { target: "Не за что", english: "You're welcome" },
    ],
    unit2: [
      { target: "Привет! Как дела?", english: "Hello! How are you?" },
      { target: "Доброе утро", english: "Good morning" },
      { target: "Спокойной ночи", english: "Good night" },
      { target: "Приятно познакомиться", english: "Nice to meet you" },
      { target: "До скорого", english: "See you later" },
    ],
    grammarTipTitle: "Грамматика: Род существительных",
    grammarTipText: "В русском языке существительные бывают мужского, женского и среднего рода.",
    grammarTipItems: [
      "Мужской род обычно оканчивается на согласную (кофе)",
      "Женский род обычно оканчивается на -а / -я (вода, машина)"
    ]
  }
};

export default function GuidebookModal({
  isOpen,
  onClose,
  title,
  description,
  color = "#58cc02",
}: GuidebookModalProps) {
  const activeCourseId = useCourseStore((s) => s.activeCourseId);

  if (!isOpen) return null;

  // Fallback to Spanish if course data not found
  const courseGuide = GUIDEBOOK_DATA[activeCourseId] || GUIDEBOOK_DATA["es"];

  // Determine if unit 2/3/4 or unit 1
  const isLaterUnit = title.includes("2") || title.includes("3") || title.includes("4");
  const keyPhrases = isLaterUnit ? courseGuide.unit2 : courseGuide.unit1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-[550px] max-h-[85vh] rounded-3xl p-6 sm:p-8 flex flex-col gap-y-6 shadow-2xl overflow-y-auto"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "2px solid var(--border-color)",
        }}
      >
        {/* Header Bar */}
        <div
          className="w-full rounded-2xl p-5 text-white flex items-center justify-between shadow-md"
          style={{ backgroundColor: color }}
        >
          <div className="flex flex-col gap-y-1">
            <div className="flex items-center gap-x-2 text-xs sm:text-sm font-extrabold uppercase tracking-widest opacity-90">
              <BookOpen className="w-4 h-4 fill-current" />
              <span>{title} Guidebook</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold">{description}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-white/20 hover:bg-white/30 transition text-white cursor-pointer flex-shrink-0 ml-4"
          >
            <X className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Key Phrases Section */}
        <div className="flex flex-col gap-y-4">
          <h3 className="font-extrabold text-lg flex items-center gap-x-2" style={{ color: "var(--text-primary)" }}>
            <span>Key Phrases</span>
          </h3>

          <div className="flex flex-col gap-y-3">
            {keyPhrases.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border-2 border-gray-200 dark:border-[#2f434c] bg-white dark:bg-[#131f24] flex items-center justify-between transition hover:border-[#1cb0f6]"
              >
                <div className="flex flex-col gap-y-0.5">
                  <span className="font-extrabold text-base text-[#1cb0f6]">
                    {item.target}
                  </span>
                  <span className="font-bold text-sm text-gray-500">
                    {item.english}
                  </span>
                </div>

                <button
                  onClick={() => speakText(item.target, activeCourseId)}
                  className="w-10 h-10 rounded-xl bg-[#1cb0f6] text-white flex items-center justify-center border-b-4 border-[#1899d6] active:border-b-0 active:translate-y-[2px] transition cursor-pointer"
                  type="button"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Grammar Tip Section */}
        <div className="flex flex-col gap-y-3">
          <h3 className="font-extrabold text-lg flex items-center gap-x-2" style={{ color: "var(--text-primary)" }}>
            <Lightbulb className="w-5 h-5 text-yellow-400 fill-current" />
            <span>{courseGuide.grammarTipTitle}</span>
          </h3>

          <div className="p-5 rounded-2xl border-2 border-yellow-500/30 bg-yellow-500/10 flex flex-col gap-y-2">
            <p className="text-sm font-bold leading-relaxed" style={{ color: "var(--text-primary)" }}>
              {courseGuide.grammarTipText}
            </p>
            <ul className="text-xs font-semibold text-gray-400 space-y-1 list-disc list-inside">
              {courseGuide.grammarTipItems.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Got It Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl font-extrabold uppercase tracking-widest text-white bg-[#58cc02] hover:bg-[#46a302] border-b-4 border-[#46a302] active:border-b-0 active:translate-y-[4px] transition cursor-pointer mt-2"
        >
          Got It
        </button>
      </div>
    </div>
  );
}

// Sound utility using Web Audio API - no external files needed
export function playCorrectSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // First note (higher pitch, cheerful)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc1.frequency.setValueAtTime(783.99, ctx.currentTime + 0.1); // G5
    gain1.gain.setValueAtTime(0.3, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.3);

    // Second note (even higher, triumphant)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(987.77, ctx.currentTime + 0.12); // B5
    gain2.gain.setValueAtTime(0, ctx.currentTime);
    gain2.gain.setValueAtTime(0.3, ctx.currentTime + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.12);
    osc2.stop(ctx.currentTime + 0.4);
  } catch (e) {
    // Audio not available
  }
}

export function playWrongSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Low buzzer sound
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);

    // Second low note
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sawtooth";
    osc2.frequency.setValueAtTime(160, ctx.currentTime + 0.15);
    osc2.frequency.linearRampToValueAtTime(120, ctx.currentTime + 0.4);
    gain2.gain.setValueAtTime(0, ctx.currentTime);
    gain2.gain.setValueAtTime(0.12, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 0.45);
  } catch (e) {
    // Audio not available
  }
}

export function playClickSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    // Audio not available
  }
}

export function playLessonCompleteSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 0.4);
    });
  } catch (e) {
    // Audio not available
  }
}

// BCP-47 Language Tag Mapping
const BCP47_MAP: Record<string, string> = {
  hi: "hi-IN",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
  pt: "pt-BR",
  nl: "nl-NL",
  jp: "ja-JP",
  ar: "ar-SA",
  cs: "cs-CZ",
  cy: "cy-GB",
  da: "da-DK",
  el: "el-GR",
  he: "he-IL",
  hu: "hu-HU",
  id: "id-ID",
  ko: "ko-KR",
  la: "la",
  nb: "nb-NO",
  pl: "pl-PL",
  ru: "ru-RU",
  en: "en-US",
};

/**
 * Finds the highest quality native voice matching the requested language
 */
function getBestVoiceForLanguage(langCode: string): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;

  const bcp47 = BCP47_MAP[langCode.toLowerCase()] || langCode;
  const langPrefix = bcp47.split("-")[0].toLowerCase();
  const voices = window.speechSynthesis.getVoices();

  if (!voices || voices.length === 0) return null;

  // 1. Exact BCP-47 match with premium/natural voice (Google, Microsoft, Natural)
  const premiumExact = voices.find(
    (v) =>
      v.lang.replace("_", "-").toLowerCase() === bcp47.toLowerCase() &&
      (v.name.includes("Google") || v.name.includes("Microsoft") || v.name.includes("Natural"))
  );
  if (premiumExact) return premiumExact;

  // 2. Exact BCP-47 match
  const exactMatch = voices.find((v) => v.lang.replace("_", "-").toLowerCase() === bcp47.toLowerCase());
  if (exactMatch) return exactMatch;

  // 3. Language prefix match (e.g. "ar" or "hi" or "ja" or "es")
  const prefixMatch = voices.find(
    (v) => v.lang.toLowerCase().startsWith(langPrefix)
  );
  if (prefixMatch) return prefixMatch;

  return null;
}

export function speakText(text: string, langCode: string = "es") {
  if (typeof window === "undefined") return;

  const targetLang = BCP47_MAP[langCode.toLowerCase()] || langCode;
  const langPrefix = targetLang.split("-")[0].toLowerCase();

  // Stop any current Web Speech audio
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  // Check if browser has a native voice for this language
  const bestVoice = getBestVoiceForLanguage(langCode);

  if (bestVoice && "speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLang;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.voice = bestVoice;
    window.speechSynthesis.speak(utterance);
    return;
  }

  // Fallback to Google Translate TTS audio stream if browser lacks native voice (e.g. Arabic on Windows)
  try {
    const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      text
    )}&tl=${langPrefix}&client=tw-ob`;
    const audio = new Audio(googleTtsUrl);
    audio.play().catch(() => {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = targetLang;
        window.speechSynthesis.speak(utterance);
      }
    });
  } catch (e) {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = targetLang;
      window.speechSynthesis.speak(utterance);
    }
  }
}

export function speakTextWithHighlight(
  text: string,
  langCode: string = "en",
  onWordIndexChange?: (index: number) => void
) {
  if (typeof window === "undefined") return;

  const targetLang = BCP47_MAP[langCode.toLowerCase()] || langCode;
  const langPrefix = targetLang.split("-")[0].toLowerCase();

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  const bestVoice = getBestVoiceForLanguage(langCode);

  if (bestVoice && "speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLang;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.voice = bestVoice;

    const words = text.split(" ");
    let wordIdx = 0;
    const intervalTime = Math.max(280, Math.floor(4000 / words.length));
    let timer: any = null;

    utterance.onstart = () => {
      wordIdx = 0;
      if (onWordIndexChange) onWordIndexChange(0);
      timer = setInterval(() => {
        wordIdx++;
        if (wordIdx < words.length) {
          if (onWordIndexChange) onWordIndexChange(wordIdx);
        } else {
          clearInterval(timer);
        }
      }, intervalTime);
    };

    utterance.onend = () => {
      if (timer) clearInterval(timer);
      if (onWordIndexChange) {
        onWordIndexChange(-1);
      }
    };

    window.speechSynthesis.speak(utterance);
    return;
  }

  // Fallback to Google Translate TTS audio stream
  try {
    const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      text
    )}&tl=${langPrefix}&client=tw-ob`;
    const audio = new Audio(googleTtsUrl);

    const words = text.split(" ");
    let wordIdx = 0;
    const intervalTime = Math.max(280, Math.floor(4000 / words.length));
    let timer: any = null;

    audio.onplay = () => {
      wordIdx = 0;
      if (onWordIndexChange) onWordIndexChange(0);
      timer = setInterval(() => {
        wordIdx++;
        if (wordIdx < words.length) {
          if (onWordIndexChange) onWordIndexChange(wordIdx);
        } else {
          clearInterval(timer);
        }
      }, intervalTime);
    };

    audio.onended = () => {
      if (timer) clearInterval(timer);
      if (onWordIndexChange) onWordIndexChange(-1);
    };

    audio.play().catch(() => {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = targetLang;
        window.speechSynthesis.speak(utterance);
      }
    });
  } catch (e) {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = targetLang;
      window.speechSynthesis.speak(utterance);
    }
  }
}

import { useContext, useMemo, useState, useCallback, useEffect } from "react";
import { ALL_LOCALES, LANGUAGES_26, type LanguageMeta } from "@/locales";
import { useI18n } from "@/lib/i18n";
import type { Lang } from "@/lib/regions";
import { toast } from "sonner";
import {
  VOICE_GUIDE_PROMPTS,
  VOICE_WELCOME_PROMPTS,
  detectLanguageFromTranscript,
  findBestVoice,
} from "@/locales/voicePrompts";

export { detectLanguageFromTranscript };

// Web Speech API interface declarations
interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export function useTranslation() {
  const { lang, setLang, t: baseT } = useI18n();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Pre-load and cache browser voices when available
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const updateVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) {
        setAvailableVoices(v);
      }
    };

    updateVoices();
    window.speechSynthesis.addEventListener("voiceschanged", updateVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", updateVoices);
    };
  }, []);

  const currentMeta = useMemo<LanguageMeta>(() => {
    return (
      LANGUAGES_26.find((l) => l.code === lang) || {
        code: "en" as Lang,
        name: "English",
        nativeName: "English",
        dir: "ltr",
        speechLang: "en-IN",
        fontFamily: 'Inter, "Noto Sans", sans-serif',
      }
    );
  }, [lang]);

  // Enhanced translation function with parameter interpolation and fallback
  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const activeDict = ALL_LOCALES[lang] || {};
      const fallbackDict = ALL_LOCALES["en"] || {};

      let text = activeDict[key] ?? fallbackDict[key] ?? baseT(key) ?? key;

      if (params && typeof text === "string") {
        Object.entries(params).forEach(([paramKey, val]) => {
          text = text.replace(new RegExp(`\\{${paramKey}\\}`, "g"), String(val));
        });
      }

      return text;
    },
    [lang, baseT],
  );

  // Sync document attributes (lang, dir, font) when language changes
  useEffect(() => {
    if (typeof document !== "undefined") {
      const isRTL = currentMeta.dir === "rtl";
      document.documentElement.lang = currentMeta.code;
      document.documentElement.dir = isRTL ? "rtl" : "ltr";
      document.documentElement.setAttribute("data-lang", currentMeta.code);
      document.documentElement.style.setProperty(
        "--font-current-script",
        currentMeta.fontFamily || currentMeta.font || "",
      );
    }
  }, [currentMeta]);

  // Voice Output (Speech Synthesis) - speaks exclusively in the selected language
  const speak = useCallback(
    (textToSpeak?: string, targetLang?: Lang) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        toast.error(t("voiceUnsupported"));
        return;
      }

      window.speechSynthesis.cancel();

      const langToUse = targetLang || lang;
      const meta =
        LANGUAGES_26.find((l) => l.code === langToUse) || currentMeta;

      // Authentic localized text guaranteed for all 26 languages
      const text =
        textToSpeak ||
        VOICE_GUIDE_PROMPTS[langToUse] ||
        t("voiceGuidePrompt");

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = meta.speechLang;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      // Find matching voice from system/browser (Google, Microsoft, Apple, Android)
      const voices =
        availableVoices.length > 0
          ? availableVoices
          : window.speechSynthesis.getVoices();
      const matchingVoice = findBestVoice(voices, meta.code, meta.speechLang);
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        console.warn("SpeechSynthesis error:", e);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [availableVoices, currentMeta, lang, t],
  );

  // Short spoken greeting when a language is selected or auto-detected
  const speakWelcome = useCallback(
    (targetLang?: Lang) => {
      const langToUse = targetLang || lang;
      const welcomeText =
        VOICE_WELCOME_PROMPTS[langToUse] ||
        VOICE_GUIDE_PROMPTS[langToUse];
      speak(welcomeText, langToUse);
    },
    [lang, speak],
  );

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Voice Input (Speech Recognition with Auto Language Recognition)
  const listen = useCallback(
    (onResult?: (text: string) => void, onError?: (err: unknown) => void) => {
      if (typeof window === "undefined") return;

      const SpeechRecognitionClass =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognitionClass) {
        toast.error(t("voiceUnsupported"));
        return;
      }

      try {
        const recognition = new SpeechRecognitionClass();
        recognition.lang = currentMeta.speechLang;
        recognition.continuous = false;
        recognition.interimResults = false;

        setIsListening(true);
        toast.info(
          `🎤 ${t("voiceInputListening")} (${currentMeta.nativeName}) — Speak in any language to auto-detect`,
          { duration: 4000 },
        );

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0]?.[0]?.transcript;
          if (transcript) {
            // Intelligent Language Recognition: Detect language from speech
            const recognizedLang = detectLanguageFromTranscript(transcript);

            if (recognizedLang) {
              const matchedMeta = LANGUAGES_26.find((l) => l.code === recognizedLang);
              if (matchedMeta) {
                // Switch language immediately
                setLang(recognizedLang);
                toast.success(
                  `🎯 Language recognized: ${matchedMeta.nativeName} (${matchedMeta.name}) — Switched automatically!`,
                  { duration: 5000 },
                );
                // Voice assistant immediately speaks in the recognized language
                speakWelcome(recognizedLang);
              }
            }

            if (onResult) {
              onResult(transcript);
            }
            toast.success(`🗣️ "${transcript}"`);
          }
          setIsListening(false);
        };

        recognition.onerror = (event: Event) => {
          console.warn("Speech recognition error:", event);
          setIsListening(false);
          if (onError) onError(event);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch (err) {
        setIsListening(false);
        console.error("SpeechRecognition start error:", err);
        if (onError) onError(err);
      }
    },
    [currentMeta, setLang, speakWelcome, t],
  );

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  return {
    t,
    lang,
    setLang,
    languages: LANGUAGES_26,
    currentLanguage: currentMeta,
    dir: currentMeta.dir,
    isRTL: currentMeta.dir === "rtl",
    speechSupported:
      typeof window !== "undefined" &&
      ("speechSynthesis" in window ||
        "SpeechRecognition" in window ||
        "webkitSpeechRecognition" in window),
    speak,
    speakWelcome,
    stopSpeaking,
    isSpeaking,
    listen,
    stopListening,
    isListening,
  };
}

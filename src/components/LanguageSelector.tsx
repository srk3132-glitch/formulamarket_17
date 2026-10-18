import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { HorizontalLanguageSelector } from "@/components/common/HorizontalLanguageSelector";
import type { Lang } from "@/lib/regions";
import {
  Globe,
  Check,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Sparkles,
} from "lucide-react";

interface LanguageSelectorProps {
  onVoiceTranscript?: (transcript: string) => void;
  className?: string;
}

export function LanguageSelector({ onVoiceTranscript, className = "" }: LanguageSelectorProps) {
  const {
    lang,
    setLang,
    languages,
    currentLanguage,
    t,
    speak,
    stopSpeaking,
    isSpeaking,
    listen,
    stopListening,
    isListening,
    speechSupported,
  } = useTranslation();

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      listen((transcript) => {
        if (onVoiceTranscript) {
          onVoiceTranscript(transcript);
        }
      });
    }
  };

  const handleSpeakerClick = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const guidance = t("voiceGuidePrompt");
      speak(guidance);
    }
  };

  return (
    <section
      aria-label="Language selection"
      className={`mx-auto max-w-[1200px] w-full rounded-3xl border border-white/70 bg-white/60 p-4 sm:p-5 lg:p-6 shadow-[var(--shadow-glass-sm)] backdrop-blur-2xl transition-all ${className}`}
    >
      {/* Top Header Row with Title, Badge & Voice Tools */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-brand-deep/10">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-2xl bg-brand/10 text-brand shadow-inner shrink-0">
            <Globe className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base sm:text-lg font-bold text-brand-deep tracking-tight">
                {t("languageSelectorTitle")}
              </h2>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 hidden sm:inline-flex items-center gap-1">
                <Sparkles className="size-3" />
                26 Regional Scripts
              </span>
            </div>
            <p className="text-xs text-brand-deep/70">
              {t("selectLanguagePrompt")} · {currentLanguage.nativeName} ({currentLanguage.name})
            </p>
          </div>
        </div>

        {/* Voice Input & Output Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {speechSupported && (
            <>
              {/* Text-to-Speech Output Button */}
              <button
                type="button"
                onClick={handleSpeakerClick}
                title={isSpeaking ? "Stop Voice Assistant" : "Listen in " + currentLanguage.name}
                aria-label={isSpeaking ? "Stop Voice Assistant" : "Listen in " + currentLanguage.name}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all shadow-2xs ${
                  isSpeaking
                    ? "bg-amber-500 text-white animate-pulse"
                    : "border border-brand/25 bg-white/80 text-brand-deep hover:bg-white hover:text-brand"
                }`}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="size-3.5" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="size-3.5 text-brand" />
                    <span>{t("voiceOutput")}</span>
                  </>
                )}
              </button>

              {/* Speech-to-Text Input Button */}
              <button
                type="button"
                onClick={handleMicClick}
                title={isListening ? "Listening... click to stop" : "Speak using Web Speech API"}
                aria-label={isListening ? "Listening... click to stop" : "Speak using Web Speech API"}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all shadow-2xs ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse"
                    : "border border-brand/25 bg-white/80 text-brand-deep hover:bg-white hover:text-brand"
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="size-3.5" />
                    <span>Listening...</span>
                  </>
                ) : (
                  <>
                    <Mic className="size-3.5 text-brand" />
                    <span>{t("voiceInput")}</span>
                  </>
                )}
              </button>
            </>
          )}

          {/* Active Script Badge */}
          <span className="rounded-full bg-brand/10 border border-brand/20 px-2.5 py-1 text-[11px] font-bold text-brand-deep shrink-0">
            {currentLanguage.code.toUpperCase()}
          </span>
        </div>
      </div>

      {/* 26 LANGUAGES HORIZONTAL SLIDING SELECTOR (Horizontal only, no vertical bar) */}
      <div className="mt-3 block lg:hidden">
        <label className="block text-xs font-semibold text-brand-deep mb-2">
          {t("languageSelectorTitle")} ({languages.length} Languages)
        </label>
        <HorizontalLanguageSelector />
      </div>

      {/* DESKTOP 6 TO 7 COLUMN GRID (>= 1024px / laptop & desktop screens) */}
      <div className="mt-4 hidden lg:grid grid-cols-6 xl:grid-cols-7 gap-2">
        {languages.map((item) => {
          const isActive = lang === item.code;
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => setLang(item.code)}
              aria-pressed={isActive}
              title={`${item.nativeName} (${item.name})`}
              className={`group relative flex flex-col items-center justify-center rounded-2xl px-2.5 py-2.5 text-center transition-all duration-200 select-none min-h-[54px] ${
                isActive
                  ? "bg-brand text-white shadow-md shadow-brand/25 ring-2 ring-brand/40 font-bold scale-[1.02]"
                  : "border border-white/80 bg-white/70 text-brand-deep/90 hover:bg-white hover:border-brand/35 hover:shadow-2xs hover:scale-[1.01] active:scale-[0.99]"
              }`}
            >
              <div className="flex items-center gap-1">
                <span className="font-bold text-sm tracking-tight leading-tight">
                  {item.nativeName}
                </span>
                {isActive && <Check className="size-3 text-white shrink-0 animate-in zoom-in-50 duration-200" />}
              </div>
              <span
                className={`text-[11px] leading-tight mt-0.5 font-normal ${
                  isActive ? "text-white/85" : "text-brand-deep/55 group-hover:text-brand-deep/75"
                }`}
              >
                {item.name}
              </span>
              {item.dir === "rtl" && (
                <span
                  className={`absolute top-1 right-1.5 text-[8px] font-bold uppercase rounded px-1 ${
                    isActive ? "bg-white/20 text-white" : "bg-brand/10 text-brand"
                  }`}
                >
                  RTL
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

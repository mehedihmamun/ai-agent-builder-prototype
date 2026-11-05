import { useEffect, useRef, useState } from "react";

// The Web Speech API is not in TypeScript's DOM types yet.
interface Recognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}

const RecognitionCtor = (window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition })
  .SpeechRecognition ?? (window as unknown as { webkitSpeechRecognition?: new () => Recognition }).webkitSpeechRecognition;

/**
 * Speech to text with the browser's own recognition (Chrome, Edge, Safari).
 * `onText` gets the full text so far: what was already in the box plus what was said.
 */
export function useSpeechToText(onText: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const rec = useRef<Recognition | null>(null);

  useEffect(() => () => rec.current?.stop(), []);

  const start = (current: string) => {
    if (!RecognitionCtor) {
      setError("Voice input isn't supported in this browser. Try Chrome or Edge.");
      return;
    }
    setError(null);
    const r = new RecognitionCtor();
    r.continuous = true;
    r.interimResults = true;
    r.lang = "en-US";
    const base = current.trim() ? `${current.trimEnd()} ` : "";
    let finalText = "";

    r.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) finalText += res[0].transcript;
        else interim += res[0].transcript;
      }
      onText(base + finalText + interim);
    };
    r.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") setError("Microphone access is blocked. Allow it in the browser to use voice.");
      else if (e.error === "no-speech") setError("Didn't catch that. Try again.");
      else if (e.error !== "aborted") setError("Voice input stopped. Try again.");
    };
    r.onend = () => setListening(false);

    rec.current = r;
    r.start();
    setListening(true);
  };

  const stop = () => {
    rec.current?.stop();
    setListening(false);
  };

  return { listening, error, start, stop, toggle: (current: string) => (listening ? stop() : start(current)), clearError: () => setError(null) };
}

import React, { createContext, useContext, useState, useRef, useEffect } from "react";

export type MascotEmotion = "idle" | "happy" | "thinking" | "confused" | "talking" | "listening" | "sleep";

export interface MascotContextType {
  x: number;
  y: number;
  emotion: MascotEmotion;
  isTalking: boolean;
  isThinking: boolean;
  isListening: boolean;
  isPointing: boolean;
  targetPoint: { x: number; y: number } | null;
  speechText: string | null;
  speak: (text: string, duration?: number) => void;
  flyTo: (x: number, y: number) => void;
  setEmotion: (emotion: MascotEmotion) => void;
  setPointing: (isPointing: boolean, target?: { x: number; y: number } | null) => void;
  setThinking: (isThinking: boolean) => void;
  setListening: (isListening: boolean) => void;
  setTalking: (isTalking: boolean) => void;
  mascotRef: React.RefObject<HTMLDivElement | null>;
}

const MascotContext = createContext<MascotContextType | undefined>(undefined);

export const MascotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [x, setX] = useState(typeof window !== "undefined" ? window.innerWidth - 120 : 800);
  const [y, setY] = useState(typeof window !== "undefined" ? window.innerHeight - 150 : 600);
  const [emotion, setEmotion] = useState<MascotEmotion>("idle");
  const [isTalking, setTalking] = useState(false);
  const [isThinking, setThinking] = useState(false);
  const [isListening, setListening] = useState(false);
  const [isPointing, setPointingState] = useState(false);
  const [targetPoint, setTargetPoint] = useState<{ x: number; y: number } | null>(null);
  const [speechText, setSpeechText] = useState<string | null>(null);
  const mascotRef = useRef<HTMLDivElement | null>(null);
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const speak = (text: string, duration: number = 4000) => {
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
    }
    setSpeechText(text);
    setTalking(true);
    setEmotion("talking");

    speechTimeoutRef.current = setTimeout(() => {
      setSpeechText(null);
      setTalking(false);
      setEmotion("idle");
    }, duration);
  };

  const flyTo = (targetX: number, targetY: number) => {
    setX(targetX);
    setY(targetY);
  };

  const setPointing = (pointing: boolean, target: { x: number; y: number } | null = null) => {
    setPointingState(pointing);
    setTargetPoint(target);
  };

  useEffect(() => {
    return () => {
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
    };
  }, []);

  return (
    <MascotContext.Provider
      value={{
        x,
        y,
        emotion,
        isTalking,
        isThinking,
        isListening,
        isPointing,
        targetPoint,
        speechText,
        speak,
        flyTo,
        setEmotion,
        setPointing,
        setThinking,
        setListening,
        setTalking,
        mascotRef,
      }}
    >
      {children}
    </MascotContext.Provider>
  );
};

export const useMascot = () => {
  const context = useContext(MascotContext);
  if (!context) {
    throw new Error("useMascot must be used within a MascotProvider");
  }
  return context;
};

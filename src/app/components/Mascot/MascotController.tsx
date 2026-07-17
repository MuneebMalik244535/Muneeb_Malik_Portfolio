import React, { useEffect, useRef } from "react";
import { useMascot } from "./MascotContext";
import { useSectionDetection } from "../../hooks/useSectionDetection";

const SECTION_IDS = [
  "hero",
  "projects",
  "video-theater",
  "skills",
  "experience",
  "services",
  "tech",
  "testimonials",
  "contact",
];

export const MascotController: React.FC = () => {
  const { flyTo, speak, setEmotion, setPointing } = useMascot();
  const activeSection = useSectionDetection(SECTION_IDS);
  const lastSectionRef = useRef<string | null>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initial greeting on mount
  useEffect(() => {
    // Fly in after 1s delay
    const flyTimeout = setTimeout(() => {
      flyTo(window.innerWidth - 120, window.innerHeight / 2 - 50);
      
      // Speak greeting
      setTimeout(() => {
        setEmotion("happy");
        speak("Hi 👋 I'm Milo. Your AI Fashion Stylist!", 4000);
      }, 1000);
    }, 1000);

    return () => clearTimeout(flyTimeout);
  }, []);

  // Section awareness and positioning
  useEffect(() => {
    if (!activeSection || activeSection === lastSectionRef.current) return;
    lastSectionRef.current = activeSection;

    // Reset pointing state on section change
    setPointing(false);

    const w = window.innerWidth;
    const h = window.innerHeight;

    switch (activeSection) {
      case "hero":
        flyTo(w - 120, h * 0.25);
        speak("Looking for a developer? Let's explore my work! ✨", 4000);
        break;

      case "projects":
        flyTo(w - 120, h * 0.35);
        speak("Here are some of my top AI applications. 🚀", 4000);
        break;

      case "video-theater":
        flyTo(w - 130, h * 0.4);
        speak("Check out these live demonstration videos! 🎬", 4000);
        break;

      case "skills":
        flyTo(80, h * 0.3); // Fly to the left side to balance Orbit
        speak("Here is my specialized AI & web tech stack! 🛠️", 4500);
        break;

      case "experience":
        flyTo(w - 120, h * 0.35);
        speak("My professional timeline and experience. 💼", 4000);
        break;

      case "services":
        flyTo(80, h * 0.4);
        speak("These are the custom solutions I build for clients. 💡", 4000);
        break;

      case "tech":
        flyTo(w - 110, h * 0.3);
        setEmotion("happy");
        break;

      case "testimonials":
        flyTo(w - 120, h * 0.5);
        speak("Here's what clients say about my work! 💬", 4000);
        break;

      case "contact":
        flyTo(80, h * 0.45);
        speak("Let's build your next project. Drop a message! ✉️", 5000);
        break;

      default:
        break;
    }
  }, [activeSection]);

  // Random idle behaviors (10-20 seconds)
  useEffect(() => {
    const handleIdle = () => {
      const idles: Array<() => void> = [
        () => {
          setEmotion("happy");
          speak("Feeling creative today! 🎨", 2500);
        },
        () => {
          setEmotion("thinking");
          setTimeout(() => setEmotion("idle"), 2500);
        },
        () => {
          setEmotion("confused");
          setTimeout(() => setEmotion("idle"), 2000);
        },
        () => {
          // Point to navbar/home
          setPointing(true, { x: window.innerWidth - 100, y: 30 });
          setTimeout(() => setPointing(false), 3000);
        },
      ];

      const randomBehavior = idles[Math.floor(Math.random() * idles.length)];
      randomBehavior();

      resetIdleTimer();
    };

    const resetIdleTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      const nextDelay = Math.random() * 10000 + 12000; // 12-22 seconds
      idleTimerRef.current = setTimeout(handleIdle, nextDelay);
    };

    // Reset idle timer on user interactions
    window.addEventListener("scroll", resetIdleTimer, { passive: true });
    window.addEventListener("mousemove", resetIdleTimer, { passive: true });
    window.addEventListener("click", resetIdleTimer, { passive: true });

    resetIdleTimer();

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener("scroll", resetIdleTimer);
      window.removeEventListener("mousemove", resetIdleTimer);
      window.removeEventListener("click", resetIdleTimer);
    };
  }, []);

  // Handle Tab visibility state (Sleep when tab inactive)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setEmotion("sleep");
      } else {
        setEmotion("happy");
        speak("I'm awake! Ready to design? 🌟", 3000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return null; // Side effects only
};

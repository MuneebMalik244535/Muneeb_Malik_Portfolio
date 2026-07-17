import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useMascot } from "./MascotContext";

export const MascotSpeech: React.FC = () => {
  const { speechText } = useMascot();
  const [displayedText, setDisplayedText] = useState("");

  // Typewriter effect
  useEffect(() => {
    if (!speechText) {
      setDisplayedText("");
      return;
    }

    setDisplayedText("");
    let currentText = "";
    let index = 0;
    const interval = setInterval(() => {
      if (index < speechText.length) {
        currentText += speechText[index];
        setDisplayedText(currentText);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [speechText]);

  return (
    <AnimatePresence>
      {speechText && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="absolute z-50 pointer-events-none"
          style={{
            bottom: "105%",
            left: "50%",
            transform: "translateX(-50%)",
            minWidth: "160px",
            maxWidth: "240px",
          }}
        >
          <div className="relative px-4 py-3 rounded-2xl bg-slate-900/85 border border-white/10 text-white/90 text-sm shadow-xl backdrop-blur-md">
            {/* Triangular arrow */}
            <div
              className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-4 h-4 bg-slate-900/85 border-r border-b border-white/10 rotate-45"
              style={{ content: '""' }}
            />
            <p className="font-medium text-center leading-relaxed font-sans select-none">
              {displayedText}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

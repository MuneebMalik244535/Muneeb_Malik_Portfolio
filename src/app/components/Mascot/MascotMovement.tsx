import React, { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useMascot } from "./MascotContext";
import { Mascot } from "./Mascot";
import { MascotSpeech } from "./MascotSpeech";

export const MascotMovement: React.FC = () => {
  const { x, y, flyTo, setEmotion, emotion } = useMascot();
  const shouldReduceMotion = useReducedMotion();
  const [rotation, setRotation] = useState(0);
  const prevCoords = useRef({ x, y });

  // Rotate mascot slightly towards movement direction
  useEffect(() => {
    const dx = x - prevCoords.current.x;
    if (Math.abs(dx) > 5) {
      const targetRotation = dx > 0 ? 8 : -8;
      setRotation(targetRotation);

      // Return to upright after movement settles
      const timeout = setTimeout(() => setRotation(0), 600);
      return () => clearTimeout(timeout);
    }
    prevCoords.current = { x, y };
  }, [x, y]);

  const handleDragStart = () => {
    setEmotion("confused");
  };

  const handleDragEnd = (_event: any, info: any) => {
    setEmotion("happy");
    // Update context coordinates so section tracking doesn't override immediately
    flyTo(x + info.offset.x, y + info.offset.y);
    setTimeout(() => {
      setEmotion("idle");
    }, 1500);
  };

  return (
    <motion.div
      drag={!shouldReduceMotion}
      dragElastic={0.2}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{
        position: "fixed",
        zIndex: 100,
        left: 0,
        top: 0,
        pointerEvents: "none",
        width: "10px",
        height: "10px",
      }}
      animate={
        shouldReduceMotion
          ? { x, y, rotate: 0 }
          : {
              x,
              y,
              rotate: rotation,
            }
      }
      transition={{
        type: "spring",
        stiffness: 40,
        damping: 15,
        mass: 0.8,
      }}
      className="flex items-center justify-center"
    >
      <div className="relative pointer-events-auto">
        <MascotSpeech />
        <Mascot size={10} />
      </div>
    </motion.div>
  );
};

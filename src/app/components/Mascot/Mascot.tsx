import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { getMascotVariants, getMascotVariants as _ } from "./MascotAnimations";
import { useMascot } from "./MascotContext";
import { useCursorTracking } from "../../hooks/useCursorTracking";

// @ts-ignore
import mascotSvgText from "@/assets/mascot.svg?raw";

interface MascotProps {
  size?: number;
}

export const Mascot: React.FC<MascotProps> = ({ size = 90 }) => {
  const {
    emotion,
    isTalking,
    isThinking,
    isListening,
    isPointing,
    mascotRef,
  } = useMascot();

  const cursorInfo = useCursorTracking(mascotRef);
  const [blinkKey, setBlinkKey] = useState(0);

  // Trigger random eye blinks
  useEffect(() => {
    if (emotion === "sleep") return;

    const triggerBlink = () => {
      setBlinkKey((prev) => prev + 1);
      const nextDelay = Math.random() * 4000 + 2000; // 2-6s
      blinkTimeout = setTimeout(triggerBlink, nextDelay);
    };

    let blinkTimeout = setTimeout(triggerBlink, 3000);
    return () => clearTimeout(blinkTimeout);
  }, [emotion]);

  const variants = getMascotVariants(
    emotion,
    isTalking,
    isThinking,
    isListening,
    isPointing,
    cursorInfo.angleToMascot,
    cursorInfo.distanceToMascot
  );

  // Map getMascotVariants returns to animate properties
  // Since we are animating CSS variables on the container motion.div:
  const legsYVal = variants.legs.animate as any;
  const leftArmRot = variants.leftArm.animate as any;
  const rightArmRot = variants.rightArm.animate as any;
  const headRot = variants.head.animate as any;
  const headYVal = variants.head.animate as any;
  const bodyScaleYVal = variants.body.animate as any;
  const bodyScaleXVal = variants.body.animate as any;
  const leftEyeXVal = variants.leftEye.animate as any;
  const leftEyeYVal = variants.leftEye.animate as any;
  const leftEyeScaleYVal = variants.leftEye.animate as any;
  const rightEyeXVal = variants.rightEye.animate as any;
  const rightEyeYVal = variants.rightEye.animate as any;
  const rightEyeScaleYVal = variants.rightEye.animate as any;
  const mouthScaleYVal = variants.mouth.animate as any;
  const mouthScaleXVal = variants.mouth.animate as any;
  const mouthYVal = variants.mouth.animate as any;

  return (
    <div
      ref={mascotRef}
      className="mascot-svg-container relative flex items-center justify-center pointer-events-auto cursor-pointer"
      style={{ width: size, height: size }}
    >
      <style>{`
        .mascot-svg-container svg {
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .mascot-svg-container #legs {
          transform: translateY(var(--legs-y, 0px)) !important;
          transform-origin: 50% 73% !important;
        }
        .mascot-svg-container #left_arm {
          transform: rotate(var(--left-arm-rotate, 0deg)) translateY(var(--left-arm-y, 0px)) !important;
          transform-origin: 34% 53% !important;
        }
        .mascot-svg-container #right_arm {
          transform: rotate(var(--right-arm-rotate, 0deg)) translateY(var(--right-arm-y, 0px)) !important;
          transform-origin: 66% 53% !important;
        }
        .mascot-svg-container #head {
          transform: rotate(var(--head-rotate, 0deg)) translateY(var(--head-y, 0px)) !important;
          transform-origin: 50% 32% !important;
        }
        .mascot-svg-container #body {
          transform: scaleY(var(--body-scale-y, 1)) scaleX(var(--body-scale-x, 1)) !important;
          transform-origin: 50% 54% !important;
        }
        .mascot-svg-container #left_eye {
          transform: translate(var(--left-eye-x, 0px), var(--left-eye-y, 0px)) scaleY(var(--left-eye-scale-y, 1)) !important;
          transform-origin: 41% 32% !important;
        }
        .mascot-svg-container #right_eye {
          transform: translate(var(--right-eye-x, 0px), var(--right-eye-y, 0px)) scaleY(var(--right-eye-scale-y, 1)) !important;
          transform-origin: 60% 32% !important;
        }
        .mascot-svg-container #mouth {
          transform: scaleY(var(--mouth-scale-y, 1)) scaleX(var(--mouth-scale-x, 1)) translateY(var(--mouth-y, 0px)) !important;
          transform-origin: 50% 38% !important;
        }
      `}</style>

      {/* Floating container animations */}
      <motion.div
        className="w-full h-full"
        animate={variants.container.animate as any}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <motion.div
          className="w-full h-full"
          animate={{
            // Legs
            "--legs-y": legsYVal?.y ? legsYVal.y.map((v: number) => `${v}px`) : "0px",
            
            // Arms
            "--left-arm-rotate": leftArmRot?.rotate ? leftArmRot.rotate.map((v: number) => `${v}deg`) : `${leftArmRot?.rotate || 0}deg`,
            "--left-arm-y": leftArmRot?.y ? leftArmRot.y.map((v: number) => `${v}px`) : "0px",
            "--right-arm-rotate": rightArmRot?.rotate ? rightArmRot.rotate.map((v: number) => `${v}deg`) : `${rightArmRot?.rotate || 0}deg`,
            "--right-arm-y": rightArmRot?.y ? rightArmRot.y.map((v: number) => `${v}px`) : "0px",
            
            // Head
            "--head-rotate": `${headRot?.rotate || 0}deg`,
            "--head-y": headYVal?.y ? headYVal.y.map((v: number) => `${v}px`) : "0px",
            
            // Body
            "--body-scale-y": bodyScaleYVal?.scaleY ? bodyScaleYVal.scaleY : 1,
            "--body-scale-x": bodyScaleXVal?.scaleX ? bodyScaleXVal.scaleX : 1,
            
            // Eyes (with blinking & look position tracking)
            "--left-eye-x": `${leftEyeXVal?.x ?? 0}px`,
            "--left-eye-y": `${leftEyeYVal?.y ?? 0}px`,
            "--left-eye-scale-y": emotion === "sleep" ? 0.1 : [1, 1, 0, 1, 1],
            
            "--right-eye-x": `${rightEyeXVal?.x ?? 0}px`,
            "--right-eye-y": `${rightEyeYVal?.y ?? 0}px`,
            "--right-eye-scale-y": emotion === "sleep" ? 0.1 : [1, 1, 0, 1, 1],
            
            // Mouth
            "--mouth-scale-y": mouthScaleYVal?.scaleY ?? 1,
            "--mouth-scale-x": mouthScaleXVal?.scaleX ?? 1,
            "--mouth-y": `${mouthYVal?.y ?? 0}px`,
          } as any}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 12,
            // Custom blink transition to be rapid
            "--left-eye-scale-y": {
              duration: 0.18,
              repeat: Infinity,
              repeatDelay: Math.random() * 3 + 2,
            },
            "--right-eye-scale-y": {
              duration: 0.18,
              repeat: Infinity,
              repeatDelay: Math.random() * 3 + 2,
            },
          }}
          key={blinkKey} // Reset animation key periodically to randomize blinking intervals
          dangerouslySetInnerHTML={{ __html: mascotSvgText }}
        />
      </motion.div>
    </div>
  );
};

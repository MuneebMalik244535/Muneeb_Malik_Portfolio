import { Variants } from "motion/react";

export const getMascotVariants = (
  emotion: string,
  isTalking: boolean,
  isThinking: boolean,
  isListening: boolean,
  isPointing: boolean,
  lookAngle: number,
  lookDistance: number
): {
  container: Variants;
  head: Variants;
  leftEye: Variants;
  rightEye: Variants;
  mouth: Variants;
  leftArm: Variants;
  rightArm: Variants;
  legs: Variants;
  body: Variants;
} => {
  // Translate look angle into eyeball offsets
  // If cursor is close, eyeballs track cursor slightly
  const maxEyeOffset = 15;
  const isClose = lookDistance < 300;
  const eyeX = isClose ? Math.cos((lookAngle * Math.PI) / 180) * maxEyeOffset : 0;
  const eyeY = isClose ? Math.sin((lookAngle * Math.PI) / 180) * maxEyeOffset : 0;

  return {
    container: {
      animate: {
        y: emotion === "sleep" ? [0, 4, 0] : [0, -8, 0],
        transition: {
          y: {
            duration: emotion === "sleep" ? 4 : 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        },
      },
    },
    body: {
      animate: {
        scaleY: emotion === "sleep" ? [1, 0.97, 1] : [1, 1.03, 1],
        scaleX: emotion === "sleep" ? [1, 1.01, 1] : [1, 0.99, 1],
        transition: {
          duration: emotion === "sleep" ? 4 : 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    },
    head: {
      animate: {
        rotate: isThinking ? -10 : emotion === "confused" ? 8 : 0,
        y: emotion === "sleep" ? [0, 1.5, 0] : [0, -2, 0],
        x: 0,
        transition: {
          rotate: { type: "spring", stiffness: 100, damping: 10 },
          y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
        },
      },
    },
    leftEye: {
      animate: {
        x: isThinking ? 0 : emotion === "sleep" ? 0 : eyeX,
        y: isThinking ? -8 : emotion === "sleep" ? 0 : eyeY,
        scaleY: emotion === "sleep" ? 0.1 : [1, 1, 0.1, 1, 1], // Random blinks handled by keyframes
        transition: {
          x: { type: "spring", stiffness: 150, damping: 15 },
          y: { type: "spring", stiffness: 150, damping: 15 },
          scaleY: {
            duration: 4,
            repeat: Infinity,
            repeatDelay: Math.random() * 3 + 2,
            ease: "easeInOut",
          },
        },
      },
    },
    rightEye: {
      animate: {
        x: isThinking ? 0 : emotion === "sleep" ? 0 : eyeX,
        y: isThinking ? -8 : emotion === "sleep" ? 0 : eyeY,
        scaleY: emotion === "sleep" ? 0.1 : [1, 1, 0.1, 1, 1],
        transition: {
          x: { type: "spring", stiffness: 150, damping: 15 },
          y: { type: "spring", stiffness: 150, damping: 15 },
          scaleY: {
            duration: 4,
            repeat: Infinity,
            repeatDelay: Math.random() * 3 + 2,
            ease: "easeInOut",
          },
        },
      },
    },
    mouth: {
      animate: {
        scaleY: isTalking ? [0.8, 1.4, 0.6, 1.2, 0.8] : emotion === "happy" ? 1.3 : emotion === "sleep" ? 0.2 : 1,
        scaleX: emotion === "happy" ? 1.2 : emotion === "confused" ? 0.8 : 1,
        y: emotion === "sleep" ? 2 : 0,
        transition: {
          scaleY: isTalking
            ? { duration: 0.5, repeat: Infinity, ease: "linear" }
            : { type: "spring", stiffness: 100, damping: 10 },
        },
      },
    },
    leftArm: {
      animate: {
        rotate: emotion === "happy" ? -30 : isListening ? -15 : 0,
        y: [0, -1, 0],
        transition: {
          rotate: { type: "spring", stiffness: 100, damping: 12 },
          y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
        },
      },
    },
    rightArm: {
      animate: {
        rotate: isPointing ? -70 : emotion === "happy" ? 30 : 0,
        y: [0, -1, 0],
        transition: {
          rotate: { type: "spring", stiffness: 100, damping: 12 },
          y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
        },
      },
    },
    legs: {
      animate: {
        y: [0, 3, 0],
        transition: {
          y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
        },
      },
    },
  };
};

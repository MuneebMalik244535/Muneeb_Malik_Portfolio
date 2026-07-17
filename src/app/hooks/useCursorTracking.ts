import { useState, useEffect, useRef } from "react";

export interface CursorInfo {
  x: number;
  y: number;
  distanceToMascot: number;
  angleToMascot: number; // in degrees
}

export const useCursorTracking = (
  mascotRef: React.RefObject<HTMLDivElement | null>
): CursorInfo => {
  const [cursorInfo, setCursorInfo] = useState<CursorInfo>({
    x: 0,
    y: 0,
    distanceToMascot: Infinity,
    angleToMascot: 0,
  });

  const activeRef = useRef(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let frameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (!activeRef.current) return;

      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        if (mascotRef.current) {
          const rect = mascotRef.current.getBoundingClientRect();
          const mascotCenterX = rect.left + rect.width / 2;
          const mascotCenterY = rect.top + rect.height / 2;

          const dx = mouseX - mascotCenterX;
          const dy = mouseY - mascotCenterY;

          const distance = Math.sqrt(dx * dx + dy * dy);
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

          setCursorInfo({
            x: mouseX,
            y: mouseY,
            distanceToMascot: distance,
            angleToMascot: angle,
          });
        } else {
          setCursorInfo((prev) => ({
            ...prev,
            x: mouseX,
            y: mouseY,
          }));
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, [mascotRef]);

  return cursorInfo;
};

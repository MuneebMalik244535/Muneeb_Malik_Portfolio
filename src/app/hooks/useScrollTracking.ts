import { useState, useEffect, useRef } from "react";

export interface ScrollInfo {
  scrollY: number;
  scrollDirection: "up" | "down" | null;
  scrollVelocity: number;
}

export const useScrollTracking = (): ScrollInfo => {
  const [scrollInfo, setScrollInfo] = useState<ScrollInfo>({
    scrollY: 0,
    scrollDirection: null,
    scrollVelocity: 0,
  });

  const lastScrollY = useRef(0);
  const lastTimestamp = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    lastScrollY.current = window.scrollY;
    lastTimestamp.current = performance.now();

    let frameId: number;

    const handleScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const currentTimestamp = performance.now();

        const diffY = currentScrollY - lastScrollY.current;
        const diffTime = currentTimestamp - lastTimestamp.current;

        const direction = diffY > 0 ? "down" : diffY < 0 ? "up" : null;
        const velocity = diffTime > 0 ? Math.abs(diffY) / diffTime : 0;

        setScrollInfo({
          scrollY: currentScrollY,
          scrollDirection: direction || scrollInfo.scrollDirection,
          scrollVelocity: velocity,
        });

        lastScrollY.current = currentScrollY;
        lastTimestamp.current = currentTimestamp;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(frameId);
    };
  }, [scrollInfo.scrollDirection]);

  return scrollInfo;
};

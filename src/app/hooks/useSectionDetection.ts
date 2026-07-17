import { useState, useEffect } from "react";

export const useSectionDetection = (sectionIds: string[]): string | null => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || sectionIds.length === 0) return;

    const observerOptions = {
      root: null, // viewport
      rootMargin: "-20% 0px -40% 0px", // adjust margins so focus is on center-ish area
      threshold: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
    };

    const sectionVisibilities: Record<string, number> = {};

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        sectionVisibilities[entry.target.id] = entry.intersectionRatio;
      });

      // Find the section with the highest intersection ratio
      let maxRatio = 0;
      let maxSectionId: string | null = null;

      Object.entries(sectionVisibilities).forEach(([id, ratio]) => {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          maxSectionId = id;
        }
      });

      if (maxSectionId && maxRatio > 0.05) {
        setActiveSection(maxSectionId);
      }
    };

    const observer = new IntersectionObserver(callback, observerOptions);

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionIds]);

  return activeSection;
};

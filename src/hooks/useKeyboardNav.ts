import { useEffect, useCallback } from "react";

const sections = [
  { id: "hero", key: "1" },
  { id: "features", key: "2" },
  { id: "network", key: "3" },
  { id: "testimonials", key: "4" },
  { id: "timeline", key: "5" },
  { id: "stats", key: "6" },
  { id: "cta", key: "7" },
];

export const useKeyboardNav = () => {
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const scrollToNextSection = useCallback(() => {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    
    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top > 100) {
          element.scrollIntoView({ behavior: "smooth" });
          return;
        }
      }
    }
  }, []);

  const scrollToPrevSection = useCallback(() => {
    const scrollY = window.scrollY;
    
    for (let i = sections.length - 1; i >= 0; i--) {
      const element = document.getElementById(sections[i].id);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top < -100) {
          element.scrollIntoView({ behavior: "smooth" });
          return;
        }
      }
    }
    
    // Scroll to top if at first section
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Number keys for section navigation
      const section = sections.find((s) => s.key === e.key);
      if (section) {
        e.preventDefault();
        scrollToSection(section.id);
        return;
      }

      switch (e.key) {
        case "ArrowDown":
        case "j":
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            scrollToNextSection();
          }
          break;
        case "ArrowUp":
        case "k":
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            scrollToPrevSection();
          }
          break;
        case "Home":
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          break;
        case "End":
          e.preventDefault();
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scrollToSection, scrollToNextSection, scrollToPrevSection]);

  return { scrollToSection, sections };
};

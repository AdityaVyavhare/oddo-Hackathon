import { useEffect, useRef, useState } from "react";

/**
 * Custom hook for Intersection Observer API
 * Triggers animations when elements come into viewport
 *
 * @param {Object} options - Intersection Observer options
 * @param {number} options.threshold - Percentage of element visibility (0-1)
 * @param {string} options.rootMargin - Margin around root
 * @param {boolean} options.triggerOnce - Whether to trigger only once
 * @returns {Object} - { ref, isVisible }
 */
export const useIntersectionObserver = (options = {}) => {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;

  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          // Unobserve if triggerOnce is true
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
};

export default useIntersectionObserver;

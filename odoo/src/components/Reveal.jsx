import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

/**
 * Reveal component with Intersection Observer
 * Wraps children and reveals them with animation when scrolled into view
 *
 * @param {Object} props
 * @param {ReactNode} props.children - Content to reveal
 * @param {string} props.animation - Animation type: 'up', 'down', 'left', 'right', 'scale', 'fade'
 * @param {number} props.delay - Animation delay in seconds
 * @param {number} props.threshold - Visibility threshold (0-1)
 * @param {string} props.className - Additional CSS classes
 */
const Reveal = ({
  children,
  animation = "up",
  delay = 0,
  threshold = 0.1,
  className = "",
}) => {
  const { ref, isVisible } = useIntersectionObserver({
    threshold,
    triggerOnce: true,
  });

  const animationClass =
    {
      up: "revealUp",
      down: "revealDown",
      left: "revealLeft",
      right: "revealRight",
      scale: "revealScale",
      fade: "revealFade",
    }[animation] || "revealUp";

  const delayClass =
    delay > 0 ? `revealDelay${Math.min(Math.ceil(delay * 10), 6)}` : "";

  return (
    <div
      ref={ref}
      className={`${animationClass} ${delayClass} ${
        isVisible ? "visible" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Reveal;

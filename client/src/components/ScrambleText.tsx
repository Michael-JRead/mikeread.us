import { useEffect, useState, useRef } from "react";

interface ScrambleTextProps {
  children: string;
  className?: string;
  trigger?: "hover" | "mount" | "always";
  speed?: number;
  characterSet?: string;
  onAnimationComplete?: () => void;
}

/**
 * ScrambleText Component
 * 
 * Creates an algorithm-style text scrambling animation effect.
 * Characters randomly change before settling on the final text.
 * 
 * Design Philosophy: Cybersecurity-themed with tech aesthetic
 * - Uses alphanumeric + tech symbols for authentic hacker feel
 * - Smooth animation that feels purposeful, not chaotic
 * - Optimized for performance with proper cleanup
 */
export default function ScrambleText({
  children,
  className = "",
  trigger = "mount",
  speed = 0.03,
  characterSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*!",
  onAnimationComplete,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(children);
  const [isScrambling, setIsScrambling] = useState(trigger === "mount" || trigger === "always");
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Get random character from character set
  const getRandomChar = () => {
    return characterSet[Math.floor(Math.random() * characterSet.length)];
  };

  // Clear all timeouts
  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutsRef.current = [];
  };

  // Scramble animation logic
  useEffect(() => {
    if (!isScrambling) {
      setDisplayText(children);
      return;
    }

    clearAllTimeouts();
    const textArray = children.split("");
    const scrambleDuration = speed * 1000; // Convert to milliseconds

    // Animate each character with staggered timing
    textArray.forEach((char, index) => {
      if (char === " ") return; // Skip spaces

      // Scramble phase: randomly change character multiple times
      const scrambleCount = 8 + Math.floor(Math.random() * 4);
      const scrambleInterval = scrambleDuration / scrambleCount;

      for (let i = 0; i < scrambleCount; i++) {
        const timeout = setTimeout(() => {
          setDisplayText((prev) => {
            const arr = prev.split("");
            arr[index] = getRandomChar();
            return arr.join("");
          });
        }, index * scrambleDuration + i * scrambleInterval);

        timeoutsRef.current.push(timeout);
      }

      // Reveal phase: show final character
      const revealTimeout = setTimeout(() => {
        setDisplayText((prev) => {
          const arr = prev.split("");
          arr[index] = char;
          return arr.join("");
        });
      }, index * scrambleDuration + scrambleDuration);

      timeoutsRef.current.push(revealTimeout);
    });

    // Cleanup and call completion callback
    const finalTimeout = setTimeout(() => {
      if (onAnimationComplete) {
        onAnimationComplete();
      }
      if (trigger !== "always") {
        setIsScrambling(false);
      }
    }, textArray.length * scrambleDuration + scrambleDuration + 200);

    timeoutsRef.current.push(finalTimeout);

    return () => {
      clearAllTimeouts();
    };
  }, [isScrambling, children, speed, characterSet, trigger, onAnimationComplete]);

  // Handle trigger modes
  const handleHover = () => {
    if (trigger === "hover" && !isScrambling) {
      setIsScrambling(true);
    }
  };

  const handleHoverEnd = () => {
    if (trigger === "hover") {
      setIsScrambling(false);
    }
  };

  return (
    <span
      className={className}
      onMouseEnter={handleHover}
      onMouseLeave={handleHoverEnd}
      style={{
        display: "inline-block",
        fontFamily: "inherit",
        fontWeight: "inherit",
        fontSize: "inherit",
        lineHeight: "inherit",
        letterSpacing: "inherit",
      }}
    >
      {displayText}
    </span>
  );
}

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
 * ScrambleText Component - Cyclic Animation
 * 
 * Creates an algorithm-style text scrambling animation with cyclic behavior:
 * - 1.5 seconds: Active character scrambling
 * - 5 seconds: Hold steady (display final text)
 * - Repeat infinitely
 * 
 * Design Philosophy: Cybersecurity threat defender aesthetic
 * - Conveys active monitoring and continuous threat detection
 * - Character set includes tech symbols for authenticity
 * - Smooth animation that feels purposeful and professional
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
  const cycleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get random character from character set
  const getRandomChar = () => {
    return characterSet[Math.floor(Math.random() * characterSet.length)];
  };

  // Clear all timeouts
  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutsRef.current = [];
  };

  // Clear cycle interval
  const clearCycleInterval = () => {
    if (cycleIntervalRef.current) {
      clearInterval(cycleIntervalRef.current);
      cycleIntervalRef.current = null;
    }
  };

  // Perform a single scramble animation
  const performScrambleAnimation = () => {
    clearAllTimeouts();
    const textArray = children.split("");
    const scrambleDuration = 1500; // 1.5 seconds for scrambling phase
    const scrambleCount = 8 + Math.floor(Math.random() * 4);
    const scrambleInterval = scrambleDuration / scrambleCount;

    // Animate each character with staggered timing
    textArray.forEach((char, index) => {
      if (char === " ") return; // Skip spaces

      // Scramble phase: randomly change character multiple times
      for (let i = 0; i < scrambleCount; i++) {
        const timeout = setTimeout(() => {
          setDisplayText((prev) => {
            const arr = prev.split("");
            arr[index] = getRandomChar();
            return arr.join("");
          });
        }, index * 50 + i * scrambleInterval);

        timeoutsRef.current.push(timeout);
      }

      // Reveal phase: show final character
      const revealTimeout = setTimeout(() => {
        setDisplayText((prev) => {
          const arr = prev.split("");
          arr[index] = char;
          return arr.join("");
        });
      }, index * 50 + scrambleDuration);

      timeoutsRef.current.push(revealTimeout);
    });
  };

  // Setup cyclic animation
  useEffect(() => {
    if (trigger === "always" || (trigger === "mount" && isScrambling)) {
      // Perform initial scramble
      performScrambleAnimation();

      // Setup cycle: 1.5s scramble + 5s hold = 6.5s total cycle
      cycleIntervalRef.current = setInterval(() => {
        performScrambleAnimation();
      }, 6500); // 1.5s scramble + 5s hold

      return () => {
        clearAllTimeouts();
        clearCycleInterval();
      };
    }
  }, [trigger, isScrambling, children, characterSet]);

  // Handle trigger modes for hover
  const handleHover = () => {
    if (trigger === "hover" && !isScrambling) {
      setIsScrambling(true);
      performScrambleAnimation();

      // Start cycle for hover trigger
      cycleIntervalRef.current = setInterval(() => {
        performScrambleAnimation();
      }, 6500);
    }
  };

  const handleHoverEnd = () => {
    if (trigger === "hover") {
      setIsScrambling(false);
      setDisplayText(children);
      clearAllTimeouts();
      clearCycleInterval();
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

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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
 * - Performs well with Framer Motion's motion values
 */
export default function ScrambleText({
  children,
  className = "",
  trigger = "mount",
  speed = 0.05,
  characterSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*",
  onAnimationComplete,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(children);
  const [isScrambling, setIsScrambling] = useState(trigger === "always");

  // Get random character from character set
  const getRandomChar = () => {
    return characterSet[Math.floor(Math.random() * characterSet.length)];
  };

  // Scramble animation logic
  useEffect(() => {
    if (!isScrambling) {
      setDisplayText(children);
      return;
    }

    let animationFrames: NodeJS.Timeout[] = [];
    const textArray = children.split("");

    // Animate each character with staggered timing
    textArray.forEach((char, index) => {
      if (char === " ") return; // Skip spaces

      // Scramble phase: randomly change character
      const scrambleCount = Math.floor(8 + Math.random() * 4);
      for (let i = 0; i < scrambleCount; i++) {
        const timeout = setTimeout(() => {
          setDisplayText((prev) => {
            const arr = prev.split("");
            arr[index] = getRandomChar();
            return arr.join("");
          });
        }, (index * speed * 1000) / 2 + (i * speed * 1000) / scrambleCount);

        animationFrames.push(timeout);
      }

      // Reveal phase: show final character
      const revealTimeout = setTimeout(() => {
        setDisplayText((prev) => {
          const arr = prev.split("");
          arr[index] = char;
          return arr.join("");
        });
      }, (index * speed * 1000) / 2 + (scrambleCount * speed * 1000) / scrambleCount);

      animationFrames.push(revealTimeout);
    });

    // Cleanup and call completion callback
    const finalTimeout = setTimeout(() => {
      if (onAnimationComplete) {
        onAnimationComplete();
      }
      if (trigger !== "always") {
        setIsScrambling(false);
      }
    }, children.length * speed * 1000 + 500);

    animationFrames.push(finalTimeout);

    return () => {
      animationFrames.forEach((timeout) => clearTimeout(timeout));
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
    <motion.span
      className={className}
      onMouseEnter={handleHover}
      onMouseLeave={handleHoverEnd}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {displayText}
    </motion.span>
  );
}

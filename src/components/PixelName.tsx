import { motion } from "motion/react";

type PixelNameProps = {
  text: string;
};

export const PixelName = ({ text }: PixelNameProps) => {
  return (
    <motion.h1
      aria-label={text}
      data-text={text}
      className="pixel-name max-w-4xl font-pixel text-5xl font-semibold leading-[0.98] text-orange-50 sm:text-7xl sm:leading-[0.92] lg:text-8xl"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: 0.12,
            staggerChildren: 0.035,
          },
        },
      }}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          className="pixel-letter"
          aria-hidden="true"
          variants={{
            hidden: {
              y: 18,
              opacity: 0,
              filter: "blur(4px)",
            },
            visible: {
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              transition: {
                duration: 0.28,
                ease: "easeOut",
              },
            },
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.h1>
  );
};

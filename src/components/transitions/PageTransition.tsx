import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  variant?: "fade" | "slide" | "scale" | "morph" | "liquid";
}

const variants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, x: 100, filter: "blur(10px)" },
    animate: { opacity: 1, x: 0, filter: "blur(0px)" },
    exit: { opacity: 0, x: -100, filter: "blur(10px)" },
  },
  scale: {
    initial: { opacity: 0, scale: 0.9, filter: "blur(20px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 1.1, filter: "blur(20px)" },
  },
  morph: {
    initial: { 
      opacity: 0, 
      scale: 0.95,
      borderRadius: "50%",
      clipPath: "circle(0% at 50% 50%)"
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      borderRadius: "0%",
      clipPath: "circle(150% at 50% 50%)"
    },
    exit: { 
      opacity: 0, 
      scale: 1.05,
      borderRadius: "50%",
      clipPath: "circle(0% at 50% 50%)"
    },
  },
  liquid: {
    initial: { 
      opacity: 0, 
      y: 50,
      rotateX: 15,
      transformPerspective: 1200,
    },
    animate: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transformPerspective: 1200,
    },
    exit: { 
      opacity: 0, 
      y: -50,
      rotateX: -15,
      transformPerspective: 1200,
    },
  },
};

const transition = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1],
};

export function PageTransition({ children, variant = "liquid" }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants[variant]}
      transition={transition}
      className="w-full min-h-screen"
    >
      {children}
    </motion.div>
  );
}

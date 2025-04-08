"use client";

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1] 
    }
  },
  hover: {
    scale: 1.02,
    boxShadow: "0 10px 30px rgba(59, 66, 86, 0.07)",
    transition: { duration: 0.3 }
  }
};

export const imageVariants = {
  hover: { 
    scale: 1.05, 
    transition: { duration: 0.5 } 
  }
};

export const buttonVariants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { type: "spring", stiffness: 400, damping: 10 }
  },
  tap: { scale: 0.95 }
}; 
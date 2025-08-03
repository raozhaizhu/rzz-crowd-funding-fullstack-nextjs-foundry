"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

const SpringMotion = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.2,
        duration: 0.8,
        // ease: "easeIn",
        type: "spring",
        stiffness: 100,
        damping: 10,
        mass: 0.5,
      }}
    >
      {children}
    </motion.div>
  );
};
export default SpringMotion;

"use client";
import { motion } from "framer-motion";

const SpringMotionText = ({ text }: { text: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.25,
        duration: 11,
        // ease: "easeIn",
        type: "spring",
        stiffness: 100,
        damping: 10,
        mass: 0.5,
      }}
      className='pointer-events-none whitespace-pre-wrap flex justify-center items-center min-h-[calc(100vh-400px)]'
    >
      <p
        className='text-2xl md:text-4xl lg:text-8xl font-semibold p-4
      bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-transparent dark:from-white dark:to-slate-900/10 
      '
      >
        {text}
      </p>
    </motion.div>
  );
};
export default SpringMotionText;

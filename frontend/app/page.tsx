"use client";

import MainHeader from "@/components/shared/Header";
import Main from "@/components/shared/Main";
import { motion } from "framer-motion";

export default function Home() {

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.section
      className="w-full h-screen flex justify-center items-center p-3 text-white"
    >
      <motion.div 
        variants={itemVariants}
        className="w-full h-full bg-gray-900 rounded-2xl p-2 border-white border-4 flex flex-col overflow-hidden"
      >
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <MainHeader />
        </motion.div>
        <motion.div variants={itemVariants} className="flex-grow" initial="hidden" animate="visible">
          <Main />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
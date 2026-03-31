import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import HeroCarousel from '../components/carousel/HeroCarousel';

const Home = () => {
  const [activeThemeColor, setActiveThemeColor] = useState("#008B47");

  return (
    <AnimatePresence mode="wait">
      <motion.main 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative min-h-[100dvh] w-full transition-colors duration-1000 overflow-x-hidden flex flex-col items-center justify-center"
        style={{ backgroundColor: activeThemeColor }}
      >
        <Navbar />
        
        <div className="w-full flex-grow flex items-center justify-center px-4 sm:px-8 lg:px-16 pt-[80px] md:pt-0">
          <HeroCarousel onColorChange={setActiveThemeColor} />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] text-white/40 font-black">
            Scroll to Explore
          </span>
          <motion.div 
            animate={{ height: [20, 48, 20], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1.5px] bg-gradient-to-b from-white/60 to-transparent" 
          />
        </motion.div>
      </motion.main>
    </AnimatePresence>
  );
};

export default Home;
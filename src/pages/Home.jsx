import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/layout/Navbar";
import HeroCarousel from "../components/carousel/HeroCarousel";

const Home = () => {
  const [activeThemeColor, setActiveThemeColor] = useState("#008B47");

  return (
    <AnimatePresence mode="wait">
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="relative min-h-[100dvh] w-full bg-[#050505] text-white overflow-hidden flex flex-col justify-between select-none"
      >
        {/* Dynamic Ambient Background Glow - High-End Aesthetic */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-1000 ease-out z-0 opacity-30 mix-blend-screen"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${activeThemeColor} 0%, transparent 65%)`,
            filter: "blur(100px)",
          }}
        />

        {/* Premium Tech Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none z-0" />

        {/* Fixed Header Wrapper to manage layouts safely */}
        <div className="w-full z-50">
          <Navbar />
        </div>

        {/* Main Immersive Content Area - Fully Fluid & Responsive */}
        <div className="w-full flex-grow flex items-center justify-center px-4 sm:px-8 lg:px-16 xl:px-24 py-6 md:py-12 z-10 mt-[70px] md:mt-0">
          <div className="w-full max-w-7xl mx-auto flex items-center justify-center">
            {/* Color passes up from Carousel to Home to change background glow */}
            <HeroCarousel onColorChange={setActiveThemeColor} />
          </div>
        </div>

        {/* Cinematic Kinetic Scroll Indicator - Strictly Hidden on Mobile/Tablet */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="w-full z-10 pb-6 md:pb-8 flex-col items-center gap-3 pointer-events-none hidden md:flex"
        >
          <span className="text-[9px] uppercase tracking-[0.5em] text-white/30 font-black">Scroll to Explore</span>
          <div className="w-[1px] h-14 bg-white/10 relative overflow-hidden rounded-full">
            <motion.div
              animate={{
                y: [-56, 56],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-white/70 to-transparent"
            />
          </div>
        </motion.div>
      </motion.main>
    </AnimatePresence>
  );
};

export default Home;

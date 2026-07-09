import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi";
import { flavorsData } from "../../data/flavors";
import DrinkBottle from "./DrinkBottle";
import Button from "../ui/Button";

// Swipe Threshold configurations for accurate detection
const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

const HeroCarousel = ({ onColorChange, heroData }) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Logic to dynamically handle single items, arrays from backend, or fallback data
  const displayData = useMemo(() => {
    if (!heroData || (Array.isArray(heroData) && heroData.length === 0)) {
      return flavorsData;
    }

    // Standardize raw input into an iterable array
    const items = Array.isArray(heroData) ? heroData : [heroData];
    
    // Aesthetic premium fallback colors if background color is undefined
    const vibrantColors = ["#22c55e", "#ec4899", "#3b82f6", "#f97316", "#a855f7"];

    return items.map((item, idx) => {
      let finalImageUrl = item.imageUrl || item.image || item.bottleImage;

      if (finalImageUrl) {
        if (!finalImageUrl.startsWith("http") && !finalImageUrl.startsWith("/") && !finalImageUrl.startsWith("data:")) {
          let cleanPath = finalImageUrl.replace(/\\/g, "/");
          const fileName = cleanPath.split("/").pop();
          const encodedFileName = encodeURIComponent(fileName);
          finalImageUrl = `http://localhost:5000/uploads/${encodedFileName}`;
        }
      } else {
        finalImageUrl = "/placeholder.png";
      }

      return {
        id: item._id || item.id || `slide-${idx}`,
        title: item.mainTitle || "Premium Flavor",
        subtitle: item.subTitle || "Handcrafted Refreshment",
        description: item.description || "Experience the ultimate refreshing taste built for premium flavor enthusiasts.",
        bottleImage: finalImageUrl,
        bgColor: item.bgColor || vibrantColors[idx % vibrantColors.length],
      };
    });
  }, [heroData]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setIndex((prev) => (prev === displayData.length - 1 ? 0 : prev + 1));
  }, [displayData]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setIndex((prev) => (prev === 0 ? displayData.length - 1 : prev - 1));
  }, [displayData]);

  const current = displayData[index];

  // Notify parent component when the background accent color changes
  useEffect(() => {
    if (onColorChange && current) {
      onColorChange(current.bgColor);
    }
  }, [current, onColorChange]);

  // Autoplay slider configuration
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [index, nextSlide]);

  if (!current) return null;

  return (
    <section className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden py-10 md:py-0">
      {/* Background Large Text with GPU Acceleration */}
      <div className="absolute inset-0 flex items-center justify-center z-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.h2
            key={current.title}
            initial={{ opacity: 0, scale: 0.8, x: direction > 0 ? 200 : -200 }}
            animate={{ opacity: 0.05, scale: 1.1, x: 0 }}
            exit={{ opacity: 0, scale: 1.2, x: direction > 0 ? -200 : 200 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            style={{ translateZ: 0 }}
            className="text-[35vw] md:text-[28vw] font-black text-white uppercase leading-none will-change-transform select-none"
          >
            {current.title.split(" ")[0]}
          </motion.h2>
        </AnimatePresence>
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(e, { offset, velocity }) => {
          const swipe = swipePower(offset.x, velocity.x);
          if (swipe < -swipeConfidenceThreshold) {
            nextSlide();
          } else if (swipe > swipeConfidenceThreshold) {
            prevSlide();
          }
        }}
        className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center z-20 pt-16 md:pt-20 w-full relative cursor-grab active:cursor-grabbing selection:bg-transparent"
      >
        {/* Left Side Content */}
        <div className="text-white space-y-4 md:space-y-6 order-2 lg:order-1 relative z-30 flex flex-col items-center lg:items-start text-center lg:text-left mt-8 lg:mt-0 pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id || current.title}
              initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col items-center lg:items-start will-change-transform"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[8px] md:text-[10px] font-black tracking-[0.3em] uppercase mb-4"
              >
                Premium Refreshment
              </motion.span>

              <h1 className="text-5xl md:text-7xl lg:text-[7.5rem] font-black leading-[0.9] uppercase tracking-tighter drop-shadow-xl">
                {current.title} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/30 italic text-2xl md:text-4xl lg:text-5xl block mt-2 font-bold tracking-normal">
                  {current.subtitle}
                </span>
              </h1>

              <p className="mt-6 md:mt-8 text-sm md:text-lg max-w-sm md:max-w-md text-white/70 leading-relaxed font-medium">
                {current.description}
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6 mt-8 md:mt-10">
                <Button
                  variant="primary"
                  className="px-8 md:px-10 py-4 md:py-5 rounded-full bg-white text-black font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-white/90 transition-all shadow-xl"
                >
                  Shop Taste <FiArrowRight className="inline-block ml-2" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Side Bottle Display */}
        <div className="order-1 lg:order-2 flex justify-center items-center relative min-h-[350px] md:min-h-[550px] z-40 scale-90 md:scale-100 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.bottleImage}
              initial={{ opacity: 0, x: direction > 0 ? 150 : -150, rotate: direction > 0 ? 15 : -15 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -150 : 150, rotate: direction > 0 ? -15 : 15 }}
              transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              className="w-full h-full flex justify-center items-center"
            >
              <DrinkBottle bottleImage={current.bottleImage} title={current.title} id={current.id} />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Navigation Controls */}
      <div className="absolute bottom-6 md:bottom-10 left-0 w-full px-6 lg:px-16 flex items-center justify-center lg:justify-between z-50 pointer-events-none">
        <div className="hidden lg:flex gap-8 text-white/20 font-black text-[9px] tracking-[0.3em] uppercase pointer-events-auto">
          {["Instagram", "Twitter", "Facebook"].map((s) => (
            <a key={s} href="#" className="hover:text-white transition-colors">
              {s}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-6 md:gap-10 bg-[#0a0a0a]/80 backdrop-blur-3xl p-1.5 md:p-2 rounded-full border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.6)] pointer-events-auto">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={prevSlide}
            className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-[#141414] text-white/60 hover:text-white hover:bg-[#1f1f1f] flex items-center justify-center transition-all focus:outline-none border border-white/5"
          >
            <FiChevronLeft className="text-lg md:text-xl" />
          </motion.button>

          <div className="flex gap-2 items-center">
            {displayData.map((_, i) => (
              <motion.div
                key={i}
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }}
                animate={{
                  width: i === index ? 24 : 6,
                  backgroundColor: i === index ? current.bgColor : "rgba(255,255,255,0.15)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="h-1.5 rounded-full cursor-pointer"
              />
            ))}
          </div>

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={nextSlide}
            className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-[#141414] text-white/60 hover:text-white hover:bg-[#1f1f1f] flex items-center justify-center transition-all focus:outline-none border border-white/5"
          >
            <FiChevronRight className="text-lg md:text-xl" />
          </motion.button>
        </div>

        <div className="hidden lg:block text-white/10 font-black text-2xl italic select-none">
          <span className="text-white/40">0{index + 1}</span> / 0{displayData.length}
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
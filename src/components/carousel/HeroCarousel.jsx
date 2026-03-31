import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import { flavorsData } from '../../data/flavors';
import DrinkBottle from './DrinkBottle';
import Button from '../ui/Button';

const HeroCarousel = ({ onColorChange }) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setIndex((prev) => (prev === flavorsData.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setIndex((prev) => (prev === 0 ? flavorsData.length - 1 : prev - 1));
  };

  const current = flavorsData[index];

  useEffect(() => {
    if (onColorChange) {
      onColorChange(current.bgColor);
    }
  }, [current, onColorChange]);

  return (
    <section className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden py-10 md:py-0">
      
      <div className="absolute inset-0 flex items-center justify-center z-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.h2
            key={current.title}
            initial={{ opacity: 0, scale: 0.8, x: direction > 0 ? 200 : -200 }}
            animate={{ opacity: 0.05, scale: 1.1, x: 0 }}
            exit={{ opacity: 0, scale: 1.2, x: direction > 0 ? -200 : 200 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="text-[35vw] md:text-[28vw] font-black text-white uppercase leading-none"
          >
            {current.title.split(' ')[0]}
          </motion.h2>
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center z-20 pt-16 md:pt-20 w-full relative">
        
        <div className="text-white space-y-4 md:space-y-6 order-2 lg:order-1 relative z-30 flex flex-col items-center lg:items-start text-center lg:text-left mt-8 lg:mt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center lg:items-start"
            >
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[8px] md:text-[10px] font-black tracking-[0.3em] uppercase mb-4"
              >
                Premium Refreshment
              </motion.span>
              
              <h1 className="text-5xl md:text-7xl lg:text-[9rem] font-black leading-[0.9] uppercase tracking-tighter drop-shadow-xl">
                {current.title} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/30 italic text-2xl md:text-4xl lg:text-5xl block mt-2 font-bold tracking-normal">
                  {current.subtitle}
                </span>
              </h1>
              
              <p className="mt-6 md:mt-8 text-sm md:text-lg max-w-sm md:max-w-md text-white/70 leading-relaxed font-medium">
                {current.description}
              </p>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6 mt-8 md:mt-10">
                <Button variant="primary" className="px-8 md:px-10 py-4 md:py-5 rounded-full bg-white text-black font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-green-400 transition-all shadow-xl">
                  Shop Taste <FiArrowRight className="inline-block ml-2" />
                </Button>
                <button className="text-white/50 font-black border-b border-white/10 hover:border-white hover:text-white transition-all pb-1 tracking-widest uppercase text-[9px] md:text-[10px]">
                  Explore More
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="order-1 lg:order-2 flex justify-center items-center relative min-h-[350px] md:min-h-[550px] z-40 pointer-events-none scale-90 md:scale-100">
          <DrinkBottle 
            bottleImage={current.bottleImage} 
            title={current.title} 
            elements={current.elements} 
            id={current.id} 
          />
        </div>
      </div>

      <div className="absolute bottom-6 md:bottom-10 left-0 w-full px-6 lg:px-16 flex items-center justify-center lg:justify-between z-50">
        
        <div className="hidden lg:flex gap-8 text-white/20 font-black text-[9px] tracking-[0.3em] uppercase">
          {['Instagram', 'Twitter', 'Facebook'].map(s => (
            <a key={s} href="#" className="hover:text-green-400 transition-colors">{s}</a>
          ))}
        </div>

        <div className="flex items-center gap-6 md:gap-10 bg-black/30 backdrop-blur-3xl p-1.5 md:p-2 rounded-full border border-white/10 shadow-2xl">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={prevSlide} 
            className="p-4 md:p-5 rounded-full bg-white/5 text-white hover:bg-white hover:text-black transition-all"
          >
            <FiChevronLeft className="text-xl md:text-2xl"/>
          </motion.button>
          
          <div className="flex gap-2 md:gap-3">
            {flavorsData.map((_, i) => (
              <motion.div 
                key={i}
                onClick={() => setIndex(i)}
                animate={{ 
                  width: i === index ? 30 : 8,
                  backgroundColor: i === index ? "#22c55e" : "rgba(255,255,255,0.15)"
                }}
                className="h-1.5 md:h-2 rounded-full cursor-pointer transition-all"
              />
            ))}
          </div>

          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={nextSlide} 
            className="p-4 md:p-5 rounded-full bg-white/5 text-white hover:bg-white hover:text-black transition-all"
          >
            <FiChevronRight className="text-xl md:text-2xl"/>
          </motion.button>
        </div>

        <div className="hidden lg:block text-white/10 font-black text-2xl italic">
          <span className="text-white/40">0{index + 1}</span> / 0{flavorsData.length}
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
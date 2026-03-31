import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DrinkBottle = ({ bottleImage, title, id }) => {
  return (
    <div className="relative flex justify-center items-center w-full h-[500px] md:h-[650px] overflow-visible perspective-[1000px]">
      
      <motion.div
        key={`glow-${id}`}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: [0.2, 0.5, 0.2], 
          scale: [1, 1.2, 1] 
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute w-72 h-72 md:w-[450px] md:h-[450px] bg-white/20 blur-[100px] rounded-full z-0"
      />

      <AnimatePresence mode="wait">
        <motion.div 
          key={id} 
          initial={{ opacity: 0, y: 300, scale: 0.2, rotateY: 180, rotateZ: 45 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0, rotateZ: 0 }}
          exit={{ opacity: 0, y: -300, scale: 0.5, rotateY: -180, rotateZ: -45 }}
          transition={{ 
            type: "spring", 
            stiffness: 70, 
            damping: 12,
            duration: 0.8
          }}
          className="relative z-10 flex justify-center items-center w-full h-full"
        >
          <motion.img
            src={`/drinks/${bottleImage}`}
            alt={title}
            loading="eager"
            animate={{ 
              y: [-15, 15, -15], 
              rotateZ: [-2, 2, -2] 
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="relative z-50 h-[85%] w-auto object-contain drop-shadow-[0_40px_50px_rgba(0,0,0,0.5)] cursor-pointer"
            whileHover={{ scale: 1.05 }} 
          />
        </motion.div>
      </AnimatePresence>

      <motion.div 
        key={`shadow-${id}`}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: [0.2, 0.6, 0.2], 
          scale: [0.8, 1.2, 0.8] 
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute bottom-5 w-52 h-8 bg-black/40 blur-2xl rounded-[100%] z-5" 
      />
    </div>
  );
};

export default DrinkBottle;
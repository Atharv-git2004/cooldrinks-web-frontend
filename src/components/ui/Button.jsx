import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ text, onClick, className = "" }) => {
  return (
    <motion.button
      onClick={onClick}
      // Hover & Tap Animations
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.4)",
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      
      // Styling using Tailwind
      className={`
        relative px-8 py-3 
        bg-white/10 backdrop-blur-md 
        border border-white/20 
        text-white font-bold tracking-wider uppercase 
        rounded-full overflow-hidden 
        transition-all duration-300
        hover:bg-white/20
        ${className}
      `}
    >
      {/* 1. Shimmer Effect Layer */}
      <motion.div
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
      />
      
      {/* 2. Button Text */}
      <span className="relative z-10">{text || "Order Now"}</span>
    </motion.button>
  );
};

export default Button;
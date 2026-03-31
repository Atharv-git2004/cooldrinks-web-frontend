import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiArrowRight } from 'react-icons/fi';
import { flavorsData } from '../data/flavors';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring', stiffness: 120, damping: 12 }
  },
};

const floatingGlow = {
  animate: {
    y: [0, -30, 0],
    scale: [1, 1.2, 1],
    opacity: [0.3, 0.6, 0.3],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const Flavors = () => {
  const navigate = useNavigate();

  return (
    <div className="relative pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto min-h-screen text-white overflow-hidden">
      
      <motion.div 
        variants={floatingGlow}
        animate="animate"
        className="absolute top-[-10%] left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-green-500/10 blur-[120px] -z-10 rounded-full" 
      />
      <motion.div 
        variants={floatingGlow}
        animate="animate"
        className="absolute bottom-[-10%] right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-green-400/5 blur-[120px] -z-10 rounded-full" 
        style={{ animationDelay: '3s' }}
      />

      <div className="text-center mb-12 md:mb-24 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-green-500 font-bold tracking-[0.4em] uppercase text-[8px] md:text-[10px] inline-block mb-4 border border-green-500/20 py-2 px-6 rounded-full bg-white/5 backdrop-blur-sm">
            Discover Refreshment
          </span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-4xl md:text-8xl font-black uppercase tracking-tighter italic leading-tight md:leading-none"
        >
          Our <span className="text-green-500 relative inline-block">
            Collection
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 1 }}
              className="absolute -bottom-1 left-0 h-[3px] md:h-[6px] bg-green-500 rounded-full opacity-40"
            />
          </span>
        </motion.h1>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-10 relative z-10"
      >
        {flavorsData.map((item, index) => (
          <motion.div 
            key={item.id}
            variants={cardVariants}
            whileHover={{ y: -10 }}
            className="group relative bg-gradient-to-br from-white/10 via-white/[0.02] to-transparent backdrop-blur-xl border border-white/10 p-4 md:p-10 rounded-[30px] md:rounded-[60px] flex flex-col items-center transition-all duration-500 hover:border-green-500/40 hover:shadow-[0_20px_80px_rgba(34,197,94,0.15)]"
          >
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                navigate('/cart', { state: { tab: 'wishlist' } });
              }}
              className="absolute top-4 right-4 md:top-8 md:right-8 p-2 md:p-4 bg-white/5 rounded-xl md:rounded-2xl text-white/40 hover:text-pink-500 hover:bg-pink-500/10 transition-all z-20 group/heart border border-white/5"
            >
              <FiHeart className="text-lg md:text-2xl group-hover/heart:fill-pink-500 transition-all" />
            </button>

            {index < 2 && (
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute top-4 left-4 md:top-8 md:left-8 bg-green-500 text-black text-[7px] md:text-[9px] font-black px-2 md:px-4 py-1 md:py-2 rounded-full uppercase tracking-[0.2em] shadow-lg z-20"
              >
                Best
              </motion.div>
            )}

            <div 
              className="h-40 md:h-80 w-full flex justify-center items-center mb-4 md:mb-8 cursor-pointer relative group"
              onClick={() => navigate(`/product/${item.id}`)}
            >
              <div className="absolute w-24 md:w-48 h-24 md:h-48 bg-green-500/20 blur-[50px] md:blur-[70px] rounded-full scale-75 group-hover:scale-125 transition-all duration-700" />
              <motion.img 
                whileHover={{ rotate: 12, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                src={`/drinks/${item.bottleImage}`} 
                alt={item.title} 
                className="h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] z-10" 
              />
            </div>

            <div className="text-center space-y-1 md:space-y-2 mb-4 md:mb-8 w-full relative z-10">
              <h3 className="text-lg md:text-4xl font-black italic uppercase tracking-tighter group-hover:text-green-400 transition-colors duration-300 truncate w-full">
                {item.title}
              </h3>
              <div className="flex justify-center items-center gap-2 md:gap-3">
                <span className="text-sm md:text-2xl font-black text-white">₹99</span>
                <span className="text-gray-500 line-through text-[10px] md:text-sm font-bold opacity-60">₹120</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 w-full relative z-20">
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/product/${item.id}`)}
                className="w-full py-3 md:py-5 rounded-[1.2rem] md:rounded-[2.2rem] bg-white/5 border border-white/10 text-white font-black uppercase text-[8px] md:text-[10px] tracking-[0.1em] md:tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500 flex items-center justify-center gap-1 md:gap-2 group/btn"
              >
                Details <FiArrowRight className="text-sm md:text-lg group-hover/btn:translate-x-2 transition-transform" />
              </motion.button>

              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/checkout', { state: { productId: item.id } })}
                className="w-full py-3 md:py-5 rounded-[1.2rem] md:rounded-[2.2rem] bg-green-500 text-black font-black uppercase text-[8px] md:text-[10px] tracking-[0.1em] md:tracking-[0.2em] hover:bg-green-400 transition-all duration-500 flex items-center justify-center gap-1 md:gap-2"
              >
                Order <FiShoppingCart className="text-sm md:text-lg" />
              </motion.button>
            </div>

          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.5 } }
        }}
        className="mt-20 md:mt-40 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 border-t border-white/10 pt-10 md:pt-20 text-center"
      >
        {[
          { label: 'Unique Flavors', val: '12+' },
          { label: 'Happy Community', val: '50k+' },
          { label: 'Global Outlets', val: '100+' },
          { label: 'Countries Active', val: '10+' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <h4 className="text-2xl md:text-5xl font-black italic text-green-500 mb-1">{stat.val}</h4>
            <p className="text-gray-500 text-[7px] md:text-[9px] uppercase tracking-[0.2em] font-bold">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Flavors;
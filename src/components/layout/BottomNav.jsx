import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiGrid, FiHeart, FiShoppingCart, FiUser } from 'react-icons/fi';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: <FiHome /> },
    { name: 'Flavors', path: '/flavors', icon: <FiGrid /> },
    { name: 'Wishlist', path: '/cart', icon: <FiHeart />, state: { tab: 'wishlist' } },
    { name: 'Cart', path: '/cart', icon: <FiShoppingCart />, state: { tab: 'cart' } },
    { name: 'Profile', path: '/profile', icon: <FiUser /> },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-0 w-full px-6 z-[100]">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="flex items-center justify-between bg-black/40 backdrop-blur-2xl border border-white/10 px-6 py-4 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.path && 
                          (!item.state || location.state?.tab === item.state.tab);

          return (
            <Link 
              key={item.name} 
              to={item.path} 
              state={item.state}
              className="relative flex flex-col items-center justify-center group"
            >
              <motion.div 
                whileTap={{ scale: 0.8 }}
                className={`text-2xl transition-all duration-300 ${
                  isActive ? 'text-green-400' : 'text-white/40'
                }`}
              >
                {item.icon}
              </motion.div>

              {/* Active Dot Indicator */}
              {isActive && (
                <motion.div 
                  layoutId="activeDot"
                  className="absolute -bottom-2 w-1 h-1 bg-green-400 rounded-full"
                />
              )}

              {/* Label (Optional - Only visible when active) */}
              {isActive && (
                <motion.span 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[8px] font-black uppercase tracking-tighter text-green-400 mt-1"
                >
                  {item.name}
                </motion.span>
              )}
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
};

export default BottomNav;
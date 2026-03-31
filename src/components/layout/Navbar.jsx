import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiHeart } from 'react-icons/fi';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Flavors', path: '/flavors' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] px-4 py-6 lg:px-12 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-black/20 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full shadow-2xl pointer-events-auto">
        
        {/* Logo Section - Always Visible */}
        <Link to="/">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-green-400 to-green-700 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)]">
              <span className="text-white font-black text-xl italic underline decoration-yellow-400 decoration-2">S</span>
            </div>
            <h1 className="text-white font-black text-2xl tracking-tighter italic uppercase">
              Spri<span className="text-green-400">te</span>
            </h1>
          </motion.div>
        </Link>

        {/* Desktop Menu - Hidden on Mobile (md:flex) */}
        <div className="hidden md:flex items-center gap-10 text-white/80 font-bold text-sm tracking-widest uppercase">
          {navLinks.map((item) => (
            <Link 
              key={item.name} 
              to={item.path} 
              className={`hover:text-green-400 transition-all duration-300 relative group ${
                location.pathname === item.path ? 'text-green-400' : ''
              }`}
            >
              {item.name}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-green-400 transition-all duration-300 ${
                location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
          ))}
        </div>

        {/* Icons & CTA - Right Side */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search - Hidden on Mobile */}
          <button className="text-white/70 hover:text-green-400 transition-colors text-xl p-2 hidden md:block">
            <FiSearch />
          </button>
          
          {/* Wishlist - Hidden on Mobile (Since it's in Bottom Nav) */}
          <Link 
            to="/cart" 
            state={{ tab: 'wishlist' }} 
            className="relative p-2 text-white/70 hover:text-pink-500 transition-all duration-300 group hidden md:block"
          >
            <FiHeart className={`text-xl ${location.state?.tab === 'wishlist' ? 'text-pink-500' : ''}`} />
            <span className="absolute top-0 right-0 bg-pink-500 text-[10px] text-white font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              1
            </span>
          </Link>

          {/* Cart - Always Visible OR Hidden on Mobile based on your choice */}
          {/* ഇവിടെ മൊബൈലിൽ കാർട്ട് ഹൈഡ് ചെയ്യണമെങ്കിൽ 'hidden md:block' ചേർക്കാം */}
          <Link 
            to="/cart" 
            state={{ tab: 'cart' }}
            className="relative p-2 text-white/70 hover:text-green-400 transition-all duration-300 group"
          >
            <FiShoppingCart className={`text-xl ${(!location.state || location.state?.tab === 'cart') && location.pathname === '/cart' ? 'text-green-400' : ''}`} />
            <span className="absolute top-0 right-0 bg-yellow-400 text-[10px] text-black font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              2
            </span>
          </Link>

          {/* Order Now CTA - Hidden on Mobile */}
          <Link to="/flavors" className="hidden lg:block bg-white text-black font-black text-xs uppercase px-8 py-3 rounded-full hover:bg-green-500 hover:text-white transition-all duration-300 shadow-lg shadow-black/20">
            Order Now
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
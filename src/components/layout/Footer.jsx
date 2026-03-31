import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-black/20 backdrop-blur-lg border-t border-white/10 pt-12 pb-6 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 text-white">
        
        {/* 1. Brand Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            DRINK STUDIO
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Experience the ultimate refreshment with our curated collection of world-class beverages. Pure taste, delivered with style.
          </p>
        </div>

        {/* 2. Quick Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Products</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* 3. Support */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Support</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
          </ul>
        </div>

        {/* 4. Social Media & Newsletter */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Follow Us</h3>
          <div className="flex space-x-5">
            <motion.a whileHover={{ y: -3 }} href="#" className="text-xl hover:text-blue-500 transition-colors"><FaFacebook /></motion.a>
            <motion.a whileHover={{ y: -3 }} href="#" className="text-xl hover:text-blue-400 transition-colors"><FaTwitter /></motion.a>
            <motion.a whileHover={{ y: -3 }} href="#" className="text-xl hover:text-pink-500 transition-colors"><FaInstagram /></motion.a>
            <motion.a whileHover={{ y: -3 }} href="#" className="text-xl hover:text-blue-700 transition-colors"><FaLinkedin /></motion.a>
          </div>
          <div className="pt-2">
            <p className="text-xs text-gray-500 italic">Stay refreshed with our latest updates.</p>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Section */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
        <p>© {currentYear} Drink Studio. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Designed with ❤️ for a Refreshing Experience.</p>
      </div>

      {/* Background Decor Element */}
      <div className="absolute top-0 right-0 -z-10 w-64 h-64 bg-white/5 blur-[100px] rounded-full pointer-events-none" />
    </footer>
  );
};

export default Footer;
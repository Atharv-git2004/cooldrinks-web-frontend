import React from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl">
        
        <div className="space-y-6">
          <h2 className="text-4xl font-bold tracking-tighter text-green-500">Get in Touch</h2>
          <p className="text-gray-400 leading-relaxed">Have questions about our products or want to partner with us? Drop a message and we'll get back to you soon.</p>
          
          <div className="space-y-4 pt-4">
            <p className="text-sm">📍 Kochi, Kerala, India</p>
            <p className="text-sm">📧 hello@drinkstudio.com</p>
            <p className="text-sm">📞 +91 98765 43210</p>
          </div>
        </div>

        <form className="space-y-4">
          <input 
            type="text" 
            placeholder="Your Name" 
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-green-500 transition-all"
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-green-500 transition-all"
          />
          <textarea 
            placeholder="Your Message" 
            rows="4"
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-green-500 transition-all"
          ></textarea>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-green-500 text-black font-bold py-4 rounded-xl hover:bg-green-400 transition-all"
          >
            Send Message
          </motion.button>
        </form>

      </div>
    </div>
  );
};

export default Contact;
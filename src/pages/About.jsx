import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 md:p-16 rounded-[40px]"
      >
        <h1 className="text-5xl font-black mb-6 tracking-tighter italic">THE DRINK <span className="text-green-500">STUDIO</span></h1>
        <p className="text-lg text-gray-300 leading-loose">
          We believe that every sip should be an experience. Established in 2024, Drink Studio has been at the forefront of bringing the most refreshing and iconic beverages to your doorstep. 
        </p>
        
        <div className="grid grid-cols-3 gap-4 mt-12">
          <div>
            <h4 className="text-3xl font-bold text-green-500">50+</h4>
            <p className="text-xs text-gray-500 uppercase">Flavors</p>
          </div>
          <div>
            <h4 className="text-3xl font-bold text-green-500">10k+</h4>
            <p className="text-xs text-gray-500 uppercase">Customers</p>
          </div>
          <div>
            <h4 className="text-3xl font-bold text-green-500">24/7</h4>
            <p className="text-xs text-gray-500 uppercase">Support</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
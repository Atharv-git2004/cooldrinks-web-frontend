import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMinus, FiPlus, FiHeart, FiArrowLeft, FiShoppingCart } from 'react-icons/fi';
import { flavorsData } from '../data/flavors';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 1. Quantity handeling
  const [quantity, setQuantity] = useState(1);

  // Finding the correct product from data
  const product = flavorsData.find((item) => item.id === parseInt(id));

  if (!product) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-black mb-4">Product Not Found!</h1>
        <button onClick={() => navigate('/flavors')} className="text-green-500 underline uppercase tracking-widest text-xs">
          Back to Collection
        </button>
      </div>
    );
  }

  const handleIncrease = () => setQuantity(prev => prev + 1);
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  // 2. Updated Order function to go to Checkout
  const handleOrderNow = () => {
    // Checkout പേജിലേക്ക് പ്രോഡക്റ്റ് വിവരങ്ങളും ക്വാണ്ടിറ്റിയും പാസ് ചെയ്യുന്നു
    navigate('/checkout', { 
      state: { 
        productId: product.id,
        productName: product.title,
        quantity: quantity,
        price: 99
      } 
    });
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto min-h-screen text-white">
      {/* Back Button */}
      <motion.button 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)} 
        className="mb-12 flex items-center gap-2 text-gray-400 hover:text-green-500 transition-all font-bold uppercase text-xs tracking-[0.2em]"
      >
        <FiArrowLeft /> Back to Collection
      </motion.button>

      <div className="grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Image with floating animation */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative flex justify-center items-center bg-gradient-to-b from-white/10 to-transparent rounded-[60px] p-10 border border-white/10 backdrop-blur-sm group"
        >
          {/* Background Glow */}
          <div className="absolute w-64 h-64 bg-green-500/20 blur-[100px] rounded-full group-hover:bg-green-500/30 transition-all duration-700" />
          
          <motion.img 
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ repeat: Infinity, duration: 4, repeatType: "reverse", ease: "easeInOut" }}
            src={`/src/assets/drinks/${product.bottleImage}`} 
            alt={product.title} 
            className="h-[450px] md:h-[600px] object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)] z-10"
          />
        </motion.div>

        {/* Right Side: Info & Actions */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-500 font-black uppercase text-xs tracking-[0.3em] block"
            >
              Pure Refreshment
            </motion.span>
            <h1 className="text-7xl md:text-8xl font-black uppercase text-white tracking-tighter leading-[0.9]">
              {product.title}
            </h1>
            <h3 className="text-2xl font-bold text-gray-400 italic">Premium Flavor</h3>
          </div>
          
          <p className="text-gray-400 leading-relaxed text-lg max-w-md">
            Experience the intense burst of {product.title}. Specially crafted for those who seek 
            the ultimate refreshment in every sip. Non-alcoholic and 100% natural.
          </p>
          
          {/* Pricing & Quantity */}
          <div className="flex flex-wrap items-end gap-12 pt-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">Price Per Bottle</span>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-green-500">₹99</span>
                <span className="text-gray-600 line-through font-bold">₹120</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">Quantity</span>
              <div className="flex items-center border border-white/10 rounded-[1.5rem] overflow-hidden bg-white/5 backdrop-blur-md">
                <button 
                  onClick={handleDecrease}
                  className="px-6 py-4 hover:bg-green-500 hover:text-black transition-all"
                >
                  <FiMinus />
                </button>
                <span className="px-6 py-2 text-2xl font-black min-w-[60px] text-center">{quantity}</span>
                <button 
                  onClick={handleIncrease}
                  className="px-6 py-4 hover:bg-green-500 hover:text-black transition-all"
                >
                  <FiPlus />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-8">
            <motion.button 
              whileHover={{ scale: 1.02, backgroundColor: '#4ade80' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleOrderNow}
              className="flex-[2] bg-green-500 text-black font-black py-6 rounded-[2.5rem] transition-all text-xl uppercase tracking-widest shadow-2xl shadow-green-500/20 flex items-center justify-center gap-3"
            >
              <FiShoppingCart className="text-2xl" /> Order Now
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05, borderColor: '#ec4899' }}
              whileTap={{ scale: 0.9 }}
              className="p-6 border border-white/10 rounded-[2.5rem] hover:bg-pink-500/10 text-2xl text-pink-500 transition-all flex items-center justify-center"
            >
              <FiHeart />
            </motion.button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-4 pt-6 border-t border-white/5">
             <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-4 border-[#0a0a0a] bg-gradient-to-br from-gray-700 to-gray-900" />
                ))}
             </div>
             <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold leading-tight">
               Loved by <span className="text-white">10,000+</span> <br /> Refreshment Seekers
             </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;
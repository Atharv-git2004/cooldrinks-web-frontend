import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

const Checkout = () => {
  const navigate = useNavigate();
  const [isOrdered, setIsOrdered] = useState(false);

  const handleOrder = (e) => {
    e.preventDefault();
    setIsOrdered(true);
    // 3 സെക്കന്റിന് ശേഷം ഹോം പേജിലേക്ക് വിടാം
    setTimeout(() => navigate('/'), 3000);
  };

  if (isOrdered) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-white bg-black p-6 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-500 text-8xl mb-6">
          <FaCheckCircle />
        </motion.div>
        <h1 className="text-4xl font-black uppercase italic mb-2">Order Confirmed!</h1>
        <p className="text-gray-400">Thank you for shopping with Sprite. Redirecting to home...</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto min-h-screen text-white">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition-all mb-10 uppercase text-xs font-bold tracking-widest">
        <FaArrowLeft /> Back to Cart
      </button>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">Shipping <span className="text-green-500">Details</span></h2>
          
          <form onSubmit={handleOrder} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold text-gray-500">Full Name</label>
                <input required type="text" placeholder="Atharv P" className="bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-green-500 outline-none transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold text-gray-500">Email Address</label>
                <input required type="email" placeholder="atharv@example.com" className="bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-green-500 outline-none transition-all" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase font-bold text-gray-500">Shipping Address</label>
              <textarea required rows="3" placeholder="Street name, City, Kerala" className="bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-green-500 outline-none transition-all"></textarea>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold text-gray-500">Phone Number</label>
                <input required type="tel" placeholder="+91 0000000000" className="bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-green-500 outline-none transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-bold text-gray-500">Payment Method</label>
                <select className="bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-green-500 outline-none transition-all">
                  <option className="bg-black">Cash on Delivery</option>
                  <option className="bg-black" disabled>UPI / Card (Coming Soon)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full bg-green-500 text-black font-black py-5 rounded-[2rem] hover:bg-green-400 transition-all uppercase tracking-widest shadow-xl shadow-green-900/20">
              Place Order
            </button>
          </form>
        </div>

        {/* Small Order Summary */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] h-fit sticky top-32">
          <h3 className="text-xl font-black mb-6 italic uppercase text-green-500">Your Order</h3>
          <div className="space-y-4 text-sm border-b border-white/10 pb-6">
             <div className="flex justify-between"><span>Sprite x 1</span><span>₹99</span></div>
             <div className="flex justify-between"><span>Pepsi x 2</span><span>₹178</span></div>
             <div className="flex justify-between text-green-400"><span>Shipping</span><span>FREE</span></div>
          </div>
          <div className="flex justify-between text-2xl font-black pt-6 italic">
            <span>Total</span><span>₹277</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
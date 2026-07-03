import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiShoppingBag, FiArrowLeft } from "react-icons/fi";

const Cart = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("storage")); // Navbar കൗണ്ട് അപ്ഡേറ്റ് ചെയ്യാൻ
  }, [cartItems]);

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + 99 * (item.quantity || 1), 0);

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-32 pb-20 px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition-all font-bold uppercase text-xs tracking-[0.2em]"
        >
          <FiArrowLeft /> Back
        </button>
        <h1 className="text-2xl font-black italic uppercase tracking-widest text-green-500">
          Your Cart ({cartItems.length})
        </h1>
      </div>

      <AnimatePresence mode="wait">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
          {cartItems.length > 0 ? (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md hover:border-green-500/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-6">
                    <img
                      src={item.img ? `/drinks/${item.img}` : "/placeholder.png"}
                      alt={item.title}
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                      className="w-20 h-20 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                    />
                    <div>
                      <h3 className="text-xl font-black italic uppercase tracking-tight">{item.title}</h3>
                      <p className="text-green-500 font-bold">₹99</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-500 hover:text-red-500 p-2 bg-white/5 hover:bg-red-500/10 rounded-full transition-all"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              ))}

              <div className="mt-10 p-8 bg-gradient-to-r from-white/5 to-transparent rounded-3xl border border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6 backdrop-blur-md">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Total Amount</p>
                  <h2 className="text-4xl font-black text-white italic">₹{totalPrice}</h2>
                </div>
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full sm:w-auto bg-green-500 text-black font-black px-10 py-4 rounded-full uppercase tracking-widest hover:bg-green-400 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all duration-300"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          ) : (
            <EmptyState icon={<FiShoppingBag />} title="Your Cart is Empty" />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const EmptyState = ({ icon, title }) => (
  <div className="text-center py-24 flex flex-col items-center gap-4 text-gray-500 bg-white/[0.02] border border-white/5 rounded-[40px]">
    <div className="text-6xl text-gray-600 animate-pulse">{icon}</div>
    <h2 className="text-xl font-black uppercase tracking-wider text-gray-400">{title}</h2>
  </div>
);

export default Cart;

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiHeart, FiArrowLeft, FiCheckCircle } from "react-icons/fi";

const Wishlist = () => {
  const navigate = useNavigate();

  const [wishlistItems, setWishlistItems] = useState(() => {
    return JSON.parse(localStorage.getItem("wishlist")) || [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
    window.dispatchEvent(new Event("storage")); // Navbar കൗണ്ട് അപ്ഡേറ്റ് ചെയ്യാൻ
  }, [wishlistItems]);

  const removeFromWishlist = (id) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const moveToCart = (item) => {
    // കാർട്ടിലെ നിലവിലുള്ള ഡാറ്റ എടുക്കുന്നു
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = currentCart.find((cartItem) => cartItem.id === item.id);

    // കാർട്ടിൽ ഇല്ലെങ്കിൽ മാത്രം ആഡ് ചെയ്യുന്നു
    if (!existingItem) {
      const updatedCart = [...currentCart, { ...item, quantity: 1 }];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }

    // വിഷ്‌ലിസ്റ്റിൽ നിന്നും ഡിലീറ്റ് ചെയ്യുന്നു
    removeFromWishlist(item.id);
    navigate("/cart"); // വേണമെങ്കിൽ നേരിട്ട് കാർട്ട് പേജിലേക്ക് കൊണ്ടുപോകാം
  };

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
        <h1 className="text-2xl font-black italic uppercase tracking-widest text-pink-500">
          Your Wishlist ({wishlistItems.length})
        </h1>
      </div>

      <AnimatePresence mode="wait">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
          {wishlistItems.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="p-6 bg-white/5 border border-white/10 rounded-3xl flex justify-between items-center backdrop-blur-md hover:border-pink-500/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.img ? `/drinks/${item.img}` : "/placeholder.png"}
                      alt={item.title}
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                      className="w-16 h-16 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                    />
                    <h3 className="font-bold uppercase tracking-tight italic">{item.title}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveToCart(item)}
                      className="p-3 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-black rounded-full transition-all duration-300"
                      title="Move to Cart"
                    >
                      <FiCheckCircle size={18} />
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="p-3 bg-white/5 text-gray-400 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-all duration-300"
                      title="Remove"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={<FiHeart />} title="Wishlist is Empty" />
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

export default Wishlist;

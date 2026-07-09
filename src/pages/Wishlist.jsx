import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiHeart, FiArrowLeft, FiCheckCircle, FiChevronRight } from "react-icons/fi";
import axios from "axios";

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);

  const getToken = () => localStorage.getItem("token");

  const fetchWishlist = async () => {
    try {
      const token = getToken();
      const response = await axios.get("https://cooldrinkbackend.onrender.com/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      // ബാക്കെൻഡിൽ നിന്ന് കിട്ടുന്നത് { items: [...] } എന്ന ഫോർമാറ്റിൽ ആണെന്ന് ഉറപ്പുവരുത്തുക
      setWishlistItems(response.data.items || response.data || []);
    } catch (err) {
      console.error("Error fetching wishlist", err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId, e) => {
    if (e) e.stopPropagation();
    try {
      const token = getToken();
      await axios.delete(`https://cooldrinkbackend.onrender.com/api/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setWishlistItems((prev) => prev.filter((item) => item.productId !== productId));
    } catch (err) {
      console.error("Error removing from wishlist", err);
    }
  };

  const moveToCart = async (item, e) => {
    if (e) e.stopPropagation();
    const token = getToken();

    // ബാക്കെൻഡ് ആവശ്യപ്പെടുന്ന ഫോർമാറ്റിലേക്ക് ഡാറ്റ മാറ്റുന്നു
    const itemData = {
      productId: item.productId,
      title: item.title,
      price: item.price,
      img: item.img,
    };

    try {
      await axios.post(
        "https://cooldrinkbackend.onrender.com/api/cart/add",
        { item: itemData },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );

      // കാർട്ടിലേക്ക് ആഡ് ചെയ്ത ശേഷം വിഷ്‌ലിസ്റ്റിൽ നിന്ന് നീക്കം ചെയ്യുന്നു
      await removeFromWishlist(item.productId);
      navigate("/cart");
    } catch (err) {
      console.error("Error moving item to cart", err);
      alert("Failed to move item to cart");
    }
  };

  // ... (getImageSrc ഫംഗ്‌ഷൻ പഴയതുപോലെ തന്നെ നിലനിർത്തുക)

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-24 md:pt-32 pb-20 px-4 md:px-6 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-pink-500 transition-all font-bold uppercase text-xs tracking-widest bg-white/5 py-2 px-4 rounded-full border border-white/5"
        >
          <FiArrowLeft /> Back
        </button>
        <h1 className="text-2xl md:text-4xl font-black italic uppercase tracking-widest text-pink-500">
          Your Wishlist ({wishlistItems.length})
        </h1>
      </div>

      <AnimatePresence mode="wait">
        <motion.div className="relative z-10">
          {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <motion.div
                  key={item.productId}
                  layout
                  className="group flex flex-col p-6 bg-[#111111] border border-white/5 rounded-3xl hover:border-pink-500/50 transition-all"
                >
                  <img src={item.img} alt={item.title} className="w-24 h-24 object-contain mb-4" />
                  <h3 className="text-xl font-black italic uppercase">{item.title}</h3>
                  <p className="text-pink-500 font-bold mb-4">₹{item.price}</p>

                  <div className="flex gap-3 mt-auto">
                    <button
                      onClick={(e) => moveToCart(item, e)}
                      className="flex-1 py-3 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-black font-bold uppercase text-xs transition-all"
                    >
                      Move to Cart
                    </button>
                    <button
                      onClick={(e) => removeFromWishlist(item.productId, e)}
                      className="p-3 bg-white/5 text-gray-400 hover:text-red-500 rounded-xl transition-all"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState icon={<FiHeart />} title="Your Wishlist is Empty" navigate={navigate} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const EmptyState = ({ icon, title, navigate }) => (
  <div className="text-center py-20 flex flex-col items-center gap-6">
    <div className="text-6xl text-pink-900/30">{icon}</div>
    <h2 className="text-3xl font-black uppercase">{title}</h2>
    <button
      onClick={() => navigate("/flavors")}
      className="px-8 py-4 bg-white/5 rounded-full hover:bg-pink-500 transition-all"
    >
      Discover Flavors
    </button>
  </div>
);

export default Wishlist;

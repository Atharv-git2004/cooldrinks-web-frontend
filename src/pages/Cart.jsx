import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiShoppingBag, FiArrowLeft, FiChevronRight } from "react-icons/fi";
import axios from "axios";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // ടോക്കൺ സ്റ്റോറേജിൽ ഉണ്ടെങ്കിൽ എടുക്കാൻ
  const getToken = () => localStorage.getItem("token");

  // API വഴി കാർട്ട് ഡാറ്റ എടുക്കാനുള്ള ഫംഗ്ഷൻ
  const fetchCart = async () => {
    try {
      const token = getToken();
      // നിങ്ങളുടെ ലോക്കൽഹോസ്റ്റ് ആണെങ്കിൽ "http://localhost:5000/api/cart" എന്ന് മാറ്റാം
      const response = await axios.get("https://cooldrinkbackend.onrender.com/api/cart", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });

      // ബാക്കെൻഡിൽ നിന്നുള്ള ഡാറ്റ അറേ ആണെന്ന് ഉറപ്പാക്കുന്നു
      setCartItems(response.data.items || response.data || []);
    } catch (err) {
      console.error("Error fetching cart", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // കാർട്ടിൽ നിന്നും ഐറ്റം റിമൂവ് ചെയ്യാനുള്ള ഫംഗ്ഷൻ
  const removeFromCart = async (id, e) => {
    e.stopPropagation();
    try {
      const token = getToken();
      await axios.delete(`https://cooldrinkbackend.onrender.com/api/cart/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });
      // ഡിലീറ്റ് ചെയ്ത ശേഷം സ്ക്രീനിൽ നിന്നും അത് ഒഴിവാക്കുന്നു
      setCartItems((prev) => prev.filter((item) => (item._id || item.id || item.productId) !== id));
    } catch (err) {
      console.error("Error removing item", err);
    }
  };

  const getProductImage = (img) => {
    if (!img) return "/placeholder.png";
    if (img.startsWith("http") || img.startsWith("/") || img.startsWith("data:")) {
      return img;
    }
    return `/drinks/${img}`;
  };

  const navigateToDetails = (item) => {
    const itemId = item._id || item.id || item.productId;
    navigate(`/product/${itemId}`, { state: { product: item } });
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price || 99) * (item.quantity || 1), 0);

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-24 md:pt-32 pb-20 px-4 md:px-6 max-w-5xl mx-auto overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 md:mb-12 relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition-all font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] bg-white/5 py-2 px-4 rounded-full border border-white/5"
        >
          <FiArrowLeft /> Back
        </button>
        <h1 className="text-2xl md:text-4xl font-black italic uppercase tracking-widest text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">
          Your Cart ({cartItems.length})
        </h1>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="relative z-10"
        >
          {cartItems.length > 0 ? (
            <div className="space-y-4 md:space-y-6">
              <AnimatePresence>
                {cartItems.map((item) => {
                  const itemId = item._id || item.id || item.productId;
                  const itemColor = item.bgColor || "#22c55e";
                  const itemPrice = item.price || 99;
                  const itemQuantity = item.quantity || 1;

                  return (
                    <motion.div
                      key={itemId || Math.random()}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                      whileHover={{ y: -5 }}
                      onClick={() => navigateToDetails(item)}
                      className="group flex flex-col sm:flex-row items-center justify-between p-4 md:p-6 bg-[#111111] border border-white/5 rounded-2xl md:rounded-[2rem] hover:border-white/20 hover:bg-[#151515] transition-all duration-300 cursor-pointer overflow-hidden relative"
                    >
                      {/* Background Glow Effect */}
                      <div
                        className="absolute -left-20 -top-20 w-40 h-40 blur-[80px] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                        style={{ backgroundColor: itemColor }}
                      />

                      <div className="flex w-full sm:w-auto items-center gap-4 md:gap-8 relative z-10">
                        {/* Product Image */}
                        <div className="relative w-20 h-20 md:w-28 md:h-28 flex-shrink-0 flex items-center justify-center p-2 rounded-xl md:rounded-2xl bg-white/5 border border-white/5 group-hover:border-white/10 transition-colors">
                          <img
                            src={getProductImage(item.img || item.bottleImage)}
                            alt={item.title}
                            onError={(e) => {
                              e.target.src = "/placeholder.png";
                            }}
                            className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <h3 className="text-lg md:text-2xl font-black italic uppercase tracking-tight text-white mb-1 md:mb-2 group-hover:text-green-400 transition-colors line-clamp-1">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-3">
                            <p className="text-base md:text-lg font-black" style={{ color: itemColor }}>
                              ₹{itemPrice}
                            </p>
                            <span className="text-gray-600 text-xs font-bold uppercase tracking-widest border border-white/10 px-2 py-0.5 rounded-md">
                              Qty: {itemQuantity}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-4 mt-4 sm:mt-0 relative z-10 border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0">
                        <div className="flex flex-col sm:items-end mr-2 md:mr-6">
                          <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Subtotal</span>
                          <span className="text-lg md:text-xl font-black text-white">₹{itemPrice * itemQuantity}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => removeFromCart(itemId, e)}
                            className="p-3 md:p-4 text-gray-500 bg-black/40 hover:text-red-500 hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 rounded-xl md:rounded-2xl transition-all duration-300"
                            title="Remove item"
                          >
                            <FiTrash2 size={20} />
                          </button>
                          <div className="p-3 md:p-4 text-white/30 group-hover:text-white group-hover:bg-white/10 rounded-xl md:rounded-2xl transition-all duration-300 hidden sm:flex">
                            <FiChevronRight size={20} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Checkout Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 md:mt-12 p-6 md:p-8 bg-gradient-to-br from-[#111] to-[#0a0a0a] rounded-[2rem] md:rounded-[3rem] border border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 backdrop-blur-xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-green-500/5 pointer-events-none" />

                <div className="w-full md:w-auto text-center md:text-left relative z-10">
                  <p className="text-gray-400 text-[10px] md:text-xs uppercase tracking-[0.2em] font-black mb-2">
                    Total Amount
                  </p>
                  <h2 className="text-4xl md:text-6xl font-black text-white italic drop-shadow-xl">₹{totalPrice}</h2>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full md:w-auto bg-green-500 text-black font-black px-8 md:px-12 py-4 md:py-5 rounded-full md:rounded-[2rem] uppercase text-xs md:text-sm tracking-[0.2em] hover:bg-green-400 hover:scale-[1.02] active:scale-95 transition-all duration-300 relative z-10 shadow-[0_0_40px_rgba(34,197,94,0.2)] hover:shadow-[0_0_60px_rgba(34,197,94,0.4)]"
                >
                  Proceed to Checkout
                </button>
              </motion.div>
            </div>
          ) : (
            <EmptyState icon={<FiShoppingBag />} title="Your Cart is Empty" navigate={navigate} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const EmptyState = ({ icon, title, navigate }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="text-center py-20 md:py-32 flex flex-col items-center gap-6 text-gray-500 bg-[#0a0a0a] border border-white/5 rounded-[3rem] md:rounded-[4rem]"
  >
    <div className="text-6xl md:text-8xl text-gray-800 mb-2 drop-shadow-2xl">{icon}</div>
    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-white">{title}</h2>
    <p className="text-gray-500 text-sm md:text-base max-w-sm px-4">
      Looks like you haven't added any premium flavors to your cart yet.
    </p>
    <button
      onClick={() => navigate("/flavors")}
      className="mt-4 px-8 py-4 bg-white/5 border border-white/10 rounded-full text-white font-bold uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all duration-300"
    >
      Discover Flavors
    </button>
  </motion.div>
);

export default Cart;

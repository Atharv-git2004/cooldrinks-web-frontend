import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom'; // useLocation ആഡ് ചെയ്തു
import { FaTrash, FaHeart, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Navbar-ൽ നിന്ന് വരുന്നത് വിഷ്‌ലിസ്റ്റ് ആണോ എന്ന് നോക്കി ടാബ് സെറ്റ് ചെയ്യുന്നു
  const [activeTab, setActiveTab] = useState(
    location.state?.tab === 'wishlist' ? 'wishlist' : 'cart'
  );

  // ഡമ്മി ഡാറ്റ
  const [cartItems, setCartItems] = useState([
    { id: 1, title: "Sprite", price: 99, qty: 1, img: "sprite.png" },
    { id: 4, title: "Pepsi", price: 89, qty: 2, img: "pepsi.png" }
  ]);

  const [wishlistItems, setWishlistItems] = useState([
    { id: 8, title: "Monster", price: 150, img: "monster.png" }
  ]);

  // ടോട്ടൽ പ്രൈസ് കാൽക്കുലേഷൻ
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const removeFromCart = (id) => setCartItems(cartItems.filter(item => item.id !== id));
  const removeFromWishlist = (id) => setWishlistItems(wishlistItems.filter(item => item.id !== id));

  // ഐറ്റം ക്വാണ്ടിറ്റി മാറ്റാനുള്ള ഫങ്ഷൻ
  const updateQty = (id, delta) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto min-h-screen text-white">
      {/* Header & Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition-all font-bold uppercase text-xs tracking-widest">
          <FaArrowLeft /> Continue Shopping
        </button>
        
        {/* Tab Switcher */}
        <div className="flex bg-white/5 p-1.5 rounded-3xl border border-white/10 backdrop-blur-md">
          <button 
            onClick={() => setActiveTab('cart')}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl transition-all duration-300 ${activeTab === 'cart' ? 'bg-green-500 text-black font-black' : 'text-gray-400 hover:text-white'}`}
          >
            <FaShoppingCart /> Cart ({cartItems.length})
          </button>
          <button 
            onClick={() => setActiveTab('wishlist')}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl transition-all duration-300 ${activeTab === 'wishlist' ? 'bg-pink-500 text-white font-black' : 'text-gray-400 hover:text-white'}`}
          >
            <FaHeart /> Wishlist ({wishlistItems.length})
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'cart' ? (
          <motion.div 
            key="cart" 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 20 }} 
            className="grid lg:grid-cols-3 gap-10"
          >
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.length > 0 ? cartItems.map((item) => (
                <motion.div 
                  layout
                  key={item.id} 
                  className="flex flex-wrap sm:flex-nowrap items-center gap-6 bg-white/5 border border-white/10 p-6 rounded-[32px] hover:bg-white/10 transition-colors"
                >
                  <div className="w-24 h-24 bg-white/5 rounded-2xl p-2 flex justify-center items-center">
                    <img src={`/src/assets/drinks/${item.img}`} alt={item.title} className="h-full object-contain drop-shadow-xl" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">{item.title}</h3>
                    <p className="text-green-500 font-bold text-lg">₹{item.price}</p>
                  </div>
                  
                  {/* Qty Controls */}
                  <div className="flex items-center gap-4 bg-black/40 rounded-2xl px-4 py-2 border border-white/10">
                    <button onClick={() => updateQty(item.id, -1)} className="hover:text-green-500 transition-colors">-</button>
                    <span className="font-bold text-xl min-w-[20px] text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="hover:text-green-500 transition-colors">+</button>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    className="p-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                  >
                    <FaTrash />
                  </button>
                </motion.div>
              )) : (
                <div className="text-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/20">
                   <p className="text-gray-500 text-xl font-bold italic">Your cart is empty.</p>
                </div>
              )}
            </div>

            {/* Summary Panel */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] h-fit sticky top-32 backdrop-blur-xl">
              <h3 className="text-2xl font-black mb-6 italic uppercase tracking-tighter text-green-500">Order Summary</h3>
              <div className="space-y-4 text-gray-400 border-b border-white/10 pb-6">
                <div className="flex justify-between font-bold"><span>Subtotal</span><span className="text-white">₹{totalPrice}</span></div>
                <div className="flex justify-between font-bold"><span>Shipping</span><span className="text-green-400 uppercase text-sm">Free</span></div>
              </div>
              <div className="flex justify-between text-3xl font-black py-8 italic tracking-tighter">
                <span>Total</span><span>₹{totalPrice}</span>
              </div>
              <button className="w-full bg-green-500 text-black font-black py-5 rounded-3xl hover:bg-green-400 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest shadow-xl shadow-green-900/20">
                Checkout Now
              </button>
            </div>
          </motion.div>
        ) : (
          /* Wishlist Content */
          <motion.div 
            key="wishlist" 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }} 
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {wishlistItems.length > 0 ? wishlistItems.map((item) => (
              <motion.div layout key={item.id} className="bg-white/5 border border-white/10 p-8 rounded-[40px] flex flex-col items-center text-center hover:bg-white/10 transition-all group">
                <div className="h-48 mb-6 group-hover:scale-110 transition-transform duration-500">
                  <img src={`/src/assets/drinks/${item.img}`} alt={item.title} className="h-full object-contain drop-shadow-2xl" />
                </div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-1">{item.title}</h3>
                <p className="text-pink-500 font-black text-xl mb-6">₹{item.price}</p>
                <div className="flex gap-3 w-full">
                  <button className="flex-grow bg-white text-black py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-green-500 hover:text-white transition-all shadow-lg">Add to Cart</button>
                  <button 
                    onClick={() => removeFromWishlist(item.id)} 
                    className="p-4 border border-white/10 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <FaTrash />
                  </button>
                </div>
              </motion.div>
            )) : (
              <div className="text-center col-span-full py-20 bg-white/5 rounded-[40px] border border-dashed border-white/20">
                <p className="text-gray-500 text-xl font-bold italic">Your wishlist is empty.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;
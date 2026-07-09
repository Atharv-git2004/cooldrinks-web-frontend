import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // <-- Added for Navigation
import Navbar from "../components/layout/Navbar";
import HeroCarousel from "../components/carousel/HeroCarousel";
import axios from "axios";
import { FiShoppingCart } from "react-icons/fi";

const Home = () => {
  const [activeThemeColor, setActiveThemeColor] = useState("#008B47");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // <-- Initialize navigate

  // ഹീറോ ഡാറ്റ സ്റ്റോർ ചെയ്യാൻ
  const [heroData, setHeroData] = useState(null);

  // കോംപോണന്റ് ലോഡ് ആകുമ്പോൾ ഹീറോ ഡാറ്റ ഫെച്ച് ചെയ്യുക
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await axios.get("https://cooldrinkbackend.onrender.com/api/home/get");
        console.log("Hero Data from Backend:", res.data);

        if (res.data) {
          const finalData = Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : res.data;
          setHeroData(finalData);
        }
      } catch (err) {
        console.error("Error fetching hero data", err);
      }
    };
    fetchHero();
  }, []);

  // കോംപോണന്റ് ലോഡ് ആകുമ്പോൾ പ്രോഡക്റ്റുകൾ ഫെച്ച് ചെയ്യുക
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://cooldrinkbackend.onrender.com/api/products");
        setProducts(Array.isArray(response.data) ? response.data : response.data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // കാർഡിൽ ക്ലിക്ക് ചെയ്യുമ്പോൾ പ്രോഡക്റ്റ് ഡീറ്റെയിൽസ് പേജിലേക്ക് പോകാൻ
  const handleProductClick = (product) => {
    const productId = product._id || product.id;
    // പ്രോഡക്റ്റ് ഡാറ്റ state വഴി പാസ്സ് ചെയ്യുന്നു, അതിനാൽ വേഗത്തിൽ ലോഡ് ആകും!
    navigate(`/product/${productId}`, { state: { product } });
  };

  // Home പേജിൽ നിന്നും നേരിട്ട് Cart-ലേക്ക് ആഡ് ചെയ്യാൻ
  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // കാർഡിലെ ക്ലിക്ക് വർക്ക് ആകാതിരിക്കാൻ (details പേജിലേക്ക് പോകാതിരിക്കാൻ)

    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    const productId = product._id || product.id;
    const existingItem = currentCart.find((item) => (item._id || item.id) === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentCart.push({
        id: productId,
        _id: productId,
        title: product.title || "Premium Flavor",
        price: product.price || 99,
        quantity: 1,
        img: product.img || product.bottleImage,
        bgColor: product.bgColor || "#22c55e",
      });
    }

    localStorage.setItem("cart", JSON.stringify(currentCart));
    window.dispatchEvent(new Event("storage"));
    alert(`${product.title || "Product"} added to Cart! 🛒`);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="relative min-h-[100dvh] w-full bg-[#050505] text-white overflow-x-hidden flex flex-col select-none"
      >
        {/* Background Gradient */}
        <div
          className="fixed inset-0 pointer-events-none transition-colors duration-1000 ease-out z-0 opacity-20 transform-gpu"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${activeThemeColor} 0%, transparent 70%)`,
          }}
        />

        {/* Premium Tech Grid Overlay */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none z-0" />

        {/* Fixed Header */}
        <div className="w-full z-50 fixed top-0">
          <Navbar />
        </div>

        {/* ഹീറോ സെക്ഷൻ */}
        <div className="w-full min-h-[100dvh] flex flex-col justify-center items-center px-4 sm:px-8 lg:px-16 xl:px-24 pt-[80px] z-10 relative">
          <div className="w-full max-w-7xl mx-auto flex items-center justify-center">
            <HeroCarousel onColorChange={setActiveThemeColor} heroData={heroData} />
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute bottom-8 w-full flex-col items-center gap-3 pointer-events-none hidden md:flex"
          >
            <span className="text-[9px] uppercase tracking-[0.5em] text-white/30 font-black">Scroll to Explore</span>
            <div className="w-[1px] h-14 bg-white/10 relative overflow-hidden rounded-full transform-gpu">
              <motion.div
                animate={{ y: [-56, 56] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-white/50 to-transparent will-change-transform"
              />
            </div>
          </motion.div>
        </div>

        {/* Products Section */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 py-20 z-10 relative">
          <div className="mb-12 text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Core</span>{" "}
              Lineup
            </h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">
              Discover the latest flavors from Database
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
              <span className="text-gray-500 italic text-xs tracking-widest uppercase">Loading Inventory...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-500 font-bold uppercase tracking-widest text-sm bg-white/5 rounded-[40px] border border-white/10 backdrop-blur-xl">
              No Flavors Available Right Now.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product._id || index}
                  onClick={() => handleProductClick(product)} // <-- Added Click Handler
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-[30px] p-6 backdrop-blur-xl hover:bg-white/10 hover:border-green-500/30 transition-all group flex flex-col cursor-pointer" // <-- Added cursor-pointer
                >
                  <div className="h-56 w-full bg-black/40 rounded-2xl flex items-center justify-center p-4 mb-6 relative overflow-hidden">
                    {product.img ? (
                      <img
                        src={product.img}
                        alt={product.title}
                        className="h-full object-contain transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 drop-shadow-[0_10px_20px_rgba(34,197,94,0.15)]"
                      />
                    ) : (
                      <span className="text-gray-600 text-[10px] uppercase font-black tracking-widest">
                        No Image Provided
                      </span>
                    )}
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-black italic uppercase tracking-tight text-white mb-2 line-clamp-2">
                        {product.title}
                      </h3>
                      <p className="text-green-500 font-mono font-bold text-xl mb-6">₹{product.price}</p>
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(e, product)} // <-- Working Add to Cart Button
                      className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-green-500 hover:text-black hover:border-green-500 transition-all active:scale-95"
                    >
                      <FiShoppingCart className="text-lg" /> Add To Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.main>
    </AnimatePresence>
  );
};

export default Home;

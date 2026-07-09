import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiHeart, FiArrowRight } from "react-icons/fi";
import Lottie from "lottie-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";

// Local Lottie ഫയലും ബാക്കപ്പ് പ്രൊഡക്റ്റ് ഡാറ്റയും ഇംപോർട്ട് ചെയ്യുന്നു
import flavorAnimation from "../assets/animation.json";
import { flavorsData } from "../data/flavors";

gsap.registerPlugin(ScrollTrigger);

const LottieComponent = Lottie?.default || Lottie;

const Flavors = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState({});
  const [wishlistedItems, setWishlistedItems] = useState([]);

  // Wishlist ലോക്കൽ സ്റ്റോറേജിൽ നിന്ന് എടുക്കുന്നു
  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlistedItems(savedWishlist.map((item) => item.id));
  }, []);

  // ബാക്കെൻഡിൽ നിന്നും പുതിയ പ്രോഡക്റ്റുകൾ ഫെച്ച് ചെയ്ത് പഴയതിനൊപ്പം ചേർക്കുന്നു
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        const fetchedProducts = Array.isArray(response.data) ? response.data : response.data?.products || [];

        // ബാക്കെൻഡ് ഡാറ്റ ഫോർമാറ്റ് ചെയ്യുന്നു
        const backendProducts = fetchedProducts.map((item) => ({
          ...item,
          id: item._id || Math.random().toString(),
          title: item.title || "Unknown Flavor",
          price: item.price || 99,
          bgColor: item.bgColor || "#22c55e",
          bottleImage: item.img || item.bottleImage || "",
          isBackend: true,
        }));

        // ലോക്കൽ ഡാറ്റയ്ക്ക് id-യും വിലയും ഉറപ്പാക്കുന്നു
        const formattedLocalData = flavorsData.map((item, index) => ({
          ...item,
          id: item.id || `local-${index}`,
          price: item.price || 99,
        }));

        setProducts([...formattedLocalData, ...backendProducts]);
      } catch (error) {
        console.error("Error fetching products from backend:", error);
        const formattedLocalData = flavorsData.map((item, index) => ({
          ...item,
          id: item.id || `local-${index}`,
          price: item.price || 99,
        }));
        setProducts(formattedLocalData);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      gsap.from(".gsap-header-badge", { y: -30, opacity: 0, duration: 0.8, ease: "back.out(1.5)" });
      gsap.from(".gsap-header-title span", {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
        delay: 0.1,
      });
      gsap.from(".gsap-stat-item", {
        scrollTrigger: { trigger: ".gsap-stats-container", start: "top 90%" },
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [loading]);

  const getProductImageSrc = (item) => {
    const imgSrc = item.bottleImage || item.img;
    if (!imgSrc) return "/placeholder.png";

    if (imgSrc.startsWith("http") || imgSrc.startsWith("/") || imgSrc.startsWith("data:")) {
      return imgSrc;
    }
    return `/drinks/${imgSrc}`;
  };

  const handleViewDetails = (item) => {
    const productWithImage = { ...item, displayImage: getProductImageSrc(item) };
    navigate(`/product/${item.id}`, { state: { product: productWithImage } });
  };

  // 🟢 ടോഗിൾ വിഷ്‌ലിസ്റ്റ് ഫംഗ്ഷൻ (API കാളും ടോക്കണും ഉൾപ്പെടുത്തിയിരിക്കുന്നു)
  const handleToggleWishlist = async (e, item) => {
    e.stopPropagation();
    setLoadingItems((prev) => ({ ...prev, [item.id]: true }));

    const imagePath = getProductImageSrc(item);
    const existingWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const isAlreadyWishlisted = existingWishlist.find((i) => i.id === item.id);

    // നിങ്ങളുടെ ലോഗിൻ ടോക്കൺ എടുക്കുന്നു
    const token = localStorage.getItem("token");

    // ടോക്കണും Credentials-ഉം വെച്ച് ഹെഡർ സെറ്റ് ചെയ്യുന്നു
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };

    if (isAlreadyWishlisted) {
      // 🔴 വിഷ്‌ലിസ്റ്റിൽ ഉണ്ടെങ്കിൽ ഡിലീറ്റ് ചെയ്യാനുള്ള ലോജിക്
      const updatedWishlist = existingWishlist.filter((i) => i.id !== item.id);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      setWishlistedItems((prev) => prev.filter((id) => id !== item.id));

      if (token) {
        try {
          await axios.delete(`http://localhost:5000/api/wishlist/${item.id}`, config);
        } catch (error) {
          console.error("Error removing from backend wishlist:", error);
        }
      }
    } else {
      // 🟢 വിഷ്‌ലിസ്റ്റിൽ ഇല്ലെങ്കിൽ ആഡ് ചെയ്യാനുള്ള ലോജിക്
      const cartFormatItem = {
        id: item.id,
        title: item.title,
        price: item.price || 99,
        img: imagePath,
        bgColor: item.bgColor,
      };

      localStorage.setItem("wishlist", JSON.stringify([...existingWishlist, cartFormatItem]));
      setWishlistedItems((prev) => [...prev, item.id]);

      // ലോഗിൻ ചെയ്ത യൂസർ ആണെങ്കിൽ മാത്രം ബാക്കെൻഡിലേക്ക് റിക്വസ്റ്റ് അയക്കുന്നു
      if (token) {
        try {
          const payload = {
            item: cartFormatItem,
          };
          // ടോക്കൺ (config) ഉൾപ്പെടുത്തി പോസ്റ്റ് ചെയ്യുന്നു
          await axios.post("http://localhost:5000/api/wishlist/add", payload, config);
        } catch (error) {
          console.error("Error adding to wishlist:", error.response?.data || error.message);
        }
      } else {
        console.log("User not logged in. Saved to local storage only.");
      }
    }

    // ഫംഗ്ഷൻ തീർന്നതിന് ശേഷം ലോഡിങ് മാറ്റുന്നു
    setLoadingItems((prev) => ({ ...prev, [item.id]: false }));
  };

  // Optimized Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div
      ref={containerRef}
      className="relative pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto min-h-screen text-white overflow-hidden"
    >
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none flex justify-center items-center overflow-hidden transform-gpu">
        {LottieComponent && flavorAnimation && (
          <LottieComponent
            animationData={flavorAnimation}
            loop={true}
            autoplay={true}
            className="w-full h-[120%] object-cover"
          />
        )}
      </div>

      <div className="absolute top-[-10%] left-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-green-500/10 blur-[80px] -z-10 rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-green-400/5 blur-[80px] -z-10 rounded-full pointer-events-none" />

      <div className="text-center mb-16 md:mb-24 relative z-10">
        <div className="overflow-hidden mb-4">
          <span className="gsap-header-badge text-green-500 font-black tracking-[0.4em] uppercase text-[9px] md:text-[11px] inline-block border border-green-500/30 py-2.5 px-8 rounded-full bg-[#111] shadow-[0_0_20px_rgba(34,197,94,0.1)]">
            Discover Refreshment
          </span>
        </div>
        <h1 className="gsap-header-title text-4xl md:text-8xl font-black uppercase tracking-tighter italic leading-tight md:leading-none overflow-hidden flex flex-wrap justify-center gap-2 md:gap-4">
          <span className="block">Our</span>
          <span className="text-green-500 relative inline-block">
            Collection
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 1 }}
              className="absolute -bottom-1 left-0 h-[3px] md:h-[6px] bg-green-500 rounded-full opacity-60"
            />
          </span>
        </h1>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 relative z-20 min-h-[40vh]">
          <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
          <span className="text-gray-500 italic text-xs tracking-widest uppercase">Loading Flavors...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500 font-bold uppercase tracking-widest text-sm relative z-20">
          No Flavors Available Right Now.
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 relative z-20"
        >
          {products.map((item) => {
            const itemColor = item.bgColor || "#22c55e";
            const isWishlisted = wishlistedItems.includes(item.id);
            return (
              <motion.div
                key={item.id}
                variants={cardVariants}
                whileHover={{ y: -10 }}
                className="group relative bg-[#131313] border border-white/5 p-5 md:p-10 rounded-[30px] md:rounded-[50px] flex flex-col items-center transition-all duration-300 hover:border-green-500/30 hover:bg-[#1a1a1a]"
              >
                {/* 🟢 Wishlist Button */}
                <button
                  onClick={(e) => handleToggleWishlist(e, item)}
                  disabled={loadingItems[item.id]}
                  style={
                    isWishlisted
                      ? { color: itemColor, backgroundColor: `${itemColor}20`, borderColor: `${itemColor}40` }
                      : {}
                  }
                  className={`absolute top-4 right-4 md:top-8 md:right-8 p-2.5 md:p-4 rounded-full md:rounded-2xl transition-all duration-300 z-30 group/heart border ${
                    isWishlisted ? "" : "bg-black/40 text-white/40 border-white/10 hover:bg-black"
                  }`}
                >
                  <FiHeart
                    className={`text-lg md:text-2xl transition-all duration-300 ${
                      isWishlisted ? "fill-current" : "group-hover/heart:fill-current group-hover/heart:text-white"
                    }`}
                  />
                </button>

                {/* Product Image Area */}
                <div
                  className="h-48 md:h-80 w-full flex justify-center items-center mb-6 md:mb-10 cursor-pointer relative"
                  onClick={() => handleViewDetails(item)}
                >
                  <div
                    className="absolute w-32 md:w-48 h-32 md:h-48 blur-[40px] rounded-full scale-75 group-hover:scale-100 transition-transform duration-500 opacity-40"
                    style={{ backgroundColor: itemColor }}
                  />
                  <img
                    src={getProductImageSrc(item)}
                    alt={item.title || "Product"}
                    onError={(e) => {
                      e.target.src = "/placeholder.png";
                    }}
                    className="h-full object-contain drop-shadow-xl z-20 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                  />
                </div>

                {/* Title & Price */}
                <div className="text-center space-y-2 md:space-y-3 mb-6 md:mb-8 w-full relative z-20">
                  <h3 className="text-xl md:text-4xl font-black italic uppercase tracking-tighter group-hover:text-green-400 transition-colors duration-300 truncate w-full">
                    {item.title}
                  </h3>
                  <div className="flex justify-center items-end gap-2 md:gap-3">
                    <span className="text-xl md:text-3xl font-black text-white">
                      ₹{Number(item.price) ? Number(item.price) : 99}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2.5 w-full relative z-30">
                  <button
                    onClick={() => handleViewDetails(item)}
                    className="w-full py-3.5 md:py-5 rounded-full bg-white/5 border border-white/10 text-white font-black uppercase text-[9px] md:text-[11px] tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    View Details <FiArrowRight />
                  </button>
                  <button
                    onClick={() => navigate("/checkout", { state: { product: item, productId: item.id } })}
                    className="w-full py-3.5 md:py-5 rounded-full bg-green-500 text-black font-black uppercase text-[9px] md:text-[11px] tracking-[0.2em] hover:bg-green-400 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Order Now <FiShoppingCart />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Statistics Section */}
      <div className="gsap-stats-container mt-24 md:mt-40 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 border-t border-white/10 pt-16 md:pt-20 text-center relative z-20">
        {[
          { label: "Unique Flavors", val: "12+" },
          { label: "Happy Community", val: "50k+" },
          { label: "Global Outlets", val: "100+" },
          { label: "Countries Active", val: "10+" },
        ].map((stat, i) => (
          <div key={i} className="gsap-stat-item overflow-hidden">
            <h4 className="text-3xl md:text-6xl font-black italic text-green-500 mb-2 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">
              {stat.val}
            </h4>
            <p className="text-gray-400 text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-bold">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Flavors;

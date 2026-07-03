import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiHeart, FiArrowRight } from "react-icons/fi";
import Lottie from "lottie-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";

// Local Lottie ഫയലും പ്രൊഡക്റ്റ് ഡാറ്റയും ഇംപോർട്ട് ചെയ്യുന്നു
import flavorAnimation from "../assets/animation.json";
import { flavorsData } from "../data/flavors";

gsap.registerPlugin(ScrollTrigger);

// VITE FIX: Lottie ഒബ്ജക്റ്റ് എറർ ഒഴിവാക്കാൻ (Line 130 ഫിക്സ്)
const LottieComponent = Lottie?.default || Lottie;

const Flavors = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [loadingItems, setLoadingItems] = useState({});
  const [wishlistedItems, setWishlistedItems] = useState([]);

  // ਲੋക്കൽ സ്റ്റോറേജിൽ നിന്ന് വിഷ്‌ലിസ്റ്റ് ഐറ്റംസ് ലോഡ് ചെയ്യുന്നു
  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlistedItems(savedWishlist.map((item) => item.id));
  }, []);

  // GSAP ആനിമേഷനുകൾ
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".gsap-header-badge", { y: -50, opacity: 0, duration: 1, ease: "back.out(1.5)" });
      gsap.from(".gsap-header-title span", {
        y: 100,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.2,
      });
      gsap.from(".gsap-stat-item", {
        scrollTrigger: { trigger: ".gsap-stats-container", start: "top 85%" },
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "spring(1, 80, 10, 0)",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // വിഷ്‌ലിസ്റ്റിലേക്ക് ആഡ് ചെയ്യാനുള്ള ഫങ്ഷൻ
  const handleAddToWishlist = async (e, item) => {
    e.stopPropagation();

    setLoadingItems((prev) => ({ ...prev, [item.id]: true }));

    // Optimistic Update: ബാക്ക്എൻഡ് റെസ്പോൺസ് വരുന്നതിന് മുൻപ് UI അപ്ഡേറ്റ് ചെയ്യുന്നു
    const existingWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (!existingWishlist.find((i) => i.id === item.id)) {
      const cartFormatItem = {
        id: item.id,
        title: item.title,
        price: 99,
        img: item.bottleImage,
        bgColor: item.bgColor,
      };
      localStorage.setItem("wishlist", JSON.stringify([...existingWishlist, cartFormatItem]));
    }
    setWishlistedItems((prev) => [...prev, item.id]);

    try {
      const payload = {
        userId: "guest123",
        item: {
          productId: item.id,
          title: item.title,
          price: 99,
          img: item.bottleImage,
        },
      };

      console.log("Sending this to backend:", payload);

      const response = await axios.post("http://localhost:5000/api/wishlist/add", payload);
      console.log("Success:", response.data);
    } catch (error) {
      if (error.response?.status === 400) {
        console.log("Item is already in the backend wishlist. UI updated successfully.");
      } else {
        console.error("Full Error details:", error.response?.data || error.message);
      }
    } finally {
      setLoadingItems((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.5 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } },
  };

  const floatingGlow = {
    animate: {
      y: [0, -40, 0],
      scale: [1, 1.2, 1],
      opacity: [0.2, 0.5, 0.2],
      transition: { duration: 8, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <div
      ref={containerRef}
      className="relative pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto min-h-screen text-white overflow-hidden"
    >
      {/* Lottie പശ്ചാത്തല ആനിമേഷൻ - Safe Rendering */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-screen flex justify-center items-center overflow-hidden">
        {LottieComponent && flavorAnimation && (
          <LottieComponent
            animationData={flavorAnimation}
            loop={true}
            autoplay={true}
            className="w-full h-[150%] object-cover"
          />
        )}
      </div>

      <motion.div
        variants={floatingGlow}
        animate="animate"
        className="absolute top-[-10%] left-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-green-500/10 blur-[120px] -z-10 rounded-full pointer-events-none"
      />
      <motion.div
        variants={floatingGlow}
        animate="animate"
        className="absolute bottom-[20%] right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-green-400/5 blur-[120px] -z-10 rounded-full pointer-events-none"
        style={{ animationDelay: "3s" }}
      />

      <div className="text-center mb-16 md:mb-24 relative z-10">
        <div className="overflow-hidden mb-4">
          <span className="gsap-header-badge text-green-500 font-black tracking-[0.4em] uppercase text-[9px] md:text-[11px] inline-block border border-green-500/30 py-2.5 px-8 rounded-full bg-white/5 backdrop-blur-md shadow-[0_0_20px_rgba(34,197,94,0.1)]">
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
              transition={{ delay: 1.2, duration: 1.5, ease: "circOut" }}
              className="absolute -bottom-1 left-0 h-[3px] md:h-[6px] bg-green-500 rounded-full opacity-60"
            />
          </span>
        </h1>
      </div>

      {/* പ്രൊഡക്റ്റ് ഗ്രിഡ് */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10 relative z-20"
      >
        {Array.isArray(flavorsData) &&
          flavorsData.map((item, index) => {
            const itemColor = item.bgColor || "#22c55e";
            const isWishlisted = wishlistedItems.includes(item.id);
            return (
              <motion.div
                key={item.id || index}
                variants={cardVariants}
                whileHover={{ y: -15, scale: 1.02 }}
                className="group relative bg-gradient-to-br from-white/10 via-white/[0.03] to-transparent backdrop-blur-xl border border-white/10 p-5 md:p-10 rounded-[30px] md:rounded-[50px] flex flex-col items-center transition-colors duration-500 hover:border-green-500/50 hover:shadow-[0_30px_100px_rgba(34,197,94,0.15)]"
              >
                {/* വിഷ്‌ലിസ്റ്റ് ബട്ടൺ */}
                <button
                  onClick={(e) => {
                    if (!isWishlisted) handleAddToWishlist(e, item);
                  }}
                  disabled={loadingItems[item.id] || isWishlisted}
                  style={
                    isWishlisted
                      ? { color: itemColor, backgroundColor: `${itemColor}20`, borderColor: `${itemColor}40` }
                      : {}
                  }
                  className={`absolute top-4 right-4 md:top-8 md:right-8 p-2.5 md:p-4 rounded-full md:rounded-2xl transition-all duration-300 z-30 group/heart border ${isWishlisted ? "" : "bg-white/5 text-white/40 border-white/10"}`}
                >
                  <FiHeart
                    className={`text-lg md:text-2xl transition-all duration-300 ${isWishlisted ? "fill-current" : "group-hover/heart:fill-current"}`}
                  />
                </button>

                {/* പ്രൊഡക്റ്റ് ഇമേജ് ഭാഗം */}
                <div
                  className="h-48 md:h-80 w-full flex justify-center items-center mb-6 md:mb-10 cursor-pointer relative"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <div
                    className="absolute w-32 md:w-56 h-32 md:h-56 blur-[60px] md:blur-[80px] rounded-full scale-75 group-hover:scale-110 transition-transform duration-700 opacity-50"
                    style={{ backgroundColor: itemColor }}
                  />
                  <motion.img
                    whileHover={{ rotate: 8, scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    src={`/drinks/${item.bottleImage}`}
                    alt={item.title}
                    onError={(e) => {
                      e.target.src = "/placeholder.png";
                    }}
                    className="h-full object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.7)] z-20"
                  />
                </div>

                {/* ടൈറ്റിലും വിലയും */}
                <div className="text-center space-y-2 md:space-y-3 mb-6 md:mb-8 w-full relative z-20">
                  <h3 className="text-xl md:text-4xl font-black italic uppercase tracking-tighter group-hover:text-green-400 transition-colors duration-300 truncate w-full">
                    {item.title}
                  </h3>
                  <div className="flex justify-center items-end gap-2 md:gap-3">
                    <span className="text-xl md:text-3xl font-black text-white">₹99</span>
                  </div>
                </div>

                {/* ആക്ഷൻ ബട്ടണുകൾ */}
                <div className="flex flex-col gap-2.5 w-full relative z-30">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/product/${item.id}`)}
                    className="w-full py-3.5 md:py-5 rounded-full bg-white/5 border border-white/10 text-white font-black uppercase text-[9px] md:text-[11px] tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    View Details <FiArrowRight />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/checkout", { state: { productId: item.id } })}
                    className="w-full py-3.5 md:py-5 rounded-full bg-green-500 text-black font-black uppercase text-[9px] md:text-[11px] tracking-[0.2em] hover:bg-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Order Now <FiShoppingCart />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
      </motion.div>

      {/* സ്റ്റാറ്റിസ്റ്റിക്സ് സെക്ഷൻ */}
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

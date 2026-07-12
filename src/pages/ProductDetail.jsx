import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMinus, FiPlus, FiHeart, FiArrowLeft, FiShoppingCart, FiCreditCard } from "react-icons/fi";
import axios from "axios"; // 🟢 Axios import ചെയ്തു

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [quantity, setQuantity] = useState(1);

  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!product);
  const [error, setError] = useState(null);

  const API_BASE_URL = "https://cooldrinkbackend.onrender.com";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/api/products/${id}`);

        if (!response.ok) {
          throw new Error(`Product not found (Status: ${response.status})`);
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error("Fetch Error:", err.message);

        if (!location.state?.product) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (!product || (product._id !== id && product.id !== id)) {
      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [id, product, location.state]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-green-500 bg-[#0a0a0a] font-black uppercase italic tracking-widest text-xl">
        Loading Product...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-white bg-[#0a0a0a]">
        <h1 className="text-4xl font-black mb-4">Product Not Found!</h1>
        <p className="text-gray-400 mb-6 text-sm">Failed to load product details from the database.</p>
        <button
          onClick={() => navigate(-1)}
          className="text-green-500 underline uppercase tracking-widest text-xs font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const getProductImage = (prod) => {
    if (prod.displayImage) return prod.displayImage;
    const img = prod.bottleImage || prod.img;

    if (!img) return "/placeholder.png";

    if (img.startsWith("http") || img.startsWith("/") || img.startsWith("data:")) {
      return img;
    }

    return `${API_BASE_URL}/uploads/${img}`;
  };

  const productPrice = product.price || 99;
  const originalPrice = product.originalPrice || productPrice + 21;
  const productImage = getProductImage(product);
  const bgColor = product.bgColor || "#22c55e";

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  // 🟢 1. ADD TO CART LOGIC (Backend API ഉപയോഗിച്ച് മാറ്റി)
  const handleAddToCart = async (showAlert = true) => {
    const token = localStorage.getItem("token");
    
    // ലോഗിൻ ചെയ്തിട്ടില്ലെങ്കിൽ ലോഗിൻ പേജിലേക്ക് വിടുക
    if (!token) {
      alert("Please login to add items to the cart!");
      navigate("/login");
      return;
    }

    try {
      const productId = product._id || product.id || id;
      
      // ബാക്കെൻഡിലേക്ക് അയക്കുന്ന ഡാറ്റ
      const payload = {
        productId: productId,
        quantity: quantity,
        price: productPrice,
        // ബാക്കെൻഡ് മോഡൽ അനുസരിച്ച് ആവശ്യമെങ്കിൽ താഴെയുള്ളവയും അയക്കാം
        title: product.title,
        img: product.img || product.bottleImage,
        bgColor: bgColor
      };

      await axios.post(`${API_BASE_URL}/api/cart`, payload, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      if (showAlert) {
        alert(`${product.title || "Product"} added to Cart! 🛒`);
      }
      
      // Navbar അപ്ഡേറ്റ് ചെയ്യാൻ വേണ്ടി കാർട്ടിലേക്ക് പോകുമ്പോൾ കൗണ്ട് മാറും
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert(err.response?.data?.message || "Failed to add to cart");
    }
  };

  // 🟢 2. WISHLIST LOGIC (Backend API ഉപയോഗിച്ച് മാറ്റി)
  const handleWishlist = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to add items to your Wishlist!");
      navigate("/login");
      return;
    }

    try {
      const productId = product._id || product.id || id;

      await axios.post(`${API_BASE_URL}/api/wishlist`, { productId: productId }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      alert(`${product.title || "Product"} added to Wishlist! ❤️`);
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      alert(err.response?.data?.message || "Failed to add to wishlist");
    }
  };

  // 3. ORDER NOW LOGIC
  const handleOrderNow = async () => {
    // കാർട്ടിലേക്ക് ആഡ് ചെയ്ത ശേഷം മാത്രം ചെക്ക്ഔട്ടിലേക്ക് പോകുക
    await handleAddToCart(false);
    navigate("/checkout");
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto min-h-screen text-white">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-12 flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors duration-300 font-bold uppercase text-xs tracking-[0.2em]"
      >
        <FiArrowLeft /> Back
      </button>

      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Image with floating animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative flex justify-center items-center bg-[#111111] border border-white/5 rounded-[60px] p-10 group"
        >
          <div
            className="absolute w-48 h-48 blur-[60px] rounded-full transition-all duration-700 transform-gpu opacity-30"
            style={{ backgroundColor: bgColor }}
          />

          <motion.img
            initial={{ y: 10 }}
            animate={{ y: -10 }}
            transition={{ repeat: Infinity, duration: 3, repeatType: "reverse", ease: "easeInOut" }}
            src={productImage}
            alt={product.title || "Product"}
            onError={(e) => {
              e.target.src = "/placeholder.png";
            }}
            className="h-[400px] md:h-[550px] object-contain drop-shadow-2xl z-10 transform-gpu"
          />
        </motion.div>

        {/* Right Side: Info & Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <span className="font-black uppercase text-xs tracking-[0.3em] block" style={{ color: bgColor }}>
              {product.tagline || "Pure Refreshment"}
            </span>
            <h1 className="text-5xl md:text-8xl font-black uppercase text-white tracking-tighter leading-[0.9]">
              {product.title || "Flavor"}
            </h1>
            <h3 className="text-xl md:text-2xl font-bold text-gray-400 italic">{product.subtitle || "Premium Drink"}</h3>
          </div>

          <p className="text-gray-400 leading-relaxed text-base md:text-lg max-w-md">
            {product.description ||
              `Experience the intense burst of ${product.title || "refreshment"}. Specially crafted for those who seek the ultimate experience in every sip. Non-alcoholic and 100% natural.`}
          </p>

          {/* Pricing & Quantity */}
          <div className="flex flex-wrap items-end gap-12 pt-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">Price Per Bottle</span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl md:text-6xl font-black" style={{ color: bgColor }}>
                  ₹{productPrice}
                </span>
                {originalPrice > productPrice && (
                  <span className="text-gray-600 line-through font-bold text-lg">₹{originalPrice}</span>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">Quantity</span>
              <div className="flex items-center border border-white/10 rounded-[1.5rem] overflow-hidden bg-[#1a1a1a]">
                <button onClick={handleDecrease} className="px-6 py-4 hover:bg-white/10 transition-colors">
                  <FiMinus />
                </button>
                <span className="px-6 py-2 text-2xl font-black min-w-[60px] text-center">{quantity}</span>
                <button onClick={handleIncrease} className="px-6 py-4 hover:bg-white/10 transition-colors">
                  <FiPlus />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-8">
            <button
              onClick={() => handleAddToCart(true)}
              style={{ backgroundColor: bgColor }}
              className="flex-1 min-w-[150px] text-black font-black py-4 px-6 rounded-[2rem] hover:opacity-80 transition-opacity text-sm sm:text-base uppercase tracking-widest flex items-center justify-center gap-3"
            >
              <FiShoppingCart className="text-xl" /> Add to Cart
            </button>

            <button
              onClick={handleOrderNow}
              className="flex-1 min-w-[150px] border-2 border-white text-white font-black py-4 px-6 rounded-[2rem] hover:bg-white hover:text-black transition-colors text-sm sm:text-base uppercase tracking-widest flex items-center justify-center gap-3"
            >
              <FiCreditCard className="text-xl" /> Order Now
            </button>

            <button
              onClick={handleWishlist}
              className="p-4 px-6 border border-white/10 rounded-[2rem] hover:bg-pink-500 hover:border-pink-500 hover:text-white text-2xl text-gray-400 transition-colors flex items-center justify-center"
              title="Add to Wishlist"
            >
              <FiHeart />
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-4 pt-6 border-t border-white/5">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-4 border-[#0a0a0a] bg-gradient-to-br from-gray-700 to-gray-900"
                />
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
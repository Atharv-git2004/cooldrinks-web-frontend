import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMinus, FiPlus, FiHeart, FiArrowLeft, FiShoppingCart } from "react-icons/fi";
import axios from "axios";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [quantity, setQuantity] = useState(1);

  // 💡 FIX 1: കാർട്ടിൽ നിന്ന് വരുന്ന ഡാറ്റ കൃത്യമായി എക്സ്ട്രാക്റ്റ് ചെയ്യുന്നു
  const getInitialProduct = () => {
    const item = location.state?.product;
    if (!item) return null;

    // കാർട്ടിലെ productId ഒരു ഒബ്ജക്റ്റ് ആണെങ്കിൽ (അതിലാണ് title, img ഒക്കെയുള്ളത്) അതെടുക്കുക
    if (item.productId && typeof item.productId === "object") {
      return item.productId;
    }
    // അല്ലെങ്കിൽ ആ കാർട്ട് ഐറ്റം തന്നെ പ്രൊഡക്റ്റ് ആയി ഉപയോഗിക്കുക
    return item;
  };

  const [product, setProduct] = useState(getInitialProduct());
  const [loading, setLoading] = useState(!product);
  const [error, setError] = useState(null);

  const API_BASE_URL = "https://cooldrinkbackend.onrender.com";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
        if (!response.ok) throw new Error(`Product not found`);
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        // ഡാറ്റ കൈയ്യിൽ ഉണ്ടെങ്കിൽ വെറുതെ എറർ കാണിക്കേണ്ട
        if (!product?.title) setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const currentId = product?._id || product?.id || product?.productId;
    if (!product || String(currentId) !== String(id)) {
      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [id, location.state]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-green-500 bg-[#0a0a0a] font-black uppercase italic">
        Loading...
      </div>
    );

  if (error && !product?.title)
    return (
      <div className="h-screen flex flex-col items-center justify-center text-white bg-[#0a0a0a]">
        <h1 className="text-4xl font-black mb-4">Product Not Found!</h1>
        <button onClick={() => navigate(-1)} className="text-green-500 underline">
          Go Back
        </button>
      </div>
    );

  // 🟢 IMAGE FIX
  const getProductImage = (prod) => {
    if (!prod) return "/placeholder.png";

    const img = prod.img || prod.bottleImage || prod.displayImage;
    const title = (prod.title || "").toLowerCase();

    // ഹാർഡ്‌കോഡ് ചെയ്ത ബാക്കപ്പുകൾ
    if (title.includes("sprite")) return "https://m.media-amazon.com/images/I/51v8nyxSOYL._SL1500_.jpg";
    if (title.includes("fanta")) return "https://m.media-amazon.com/images/I/61b7l5x0YcL._SL1500_.jpg";
    if (title.includes("welch")) return "https://m.media-amazon.com/images/I/81I-u8sI+ML._SL1500_.jpg";

    if (!img) return "/placeholder.png";

    let imageUrl = typeof img === "string" ? img : String(img);

    if (imageUrl.startsWith("http") || imageUrl.startsWith("data:")) {
      return imageUrl.replace("http://", "https://");
    }

    if (imageUrl.includes("uploads/")) {
      const cleanPath = imageUrl.replace(/^\//, "");
      return `${API_BASE_URL}/${cleanPath}`;
    }

    if (!imageUrl.startsWith("/drinks/")) {
      return `/drinks/${imageUrl}`;
    }

    return imageUrl;
  };

  const productTitle = product?.title || "Premium Drink";
  const productPrice = Number(product?.price) || 99;
  const productImage = getProductImage(product);
  const bgColor = product?.bgColor || "#22c55e";

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = async (showAlert = true) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login!");
      navigate("/login");
      return;
    }

    try {
      const productId = product?._id || product?.id || product?.productId || id;
      const imagePath = product?.img || product?.bottleImage || product?.displayImage || "";

      const payload = {
        productId: productId,
        quantity: quantity,
        price: productPrice,
        title: productTitle,
        img: imagePath,
        bgColor: bgColor,
      };

      await axios.post(`${API_BASE_URL}/api/cart`, payload, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (showAlert) alert(`${productTitle} added to Cart! 🛒`);
    } catch (err) {
      console.error("Cart Error:", err);
      alert(err.response?.data?.message || "Failed to add to cart.");
    }
  };

  const handleWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const productId = product?._id || product?.id || product?.productId || id;
      await axios.post(
        `${API_BASE_URL}/api/wishlist`,
        { productId },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );
      alert("Added to Wishlist! ❤️");
    } catch (err) {
      alert("Failed to add to wishlist");
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto min-h-screen text-white">
      <button
        onClick={() => navigate(-1)}
        className="mb-12 flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors font-bold uppercase text-xs tracking-[0.2em]"
      >
        <FiArrowLeft /> Back
      </button>

      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div className="relative flex justify-center items-center bg-[#111111] border border-white/5 rounded-[60px] p-10 group">
          <div className="absolute w-48 h-48 blur-[60px] rounded-full opacity-30" style={{ backgroundColor: bgColor }} />
          <img
            src={productImage}
            alt={productTitle}
            onError={(e) => {
              e.target.src = "/placeholder.png";
            }}
            className="h-[400px] md:h-[550px] object-contain drop-shadow-2xl z-10"
          />
        </motion.div>

        <motion.div className="space-y-8">
          <div>
            <span className="font-black uppercase text-xs tracking-[0.3em] block" style={{ color: bgColor }}>
              {product?.tagline || "Pure Refreshment"}
            </span>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter">{productTitle}</h1>
            <h3 className="text-xl md:text-2xl font-bold text-gray-400 italic">{product?.subtitle || "Premium Drink"}</h3>
          </div>

          <p className="text-gray-400 text-lg max-w-md">
            {product?.description || "Experience the intense burst of refreshment."}
          </p>

          <div className="flex flex-wrap items-end gap-12 pt-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">Price</span>
              <span className="text-5xl font-black" style={{ color: bgColor }}>
                ₹{productPrice}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">Quantity</span>
              <div className="flex items-center border border-white/10 rounded-[1.5rem] bg-[#1a1a1a]">
                <button onClick={handleDecrease} className="px-6 py-4 hover:bg-white/10">
                  <FiMinus />
                </button>
                <span className="px-6 py-2 text-2xl font-black">{quantity}</span>
                <button onClick={handleIncrease} className="px-6 py-4 hover:bg-white/10">
                  <FiPlus />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-8">
            <button
              onClick={() => handleAddToCart(true)}
              style={{ backgroundColor: bgColor }}
              className="flex-1 text-black font-black py-4 px-6 rounded-[2rem] uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
            >
              <FiShoppingCart /> Add to Cart
            </button>
            <button
              onClick={() => {
                handleAddToCart(false);
                navigate("/checkout");
              }}
              className="flex-1 border-2 border-white text-white font-black py-4 px-6 rounded-[2rem] uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
            >
              Order Now
            </button>
            <button
              onClick={handleWishlist}
              className="p-4 px-6 border border-white/10 rounded-[2rem] text-2xl text-gray-400 hover:text-pink-500 hover:border-pink-500 transition-colors"
            >
              <FiHeart />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;

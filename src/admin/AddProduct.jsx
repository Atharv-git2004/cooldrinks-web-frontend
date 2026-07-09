import React, { useState } from "react";
import { FiPlusCircle, FiTag, FiDollarSign, FiImage, FiLoader, FiAlignLeft, FiType, FiAperture } from "react-icons/fi";
import axios from "axios";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    tagline: "",
    title: "",
    subtitle: "",
    description: "",
    price: "",
    originalPrice: "",
    img: "",
    bgColor: "#008B47",
    accentColor: "#FFFFFF",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Input ഫീൽഡുകളിലെ മാറ്റങ്ങൾ ട്രാക്ക് ചെയ്യാൻ
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ഫോം സബ്മിറ്റ് ചെയ്യുമ്പോൾ ബാക്കെൻഡിലേക്ക് ഡാറ്റ അയക്കാൻ
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // പ്രൈസ് നമ്പർ ആണെന്ന് ഉറപ്പുവരുത്തുക (originalPrice ഇല്ലെങ്കിൽ ഒഴിവാക്കാൻ)
    const productData = {
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/products", productData);

      setMessage({ type: "success", text: `${formData.title} successfully added to core inventory!` });

      // ഫോം റീസെറ്റ് ചെയ്യാൻ
      setFormData({
        tagline: "",
        title: "",
        subtitle: "",
        description: "",
        price: "",
        originalPrice: "",
        img: "",
        bgColor: "#008B47",
        accentColor: "#FFFFFF",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to sync with server. Check database connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 p-6 md:p-10 rounded-[40px] border border-white/10 backdrop-blur-xl text-white font-sans max-w-3xl mx-auto">
      {/* Top Header */}
      <div className="mb-10">
        <h2 className="text-4xl font-black italic uppercase text-green-500 tracking-tighter flex items-center gap-3">
          <FiPlusCircle className="text-3xl" /> Add New Flavor
        </h2>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Deploy New Product into Subsystem</p>
      </div>

      {/* Alert Messages */}
      {message.text && (
        <div
          className={`p-4 mb-6 rounded-2xl border text-xs font-bold uppercase tracking-wider text-center ${
            message.type === "success"
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Title - Full Width */}
        <div className="space-y-2">
          <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black block pl-2">
            Product Title (Required)
          </label>
          <div className="relative flex items-center">
            <FiTag className="absolute left-4 text-gray-500 text-lg" />
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="E.G. SPRITE"
              required
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 text-sm font-bold uppercase tracking-wide focus:outline-none focus:border-green-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Tagline & Subtitle - Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black block pl-2">
              Tagline (Badge Text)
            </label>
            <div className="relative flex items-center">
              <FiType className="absolute left-4 text-gray-500 text-lg" />
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="E.G. PURE REFRESHMENT"
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 text-xs font-bold uppercase tracking-wide focus:outline-none focus:border-green-500/50 transition-colors"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black block pl-2">Subtitle</label>
            <div className="relative flex items-center">
              <FiType className="absolute left-4 text-gray-500 text-lg" />
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="E.G. Premium Flavor"
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 text-xs font-medium focus:outline-none focus:border-green-500/50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Description Textarea */}
        <div className="space-y-2">
          <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black block pl-2">Description</label>
          <div className="relative flex items-start">
            <FiAlignLeft className="absolute left-4 top-4 text-gray-500 text-lg" />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product details here..."
              rows="3"
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 text-xs focus:outline-none focus:border-green-500/50 transition-colors resize-none"
            ></textarea>
          </div>
        </div>

        {/* Prices - Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black block pl-2">
              Selling Price (Required)
            </label>
            <div className="relative flex items-center">
              <FiDollarSign className="absolute left-4 text-gray-500 text-lg" />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="99"
                required
                min="0"
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 text-sm font-mono font-bold focus:outline-none focus:border-green-500/50 transition-colors"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black block pl-2">
              Original Price (MRP)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-gray-500 font-mono font-bold text-sm">₹</span>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                placeholder="120"
                min="0"
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-gray-400 placeholder-gray-600 text-sm font-mono focus:outline-none focus:border-green-500/50 transition-colors line-through"
              />
            </div>
          </div>
        </div>

        {/* Colors - Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black block pl-2">
              Background Color (Hex)
            </label>
            <div className="relative flex items-center">
              <div
                className="absolute left-4 w-5 h-5 rounded-full border border-white/20"
                style={{ backgroundColor: formData.bgColor }}
              ></div>
              <input
                type="text"
                name="bgColor"
                value={formData.bgColor}
                onChange={handleChange}
                placeholder="#008B47"
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 text-xs font-mono uppercase focus:outline-none focus:border-green-500/50 transition-colors"
              />
              <input
                type="color"
                name="bgColor"
                value={formData.bgColor}
                onChange={handleChange}
                className="absolute right-4 w-6 h-6 opacity-0 cursor-pointer"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black block pl-2">
              Accent/Button Color (Hex)
            </label>
            <div className="relative flex items-center">
              <div
                className="absolute left-4 w-5 h-5 rounded-full border border-white/20"
                style={{ backgroundColor: formData.accentColor }}
              ></div>
              <input
                type="text"
                name="accentColor"
                value={formData.accentColor}
                onChange={handleChange}
                placeholder="#FFFFFF"
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 text-xs font-mono uppercase focus:outline-none focus:border-green-500/50 transition-colors"
              />
              <input
                type="color"
                name="accentColor"
                value={formData.accentColor}
                onChange={handleChange}
                className="absolute right-4 w-6 h-6 opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Product Image URL Input */}
        <div className="space-y-2">
          <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black block pl-2">
            Product Image URL
          </label>
          <div className="relative flex items-center">
            <FiImage className="absolute left-4 text-gray-500 text-lg" />
            <input
              type="text"
              name="img"
              value={formData.img}
              onChange={handleChange}
              placeholder="https://example.com/sprite-can.png"
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 text-xs font-medium focus:outline-none focus:border-green-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Image Preview Box */}
        {formData.img && (
          <div className="mt-4 p-4 bg-black/20 border border-white/5 rounded-2xl flex flex-col items-center justify-center">
            <p className="text-[9px] text-gray-600 uppercase tracking-widest font-bold mb-2">Live Canvas Preview</p>
            <div className="w-28 h-28 bg-white/5 rounded-xl border border-white/10 p-2 flex items-center justify-center overflow-hidden">
              <img
                src={formData.img}
                alt="Preview"
                className="w-full h-full object-contain drop-shadow-[0_10px_15px_rgba(34,197,94,0.2)]"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-green-400 transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] mt-8"
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin text-lg" /> Injecting Data...
            </>
          ) : (
            <>
              <FiPlusCircle className="text-lg" /> Add Product to Database
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

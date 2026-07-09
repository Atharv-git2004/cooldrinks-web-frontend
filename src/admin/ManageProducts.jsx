import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiRefreshCw, FiX, FiUpload } from "react-icons/fi";
import axios from "axios";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit State Management
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    tagline: "",
    title: "",
    subtitle: "",
    description: "",
    price: "",
    originalPrice: "",
    bgColor: "",
    accentColor: "",
  });
  const [editImage, setEditImage] = useState(null);

  const API_BASE_URL = "http://localhost:5000";

  // 1. Fetch all products from the backend
  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(Array.isArray(response.data) ? response.data : response.data.products || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load inventory. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Delete a product from inventory
  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete ${title}?`)) {
      try {
        await axios.delete(`${API_BASE_URL}/api/products/${id}`);
        setProducts(products.filter((item) => item._id !== id));
        alert(`${title} removed from inventory.`);
      } catch (err) {
        console.error("Error deleting product:", err);
        alert("Failed to delete the product.");
      }
    }
  };

  // 3. Open Edit Modal and fill existing details
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditForm({
      tagline: product.tagline || "",
      title: product.title || "",
      subtitle: product.subtitle || "",
      description: product.description || "",
      price: product.price || "",
      originalPrice: product.originalPrice || "",
      bgColor: product.bgColor || "",
      accentColor: product.accentColor || "",
    });
    setEditImage(null);
  };

  // 4. Handle Edit Form submission with Multi-part data (Multer upload setup)
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("tagline", editForm.tagline);
      formData.append("title", editForm.title);
      formData.append("subtitle", editForm.subtitle);
      formData.append("description", editForm.description);
      formData.append("price", editForm.price);
      formData.append("originalPrice", editForm.originalPrice);
      formData.append("bgColor", editForm.bgColor);
      formData.append("accentColor", editForm.accentColor);

      if (editImage) {
        formData.append("image", editImage);
      }

      const response = await axios.put(`${API_BASE_URL}/api/products/${editingProduct._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product updated successfully! 🎉");

      // Update local state grid smoothly without full page refresh
      setProducts(products.map((p) => (p._id === editingProduct._id ? response.data.product : p)));
      setEditingProduct(null);
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Failed to update product details.");
    }
  };

  // Helper function to resolve dynamic static or uploaded images safely
  const getProductImage = (img) => {
    if (!img) return "/placeholder.png";
    if (img.startsWith("http") || img.startsWith("/") || img.startsWith("data:")) {
      return img;
    }
    return `${API_BASE_URL}/uploads/${img}`;
  };

  return (
    <div className="bg-white/5 p-6 md:p-10 rounded-[40px] border border-white/10 backdrop-blur-xl text-white font-sans relative">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h2 className="text-4xl font-black italic uppercase text-green-500 tracking-tighter">Manage Inventory</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Live Stock & Control</p>
        </div>
        <button
          onClick={fetchProducts}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase hover:bg-white/10 transition-all active:scale-95"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} /> Refresh Stock
        </button>
      </div>

      {/* Error Message Display */}
      {error && (
        <div className="p-4 mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-center text-xs font-bold uppercase tracking-wider">
          {error}
        </div>
      )}

      {/* Loading & Table Section */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-500 italic text-sm">
          <div className="w-8 h-8 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
          <span>Synchronizing Grid...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-sm uppercase font-bold tracking-widest">
          No Flavors Found In Database.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[500px]">
            <thead>
              <tr className="text-gray-500 uppercase text-[10px] tracking-widest border-b border-white/10">
                <th className="pb-4">Image</th>
                <th className="pb-4">Product Flavor</th>
                <th className="pb-4">Price</th>
                <th className="pb-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((item) => (
                <tr key={item._id || item.id} className="hover:bg-white/[0.02] transition-colors group">
                  {/* Product Image */}
                  <td className="py-4">
                    <div className="w-12 h-12 bg-black/40 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center">
                      <img
                        src={getProductImage(item.img)}
                        alt={item.title}
                        onError={(e) => {
                          e.target.src = "/placeholder.png";
                        }}
                        className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </td>

                  {/* Product Title */}
                  <td className="py-4 font-black italic text-lg uppercase tracking-tight text-white group-hover:text-green-400 transition-colors">
                    {item.title}
                  </td>

                  {/* Product Price */}
                  <td className="py-4 text-green-500 font-bold text-sm">₹{item.price}</td>

                  {/* Action Buttons */}
                  <td className="py-4 text-right space-x-2">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="p-3 bg-white/5 text-gray-400 rounded-xl hover:text-green-500 hover:bg-green-500/10 transition-all active:scale-95"
                    >
                      <FiEdit2 className="text-sm" />
                    </button>

                    <button
                      onClick={() => handleDelete(item._id || item.id, item.title)}
                      className="p-3 bg-white/5 text-gray-400 rounded-xl hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-95"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Premium Glassmorphic Edit Modal overlay */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#111111] border border-white/10 w-full max-w-2xl rounded-[30px] p-6 md:p-8 text-white relative shadow-2xl my-8">
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute top-6 right-6 p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            >
              <FiX className="text-lg" />
            </button>

            <h3 className="text-2xl font-black uppercase italic tracking-tight text-green-500 mb-6">
              Modify Variant Profile
            </h3>

            <form onSubmit={handleUpdateSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={editForm.tagline}
                    onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={editForm.subtitle}
                    onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1">
                      Original Price
                    </label>
                    <input
                      type="number"
                      value={editForm.originalPrice}
                      onChange={(e) => setEditForm({ ...editForm, originalPrice: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1">
                    Background Hex Color
                  </label>
                  <input
                    type="text"
                    placeholder="#22c55e"
                    value={editForm.bgColor}
                    onChange={(e) => setEditForm({ ...editForm, bgColor: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1">
                    Accent Hex Color
                  </label>
                  <input
                    type="text"
                    placeholder="#15803d"
                    value={editForm.accentColor}
                    onChange={(e) => setEditForm({ ...editForm, accentColor: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-gray-500 mb-2">
                  Update Product Image File
                </label>
                <div className="relative border border-dashed border-white/20 rounded-xl p-4 bg-white/5 hover:bg-white/10 transition-colors flex flex-col items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditImage(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <FiUpload className="text-xl text-gray-400 mb-1" />
                  <span className="text-xs text-gray-400">
                    {editImage ? editImage.name : "Click to choose a fresh file profile"}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-black uppercase tracking-widest rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-500 text-black hover:bg-green-400 text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-xl"
                >
                  Commit Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;

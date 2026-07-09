import React, { useState, useEffect } from "react";
import { FiUpload, FiEye, FiCheck, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import axios from "axios";

const HomeManager = () => {
  const [homeData, setHomeData] = useState({
    mainTitle: "",
    subTitle: "",
    description: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  // New state variables for managing multiple items
  const [carouselItems, setCarouselItems] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const API_URL = "http://localhost:5000/api/home";

  const formatImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;

    let cleanPath = imagePath.replace(/\\/g, "/");
    const fileName = cleanPath.split("/").pop();
    const encodedFileName = encodeURIComponent(fileName);
    return `http://localhost:5000/uploads/${encodedFileName}`;
  };

  // Fetch all existing slides on load
  const fetchHomeData = async () => {
    try {
      const response = await axios.get(`${API_URL}/get`);
      if (response.data) {
        setCarouselItems(response.data);
      }
    } catch (error) {
      console.error("Error fetching home data:", error);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHomeData({ ...homeData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    const formData = new FormData();
    if (editingId) {
      formData.append("id", editingId);
    }
    formData.append("mainTitle", homeData.mainTitle);
    formData.append("subTitle", homeData.subTitle);
    formData.append("description", homeData.description);

    if (homeData.image) {
      formData.append("image", homeData.image);
    }

    try {
      const response = await axios.post(`${API_URL}/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStatus({
        type: "success",
        message: editingId ? "Slide updated successfully!" : "New slide added successfully!",
      });

      resetForm();
      fetchHomeData(); // Refresh list
    } catch (err) {
      console.error("Error updating content:", err);
      const serverMessage = err.response?.data?.message || err.message;
      setStatus({ type: "error", message: `Failed: ${serverMessage}` });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus({ type: "", message: "" }), 5000);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setHomeData({
      mainTitle: item.mainTitle || "",
      subTitle: item.subTitle || "",
      description: item.description || "",
      image: null,
    });
    setPreview(formatImageUrl(item.imageUrl));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slide?")) return;

    try {
      await axios.delete(`${API_URL}/delete/${id}`);
      setCarouselItems((prev) => prev.filter((item) => item._id !== id));
      if (editingId === id) resetForm();
    } catch (err) {
      console.error("Error deleting content:", err);
      alert("Failed to delete slide.");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setHomeData({ mainTitle: "", subTitle: "", description: "", image: null });
    setPreview(null);
    const fileInput = document.getElementById("file-upload");
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="max-w-6xl mx-auto text-white font-sans pb-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-black italic uppercase text-green-500 tracking-tighter">Home Page Manager</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">
            {editingId ? "Edit Existing Slide" : "Add New Hero Section Content"}
          </p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold uppercase hover:bg-white/10 transition-all active:scale-95">
            <FiEye /> Preview Site
          </button>
        </div>
      </div>

      {/* Editor & Preview Grid */}
      <div className="grid lg:grid-cols-2 gap-10 mb-16">
        {/* Form */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] backdrop-blur-xl space-y-6">
          <form onSubmit={handleUpdate} className="space-y-6">
            {status.message && (
              <div
                className={`p-4 rounded-2xl text-center text-xs font-bold uppercase tracking-wider border ${
                  status.type === "success"
                    ? "bg-green-500/10 border-green-500/30 text-green-400"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}
              >
                {status.message}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-green-500 mb-3">
                Main Heading
              </label>
              <input
                type="text"
                required
                value={homeData.mainTitle}
                className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl focus:border-green-500 outline-none transition-all font-black uppercase italic text-xl"
                onChange={(e) => setHomeData({ ...homeData, mainTitle: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-green-500 mb-3">
                Sub Heading
              </label>
              <input
                type="text"
                required
                value={homeData.subTitle}
                className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl focus:border-green-500 outline-none transition-all font-bold"
                onChange={(e) => setHomeData({ ...homeData, subTitle: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-green-500 mb-3">
                Description
              </label>
              <textarea
                rows="4"
                required
                value={homeData.description}
                className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl focus:border-green-500 outline-none transition-all text-gray-400 leading-relaxed text-sm"
                onChange={(e) => setHomeData({ ...homeData, description: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-green-500 mb-3">
                Featured Image
              </label>
              <div className="relative">
                <input type="file" id="file-upload" accept="image/*" className="hidden" onChange={handleImageChange} />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 bg-black/40 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-green-500/50 hover:bg-green-500/5 transition-all"
                >
                  <FiUpload className="text-2xl mb-2 text-gray-500" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    {homeData.image ? homeData.image.name : "Click to upload image"}
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-500 text-black font-black py-5 rounded-3xl hover:bg-green-400 transition-all uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-green-900/20 active:scale-98 disabled:opacity-50"
              >
                <FiCheck className="text-xl" /> {loading ? "Saving..." : editingId ? "Update Slide" : "Save to Slider"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 bg-white/5 text-gray-400 font-black rounded-3xl hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <FiX className="text-xl" /> Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Live Preview */}
        <div className="relative bg-green-600 rounded-[40px] overflow-hidden flex flex-col items-center justify-center p-10 transition-transform duration-500">
          <div className="absolute top-6 left-10 text-[8px] font-black uppercase tracking-[0.4em] text-white/40">
            Live Preview
          </div>

          <div className="text-center z-10">
            <h1 className="text-6xl font-black italic uppercase leading-none mb-2 break-all px-4">
              {homeData.mainTitle || "TITLE"}
            </h1>
            <p className="text-sm font-bold uppercase tracking-widest mb-4 opacity-80">{homeData.subTitle || "SUBTITLE"}</p>
            <p className="text-[10px] max-w-[250px] mx-auto opacity-60 leading-relaxed">
              {homeData.description || "Description goes here..."}
            </p>
          </div>

          <div className="h-64 mt-6 relative z-10 drop-shadow-2xl flex items-center justify-center">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-full object-contain transform rotate-12 hover:rotate-0 transition-transform duration-500"
              />
            ) : (
              <div className="h-full w-32 bg-white/10 rounded-3xl border border-white/20 flex items-center justify-center italic text-[10px] opacity-40 uppercase">
                No Image
              </div>
            )}
          </div>

          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none overflow-hidden">
            <h1 className="text-[120px] font-black uppercase tracking-tighter italic select-none">
              {homeData.mainTitle || "TITLE"}
            </h1>
          </div>
        </div>
      </div>

      {/* Manage Existing Slides Section */}
      <div>
        <h3 className="text-2xl font-black italic uppercase text-white mb-6 border-b border-white/10 pb-4">
          Manage Existing Slides ({carouselItems.length})
        </h3>

        {carouselItems.length === 0 ? (
          <div className="text-center py-10 bg-white/5 rounded-3xl text-gray-500 font-bold uppercase text-sm tracking-widest border border-white/5">
            No slides available. Add one above.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carouselItems.map((item) => (
              <div
                key={item._id}
                className="bg-white/5 border border-white/10 p-5 rounded-3xl flex flex-col items-center text-center relative group hover:border-green-500/50 transition-all duration-300"
              >
                <div className="h-32 w-full flex justify-center items-center mb-4 bg-black/30 rounded-2xl p-2">
                  {item.imageUrl ? (
                    <img
                      src={formatImageUrl(item.imageUrl)}
                      alt={item.mainTitle}
                      className="h-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-xs text-gray-500 uppercase tracking-widest">No Image</span>
                  )}
                </div>

                <h4 className="text-xl font-black italic uppercase text-white">{item.mainTitle}</h4>
                <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest mt-1 mb-6">{item.subTitle}</p>

                <div className="flex gap-3 w-full mt-auto">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 py-3 bg-white/10 text-white hover:bg-green-500 hover:text-black rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all"
                  >
                    <FiEdit2 /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex-1 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeManager;

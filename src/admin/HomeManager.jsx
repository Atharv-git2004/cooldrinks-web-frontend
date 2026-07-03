import React, { useState } from 'react';
import { FiUpload, FiEye, FiCheck } from 'react-icons/fi';
// നിന്റെ API പാത്ത് അനുസരിച്ച് ഇംപോർട്ട് ചെയ്യുക
// import { updateHomeContentAPI } from '../../api/userApi'; 

const HomeManager = () => {
  const [homeData, setHomeData] = useState({
    mainTitle: "SPRITE",
    subTitle: "LEMON LIME REFRESHMENT",
    description: "Experience the ultimate thirst-quencher with the crisp, clean taste of Sprite.",
    image: null
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

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
    setStatus({ type: '', message: '' });

    // ഇമേജ് ഫയൽ ഉള്ളതുകൊണ്ട് FormData ഉപയോഗിക്കുന്നു
    const formData = new FormData();
    formData.append('mainTitle', homeData.mainTitle);
    formData.append('subTitle', homeData.subTitle);
    formData.append('description', homeData.description);
    if (homeData.image) {
      formData.append('image', homeData.image);
    }

    try {
      // ഇവിടെ ബാക്കെൻഡ് API കോൾ ചെയ്യാം
      // const data = await updateHomeContentAPI(formData);
      
      console.log("Updating Home Page with FormData:", homeData);
      setStatus({ type: 'success', message: 'Hero section updated successfully!' });
      alert("Home Page Updated Successfully!");
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to update content.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto text-white font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-black italic uppercase text-green-500 tracking-tighter">Home Page Manager</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">Edit Hero Section Content</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold uppercase hover:bg-white/10 transition-all active:scale-95">
            <FiEye /> Preview Site
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        
        {/* Form Section (Framer Motion Removed) */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] backdrop-blur-xl space-y-6">
          <form onSubmit={handleUpdate} className="space-y-6">
            
            {/* Status Alert */}
            {status.message && (
              <div className={`p-4 rounded-2xl text-center text-xs font-bold uppercase tracking-wider border ${
                status.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}>
                {status.message}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-green-500 mb-3">Main Heading (e.g. SPRITE)</label>
              <input 
                type="text" 
                required
                value={homeData.mainTitle}
                className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl focus:border-green-500 outline-none transition-all font-black uppercase italic text-xl"
                onChange={(e) => setHomeData({...homeData, mainTitle: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-green-500 mb-3">Sub Heading</label>
              <input 
                type="text" 
                required
                value={homeData.subTitle}
                className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl focus:border-green-500 outline-none transition-all font-bold"
                onChange={(e) => setHomeData({...homeData, subTitle: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-green-500 mb-3">Description</label>
              <textarea 
                rows="4"
                required
                value={homeData.description}
                className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl focus:border-green-500 outline-none transition-all text-gray-400 leading-relaxed text-sm"
                onChange={(e) => setHomeData({...homeData, description: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-green-500 mb-3">Featured Product Image (Can/Bottle)</label>
              <div className="relative">
                <input 
                  type="file" 
                  id="file-upload"
                  accept="image/*"
                  className="hidden" 
                  onChange={handleImageChange}
                />
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

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-green-500 text-black font-black py-5 rounded-3xl hover:bg-green-400 transition-all uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-green-900/20 active:scale-98 disabled:opacity-50"
            >
              <FiCheck className="text-xl" /> {loading ? "Updating..." : "Update Hero Section"}
            </button>
          </form>
        </div>

        {/* Live Preview Section (Framer Motion Animations Changed to Tailwind Transitions) */}
        <div className="relative bg-green-600 rounded-[40px] overflow-hidden flex flex-col items-center justify-center p-10 transition-transform duration-500">
          <div className="absolute top-6 left-10 text-[8px] font-black uppercase tracking-[0.4em] text-white/40">Live Preview</div>
          
          <div className="text-center z-10">
            <h1 className="text-6xl font-black italic uppercase leading-none mb-2 break-all px-4">{homeData.mainTitle}</h1>
            <p className="text-sm font-bold uppercase tracking-widest mb-4 opacity-80">{homeData.subTitle}</p>
            <p className="text-[10px] max-w-[250px] mx-auto opacity-60 leading-relaxed">{homeData.description}</p>
          </div>

          <div className="h-64 mt-6 relative z-10 drop-shadow-2xl flex items-center justify-center">
            {preview ? (
              <img 
                src={preview} 
                alt="Preview" 
                className="h-full object-contain transform rotate-12 hover:rotate-0 transition-transform duration-500" 
              />
            ) : (
              <div className="h-full w-32 bg-white/10 rounded-3xl border border-white/20 flex items-center justify-center italic text-[10px] opacity-40 uppercase">No Image</div>
            )}
          </div>

          {/* Background Decorative Text */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none overflow-hidden">
            <h1 className="text-[120px] font-black uppercase tracking-tighter italic select-none">{homeData.mainTitle}</h1>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomeManager;
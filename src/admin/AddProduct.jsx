import React, { useState } from 'react';
import { FiPlusCircle, FiZap, FiCheckCircle } from 'react-icons/fi';
// ഇവിടെ നിന്റെ കറക്റ്റ് API പാത്ത് അനുസരിച്ച് ഇംപോർട്ട് ചെയ്യുക (e.g., ../../api/productApi)
import { addProductAPI } from '../../api/userApi'; 

const AddProduct = () => {
  const [product, setProduct] = useState({ title: '', price: '', img: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    // പ്രൈസ് നമ്പർ ടൈപ്പ് ആണെന്ന് ഉറപ്പുവരുത്തുന്നു
    const productData = {
      ...product,
      price: Number(product.price)
    };

    try {
      // ബാക്കെൻഡിലേക്ക് ഡാറ്റ അയക്കുന്നു
      const data = await addProductAPI(productData);
      
      if (data.success || data) {
        setStatus({ type: 'success', message: 'New flavor successfully added to the grid!' });
        // ഫോം ഫീൽഡുകൾ ക്ലിയർ ചെയ്യുന്നു
        setProduct({ title: '', price: '', img: '' });
      }
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to inject new flavor. Check backend.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white/5 p-8 md:p-12 rounded-[40px] border border-white/10 backdrop-blur-xl shadow-2xl text-white">
      
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-green-500 rounded-2xl text-black shadow-lg shadow-green-500/30">
          <FiPlusCircle className="text-2xl" />
        </div>
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tight text-green-500">Add New Flavor</h2>
          <p className="text-[10px] uppercase tracking-widest text-gray-500">Product Laboratory</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Status Message */}
        {status.message && (
          <div className={`p-4 rounded-2xl text-center text-xs font-bold uppercase tracking-wider border ${
            status.type === 'success' 
              ? 'bg-green-500/10 border-green-500/30 text-green-400' 
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            {status.message}
          </div>
        )}

        {/* Flavor Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Flavor Name</label>
          <input 
            type="text" 
            required
            className="w-full bg-black/40 border border-white/10 p-4 pl-5 rounded-2xl focus:border-green-500 outline-none transition-all text-sm"
            placeholder="e.g. Blue Curacao / Strawberry Mint"
            value={product.title}
            onChange={(e) => setProduct({...product, title: e.target.value})}
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Price (₹)</label>
          <input 
            type="number" 
            required
            className="w-full bg-black/40 border border-white/10 p-4 pl-5 rounded-2xl focus:border-green-500 outline-none transition-all text-sm"
            placeholder="99"
            value={product.price}
            onChange={(e) => setProduct({...product, price: e.target.value})}
          />
        </div>

        {/* Image URL (തൽക്കാലം URL കൊടുക്കാം, അല്ലെങ്കിൽ ഫയൽ അപ്‌ലോഡ് ആക്കാം) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Product Image URL</label>
          <input 
            type="text" 
            required
            className="w-full bg-black/40 border border-white/10 p-4 pl-5 rounded-2xl focus:border-green-500 outline-none transition-all text-sm"
            placeholder="https://images.unsplash.com/..."
            value={product.img}
            onChange={(e) => setProduct({...product, img: e.target.value})}
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-green-500 text-black font-black py-5 rounded-3xl hover:bg-green-400 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-green-900/20 active:scale-98"
        >
          {loading ? (
            "Injecting Data..."
          ) : (
            <>Confirm & Add Item <FiZap /></>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
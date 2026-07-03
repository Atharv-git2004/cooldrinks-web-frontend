import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import axios from 'axios'; // നേരിട്ടോ അല്ലെങ്കിൽ നിന്റെ userApi വഴിയോ കോൾ ചെയ്യാം

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. ബാക്കെൻഡിൽ നിന്ന് പ്രോഡക്റ്റുകൾ ഫെച്ച് ചെയ്യാനുള്ള ഫംഗ്ഷൻ
  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      // നിന്റെ കറക്റ്റ് ബാക്കെൻഡ് URL ഇവിടെ നൽകുക
      const response = await axios.get('http://localhost:5000/api/products');
      // ബാക്കെൻഡ് റെസ്പോൺസ് അനുസരിച്ച് response.data അല്ലെങ്കിൽ response.data.products സെറ്റ് ചെയ്യുക
      setProducts(Array.isArray(response.data) ? response.data : response.data.products || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError('Failed to load inventory. Is backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. പ്രോഡക്റ്റ് ഡിലീറ്റ് ചെയ്യാനുള്ള ഫംഗ്ഷൻ
  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete ${title}?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        
        // ഡിലീറ്റ് ആയതിനു ശേഷം സ്റ്റേറ്റിൽ നിന്ന് ആ പ്രോഡക്റ്റ് ഒഴിവാക്കുന്നു (UI തനിയെ അപ്‌ഡേറ്റ് ആകും)
        setProducts(products.filter(item => item._id !== id));
        alert(`${title} removed from inventory.`);
      } catch (err) {
        console.error("Error deleting product:", err);
        alert('Failed to delete the product.');
      }
    }
  };

  return (
    <div className="bg-white/5 p-6 md:p-10 rounded-[40px] border border-white/10 backdrop-blur-xl text-white font-sans">
      
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
              {products.map(item => (
                // MongoDB-ൽ കറക്റ്റ് ID '_id' ആണ്, അതുകൊണ്ട് item._id വെച്ച് കീ കൊടുക്കുന്നു
                <tr key={item._id || item.id} className="hover:bg-white/[0.02] transition-colors group">
                  
                  {/* Product Image */}
                  <td className="py-4">
                    <div className="w-12 h-12 bg-black/40 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center">
                      {item.img ? (
                        <img src={item.img} alt={item.title} className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300" />
                      ) : (
                        <span className="text-[8px] text-gray-600 font-bold uppercase">No Img</span>
                      )}
                    </div>
                  </td>

                  {/* Product Title */}
                  <td className="py-4 font-black italic text-lg uppercase tracking-tight text-white group-hover:text-green-400 transition-colors">
                    {item.title}
                  </td>

                  {/* Product Price */}
                  <td className="py-4 text-green-500 font-bold text-sm">
                    ₹{item.price}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-4 text-right space-x-2">
                    {/* Edit Button (വേണ്ടി വന്നാൽ പിന്നീട് ലിങ്ക് ചെയ്യാം) */}
                    <button 
                      onClick={() => alert(`Edit Feature for ${item.title} can be connected to a modal/page.`)}
                      className="p-3 bg-white/5 text-gray-400 rounded-xl hover:text-green-500 hover:bg-green-500/10 transition-all active:scale-95"
                    >
                      <FiEdit2 className="text-sm" />
                    </button>
                    
                    {/* Delete Button */}
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
    </div>
  );
};

export default ManageProducts;
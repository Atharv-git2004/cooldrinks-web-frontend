import React, { useState, useEffect } from 'react';
import { FiDatabase, FiUsers, FiActivity, FiArrowUpRight, FiRefreshCw } from 'react-icons/fi';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalSales: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ചാർട്ടിൽ കാണിക്കാനുള്ള മോക്ക് സെയിൽസ് ഡാറ്റ (ബാക്കെൻഡ് ഉള്ളതനുസരിച്ച് ഇത് ഡൈനാമിക് ആക്കാം)
  const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4500 },
    { name: 'May', sales: 7000 },
    { name: 'Jun', sales: 8500 },
  ];

  // ബാക്കെൻഡിൽ നിന്ന് സ്റ്റാറ്റിസ്റ്റിക്സ് വിവരങ്ങൾ എടുക്കാനുള്ള ഫംഗ്ഷൻ
  const fetchDashboardStats = async () => {
    setLoading(true);
    setError('');
    try {
      // നിന്റെ ബാക്കെൻഡ് റൂട്ട് അനുസരിച്ച് ഈ URL മാറ്റാം (e.g., /api/admin/stats)
      const response = await axios.get('http://localhost:5000/api/admin/stats');
      setStats({
        totalProducts: response.data.totalProducts || 0,
        totalUsers: response.data.totalUsers || 0,
        totalSales: response.data.totalSales || 0,
      });
    } catch (err) {
      console.error("Dashboard Stats Fetch Error:", err);
      // ബാക്കെൻഡ് റൺ ചെയ്തിട്ടില്ലെങ്കിൽ തൽക്കാലം കാണാൻ ഡെമോ ഡാറ്റ സെറ്റ് ചെയ്യുന്നു
      setStats({ totalProducts: 12, totalUsers: 48, totalSales: 24500 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <div className="space-y-8 text-white font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-4xl font-black italic uppercase text-green-500 tracking-tighter">Command Center</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Real-time Metrics & Analytics</p>
        </div>
        <button 
          onClick={fetchDashboardStats}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase hover:bg-white/10 transition-all active:scale-95"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} /> Reload Metrics
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-center text-xs font-bold uppercase tracking-wider">
          {error}
        </div>
      )}

      {/* 3 Stats Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Products Card */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] backdrop-blur-xl flex items-center justify-between group hover:border-green-500/30 transition-all">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Active Grid Stock</span>
            <h3 className="text-3xl font-black italic">{loading ? "..." : stats.totalProducts} Items</h3>
          </div>
          <div className="p-4 bg-green-500/10 text-green-400 rounded-2xl group-hover:bg-green-500 group-hover:text-black transition-all duration-300">
            <FiDatabase className="text-2xl" />
          </div>
        </div>

        {/* Total Users Card */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] backdrop-blur-xl flex items-center justify-between group hover:border-green-500/30 transition-all">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Synchronized Users</span>
            <h3 className="text-3xl font-black italic">{loading ? "..." : stats.totalUsers} Clients</h3>
          </div>
          <div className="p-4 bg-green-500/10 text-green-400 rounded-2xl group-hover:bg-green-500 group-hover:text-black transition-all duration-300">
            <FiUsers className="text-2xl" />
          </div>
        </div>

        {/* Total Revenue Card */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] backdrop-blur-xl flex items-center justify-between group hover:border-green-500/30 transition-all">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Gross Energy Sales</span>
            <h3 className="text-3xl font-black italic text-green-400">₹{loading ? "..." : stats.totalSales.toLocaleString()}</h3>
          </div>
          <div className="p-4 bg-green-500/10 text-green-400 rounded-2xl group-hover:bg-green-500 group-hover:text-black transition-all duration-300">
            <FiActivity className="text-2xl" />
          </div>
        </div>

      </div>

      {/* Analytics Chart & Recent Activity Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Sales Chart (Takes 2 Columns) */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 p-6 rounded-[40px] backdrop-blur-xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6 px-2">
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider text-gray-400">Sales Velocity</h4>
              <p className="text-[10px] text-gray-600 uppercase font-bold">Monthly performance index</p>
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
              +14.2% <FiArrowUpRight />
            </span>
          </div>

          {/* Area Chart Container */}
          <div className="w-full h-64 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#4b5563" tickLine={false} />
                <YAxis stroke="#4b5563" tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121212', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff' }}
                  itemStyle={{ color: '#22c55e' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Activity Logs (Takes 1 Column) */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-[40px] backdrop-blur-xl flex flex-col">
          <h4 className="text-sm font-black uppercase tracking-wider text-gray-400 mb-6 px-2">System Logs</h4>
          
          <div className="flex-grow space-y-4 overflow-y-auto pr-1 max-h-64 custom-scrollbar">
            
            <div className="flex gap-3 p-3 bg-white/[0.02] rounded-2xl border border-white/5">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5" />
              <div>
                <p className="text-xs font-bold">New Flavor Injected</p>
                <span className="text-[9px] text-gray-500 font-bold uppercase">"Blue Curacao" added &bull; 2m ago</span>
              </div>
            </div>

            <div className="flex gap-3 p-3 bg-white/[0.02] rounded-2xl border border-white/5">
              <div className="w-2 h-2 bg-cyan-500 rounded-full mt-1.5" />
              <div>
                <p className="text-xs font-bold">User Verified</p>
                <span className="text-[9px] text-gray-500 font-bold uppercase">Token generated for Client &bull; 15m ago</span>
              </div>
            </div>

            <div className="flex gap-3 p-3 bg-white/[0.02] rounded-2xl border border-white/5">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5" />
              <div>
                <p className="text-xs font-bold">System Refreshed</p>
                <span className="text-[9px] text-gray-500 font-bold uppercase">Inventory grid structural sync &bull; 1h ago</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
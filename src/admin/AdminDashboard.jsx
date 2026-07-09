import React, { useState, useEffect } from "react";
import { FiDatabase, FiUsers, FiActivity, FiArrowUpRight, FiRefreshCw } from "react-icons/fi";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalSales: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Chart data (This can also be made dynamic later if your backend tracks daily/monthly sales)
  const salesData = [
    { name: "Jan", sales: 4000 },
    { name: "Feb", sales: 3000 },
    { name: "Mar", sales: 5000 },
    { name: "Apr", sales: 4500 },
    { name: "May", sales: 7000 },
    { name: "Jun", sales: 8500 },
  ];

  // Base URL for your backend server
  const API_URL = "http://localhost:5000/api/admin/stats";

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError("");
    try {
      // If your admin routes require a login token, uncomment the configuration line below:
      // const token = localStorage.getItem("token");
      // const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await axios.get(API_URL);

      if (response.data) {
        setStats({
          totalProducts: Number(response.data.totalProducts) || 0,
          totalUsers: Number(response.data.totalUsers) || 0,
          totalSales: Number(response.data.totalSales) || 0,
        });
      }
    } catch (err) {
      console.error("Dashboard Stats Fetch Error:", err);
      setError(err.response?.data?.message || "Failed to connect to the live database server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <div className="space-y-8 text-white font-sans pb-10">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-4xl font-black italic uppercase text-green-500 tracking-tighter">Command Center</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Real-time Metrics & Analytics</p>
        </div>
        <button
          onClick={fetchDashboardStats}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} /> {loading ? "Syncing..." : "Reload Metrics"}
        </button>
      </div>

      {/* Live Error Alert Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-center text-xs font-bold uppercase tracking-wider">
          ⚠️ {error}
        </div>
      )}

      {/* 3 Stats Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Grid Stock */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] backdrop-blur-xl flex items-center justify-between group hover:border-green-500/30 transition-all">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Active Grid Stock</span>
            <h3 className="text-3xl font-black italic">
              {loading ? <span className="animate-pulse">...</span> : stats.totalProducts}
            </h3>
          </div>
          <div className="p-4 bg-green-500/10 text-green-400 rounded-2xl group-hover:bg-green-500 group-hover:text-black transition-all duration-300">
            <FiDatabase className="text-2xl" />
          </div>
        </div>

        {/* Synchronized Users */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] backdrop-blur-xl flex items-center justify-between group hover:border-green-500/30 transition-all">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Synchronized Users</span>
            <h3 className="text-3xl font-black italic">
              {loading ? <span className="animate-pulse">...</span> : stats.totalUsers}
            </h3>
          </div>
          <div className="p-4 bg-green-500/10 text-green-400 rounded-2xl group-hover:bg-green-500 group-hover:text-black transition-all duration-300">
            <FiUsers className="text-2xl" />
          </div>
        </div>

        {/* Gross Energy Sales */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] backdrop-blur-xl flex items-center justify-between group hover:border-green-500/30 transition-all">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Gross Energy Sales</span>
            <h3 className="text-3xl font-black italic text-green-400">
              {loading ? <span className="animate-pulse">...</span> : `₹${stats.totalSales.toLocaleString("en-IN")}`}
            </h3>
          </div>
          <div className="p-4 bg-green-500/10 text-green-400 rounded-2xl group-hover:bg-green-500 group-hover:text-black transition-all duration-300">
            <FiActivity className="text-2xl" />
          </div>
        </div>
      </div>

      {/* Analytics Chart & System Activities Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Area Chart Container */}
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

          <div className="w-full h-64 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#4b5563" tickLine={false} />
                <YAxis stroke="#4b5563" tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#121212",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#22c55e" }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#22c55e"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time System Log Sidebar UI */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-[40px] backdrop-blur-xl flex flex-col">
          <h4 className="text-sm font-black uppercase tracking-wider text-gray-400 mb-6 px-2">System Logs</h4>

          <div className="flex-grow space-y-4 overflow-y-auto pr-1 max-h-64 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <div className="flex gap-3 p-3 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/[0.05] transition-colors">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5" />
              <div>
                <p className="text-xs font-bold">New Flavor Injected</p>
                <span className="text-[9px] text-gray-500 font-bold uppercase">"Blue Curacao" added &bull; 2m ago</span>
              </div>
            </div>

            <div className="flex gap-3 p-3 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/[0.05] transition-colors">
              <div className="w-2 h-2 bg-cyan-500 rounded-full mt-1.5" />
              <div>
                <p className="text-xs font-bold">User Verified</p>
                <span className="text-[9px] text-gray-500 font-bold uppercase">
                  Token generated for Client &bull; 15m ago
                </span>
              </div>
            </div>

            <div className="flex gap-3 p-3 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/[0.05] transition-colors">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5" />
              <div>
                <p className="text-xs font-bold">System Refreshed</p>
                <span className="text-[9px] text-gray-500 font-bold uppercase">
                  Inventory grid structural sync &bull; 1h ago
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

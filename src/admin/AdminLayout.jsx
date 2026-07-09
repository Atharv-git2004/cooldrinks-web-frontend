import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FiGrid, FiPlusCircle, FiList, FiLogOut, FiEdit3, FiPackage } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  // നിലവിൽ ഏത് പേജിലാണോ നിൽക്കുന്നത് അതിനനുസരിച്ച് ലിങ്ക് ഹൈലൈറ്റ് ചെയ്യാൻ
  const isActive = (path) => location.pathname === path;

  // Logout കൈകാര്യം ചെയ്യുന്ന ഫംഗ്ഷൻ
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to exit Admin Panel?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Sidebar - Fixed to left */}
      <div className="w-64 bg-white/5 border-r border-white/10 p-6 flex flex-col fixed h-full z-40 backdrop-blur-md">
        <div className="mb-10">
          <h2 className="text-2xl font-black italic text-green-500 uppercase tracking-tighter">
            Arctic <span className="text-white">Core</span>
          </h2>
          <p className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-bold mt-1">Admin Subsystem</p>
        </div>

        <nav className="flex-grow space-y-2">
          {/* Dashboard Link */}
          <Link
            to="/admin"
            className={`flex items-center gap-3 p-4 rounded-2xl transition-all font-bold uppercase text-[10px] tracking-widest ${
              isActive("/admin")
                ? "bg-green-500 text-black shadow-lg shadow-green-500/20"
                : "hover:bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            <FiGrid className="text-lg" /> Dashboard
          </Link>

          {/* Home Manager Link */}
          <Link
            to="/admin/home"
            className={`flex items-center gap-3 p-4 rounded-2xl transition-all font-bold uppercase text-[10px] tracking-widest ${
              isActive("/admin/home")
                ? "bg-green-500 text-black shadow-lg shadow-green-500/20"
                : "hover:bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            <FiEdit3 className="text-lg" /> Home Manager
          </Link>

          {/* Add Flavor Link */}
          <Link
            to="/admin/add"
            className={`flex items-center gap-3 p-4 rounded-2xl transition-all font-bold uppercase text-[10px] tracking-widest ${
              isActive("/admin/add")
                ? "bg-green-500 text-black shadow-lg shadow-green-500/20"
                : "hover:bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            <FiPlusCircle className="text-lg" /> Add Flavor
          </Link>

          {/* Manage Items Link */}
          <Link
            to="/admin/manage"
            className={`flex items-center gap-3 p-4 rounded-2xl transition-all font-bold uppercase text-[10px] tracking-widest ${
              isActive("/admin/manage")
                ? "bg-green-500 text-black shadow-lg shadow-green-500/20"
                : "hover:bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            <FiList className="text-lg" /> Manage Items
          </Link>

          {/* Manage Orders Link */}
          <Link
            to="/admin/orders"
            className={`flex items-center gap-3 p-4 rounded-2xl transition-all font-bold uppercase text-[10px] tracking-widest ${
              isActive("/admin/orders")
                ? "bg-green-500 text-black shadow-lg shadow-green-500/20"
                : "hover:bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            <FiPackage className="text-lg" /> Manage Orders
          </Link>
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-4 text-red-500 font-bold uppercase text-[10px] tracking-widest border border-red-500/20 rounded-2xl hover:bg-red-500 hover:text-white transition-all mt-auto active:scale-95"
        >
          <FiLogOut className="text-lg" /> Logout
        </button>
      </div>

      {/* Main Content Area - ml-64 added to prevent sidebar overlap */}
      <div className="flex-grow ml-64 p-8 md:p-12 bg-gradient-to-br from-transparent to-green-500/5 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Sub-components ഇവിടെയാണ് റെൻഡർ ചെയ്യപ്പെടുക */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

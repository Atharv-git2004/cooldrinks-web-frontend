import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiSearch, FiShoppingCart, FiHeart, FiLogOut, FiUser, FiPackage } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // ഡൈനാമിക് ആയി കൗണ്ടുകൾ സൂക്ഷിക്കാൻ സ്റ്റേറ്റുകൾ സെറ്റ് ചെയ്യുന്നു
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // ബാക്കെൻഡിൽ നിന്നും കാർട്ട്/വിഷ്‌ലിസ്റ്റ് കൗണ്ട് എടുക്കാനുള്ള ഫംഗ്ഷൻ
  const fetchCounts = async () => {
    // യൂസർ ലോഗിൻ ചെയ്തിട്ടില്ലെങ്കിൽ കൗണ്ട് 0 ആക്കുക
    if (!user) {
      setCartCount(0);
      setWishlistCount(0);
      return;
    }

    // ലോക്കൽ സ്റ്റോറേജിൽ നിന്നും ടോക്കൺ എടുക്കുന്നു
    const token = localStorage.getItem("token");

    if (!token) {
      setCartCount(0);
      setWishlistCount(0);
      return;
    }

    try {
      // ബാക്കെൻഡിലേക്ക് ടോക്കൺ അയക്കാൻ config സെറ്റ് ചെയ്യുന്നു
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };

      // 🟢 http://localhost:5000 മാറ്റി വെറും റൂട്ടുകൾ മാത്രം നൽകുന്നു
      const [cartRes, wishlistRes] = await Promise.all([
        axios.get("/api/cart", config),
        axios.get("/api/wishlist", config),
      ]);

      // 🟢 ഡാറ്റ ഒബ്ജക്റ്റ് ആണെങ്കിലും അറേ ആണെങ്കിലും സുരക്ഷിതമായി നീളം (length) എടുക്കുന്നു
      const cartData = cartRes.data?.items || cartRes.data || [];
      const wishlistData = wishlistRes.data?.items || wishlistRes.data || [];

      setCartCount(cartData.length || 0);
      setWishlistCount(wishlistData.length || 0);
    } catch (error) {
      // ടോക്കൺ എക്സ്പയർ ആവുകയോ മറ്റോ ചെയ്താൽ കൗണ്ട് സീറോ ആക്കുന്നു
      if (error.response && error.response.status === 401) {
        setCartCount(0);
        setWishlistCount(0);
      } else {
        console.error("Error fetching counts:", error);
      }
    }
  };

  // ഓരോ തവണ പേജ് മാറുമ്പോഴും അല്ലെങ്കിൽ യൂസർ ലോഗിൻ/ലോഗൗട്ട് ചെയ്യുമ്പോഴും കൗണ്ട് പുതുക്കുന്നു
  useEffect(() => {
    fetchCounts();
  }, [location.pathname, user]);

  const handleLogout = () => {
    logout();
    // ലോഗൗട്ട് ചെയ്യുമ്പോൾ ലോക്കൽ സ്റ്റോറേജിലെ ടോക്കൺ ക്ലിയർ ചെയ്യുക
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // ലോഗൗട്ട് ചെയ്യുമ്പോൾ കൗണ്ടുകൾ ക്ലിയർ ചെയ്യുന്നു
    setCartCount(0);
    setWishlistCount(0);
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Flavors", path: "/flavors" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] px-4 py-6 lg:px-12 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-black/20 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full shadow-2xl pointer-events-auto">
        {/* Logo Section */}
        <Link to="/">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-green-400 to-green-700 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)]">
              <span className="text-white font-black text-xl italic underline decoration-yellow-400 decoration-2">S</span>
            </div>
            <h1 className="text-white font-black text-2xl tracking-tighter italic uppercase">
              Spri<span className="text-green-400">te</span>
            </h1>
          </motion.div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10 text-white/80 font-bold text-sm tracking-widest uppercase">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`hover:text-green-400 transition-all duration-300 relative group ${
                location.pathname === item.path ? "text-green-400" : ""
              }`}
            >
              {item.name}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-green-400 transition-all duration-300 ${
                  location.pathname === item.path ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
          ))}

          {/* Admin Dashboard Link */}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="text-yellow-400 hover:text-yellow-300 transition-colors font-black tracking-widest text-sm uppercase"
            >
              Admin
            </Link>
          )}
        </div>

        {/* Icons & Auth Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="text-white/70 hover:text-green-400 transition-colors text-xl p-2 hidden md:block">
            <FiSearch />
          </button>

          {/* Orders Link */}
          <Link
            to="/orders"
            className="relative p-2 text-white/70 hover:text-blue-400 transition-all duration-300 group hidden md:block"
            title="My Orders"
          >
            <FiPackage
              className={`text-xl group-hover:scale-110 transition-transform ${location.pathname === "/orders" ? "text-blue-400" : ""}`}
            />
          </Link>

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className="relative p-2 text-white/70 hover:text-pink-500 transition-all duration-300 group hidden md:block"
            title="Wishlist"
          >
            <FiHeart
              className={`text-xl group-hover:scale-110 transition-transform ${location.pathname === "/wishlist" ? "text-pink-500" : ""}`}
            />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 bg-pink-500 text-[10px] text-white font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Link */}
          <Link
            to="/cart"
            className="relative p-2 text-white/70 hover:text-green-400 transition-all duration-300 group"
            title="Cart"
          >
            <FiShoppingCart
              className={`text-xl group-hover:scale-110 transition-transform ${location.pathname === "/cart" ? "text-green-400" : ""}`}
            />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-yellow-400 text-[10px] text-black font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg">
                {cartCount}
              </span>
            )}
          </Link>

          {/* --- LOGIN / LOGOUT LOGIC --- */}
          <div className="flex items-center gap-3 border-l border-white/10 pl-4 ml-2">
            {user ? (
              <div className="flex items-center gap-4">
                {/* User Profile Section with Image */}
                <div className="flex items-center gap-2">
                  <div className="hidden lg:flex flex-col items-end mr-2">
                    <span className="text-[10px] text-green-400 font-bold uppercase tracking-tighter">Welcome</span>
                    <span className="text-xs text-white font-black truncate max-w-[80px]">
                      {user.username || user.name || "User"}
                    </span>
                  </div>

                  {/* അപ്ഡേറ്റ് ചെയ്ത ഇമേജ് ഡിസ്പ്ലേ സെക്ഷൻ */}
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-green-400 bg-gray-800 flex items-center justify-center cursor-pointer">
                    {user.image || user.avatar || user.profilePicture || user.photoURL ? (
                      <img
                        src={user.image || user.avatar || user.profilePicture || user.photoURL}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                        }}
                      />
                    ) : (
                      // ഇമേജ് ഇല്ലെങ്കിൽ പേരിൻ്റെ ആദ്യത്തെ അക്ഷരം കാണിക്കാം
                      <span className="text-white font-bold text-sm uppercase">
                        {(user.name || user.username || "U").charAt(0)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 group"
                  title="Logout"
                >
                  <FiLogOut className="text-lg group-hover:scale-110 transition-transform" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 bg-green-500 text-black font-black text-[10px] uppercase px-5 py-2.5 rounded-full hover:bg-green-400 transition-all duration-300 shadow-lg shadow-green-500/20"
              >
                <FiUser className="text-sm" /> Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

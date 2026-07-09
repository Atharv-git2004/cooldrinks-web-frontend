import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock, FiUser, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // AuthContext ഇമ്പോർട്ട് ചെയ്തു

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const navigate = useNavigate();
  const { login } = useAuth(); // login ഫംഗ്ഷൻ എടുത്തു

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    // പാസ്‌വേഡുകൾ തമ്മിൽ മാച്ച് ആകുന്നുണ്ടോ എന്ന് നോക്കുന്നു
    if (formData.password !== formData.confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match!" });
      setLoading(false);
      return;
    }

    try {
      // ബാക്കെൻഡിലേക്ക് നേരിട്ട് അക്ഷിയോസ് വഴി റിക്വസ്റ്റ് അയക്കുന്നു
      const response = await axios.post(
        "https://cooldrinkbackend.onrender.com/api/users/register",
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }, // സെഷൻ കുക്കി സെറ്റ് ചെയ്യാൻ ഇത് നിർബന്ധമാണ്
      );

      const data = response.data;

      if (data.success) {
        login(data.user); // രജിസ്റ്റർ ചെയ്ത യൂസറെ നേരിട്ട് ലോഗിൻ ചെയ്യിപ്പിക്കുന്നു
        setStatus({ type: "success", message: "Account Created! Welcome to Arctic Sip..." });

        // ലോഗിൻ പേജിന് പകരം നേരിട്ട് ഹോം പേജിലേക്ക് (/) പോകുന്നു
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err) {
      // എറർ മെസ്സേജ് ബാക്കെൻഡിൽ നിന്ന് കിട്ടുന്നത് കാണിക്കുക
      const errorMsg = err.response?.data?.message || "Registration failed. Try again.";
      setStatus({ type: "error", message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // 🟢 ബാക്കെൻഡിലെ ഗൂഗിൾ ലോഗിൻ റൂട്ടിലേക്ക് റീഡയറക്ട് ചെയ്യുന്നു
    window.location.href = "https://cooldrinkbackend.onrender.com/api/users/google";
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white px-4 sm:px-6 py-10 overflow-hidden">
      <video autoPlay loop muted playsInline className="absolute w-full h-full object-cover z-0 opacity-30 scale-110">
        <source src="/videos/login-drink.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-20 bg-white/5 backdrop-blur-3xl p-8 sm:p-10 md:p-14 rounded-[40px] border border-white/10 w-full max-w-xl shadow-2xl my-auto"
      >
        <div className="text-center mb-8 sm:mb-10">
          <span className="text-green-500 font-bold tracking-[0.3em] uppercase text-[10px] bg-white/5 py-2 px-6 rounded-full border border-green-500/20">
            Join Arctic Sip
          </span>
          <h2 className="text-4xl sm:text-5xl font-black italic uppercase mt-6 tracking-tighter">
            Create <span className="text-green-500">Account</span>
          </h2>
        </div>

        <form onSubmit={handleRegister} className="space-y-4 sm:space-y-5">
          {status.message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-4 rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2 border ${
                status.type === "success"
                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                  : "bg-red-500/10 text-red-500 border-red-500/20"
              }`}
            >
              {status.type === "success" && <FiCheckCircle />}
              {status.message}
            </motion.div>
          )}

          <div className="grid grid-cols-1 gap-4">
            <div className="relative group">
              <FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-green-500 transition-colors" />
              <input
                type="text"
                name="username"
                value={formData.username}
                required
                className="w-full bg-white/5 border border-white/10 p-4 sm:p-5 pl-12 sm:pl-14 rounded-2xl focus:border-green-500 outline-none transition-all placeholder:text-white/20 text-sm sm:text-base"
                placeholder="Full Name"
                onChange={handleChange}
              />
            </div>

            <div className="relative group">
              <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-green-500 transition-colors" />
              <input
                type="email"
                name="email"
                value={formData.email}
                required
                className="w-full bg-white/5 border border-white/10 p-4 sm:p-5 pl-12 sm:pl-14 rounded-2xl focus:border-green-500 outline-none transition-all placeholder:text-white/20 text-sm sm:text-base"
                placeholder="Email Address"
                onChange={handleChange}
              />
            </div>

            <div className="relative group">
              <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-green-500 transition-colors" />
              <input
                type="password"
                name="password"
                value={formData.password}
                required
                className="w-full bg-white/5 border border-white/10 p-4 sm:p-5 pl-12 sm:pl-14 rounded-2xl focus:border-green-500 outline-none transition-all placeholder:text-white/20 text-sm sm:text-base"
                placeholder="Create Password"
                onChange={handleChange}
              />
            </div>

            <div className="relative group">
              <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-green-500 transition-colors" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                required
                className="w-full bg-white/5 border border-white/10 p-4 sm:p-5 pl-12 sm:pl-14 rounded-2xl focus:border-green-500 outline-none transition-all placeholder:text-white/20 text-sm sm:text-base"
                placeholder="Confirm Password"
                onChange={handleChange}
              />
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="w-full py-4 sm:py-5 bg-green-500 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-green-400 transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 mt-4 text-sm sm:text-base"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-black/30 border-t-black rounded-full animate-spin"></div>
            ) : (
              <>
                Get Started <FiArrowRight className="text-xl" />
              </>
            )}
          </motion.button>
        </form>

        <div className="my-6 flex items-center justify-center space-x-4">
          <div className="h-px bg-white/20 w-full"></div>
          <span className="text-white/40 text-xs uppercase tracking-widest">Or</span>
          <div className="h-px bg-white/20 w-full"></div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleGoogleLogin}
          type="button"
          className="w-full py-4 sm:py-5 bg-white/10 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-3 shadow-lg text-sm sm:text-base"
        >
          <FcGoogle className="text-2xl" />
          Sign up with Google
        </motion.button>

        <div className="text-center mt-8 text-gray-400 text-xs sm:text-sm">
          Already part of the tribe?{" "}
          <Link to="/login" className="text-green-500 font-bold hover:text-green-400 transition-colors hover:underline">
            Log in here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;

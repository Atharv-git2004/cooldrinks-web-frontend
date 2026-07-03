import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { registerAPI } from '../../api/userApi';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        // പാസ്‌വേഡ് മാച്ച് ആകുന്നുണ്ടോ എന്ന് പരിശോധിക്കുന്നു
        if (formData.password !== formData.confirmPassword) {
            setStatus({ type: 'error', message: 'Passwords do not match!' });
            setLoading(false);
            return;
        }

        try {
            // api/userApi.js-ലെ ഫംഗ്‌ഷൻ വിളിക്കുന്നു
            const data = await registerAPI({
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            if (data.success) {
                setStatus({ type: 'success', message: 'Account Created! Redirecting to login...' });
                
                // 2 സെക്കൻഡിന് ശേഷം ലോഗിൻ പേജിലേക്ക് വിടുന്നു
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            setStatus({ 
                type: 'error', 
                message: err.message || 'Registration failed. Try again.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-black text-white px-6 overflow-hidden">
            
            {/* Background Video (Login-ന് ഉപയോഗിച്ച അതേ വീഡിയോ അല്ലെങ്കിൽ വേറെ ഒരെണ്ണം) */}
            <video 
                autoPlay loop muted playsInline
                className="absolute w-full h-full object-cover z-0 opacity-30 scale-110"
            >
                <source src="/videos/login-drink.mp4" type="video/mp4" />
            </video>

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10" />

            {/* Register Card */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="relative z-20 bg-white/5 backdrop-blur-3xl p-10 md:p-14 rounded-[40px] border border-white/10 w-full max-w-xl shadow-2xl"
            >
                <div className="text-center mb-10">
                    <span className="text-green-500 font-bold tracking-[0.3em] uppercase text-[10px] bg-white/5 py-2 px-6 rounded-full border border-green-500/20">
                        Join Arctic Sip
                    </span>
                    <h2 className="text-5xl font-black italic uppercase mt-6 tracking-tighter">
                        Create <span className="text-green-500">Account</span>
                    </h2>
                </div>
                
                <form onSubmit={handleRegister} className="space-y-5">
                    {/* Status Alerts */}
                    {status.message && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            className={`p-4 rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2 border ${
                                status.type === 'success' 
                                ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                : 'bg-red-500/10 text-red-500 border-red-500/20'
                            }`}
                        >
                            {status.type === 'success' && <FiCheckCircle />}
                            {status.message}
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 gap-4">
                        {/* Username Input */}
                        <div className="relative group">
                            <FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-green-500 transition-colors" />
                            <input 
                                type="text" name="username" required
                                className="w-full bg-white/5 border border-white/10 p-5 pl-14 rounded-2xl focus:border-green-500 outline-none transition-all placeholder:text-white/20"
                                placeholder="Full Name"
                                onChange={handleChange}
                            />
                        </div>

                        {/* Email Input */}
                        <div className="relative group">
                            <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-green-500 transition-colors" />
                            <input 
                                type="email" name="email" required
                                className="w-full bg-white/5 border border-white/10 p-5 pl-14 rounded-2xl focus:border-green-500 outline-none transition-all placeholder:text-white/20"
                                placeholder="Email Address"
                                onChange={handleChange}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="relative group">
                            <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-green-500 transition-colors" />
                            <input 
                                type="password" name="password" required
                                className="w-full bg-white/5 border border-white/10 p-5 pl-14 rounded-2xl focus:border-green-500 outline-none transition-all placeholder:text-white/20"
                                placeholder="Create Password"
                                onChange={handleChange}
                            />
                        </div>

                        {/* Confirm Password Input */}
                        <div className="relative group">
                            <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-green-500 transition-colors" />
                            <input 
                                type="password" name="confirmPassword" required
                                className="w-full bg-white/5 border border-white/10 p-5 pl-14 rounded-2xl focus:border-green-500 outline-none transition-all placeholder:text-white/20"
                                placeholder="Confirm Password"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Register Button */}
                    <motion.button 
                        whileTap={{ scale: 0.97 }}
                        disabled={loading}
                        className="w-full py-5 bg-green-500 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-green-400 transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 mt-4"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-4 border-black/30 border-t-black rounded-full animate-spin"></div>
                        ) : (
                            <>Get Started <FiArrowRight className="text-xl" /></>
                        )}
                    </motion.button>
                </form>

                <div className="text-center mt-10 text-gray-400 text-sm">
                    Already part of the tribe?{' '}
                    <Link to="/login" className="text-green-500 font-bold hover:text-green-400 transition-colors hover:underline">
                        Log in here
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
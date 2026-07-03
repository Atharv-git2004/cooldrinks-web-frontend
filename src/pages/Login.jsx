import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight, FiZap } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext'; 
import { loginAPI } from '../../api/userApi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const data = await loginAPI({ email, password });
      if (data.success) {
        login(data.user); 
        setStatus({ type: 'success', message: 'Energy Synchronized!' });
        setTimeout(() => {
          const userRole = data.user.role?.toLowerCase() || 'user';
          navigate(userRole === 'admin' ? '/admin' : '/');
        }, 1500);
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Invalid Credentials' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans">
      
      {/* 1. Video Background */}
      <video 
        autoPlay loop muted playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/energy-bg.mp4" type="video/mp4" />
      </video>

      {/* 2. Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* 3. Login Card (CSS Glassmorphism) */}
      <div className="relative z-30 w-full max-w-[400px] px-6">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-[30px] shadow-2xl">
          
          <div className="text-center mb-8">
            <div className="inline-block mb-3 p-3 rounded-2xl bg-cyan-500 shadow-lg shadow-cyan-500/40">
              <FiZap className="text-2xl text-black" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
              Arctic <span className="text-cyan-400">Boost</span>
            </h2>
            <p className="text-white/40 text-[10px] mt-2 uppercase tracking-[0.3em]">Pure Refreshment</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {status.message && (
              <div className={`p-3 rounded-xl text-center text-[10px] font-bold uppercase tracking-widest border ${
                status.type === 'success' ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'bg-red-500/20 border-red-500/50 text-red-400'
              }`}>
                {status.message}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-400" />
                <input 
                  type="email" required
                  className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-xl focus:border-cyan-400 outline-none transition-all text-white placeholder:text-white/20 text-sm"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative group">
                <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-400" />
                <input 
                  type="password" required
                  className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-xl focus:border-cyan-400 outline-none transition-all text-white placeholder:text-white/20 text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full py-4 bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 shadow-lg shadow-cyan-900/20"
            >
              {loading ? "Loading..." : <>Login <FiArrowRight /></>}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/register" className="text-white/30 text-[10px] uppercase font-bold hover:text-cyan-400 transition-colors">
              New Account? <span className="text-cyan-400 underline">Register</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;`1`
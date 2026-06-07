import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-5 pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-3xl"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 relative z-10"
      >
        <div className="bg-primary p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 opacity-10"></div>
          <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/10 shadow-xl">
            <ShieldCheck size={32} className="text-accent" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">ADMIN PORTAL</h1>
          <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest opacity-80">Secure Management Access</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-10 md:p-12 space-y-8">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-3"
            >
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
              {error}
            </motion.div>
          )}
          
          <div className="space-y-3">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest ml-1 flex items-center gap-2">
              <Lock size={12} className="text-accent" />
              Admin Password
            </label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all text-primary font-bold placeholder:text-slate-300"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-5 rounded-xl text-sm font-bold shadow-lg flex items-center justify-center gap-3 group disabled:opacity-50 hover:bg-primary-dark transition-all"
          >
            <span className="uppercase tracking-widest">
              {loading ? 'Authenticating...' : 'Login to Dashboard'}
            </span>
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
        
        <div className="p-8 bg-slate-50 text-center border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
            Authorized personnel only.<br />All access attempts are logged and monitored.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;

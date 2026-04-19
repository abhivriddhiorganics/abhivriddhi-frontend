import React, { useState } from 'react';
import { ShieldCheck, User, Mail, Lock, Phone, Key, ArrowRight, Loader2, Trash2, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { handoverSetup, cleanSlate } from '../../services/api';

const HandoverPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [resetFinished, setResetFinished] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    secret: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await handoverSetup(formData);
      if (res.success) {
        setSuccess(true);
        // Store token for session persistence
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        
        // Brief delay for visual feedback
        setTimeout(() => {
          navigate('/admin');
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Handover failed. Please verify your secret and details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSystemReset = async () => {
    if (!formData.secret) {
      setError('Please enter the Handover Secret below first.');
      return;
    }

    if (!window.confirm('CRITICAL WARNING: This will permanently delete ALL orders and non-admin customers to zero out statistics. Products and Admins are safe. Proceed?')) {
      return;
    }

    setResetLoading(true);
    setError('');
    try {
      const res = await cleanSlate(formData.secret);
      if (res.success) {
        setResetFinished(res.details);
        alert('System Reset Successful! All test data removed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'System reset failed. Verify secret.');
    } finally {
      setResetLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 text-center animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <ShieldCheck size={48} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">System Secured</h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            Congratulations! You have been successfully registered as the Super Administrator. 
            Redirecting you to your Command Center...
          </p>
          <div className="mt-10 flex justify-center">
            <Loader2 className="animate-spin text-green-600" size={32} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans py-20">
      <div className="max-w-xl w-full">
        {/* Branding header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <Key size={14} className="text-[#4a7c23]" />
            System Handover Protocol
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">
            Welcome to Your <span className="text-[#4a7c23]">Platform</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-sm mx-auto">
            Please register your administrator credentials to take full control of Abhivriddhi Organics.
          </p>
        </div>

        <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-10 space-y-6 pb-6">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                <div className="relative group">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4a7c23] transition-colors" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-[#4a7c23]/10 transition-all outline-none"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                <div className="relative group">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4a7c23] transition-colors" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-[#4a7c23]/10 transition-all outline-none"
                    placeholder="name@email.com"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Mobile (+91...)</label>
                <div className="relative group">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4a7c23] transition-colors" />
                  <input
                    type="text"
                    name="mobile"
                    required
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-[#4a7c23]/10 transition-all outline-none"
                    placeholder="7999..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">New Password</label>
                <div className="relative group">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4a7c23] transition-colors" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-[#4a7c23]/10 transition-all outline-none"
                    placeholder="Create secure password"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <label className="text-[10px] font-black text-[#4a7c23] uppercase tracking-widest px-1 flex items-center gap-2">
                <ShieldCheck size={14} /> Handover Secret
              </label>
              <div className="relative group">
                <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4a7c23] transition-colors" />
                <input
                  type="text"
                  name="secret"
                  required
                  value={formData.secret}
                  onChange={handleChange}
                  className="w-full pl-12 pr-6 py-5 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[24px] text-sm font-black placeholder:text-slate-300 focus:ring-8 focus:ring-[#4a7c23]/5 focus:border-[#4a7c23] focus:bg-white transition-all outline-none shadow-inner"
                  placeholder="Paste your handover token here"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || resetLoading}
              className="w-full mt-4 bg-slate-900 text-white rounded-[24px] py-6 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Initialize Command Center
                  <ArrowRight size={20} className="text-[#4a7c23]" />
                </>
              )}
            </button>
          </form>

          {/* Advanced Reset Section */}
          <div className="px-10 pb-10">
            <button 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 hover:text-slate-600 transition-colors"
            >
              Advanced: System Reset {showAdvanced ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            
            {showAdvanced && (
              <div className="mt-4 p-6 bg-red-50/50 rounded-3xl border border-red-100 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-red-100 p-2 rounded-xl text-red-600">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight mb-1">Zero Out Statistics</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      Permanently delete all test orders, OTPs and non-admin users. This will reset Revenue and Customers to zero for the client. 
                      <span className="font-bold text-red-600"> Products and Admins won't be affected.</span>
                    </p>
                  </div>
                </div>

                {resetFinished ? (
                  <div className="bg-green-50 text-green-700 p-4 rounded-2xl text-xs font-bold space-y-2 border border-green-100">
                    <div className="flex items-center gap-2"><ShieldCheck size={14}/> Reset Complete!</div>
                    <ul className="grid grid-cols-3 gap-2 opacity-80">
                      <li>Orders: {resetFinished.ordersDeleted}</li>
                      <li>Users: {resetFinished.usersDeleted}</li>
                      <li>OTPs: {resetFinished.otpsDeleted}</li>
                    </ul>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSystemReset}
                    disabled={resetLoading || loading}
                    className="w-full bg-red-600 text-white rounded-2xl py-4 font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-100 active:scale-[0.98] disabled:opacity-50"
                  >
                    {resetLoading ? <Loader2 className="animate-spin" size={16} /> : <><Trash2 size={16} /> Clean Slate: Remove Test Data</>}
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className="bg-slate-50 px-10 py-6 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Security Protocol 1.0.4</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#4a7c23]/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#4a7c23]/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#4a7c23]" />
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-center text-slate-400 text-xs font-medium">
          Powered by Abhivriddhi Organics Security Layer. <br/>
          Internal project handover — not available to public.
        </p>
      </div>
    </div>
  );
};

export default HandoverPage;

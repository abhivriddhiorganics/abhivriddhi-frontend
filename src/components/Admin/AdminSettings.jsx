import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Plus, 
  Trash2, 
  Save, 
  Megaphone,
  RefreshCcw,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { fetchSettings, updateSettings } from '../../services/api';

const AdminSettings = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await fetchSettings();
      if (res.success && res.settings) {
        setAnnouncements(res.settings.announcementBar || []);
      }
    } catch (err) {
      setError('Failed to load settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnnouncement = () => {
    setAnnouncements([...announcements, '']);
  };

  const handleRemoveAnnouncement = (index) => {
    const updated = announcements.filter((_, i) => i !== index);
    setAnnouncements(updated);
  };

  const handleUpdateAnnouncement = (index, value) => {
    const updated = [...announcements];
    updated[index] = value;
    setAnnouncements(updated);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      // Filter out empty strings
      const filtered = announcements.filter(item => item.trim() !== '');
      
      const res = await updateSettings({ announcementBar: filtered });
      if (res.success) {
        setSuccess(true);
        setAnnouncements(res.settings.announcementBar);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError('Failed to save settings. ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-emerald-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold animate-pulse">Loading Configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Settings className="text-emerald-600" size={28} />
            Site Configuration
          </h1>
          <p className="text-slate-500 font-medium mt-1 text-sm sm:text-base">Manage global website text and announcement bars.</p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={saving}
          className={`px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center gap-3 shadow-lg ${
            saving 
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
            : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-emerald-200 active:scale-95'
          }`}
        >
          {saving ? <RefreshCcw size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? 'Saving Changes...' : 'Save Configuration'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 animate-in slide-in-from-top duration-500">
           <AlertCircle size={20} />
           <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3 text-emerald-600 animate-in slide-in-from-top duration-500">
           <CheckCircle2 size={20} />
           <p className="text-sm font-bold">Settings updated successfully!</p>
        </div>
      )}

      {/* Announcement Bar Section */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-50 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Megaphone size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Announcement Marquee</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Scrolling messages at the very top</p>
            </div>
          </div>
          
          <button 
            onClick={handleAddAnnouncement}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-100 transition-colors"
          >
            <Plus size={16} /> Add Message
          </button>
        </div>

        <div className="space-y-4">
          {announcements.map((text, index) => (
            <div key={index} className="flex gap-4 group animate-in slide-in-from-left duration-300" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="flex-grow relative">
                 <input 
                   type="text" 
                   value={text}
                   onChange={(e) => handleUpdateAnnouncement(index, e.target.value)}
                   placeholder="Enter message (e.g. Free Delivery on all orders)"
                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-700 font-bold focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50 outline-none transition-all placeholder:text-slate-300"
                 />
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600 rounded-l-2xl"></div>
              </div>
              <button 
                onClick={() => handleRemoveAnnouncement(index)}
                className="p-4 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all self-center"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}

          {announcements.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-[2.5rem]">
              <p className="text-slate-300 font-bold italic">No active announcements. Add one to get started!</p>
            </div>
          )}
        </div>

        {/* Live Preview Block */}
        <div className="mt-12 pt-12 border-t border-slate-50">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Real-time Preview</p>
          <div className="bg-[#2C7700] p-4 rounded-xl overflow-hidden flex whitespace-nowrap gap-8 items-center h-12 shadow-inner">
             {announcements.filter(t => t.trim() !== '').length > 0 ? (
               announcements.filter(t => t.trim() !== '').map((text, i) => (
                 <div key={i} className="flex items-center gap-8">
                    <span className="text-white text-[10px] font-bold tracking-widest uppercase">{text}</span>
                    <span className="text-emerald-400 font-light">|</span>
                 </div>
               ))
             ) : (
               <span className="text-emerald-800 text-[10px] font-black uppercase tracking-widest italic opacity-50">Announcements will appear here...</span>
             )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminSettings;

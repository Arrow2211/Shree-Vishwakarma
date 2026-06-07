import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  Save, LogOut, TrendingUp, Users, Landmark, 
  FileText, Plus, Trash2, CheckCircle, AlertCircle,
  Mail, Phone
} from 'lucide-react';

const AdminDashboard = () => {
  const { content, stats, deposits, recurringDeposits, loans, rdMaturity, loading, refreshData } = useLanguage();
  const [activeTab, setActiveTab] = useState('stats');
  const [editLang, setEditLang] = useState<'marathi' | 'english'>('marathi');
  const [localStats, setLocalStats] = useState<any>(null);
  const [localContent, setLocalContent] = useState<any>(null);
  const [localDeposits, setLocalDeposits] = useState<any>(null);
  const [localRecurringDeposits, setLocalRecurringDeposits] = useState<any>(null);
  const [localLoans, setLocalLoans] = useState<any>(null);
  const [localRdMaturity, setLocalRdMaturity] = useState<any>(null);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [supabaseStatus, setSupabaseStatus] = useState<{ connected: boolean; message?: string; error?: string } | null>(null);
  const [isMigrating, setIsMigrating] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const checkSupabase = async () => {
    try {
      const res = await fetch('/api/supabase-status');
      const data = await res.json();
      setSupabaseStatus(data);
    } catch (err) {
      setSupabaseStatus({ connected: false, error: 'Could not reach server' });
    }
  };

  const fetchEnquiries = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/enquiries', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data);
      }
    } catch (err) {
      console.error('Failed to fetch enquiries:', err);
    }
  };

  const deleteEnquiry = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setEnquiries(enquiries.filter(e => e.id !== id));
        setMessage({ text: 'Enquiry deleted successfully', type: 'success' });
      }
    } catch (err) {
      setMessage({ text: 'Failed to delete enquiry', type: 'error' });
    }
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/admin');
    
    checkSupabase();
    fetchEnquiries();
    
    if (stats) setLocalStats({ ...stats });
    if (content) setLocalContent(JSON.parse(JSON.stringify(content)));
    if (deposits) setLocalDeposits([...deposits]);
    if (recurringDeposits) setLocalRecurringDeposits([...recurringDeposits]);
    if (loans) setLocalLoans([...loans]);
    if (rdMaturity) setLocalRdMaturity([...rdMaturity]);
  }, [stats, content, deposits, recurringDeposits, loans, rdMaturity, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const save = async (endpoint: string, data: any) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        setMessage({ text: 'Changes saved successfully!', type: 'success' });
        await refreshData();
      } else {
        setMessage({ text: `Failed to save changes: ${result.error || 'Unknown error'}`, type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Error connecting to server.', type: 'error' });
    }
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  if (loading) return <div className="p-8 flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  
  if (!localStats || !localContent) return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Data</h2>
      <p className="mb-4">Could not load application content. Please check the server logs.</p>
      <button onClick={() => refreshData()} className="bg-primary text-white px-4 py-2 rounded-lg font-bold">Retry</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-primary text-white flex flex-col">
        <div className="p-6 border-b border-white/5">
          <h1 className="text-xl font-bold tracking-tight">Admin Portal</h1>
        </div>
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'stats' ? 'bg-white/10 shadow-inner text-accent' : 'hover:bg-white/5 text-slate-300'}`}
          >
            <TrendingUp size={20} />
            Financial Stats
          </button>
          <button 
            onClick={() => setActiveTab('home')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'home' ? 'bg-white/10 shadow-inner text-accent' : 'hover:bg-white/5 text-slate-300'}`}
          >
            <FileText size={20} />
            Home Page
          </button>
          <button 
            onClick={() => setActiveTab('about')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'about' ? 'bg-white/10 shadow-inner text-accent' : 'hover:bg-white/5 text-slate-300'}`}
          >
            <FileText size={20} />
            About Page
          </button>
          <button 
            onClick={() => setActiveTab('contact')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'contact' ? 'bg-white/10 shadow-inner text-accent' : 'hover:bg-white/5 text-slate-300'}`}
          >
            <FileText size={20} />
            Contact Page
          </button>
          <button 
            onClick={() => setActiveTab('deposits')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'deposits' ? 'bg-white/10 shadow-inner text-accent' : 'hover:bg-white/5 text-slate-300'}`}
          >
            <Landmark size={20} />
            Fixed Deposits
          </button>
          <button 
            onClick={() => setActiveTab('recurring')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'recurring' ? 'bg-white/10 shadow-inner text-accent' : 'hover:bg-white/5 text-slate-300'}`}
          >
            <Landmark size={20} />
            Recurring Deposits
          </button>
          <button 
            onClick={() => setActiveTab('loans')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'loans' ? 'bg-white/10 shadow-inner text-accent' : 'hover:bg-white/5 text-slate-300'}`}
          >
            <Users size={20} />
            Loan Schemes
          </button>
          <button 
            onClick={() => setActiveTab('enquiries')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'enquiries' ? 'bg-white/10 shadow-inner text-accent' : 'hover:bg-white/5 text-slate-300'}`}
          >
            <Mail size={20} />
            Enquiries / Messages
          </button>
          <button 
            onClick={() => setActiveTab('rd_maturity')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'rd_maturity' ? 'bg-white/10 shadow-inner text-accent' : 'hover:bg-white/5 text-slate-300'}`}
          >
            <Landmark size={20} />
            RD Maturity Table
          </button>
          <div className="pt-4 border-t border-blue-800 mt-4">
            <button 
              disabled={isMigrating}
              onClick={async () => {
                if (window.confirm('This will migrate all local JSON data to your Supabase database. Existing data in Supabase will be overwritten. Continue?')) {
                  setIsMigrating(true);
                  const token = localStorage.getItem('adminToken');
                  try {
                    const res = await fetch('/api/migrate', {
                      method: 'POST',
                      headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (res.ok) {
                      alert('Migration successful: ' + data.message);
                      await checkSupabase();
                      window.location.reload();
                    } else {
                      alert('Migration failed: ' + data.error);
                    }
                  } catch (err) {
                    alert('Error connecting to server.');
                  } finally {
                    setIsMigrating(false);
                  }
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-blue-200 text-sm ${isMigrating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-800/50'}`}
            >
              <TrendingUp size={18} className={isMigrating ? 'animate-spin' : ''} />
              {isMigrating ? 'Migrating...' : 'Migrate to Supabase'}
            </button>
            <div className="flex flex-col gap-1 px-4 py-2 mt-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${supabaseStatus?.connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">
                  {supabaseStatus?.connected ? 'Supabase Connected' : 'Supabase Disconnected'}
                </span>
              </div>
              {!supabaseStatus?.connected && supabaseStatus?.error && (
                <p className="text-[8px] text-red-400 font-medium truncate">{supabaseStatus.error}</p>
              )}
              <button 
                onClick={checkSupabase}
                className="text-[8px] text-blue-400 hover:text-blue-300 underline text-left mt-1"
              >
                Retry Connection
              </button>
              <button 
                onClick={() => {
                  const sql = `
-- 1. Create app_content table
CREATE TABLE IF NOT EXISTS app_content (
  section_key TEXT PRIMARY KEY,
  marathi JSONB NOT NULL,
  english JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create stats table
DROP TABLE IF EXISTS stats;
CREATE TABLE stats (
  id INTEGER PRIMARY KEY DEFAULT 1,
  share_capital TEXT,
  total_deposits TEXT,
  total_loans TEXT,
  total_members TEXT,
  composite_business TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT single_row CHECK (id = 1)
);

-- 3. Create loans table
CREATE TABLE IF NOT EXISTS loans (
  id TEXT PRIMARY KEY,
  name_marathi TEXT,
  name_english TEXT,
  rate TEXT,
  description_marathi TEXT,
  description_english TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create deposits table
CREATE TABLE IF NOT EXISTS deposits (
  id TEXT PRIMARY KEY,
  name_marathi TEXT,
  name_english TEXT,
  general TEXT,
  senior TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create recurring_deposits table
CREATE TABLE IF NOT EXISTS recurring_deposits (
  id TEXT PRIMARY KEY,
  period_marathi TEXT,
  period_english TEXT,
  rate TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create rd_maturity table
CREATE TABLE IF NOT EXISTS rd_maturity (
  id TEXT PRIMARY KEY,
  amount INTEGER NOT NULL,
  year1 INTEGER NOT NULL,
  year2 INTEGER NOT NULL,
  year3 INTEGER NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Reload schema cache
NOTIFY pgrst, 'reload schema';`;
                  console.log("--- SUPABASE SQL SCRIPT START ---");
                  console.log(sql);
                  console.log("--- SUPABASE SQL SCRIPT END ---");
                  alert("SQL Script has been printed to the browser console (F12 -> Console). Please copy the text between START and END markers.");
                }}
                className="text-[10px] text-amber-400 hover:text-amber-300 underline text-left mt-2 block"
              >
                View SQL Script
              </button>
            </div>
          </div>
        </nav>
        <div className="p-4 border-t border-blue-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-600 transition-all text-red-200"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-8 overflow-y-auto max-h-screen">
        <div className="max-w-4xl mx-auto">
          {message.text && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 border ${message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
              {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              {message.text}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Financial Statistics</h2>
                <button onClick={() => save('stats', localStats)} className="bg-primary text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-primary-dark transition-all">
                  <Save size={18} /> Save Changes
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['totalLoans', 'totalDeposits', 'shareCapital', 'compositeBusiness', 'totalMembers'].map(key => (
                  <div key={key}>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                      {key === 'totalLoans' ? 'Total Loans (एकूण कर्ज)' :
                       key === 'totalDeposits' ? 'Total Deposits (एकूण ठेवी)' :
                       key === 'shareCapital' ? 'Working Share Capital (खेळते भागभांडवल)' : 
                       key === 'compositeBusiness' ? 'Composite Business (संमिश्र व्यवसाय)' :
                       key === 'totalMembers' ? 'Total Members (एकूण सभासद)' :
                       key.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <input 
                      type="text"
                      value={localStats ? localStats[key] || '' : ''}
                      onChange={(e) => setLocalStats({...localStats, [key]: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-accent focus:ring-4 focus:ring-accent/5 outline-none transition-all font-semibold text-slate-700"
                      placeholder={`Enter ${key}...`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'home' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Home Page Content</h2>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setLocalContent(JSON.parse(JSON.stringify(content)))}
                    className="text-gray-500 hover:text-gray-700 font-bold text-sm px-4"
                  >
                    Discard Changes
                  </button>
                  <button onClick={() => save('content', localContent)} className="bg-blue-900 text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-800">
                    <Save size={18} /> Save Changes
                  </button>
                </div>
              </div>
              
              <div className="space-y-8">
                {['marathi', 'english'].map(lang => (
                  <div key={lang} className="border-b border-gray-100 pb-8 last:border-0">
                    <h3 className="text-lg font-bold text-blue-900 mb-4 capitalize">{lang} Header & Logo</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Bank Name (Navbar)</label>
                        <input 
                          type="text"
                          value={localContent[lang]?.header?.bankName || ''}
                          onChange={(e) => {
                            const newContent = JSON.parse(JSON.stringify(localContent));
                            if (!newContent[lang]) newContent[lang] = {};
                            if (!newContent[lang].header) newContent[lang].header = {};
                            newContent[lang].header.bankName = e.target.value;
                            setLocalContent(newContent);
                          }}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Logo URL</label>
                        <input 
                          type="text"
                          value={localContent[lang]?.header?.logoUrl || ''}
                          onChange={(e) => {
                            const newContent = JSON.parse(JSON.stringify(localContent));
                            if (!newContent[lang].header) newContent[lang].header = {};
                            newContent[lang].header.logoUrl = e.target.value;
                            setLocalContent(newContent);
                          }}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Header Tagline</label>
                        <input 
                          type="text"
                          value={localContent[lang]?.header?.tagline || ''}
                          onChange={(e) => {
                            const newContent = JSON.parse(JSON.stringify(localContent));
                            if (!newContent[lang].header) newContent[lang].header = {};
                            newContent[lang].header.tagline = e.target.value;
                            setLocalContent(newContent);
                          }}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-blue-900 mb-4 capitalize">{lang} Hero Section</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                        <input 
                          type="text"
                          value={localContent[lang]?.hero?.title || ''}
                          onChange={(e) => {
                            const newContent = JSON.parse(JSON.stringify(localContent));
                            if (!newContent[lang].hero) newContent[lang].hero = {};
                            newContent[lang].hero.title = e.target.value;
                            setLocalContent(newContent);
                          }}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Tagline</label>
                        <input 
                          type="text"
                          value={localContent[lang]?.hero?.tagline || ''}
                          onChange={(e) => {
                            const newContent = JSON.parse(JSON.stringify(localContent));
                            if (!newContent[lang].hero) newContent[lang].hero = {};
                            newContent[lang].hero.tagline = e.target.value;
                            setLocalContent(newContent);
                          }}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">CTA Button Text</label>
                        <input 
                          type="text"
                          value={localContent[lang]?.hero?.cta || ''}
                          onChange={(e) => {
                            const newContent = JSON.parse(JSON.stringify(localContent));
                            if (!newContent[lang].hero) newContent[lang].hero = {};
                            newContent[lang].hero.cta = e.target.value;
                            setLocalContent(newContent);
                          }}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Hero Image URL</label>
                        <input 
                          type="text"
                          value={localContent[lang]?.hero?.imageUrl || ''}
                          onChange={(e) => {
                            const newContent = JSON.parse(JSON.stringify(localContent));
                            if (!newContent[lang].hero) newContent[lang].hero = {};
                            newContent[lang].hero.imageUrl = e.target.value;
                            setLocalContent(newContent);
                          }}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-blue-900 mt-8 mb-4 capitalize">{lang} Testimonials</h3>
                    <div className="space-y-4">
                      {(Array.isArray(localContent[lang]?.testimonials) ? (localContent[lang]?.testimonials || []) : Object.values(localContent[lang]?.testimonials || {})).map((t: any, idx: number) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-gray-100 space-y-3 relative group">
                          <button 
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this testimonial?')) {
                                const newContent = JSON.parse(JSON.stringify(localContent));
                                if (Array.isArray(newContent.marathi.testimonials)) {
                                  newContent.marathi.testimonials.splice(idx, 1);
                                } else {
                                  delete newContent.marathi.testimonials[idx];
                                  newContent.marathi.testimonials = Object.values(newContent.marathi.testimonials);
                                }
                                if (Array.isArray(newContent.english.testimonials)) {
                                  newContent.english.testimonials.splice(idx, 1);
                                } else {
                                  delete newContent.english.testimonials[idx];
                                  newContent.english.testimonials = Object.values(newContent.english.testimonials);
                                }
                                setLocalContent(newContent);
                              }
                            }}
                            className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={14} />
                          </button>
                          <div className="grid grid-cols-2 gap-4">
                            <input 
                              placeholder="Name"
                              value={t.name}
                              onChange={(e) => {
                                const newContent = JSON.parse(JSON.stringify(localContent));
                                newContent[lang].testimonials[idx].name = e.target.value;
                                setLocalContent(newContent);
                              }}
                              className="px-3 py-2 rounded-lg border border-gray-200"
                            />
                            <input 
                              placeholder="Role"
                              value={t.role}
                              onChange={(e) => {
                                const newContent = JSON.parse(JSON.stringify(localContent));
                                newContent[lang].testimonials[idx].role = e.target.value;
                                setLocalContent(newContent);
                              }}
                              className="px-3 py-2 rounded-lg border border-gray-200"
                            />
                          </div>
                          <textarea 
                            placeholder="Testimonial text"
                            value={t.text}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(localContent));
                              newContent[lang].testimonials[idx].text = e.target.value;
                              setLocalContent(newContent);
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200"
                            rows={2}
                          />
                        </div>
                      ))}
                      <button 
                        onClick={() => {
                          const newContent = JSON.parse(JSON.stringify(localContent));
                          if (!newContent.marathi.testimonials) newContent.marathi.testimonials = [];
                          if (!newContent.english.testimonials) newContent.english.testimonials = [];
                          newContent.marathi.testimonials.push({ name: '', role: '', text: '' });
                          newContent.english.testimonials.push({ name: '', role: '', text: '' });
                          setLocalContent(newContent);
                        }}
                        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={18} /> Add Testimonial
                      </button>
                    </div>

                    <h3 className="text-lg font-bold text-blue-900 mt-8 mb-4 capitalize">{lang} Services</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Section Title</label>
                        <input 
                          type="text"
                          value={localContent[lang]?.services?.title || ''}
                          onChange={(e) => {
                            const newContent = JSON.parse(JSON.stringify(localContent));
                            if (!newContent[lang].services) newContent[lang].services = {};
                            newContent[lang].services.title = e.target.value;
                            setLocalContent(newContent);
                          }}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-bold text-gray-700">Services List</label>
                        <button 
                          onClick={() => {
                          const newContent = JSON.parse(JSON.stringify(localContent));
                          if (!newContent.marathi.services) newContent.marathi.services = { items: [] };
                          if (!newContent.english.services) newContent.english.services = { items: [] };
                          if (!newContent.marathi.services.items) newContent.marathi.services.items = [];
                          if (!newContent.english.services.items) newContent.english.services.items = [];
                          newContent.marathi.services.items.push({ title: '', desc: '' });
                          newContent.english.services.items.push({ title: '', desc: '' });
                            setLocalContent(newContent);
                          }}
                          className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 flex items-center gap-1"
                        >
                          <Plus size={14} /> Add Service
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(Array.isArray(localContent[lang]?.services?.items) ? (localContent[lang]?.services?.items || []) : Object.values(localContent[lang]?.services?.items || {})).map((s: any, idx: number) => (
                          <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-gray-100 space-y-2 relative group">
                            <button 
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this service?')) {
                                  const newContent = JSON.parse(JSON.stringify(localContent));
                                  const marathiItems = newContent.marathi.services?.items || [];
                                  const englishItems = newContent.english.services?.items || [];
                                  
                                  if (Array.isArray(marathiItems)) {
                                    marathiItems.splice(idx, 1);
                                  } else {
                                    delete marathiItems[idx];
                                    newContent.marathi.services.items = Object.values(marathiItems);
                                  }
                                  
                                  if (Array.isArray(englishItems)) {
                                    englishItems.splice(idx, 1);
                                  } else {
                                    delete englishItems[idx];
                                    newContent.english.services.items = Object.values(englishItems);
                                  }
                                  
                                  setLocalContent(newContent);
                                }
                              }}
                              className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={14} />
                            </button>
                            <input 
                              placeholder="Service Title"
                              value={s.title}
                              onChange={(e) => {
                                const newContent = JSON.parse(JSON.stringify(localContent));
                                newContent[lang].services.items[idx].title = e.target.value;
                                setLocalContent(newContent);
                              }}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 font-bold"
                            />
                            <input 
                              placeholder="Service Description"
                              value={s.desc}
                              onChange={(e) => {
                                const newContent = JSON.parse(JSON.stringify(localContent));
                                newContent[lang].services.items[idx].desc = e.target.value;
                                setLocalContent(newContent);
                              }}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-blue-900 mt-8 mb-4 capitalize">{lang} Trust Section</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Section Title</label>
                        <input 
                          type="text"
                          value={localContent[lang]?.trust?.title || ''}
                          onChange={(e) => {
                            const newContent = JSON.parse(JSON.stringify(localContent));
                            if (!newContent[lang].trust) newContent[lang].trust = {};
                            newContent[lang].trust.title = e.target.value;
                            setLocalContent(newContent);
                          }}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Trust Section Image URL</label>
                        <input 
                          type="text"
                          value={localContent[lang]?.trust?.imageUrl || ''}
                          onChange={(e) => {
                            const newContent = JSON.parse(JSON.stringify(localContent));
                            if (!newContent[lang].trust) newContent[lang].trust = {};
                            newContent[lang].trust.imageUrl = e.target.value;
                            setLocalContent(newContent);
                          }}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-bold text-gray-700">Trust Items</label>
                        <button 
                          onClick={() => {
                          const newContent = JSON.parse(JSON.stringify(localContent));
                          if (!newContent.marathi.trust) newContent.marathi.trust = { items: [] };
                          if (!newContent.english.trust) newContent.english.trust = { items: [] };
                          if (!newContent.marathi.trust.items) newContent.marathi.trust.items = [];
                          if (!newContent.english.trust.items) newContent.english.trust.items = [];
                          newContent.marathi.trust.items.push({ title: '', desc: '' });
                          newContent.english.trust.items.push({ title: '', desc: '' });
                            setLocalContent(newContent);
                          }}
                          className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 flex items-center gap-1"
                        >
                          <Plus size={14} /> Add Item
                        </button>
                      </div>
                      <div className="space-y-4">
                        {(Array.isArray(localContent[lang]?.trust?.items) ? (localContent[lang]?.trust?.items || []) : Object.values(localContent[lang]?.trust?.items || {})).map((item: any, idx: number) => (
                          <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-gray-100 space-y-2 relative group">
                            <button 
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this item?')) {
                                  const newContent = JSON.parse(JSON.stringify(localContent));
                                  const marathiItems = newContent.marathi.trust?.items || [];
                                  const englishItems = newContent.english.trust?.items || [];

                                  if (Array.isArray(marathiItems)) {
                                    marathiItems.splice(idx, 1);
                                  } else {
                                    delete marathiItems[idx];
                                    newContent.marathi.trust.items = Object.values(marathiItems);
                                  }

                                  if (Array.isArray(englishItems)) {
                                    englishItems.splice(idx, 1);
                                  } else {
                                    delete englishItems[idx];
                                    newContent.english.trust.items = Object.values(englishItems);
                                  }

                                  setLocalContent(newContent);
                                }
                              }}
                              className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={14} />
                            </button>
                            <input 
                              placeholder="Title"
                              value={item.title}
                              onChange={(e) => {
                                const newContent = JSON.parse(JSON.stringify(localContent));
                                newContent[lang].trust.items[idx].title = e.target.value;
                                setLocalContent(newContent);
                              }}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 font-bold"
                            />
                            <input 
                              placeholder="Description"
                              value={item.desc}
                              onChange={(e) => {
                                const newContent = JSON.parse(JSON.stringify(localContent));
                                newContent[lang].trust.items[idx].desc = e.target.value;
                                setLocalContent(newContent);
                              }}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">About Page Content</h2>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setLocalContent(JSON.parse(JSON.stringify(content)))}
                    className="text-gray-500 hover:text-gray-700 font-bold text-sm px-4"
                  >
                    Discard Changes
                  </button>
                  <button onClick={() => save('content', localContent)} className="bg-blue-900 text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-800">
                    <Save size={18} /> Save Changes
                  </button>
                </div>
              </div>
              
              <div className="space-y-8">
                {['marathi', 'english'].map(lang => (
                  <div key={lang} className="border-b border-gray-100 pb-8 last:border-0">
                    <h3 className="text-lg font-bold text-blue-900 mb-4 capitalize">{lang} About Section</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Introduction</label>
                        <textarea 
                          value={localContent[lang]?.about?.intro || ''}
                          onChange={(e) => {
                            const newContent = JSON.parse(JSON.stringify(localContent));
                            if (!newContent[lang].about) newContent[lang].about = {};
                            newContent[lang].about.intro = e.target.value;
                            setLocalContent(newContent);
                          }}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Mission</label>
                          <input 
                            type="text"
                            value={localContent[lang]?.about?.mission || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(localContent));
                              if (!newContent[lang].about) newContent[lang].about = {};
                              newContent[lang].about.mission = e.target.value;
                              setLocalContent(newContent);
                            }}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Vision</label>
                          <input 
                            type="text"
                            value={localContent[lang]?.about?.vision || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(localContent));
                              if (!newContent[lang].about) newContent[lang].about = {};
                              newContent[lang].about.vision = e.target.value;
                              setLocalContent(newContent);
                            }}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Reg No</label>
                          <input 
                            type="text"
                            value={localContent[lang]?.about?.regNo || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(localContent));
                              if (!newContent[lang].about) newContent[lang].about = {};
                              newContent[lang].about.regNo = e.target.value;
                              setLocalContent(newContent);
                            }}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Reg Date</label>
                          <input 
                            type="text"
                            value={localContent[lang]?.about?.regDate || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(localContent));
                              if (!newContent[lang].about) newContent[lang].about = {};
                              newContent[lang].about.regDate = e.target.value;
                              setLocalContent(newContent);
                            }}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Start Date</label>
                          <input 
                            type="text"
                            value={localContent[lang]?.about?.startDate || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(localContent));
                              if (!newContent[lang].about) newContent[lang].about = {};
                              newContent[lang].about.startDate = e.target.value;
                              setLocalContent(newContent);
                            }}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Contact Page Content</h2>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setLocalContent(JSON.parse(JSON.stringify(content)))}
                    className="text-gray-500 hover:text-gray-700 font-bold text-sm px-4"
                  >
                    Discard Changes
                  </button>
                  <button onClick={() => save('content', localContent)} className="bg-blue-900 text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-800">
                    <Save size={18} /> Save Changes
                  </button>
                </div>
              </div>
              
              <div className="space-y-8">
                {['marathi', 'english'].map(lang => (
                  <div key={lang} className="border-b border-gray-100 pb-8 last:border-0">
                    <h3 className="text-lg font-bold text-blue-900 mb-4 capitalize">{lang} Contact Info</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                        <input 
                          type="text"
                          value={localContent[lang]?.contact?.address || ''}
                          onChange={(e) => {
                            const newContent = JSON.parse(JSON.stringify(localContent));
                            if (!newContent[lang].contact) newContent[lang].contact = {};
                            newContent[lang].contact.address = e.target.value;
                            setLocalContent(newContent);
                          }}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                          <input 
                            type="text"
                            value={localContent[lang]?.contact?.phone || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(localContent));
                              if (!newContent[lang].contact) newContent[lang].contact = {};
                              newContent[lang].contact.phone = e.target.value;
                              setLocalContent(newContent);
                            }}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                          <input 
                            type="text"
                            value={localContent[lang]?.contact?.email || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(localContent));
                              if (!newContent[lang].contact) newContent[lang].contact = {};
                              newContent[lang].contact.email = e.target.value;
                              setLocalContent(newContent);
                            }}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Google Maps Embed URL</label>
                        <input 
                          type="text"
                          value={localContent[lang]?.contact?.googleMapsUrl || ''}
                          onChange={(e) => {
                            const newContent = JSON.parse(JSON.stringify(localContent));
                            if (!newContent[lang].contact) newContent[lang].contact = {};
                            newContent[lang].contact.googleMapsUrl = e.target.value;
                            setLocalContent(newContent);
                          }}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://www.google.com/maps/embed?..."
                        />
                        <p className="text-xs text-gray-400 mt-1">Paste the 'src' attribute from the Google Maps embed code.</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'deposits' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Fixed Deposit Schemes</h2>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setLocalDeposits(JSON.parse(JSON.stringify(deposits)))}
                    className="text-gray-500 hover:text-gray-700 font-bold text-sm px-4"
                  >
                    Discard Changes
                  </button>
                  <button 
                    onClick={() => {
                      const newId = localDeposits.length > 0 ? Math.max(...localDeposits.map((d: any) => d.id)) + 1 : 1;
                      setLocalDeposits([...localDeposits, { id: newId, name: { marathi: '', english: '' }, general: '', senior: '' }]);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-green-700"
                  >
                    <Plus size={18} /> Add New
                  </button>
                  <button onClick={() => save('deposits', localDeposits)} className="bg-blue-900 text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-800">
                    <Save size={18} /> Save Changes
                  </button>
                </div>
              </div>
              <div className="space-y-6">
                {(localDeposits || []).map((d: any, idx: number) => (
                  <div key={d.id} className="p-6 bg-slate-50 rounded-2xl border border-gray-100 relative group">
                    <button 
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this deposit scheme?')) {
                          const newD = localDeposits.filter((_: any, i: number) => i !== idx);
                          setLocalDeposits(newD);
                        }
                      }}
                      className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-400">Name (Marathi)</label>
                        <input 
                          value={d.name.marathi}
                          onChange={(e) => {
                            const newD = [...localDeposits];
                            newD[idx].name.marathi = e.target.value;
                            setLocalDeposits(newD);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400">Name (English)</label>
                        <input 
                          value={d.name.english}
                          onChange={(e) => {
                            const newD = [...localDeposits];
                            newD[idx].name.english = e.target.value;
                            setLocalDeposits(newD);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400">General Rate</label>
                        <input 
                          value={d.general}
                          onChange={(e) => {
                            const newD = [...localDeposits];
                            newD[idx].general = e.target.value;
                            setLocalDeposits(newD);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400">Senior Rate</label>
                        <input 
                          value={d.senior}
                          onChange={(e) => {
                            const newD = [...localDeposits];
                            newD[idx].senior = e.target.value;
                            setLocalDeposits(newD);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'recurring' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Recurring Deposit Schemes</h2>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setLocalRecurringDeposits(JSON.parse(JSON.stringify(recurringDeposits)))}
                    className="text-gray-500 hover:text-gray-700 font-bold text-sm px-4"
                  >
                    Discard Changes
                  </button>
                  <button 
                    onClick={() => {
                      const newId = localRecurringDeposits.length > 0 ? Math.max(...localRecurringDeposits.map((d: any) => d.id)) + 1 : 1;
                      setLocalRecurringDeposits([...localRecurringDeposits, { id: newId, period: { marathi: '', english: '' }, rate: '' }]);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-green-700"
                  >
                    <Plus size={18} /> Add New
                  </button>
                  <button onClick={() => save('recurring-deposits', localRecurringDeposits)} className="bg-blue-900 text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-800">
                    <Save size={18} /> Save Changes
                  </button>
                </div>
              </div>
              <div className="space-y-6">
                {(localRecurringDeposits || []).map((d: any, idx: number) => (
                  <div key={d.id} className="p-6 bg-slate-50 rounded-2xl border border-gray-100 relative group">
                    <button 
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this recurring deposit scheme?')) {
                          const newD = localRecurringDeposits.filter((_: any, i: number) => i !== idx);
                          setLocalRecurringDeposits(newD);
                        }
                      }}
                      className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-400">Period (Marathi)</label>
                        <input 
                          value={d.period.marathi}
                          onChange={(e) => {
                            const newD = [...localRecurringDeposits];
                            newD[idx].period.marathi = e.target.value;
                            setLocalRecurringDeposits(newD);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400">Period (English)</label>
                        <input 
                          value={d.period.english}
                          onChange={(e) => {
                            const newD = [...localRecurringDeposits];
                            newD[idx].period.english = e.target.value;
                            setLocalRecurringDeposits(newD);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400">Interest Rate</label>
                        <input 
                          value={d.rate}
                          onChange={(e) => {
                            const newD = [...localRecurringDeposits];
                            newD[idx].rate = e.target.value;
                            setLocalRecurringDeposits(newD);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'rd_maturity' && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight">RD Maturity Table</h2>
                  <p className="text-slate-500 mt-1">Manage maturity projections for Recurring Deposits.</p>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setLocalRdMaturity(JSON.parse(JSON.stringify(rdMaturity)))}
                    className="text-slate-500 hover:text-slate-900 font-bold text-sm px-4"
                  >
                    Discard
                  </button>
                  <button 
                    onClick={() => {
                      const newId = Date.now().toString();
                      setLocalRdMaturity([...localRdMaturity, { id: newId, amount: 0, year1: 0, year2: 0, year3: 0 }]);
                    }}
                    className="bg-accent/10 text-accent px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-accent/20 font-bold transition-all"
                  >
                    <Plus size={18} /> Add Row
                  </button>
                  <button onClick={() => save('rd-maturity', localRdMaturity)} className="bg-primary text-white px-8 py-3 rounded-xl flex items-center gap-2 hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all font-bold">
                    <Save size={18} /> Save Table
                  </button>
                </div>
              </div>

              <div className="overflow-hidden border border-slate-100 rounded-2xl shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Monthly Deposit (₹)</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">1 Year (₹)</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">2 Years (₹)</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">3 Years (₹)</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right w-20">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {(localRdMaturity || []).map((row: any, idx: number) => (
                      <tr key={row.id} className="hover:bg-slate-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <input 
                            type="number"
                            value={row.amount}
                            onChange={(e) => {
                              const newM = [...localRdMaturity];
                              newM[idx].amount = Number(e.target.value);
                              setLocalRdMaturity(newM);
                            }}
                            className="w-full bg-transparent border-none focus:ring-0 font-bold text-slate-700 p-0"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input 
                            type="number"
                            value={row.year1}
                            onChange={(e) => {
                              const newM = [...localRdMaturity];
                              newM[idx].year1 = Number(e.target.value);
                              setLocalRdMaturity(newM);
                            }}
                            className="w-full bg-transparent border-none focus:ring-0 text-slate-600 p-0"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input 
                            type="number"
                            value={row.year2}
                            onChange={(e) => {
                              const newM = [...localRdMaturity];
                              newM[idx].year2 = Number(e.target.value);
                              setLocalRdMaturity(newM);
                            }}
                            className="w-full bg-transparent border-none focus:ring-0 text-slate-600 p-0"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input 
                            type="number"
                            value={row.year3}
                            onChange={(e) => {
                              const newM = [...localRdMaturity];
                              newM[idx].year3 = Number(e.target.value);
                              setLocalRdMaturity(newM);
                            }}
                            className="w-full bg-transparent border-none focus:ring-0 text-slate-600 p-0"
                          />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => {
                              if (window.confirm('Delete this row?')) {
                                setLocalRdMaturity(localRdMaturity.filter((_: any, i: number) => i !== idx));
                              }
                            }}
                            className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(!localRdMaturity || localRdMaturity.length === 0) && (
                  <div className="p-20 text-center text-slate-400 font-medium">
                    No data entries yet. Click "Add Row" to begin.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'loans' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Loan Schemes</h2>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setLocalLoans(JSON.parse(JSON.stringify(loans)))}
                    className="text-gray-500 hover:text-gray-700 font-bold text-sm px-4"
                  >
                    Discard Changes
                  </button>
                  <button 
                    onClick={() => {
                      const newId = localLoans.length > 0 ? Math.max(...localLoans.map((l: any) => l.id)) + 1 : 1;
                      setLocalLoans([...localLoans, { id: newId, name: { marathi: '', english: '' }, rate: '', description: { marathi: '', english: '' } }]);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-green-700"
                  >
                    <Plus size={18} /> Add New
                  </button>
                  <button onClick={() => save('loans', localLoans)} className="bg-blue-900 text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-800">
                    <Save size={18} /> Save Changes
                  </button>
                </div>
              </div>
              <div className="space-y-6">
                {(localLoans || []).map((l: any, idx: number) => (
                  <div key={l.id} className="p-6 bg-slate-50 rounded-2xl border border-gray-100 relative group">
                    <button 
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this loan scheme?')) {
                          const newL = localLoans.filter((_: any, i: number) => i !== idx);
                          setLocalLoans(newL);
                        }
                      }}
                      className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-400">Name (Marathi)</label>
                        <input 
                          value={l.name.marathi}
                          onChange={(e) => {
                            const newL = [...localLoans];
                            newL[idx].name.marathi = e.target.value;
                            setLocalLoans(newL);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400">Name (English)</label>
                        <input 
                          value={l.name.english}
                          onChange={(e) => {
                            const newL = [...localLoans];
                            newL[idx].name.english = e.target.value;
                            setLocalLoans(newL);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400">Interest Rate</label>
                        <input 
                          value={l.rate}
                          onChange={(e) => {
                            const newL = [...localLoans];
                            newL[idx].rate = e.target.value;
                            setLocalLoans(newL);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-gray-400">Description (Marathi)</label>
                        <input 
                          value={l.description?.marathi || ''}
                          onChange={(e) => {
                            const newL = [...localLoans];
                            if (!newL[idx].description) newL[idx].description = { marathi: '', english: '' };
                            newL[idx].description.marathi = e.target.value;
                            setLocalLoans(newL);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-gray-400">Description (English)</label>
                        <input 
                          value={l.description?.english || ''}
                          onChange={(e) => {
                            const newL = [...localLoans];
                            if (!newL[idx].description) newL[idx].description = { marathi: '', english: '' };
                            newL[idx].description.english = e.target.value;
                            setLocalLoans(newL);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'enquiries' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Enquiries & Messages</h2>
                <button onClick={fetchEnquiries} className="text-blue-600 hover:text-blue-800 font-bold text-sm">
                  Refresh
                </button>
              </div>
              
              <div className="space-y-6">
                {enquiries.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-gray-200">
                    <Mail size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No enquiries found.</p>
                  </div>
                ) : (
                  enquiries.map((e: any) => (
                    <div key={e.id} className="p-6 bg-slate-50 rounded-2xl border border-gray-100 relative group">
                      <button 
                        onClick={() => deleteEnquiry(e.id)}
                        className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-blue-900">{e.name}</h3>
                          <div className="flex flex-wrap gap-4 mt-1">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Mail size={12} /> {e.email}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Phone size={12} /> {e.phone}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            {new Date(e.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-gray-100">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest text-[10px] mb-2">Message</p>
                        <p className="text-gray-700 whitespace-pre-wrap">{e.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

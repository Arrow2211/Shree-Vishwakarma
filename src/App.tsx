import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Globe, Phone, Mail, MapPin, Menu, X, ShieldCheck, TrendingUp, Users, Landmark, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Deposits from './pages/Deposits';
import Loans from './pages/Loans';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState('home');
  const location = useLocation();

  const navItems = [
    { name: t('nav.home'), path: 'home' },
    { name: t('nav.about'), path: 'about' },
    { name: t('nav.deposits'), path: 'deposits' },
    { name: t('nav.loans'), path: 'loans' },
    { name: t('nav.contact'), path: 'contact' },
  ];

  React.useEffect(() => {
    if (location.pathname !== '/') return;

    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    navItems.forEach(item => {
      const element = document.getElementById(item.path);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [location.pathname, navItems]);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Top Bar - Traditional Bank Style */}
      <div className="bg-primary-dark text-white/70 py-2 hidden sm:block border-b border-white/5">
        <div className="section-container flex justify-between items-center text-[11px] font-medium tracking-wide">
          <div className="flex space-x-4 md:space-x-6">
            <span className="flex items-center"><Phone size={12} className="mr-2 text-[#C5A059]" /> {t('contact.phone')}</span>
            <span className="flex items-center"><Mail size={12} className="mr-2 text-[#C5A059]" /> {t('contact.email')}</span>
          </div>
          <div className="flex space-x-4 md:space-x-6 items-center">
            <Link to="/admin" className="hover:text-accent transition-colors flex items-center">
              <ShieldCheck size={12} className="mr-1" />
              {t('nav.staffLogin') || 'Staff Login'}
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-primary text-white border-b border-primary-dark">
        <div className="section-container">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group" onClick={() => scrollToSection('home')}>
                {t('header.logoUrl') && (
                  <img 
                    src={t('header.logoUrl')} 
                    alt="Logo" 
                    className="h-12 w-12 mr-3 object-contain"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold leading-tight tracking-tight group-hover:text-accent transition-colors">
                    {t('header.bankName')}
                  </span>
                  <span className="text-[10px] md:text-[11px] font-medium text-slate-400">
                    {t('header.tagline')}
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-6 lg:space-x-8 items-center">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => scrollToSection(item.path)}
                  className={`text-[13px] lg:text-sm font-semibold hover:text-accent transition-colors relative py-2 ${
                    activeSection === item.path ? 'text-accent' : ''
                  }`}
                >
                  {item.name}
                  {activeSection === item.path && (
                    <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-accent" />
                  )}
                </button>
              ))}
              <button
                onClick={() => setLanguage(language === 'marathi' ? 'english' : 'marathi')}
                className="flex items-center space-x-2 bg-primary-dark px-3 py-2 rounded text-sm font-semibold border border-white/10 hover:bg-white/10 transition-colors"
              >
                <Globe size={16} className="text-accent" />
                <span>{language === 'marathi' ? 'English' : 'मराठी'}</span>
              </button>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-3">
              <button
                onClick={() => setLanguage(language === 'marathi' ? 'english' : 'marathi')}
                className="text-xs font-semibold bg-primary-dark px-3 py-2 rounded border border-white/10 text-accent"
              >
                {language === 'marathi' ? 'EN' : 'मराठी'}
              </button>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="text-white p-2 hover:bg-white/5 rounded-full transition-colors"
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden bg-[#002244] border-t border-white/5 overflow-hidden shadow-2xl"
          >
            <div className="px-6 pt-4 pb-10 space-y-1">
              {navItems.map((item, idx) => (
                <motion.button
                  key={item.path}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => scrollToSection(item.path)}
                  className={`flex items-center justify-between w-full text-left px-4 py-4 rounded-xl text-base font-bold transition-all ${
                    activeSection === item.path 
                      ? 'bg-primary text-white border-l-4 border-accent' 
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span>{item.name}</span>
                  <ArrowRight size={16} className={`transition-transform ${activeSection === item.path ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
                </motion.button>
              ))}
              
              <div className="pt-6 mt-6 border-t border-white/5">
                <div className="flex items-center space-x-4 px-4 text-blue-200/40">
                  <Phone size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{t('contact.phone')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Footer = () => {
  const { language, t } = useLanguage();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#002244] text-white pt-16 md:pt-20 pb-10 border-t-4 border-[#C5A059]">
      <div className="section-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center mb-6">
              {t('header.logoUrl') && (
                <img 
                  src={t('header.logoUrl')} 
                  alt="Logo" 
                  className="h-10 w-10 mr-3 object-contain"
                  referrerPolicy="no-referrer"
                />
              )}
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">
                {t('header.bankName')}
              </h3>
            </div>
            <p className="text-blue-200/60 text-sm mb-8 max-w-md leading-relaxed">
              {t('hero.tagline')} {language === 'marathi' ? 'आम्ही तुमच्या आर्थिक प्रगतीसाठी कटिबद्ध आहोत.' : 'We are committed to your financial progress.'}
            </p>
            <div className="flex items-center space-x-4 p-4 bg-[#003366] rounded border border-white/5 inline-flex">
              <ShieldCheck className="text-[#C5A059] flex-shrink-0" size={28} />
              <div>
                <p className="text-[8px] sm:text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-blue-200">ISO 9001:2015 Certified</p>
                <p className="text-[10px] sm:text-xs font-bold">{t('about.regNo')}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-6 md:mb-8">{t('nav.contact')}</h4>
            <ul className="space-y-3 md:space-y-4 text-sm text-blue-100/80">
              <li className="flex items-start space-x-3">
                <Phone size={16} className="text-[#C5A059] mt-1 flex-shrink-0" />
                <span className="text-xs sm:text-sm">{t('contact.phone')}</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={16} className="text-[#C5A059] mt-1 flex-shrink-0" />
                <span className="text-xs sm:text-sm break-all">{t('contact.email')}</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={16} className="text-[#C5A059] mt-1 flex-shrink-0" />
                <span className="text-xs sm:text-sm leading-relaxed">{t('contact.address')}</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-6 md:mb-8">{t('nav.quickLinks')}</h4>
            <ul className="space-y-2 md:space-y-3 text-sm text-blue-100/80">
              <li><button onClick={() => scrollToSection('about')} className="hover:text-[#C5A059] transition-colors flex items-center text-xs sm:text-sm"><ArrowRight size={12} className="mr-2 opacity-50" /> {t('nav.about')}</button></li>
              <li><button onClick={() => scrollToSection('deposits')} className="hover:text-[#C5A059] transition-colors flex items-center text-xs sm:text-sm"><ArrowRight size={12} className="mr-2 opacity-50" /> {t('nav.deposits')}</button></li>
              <li><button onClick={() => scrollToSection('loans')} className="hover:text-[#C5A059] transition-colors flex items-center text-xs sm:text-sm"><ArrowRight size={12} className="mr-2 opacity-50" /> {t('nav.loans')}</button></li>
              <li><Link to="/admin" className="hover:text-[#C5A059] transition-colors opacity-50 text-[10px] sm:text-xs flex items-center"><ArrowRight size={12} className="mr-2 opacity-50" /> {t('nav.staffLogin')}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 md:mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-blue-200/40 text-center md:text-left">
          <p>© {new Date().getFullYear()} {t('header.bankName')}. All rights reserved.</p>
          <div className="flex space-x-4 md:space-x-6">
            <a href="#" className="hover:text-white transition-colors">{t('nav.privacyPolicy')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('nav.termsOfService')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const MainPage = () => {
  return (
    <>
      <div id="home"><Home /></div>
      <div id="about"><About /></div>
      <div id="deposits"><Deposits /></div>
      <div id="loans"><Loans /></div>
      <div id="contact"><Contact /></div>
    </>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
};
const AppContent = () => {
  const { loading } = useLanguage();
  const location = useLocation();

  React.useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-blue-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <ScrollToTop />
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          {/* Fallback to main page for old routes */}
          <Route path="/about" element={<MainPage />} />
          <Route path="/deposits" element={<MainPage />} />
          <Route path="/loans" element={<MainPage />} />
          <Route path="/contact" element={<MainPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <AppContent />
      </Router>
    </LanguageProvider>
  );
}

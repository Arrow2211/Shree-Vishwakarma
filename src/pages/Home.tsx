import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { TrendingUp, Users, Landmark, ShieldCheck, ArrowRight, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';

const Home = () => {
  const { t, stats, language } = useLanguage();

  const statCards = stats ? [
    { label: t('stats.totalLoans'), value: stats.totalLoans, icon: ShieldCheck },
    { label: t('stats.totalDeposits'), value: stats.totalDeposits, icon: TrendingUp },
    { label: t('stats.shareCapital'), value: stats.shareCapital, icon: Landmark },
    { label: t('stats.compositeBusiness'), value: stats.compositeBusiness, icon: Briefcase },
    { label: t('stats.totalMembers'), value: stats.totalMembers, icon: Users },
  ] : [];

  const testimonials = Array.isArray(t('testimonials')) ? t('testimonials') : [];

  return (
    <div className="overflow-x-hidden bg-surface">
      {/* Hero Section - Professional Bank Style */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50"></div>
        
        <div className="section-container relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left: Content */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-8">
                  <ShieldCheck size={14} className="text-accent" />
                  <span className="text-[11px] font-semibold text-accent uppercase tracking-wider">
                    {language === 'marathi' ? '२५ वर्षांचा गौरवशाली वारसा' : 'A Legacy of 25 Glorious Years'}
                  </span>
                </div>
                
                <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-6 leading-tight tracking-tight ${language === 'marathi' ? 'font-marathi' : ''}`}>
                  <span className="block">{t('hero.title')}</span>
                </h1>
                
                <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  {t('hero.tagline')}
                </p>
                
                <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                  <button 
                    onClick={() => {
                      const element = document.getElementById('deposits');
                      if (element) element.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="btn-primary group cursor-pointer"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      {t('hero.savingsSchemes')}
                      <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                    </span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      const element = document.getElementById('loans');
                      if (element) element.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="btn-accent cursor-pointer"
                  >
                    {t('hero.loanSchemes')}
                  </button>
                </div>
                
                {/* Trust Indicators */}
                <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap justify-center lg:justify-start gap-8 opacity-90">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-slate-50 flex items-center justify-center border border-slate-200">
                      <ShieldCheck size={18} className="text-primary" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">ISO 9001:2015</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-slate-50 flex items-center justify-center border border-slate-200">
                      <Users size={18} className="text-primary" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">1800+ Members</span>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Right: Visual */}
            <div className="flex-1 relative w-full max-w-2xl lg:max-w-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                className="relative"
              >
                <div className="relative z-10 rounded-xl overflow-hidden shadow-xl border border-slate-200">
                  <img 
                    src={t('hero.imageUrl') || "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&q=80&w=2070"} 
                    alt="Professional Banking" 
                    className="w-full h-[300px] sm:h-[400px] md:h-[550px] object-cover hover:scale-110 transition-transform duration-[2000ms]"
                    referrerPolicy="no-referrer"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-40"></div>
                </div>
                
                {/* Floating Card */}
                <motion.div
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="absolute -bottom-6 -right-4 bg-white p-4 rounded-xl shadow-lg border border-slate-100 max-w-[220px] z-20"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                      <TrendingUp size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Growth</span>
                  </div>
                  <p className="text-xs font-medium text-slate-600 leading-snug">
                    {language === 'marathi' ? 'तुमच्या प्रगतीसाठी आम्ही सदैव तत्पर' : 'Committed to your financial growth'}
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar - Professional Bank Style */}
      <section className="bg-primary-dark py-12 md:py-16 relative border-y border-white/10">
        <div className="section-container relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-y-12 lg:gap-0">
            {statCards.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="text-center text-white lg:border-r last:border-none border-white/10 px-4 flex flex-col items-center justify-center min-w-0"
              >
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-accent border border-white/20">
                    <stat.icon size={22} />
                  </div>
                </div>
                <p className="text-[11px] uppercase font-bold text-blue-200 tracking-[0.2em] mb-2 px-2 h-8 flex items-center justify-center leading-tight">
                  {stat.label}
                </p>
                <p className="text-xl sm:text-2xl font-bold tracking-tight text-white whitespace-nowrap overflow-hidden text-overflow-ellipsis">
                  {stat.label.toLowerCase().includes('member') || stat.label.toLowerCase().includes('सभासद') 
                    ? stat.value 
                    : formatCurrency(stat.value)
                  }
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Modern Grid */}
      <section className="section-padding bg-white relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-surface to-transparent"></div>
        <div className="section-container relative z-10">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {t('services.title')}
            </h2>
            <div className="w-12 h-1 bg-accent mx-auto rounded-full opacity-50"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {(Array.isArray(t('services.items')) ? t('services.items') : []).map((service: any, idx: number) => {
              const icons = [Landmark, TrendingUp, Users, ShieldCheck];
              const Icon = icons[idx % icons.length];
              return (
                <motion.div 
                  key={idx}
                  className="card-modern group p-6"
                >
                  <div className="w-12 h-12 rounded bg-slate-50 border border-slate-200 flex items-center justify-center text-primary mb-6 transition-colors">
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-3 text-primary">{service.title}</h3>
                  <p className="text-slate-500 text-sm md:text-base leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">{service.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Section - Modern Layout */}
      <section className="section-padding bg-surface relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-5 pointer-events-none"></div>
        <div className="section-container relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 md:gap-24">
            <div className="flex-1 w-full order-2 lg:order-1">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary mb-10 md:mb-16 text-center lg:text-left leading-tight tracking-tighter">
                {t('trust.title')}
              </h2>
              <div className="space-y-8 md:space-y-12">
                {(Array.isArray(t('trust.items')) ? t('trust.items') : []).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-6 md:space-x-8 group"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center text-accent shadow-sm border border-slate-100 group-hover:border-accent/30 transition-all">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full order-1 lg:order-2">
              <div className="relative">
                <div className="relative bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                  <img 
                    src={t('trust.imageUrl') || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800"} 
                    alt="Trust" 
                    className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
                  />
                  <div className="absolute bottom-6 right-6 bg-primary text-white p-6 rounded-lg shadow-lg border-b-4 border-accent hidden sm:block">
                    <p className="text-3xl md:text-4xl font-bold mb-1 block">25+</p>
                    <p className="text-xs uppercase font-semibold text-blue-100">Years of Trust</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Modern Carousel Style */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {language === 'marathi' ? 'आमच्या सभासदांचे मनोगत' : 'Member Testimonials'}
            </h2>
            <div className="w-12 h-1 bg-accent mx-auto rounded-full opacity-50"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {testimonials.map((t: any, idx: number) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="card-modern relative group"
              >
                <div className="absolute top-8 right-8 text-accent/10 group-hover:text-accent/20 transition-colors">
                  <Landmark size={80} strokeWidth={1} />
                </div>
                <div className="mb-6 text-accent/50 text-4xl font-serif leading-none">“</div>
                <p className="text-slate-700 text-base leading-relaxed mb-8 relative z-10">
                  {t.text}
                </p>
                <div className="flex items-center space-x-4 border-t border-slate-100 pt-6">
                  <div className="w-12 h-12 bg-slate-100 text-primary border border-slate-200 rounded flex items-center justify-center font-bold text-lg">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-base">{t.name}</h4>
                    <p className="text-xs text-slate-500 font-semibold">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { Landmark, Target, Eye, History, ShieldCheck, Users, TrendingUp } from 'lucide-react';

const About = () => {
  const { t, language } = useLanguage();

  return (
    <div className="bg-surface min-h-screen">
      {/* Page Header - Modern Style */}
      <div className="bg-primary py-24 md:py-40 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10 pointer-events-none"></div>
        <div className="section-container relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            {t('about.title')}
          </motion.h1>
          <div className="w-12 h-1.5 bg-accent rounded-full opacity-60"></div>
          <p className="mt-8 text-blue-100 max-w-2xl opacity-90 text-lg md:text-xl leading-relaxed">
            {language === 'marathi' 
              ? 'आमचा वारसा आणि विश्वासाची परंपरा.' 
              : 'Our legacy of trust and commitment to excellence.'}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-[-20deg] translate-x-1/2"></div>
      </div>

      <div className="section-container section-padding">
        {/* Intro Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center space-x-3 text-accent font-bold text-xs uppercase tracking-widest mb-6">
              <div className="w-8 h-[1px] bg-accent"></div>
              <span>{language === 'marathi' ? 'आमचा वारसा' : 'Our Legacy'}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 leading-tight tracking-tight">
              {language === 'marathi' ? 'आमचा इतिहास आणि परंपरा' : 'Our History & Tradition'}
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-10">
              {t('about.intro')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-white border-l-4 border-primary rounded-xl shadow-sm border border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Registration</p>
                <p className="text-lg font-bold text-slate-900">{t('about.regNo')}</p>
              </div>
              <div className="p-6 bg-white border-l-4 border-accent rounded-xl shadow-sm border border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Established</p>
                <p className="text-lg font-bold text-slate-900">{t('about.regDate')}</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="p-4 bg-white rounded-[2rem] shadow-lg relative z-10 overflow-hidden border border-slate-100">
              <img 
                src="https://plus.unsplash.com/premium_photo-1661906789703-a25a1e53180e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="History" 
                className="rounded-[1.5rem] w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-primary text-white p-8 rounded-2xl shadow-xl border-b-4 border-accent hidden md:block z-20">
              <p className="text-5xl font-bold mb-1 tracking-tight">25+</p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-accent/80">{language === 'marathi' ? 'वर्षांचा विश्वास' : 'Years of Trust'}</p>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent/5 rounded-full blur-3xl -z-10"></div>
          </motion.div>
        </div>

        {/* Mission & Vision - Modern Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-10 md:p-12 card-modern bg-white group"
          >
            <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center text-accent mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-300 border border-slate-100">
              <Target size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6 uppercase tracking-tight">
              {language === 'marathi' ? 'ध्येय (Mission)' : 'Mission'}
            </h3>
            <p className="text-slate-500 text-lg leading-relaxed">
              {t('about.mission')}
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="p-10 md:p-12 card-modern bg-white group"
          >
            <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center text-accent mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-300 border border-slate-100">
              <Eye size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6 uppercase tracking-tight">
              {language === 'marathi' ? 'दृष्टी (Vision)' : 'Vision'}
            </h3>
            <p className="text-slate-500 text-lg leading-relaxed">
              {t('about.vision')}
            </p>
          </motion.div>
        </div>

        {/* Values - Modern Grid */}
        <div className="bg-primary-dark rounded-[3rem] p-12 md:p-20 text-white text-center border-b-4 border-accent relative overflow-hidden shadow-lg mb-20">
          <div className="absolute inset-0 bg-pattern opacity-5 pointer-events-none"></div>
          <h2 className="text-2xl md:text-4xl font-bold mb-16 tracking-tight relative z-10 text-white">
            {language === 'marathi' ? 'आमची मूल्ये' : 'Our Core Values'}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            {[
              { title: language === 'marathi' ? 'प्रामाणिकपणा' : 'Integrity', icon: ShieldCheck },
              { title: language === 'marathi' ? 'पारदर्शकता' : 'Transparency', icon: Eye },
              { title: language === 'marathi' ? 'सेवाभाव' : 'Service', icon: Users },
              { title: language === 'marathi' ? 'विकास' : 'Growth', icon: TrendingUp },
            ].map((v, i) => (
              <div key={i} className="flex flex-col items-center group">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-xl mb-6 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-primary group-hover:scale-105 transition-all duration-300 backdrop-blur-sm border border-white/10">
                  <v.icon size={32} strokeWidth={1.5} />
                </div>
                <p className="font-bold text-base md:text-xl tracking-tight">{v.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

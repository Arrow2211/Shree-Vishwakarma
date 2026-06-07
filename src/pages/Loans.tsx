import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { Wallet, Home, Briefcase, Zap, Coins, UserCheck, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import EMICalculator from '../components/EMICalculator';

const Loans = () => {
  const { t, language, loans } = useLanguage();

  const getIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('mortgage') || n.includes('तारण')) return Home;
    if (n.includes('gold') || n.includes('सुवर्ण')) return Coins;
    if (n.includes('consumer') || n.includes('ग्राहक')) return Wallet;
    if (n.includes('salaried') || n.includes('पगारदार')) return Briefcase;
    if (n.includes('emergency') || n.includes('तातडीचे')) return Zap;
    return UserCheck;
  };

  return (
    <div className="bg-white">
      {/* Page Header - Professional Style */}
      <div className="bg-primary py-20 lg:py-24 text-white relative overflow-hidden">
        <div className="section-container relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tighter"
          >
            {t('nav.loans')}
          </motion.h1>
          <div className="w-12 h-1.5 bg-accent rounded-full opacity-60"></div>
          <p className="mt-8 text-blue-100 max-w-2xl opacity-90 text-base md:text-lg leading-relaxed">
            {language === 'marathi' 
              ? 'तुमच्या स्वप्नांना द्या पंख. सुलभ हप्ते आणि कमी व्याजदरात कर्ज उपलब्ध.' 
              : 'Empower your dreams with our flexible loan solutions. Competitive rates and hassle-free processing.'}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-[-20deg] translate-x-1/2"></div>
      </div>

      <div className="section-padding">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mb-16 md:mb-24">
            {Array.isArray(loans) && loans.map((loan: any) => {
              const Icon = getIcon(loan.name.english);
              return (
                <motion.div 
                  key={loan.id}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col group hover:shadow-2xl transition-all duration-300"
                >
                  <div className="p-6 md:p-10 flex-grow">
                    <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-accent mb-6 md:mb-8 border border-slate-100 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <Icon size={28} className="md:w-8 md:h-8" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3 md:mb-4 uppercase tracking-tight">{loan.name[language]}</h3>
                    <p className="text-slate-500 text-xs md:text-sm mb-6 md:mb-8 leading-relaxed opacity-80">
                      {loan.description[language]}
                    </p>
                    <div className="pt-6 md:pt-8 border-t border-slate-100">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-[9px] md:text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">
                            {language === 'marathi' ? 'व्याजदर' : 'Interest Rate'}
                          </p>
                          <p className="text-2xl md:text-3xl font-bold text-primary">{loan.rate}</p>
                        </div>
                        <div className="flex items-center gap-2 text-accent">
                          <ShieldCheck size={14} className="md:w-4 md:h-4" />
                          <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest">{language === 'marathi' ? 'सुलभ प्रक्रिया' : 'Easy Process'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 border-t border-slate-200 p-5 text-center group-hover:bg-slate-100 transition-colors">
                    <button 
                      onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                      className="text-primary font-bold text-xs uppercase tracking-widest hover:text-accent transition-colors"
                    >
                      {language === 'marathi' ? 'अधिक माहिती' : 'More Details'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mb-24">
            <EMICalculator />
          </div>

          {/* Loan Requirements Info - Corporate Style */}
          <div className="bg-slate-900 text-white rounded-2xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-10 md:p-16 border-b lg:border-b-0 lg:border-r border-white/10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-accent">
                    <FileText size={20} />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                    {language === 'marathi' ? 'आवश्यक कागदपत्रे' : 'Required Documents'}
                  </h2>
                </div>
                <ul className="space-y-6">
                  {[
                    { m: 'आधार कार्ड आणि पॅन कार्ड', e: 'Aadhar Card & PAN Card' },
                    { m: '७/१२ उतारा किंवा मालमत्ता पत्रक', e: '7/12 Extract or Property Documents' },
                    { m: 'पगार पत्रक (पगारदार असल्यास)', e: 'Salary Slip (if salaried)' },
                    { m: 'पासपोर्ट आकाराचे फोटो', e: 'Passport size photographs' },
                    { m: 'जामीनदारांची कागदपत्रे', e: 'Guarantor documents' },
                  ].map((doc, i) => (
                    <li key={i} className="flex items-start gap-4 group">
                      <div className="mt-1">
                        <CheckCircle2 size={18} className="text-accent" />
                      </div>
                      <span className="text-slate-300 group-hover:text-white transition-colors text-lg">
                        {language === 'marathi' ? doc.m : doc.e}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-10 md:p-16 bg-primary flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="bg-white/5 p-8 md:p-10 rounded-xl border border-white/5 relative z-10 backdrop-blur-sm">
                  <h3 className="text-lg font-bold text-accent mb-6 tracking-tight">
                    {language === 'marathi' ? 'महत्वाची सूचना' : 'Important Note'}
                  </h3>
                  <p className="text-slate-300 leading-relaxed opacity-90 text-base md:text-lg">
                    {language === 'marathi' 
                      ? 'कर्ज मंजुरी संस्थेच्या नियमावलीनुसार आणि कागदपत्रांच्या पडताळणीनंतरच केली जाईल. अधिक माहितीसाठी कृपया शाखेशी संपर्क साधा.' 
                      : 'Loan approval will be subject to society rules and document verification. Please contact the branch for more details.'}
                  </p>
                  <div className="mt-12 pt-10 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-1">Processing Time</p>
                      <p className="text-xl md:text-2xl font-bold">2-3 Working Days*</p>
                    </div>
                    <div className="text-[10px] text-white/40 italic">*Conditions apply</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loans;


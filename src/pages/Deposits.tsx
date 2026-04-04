import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { Landmark, Clock, UserCheck, Heart, ShieldCheck } from 'lucide-react';
import FDCalculator from '../components/FDCalculator';
import RDCalculator from '../components/RDCalculator';
import { formatCurrency } from '../utils/formatters';

const Deposits = () => {
  const { t, language, deposits, recurringDeposits, rdMaturity } = useLanguage();

  return (
    <div className="bg-white">
      {/* Page Header - Professional Style */}
      <div className="bg-primary py-20 lg:py-24 text-white relative overflow-hidden">
        <div className="section-container relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-title text-white mb-4"
          >
            {t('nav.deposits')}
          </motion.h1>
          <div className="w-12 h-1.5 bg-accent rounded-full opacity-60 mb-6"></div>
          <p className="mt-8 text-blue-100 max-w-2xl opacity-90 text-lg leading-relaxed">
            {language === 'marathi' 
              ? 'तुमच्या कष्टाच्या पैशावर मिळवा सुरक्षित आणि जास्तीत जास्त परतावा.' 
              : 'Secure your future with our competitive deposit schemes designed for maximum returns.'}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-[-20deg] translate-x-1/2"></div>
      </div>

      <div className="section-padding">
        <div className="section-container">
          {/* General Deposits Table */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden mb-20">
            <div className="bg-primary p-6 md:p-8 text-white flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-accent">
                  <Landmark size={28} />
                </div>
                <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-white">
                  {language === 'marathi' ? 'मुदत ठेव व्याजदर (सर्वसाधारण)' : 'Fixed Deposit Rates (General)'}
                </h2>
              </div>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-70 bg-white/10 px-4 py-2 rounded-full self-start md:self-auto">
                Effective from April 2026
              </span>
            </div>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 font-bold text-slate-400 uppercase tracking-wider text-[11px]">{language === 'marathi' ? 'कालावधी' : 'Period'}</th>
                    <th className="px-8 py-5 font-bold text-slate-400 uppercase tracking-wider text-[11px]">{language === 'marathi' ? 'व्याजदर (सर्वसाधारण)' : 'Rate (General)'}</th>
                    <th className="px-8 py-5 font-bold text-slate-400 uppercase tracking-wider text-[11px]">{language === 'marathi' ? 'व्याजदर (ज्येष्ठ नागरिक/विधवा)' : 'Rate (Senior/Widow)'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Array.isArray(deposits) && deposits.map((d: any) => (
                    <tr key={d.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-8 py-6 text-slate-900 font-bold">{d.name[language]}</td>
                      <td className="px-8 py-6 text-primary font-bold text-xl">{d.general}</td>
                      <td className="px-8 py-6 text-accent font-bold text-xl">{d.senior}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View for Deposits */}
            <div className="md:hidden divide-y divide-slate-100">
              {Array.isArray(deposits) && deposits.map((d: any) => (
                <div key={d.id} className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{language === 'marathi' ? 'कालावधी' : 'Period'}</span>
                    <span className="text-slate-700 font-bold text-right">{d.name[language]}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-1">{language === 'marathi' ? 'सर्वसाधारण' : 'General'}</p>
                      <p className="text-xl font-bold text-primary">{d.general}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-1">{language === 'marathi' ? 'ज्येष्ठ/विधवा' : 'Senior/Widow'}</p>
                      <p className="text-xl font-bold text-accent">{d.senior}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recurring Deposit Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 mb-20">
            <div className="lg:col-span-1 bg-primary text-white p-10 md:p-12 rounded-xl flex flex-col justify-center border-b-4 border-accent shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500"></div>
              <Clock size={48} className="mb-8 text-accent relative z-10" />
              <h2 className="text-2xl md:text-3xl font-bold mb-6 tracking-tight relative z-10 text-white">
                {language === 'marathi' ? 'पुनरावृत्ती ठेव (RD)' : 'Recurring Deposit (RD)'}
              </h2>
              <p className="text-slate-300 leading-relaxed mb-10 relative z-10">
                {language === 'marathi' 
                  ? 'नियमित बचतीसाठी सर्वोत्तम पर्याय. दरमहिन्याला ठराविक रक्कम जमा करा आणि भविष्यासाठी मोठी पुंजी उभारा.' 
                  : 'Build your savings systematically with our Recurring Deposit scheme. Perfect for long-term financial goals and disciplined saving.'}
              </p>
              <div className="pt-8 border-t border-white/10 relative z-10">
                <p className="text-[10px] uppercase font-bold tracking-widest text-accent mb-2">Minimum Monthly Deposit</p>
                <p className="text-2xl font-bold text-white">₹500 / Month</p>
              </div>
            </div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 p-6 md:p-8 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="font-bold text-slate-900 uppercase tracking-widest text-xs">RD Interest Structure</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-white px-3 py-1 rounded border border-slate-200">Monthly Compounding</span>
              </div>
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left min-w-[400px]">
                  <thead>
                    <tr className="bg-white border-b border-slate-100">
                      <th className="px-8 py-6 font-bold text-slate-400 uppercase tracking-widest text-[10px]">{language === 'marathi' ? 'कालावधी' : 'Period'}</th>
                      <th className="px-8 py-6 font-bold text-slate-400 uppercase tracking-widest text-[10px]">{language === 'marathi' ? 'व्याजदर' : 'Interest Rate'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {(Array.isArray(recurringDeposits) ? recurringDeposits : []).map((rd: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6 text-slate-700 font-medium">{rd.period[language]}</td>
                        <td className="px-8 py-6 text-primary font-bold text-2xl">{rd.rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View for RD */}
              <div className="sm:hidden divide-y divide-slate-50">
                {(Array.isArray(recurringDeposits) ? recurringDeposits : []).map((rd: any, i: number) => (
                  <div key={i} className="p-6 flex justify-between items-center">
                    <div>
                      <p className="text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-1">{language === 'marathi' ? 'कालावधी' : 'Period'}</p>
                      <p className="text-slate-700 font-bold">{rd.period[language]}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-1">{language === 'marathi' ? 'व्याजदर' : 'Rate'}</p>
                      <p className="text-2xl font-bold text-primary">{rd.rate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RD Maturity Table - New Section from Image */}
          <div className="mb-24 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-primary p-6 md:p-8 text-white border-b border-white/5">
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                {language === 'marathi' ? 'आरडी परिपक्वता रक्कम कोष्टक' : 'RD Maturity Amount Table'}
              </h3>
              <p className="text-slate-400 text-sm mt-2 opacity-80">
                {language === 'marathi' ? '* वरील आकडे व्याजाच्या अंदाजित दरावर आधारित आहेत.' : '* Maturity amounts are indicative based on interest rates.'}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-8 py-5 font-bold text-slate-400 uppercase tracking-wider text-[11px]">{language === 'marathi' ? 'रक्कम' : 'Amount'}</th>
                    <th className="px-8 py-5 font-bold text-slate-400 uppercase tracking-wider text-[11px]">{language === 'marathi' ? '१ वर्ष' : '1 Year'}</th>
                    <th className="px-8 py-5 font-bold text-slate-400 uppercase tracking-wider text-[11px]">{language === 'marathi' ? '२ वर्ष' : '2 Years'}</th>
                    <th className="px-8 py-5 font-bold text-slate-400 uppercase tracking-wider text-[11px]">{language === 'marathi' ? '३ वर्ष' : '3 Years'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(Array.isArray(rdMaturity) ? rdMaturity : []).map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-5 text-primary font-bold bg-slate-50/30">{formatCurrency(row.amount)}</td>
                      <td className="px-8 py-5 text-slate-700 font-medium tracking-tight">{formatCurrency(row.year1)}</td>
                      <td className="px-8 py-5 text-slate-700 font-medium tracking-tight">{formatCurrency(row.year2)}</td>
                      <td className="px-8 py-5 text-slate-700 font-medium tracking-tight">{formatCurrency(row.year3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-24">
            <FDCalculator />
          </div>

          <div className="mb-24">
            <RDCalculator />
          </div>

          {/* Features - Corporate Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: language === 'marathi' ? 'ज्येष्ठ नागरिक सवलत' : 'Senior Citizen Benefit', desc: language === 'marathi' ? 'ज्येष्ठ नागरिकांसाठी जादा व्याजदर आणि विशेष सन्मान.' : 'Preferential interest rates and dedicated support for our senior members.', icon: UserCheck },
              { title: language === 'marathi' ? 'विधवा सवलत' : 'Widow Benefit', desc: language === 'marathi' ? 'विधवा भगिनींसाठी विशेष व्याजदर आणि आर्थिक पाठबळ.' : 'Special financial support and higher rates for widows to ensure security.', icon: Heart },
              { title: language === 'marathi' ? 'सुरक्षित गुंतवणूक' : 'Safe Investment', desc: language === 'marathi' ? 'तुमची ठेव पूर्णपणे सुरक्षित आणि शासनाच्या नियमांनुसार संरक्षित.' : 'Your hard-earned money is fully protected and insured as per regulations.', icon: ShieldCheck },
            ].map((f, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -5 }}
                className="bg-white p-10 rounded-lg border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-accent mb-8 border border-slate-100 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <f.icon size={36} strokeWidth={1} />
                </div>
                <h3 className="font-bold text-slate-900 text-xl mb-4 uppercase tracking-tight">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposits;

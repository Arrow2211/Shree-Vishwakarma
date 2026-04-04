import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TrendingUp } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const FDCalculator: React.FC = () => {
  const { language } = useLanguage();
  const [depositAmount, setDepositAmount] = useState<number>(100000);
  const [interestRate, setInterestRate] = useState<number>(7.5);
  const [tenure, setTenure] = useState<number>(1);
  const [compoundingFrequency, setCompoundingFrequency] = useState<number>(4); // Default quarterly
  const [maturityAmount, setMaturityAmount] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);

  useEffect(() => {
    // A = P(1 + r/n)^(nt)
    const n = compoundingFrequency;
    const r = interestRate / 100;
    const t = tenure;
    const amount = depositAmount * Math.pow(1 + r/n, n * t);
    
    if (isFinite(amount)) {
      setMaturityAmount(Math.round(amount));
      setTotalInterest(Math.round(amount - depositAmount));
    }
  }, [depositAmount, interestRate, tenure, compoundingFrequency]);

  const labels = {
    title: language === 'marathi' ? 'मुदत ठेव (FD) कॅल्क्युलेटर' : 'Fixed Deposit (FD) Calculator',
    depositAmount: language === 'marathi' ? 'ठेव रक्कम' : 'Deposit Amount',
    interestRate: language === 'marathi' ? 'व्याज दर (%)' : 'Interest Rate (%)',
    tenure: language === 'marathi' ? 'कालावधी (वर्षे)' : 'Tenure (Years)',
    compounding: language === 'marathi' ? 'व्याज चक्रवाढ' : 'Compounding Frequency',
    monthly: language === 'marathi' ? 'मासिक' : 'Monthly',
    quarterly: language === 'marathi' ? 'त्रैमासिक' : 'Quarterly',
    halfYearly: language === 'marathi' ? 'सहामाही' : 'Half-Yearly',
    yearly: language === 'marathi' ? 'वार्षिक' : 'Yearly',
    maturityAmount: language === 'marathi' ? 'परिपक्वता रक्कम' : 'Maturity Amount',
    totalInterest: language === 'marathi' ? 'एकूण व्याज' : 'Total Interest',
    currency: language === 'marathi' ? '₹' : '₹',
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 max-w-4xl mx-auto">
      <div className="bg-primary p-6 text-white flex items-center gap-3">
        <TrendingUp className="text-accent" />
        <h2 className="text-xl font-bold uppercase tracking-wider">{labels.title}</h2>
      </div>
      
      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div className="space-y-8">
          <div>
            <div className="flex justify-between mb-4">
              <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">{labels.depositAmount}</label>
              <div className="flex items-center gap-1">
                <span className="text-primary font-bold">{labels.currency}</span>
                <input
                  type="number"
                  value={depositAmount || ''}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-24 text-right text-primary font-bold bg-transparent border-b border-slate-200 focus:border-accent outline-none"
                />
              </div>
            </div>
            <input 
              type="range" 
              min="1000" 
              max="10000000" 
              step="1000"
              value={depositAmount}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-bold">
              <span>{labels.currency} 1K</span>
              <span>{labels.currency} 1Cr</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between mb-4">
                <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">{labels.interestRate}</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={interestRate || ''}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-16 text-right text-primary font-bold bg-transparent border-b border-slate-200 focus:border-accent outline-none"
                  />
                  <span className="text-primary font-bold">%</span>
                </div>
              </div>
              <input 
                type="range" 
                min="1" 
                max="15" 
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div>
              <div className="flex justify-between mb-4">
                <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">{labels.tenure}</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={tenure || ''}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-16 text-right text-primary font-bold bg-transparent border-b border-slate-200 focus:border-accent outline-none"
                  />
                  <span className="text-primary font-bold">Yrs</span>
                </div>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                step="1"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 uppercase tracking-wider mb-4">{labels.compounding}</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: labels.monthly, value: 12 },
                { label: labels.quarterly, value: 4 },
                { label: labels.halfYearly, value: 2 },
                { label: labels.yearly, value: 1 },
              ].map((freq) => (
                <button
                  key={freq.value}
                  onClick={() => setCompoundingFrequency(freq.value)}
                  className={`py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border ${
                    compoundingFrequency === freq.value
                      ? 'bg-primary text-white border-primary shadow-md'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-accent hover:text-accent'
                  }`}
                >
                  {freq.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-8 rounded-2xl flex flex-col justify-center space-y-6 border border-slate-100">
          <div className="text-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{labels.maturityAmount}</p>
            <p className="text-4xl font-black text-primary">{formatCurrency(maturityAmount)}</p>
          </div>
          
          <div className="h-px bg-slate-200 w-full"></div>
          
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{labels.totalInterest}</p>
            <p className="text-2xl font-bold text-green-600">+{formatCurrency(totalInterest)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FDCalculator;

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Calculator } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const EMICalculator: React.FC = () => {
  const { language } = useLanguage();
  const [loanAmount, setLoanAmount] = useState<number>(500000);
  const [interestRate, setInterestRate] = useState<number>(10.5);
  const [tenure, setTenure] = useState<number>(5);
  const [emi, setEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);

  useEffect(() => {
    const r = interestRate / 12 / 100;
    const n = tenure * 12;
    const emiValue = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    
    if (isFinite(emiValue)) {
      setEmi(Math.round(emiValue));
      const totalPay = emiValue * n;
      setTotalPayment(Math.round(totalPay));
      setTotalInterest(Math.round(totalPay - loanAmount));
    }
  }, [loanAmount, interestRate, tenure]);

  const labels = {
    title: language === 'marathi' ? 'ईएमआय कॅल्क्युलेटर' : 'EMI Calculator',
    loanAmount: language === 'marathi' ? 'कर्जाची रक्कम' : 'Loan Amount',
    interestRate: language === 'marathi' ? 'व्याज दर (%)' : 'Interest Rate (%)',
    tenure: language === 'marathi' ? 'कालावधी (वर्षे)' : 'Tenure (Years)',
    monthlyEmi: language === 'marathi' ? 'मासिक हप्ता (EMI)' : 'Monthly EMI',
    totalInterest: language === 'marathi' ? 'एकूण व्याज' : 'Total Interest',
    totalPayment: language === 'marathi' ? 'एकूण देय रक्कम' : 'Total Payment',
    currency: language === 'marathi' ? '₹' : '₹',
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 max-w-4xl mx-auto">
      <div className="bg-primary p-6 text-white flex items-center gap-3">
        <Calculator className="text-accent" />
        <h2 className="text-xl font-bold uppercase tracking-wider">{labels.title}</h2>
      </div>
      
      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div className="space-y-8">
          <div>
            <div className="flex justify-between mb-4">
              <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">{labels.loanAmount}</label>
              <div className="flex items-center gap-1">
                <span className="text-primary font-bold">{labels.currency}</span>
                <input
                  type="number"
                  value={loanAmount || ''}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-24 text-right text-primary font-bold bg-transparent border-b border-slate-200 focus:border-accent outline-none"
                />
              </div>
            </div>
            <input 
              type="range" 
              min="10000" 
              max="5000000" 
              step="10000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-bold">
              <span>{labels.currency} 10K</span>
              <span>{labels.currency} 50L</span>
            </div>
          </div>

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
              min="5" 
              max="20" 
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-bold">
              <span>5%</span>
              <span>20%</span>
            </div>
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
              max="30" 
              step="1"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-bold">
              <span>1 Yr</span>
              <span>30 Yrs</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-8 rounded-2xl flex flex-col justify-center space-y-6 border border-slate-100">
          <div className="text-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{labels.monthlyEmi}</p>
            <p className="text-4xl font-black text-primary">{formatCurrency(emi)}</p>
          </div>
          
          <div className="h-px bg-slate-200 w-full"></div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{labels.totalInterest}</p>
              <p className="text-lg font-bold text-slate-700">{formatCurrency(totalInterest)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{labels.totalPayment}</p>
              <p className="text-lg font-bold text-slate-700">{formatCurrency(totalPayment)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;

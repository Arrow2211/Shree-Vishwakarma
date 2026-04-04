import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Landmark } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const RDCalculator: React.FC = () => {
  const { language } = useLanguage();
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(5000);
  const [interestRate, setInterestRate] = useState<number>(7.0);
  const [tenureMonths, setTenureMonths] = useState<number>(12);
  const [maturityAmount, setMaturityAmount] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalInvestment, setTotalInvestment] = useState<number>(0);

  useEffect(() => {
    // Standard RD Maturity Formula (Quarterly Compounding)
    // M = R * [(1+i)^n - 1] / [1 - (1+i)^(-1/3)]
    // where i = r/400, n = number of quarters
    
    const R = monthlyDeposit;
    const i = interestRate / 400;
    const n = tenureMonths / 3; // Number of quarters
    
    const amount = R * (Math.pow(1 + i, n) - 1) / (1 - Math.pow(1 + i, -1/3));
    
    if (isFinite(amount)) {
      setMaturityAmount(Math.round(amount));
      const totalInv = monthlyDeposit * tenureMonths;
      setTotalInvestment(totalInv);
      setTotalInterest(Math.round(amount - totalInv));
    }
  }, [monthlyDeposit, interestRate, tenureMonths]);

  const labels = {
    title: language === 'marathi' ? 'पुनरावृत्ती ठेव (RD) कॅल्क्युलेटर' : 'Recurring Deposit (RD) Calculator',
    monthlyDeposit: language === 'marathi' ? 'मासिक ठेव' : 'Monthly Deposit',
    interestRate: language === 'marathi' ? 'व्याज दर (%)' : 'Interest Rate (%)',
    tenure: language === 'marathi' ? 'कालावधी (महिने)' : 'Tenure (Months)',
    maturityAmount: language === 'marathi' ? 'परिपक्वता रक्कम' : 'Maturity Amount',
    totalInterest: language === 'marathi' ? 'एकूण व्याज' : 'Total Interest',
    totalInvestment: language === 'marathi' ? 'एकूण गुंतवणूक' : 'Total Investment',
    currency: language === 'marathi' ? '₹' : '₹',
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 max-w-4xl mx-auto">
      <div className="bg-primary p-6 text-white flex items-center gap-3">
        <Landmark className="text-accent" />
        <h2 className="text-xl font-bold uppercase tracking-wider">{labels.title}</h2>
      </div>
      
      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div className="space-y-8">
          <div>
            <div className="flex justify-between mb-4">
              <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">{labels.monthlyDeposit}</label>
              <div className="flex items-center gap-1">
                <span className="text-primary font-bold">{labels.currency}</span>
                <input
                  type="number"
                  value={monthlyDeposit || ''}
                  onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                  className="w-24 text-right text-primary font-bold bg-transparent border-b border-slate-200 focus:border-accent outline-none"
                />
              </div>
            </div>
            <input 
              type="range" 
              min="500" 
              max="100000" 
              step="500"
              value={monthlyDeposit}
              onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-bold">
              <span>{labels.currency} 500</span>
              <span>{labels.currency} 1L</span>
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
                    value={tenureMonths || ''}
                    onChange={(e) => setTenureMonths(Number(e.target.value))}
                    className="w-16 text-right text-primary font-bold bg-transparent border-b border-slate-200 focus:border-accent outline-none"
                  />
                  <span className="text-primary font-bold">Mo</span>
                </div>
              </div>
              <input 
                type="range" 
                min="6" 
                max="120" 
                step="6"
                value={tenureMonths}
                onChange={(e) => setTenureMonths(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-8 rounded-2xl flex flex-col justify-center space-y-6 border border-slate-100">
          <div className="text-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{labels.maturityAmount}</p>
            <p className="text-4xl font-black text-primary">{formatCurrency(maturityAmount)}</p>
          </div>
          
          <div className="h-px bg-slate-200 w-full"></div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{labels.totalInvestment}</p>
              <p className="text-lg font-bold text-gray-800">{formatCurrency(totalInvestment)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{labels.totalInterest}</p>
              <p className="text-lg font-bold text-green-600">+{formatCurrency(totalInterest)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RDCalculator;

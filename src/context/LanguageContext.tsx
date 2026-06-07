import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultContent } from '../data/defaultContent';

type Language = 'marathi' | 'english';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => any;
  content: any;
  stats: any;
  deposits: any;
  recurringDeposits: any;
  loans: any;
  rdMaturity: any;
  loading: boolean;
  refreshData: () => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('marathi');
  const [content, setContent] = useState<any>(defaultContent);
  const [stats, setStats] = useState<any>({
    shareCapital: "₹31,46,00,000",
    totalDeposits: "₹21,65,00,000",
    totalLoans: "₹17,68,00,000",
    totalMembers: "1800+",
    compositeBusiness: "₹39,33,00,000"
  });
  const [deposits, setDeposits] = useState<any>([]);
  const [recurringDeposits, setRecurringDeposits] = useState<any>([]);
  const [loans, setLoans] = useState<any>([]);
  const [rdMaturity, setRdMaturity] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    // Safety timeout to ensure loading state is cleared
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 5000);

    try {
      const fetchJson = async (url: string) => {
        try {
          const res = await fetch(url);
          if (!res.ok) {
            console.warn(`Fetch failed for ${url}: ${res.status} ${res.statusText}`);
            return null;
          }
          return await res.json();
        } catch (e) {
          console.error(`Error fetching ${url}:`, e);
          return null;
        }
      };

      const [contentRes, statsRes, depositsRes, recurringRes, loansRes, rdMaturityRes] = await Promise.all([
        fetchJson('/api/content'),
        fetchJson('/api/stats'),
        fetchJson('/api/deposits'),
        fetchJson('/api/recurring-deposits'),
        fetchJson('/api/loans'),
        fetchJson('/api/rd-maturity'),
      ]);

      clearTimeout(timeoutId);

      // Normalize content arrays (in case they were stored/returned as objects with numeric keys)
      if (contentRes && contentRes.marathi) {
        ['marathi', 'english'].forEach(lang => {
          if (contentRes[lang]) {
            // Normalize testimonials
            if (contentRes[lang].testimonials && !Array.isArray(contentRes[lang].testimonials)) {
              contentRes[lang].testimonials = Object.values(contentRes[lang].testimonials);
            }
            // Normalize services.items
            if (contentRes[lang].services?.items && !Array.isArray(contentRes[lang].services.items)) {
              contentRes[lang].services.items = Object.values(contentRes[lang].services.items);
            }
            // Normalize trust.items
            if (contentRes[lang].trust?.items && !Array.isArray(contentRes[lang].trust.items)) {
              contentRes[lang].trust.items = Object.values(contentRes[lang].trust.items);
            }
          }
        });
      }

      console.log('API Responses Received:', { 
        content: !!contentRes, 
        stats: !!statsRes, 
        deposits: Array.isArray(depositsRes) ? depositsRes.length : 'not array',
        recurring: Array.isArray(recurringRes) ? recurringRes.length : 'not array',
        loans: Array.isArray(loansRes) ? loansRes.length : 'not array',
        rdMaturity: Array.isArray(rdMaturityRes) ? rdMaturityRes.length : 'not array'
      });

      if (contentRes && !contentRes.error && Object.keys(contentRes.marathi || {}).length > 0) {
        setContent(contentRes);
      } else {
        console.warn('Content data is missing or invalid, using default content');
      }

      if (statsRes && !statsRes.error) {
        setStats(statsRes);
      }

      if (Array.isArray(depositsRes)) setDeposits(depositsRes);
      else if (depositsRes && typeof depositsRes === 'object') setDeposits(Object.values(depositsRes));

      if (Array.isArray(recurringRes)) setRecurringDeposits(recurringRes);
      else if (recurringRes && typeof recurringRes === 'object') setRecurringDeposits(Object.values(recurringRes));

      if (Array.isArray(loansRes)) setLoans(loansRes);
      else if (loansRes && typeof loansRes === 'object') setLoans(Object.values(loansRes));

      if (Array.isArray(rdMaturityRes)) setRdMaturity(rdMaturityRes);
      else if (rdMaturityRes && typeof rdMaturityRes === 'object') setRdMaturity(Object.values(rdMaturityRes));
    } catch (error) {
      console.error('Error in fetchData:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const t = (path: string) => {
    // Special handlings for stats labels to ensure correctness even if DB is stale
    if (language === 'marathi') {
      if (path === 'stats.shareCapital') return "खेळते भागभांडवल";
      if (path === 'stats.compositeBusiness') return "संमिश्र व्यवसाय";
    }

    if (!content) return `[${path}]`;
    const keys = path.split('.');
    let result = content[language];
    for (const key of keys) {
      if (result && result[key] !== undefined) {
        result = result[key];
      } else {
        // Final fallback for new keys
        if (path === 'stats.compositeBusiness') return language === 'marathi' ? "संमिश्र व्यवसाय" : "Composite Business";
        console.warn(`Translation missing for key: ${path} in language: ${language}`);
        return `[${path}]`;
      }
    }
    return result;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      content, 
      stats, 
      deposits, 
      recurringDeposits,
      loans, 
      rdMaturity,
      loading,
      refreshData: fetchData
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

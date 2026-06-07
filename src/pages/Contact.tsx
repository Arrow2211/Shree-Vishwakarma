import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Send, CheckCircle, Clock } from 'lucide-react';

const Contact = () => {
  const { t, language } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        const data = await res.json();
        alert(`Error: ${data.error || 'Failed to send message'}`);
      }
    } catch (err) {
      alert('Error connecting to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            {t('contact.title')}
          </motion.h1>
          <div className="w-12 h-1.5 bg-accent rounded-full opacity-60"></div>
          <p className="mt-8 text-blue-100 max-w-2xl opacity-90 text-lg leading-relaxed">
            {language === 'marathi' 
              ? 'आम्ही तुमच्या सेवेसाठी सदैव तत्पर आहोत. कोणत्याही शंका किंवा मदतीसाठी संपर्क साधा.' 
              : 'We are here to help you. Reach out to us for any queries or assistance regarding our services.'}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-[-20deg] translate-x-1/2"></div>
      </div>

      <div className="section-padding">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info & Map */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 hover:shadow-lg transition-all group">
                  <div className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent transition-colors">
                    <MapPin size={24} />
                  </div>
                  <h3 className="font-bold text-slate-900 uppercase tracking-widest text-xs mb-4">{language === 'marathi' ? 'मुख्य कार्यालय' : 'Main Office'}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{t('contact.address')}</p>
                </div>
                <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 hover:shadow-lg transition-all group">
                  <div className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent transition-colors">
                    <Phone size={24} />
                  </div>
                  <h3 className="font-bold text-slate-900 uppercase tracking-widest text-xs mb-4">{language === 'marathi' ? 'संपर्क' : 'Contact'}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-bold mb-1">{t('contact.phone')}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{t('contact.email')}</p>
                </div>
                <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 md:col-span-2 hover:shadow-lg transition-all group">
                  <div className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent transition-colors">
                    <Clock size={24} />
                  </div>
                  <h3 className="font-bold text-slate-900 uppercase tracking-widest text-xs mb-4">{language === 'marathi' ? 'कामाची वेळ' : 'Working Hours'}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg border border-slate-100">
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Mon - Sat</p>
                      <p className="text-slate-700 font-bold">10:00 AM - 05:00 PM</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100">
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Sunday</p>
                      <p className="text-red-500 font-bold">Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="bg-slate-100 h-96 rounded-2xl overflow-hidden border border-slate-200 shadow-2xl relative group">
                {t('contact.googleMapsUrl') ? (
                  <iframe
                    src={t('contact.googleMapsUrl')}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    title="Google Maps"
                    className="w-full h-full transition-all duration-700"
                  ></iframe>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400 flex-col gap-4">
                    <MapPin size={48} strokeWidth={1} />
                    <p className="uppercase tracking-widest text-xs font-bold">Map View Unavailable</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl border border-slate-100 relative overflow-hidden h-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-accent"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/2 -z-10"></div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-10 tracking-tight flex items-center gap-3">
                  <span className="w-8 h-1 bg-accent rounded-full"></span>
                  {language === 'marathi' ? 'आम्हाला संदेश पाठवा' : 'Send us a Message'}
                </h2>
                
                {submitted ? (
                  <div className="bg-slate-50 border border-slate-200 p-12 rounded-xl text-center h-[calc(100%-100px)] flex flex-col justify-center">
                    <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-200">
                      <CheckCircle size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-widest">
                      {language === 'marathi' ? 'धन्यवाद!' : 'Thank You!'}
                    </h3>
                    <p className="text-slate-500 leading-relaxed text-lg">
                      {language === 'marathi' 
                        ? 'तुमचा संदेश आम्हाला मिळाला आहे. आम्ही लवकरच तुमच्याशी संपर्क करू.' 
                        : 'We have received your message. Our representative will get back to you shortly.'}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest ml-1">{t('contact.form.name')}</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all text-slate-700 font-medium"
                        placeholder={language === 'marathi' ? 'तुमचे पूर्ण नाव' : 'Your full name'}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest ml-1">{t('contact.form.email')}</label>
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all text-slate-700 font-medium"
                          placeholder="example@mail.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest ml-1">{language === 'marathi' ? 'मोबाईल नंबर' : 'Mobile Number'}</label>
                        <input 
                          type="tel" 
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all text-slate-700 font-medium"
                          placeholder={language === 'marathi' ? 'तुमचा मोबाईल नंबर' : 'Your mobile number'}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest ml-1">{t('contact.form.message')}</label>
                      <textarea 
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all text-slate-700 font-medium resize-none"
                        placeholder={language === 'marathi' ? 'तुमचा संदेश येथे लिहा...' : 'Write your message here...'}
                      ></textarea>
                    </div>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg flex items-center justify-center gap-3 group disabled:opacity-50"
                    >
                      <span>{isSubmitting ? (language === 'marathi' ? 'पाठवत आहे...' : 'Sending...') : t('contact.form.submit')}</span>
                      {!isSubmitting && <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;


import React, { useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Mail, Clock, Send, CheckCircle2, User, Award, Briefcase } from 'lucide-react';

const Contact = () => {
  const { t, lang } = useLanguage();
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contact`, formData);
      setSuccess(true);
      setFormData({ name: '', phone: '', message: '' });
    } catch (err) {
      console.error('Contact form error:', err);
      setError(t('contactPage.failSend'));
    } finally {
      setLoading(false);
    }
  };

  const contactItems = [
    { icon: <Phone size={24} />, label: t('contactPage.channels.call'), value: "+91 98765 43210", color: "bg-blue-100 text-blue-600", link: "tel:+919876543210" },
    { icon: <MessageCircle size={24} />, label: t('contactPage.channels.whatsapp'), value: "+91 98765 43210", color: "bg-green-100 text-green-600", link: "https://wa.me/919876543210" },
    { icon: <Mail size={24} />, label: t('contactPage.channels.email'), value: "medicareplus.hyd@gmail.com", color: "bg-red-100 text-red-600", link: "mailto:medicareplus.hyd@gmail.com" },
    { icon: <MapPin size={24} />, label: t('contactPage.channels.address'), value: lang === 'en' ? "Shop No. 12, Kukatpally, Hyd" : "షాప్ నెం. 12, కుకట్‌పల్లి, హైదరాబాద్", color: "bg-purple-100 text-purple-600", link: "#map" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">{t('nav.contact')}</h1>
          <p className="text-gray-600 font-medium">{t('contactPage.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {contactItems.map((item, i) => (
            <motion.a
              key={i}
              href={item.link}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-md transition-all"
            >
              <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110`}>
                {item.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-lg font-bold text-gray-900">{item.value}</p>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
            <h2 className="text-3xl font-bold mb-8">{t('contactPage.formTitle')}</h2>
            {success ? (
              <div className="bg-green-50 p-8 rounded-2xl border border-green-100 text-center">
                <CheckCircle2 size={48} className="text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-800 mb-2">{t('contactPage.msgSent')}</h3>
                <p className="text-green-700">{t('contactPage.msgSentDesc')}</p>
                <button onClick={() => setSuccess(false)} className="mt-6 text-green-600 font-bold hover:underline">{t('contactPage.sendAnother')}</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('contactPage.fullName')}</label>
                  <input
                    type="text"
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-med-blue focus:bg-white transition-all font-bold"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('contactPage.phoneNumber')}</label>
                  <input
                    type="tel"
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-med-blue focus:bg-white transition-all font-bold"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('contactPage.message')}</label>
                  <textarea
                    required
                    rows="4"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-med-blue focus:bg-white transition-all font-bold resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>
                {error && <p className="text-red-600 font-bold text-sm text-center">{t('contactPage.failSend')}</p>}
                <button
                  disabled={loading}
                  className="w-full bg-med-blue text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-lg"
                >
                  {loading ? t('contactPage.sending') : t('contactPage.sendMessage')}
                  <Send size={20} />
                </button>
              </form>
            )}
          </div>

          {/* Pharmacist Profile */}
          <div className="flex flex-col gap-8">
            <div className="bg-gradient-to-br from-med-blue to-blue-900 p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
               <Briefcase size={120} className="absolute bottom-[-20px] right-[-20px] opacity-10 rotate-12" />
               <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                    <User size={48} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{t('contactPage.pharmacistName')}</h3>
                    <p className="text-blue-200 font-medium">{t('contactPage.pharmacistTitle')}</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10">
                    <Award className="text-blue-300" />
                    <div>
                       <p className="text-xs font-bold text-blue-200 uppercase tracking-widest">{t('contactPage.experienceTitle')}</p>
                       <p className="font-bold">{t('contactPage.experienceDesc')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10">
                    <CheckCircle2 className="text-blue-300" />
                    <div>
                       <p className="text-xs font-bold text-blue-200 uppercase tracking-widest">{t('contactPage.expertiseTitle')}</p>
                       <p className="font-bold">{t('contactPage.expertiseDesc')}</p>
                    </div>
                  </div>
               </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex-grow">
               <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                 <Clock className="text-med-blue" />
                 {t('contactPage.visitHours')}
               </h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                     <span className="font-bold text-gray-600">{lang === 'en' ? 'Mon - Sat' : 'సోమ - శని'}</span>
                     <span className="font-bold text-med-blue">{lang === 'en' ? '8:00 AM - 10:00 PM' : 'ఉదయం 8:00 - రాత్రి 10:00'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="font-bold text-gray-600">{lang === 'en' ? 'Sunday' : 'ఆదివారం'}</span>
                     <span className="font-bold text-med-blue">{lang === 'en' ? '9:00 AM - 6:00 PM' : 'ఉదయం 9:00 - సాయంత్రం 6:00'}</span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div id="map" className="mt-20">
           <h2 className="text-3xl font-bold mb-8 text-center">{t('contactPage.locateTitle')}</h2>
           <div className="w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.027663242637!2d78.3995813!3d17.4822763!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91f4f469279b%3A0x6739077977a4a9b4!2sKukatpally%20Main%20Rd%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1715150000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

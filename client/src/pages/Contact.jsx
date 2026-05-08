import React, { useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Mail, Clock, Send, CheckCircle2, User, Award, Briefcase } from 'lucide-react';

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      setSuccess(true);
      setFormData({ name: '', phone: '', message: '' });
    } catch (err) {
      console.error('Contact form error:', err);
      setError('Failed to send message. Please try again or call us.');
    } finally {
      setLoading(false);
    }
  };

  const contactItems = [
    { icon: <Phone size={24} />, label: "Call Us", value: "+91 98765 43210", color: "bg-blue-100 text-blue-600", link: "tel:+919876543210" },
    { icon: <MessageCircle size={24} />, label: "WhatsApp", value: "+91 98765 43210", color: "bg-green-100 text-green-600", link: "https://wa.me/919876543210" },
    { icon: <Mail size={24} />, label: "Email", value: "medicareplus.hyd@gmail.com", color: "bg-red-100 text-red-600", link: "mailto:medicareplus.hyd@gmail.com" },
    { icon: <MapPin size={24} />, label: "Address", value: "Shop No. 12, Kukatpally, Hyd", color: "bg-purple-100 text-purple-600", link: "#map" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">{t('nav.contact')}</h1>
          <p className="text-gray-600 font-medium">We're here to help you. Reach out to us via any of the channels below.</p>
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
            <h2 className="text-3xl font-bold mb-8">Send us a Message</h2>
            {success ? (
              <div className="bg-green-50 p-8 rounded-2xl border border-green-100 text-center">
                <CheckCircle2 size={48} className="text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-800 mb-2">Message Sent!</h3>
                <p className="text-green-700">Thank you for reaching out. We will get back to you soon.</p>
                <button onClick={() => setSuccess(false)} className="mt-6 text-green-600 font-bold hover:underline">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-med-blue focus:bg-white transition-all font-bold"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                  <input
                    type="tel"
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-med-blue focus:bg-white transition-all font-bold"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Your Message</label>
                  <textarea
                    required
                    rows="4"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-med-blue focus:bg-white transition-all font-bold resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>
                {error && <p className="text-red-600 font-bold text-sm text-center">{error}</p>}
                <button
                  disabled={loading}
                  className="w-full bg-med-blue text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-lg"
                >
                  {loading ? 'Sending...' : 'Send Message'}
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
                    <h3 className="text-2xl font-bold">Mr. Ravi Kumar</h3>
                    <p className="text-blue-200 font-medium">Licensed Pharmacist (B.Pharm)</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10">
                    <Award className="text-blue-300" />
                    <div>
                       <p className="text-xs font-bold text-blue-200 uppercase tracking-widest">Experience</p>
                       <p className="font-bold">14+ Years in Pharmacy Practice</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10">
                    <CheckCircle2 className="text-blue-300" />
                    <div>
                       <p className="text-xs font-bold text-blue-200 uppercase tracking-widest">Expertise</p>
                       <p className="font-bold">Medication Counseling & Drug Safety</p>
                    </div>
                  </div>
               </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex-grow">
               <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                 <Clock className="text-med-blue" />
                 Visit Us During Working Hours
               </h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                     <span className="font-bold text-gray-600">Mon - Sat</span>
                     <span className="font-bold text-med-blue">8:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="font-bold text-gray-600">Sunday</span>
                     <span className="font-bold text-med-blue">9:00 AM - 6:00 PM</span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div id="map" className="mt-20">
           <h2 className="text-3xl font-bold mb-8 text-center">Locate Us in Kukatpally</h2>
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

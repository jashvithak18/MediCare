import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-med-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">+</span>
              </div>
              <h2 className="text-xl font-bold text-white">MediCare Plus</h2>
            </div>
            <p className="text-sm leading-relaxed">
              Serving the Kukatpally community since 2010. We are committed to providing genuine medicines and expert healthcare advice.
            </p>
            <div className="mt-6 flex gap-4">
               <a href="https://wa.me/919876543210" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-med-green transition-colors">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">{t('nav.home')} Links</h3>
            <ul className="space-y-4">
              <li><a href="/" className="hover:text-med-blue transition-colors">{t('nav.home')}</a></li>
              <li><a href="/medicines" className="hover:text-med-blue transition-colors">{t('nav.medicines')}</a></li>
              <li><a href="/symptoms" className="hover:text-med-blue transition-colors">{t('nav.symptoms')}</a></li>
              <li><a href="/tips" className="hover:text-med-blue transition-colors">{t('nav.tips')}</a></li>
              <li><a href="/contact" className="hover:text-med-blue transition-colors">{t('nav.contact')}</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">{t('nav.contact')}</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin className="text-med-blue flex-shrink-0" size={20} />
                <span className="text-sm">Shop No. 12, Ground Floor, Lakshmi Complex, Kukatpally, Hyderabad - 500072</span>
              </li>
              <li className="flex gap-3">
                <Phone className="text-med-blue flex-shrink-0" size={20} />
                <span className="text-sm">+91 98765 43210</span>
              </li>
              <li className="flex gap-3">
                <Mail className="text-med-blue flex-shrink-0" size={20} />
                <span className="text-sm">medicareplus.hyd@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">{t('footer.hours')}</h3>
            <ul className="space-y-4">
              <li className="flex gap-3 items-center">
                <Clock className="text-med-blue flex-shrink-0" size={20} />
                <span className="text-sm">{t('footer.mondaySaturday')}</span>
              </li>
              <li className="flex gap-3 items-center">
                <Clock className="text-med-blue flex-shrink-0" size={20} />
                <span className="text-sm">{t('footer.sunday')}</span>
              </li>
            </ul>
            <div className="mt-8 p-4 bg-gray-800 rounded-xl border border-gray-700">
              <p className="text-xs text-center font-bold text-gray-400 uppercase tracking-widest">
                License: TS-PHARM-2010-04521
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} MediCare Plus Pharmacy. {t('footer.rights')}.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { Search, ShieldCheck, Heart, UserCheck, Award, Clock, Star, Lightbulb, Pill, Baby, Sparkles, Activity, Bluetooth as Tooth, Eye, Thermometer, Droplet } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [dailyTip, setDailyTip] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDailyTip = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/dailytip?lang=${lang}`);
        setDailyTip(res.data);
      } catch (err) {
        console.error('Error fetching daily tip:', err);
      }
    };
    fetchDailyTip();
  }, [lang]);

  const features = [
    { icon: <ShieldCheck size={32} />, title: t('homePage.features.licensedTitle'), desc: t('homePage.features.licensedDesc') },
    { icon: <Heart size={32} />, title: t('homePage.features.genuineTitle'), desc: t('homePage.features.genuineDesc') },
    { icon: <UserCheck size={32} />, title: t('homePage.features.expertTitle'), desc: t('homePage.features.expertDesc') },
    { icon: <Award size={32} />, title: t('homePage.features.expTitle'), desc: t('homePage.features.expDesc') },
  ];

  const categories = [
    { icon: <Pill size={24} />, name: lang === 'en' ? "Medicines" : "మందులు", slug: 'Medicines' },
    { icon: <Baby size={24} />, name: lang === 'en' ? "Baby Care" : "శిశు సంరక్షణ", slug: 'Baby Care' },
    { icon: <Sparkles size={24} />, name: lang === 'en' ? "Skincare" : "చర్మ సంరక్షణ", slug: 'Skin Care' },
    { icon: <Activity size={24} />, name: lang === 'en' ? "Vitamins" : "విటమిన్లు", slug: 'Health Supplements' },
    { icon: <Thermometer size={24} />, name: lang === 'en' ? "Surgical" : "సర్జికల్", slug: 'Surgical' },
    { icon: <Droplet size={24} />, name: lang === 'en' ? "Ayurvedic" : "ఆయుర్వేదం", slug: 'Ayurvedic' },
    { icon: <Tooth size={24} />, name: lang === 'en' ? "Diabetic Care" : "డయాబెటిక్ కేర్", slug: 'Diabetic Care' },
    { icon: <Eye size={24} />, name: lang === 'en' ? "Eye/Ear Drops" : "కంటి/చెవి డ్రాప్స్", slug: 'Eye Drops' },
  ];

  const stats = [
    { label: lang === 'en' ? "Brands Available" : "బ్రాండ్లు అందుబాటులో ఉన్నాయి", value: "500+" },
    { label: lang === 'en' ? "Happy Customers" : "సంతోషకరమైన కస్టమర్లు", value: "10,000+" },
    { label: lang === 'en' ? "Experience" : "అనుభవం", value: lang === 'en' ? "14 Years" : "14 సంవత్సరాలు" },
    { label: lang === 'en' ? "Pharmacists" : "ఫార్మసిస్ట్‌లు", value: lang === 'en' ? "Licensed" : "లైసెన్స్ పొందిన" },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-med-light-blue pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-30"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                {t('hero.title')}
              </h1>
              <p className="text-xl text-gray-600 mb-10 font-semibold">
                {t('hero.subtitle')}
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative max-w-2xl mx-auto"
            >
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    window.location.href = `/medicines?search=${encodeURIComponent(searchQuery)}`;
                  }
                }}
                className="relative"
              >
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                <input
                  type="text"
                  placeholder={t('hero.searchPlaceholder')}
                  className="w-full pl-16 pr-32 py-5 rounded-full shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit"
                  className="absolute right-3 top-3 bottom-3 bg-med-blue text-white px-8 rounded-full font-bold hover:bg-blue-700 transition-colors"
                >
                  {t('buttons.submit')}
                </button>
              </form>
            </motion.div>
          </div>
        </div>

        {/* Animated Pill Graphics Placeholder */}
        <div className="absolute top-1/2 left-10 hidden xl:block opacity-20 animate-bounce">
           <Pill size={80} className="text-med-blue transform -rotate-45" />
        </div>
        <div className="absolute bottom-20 right-10 hidden xl:block opacity-20 animate-pulse">
           <Heart size={80} className="text-red-400" />
        </div>
      </section>


      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">{t('home.whyChooseUs')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 rounded-2xl bg-gray-50 border border-gray-100 text-center"
              >
                <div className="w-16 h-16 bg-med-light-blue text-med-blue rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section className="bg-med-blue py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={i} className="text-center text-white border-r border-blue-400 last:border-0">
                <p className="text-3xl font-bold mb-1">{s.value}</p>
                <p className="text-sm opacity-80 uppercase tracking-widest font-semibold">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">{t('home.categories')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((c, i) => (
              <motion.div
                key={i}
                onClick={() => navigate(`/category/${encodeURIComponent(c.slug)}`)}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-4 cursor-pointer hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-med-light-blue text-med-blue rounded-full flex items-center justify-center">
                  {c.icon}
                </div>
                <span className="font-bold text-gray-700">{c.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Tip */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-br from-med-blue to-blue-800 rounded-3xl p-12 text-white relative overflow-hidden shadow-2xl">
            <Lightbulb className="absolute top-6 right-6 opacity-20" size={80} />
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Star fill="currentColor" size={24} />
              {t('home.dailyTip')}
            </h3>
            <p className="text-2xl font-medium leading-relaxed italic">
              "{dailyTip?.tip || 'Eat healthy, stay healthy!'}"
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-16">{t('home.testimonials')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-center mb-4 text-yellow-400">
                  <Star fill="currentColor" size={20} />
                  <Star fill="currentColor" size={20} />
                  <Star fill="currentColor" size={20} />
                  <Star fill="currentColor" size={20} />
                  <Star fill="currentColor" size={20} />
                </div>
                <p className="text-gray-600 mb-6 italic">
                  {t('homePage.testimonialsQuote')}
                </p>
                <p className="font-bold">- {t('homePage.customer')} {i}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

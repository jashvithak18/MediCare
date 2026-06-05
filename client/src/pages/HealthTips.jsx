import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calendar, ArrowRight, X, Loader2 } from 'lucide-react';

const HealthTips = () => {
  const { t, lang } = useLanguage();
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTip, setSelectedTip] = useState(null);

  const translateCategory = (cat) => {
    if (!cat) return '';
    const key = `categories.${cat}`;
    const translated = t(key);
    return translated === key ? cat : translated;
  };

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/healthtips?lang=${lang}`);
        setTips(res.data);
      } catch (err) {
        console.error('Error fetching health tips:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTips();
  }, [lang]);

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">{t('nav.tips')}</h1>
          <p className="text-gray-600 max-w-xl mx-auto font-medium">
            {t('tipsPage.subtitle')}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-med-blue" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tips.map((tip) => (
              <motion.div
                key={tip._id}
                whileHover={{ y: -8 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setSelectedTip(tip)}
              >
                <div className="h-48 bg-med-light-blue flex items-center justify-center text-med-blue relative overflow-hidden">
                  <BookOpen size={64} className="opacity-20" />
                  <span className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {translateCategory(tip.category)}
                  </span>
                </div>
                <div className="p-8 flex-grow">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-4 font-bold uppercase tracking-wider">
                    <Calendar size={14} />
                    {new Date(tip.date).toLocaleDateString()}
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 leading-tight">{tip.title}</h2>
                  <p className="text-gray-600 line-clamp-3 mb-6 text-sm leading-relaxed">{tip.shortDescription}</p>
                  <div className="flex items-center gap-2 text-med-blue font-bold group">
                    {t('tipsPage.readMore')}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal for Full Article */}
        <AnimatePresence>
          {selectedTip && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelectedTip(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl p-8 md:p-12 shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedTip(null)}
                  className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X size={20} />
                </button>
                
                <span className="bg-med-light-blue text-med-blue px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">
                  {translateCategory(selectedTip.category)}
                </span>
                <h2 className="text-4xl font-bold mb-6">{selectedTip.title}</h2>
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-8 font-bold">
                  <Calendar size={16} />
                  {new Date(selectedTip.date).toLocaleDateString()}
                </div>
                <div className="prose prose-blue max-w-none">
                  <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedTip.fullArticle}
                  </p>
                </div>
                <div className="mt-12 p-6 bg-med-light-blue rounded-2xl border border-blue-100">
                  <p className="text-sm font-bold text-med-blue text-center italic">
                    {t('tipsPage.consult')}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HealthTips;

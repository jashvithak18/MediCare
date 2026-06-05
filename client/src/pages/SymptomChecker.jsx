import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, Send, Loader2, AlertCircle, MessageCircle, Info, Pill, Home as HomeIcon } from 'lucide-react';
import axios from 'axios';

const SymptomChecker = () => {
  const { t, lang } = useLanguage();
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const handleSymptomCheck = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setLoading(true);
    setError('');
    setResponse(null);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/symptom-check`, { symptoms });
      setResponse(res.data.response || "No response generated.");
    } catch (err) {
      console.error('AI Error:', err);
      setError('Sorry, we could not analyze your symptoms right now. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const msg = `Hello, I just used your AI Symptom Checker for: ${symptoms}. Can I talk to a pharmacist?`;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-med-blue text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-100">
            <Stethoscope size={40} />
          </div>
          <h1 className="text-4xl font-bold mb-4">{t('symptoms.title')}</h1>
          <p className="text-gray-600 max-w-xl mx-auto font-medium">
            Describe how you're feeling in simple words. Our AI assistant will help you understand your symptoms.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mb-12">
          <form onSubmit={handleSymptomCheck}>
            <textarea
              className="w-full h-40 p-6 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-med-blue focus:bg-white transition-all text-lg resize-none mb-6"
              placeholder={t('symptoms.placeholder')}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            />
            <button
              disabled={loading || !symptoms.trim()}
              className="w-full bg-med-blue text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
              {loading ? t('symptoms.loading') : t('buttons.submit')}
            </button>
          </form>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-100 p-6 rounded-2xl flex gap-4 text-red-700 mb-8"
            >
              <AlertCircle className="flex-shrink-0" />
              <p className="font-bold">{error}</p>
            </motion.div>
          )}

          {response && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden"
            >
              <div className="bg-med-blue p-6 text-white flex items-center justify-between">
                <h2 className="text-2xl font-bold">{t('symptoms.resultTitle')}</h2>
                <div className="flex gap-2">
                   <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Info size={16} />
                   </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="prose prose-blue max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {response}
                </div>

                <div className="mt-10 pt-10 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-2xl">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">{t('symptoms.disclaimer')}</p>
                  </div>
                  <button
                    onClick={handleWhatsApp}
                    className="bg-med-green text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-green-600 transition-all shadow-lg"
                  >
                    <MessageCircle size={24} />
                    Talk to Our Pharmacist
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 text-center text-gray-400 text-sm font-bold flex items-center justify-center gap-2">
          <AlertCircle size={16} />
          NOT A MEDICAL DIAGNOSIS • AI GENERATED INFORMATION
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;

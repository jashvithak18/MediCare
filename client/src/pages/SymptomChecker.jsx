import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, Send, Loader2, AlertCircle, MessageCircle, Info, Pill, Home as HomeIcon } from 'lucide-react';

const SymptomChecker = () => {
  const { t, lang } = useLanguage();
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const mockResponses = {
    en: {
      fever: "UNDERSTANDING: You may have a common fever or viral infection.\nMEDICINES: Dolo 650, Calpol, Paracetamol.\nREMEDIES: Drink plenty of water, rest, and use a cool damp cloth on the forehead.\nDISCLAIMER: This is not a diagnosis. Consult a doctor.",
      cold: "UNDERSTANDING: Symptoms indicate a common cold or nasal congestion.\nMEDICINES: Cetirizine, Allegra, Vicks Vaporub.\nREMEDIES: Steam inhalation, warm salt water gargle.\nDISCLAIMER: This is not a diagnosis. Consult a doctor.",
      cough: "UNDERSTANDING: You might have throat irritation or a dry/wet cough.\nMEDICINES: Benadryl, Ascoril, Grilinctus.\nREMEDIES: Honey with warm water, ginger tea.\nDISCLAIMER: This is not a diagnosis. Consult a doctor.",
      headache: "UNDERSTANDING: This could be a tension headache or due to lack of sleep.\nMEDICINES: Crocin, Saridon, Zandu Balm.\nREMEDIES: Rest in a dark quiet room, stay hydrated.\nDISCLAIMER: This is not a diagnosis. Consult a doctor.",
      stomach: "UNDERSTANDING: Possible indigestion or acidity.\nMEDICINES: Digene, Pantoprazole, ENO.\nREMEDIES: Drink buttermilk, avoid spicy food.\nDISCLAIMER: This is not a diagnosis. Consult a doctor.",
      generic: "UNDERSTANDING: We have analyzed your symptoms.\nMEDICINES: Please visit our store for appropriate OTC guidance.\nREMEDIES: Maintain healthy hydration and rest.\nDISCLAIMER: This is not a diagnosis. Please consult a doctor for serious issues."
    },
    te: {
      fever: "అవగాహన: మీకు సాధారణ జ్వరం లేదా వైరల్ ఇన్ఫెక్షన్ ఉండవచ్చు.\nమందులు: డోలో 650, కాల్పోల్, పారాసెటమాల్.\nచిట్కాలు: ధారాళంగా నీరు త్రాగాలి, విశ్రాంతి తీసుకోవాలి.\nగమనిక: ఇది రోగ నిర్ధారణ కాదు. వైద్యుడిని సంప్రదించండి.",
      cold: "అవగాహన: మీకు జలుబు లేదా ముక్కు దిబ్బడ ఉన్నట్లు కనిపిస్తోంది.\nమందులు: సెటిరిజైన్, అలెగ్రా, విక్స్ వేపోరబ్.\nచిట్కాలు: ఆవిరి పట్టడం, గోరువెచ్చని ఉప్పు నీటితో పుక్కిలించడం.\nగమనిక: ఇది రోగ నిర్ధారణ కాదు. వైద్యుడిని సంప్రదించండి.",
      generic: "అవగాహన: మేము మీ లక్షణాలను విశ్లేషించాము.\nమందులు: సరైన గైడెన్స్ కోసం మా స్టోర్‌ని సందర్శించండి.\nచిట్కాలు: తగినంత నీరు త్రాగాలి మరియు విశ్రాంతి తీసుకోండి.\nగమనిక: ఇది రోగ నిర్ధారణ కాదు. దయచేసి డాక్టర్‌ని సంప్రదించండి."
    }
  };

  const handleSymptomCheck = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setLoading(true);
    setError('');
    setResponse(null);

    // Fake loading delay for realism
    setTimeout(() => {
      const lowerSymptoms = symptoms.toLowerCase();
      let res = "";
      const currentLang = lang === 'te' ? 'te' : 'en';

      if (lowerSymptoms.includes('fever') || lowerSymptoms.includes('జ్వరం')) res = mockResponses[currentLang].fever;
      else if (lowerSymptoms.includes('cold') || lowerSymptoms.includes('జలుబు')) res = mockResponses[currentLang].cold;
      else if (lowerSymptoms.includes('cough') || lowerSymptoms.includes('దగ్గు')) res = mockResponses[currentLang].cough || mockResponses[currentLang].generic;
      else if (lowerSymptoms.includes('headache') || lowerSymptoms.includes('తలనొప్పి')) res = mockResponses[currentLang].headache || mockResponses[currentLang].generic;
      else if (lowerSymptoms.includes('stomach') || lowerSymptoms.includes('కడుపు నొప్పి')) res = mockResponses[currentLang].stomach || mockResponses[currentLang].generic;
      else res = mockResponses[currentLang].generic;

      setResponse(res);
      setLoading(false);
    }, 1500);
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

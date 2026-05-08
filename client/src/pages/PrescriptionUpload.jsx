import React, { useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, FileText, User, Phone, Clock, Loader2, Info } from 'lucide-react';

const PrescriptionUpload = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    patientName: '',
    phoneNumber: '',
    preferredVisitTime: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a prescription image.');
      return;
    }

    setLoading(true);
    setError('');

    const data = new FormData();
    data.append('patientName', formData.patientName);
    data.append('phoneNumber', formData.phoneNumber);
    data.append('preferredVisitTime', formData.preferredVisitTime);
    data.append('prescriptionImage', file);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/prescriptions`, data);
      setSuccess(true);
    } catch (err) {
      console.error('Upload Error:', err);
      setError('Failed to upload. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-3xl shadow-2xl max-w-lg w-full text-center border border-green-100"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-bold mb-4">{t('prescription.title')} Success!</h2>
          <p className="text-gray-600 mb-8 font-medium leading-relaxed">
            {t('prescription.success')}
          </p>
          <div className="bg-green-50 p-6 rounded-2xl border border-green-100 mb-8">
            <p className="text-green-700 font-bold text-sm">
               We will prepare your medicines in advance so you don't have to wait!
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-med-blue text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all"
          >
            Upload Another
          </button>
          <div className="mt-8 pt-8 border-t border-gray-100">
             <button 
                onClick={() => window.print()}
                className="text-gray-400 font-bold text-sm hover:text-med-blue transition-colors flex items-center justify-center gap-2 mx-auto"
             >
                <FileText size={16} />
                Save/Print Confirmation
             </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('prescription.title')}</h1>
          <p className="text-gray-600 font-medium">{t('prescription.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">{t('prescription.name')}</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="patientName"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-med-blue focus:bg-white transition-all font-bold"
                    value={formData.patientName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">{t('prescription.phone')}</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-med-blue focus:bg-white transition-all font-bold"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">{t('prescription.time')}</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="preferredVisitTime"
                    placeholder="e.g. Tomorrow 10:00 AM"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-med-blue focus:bg-white transition-all font-bold"
                    value={formData.preferredVisitTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">{t('prescription.file')}</label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-2xl hover:border-med-blue transition-all bg-gray-50">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer rounded-md font-bold text-med-blue hover:text-blue-500">
                        <span>Select a file</span>
                        <input type="file" className="sr-only" onChange={handleFileChange} accept="image/*,application/pdf" />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">JPG, PNG, PDF up to 10MB</p>
                    {file && <p className="text-sm font-bold text-med-green mt-2">{file.name}</p>}
                  </div>
                </div>
              </div>

              {error && <p className="text-red-600 font-bold text-sm text-center">{error}</p>}

              <button
                disabled={loading}
                className="w-full bg-med-blue text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle size={24} />}
                {loading ? t('symptoms.loading') : t('buttons.upload')}
              </button>
            </form>
          </div>

          {/* Info Card */}
          <div className="flex flex-col gap-8">
            <div className="bg-med-light-blue p-8 rounded-3xl border border-blue-100 h-fit">
              <h3 className="text-xl font-bold text-med-blue mb-6 flex items-center gap-2">
                <Info size={24} />
                Important Information
              </h3>
              <ul className="space-y-6 text-gray-700">
                <li className="flex gap-4">
                   <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">1</div>
                   <p className="text-sm font-medium">Upload a clear photo or PDF of your doctor's prescription.</p>
                </li>
                <li className="flex gap-4">
                   <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">2</div>
                   <p className="text-sm font-medium">Our pharmacist will review the prescription and prepare your medicines.</p>
                </li>
                <li className="flex gap-4">
                   <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">3</div>
                   <p className="text-sm font-medium">Visit our store in Kukatpally at your preferred time for pickup.</p>
                </li>
                <li className="flex gap-4">
                   <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">4</div>
                   <p className="text-sm font-medium">Valid prescription is mandatory for scheduled medicines.</p>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
               <h4 className="font-bold mb-4">Privacy Note</h4>
               <p className="text-xs text-gray-500 leading-relaxed">
                  Your prescription and personal details are stored securely and only used to prepare your medicines. We do not share your medical information with third parties.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionUpload;

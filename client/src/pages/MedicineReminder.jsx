import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Plus, Trash2, Clock, Calendar, Info, AlertCircle, CheckCircle2 } from 'lucide-react';

const MedicineReminder = () => {
  const { t } = useLanguage();
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem('medicine_reminders');
    return saved ? JSON.parse(saved) : [];
  });
  const [newReminder, setNewReminder] = useState({
    name: '',
    time: '',
    frequency: 'Once Daily',
    notes: ''
  });
  const [notificationPermission, setNotificationPermission] = useState('default');

  useEffect(() => {
    localStorage.setItem('medicine_reminders', JSON.stringify(reminders));
    
    // Check permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, [reminders]);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  const addReminder = (e) => {
    e.preventDefault();
    if (!newReminder.name || !newReminder.time) return;

    const reminder = {
      ...newReminder,
      id: Date.now(),
      active: true
    };

    setReminders([...reminders, reminder]);
    setNewReminder({ name: '', time: '', frequency: 'Once Daily', notes: '' });

    if (notificationPermission === 'granted') {
      new Notification(t('reminder.reminderSet'), {
        body: t('reminder.reminderSetBody').replace('{name}', reminder.name).replace('{time}', reminder.time),
        icon: '/logo192.png'
      });
    }
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  // Logic to check and trigger notifications (simulated)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      reminders.forEach(r => {
        if (r.time === currentTime && notificationPermission === 'granted') {
          new Notification(t('reminder.medicineTime'), {
            body: t('reminder.medicineTimeBody').replace('{name}', r.name),
            requireInteraction: true
          });
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [reminders, notificationPermission]);

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-med-blue text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-100">
            <Bell size={32} />
          </div>
          <h1 className="text-4xl font-bold mb-4">{t('reminder.title')}</h1>
          <p className="text-gray-600 font-medium max-w-xl mx-auto">
            {t('reminder.subtitle')}
          </p>
        </div>

        {notificationPermission !== 'granted' && (
          <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-2xl mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-yellow-800">
              <AlertCircle size={24} className="flex-shrink-0" />
              <p className="font-bold">{t('reminder.notifNotEnabled')}</p>
            </div>
            <button
              onClick={requestPermission}
              className="bg-yellow-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-yellow-700 transition-all text-sm animate-pulse"
            >
              {t('reminder.enableNotif')}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Add Reminder Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-28">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <Plus className="text-med-blue" />
                {t('reminder.add')}
              </h2>
              <form onSubmit={addReminder} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('reminder.name')}</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-med-blue focus:bg-white transition-all font-bold"
                    value={newReminder.name}
                    onChange={(e) => setNewReminder({ ...newReminder, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('reminder.time')}</label>
                  <input
                    type="time"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-med-blue focus:bg-white transition-all font-bold"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('reminder.freq')}</label>
                  <select
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-med-blue focus:bg-white transition-all font-bold"
                    value={newReminder.frequency}
                    onChange={(e) => setNewReminder({ ...newReminder, frequency: e.target.value })}
                  >
                    <option>{t('reminder.once')}</option>
                    <option>{t('reminder.twice')}</option>
                    <option>{t('reminder.thrice')}</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-med-blue text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg"
                >
                  <CheckCircle2 size={20} />
                  {t('reminder.add')}
                </button>
              </form>
            </div>
          </div>

          {/* Reminders List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <Calendar className="text-med-blue" />
              {t('reminder.list')}
            </h2>

            {reminders.length === 0 ? (
              <div className="bg-white p-16 rounded-3xl border border-dashed border-gray-200 text-center">
                <Clock className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-400 font-bold">{t('reminder.noReminders')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {reminders.map((r) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-med-light-blue text-med-blue rounded-xl flex items-center justify-center font-bold">
                          {r.time}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{r.name}</h3>
                          <p className="text-sm text-gray-500 font-semibold">{r.frequency}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteReminder(r.id)}
                        className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            <div className="mt-12 bg-blue-50 p-6 rounded-3xl border border-blue-100 flex gap-4">
              <Info className="text-med-blue flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-800 font-bold mb-1">{t('reminder.howItWorks')}</p>
                <p className="text-sm text-blue-700 leading-relaxed">
                  {t('reminder.note')} {t('reminder.keepTabOpen')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineReminder;

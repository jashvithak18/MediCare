import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Pill, BookOpen, FileText, MessageSquare, Plus, Trash2, Edit, Save, X, LogOut, Loader2, ChevronRight, CheckCircle, Clock } from 'lucide-react';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('adminAuth') === 'true');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('prescriptions');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    try {
      let endpoint = '';
      if (activeTab === 'products') endpoint = `http://localhost:5000/api/products/${id}`;
      if (activeTab === 'tips') endpoint = `http://localhost:5000/api/healthtips/${id}`;
      if (activeTab === 'contacts') endpoint = `http://localhost:5000/api/contacts/${id}`; // Note: Backend needs DELETE for contacts if desired

      await axios.delete(endpoint);
      fetchData();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      let endpoint = '';
      if (activeTab === 'products') endpoint = 'http://localhost:5000/api/products';
      if (activeTab === 'tips') endpoint = 'http://localhost:5000/api/healthtips';

      if (editingItem) {
        await axios.put(`${endpoint}/${editingItem._id}`, formData);
      } else {
        await axios.post(endpoint, formData);
      }
      setShowModal(false);
      setEditingItem(null);
      setFormData({});
      fetchData();
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    setFormData(item || {});
    setShowModal(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-md"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-med-blue text-white rounded-2xl flex items-center justify-center mb-4">
              <LayoutDashboard size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
            <p className="text-gray-500 font-medium">Enter password to continue</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="password"
              placeholder="Admin Password"
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-med-blue transition-all text-center text-xl font-bold"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}
            <button
              type="submit"
              className="w-full bg-med-blue text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg"
            >
              Access Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 hidden lg:flex flex-col">
        <div className="p-8 border-b border-gray-100">
           <h2 className="text-2xl font-bold text-med-blue">MediCare Admin</h2>
           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Management Panel</p>
        </div>
        <nav className="flex-grow p-6 space-y-2">
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'prescriptions' ? 'bg-med-blue text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <FileText size={20} />
            Prescriptions
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'contacts' ? 'bg-med-blue text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <MessageSquare size={20} />
            Messages
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'products' ? 'bg-med-blue text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Pill size={20} />
            Inventory
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'tips' ? 'bg-med-blue text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <BookOpen size={20} />
            Health Tips
          </button>
        </nav>
        <div className="p-8 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-red-500 font-bold hover:text-red-700 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 lg:p-12 overflow-y-auto max-h-screen">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold capitalize">{activeTab}</h1>
            <p className="text-gray-500 font-medium">Manage and view store data</p>
          </div>
          <button
            onClick={fetchData}
            className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-all"
          >
            <Clock size={24} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-40">
            <Loader2 className="animate-spin text-med-blue" size={48} />
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {activeTab === 'prescriptions' && (
                    <>
                      <th className="px-8 py-6 font-bold text-gray-400 uppercase tracking-widest text-xs">Patient</th>
                      <th className="px-8 py-6 font-bold text-gray-400 uppercase tracking-widest text-xs">Phone</th>
                      <th className="px-8 py-6 font-bold text-gray-400 uppercase tracking-widest text-xs">Time</th>
                      <th className="px-8 py-6 font-bold text-gray-400 uppercase tracking-widest text-xs">Date</th>
                      <th className="px-8 py-6 font-bold text-gray-400 uppercase tracking-widest text-xs text-right">Action</th>
                    </>
                  )}
                  {activeTab === 'contacts' && (
                    <>
                      <th className="px-8 py-6 font-bold text-gray-400 uppercase tracking-widest text-xs">Sender</th>
                      <th className="px-8 py-6 font-bold text-gray-400 uppercase tracking-widest text-xs">Phone</th>
                      <th className="px-8 py-6 font-bold text-gray-400 uppercase tracking-widest text-xs">Message</th>
                      <th className="px-8 py-6 font-bold text-gray-400 uppercase tracking-widest text-xs text-right">Action</th>
                    </>
                  )}
                   {activeTab === 'products' && (
                    <>
                      <th className="px-8 py-6 font-bold text-gray-400 uppercase tracking-widest text-xs">Name</th>
                      <th className="px-8 py-6 font-bold text-gray-400 uppercase tracking-widest text-xs">Brand</th>
                      <th className="px-8 py-6 font-bold text-gray-400 uppercase tracking-widest text-xs">Category</th>
                      <th className="px-8 py-6 font-bold text-gray-400 uppercase tracking-widest text-xs text-right">Action</th>
                    </>
                  )}
                  {activeTab === 'tips' && (
                    <>
                      <th className="px-8 py-6 font-bold text-gray-400 uppercase tracking-widest text-xs">Title</th>
                      <th className="px-8 py-6 font-bold text-gray-400 uppercase tracking-widest text-xs">Category</th>
                      <th className="px-8 py-6 font-bold text-gray-400 uppercase tracking-widest text-xs text-right">Action</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-bold">No data found in this category.</td>
                  </tr>
                ) : (
                  data.map((item, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-all">
                      {activeTab === 'prescriptions' && (
                        <>
                          <td className="px-8 py-6 font-bold text-gray-900">{item.patientName}</td>
                          <td className="px-8 py-6 text-gray-600">{item.phoneNumber}</td>
                          <td className="px-8 py-6 text-gray-600">{item.preferredVisitTime}</td>
                          <td className="px-8 py-6 text-gray-400 text-xs">{new Date(item.date).toLocaleDateString()}</td>
                          <td className="px-8 py-6 text-right">
                             <a 
                                href={`http://localhost:5000/${item.prescriptionImage}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-med-blue font-bold text-sm hover:underline"
                             >
                               View File
                             </a>
                          </td>
                        </>
                      )}
                      {activeTab === 'contacts' && (
                        <>
                          <td className="px-8 py-6 font-bold text-gray-900">{item.name}</td>
                          <td className="px-8 py-6 text-gray-600">{item.phone}</td>
                          <td className="px-8 py-6 text-gray-600 max-w-xs truncate">{item.message}</td>
                          <td className="px-8 py-6 text-right text-gray-400 text-xs">
                             {new Date(item.date).toLocaleDateString()}
                          </td>
                        </>
                      )}
                       {activeTab === 'products' && (
                        <>
                          <td className="px-8 py-6 font-bold text-gray-900">{item.name}</td>
                          <td className="px-8 py-6 text-gray-600">{item.brand}</td>
                          <td className="px-8 py-6 text-gray-500 text-xs font-bold uppercase tracking-widest">{item.category}</td>
                          <td className="px-8 py-6 text-right">
                             <div className="flex justify-end gap-4">
                               <button onClick={() => openModal(item)} className="text-gray-300 hover:text-med-blue"><Edit size={18} /></button>
                               <button onClick={() => handleDelete(item._id)} className="text-gray-300 hover:text-red-500"><Trash2 size={18} /></button>
                             </div>
                          </td>
                        </>
                      )}
                      {activeTab === 'tips' && (
                        <>
                          <td className="px-8 py-6 font-bold text-gray-900">{item.title}</td>
                          <td className="px-8 py-6 text-gray-500 text-xs font-bold uppercase tracking-widest">{item.category}</td>
                          <td className="px-8 py-6 text-right">
                             <div className="flex justify-end gap-4">
                               <button onClick={() => openModal(item)} className="text-gray-300 hover:text-med-blue"><Edit size={18} /></button>
                               <button onClick={() => handleDelete(item._id)} className="text-gray-300 hover:text-red-500"><Trash2 size={18} /></button>
                             </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Button */}
        {(activeTab === 'products' || activeTab === 'tips') && (
          <div className="fixed bottom-12 right-12">
            <button 
              onClick={() => openModal()}
              className="w-16 h-16 bg-med-blue text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all"
            >
              <Plus size={32} />
            </button>
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold">{editingItem ? 'Edit' : 'Add'} {activeTab === 'products' ? 'Product' : 'Health Tip'}</h2>
                  <button onClick={() => setShowModal(false)}><X size={24} /></button>
                </div>
                <form onSubmit={handleSave} className="space-y-4">
                  {activeTab === 'products' ? (
                    <>
                      <input 
                        className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100" 
                        placeholder="Name" 
                        required 
                        value={formData.name || ''} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                      <input 
                        className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100" 
                        placeholder="Brand" 
                        required 
                        value={formData.brand || ''} 
                        onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      />
                      <input 
                        className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100" 
                        placeholder="Category" 
                        required 
                        value={formData.category || ''} 
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                      />
                      <textarea 
                        className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100" 
                        placeholder="Usage" 
                        required 
                        value={formData.usage || ''} 
                        onChange={(e) => setFormData({...formData, usage: e.target.value})}
                      />
                    </>
                  ) : (
                    <>
                      <input 
                        className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100" 
                        placeholder="Title" 
                        required 
                        value={formData.title || ''} 
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                      />
                      <input 
                        className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100" 
                        placeholder="Category" 
                        required 
                        value={formData.category || ''} 
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                      />
                      <textarea 
                        className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100" 
                        placeholder="Short Description" 
                        required 
                        value={formData.shortDescription || ''} 
                        onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                      />
                      <textarea 
                        className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 h-32" 
                        placeholder="Full Article" 
                        required 
                        value={formData.fullArticle || ''} 
                        onChange={(e) => setFormData({...formData, fullArticle: e.target.value})}
                      />
                    </>
                  )}
                  <button className="w-full bg-med-blue text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                    <Save size={20} /> Save Changes
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Admin;

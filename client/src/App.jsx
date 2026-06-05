import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';

// Pages
import Home from './pages/Home';
import Medicines from './pages/Medicines';
import SymptomChecker from './pages/SymptomChecker';
import HealthTips from './pages/HealthTips';
import PrescriptionUpload from './pages/PrescriptionUpload';
import MedicineReminder from './pages/MedicineReminder';
import Contact from './pages/Contact';
import About from './pages/About';
import Admin from './pages/Admin';
import CategoryListing from './pages/CategoryListing';
import NotFound from './pages/NotFound';
import CartSidebar from './components/CartSidebar';

function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <CartSidebar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/category/:name" element={<CategoryListing />} />
                <Route path="/medicines" element={<Medicines />} />
                <Route path="/symptoms" element={<SymptomChecker />} />
                <Route path="/symptom-checker" element={<SymptomChecker />} />
                <Route path="/tips" element={<HealthTips />} />
                <Route path="/prescription" element={<PrescriptionUpload />} />
                <Route path="/reminder" element={<MedicineReminder />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <FloatingButtons />
          </div>
        </Router>
      </CartProvider>
    </LanguageProvider>
  );
}

export default App;

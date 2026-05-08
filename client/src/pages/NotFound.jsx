import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-red-50">
          <AlertCircle size={48} />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Page Not Found</h2>
        <p className="text-gray-500 mb-10 leading-relaxed font-medium">
          Oops! The page you're looking for doesn't exist or has been moved. 
          Please head back to our home page for assistance.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-med-blue text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg"
        >
          <Home size={20} />
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

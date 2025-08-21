import React from 'react';
import { Smartphone } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4">
          <Smartphone className="h-8 w-8 text-primary-600 mx-auto mt-4" />
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          PhoneFix Pro
        </h2>
        <p className="text-gray-500">Loading your dashboard...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;

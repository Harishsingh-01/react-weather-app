import React from 'react';
import Weather from './weather';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 bg-cover bg-center flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="w-full max-w-5xl relative z-10">
        <h1 className="text-white text-center text-5xl font-bold mb-8 drop-shadow-lg tracking-tight">
          Weather <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Forecast</span>
        </h1>
        <Weather />
      </div>
    </div>
  );
}

export default App;

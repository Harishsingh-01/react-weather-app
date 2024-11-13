import React, { useState } from 'react';
import Weather from './weather';

function App() {
  return (
    <div className="min-h-screen bg-[#FAF6E3]  bg-center flex items-center justify-center">
      <div className="w-full max-w-xl bg-[#9EDF9C] bg-opacity-70 p-8 rounded-lg shadow-lg">
        <h1 className="text-white text-center text-4xl font-bold mb-8">Weather App</h1>
        <Weather />
      </div>
    </div>
  );
}

export default App;

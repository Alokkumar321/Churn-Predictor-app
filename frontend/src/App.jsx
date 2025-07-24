import React, { useState } from 'react';
import SingleEntryForm from './components/SingleEntryForm';
import BulkPrediction from './components/BulkPrediction';

function App() {
  const [mode, setMode] = useState('single');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center px-4 py-8">
      {/* Heading */}
      <h1 className="text-3xl font-bold mb-6">🏦 Banking Churn Prediction</h1>

      {/* Toggle Buttons */}
      <div className="flex space-x-6 mb-8">
        <button
          onClick={() => setMode('single')}
          className={`px-6 py-2 rounded-full font-semibold shadow-md transition-all duration-300 text-sm 
            ${mode === 'single' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-blue-600 border border-blue-500 hover:bg-blue-100'}`}
        >
          📥 Single Entry Prediction
        </button>

        <button
          onClick={() => setMode('bulk')}
          className={`px-6 py-2 rounded-full font-semibold shadow-md transition-all duration-300 text-sm 
            ${mode === 'bulk' 
              ? 'bg-green-600 text-white' 
              : 'bg-white text-green-600 border border-green-500 hover:bg-green-100'}`}
        >
          📊 Bulk Upload Prediction
        </button>
      </div>

      {/* Component Render */}
      <div className="w-full max-w-4xl">
        {mode === 'single' ? <SingleEntryForm /> : <BulkPrediction />}
      </div>
    </div>
  );
}

export default App;

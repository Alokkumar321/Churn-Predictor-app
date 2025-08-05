import React, { useState } from 'react';

const initialForm = {
  CreditScore: '',
  Age: '',
  Balance: '',
  EstimatedSalary: '',
  NumOfProducts: '',
  Gender: '',
  Geography: '',
  HasCrCard: '',
  IsActiveMember: '',
  Tenure: '',
};

export default function SingleEntryForm() {
  const [form, setForm] = useState(initialForm);
  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (response.ok) {
        setPrediction(data.prediction);
      } else {
        setPrediction('Prediction failed');
      }
    } catch (error) {
      console.error(error);
      setPrediction('Prediction failed');
    }
  };

  return (
    <div className="flex justify-center mt-8">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-center mb-6">🧠 Customer Churn Predictor</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="number" name="CreditScore" placeholder="Credit Score" value={form.CreditScore} onChange={handleChange} className="input" />
          <input type="number" name="Age" placeholder="Age" value={form.Age} onChange={handleChange} className="input" />
          <input type="number" name="Balance" placeholder="Balance" value={form.Balance} onChange={handleChange} className="input" />
          <input type="number" name="EstimatedSalary" placeholder="Estimated Salary" value={form.EstimatedSalary} onChange={handleChange} className="input" />
          <input type="number" name="Tenure" placeholder="Tenure" value={form.Tenure} onChange={handleChange} className="input" />
          <input type="number" name="NumOfProducts" placeholder="Number of Products" value={form.NumOfProducts} onChange={handleChange} className="input" />

          <select name="Gender" value={form.Gender} onChange={handleChange} className="input">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <select name="Geography" value={form.Geography} onChange={handleChange} className="input">
            <option value="">Select Geography</option>
            <option value="France">France</option>
            <option value="Germany">Germany</option>
            <option value="Spain">Spain</option>
          </select>
          <select name="HasCrCard" value={form.HasCrCard} onChange={handleChange} className="input">
            <option value="">Has Credit Card?</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
          <select name="IsActiveMember" value={form.IsActiveMember} onChange={handleChange} className="input">
            <option value="">Is Active Member?</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>

          <div className="col-span-2 mt-4">
            <button type="submit" className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2">
              🔍 Predict
            </button>
          </div>
        </form>

        {prediction && (
          <div className="mt-6 text-center text-lg font-medium">
            <strong>Prediction:</strong>{' '}
            <span className={prediction === 'Yes' ? 'text-red-600' : 'text-green-600'}>
              {prediction === 'Yes' ? 'Churn Possible' : 'No Churn Risk'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

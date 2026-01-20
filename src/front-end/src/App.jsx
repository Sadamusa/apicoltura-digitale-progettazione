import { useState } from 'react';

function App() {
  const [humidity, setHumidity] = useState({ min: '', max: '' });
  const [temperature, setTemperature] = useState({ min: '', max: '' });
  const [weight, setWeight] = useState({ min: '', max: '' });

  const handleSave = (type) => {
    console.log(`Salvando ${type}:`, 
      type === 'humidity' ? humidity : 
      type === 'temperature' ? temperature : weight
    );
    alert(`Dati ${type} salvati!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-12 text-4xl font-bold text-gray-800">
          Taratura <span className="text-orange-600">Arnia 3</span>
        </h1>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Umidità */}
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-blue-50 p-6">
                <svg className="h-12 w-12 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                </svg>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Minimo
                </label>
                <input
                  type="number"
                  value={humidity.min}
                  onChange={(e) => setHumidity({ ...humidity, min: e.target.value })}
                  className="w-full rounded-lg border-0 bg-amber-100 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Massimo
                </label>
                <input
                  type="number"
                  value={humidity.max}
                  onChange={(e) => setHumidity({ ...humidity, max: e.target.value })}
                  className="w-full rounded-lg border-0 bg-amber-100 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="100"
                />
              </div>

              <button
                onClick={() => handleSave('humidity')}
                className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600"
              >
                Salva
              </button>
            </div>
          </div>

          {/* Temperatura */}
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-red-50 p-6">
                <svg className="h-12 w-12 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15 13V5a3 3 0 1 0-6 0v8a5 5 0 1 0 6 0zm-3-10a1 1 0 0 1 1 1v8.17a3 3 0 1 1-2 0V4a1 1 0 0 1 1-1z"/>
                </svg>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Minimo
                </label>
                <input
                  type="number"
                  value={temperature.min}
                  onChange={(e) => setTemperature({ ...temperature, min: e.target.value })}
                  className="w-full rounded-lg border-0 bg-amber-100 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Massimo
                </label>
                <input
                  type="number"
                  value={temperature.max}
                  onChange={(e) => setTemperature({ ...temperature, max: e.target.value })}
                  className="w-full rounded-lg border-0 bg-amber-100 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                  placeholder="50"
                />
              </div>

              <button
                onClick={() => handleSave('temperature')}
                className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600"
              >
                Salva
              </button>
            </div>
          </div>

          {/* Peso */}
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-gray-100 p-6">
                <svg className="h-12 w-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Minimo
                </label>
                <input
                  type="number"
                  value={weight.min}
                  onChange={(e) => setWeight({ ...weight, min: e.target.value })}
                  className="w-full rounded-lg border-0 bg-amber-100 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Massimo
                </label>
                <input
                  type="number"
                  value={weight.max}
                  onChange={(e) => setWeight({ ...weight, max: e.target.value })}
                  className="w-full rounded-lg border-0 bg-amber-100 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="100"
                />
              </div>

              <button
                onClick={() => handleSave('weight')}
                className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600"
              >
                Salva
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
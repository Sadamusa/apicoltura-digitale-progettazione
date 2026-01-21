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
    <div
      className="flex min-h-screen items-center justify-center p-8"
      style={{
        backgroundImage: "url('/src/assets/SfondoTaratura.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="w-full max-w-4xl">
        <div className="rounded-3xl bg-white/70 p-8 shadow-xl backdrop-blur-md">
          <h1 className="mb-12 flex items-baseline gap-2 font-bold text-black-800">
            <button
              //onClick={() => handleSave('humidity')}
              className="bg-transparent border-0 p-0 cursor-pointer hover:opacity-80 transition">
              <img
                src="src/assets/FrecciaIndietro.svg"
                alt="FrecciaIndietro"
                className="h-8 w-8"
              />
            </button>
            <span className="text-5xl">Taratura</span>
            <span className="text-2xl">Arnia 3</span>
          </h1>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Umidità */}
            <div className="space-y-4">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-blue-50 p-6">
                  <img
                    src="/src/assets/icona_goccia.svg"
                    alt="Umidità"
                    className="h-22 w-22"
                  />
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
                  className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-black transition hover:bg-orange-600"
                >
                  Salva
                </button>
              </div>
            </div>

            {/* Temperatura */}
            <div className="space-y-4">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-red-50 p-6">
                  <img
                    src="/src/assets/icona_termometro.svg"
                    alt="Temperatura"
                    className="h-22 w-22"
                  />
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
                  className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-black transition hover:bg-orange-600"
                >
                  Salva
                </button>
              </div>
            </div>

            {/* Peso */}
            <div className="space-y-4">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-gray-100 p-6">
                  <img
                    src="/src/assets/icona_peso.svg"
                    alt="Peso"
                    className="h-22 w-22"
                  />
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
                  className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-black transition hover:bg-orange-600"
                >
                  Salva
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
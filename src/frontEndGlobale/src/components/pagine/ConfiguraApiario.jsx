import { useState } from 'react';
import sfondoTaratura from '../../assets/sfondo2.png';
import checklistIcon from '../../assets/icona_menu.svg'; // placeholder, checklist_rtl.svg not found
import iconaGoccia from '../../assets/icona_goccia.svg';
import iconaTermometro from '../../assets/icona_termometro.svg';
import iconaPeso from '../../assets/icona_peso.svg';

function ConfiguraApiario({ onSave }) {
  const [config, setConfig] = useState({
    name: '',
    position: 'Umbertide',
    humidityMin: '',
    humidityMax: '',
    temperatureMin: '',
    temperatureMax: '',
    weightMin: '',
    weightMax: ''
  });

  const handleSave = () => {
    console.log('Salvando configurazione:', config);
    onSave();
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center p-8"
      style={{
        backgroundImage: `url(${sfondoTaratura})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="w-full max-w-6xl">
        <div className="rounded-3xl bg-white/70 p-8 shadow-xl backdrop-blur-md">
          <h1 className="mb-12 flex items-baseline gap-2 font-bold text-black-800">
            <span className="text-5xl">Configurazione</span>
          </h1>

          <div className="grid grid-cols-4 gap-8">
            {/* Nome e Posizione */}
            <div className="space-y-4">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-gray-100 p-6">
                  <img
                    src={checklistIcon}
                    alt="Checklist"
                    className="h-22 w-22"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-600">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={config.name}
                    onChange={(e) => setConfig({ ...config, name: e.target.value })}
                    className="w-full rounded-lg border-0 bg-amber-100 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    placeholder=""
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-600">
                    Posizione
                  </label>
                  <select
                    value={config.position}
                    onChange={(e) => setConfig({ ...config, position: e.target.value })}
                    className="w-full rounded-lg border-0 bg-amber-100 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    <option>Umbertide</option>
                    <option>Perugia</option>
                    <option>Terni</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Umidità */}
            <div className="space-y-4">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-blue-50 p-6">
                  <img
                    src={iconaGoccia}
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
                    value={config.humidityMin}
                    onChange={(e) => setConfig({ ...config, humidityMin: e.target.value })}
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
                    value={config.humidityMax}
                    onChange={(e) => setConfig({ ...config, humidityMax: e.target.value })}
                    className="w-full rounded-lg border-0 bg-amber-100 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="100"
                  />
                </div>
              </div>
            </div>

            {/* Temperatura */}
            <div className="space-y-4">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-red-50 p-6">
                  <img
                    src={iconaTermometro}
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
                    value={config.temperatureMin}
                    onChange={(e) => setConfig({ ...config, temperatureMin: e.target.value })}
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
                    value={config.temperatureMax}
                    onChange={(e) => setConfig({ ...config, temperatureMax: e.target.value })}
                    className="w-full rounded-lg border-0 bg-amber-100 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                    placeholder="50"
                  />
                </div>
              </div>
            </div>

            {/* Peso */}
            <div className="space-y-4">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-gray-100 p-6">
                  <img
                    src={iconaPeso}
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
                    value={config.weightMin}
                    onChange={(e) => setConfig({ ...config, weightMin: e.target.value })}
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
                    value={config.weightMax}
                    onChange={(e) => setConfig({ ...config, weightMax: e.target.value })}
                    className="w-full rounded-lg border-0 bg-amber-100 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    placeholder="100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pulsante Salva centrato */}
          <div className="mt-8 flex justify-end pr-4">
            <button
              onClick={handleSave}
              className="rounded-lg bg-orange-500 px-16 py-3 font-semibold text-black transition hover:bg-orange-600"
            >
              Salva
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfiguraApiario;
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import SidebarApiario from './SidebarApiario';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUmidita, setShowUmidita] = useState(true);
  const [showPeso, setShowPeso] = useState(true);
  const [showTemperatura, setShowTemperatura] = useState(true);
  const [timeRange, setTimeRange] = useState("1mese");
  const [selectedArnia, setSelectedArnia] = useState(1);

  // Soglie
  const sogliaTemperaturaMax = 25;
  const sogliaPesoMin = 47;

  const arnie = [
    { id: 1, nome: "Arnia 1", selected: true },
    { id: 2, nome: "Arnia 2", selected: false },
    { id: 3, nome: "Arnia 3", notifiche: 1, selected: false }
  ];

  return (
    <div 
      className="min-h-screen flex bg-gray-100 relative"
      style={{
        backgroundImage: "url('src/assets/Sfondo_configurazione.png')",
        backgroundSize: 'cover',
        backgroundPosition:  'center'
      }}
    >
      <SidebarApiario 
        apiaries={arnie}
        selectedId={selectedArnia}
        setSelectedId={setSelectedArnia}
        onAdd={() => console.log('Add apiario')}
        onNavigateToTaratura={() => console.log('Navigate to taratura')}
        onLogout={() => console.log('Logout')}
      />

      {/* CONTENUTO PRINCIPALE */}
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* HEADER CON CHECKMARK - SFUMATO VERDE PIÙ GRANDE */}
          <div className="mb-6 flex flex-col items-center justify-center relative py-12">
            {/* Layer sfumato circolare con blur - PIÙ GRANDE */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="w-[500px] h-[400px] rounded-full blur-3xl opacity-70"
                style={{
                  background: 'radial-gradient(ellipse, rgba(134, 239, 172, 0.9) 0%, rgba(74, 222, 128, 0.7) 25%, rgba(34, 197, 94, 0.5) 50%, rgba(22, 163, 74, 0.3) 75%, transparent 100%)'
                }}
              />
            </div>
            
            {/* Contenuto centrale - SPUNTA E OK INLINE */}
            <div className="relative z-10 flex items-center gap-6 mb-6">
              <svg className="w-24 h-24 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <span className="text-8xl font-bold text-white drop-shadow-lg">Ok</span>
            </div>

            {/* Informazioni posizione e data */}
            <div className="relative z-10 text-center">
              <p className="text-black font-medium text-xl">Posizione:  Umbertide</p>
              <p className="text-black font-normal text-lg">Data di inizio: 19/01/2026</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* GRAFICO GRANDE */}
            <div className="lg:col-span-3 bg-white/90 rounded-3xl shadow-lg backdrop-blur-md p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <h3 className="font-bold text-2xl">Grafici</h3>
                  <button
                    onClick={() => setShowTemperatura(! showTemperatura)}
                    className={`px-4 py-2 rounded-full font-semibold transition ${
                      showTemperatura ?  'bg-red-500 text-white' :  'bg-gray-200 text-black'
                    }`}
                  >
                    Temperatura
                  </button>
                  <button
                    onClick={() => setShowUmidita(!showUmidita)}
                    className={`px-4 py-2 rounded-full font-semibold transition ${
                      showUmidita ? 'bg-blue-400 text-white' : 'bg-gray-200 text-black'
                    }`}
                  >
                    Umidità
                  </button>
                  <button
                    onClick={() => setShowPeso(!showPeso)}
                    className={`px-4 py-2 rounded-full font-semibold transition ${
                      showPeso ? 'bg-gray-500 text-white' : 'bg-gray-200 text-black'
                    }`}
                  >
                    Peso
                  </button>
                </div>

                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="border-2 border-gray-300 rounded-lg px-4 py-2 font-medium bg-white"
                >
                  <option value="1mese">1 Mese</option>
                  <option value="3mesi">3 Mesi</option>
                  <option value="6mesi">6 Mesi</option>
                  <option value="1anno">1 Anno</option>
                </select>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { giorno: "1", temperatura: 20, umidita: 65, peso: 45 },
                      { giorno: "5", temperatura: 22, umidita: 70, peso: 46 },
                      { giorno: "10", temperatura: 24, umidita: 68, peso: 47 },
                      { giorno: "15", temperatura: 23, umidita: 72, peso: 48 },
                      { giorno: "20", temperatura: 25, umidita: 75, peso: 49 },
                      { giorno: "25", temperatura: 26, umidita: 73, peso: 50 },
                      { giorno: "30", temperatura: 27, umidita: 70, peso: 51 },
                    ]}
                  >
                    <XAxis dataKey="giorno" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    
                    {/* Soglia Temperatura Massima */}
                    <ReferenceLine 
                      y={sogliaTemperaturaMax} 
                      stroke="#ef4444" 
                      strokeDasharray="3 3" 
                      label={{ value: 'Soglia Temp Max', position: 'right', fill: '#ef4444', fontWeight: 'bold' }}
                    />
                    
                    {/* Soglia Peso Minimo */}
                    <ReferenceLine 
                      y={sogliaPesoMin} 
                      stroke="#6b7280" 
                      strokeDasharray="3 3" 
                      label={{ value: 'Soglia Peso Min', position: 'left', fill: '#6b7280', fontWeight: 'bold' }}
                    />
                    
                    {showTemperatura && <Line type="monotone" dataKey="temperatura" stroke="#ef4444" strokeWidth={3} />}
                    {showUmidita && <Line type="monotone" dataKey="umidita" stroke="#60a5fa" strokeWidth={3} />}
                    {showPeso && <Line type="monotone" dataKey="peso" stroke="#6b7280" strokeWidth={3} strokeDasharray="5 5" />}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* SENSORI */}
            <div className="bg-white/90 rounded-3xl shadow-lg backdrop-blur-md p-8">
              <h3 className="font-bold text-2xl mb-6">Sensori</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <img src="src/assets/icona_goccia.svg" alt="Umidità" className="w-8 h-8" />
                  <span className="font-bold text-lg">Umidità: 8%</span>
                </div>
                <div className="flex items-center gap-4">
                  <img src="src/assets/icona_termometro.svg" alt="Temperatura" className="w-8 h-8" />
                  <span className="font-bold text-lg">Temperatura: 23 C°</span>
                </div>
                <div className="flex items-center gap-4">
                  <img src="src/assets/icona_peso. svg" alt="Peso" className="w-8 h-8" />
                  <span className="font-bold text-lg">Peso: 9 Kg</span>
                </div>
              </div>
            </div>

            {/* NOTIFICHE */}
            <div className="lg:col-span-2 bg-white/90 rounded-3xl shadow-lg backdrop-blur-md p-8">
              <h3 className="font-bold text-2xl mb-6">Notifiche</h3>
              <div className="bg-amber-200 rounded-2xl p-6 flex items-start gap-4">
                <img src="src/assets/icona_avviso.svg" alt="Avviso" className="w-8 h-8 mt-1" />
                <div>
                  <p className="font-bold text-lg text-black">Possibile Fecondazione</p>
                  <p className="text-black font-normal">Sono stati rilevati numerosi fuchi fuori dall'arnia, Controllare.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
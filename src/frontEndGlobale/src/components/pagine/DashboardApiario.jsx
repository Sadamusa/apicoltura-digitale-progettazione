import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";

// Import asset - paths corretti
import icona_menu from "../../assets/icona_menu.svg";
import icona_impostazioni from "../../assets/icona_impostazioni.svg";
import icona_moveitem from "../../assets/move_item.svg";
import icona_alveare from "../../assets/icona_alveare.svg";
import icona_goccia from "../../assets/icona_goccia.svg";
import icona_termometro from "../../assets/icona_termometro.svg";
import icona_peso from "../../assets/icona_peso.svg";

// Componente SVG temporaneo per l'icona avviso
function IconaAvviso({ className = "w-8 h-8" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M9. 401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-. 29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-. 75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
    </svg>
  );
}

function DashboardApiario({ apiaries, selectedId, setSelectedId, onAdd, onNavigateToTaratura, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(true);
  const [showUmidita, setShowUmidita] = useState(true);
  const [showPeso, setShowPeso] = useState(true);
  const [showTemperatura, setShowTemperatura] = useState(true);
  const [timeRange, setTimeRange] = useState("1mese");

  // Soglie
  const sogliaTemperaturaMax = 25;
  const sogliaPesoMin = 47;

  return (
    <div 
      className="min-h-screen flex bg-gray-100 relative"
      style={{
        backgroundImage: "url('src/assets/Sfondo_configurazione.png')",
        backgroundSize: 'cover',
        backgroundPosition:  'center'
      }}
    >
      {/* SIDEBAR DESKTOP */}
      <div className="hidden md:flex w-80 p-4">
        {menuOpen ?  (
          <Card className="w-full rounded-3xl bg-white/90 shadow-lg backdrop-blur-md overflow-hidden">
            <CardHeader className="space-y-4 p-8">
              {/* Barra icone */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {/* Bottone menu */}
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-2 rounded-full hover: bg-gray-200 transition"
                  >
                    <img src={icona_menu} alt="Menu" className="w-7 h-7" />
                  </button>

                  {/* Bottone impostazione */}
                  <button 
                    onClick={onNavigateToTaratura}
                    className="p-2 rounded-full hover:bg-gray-200 transition"
                  >
                    <img src={icona_impostazioni} alt="Impostazioni" className="w-7 h-7" />
                  </button>
                </div>

                {/* Bottone Logout */}
                <button 
                  onClick={onLogout}
                  className="p-2 rounded-full hover:bg-gray-200 transition"
                >
                  <img src={icona_moveitem} alt="Logout" className="w-7 h-7" />
                </button>
              </div>

              <CardTitle className="text-4xl font-bold text-left">
                Apiario
              </CardTitle>
            </CardHeader>

            <CardContent className="p-8 pt-0">
              {/* Lista apiari */}
              <div className="flex flex-col gap-4">
                {apiaries.length === 0 ? (
                  <div className="text-sm text-gray-500">Nessuna arnia.  Premi "Aggiungi" per crearne una.</div>
                ) : (
                  apiaries. map((a) => {
                    const isSelected = a.id === selectedId;
                    return (
                      <button
                        key={a.id}
                        onClick={() => setSelectedId(a.id)}
                        className={`w-full rounded-xl flex items-center gap-4 px-5 py-4 transition font-bold text-lg text-left relative
                          ${isSelected ? "bg-orange-500 text-white" : "bg-amber-200 text-black hover:bg-amber-300"}`}
                      >
                        <img src={icona_alveare} alt="Arnia" className="w-7 h-7" />
                        <span>{a.name}</span>
                        {a.notifiche && (
                          <span className="absolute right-4 top-3 bg-red-500 text-white text-sm w-6 h-6 rounded-full flex items-center justify-center font-bold">
                            {a.notifiche}
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </CardContent>

            <CardFooter className="p-8 pt-0">
              {/* Bottone Aggiungi */}
              <Button
                onClick={onAdd}
                className="w-full bg-amber-200 text-black font-bold text-lg px-5 py-4 hover:bg-amber-300 rounded-xl flex items-center gap-3 justify-center"
              >
                <span className="text-xl">＋</span>
                <span>Aggiungi</span>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="w-20 h-20 rounded-full flex items-center justify-center bg-white/90 shadow-lg backdrop-blur-md">
            <button
              onClick={() => setMenuOpen(true)}
              className="p-3 rounded-full hover:bg-gray-200 transition"
            >
              <img src={icona_menu} alt="Apri Menu" className="w-7 h-7" />
            </button>
          </Card>
        )}
      </div>

      {/* SIDEBAR MOBILE */}
      <div className="md:hidden">
        {! menuOpen && (
          <button
            onClick={() => setMenuOpen(true)}
            className="fixed top-4 left-4 z-50 p-3 rounded-full bg-white shadow-md hover:bg-gray-100 transition"
          >
            <img src={icona_menu} alt="Apri menu" className="w-6 h-6" />
          </button>
        )}

        {menuOpen && (
          <>
            {/* OVERLAY */}
            <div
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setMenuOpen(false)}
            />
            
            {/* MENU MOBILE */}
            <div className="fixed inset-y-0 left-0 z-50 w-80">
              <Card className="h-full rounded-r-3xl bg-white/90 shadow-lg backdrop-blur-md m-4 overflow-hidden flex flex-col">
                <CardHeader className="space-y-4 p-8">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setMenuOpen(false)}
                        className="p-2 rounded-full hover:bg-gray-200 transition"
                      >
                        <img src={icona_menu} alt="Chiudi menu" className="w-7 h-7" />
                      </button>

                      <button 
                        onClick={onNavigateToTaratura}
                        className="p-2 rounded-full hover:bg-gray-200 transition"
                      >
                        <img src={icona_impostazioni} alt="Impostazioni" className="w-7 h-7" />
                      </button>
                    </div>

                    <button 
                      onClick={onLogout}
                      className="p-2 rounded-full hover:bg-gray-200 transition"
                    >
                      <img src={icona_moveitem} alt="Logout" className="w-7 h-7" />
                    </button>
                  </div>

                  <CardTitle className="text-4xl font-bold text-left">
                    Apiario
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-8 pt-0 flex-1 overflow-y-auto">
                  <div className="flex flex-col gap-4">
                    {apiaries.length === 0 ?  (
                      <div className="text-sm text-gray-500">Nessuna arnia.  Premi "Aggiungi" per crearne una.</div>
                    ) : (
                      apiaries.map((a) => {
                        const isSelected = a.id === selectedId;
                        return (
                          <button
                            key={a.id}
                            onClick={() => {
                              setSelectedId(a.id);
                              setMenuOpen(false);
                            }}
                            className={`w-full rounded-xl flex items-center gap-4 px-5 py-4 transition font-bold text-lg text-left relative
                              ${isSelected ? "bg-orange-500 text-white" : "bg-amber-200 text-black hover:bg-amber-300"}`}
                          >
                            <img src={icona_alveare} alt="Arnia" className="w-7 h-7" />
                            <span>{a.name}</span>
                            {a.notifiche && (
                              <span className="absolute right-4 top-3 bg-red-500 text-white text-sm w-6 h-6 rounded-full flex items-center justify-center font-bold">
                                {a.notifiche}
                              </span>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </CardContent>

                <CardFooter className="p-8 pt-0">
                  <Button
                    onClick={onAdd}
                    className="w-full bg-amber-200 text-black font-bold text-lg px-5 py-4 hover:bg-amber-300 rounded-xl flex items-center gap-3 justify-center"
                  >
                    <span className="text-xl">＋</span>
                    <span>Aggiungi</span>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </>
        )}
      </div>

      {/* CONTENUTO PRINCIPALE */}
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* HEADER CON CHECKMARK - SFUMATO VERDE FUORI DAL DIV BIANCO */}
          <div className="mb-6 relative">
            {/* Layer sfumato verde con blur - DIETRO TUTTO */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden" style={{ height: '200px' }}>
              <div 
                className="w-full h-full blur-2xl opacity-60"
                style={{
                  background: 'linear-gradient(to right, rgba(134, 239, 172, 0.4) 0%, rgba(74, 222, 128, 0.6) 30%, rgba(34, 197, 94, 0.7) 50%, rgba(74, 222, 128, 0.6) 70%, rgba(134, 239, 172, 0.4) 100%)'
                }}
              />
            </div>

            {/* Contenuto "Ok" sopra lo sfumato */}
            <div className="relative z-10 flex items-center justify-between px-6 py-6">
              <div className="flex items-center gap-4">
                <svg className="w-16 h-16 text-black drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-6xl font-bold text-black drop-shadow-lg">Ok</span>
              </div>

              <div className="text-right">
                <p className="text-black font-normal text-sm"><b>Posizione:  Umbertide</b></p>
                <p className="text-black font-normal text-sm"><b>Data di inizio: 19/01/2026</b></p>
              </div>
            </div>
          </div>

          {/* GRAFICO - DIV BIANCO SEPARATO */}
          <div className="bg-white/90 rounded-3xl shadow-lg backdrop-blur-md p-8 mb-6">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <h3 className="font-bold text-2xl">Grafici</h3>
                <button
                  onClick={() => setShowTemperatura(! showTemperatura)}
                  className={`px-4 py-2 rounded-full font-semibold transition ${
                    showTemperatura ?  'bg-blue-600 text-white' : 'bg-gray-200 text-black'
                  }`}
                >
                  Temperatura
                </button>
                <button
                  onClick={() => setShowUmidita(!showUmidita)}
                  className={`px-4 py-2 rounded-full font-normal transition ${
                    showUmidita ? 'bg-white border-2 border-gray-300 text-black' : 'bg-gray-200 text-black'
                  }`}
                >
                  Umidità
                </button>
                <button
                  onClick={() => setShowPeso(!showPeso)}
                  className={`px-4 py-2 rounded-full font-semibold transition ${
                    showPeso ? 'bg-red-600 text-white' :  'bg-gray-200 text-black'
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
                    { giorno: "1", temperatura: 20, umidita:  65, peso: 45 },
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
                    label={{ value: 'Soglia di temperatura', position: 'insideTopLeft', fill: '#000', fontWeight: 'normal' }}
                  />
                  
                  {/* Soglia Peso Minimo */}
                  <ReferenceLine 
                    y={sogliaPesoMin} 
                    stroke="#6b7280" 
                    strokeDasharray="3 3" 
                    label={{ value: 'Soglia di peso', position: 'insideBottomLeft', fill: '#000', fontWeight: 'normal' }}
                  />
                  
                  {showTemperatura && <Line type="monotone" dataKey="temperatura" stroke="#2563eb" strokeWidth={3} />}
                  {showUmidita && <Line type="monotone" dataKey="umidita" stroke="#22c55e" strokeWidth={3} />}
                  {showPeso && <Line type="monotone" dataKey="peso" stroke="#dc2626" strokeWidth={3} strokeDasharray="5 5" />}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SENSORI E NOTIFICHE */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* SENSORI */}
            <div className="bg-white/90 rounded-3xl shadow-lg backdrop-blur-md p-8">
              <h3 className="font-bold text-2xl mb-6">Sensori</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <img src={icona_goccia} alt="Umidità" className="w-8 h-8" />
                  <span className="font-normal text-lg">Umidità:  <span className="font-semibold">8%</span></span>
                </div>
                <div className="flex items-center gap-4">
                  <img src={icona_termometro} alt="Temperatura" className="w-8 h-8" />
                  <span className="font-normal text-lg">Temperatura: <span className="font-semibold">23 C°</span></span>
                </div>
                <div className="flex items-center gap-4">
                  <img src={icona_peso} alt="Peso" className="w-8 h-8" />
                  <span className="font-normal text-lg">Peso: <span className="font-semibold">9 Kg</span></span>
                </div>
              </div>
            </div>

            {/* NOTIFICHE */}
            <div className="lg:col-span-2 bg-white/90 rounded-3xl shadow-lg backdrop-blur-md p-8">
              <h3 className="font-bold text-2xl mb-6">Notifiche</h3>
              <div className="bg-amber-200 rounded-2xl p-6 flex items-start gap-4">
                <IconaAvviso className="w-8 h-8 mt-1 text-orange-600" />
                <div>
                  <p className="font-bold text-lg text-black">Possibile Fecondazione</p>
                  <p className="text-black font-normal">Sono stati rilevati numerosi fuchi fuori dall'arnia, Controllare. </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardApiario;
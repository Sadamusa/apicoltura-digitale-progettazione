import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";

// Import asset
import icona_menu from "../../assets/icona_menu.svg";
import icona_impostazioni from "../../assets/icona_impostazioni.svg";
import icona_moveitem from "../../assets/FrecciaIndietro.svg";
import icona_alveare from "../../assets/icona_alveare.svg";
import icona_goccia from "../../assets/icona_goccia.svg";
import icona_termometro from "../../assets/icona_termometro.svg";
import icona_peso from "../../assets/icona_peso.svg";

function IconaAvviso({ className = "w-8 h-8" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
    </svg>
  );
}

function DashboardApiario({ selectedId, setSelectedId, onNavigateToTaratura, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(true);
  const [showUmidita, setShowUmidita] = useState(true);
  const [showPeso, setShowPeso] = useState(true);
  const [showTemperatura, setShowTemperatura] = useState(true);
  const [timeRange, setTimeRange] = useState("1mese");
  const [locationFilter, setLocationFilter] = useState("tutte");
  const [apiaries, setApiaries] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dati sensore arnia selezionata
  const [sensorData, setSensorData] = useState({
    temperatura: null,
    umidita: null,
    peso: null
  });
  const [chartData, setChartData] = useState([]);
  const [loadingSensors, setLoadingSensors] = useState(false);

  // AGGIUNGI QUESTO 👇
  const [soglie, setSoglie] = useState({
    temperaturaMax: 25,  // valori di default
    pesoMin: 47,
    umiditaMin: null,
    umiditaMax: null
  });

  const API_URL = 'https://pumbastilizzato-e441.restdb.io/rest';
  const API_KEY = '69733a6b3731f70ae53fd875';


  useEffect(() => {
    console.log('=== DashboardApiario montato ===');
    loadApiaries();
  }, []);

  // Carica i dati sensore quando cambia l'arnia selezionata
  useEffect(() => {
    if (selectedId) {
      loadSensorData(selectedId);
    }
  }, [selectedId, timeRange]);


  const loadApiaries = async () => {
    try {
      setLoading(true);
      console.log('📄 [Dashboard] Inizio caricamento arnie...');

      const headers = {
        'Content-Type': 'application/json',
        'x-apikey': API_KEY,
        'cache-control': 'no-cache'
      };

      // 1. Carica le arnie
      const arniaResponse = await fetch(`${API_URL}/arnie`, {
        method: 'GET',
        headers: headers
      });

      if (!arniaResponse.ok) {
        throw new Error(`Errore HTTP ${arniaResponse.status}`);
      }

      const arniaData = await arniaResponse.json();

      if (!Array.isArray(arniaData)) {
        throw new Error('Formato dati non valido');
      }

      // 2. Carica gli apiari
      const apiariResponse = await fetch(`${API_URL}/apiari`, {
        method: 'GET',
        headers: headers
      });
      const apiariData = await apiariResponse.json();

      // 3. Crea mappa posizioni (api_id -> api_luogo)
      const locationMap = {};
      apiariData.forEach(apiario => {
        locationMap[apiario.api_id] = apiario.api_luogo || 'Non specificata';
      });

      // 4. Estrai posizioni uniche per il filtro
      const uniqueLocations = [...new Set(Object.values(locationMap))];
      setLocations(uniqueLocations);

      // 5. Trasforma i dati delle arnie
      const transformedData = arniaData.map((arnia) => {
        const posizione = locationMap[arnia.arn_api_id] || 'Non specificata';
        return {
          id: arnia.arn_id,
          name: `Arnia ${arnia.arn_id}`,
          arn_id: arnia.arn_id,
          arn_api_id: arnia.arn_api_id,
          arn_piena: arnia.arn_piena,
          arn_MacAddress: arnia.arn_MacAddress,
          arn_dataInst: arnia.arn_dataInst,
          posizione: posizione,
          _id: arnia._id,
          notifiche: 0
        };
      });

      console.log('✅ [Dashboard] Dati trasformati:', transformedData);
      setApiaries(transformedData);

      // 6. Selezione automatica della prima arnia se non c'è selezione
      if (transformedData.length > 0 && !selectedId) {
        console.log('🎯 [Dashboard] Selezione automatica:', transformedData[0].id);
        setSelectedId(transformedData[0].id);
      }

    } catch (error) {
      console.error('❌ [Dashboard] Errore:', error);
      alert(`Errore nel caricamento: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadSensorData = async (arniaId) => {
    try {
      setLoadingSensors(true);
      console.log('📊 Caricamento dati sensore per arnia:', arniaId);

      // 1. Carica i sensori dell'arnia dalla tabella "sensoriarnia"
      const query = JSON.stringify({ "sea_arn_id": parseInt(arniaId) });
      const sensorsResponse = await fetch(`${API_URL}/sensoriarnia?q=${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-apikey': API_KEY,
          'cache-control': 'no-cache'
        }
      });

      const sensors = await sensorsResponse.json();
      console.log('🔍 Sensori arnia trovati:', sensors);

      if (!sensors || sensors.length === 0) {
        console.warn('⚠️ Nessun sensore trovato per questa arnia');
        setSensorData({ temperatura: null, umidita: null, peso: null });
        setChartData([]);
        return;
      }

      // 2. Carica le soglie dai sensori
      const newSoglie = {
        temperaturaMax: 25,  // default
        pesoMin: 47,
        umiditaMin: null,
        umiditaMax: null
      };

      sensors.forEach(s => {
        if (s.sea_tip_id === 12) {  // Temperatura
          newSoglie.temperaturaMax = s.sea_max || 25;
        } else if (s.sea_tip_id === 10) {  // Umidità
          newSoglie.umiditaMin = s.sea_min;
          newSoglie.umiditaMax = s.sea_max;
        } else if (s.sea_tip_id === 11) {  // Peso
          newSoglie.pesoMin = s.sea_min || 47;
        }
      });

      console.log('🎯 Soglie caricate:', newSoglie);
      setSoglie(newSoglie);

      // 3. Identifica i sensori per tipo
      const sensorTypes = {};
      sensors.forEach(s => {
        if (s.sea_tip_id === 12) {
          sensorTypes['TEMPERATURE'] = s.sea_id;
        } else if (s.sea_tip_id === 10) {
          sensorTypes['HUMIDITY'] = s.sea_id;
        } else if (s.sea_tip_id === 11) {
          sensorTypes['WEIGHT'] = s.sea_id;
        }
      });

      console.log('🔍 Tipi sensore identificati:', sensorTypes);

      // 4. Carica le rilevazioni per questi sensori
      const sensorIds = sensors.map(s => s.sea_id);
      const rilQuery = JSON.stringify({ "ril_sea_id": { "$in": sensorIds } });

      const rilResponse = await fetch(`${API_URL}/rilevazioni?q=${rilQuery}&max=1000&sort=ril_dataOra&dir=-1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-apikey': API_KEY,
          'cache-control': 'no-cache'
        }
      });

      const rilevazioni = await rilResponse.json();
      console.log('📈 Rilevazioni trovate:', rilevazioni.length, rilevazioni);

      // 5. Estrai gli ultimi valori
      let lastTemp = null, lastHum = null, lastWeight = null;

      rilevazioni.forEach(r => {
        if (r.ril_sea_id === sensorTypes.TEMPERATURE && lastTemp === null) {
          lastTemp = r.ril_dato;
        } else if (r.ril_sea_id === sensorTypes.HUMIDITY && lastHum === null) {
          lastHum = r.ril_dato;
        } else if (r.ril_sea_id === sensorTypes.WEIGHT && lastWeight === null) {
          lastWeight = r.ril_dato;
        }
      });

      console.log('📊 Ultimi valori:', { lastTemp, lastHum, lastWeight });

      setSensorData({
        temperatura: lastTemp,
        umidita: lastHum,
        peso: lastWeight
      });

      // 6. Prepara dati per il grafico
      const chartDataMap = {};

      rilevazioni.forEach(r => {
        const date = new Date(r.ril_dataOra);
        const dateKey = `${date.getDate()}/${date.getMonth() + 1}`;

        if (!chartDataMap[dateKey]) {
          chartDataMap[dateKey] = { giorno: dateKey };
        }

        if (r.ril_sea_id === sensorTypes.TEMPERATURE) {
          chartDataMap[dateKey].temperatura = r.ril_dato;
        } else if (r.ril_sea_id === sensorTypes.HUMIDITY) {
          chartDataMap[dateKey].umidita = r.ril_dato;
        } else if (r.ril_sea_id === sensorTypes.WEIGHT) {
          chartDataMap[dateKey].peso = r.ril_dato;
        }
      });

      const chartArray = Object.values(chartDataMap).reverse().slice(0, 30);
      console.log('📊 Dati grafico:', chartArray);
      setChartData(chartArray);

    } catch (error) {
      console.error('❌ Errore caricamento sensori:', error);
      alert(`Errore: ${error.message}`);
    } finally {
      setLoadingSensors(false);
    }
  };

  const handleSettingsClick = () => {
    console.log("🛠️ Click su Impostazioni. ID Selezionato:", selectedId);

    if (!selectedId) {
      alert("Nessuna arnia selezionata. Per favore seleziona un'arnia dalla lista.");
      return;
    }

    const arniaSelezionata = apiaries.find(a => String(a.id) === String(selectedId));

    if (arniaSelezionata) {
      console.log("🚀 Navigazione verso taratura con oggetto:", arniaSelezionata);
      onNavigateToTaratura(arniaSelezionata);
    } else {
      console.error("❌ ERRORE CRITICO: ID selezionato non trovato nella lista apiaries.");
      alert("Errore: Impossibile trovare i dati dell'arnia selezionata.");
    }
  };

  // Filtra arnie per posizione
  const filteredApiaries = locationFilter === "tutte"
    ? apiaries
    : apiaries.filter(a => a.posizione === locationFilter);

  const selectedArnia = apiaries.find(a => a.id === selectedId);

  return (
    <div
      className="min-h-screen flex bg-gray-100 relative"
      style={{
        backgroundImage: "url('src/assets/Sfondo_configurazione.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* SIDEBAR DESKTOP */}
      <div className="hidden md:flex w-80 p-4">
        {menuOpen ? (
          <Card className="w-full rounded-3xl bg-white/90 shadow-lg backdrop-blur-md overflow-hidden">
            <CardHeader className="space-y-4 p-8">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-200 transition"
                  >
                    <img src={icona_menu} alt="Menu" className="w-7 h-7" />
                  </button>

                  <button
                    onClick={handleSettingsClick}
                    className="p-2 rounded-full hover:bg-gray-200 transition"
                    title="Taratura Sensori"
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

              {/* FILTRO POSIZIONE */}
              <div className="pt-2">
                <label className="block text-sm font-semibold text-gray-600 mb-2">Filtra per posizione</label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 font-medium bg-white"
                >
                  <option value="tutte">Tutte le posizioni</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </CardHeader>

            <CardContent className="p-8 pt-0">
              {loading && (
                <div className="text-center text-gray-600 py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                  Caricamento...
                </div>
              )}

              {!loading && (
                <div className="flex flex-col gap-4">
                  {filteredApiaries.length === 0 ? (
                    <div className="text-sm text-gray-500 text-center py-4">
                      <p className="mb-2">Nessuna arnia trovata per questa posizione.</p>
                    </div>
                  ) : (
                    filteredApiaries.map((a) => {
                      const isSelected = a.id === selectedId;
                      return (
                        <button
                          key={a.id}
                          onClick={() => {
                            console.log('🎯 Selezione arnia:', a.id);
                            setSelectedId(a.id);
                          }}
                          className={`w-full rounded-xl flex flex-col gap-2 px-5 py-4 transition font-bold text-lg text-left relative
                            ${isSelected ? "bg-orange-500 text-white" : "bg-amber-200 text-black hover:bg-amber-300"}`}
                        >
                          <div className="flex items-center gap-4">
                            <img src={icona_alveare} alt="Arnia" className="w-7 h-7" />
                            <span>{a.name}</span>
                          </div>
                          <span className={`text-xs font-normal ${isSelected ? "text-white/80" : "text-gray-600"}`}>
                            📍 {a.posizione}
                          </span>
                          {a.notifiche > 0 && (
                            <span className="absolute right-4 top-3 bg-red-500 text-white text-sm w-6 h-6 rounded-full flex items-center justify-center font-bold">
                              {a.notifiche}
                            </span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter className="p-8 pt-0">
              <Button
                onClick={loadApiaries}
                disabled={loading}
                className="w-full bg-amber-200 text-black font-bold text-lg px-5 py-4 hover:bg-amber-300 rounded-xl flex items-center gap-3 justify-center disabled:opacity-50"
              >
                <span className="text-xl">↻</span>
                <span>{loading ? 'Caricamento...' : 'Aggiorna'}</span>
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

      {/* CONTENUTO PRINCIPALE */}
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">

          {/* BANNER STATO - Dinamico in base alle notifiche */}
          <div className="mb-6 relative">
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden" style={{ height: '200px' }}>
              <div
                className="w-full h-full blur-2xl opacity-60"
                style={{
                  background: (sensorData.temperatura !== null && sensorData.temperatura > soglie.temperaturaMax) ||
                    (sensorData.peso !== null && sensorData.peso < soglie.pesoMin)
                    ? 'linear-gradient(to right, rgba(239, 68, 68, 0.4) 0%, rgba(220, 38, 38, 0.6) 30%, rgba(185, 28, 28, 0.7) 50%, rgba(220, 38, 38, 0.6) 70%, rgba(239, 68, 68, 0.4) 100%)'
                    : 'linear-gradient(to right, rgba(134, 239, 172, 0.4) 0%, rgba(74, 222, 128, 0.6) 30%, rgba(34, 197, 94, 0.7) 50%, rgba(74, 222, 128, 0.6) 70%, rgba(134, 239, 172, 0.4) 100%)'
                }}
              />
            </div>

            <div className="relative z-10 flex items-center justify-between px-6 py-6">
              <div className="flex items-center gap-4">
                {(sensorData.temperatura !== null && sensorData.temperatura > soglie.temperaturaMax) ||
                  (sensorData.peso !== null && sensorData.peso < soglie.pesoMin) ? (
                  <>
                    <svg className="w-16 h-16 text-black drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-6xl font-bold text-black drop-shadow-lg">Pericolo!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-16 h-16 text-black drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-6xl font-bold text-black drop-shadow-lg">Ok</span>
                  </>
                )}
              </div>

              <div className="text-right">
                <p className="text-black font-normal text-sm"><b>Posizione: {selectedArnia?.posizione || 'N/D'}</b></p>
                <p className="text-black font-normal text-sm"><b>Data di inizio: {selectedArnia?.arn_dataInst ? new Date(selectedArnia.arn_dataInst).toLocaleDateString('it-IT') : 'N/D'}</b></p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 rounded-3xl shadow-lg backdrop-blur-md p-8 mb-6">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <h3 className="font-bold text-2xl">Grafici</h3>
                <button
                  onClick={() => setShowTemperatura(!showTemperatura)}
                  className={`px-4 py-2 rounded-full font-semibold transition ${showTemperatura ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'
                    }`}
                >
                  Temperatura
                </button>
                <button
                  onClick={() => setShowUmidita(!showUmidita)}
                  className={`px-4 py-2 rounded-full font-normal transition ${showUmidita ? 'bg-white border-2 border-gray-300 text-black' : 'bg-gray-200 text-black'
                    }`}
                >
                  Umidità
                </button>
                <button
                  onClick={() => setShowPeso(!showPeso)}
                  className={`px-4 py-2 rounded-full font-semibold transition ${showPeso ? 'bg-red-600 text-white' : 'bg-gray-200 text-black'
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
              {loadingSensors ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="giorno" />
                    <YAxis />
                    <Tooltip />
                    <Legend />

                    <ReferenceLine
                      y={soglie.temperaturaMax}
                      stroke="#ef4444"
                      strokeDasharray="3 3"
                      label={{ value: 'Soglia di temperatura', position: 'insideTopLeft', fill: '#000', fontWeight: 'normal' }}
                    />

                    <ReferenceLine
                      y={soglie.pesoMin}
                      stroke="#6b7280"
                      strokeDasharray="3 3"
                      label={{ value: 'Soglia di peso', position: 'insideBottomLeft', fill: '#000', fontWeight: 'normal' }}
                    />

                    {showTemperatura && <Line type="monotone" dataKey="temperatura" stroke="#2563eb" strokeWidth={3} />}
                    {showUmidita && <Line type="monotone" dataKey="umidita" stroke="#22c55e" strokeWidth={3} />}
                    {showPeso && <Line type="monotone" dataKey="peso" stroke="#dc2626" strokeWidth={3} strokeDasharray="5 5" />}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Nessun dato disponibile per questa arnia
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white/90 rounded-3xl shadow-lg backdrop-blur-md p-8">
              <h3 className="font-bold text-2xl mb-6">Sensori</h3>
              {loadingSensors ? (
                <div className="text-center py-4">Caricamento...</div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <img src={icona_goccia} alt="Umidità" className="w-8 h-8" />
                    <span className="font-normal text-lg">Umidità: <span className="font-semibold">{sensorData.umidita !== null ? `${sensorData.umidita.toFixed(1)}%` : 'N/D'}</span></span>
                  </div>
                  <div className="flex items-center gap-4">
                    <img src={icona_termometro} alt="Temperatura" className="w-8 h-8" />
                    <span className="font-normal text-lg">Temperatura: <span className="font-semibold">{sensorData.temperatura !== null ? `${sensorData.temperatura.toFixed(1)} C°` : 'N/D'}</span></span>
                  </div>
                  <div className="flex items-center gap-4">
                    <img src={icona_peso} alt="Peso" className="w-8 h-8" />
                    <span className="font-normal text-lg">Peso: <span className="font-semibold">{sensorData.peso !== null ? `${sensorData.peso.toFixed(1)} Kg` : 'N/D'}</span></span>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-2 bg-white/90 rounded-3xl shadow-lg backdrop-blur-md p-8">
              <h3 className="font-bold text-2xl mb-6">Notifiche</h3>
              {sensorData.temperatura !== null && sensorData.temperatura > soglie.temperaturaMax ? (
                <div className="bg-red-100 rounded-2xl p-6 flex items-start gap-4 mb-4">
                  <IconaAvviso className="w-8 h-8 mt-1 text-red-600" />
                  <div>
                    <p className="font-bold text-lg text-black">Temperatura Elevata</p>
                    <p className="text-black font-normal">La temperatura ha superato la soglia massima di {soglie.temperaturaMax}°C</p>
                  </div>
                </div>
              ) : null}

              {sensorData.peso !== null && sensorData.peso < soglie.pesoMin ? (
                <div className="bg-amber-200 rounded-2xl p-6 flex items-start gap-4">
                  <IconaAvviso className="w-8 h-8 mt-1 text-orange-600" />
                  <div>
                    <p className="font-bold text-lg text-black">Peso Basso</p>
                    <p className="text-black font-normal">Il peso è sceso sotto la soglia minima di {soglie.pesoMin} Kg</p>
                  </div>
                </div>
              ) : null}

              {(!sensorData.temperatura || sensorData.temperatura <= soglie.temperaturaMax) &&
                (!sensorData.peso || sensorData.peso >= soglie.pesoMin) && (
                  <div className="bg-green-100 rounded-2xl p-6 flex items-center gap-4">
                    <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-bold text-lg text-black">Tutto OK</p>
                      <p className="text-black font-normal">Nessuna notifica al momento</p>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardApiario;
import { useState, useEffect } from 'react';
// Assicurati che i percorsi delle immagini siano corretti per la tua cartella
import sfondoTaratura from '../../assets/sfondo2.png'; 
import frecciaIndietro from '../../assets/FrecciaIndietro.svg';
import iconaGoccia from '../../assets/icona_goccia.svg';
import iconaTermometro from '../../assets/icona_termometro.svg';
import iconaPeso from '../../assets/icona_peso.svg';

function TaraturaApiario({ selectedArnia, onBackToSidebar }) {
  // Stati per i valori dei sensori
  const [humidity, setHumidity] = useState({ min: '', max: '' });
  const [temperature, setTemperature] = useState({ min: '', max: '' });
  const [weight, setWeight] = useState({ min: '', max: '' });
  
  // Stati per la gestione dati DB
  const [sensors, setSensors] = useState({}); // Mappa i sensori trovati
  const [sensorTypes, setSensorTypes] = useState({}); // Mappa gli ID dei tipi
  const [loading, setLoading] = useState(false);

  // CONFIGURAZIONE API
  const API_URL = 'https://databasesagomato2316-f801.restdb.io/rest';
  const API_KEY = '6971f2593731f762e33fd827';

  // 1. Al caricamento della pagina, scarichiamo i TIPI di sensore
  useEffect(() => {
    loadSensorTypes();
  }, []);

  // 2. Quando abbiamo i TIPI e un'ARNIA selezionata, scarichiamo i suoi SENSORI
  useEffect(() => {
    // Controllo di sicurezza: verifichiamo che selectedArnia esista e abbia un ID
    if (selectedArnia && (selectedArnia.arn_id || selectedArnia.id) && Object.keys(sensorTypes).length > 0) {
      loadSensors();
    }
  }, [selectedArnia, sensorTypes]);

  // --- FUNZIONI DI CARICAMENTO ---

  const loadSensorTypes = async () => {
    try {
      const response = await fetch(`${API_URL}/tipo`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json', 
            'x-apikey': API_KEY,
            'cache-control': 'no-cache'
        }
      });
      const types = await response.json();
      
      const typeMap = {};
      // Mappiamo gli ID in base alla descrizione nel DB
      types.forEach(t => {
        const desc = t.tip_descrizione ? t.tip_descrizione.toLowerCase() : '';
        if (desc.includes('umid')) typeMap['HUMIDITY'] = t.tip_id;
        else if (desc.includes('temp')) typeMap['TEMPERATURE'] = t.tip_id;
        else if (desc.includes('peso')) typeMap['WEIGHT'] = t.tip_id;
      });
      setSensorTypes(typeMap);
    } catch (error) {
      console.error("Errore caricamento tipi:", error);
    }
  };

  const loadSensors = async () => {
    if (!selectedArnia) return;
    setLoading(true);

    try {
      // Usa arn_id se esiste, altrimenti usa id (fallback)
      const idDaCercare = selectedArnia.arn_id || selectedArnia.id;
      console.log("Cerco sensori per arnia ID:", idDaCercare);

      const query = JSON.stringify({ "sen_arn_id": idDaCercare });
      
      const response = await fetch(`${API_URL}/sensore?q=${query}`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json', 
            'x-apikey': API_KEY,
            'cache-control': 'no-cache'
        }
      });
      
      const data = await response.json();
      console.log("Sensori trovati:", data);

      const sensorsObj = {};
      
      // Organizza i sensori trovati in base al loro TIPO
      data.forEach(s => {
        sensorsObj[s.sen_tip_id] = s;
      });
      setSensors(sensorsObj);

      // Riempie le textbox con i valori attuali
      if (sensorTypes.HUMIDITY && sensorsObj[sensorTypes.HUMIDITY]) {
        setHumidity({ 
            min: sensorsObj[sensorTypes.HUMIDITY].sen_min ?? '', 
            max: sensorsObj[sensorTypes.HUMIDITY].sen_max ?? '' 
        });
      }
      if (sensorTypes.TEMPERATURE && sensorsObj[sensorTypes.TEMPERATURE]) {
        setTemperature({ 
            min: sensorsObj[sensorTypes.TEMPERATURE].sen_min ?? '', 
            max: sensorsObj[sensorTypes.TEMPERATURE].sen_max ?? '' 
        });
      }
      if (sensorTypes.WEIGHT && sensorsObj[sensorTypes.WEIGHT]) {
        setWeight({ 
            min: sensorsObj[sensorTypes.WEIGHT].sen_min ?? '', 
            max: sensorsObj[sensorTypes.WEIGHT].sen_max ?? '' 
        });
      }

    } catch (error) {
      console.error("Errore caricamento sensori:", error);
      alert("Errore nel recupero dati sensori");
    } finally {
      setLoading(false);
    }
  };

  // --- FUNZIONE DI SALVATAGGIO ---

  const handleSave = async (category) => {
    setLoading(true);
    let typeId, values, label;

    if (category === 'humidity') {
      typeId = sensorTypes.HUMIDITY;
      values = humidity;
      label = "Umidità";
    } else if (category === 'temperature') {
      typeId = sensorTypes.TEMPERATURE;
      values = temperature;
      label = "Temperatura";
    } else if (category === 'weight') {
      typeId = sensorTypes.WEIGHT;
      values = weight;
      label = "Peso";
    }

    const currentSensor = sensors[typeId];

    if (!currentSensor || !currentSensor._id) {
      alert(`Errore: Nessun sensore ${label} trovato per questa arnia nel database.`);
      setLoading(false);
      return;
    }

    // FIX: Gestione valori vuoti per evitare NaN
    const valMin = values.min === '' ? 0 : parseFloat(values.min);
    const valMax = values.max === '' ? 0 : parseFloat(values.max);

    try {
      const response = await fetch(`${API_URL}/sensore/${currentSensor._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-apikey': API_KEY
        },
        body: JSON.stringify({
          sen_min: valMin,
          sen_max: valMax
        })
      });

      if (response.ok) {
        alert(`Taratura ${label} salvata con successo!`);
        loadSensors(); 
      } else {
        alert("Errore durante il salvataggio.");
      }
    } catch (error) {
      console.error("Errore save:", error);
      alert("Errore di connessione.");
    } finally {
      setLoading(false);
    }
  };

  // Se non c'è arnia selezionata (fallback UI)
  if (!selectedArnia) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 bg-gray-100">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Nessuna Arnia Selezionata</h2>
            <p className="text-gray-600 mb-4">Torna alla dashboard e seleziona un'arnia prima di configurarla.</p>
            <button onClick={onBackToSidebar} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Torna indietro</button>
        </div>
      </div>
    );
  }

  // Nome visualizzato
  const nomeArniaDisplay = selectedArnia.name || `Arnia #${selectedArnia.arn_id}`; 

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4 md:p-8"
      style={{
        backgroundImage: `url(${sfondoTaratura})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="w-full max-w-5xl">
        <div className="rounded-3xl bg-white/80 p-6 md:p-8 shadow-2xl backdrop-blur-md border border-white/50">
          
          {/* HEADER */}
          <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onBackToSidebar}
                className="group rounded-full bg-white/50 p-2 transition hover:bg-orange-100"
              >
                <img 
                    src={frecciaIndietro} 
                    alt="Indietro" 
                    className="h-6 w-6 transition group-hover:-translate-x-1" 
                />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Taratura Sensori</h1>
                <p className="text-xl font-semibold text-orange-600">{nomeArniaDisplay}</p>
              </div>
            </div>
            {loading && <span className="text-sm font-bold text-orange-500 animate-pulse">Salvataggio in corso...</span>}
          </div>

          {/* GRIGLIA CONFIGURAZIONE */}
          <div className="grid gap-6 md:grid-cols-3">
            
            {/* CARD UMIDITÀ */}
            <div className="rounded-2xl bg-white p-6 shadow-lg transition hover:shadow-xl">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-blue-50 p-4 ring-4 ring-blue-50/50">
                  <img src={iconaGoccia} alt="Umidità" className="h-16 w-16" />
                </div>
              </div>
              <h3 className="mb-4 text-center text-xl font-bold text-gray-700">Umidità</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-500">Minima (%)</label>
                  <input
                    type="number"
                    value={humidity.min}
                    onChange={(e) => setHumidity({ ...humidity, min: e.target.value })}
                    className="w-full rounded-xl border-0 bg-gray-100 px-4 py-3 font-medium text-gray-800 focus:ring-2 focus:ring-blue-400"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-500">Massima (%)</label>
                  <input
                    type="number"
                    value={humidity.max}
                    onChange={(e) => setHumidity({ ...humidity, max: e.target.value })}
                    className="w-full rounded-xl border-0 bg-gray-100 px-4 py-3 font-medium text-gray-800 focus:ring-2 focus:ring-blue-400"
                    placeholder="100"
                  />
                </div>
                <button
                  onClick={() => handleSave('humidity')}
                  disabled={loading}
                  className="mt-2 w-full rounded-xl bg-blue-500 py-3 font-bold text-white transition hover:bg-blue-600 disabled:opacity-50"
                >
                  Salva Umidità
                </button>
              </div>
            </div>

            {/* CARD TEMPERATURA */}
            <div className="rounded-2xl bg-white p-6 shadow-lg transition hover:shadow-xl">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-red-50 p-4 ring-4 ring-red-50/50">
                  <img src={iconaTermometro} alt="Temperatura" className="h-16 w-16" />
                </div>
              </div>
              <h3 className="mb-4 text-center text-xl font-bold text-gray-700">Temperatura</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-500">Minima (°C)</label>
                  <input
                    type="number"
                    value={temperature.min}
                    onChange={(e) => setTemperature({ ...temperature, min: e.target.value })}
                    className="w-full rounded-xl border-0 bg-gray-100 px-4 py-3 font-medium text-gray-800 focus:ring-2 focus:ring-red-400"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-500">Massima (°C)</label>
                  <input
                    type="number"
                    value={temperature.max}
                    onChange={(e) => setTemperature({ ...temperature, max: e.target.value })}
                    className="w-full rounded-xl border-0 bg-gray-100 px-4 py-3 font-medium text-gray-800 focus:ring-2 focus:ring-red-400"
                    placeholder="50"
                  />
                </div>
                <button
                  onClick={() => handleSave('temperature')}
                  disabled={loading}
                  className="mt-2 w-full rounded-xl bg-red-500 py-3 font-bold text-white transition hover:bg-red-600 disabled:opacity-50"
                >
                  Salva Temp.
                </button>
              </div>
            </div>

            {/* CARD PESO */}
            <div className="rounded-2xl bg-white p-6 shadow-lg transition hover:shadow-xl">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-amber-50 p-4 ring-4 ring-amber-50/50">
                  <img src={iconaPeso} alt="Peso" className="h-16 w-16" />
                </div>
              </div>
              <h3 className="mb-4 text-center text-xl font-bold text-gray-700">Peso</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-500">Minimo (kg)</label>
                  <input
                    type="number"
                    value={weight.min}
                    onChange={(e) => setWeight({ ...weight, min: e.target.value })}
                    className="w-full rounded-xl border-0 bg-gray-100 px-4 py-3 font-medium text-gray-800 focus:ring-2 focus:ring-amber-400"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-500">Massimo (kg)</label>
                  <input
                    type="number"
                    value={weight.max}
                    onChange={(e) => setWeight({ ...weight, max: e.target.value })}
                    className="w-full rounded-xl border-0 bg-gray-100 px-4 py-3 font-medium text-gray-800 focus:ring-2 focus:ring-amber-400"
                    placeholder="100"
                  />
                </div>
                <button
                  onClick={() => handleSave('weight')}
                  disabled={loading}
                  className="mt-2 w-full rounded-xl bg-amber-500 py-3 font-bold text-white transition hover:bg-amber-600 disabled:opacity-50"
                >
                  Salva Peso
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default TaraturaApiario;
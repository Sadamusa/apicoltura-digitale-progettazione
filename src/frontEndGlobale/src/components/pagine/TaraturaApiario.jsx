import { useState, useEffect } from 'react';
// Assicurati che i percorsi delle immagini siano corretti per la tua cartella
import sfondoTaratura from '../../assets/sfondo2.png';
import frecciaIndietro from '../../assets/FrecciaIndietro.svg';
import iconaGoccia from '../../assets/icona_goccia.svg';
import iconaTermometro from '../../assets/icona_termometro.svg';
import iconaPeso from '../../assets/icona_peso.svg';

function TaraturaApiario({ selectedArnia, onBackToSidebar }) {
  const [humidity, setHumidity] = useState({ min: '', max: '' });
  const [temperature, setTemperature] = useState({ min: '', max: '' });
  const [weight, setWeight] = useState({ min: '', max: '' });

  const [sensors, setSensors] = useState({});
  const [loading, setLoading] = useState(false);

  const API_URL = 'https://norimbergamaxima-e90d.restdb.io/rest';
  const API_KEY = '697209fd3731f74dc33fd839';

  // ID TIPI SENSORI
  const SENSOR_TYPES = {
    HUMIDITY: 10,
    WEIGHT: 11,
    TEMPERATURE: 12
  };

  useEffect(() => {
    if (selectedArnia && (selectedArnia.arn_id || selectedArnia.id)) {
      loadSensors();
    }
  }, [selectedArnia]);

  const loadSensors = async () => {
    if (!selectedArnia) return;
    setLoading(true);

    try {
      const idDaCercare = selectedArnia.arn_id || selectedArnia.id;
      console.log("🔍 Cerco sensori per arnia ID:", idDaCercare);

      const query = JSON.stringify({ "sea_arn_id": idDaCercare });

      const response = await fetch(`${API_URL}/sensoriarnia?q=${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-apikey': API_KEY,
          'cache-control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`Errore HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log("📊 Sensori trovati:", data);

      const sensorsObj = {};

      data.forEach(s => {
        sensorsObj[s.sea_tip_id] = s;
        console.log(`  → Sensore tipo ${s.sea_tip_id}:`, s);
      });
      setSensors(sensorsObj);

      // Carica valori esistenti
      if (sensorsObj[SENSOR_TYPES.HUMIDITY]) {
        setHumidity({
          min: sensorsObj[SENSOR_TYPES.HUMIDITY].sea_min ?? '',
          max: sensorsObj[SENSOR_TYPES.HUMIDITY].sea_max ?? ''
        });
        console.log("✅ Umidità caricata:", sensorsObj[SENSOR_TYPES.HUMIDITY]);
      } else {
        console.log("⚠️ Nessun sensore umidità (tip_id: 10) trovato per questa arnia");
      }

      if (sensorsObj[SENSOR_TYPES.TEMPERATURE]) {
        setTemperature({
          min: sensorsObj[SENSOR_TYPES.TEMPERATURE].sea_min ?? '',
          max: sensorsObj[SENSOR_TYPES.TEMPERATURE].sea_max ?? ''
        });
        console.log("✅ Temperatura caricata:", sensorsObj[SENSOR_TYPES.TEMPERATURE]);
      } else {
        console.log("⚠️ Nessun sensore temperatura (tip_id: 12) trovato per questa arnia");
      }

      if (sensorsObj[SENSOR_TYPES.WEIGHT]) {
        setWeight({
          min: sensorsObj[SENSOR_TYPES.WEIGHT].sea_min ?? '',
          max: sensorsObj[SENSOR_TYPES.WEIGHT].sea_max ?? ''
        });
        console.log("✅ Peso caricato:", sensorsObj[SENSOR_TYPES.WEIGHT]);
      } else {
        console.log("⚠️ Nessun sensore peso (tip_id: 11) trovato per questa arnia");
      }

    } catch (error) {
      console.error("❌ Errore caricamento sensori:", error);
      alert(`Errore nel recupero dati sensori: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (category) => {
    setLoading(true);
    let typeId, values, label;

    if (category === 'humidity') {
      typeId = SENSOR_TYPES.HUMIDITY;
      values = humidity;
      label = "Umidità";
    } else if (category === 'temperature') {
      typeId = SENSOR_TYPES.TEMPERATURE;
      values = temperature;
      label = "Temperatura";
    } else if (category === 'weight') {
      typeId = SENSOR_TYPES.WEIGHT;
      values = weight;
      label = "Peso";
    }

    const currentSensor = sensors[typeId];

    console.log(`💾 Tentativo salvataggio ${label}:`, {
      typeId,
      currentSensor,
      allSensors: sensors
    });

    if (!currentSensor || !currentSensor._id) {
      alert(`❌ Errore: Nessun sensore ${label} (tipo ${typeId}) trovato per questa arnia nel database.\n\nSensori disponibili per questa arnia: tip_id ${Object.keys(sensors).join(', ')}`);
      setLoading(false);
      return;
    }

    const valMin = values.min === '' ? 0 : parseFloat(values.min);
    const valMax = values.max === '' ? 0 : parseFloat(values.max);

    try {
      console.log(`🚀 Invio PUT a /sensoriarnia/${currentSensor._id}:`, {
        sea_min: valMin,
        sea_max: valMax
      });

      // ✅ CORREZIONE: Invia TUTTI i campi del sensore, non solo min/max
      const updatedSensor = {
        ...currentSensor,  // Mantieni tutti i campi esistenti
        sea_min: valMin,   // Aggiorna solo min
        sea_max: valMax    // Aggiorna solo max
      };

      // Rimuovi campi interni di RestDB
      delete updatedSensor._id;
      delete updatedSensor._created;
      delete updatedSensor._changed;
      delete updatedSensor._createdby;
      delete updatedSensor._changedby;
      delete updatedSensor._version;

      console.log("📤 Invio dati completi:", updatedSensor);

      const response = await fetch(`${API_URL}/sensoriarnia/${currentSensor._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-apikey': API_KEY
        },
        body: JSON.stringify(updatedSensor)
      });

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Risposta salvataggio:", result);
        alert(`✅ Taratura ${label} salvata con successo!\n\nNuovi valori: Min ${valMin}, Max ${valMax}`);
        loadSensors();
      } else {
        const errorText = await response.text();
        console.error("❌ Errore risposta:", errorText);
        alert(`Errore durante il salvataggio: ${response.status}\n${errorText}`);
      }
    } catch (error) {
      console.error("❌ Errore save:", error);
      alert(`Errore di connessione: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

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
            {loading && <span className="text-sm font-bold text-orange-500 animate-pulse">Operazione in corso...</span>}
          </div>

          <div className="grid gap-6 md:grid-cols-3">

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
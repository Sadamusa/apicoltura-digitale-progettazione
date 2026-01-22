import { useState, useEffect } from 'react';
import sfondoTaratura from '../../assets/sfondo2.png';
import frecciaIndietro from '../../assets/FrecciaIndietro.svg';
import iconaGoccia from '../../assets/icona_goccia.svg';
import iconaTermometro from '../../assets/icona_termometro.svg';
import iconaPeso from '../../assets/icona_peso.svg';

function TaraturaApiario({ selectedApiario, onDelete, onBackToSidebar }) {
  const [humidity, setHumidity] = useState({ min: '', max: '' });
  const [temperature, setTemperature] = useState({ min: '', max: '' });
  const [weight, setWeight] = useState({ min: '', max: '' });
  const [sensors, setSensors] = useState({});
  const [sensorTypes, setSensorTypes] = useState({});
  const [loading, setLoading] = useState(false);

  const API_URL = 'https://databaseclone2-bc78.restdb.io/rest';
  const API_KEY = '6971db543731f717573fd80a';

  // Carica i tipi di rilevazione dal database
  useEffect(() => {
    loadSensorTypes();
  }, []);

  // Carica i sensori quando viene selezionata un'arnia
  useEffect(() => {
    if (selectedApiario && (selectedApiario.arn_id !== undefined || selectedApiario.id !== undefined)) {
      loadSensors();
    }
  }, [selectedApiario, sensorTypes]);

  const loadSensorTypes = async () => {
    try {
      const response = await fetch(`${API_URL}/tipirilevazione`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-apikey': API_KEY,
          'cache-control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error('Errore nel caricamento dei tipi di rilevazione');
      }

      const types = await response.json();
      console.log('Tipi di rilevazione caricati:', types);
      
      // Crea una mappa tipo -> id
      const typeMap = {};
      types.forEach(type => {
        const tipoLower = type.tipo?.toLowerCase();
        if (tipoLower) {
          if (tipoLower.includes('umid')) {
            typeMap.HUMIDITY = type._id;
          } else if (tipoLower.includes('temp')) {
            typeMap.TEMPERATURE = type._id;
          } else if (tipoLower.includes('peso')) {
            typeMap.WEIGHT = type._id;
          }
        }
      });
      
      console.log('Mappa tipi sensore:', typeMap);
      setSensorTypes(typeMap);

    } catch (error) {
      console.error('Errore nel caricamento dei tipi:', error);
      alert('Errore nel caricamento dei tipi di rilevazione');
    }
  };

  const loadSensors = async () => {
    if (Object.keys(sensorTypes).length === 0) {
      console.log('Tipi sensore non ancora caricati');
      return;
    }

    try {
      setLoading(true);
      
      // Recupera l'ID dell'arnia
      //const arniaId = selectedApiario.arn_id !== undefined ? selectedApiario.arn_id : selectedApiario.id;
      
      const arniaId = 5;
      
      console.log('Caricamento sensori per arnia ID:', arniaId);
      
      // Recupera tutti i sensori dell'arnia dalla tabella sensoriarnia
      const response = await fetch(`${API_URL}/sensoriarnia?q={"sea_arn_id":${arniaId}}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-apikey': API_KEY,
          'cache-control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error('Errore nel caricamento dei sensori');
      }

      const sensorsData = await response.json();
      console.log('Sensori caricati:', sensorsData);
      
      // Organizza i sensori per tipo
      const sensorsByType = {};
      sensorsData.forEach(sensor => {
        sensorsByType[sensor.sea_tip_id] = sensor;
      });
      
      setSensors(sensorsByType);

      // Popola i campi con i valori esistenti
      if (sensorTypes.HUMIDITY && sensorsByType[sensorTypes.HUMIDITY]) {
        const humiditySensor = sensorsByType[sensorTypes.HUMIDITY];
        setHumidity({
          min: humiditySensor.sea_min || '',
          max: humiditySensor.sea_max || ''
        });
      }

      if (sensorTypes.TEMPERATURE && sensorsByType[sensorTypes.TEMPERATURE]) {
        const tempSensor = sensorsByType[sensorTypes.TEMPERATURE];
        setTemperature({
          min: tempSensor.sea_min || '',
          max: tempSensor.sea_max || ''
        });
      }

      if (sensorTypes.WEIGHT && sensorsByType[sensorTypes.WEIGHT]) {
        const weightSensor = sensorsByType[sensorTypes.WEIGHT];
        setWeight({
          min: weightSensor.sea_min || '',
          max: weightSensor.sea_max || ''
        });
      }

    } catch (error) {
      console.error('Errore nel caricamento dei sensori:', error);
      alert('Errore nel caricamento dei dati dei sensori. Verifica la console per dettagli.');
    } finally {
      setLoading(false);
    }
  };

  const updateSensor = async (sensorId, minValue, maxValue) => {
    try {
      console.log('Aggiornamento sensore:', { sensorId, minValue, maxValue });
      
      const response = await fetch(`${API_URL}/sensoriarnia/${sensorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-apikey': API_KEY,
          'cache-control': 'no-cache'
        },
        body: JSON.stringify({
          sea_min: parseFloat(minValue),
          sea_max: parseFloat(maxValue)
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Errore risposta API:', errorText);
        throw new Error('Errore nell\'aggiornamento del sensore');
      }

      const result = await response.json();
      console.log('Sensore aggiornato con successo:', result);
      return result;
    } catch (error) {
      console.error('Errore nell\'aggiornamento del sensore:', error);
      throw error;
    }
  };

  const handleSave = async (type) => {
    try {
      setLoading(true);

      let sensor;
      let values;
      let typeName;
      let sensorTypeId;

      // Determina quale sensore aggiornare in base al tipo
      switch (type) {
        case 'humidity':
          sensorTypeId = sensorTypes.HUMIDITY;
          sensor = sensors[sensorTypeId];
          values = humidity;
          typeName = 'Umidità';
          break;
        case 'temperature': 
          sensorTypeId = sensorTypes.TEMPERATURE;
          sensor = sensors[sensorTypeId];
          values = temperature;
          typeName = 'Temperatura';
          break;
        case 'weight':
          sensorTypeId = sensorTypes.WEIGHT;
          sensor = sensors[sensorTypeId];
          values = weight;
          typeName = 'Peso';
          break;
        default: 
          throw new Error('Tipo di sensore non valido');
      }

      if (!sensorTypeId) {
        alert(`Tipo ${typeName} non trovato nel database. Verifica la tabella Tipirilevazione.`);
        return;
      }

      if (!sensor || !sensor._id) {
        alert(`Sensore ${typeName} non trovato per questa arnia. Verifica che il sensore sia stato creato nella tabella Sensoriarnia con sea_arn_id=${selectedApiario.arn_id || selectedApiario.id} e sea_tip_id=${sensorTypeId}`);
        console.error('Sensore non trovato:', { 
          type, 
          sensorTypeId, 
          sensor, 
          allSensors: sensors 
        });
        return;
      }

      // Validazione
      if (!values.min || !values.max) {
        alert('Inserisci sia il valore minimo che massimo');
        return;
      }

      const minVal = parseFloat(values.min);
      const maxVal = parseFloat(values.max);

      if (isNaN(minVal) || isNaN(maxVal)) {
        alert('Inserisci valori numerici validi');
        return;
      }

      if (minVal >= maxVal) {
        alert('Il valore minimo deve essere inferiore al massimo');
        return;
      }

      // Aggiorna il sensore
      await updateSensor(sensor._id, values.min, values.max);

      alert(`Taratura ${typeName} salvata con successo!`);
      
      // Ricarica i sensori per aggiornare i dati
      await loadSensors();

    } catch (error) {
      console.error('Errore nel salvataggio:', error);
      alert(`Errore nel salvataggio della taratura: ${error.message}`);
    } finally {
      setLoading(false);
    }
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
      <div className="w-full max-w-4xl">
        <div className="rounded-3xl bg-white/70 p-8 shadow-xl backdrop-blur-md">
          <div className="mb-12 flex items-center justify-between">
            <div className="flex items-baseline gap-2 font-bold text-black-800">
              <button
                onClick={onBackToSidebar}
                className="bg-transparent border-0 p-0 cursor-pointer hover:opacity-80 transition"
                disabled={loading}
              >
                <img
                  src={frecciaIndietro}
                  alt="FrecciaIndietro"
                  className="h-8 w-8"
                />
              </button>
              <span className="text-5xl">Taratura</span>
              <span className="text-2xl">
                {selectedApiario ? selectedApiario.name || `Arnia ${selectedApiario.arn_id || selectedApiario.id}` : 'Arnia'}
              </span>
            </div>
            <button
              onClick={onDelete}
              className="rounded-lg bg-gray-500 px-8 py-2 font-semibold text-white transition hover:bg-red-600"
              disabled={loading}
            >
              Elimina Arnia
            </button>
          </div>

          {loading && (
            <div className="mb-4 text-center text-gray-600">
              Caricamento in corso...
            </div>
          )}

          <div className="grid gap-8 md:grid-cols-3">
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
                    Minimo (%)
                  </label>
                  <input
                    type="number"
                    value={humidity.min}
                    onChange={(e) => setHumidity({ ...humidity, min: e.target.value })}
                    className="w-full rounded-lg border-0 bg-amber-100 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="0"
                    disabled={loading}
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-600">
                    Massimo (%)
                  </label>
                  <input
                    type="number"
                    value={humidity.max}
                    onChange={(e) => setHumidity({ ...humidity, max: e.target.value })}
                    className="w-full rounded-lg border-0 bg-amber-100 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="100"
                    disabled={loading}
                    step="0.01"
                  />
                </div>

                <button
                  onClick={() => handleSave('humidity')}
                  className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-black transition hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
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
                    src={iconaTermometro}
                    alt="Temperatura"
                    className="h-22 w-22"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-600">
                    Minimo (°C)
                  </label>
                  <input
                    type="number"
                    value={temperature.min}
                    onChange={(e) => setTemperature({ ...temperature, min: e.target.value })}
                    className="w-full rounded-lg border-0 bg-amber-100 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                    placeholder="0"
                    disabled={loading}
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-600">
                    Massimo (°C)
                  </label>
                  <input
                    type="number"
                    value={temperature.max}
                    onChange={(e) => setTemperature({ ...temperature, max: e.target.value })}
                    className="w-full rounded-lg border-0 bg-amber-100 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                    placeholder="50"
                    disabled={loading}
                    step="0.01"
                  />
                </div>

                <button
                  onClick={() => handleSave('temperature')}
                  className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-black transition hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
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
                    src={iconaPeso}
                    alt="Peso"
                    className="h-22 w-22"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-600">
                    Minimo (kg)
                  </label>
                  <input
                    type="number"
                    value={weight.min}
                    onChange={(e) => setWeight({ ...weight, min: e.target.value })}
                    className="w-full rounded-lg border-0 bg-amber-100 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    placeholder="0"
                    disabled={loading}
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-600">
                    Massimo (kg)
                  </label>
                  <input
                    type="number"
                    value={weight.max}
                    onChange={(e) => setWeight({ ...weight, max: e.target.value })}
                    className="w-full rounded-lg border-0 bg-amber-100 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    placeholder="100"
                    disabled={loading}
                    step="0.01"
                  />
                </div>

                <button
                  onClick={() => handleSave('weight')}
                  className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-black transition hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
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

export default TaraturaApiario;
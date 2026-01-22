import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card"
import { useState, useEffect } from "react"

{/* Import asset*/ }
import icona_menu from "../../assets/icona_menu.svg"
import icona_impostazioni from "../../assets/icona_impostazioni.svg"
import icona_moveitem from "../../assets/move_item.svg"

function HoneycombIcon({ className = "w-6 h-6" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M7 3. 5L3.5 6v6L7 15.5 10.5 12V6L7 3.5z" fill="#F4E1C7" />
      <path d="M17 3.5L13.5 6v6L17 15.5 20.5 12V6L17 3.5z" fill="#F4E1C7" />
      <path d="M12 2L9. 5 4.5v5L12 12l2.5-2.5v-5L12 2z" fill="#E5B96C" />
      <path d="M7 15.5L3.5 18v3. 5L7 23 10.5 21.5V18L7 15.5z" fill="#E8CFA7" />
      <path d="M17 15.5L13.5 18v3.5L17 23 20.5 21.5V18L17 15.5z" fill="#E8CFA7" />
    </svg>
  )
}

function SidebarApiario({ selectedId, setSelectedId, onNavigateToTaratura, onLogout }) {
  const [cardVisible, setCardVisible] = useState(true)
  const [apiaries, setApiaries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const API_URL = 'https://databasesagomato2316-f801.restdb.io/';
  const API_KEY = '6971f2593731f762e33fd827';

  // Carica le arnie all'avvio
  useEffect(() => {
    console.log('=== SidebarApiario montato ===');
    loadApiaries();
  }, []);

  const loadApiaries = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Inizio caricamento arnie...');
      console.log('📍 API_URL:', API_URL);
      console.log('🔑 API_KEY:', API_KEY ? '✓ Presente' : '✗ Mancante');

      const url = `${API_URL}/arnia`;
      console.log('🌐 URL completo:', url);

      const headers = {
        'Content-Type': 'application/json',
        'x-apikey': API_KEY,
        'cache-control': 'no-cache'
      };
      console.log('📋 Headers:', headers);

      const response = await fetch(url, {
        method: 'GET',
        headers: headers
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Errore risposta:', errorText);
        throw new Error(`Errore HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Dati ricevuti:', data);
      console.log('📊 Numero di arnie:', Array.isArray(data) ? data.length : 'Non è un array');

      if (!Array.isArray(data)) {
        console.error('❌ I dati non sono un array:', typeof data);
        throw new Error('Formato dati non valido');
      }

      // Trasforma i dati dal formato DB al formato usato dall'app
      const transformedData = data.map((arnia, index) => {
        console.log(`🔄 Trasformazione arnia ${index}:`, arnia);
        return {
          id: arnia.arn_id || arnia._id,
          name: `Arnia ${arnia.arn_id || index + 1}`,
          arn_id: arnia.arn_id,
          arn_api_id: arnia.arn_api_id,
          arn_piena: arnia.arn_piena,
          arn_MacAddress: arnia.arn_MacAddress,
          arn_dataInst: arnia.arn_dataInst,
          _id: arnia._id
        };
      });

      console.log('✅ Dati trasformati:', transformedData);
      setApiaries(transformedData);

      // Seleziona automaticamente la prima arnia se nessuna è selezionata
      if (transformedData.length > 0 && !selectedId) {
        console.log('🎯 Selezione automatica prima arnia:', transformedData[0].id);
        setSelectedId(transformedData[0].id);
      }

      console.log('✅ Caricamento completato con successo');

    } catch (error) {
      console.error('❌ ERRORE COMPLETO:', error);
      console.error('❌ Tipo errore:', error.name);
      console.error('❌ Messaggio:', error.message);
      console.error('❌ Stack:', error.stack);

      setError(error.message);
      alert(`Errore nel caricamento delle arnie: ${error.message}`);
    } finally {
      setLoading(false);
      console.log('🏁 Fine caricamento (loading=false)');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {cardVisible && (
        <Card className="w-full max-w-sm rounded-[34px] transition-all duration-300 overflow-hidden">
          <CardHeader className="space-y-4 p-4">

            {/* Barra icone */}
            <div className="flex justify-between items-center">

              <div className="flex items-center gap-3">
                {/* Bottone menu */}
                <button
                  onClick={() => setCardVisible(false)}
                  className="p-2 rounded-full hover:bg-gray-200 transition"
                  disabled={loading}
                >
                  <img src={icona_menu} alt="Menu" className="w-6 h-6" />
                </button>

                {/* Bottone impostazione*/}
                <button
                  onClick={onNavigateToTaratura}
                  className="p-2 rounded-full hover:bg-gray-200 transition"
                  disabled={loading || !selectedId}
                >
                  <img src={icona_impostazioni} alt="Impostazioni" className="w-6 h-6" />
                </button>
              </div>

              {/* Bottone Logout*/}
              <button
                onClick={onLogout}
                className="p-2 rounded-full hover:bg-gray-200 transition"
                disabled={loading}
              >
                <img src={icona_moveitem} alt="Logout" className="w-6 h-6" />
              </button>

            </div>

            <CardTitle className="text-3xl font-extrabold text-left">
              Apiario
            </CardTitle>

          </CardHeader>

          <CardContent className="p-4">
            {loading && (
              <div className="text-center text-gray-600 py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                Caricamento arnie...
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p className="font-bold">Errore: </p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {!loading && !error && (
              <div className="flex flex-col gap-3">
                {apiaries.length === 0 ? (
                  <div className="text-sm text-gray-500 py-4 text-center">
                    <p className="mb-2">Nessuna arnia trovata nel database. </p>
                    <p className="text-xs">Controlla la console per i dettagli</p>
                  </div>
                ) : (
                  apiaries.map((a) => {
                    const isSelected = a.id === selectedId
                    return (
                      <button
                        key={a.id}
                        onClick={() => {
                          console.log('🎯 Arnia selezionata:', a);
                          setSelectedId(a.id);
                        }}
                        className={
                          `w-full rounded-xl flex items-center justify-between px-4 py-3 transition 
                          ${isSelected ? "bg-[#C77A00] text-white" : "bg-[#F2DFC2] text-black"}`
                        }
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${isSelected ? "bg-[#B56600]" : "bg-[#F4E0C7]"}`}>
                            <HoneycombIcon className="w-5 h-5" />
                          </div>
                          <span className="font-semibold text-left">{a.name}</span>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            )}
          </CardContent>

          <CardFooter className="p-4">
            {/* Bottone Aggiorna */}
            <div className="w-full">
              <Button
                onClick={() => {
                  console.log('🔄 Click su Aggiorna');
                  loadApiaries();
                }}
                disabled={loading}
                className="w-full bg-[#F1D19C] text-black font-bold px-4 py-3 hover:bg-[#e6c182] rounded-xl flex items-center gap-3 justify-center disabled:opacity-50"
              >
                <span className="text-xl">↻</span>
                <span>{loading ? 'Caricamento.. .' : 'Aggiorna'}</span>
              </Button>
            </div>
          </CardFooter>

        </Card>
      )}

      {/*Metodo per rendere visibile e invisibile la card al click del bottone menu a panino */}
      {!cardVisible && (
        <Card className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300">

          <button
            onClick={() => setCardVisible(true)}
            className="p-3 rounded-full hover:bg-gray-200 transition"
          >
            <img src={icona_menu} alt="Apri Menu" className="w-6 h-6" />
          </button>

        </Card>
      )}

    </div>
  )
}

export default SidebarApiario
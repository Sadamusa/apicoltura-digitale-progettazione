import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

import icona_menu from "./assets/icona_menu.svg";
import icona_impostazioni from "./assets/icona_impostazioni.svg";
import icona_moveitem from "./assets/move_item.svg";

import icona_goccia from "./assets/icona_goccia.svg";
import icona_peso from "./assets/icona_peso.svg";
import icona_termometro from "./assets/icona_termometro.svg";
import icona_avviso from "./assets/icona_avviso.svg";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUmidita, setShowUmidita] = useState(true);
  const [showPeso, setShowPeso] = useState(true);
  const [showTemperatura, setShowTemperatura] = useState(true);
  const [timeRange, setTimeRange] = useState("week");

  return (
    <div className="min-h-screen flex bg-gray-100 relative">

      {/* HAMBURGER MOBILE */}
      {!menuOpen && (
        <button
          onClick={() => setMenuOpen(true)}
          className="fixed top-4 left-4 z-50 p-3 rounded-full bg-white shadow-md hover:bg-gray-100 transition md:hidden"
        >
          <img src={icona_menu} alt="Apri menu" className="w-6 h-6" />
        </button>
      )}

      {/* OVERLAY MOBILE */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* MENU DESKTOP */}
      <div className="hidden md:flex w-80 justify-center">
        <Card className="w-full rounded-[34px] m-4 shadow-md bg-white">
          <CardHeader className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <button className="p-2 rounded-full hover:bg-gray-200 transition">
                  <img src={icona_menu} alt="Menu" className="w-6 h-6" />
                </button>

                <button className="p-2 rounded-full hover:bg-gray-200 transition">
                  <img src={icona_impostazioni} alt="Impostazioni" className="w-6 h-6" />
                </button>
              </div>

              <button className="p-2 rounded-full hover:bg-gray-200 transition">
                <img src={icona_moveitem} alt="Logout" className="w-6 h-6" />
              </button>
            </div>

            <CardTitle className="text-2xl font-bold">Apiario</CardTitle>
          </CardHeader>

          <CardFooter className="flex justify-center">
            <Button className="bg-[#F1D19C] text-black font-bold px-8 hover:bg-[#e6c182] transition">
              + Aggiungi
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* MENU MOBILE */}
      {menuOpen && (
        <div className="fixed inset-y-0 left-0 z-50 w-80 md:hidden">
          <Card className="h-full rounded-r-[34px] shadow-md bg-white m-4">
            <CardHeader className="space-y-4">
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-200 transition"
              >
                <img src={icona_menu} alt="Chiudi menu" className="w-6 h-6" />
              </button>

              <CardTitle className="text-2xl font-bold">Apiario</CardTitle>
            </CardHeader>

            <CardFooter className="flex justify-center">
              <Button className="bg-[#F1D19C] text-black font-bold px-8 hover:bg-[#e6c182] transition">
                + Aggiungi
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* CONTENUTI */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-screen-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* DIV GRANDE – Grafico Parametri */}
            <div className="md:col-span-2 bg-white rounded-[34px] shadow-md p-10 h-[500px] hover:shadow-lg transition flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <h3 className="font-bold text-2xl">Grafico Parametri</h3>

                  <button
                    onClick={() => setShowUmidita(!showUmidita)}
                    className={`px-3 py-1 rounded-full border ${showUmidita ? 'bg-[#3b82f6] text-white' : 'bg-gray-200 text-black'}`}
                  >
                    Umidità
                  </button>
                  <button
                    onClick={() => setShowPeso(!showPeso)}
                    className={`px-3 py-1 rounded-full border ${showPeso ? 'bg-[#6b7280] text-white' : 'bg-gray-200 text-black'}`}
                  >
                    Peso
                  </button>
                  <button
                    onClick={() => setShowTemperatura(!showTemperatura)}
                    className={`px-3 py-1 rounded-full border ${showTemperatura ? 'bg-[#f97316] text-white' : 'bg-gray-200 text-black'}`}
                  >
                    Temperatura
                  </button>
                </div>

                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="border rounded-lg p-2"
                >
                  <option value="week">Ultima settimana</option>
                  <option value="month">Ultimo mese</option>
                  <option value="3months">Ultimi 3 mesi</option>
                </select>
              </div>

              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={
                      timeRange === "week" ? [
                        { giorno: "Lun", umidita: 3, peso: 12, temperatura: 24 },
                        { giorno: "Mar", umidita: 5, peso: 11, temperatura: 23 },
                        { giorno: "Mer", umidita: 4, peso: 13, temperatura: 25 },
                        { giorno: "Gio", umidita: 6, peso: 12, temperatura: 24 },
                        { giorno: "Ven", umidita: 3, peso: 14, temperatura: 26 },
                        { giorno: "Sab", umidita: 5, peso: 13, temperatura: 25 },
                        { giorno: "Dom", umidita: 4, peso: 12, temperatura: 24 },
                      ]
                      : timeRange === "month" ? [
                        { giorno: "Settimana 1", umidita: 4, peso: 13, temperatura: 25 },
                        { giorno: "Settimana 2", umidita: 5, peso: 12, temperatura: 24 },
                        { giorno: "Settimana 3", umidita: 3, peso: 14, temperatura: 26 },
                        { giorno: "Settimana 4", umidita: 4, peso: 13, temperatura: 25 },
                      ]
                      : [
                        { giorno: "Gen-Mar", umidita: 4, peso: 13, temperatura: 25 },
                        { giorno: "Apr-Giu", umidita: 5, peso: 12, temperatura: 24 },
                        { giorno: "Lug-Set", umidita: 3, peso: 14, temperatura: 26 },
                        { giorno: "Ott-Dic", umidita: 4, peso: 13, temperatura: 25 },
                      ]
                    }
                  >
                    <XAxis dataKey="giorno" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {showUmidita && <Line type="monotone" dataKey="umidita" stroke="#3b82f6" />}
                    {showPeso && <Line type="monotone" dataKey="peso" stroke="#6b7280" />}
                    {showTemperatura && <Line type="monotone" dataKey="temperatura" stroke="#f97316" />}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* DIV PICCOLO SINISTRA – PARAMETRI */}
            <div className="bg-white rounded-[34px] shadow-md p-10 h-64 hover:shadow-lg transition flex flex-col gap-5">
              <h3 className="font-bold text-xl">Parametri</h3>
              <div className="flex items-center gap-4">
                <img src={icona_goccia} alt="Umidità" className="w-7 h-7" />
                <span className="font-medium text-lg">Umidità: 3%</span>
              </div>
              <div className="flex items-center gap-4">
                <img src={icona_peso} alt="Peso" className="w-7 h-7" />
                <span className="font-medium text-lg">Peso: 12kg</span>
              </div>
              <div className="flex items-center gap-4">
                <img src={icona_termometro} alt="Temperatura" className="w-7 h-7" />
                <span className="font-medium text-lg">Temperatura: 24°C</span>
              </div>
            </div>

            {/* DIV PICCOLO DESTRA – NOTIFICHE */}
            <div className="bg-white rounded-[34px] shadow-md p-10 h-64 hover:shadow-lg transition flex flex-col gap-4">
              <h3 className="font-bold text-xl mb-2">Notifiche</h3>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F1D19C]/40">
                <img src={icona_avviso} alt="Avviso" className="w-8 h-8 mt-1" />
                <div>
                  <span className="font-bold block text-black">Nuova arnia aggiunta</span>
                  <span className="text-black">È stata aggiunta un'arnia nel settore 3.</span>
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

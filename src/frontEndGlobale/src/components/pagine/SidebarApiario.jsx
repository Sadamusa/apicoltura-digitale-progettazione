import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card"
import { useState } from "react"

{/* Import asset*/}
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
      <path d="M7 3.5L3.5 6v6L7 15.5 10.5 12V6L7 3.5z" fill="#F4E1C7"/>
      <path d="M17 3.5L13.5 6v6L17 15.5 20.5 12V6L17 3.5z" fill="#F4E1C7"/>
      <path d="M12 2L9.5 4.5v5L12 12l2.5-2.5v-5L12 2z" fill="#E5B96C"/>
      <path d="M7 15.5L3.5 18v3.5L7 23 10.5 21.5V18L7 15.5z" fill="#E8CFA7"/>
      <path d="M17 15.5L13.5 18v3.5L17 23 20.5 21.5V18L17 15.5z" fill="#E8CFA7"/>
    </svg>
  )
}

function SidebarApiario({ apiaries, selectedId, setSelectedId, onAdd, onNavigateToTaratura, onLogout }) {
  const [cardVisible, setCardVisible] = useState(true)

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
                >
                  <img src={icona_menu} alt="Menu" className="w-6 h-6" />
                </button>

               {/* Bottone impostazione*/}
                <button 
                  onClick={onNavigateToTaratura}
                  className="p-2 rounded-full hover:bg-gray-200 transition"
                >
                  <img src={icona_impostazioni} alt="Impostazioni" className="w-6 h-6" />
                </button>
              </div>

             {/* Bottone Logout*/}
              <button 
                onClick={onLogout}
                className="p-2 rounded-full hover:bg-gray-200 transition"
              >
                <img src={icona_moveitem} alt="Logout" className="w-6 h-6" />
              </button>

            </div>

            <CardTitle className="text-3xl font-extrabold text-left">
              Apiario
            </CardTitle>

          </CardHeader>

          <CardContent className="p-4">
            {/* Lista apiari */}
            <div className="flex flex-col gap-3">
              {apiaries.length === 0 ? (
                <div className="text-sm text-gray-500">Nessuna arnia. Premi "Aggiungi" per crearne una.</div>
              ) : (
                apiaries.map((a) => {
                  const isSelected = a.id === selectedId
                  return (
                    <button
                      key={a.id}
                      onClick={() => setSelectedId(a.id)}
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
          </CardContent>

          <CardFooter className="p-4">
            {/* Bottone Aggiungi — pill bottom */}
            <div className="w-full">
              <Button
                onClick={onAdd}
                className="w-full bg-[#F1D19C] text-black font-bold px-4 py-3 hover:bg-[#e6c182] rounded-xl flex items-center gap-3 justify-center"
              >
                <span className="text-xl">＋</span>
                <span>Aggiungi</span>
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
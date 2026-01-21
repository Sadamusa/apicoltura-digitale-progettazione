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
import icona_menu from "./assets/icona_menu.svg"
import icona_impostazioni from "./assets/icona_impostazioni.svg"
import icona_moveitem from "./assets/move_item.svg"

function App() {
  const [cardVisible, setCardVisible] = useState(true)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      {cardVisible && (
        <Card className="w-full max-w-sm rounded-[34px] transition-all duration-300">

          <CardHeader className="space-y-4">

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
                <button className="p-2 rounded-full hover:bg-gray-200 transition">
                  <img src={icona_impostazioni} alt="Impostazioni" className="w-6 h-6" />
                </button>
              </div>

             {/* Bottone Logout*/}
              <button className="p-2 rounded-full hover:bg-gray-200 transition">
                <img src={icona_moveitem} alt="Logout" className="w-6 h-6" />
              </button>

            </div>

            <CardTitle className="text-2xl font-bold text-left">
              Apiario
            </CardTitle>

          </CardHeader>

          <CardContent />

          <CardFooter className="flex justify-center">
            {/* Bottone Aggiugi*/}
            <Button className="bg-[#F1D19C] text-black font-bold px-8 hover:bg-[#e6c182] transition">
              + Aggiungi
            </Button>
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

export default App

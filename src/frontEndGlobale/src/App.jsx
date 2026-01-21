import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card"
import { useState } from "react"
import MenuLogin from "./components/pagine/MenuLogin"
import SidebarApiario from "./components/pagine/SidebarApiario"
import ConfiguraApiario from "./components/pagine/ConfiguraApiario"
import TaraturaApiario from "./components/pagine/TaraturaApiario"

{/* Import asset*/}
import icona_menu from "./assets/icona_menu.svg"
import icona_impostazioni from "./assets/icona_impostazioni.svg"
import icona_moveitem from "./assets/move_item.svg"

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

function App() {
  const [currentPage, setCurrentPage] = useState('MenuLogin')

  // Lista di apiari: inizialmente vuota; si aggiunge uno ad ogni click su "Aggiungi"
  const [apiaries, setApiaries] = useState([])

  // ID dell'apiario selezionato (per evidenziare il primo o quello cliccato)
  const [selectedId, setSelectedId] = useState(null)

  const addApiario = () => {
    const nextIndex = apiaries.length + 1
    const newItem = {
      id: Date.now(),
      name: `Arnia ${nextIndex}`,
    }
    const newList = [...apiaries, newItem]
    setApiaries(newList)

    // Se è il primo elemento aggiunto, selezioniamolo per evidenziarlo
    if (newList.length === 1) setSelectedId(newItem.id)
    
    // Naviga alla pagina di configurazione
    setCurrentPage('Configura')
  }

  const deleteApiario = () => {
    if (selectedId) {
      const newList = apiaries.filter(a => a.id !== selectedId)
      setApiaries(newList)
      setSelectedId(newList.length > 0 ? newList[0].id : null)
      setCurrentPage('Sidebar')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'MenuLogin' && (
        <MenuLogin onLoginSuccess={() => setCurrentPage('Sidebar')} />
      )}
      {currentPage === 'Sidebar' && (
        <SidebarApiario 
          apiaries={apiaries}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          onAdd={addApiario}
          onNavigateToTaratura={() => setCurrentPage('Taratura')}
          onLogout={() => setCurrentPage('MenuLogin')}
        />
      )}
      {currentPage === 'Configura' && (
        <ConfiguraApiario onSave={() => setCurrentPage('Sidebar')} />
      )}
      {currentPage === 'Taratura' && (
        <TaraturaApiario 
          selectedApiario={apiaries.find(a => a.id === selectedId)}
          onDelete={deleteApiario}
          onBackToSidebar={() => setCurrentPage('Sidebar')}
        />
      )}
    </div>
  )
}

export default App
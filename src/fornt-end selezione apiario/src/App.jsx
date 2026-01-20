import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card"

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      
      <Card className="w-full max-w-sm">
        
        <CardHeader>
          <CardTitle>Apiario</CardTitle>
        </CardHeader>

        <CardFooter>
          <Button className="bg-[#F1D19C] text-black font-bold">
            + Aggiungi
          </Button>
        </CardFooter>

      </Card>

    </div>
  )
}

export default App

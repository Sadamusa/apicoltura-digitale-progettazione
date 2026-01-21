import { useState } from 'react';
import sfondoLogin from './assets/Sfondo_login.png';
import iconaAlveare from './assets/icona_alveare.svg';


function App() {
  const [apiKey, setApiKey] = useState('');

  const handleLogin = () => {
    console.log('Login clicked');
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${sfondoLogin})` }}
    >
      <div className="bg-white/30 backdrop-blur-sm rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          Login
        </h1>

        <div className="mb-6">
          <div className="flex items-center rounded-lg px-4 py-3" style={{ backgroundColor: '#E8C690' }}>
            <img 
              src={iconaAlveare} 
              alt="Alveare" 
              className="w-6 h-6 mr-3 opacity-70"
            />
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="ApiKey"
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-600"
            />
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-amber-500 hover: bg-amber-600 text-white font-bold text-lg py-3 px-4 rounded-lg transition-colors"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default App;
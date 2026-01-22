import { useState } from 'react';
import sfondoLogin from '../../assets/sfondo1.png';
import iconaAlveare from '../../assets/icona_alveare.svg';

function MenuLogin({ onLoginSuccess }) {
  const [apiKey, setApiKey] = useState('');

  const api = '6971db543731f717573fd80a';

  const handleLogin = () => {
    if (apiKey === api) {
      onLoginSuccess();
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${sfondoLogin})` }}
    >
      <div className="bg-white/45 backdrop-blur-sm rounded-2xl shadow-lg p-8 w-full max-w-sm">
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
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-amber-300 hover:shadow-[0_0_16px_4px_rgba(245,158,11,0.6)] active:shadow-[0_0_24px_8px_rgba(245,158,11,0.8)]"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default MenuLogin;
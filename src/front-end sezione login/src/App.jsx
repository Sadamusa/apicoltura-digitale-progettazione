import { useState } from 'react';
import sfondoLogin from './assets/Sfondo_login.png';

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
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Login
        </h1>

        <div className="mb-4">
          <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3">
            <svg 
              className="w-6 h-6 text-amber-600 mr-3" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M21 10.5h-2.5l1.25-2.17a. 5.5 0 0 0-.43-.75h-2.5l1.25-2.16a.5.5 0 0 0-. 43-.75H12.5a.5.5 0 0 0-.43.25L10.5 8H8l1.25-2.17a.5.5 0 0 0-.43-. 75H5.5a. 5.5 0 0 0-.43.25L3.5 8H1a.5.5 0 0 0-.43.75L2.07 11.57 13.25a.5.5 0 0 0 . 43.75H3.5l-1.25 2.17a.5.5 0 0 0 .43.75H6.5l-1.25 2.16a. 5.5 0 0 0 .43.75h4.14a.5.5 0 0 0 .43-.25L12 17h2.5l-1.25 2.17a. 5.5 0 0 0 .43.75h3.32a.5.5 0 0 0 .43-.25l1.57-2.67h3a.5.5 0 0 0 .43-.75L20.93 14l1.5-2.25a.5.5 0 0 0-.43-.75z"/>
            </svg>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e. target.value)}
              placeholder="ApiKey"
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500"
            />
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default App;
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css'; // Tailwind CSS ഉം മറ്റ് സ്റ്റൈലുകളും ഇവിടെ ഉണ്ടാകണം

// AuthContext-ൽ നിന്നുള്ള AuthProvider ഇംപോർട്ട് ചെയ്യുന്നു
import { AuthProvider } from './context/AuthContext.jsx';

/**
 * ReactDOM.createRoot: റിയാക്ട് ആപ്ലിക്കേഷൻ റെൻഡർ ചെയ്യുന്നു.
 * AuthProvider: ആപ്പിലെ എല്ലാ പേജുകളിലും ലോഗിൻ വിവരങ്ങൾ കിട്ടാൻ സഹായിക്കുന്നു.
 * BrowserRouter: റൂട്ടിംഗ് (Pages) കൃത്യമായി വർക്ക് ചെയ്യാൻ സഹായിക്കുന്നു.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
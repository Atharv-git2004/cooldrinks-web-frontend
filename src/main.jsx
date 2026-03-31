import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // Import added
import App from './App.jsx'
import './index.css'

// 1. BrowserRouter ഉപയോഗിച്ച് App-നെ പൊതിയണം (Routing വർക്ക് ആകാൻ).
// 2. StrictMode ഡെവലപ്‌മെന്റ് സമയത്ത് തെറ്റുകൾ കണ്ടെത്താൻ സഹായിക്കും.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AppProvider } from './context/AppContext'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
        <Toaster position="top-right" toastOptions={{ style: { background:'var(--card)', color:'var(--text)', border:'1px solid var(--border2)', fontFamily:'Outfit,sans-serif', fontSize:'0.9rem' } }} />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

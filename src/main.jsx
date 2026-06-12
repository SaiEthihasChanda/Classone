import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './NewApp'
import { DataProvider } from './lib/store'
import './styles/index.css'

createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <DataProvider>
      <App />
    </DataProvider>
  </React.StrictMode>,
)

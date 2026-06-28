import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './NewApp'
import { DataProvider } from './lib/store'
import { AuthProvider } from './lib/auth'
import { TaxonomyProvider } from './lib/taxonomy'
import './styles/index.css'

createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <AuthProvider>
      <TaxonomyProvider>
        <DataProvider>
          <App />
        </DataProvider>
      </TaxonomyProvider>
    </AuthProvider>
  </React.StrictMode>,
)

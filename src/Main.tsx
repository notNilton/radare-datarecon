import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import "primereact/resources/themes/saga-blue/theme.css";  // Tema de exemplo
import "primereact/resources/primereact.min.css";          // Estilos principais do PrimeReact
import "primeicons/primeicons.css";                        // PrimeIcons

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

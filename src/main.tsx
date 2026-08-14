import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './styles/globals.css'
import './styles/compare-redesign.css'
import './styles/compare-stage.css'
import './styles/vessel-v2.css'
import './styles/evidence-lineage.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

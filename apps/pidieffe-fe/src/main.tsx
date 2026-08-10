import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { DocumentProvider } from './context/DocumentContext'
import { UiProvider } from './context/UiContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DocumentProvider>
      <UiProvider>
        <App />
      </UiProvider>
    </DocumentProvider>
  </StrictMode>,
)

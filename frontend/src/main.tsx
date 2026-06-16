import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@tabler/icons-webfont/dist/tabler-icons.min.css'
import './index.css'
import App from './App'
import { AppProvider } from './context/AppContext'

const root = document.getElementById('root')!

createRoot(root).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>
)

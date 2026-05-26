import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import { ThemeProvider } from './context/ThemeContext'
import { HumanAccessProvider } from './context/HumanAccessContext'
import HumanAccessGate from './components/HumanAccessGate'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <HumanAccessProvider>
          <HumanAccessGate>
            <App />
          </HumanAccessGate>
        </HumanAccessProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
)

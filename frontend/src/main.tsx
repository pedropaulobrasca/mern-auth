import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Toaster } from './components/ui/sonner'
import { AppRoutes } from './routes/app-routes'
import { AuthRoutes } from './routes/auth-routes'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route path="/app/*" element={<AppRoutes />} />
      </Routes>
    </BrowserRouter>
    <Toaster theme="dark" richColors toastOptions={{}} />
  </StrictMode>,
)

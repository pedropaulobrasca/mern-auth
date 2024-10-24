import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import './index.css'
import { AuthRoutes } from './routes/auth-routes'
import { AppRoutes } from './routes/app-routes'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route path="/app/*" element={<AppRoutes />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
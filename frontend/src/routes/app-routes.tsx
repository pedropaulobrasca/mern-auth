import { Route, Routes } from 'react-router-dom'

import { HomePage } from '@/pages/home-page'

export function AppRoutes() {
  return (
    <div className="bg-background min-h-screen flex justify-center items-center">
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  )
}

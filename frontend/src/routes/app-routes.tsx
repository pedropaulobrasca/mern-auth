import { Route, Routes } from 'react-router-dom'

import { HomePage } from '@/pages/home-page'

import { ProtectedRoute } from './protected-route'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth.store'

export function AppRoutes() {
  const { isCheckingAuth, currentUser } = useAuthStore()

  useEffect(() => {
    currentUser()
  }, [currentUser])

  if (isCheckingAuth) {
    return <div>Checking authentication...</div>
  }
  
  return (
    <div className="bg-background min-h-screen flex justify-center items-center">
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

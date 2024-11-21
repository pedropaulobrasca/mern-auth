import { Navigate } from 'react-router-dom'

import { useAuthStore } from '@/store/auth.store'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" />
  }

  if (!user?.isVerified) {
    return <Navigate to="/auth/verify-email" />
  }

  return children
}

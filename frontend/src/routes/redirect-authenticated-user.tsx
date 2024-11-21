import { Navigate } from 'react-router-dom'

import { useAuthStore } from '@/store/auth.store'

export const RedirectAuthenticatedUser = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { isAuthenticated, user } = useAuthStore()

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/app" />
  }

  return children
}

import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import { useAuthStore } from '@/store/auth.store'

import { EmailVerificationPage } from '../pages/email-verification-page'
import { ForgotPasswordPage } from '../pages/forgot-password-page'
import { ResetPasswordPage } from '../pages/reset-password-page'
import { SignInPage } from '../pages/sign-in-page'
import { SignUpPage } from '../pages/sign-up-page'
import { RedirectAuthenticatedUser } from './redirect-authenticated-user'

export function AuthRoutes() {
  const { isCheckingAuth, currentUser } = useAuthStore()
  const location = useLocation()

  const isResetPasswordRoute = location.pathname.startsWith(
    '/auth/reset-password',
  )

  useEffect(() => {
    if (!isResetPasswordRoute) {
      currentUser()
    }
  }, [currentUser, isResetPasswordRoute])

  if (isCheckingAuth && !isResetPasswordRoute) {
    return <div>Checking authentication...</div>
  }

  return (
    <div className="bg-background min-h-screen flex justify-center items-center">
      <Routes>
        <Route
          path="/sign-up"
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/sign-in"
          element={
            <RedirectAuthenticatedUser>
              <SignInPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/verify-email"
          element={
            <RedirectAuthenticatedUser>
              <EmailVerificationPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Routes>
    </div>
  )
}

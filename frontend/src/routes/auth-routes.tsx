import { Route, Routes } from 'react-router-dom'

import { EmailVerificationPage } from '../pages/email-verification-page'
import { ForgotPasswordPage } from '../pages/forgot-password-page'
import { HomePage } from '../pages/home-page'
import { ResetPasswordPage } from '../pages/reset-password-page'
import { SignInPage } from '../pages/sign-in-page'
import { SignUpPage } from '../pages/sign-up-page'
import { RedirectAuthenticatedUser } from './redirect-authenticated-user'
import { useAuthStore } from '@/store/auth.store'
import { useEffect } from 'react'

export function AuthRoutes() {
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
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-up" element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/sign-in" element={
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
        <Route path="/forgot-password" element={
            <RedirectAuthenticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
      </Routes>
    </div>
  )
}

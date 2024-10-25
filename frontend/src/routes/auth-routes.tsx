import { Route, Routes } from "react-router-dom"
import { HomePage } from "../pages/home-page"
import { SignUpPage } from "../pages/sign-up-page"
import { SignInPage } from "../pages/sign-in-page"
import { EmailVerificationPage } from "../pages/email-verification-page"
import { ForgotPasswordPage } from "../pages/forgot-password-page"
import { ResetPasswordPage } from "../pages/reset-password-page"

export function AuthRoutes() {
  return (
    <div className="bg-background min-h-screen flex justify-center items-center">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Routes>
    </div>
  )
}

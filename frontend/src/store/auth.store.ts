import axios from 'axios'
import { create } from 'zustand'

import {
  currentUser,
  forgotPassword,
  resendVerificationEmail,
  resetPassword,
  signIn,
  signOut,
  signUp,
  verifyEmail,
} from '@/lib/api'

import {
  ForgotPasswordSchema,
  ResetPasswordSchema,
  SignInSchema,
  SignUpSchema,
  VerifyEmailSchema,
} from '../../../shared/auth.types'
import { User } from '../../../shared/user.types'

type AuthStore = {
  user: User | null
  isAuthenticated: boolean
  error: string | null
  isLoading: boolean
  isCheckingAuth: boolean
  signup: (payload: SignUpSchema) => Promise<void>
  setError: (error: string | null) => void
  verifyEmail: (payload: VerifyEmailSchema) => Promise<void>
  resendVerificationEmail: () => Promise<void>
  signOut: () => Promise<void>
  currentUser: () => Promise<void>
  signIn: (payload: SignInSchema) => Promise<void>
  forgotPassword: (payload: ForgotPasswordSchema) => Promise<void>
  resetPassword: (payload: ResetPasswordSchema) => Promise<void>
}

const handleError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message || 'An error occurred'
  }

  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message
  }

  return 'An error occurred'
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,

  setError: (error: string | null) => {
    set({ error })
  },

  signup: async (payload: SignUpSchema) => {
    set({ isLoading: true, error: null })

    try {
      const user = await signUp(payload)
      set({ user, isAuthenticated: true, error: null })
    } catch (error: unknown) {
      set({ error: handleError(error) })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  verifyEmail: async (payload: VerifyEmailSchema) => {
    set({ isLoading: true, error: null })

    try {
      const user = await verifyEmail(payload)
      set({ user, isAuthenticated: true, error: null })
    } catch (error: unknown) {
      set({ error: handleError(error) })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  resendVerificationEmail: async () => {
    set({ isLoading: true, error: null })

    try {
      await resendVerificationEmail()
    } catch (error: unknown) {
      set({ error: handleError(error) })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null })

    try {
      await signOut()
      set({ user: null, isAuthenticated: false, error: null })
    } catch (error: unknown) {
      set({ error: handleError(error) })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  currentUser: async () => {
    set({ isLoading: true, isCheckingAuth: true, error: null })

    try {
      const user = await currentUser()
      set({ user, isAuthenticated: true, isCheckingAuth: false, error: null })
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        set({ isAuthenticated: false, isCheckingAuth: false, error: null })
      } else {
        set({ error: handleError(error) })
      }
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  signIn: async (payload: SignInSchema) => {
    set({ isLoading: true, error: null })

    try {
      const user = await signIn(payload)
      set({ user, isAuthenticated: true, error: null })
    } catch (error: unknown) {
      set({ error: handleError(error), isAuthenticated: false })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  forgotPassword: async (payload: ForgotPasswordSchema) => {
    set({ isLoading: true, error: null })

    try {
      await forgotPassword(payload)
    } catch (error: unknown) {
      set({ error: handleError(error) })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  resetPassword: async (payload: ResetPasswordSchema) => {
    set({ isLoading: true, error: null })

    try {
      await resetPassword(payload)
    } catch (error: unknown) {
      set({ error: handleError(error) })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },
}))

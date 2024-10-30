import { signUp } from "@/lib/api"
import { SignUpSchema } from "../../../shared/auth.types"
import { User } from "../../../shared/user.types"
import { create } from "zustand"
import axios from "axios"

type AuthStore = {
  user: User | null
  isAuthenticated: boolean
  error: string | null
  isLoading: boolean
  isCheckingAuth: boolean
  signup: (payload: SignUpSchema) => Promise<void>
  setError: (error: string | null) => void
}

const handleError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message || "An error occurred"
  }

  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message
  }

  return "An error occurred"
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
}))
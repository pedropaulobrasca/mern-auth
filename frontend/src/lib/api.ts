import axios, { AxiosResponse } from "axios"

import { SignUpSchema, VerifyEmailSchema } from "../../../shared/auth.types"
import { User } from "../../../shared/user.types"

const axiosInstance = axios.create({
  baseURL: '/api/',
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
})

const apiRequest = async<T>(method: "GET" | "POST" | "PUT" | "DELETE", url: string, data?: Record<string, unknown>): Promise<T | null> => {
  const response: AxiosResponse<{ data: T }> = await axiosInstance({
    method,
    url,
    data
  })

  return response.data.data
}

export const signUp = async (data: SignUpSchema) => apiRequest<User>("POST", "/auth/sign-up", data)

export const verifyEmail = async (data: VerifyEmailSchema) => apiRequest<User>("POST", "/auth/verify-email", data)

export const resendVerificationEmail = async () => apiRequest<User>("POST", "/auth/resend-verification-email")

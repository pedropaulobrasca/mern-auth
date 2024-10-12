export const generateVerificationToken = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const calculateExpiresAt = (hours: number): Date => {
  return new Date(Date.now() + hours * 60 * 60 * 1000)
}

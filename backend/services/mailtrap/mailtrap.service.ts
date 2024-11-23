/* eslint-disable @typescript-eslint/no-unused-vars */
import { MailtrapClient } from 'mailtrap'

import { env } from '../../utils/env.ts'
import { logger } from '../../utils/logger.ts'
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from './mailtrap.templates.ts'

const TOKEN = env.MAILTRAP_API_TOKEN

const client = new MailtrapClient({
  token: TOKEN,
  testInboxId: 2652052,
})

const sender = {
  email: env.MAILTRAP_SENDER_EMAIL,
  name: env.MAILTRAP_SENDER_NAME,
}

const recipients = [
  {
    email: 'pedropaulobrasca@gmail.com',
  },
]

const sendEmail = async ({
  subject,
  category,
  html,
}: {
  subject: string
  category: string
  html: string
}) => {
  try {
    await client.testing.send({
      from: sender,
      to: recipients,
      subject,
      category,
      html,
    })
    logger.info('📨 Email sent successfully!')
  } catch (error) {
    console.error(error)
    throw new Error('⛔ Failed to send email')
  }
}

const replacePlaceholders = (
  template: string,
  placeholders: Record<string, string>,
) => {
  let result = template
  for (const [key, value] of Object.entries(placeholders)) {
    result = result.replace(new RegExp(`{${key}}`, 'g'), value)
  }
  return result
}

export const sendVerificationEmail = async ({
  email,
  verificationToken,
}: {
  email: string
  verificationToken: string
}) => {
  const emailContent = replacePlaceholders(VERIFICATION_EMAIL_TEMPLATE, {
    verificationToken,
    company: env.MAILTRAP_COMPANY_NAME,
  })

  await sendEmail({
    // to: [{ email }], // TODO: Uncomment this line when ready to send real emails
    subject: 'Verify Your Email',
    category: 'Verification',
    html: emailContent,
  })
}

export const sendWelcomeEmail = async (email: string, name: string) => {
  const emailContent = replacePlaceholders(WELCOME_EMAIL_TEMPLATE, {
    name,
    company: env.MAILTRAP_COMPANY_NAME,
  })

  await sendEmail({
    // to: [{ email }], // TODO: Uncomment this line when ready to send real emails
    subject: 'Welcome to the team!',
    category: 'Welcome',
    html: emailContent,
  })
}

export const sendResetPasswordEmail = async ({
  email,
  resetPasswordToken,
}: {
  email: string
  resetPasswordToken: string
}) => {
  const emailContent = replacePlaceholders(PASSWORD_RESET_REQUEST_TEMPLATE, {
    resetURL: `${env.CLIENT_URL}/auth/reset-password/${resetPasswordToken}`,
    company: env.MAILTRAP_COMPANY_NAME,
  })

  await sendEmail({
    // to: [{ email }], // TODO: Uncomment this line when ready to send real emails
    subject: 'Reset Your Password',
    category: 'Reset Password',
    html: emailContent,
  })
}

export const sendResetSuccessEmail = async (email: string) => {
  const emailContent = replacePlaceholders(PASSWORD_RESET_SUCCESS_TEMPLATE, {
    company: env.MAILTRAP_COMPANY_NAME,
  })

  await sendEmail({
    // to: [{ email }], // TODO: Uncomment this line when ready to send real emails
    subject: 'Password Reset Successfully',
    category: 'Reset Success',
    html: emailContent,
  })
}

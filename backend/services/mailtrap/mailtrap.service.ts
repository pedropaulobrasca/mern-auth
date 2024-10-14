import { MailtrapClient } from 'mailtrap'

import { env } from '../../utils/env.ts'
import { VERIFICATION_EMAIL_TEMPLATE } from './mailtrap.templates.ts'

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
    console.log('📨 Email sent successfully!')
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

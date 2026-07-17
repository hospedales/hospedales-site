import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'

const ses = new SESv2Client({})
const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const handler = async (event) => {
  let data
  try {
    data = JSON.parse(event.body ?? '')
  } catch {
    return json(400, { error: 'Invalid request body.' })
  }
  const { name = '', email = '', message = '', website = '' } = data
  if (website !== '') return json(200, { ok: true }) // honeypot: pretend success, send nothing
  if (typeof name !== 'string' || name.trim().length < 1 || name.length > 100)
    return json(400, { error: 'Please provide your name.' })
  if (typeof email !== 'string' || !EMAIL_RE.test(email) || email.length > 200)
    return json(400, { error: 'Please provide a valid email address.' })
  if (typeof message !== 'string' || message.trim().length < 10 || message.length > 5000)
    return json(400, { error: 'Please write a message of at least 10 characters.' })

  await ses.send(
    new SendEmailCommand({
      FromEmailAddress: process.env.CONTACT_FROM,
      Destination: { ToAddresses: [process.env.CONTACT_TO] },
      ReplyToAddresses: [email],
      Content: {
        Simple: {
          Subject: { Data: `[hospedales.com] Message from ${name.trim()}` },
          Body: { Text: { Data: `From: ${name.trim()} <${email}>\n\n${message.trim()}` } },
        },
      },
    }),
  )
  return json(200, { ok: true })
}

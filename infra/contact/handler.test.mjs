import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'
import { mockClient } from 'aws-sdk-client-mock'
import { beforeEach, describe, expect, it } from 'vitest'
import { handler } from './handler.mjs'

const sesMock = mockClient(SESv2Client)
const event = (body) => ({
  requestContext: { http: { method: 'POST' } },
  body: JSON.stringify(body),
})
const valid = {
  name: 'Ada',
  email: 'ada@example.com',
  message: 'Hello there, nice site.',
  website: '',
}

beforeEach(() => {
  sesMock.reset()
  sesMock.on(SendEmailCommand).resolves({ MessageId: 'test' })
  process.env.CONTACT_TO = 'mick@hospedales.com'
  process.env.CONTACT_FROM = 'mick@hospedales.com'
})

describe('contact handler', () => {
  it('sends email for a valid submission', async () => {
    const res = await handler(event(valid))
    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.body)).toEqual({ ok: true })
    expect(sesMock.commandCalls(SendEmailCommand)).toHaveLength(1)
    const input = sesMock.commandCalls(SendEmailCommand)[0].args[0].input
    expect(input.ReplyToAddresses).toEqual(['ada@example.com'])
  })
  it('silently accepts honeypot submissions without sending', async () => {
    const res = await handler(event({ ...valid, website: 'spam.example' }))
    expect(res.statusCode).toBe(200)
    expect(sesMock.commandCalls(SendEmailCommand)).toHaveLength(0)
  })
  it.each([
    ['missing name', { ...valid, name: '' }],
    ['bad email', { ...valid, email: 'not-an-email' }],
    ['short message', { ...valid, message: 'hi' }],
  ])('rejects %s with 400', async (_label, payload) => {
    const res = await handler(event(payload))
    expect(res.statusCode).toBe(400)
    expect(JSON.parse(res.body).error).toBeTruthy()
    expect(sesMock.commandCalls(SendEmailCommand)).toHaveLength(0)
  })
  it('rejects unparseable bodies with 400', async () => {
    const res = await handler({ requestContext: { http: { method: 'POST' } }, body: '{nope' })
    expect(res.statusCode).toBe(400)
  })
  it('rejects a null JSON body with 400 and sends nothing', async () => {
    const res = await handler({ requestContext: { http: { method: 'POST' } }, body: 'null' })
    expect(res.statusCode).toBe(400)
    expect(JSON.parse(res.body).error).toBeTruthy()
    expect(sesMock.commandCalls(SendEmailCommand)).toHaveLength(0)
  })
  it('returns a JSON 500 error when SES fails', async () => {
    sesMock.on(SendEmailCommand).rejects(new Error('ses down'))
    const res = await handler(event(valid))
    expect(res.statusCode).toBe(500)
    expect(JSON.parse(res.body).error).toBeTruthy()
  })
})

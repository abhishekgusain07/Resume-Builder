import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: 'https://apn1-internal-koala-33336.upstash.io',
  token: process.env.REDIS_KEY!,
})

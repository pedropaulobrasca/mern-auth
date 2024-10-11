import { env } from './utils/env.ts'

const hello: string = 'Hello, World!!'

console.log({ hello, app_name: env.APP_NAME })

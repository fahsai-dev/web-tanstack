import pino from 'pino'

type LogFields = Record<string, unknown>

const REDACT_FIELDS = [
  'idcard',
  'firstName',
  'lastName',
  'dob',
  'address',
  'contactFirstName',
  'contactLastName',
  'contactMobile',
  'imgBase64',
]

function buildRedactPaths(fields: Array<string>) {
  return fields.flatMap((field) => [
    field,
    `*.${field}`,
    `*.*.${field}`,
    `*.*.*.${field}`,
  ])
}

const isServer = typeof window === 'undefined'
const usePrettyTransport = isServer && import.meta.env.DEV

const pinoLogger = pino({
  redact: {
    paths: buildRedactPaths(REDACT_FIELDS),
    censor: '[Redacted]',
  },
  browser: {
    asObject: true,
  },
  ...(usePrettyTransport && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
      },
    },
  }),
})

export const log = {
  debug: (message: string, fields?: LogFields) =>
    pinoLogger.debug(fields ?? {}, message),
  info: (message: string, fields?: LogFields) =>
    pinoLogger.info(fields ?? {}, message),
  warn: (message: string, fields?: LogFields) =>
    pinoLogger.warn(fields ?? {}, message),
  error: (message: string, fields?: LogFields) =>
    pinoLogger.error(fields ?? {}, message),
}

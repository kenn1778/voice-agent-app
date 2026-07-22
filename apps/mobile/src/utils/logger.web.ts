const isDev = process.env.NODE_ENV !== 'production';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

function log(level: LogLevel, message: string, data?: unknown) {
  if (isDev) {
    const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    fn('[VoiceAgent]', level.toUpperCase(), message, data ?? '');
  }
}

export const logger = {
  debug: (msg: string, data?: unknown) => log('debug', msg, data),
  info: (msg: string, data?: unknown) => log('info', msg, data),
  warn: (msg: string, data?: unknown) => log('warn', msg, data),
  error: (msg: string, data?: unknown) => log('error', msg, data),
};

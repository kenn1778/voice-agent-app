import { useSessionStore } from '../store/sessionStore';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isDev = __DEV__;

function log(level: LogLevel, message: string, data?: unknown) {
  const entry = { level, message, timestamp: new Date().toISOString(), sessionId: useSessionStore.getState().sessionId || 'none', data };
  if (isDev) {
    const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    fn(`[VoiceAgent] ${level.toUpperCase()} ${message}`, data ?? '');
  }
  if (!isDev && level === 'error') {
    try { fetch('https://rum.example.com/log', { method: 'POST', body: JSON.stringify(entry), keepalive: true }); } catch {}
  }
}

export const logger = {
  debug: (msg: string, data?: unknown) => log('debug', msg, data),
  info: (msg: string, data?: unknown) => log('info', msg, data),
  warn: (msg: string, data?: unknown) => log('warn', msg, data),
  error: (msg: string, data?: unknown) => log('error', msg, data),
};

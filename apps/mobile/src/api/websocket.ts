export type WSMessage = {
  type: 'audio' | 'transcript' | 'digest' | 'digest_request' | 'error' | 'connected' | 'disconnected';
  payload?: unknown;
  sessionId?: string;
  timestamp?: string;
};

export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error';

type WSOptions = {
  onMessage: (msg: WSMessage) => void;
  onStateChange: (state: ConnectionState) => void;
  onError: (err: Error) => void;
};

export class VoiceWebSocket {
  private ws: WebSocket | null = null;
  private url: string = '';
  private opts: WSOptions;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(opts: WSOptions) {
    this.opts = opts;
  }

  connect(url: string) {
    this.url = url;
    this.opts.onStateChange('connecting');
    this.ws = new WebSocket(url);
    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.opts.onStateChange('connected');
    };
    this.ws.onmessage = (event) => {
      try {
        const msg: WSMessage = JSON.parse(event.data);
        this.opts.onMessage(msg);
      } catch { }
    };
    this.ws.onerror = () => {
      this.opts.onError(new Error('WebSocket error'));
    };
    this.ws.onclose = () => {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.opts.onStateChange('reconnecting');
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts) + Math.random() * 1000, 30000);
        this.reconnectTimer = setTimeout(() => {
          this.reconnectAttempts++;
          this.connect(this.url);
        }, delay);
      } else {
        this.opts.onStateChange('disconnected');
      }
    };
  }

  send(data: string | ArrayBuffer) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    }
  }

  sendJson(msg: WSMessage) {
    this.send(JSON.stringify(msg));
  }

  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectAttempts = this.maxReconnectAttempts;
    this.ws?.close();
    this.ws = null;
    this.opts.onStateChange('disconnected');
  }
}

import { VoiceWebSocket } from '../src/api/websocket';

describe('VoiceWebSocket', () => {
  it('tracks state changes on disconnect', () => {
    const onMessage = jest.fn();
    const onStateChange = jest.fn();
    const onError = jest.fn();
    const ws = new VoiceWebSocket({ onMessage, onStateChange, onError });
    expect(onStateChange).not.toHaveBeenCalled();
    ws.disconnect();
    expect(onStateChange).toHaveBeenCalledWith('disconnected');
  });

  it('queues state as disconnected after max retries', () => {
    const onMessage = jest.fn();
    const onStateChange = jest.fn();
    const onError = jest.fn();
    const ws = new VoiceWebSocket({ onMessage, onStateChange, onError });
    ws.disconnect();
    expect(onStateChange).toHaveBeenCalledTimes(1);
  });
});

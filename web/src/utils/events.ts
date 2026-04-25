type EventListenerArgs = unknown[];

type EventListener<TArgs extends EventListenerArgs> = (...args: TArgs) => void;

export class BasicEventEmitter<TEvents extends { [key: string]: EventListenerArgs }> {
  private _handlers: { [K in keyof TEvents]?: Set<EventListener<TEvents[K]>> } = {};

  on<K extends keyof TEvents>(eventName: K, listener: EventListener<TEvents[K]>) {
    if (!this._handlers[eventName]) {
      this._handlers[eventName] = new Set();
    }

    this._handlers[eventName]?.add(listener);
  }

  off<K extends keyof TEvents>(eventName: K, listener: EventListener<TEvents[K]>) {
    this._handlers[eventName]?.delete(listener);
  }

  emit<K extends keyof TEvents>(eventName: K, ...args: TEvents[K]) {
    const callbacks = [...(this._handlers[eventName]?.values() || [])];
    for (const callback of callbacks) {
      callback.apply(this, args);
    }
  }
}

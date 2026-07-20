import type { ReactiveController, ReactiveControllerHost } from 'lit';
import Dexie from 'dexie';

export class LiveQueryController<T> implements ReactiveController {
  private _host: ReactiveControllerHost;
  private _queryFn: () => Promise<T>;
  private _sub?: { unsubscribe: () => void };
  value: T;

  constructor(host: ReactiveControllerHost, queryFn: () => Promise<T>, defaultValue: T) {
    this._host = host;
    this._queryFn = queryFn;
    this.value = defaultValue;
    host.addController(this);
  }

  hostConnected(): void {
    this._subscribe();
  }

  hostDisconnected(): void {
    this._unsubscribe();
  }

  setQuery(fn: () => Promise<T>): void {
    this._queryFn = fn;
    this._unsubscribe();
    this._subscribe();
  }

  private _subscribe(): void {
    const obs = Dexie.liveQuery(this._queryFn);
    this._sub = obs.subscribe({
      next: (v: T) => {
        this.value = v;
        this._host.requestUpdate();
      },
      error: (err: unknown) => console.error(err),
    });
  }

  private _unsubscribe(): void {
    this._sub?.unsubscribe();
    this._sub = undefined;
  }
}

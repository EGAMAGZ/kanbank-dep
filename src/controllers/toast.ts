import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { uid } from '../utils/uid.js';

export interface ToastItem {
  id: string;
  msg: string;
  type: string;
}

export class ToastController implements ReactiveController {
  private _host: ReactiveControllerHost;
  toasts: ToastItem[] = [];

  constructor(host: ReactiveControllerHost) {
    this._host = host;
    host.addController(this);
  }

  hostConnected(): void {
    // no-op
  }

  hostDisconnected(): void {
    // no-op
  }

  toast(msg: string, type = 'i'): void {
    const id = uid();
    this.toasts = [...this.toasts, { id, msg, type }];
    this._host.requestUpdate();
    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t.id !== id);
      this._host.requestUpdate();
    }, 2800);
  }
}

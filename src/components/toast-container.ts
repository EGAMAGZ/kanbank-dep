import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { ToastItem } from '../controllers/toast.js';

@customElement('toast-container')
export class ToastContainer extends LitElement {
  createRenderRoot(): this { return this; }

  @property({ attribute: false }) toasts: ToastItem[] = [];

  render() {
    return html`
      <div class="toasts">
        ${this.toasts.map(t => html`
          <div key=${t.id} class="toast ${t.type}">
            ${t.type === "s" ? "✓" : t.type === "e" ? "✕" : t.type === "p" ? "🤔" : "ℹ"} ${t.msg}
          </div>
        `)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'toast-container': ToastContainer;
  }
}

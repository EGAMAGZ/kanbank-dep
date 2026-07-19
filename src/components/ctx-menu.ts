import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Column } from '../storage/db-helpers.js';

export interface CtxState {
  x: number;
  y: number;
  type: string;
  id: string;
  colId?: string;
  columns?: Column[];
}

@customElement('ctx-menu')
export class CtxMenu extends LitElement {
  createRenderRoot(): this { return this; }

  @property({ attribute: false }) menu: CtxState | null = null;
  @property({ attribute: false }) columns: Column[] = [];

  connectedCallback(): void {
    super.connectedCallback();
    setTimeout(() => window.addEventListener('click', this._onWindowClick), 0);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('click', this._onWindowClick);
  }

  render() {
    if (!this.menu) return html``;
    const s = {
      left: Math.min(this.menu.x, window.innerWidth - 175),
      top: Math.min(this.menu.y, window.innerHeight - 210),
    };
    return html`
      <div class="ctx" style="left:${s.left}px;top:${s.top}px" @click=${this._stopProp}>
        ${this.menu.type === "task" ? html`
          <div class="ctxi" @click=${this._onOpenTask}>✏️ OPEN TASK</div>
          <div class="ctxsep"></div>
          ${this.columns.filter(c => c.id !== this.menu!.colId).map(c => html`
            <div key=${c.id} class="ctxi" @click=${() => this._onMoveTask(c.id)}>${c.emoji} MOVE TO ${c.name}</div>
          `)}
          <div class="ctxsep"></div>
          <div class="ctxi dng" @click=${this._onDelTask}>🗑 DELETE</div>
        ` : ''}
        ${this.menu.type === "board" ? html`
          <div class="ctxi dng" @click=${this._onDelBoard}>🗑 DELETE BOARD</div>
        ` : ''}
        ${this.menu.type === "column" ? html`
          <div class="ctxi" @click=${this._onClose}>✏️ RENAME (DBL-CLICK)</div>
        ` : ''}
      </div>
    `;
  }

  private _onWindowClick = (): void => {
    this._emit('close-ctx');
  };

  private _onOpenTask(): void {
    if (this.menu) this._emit('ctx-open-task', { id: this.menu.id });
    this._emit('close-ctx');
  }

  private _onMoveTask(toId: string): void {
    if (this.menu) this._emit('ctx-move-task', { tid: this.menu.id, toId });
    this._emit('close-ctx');
  }

  private _onDelTask(): void {
    if (this.menu) this._emit('ctx-del-task', { id: this.menu.id });
    this._emit('close-ctx');
  }

  private _onDelBoard(): void {
    if (this.menu) this._emit('ctx-del-board', { id: this.menu.id });
    this._emit('close-ctx');
  }

  private _onClose(): void {
    this._emit('close-ctx');
  }

  private _stopProp(e: Event): void {
    e.stopPropagation();
  }

  private _emit(type: string, detail?: unknown): void {
    this.dispatchEvent(new CustomEvent(type, { bubbles: true, composed: true, detail }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ctx-menu': CtxMenu;
  }
}

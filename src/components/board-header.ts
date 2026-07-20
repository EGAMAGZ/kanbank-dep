import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { uid } from '../utils/uid.js';
import { PALETTE } from '../utils/constants.js';
import type { Board, Column } from '../storage/db-helpers.js';

@customElement('board-header')
export class BoardHeader extends LitElement {
  createRenderRoot(): this { return this; }

  @property({ attribute: false }) AB: Board | undefined = undefined;
  @property({ attribute: false }) searchQ = '';
  @property({ type: Boolean }) showFBar = false;
  @property({ type: Boolean }) hasF = false;
  @property({ attribute: false }) cols: Column[] = [];

  render() {
    return html`
      <header class="bhdr">
        <div style="width:14px;height:14px;background:${this.AB?.color};border:2.5px solid #0a0a0a;flex-shrink:0"></div>
        <input class="btitle" .value=${this.AB?.name || ""} @change=${this._onNameChange} title="Click to rename" />
        <div style="flex:1"></div>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="srchwrap">
            <span class="srchic">⌕</span>
            <input class="srch" placeholder="SEARCH… (/)" .value=${this.searchQ} @input=${this._onSearchInput} />
          </div>
          <button class="hbtn ${this.showFBar ? "bk" : "yl"}" @click=${() => this._emit('toggle-fbar')}>
            ⊟ ${this.hasF ? `FILTER(${[this.searchQ ? 1 : 0, 0, 0].reduce((a, b) => a + b, 0)})` : "FILTER"}
          </button>
          <button class="hbtn pk" @click=${this._onQuickCreate}>
            <span class="kk">C</span> NEW TASK
          </button>
          <button class="hbtn" @click=${this._onAddCol}>
            ＋ COL
          </button>
          <button class="hbtn bk" @click=${() => this._emit('show-sc')}><span class="kk">⌘K</span></button>
        </div>
      </header>
    `;
  }

  private _onNameChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    const v = input.value.toUpperCase();
    if (this.AB && v.trim()) {
      this._emit('save-board', { board: { ...this.AB, name: v } });
    }
  }

  private _onSearchInput(e: Event): void {
    const input = e.target as HTMLInputElement;
    this.dispatchEvent(new CustomEvent('search-change', {
      bubbles: true, composed: true,
      detail: { query: input.value }
    }));
  }

  private _onQuickCreate(): void {
    const mc = this.cols.find(c => c.isMaybe);
    if (mc) this._emit('quick-create', { colId: mc.id });
  }

  private _onAddCol(): void {
    const n = prompt("Column name:");
    if (!n) return;
    const col: Column = {
      id: uid(),
      name: n.toUpperCase(),
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      emoji: "📌",
      collapsed: true,
    };
    this._emit('add-col', { column: col });
  }

  private _emit(type: string, detail?: unknown): void {
    this.dispatchEvent(new CustomEvent(type, { bubbles: true, composed: true, detail }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'board-header': BoardHeader;
  }
}

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PALETTE } from '../utils/constants.js';
import type { Board, Tag } from '../storage/db-helpers.js';

@customElement('sidebar-c')
export class Sidebar extends LitElement {
  createRenderRoot(): this { return this; }

  @property({ type: Boolean }) sbOff = false;
  @property({ attribute: false }) boards: Board[] = [];
  @property({ type: String }) activeBoardId: string | null = null;
  @property({ attribute: false }) tags: Tag[] = [];
  @property({ attribute: false }) filterTags: string[] = [];

  render() {
    return html`
      <aside class="sb ${this.sbOff ? "off" : ""}">
        <div class="sb-hdr">
          <div class="sb-logo">K</div>
          ${!this.sbOff ? html`<span class="sb-title">KANBANFLOW</span>` : ''}
          <button class="sb-tog" @click=${() => this._emit('toggle-sb')} title="Toggle (B)">${this.sbOff ? "›" : "‹"}</button>
        </div>
        <div class="sb-sec">
          ${!this.sbOff ? html`
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
              <div class="sb-lbl" style="border:none;margin:0;padding:6px 0 0">Boards</div>
              <span class="dexie-badge">⚡ DEXIE</span>
            </div>
          ` : ''}
          ${this.boards.map(b => html`
            <div key=${b.id} class="sb-brd ${this.activeBoardId === b.id ? "on" : ""}"
              @click=${() => this._emit('select-board', { id: b.id })}
              title=${b.name}>
              <div class="sb-dot" style="background:${b.color}"></div>
              ${!this.sbOff ? html`<span class="sb-nm">${b.name}</span>` : ''}
              ${!this.sbOff ? html`<button class="sb-del" @click=${(e: Event) => { e.stopPropagation(); this._emit('del-board', { id: b.id }); }}>✕</button>` : ''}
            </div>
          `)}
          <button class="sb-add" @click=${() => this._emit('add-board')}><span>＋</span>${!this.sbOff ? html`<span>NEW BOARD</span>` : ''}</button>
        </div>
        ${!this.sbOff ? html`
          <div class="sb-tags">
            <div class="sb-lbl">Global Tags</div>
            <div class="tpillwrap">
              ${this.tags.map(tag => html`
                <span key=${tag.id}
                  class="tpill ${this.filterTags.includes(tag.id) ? "on" : ""}"
                  style=${this.filterTags.includes(tag.id) ? `background:${tag.color};border-color:${tag.color};color:#fff` : `border-color:${tag.color}`}
                  @click=${() => this._emit('filter-tag', { id: tag.id })}>
                  ${tag.name}<span class="tdel" @click=${(e: Event) => { e.stopPropagation(); this._emit('del-tag', { id: tag.id }); }}>✕</span>
                </span>
              `)}
              <span class="tpill" style="border-style:dashed;cursor:pointer"
                @click=${this._onAddTag}>
                ＋ ADD
              </span>
            </div>
            <div style="font-size:10px;font-weight:700;color:#888;margin-top:6px;letter-spacing:.07em;text-transform:uppercase">N tags ↔ M boards · IndexedDB via Dexie</div>
          </div>
        ` : ''}
      </aside>
    `;
  }

  private _onAddTag(): void {
    const n = prompt("Tag name:");
    if (!n) return;
    this._emit('add-tag', { name: n.trim().toUpperCase(), color: PALETTE[Math.floor(Math.random() * PALETTE.length)] });
  }

  private _emit(type: string, detail?: unknown): void {
    this.dispatchEvent(new CustomEvent(type, { bubbles: true, composed: true, detail }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sidebar-c': Sidebar;
  }
}

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PRIOS, PC, PL } from '../utils/constants.js';
import type { Tag } from '../storage/db-helpers.js';

@customElement('filter-bar')
export class FilterBar extends LitElement {
  createRenderRoot(): this { return this; }

  @property({ type: Boolean }) showFBar = false;
  @property({ type: String }) filterPrio: string | null = null;
  @property({ attribute: false }) tags: Tag[] = [];
  @property({ attribute: false }) filterTags: string[] = [];
  @property({ type: Boolean }) hasF = false;

  render() {
    if (!this.showFBar) return html``;

    return html`
      <div class="fbar">
        <span class="flbl">Priority:</span>
        ${PRIOS.filter(p => p !== "none").map(p => html`
          <button key=${p} class="fchip ${this.filterPrio === p ? "on" : ""}"
            style=${this.filterPrio === p ? `background:${PC[p]};border-color:#0a0a0a;color:${["low","medium"].includes(p) ? "#0a0a0a" : "#fff"}` : ""}
            @click=${() => this._emit('filter-prio', { prio: this.filterPrio === p ? null : p })}>${PL[p]}</button>
        `)}
        <span class="flbl" style="margin-left:8px">Tags:</span>
        ${this.tags.map(tag => html`
          <button key=${tag.id} class="fchip ${this.filterTags.includes(tag.id) ? "on" : ""}"
            style=${this.filterTags.includes(tag.id) ? `background:${tag.color};border-color:#0a0a0a;color:#fff` : ""}
            @click=${() => this._emit('filter-tag', { id: tag.id })}>${tag.name}</button>
        `)}
        ${this.hasF ? html`<button class="fclr" @click=${() => this._emit('clear-filters')}>✕ CLEAR ALL</button>` : ''}
      </div>
    `;
  }

  private _emit(type: string, detail?: unknown): void {
    this.dispatchEvent(new CustomEvent(type, { bubbles: true, composed: true, detail }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'filter-bar': FilterBar;
  }
}

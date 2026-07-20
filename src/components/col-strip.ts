import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Column } from '../storage/db-helpers.js';

@customElement('col-strip')
export class ColStrip extends LitElement {
  createRenderRoot(): this { return this; }

  @property({ attribute: false }) col!: Column;
  @property({ type: Number }) taskCount = 0;
  @property({ type: Number }) filteredCount = 0;
  @property({ type: Number }) pct = 0;
  @property({ type: Boolean }) hasF = false;

  render() {
    return html`
      <div class="col-strip" @click=${this._onClick} @dragover=${this._onDragOver} @drop=${this._onDrop}
        title="${this.col.name} — ${this.taskCount} tasks · ${this.pct}% done · Click or ← → to expand">
        <div class="strip-fill" style="height:${this.pct}%;background:${this.col.color};opacity:.7"></div>
        <span class="strip-emoji">${this.col.emoji || "📌"}</span>
        <div class="strip-cnt">${this.hasF ? this.filteredCount : this.taskCount}</div>
        <div class="strip-label" style="color:${this.col.color}">${this.col.name}</div>
        <div class="strip-pct">${this.pct}%</div>
      </div>
    `;
  }

  private _onClick(): void {
    this._emit('strip-click');
  }

  private _onDragOver(e: DragEvent): void {
    e.preventDefault();
  }

  private _onDrop(e: DragEvent): void {
    this._emit('strip-drop', { event: e });
  }

  private _emit(type: string, detail?: unknown): void {
    this.dispatchEvent(new CustomEvent(type, { bubbles: true, composed: true, detail }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'col-strip': ColStrip;
  }
}

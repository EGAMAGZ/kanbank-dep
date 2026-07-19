import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PC, PL } from '../utils/constants.js';
import type { Task, Tag } from '../storage/db-helpers.js';

@customElement('t-card')
export class TCard extends LitElement {
  createRenderRoot(): this { return this; }

  @property({ attribute: false }) task!: Task;
  @property({ attribute: false }) tags: Tag[] = [];
  @property({ type: Boolean }) isFoc = false;
  @property({ type: Boolean }) isJustDone = false;

  render() {
    const tt = this.tags.filter(t => this.task.tags?.includes(t.id));
    const dc = this.task.dueDate
      ? Date.now() > this.task.dueDate ? "ov" : Date.now() > this.task.dueDate - 86400000 ? "sn" : ""
      : "";
    return html`
      <div class="tcard ${this.isFoc ? "foc" : ""} ${this.task.done ? "done-card" : ""} ${this.isJustDone ? "just-done" : ""}"
        draggable="true" @dragstart=${this._onDragStart} @click=${this._onOpen} @contextmenu=${this._onCtx}
        @focus=${this._onFoc} tabindex="0" @keydown=${this._onKeyDown}>
        ${this.task.priority !== "none" ? html`<div class="tpbar" style="background:${PC[this.task.priority]}"></div>` : ''}
        <div class="thead">
          <div class="tchk ${this.task.done ? "ck" : ""}" @click=${this._onToggle}>
            <svg viewBox="0 0 10 8" fill="none" stroke="white" stroke-width="2.5"><polyline points="1,4 4,7 9,1"/></svg>
          </div>
          <span class="ttitle ${this.task.done ? "done" : ""}">${this.task.title}</span>
        </div>
        ${(tt.length > 0 || this.task.dueDate || this.task.comments?.length > 0 || this.task.note || this.task.priority !== "none") ? html`
          <div class="tmeta">
            ${this.task.priority !== "none" ? html`
              <span style="padding:2px 6px;border:2px solid #0a0a0a;font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;background:${PC[this.task.priority]};color:${["low","medium"].includes(this.task.priority) ? "#0a0a0a" : "#fff"}">${PL[this.task.priority]}</span>
            ` : ''}
            ${tt.map(t => html`<span key=${t.id} class="ttag" style="background:${t.color};color:#fff;border-color:#0a0a0a">${t.name}</span>`)}
            ${this.task.comments?.length > 0 ? html`<span class="tcmt">💬 ${this.task.comments.length}</span>` : ''}
            ${this.task.note ? html`<div class="tnote" title="Has notes"></div>` : ''}
            ${this.task.dueDate ? html`<span class="tdue ${dc}">📅 ${new Date(this.task.dueDate).toLocaleDateString(undefined, {month:"short",day:"numeric"})}</span>` : ''}
          </div>
        ` : ''}
      </div>
    `;
  }

  private _onDragStart(e: DragEvent): void {
    e.dataTransfer!.effectAllowed = 'move';
    this._emit('task-drag-start', { taskId: this.task.id, colId: this.task.columnId });
  }

  private _onOpen(): void {
    this._emit('task-open', { id: this.task.id });
  }

  private _onToggle(e: Event): void {
    e.stopPropagation();
    this._emit('task-toggle', { task: this.task });
  }

  private _onCtx(e: MouseEvent): void {
    e.preventDefault();
    this._emit('task-ctx', { x: e.clientX, y: e.clientY, type: 'task', id: this.task.id, colId: this.task.columnId });
  }

  private _onFoc(): void {
    this._emit('task-foc', { id: this.task.id });
  }

  private _onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter') this._onOpen();
  }

  private _emit(type: string, detail?: unknown): void {
    this.dispatchEvent(new CustomEvent(type, { bubbles: true, composed: true, detail }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    't-card': TCard;
  }
}

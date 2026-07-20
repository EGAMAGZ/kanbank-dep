import { LitElement, html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import type { Column, Task, Tag } from '../storage/db-helpers.js';
import './t-card.js';

@customElement('full-column')
export class FullColumn extends LitElement {
  createRenderRoot(): this { return this; }

  @property({ attribute: false }) col!: Column;
  @property({ attribute: false }) tasks: Task[] = [];
  @property({ attribute: false }) allTasks: Task[] = [];
  @property({ attribute: false }) tags: Tag[] = [];
  @property({ attribute: false }) foc: { cid: string; tid: string } | null = null;
  @property({ attribute: false }) columns: Column[] = [];
  @property({ attribute: false }) drag: { tid: string; fid: string } | null = null;
  @property({ type: Boolean }) hasF = false;
  @property({ type: Boolean }) isMaybe = false;
  @property({ type: String }) justDoneId: string | null = null;
  @property({ type: Boolean }) onCollapse = false;

  @state() private _adding = false;
  @state() private _newT = '';
  @state() private _editName = false;
  @state() private _nameDraft = '';
  @state() private _dov = false;

  @query('.col-nmin') private _nameInput!: HTMLInputElement;

  render() {
    return html`
      <div class="col ${this.isMaybe ? "maybe-col" : ""} ${this._dov ? "dov" : ""}"
        @dragover=${this._onDragOver}
        @dragleave=${this._onDragLeave}
        @drop=${this._onDrop}>

        <div class="col-hdr" style="background:${this.isMaybe ? "rgba(255,107,204,.1)" : this.col.color}"
          @contextmenu=${this._onColCtx}>
          <span class="col-emoji">${this.col.emoji || "📌"}</span>
          <div class="col-nmwrap" @dblclick=${this._onDblClick}>
            ${this._editName ? html`
              <input class="col-nmin" .value=${this._nameDraft} @input=${this._onNameInput}
                @blur=${this._commitName}
                @keydown=${this._onNameKeyDown}
                @click=${this._stopProp} />
            ` : html`
              <span class="col-nm" style="color:${this.isMaybe ? "var(--pink)" : "var(--bk)"}">${this.col.name}</span>
            `}
          </div>
          <div class="col-cnt">${this.hasF ? `${this.tasks.length}/${this.allTasks.length}` : this.allTasks.length}</div>
          <div class="col-act">
            <button class="cib" @click=${() => this._adding = true}>＋</button>
            ${!this.isMaybe ? html`<button class="cib" title="Collapse (← →)" @click=${() => this._emit('collapse')}>◀</button>` : ''}
            <button class="cib" @click=${() => this._emit('delete-col', { colId: this.col.id })}>🗑</button>
          </div>
        </div>

        <div class="colbody">
          ${this.tasks.map(task => html`
            <t-card key=${task.id} .task=${task} .tags=${this.tags}
              .isFoc=${this.foc?.tid === task.id}
              .isJustDone=${this.justDoneId === task.id}
              @task-open=${(e: CustomEvent) => { e.stopPropagation(); this._emit('open-task', e.detail); }}
              @task-toggle=${(e: CustomEvent) => { e.stopPropagation(); this._emit('toggle-task', e.detail); }}
              @task-foc=${() => this._emit('foc-task', { cid: this.col.id, tid: task.id })}
              @task-ctx=${(e: CustomEvent) => { e.stopPropagation(); this._emit('task-ctx', { ...e.detail, columns: this.columns }); }}
              @task-drag-start=${(e: CustomEvent) => { e.stopPropagation(); this._emit('drag-start', e.detail); }}>
            </t-card>
          `)}
          ${this._adding ? html`
            <div class="qadd">
              <input autofocus placeholder="Task title…" .value=${this._newT} @input=${this._onNewTInput} @keydown=${this._onNewTKeyDown} />
              <div class="qahints"><span><span class="kk">Enter</span> add</span><span><span class="kk">Esc</span> cancel</span></div>
            </div>
          ` : html`
            <button class="atbtn" @click=${() => this._adding = true}>＋ ADD TASK</button>
          `}
        </div>
      </div>
    `;
  }

  private _onDragOver(e: DragEvent): void {
    e.preventDefault();
    this._dov = true;
  }

  private _onDragLeave(): void {
    this._dov = false;
  }

  private _onDrop(e: DragEvent): void {
    this._dov = false;
    this._emit('drop-task', { event: e, toId: this.col.id });
  }

  private _onColCtx(e: MouseEvent): void {
    e.preventDefault();
    this._emit('col-ctx', { x: e.clientX, y: e.clientY, type: 'column', id: this.col.id });
  }

  private _onDblClick(): void {
    this._editName = true;
    this._nameDraft = this.col.name;
    setTimeout(() => this._nameInput?.select(), 50);
  }

  private _onNameInput(e: Event): void {
    this._nameDraft = (e.target as HTMLInputElement).value;
  }

  private _commitName(): void {
    const name = (this._nameDraft.trim() || this.col.name).toUpperCase();
    this._emit('update-col', { column: { ...this.col, name } });
    this._editName = false;
  }

  private _onNameKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter') this._commitName();
    if (e.key === 'Escape') { this._editName = false; this._nameDraft = this.col.name; }
  }

  private _onNewTInput(e: Event): void {
    this._newT = (e.target as HTMLInputElement).value;
  }

  private _onNewTKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter' && this._newT.trim()) {
      this._emit('add-task', { colId: this.col.id, title: this._newT });
      this._newT = '';
      this._adding = false;
    }
    if (e.key === 'Escape') { this._adding = false; this._newT = ''; }
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
    'full-column': FullColumn;
  }
}

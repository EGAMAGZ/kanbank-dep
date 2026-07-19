import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { PRIOS, PC, PL, PALETTE } from '../utils/constants.js';
import { renderMd } from '../utils/markdown.js';
import { uid } from '../utils/uid.js';
import type { Task, Tag, Column } from '../storage/db-helpers.js';

@customElement('task-modal')
export class TaskModal extends LitElement {
  createRenderRoot(): this { return this; }

  @property({ attribute: false }) task!: Task;
  @property({ attribute: false }) tags: Tag[] = [];
  @property({ attribute: false }) columns: Column[] = [];

  @state() private _d: Task | null = null;
  @state() private _nt: 'edit' | 'preview' = 'edit';
  @state() private _ct = '';
  @state() private _ntn = '';
  private _dirty = false;

  connectedCallback(): void {
    super.connectedCallback();
    this._d = { ...this.task };
    window.addEventListener('keydown', this._onWindowKey);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('keydown', this._onWindowKey);
    if (this._dirty && this._d) {
      this._emit('save-task', { task: this._d });
    }
  }

  render() {
    if (!this._d) return html``;
    const d = this._d;
    return html`
      <div class="moverlay" @click=${this._onOverlayClick}>
        <div class="modal" @click=${this._stopProp}>
          <div class="mhdr">
            <input class="mtitlein" .value=${d.title} @input=${(e: Event) => this._up('title', (e.target as HTMLInputElement).value)} placeholder="TASK TITLE…" autofocus />
            <span style="font-size:10px;font-weight:700;font-family:var(--mono);background:rgba(0,0,0,.15);padding:2px 6px;letter-spacing:.07em;flex-shrink:0">
              <span class="kk">D</span> ${d.done ? "UNDO DONE" : "MARK DONE"}
            </span>
            <button class="mclose" @click=${this._saveAndClose}>✕</button>
          </div>

          <div class="mbody">
            <div class="mmain">
              <div>
                <label class="flabel">Notes (Markdown)</label>
                <div class="mdwrap">
                  <div class="mdtabs">
                    <div class="mdtab ${this._nt === "edit" ? "on" : ""}" @click=${() => this._nt = 'edit'}>EDIT</div>
                    <div class="mdtab ${this._nt === "preview" ? "on" : ""}" @click=${() => this._nt = 'preview'}>PREVIEW</div>
                  </div>
                  ${this._nt === "edit"
                    ? html`<textarea class="mdta" .value=${d.note || ''} @input=${(e: Event) => this._up('note', (e.target as HTMLTextAreaElement).value)} placeholder="Supports **bold**, *italic*, # headers, - lists, \`code\`…"></textarea>`
                    : html`<div class="mdprev">${unsafeHTML(renderMd(d.note) || '<span style="opacity:.4">Nothing to preview yet…</span>')}</div>`
                  }
                </div>
              </div>

              <div>
                <label class="flabel">Comments (${d.comments?.length || 0})</label>
                <div class="cmts">
                  ${(d.comments || []).map(c => html`
                    <div key=${c.id} class="cmtitem">
                      <div class="cmtav">${c.author[0]}</div>
                      <div class="cmtbub">
                        <div class="cmtmeta">
                          <span class="cmtauth">${c.author}</span>
                          <span class="cmttime">${new Date(c.createdAt).toLocaleString(undefined, {month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}</span>
                          <span class="cmtdel" @click=${() => this._up('comments', d.comments.filter((x: { id: string }) => x.id !== c.id))}>DEL</span>
                        </div>
                        <div class="cmttxt">${c.text}</div>
                      </div>
                    </div>
                  `)}
                  <div class="cmtinwrap">
                    <div class="cmtav">Y</div>
                    <textarea class="cmtin" placeholder="Add comment… (Ctrl+Enter)" .value=${this._ct} @input=${(e: Event) => this._ct = (e.target as HTMLTextAreaElement).value} @keydown=${this._onCmtKeyDown}></textarea>
                  </div>
                  ${this._ct.trim() ? html`<div style="display:flex;justify-content:flex-end"><button class="hbtn bk" @click=${this._postCmt}>POST</button></div>` : ''}
                </div>
              </div>
            </div>

            <div class="mside">
              <div>
                <label class="flabel">Column</label>
                <select class="fsel" .value=${d.columnId} @change=${(e: Event) => this._up('columnId', (e.target as HTMLSelectElement).value)}>
                  ${this.columns.map(c => html`<option key=${c.id} value=${c.id}>${c.emoji} ${c.name}</option>`)}
                </select>
              </div>
              <div>
                <label class="flabel">Priority</label>
                <div class="propts">
                  ${PRIOS.map(p => html`
                    <button key=${p} class="propt ${d.priority === p ? "on" : ""}"
                      style=${d.priority === p ? `background:${PC[p]};border-color:#0a0a0a;color:${["low","medium"].includes(p) ? "#0a0a0a" : "#fff"}` : ""}
                      @click=${() => this._up('priority', p)}>${PL[p]}</button>
                  `)}
                </div>
              </div>
              <div>
                <label class="flabel">Due Date</label>
                <input class="fin" type="date"
                  .value=${d.dueDate ? new Date(d.dueDate).toISOString().split("T")[0] : ""}
                  @change=${(e: Event) => {
                    const v = (e.target as HTMLInputElement).value;
                    this._up('dueDate', v ? new Date(v).getTime() : null);
                  }} />
              </div>

              <div style="display:flex;align-items:center;gap:10px;padding:10px;background:${d.done ? '#a8ff78' : 'var(--wh)'};border:var(--brT);box-shadow:var(--shS);cursor:pointer;transition:background .2s"
                @click=${() => this._up('done', !d.done)}>
                <div class="tchk ${d.done ? "ck" : ""}" style="flex-shrink:0;pointer-events:none">
                  <svg viewBox="0 0 10 8" fill="none" stroke="white" stroke-width="2.5"><polyline points="1,4 4,7 9,1"/></svg>
                </div>
                <span style="flex:1;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.07em">
                  ${d.done ? "✓ DONE" : "MARK DONE"}
                </span>
                <span class="kk">D</span>
              </div>

              <div>
                <label class="flabel">Tags</label>
                <div class="tagsel">
                  ${this.tags.map(tag => {
                    const sel = d.tags?.includes(tag.id);
                    return html`
                      <span key=${tag.id} class="tschip ${sel ? "on" : ""}"
                        style=${sel ? `background:${tag.color};border-color:#0a0a0a;color:#fff` : `border-color:${tag.color}`}
                        @click=${() => this._togTag(tag.id)}>${tag.name}</span>
                    `;
                  })}
                  <input class="fin" style="font-size:11px;padding:3px 7px;height:28px" placeholder="＋ NEW TAG…"
                    .value=${this._ntn} @input=${(e: Event) => this._ntn = (e.target as HTMLInputElement).value}
                    @keydown=${this._onNewTagKeyDown} />
                </div>
              </div>

              <div class="div3"></div>
              <button class="hbtn bk" style="width:100%;justify-content:center" @click=${this._saveAndClose}>✓ SAVE & CLOSE</button>
              <button class="hbtn" style="width:100%;justify-content:center;border-color:#ff6b6b;color:#ff6b6b" @click=${() => this._emit('delete-task', { id: this.task.id })}>🗑 DELETE</button>
              <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#888;line-height:1.9;font-family:var(--mono)">
                Created ${new Date(this.task.createdAt).toLocaleDateString()}<br/>
                ID: #${this.task.id.slice(-6).toUpperCase()}<br/>
                <span style="color:var(--pink)">⚡ Dexie.js</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private _up(k: keyof Task, v: unknown): void {
    this._dirty = true;
    if (this._d) this._d = { ...this._d, [k]: v };
  }

  private _saveAndClose(): void {
    if (this._d) this._emit('save-task', { task: this._d });
    this._dirty = false;
    this._emit('close-task');
  }

  private _postCmt(): void {
    if (!this._ct.trim() || !this._d) return;
    this._up('comments', [...(this._d.comments || []), { id: uid(), text: this._ct.trim(), author: 'You', createdAt: Date.now() }]);
    this._ct = '';
  }

  private _togTag(tid: string): void {
    if (!this._d) return;
    const c = this._d.tags || [];
    this._up('tags', c.includes(tid) ? c.filter((t: string) => t !== tid) : [...c, tid]);
  }

  private _onCmtKeyDown(e: KeyboardEvent): void {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') this._postCmt();
  }

  private _onNewTagKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter' && this._ntn.trim()) {
      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      this._emit('add-tag', { name: this._ntn.trim().toUpperCase(), color });
      this._ntn = '';
    }
  }

  private _onOverlayClick(e: MouseEvent): void {
    if (e.target === e.currentTarget) this._saveAndClose();
  }

  private _onWindowKey = (e: KeyboardEvent): void => {
    const inIn = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '');
    if (!inIn && (e.key === 'd' || e.key === 'D') && this._d) {
      this._up('done', !this._d.done);
    }
  };

  private _stopProp(e: Event): void {
    e.stopPropagation();
  }

  private _emit(type: string, detail?: unknown): void {
    this.dispatchEvent(new CustomEvent(type, { bubbles: true, composed: true, detail }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'task-modal': TaskModal;
  }
}

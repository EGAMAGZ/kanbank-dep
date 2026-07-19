import { LitElement, html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import type { Column } from '../storage/db-helpers.js';

@customElement('quick-create-modal')
export class QuickCreateModal extends LitElement {
  createRenderRoot(): this { return this; }

  @property({ attribute: false }) columns: Column[] = [];
  @property({ type: String }) defaultColId = '';
  @state() private _title = '';
  @state() private _colId = '';

  @query('.qctitlein') private _input!: HTMLInputElement;

  connectedCallback(): void {
    super.connectedCallback();
    this._colId = this.defaultColId;
  }

  firstUpdated(): void {
    this._input?.focus();
  }

  render() {
    const selCol = this.columns.find(c => c.id === this._colId);
    return html`
      <div class="moverlay" @click=${this._onOverlayClick}>
        <div class="qcmodal" @click=${this._stopProp}>
          <div class="qchdr">
            <span class="qchdr-title">🤔 NEW TASK</span>
            <span class="qchdr-col">${selCol?.emoji} ${selCol?.name}</span>
            <button class="mclose" style="background:rgba(255,255,255,.2);border-color:rgba(255,255,255,.5);color:#fff" @click=${() => this._emit('close-qc')}>✕</button>
          </div>
          <div class="qcbody">
            <input class="qctitlein" placeholder="WHAT ARE YOU THINKING ABOUT?"
              .value=${this._title} @input=${this._onTitleInput} @keydown=${this._onKeyDown} />
            <div style="display:flex;align-items:center;gap:10px">
              <label style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em">Column:</label>
              <select class="qccolsel" .value=${this._colId} @change=${this._onColChange}>
                ${this.columns.map(c => html`<option key=${c.id} value=${c.id}>${c.emoji} ${c.name}</option>`)}
              </select>
            </div>
          </div>
          <div class="qcfooter">
            <div class="qchints">
              <div class="qchint"><span class="kk">Ctrl+Enter</span> Save &amp; close</div>
              <div class="qchint"><span class="kk">Ctrl+⇧+Enter</span> Save &amp; new</div>
              <div class="qchint"><span class="kk">Esc</span> Cancel</div>
            </div>
            <div class="qcactions">
              <button class="hbtn" @click=${() => this._emit('close-qc')}>CANCEL</button>
              <button class="hbtn bk" @click=${this._onSave}>✓ SAVE</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private _onOverlayClick(e: MouseEvent): void {
    if (e.target === e.currentTarget) this._emit('close-qc');
  }

  private _onTitleInput(e: Event): void {
    this._title = (e.target as HTMLInputElement).value;
  }

  private _onColChange(e: Event): void {
    this._colId = (e.target as HTMLSelectElement).value;
  }

  private async _onKeyDown(e: KeyboardEvent): Promise<void> {
    if (e.key === 'Escape') { this._emit('close-qc'); return; }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      if (!this._title.trim()) return;
      if (e.shiftKey) {
        const detail = { title: this._title, colId: this._colId };
        this._emit('save-and-new', detail);
        this._title = '';
        await new Promise(r => setTimeout(r, 0));
        this._input?.focus();
      } else {
        this._emit('save-qc', { title: this._title, colId: this._colId });
      }
    }
  }

  private _onSave(): void {
    if (this._title.trim()) {
      this._emit('save-qc', { title: this._title, colId: this._colId });
    } else {
      this._emit('close-qc');
    }
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
    'quick-create-modal': QuickCreateModal;
  }
}

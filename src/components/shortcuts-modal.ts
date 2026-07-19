import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('shortcuts-modal')
export class ShortcutsModal extends LitElement {
  createRenderRoot(): this { return this; }

  private _sc: [string, string][] = [
    ["C",             "Create task in ¿Maybe?"],
    ["D",             "Toggle done (open task)"],
    ["← →",           "Navigate / expand columns"],
    ["⌘K",            "Open shortcuts"],
    ["⌘F or /",       "Focus search"],
    ["B",             "Toggle sidebar"],
    ["F",             "Toggle filter bar"],
    ["Esc",           "Close / collapse column"],
    ["↑ ↓",           "Navigate cards"],
    ["Enter",         "Open focused card"],
    ["Del",           "Delete focused card"],
    ["Ctrl+Enter",    "Save task / post comment"],
    ["Ctrl+⇧+Enter",  "Save & create another"],
    ["Drag card",     "Move between columns"],
    ["Right-click",   "Context menu"],
    ["Dbl-click col", "Rename column"],
  ];

  render() {
    return html`
      <div class="moverlay" @click=${this._onClose}>
        <div class="modal" style="width:560px" @click=${this._stopProp}>
          <div class="mhdr" style="background:var(--pink)">
            <span style="flex:1;font-family:var(--disp);font-size:18px;text-transform:uppercase;letter-spacing:.04em;color:#fff">⌨️ SHORTCUTS</span>
            <button class="mclose" style="background:rgba(255,255,255,.2);border-color:rgba(255,255,255,.5);color:#fff" @click=${this._onClose}>✕</button>
          </div>
          <div style="padding:16px">
            <div class="scgrid">
              ${this._sc.map(([k, desc]) => html`
                <div key=${k} class="scrow">
                  <span class="scdesc">${desc}</span>
                  <div class="sckeys">${k.split(" or ").map((x, i) => html`<span key=${i} class="kk">${x.trim()}</span>`)}</div>
                </div>
              `)}
            </div>
            <div style="margin-top:14px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#888;text-align:center;padding:10px 0;border-top:2.5px solid #0a0a0a;display:flex;align-items:center;justify-content:center;gap:10px">
              <span class="dexie-badge">⚡ DEXIE.JS</span>
              <span>¿Maybe? always open · N tags ↔ M boards</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private _onClose(): void {
    this._emit('close-sc');
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
    'shortcuts-modal': ShortcutsModal;
  }
}

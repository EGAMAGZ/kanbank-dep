import { LitElement, html, unsafeCSS } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { LiveQueryController } from './controllers/live-query.js';
import { ToastController } from './controllers/toast.js';
import { db, DB } from './storage/db-helpers.js';
import type { Board, Column, Task, Tag } from './storage/db-helpers.js';
import { seedIfEmpty } from './storage/seed.js';
import { uid } from './utils/uid.js';
import { COL_PRESETS, PALETTE } from './utils/constants.js';
import { CSS } from './styles/styles.js';
import './components/board-header.js';
import './components/col-strip.js';
import './components/ctx-menu.js';
import './components/filter-bar.js';
import './components/full-column.js';
import './components/quick-create-modal.js';
import './components/shortcuts-modal.js';
import './components/sidebar.js';
import './components/task-modal.js';
import './components/toast-container.js';
import './pwa-badge.js';

interface CtxState {
  x: number;
  y: number;
  type: string;
  id: string;
  colId?: string;
  columns?: Column[];
}

@customElement('kanban-app')
export class KanbanApp extends LitElement {
  createRenderRoot(): this { return this; }

  private _boardsCtrl = new LiveQueryController<Board[]>(
    this, () => db.boards.orderBy('createdAt').toArray() as Promise<Board[]>, []
  );
  private _tagsCtrl = new LiveQueryController<Tag[]>(
    this, () => db.tags.orderBy('name').toArray() as Promise<Tag[]>, []
  );
  private _tasksCtrl = new LiveQueryController<Task[]>(
    this, () => Promise.resolve([] as Task[]), []
  );
  private _toastCtrl = new ToastController(this);

  @state() private _activeBoardId: string | null = null;
  @state() private _sbOff = false;
  @state() private _showSC = false;
  @state() private _searchQ = '';
  @state() private _filterTags: string[] = [];
  @state() private _filterPrio: string | null = null;
  @state() private _showFBar = false;
  @state() private _openTaskId: string | null = null;
  @state() private _quickCreate: { colId: string } | null = null;
  @state() private _ctx: CtxState | null = null;
  @state() private _drag: { tid: string; fid: string } | null = null;
  @state() private _foc: { cid: string; tid: string } | null = null;
  @state() private _activeColId: string | null = null;
  @state() private _justDoneId: string | null = null;

  get boards(): Board[] { return this._boardsCtrl.value; }
  get tags(): Tag[] { return this._tagsCtrl.value; }
  get liveTasks(): Task[] { return this._tasksCtrl.value; }

  async firstUpdated(): Promise<void> {
    await seedIfEmpty();
    const b = await db.boards.orderBy('createdAt').first();
    if (b) this._activeBoardId = b.id;
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('_activeBoardId')) {
      this._updateTasksQuery();
    }
  }

  protected updated(_changed: PropertyValues): void {
    if (!this._activeBoardId && this.boards.length > 0) {
      this._activeBoardId = this.boards[0].id;
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('keydown', this._handleKeyDown);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('keydown', this._handleKeyDown);
  }

  private _updateTasksQuery(): void {
    if (this._activeBoardId) {
      this._tasksCtrl.setQuery(
        () => db.tasks.where('boardId').equals(this._activeBoardId!).toArray() as Promise<Task[]>
      );
    } else {
      this._tasksCtrl.setQuery(() => Promise.resolve([] as Task[]));
    }
  }

  private get _AB(): Board | undefined {
    return this.boards.find(b => b.id === this._activeBoardId);
  }

  private get _cols(): Column[] {
    return this._AB?.columns ?? COL_PRESETS;
  }

  private get _filtered(): Task[] {
    let t = this.liveTasks;
    if (this._searchQ) {
      const q = this._searchQ.toLowerCase();
      t = t.filter(x => x.title.toLowerCase().includes(q) || x.note?.toLowerCase().includes(q));
    }
    if (this._filterTags.length) t = t.filter(x => this._filterTags.every(ft => x.tags?.includes(ft)));
    if (this._filterPrio) t = t.filter(x => x.priority === this._filterPrio);
    return t;
  }

  private get _openTask(): Task | undefined {
    return this.liveTasks.find(t => t.id === this._openTaskId);
  }

  private get _hasF(): boolean {
    return !!(this._searchQ || this._filterTags.length || this._filterPrio);
  }

  private _colProgress(): Record<string, number> {
    const out: Record<string, number> = {};
    for (const col of this._cols) {
      const ct = this.liveTasks.filter(t => t.columnId === col.id);
      out[col.id] = ct.length ? Math.round(ct.filter(t => t.done).length / ct.length * 100) : 0;
    }
    return out;
  }

  render() {
    const progress = this._colProgress();
    return html`
      <style>${unsafeCSS(CSS)}</style>
      <div class="app" @click=${this._onAppClick}>

        <sidebar-c
          .sbOff=${this._sbOff}
          .boards=${this.boards}
          .activeBoardId=${this._activeBoardId}
          .tags=${this.tags}
          .filterTags=${this._filterTags}
          @toggle-sb=${() => this._sbOff = !this._sbOff}
          @select-board=${(e: CustomEvent) => this._activeBoardId = e.detail.id}
          @del-board=${(e: CustomEvent) => this._delBoard(e.detail.id)}
          @add-board=${this._addBoard}
          @filter-tag=${(e: CustomEvent) => this._onFilterTag(e.detail.id)}
          @del-tag=${(e: CustomEvent) => DB.tags.cascade(e.detail.id)}
          @add-tag=${(e: CustomEvent) => this._addTag(e.detail.name, e.detail.color)}
        ></sidebar-c>

        <div class="main">
          ${!this._activeBoardId ? html`
            <div class="noboard">
              <div class="nbtitle">NO BOARD<br/>SELECTED</div>
              <div class="nbsub">Create one to get started</div>
              <button class="nbcta" @click=${this._addBoard}>＋ CREATE BOARD</button>
            </div>
          ` : html`
            <board-header
              .AB=${this._AB}
              .searchQ=${this._searchQ}
              .showFBar=${this._showFBar}
              .hasF=${this._hasF}
              .cols=${this._cols}
              @save-board=${(e: CustomEvent) => DB.boards.put(e.detail.board)}
              @search-change=${(e: CustomEvent) => this._searchQ = e.detail.query}
              @toggle-fbar=${() => this._showFBar = !this._showFBar}
              @quick-create=${(e: CustomEvent) => this._quickCreate = { colId: e.detail.colId }}
              @show-sc=${() => this._showSC = true}
              @add-col=${(e: CustomEvent) => this._addCol(e.detail.column)}
            ></board-header>

            <filter-bar
              .showFBar=${this._showFBar}
              .filterPrio=${this._filterPrio}
              .tags=${this.tags}
              .filterTags=${this._filterTags}
              .hasF=${this._hasF}
              @filter-prio=${(e: CustomEvent) => this._filterPrio = e.detail.prio}
              @filter-tag=${(e: CustomEvent) => this._onFilterTag(e.detail.id)}
              @clear-filters=${this._clearFilters}
            ></filter-bar>

            <div class="barea">
              ${this._cols.map(col => {
                const colTasks = this.liveTasks.filter(t => t.columnId === col.id);
                const filtColTasks = this._filtered.filter(t => t.columnId === col.id);

                if (col.isMaybe) {
                  return html`
                    <full-column key=${col.id} .col=${col} .tasks=${filtColTasks} .allTasks=${colTasks}
                      .tags=${this.tags} .foc=${this._foc} .columns=${this._cols}
                      .drag=${this._drag} .hasF=${this._hasF} .isMaybe=${true} .justDoneId=${this._justDoneId}
                      @open-task=${(e: CustomEvent) => this._openTaskId = e.detail.id}
                      @toggle-task=${(e: CustomEvent) => this._handleToggle(e.detail.task)}
                      @add-task=${(e: CustomEvent) => this._addTask(e.detail.colId, e.detail.title)}
                      @delete-col=${(e: CustomEvent) => this._delCol(e.detail.colId)}
                      @update-col=${(e: CustomEvent) => this._updateCol(e.detail.column)}
                      @foc-task=${(e: CustomEvent) => this._foc = e.detail}
                      @task-ctx=${(e: CustomEvent) => this._ctx = e.detail}
                      @drag-start=${(e: CustomEvent) => this._drag = { tid: e.detail.taskId, fid: e.detail.colId }}
                      @drop-task=${(e: CustomEvent) => this._onDrop(e.detail.event, e.detail.toId)}
                    ></full-column>
                  `;
                }

                const isExpanded = this._activeColId === col.id;
                const pct = progress[col.id] || 0;

                if (!isExpanded) {
                  return html`
                    <col-strip key=${col.id} .col=${col}
                      .taskCount=${colTasks.length} .filteredCount=${filtColTasks.length}
                      .pct=${pct} .hasF=${this._hasF}
                      @strip-click=${() => this._activeColId = col.id}
                      @strip-drop=${(e: CustomEvent) => this._onDrop(e.detail.event, col.id)}
                    ></col-strip>
                  `;
                }

                return html`
                  <full-column key=${col.id} .col=${col} .tasks=${filtColTasks} .allTasks=${colTasks}
                    .tags=${this.tags} .foc=${this._foc} .columns=${this._cols}
                    .drag=${this._drag} .hasF=${this._hasF} .isMaybe=${false} .justDoneId=${this._justDoneId}
                    @open-task=${(e: CustomEvent) => this._openTaskId = e.detail.id}
                    @toggle-task=${(e: CustomEvent) => this._handleToggle(e.detail.task)}
                    @add-task=${(e: CustomEvent) => this._addTask(e.detail.colId, e.detail.title)}
                    @delete-col=${(e: CustomEvent) => this._delCol(e.detail.colId)}
                    @update-col=${(e: CustomEvent) => this._updateCol(e.detail.column)}
                    @foc-task=${(e: CustomEvent) => this._foc = e.detail}
                    @task-ctx=${(e: CustomEvent) => this._ctx = e.detail}
                    @drag-start=${(e: CustomEvent) => this._drag = { tid: e.detail.taskId, fid: e.detail.colId }}
                    @drop-task=${(e: CustomEvent) => this._onDrop(e.detail.event, e.detail.toId)}
                    @collapse=${() => this._activeColId = null}
                  ></full-column>
                `;
              })}
            </div>
          `}
        </div>
      </div>

      ${this._openTask ? html`
        <task-modal .task=${this._openTask} .tags=${this.tags} .columns=${this._cols}
          @close-task=${() => this._openTaskId = null}
          @save-task=${(e: CustomEvent) => DB.tasks.put(e.detail.task)}
          @delete-task=${() => { DB.tasks.delete(this._openTask!.id); this._openTaskId = null; }}
          @add-tag=${(e: CustomEvent) => this._addTag(e.detail.name, e.detail.color)}
        ></task-modal>
      ` : ''}

      ${this._quickCreate ? html`
        <quick-create-modal .columns=${this._cols} .defaultColId=${this._quickCreate.colId}
          @close-qc=${() => this._quickCreate = null}
          @save-qc=${(e: CustomEvent) => { this._addTask(e.detail.colId, e.detail.title); this._quickCreate = null; }}
          @save-and-new=${(e: CustomEvent) => this._addTask(e.detail.colId, e.detail.title)}
        ></quick-create-modal>
      ` : ''}

      ${this._showSC ? html`
        <shortcuts-modal @close-sc=${() => this._showSC = false}></shortcuts-modal>
      ` : ''}

      ${this._ctx ? html`
        <ctx-menu .menu=${this._ctx} .columns=${this._cols}
          @close-ctx=${() => this._ctx = null}
          @ctx-open-task=${(e: CustomEvent) => this._openTaskId = e.detail.id}
          @ctx-move-task=${(e: CustomEvent) => this._moveTask(e.detail.tid, e.detail.toId)}
          @ctx-del-task=${(e: CustomEvent) => DB.tasks.delete(e.detail.id)}
          @ctx-del-board=${(e: CustomEvent) => this._delBoard(e.detail.id)}
        ></ctx-menu>
      ` : ''}

      <toast-container .toasts=${this._toastCtrl.toasts}></toast-container>
      <pwa-badge></pwa-badge>
    `;
  }

  private _onAppClick(): void {
    this._ctx = null;
  }

  private _handleKeyDown = (e: KeyboardEvent): void => {
    const tag = document.activeElement?.tagName;
    const inIn = ['INPUT', 'TEXTAREA'].includes(tag!) || (document.activeElement as HTMLElement)?.isContentEditable;

    if (e.key === 'Escape') {
      if (this._quickCreate) { this._quickCreate = null; return; }
      this._openTaskId = null;
      this._ctx = null;
      this._showSC = false;
      this._activeColId = null;
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); this._showSC = true; return; }
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') { e.preventDefault(); (document.querySelector('.srch') as HTMLInputElement)?.focus(); return; }

    if (this._openTaskId && !inIn && (e.key === 'd' || e.key === 'D')) {
      const task = this.liveTasks.find(t => t.id === this._openTaskId);
      if (task) {
        const next = { ...task, done: !task.done };
        DB.tasks.put(next);
        this._toastCtrl.toast(task.done ? 'Marked undone' : '✓ Done!', 's');
        if (!task.done) { this._justDoneId = task.id; setTimeout(() => this._justDoneId = null, 600); }
      }
      return;
    }

    if (inIn) return;

    if (e.key === 'c' || e.key === 'C') {
      const mc = this._cols.find(c => c.isMaybe);
      if (mc) this._quickCreate = { colId: mc.id };
      return;
    }
    if (e.key === 'b' || e.key === 'B') { this._sbOff = !this._sbOff; return; }
    if (e.key === 'f' || e.key === 'F') { this._showFBar = !this._showFBar; return; }
    if (e.key === '/') { e.preventDefault(); (document.querySelector('.srch') as HTMLInputElement)?.focus(); return; }

    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const ci = this._activeColId
        ? this._cols.findIndex(c => c.id === this._activeColId)
        : this._cols.findIndex(c => c.isMaybe);
      if (e.key === 'ArrowRight') {
        let ni = ci + 1;
        while (ni < this._cols.length && this._cols[ni].isMaybe) ni++;
        if (ni < this._cols.length) this._activeColId = this._cols[ni].id;
      } else {
        let ni = ci - 1;
        while (ni >= 0 && this._cols[ni].isMaybe) ni--;
        if (ni >= 0) this._activeColId = this._cols[ni].id;
      }
      return;
    }
    if (e.key === 'Enter' && this._activeColId) { this._activeColId = null; return; }

    if (this._foc) {
      const ct = this.liveTasks.filter(t => t.columnId === this._foc!.cid);
      const ti = ct.findIndex(t => t.id === this._foc!.tid);
    if (e.key === 'ArrowDown' && ti < ct.length - 1 && this._foc) this._foc = { cid: this._foc.cid, tid: ct[ti + 1].id };
    if (e.key === 'ArrowUp' && ti > 0 && this._foc) this._foc = { cid: this._foc.cid, tid: ct[ti - 1].id };
      if (e.key === 'Enter') this._openTaskId = this._foc!.tid;
      if ((e.key === 'Delete' || e.key === 'Backspace') && confirm('Delete task?')) DB.tasks.delete(this._foc!.tid);
    }
  };

  private async _addBoard(): Promise<void> {
    const name = prompt('Board name:');
    if (!name) return;
    const b: Board = {
      id: uid(),
      name: name.toUpperCase(),
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      columns: COL_PRESETS.map(c => ({ ...c, id: uid() })),
      createdAt: Date.now(),
    };
    await DB.boards.put(b);
    this._activeBoardId = b.id;
    this._toastCtrl.toast(`"${name}" created`, 's');
  }

  private async _delBoard(bid: string): Promise<void> {
    if (!confirm('Delete board and all tasks?')) return;
    await DB.deleteBoard(bid);
    if (this._activeBoardId === bid) this._activeBoardId = null;
    this._toastCtrl.toast('Board deleted', 'i');
  }

  private async _addCol(col: Column): Promise<void> {
    if (!this._AB) return;
    await DB.boards.put({ ...this._AB, columns: [...this._cols, col] });
  }

  private async _updateCol(col: Column): Promise<void> {
    if (!this._AB) return;
    await DB.boards.put({ ...this._AB, columns: this._cols.map(c => c.id === col.id ? col : c) });
  }

  private async _delCol(colId: string): Promise<void> {
    if (!confirm('Delete column and its tasks?')) return;
    const nc = this._cols.filter(c => c.id !== colId);
    await DB.deleteColumn(this._activeBoardId!, colId, { ...this._AB!, columns: nc });
    this._toastCtrl.toast('Column deleted', 'i');
  }

  private async _addTask(colId: string, title: string): Promise<Task | null> {
    if (!title.trim() || !this._activeBoardId) return null;
    const t: Task = {
      id: uid(),
      boardId: this._activeBoardId,
      columnId: colId,
      title: title.trim(),
      done: false,
      priority: 'none',
      note: '',
      tags: [],
      comments: [],
      createdAt: Date.now(),
      dueDate: null,
      order: 0,
    };
    await DB.tasks.put(t);
    this._toastCtrl.toast('Task added ＋', 's');
    return t;
  }

  private async _handleToggle(task: Task): Promise<void> {
    const next = { ...task, done: !task.done };
    await DB.tasks.put(next);
    if (!task.done) {
      this._justDoneId = task.id;
      setTimeout(() => this._justDoneId = null, 600);
    }
  }

  private async _onDrop(e: DragEvent, toId: string): Promise<void> {
    e.preventDefault();
    const drag = this._drag;
    if (!drag || drag.fid === toId) { this._drag = null; return; }
    const t = this.liveTasks.find(x => x.id === drag.tid);
    if (t) { await DB.tasks.put({ ...t, columnId: toId }); this._toastCtrl.toast('Moved ↗', 's'); }
    this._drag = null;
  }

  private async _moveTask(tid: string, toId: string): Promise<void> {
    const t = this.liveTasks.find(x => x.id === tid);
    if (t) { await DB.tasks.put({ ...t, columnId: toId }); this._toastCtrl.toast('Moved ↗', 's'); }
  }

  private async _addTag(name: string, color: string): Promise<void> {
    const t: Tag = { id: uid(), name, color };
    await DB.tags.put(t);
  }

  private _onFilterTag(id: string): void {
    this._filterTags = this._filterTags.includes(id)
      ? this._filterTags.filter(t => t !== id)
      : [...this._filterTags, id];
  }

  private _clearFilters(): void {
    this._filterTags = [];
    this._filterPrio = null;
    this._searchQ = '';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kanban-app': KanbanApp;
  }
}

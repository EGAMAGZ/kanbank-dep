import Dexie from "dexie";

const INDEXDB_VERSION = 1;

export class KanbanDB extends Dexie {
  boards: Dexie.Table;
  tasks: Dexie.Table;
  tags: Dexie.Table;

  constructor() {
    super(`kanbank_v${INDEXDB_VERSION}`);

    this.version(INDEXDB_VERSION).stores({
      boards: "id, name, createdAt",
      tasks: "id, boardId, columnId, done, priority, createdAt, updatedAt",
      tags: "id, name",
    });

    this.boards = this.table("boards");
    this.tasks = this.table("tasks");
    this.tags = this.table("tags");
  }
}

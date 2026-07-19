import { KanbanDB } from "./db.js";

const db = new KanbanDB();

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: number;
}

export interface Column {
  id: string;
  name: string;
  color: string;
  emoji: string;
  collapsed: boolean;
  isMaybe?: boolean;
}

export interface Task {
  id: string;
  boardId: string;
  columnId: string;
  title: string;
  done: boolean;
  priority: string;
  note: string;
  tags: string[];
  comments: Comment[];
  createdAt: number;
  dueDate: number | null;
  order: number;
}

export interface Board {
  id: string;
  name: string;
  color: string;
  columns: Column[];
  createdAt: number;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export { db };

export const DB = {
  boards: {
    getAll: (): Promise<Board[]> => db.boards.toArray(),
    put: (v: Board): Promise<string> => db.boards.put(v),
    delete: (id: string): Promise<void> => db.boards.delete(id),
  },
  tasks: {
    getAll: (): Promise<Task[]> => db.tasks.toArray(),
    byBoard: (boardId: string): Promise<Task[]> =>
      db.tasks.where("boardId").equals(boardId).toArray(),
    put: (v: Task): Promise<string> => db.tasks.put(v),
    delete: (id: string): Promise<void> => db.tasks.delete(id),
    bulkDelete: (ids: string[]): Promise<void> => db.tasks.bulkDelete(ids),
    withBoard: <T>(boardId: string, fn: (tasks: Task[]) => T): Promise<T> =>
      db.transaction("rw", db.tasks, async () => {
        const tasks = await db.tasks.where("boardId").equals(boardId).toArray();
        return fn(tasks);
      }),
  },
  tags: {
    getAll: (): Promise<Tag[]> => db.tags.toArray(),
    put: (v: Tag): Promise<string> => db.tags.put(v),
    delete: (id: string): Promise<void> => db.tags.delete(id),
    cascade: async (tagId: string): Promise<void> => {
      await db.transaction("rw", db.tags, db.tasks, async () => {
        await db.tags.delete(tagId);
        const affected = await db.tasks
          .filter((t: Task) => Array.isArray(t.tags) && t.tags.includes(tagId))
          .toArray();
        await db.tasks.bulkPut(
          affected.map((t: Task) => ({ ...t, tags: t.tags.filter((i: string) => i !== tagId) }))
        );
      });
    },
  },
  deleteBoard: async (boardId: string): Promise<void> => {
    await db.transaction("rw", db.boards, db.tasks, async () => {
      await db.boards.delete(boardId);
      const ids = await db.tasks.where("boardId").equals(boardId).primaryKeys();
      await db.tasks.bulkDelete(ids);
    });
  },
  deleteColumn: async (boardId: string, colId: string, updatedBoard: Board): Promise<void> => {
    await db.transaction("rw", db.boards, db.tasks, async () => {
      await db.boards.put(updatedBoard);
      const ids = await db.tasks
        .where("boardId").equals(boardId)
        .filter((t: Task) => t.columnId === colId)
        .primaryKeys();
      await db.tasks.bulkDelete(ids);
    });
  },
};

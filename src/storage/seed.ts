import { uid } from "../utils/uid.js";
import { COL_PRESETS, DEFAULT_BOARD, MAYBE_ID } from "../utils/constants.js";
import { db, DB } from "./db-helpers.js";

export async function seedIfEmpty(): Promise<void> {
  const [bCount, tgCount] = await Promise.all([
    db.boards.count(),
    db.tags.count(),
  ]);

  if (bCount === 0) {
    const cols = COL_PRESETS.map(c => ({ ...c }));
    await DB.boards.put({ ...DEFAULT_BOARD, columns: cols });
    const demos = [
      { id:uid(), boardId:DEFAULT_BOARD.id, columnId:MAYBE_ID,        title:"Explore a new design system",  done:false, priority:"none",   note:"",  tags:[] as string[], comments:[], createdAt:Date.now()-1800000,   dueDate:null,                 order:0 },
      { id:uid(), boardId:DEFAULT_BOARD.id, columnId:MAYBE_ID,        title:"Refactor the auth module?",    done:false, priority:"low",    note:"",  tags:[] as string[], comments:[], createdAt:Date.now()-900000,    dueDate:null,                 order:1 },
      { id:uid(), boardId:DEFAULT_BOARD.id, columnId:"col-todo",      title:"Design the landing page",      done:false, priority:"high",   note:"## Brief\nCreate a **bold** neobrutalist landing page.\n\n- Thick borders\n- Flat colors\n- Heavy typography", tags:[] as string[], comments:[], createdAt:Date.now()-3600000,  dueDate:Date.now()+86400000*2, order:0 },
      { id:uid(), boardId:DEFAULT_BOARD.id, columnId:"col-progress",  title:"Implement auth flow",          done:false, priority:"urgent", note:"",  tags:[] as string[], comments:[{ id:uid(), text:"JWT or sessions?", author:"Ana", createdAt:Date.now()-1200000 }], createdAt:Date.now()-7200000,  dueDate:null,  order:0 },
      { id:uid(), boardId:DEFAULT_BOARD.id, columnId:"col-backlog",   title:"Write unit tests",             done:false, priority:"low",    note:"",  tags:[] as string[], comments:[], createdAt:Date.now()-86400000,  dueDate:null,                 order:0 },
      { id:uid(), boardId:DEFAULT_BOARD.id, columnId:"col-done",      title:"Setup CI/CD pipeline",         done:true,  priority:"medium", note:"",  tags:[] as string[], comments:[], createdAt:Date.now()-172800000, dueDate:null,                 order:0 },
    ];
    await db.tasks.bulkAdd(demos);
  }

  if (tgCount === 0) {
    await db.tags.bulkAdd([
      { id:uid(), name:"BUG",     color:"#ff6b6b" },
      { id:uid(), name:"FEATURE", color:"#4d96ff" },
      { id:uid(), name:"DESIGN",  color:"#ff6bcc" },
      { id:uid(), name:"BACKEND", color:"#6bcb77" },
    ]);
  }
}

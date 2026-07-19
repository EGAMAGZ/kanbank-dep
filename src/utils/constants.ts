export interface ColumnPreset {
  id: string;
  name: string;
  color: string;
  emoji: string;
  collapsed: boolean;
  isMaybe?: boolean;
}

export const PRIOS = ["none","low","medium","high","urgent"] as const;

export const PC: Record<string, string> = {
  none:"#e5e5e5", low:"#a8ff78", medium:"#ffe066", high:"#ff9f43", urgent:"#ff4757",
};

export const PL: Record<string, string> = {
  none:"—", low:"LOW", medium:"MED", high:"HIGH", urgent:"🔥 FIRE",
};

export const PALETTE = [
  "#ff6b6b","#ffd93d","#6bcb77","#4d96ff","#ff6bcc",
  "#ff9f43","#a29bfe","#fd79a8","#55efc4","#fdcb6e",
];

export const MAYBE_ID = "col-maybe";

export const COL_PRESETS: ColumnPreset[] = [
  { id:"col-backlog",  name:"BACKLOG",     color:"#e5e5e5", emoji:"📦", collapsed:true  },
  { id:"col-todo",     name:"TO DO",       color:"#ffd93d", emoji:"📋", collapsed:true  },
  { id:MAYBE_ID,       name:"¿MAYBE?",     color:"#ff6bcc", emoji:"🤔", collapsed:false, isMaybe:true },
  { id:"col-progress", name:"IN PROGRESS", color:"#4d96ff", emoji:"⚡", collapsed:true  },
  { id:"col-done",     name:"DONE",        color:"#6bcb77", emoji:"✅", collapsed:true  },
];

export const DEFAULT_BOARD = { id:"board-default", name:"MY BOARD", color:"#ffd93d", createdAt: Date.now() };

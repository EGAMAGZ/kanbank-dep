export function renderMd(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/^### (.+)$/gm,"<h3>$1</h3>")
    .replace(/^## (.+)$/gm,"<h2>$1</h2>")
    .replace(/^# (.+)$/gm,"<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")
    .replace(/\*(.+?)\*/g,"<em>$1</em>")
    .replace(/`(.+?)`/g,"<code>$1</code>")
    .replace(/~~(.+?)~~/g,"<del>$1</del>")
    .replace(/^\- \[x\] (.+)$/gm,'<li class="mddone">✓ $1</li>')
    .replace(/^\- \[ \] (.+)$/gm,'<li class="mdtodo">○ $1</li>')
    .replace(/^- (.+)$/gm,"<li>$1</li>")
    .replace(/\[(.+?)\]\((.+?)\)/g,'<a href="$2" target="_blank">$1</a>')
    .replace(/^---$/gm,"<hr>")
    .replace(/\n\n/g,"</p><p>")
    .replace(/\n/g,"<br>");
}

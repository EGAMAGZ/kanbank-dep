export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Archivo+Black&family=JetBrains+Mono:wght@400;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bk:#0a0a0a; --wh:#fffef0; --bg:#fffef0;
  --br:2.5px solid #0a0a0a; --brT:3px solid #0a0a0a;
  --sh:4px 4px 0 #0a0a0a; --shL:6px 6px 0 #0a0a0a; --shS:2px 2px 0 #0a0a0a; --shH:7px 7px 0 #0a0a0a;
  --font:'Space Grotesk',sans-serif; --disp:'Archivo Black',sans-serif; --mono:'JetBrains Mono',monospace;
  --yellow:#ffd93d; --blue:#4d96ff; --red:#ff6b6b; --green:#6bcb77; --pink:#ff6bcc;
  --col-w:288px; --hh:58px; --sbw:228px;
}
html,body,#root{height:100%;overflow:hidden;}
body{background:var(--bg);color:var(--bk);font-family:var(--font);font-size:14px;line-height:1.5;}
::-webkit-scrollbar{width:7px;height:7px;}
::-webkit-scrollbar-track{background:var(--wh);border-left:var(--br);}
::-webkit-scrollbar-thumb{background:var(--bk);}
.app{display:flex;height:100vh;overflow:hidden;position:relative;}
.app::before{content:'';position:fixed;inset:0;background-image:radial-gradient(#0a0a0a 1.2px,transparent 1.2px);background-size:22px 22px;opacity:.055;pointer-events:none;z-index:0;}

/* ── SIDEBAR ── */
.sb{width:var(--sbw);min-width:var(--sbw);background:var(--wh);border-right:var(--brT);display:flex;flex-direction:column;position:relative;z-index:10;transition:width .18s,min-width .18s;overflow:hidden;}
.sb.off{width:50px;min-width:50px;}
.sb-hdr{height:var(--hh);display:flex;align-items:center;gap:10px;padding:0 14px;border-bottom:var(--brT);background:var(--yellow);flex-shrink:0;}
.sb-logo{width:30px;height:30px;background:var(--bk);color:var(--yellow);border:var(--br);display:flex;align-items:center;justify-content:center;font-family:var(--disp);font-size:15px;flex-shrink:0;box-shadow:var(--shS);}
.sb-title{font-family:var(--disp);font-size:14px;white-space:nowrap;overflow:hidden;letter-spacing:.02em;}
.sb-tog{margin-left:auto;width:26px;height:26px;border:var(--br);background:var(--wh);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px;box-shadow:var(--shS);transition:all .1s;flex-shrink:0;font-weight:700;}
.sb-tog:hover{background:var(--bk);color:var(--wh);transform:translate(-1px,-1px);box-shadow:var(--sh);}
.sb-sec{padding:10px;flex:1;overflow-y:auto;}
.sb-lbl{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:10px 6px 5px;border-bottom:var(--br);margin-bottom:8px;font-family:var(--disp);}
.sb-brd{display:flex;align-items:center;gap:8px;padding:8px 10px;border:var(--br);background:var(--wh);cursor:pointer;margin-bottom:6px;transition:all .1s;box-shadow:var(--shS);white-space:nowrap;overflow:hidden;}
.sb-brd:hover{transform:translate(-2px,-2px);box-shadow:var(--sh);}
.sb-brd.on{background:var(--yellow);box-shadow:var(--sh);}
.sb-dot{width:12px;height:12px;border:var(--br);flex-shrink:0;}
.sb-nm{flex:1;font-size:12px;font-weight:700;overflow:hidden;text-overflow:ellipsis;text-transform:uppercase;letter-spacing:.04em;}
.sb-del{width:20px;height:20px;border:var(--br);background:var(--wh);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:9px;opacity:0;transition:all .1s;flex-shrink:0;}
.sb-brd:hover .sb-del{opacity:1;}
.sb-del:hover{background:var(--red);color:var(--wh);}
.sb-add{display:flex;align-items:center;gap:8px;padding:8px 10px;border:2px dashed var(--bk);background:transparent;cursor:pointer;color:var(--bk);font-size:12px;font-weight:700;text-transform:uppercase;width:100%;font-family:var(--font);letter-spacing:.05em;transition:all .1s;}
.sb-add:hover{background:var(--bk);color:var(--wh);border-style:solid;}
.sb-tags{padding:10px;border-top:var(--brT);}
.tpill{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border:var(--br);font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;cursor:pointer;background:var(--wh);box-shadow:var(--shS);transition:all .1s;font-family:var(--font);}
.tpill:hover{transform:translate(-1px,-1px);box-shadow:var(--sh);}
.tpill.on{background:var(--bk);color:var(--wh);}
.tpill .tdel{cursor:pointer;font-size:9px;opacity:0;margin-left:2px;}
.tpill:hover .tdel{opacity:1;}
.tpillwrap{display:flex;flex-wrap:wrap;gap:5px;padding:5px 0;}

/* ── DEXIE BADGE ── */
.dexie-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 8px;border:var(--br);background:var(--bk);color:var(--yellow);font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;font-family:var(--mono);box-shadow:var(--shS);}

/* ── HEADER ── */
.bhdr{height:var(--hh);display:flex;align-items:center;gap:10px;padding:0 16px;border-bottom:var(--brT);background:var(--wh);flex-shrink:0;position:relative;z-index:5;}
.btitle{background:none;border:none;font-family:var(--disp);font-size:19px;color:var(--bk);cursor:pointer;padding:3px 6px;text-transform:uppercase;letter-spacing:.02em;transition:all .1s;outline:none;}
.btitle:focus{background:var(--yellow);border:var(--br);box-shadow:var(--shS);}
.hbtn{height:34px;padding:0 12px;border:var(--br);background:var(--wh);color:var(--bk);font-size:11px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:6px;white-space:nowrap;font-family:var(--font);text-transform:uppercase;letter-spacing:.05em;box-shadow:var(--shS);transition:all .12s;flex-shrink:0;}
.hbtn:hover{transform:translate(-2px,-2px);box-shadow:var(--sh);}
.hbtn:active{transform:translate(1px,1px);box-shadow:none;}
.hbtn.yl{background:var(--yellow);}
.hbtn.bk{background:var(--bk);color:var(--wh);}
.hbtn.pk{background:var(--pink);color:var(--wh);}
.srchwrap{position:relative;}
.srch{width:185px;height:34px;border:var(--br);background:var(--wh);padding:0 10px 0 30px;color:var(--bk);font-size:13px;font-family:var(--font);font-weight:500;box-shadow:var(--shS);outline:none;transition:all .12s;}
.srch:focus{width:215px;box-shadow:var(--sh);}
.srch::placeholder{color:#888;}
.srchic{position:absolute;left:9px;top:50%;transform:translateY(-50%);color:#888;font-size:14px;pointer-events:none;}
.kk{display:inline-flex;align-items:center;justify-content:center;background:var(--bk);color:var(--wh);border:1px solid #444;padding:1px 5px;font-size:9px;font-family:var(--mono);font-weight:600;}

/* ── FILTER BAR ── */
.fbar{display:flex;align-items:center;gap:6px;padding:8px 16px;background:var(--yellow);border-bottom:var(--brT);flex-shrink:0;overflow-x:auto;}
.fbar::-webkit-scrollbar{height:0;}
.flbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;white-space:nowrap;}
.fchip{padding:4px 10px;border:var(--br);background:var(--wh);font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;cursor:pointer;transition:all .1s;white-space:nowrap;font-family:var(--font);box-shadow:var(--shS);}
.fchip:hover{transform:translate(-1px,-1px);box-shadow:var(--sh);}
.fchip.on{background:var(--bk);color:var(--wh);}
.fclr{font-size:10px;font-weight:700;cursor:pointer;text-decoration:underline;white-space:nowrap;text-transform:uppercase;letter-spacing:.06em;}
.fclr:hover{color:var(--red);}

/* ── BOARD ── */
.barea{flex:1;overflow-x:auto;overflow-y:hidden;padding:16px 18px;display:flex;gap:14px;align-items:flex-start;}

/* ── PROGRESS STRIP (collapsed column) ── */
.col-strip{width:52px;min-width:52px;max-height:calc(100vh - var(--hh) - 32px);display:flex;flex-direction:column;border:var(--brT);background:var(--wh);box-shadow:var(--shL);flex-shrink:0;cursor:pointer;transition:all .18s;position:relative;overflow:hidden;}
.col-strip:hover{transform:translate(-2px,-2px);box-shadow:var(--shH);}
.col-strip.active-strip{background:var(--bk);transform:translate(-2px,-2px);box-shadow:var(--shH);}
.strip-fill{position:absolute;bottom:0;left:0;right:0;transition:height .4s cubic-bezier(.22,1,.36,1);border-top:var(--brT);}
.strip-emoji{font-size:16px;position:relative;z-index:1;margin-top:10px;text-align:center;}
.strip-cnt{width:32px;height:32px;border:var(--br);background:var(--wh);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;font-family:var(--mono);position:relative;z-index:1;margin:8px auto;flex-shrink:0;}
.active-strip .strip-cnt{background:var(--yellow);border-color:var(--bk);}
.strip-label{writing-mode:vertical-rl;font-family:var(--disp);font-size:10px;letter-spacing:.15em;text-transform:uppercase;flex:1;display:flex;align-items:center;justify-content:center;position:relative;z-index:1;padding:8px 0;}
.strip-pct{font-family:var(--mono);font-size:9px;font-weight:700;opacity:.5;position:relative;z-index:1;padding-bottom:8px;text-align:center;}

/* ── FULL COLUMN ── */
.col{width:var(--col-w);min-width:var(--col-w);max-height:calc(100vh - var(--hh) - 32px);display:flex;flex-direction:column;border:var(--brT);background:var(--wh);box-shadow:var(--shL);flex-shrink:0;}
.col.maybe-col{border-color:var(--pink);box-shadow:6px 6px 0 var(--pink);}
.col.dov{outline:3px dashed var(--bk);outline-offset:3px;background:#fffde0;}
.col-hdr{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:var(--brT);flex-shrink:0;}
.col.maybe-col .col-hdr{border-bottom-color:var(--pink);}
.col-emoji{font-size:15px;flex-shrink:0;}
.col-nmwrap{flex:1;display:flex;align-items:center;min-width:0;}
.col-nm{font-family:var(--disp);font-size:11px;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;overflow:hidden;flex:1;padding:0 4px;}
.col-nmin{font-family:var(--disp);font-size:11px;letter-spacing:.06em;text-transform:uppercase;background:var(--yellow);border:var(--br);padding:2px 4px;outline:none;flex:1;}
.col-cnt{min-width:26px;height:26px;border:var(--br);background:var(--bk);color:var(--wh);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;font-family:var(--mono);flex-shrink:0;}
.col.maybe-col .col-cnt{background:var(--pink);border-color:var(--pink);}
.col-act{display:flex;gap:4px;opacity:0;transition:opacity .1s;}
.col-hdr:hover .col-act{opacity:1;}
.cib{width:24px;height:24px;border:var(--br);background:var(--wh);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:12px;transition:all .1s;}
.cib:hover{background:var(--bk);color:var(--wh);}
.colbody{flex:1;overflow-y:auto;padding:10px;display:flex;flex-direction:column;gap:8px;}

/* ── ADD TASK ── */
.atbtn{display:flex;align-items:center;gap:7px;padding:8px 10px;border:2px dashed var(--bk);background:transparent;color:var(--bk);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;cursor:pointer;width:100%;font-family:var(--font);transition:all .1s;}
.atbtn:hover{background:var(--bk);color:var(--wh);border-style:solid;}
.col.maybe-col .atbtn{border-color:var(--pink);color:var(--pink);}
.col.maybe-col .atbtn:hover{background:var(--pink);color:var(--wh);border-color:var(--pink);border-style:solid;}
.qadd{border:var(--brT);background:var(--yellow);padding:8px;display:flex;flex-direction:column;gap:6px;box-shadow:var(--sh);}
.qadd input{background:var(--wh);border:var(--br);padding:6px 8px;color:var(--bk);font-size:13px;font-family:var(--font);font-weight:500;outline:none;width:100%;}
.qadd input::placeholder{color:#888;}
.qahints{font-size:10px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;display:flex;gap:8px;}

/* ── TASK CARD ── */
.tcard{border:var(--brT);background:var(--wh);padding:10px 12px;cursor:pointer;position:relative;box-shadow:var(--sh);transition:all .12s;animation:cin .15s ease;}
@keyframes cin{from{opacity:0;transform:translateY(7px);}to{opacity:1;transform:translateY(0);}}
.tcard:hover{transform:translate(-3px,-3px);box-shadow:var(--shH);}
.tcard.foc{outline:3px solid var(--bk);outline-offset:3px;}
.tcard.done-card{opacity:.55;}
@keyframes doneFlash{0%{background:var(--wh);}40%{background:#a8ff78;}100%{background:var(--wh);}}
.tcard.just-done{animation:doneFlash .55s ease;}
.tpbar{position:absolute;top:0;left:0;right:0;height:4px;border-bottom:var(--br);}
.thead{display:flex;align-items:flex-start;gap:8px;margin-top:6px;}
.tchk{width:18px;height:18px;border:var(--brT);background:var(--wh);flex-shrink:0;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .1s;margin-top:1px;}
.tchk.ck{background:var(--bk);}
.tchk svg{display:none;width:10px;height:10px;}
.tchk.ck svg{display:block;}
.ttitle{flex:1;font-size:13px;font-weight:600;line-height:1.4;word-break:break-word;}
.ttitle.done{text-decoration:line-through;opacity:.4;}
.tmeta{display:flex;flex-wrap:wrap;align-items:center;gap:4px;margin-top:8px;}
.ttag{padding:2px 7px;border:var(--br);font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;}
.tdue{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;margin-left:auto;border:var(--br);padding:2px 6px;}
.tdue.ov{background:var(--red);color:var(--wh);}
.tdue.sn{background:var(--yellow);}
.tcmt{font-size:9px;font-weight:700;border:var(--br);padding:2px 6px;}
.tnote{width:8px;height:8px;background:var(--bk);border:1.5px solid var(--bk);}

/* ── MODAL ── */
.moverlay{position:fixed;inset:0;background:rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;z-index:1000;padding:20px;animation:fi .15s ease;}
@keyframes fi{from{opacity:0;}to{opacity:1;}}
.modal{background:var(--wh);border:var(--brT);width:700px;max-width:100%;max-height:88vh;display:flex;flex-direction:column;box-shadow:8px 8px 0 var(--bk);animation:nbs .15s ease;}
@keyframes nbs{from{opacity:0;transform:translate(8px,8px);}to{opacity:1;transform:translate(0,0);}}
.mhdr{display:flex;align-items:center;gap:10px;padding:14px 18px;border-bottom:var(--brT);background:var(--yellow);flex-shrink:0;}
.mtitlein{flex:1;background:none;border:none;font-family:var(--disp);font-size:18px;color:var(--bk);outline:none;text-transform:uppercase;letter-spacing:.03em;}
.mtitlein::placeholder{color:#888;}
.mclose{width:30px;height:30px;border:var(--brT);background:var(--wh);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;box-shadow:var(--shS);transition:all .1s;}
.mclose:hover{background:var(--bk);color:var(--wh);transform:translate(-2px,-2px);box-shadow:var(--sh);}
.mbody{flex:1;overflow-y:auto;display:flex;min-height:0;}
.mmain{flex:1;padding:16px 18px;display:flex;flex-direction:column;gap:16px;border-right:var(--brT);overflow-y:auto;}
.mside{width:208px;padding:14px;display:flex;flex-direction:column;gap:12px;overflow-y:auto;flex-shrink:0;}
.flabel{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;display:block;margin-bottom:6px;font-family:var(--disp);}
.fsel{background:var(--wh);border:var(--brT);padding:6px 10px;color:var(--bk);font-size:13px;font-family:var(--font);font-weight:600;cursor:pointer;outline:none;width:100%;box-shadow:var(--shS);appearance:none;}
.fsel:focus{box-shadow:var(--sh);}
.fin{background:var(--wh);border:var(--brT);padding:7px 10px;color:var(--bk);font-size:13px;font-family:var(--font);font-weight:600;outline:none;width:100%;box-shadow:var(--shS);}
.fin:focus{box-shadow:var(--sh);}

/* ── QUICK CREATE MODAL ── */
.qcmodal{background:var(--wh);border:var(--brT);width:500px;max-width:100%;box-shadow:8px 8px 0 var(--bk);animation:nbs .15s ease;}
.qchdr{display:flex;align-items:center;gap:10px;padding:14px 18px;border-bottom:var(--brT);background:var(--pink);}
.qchdr-title{font-family:var(--disp);font-size:16px;text-transform:uppercase;letter-spacing:.04em;color:var(--wh);flex:1;}
.qchdr-col{padding:3px 10px;border:2px solid rgba(255,255,255,.5);background:rgba(255,255,255,.15);color:var(--wh);font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;font-family:var(--font);}
.qcbody{padding:16px 18px;display:flex;flex-direction:column;gap:12px;}
.qctitlein{background:var(--wh);border:var(--brT);padding:12px 14px;color:var(--bk);font-size:16px;font-family:var(--disp);outline:none;width:100%;box-shadow:var(--sh);text-transform:uppercase;letter-spacing:.02em;}
.qctitlein::placeholder{color:#aaa;}
.qcfooter{display:flex;align-items:center;justify-content:space-between;padding:12px 18px;border-top:var(--brT);background:rgba(255,107,204,.06);}
.qchints{display:flex;flex-direction:column;gap:4px;}
.qchint{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#555;display:flex;align-items:center;gap:6px;}
.qcactions{display:flex;gap:8px;}
.qccolsel{padding:6px 10px;border:var(--brT);background:var(--wh);font-size:11px;font-weight:700;text-transform:uppercase;font-family:var(--font);color:var(--bk);cursor:pointer;outline:none;appearance:none;box-shadow:var(--shS);}

/* ── MARKDOWN ── */
.mdwrap{border:var(--brT);background:var(--wh);box-shadow:var(--sh);}
.mdtabs{display:flex;border-bottom:var(--brT);}
.mdtab{padding:7px 14px;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;border-right:var(--br);background:var(--wh);font-family:var(--disp);transition:background .1s;}
.mdtab:last-child{border-right:none;}
.mdtab.on{background:var(--bk);color:var(--wh);}
.mdta{width:100%;min-height:130px;background:none;border:none;padding:12px;color:var(--bk);font-size:13px;font-family:var(--mono);resize:vertical;outline:none;line-height:1.7;}
.mdprev{padding:12px;min-height:60px;font-size:13px;line-height:1.7;}
.mdprev h1,.mdprev h2,.mdprev h3{font-family:var(--disp);margin:8px 0 4px;}
.mdprev code{background:var(--yellow);padding:1px 5px;border:var(--br);font-family:var(--mono);font-size:11px;}
.mdprev hr{border:none;border-top:var(--brT);margin:8px 0;}
.mdprev ul{padding-left:18px;}
.mdprev li.mddone{opacity:.4;text-decoration:line-through;}
.mdprev strong{font-weight:700;}
.mdprev a{color:var(--bk);font-weight:700;text-decoration:underline;}

/* ── COMMENTS ── */
.cmts{display:flex;flex-direction:column;gap:10px;}
.cmtitem{display:flex;gap:10px;}
.cmtav{width:28px;height:28px;border:var(--brT);background:var(--bk);color:var(--wh);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;font-family:var(--disp);}
.cmtbub{flex:1;border:var(--brT);padding:8px 10px;background:var(--wh);box-shadow:var(--shS);}
.cmtmeta{display:flex;align-items:center;gap:8px;margin-bottom:4px;}
.cmtauth{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;}
.cmttime{font-size:10px;color:#888;font-family:var(--mono);}
.cmtdel{font-size:10px;font-weight:700;text-transform:uppercase;cursor:pointer;margin-left:auto;letter-spacing:.06em;border:var(--br);padding:1px 5px;}
.cmtdel:hover{background:var(--red);color:var(--wh);border-color:var(--red);}
.cmttxt{font-size:13px;line-height:1.5;}
.cmtinwrap{display:flex;gap:8px;align-items:flex-start;}
.cmtin{flex:1;background:var(--wh);border:var(--brT);padding:8px 10px;color:var(--bk);font-size:13px;font-family:var(--font);outline:none;resize:none;min-height:64px;box-shadow:var(--shS);}
.cmtin:focus{box-shadow:var(--sh);}

/* ── PRIORITY ── */
.propts{display:flex;flex-wrap:wrap;gap:5px;}
.propt{padding:4px 9px;border:var(--brT);background:var(--wh);font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;cursor:pointer;font-family:var(--font);transition:all .1s;box-shadow:var(--shS);}
.propt:hover{transform:translate(-1px,-1px);box-shadow:var(--sh);}
.propt.on{box-shadow:none;transform:none;}

/* ── TAG SEL ── */
.tagsel{display:flex;flex-wrap:wrap;gap:5px;}
.tschip{padding:4px 9px;border:var(--brT);background:var(--wh);font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;cursor:pointer;font-family:var(--font);transition:all .1s;box-shadow:var(--shS);}
.tschip:hover{transform:translate(-1px,-1px);box-shadow:var(--sh);}
.tschip.on{box-shadow:none;transform:none;}

/* ── DIVIDER ── */
.div3{height:3px;background:var(--bk);margin:2px 0;}

/* ── CTX ── */
.ctx{position:fixed;background:var(--wh);border:var(--brT);padding:4px;box-shadow:var(--shL);z-index:2000;min-width:165px;animation:fi .1s ease;}
.ctxi{display:flex;align-items:center;gap:8px;padding:8px 10px;cursor:pointer;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;transition:background .08s;border:2px solid transparent;}
.ctxi:hover{background:var(--yellow);border-color:var(--bk);}
.ctxi.dng:hover{background:var(--red);color:var(--wh);}
.ctxsep{height:3px;background:var(--bk);margin:3px 0;}

/* ── TOASTS ── */
.toasts{position:fixed;bottom:20px;right:20px;z-index:3000;display:flex;flex-direction:column;gap:8px;pointer-events:none;}
.toast{border:var(--brT);padding:10px 14px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;box-shadow:var(--sh);max-width:260px;pointer-events:all;display:flex;align-items:center;gap:8px;animation:nbs .2s ease;background:var(--wh);}
.toast.s{background:var(--green);}
.toast.e{background:var(--red);color:var(--wh);}
.toast.i{background:var(--yellow);}
.toast.p{background:var(--pink);color:var(--wh);}

/* ── SHORTCUTS ── */
.scgrid{display:grid;grid-template-columns:1fr 1fr;border:var(--brT);}
.scrow{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;border-bottom:var(--br);border-right:var(--br);}
.scrow:nth-child(even){border-right:none;}
.scdesc{font-size:12px;font-weight:600;}
.sckeys{display:flex;gap:4px;}

/* ── NO BOARD ── */
.noboard{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;gap:16px;position:relative;z-index:1;}
.nbtitle{font-family:var(--disp);font-size:40px;text-transform:uppercase;letter-spacing:.03em;text-align:center;line-height:1.1;}
.nbsub{font-size:13px;font-weight:700;color:#555;text-transform:uppercase;letter-spacing:.1em;}
.nbcta{padding:14px 28px;border:var(--brT);background:var(--yellow);font-family:var(--disp);font-size:16px;cursor:pointer;box-shadow:var(--shL);transition:all .12s;letter-spacing:.04em;}
.nbcta:hover{transform:translate(-4px,-4px);box-shadow:10px 10px 0 var(--bk);}
.nbcta:active{transform:none;box-shadow:var(--shS);}
`;

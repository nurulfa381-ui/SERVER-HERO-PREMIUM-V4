const app=document.getElementById("app"),TXT=SH_TEXT,M=SH_MISSIONS,B=SH_BADGES;
let state=SHStorage.load();
const t=k=>TXT[state.lang||"ms"][k],save=()=>SHStorage.save(state);
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));
const pass=()=>Object.values(state.ktScores||{}).filter(v=>v>=60).length;
const avg=()=>{const v=Object.values(state.ktScores||{});return v.length?Math.round(v.reduce((a,b)=>a+b,0)/v.length):0};
const level=()=>1+Math.floor((state.xp||0)/500);
const rank=()=>level()>=10?t("hero"):level()>=7?t("specialist"):level()>=4?t("technician"):t("trainee");
const progress=()=>Math.round(pass()/10*100);

function renderLanguage(){
app.innerHTML=`<section class="center"><div class="card hero"><div class="logo">🖥️</div><h1>SERVER HERO™</h1><p>V4 PREMIUM</p><h2>${TXT.ms.choose}<br><small>${TXT.en.choose}</small></h2><div class="lang-grid"><button onclick="choose('ms')">🇲🇾<b>${TXT.ms.bm}</b></button><button class="en" onclick="choose('en')">🇬🇧<b>${TXT.en.en}</b></button></div></div></section>`;
}
function choose(l){state.lang=l;save();state.student?renderDashboard():renderLogin()}
function renderLogin(){
const a=["👨‍💻","👩‍💻","🛡️","⚙️","🧠","🚀"];
app.innerHTML=`<section class="center"><div class="card login"><h1>SERVER HERO™</h1><h2>${t("login")}</h2><label>${t("name")}</label><input id="name"><label>${t("id")}</label><input id="id"><h3>${t("avatar")}</h3><div class="avatars">${a.map((x,i)=>`<button class="${i===0?"active":""}" data-a="${x}" onclick="pick(this)">${x}</button>`).join("")}</div><button class="primary wide" onclick="saveLogin()">${t("enter")}</button></div></section>`;
}
function pick(b){document.querySelectorAll(".avatars button").forEach(x=>x.classList.remove("active"));b.classList.add("active")}
function saveLogin(){
const name=document.getElementById("name").value.trim(),id=document.getElementById("id").value.trim();
if(!name||!id){alert(t("required"));return}
state.student={name,id,avatar:document.querySelector(".avatars .active")?.dataset.a||"👨‍💻"};
state.xp=Math.max(state.xp||0,50);
if(!state.badges.includes("first-login"))state.badges.push("first-login");
save();renderDashboard();
}
function renderDashboard(){
const next=M.find(x=>x.id===state.unlocked)||M[M.length-1];
app.innerHTML=`<div class="shell ${state.projector?"projector":""}">
<header><div class="student"><span>${state.student.avatar}</span><div><b>${esc(state.student.name)}</b><small>${esc(state.student.id)}</small></div></div><div class="tools"><button onclick="renderLanguage()">🌍 ${t("language")}</button><button onclick="toggleProjector()">📽️ ${t("projector")}</button><button onclick="toggleFullscreen()">⛶ ${t("fullscreen")}</button><button onclick="changeProfile()">👤 ${t("change")}</button><button class="warn" onclick="resetProgress()">↻ ${t("reset")}</button><button class="danger" onclick="logout()">⏻ ${t("logout")}</button></div></header>
<section class="dash-grid"><article class="card profile"><div class="avatar">${state.student.avatar}</div><h2>${esc(state.student.name)}</h2><p>${esc(state.student.id)}</p><div class="rank">⭐ ${rank()}</div><div class="bar"><i style="width:${progress()}%"></i></div><strong>${progress()}%</strong></article>
<article class="card overview"><h1>${t("dashboard")}</h1><p>${t("welcome")}</p><div class="stats"><article><span>${t("progress")}</span><b>${progress()}%</b></article><article><span>${t("average")}</span><b>${avg()}%</b></article><article><span>${t("level")}</span><b>${level()}</b></article><article><span>${t("xp")}</span><b>${state.xp}</b></article><article><span>🪙 ${t("coins")}</span><b class="coin-stat">${state.coins||0}</b></article></div><div class="next"><div><small>${t("next")}</small><h3>KP${String(next.id).padStart(2,"0")} · ${next[state.lang]}</h3></div><button onclick="openMission(${next.id})">${t("start")} →</button></div>
<div class="v5-actions">
<button onclick="SHV5.toggleAudio()">🔊 Audio</button>
<button onclick="SHV5.certificate(state)">🎓 Sijil</button>
<button onclick="SHV5.teacherReport(state)">👨‍🏫 Mod Guru</button>
<button onclick="SHStorage.exportCSV(state)">📊 Export CSV</button>
<button onclick="SHStorage.exportJSON(state)">💾 Backup JSON</button>
</div>
</article></section>
<section class="card missions"><h2>${t("missionMap")}</h2><div class="mission-list">${M.map((m,i)=>{const open=m.id<=state.unlocked,done=state.completedKP.includes(m.id);return `<article class="${open?"open":"locked"} ${done?"done":""}"><div class="num">${done?"✓":String(m.id).padStart(2,"0")}</div><div class="icon">${m.icon}</div><div><small>KP${String(m.id).padStart(2,"0")}</small><h3>${m[state.lang]}</h3></div><span>${done?t("completed"):open?t("available"):t("locked")}</span><button ${open?"":"disabled"} onclick="openMission(${m.id})">${t("start")}</button></article>${i<M.length-1?'<div class="line"></div>':""}`}).join("")}</div></section>
<section class="bottom"><article class="card badges"><h2>${t("badges")}</h2><div class="badge-grid">${B.map(b=>`<article class="${state.badges.includes(b.id)?"earned":"locked"}"><span>${b.icon}</span><small>${b[state.lang]}</small></article>`).join("")}</div></article><article class="card achievements"><h2>${t("achievements")}</h2><div><span>📘</span><b>${state.completedKP.length}/10 KP</b></div><div><span>✅</span><b>${pass()}/10 KT</b></div><div><span>🏆</span><b>${rank()}</b></div></article></section>
</div>`;
}
function openMission(id){
if(id===1){window.location.href="kp01.html";return}
if(id===2){window.location.href="kp02.html";return}
if(id===3){window.location.href="kp03.html";return}
if(id===4){window.location.href="kp04.html";return}
if(id===5){window.location.href="kp05.html";return}
if(id===6){window.location.href="kp06.html";return}
const m=M.find(x=>x.id===id);
app.innerHTML=`<section class="center"><div class="card hero"><div class="logo">${m.icon}</div><h1>KP${String(id).padStart(2,"0")}</h1><h2>${m[state.lang]}</h2><p>${t("coming")}</p><button class="primary" onclick="renderDashboard()">← Dashboard</button></div></section>`;
}
function toggleProjector(){state.projector=!state.projector;save();renderDashboard()}
function toggleFullscreen(){if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.()}
function changeProfile(){state.student=null;save();renderLogin()}
function logout(){if(confirm(t("confirmLogout"))){state.student=null;save();renderLanguage()}}
function resetProgress(){if(confirm(t("confirmReset"))){const s=state.student,l=state.lang;state=SHStorage.defaults();state.student=s;state.lang=l;state.xp=50;state.badges=["first-login"];save();renderDashboard()}}
state.lang?(state.student?renderDashboard():renderLogin()):renderLanguage();
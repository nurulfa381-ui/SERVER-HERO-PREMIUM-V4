const app=document.getElementById("kpApp");
let state=SHStorage.load();
const lang=state.lang||"ms";
let step=0;
let selectedLeft=null;
const matched=new Set();
let answers={};

const slides=[
{
icon:"🖥️",
title:{ms:"Misi KP01: Analisis Maklumat Server",en:"KP01 Mission: Server Information Analysis"},
lead:{ms:"Kenal pasti maklumat penting sebelum kerja penyelenggaraan server dimulakan.",en:"Identify essential information before server maintenance begins."},
body:()=>`<div class="card-grid three">
${card("🎯",lang==="ms"?"Objektif 1":"Objective 1",lang==="ms"?"Mengenal pasti Tag atau ID server.":"Identify the server Tag or ID.")}
${card("⚙️",lang==="ms"?"Objektif 2":"Objective 2",lang==="ms"?"Mengenal pasti spesifikasi dan sistem operasi.":"Identify specifications and operating systems.")}
${card("📋",lang==="ms"?"Objektif 3":"Objective 3",lang==="ms"?"Menyemak waranti, kontrak dan manual.":"Review warranty, contracts and manuals.")}
</div>`
},
{
icon:"🏢",
title:{ms:"Apakah Itu Server?",en:"What Is a Server?"},
lead:{ms:"Server ialah komputer berkuasa tinggi yang menyediakan perkhidmatan kepada pengguna dan komputer lain.",en:"A server is a high-performance computer that provides services to users and other computers."},
body:()=>`<div class="card-grid two">
${card("🧠",lang==="ms"?"Memori Lebih Besar":"Larger Memory",lang==="ms"?"Server biasanya mempunyai kapasiti RAM yang tinggi.":"Servers usually have high RAM capacity.")}
${card("⚡",lang==="ms"?"Beban Kerja Tinggi":"Heavy Workload",lang==="ms"?"Server mengendalikan fail, aplikasi, e-mel dan perkhidmatan rangkaian.":"Servers handle files, applications, email and network services.")}
</div>`
},
{
icon:"🏷️",
title:{ms:"Tag / ID Server",en:"Server Tag / ID"},
lead:{ms:"Tag server ialah label unik untuk mengenal pasti server dalam rekod dan pangkalan data.",en:"A server tag is a unique label used to identify a server in records and databases."},
body:()=>`<div class="server-tag"><strong>KUL36PX001</strong><div class="tag-grid">
<div><b>KUL</b><small>${lang==="ms"?"Kod lokasi":"Location code"}</small></div>
<div><b>36</b><small>${lang==="ms"?"Nombor rak":"Rack number"}</small></div>
<div><b>PX001</b><small>${lang==="ms"?"Kod peranti unik":"Unique device code"}</small></div>
</div></div>`
},
{
icon:"⚙️",
title:{ms:"Spesifikasi Server",en:"Server Specifications"},
lead:{ms:"Spesifikasi server dipilih berdasarkan jenis kerja, bilangan pengguna dan perkhidmatan yang dijalankan.",en:"Server specifications are selected based on workload, number of users and services provided."},
body:()=>`<div class="card-grid three">
${card("🧩","CPU / Processor",lang==="ms"?"Kelajuan dan bilangan teras pemproses.":"Processor speed and number of cores.")}
${card("🧠","RAM",lang==="ms"?"Memori untuk sistem dan aplikasi.":"Memory for the system and applications.")}
${card("💽","Storage",lang==="ms"?"HDD atau SSD serta tahap RAID.":"HDD or SSD and RAID level.")}
${card("🌐","Network",lang==="ms"?"Kelajuan sambungan rangkaian.":"Network connection speed.")}
${card("🗄️","RAID",lang==="ms"?"Melindungi dan menyusun data pada cakera.":"Protects and organises data across disks.")}
${card("🧱","Mainboard",lang==="ms"?"Menyokong semua perkakasan server.":"Supports all server hardware.")}
</div>`
},
{
icon:"💿",
title:{ms:"Sistem Operasi Server",en:"Server Operating Systems"},
lead:{ms:"Sistem operasi mengurus perkakasan, perisian dan perkhidmatan server.",en:"The operating system manages server hardware, software and services."},
body:()=>`<table class="compare-table"><thead><tr><th>${lang==="ms"?"Berlesen":"Licensed"}</th><th>${lang==="ms"?"Sumber Terbuka":"Open Source"}</th></tr></thead><tbody>
<tr><td>${lang==="ms"?"Memerlukan product key":"Requires a product key"}</td><td>${lang==="ms"?"Biasanya tidak memerlukan product key":"Usually does not require a product key"}</td></tr>
<tr><td>Windows Server</td><td>Linux Server</td></tr>
<tr><td>${lang==="ms"?"Penggunaan tertakluk kepada lesen":"Use is subject to licence terms"}</td><td>${lang==="ms"?"Boleh diubah suai mengikut lesen":"Can be modified according to its licence"}</td></tr>
</tbody></table>`
},
{
icon:"🛡️",
title:{ms:"Waranti, Kontrak dan Manual",en:"Warranty, Contracts and Manuals"},
lead:{ms:"Maklumat ini mesti disemak sebelum server dibuka, dibaiki atau komponennya diganti.",en:"This information must be checked before the server is opened, repaired or its components replaced."},
body:()=>`<div class="card-grid two">
${card("🛡️",lang==="ms"?"Waranti":"Warranty",lang==="ms"?"Jaminan tertakluk kepada syarat pengilang.":"Guarantee subject to manufacturer terms.")}
${card("📝",lang==="ms"?"Kontrak Penyelenggaraan":"Maintenance Contract",lang==="ms"?"Menetapkan skop, tempoh dan kos penyelenggaraan.":"Defines maintenance scope, duration and cost.")}
${card("📖",lang==="ms"?"Manual Operasi":"Operating Manual",lang==="ms"?"Panduan penggunaan, servis dan diagnostik server.":"Guide for server operation, servicing and diagnostics.")}
${card("🔌",lang==="ms"?"Periferal Server":"Server Peripherals",lang==="ms"?"Peranti tambahan yang disambungkan kepada server.":"Additional devices connected to a server.")}
</div>`
},
{
icon:"🎮",
title:{ms:"Aktiviti Padanan",en:"Matching Activity"},
lead:{ms:"Pilih satu item di kiri dan padankan dengan penerangan yang betul di kanan.",en:"Choose an item on the left and match it with the correct description on the right."},
activity:true
},
{
icon:"🧠",
title:{ms:"Semakan Cepat KP01",en:"KP01 Quick Review"},
lead:{ms:"Jawab semua soalan untuk menamatkan KP01.",en:"Answer all questions to complete KP01."},
quiz:true
}
];

const pairs=[
{l:{ms:"Tag / ID Server",en:"Server Tag / ID"},r:{ms:"Label unik untuk mengenal pasti server",en:"Unique label used to identify a server"}},
{l:{ms:"Spesifikasi Server",en:"Server Specifications"},r:{ms:"CPU, RAM, storan, rangkaian dan RAID",en:"CPU, RAM, storage, network and RAID"}},
{l:{ms:"Waranti",en:"Warranty"},r:{ms:"Jaminan tertakluk kepada terma pengilang",en:"Guarantee subject to manufacturer terms"}},
{l:{ms:"Manual Operasi",en:"Operating Manual"},r:{ms:"Panduan penggunaan dan servis server",en:"Guide for server operation and servicing"}}
];

const quiz=[
{q:{ms:"Apakah tujuan utama Tag / ID server?",en:"What is the main purpose of a server Tag / ID?"},o:{ms:["Mengenal pasti server","Menambah kelajuan CPU","Menghapus data"],en:["Identify the server","Increase CPU speed","Delete data"]},a:0},
{q:{ms:"Yang manakah termasuk dalam spesifikasi server?",en:"Which is included in server specifications?"},o:{ms:["RAM dan storan","Nama pelajar","Warna meja"],en:["RAM and storage","Student name","Desk colour"]},a:0},
{q:{ms:"Apakah fungsi sistem operasi?",en:"What is the function of an operating system?"},o:{ms:["Mengurus perkakasan dan perisian","Mengikat kabel","Mengukur suhu bilik"],en:["Manage hardware and software","Tie cables","Measure room temperature"]},a:0},
{q:{ms:"Apakah yang perlu disemak sebelum membaiki server?",en:"What should be checked before repairing a server?"},o:{ms:["Waranti dan kontrak","Warna kabinet sahaja","Nama pengguna sahaja"],en:["Warranty and contract","Only cabinet colour","Only username"]},a:0},
{q:{ms:"Periferal server ialah?",en:"A server peripheral is?"},o:{ms:["Peranti tambahan yang disambungkan kepada server","Sebahagian wajib CPU","Kod lokasi server"],en:["An additional device connected to a server","A mandatory part of the CPU","A server location code"]},a:0}
];

function card(icon,title,text){return `<article class="info-card"><span>${icon}</span><h3>${title}</h3><p>${text}</p></article>`}

function render(){
const s=slides[step];
app.innerHTML=`<div class="kp-shell">
<header class="kp-header">
<button onclick="goDashboard()">← Dashboard</button>
<div class="kp-progress"><i style="width:${((step+1)/slides.length)*100}%"></i></div>
<span>${step+1}/${slides.length}</span>
</header>
<section class="card kp-stage">
<span class="kp-chip">KP01</span>
<div class="kp-hero-icon">${s.icon}</div>
<h1>${s.title[lang]}</h1>
<p class="kp-lead">${s.lead[lang]}</p>
${step===0?`<div class="story-alert"><strong>${lang==="ms"?"🚨 Mission Briefing":"🚨 Mission Briefing"}</strong>${lang==="ms"?"Pusat data mengesan rekod server yang tidak lengkap. Anda perlu mengenal pasti server dengan betul sebelum penyelenggaraan boleh dimulakan.":"The data centre has detected incomplete server records. You must identify the server correctly before maintenance can begin."}</div>`:""}
${s.activity?renderActivity():s.quiz?renderQuiz():s.body()}
<div id="feedback" class="feedback"></div>
<div class="kp-nav">
<button class="secondary" onclick="previous()" ${step===0?"disabled":""}>← ${lang==="ms"?"Sebelumnya":"Previous"}</button>
<button onclick="next()">${step===slides.length-1?(lang==="ms"?"SELESAIKAN KP":"COMPLETE KP"):(lang==="ms"?"Seterusnya":"Next")} →</button>
</div>
</section></div>`;
}

function renderActivity(){
const shuffled=[...pairs.map((p,i)=>({i,text:p.r[lang]}))].sort(()=>Math.random()-.5);
return `<div class="activity-board">
<div class="activity-col">${pairs.map((p,i)=>`<button class="match-btn ${matched.has(i)?"matched":""}" data-left="${i}" onclick="pickLeft(${i},this)">${p.l[lang]}</button>`).join("")}</div>
<div class="activity-col">${shuffled.map(x=>`<button class="match-btn ${matched.has(x.i)?"matched":""}" data-right="${x.i}" onclick="pickRight(${x.i},this)">${x.text}</button>`).join("")}</div>
</div>`;
}

function pickLeft(i,btn){
if(matched.has(i))return;
selectedLeft=i;
document.querySelectorAll("[data-left]").forEach(x=>x.classList.remove("selected"));
btn.classList.add("selected");
}

function pickRight(i,btn){
if(selectedLeft===null)return;
if(i===selectedLeft){
matched.add(i);
document.querySelector(`[data-left="${i}"]`)?.classList.add("matched");
btn.classList.add("matched");
selectedLeft=null;
feedback(lang==="ms"?"Padanan betul!":"Correct match!","good");
}else{
feedback(lang==="ms"?"Belum tepat. Cuba lagi.":"Not correct yet. Try again.","bad");
}
}

function renderQuiz(){
return `<div class="quiz-list">${quiz.map((q,qi)=>`<article class="quiz-card"><h3>${qi+1}. ${q.q[lang]}</h3>${q.o[lang].map((o,oi)=>`<button class="quiz-option ${answers[qi]===oi?"selected":""}" onclick="answer(${qi},${oi},this)">${String.fromCharCode(65+oi)}. ${o}</button>`).join("")}</article>`).join("")}</div>`;
}

function answer(q,o,btn){
answers[q]=o;
document.querySelectorAll(`.quiz-card:nth-child(${q+1}) .quiz-option`).forEach(x=>x.classList.remove("selected"));
btn.classList.add("selected");
}

function feedback(text,type){
const el=document.getElementById("feedback");
if(el){el.textContent=text;el.className="feedback "+type}
}

function previous(){if(step>0){step--;render()}}

function next(){
if(slides[step].activity&&matched.size<pairs.length){
feedback(lang==="ms"?"Lengkapkan semua padanan dahulu.":"Complete all matches first.","bad");
return;
}
if(slides[step].quiz){
if(Object.keys(answers).length<quiz.length){
feedback(lang==="ms"?"Jawab semua soalan dahulu.":"Answer all questions first.","bad");
return;
}
complete();
return;
}
if(step<slides.length-1){step++;render()}
}

function complete(){
let correct=0;
quiz.forEach((q,i)=>{if(answers[i]===q.a)correct++});
const score=Math.round(correct/quiz.length*100);
state.completedKP=state.completedKP||[];
const firstCompletion=!state.completedKP.includes(1);
if(firstCompletion)state.completedKP.push(1);
state.unlocked=Math.max(state.unlocked||1,2);
if(firstCompletion){
state.xp=(state.xp||0)+100+(correct*15);
state.coins=(state.coins||0)+50;
}
state.badges=state.badges||[];
if(!state.badges.includes("first-kp"))state.badges.push("first-kp");
SHStorage.save(state);

app.innerHTML=`<section class="center"><div class="card hero">
<div class="complete-icon">🎉</div>
<h1>${lang==="ms"?"Tahniah!":"Congratulations!"}</h1>
<div class="score-ring" style="--score:${score*3.6}deg"><b>${score}%</b></div>
<p>${lang==="ms"?"KP01 selesai dan KP02 telah dibuka.":"KP01 is complete and KP02 has been unlocked."}</p>
<p><strong>+${100+(correct*20)} XP</strong></p>
<button class="primary" onclick="goDashboard()">Dashboard</button>
</div></section>`;
}

function goDashboard(){window.location.href="index.html"}

render();

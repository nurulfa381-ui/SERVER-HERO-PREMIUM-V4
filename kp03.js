const app=document.getElementById("kpApp");
let state=SHStorage.load();
const lang=state.lang||"ms";
let step=0;
let selectedLeft=null;
const matched=new Set();
let answers={};

const slides=[
{
icon:"🔐",
title:{ms:"Misi KP03: Keselamatan Bilik Server",en:"KP03 Mission: Server Room Safety"},
lead:{ms:"Pelajari kawalan keselamatan fizikal, persekitaran dan prosedur kecemasan dalam bilik server.",en:"Learn physical security, environmental control and emergency procedures for a server room."},
body:()=>`<div class="story-alert"><strong>🚨 Mission Briefing</strong>${lang==="ms"?"Sistem amaran bilik server mengesan akses tidak sah dan suhu meningkat. Anda perlu mengamankan kawasan sebelum peralatan terjejas.":"The server room alarm has detected unauthorised access and rising temperature. You must secure the area before equipment is affected."}</div>
<div class="card-grid three">
${card("🚪",lang==="ms"?"Objektif 1":"Objective 1",lang==="ms"?"Mengenal pasti kawalan akses fizikal.":"Identify physical access controls.")}
${card("🌡️",lang==="ms"?"Objektif 2":"Objective 2",lang==="ms"?"Memahami kawalan suhu, kelembapan dan kebakaran.":"Understand temperature, humidity and fire controls.")}
${card("🆘",lang==="ms"?"Objektif 3":"Objective 3",lang==="ms"?"Melaksanakan prosedur kecemasan dan dokumentasi.":"Carry out emergency procedures and documentation.")}
</div>`
},
{
icon:"🚪",
title:{ms:"Kawalan Akses Fizikal",en:"Physical Access Control"},
lead:{ms:"Hanya individu yang diberi kuasa boleh memasuki bilik server.",en:"Only authorised individuals should enter the server room."},
body:()=>`<div class="card-grid two">
${card("🪪",lang==="ms"?"Kad Akses":"Access Card",lang==="ms"?"Merekod identiti, masa masuk dan masa keluar.":"Records identity, entry time and exit time.")}
${card("👆",lang==="ms"?"Biometrik":"Biometrics",lang==="ms"?"Menggunakan cap jari atau pengesahan wajah.":"Uses fingerprints or facial authentication.")}
${card("📹",lang==="ms"?"CCTV":"CCTV",lang==="ms"?"Memantau aktiviti dan menyediakan bukti kejadian.":"Monitors activity and provides incident evidence.")}
${card("📋",lang==="ms"?"Log Pelawat":"Visitor Log",lang==="ms"?"Pelawat mesti direkodkan dan ditemani.":"Visitors must be logged and escorted.")}
</div>`
},
{
icon:"🌡️",
title:{ms:"Kawalan Persekitaran",en:"Environmental Control"},
lead:{ms:"Suhu, kelembapan dan aliran udara yang sesuai melindungi server daripada kegagalan.",en:"Proper temperature, humidity and airflow protect servers from failure."},
body:()=>`<div class="zone-grid">
${zone("🌡️",lang==="ms"?"Suhu":"Temperature",lang==="ms"?"Pantau suhu secara berterusan dan elakkan haba berlebihan.":"Monitor temperature continuously and prevent excessive heat.")}
${zone("💧",lang==="ms"?"Kelembapan":"Humidity",lang==="ms"?"Elakkan kelembapan terlalu tinggi atau terlalu rendah.":"Avoid humidity that is too high or too low.")}
${zone("🌬️",lang==="ms"?"Aliran Udara":"Airflow",lang==="ms"?"Pastikan laluan udara tidak dihalang dan rak tersusun.":"Keep airflow paths clear and racks organised.")}
</div>`
},
{
icon:"🔥",
title:{ms:"Keselamatan Kebakaran",en:"Fire Safety"},
lead:{ms:"Bilik server memerlukan sistem pengesanan dan pemadaman yang sesuai untuk peralatan elektronik.",en:"A server room requires detection and suppression systems suitable for electronic equipment."},
body:()=>`<div class="process-list">
${process(1,lang==="ms"?"Pengesan asap dan haba":"Smoke and heat detection",lang==="ms"?"Mengesan kebakaran pada peringkat awal.":"Detects fire at an early stage.")}
${process(2,lang==="ms"?"Sistem amaran":"Alarm system",lang==="ms"?"Memberi amaran kepada penghuni dan pasukan kecemasan.":"Alerts occupants and the emergency team.")}
${process(3,lang==="ms"?"Pemadam sesuai":"Suitable extinguisher",lang==="ms"?"Gunakan pemadam yang sesuai untuk peralatan elektrik.":"Use extinguishers suitable for electrical equipment.")}
${process(4,lang==="ms"?"Laluan kecemasan":"Emergency route",lang==="ms"?"Pastikan pintu keluar dan laluan tidak dihalang.":"Keep exits and routes unobstructed.")}
</div>`
},
{
icon:"⚡",
title:{ms:"Kuasa dan UPS",en:"Power and UPS"},
lead:{ms:"Bekalan kuasa yang stabil membantu mengelakkan kerosakan data dan gangguan operasi.",en:"Stable power helps prevent data corruption and operational disruption."},
body:()=>`<div class="card-grid two">
${card("🔋","UPS",lang==="ms"?"Memberi kuasa sementara dan masa untuk shutdown terkawal.":"Provides temporary power and time for a controlled shutdown.")}
${card("⚡",lang==="ms"?"Perlindungan Lonjakan":"Surge Protection",lang==="ms"?"Melindungi peralatan daripada lonjakan voltan.":"Protects equipment from voltage surges.")}
${card("🔌",lang==="ms"?"PDU":"PDU",lang==="ms"?"Mengagihkan kuasa dengan teratur kepada peralatan rak.":"Distributes power safely to rack equipment.")}
${card("🧪",lang==="ms"?"Ujian Berkala":"Regular Testing",lang==="ms"?"Uji bateri UPS dan fungsi shutdown secara berkala.":"Test UPS batteries and shutdown functions regularly.")}
</div>`
},
{
icon:"🧹",
title:{ms:"Susun Atur dan Housekeeping",en:"Layout and Housekeeping"},
lead:{ms:"Bilik server yang kemas mengurangkan risiko kemalangan dan memudahkan penyelenggaraan.",en:"A tidy server room reduces accidents and makes maintenance easier."},
body:()=>`<div class="card-grid three">
${card("🧵",lang==="ms"?"Pengurusan Kabel":"Cable Management",lang==="ms"?"Label, ikat dan asingkan kabel kuasa serta data.":"Label, secure and separate power and data cables.")}
${card("🚫",lang==="ms"?"Tiada Makanan/Minuman":"No Food or Drinks",lang==="ms"?"Elakkan tumpahan dan pencemaran.":"Prevent spills and contamination.")}
${card("📦",lang==="ms"?"Laluan Bersih":"Clear Walkways",lang==="ms"?"Jangan letakkan kotak atau barang di laluan.":"Do not place boxes or objects in walkways.")}
</div>
<div class="warning-box"><strong>${lang==="ms"?"Amaran":"Warning"}:</strong> ${lang==="ms"?"Jangan gunakan bilik server sebagai stor umum.":"Do not use the server room as general storage."}</div>`
},
{
icon:"🆘",
title:{ms:"Prosedur Kecemasan",en:"Emergency Procedures"},
lead:{ms:"Tindakan mesti cepat, selamat dan mengikut arahan organisasi.",en:"Actions must be fast, safe and follow organisational procedures."},
body:()=>`<div class="process-list">
${process(1,lang==="ms"?"Kenal pasti bahaya":"Identify the hazard",lang==="ms"?"Tentukan sama ada kejadian melibatkan kebakaran, air, kuasa atau akses.":"Determine whether the incident involves fire, water, power or access.")}
${process(2,lang==="ms"?"Aktifkan amaran":"Raise the alarm",lang==="ms"?"Maklumkan pasukan berkaitan dan ikut pelan kecemasan.":"Notify the relevant team and follow the emergency plan.")}
${process(3,lang==="ms"?"Lindungi nyawa":"Protect life",lang==="ms"?"Utamakan keselamatan manusia sebelum peralatan.":"Prioritise human safety before equipment.")}
${process(4,lang==="ms"?"Rekod kejadian":"Record the incident",lang==="ms"?"Catat masa, punca, tindakan dan kesan kejadian.":"Record time, cause, actions and impact.")}
</div>`
},
{
icon:"🎮",
title:{ms:"Aktiviti Padanan",en:"Matching Activity"},
lead:{ms:"Padankan kawalan keselamatan dengan fungsi yang betul.",en:"Match each security control with its correct function."},
activity:true
},
{
icon:"🧠",
title:{ms:"Kuiz KP03",en:"KP03 Quiz"},
lead:{ms:"Jawab semua 10 soalan untuk menamatkan KP03.",en:"Answer all 10 questions to complete KP03."},
quiz:true
}
];

const pairs=[
{l:{ms:"Kad Akses",en:"Access Card"},r:{ms:"Merekod siapa masuk dan keluar",en:"Records who enters and exits"}},
{l:{ms:"UPS",en:"UPS"},r:{ms:"Memberi kuasa sementara",en:"Provides temporary power"}},
{l:{ms:"CCTV",en:"CCTV"},r:{ms:"Memantau aktiviti bilik server",en:"Monitors server room activity"}},
{l:{ms:"Pengesan Asap",en:"Smoke Detector"},r:{ms:"Mengesan kebakaran pada peringkat awal",en:"Detects fire at an early stage"}}
];

const quiz=[
{q:{ms:"Siapakah yang dibenarkan masuk ke bilik server?",en:"Who is allowed to enter the server room?"},o:{ms:["Individu yang diberi kuasa","Semua pelawat","Sesiapa sahaja"],en:["Authorised individuals","All visitors","Anyone"]},a:0},
{q:{ms:"Apakah fungsi CCTV?",en:"What is the function of CCTV?"},o:{ms:["Memantau aktiviti","Menyejukkan server","Menyimpan backup"],en:["Monitor activity","Cool the server","Store backups"]},a:0},
{q:{ms:"Mengapa suhu perlu dipantau?",en:"Why must temperature be monitored?"},o:{ms:["Mencegah haba berlebihan","Menukar warna rak","Meningkatkan bunyi kipas"],en:["Prevent excessive heat","Change rack colour","Increase fan noise"]},a:0},
{q:{ms:"Apakah fungsi UPS?",en:"What is the function of a UPS?"},o:{ms:["Memberi kuasa sementara","Mengawal pintu","Mengukur kelembapan"],en:["Provide temporary power","Control doors","Measure humidity"]},a:0},
{q:{ms:"Apakah yang perlu dilakukan terhadap kabel?",en:"What should be done with cables?"},o:{ms:["Label dan susun dengan kemas","Biarkan berselerak","Letak di laluan"],en:["Label and organise them","Leave them tangled","Place them in walkways"]},a:0},
{q:{ms:"Apakah yang tidak dibenarkan dalam bilik server?",en:"What is not allowed in the server room?"},o:{ms:["Makanan dan minuman","Rak server","CCTV"],en:["Food and drinks","Server racks","CCTV"]},a:0},
{q:{ms:"Apakah keutamaan semasa kecemasan?",en:"What is the priority during an emergency?"},o:{ms:["Keselamatan manusia","Peralatan dahulu","Dokumen sahaja"],en:["Human safety","Equipment first","Documents only"]},a:0},
{q:{ms:"Apakah fungsi sistem amaran?",en:"What is the function of an alarm system?"},o:{ms:["Memberi amaran kejadian","Menghapus log","Menukar kata laluan"],en:["Warn about an incident","Delete logs","Change passwords"]},a:0},
{q:{ms:"Mengapa log pelawat diperlukan?",en:"Why is a visitor log required?"},o:{ms:["Merekod akses pelawat","Mengukur suhu","Menguji RAID"],en:["Record visitor access","Measure temperature","Test RAID"]},a:0},
{q:{ms:"Selepas kejadian, apakah tindakan penting?",en:"After an incident, what is important?"},o:{ms:["Rekodkan kejadian","Abaikan punca","Padam semua bukti"],en:["Document the incident","Ignore the cause","Delete all evidence"]},a:0}
];

function card(icon,title,text){return `<article class="info-card"><span>${icon}</span><h3>${title}</h3><p>${text}</p></article>`}
function process(n,title,text){return `<article class="process-item"><b>${n}</b><div><h3>${title}</h3><p>${text}</p></div></article>`}
function zone(icon,title,text){return `<article class="zone-card"><span>${icon}</span><h3>${title}</h3><p>${text}</p></article>`}

function render(){
const s=slides[step];
app.innerHTML=`<div class="kp-shell">
<header class="kp-header"><button onclick="goDashboard()">← Dashboard</button><div class="kp-progress"><i style="width:${((step+1)/slides.length)*100}%"></i></div><span>${step+1}/${slides.length}</span></header>
<section class="card kp-stage">
<span class="kp-chip">KP03</span>
<div class="kp-hero-icon">${s.icon}</div>
<h1>${s.title[lang]}</h1>
<p class="kp-lead">${s.lead[lang]}</p>
${s.activity?renderActivity():s.quiz?renderQuiz():s.body()}
<div id="feedback" class="feedback"></div>
<div class="kp-nav"><button class="secondary" onclick="previous()" ${step===0?"disabled":""}>← ${lang==="ms"?"Sebelumnya":"Previous"}</button><button onclick="next()">${step===slides.length-1?(lang==="ms"?"SELESAIKAN KP":"COMPLETE KP"):(lang==="ms"?"Seterusnya":"Next")} →</button></div>
</section></div>`;
}

function renderActivity(){
const shuffled=[...pairs.map((p,i)=>({i,text:p.r[lang]}))].sort(()=>Math.random()-.5);
return `<div class="activity-board"><div class="activity-col">${pairs.map((p,i)=>`<button class="match-btn ${matched.has(i)?"matched":""}" data-left="${i}" onclick="pickLeft(${i},this)">${p.l[lang]}</button>`).join("")}</div><div class="activity-col">${shuffled.map(x=>`<button class="match-btn ${matched.has(x.i)?"matched":""}" data-right="${x.i}" onclick="pickRight(${x.i},this)">${x.text}</button>`).join("")}</div></div>`;
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
}else feedback(lang==="ms"?"Belum tepat. Cuba lagi.":"Not correct yet. Try again.","bad");
}

function renderQuiz(){
return `<div class="quiz-list">${quiz.map((q,qi)=>`<article class="quiz-card"><h3>${qi+1}. ${q.q[lang]}</h3>${q.o[lang].map((o,oi)=>`<button class="quiz-option ${answers[qi]===oi?"selected":""}" onclick="answer(${qi},${oi},this)">${String.fromCharCode(65+oi)}. ${o}</button>`).join("")}</article>`).join("")}</div>`;
}
function answer(q,o,btn){
answers[q]=o;
document.querySelectorAll(`.quiz-card:nth-child(${q+1}) .quiz-option`).forEach(x=>x.classList.remove("selected"));
btn.classList.add("selected");
}
function feedback(text,type){const el=document.getElementById("feedback");if(el){el.textContent=text;el.className="feedback "+type}}
function previous(){if(step>0){step--;render()}}
function next(){
if(slides[step].activity&&matched.size<pairs.length){feedback(lang==="ms"?"Lengkapkan semua padanan dahulu.":"Complete all matches first.","bad");return}
if(slides[step].quiz){
if(Object.keys(answers).length<quiz.length){feedback(lang==="ms"?"Jawab semua soalan dahulu.":"Answer all questions first.","bad");return}
complete();
return;
}
if(step<slides.length-1){step++;render()}
}
function complete(){
let correct=0;quiz.forEach((q,i)=>{if(answers[i]===q.a)correct++});
const score=Math.round(correct/quiz.length*100);
state.completedKP=state.completedKP||[];
if(!state.completedKP.includes(3))state.completedKP.push(3);
state.unlocked=Math.max(state.unlocked||3,4);
state.xp=(state.xp||0)+150+(correct*15);
state.badges=state.badges||[];
if(state.completedKP.length>=5&&!state.badges.includes("five-kp"))state.badges.push("five-kp");
SHStorage.save(state);

app.innerHTML=`<section class="center"><div class="card hero"><div class="complete-icon">🎉</div><h1>${lang==="ms"?"Tahniah!":"Congratulations!"}</h1><div class="score-ring" style="--score:${score*3.6}deg"><b>${score}%</b></div><p>${lang==="ms"?"KP03 selesai dan KP04 telah dibuka.":"KP03 is complete and KP04 has been unlocked."}</p><p><strong>+${150+(correct*15)} XP</strong></p><button class="primary" onclick="goDashboard()">Dashboard</button></div></section>`;
}
function goDashboard(){window.location.href="index.html"}
render();

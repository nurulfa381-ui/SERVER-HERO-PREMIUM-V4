const app=document.getElementById("kpApp");
let state=SHStorage.load();
const lang=state.lang||"ms";
let step=0;
let selectedLeft=null;
const matched=new Set();
let answers={};

const slides=[
{
icon:"🧰",
title:{ms:"Misi KP02: Penyelenggaraan Server",en:"KP02 Mission: Server Maintenance"},
lead:{ms:"Pelajari jenis, tujuan dan prosedur penyelenggaraan server yang sistematik.",en:"Learn the types, purposes and procedures of systematic server maintenance."},
body:()=>`<div class="card-grid three">
${card("🛡️",lang==="ms"?"Objektif 1":"Objective 1",lang==="ms"?"Memahami kepentingan penyelenggaraan server.":"Understand the importance of server maintenance.")}
${card("🧹",lang==="ms"?"Objektif 2":"Objective 2",lang==="ms"?"Mengenal pasti penyelenggaraan pencegahan dan pembetulan.":"Identify preventive and corrective maintenance.")}
${card("📋",lang==="ms"?"Objektif 3":"Objective 3",lang==="ms"?"Melaksanakan prosedur dengan selamat dan direkodkan.":"Perform procedures safely and document them.")}
</div>`
},
{
icon:"🔧",
title:{ms:"Apakah Itu Penyelenggaraan Server?",en:"What Is Server Maintenance?"},
lead:{ms:"Penyelenggaraan server ialah proses memastikan server sentiasa stabil, selamat dan beroperasi dengan optimum.",en:"Server maintenance is the process of keeping a server stable, secure and operating optimally."},
body:()=>`<div class="card-grid two">
${card("⚙️",lang==="ms"?"Prestasi":"Performance",lang==="ms"?"Memastikan sistem berjalan lancar dan mengurangkan gangguan operasi.":"Keeps the system running smoothly and reduces downtime.")}
${card("🔐",lang==="ms"?"Keselamatan":"Security",lang==="ms"?"Mengurangkan risiko serangan, kehilangan data dan akses tanpa kebenaran.":"Reduces the risk of attacks, data loss and unauthorised access.")}
${card("💰",lang==="ms"?"Kos":"Cost",lang==="ms"?"Mencegah kerosakan besar yang boleh meningkatkan kos pembaikan.":"Prevents major failures that can increase repair costs.")}
${card("📈",lang==="ms"?"Jangka Hayat":"Service Life",lang==="ms"?"Membantu memanjangkan tempoh penggunaan perkakasan server.":"Helps extend the usable life of server hardware.")}
</div>`
},
{
icon:"🛡️",
title:{ms:"Jenis Penyelenggaraan",en:"Types of Maintenance"},
lead:{ms:"Setiap jenis penyelenggaraan mempunyai tujuan dan masa pelaksanaan yang berbeza.",en:"Each type of maintenance has a different purpose and timing."},
body:()=>`<div class="card-grid three">
${card("🧹",lang==="ms"?"Pencegahan":"Preventive",lang==="ms"?"Dilakukan sebelum kerosakan berlaku, seperti pembersihan, kemas kini dan pemeriksaan berkala.":"Performed before failure, such as cleaning, updates and scheduled inspections.")}
${card("🧯",lang==="ms"?"Pembetulan":"Corrective",lang==="ms"?"Dilakukan selepas kerosakan dikenal pasti untuk memulihkan operasi server.":"Performed after a fault is identified to restore server operation.")}
${card("📡",lang==="ms"?"Ramalan":"Predictive",lang==="ms"?"Menggunakan pemantauan dan data keadaan untuk meramal kemungkinan kerosakan.":"Uses monitoring and condition data to predict possible failures.")}
</div>`
},
{
icon:"🧹",
title:{ms:"Penyelenggaraan Pencegahan",en:"Preventive Maintenance"},
lead:{ms:"Aktiviti pencegahan perlu dijalankan secara berkala mengikut jadual.",en:"Preventive activities should be carried out regularly according to a schedule."},
body:()=>`<div class="process-list">
${process(1,lang==="ms"?"Semak log dan amaran sistem":"Check system logs and alerts",lang==="ms"?"Kenal pasti tanda awal sebelum masalah menjadi serius.":"Identify early signs before issues become serious.")}
${process(2,lang==="ms"?"Kemas kini sistem":"Update the system",lang==="ms"?"Pasang kemas kini keselamatan, antivirus dan aplikasi.":"Install security, antivirus and application updates.")}
${process(3,lang==="ms"?"Bersihkan perkakasan":"Clean the hardware",lang==="ms"?"Buang habuk pada ventilasi, kipas dan permukaan server.":"Remove dust from vents, fans and server surfaces.")}
${process(4,lang==="ms"?"Uji backup":"Test backups",lang==="ms"?"Pastikan data boleh dipulihkan apabila diperlukan.":"Ensure data can be restored when required.")}
</div>`
},
{
icon:"🧯",
title:{ms:"Penyelenggaraan Pembetulan",en:"Corrective Maintenance"},
lead:{ms:"Penyelenggaraan pembetulan dilakukan apabila server mengalami kegagalan atau prestasi tidak normal.",en:"Corrective maintenance is performed when the server fails or behaves abnormally."},
body:()=>`<div class="process-list">
${process(1,lang==="ms"?"Kenal pasti simptom":"Identify symptoms",lang==="ms"?"Catat mesej ralat, LED, bunyi dan perubahan prestasi.":"Record error messages, LEDs, sounds and performance changes.")}
${process(2,lang==="ms"?"Diagnosis punca":"Diagnose the cause",lang==="ms"?"Gunakan log, alat diagnostik dan ujian perkakasan.":"Use logs, diagnostic tools and hardware tests.")}
${process(3,lang==="ms"?"Laksanakan pembaikan":"Perform repair",lang==="ms"?"Baiki konfigurasi atau ganti komponen yang rosak.":"Correct the configuration or replace faulty components.")}
${process(4,lang==="ms"?"Uji dan dokumentasi":"Test and document",lang==="ms"?"Pastikan server kembali stabil dan rekodkan semua tindakan.":"Confirm the server is stable and record every action.")}
</div>`
},
{
icon:"⚠️",
title:{ms:"Keselamatan Semasa Penyelenggaraan",en:"Safety During Maintenance"},
lead:{ms:"Keselamatan pengguna, data dan peralatan mesti diberi keutamaan.",en:"User, data and equipment safety must be prioritised."},
body:()=>`<div class="card-grid two">
${card("🔌",lang==="ms"?"Kuasa":"Power",lang==="ms"?"Matikan kuasa mengikut prosedur sebelum membuka perkakasan.":"Shut down power according to procedure before opening hardware.")}
${card("🧤",lang==="ms"?"ESD":"ESD",lang==="ms"?"Gunakan peralatan antistatik untuk melindungi komponen.":"Use antistatic equipment to protect components.")}
${card("💾",lang==="ms"?"Backup":"Backup",lang==="ms"?"Pastikan backup tersedia sebelum perubahan penting dibuat.":"Ensure a backup is available before major changes.")}
${card("📝",lang==="ms"?"Rekod":"Records",lang==="ms"?"Catat tarikh, masalah, tindakan dan keputusan ujian.":"Record date, issue, action and test results.")}
</div>
<div class="warning-box"><strong>${lang==="ms"?"Peringatan":"Reminder"}:</strong> ${lang==="ms"?"Jangan melakukan perubahan tanpa kebenaran, backup dan prosedur yang jelas.":"Do not make changes without authorisation, backup and a clear procedure."}</div>`
},
{
icon:"🎮",
title:{ms:"Aktiviti Padanan",en:"Matching Activity"},
lead:{ms:"Padankan jenis penyelenggaraan dengan penerangan yang tepat.",en:"Match each maintenance type with the correct description."},
activity:true
},
{
icon:"🧠",
title:{ms:"Semakan Cepat KP02",en:"KP02 Quick Review"},
lead:{ms:"Jawab semua soalan untuk menamatkan KP02.",en:"Answer all questions to complete KP02."},
quiz:true
}
];

const pairs=[
{l:{ms:"Pencegahan",en:"Preventive"},r:{ms:"Dilakukan sebelum kerosakan berlaku",en:"Performed before failure occurs"}},
{l:{ms:"Pembetulan",en:"Corrective"},r:{ms:"Dilakukan selepas masalah dikenal pasti",en:"Performed after a fault is identified"}},
{l:{ms:"Ramalan",en:"Predictive"},r:{ms:"Menggunakan pemantauan untuk meramal kerosakan",en:"Uses monitoring to predict failures"}},
{l:{ms:"Dokumentasi",en:"Documentation"},r:{ms:"Merekod masalah, tindakan dan keputusan",en:"Records issues, actions and results"}}
];

const quiz=[
{q:{ms:"Apakah tujuan utama penyelenggaraan server?",en:"What is the main purpose of server maintenance?"},o:{ms:["Memastikan server stabil dan selamat","Menukar warna rak","Menghapus semua rekod"],en:["Keep the server stable and secure","Change the rack colour","Delete all records"]},a:0},
{q:{ms:"Penyelenggaraan sebelum kerosakan berlaku dipanggil?",en:"Maintenance before failure occurs is called?"},o:{ms:["Pencegahan","Pembetulan","Kecemasan sahaja"],en:["Preventive","Corrective","Emergency only"]},a:0},
{q:{ms:"Apakah contoh aktiviti pencegahan?",en:"Which is an example of preventive maintenance?"},o:{ms:["Kemas kini antivirus","Abaikan log","Tunggu server gagal"],en:["Update antivirus","Ignore logs","Wait for server failure"]},a:0},
{q:{ms:"Apakah yang perlu dibuat sebelum perubahan penting?",en:"What should be done before major changes?"},o:{ms:["Sediakan backup","Padam semua data","Tutup dokumentasi"],en:["Prepare a backup","Delete all data","Close documentation"]},a:0},
{q:{ms:"Mengapa tindakan penyelenggaraan perlu direkodkan?",en:"Why should maintenance actions be recorded?"},o:{ms:["Untuk rujukan dan audit","Untuk hiasan","Untuk melambatkan kerja"],en:["For reference and audit","For decoration","To delay work"]},a:0}
];

function card(icon,title,text){return `<article class="info-card"><span>${icon}</span><h3>${title}</h3><p>${text}</p></article>`}
function process(n,title,text){return `<article class="process-item"><b>${n}</b><div><h3>${title}</h3><p>${text}</p></div></article>`}

function render(){
const s=slides[step];
app.innerHTML=`<div class="kp-shell">
<header class="kp-header"><button onclick="goDashboard()">← Dashboard</button><div class="kp-progress"><i style="width:${((step+1)/slides.length)*100}%"></i></div><span>${step+1}/${slides.length}</span></header>
<section class="card kp-stage">
<span class="kp-chip">KP02</span>
<div class="kp-hero-icon">${s.icon}</div>
<h1>${s.title[lang]}</h1>
<p class="kp-lead">${s.lead[lang]}</p>
${step===0?`<div class="story-alert"><strong>${lang==="ms"?"🚨 Mission Briefing":"🚨 Mission Briefing"}</strong>${lang==="ms"?"Sebuah server kritikal menunjukkan prestasi tidak stabil. Anda ditugaskan memilih tindakan penyelenggaraan yang selamat dan sistematik.":"A critical server is showing unstable performance. You are assigned to select safe and systematic maintenance actions."}</div>`:""}
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
if(!state.completedKP.includes(2))state.completedKP.push(2);
state.unlocked=Math.max(state.unlocked||2,3);
state.xp=(state.xp||0)+120+(correct*20);
state.badges=state.badges||[];
if(state.completedKP.length>=5&&!state.badges.includes("five-kp"))state.badges.push("five-kp");
SHStorage.save(state);

app.innerHTML=`<section class="center"><div class="card hero"><div class="complete-icon">🎉</div><h1>${lang==="ms"?"Tahniah!":"Congratulations!"}</h1><div class="score-ring" style="--score:${score*3.6}deg"><b>${score}%</b></div><p>${lang==="ms"?"KP02 selesai dan KP03 telah dibuka.":"KP02 is complete and KP03 has been unlocked."}</p><p><strong>+${120+(correct*20)} XP</strong></p><button class="primary" onclick="goDashboard()">Dashboard</button></div></section>`;
}
function goDashboard(){window.location.href="index.html"}
render();

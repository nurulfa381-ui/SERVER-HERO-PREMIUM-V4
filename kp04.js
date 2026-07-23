const app=document.getElementById("kpApp");
let state=SHStorage.load();
const lang=state.lang||"ms";
let step=0;
let selectedLeft=null;
const matched=new Set();
let answers={};

const slides=[
{
icon:"🛠️",
title:{ms:"Misi KP04: Alat Penyelenggaraan Server",en:"KP04 Mission: Server Maintenance Tools"},
lead:{ms:"Kenal pasti alat yang betul, fungsi setiap alat dan kaedah penggunaan yang selamat.",en:"Identify the correct tools, their functions and safe methods of use."},
body:()=>`<div class="story-alert"><strong>🚨 Mission Briefing</strong>${lang==="ms"?"Sebuah server perlu diperiksa segera. Anda mesti memilih alat yang tepat tanpa merosakkan komponen sensitif.":"A server requires immediate inspection. You must select the correct tools without damaging sensitive components."}</div>
<div class="card-grid three">
${card("🔍",lang==="ms"?"Objektif 1":"Objective 1",lang==="ms"?"Mengenal pasti alat tangan dan alat diagnostik.":"Identify hand tools and diagnostic tools.")}
${card("🧤",lang==="ms"?"Objektif 2":"Objective 2",lang==="ms"?"Menggunakan alat ESD dan pembersihan dengan selamat.":"Use ESD and cleaning tools safely.")}
${card("📋",lang==="ms"?"Objektif 3":"Objective 3",lang==="ms"?"Memilih alat mengikut tugas penyelenggaraan.":"Select tools according to the maintenance task.")}
</div>`
},
{
icon:"🔩",
title:{ms:"Alat Tangan Asas",en:"Basic Hand Tools"},
lead:{ms:"Alat tangan digunakan untuk membuka, memasang dan mengurus komponen server.",en:"Hand tools are used to open, install and manage server components."},
body:()=>`<div class="tool-grid">
${tool("🪛",lang==="ms"?"Pemutar Skru":"Screwdriver",lang==="ms"?"Membuka dan mengetatkan skru casing serta komponen.":"Removes and tightens casing and component screws.")}
${tool("🗜️",lang==="ms"?"Playar":"Pliers",lang==="ms"?"Memegang atau membentuk bahagian kecil dengan berhati-hati.":"Holds or shapes small parts carefully.")}
${tool("🔦",lang==="ms"?"Lampu Suluh":"Flashlight",lang==="ms"?"Membantu pemeriksaan ruang rak yang gelap.":"Helps inspect dark rack areas.")}
${tool("📏",lang==="ms"?"Cable Tester":"Cable Tester",lang==="ms"?"Memeriksa kesinambungan dan susunan kabel rangkaian.":"Checks continuity and network cable wiring.")}
</div>`
},
{
icon:"🧤",
title:{ms:"Peralatan ESD",en:"ESD Equipment"},
lead:{ms:"Electrostatic Discharge boleh merosakkan komponen elektronik walaupun tidak dapat dilihat.",en:"Electrostatic discharge can damage electronic components even when it cannot be seen."},
body:()=>`<div class="card-grid two">
${card("⌚",lang==="ms"?"Tali Pergelangan ESD":"ESD Wrist Strap",lang==="ms"?"Mengalirkan cas statik dari badan ke titik bumi.":"Drains static charge from the body to ground.")}
${card("🟦",lang==="ms"?"Tikar Antistatik":"Antistatic Mat",lang==="ms"?"Menyediakan permukaan kerja yang selamat untuk komponen.":"Provides a safe work surface for components.")}
${card("📦",lang==="ms"?"Beg Antistatik":"Antistatic Bag",lang==="ms"?"Melindungi komponen semasa penyimpanan dan pengangkutan.":"Protects components during storage and transport.")}
${card("🧪",lang==="ms"?"ESD Tester":"ESD Tester",lang==="ms"?"Menguji sambungan tali pergelangan dan pembumian.":"Tests wrist-strap and grounding connections.")}
</div>
<div class="warning-box"><strong>${lang==="ms"?"Peringatan":"Reminder"}:</strong> ${lang==="ms"?"Jangan sentuh cip atau pin penyambung secara langsung.":"Do not touch chips or connector pins directly."}</div>`
},
{
icon:"🧹",
title:{ms:"Alat Pembersihan",en:"Cleaning Tools"},
lead:{ms:"Pembersihan perlu menggunakan alat yang tidak menghasilkan cas statik atau kelembapan berbahaya.",en:"Cleaning must use tools that do not create static charge or harmful moisture."},
body:()=>`<div class="tool-grid">
${tool("💨",lang==="ms"?"Udara Mampat":"Compressed Air",lang==="ms"?"Membuang habuk dari kipas, ventilasi dan celah komponen.":"Removes dust from fans, vents and component gaps.")}
${tool("🖌️",lang==="ms"?"Berus Antistatik":"Antistatic Brush",lang==="ms"?"Membersihkan habuk halus pada permukaan komponen.":"Cleans fine dust from component surfaces.")}
${tool("🧽",lang==="ms"?"Kain Mikrofiber":"Microfibre Cloth",lang==="ms"?"Membersihkan permukaan tanpa meninggalkan serat.":"Cleans surfaces without leaving fibres.")}
${tool("🧴",lang==="ms"?"Isopropyl Alcohol":"Isopropyl Alcohol",lang==="ms"?"Membersihkan sentuhan tertentu apabila dibenarkan prosedur.":"Cleans approved contacts when procedure permits.")}
</div>`
},
{
icon:"📟",
title:{ms:"Alat Diagnostik",en:"Diagnostic Tools"},
lead:{ms:"Alat diagnostik membantu mengesan punca masalah sebelum komponen diganti.",en:"Diagnostic tools help identify the cause of a problem before replacing components."},
body:()=>`<div class="card-grid three">
${card("📏",lang==="ms"?"Multimeter":"Multimeter",lang==="ms"?"Mengukur voltan, rintangan dan kesinambungan elektrik.":"Measures voltage, resistance and electrical continuity.")}
${card("🌐",lang==="ms"?"Network Tester":"Network Tester",lang==="ms"?"Menguji kabel, port dan sambungan rangkaian.":"Tests cables, ports and network connections.")}
${card("💻",lang==="ms"?"Perisian Diagnostik":"Diagnostic Software",lang==="ms"?"Menyemak log, suhu, cakera, memori dan prestasi.":"Checks logs, temperature, disks, memory and performance.")}
</div>`
},
{
icon:"🧰",
title:{ms:"Pemilihan Alat Mengikut Tugas",en:"Selecting Tools for Each Task"},
lead:{ms:"Gunakan alat yang sesuai untuk mengelakkan kerosakan, kecederaan dan diagnosis yang salah.",en:"Use the appropriate tool to prevent damage, injury and incorrect diagnosis."},
body:()=>`<div class="process-list">
${process(1,lang==="ms"?"Kenal pasti tugas":"Identify the task",lang==="ms"?"Tentukan sama ada kerja melibatkan pembukaan, pembersihan, pengukuran atau ujian.":"Determine whether the job involves opening, cleaning, measuring or testing.")}
${process(2,lang==="ms"?"Semak prosedur":"Check the procedure",lang==="ms"?"Rujuk manual dan arahan keselamatan pengilang.":"Refer to the manufacturer manual and safety instructions.")}
${process(3,lang==="ms"?"Pilih alat":"Select the tool",lang==="ms"?"Pastikan saiz, jenis dan keadaan alat sesuai.":"Ensure the tool size, type and condition are suitable.")}
${process(4,lang==="ms"?"Periksa selepas digunakan":"Inspect after use",lang==="ms"?"Bersihkan, simpan dan rekodkan kerosakan pada alat.":"Clean, store and record any tool damage.")}
</div>`
},
{
icon:"⚠️",
title:{ms:"Amalan Selamat",en:"Safe Practices"},
lead:{ms:"Alat yang betul masih boleh menyebabkan masalah jika digunakan dengan cara yang salah.",en:"The correct tool can still cause problems if used incorrectly."},
body:()=>`<div class="card-grid two">
${card("🔌",lang==="ms"?"Matikan Kuasa":"Power Off",lang==="ms"?"Ikut prosedur shutdown sebelum membuka server.":"Follow shutdown procedures before opening the server.")}
${card("🧤",lang==="ms"?"Gunakan ESD":"Use ESD Protection",lang==="ms"?"Pasang tali pergelangan dan gunakan permukaan antistatik.":"Wear a wrist strap and use an antistatic surface.")}
${card("🚫",lang==="ms"?"Jangan Paksa":"Do Not Force",lang==="ms"?"Jika komponen sukar dibuka, semak pengunci dan manual.":"If a component is difficult to remove, check locks and the manual.")}
${card("📦",lang==="ms"?"Simpan Dengan Betul":"Store Properly",lang==="ms"?"Simpan alat bersih, kering dan tersusun.":"Keep tools clean, dry and organised.")}
</div>`
},
{
icon:"🎮",
title:{ms:"Aktiviti Padanan",en:"Matching Activity"},
lead:{ms:"Padankan alat dengan fungsi yang betul.",en:"Match each tool with its correct function."},
activity:true
},
{
icon:"🧠",
title:{ms:"Kuiz KP04",en:"KP04 Quiz"},
lead:{ms:"Jawab semua 10 soalan untuk menamatkan KP04.",en:"Answer all 10 questions to complete KP04."},
quiz:true
}
];

const pairs=[
{l:{ms:"Pemutar Skru",en:"Screwdriver"},r:{ms:"Membuka dan mengetatkan skru",en:"Removes and tightens screws"}},
{l:{ms:"Tali ESD",en:"ESD Wrist Strap"},r:{ms:"Mengalirkan cas statik ke bumi",en:"Drains static charge to ground"}},
{l:{ms:"Multimeter",en:"Multimeter"},r:{ms:"Mengukur voltan dan kesinambungan",en:"Measures voltage and continuity"}},
{l:{ms:"Udara Mampat",en:"Compressed Air"},r:{ms:"Membuang habuk dari ventilasi",en:"Removes dust from vents"}}
];

const quiz=[
{q:{ms:"Apakah fungsi pemutar skru?",en:"What is the function of a screwdriver?"},o:{ms:["Membuka dan mengetatkan skru","Mengukur suhu","Menguji IP"],en:["Remove and tighten screws","Measure temperature","Test IP addresses"]},a:0},
{q:{ms:"Mengapa tali ESD digunakan?",en:"Why is an ESD wrist strap used?"},o:{ms:["Melindungi komponen daripada cas statik","Menambah kuasa server","Menyimpan data"],en:["Protect components from static charge","Increase server power","Store data"]},a:0},
{q:{ms:"Alat manakah mengukur voltan?",en:"Which tool measures voltage?"},o:{ms:["Multimeter","Berus","Pemutar skru"],en:["Multimeter","Brush","Screwdriver"]},a:0},
{q:{ms:"Apakah alat sesuai untuk membuang habuk?",en:"Which tool is suitable for removing dust?"},o:{ms:["Udara mampat","Air paip","Kain basah"],en:["Compressed air","Tap water","Wet cloth"]},a:0},
{q:{ms:"Apakah fungsi cable tester?",en:"What is the function of a cable tester?"},o:{ms:["Menguji kesinambungan kabel","Mengukur RAM","Memasang CPU"],en:["Test cable continuity","Measure RAM","Install a CPU"]},a:0},
{q:{ms:"Apakah yang perlu dilakukan sebelum membuka server?",en:"What should be done before opening a server?"},o:{ms:["Shutdown mengikut prosedur","Tarik kabel secara paksa","Sentuh semua komponen"],en:["Shut down according to procedure","Pull cables forcefully","Touch all components"]},a:0},
{q:{ms:"Apakah permukaan sesuai untuk komponen?",en:"What is a suitable surface for components?"},o:{ms:["Tikar antistatik","Karpet","Kain berbulu"],en:["Antistatic mat","Carpet","Furry cloth"]},a:0},
{q:{ms:"Mengapa alat perlu diperiksa?",en:"Why should tools be inspected?"},o:{ms:["Memastikan alat selamat dan sesuai","Untuk hiasan","Untuk menambah berat"],en:["Ensure tools are safe and suitable","For decoration","To increase weight"]},a:0},
{q:{ms:"Apakah tindakan jika komponen sukar dibuka?",en:"What should you do if a component is difficult to remove?"},o:{ms:["Semak pengunci dan manual","Paksa dengan kuat","Pukul komponen"],en:["Check locks and the manual","Force it strongly","Hit the component"]},a:0},
{q:{ms:"Bagaimanakah alat perlu disimpan?",en:"How should tools be stored?"},o:{ms:["Bersih, kering dan tersusun","Berselerak di lantai","Dalam bilik lembap"],en:["Clean, dry and organised","Scattered on the floor","In a damp room"]},a:0}
];

function card(icon,title,text){return `<article class="info-card"><span>${icon}</span><h3>${title}</h3><p>${text}</p></article>`}
function tool(icon,title,text){return `<article class="tool-card"><span>${icon}</span><h3>${title}</h3><p>${text}</p></article>`}
function process(n,title,text){return `<article class="process-item"><b>${n}</b><div><h3>${title}</h3><p>${text}</p></div></article>`}

function render(){
const s=slides[step];
app.innerHTML=`<div class="kp-shell">
<header class="kp-header"><button onclick="goDashboard()">← Dashboard</button><div class="kp-progress"><i style="width:${((step+1)/slides.length)*100}%"></i></div><span>${step+1}/${slides.length}</span></header>
<section class="card kp-stage">
<span class="kp-chip">KP04</span>
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
if(!state.completedKP.includes(4))state.completedKP.push(4);
state.unlocked=Math.max(state.unlocked||4,5);
state.xp=(state.xp||0)+160+(correct*15);
state.badges=state.badges||[];
if(state.completedKP.length>=5&&!state.badges.includes("five-kp"))state.badges.push("five-kp");
SHStorage.save(state);

app.innerHTML=`<section class="center"><div class="card hero"><div class="complete-icon">🎉</div><h1>${lang==="ms"?"Tahniah!":"Congratulations!"}</h1><div class="score-ring" style="--score:${score*3.6}deg"><b>${score}%</b></div><p>${lang==="ms"?"KP04 selesai dan KP05 telah dibuka.":"KP04 is complete and KP05 has been unlocked."}</p><p><strong>+${160+(correct*15)} XP</strong></p><button class="primary" onclick="goDashboard()">Dashboard</button></div></section>`;
}
function goDashboard(){window.location.href="index.html"}
render();

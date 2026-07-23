const app=document.getElementById("kpApp");
let state=SHStorage.load();
const lang=state.lang||"ms";
let step=0;
let selectedLeft=null;
const matched=new Set();
let answers={};
let labStep=0;
let labData={role:false,promote:false,forest:false,domain:"",dsrm:false,installed:false};

const slides=[
{
icon:"🏢",
title:{ms:"Misi KP06: Active Directory Domain Services",en:"KP06 Mission: Active Directory Domain Services"},
lead:{ms:"Pasang AD DS, promosikan server sebagai Domain Controller dan bina domain serverhero.local.",en:"Install AD DS, promote the server to a Domain Controller and create the serverhero.local domain."},
body:()=>`<div class="story-alert"><strong>🚨 Mission Briefing</strong>${lang==="ms"?"Syarikat SERVER HERO memerlukan Domain Controller pertama. Tanpa domain, akaun pengguna dan komputer tidak dapat diurus secara berpusat.":"SERVER HERO needs its first Domain Controller. Without a domain, user and computer accounts cannot be managed centrally."}</div>
<div class="card-grid three">
${card("🧩",lang==="ms"?"Objektif 1":"Objective 1",lang==="ms"?"Memahami fungsi AD DS, domain, forest dan OU.":"Understand AD DS, domains, forests and OUs.")}
${card("🛠️",lang==="ms"?"Objektif 2":"Objective 2",lang==="ms"?"Memasang role Active Directory Domain Services.":"Install the Active Directory Domain Services role.")}
${card("🏛️",lang==="ms"?"Objektif 3":"Objective 3",lang==="ms"?"Mempromosikan server kepada Domain Controller.":"Promote the server to a Domain Controller.")}
</div>`
},
{
icon:"🧠",
title:{ms:"Apakah Itu AD DS?",en:"What Is AD DS?"},
lead:{ms:"AD DS menyimpan maklumat identiti dan membolehkan pengurusan pengguna, komputer, kumpulan dan polisi secara berpusat.",en:"AD DS stores identity information and enables central management of users, computers, groups and policies."},
body:()=>`<div class="card-grid two">
${card("👤",lang==="ms"?"Identiti":"Identity",lang==="ms"?"Menyimpan akaun pengguna, komputer dan kumpulan.":"Stores user, computer and group accounts.")}
${card("🔐",lang==="ms"?"Pengesahan":"Authentication",lang==="ms"?"Mengesahkan identiti sebelum akses diberikan.":"Verifies identity before access is granted.")}
${card("🧭",lang==="ms"?"Pengurusan Berpusat":"Central Management",lang==="ms"?"Pentadbir mengurus sumber daripada satu direktori.":"Administrators manage resources from one directory.")}
${card("📜",lang==="ms"?"Polisi":"Policies",lang==="ms"?"Group Policy boleh mengawal konfigurasi pengguna dan komputer.":"Group Policy can control user and computer settings.")}
</div>`
},
{
icon:"🌳",
title:{ms:"Forest, Tree, Domain dan OU",en:"Forest, Tree, Domain and OU"},
lead:{ms:"Struktur logik AD DS membantu organisasi menyusun sumber dan delegasi pentadbiran.",en:"The logical AD DS structure helps organise resources and administrative delegation."},
body:()=>`<div class="ad-tree">
<div class="root"><b>Forest</b><p>${lang==="ms"?"Keseluruhan persekitaran Active Directory.":"The entire Active Directory environment."}</p></div>
<div class="branch"><b>Tree / Domain</b><p>serverhero.local</p></div>
<div class="leaf"><b>OU</b><p>OU=Students · OU=Teachers · OU=Computers</p></div>
</div>`
},
{
icon:"🧰",
title:{ms:"Virtual Lab: Install AD DS Role",en:"Virtual Lab: Install the AD DS Role"},
lead:{ms:"Ikut wizard Server Manager dan pilih pilihan yang betul.",en:"Follow the Server Manager wizard and select the correct options."},
lab:true
},
{
icon:"⬆️",
title:{ms:"Promote to Domain Controller",en:"Promote to Domain Controller"},
lead:{ms:"Selepas role dipasang, server perlu dipromosikan supaya menjadi Domain Controller.",en:"After the role is installed, the server must be promoted to become a Domain Controller."},
body:()=>`<div class="card-grid two">
${card("🏛️",lang==="ms"?"Add a New Forest":"Add a New Forest",lang==="ms"?"Digunakan apabila membina domain pertama dalam persekitaran baharu.":"Used when creating the first domain in a new environment.")}
${card("🌐",lang==="ms"?"Root Domain Name":"Root Domain Name",lang==="ms"?"Gunakan format FQDN seperti serverhero.local.":"Use an FQDN such as serverhero.local.")}
${card("🔑","DSRM Password",lang==="ms"?"Digunakan untuk Directory Services Restore Mode.":"Used for Directory Services Restore Mode.")}
${card("🔄",lang==="ms"?"Restart":"Restart",lang==="ms"?"Server akan restart selepas konfigurasi berjaya.":"The server restarts after successful configuration.")}
</div>`
},
{
icon:"✅",
title:{ms:"Pengesahan Selepas Restart",en:"Verification After Restart"},
lead:{ms:"Pastikan domain dan peranan Domain Controller berfungsi dengan betul.",en:"Confirm that the domain and Domain Controller role are working correctly."},
body:()=>`<div class="card-grid two">
${card("👤",lang==="ms"?"Login Domain":"Domain Login",lang==="ms"?"Login menggunakan SERVERHERO\\Administrator.":"Sign in using SERVERHERO\\Administrator.")}
${card("🛠️","Server Manager",lang==="ms"?"Semak AD DS dan DNS dipaparkan tanpa ralat kritikal.":"Check that AD DS and DNS appear without critical errors.")}
${card("📂","Active Directory Users and Computers",lang==="ms"?"Buka konsol dan semak domain serverhero.local.":"Open the console and verify serverhero.local.")}
${card("🌐","DNS Manager",lang==="ms"?"Semak zon DNS untuk domain telah diwujudkan.":"Verify that a DNS zone for the domain exists.")}
</div>`
},
{
icon:"🎮",
title:{ms:"Aktiviti Padanan AD DS",en:"AD DS Matching Activity"},
lead:{ms:"Padankan istilah AD DS dengan fungsi yang betul.",en:"Match each AD DS term with its correct function."},
activity:true
},
{
icon:"🧠",
title:{ms:"Kuiz KP06",en:"KP06 Quiz"},
lead:{ms:"Jawab semua 10 soalan untuk menamatkan KP06.",en:"Answer all 10 questions to complete KP06."},
quiz:true
}
];

const pairs=[
{l:{ms:"Forest",en:"Forest"},r:{ms:"Persekitaran Active Directory tertinggi",en:"The highest Active Directory environment"}},
{l:{ms:"Domain",en:"Domain"},r:{ms:"Sempadan pentadbiran dan identiti",en:"Administrative and identity boundary"}},
{l:{ms:"OU",en:"OU"},r:{ms:"Bekas untuk menyusun objek",en:"Container used to organise objects"}},
{l:{ms:"DSRM",en:"DSRM"},r:{ms:"Mod pemulihan perkhidmatan direktori",en:"Directory Services recovery mode"}}
];

const quiz=[
{q:{ms:"Apakah fungsi utama AD DS?",en:"What is the main function of AD DS?"},o:{ms:["Mengurus identiti secara berpusat","Menyejukkan server","Menguji kabel"],en:["Centrally manage identities","Cool the server","Test cables"]},a:0},
{q:{ms:"Apakah Domain Controller?",en:"What is a Domain Controller?"},o:{ms:["Server yang menjalankan AD DS","Peranti rangkaian pasif","Printer"],en:["A server running AD DS","A passive network device","A printer"]},a:0},
{q:{ms:"Pilihan untuk domain pertama ialah?",en:"Which option is used for the first domain?"},o:{ms:["Add a new forest","Add a child only","Remove roles"],en:["Add a new forest","Add only a child","Remove roles"]},a:0},
{q:{ms:"Nama domain yang digunakan dalam modul?",en:"Which domain name is used in the module?"},o:{ms:["serverhero.local","serverhero","local"],en:["serverhero.local","serverhero","local"]},a:0},
{q:{ms:"Apakah fungsi OU?",en:"What is the function of an OU?"},o:{ms:["Menyusun objek AD","Menyimpan backup fizikal","Mengukur suhu"],en:["Organise AD objects","Store physical backups","Measure temperature"]},a:0},
{q:{ms:"Apakah DSRM?",en:"What is DSRM?"},o:{ms:["Directory Services Restore Mode","Data Server Role Manager","Domain Setup Resource Map"],en:["Directory Services Restore Mode","Data Server Role Manager","Domain Setup Resource Map"]},a:0},
{q:{ms:"Role yang perlu dipilih?",en:"Which role must be selected?"},o:{ms:["Active Directory Domain Services","Print Services sahaja","Web Browser"],en:["Active Directory Domain Services","Print Services only","Web Browser"]},a:0},
{q:{ms:"Selepas role dipasang, langkah seterusnya?",en:"After installing the role, what is next?"},o:{ms:["Promote this server to a domain controller","Delete DNS","Format disk"],en:["Promote this server to a domain controller","Delete DNS","Format the disk"]},a:0},
{q:{ms:"Apakah yang perlu berlaku selepas konfigurasi?",en:"What should happen after configuration?"},o:{ms:["Server restart","Server dimatikan selamanya","Semua data dipadam"],en:["The server restarts","The server is permanently shut down","All data is deleted"]},a:0},
{q:{ms:"Konsol untuk semak pengguna dan komputer?",en:"Which console checks users and computers?"},o:{ms:["Active Directory Users and Computers","Disk Cleanup","Notepad"],en:["Active Directory Users and Computers","Disk Cleanup","Notepad"]},a:0}
];

function card(icon,title,text){return `<article class="info-card"><span>${icon}</span><h3>${title}</h3><p>${text}</p></article>`}

function render(){
const s=slides[step];
app.innerHTML=`<div class="kp-shell">
<header class="kp-header"><button onclick="goDashboard()">← Dashboard</button><div class="kp-progress"><i style="width:${((step+1)/slides.length)*100}%"></i></div><span>${step+1}/${slides.length}</span></header>
<section class="card kp-stage">
<span class="kp-chip">KP06</span>
<div class="kp-hero-icon">${s.icon}</div>
<h1>${s.title[lang]}</h1>
<p class="kp-lead">${s.lead[lang]}</p>
${s.lab?renderLab():s.activity?renderActivity():s.quiz?renderQuiz():s.body()}
<div id="feedback" class="feedback"></div>
<div class="kp-nav"><button class="secondary" onclick="previous()" ${step===0?"disabled":""}>← ${lang==="ms"?"Sebelumnya":"Previous"}</button><button onclick="next()">${step===slides.length-1?(lang==="ms"?"SELESAIKAN KP":"COMPLETE KP"):(lang==="ms"?"Seterusnya":"Next")} →</button></div>
</section></div>`;
}

function renderLab(){
const steps=[
{title:"Server Manager",body:lang==="ms"?"Klik Add Roles and Features.":"Click Add Roles and Features."},
{title:"Installation Type",body:lang==="ms"?"Pilih Role-based or feature-based installation.":"Choose Role-based or feature-based installation."},
{title:"Server Roles",body:lang==="ms"?"Tandakan Active Directory Domain Services.":"Select Active Directory Domain Services."},
{title:"Installation",body:lang==="ms"?"Klik Install dan tunggu selesai.":"Click Install and wait for completion."},
{title:"Promotion",body:lang==="ms"?"Klik Promote this server to a domain controller.":"Click Promote this server to a domain controller."},
{title:"Deployment",body:lang==="ms"?"Pilih Add a new forest.":"Choose Add a new forest."},
{title:"Domain",body:lang==="ms"?"Masukkan serverhero.local.":"Enter serverhero.local."},
{title:"DSRM",body:lang==="ms"?"Tetapkan kata laluan DSRM.":"Set the DSRM password."},
{title:"Install",body:lang==="ms"?"Semak prasyarat dan klik Install.":"Review prerequisites and click Install."}
];
const s=steps[labStep];
return `<div class="lab-window">
<div class="lab-titlebar"><b>Server Manager</b><span class="dots">— □ ×</span></div>
<div class="lab-body">
<aside class="lab-sidebar">${steps.map((x,i)=>`<button class="${i===labStep?"active":""}">${i+1}. ${x.title}</button>`).join("")}</aside>
<section class="lab-content">
<h2>${s.title}</h2>
<div class="lab-panel">
<p>${s.body}</p>
${labControls()}
<div id="labStatus" class="lab-status">${lang==="ms"?"Langkah "+(labStep+1)+" daripada "+steps.length:"Step "+(labStep+1)+" of "+steps.length}</div>
</div>
</section>
</div>
</div>`;
}

function labControls(){
switch(labStep){
case 0:return `<div class="lab-options"><button class="lab-option" onclick="labAdvance('roles')">Add Roles and Features</button><button class="lab-option" onclick="labWrong()">Local Server</button></div>`;
case 1:return `<div class="lab-options"><button class="lab-option" onclick="labAdvance('type')">Role-based or feature-based installation</button><button class="lab-option" onclick="labWrong()">Remote Desktop Services installation</button></div>`;
case 2:return `<div class="lab-options"><button class="lab-option" onclick="labAdvance('role')">☑ Active Directory Domain Services</button><button class="lab-option" onclick="labWrong()">☐ Print and Document Services</button></div>`;
case 3:return `<div class="lab-actions"><button onclick="labAdvance('installrole')">Install</button></div>`;
case 4:return `<div class="lab-options"><button class="lab-option" onclick="labAdvance('promote')">Promote this server to a domain controller</button></div>`;
case 5:return `<div class="lab-options"><button class="lab-option" onclick="labAdvance('forest')">Add a new forest</button><button class="lab-option" onclick="labWrong()">Remove this domain controller</button></div>`;
case 6:return `<label>Root domain name</label><input id="domainInput" class="lab-input" value="${labData.domain||""}" placeholder="serverhero.local"><div class="lab-actions"><button onclick="checkDomain()">Next</button></div>`;
case 7:return `<label>DSRM Password</label><input id="dsrmInput" type="password" class="lab-input" placeholder="••••••••"><div class="lab-actions"><button onclick="checkDSRM()">Next</button></div>`;
default:return `<div class="lab-actions"><button onclick="finishLab()">Install</button></div>`;
}
}

function labAdvance(type){
labData[type]=true;
labStep++;
SHV5?.sound?.("correct");
render();
}
function labWrong(){
SHV5?.sound?.("wrong");
const el=document.getElementById("labStatus");
if(el){el.textContent=lang==="ms"?"Pilihan belum betul. Cuba semula.":"That option is not correct. Try again.";el.classList.add("error")}
}
function checkDomain(){
const value=document.getElementById("domainInput").value.trim().toLowerCase();
if(value==="serverhero.local"){
labData.domain=value;labStep++;SHV5?.sound?.("correct");render();
}else labWrong();
}
function checkDSRM(){
const value=document.getElementById("dsrmInput").value;
if(value.length>=8){
labData.dsrm=true;labStep++;SHV5?.sound?.("correct");render();
}else{
const el=document.getElementById("labStatus");
if(el){el.textContent=lang==="ms"?"Gunakan sekurang-kurangnya 8 aksara.":"Use at least 8 characters.";el.classList.add("error")}
}
}
function finishLab(){
labData.installed=true;
SHV5?.sound?.("complete");
feedback(lang==="ms"?"Virtual Lab berjaya! Domain Controller telah dipasang.":"Virtual Lab complete! The Domain Controller has been installed.","good");
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
if(slides[step].lab&&!labData.installed){
feedback(lang==="ms"?"Lengkapkan Virtual Lab dahulu.":"Complete the Virtual Lab first.","bad");
return;
}
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
const firstCompletion=!state.completedKP.includes(6);
if(firstCompletion)state.completedKP.push(6);
state.unlocked=Math.max(state.unlocked||6,7);
state.badges=state.badges||[];
if(firstCompletion){
state.xp=(state.xp||0)+250+(correct*15);
state.coins=(state.coins||0)+150;
if(!state.badges.includes("ad-expert"))state.badges.push("ad-expert");
}
SHStorage.save(state);
SHV5?.sound?.("complete");

app.innerHTML=`<section class="center"><div class="card hero"><div class="complete-icon">🏅</div><h1>${lang==="ms"?"Active Directory Expert!":"Active Directory Expert!"}</h1><div class="score-ring" style="--score:${score*3.6}deg"><b>${score}%</b></div><p>${lang==="ms"?"KP06 selesai dan KP07 telah dibuka.":"KP06 is complete and KP07 has been unlocked."}</p><p><strong>${firstCompletion?`+${250+(correct*15)} XP · +150 Coin · Badge AD Expert`:(lang==="ms"?"Ganjaran telah dituntut sebelum ini.":"Reward was claimed previously.")}</strong></p><button class="primary" onclick="goDashboard()">Dashboard</button></div></section>`;
}

function goDashboard(){window.location.href="index.html"}
render();

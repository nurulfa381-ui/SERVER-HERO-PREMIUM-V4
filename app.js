// ======================================================
// SERVER HERO PREMIUM V5.0
// app.js
// FINAL INTEGRATION CONTROLLER
// ======================================================

"use strict";


// ======================================================
// ENGINE REQUIREMENTS
// ======================================================

const REQUIRED_ENGINES = [

    "SERVER_HERO_STORAGE",

    "SERVER_HERO_PLAYER",

    "SERVER_HERO_MISSION_ENGINE",

    "SERVER_HERO_ACHIEVEMENTS",

    "SERVER_HERO_UI",

    "SERVER_HERO_CERTIFICATE",

    "SERVER_HERO_REPORT"

];


REQUIRED_ENGINES.forEach(

    engineName => {

        if (

            !window[engineName]

        ) {

            throw new Error(

                `${engineName} belum dimuatkan. Semak susunan script dalam index.html.`

            );

        }

    }

);


// ======================================================
// APPLICATION CONFIGURATION
// ======================================================

const APP_CONFIG = Object.freeze({

    name:
        "SERVER HERO PREMIUM",

    version:
        "5.0",

    build:
        "2026.07",

    totalMissions:

        Array.isArray(

            window.missions

        )

            ? window.missions.length

            : 0

});


// ======================================================
// DOM REFERENCES
// ======================================================

const DOM = {

    missions:

        document.getElementById(

            "missions"

        ),

    xp:

        document.getElementById(

            "xp"

        ),

    level:

        document.getElementById(

            "level"

        ),

    coins:

        document.getElementById(

            "coins"

        ),

    gems:

        document.getElementById(

            "gems"

        ),

    rank:

        document.getElementById(

            "rank"

        ),

    rankText:

        document.getElementById(

            "rankText"

        ),

    streak:

        document.getElementById(

            "streak"

        ),

    achievementCount:

        document.getElementById(

            "achievementCount"

        ),

    completion:

        document.getElementById(

            "completion"

        ),

    progress:

        document.getElementById(

            "progress"

        ),

    percent:

        document.getElementById(

            "percent"

        ),

    dailyMission:

        document.getElementById(

            "dailyMission"

        ),

    profileName:

        document.querySelector(

            ".profile-content strong"

        ),

    masterPanel:

        document.getElementById(

            "masterPanel"

        )

};


// ======================================================
// BASIC HELPERS
// ======================================================

function setText(

    element,

    value

) {

    if (element) {

        element.textContent =

            String(value);

    }

}


function getDailyMissionText() {

    const dailyMessages = [

        "Lengkapkan satu misi server hari ini.",

        "Jawab satu kuiz misi dengan betul.",

        "Kumpulkan sekurang-kurangnya 250 XP hari ini.",

        "Ulang kaji satu misi yang telah selesai.",

        "Buka satu pelajaran Windows Server baharu."

    ];

    const messageIndex =

        new Date().getDate() %

        dailyMessages.length;

    return dailyMessages[

        messageIndex

    ];

}


// ======================================================
// DAILY BONUS
// ======================================================

function getTodayKey() {

    const today =

        new Date();

    const year =

        today.getFullYear();

    const month =

        String(

            today.getMonth() + 1

        ).padStart(

            2,

            "0"

        );

    const day =

        String(

            today.getDate()

        ).padStart(

            2,

            "0"

        );

    return `${year}-${month}-${day}`;

}


function claimDailyBonus() {

    const today =

        getTodayKey();

    const previousClaim =

        SERVER_HERO_STORAGE

            .readRaw(

                SERVER_HERO_STORAGE

                    .keys

                    .dailyBonus

            );

    if (

        previousClaim === today

    ) {

        return false;

    }

    SERVER_HERO_PLAYER.addXP(

        50

    );

    SERVER_HERO_STORAGE.writeRaw(

        SERVER_HERO_STORAGE

            .keys

            .dailyBonus,

        today

    );

    SERVER_HERO_UI.toast(

        "🎁 Bonus Harian: +50 XP",

        "success",

        3500

    );

    return true;

}


// ======================================================
// DASHBOARD UPDATE
// ======================================================

function updateDashboard() {

    const player =

        SERVER_HERO_PLAYER

            .getDashboardData();

    setText(

        DOM.profileName,

        player.name || "AGENT"

    );

    const progressData =

        SERVER_HERO_MISSION_ENGINE

            .getProgress();

    const achievementCount =

        SERVER_HERO_ACHIEVEMENTS

            .getUnlockedCount();

    setText(

        DOM.xp,

        player.xp

    );

    setText(

        DOM.level,

        player.level

    );

    setText(

        DOM.coins,

        player.coins

    );

    setText(

        DOM.gems,

        player.gems

    );

    setText(

        DOM.rank,

        player.rank

    );

    setText(

        DOM.rankText,

        player.rank

    );

    setText(

        DOM.streak,

        `${player.streak} Hari`

    );

    setText(

        DOM.achievementCount,

        achievementCount

    );

    setText(

        DOM.completion,

        `${progressData.completed} / ${progressData.total}`

    );

    setText(

        DOM.percent,

        `${progressData.percentage}%`

    );

    if (DOM.progress) {

        SERVER_HERO_UI

            .animateProgress(

                DOM.progress,

                progressData.percentage,

                700

            );

    }

    if (DOM.dailyMission) {

        DOM.dailyMission.textContent =

            getDailyMissionText();

    }

    if (DOM.masterPanel) {

        DOM.masterPanel.classList.toggle(

            "hidden",

            progressData.completed < progressData.total

        );

    }

}


// ======================================================
// MISSION CARD RENDERING
// ======================================================

function createMissionCard(

    mission

) {

    const card =

        document.createElement(

            "article"

        );

    card.className =

        "mission-card";

    card.dataset.missionId =

        String(mission.id);

    if (

        mission.completed

    ) {

        card.classList.add(

            "completed"

        );

    }

    else if (

        !mission.unlocked

    ) {

        card.classList.add(

            "locked"

        );

    }

    const buttonLabel =

        mission.completed

            ? "Selesai"

            : mission.unlocked

                ? "Mulakan Misi"

                : "Terkunci";

    card.innerHTML = `

        <div class="mission-header">

            <div>

                <h2>

                    ${SERVER_HERO_UI.escapeHTML(

                        mission.icon

                    )}

                    ${SERVER_HERO_UI.escapeHTML(

                        mission.title

                    )}

                </h2>

                <h4>

                    ${SERVER_HERO_UI.escapeHTML(

                        mission.subtitle

                    )}

                </h4>

            </div>

            <span class="badge">

                ${Number(

                    mission.xp

                ) || 0} XP

            </span>

        </div>

        <p>

            ${SERVER_HERO_UI.escapeHTML(

                mission.description

            )}

        </p>

        <div class="mission-info">

            <span>

                🎯 ${SERVER_HERO_UI.escapeHTML(

                    mission.difficulty

                )}

            </span>

            <span>

                ⏱ ${SERVER_HERO_UI.escapeHTML(

                    mission.duration

                )}

            </span>

        </div>

        <div class="mission-footer">

            <button

                type="button"

                ${

                    mission.completed ||

                    !mission.unlocked

                        ? "disabled"

                        : ""

                }

            >

                ${buttonLabel}

            </button>

        </div>

    `;

    const button =

        card.querySelector(

            "button"

        );

    if (

        button &&

        mission.unlocked &&

        !mission.completed

    ) {

        button.addEventListener(

            "click",

            () => {

                const result =

                    SERVER_HERO_MISSION_ENGINE

                        .open(

                            mission.id

                        );

                if (

                    !result.success

                ) {

                    SERVER_HERO_UI.toast(

                        "Misi tidak dapat dibuka.",

                        "error"

                    );

                }

            }

        );

    }

    return card;

}


function renderMissionCards() {

    if (!DOM.missions) {

        return;

    }

    DOM.missions.innerHTML = "";

    const missionList =

        SERVER_HERO_MISSION_ENGINE

            .getAll();

    missionList.forEach(

        mission => {

            DOM.missions.appendChild(

                createMissionCard(

                    mission

                )

            );

        }

    );

}


// ======================================================
// EXPORT SAVE
// ======================================================

function exportSave() {

    const exportPackage = {

        version:
            APP_CONFIG.version,

        app:
            APP_CONFIG.name,

        exportedAt:
            new Date().toISOString(),

        storage:
            SERVER_HERO_STORAGE

                .exportAll(),

        player:
            SERVER_HERO_PLAYER

                .exportData(),

        achievements:
            SERVER_HERO_ACHIEVEMENTS

                .exportData()

    };

    SERVER_HERO_STORAGE.write(

        SERVER_HERO_STORAGE

            .keys

            .exportSave,

        exportPackage

    );

    const exportText =

        JSON.stringify(

            exportPackage,

            null,

            2

        );

    if (

        navigator.clipboard &&

        window.isSecureContext

    ) {

        navigator.clipboard

            .writeText(

                exportText

            )

            .then(

                () => {

                    SERVER_HERO_UI.toast(

                        "Save disalin ke clipboard.",

                        "success"

                    );

                }

            )

            .catch(

                () => {

                    SERVER_HERO_UI.toast(

                        "Save disimpan dalam browser.",

                        "info"

                    );

                }

            );

        return;

    }

    SERVER_HERO_UI.toast(

        "Save disimpan dalam browser.",

        "success"

    );

}


// ======================================================
// IMPORT SAVE
// ======================================================

function importSave() {

    const savedPackage =

        SERVER_HERO_STORAGE

            .readObject(

                SERVER_HERO_STORAGE

                    .keys

                    .exportSave,

                {}

            );

    if (

        !savedPackage ||

        !savedPackage.player

    ) {

        SERVER_HERO_UI.toast(

            "Tiada exported save dijumpai.",

            "error"

        );

        return false;

    }

    if (

        savedPackage.storage

    ) {

        SERVER_HERO_STORAGE

            .importAll(

                savedPackage.storage

            );

    }

    SERVER_HERO_PLAYER

        .importData(

            savedPackage.player

        );

    if (

        savedPackage.achievements

    ) {

        SERVER_HERO_ACHIEVEMENTS

            .importData(

                savedPackage.achievements

            );

    }

    refreshApplication();

    SERVER_HERO_UI.toast(

        "Save berjaya dipulihkan.",

        "success"

    );

    return true;

}


// ======================================================
// RESET PROGRESS
// ======================================================

function resetProgress() {

    SERVER_HERO_UI.confirm(

        "Padam semua kemajuan SERVER HERO?",

        () => {

            SERVER_HERO_STORAGE

                .clearAll();

            SERVER_HERO_PLAYER

                .reset();

            SERVER_HERO_ACHIEVEMENTS

                .reset();

            SERVER_HERO_MISSION_ENGINE

                .reset();

            window.location.reload();

        },

        "Reset Progress"

    );

}


// ======================================================
// REPORT AND CERTIFICATE
// ======================================================

function openPlayerReport() {

    const opened =

        SERVER_HERO_REPORT

            .open();

    if (!opened) {

        SERVER_HERO_UI.toast(

            "Report tidak dapat dibuka.",

            "error"

        );

    }

}


function openCertificate() {

    const opened =

        SERVER_HERO_CERTIFICATE

            .open();

    if (!opened) {

        SERVER_HERO_UI.toast(

            "Complete all missions before generating the certificate.",

            "error"

        );

    }

}


// ======================================================
// SHOP REMOVAL SUPPORT
// ======================================================

function buyItem() {

    SERVER_HERO_UI.toast(

        "Premium Shop telah dinyahaktifkan.",

        "info"

    );

}


// ======================================================
// APPLICATION REFRESH
// ======================================================

function refreshApplication() {

    SERVER_HERO_PLAYER

        .refresh();

    SERVER_HERO_MISSION_ENGINE

        .synchronizeRewards();

    SERVER_HERO_ACHIEVEMENTS

        .check();

    updateDashboard();

    renderMissionCards();

}


// ======================================================
// EVENT LISTENERS
// ======================================================

window.addEventListener(

    "serverhero:mission-completed",

    () => {

        window.setTimeout(

            () => {

                refreshApplication();

            },

            100

        );

    }

);


window.addEventListener(

    "serverhero:achievement-unlocked",

    () => {

        window.setTimeout(

            () => {

                updateDashboard();

            },

            100

        );

    }

);


window.addEventListener(

    "serverhero:missions-reset",

    () => {

        refreshApplication();

    }

);


// ======================================================
// GLOBAL FUNCTIONS
// ======================================================

window.buyItem =

    buyItem;

window.exportSave =

    exportSave;

window.importSave =

    importSave;

window.resetProgress =

    resetProgress;

window.openPlayerReport =

    openPlayerReport;

window.openCertificate =

    openCertificate;


// ======================================================\n// STUDENT LOGIN\n// ======================================================\n\nfunction injectStudentLoginStyles() {\n\n    if (document.getElementById("studentLoginStyles")) {\n\n        return;\n\n    }\n\n    const style = document.createElement("style");\n\n    style.id = "studentLoginStyles";\n\n    style.textContent = `\n        .student-login-overlay {\n            position: fixed;\n            inset: 0;\n            z-index: 20000;\n            display: grid;\n            place-items: center;\n            padding: 20px;\n            background: rgba(2, 8, 23, 0.92);\n            backdrop-filter: blur(12px);\n        }\n        .student-login-card {\n            width: min(100%, 460px);\n            padding: 30px;\n            border: 1px solid rgba(255,255,255,.12);\n            border-radius: 24px;\n            background: linear-gradient(145deg, #14243d, #091322);\n            color: #f8fafc;\n            text-align: center;\n            box-shadow: 0 30px 80px rgba(0,0,0,.55);\n        }\n        .student-login-icon {\n            font-size: 3.6rem;\n            margin-bottom: 12px;\n        }\n        .student-login-card h2 {\n            margin-bottom: 8px;\n            font-size: 1.75rem;\n        }\n        .student-login-card p {\n            color: #b8c7d9;\n            line-height: 1.65;\n            margin-bottom: 20px;\n        }\n        .student-login-card input {\n            width: 100%;\n            padding: 15px 16px;\n            border: 1px solid rgba(255,255,255,.12);\n            border-radius: 14px;\n            background: #1a2f4b;\n            color: #fff;\n            outline: none;\n        }\n        .student-login-card input:focus {\n            border-color: #22b7ff;\n            box-shadow: 0 0 0 4px rgba(34,183,255,.12);\n        }\n        .student-login-card button {\n            width: 100%;\n            margin-top: 14px;\n            padding: 14px 18px;\n            border: 0;\n            border-radius: 14px;\n            background: linear-gradient(135deg, #1686ff, #22b7ff);\n            color: #fff;\n            font-weight: 800;\n        }\n        .student-login-error {\n            min-height: 24px;\n            margin-top: 10px;\n            color: #ffc7c7;\n            font-size: .88rem;\n        }\n    `;\n\n    document.head.appendChild(style);\n\n}\n\n\nfunction ensureStudentLogin(onReady) {\n\n    const player = SERVER_HERO_PLAYER.get();\n\n    if (\n\n        player.name &&\n\n        player.name.trim() &&\n\n        player.name.trim().toUpperCase() !== "AGENT"\n\n    ) {\n\n        onReady();\n\n        return;\n\n    }\n\n    injectStudentLoginStyles();\n\n    const overlay = document.createElement("div");\n\n    overlay.className = "student-login-overlay";\n\n    overlay.innerHTML = `\n        <form class="student-login-card" id="studentLoginForm">\n            <div class="student-login-icon">👩‍💻</div>\n            <h2>Selamat Datang, Pelajar</h2>\n            <p>Masukkan nama penuh sebelum memulakan SERVER HERO PREMIUM.</p>\n            <input\n                id="studentNameInput"\n                type="text"\n                maxlength="30"\n                autocomplete="name"\n                placeholder="Contoh: Nurul Farhana"\n                required\n            >\n            <button type="submit">MULA MISI</button>\n            <div class="student-login-error" id="studentLoginError"></div>\n        </form>\n    `;\n\n    document.body.appendChild(overlay);\n\n    const form = overlay.querySelector("#studentLoginForm");\n    const input = overlay.querySelector("#studentNameInput");\n    const error = overlay.querySelector("#studentLoginError");\n\n    input.focus();\n\n    form.addEventListener("submit", event => {\n\n        event.preventDefault();\n\n        const name = input.value.trim();\n\n        if (name.length < 2) {\n\n            error.textContent = "Sila masukkan nama pelajar yang sah.";\n\n            return;\n\n        }\n\n        if (!SERVER_HERO_PLAYER.setName(name)) {\n\n            error.textContent = "Nama tidak dapat disimpan. Cuba semula.";\n\n            return;\n\n        }\n\n        overlay.remove();\n\n        onReady();\n\n    });\n\n}\n\n\n// ======================================================
// PUBLIC APPLICATION API
// ======================================================

window.SERVER_HERO = {

    name:
        APP_CONFIG.name,

    version:
        APP_CONFIG.version,

    build:
        APP_CONFIG.build,

    refresh:
        refreshApplication,

    updateDashboard:
        updateDashboard,

    renderMissions:
        renderMissionCards,

    exportSave:
        exportSave,

    importSave:
        importSave,

    reset:
        resetProgress,

    openReport:
        openPlayerReport,

    openCertificate:
        openCertificate

};


// ======================================================
// INITIALIZATION
// ======================================================

function startServerHeroApplication() {

    SERVER_HERO_UI.showLoading(

        "Memuatkan SERVER HERO..."

    );

    claimDailyBonus();

    refreshApplication();

    window.setTimeout(

        () => {

            SERVER_HERO_UI.hideLoading();

            const player = SERVER_HERO_PLAYER.get();

            SERVER_HERO_UI.toast(

                `Selamat kembali, ${player.name || "Agent"}!`,

                "info",

                2500

            );

        },

        500

    );

    console.log(

        "======================================"

    );

    console.log(

        `${APP_CONFIG.name} V${APP_CONFIG.version}`

    );

    console.log(

        "FINAL APPLICATION CONTROLLER READY"

    );

    console.log(

        "Total Missions:",

        APP_CONFIG.totalMissions

    );

    console.log(

        "======================================"

    );

}


function initializeServerHero() {

    ensureStudentLogin(

        startServerHeroApplication

    );

}


initializeServerHero();

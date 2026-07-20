// ======================================================
// SERVER HERO PREMIUM V4.0
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
        "4.0",

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

        "Complete one server lesson today.",

        "Answer one mission quiz correctly.",

        "Earn at least 250 XP today.",

        "Review one completed mission.",

        "Open a new Windows Server lesson."

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

    SERVER_HERO_PLAYER.addCoins(

        25

    );

    SERVER_HERO_PLAYER.addGems(

        1

    );

    SERVER_HERO_STORAGE.writeRaw(

        SERVER_HERO_STORAGE

            .keys

            .dailyBonus,

        today

    );

    SERVER_HERO_UI.toast(

        "🎁 Daily Bonus: +50 XP, +25 Coins, +1 Gem",

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

        `${player.streak} Day`

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

            ? "Completed"

            : mission.unlocked

                ? "Start Mission"

                : "Locked";

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

                        "Mission tidak dapat dibuka.",

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


// ======================================================
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

function initializeServerHero() {

    SERVER_HERO_UI.showLoading(

        "Loading SERVER HERO..."

    );

    claimDailyBonus();

    refreshApplication();

    window.setTimeout(

        () => {

            SERVER_HERO_UI.hideLoading();

            SERVER_HERO_UI.toast(

                "Welcome back, Agent!",

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


initializeServerHero();

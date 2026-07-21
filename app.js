// ======================================================
// SERVER HERO PREMIUM V5.2
// app.js - FINAL COMPATIBLE DASHBOARD CONTROLLER
// 13 MISSIONS + STUDENT LOGIN
// ======================================================

"use strict";


// ======================================================
// DATABASE CHECK
// ======================================================

const MISSION_LIST = Array.isArray(window.missions)
    ? window.missions
    : [];

if (MISSION_LIST.length === 0) {
    console.error(
        "SERVER HERO: missions.js tidak dimuatkan atau senarai misi kosong."
    );
}


// ======================================================
// STORAGE KEYS
// ======================================================

const STORAGE_KEYS = Object.freeze({
    player: "serverHeroPlayerV4",
    achievements: "serverHeroAchievementsV4",
    history: "serverHeroHistoryV4",
    studentName: "serverHeroStudentNameV5",
    masterUnlocked: "serverHeroMasterUnlockedV4"
});

const DEFAULT_PLAYER = Object.freeze({
    name: "AGENT",
    xp: 500,
    level: 1,
    completed: 0,
    streak: 1,
    rank: "Beginner"
});

const ACHIEVEMENTS = Object.freeze([
    {
        id: "first-mission",
        title: "Misi Pertama",
        target: 1,
        rewardXP: 100
    },
    {
        id: "server-explorer",
        title: "Server Explorer",
        target: 3,
        rewardXP: 250
    },
    {
        id: "server-specialist",
        title: "Server Specialist",
        target: 5,
        rewardXP: 400
    },
    {
        id: "server-hero",
        title: "Server Hero",
        target: 8,
        rewardXP: 800
    },
    {
        id: "server-master",
        title: "Server Hero Master",
        target: 13,
        rewardXP: 1500
    }
]);


// ======================================================
// STORAGE HELPERS
// ======================================================

function readJSON(key, fallback) {
    try {
        const raw = localStorage.getItem(key);

        if (!raw) {
            return fallback;
        }

        const parsed = JSON.parse(raw);

        return parsed ?? fallback;
    } catch (error) {
        console.warn(`Gagal membaca ${key}:`, error);
        return fallback;
    }
}

function writeJSON(key, value) {
    try {
        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;
    } catch (error) {
        console.error(`Gagal menyimpan ${key}:`, error);
        return false;
    }
}


// ======================================================
// APPLICATION STATE
// ======================================================

let player = {
    ...DEFAULT_PLAYER,
    ...readJSON(STORAGE_KEYS.player, {})
};

let unlockedAchievements = readJSON(
    STORAGE_KEYS.achievements,
    []
);

if (!Array.isArray(unlockedAchievements)) {
    unlockedAchievements = [];
}

let missionHistory = readJSON(
    STORAGE_KEYS.history,
    []
);

if (!Array.isArray(missionHistory)) {
    missionHistory = [];
}


// ======================================================
// DOM REFERENCES
// ======================================================

const DOM = Object.freeze({
    missions: document.getElementById("missions"),
    xp: document.getElementById("xp"),
    level: document.getElementById("level"),
    rank: document.getElementById("rank"),
    rankText: document.getElementById("rankText"),
    streak: document.getElementById("streak"),
    achievementCount: document.getElementById("achievementCount"),
    completion: document.getElementById("completion"),
    progress: document.getElementById("progress"),
    percent: document.getElementById("percent"),
    dailyMission: document.getElementById("dailyMission"),
    masterPanel: document.getElementById("masterPanel"),
    profileName: document.querySelector(".profile-content strong")
});


// ======================================================
// GENERAL HELPERS
// ======================================================

function setText(element, value) {
    if (element) {
        element.textContent = String(value);
    }
}

function escapeHTML(value) {
    const container = document.createElement("div");

    container.textContent = String(
        value ?? ""
    );

    return container.innerHTML;
}

function getMissionById(missionId) {
    return MISSION_LIST.find(
        mission =>
            Number(mission.id) ===
            Number(missionId)
    ) || null;
}

function missionCompleteKey(missionId) {
    return `lesson${Number(missionId)}Complete`;
}

function missionRewardKey(missionId) {
    return `lesson${Number(missionId)}RewardedV4`;
}

function isMissionCompleted(missionId) {
    return (
        localStorage.getItem(
            missionCompleteKey(missionId)
        ) === "true"
    );
}

function isMissionRewarded(missionId) {
    return (
        localStorage.getItem(
            missionRewardKey(missionId)
        ) === "true"
    );
}

function isMissionUnlocked(missionId) {
    const id = Number(missionId);

    return (
        id === 1 ||
        isMissionCompleted(id - 1)
    );
}

function getCompletedMissionCount() {
    return MISSION_LIST.filter(
        mission =>
            isMissionCompleted(
                mission.id
            )
    ).length;
}

function saveApplicationData() {
    writeJSON(
        STORAGE_KEYS.player,
        player
    );

    writeJSON(
        STORAGE_KEYS.achievements,
        unlockedAchievements
    );

    writeJSON(
        STORAGE_KEYS.history,
        missionHistory
    );
}


// ======================================================
// PLAYER CALCULATIONS
// ======================================================

function calculatePlayer() {
    player.completed =
        getCompletedMissionCount();

    player.level =
        Math.max(
            1,
            Math.floor(
                Number(player.xp || 0) /
                500
            )
        );

    if (
        player.completed >=
        MISSION_LIST.length &&
        MISSION_LIST.length > 0
    ) {
        player.rank =
            "SERVER HERO MASTER";
    } else if (player.xp >= 9000) {
        player.rank =
            "Master";
    } else if (player.xp >= 6500) {
        player.rank =
            "Elite";
    } else if (player.xp >= 4000) {
        player.rank =
            "Professional";
    } else if (player.xp >= 2000) {
        player.rank =
            "Advanced";
    } else {
        player.rank =
            "Beginner";
    }
}


// ======================================================
// MISSION REWARD SYNCHRONIZATION
// ======================================================

function synchronizeMissionRewards() {
    let changed = false;

    MISSION_LIST.forEach(
        mission => {
            if (
                !isMissionCompleted(
                    mission.id
                ) ||
                isMissionRewarded(
                    mission.id
                )
            ) {
                return;
            }

            player.xp +=
                Number(
                    mission.xp
                ) || 0;

            localStorage.setItem(
                missionRewardKey(
                    mission.id
                ),
                "true"
            );

            missionHistory.unshift({
                id: mission.id,
                title: mission.subtitle,
                completedAt:
                    new Date().toISOString()
            });

            changed = true;
        }
    );

    missionHistory =
        missionHistory.slice(
            0,
            50
        );

    if (changed) {
        player.streak =
            Number(player.streak || 1) + 1;

        saveApplicationData();
    }
}


// ======================================================
// DASHBOARD
// ======================================================

function updateDashboard() {
    calculatePlayer();

    setText(
        DOM.xp,
        player.xp
    );

    setText(
        DOM.level,
        player.level
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
        `${player.streak || 1} Hari`
    );

    setText(
        DOM.achievementCount,
        unlockedAchievements.length
    );

    setText(
        DOM.completion,
        `${player.completed} / ${MISSION_LIST.length}`
    );

    const percentage =
        MISSION_LIST.length > 0
            ? Math.round(
                (
                    player.completed /
                    MISSION_LIST.length
                ) * 100
            )
            : 0;

    if (DOM.progress) {
        DOM.progress.value =
            percentage;
    }

    setText(
        DOM.percent,
        `${percentage}%`
    );

    if (DOM.dailyMission) {
        DOM.dailyMission.textContent =
            "Lengkapkan satu misi server hari ini.";
    }

    const studentName =
        localStorage.getItem(
            STORAGE_KEYS.studentName
        );

    if (DOM.profileName) {
        DOM.profileName.textContent =
            studentName || "AGENT";
    }

    if (DOM.masterPanel) {
        const completedAll =
            MISSION_LIST.length > 0 &&
            player.completed >=
                MISSION_LIST.length;

        DOM.masterPanel.classList.toggle(
            "hidden",
            !completedAll
        );

        if (completedAll) {
            localStorage.setItem(
                STORAGE_KEYS.masterUnlocked,
                "true"
            );
        }
    }

    saveApplicationData();
}


// ======================================================
// MISSION CARD ENGINE
// ======================================================

function createMissionCards() {
    if (!DOM.missions) {
        console.error(
            'SERVER HERO: Elemen id="missions" tidak dijumpai.'
        );

        return;
    }

    DOM.missions.innerHTML = "";

    if (MISSION_LIST.length === 0) {
        DOM.missions.innerHTML = `
            <article class="mission-card">
                <h2>Data misi tidak dijumpai</h2>
                <p>Semak fail missions.js dan susunan script dalam index.html.</p>
            </article>
        `;

        return;
    }

    MISSION_LIST.forEach(
        mission => {
            const completed =
                isMissionCompleted(
                    mission.id
                );

            const unlocked =
                isMissionUnlocked(
                    mission.id
                );

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "mission-card";

            card.dataset.missionId =
                String(
                    mission.id
                );

            if (completed) {
                card.classList.add(
                    "completed"
                );
            } else if (!unlocked) {
                card.classList.add(
                    "locked"
                );
            }

            const buttonLabel =
                completed
                    ? "Selesai"
                    : unlocked
                        ? "Mulakan Misi"
                        : "Terkunci";

            const statusIcon =
                completed
                    ? "✅"
                    : unlocked
                        ? "🔓"
                        : "🔒";

            card.innerHTML = `
                <div class="mission-header">
                    <div>
                        <h2>
                            ${escapeHTML(mission.icon)}
                            ${escapeHTML(mission.title)}
                        </h2>

                        <h4>
                            ${escapeHTML(mission.subtitle)}
                        </h4>
                    </div>

                    <span class="badge">
                        ${Number(mission.xp) || 0} XP
                    </span>
                </div>

                <p>
                    ${escapeHTML(mission.description)}
                </p>

                <div class="mission-info">
                    <span>
                        🎯 ${escapeHTML(mission.difficulty)}
                    </span>

                    <span>
                        ⏱ ${escapeHTML(mission.duration)}
                    </span>
                </div>

                <div class="mission-footer">
                    <span class="mission-status">
                        ${statusIcon}
                    </span>

                    <button
                        type="button"
                        ${
                            completed || !unlocked
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
                unlocked &&
                !completed
            ) {
                button.addEventListener(
                    "click",
                    () =>
                        openMission(
                            mission.id
                        )
                );
            }

            DOM.missions.appendChild(
                card
            );
        }
    );
}


// ======================================================
// MISSION NAVIGATION
// ======================================================

function openMission(missionId) {
    const mission =
        getMissionById(
            missionId
        );

    if (!mission) {
        showToast(
            "Misi tidak dijumpai.",
            "error"
        );

        return;
    }

    if (
        !isMissionUnlocked(
            missionId
        )
    ) {
        showToast(
            "Selesaikan misi sebelumnya dahulu.",
            "error"
        );

        return;
    }

    window.location.href =
        mission.page;
}


// ======================================================
// ACHIEVEMENTS
// ======================================================

function checkAchievements() {
    calculatePlayer();

    let changed = false;

    ACHIEVEMENTS.forEach(
        achievement => {
            if (
                player.completed >=
                    achievement.target &&
                !unlockedAchievements.includes(
                    achievement.id
                )
            ) {
                unlockedAchievements.push(
                    achievement.id
                );

                player.xp +=
                    achievement.rewardXP;

                changed = true;

                showToast(
                    `🏆 ${achievement.title} dibuka! +${achievement.rewardXP} XP`,
                    "success"
                );
            }
        }
    );

    if (changed) {
        calculatePlayer();
        saveApplicationData();
    }

    updateAchievementCards();
}

function updateAchievementCards() {
    document
        .querySelectorAll(
            ".achievement-card"
        )
        .forEach(
            card => {
                const achievementId =
                    card.dataset
                        .achievementId;

                if (!achievementId) {
                    return;
                }

                card.classList.toggle(
                    "unlocked",
                    unlockedAchievements.includes(
                        achievementId
                    )
                );
            }
        );
}


// ======================================================
// STUDENT LOGIN
// ======================================================

function showStudentLogin() {
    const savedName =
        localStorage.getItem(
            STORAGE_KEYS.studentName
        );

    if (savedName) {
        if (DOM.profileName) {
            DOM.profileName.textContent =
                savedName;
        }

        return;
    }

    const overlay =
        document.createElement(
            "div"
        );

    overlay.className =
        "student-login-overlay";

    overlay.innerHTML = `
        <form class="student-login-card">
            <div class="student-login-icon">
                👩‍💻
            </div>

            <h2>
                Selamat Datang ke SERVER HERO
            </h2>

            <p>
                Masukkan nama pelajar sebelum memulakan pembelajaran.
            </p>

            <label for="studentNameInput">
                Nama Pelajar
            </label>

            <input
                id="studentNameInput"
                type="text"
                maxlength="60"
                autocomplete="name"
                placeholder="Contoh: Nurul Farhana"
                required
            >

            <button type="submit">
                Mula Pembelajaran
            </button>

            <div
                class="student-login-error"
                aria-live="polite"
            ></div>
        </form>
    `;

    document.body.appendChild(
        overlay
    );

    const form =
        overlay.querySelector(
            "form"
        );

    const input =
        overlay.querySelector(
            "input"
        );

    const errorBox =
        overlay.querySelector(
            ".student-login-error"
        );

    form.addEventListener(
        "submit",
        event => {
            event.preventDefault();

            const name =
                input.value.trim();

            if (name.length < 2) {
                errorBox.textContent =
                    "Sila masukkan nama pelajar yang sah.";

                return;
            }

            localStorage.setItem(
                STORAGE_KEYS.studentName,
                name
            );

            player.name =
                name;

            saveApplicationData();

            if (DOM.profileName) {
                DOM.profileName.textContent =
                    name;
            }

            overlay.remove();
        }
    );

    setTimeout(
        () =>
            input.focus(),
        100
    );
}


// ======================================================
// EXPORT / IMPORT
// ======================================================

function exportSave() {
    const payload = {
        version: "5.2",
        exportedAt:
            new Date().toISOString(),
        studentName:
            localStorage.getItem(
                STORAGE_KEYS.studentName
            ) || "",
        player,
        achievements:
            unlockedAchievements,
        history:
            missionHistory,
        missions:
            MISSION_LIST.map(
                mission => ({
                    id:
                        mission.id,
                    completed:
                        isMissionCompleted(
                            mission.id
                        ),
                    rewarded:
                        isMissionRewarded(
                            mission.id
                        )
                })
            )
    };

    const blob =
        new Blob(
            [
                JSON.stringify(
                    payload,
                    null,
                    2
                )
            ],
            {
                type:
                    "application/json"
            }
        );

    const url =
        URL.createObjectURL(
            blob
        );

    const link =
        document.createElement(
            "a"
        );

    link.href =
        url;

    link.download =
        "server-hero-save.json";

    document.body.appendChild(
        link
    );

    link.click();
    link.remove();

    URL.revokeObjectURL(
        url
    );

    showToast(
        "Simpanan berjaya dieksport.",
        "success"
    );
}

function importSave() {
    const input =
        document.createElement(
            "input"
        );

    input.type =
        "file";

    input.accept =
        ".json,application/json";

    input.addEventListener(
        "change",
        async () => {
            const file =
                input.files?.[0];

            if (!file) {
                return;
            }

            try {
                const data =
                    JSON.parse(
                        await file.text()
                    );

                player = {
                    ...DEFAULT_PLAYER,
                    ...(data.player || {})
                };

                unlockedAchievements =
                    Array.isArray(
                        data.achievements
                    )
                        ? data.achievements
                        : [];

                missionHistory =
                    Array.isArray(
                        data.history
                    )
                        ? data.history
                        : [];

                if (data.studentName) {
                    localStorage.setItem(
                        STORAGE_KEYS.studentName,
                        String(data.studentName)
                    );
                }

                if (
                    Array.isArray(
                        data.missions
                    )
                ) {
                    data.missions.forEach(
                        savedMission => {
                            const id =
                                Number(
                                    savedMission.id
                                );

                            if (
                                !Number.isInteger(id) ||
                                id < 1 ||
                                id > MISSION_LIST.length
                            ) {
                                return;
                            }

                            localStorage.setItem(
                                missionCompleteKey(id),
                                savedMission.completed
                                    ? "true"
                                    : "false"
                            );

                            localStorage.setItem(
                                missionRewardKey(id),
                                savedMission.rewarded
                                    ? "true"
                                    : "false"
                            );
                        }
                    );
                }

                saveApplicationData();

                window.location.reload();
            } catch (error) {
                console.error(
                    error
                );

                window.alert(
                    "Fail simpanan tidak sah."
                );
            }
        }
    );

    input.click();
}


// ======================================================
// RESET
// ======================================================

function resetProgress() {
    const confirmed =
        window.confirm(
            "Padam semua kemajuan, XP dan nama pelajar?"
        );

    if (!confirmed) {
        return;
    }

    MISSION_LIST.forEach(
        mission => {
            localStorage.removeItem(
                missionCompleteKey(
                    mission.id
                )
            );

            localStorage.removeItem(
                missionRewardKey(
                    mission.id
                )
            );
        }
    );

    Object.values(
        STORAGE_KEYS
    ).forEach(
        key =>
            localStorage.removeItem(
                key
            )
    );

    window.location.reload();
}


// ======================================================
// UI NOTIFICATION
// ======================================================

function showToast(
    message,
    type = "info"
) {
    const existing =
        document.querySelector(
            ".toast"
        );

    if (existing) {
        existing.remove();
    }

    const toast =
        document.createElement(
            "div"
        );

    toast.className =
        `toast ${type}`;

    toast.textContent =
        message;

    document.body.appendChild(
        toast
    );

    requestAnimationFrame(
        () =>
            toast.classList.add(
                "show"
            )
    );

    setTimeout(
        () =>
            toast.classList.remove(
                "show"
            ),
        2600
    );

    setTimeout(
        () =>
            toast.remove(),
        3200
    );
}


// ======================================================
// GLOBAL API
// ======================================================

window.openMission =
    openMission;

window.exportSave =
    exportSave;

window.importSave =
    importSave;

window.resetProgress =
    resetProgress;

window.SERVER_HERO = {
    version: "5.2",

    getPlayer() {
        return {
            ...player
        };
    },

    refresh() {
        synchronizeMissionRewards();
        checkAchievements();
        updateDashboard();
        createMissionCards();
    }
};


// ======================================================
// INITIALIZATION
// ======================================================

function initializeServerHero() {
    synchronizeMissionRewards();
    checkAchievements();
    updateDashboard();
    createMissionCards();
    showStudentLogin();

    console.log(
        `SERVER HERO V5.2 READY - ${MISSION_LIST.length} MISI`
    );
}

initializeServerHero();

// ======================================================
// SERVER HERO PREMIUM V5.3
// app.js - STANDALONE DASHBOARD
// 13 MISSIONS + STUDENT LOGIN + REPORT + CERTIFICATE
// ======================================================

"use strict";

const MISSION_LIST = Array.isArray(window.missions)
    ? window.missions
    : [];

const STORAGE = Object.freeze({
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
    { id: "first-mission", title: "Misi Pertama", target: 1, rewardXP: 100 },
    { id: "server-explorer", title: "Server Explorer", target: 3, rewardXP: 250 },
    { id: "server-specialist", title: "Server Specialist", target: 5, rewardXP: 400 },
    { id: "server-hero", title: "Server Hero", target: 8, rewardXP: 800 },
    { id: "server-master", title: "Server Hero Master", target: 13, rewardXP: 1500 }
]);

function readJSON(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

let player = {
    ...DEFAULT_PLAYER,
    ...readJSON(STORAGE.player, {})
};

let unlockedAchievements = readJSON(STORAGE.achievements, []);
if (!Array.isArray(unlockedAchievements)) unlockedAchievements = [];

let missionHistory = readJSON(STORAGE.history, []);
if (!Array.isArray(missionHistory)) missionHistory = [];

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
    studentDisplayName: document.getElementById("studentDisplayName")
});

function escapeHTML(value) {
    const div = document.createElement("div");
    div.textContent = String(value ?? "");
    return div.innerHTML;
}

function completeKey(id) {
    return `lesson${Number(id)}Complete`;
}

function rewardedKey(id) {
    return `lesson${Number(id)}RewardedV4`;
}

function isCompleted(id) {
    return localStorage.getItem(completeKey(id)) === "true";
}

function isRewarded(id) {
    return localStorage.getItem(rewardedKey(id)) === "true";
}

function isUnlocked(id) {
    const missionId = Number(id);
    return missionId === 1 || isCompleted(missionId - 1);
}

function completedCount() {
    return MISSION_LIST.filter(mission => isCompleted(mission.id)).length;
}

function calculatePlayer() {
    player.completed = completedCount();
    player.level = Math.max(1, Math.floor(Number(player.xp || 0) / 500));

    if (MISSION_LIST.length > 0 && player.completed >= MISSION_LIST.length) {
        player.rank = "SERVER HERO MASTER";
    } else if (player.xp >= 9000) {
        player.rank = "Master";
    } else if (player.xp >= 6500) {
        player.rank = "Elite";
    } else if (player.xp >= 4000) {
        player.rank = "Professional";
    } else if (player.xp >= 2000) {
        player.rank = "Advanced";
    } else {
        player.rank = "Beginner";
    }
}

function saveData() {
    writeJSON(STORAGE.player, player);
    writeJSON(STORAGE.achievements, unlockedAchievements);
    writeJSON(STORAGE.history, missionHistory);
}

function synchronizeRewards() {
    let changed = false;

    MISSION_LIST.forEach(mission => {
        if (!isCompleted(mission.id) || isRewarded(mission.id)) return;

        player.xp += Number(mission.xp) || 0;
        localStorage.setItem(rewardedKey(mission.id), "true");

        missionHistory.unshift({
            id: mission.id,
            title: mission.subtitle,
            completedAt: new Date().toISOString()
        });

        changed = true;
    });

    missionHistory = missionHistory.slice(0, 50);

    if (changed) {
        player.streak = Number(player.streak || 1) + 1;
        saveData();
    }
}

function checkAchievements() {
    calculatePlayer();
    let changed = false;

    ACHIEVEMENTS.forEach(achievement => {
        if (
            player.completed >= achievement.target &&
            !unlockedAchievements.includes(achievement.id)
        ) {
            unlockedAchievements.push(achievement.id);
            player.xp += achievement.rewardXP;
            changed = true;
        }
    });

    if (changed) saveData();

    document.querySelectorAll(".achievement-card").forEach(card => {
        card.classList.toggle(
            "unlocked",
            unlockedAchievements.includes(card.dataset.achievementId)
        );
    });
}

function updateDashboard() {
    calculatePlayer();

    const name = localStorage.getItem(STORAGE.studentName) || "AGENT";
    player.name = name;

    if (DOM.studentDisplayName) DOM.studentDisplayName.textContent = name;
    if (DOM.xp) DOM.xp.textContent = player.xp;
    if (DOM.level) DOM.level.textContent = player.level;
    if (DOM.rank) DOM.rank.textContent = player.rank;
    if (DOM.rankText) DOM.rankText.textContent = player.rank;
    if (DOM.streak) DOM.streak.textContent = `${player.streak || 1} Hari`;
    if (DOM.achievementCount) DOM.achievementCount.textContent = unlockedAchievements.length;
    if (DOM.completion) DOM.completion.textContent = `${player.completed} / ${MISSION_LIST.length}`;

    const percentage = MISSION_LIST.length
        ? Math.round((player.completed / MISSION_LIST.length) * 100)
        : 0;

    if (DOM.progress) DOM.progress.value = percentage;
    if (DOM.percent) DOM.percent.textContent = `${percentage}%`;

    if (DOM.dailyMission) {
        DOM.dailyMission.textContent = "Lengkapkan satu misi server hari ini.";
    }

    if (DOM.masterPanel) {
        const completeAll = MISSION_LIST.length > 0 && player.completed >= MISSION_LIST.length;
        DOM.masterPanel.classList.toggle("hidden", !completeAll);

        if (completeAll) {
            localStorage.setItem(STORAGE.masterUnlocked, "true");
        }
    }

    saveData();
}

function createMissionCards() {
    if (!DOM.missions) return;

    DOM.missions.innerHTML = "";

    if (!MISSION_LIST.length) {
        DOM.missions.innerHTML = `
            <article class="mission-card">
                <h2>Data misi tidak dijumpai</h2>
                <p>Semak missions.js. Pastikan fail itu dimuatkan sebelum app.js.</p>
            </article>
        `;
        return;
    }

    MISSION_LIST.forEach(mission => {
        const completed = isCompleted(mission.id);
        const unlocked = isUnlocked(mission.id);
        const card = document.createElement("article");

        card.className = "mission-card";
        card.dataset.missionId = String(mission.id);

        if (completed) card.classList.add("completed");
        else if (!unlocked) card.classList.add("locked");

        const buttonLabel = completed
            ? "Selesai"
            : unlocked
                ? "Mulakan Misi"
                : "Terkunci";

        const statusIcon = completed
            ? "✅"
            : unlocked
                ? "🔓"
                : "🔒";

        card.innerHTML = `
            <div class="mission-header">
                <div>
                    <h2>${escapeHTML(mission.icon)} ${escapeHTML(mission.title)}</h2>
                    <h4>${escapeHTML(mission.subtitle)}</h4>
                </div>
                <span class="badge">${Number(mission.xp) || 0} XP</span>
            </div>

            <p>${escapeHTML(mission.description)}</p>

            <div class="mission-info">
                <span>🎯 ${escapeHTML(mission.difficulty)}</span>
                <span>⏱ ${escapeHTML(mission.duration)}</span>
            </div>

            <div class="mission-footer">
                <span class="mission-status">${statusIcon}</span>
                <button type="button" ${completed || !unlocked ? "disabled" : ""}>
                    ${buttonLabel}
                </button>
            </div>
        `;

        const button = card.querySelector("button");

        if (button && unlocked && !completed) {
            button.addEventListener("click", () => {
                window.location.href = mission.page;
            });
        }

        DOM.missions.appendChild(card);
    });
}

function showStudentLogin() {
    if (localStorage.getItem(STORAGE.studentName)) return;

    const overlay = document.createElement("div");
    overlay.className = "student-login-overlay";

    overlay.innerHTML = `
        <form class="student-login-card">
            <div class="student-login-icon">👩‍💻</div>
            <h2>Selamat Datang ke SERVER HERO</h2>
            <p>Masukkan nama pelajar sebelum memulakan pembelajaran.</p>

            <label for="studentNameInput">Nama Pelajar</label>

            <input
                id="studentNameInput"
                type="text"
                maxlength="60"
                placeholder="Contoh: Nurul Farhana"
                autocomplete="name"
                required
            >

            <button type="submit">Mula Pembelajaran</button>
            <div class="student-login-error" aria-live="polite"></div>
        </form>
    `;

    document.body.appendChild(overlay);

    const form = overlay.querySelector("form");
    const input = overlay.querySelector("input");
    const errorBox = overlay.querySelector(".student-login-error");

    form.addEventListener("submit", event => {
        event.preventDefault();

        const name = input.value.trim();

        if (name.length < 2) {
            errorBox.textContent = "Sila masukkan nama pelajar yang sah.";
            return;
        }

        localStorage.setItem(STORAGE.studentName, name);
        player.name = name;
        saveData();

        if (DOM.studentDisplayName) {
            DOM.studentDisplayName.textContent = name;
        }

        overlay.remove();
    });

    setTimeout(() => input.focus(), 100);
}

function openPlayerReport() {
    calculatePlayer();

    const reportWindow = window.open("", "_blank");

    if (!reportWindow) {
        alert("Benarkan pop-up untuk membuka laporan.");
        return;
    }

    const completedMissions = MISSION_LIST
        .filter(mission => isCompleted(mission.id))
        .map(mission => `<li>${escapeHTML(mission.title)} — ${escapeHTML(mission.subtitle)}</li>`)
        .join("");

    reportWindow.document.write(`
        <!DOCTYPE html>
        <html lang="ms">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Laporan Kemajuan SERVER HERO</title>
            <style>
                body{font-family:Arial,sans-serif;padding:32px;color:#111827}
                h1{color:#1d4ed8}
                .summary{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin:22px 0}
                .card{padding:15px;border:1px solid #d1d5db;border-radius:12px}
                li{margin-bottom:8px}
                button{padding:12px 18px;border:0;border-radius:10px;background:#1d4ed8;color:white;font-weight:bold}
                @media print{button{display:none}}
            </style>
        </head>
        <body>
            <h1>Laporan Kemajuan SERVER HERO</h1>
            <p><strong>Nama Pelajar:</strong> ${escapeHTML(player.name)}</p>

            <div class="summary">
                <div class="card"><strong>XP:</strong> ${player.xp}</div>
                <div class="card"><strong>Level:</strong> ${player.level}</div>
                <div class="card"><strong>Pangkat:</strong> ${escapeHTML(player.rank)}</div>
                <div class="card"><strong>Misi Selesai:</strong> ${player.completed} / ${MISSION_LIST.length}</div>
            </div>

            <h2>Senarai Misi Selesai</h2>
            <ol>${completedMissions || "<li>Belum ada misi selesai.</li>"}</ol>

            <button onclick="window.print()">Cetak Laporan</button>
        </body>
        </html>
    `);

    reportWindow.document.close();
}

function openCertificate() {
    calculatePlayer();

    if (player.completed < MISSION_LIST.length) {
        alert(`Sijil hanya boleh dijana selepas semua ${MISSION_LIST.length} misi selesai.`);
        return;
    }

    const certificateWindow = window.open("", "_blank");

    if (!certificateWindow) {
        alert("Benarkan pop-up untuk membuka sijil.");
        return;
    }

    certificateWindow.document.write(`
        <!DOCTYPE html>
        <html lang="ms">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sijil SERVER HERO MASTER</title>
            <style>
                body{margin:0;background:#eef2ff;font-family:Georgia,serif;padding:30px}
                .certificate{max-width:1000px;margin:auto;padding:70px;border:14px double #1d4ed8;background:white;text-align:center}
                h1{font-size:48px;color:#1d4ed8;margin:10px 0}
                h2{font-size:38px;margin:25px 0;color:#7c3aed}
                p{font-size:20px;line-height:1.7}
                .badge{font-size:70px}
                button{margin-top:30px;padding:12px 20px;border:0;border-radius:10px;background:#1d4ed8;color:white;font-weight:bold}
                @media print{body{background:white;padding:0}.certificate{border-width:10px}button{display:none}}
            </style>
        </head>
        <body>
            <section class="certificate">
                <div class="badge">👑</div>
                <h1>SIJIL TAMAT</h1>
                <p>Dengan ini diperakui bahawa</p>
                <h2>${escapeHTML(player.name)}</h2>
                <p>telah berjaya menamatkan semua 13 misi</p>
                <p><strong>SERVER HERO PREMIUM — Windows Server 2019</strong></p>
                <p>dan menerima gelaran</p>
                <h2>SERVER HERO MASTER</h2>
                <button onclick="window.print()">Cetak Sijil</button>
            </section>
        </body>
        </html>
    `);

    certificateWindow.document.close();
}

function exportSave() {
    const data = {
        version: "5.3",
        studentName: localStorage.getItem(STORAGE.studentName) || "",
        player,
        achievements: unlockedAchievements,
        history: missionHistory,
        missions: MISSION_LIST.map(mission => ({
            id: mission.id,
            completed: isCompleted(mission.id),
            rewarded: isRewarded(mission.id)
        }))
    };

    const blob = new Blob(
        [JSON.stringify(data, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "server-hero-save.json";
    link.click();

    URL.revokeObjectURL(url);
}

function importSave() {
    const input = document.createElement("input");

    input.type = "file";
    input.accept = ".json,application/json";

    input.addEventListener("change", async () => {
        const file = input.files?.[0];
        if (!file) return;

        try {
            const data = JSON.parse(await file.text());

            player = {
                ...DEFAULT_PLAYER,
                ...(data.player || {})
            };

            unlockedAchievements = Array.isArray(data.achievements)
                ? data.achievements
                : [];

            missionHistory = Array.isArray(data.history)
                ? data.history
                : [];

            if (data.studentName) {
                localStorage.setItem(STORAGE.studentName, String(data.studentName));
            }

            if (Array.isArray(data.missions)) {
                data.missions.forEach(item => {
                    localStorage.setItem(
                        completeKey(item.id),
                        item.completed ? "true" : "false"
                    );

                    localStorage.setItem(
                        rewardedKey(item.id),
                        item.rewarded ? "true" : "false"
                    );
                });
            }

            saveData();
            location.reload();
        } catch {
            alert("Fail simpanan tidak sah.");
        }
    });

    input.click();
}

function resetProgress() {
    if (!confirm("Padam semua kemajuan, XP dan nama pelajar?")) return;

    MISSION_LIST.forEach(mission => {
        localStorage.removeItem(completeKey(mission.id));
        localStorage.removeItem(rewardedKey(mission.id));
    });

    Object.values(STORAGE).forEach(key => localStorage.removeItem(key));
    location.reload();
}

window.openPlayerReport = openPlayerReport;
window.openCertificate = openCertificate;
window.exportSave = exportSave;
window.importSave = importSave;
window.resetProgress = resetProgress;

window.SERVER_HERO = {
    version: "5.3",
    getPlayer: () => ({ ...player }),
    refresh() {
        synchronizeRewards();
        checkAchievements();
        updateDashboard();
        createMissionCards();
    }
};

function initialize() {
    synchronizeRewards();
    checkAchievements();
    updateDashboard();
    createMissionCards();
    showStudentLogin();

    console.log(`SERVER HERO V5.3 READY — ${MISSION_LIST.length} MISI`);
}

initialize();

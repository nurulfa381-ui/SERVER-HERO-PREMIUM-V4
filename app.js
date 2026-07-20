// ======================================================
// SERVER HERO PREMIUM V4.0
// app.js - CORE UI CONTROLLER
// ======================================================

"use strict";

const DOM = {
    missions: document.getElementById("missions"),
    xp: document.getElementById("xp"),
    level: document.getElementById("level"),
    coins: document.getElementById("coins"),
    gems: document.getElementById("gems"),
    rank: document.getElementById("rank"),
    rankText: document.getElementById("rankText"),
    streak: document.getElementById("streak"),
    achievementCount: document.getElementById("achievementCount"),
    completion: document.getElementById("completion"),
    progress: document.getElementById("progress"),
    percent: document.getElementById("percent"),
    dailyMission: document.getElementById("dailyMission")
};

function setText(element, value) {
    if (element) element.textContent = String(value);
}

function escapeHTML(value) {
    const node = document.createElement("div");
    node.textContent = value == null ? "" : String(value);
    return node.innerHTML;
}

function showToast(message, type = "info") {
    document.querySelector(".toast")?.remove();

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => toast.classList.remove("show"), 2800);
    setTimeout(() => toast.remove(), 3400);
}

function updateDailyMission() {
    if (!DOM.dailyMission) return;

    const messages = [
        "Complete one server lesson today.",
        "Answer one mission quiz correctly.",
        "Earn at least 250 XP today.",
        "Review one completed mission.",
        "Open a new Windows Server lesson."
    ];

    DOM.dailyMission.textContent =
        messages[new Date().getDate() % messages.length];
}

function updateDashboard() {
    const player = SERVER_HERO_PLAYER.getDashboardData();
    const progressData = SERVER_HERO_MISSION_ENGINE.getProgress();

    setText(DOM.xp, player.xp);
    setText(DOM.level, player.level);
    setText(DOM.coins, player.coins);
    setText(DOM.gems, player.gems);
    setText(DOM.rank, player.rank);
    setText(DOM.rankText, player.rank);
    setText(DOM.streak, `${player.streak} Day`);
    setText(DOM.achievementCount, 0);
    setText(
        DOM.completion,
        `${progressData.completed} / ${progressData.total}`
    );
    setText(DOM.percent, `${progressData.percentage}%`);

    if (DOM.progress) DOM.progress.value = progressData.percentage;

    updateDailyMission();
}

function createMissionCards() {
    if (!DOM.missions) return;

    DOM.missions.innerHTML = "";

    SERVER_HERO_MISSION_ENGINE.getAll().forEach((mission) => {
        const card = document.createElement("article");
        card.className = "mission-card";

        if (mission.completed) card.classList.add("completed");
        else if (!mission.unlocked) card.classList.add("locked");

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
                <button type="button" ${
                    mission.completed || !mission.unlocked ? "disabled" : ""
                }>
                    ${
                        mission.completed
                            ? "Completed"
                            : mission.unlocked
                                ? "Start Mission"
                                : "Locked"
                    }
                </button>
            </div>
        `;

        const button = card.querySelector("button");

        if (button && mission.unlocked && !mission.completed) {
            button.addEventListener("click", () => {
                SERVER_HERO_MISSION_ENGINE.open(mission.id);
            });
        }

        DOM.missions.appendChild(card);
    });
}

function buyItem() {
    showToast("Shop engine akan ditambah pada langkah seterusnya.", "info");
}

function exportSave() {
    const data = {
        player: SERVER_HERO_PLAYER.exportData(),
        missions: SERVER_HERO_MISSION_ENGINE.getAll()
    };

    SERVER_HERO_STORAGE.write(
        SERVER_HERO_STORAGE.keys.exportSave,
        data
    );

    showToast("Save disimpan dalam browser.", "success");
}

function importSave() {
    showToast("Import engine akan ditambah pada langkah seterusnya.", "info");
}

function resetProgress() {
    if (!confirm("Padam semua kemajuan SERVER HERO?")) return;

    SERVER_HERO_STORAGE.clearAll();
    SERVER_HERO_PLAYER.reset();
    location.reload();
}

window.buyItem = buyItem;
window.exportSave = exportSave;
window.importSave = importSave;
window.resetProgress = resetProgress;

window.addEventListener("serverhero:mission-completed", () => {
    updateDashboard();
    createMissionCards();
    showToast("Mission completed!", "success");
});

updateDashboard();
createMissionCards();

console.log("APP CONTROLLER READY");

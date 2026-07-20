// ======================================================
// SERVER HERO PREMIUM V4.0
// player-engine.js
// ======================================================

"use strict";

if (!window.SERVER_HERO_STORAGE) {
    throw new Error("storage-engine.js mesti dimuatkan sebelum player-engine.js.");
}

const DEFAULT_PLAYER = {
    name: "AGENT",
    xp: 500,
    level: 1,
    coins: 100,
    gems: 10,
    completed: 0,
    streak: 1,
    rank: "Beginner"
};

let PLAYER = SERVER_HERO_STORAGE.readObject(
    SERVER_HERO_STORAGE.keys.player,
    DEFAULT_PLAYER
);

function calculatePlayerLevel() {
    PLAYER.level = Math.max(1, Math.floor(PLAYER.xp / 500));
    return PLAYER.level;
}

function calculatePlayerRank() {
    if (PLAYER.xp >= 10000) PLAYER.rank = "Legend";
    else if (PLAYER.xp >= 7000) PLAYER.rank = "Master";
    else if (PLAYER.xp >= 5000) PLAYER.rank = "Elite";
    else if (PLAYER.xp >= 3000) PLAYER.rank = "Professional";
    else if (PLAYER.xp >= 1500) PLAYER.rank = "Advanced";
    else PLAYER.rank = "Beginner";

    return PLAYER.rank;
}

function countCompletedMissions() {
    if (!Array.isArray(window.missions)) {
        PLAYER.completed = 0;
        return 0;
    }

    PLAYER.completed = window.missions.filter((mission) =>
        SERVER_HERO_STORAGE.isMissionCompleted(mission.id)
    ).length;

    return PLAYER.completed;
}

function savePlayer() {
    SERVER_HERO_STORAGE.write(
        SERVER_HERO_STORAGE.keys.player,
        PLAYER
    );
}

function refreshPlayer() {
    countCompletedMissions();
    calculatePlayerLevel();
    calculatePlayerRank();
    savePlayer();
    return { ...PLAYER };
}

function resetPlayer() {
    PLAYER = { ...DEFAULT_PLAYER };
    savePlayer();
    return { ...PLAYER };
}

function addXP(amount) {
    PLAYER.xp += Math.max(0, Number(amount) || 0);
    calculatePlayerLevel();
    calculatePlayerRank();
    savePlayer();
    return PLAYER.xp;
}

function addCoins(amount) {
    PLAYER.coins += Math.max(0, Number(amount) || 0);
    savePlayer();
    return PLAYER.coins;
}

function removeCoins(amount) {
    const safeAmount = Math.max(0, Number(amount) || 0);
    if (PLAYER.coins < safeAmount) return false;

    PLAYER.coins -= safeAmount;
    savePlayer();
    return true;
}

function addGems(amount) {
    PLAYER.gems += Math.max(0, Number(amount) || 0);
    savePlayer();
    return PLAYER.gems;
}

function increaseStreak() {
    PLAYER.streak += 1;
    savePlayer();
    return PLAYER.streak;
}

function setPlayerName(name) {
    const cleanName = String(name || "").trim().slice(0, 30);
    if (!cleanName) return false;

    PLAYER.name = cleanName;
    savePlayer();
    return true;
}

function importPlayerData(data) {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
        return false;
    }

    PLAYER = { ...DEFAULT_PLAYER, ...data };
    refreshPlayer();
    return true;
}

function exportPlayerData() {
    refreshPlayer();
    return { ...PLAYER };
}

function getPlayerDashboardData() {
    refreshPlayer();

    const totalMissions = Array.isArray(window.missions)
        ? window.missions.length
        : 0;

    const percentage = totalMissions
        ? Math.round((PLAYER.completed / totalMissions) * 100)
        : 0;

    return { ...PLAYER, totalMissions, percentage };
}

window.SERVER_HERO_PLAYER = {
    defaults: DEFAULT_PLAYER,
    get: () => ({ ...PLAYER }),
    refresh: refreshPlayer,
    save: savePlayer,
    reset: resetPlayer,
    addXP,
    addCoins,
    removeCoins,
    addGems,
    increaseStreak,
    setName: setPlayerName,
    importData: importPlayerData,
    exportData: exportPlayerData,
    getDashboardData: getPlayerDashboardData,
    countCompletedMissions,
    calculateLevel: calculatePlayerLevel,
    calculateRank: calculatePlayerRank
};

refreshPlayer();
console.log("PLAYER ENGINE READY");

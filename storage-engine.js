// ======================================================
// SERVER HERO PREMIUM V4.0
// storage-engine.js
// ======================================================

"use strict";

const STORAGE_KEYS = {
    player: "serverHeroPlayerV4",
    achievements: "serverHeroAchievementsV4",
    inventory: "serverHeroInventoryV4",
    exportSave: "serverHeroExportSaveV4",
    history: "serverHeroMissionHistoryV4",
    dailyBonus: "serverHeroDailyBonusV4",
    doubleXP: "serverHeroDoubleXPV4",
    goldenBadge: "serverHeroGoldenBadgeV4"
};

function readStorageObject(key, fallback = {}) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return { ...fallback };

        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
            return { ...fallback };
        }

        return { ...fallback, ...parsed };
    } catch (error) {
        console.error(`Failed to read ${key}:`, error);
        return { ...fallback };
    }
}

function readStorageArray(key) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return [];

        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error(`Failed to read ${key}:`, error);
        return [];
    }
}

function writeStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Failed to save ${key}:`, error);
        return false;
    }
}

function removeStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Failed to remove ${key}:`, error);
        return false;
    }
}

function getMissionCompleteKey(id) {
    return `lesson${id}Complete`;
}

function getMissionRewardKey(id) {
    return `lesson${id}RewardedV4`;
}

function getMissionUnlockKey(id) {
    return `lesson${id}Unlocked`;
}

function isMissionCompleted(id) {
    return localStorage.getItem(getMissionCompleteKey(id)) === "true";
}

function isMissionRewarded(id) {
    return localStorage.getItem(getMissionRewardKey(id)) === "true";
}

function isMissionUnlocked(id) {
    return Number(id) === 1 || isMissionCompleted(Number(id) - 1);
}

function setMissionCompleted(id) {
    localStorage.setItem(getMissionCompleteKey(id), "true");
}

function setMissionRewarded(id) {
    localStorage.setItem(getMissionRewardKey(id), "true");
}

function setMissionUnlocked(id) {
    localStorage.setItem(getMissionUnlockKey(id), "true");
}

function clearMissionStorage() {
    if (!Array.isArray(window.missions)) return;

    window.missions.forEach((mission) => {
        removeStorage(getMissionCompleteKey(mission.id));
        removeStorage(getMissionRewardKey(mission.id));
        removeStorage(getMissionUnlockKey(mission.id));
    });
}

function clearServerHeroStorage() {
    Object.values(STORAGE_KEYS).forEach(removeStorage);
    clearMissionStorage();
}

window.SERVER_HERO_STORAGE = {
    keys: STORAGE_KEYS,
    readObject: readStorageObject,
    readArray: readStorageArray,
    write: writeStorage,
    remove: removeStorage,
    clearAll: clearServerHeroStorage,
    clearMissions: clearMissionStorage,
    getMissionCompleteKey,
    getMissionRewardKey,
    getMissionUnlockKey,
    isMissionCompleted,
    isMissionRewarded,
    isMissionUnlocked,
    setMissionCompleted,
    setMissionRewarded,
    setMissionUnlocked
};

console.log("STORAGE ENGINE READY");

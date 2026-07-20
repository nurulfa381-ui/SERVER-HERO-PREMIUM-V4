// ======================================================
// SERVER HERO PREMIUM V4.0
// storage-engine.js
// FULL STABLE VERSION
// ======================================================

"use strict";

const STORAGE_KEYS = Object.freeze({
    player: "serverHeroPlayerV4",
    achievements: "serverHeroAchievementsV4",
    inventory: "serverHeroInventoryV4",
    missionHistory: "serverHeroMissionHistoryV4",
    exportSave: "serverHeroExportSaveV4",
    dailyBonus: "serverHeroDailyBonusV4",
    doubleXP: "serverHeroDoubleXPV4",
    goldenBadge: "serverHeroGoldenBadgeV4",
    extraLife: "serverHeroExtraLifeV4",
    settings: "serverHeroSettingsV4",
    analytics: "serverHeroAnalyticsV4"
});

function isPlainObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function readRawStorage(key) {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.error(`Unable to read storage key "${key}".`, error);
        return null;
    }
}

function writeRawStorage(key, value) {
    try {
        localStorage.setItem(key, String(value));
        return true;
    } catch (error) {
        console.error(`Unable to write storage key "${key}".`, error);
        return false;
    }
}

function readStorageObject(key, fallback = {}) {
    const safeFallback = isPlainObject(fallback) ? fallback : {};

    try {
        const rawValue = localStorage.getItem(key);
        if (!rawValue) return { ...safeFallback };

        const parsedValue = JSON.parse(rawValue);
        if (!isPlainObject(parsedValue)) return { ...safeFallback };

        return { ...safeFallback, ...parsedValue };
    } catch (error) {
        console.error(`Unable to read object "${key}".`, error);
        return { ...safeFallback };
    }
}

function readStorageArray(key, fallback = []) {
    const safeFallback = Array.isArray(fallback) ? fallback : [];

    try {
        const rawValue = localStorage.getItem(key);
        if (!rawValue) return [...safeFallback];

        const parsedValue = JSON.parse(rawValue);
        return Array.isArray(parsedValue) ? parsedValue : [...safeFallback];
    } catch (error) {
        console.error(`Unable to read array "${key}".`, error);
        return [...safeFallback];
    }
}

function writeStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Unable to save "${key}".`, error);
        return false;
    }
}

function removeStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Unable to remove "${key}".`, error);
        return false;
    }
}

function hasStorageKey(key) {
    return readRawStorage(key) !== null;
}

function getMissionCompleteKey(missionId) {
    return `lesson${Number(missionId)}Complete`;
}

function getMissionRewardKey(missionId) {
    return `lesson${Number(missionId)}RewardedV4`;
}

function getMissionUnlockKey(missionId) {
    return `lesson${Number(missionId)}Unlocked`;
}

function getMissionQuizKey(missionId) {
    return `lesson${Number(missionId)}QuizPassedV4`;
}

function isMissionCompleted(missionId) {
    return localStorage.getItem(getMissionCompleteKey(missionId)) === "true";
}

function isMissionRewarded(missionId) {
    return localStorage.getItem(getMissionRewardKey(missionId)) === "true";
}

function isMissionExplicitlyUnlocked(missionId) {
    return localStorage.getItem(getMissionUnlockKey(missionId)) === "true";
}

function isMissionQuizPassed(missionId) {
    return localStorage.getItem(getMissionQuizKey(missionId)) === "true";
}

function isMissionUnlocked(missionId) {
    const numericMissionId = Number(missionId);

    if (!Number.isInteger(numericMissionId) || numericMissionId < 1) {
        return false;
    }

    if (numericMissionId === 1) return true;
    if (isMissionExplicitlyUnlocked(numericMissionId)) return true;

    return isMissionCompleted(numericMissionId - 1);
}

function setMissionCompleted(missionId, completed = true) {
    const key = getMissionCompleteKey(missionId);
    return completed ? writeRawStorage(key, "true") : removeStorage(key);
}

function setMissionRewarded(missionId, rewarded = true) {
    const key = getMissionRewardKey(missionId);
    return rewarded ? writeRawStorage(key, "true") : removeStorage(key);
}

function setMissionUnlocked(missionId, unlocked = true) {
    const key = getMissionUnlockKey(missionId);
    return unlocked ? writeRawStorage(key, "true") : removeStorage(key);
}

function setMissionQuizPassed(missionId, passed = true) {
    const key = getMissionQuizKey(missionId);
    return passed ? writeRawStorage(key, "true") : removeStorage(key);
}

function getMissionStorageStatus(missionId) {
    return {
        id: Number(missionId),
        completed: isMissionCompleted(missionId),
        rewarded: isMissionRewarded(missionId),
        unlocked: isMissionUnlocked(missionId),
        quizPassed: isMissionQuizPassed(missionId)
    };
}

function getAllMissionStorageStatus() {
    if (!Array.isArray(window.missions)) return [];

    return window.missions.map((mission) =>
        getMissionStorageStatus(mission.id)
    );
}

function clearMissionStorageById(missionId) {
    [
        getMissionCompleteKey(missionId),
        getMissionRewardKey(missionId),
        getMissionUnlockKey(missionId),
        getMissionQuizKey(missionId)
    ].forEach(removeStorage);

    return true;
}

function clearMissionStorage() {
    if (Array.isArray(window.missions)) {
        window.missions.forEach((mission) => {
            clearMissionStorageById(mission.id);
        });
        return true;
    }

    for (let missionId = 1; missionId <= 50; missionId++) {
        clearMissionStorageById(missionId);
    }

    return true;
}

function exportAllStorage() {
    const exportedData = {};

    try {
        for (let index = 0; index < localStorage.length; index++) {
            const key = localStorage.key(index);

            if (
                !key ||
                (!key.startsWith("serverHero") && !key.startsWith("lesson"))
            ) {
                continue;
            }

            exportedData[key] = localStorage.getItem(key);
        }
    } catch (error) {
        console.error("Unable to export storage.", error);
    }

    return {
        version: "4.0",
        exportedAt: new Date().toISOString(),
        data: exportedData
    };
}

function importAllStorage(packageData) {
    if (!isPlainObject(packageData) || !isPlainObject(packageData.data)) {
        return false;
    }

    try {
        Object.entries(packageData.data).forEach(([key, value]) => {
            if (typeof value === "string") {
                localStorage.setItem(key, value);
            }
        });

        return true;
    } catch (error) {
        console.error("Unable to import storage.", error);
        return false;
    }
}

function clearServerHeroStorage() {
    Object.values(STORAGE_KEYS).forEach(removeStorage);
    clearMissionStorage();
    return true;
}

function runStorageHealthCheck() {
    const testKey = "serverHeroStorageHealthCheck";
    const testValue = String(Date.now());

    const writeSuccess = writeRawStorage(testKey, testValue);
    const readSuccess = readRawStorage(testKey) === testValue;

    removeStorage(testKey);

    return {
        available: writeSuccess && readSuccess,
        localStorageLength: localStorage.length
    };
}

window.SERVER_HERO_STORAGE = {
    version: "4.0",
    keys: STORAGE_KEYS,
    readRaw: readRawStorage,
    writeRaw: writeRawStorage,
    readObject: readStorageObject,
    readArray: readStorageArray,
    write: writeStorage,
    remove: removeStorage,
    has: hasStorageKey,
    getMissionCompleteKey,
    getMissionRewardKey,
    getMissionUnlockKey,
    getMissionQuizKey,
    isMissionCompleted,
    isMissionRewarded,
    isMissionUnlocked,
    isMissionQuizPassed,
    setMissionCompleted,
    setMissionRewarded,
    setMissionUnlocked,
    setMissionQuizPassed,
    getMissionStatus: getMissionStorageStatus,
    getAllMissionStatus: getAllMissionStorageStatus,
    clearMission: clearMissionStorageById,
    clearMissions: clearMissionStorage,
    clearAll: clearServerHeroStorage,
    exportAll: exportAllStorage,
    importAll: importAllStorage,
    healthCheck: runStorageHealthCheck
};

const storageHealth = runStorageHealthCheck();

console.log("======================================");
console.log("SERVER HERO PREMIUM V4.0");
console.log("STORAGE ENGINE READY");
console.log("Storage Available:", storageHealth.available);
console.log("======================================");

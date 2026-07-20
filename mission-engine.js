// ======================================================
// SERVER HERO PREMIUM V4.0
// mission-engine.js
// ======================================================

"use strict";

if (!window.SERVER_HERO_STORAGE) {
    throw new Error("storage-engine.js mesti dimuatkan sebelum mission-engine.js.");
}

if (!window.SERVER_HERO_PLAYER) {
    throw new Error("player-engine.js mesti dimuatkan sebelum mission-engine.js.");
}

if (!Array.isArray(window.missions)) {
    throw new Error("missions.js mesti dimuatkan sebelum mission-engine.js.");
}

function getMissionById(id) {
    return window.missions.find((mission) => mission.id === Number(id)) || null;
}

function getMissionIndex(id) {
    return window.missions.findIndex((mission) => mission.id === Number(id));
}

function getNextMission(id) {
    const index = getMissionIndex(id);
    if (index < 0 || index >= window.missions.length - 1) return null;
    return window.missions[index + 1];
}

function getPreviousMission(id) {
    const index = getMissionIndex(id);
    if (index <= 0) return null;
    return window.missions[index - 1];
}

function isMissionCompleted(id) {
    return SERVER_HERO_STORAGE.isMissionCompleted(Number(id));
}

function isMissionRewarded(id) {
    return SERVER_HERO_STORAGE.isMissionRewarded(Number(id));
}

function isMissionUnlocked(id) {
    const numericId = Number(id);
    if (numericId === 1) return true;

    const previous = getPreviousMission(numericId);
    return previous ? isMissionCompleted(previous.id) : false;
}

function getMissionStatus(id) {
    if (isMissionCompleted(id)) return "completed";
    if (isMissionUnlocked(id)) return "available";
    return "locked";
}

function calculateMissionReward(mission) {
    const doubleXP =
        localStorage.getItem(SERVER_HERO_STORAGE.keys.doubleXP) === "true";

    const baseXP = Number(mission.xp) || 0;

    return {
        xp: doubleXP ? baseXP * 2 : baseXP,
        coins: Number(mission.coins) || 0,
        gems: Number(mission.gems) || 0
    };
}

function awardMissionReward(id) {
    const mission = getMissionById(id);
    if (!mission) return { success: false, reason: "mission-not-found" };

    if (isMissionRewarded(mission.id)) {
        return {
            success: false,
            reason: "already-rewarded",
            reward: calculateMissionReward(mission)
        };
    }

    const reward = calculateMissionReward(mission);

    SERVER_HERO_PLAYER.addXP(reward.xp);
    SERVER_HERO_PLAYER.addCoins(reward.coins);
    SERVER_HERO_PLAYER.addGems(reward.gems);
    SERVER_HERO_PLAYER.increaseStreak();
    SERVER_HERO_STORAGE.setMissionRewarded(mission.id);

    return { success: true, reward };
}

function completeMission(id) {
    const mission = getMissionById(id);

    if (!mission) return { success: false, reason: "mission-not-found" };
    if (!isMissionUnlocked(mission.id)) {
        return { success: false, reason: "mission-locked" };
    }
    if (isMissionCompleted(mission.id)) {
        return { success: false, reason: "already-completed", mission };
    }

    SERVER_HERO_STORAGE.setMissionCompleted(mission.id);

    const rewardResult = awardMissionReward(mission.id);
    const nextMission = getNextMission(mission.id);

    if (nextMission) {
        SERVER_HERO_STORAGE.setMissionUnlocked(nextMission.id);
    }

    SERVER_HERO_PLAYER.refresh();

    const detail = {
        mission,
        reward: rewardResult.reward || { xp: 0, coins: 0, gems: 0 },
        nextMission
    };

    window.dispatchEvent(
        new CustomEvent("serverhero:mission-completed", { detail })
    );

    return { success: true, ...detail };
}

function synchronizeMissionRewards() {
    const synchronized = [];

    window.missions.forEach((mission) => {
        if (
            isMissionCompleted(mission.id) &&
            !isMissionRewarded(mission.id)
        ) {
            const result = awardMissionReward(mission.id);
            if (result.success) {
                synchronized.push({
                    missionId: mission.id,
                    reward: result.reward
                });
            }
        }
    });

    SERVER_HERO_PLAYER.refresh();
    return synchronized;
}

function getMissionProgress() {
    const completed = window.missions.filter((mission) =>
        isMissionCompleted(mission.id)
    ).length;

    const total = window.missions.length;
    const percentage = total
        ? Math.round((completed / total) * 100)
        : 0;

    return { completed, total, percentage };
}

function getMissionList() {
    return window.missions.map((mission) => ({
        ...mission,
        status: getMissionStatus(mission.id),
        completed: isMissionCompleted(mission.id),
        unlocked: isMissionUnlocked(mission.id),
        rewarded: isMissionRewarded(mission.id)
    }));
}

function openMission(id) {
    const mission = getMissionById(id);

    if (!mission) return { success: false, reason: "mission-not-found" };
    if (!isMissionUnlocked(mission.id)) {
        return { success: false, reason: "mission-locked", mission };
    }
    if (!mission.page) {
        return { success: false, reason: "page-not-found", mission };
    }

    window.location.href = mission.page;
    return { success: true, mission };
}

function resetMissions() {
    SERVER_HERO_STORAGE.clearMissions();
    SERVER_HERO_PLAYER.refresh();

    window.dispatchEvent(
        new CustomEvent("serverhero:missions-reset")
    );

    return true;
}

window.SERVER_HERO_MISSION_ENGINE = {
    getAll: getMissionList,
    getById: getMissionById,
    getStatus: getMissionStatus,
    getProgress: getMissionProgress,
    getNext: getNextMission,
    getPrevious: getPreviousMission,
    isCompleted: isMissionCompleted,
    isUnlocked: isMissionUnlocked,
    isRewarded: isMissionRewarded,
    open: openMission,
    complete: completeMission,
    awardReward: awardMissionReward,
    synchronizeRewards: synchronizeMissionRewards,
    calculateReward: calculateMissionReward,
    reset: resetMissions
};

window.serverHeroCompleteMission = completeMission;
window.openMission = openMission;

synchronizeMissionRewards();
console.log("MISSION ENGINE READY");

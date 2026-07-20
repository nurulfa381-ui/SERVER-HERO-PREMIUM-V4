// ======================================================
// SERVER HERO PREMIUM V4.0
// mission-engine.js
// FULL STABLE VERSION
// ======================================================

"use strict";


// ======================================================
// ENGINE REQUIREMENTS
// ======================================================

if (!window.SERVER_HERO_STORAGE) {

    throw new Error(

        "storage-engine.js mesti dimuatkan sebelum mission-engine.js."

    );

}

if (!window.SERVER_HERO_PLAYER) {

    throw new Error(

        "player-engine.js mesti dimuatkan sebelum mission-engine.js."

    );

}

if (
    !Array.isArray(
        window.missions
    )
) {

    throw new Error(

        "missions.js mesti dimuatkan sebelum mission-engine.js."

    );

}


// ======================================================
// MISSION HELPERS
// ======================================================

function getMissionById(

    missionId

) {

    return window.missions.find(

        mission =>

            mission.id ===

            Number(missionId)

    ) || null;

}


function getMissionIndex(

    missionId

) {

    return window.missions.findIndex(

        mission =>

            mission.id ===

            Number(missionId)

    );

}


function getNextMission(

    missionId

) {

    const missionIndex =

        getMissionIndex(

            missionId

        );

    if (

        missionIndex < 0 ||

        missionIndex >=

            window.missions.length - 1

    ) {

        return null;

    }

    return window.missions[

        missionIndex + 1

    ];

}


function getPreviousMission(

    missionId

) {

    const missionIndex =

        getMissionIndex(

            missionId

        );

    if (

        missionIndex <= 0

    ) {

        return null;

    }

    return window.missions[

        missionIndex - 1

    ];

}


// ======================================================
// MISSION STATUS
// ======================================================

function isMissionCompleted(

    missionId

) {

    return SERVER_HERO_STORAGE

        .isMissionCompleted(

            Number(missionId)

        );

}


function isMissionRewarded(

    missionId

) {

    return SERVER_HERO_STORAGE

        .isMissionRewarded(

            Number(missionId)

        );

}


function isMissionUnlocked(

    missionId

) {

    const numericMissionId =

        Number(missionId);

    if (

        numericMissionId === 1

    ) {

        return true;

    }

    if (

        SERVER_HERO_STORAGE

            .isMissionUnlocked(

                numericMissionId

            )

    ) {

        return true;

    }

    const previousMission =

        getPreviousMission(

            numericMissionId

        );

    if (!previousMission) {

        return false;

    }

    return isMissionCompleted(

        previousMission.id

    );

}


function getMissionStatus(

    missionId

) {

    if (

        isMissionCompleted(

            missionId

        )

    ) {

        return "completed";

    }

    if (

        isMissionUnlocked(

            missionId

        )

    ) {

        return "available";

    }

    return "locked";

}


// ======================================================
// MISSION REWARD CALCULATION
// ======================================================

function calculateMissionReward(

    mission

) {

    const doubleXPActive =

        localStorage.getItem(

            SERVER_HERO_STORAGE

                .keys

                .doubleXP

        ) === "true";

    const baseXP =

        Number(

            mission.xp

        ) || 0;

    return {

        xp:

            doubleXPActive

                ? baseXP * 2

                : baseXP,

        coins:

            Number(

                mission.coins

            ) || 0,

        gems:

            Number(

                mission.gems

            ) || 0

    };

}


// ======================================================
// AWARD MISSION REWARD
// ======================================================

function awardMissionReward(

    missionId

) {

    const mission =

        getMissionById(

            missionId

        );

    if (!mission) {

        return {

            success:
                false,

            reason:
                "mission-not-found"

        };

    }

    if (

        isMissionRewarded(

            mission.id

        )

    ) {

        return {

            success:
                false,

            reason:
                "already-rewarded",

            reward:
                calculateMissionReward(

                    mission

                )

        };

    }

    const reward =

        calculateMissionReward(

            mission

        );

    SERVER_HERO_PLAYER

        .addXP(

            reward.xp

        );

    SERVER_HERO_PLAYER

        .addCoins(

            reward.coins

        );

    SERVER_HERO_PLAYER

        .addGems(

            reward.gems

        );

    SERVER_HERO_PLAYER

        .increaseStreak();

    SERVER_HERO_STORAGE

        .setMissionRewarded(

            mission.id,

            true

        );

    return {

        success:
            true,

        reward

    };

}


// ======================================================
// COMPLETE MISSION
// ======================================================

function completeMission(

    missionId

) {

    const mission =

        getMissionById(

            missionId

        );

    if (!mission) {

        return {

            success:
                false,

            reason:
                "mission-not-found"

        };

    }

    if (

        !isMissionUnlocked(

            mission.id

        )

    ) {

        return {

            success:
                false,

            reason:
                "mission-locked",

            mission

        };

    }

    if (

        isMissionCompleted(

            mission.id

        )

    ) {

        return {

            success:
                false,

            reason:
                "already-completed",

            mission

        };

    }

    SERVER_HERO_STORAGE

        .setMissionCompleted(

            mission.id,

            true

        );

    const rewardResult =

        awardMissionReward(

            mission.id

        );

    const nextMission =

        getNextMission(

            mission.id

        );

    if (nextMission) {

        SERVER_HERO_STORAGE

            .setMissionUnlocked(

                nextMission.id,

                true

            );

    }

    SERVER_HERO_PLAYER

        .refresh();

    const detail = {

        mission,

        reward:

            rewardResult.reward || {

                xp:
                    0,

                coins:
                    0,

                gems:
                    0

            },

        nextMission

    };

    window.dispatchEvent(

        new CustomEvent(

            "serverhero:mission-completed",

            {

                detail

            }

        )

    );

    return {

        success:
            true,

        ...detail

    };

}


// ======================================================
// SYNCHRONIZE LEGACY COMPLETION DATA
// ======================================================

function synchronizeMissionRewards() {

    const synchronized = [];

    window.missions.forEach(

        mission => {

            if (

                isMissionCompleted(

                    mission.id

                ) &&

                !isMissionRewarded(

                    mission.id

                )

            ) {

                const result =

                    awardMissionReward(

                        mission.id

                    );

                if (

                    result.success

                ) {

                    synchronized.push({

                        missionId:
                            mission.id,

                        reward:
                            result.reward

                    });

                }

            }

        }

    );

    SERVER_HERO_PLAYER

        .refresh();

    return synchronized;

}


// ======================================================
// MISSION PROGRESS
// ======================================================

function getMissionProgress() {

    const completed =

        window.missions.filter(

            mission =>

                isMissionCompleted(

                    mission.id

                )

        ).length;

    const total =

        window.missions.length;

    const percentage =

        total > 0

            ? Math.round(

                (

                    completed /

                    total

                ) * 100

            )

            : 0;

    return {

        completed,

        total,

        percentage

    };

}


// ======================================================
// MISSION LIST DATA
// ======================================================

function getMissionList() {

    return window.missions.map(

        mission => ({

            ...mission,

            status:

                getMissionStatus(

                    mission.id

                ),

            completed:

                isMissionCompleted(

                    mission.id

                ),

            unlocked:

                isMissionUnlocked(

                    mission.id

                ),

            rewarded:

                isMissionRewarded(

                    mission.id

                )

        })

    );

}


// ======================================================
// OPEN MISSION
// ======================================================

function openMission(

    missionId

) {

    const mission =

        getMissionById(

            missionId

        );

    if (!mission) {

        return {

            success:
                false,

            reason:
                "mission-not-found"

        };

    }

    if (

        !isMissionUnlocked(

            mission.id

        )

    ) {

        return {

            success:
                false,

            reason:
                "mission-locked",

            mission

        };

    }

    if (!mission.page) {

        return {

            success:
                false,

            reason:
                "page-not-found",

            mission

        };

    }

    window.location.href =

        mission.page;

    return {

        success:
            true,

        mission

    };

}


// ======================================================
// QUIZ SUPPORT
// ======================================================

function markMissionQuizPassed(

    missionId

) {

    return SERVER_HERO_STORAGE

        .setMissionQuizPassed(

            missionId,

            true

        );

}


function isMissionQuizPassed(

    missionId

) {

    return SERVER_HERO_STORAGE

        .isMissionQuizPassed(

            missionId

        );

}


// ======================================================
// RESET MISSIONS
// ======================================================

function resetMissions() {

    SERVER_HERO_STORAGE

        .clearMissions();

    SERVER_HERO_PLAYER

        .refresh();

    window.dispatchEvent(

        new CustomEvent(

            "serverhero:missions-reset"

        )

    );

    return true;

}


// ======================================================
// GLOBAL MISSION API
// ======================================================

window.SERVER_HERO_MISSION_ENGINE = {

    version:
        "4.0",

    getAll:
        getMissionList,

    getById:
        getMissionById,

    getStatus:
        getMissionStatus,

    getProgress:
        getMissionProgress,

    getNext:
        getNextMission,

    getPrevious:
        getPreviousMission,

    isCompleted:
        isMissionCompleted,

    isUnlocked:
        isMissionUnlocked,

    isRewarded:
        isMissionRewarded,

    open:
        openMission,

    complete:
        completeMission,

    awardReward:
        awardMissionReward,

    synchronizeRewards:
        synchronizeMissionRewards,

    calculateReward:
        calculateMissionReward,

    markQuizPassed:
        markMissionQuizPassed,

    isQuizPassed:
        isMissionQuizPassed,

    reset:
        resetMissions

};


// ======================================================
// GLOBAL LESSON SUPPORT
// ======================================================

window.serverHeroCompleteMission =

    completeMission;

window.openMission =

    openMission;


// ======================================================
// INITIALIZATION
// ======================================================

synchronizeMissionRewards();


console.log(

    "======================================"

);

console.log(

    "SERVER HERO PREMIUM V4.0"

);

console.log(

    "MISSION ENGINE READY"

);

console.log(

    "Mission Count:",

    window.missions.length

);

console.log(

    "======================================"

);

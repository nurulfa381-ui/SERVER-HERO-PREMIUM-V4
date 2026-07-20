// ======================================================
// SERVER HERO PREMIUM V4.0
// achievement-engine.js
// FULL STABLE VERSION
// ======================================================

"use strict";


// ======================================================
// ENGINE REQUIREMENTS
// ======================================================

if (!window.SERVER_HERO_STORAGE) {

    throw new Error(

        "storage-engine.js mesti dimuatkan sebelum achievement-engine.js."

    );

}

if (!window.SERVER_HERO_PLAYER) {

    throw new Error(

        "player-engine.js mesti dimuatkan sebelum achievement-engine.js."

    );

}

if (!window.SERVER_HERO_MISSION_ENGINE) {

    throw new Error(

        "mission-engine.js mesti dimuatkan sebelum achievement-engine.js."

    );

}


// ======================================================
// ACHIEVEMENT DATABASE
// ======================================================

const ACHIEVEMENTS = Object.freeze([

    {

        id:
            "first-mission",

        title:
            "First Mission",

        description:
            "Complete Mission 01.",

        icon:
            "🥉",

        target:
            1,

        rewardXP:
            100

    },

    {

        id:
            "server-explorer",

        title:
            "Server Explorer",

        description:
            "Complete three missions.",

        icon:
            "🥈",

        target:
            3,

        rewardXP:
            250

    },

    {

        id:
            "server-specialist",

        title:
            "Server Specialist",

        description:
            "Complete five missions.",

        icon:
            "🥇",

        target:
            5,

        rewardXP:
            400

    },

    {

        id:
            "server-hero",

        title:
            "Server Hero",

        description:
            "Complete all eight missions.",

        icon:
            "💎",

        target:
            8,

        rewardXP:
            800

    }

]);


// ======================================================
// ACHIEVEMENT STATE
// ======================================================

let UNLOCKED_ACHIEVEMENTS =

    SERVER_HERO_STORAGE.readArray(

        SERVER_HERO_STORAGE.keys.achievements,

        []

    );


// ======================================================
// SAVE ACHIEVEMENTS
// ======================================================

function saveAchievements() {

    SERVER_HERO_STORAGE.write(

        SERVER_HERO_STORAGE.keys.achievements,

        UNLOCKED_ACHIEVEMENTS

    );

}


// ======================================================
// ACHIEVEMENT HELPERS
// ======================================================

function getAchievementById(

    achievementId

) {

    return ACHIEVEMENTS.find(

        achievement =>

            achievement.id ===

            achievementId

    ) || null;

}


function isAchievementUnlocked(

    achievementId

) {

    return UNLOCKED_ACHIEVEMENTS.includes(

        achievementId

    );

}


// ======================================================
// UNLOCK ACHIEVEMENT
// ======================================================

function unlockAchievement(

    achievementId

) {

    const achievement =

        getAchievementById(

            achievementId

        );

    if (!achievement) {

        return {

            success:
                false,

            reason:
                "achievement-not-found"

        };

    }

    if (

        isAchievementUnlocked(

            achievement.id

        )

    ) {

        return {

            success:
                false,

            reason:
                "already-unlocked",

            achievement

        };

    }

    UNLOCKED_ACHIEVEMENTS.push(

        achievement.id

    );

    SERVER_HERO_PLAYER.addXP(

        achievement.rewardXP

    );

    saveAchievements();

    const detail = {

        achievement

    };

    window.dispatchEvent(

        new CustomEvent(

            "serverhero:achievement-unlocked",

            {

                detail

            }

        )

    );

    return {

        success:
            true,

        achievement

    };

}


// ======================================================
// CHECK ACHIEVEMENTS
// ======================================================

function checkAchievements() {

    const progress =

        SERVER_HERO_MISSION_ENGINE

            .getProgress();

    const unlockedNow = [];

    ACHIEVEMENTS.forEach(

        achievement => {

            if (

                progress.completed >=

                    achievement.target &&

                !isAchievementUnlocked(

                    achievement.id

                )

            ) {

                const result =

                    unlockAchievement(

                        achievement.id

                    );

                if (

                    result.success

                ) {

                    unlockedNow.push(

                        result.achievement

                    );

                }

            }

        }

    );

    return unlockedNow;

}


// ======================================================
// GET ACHIEVEMENT LIST
// ======================================================

function getAchievementList() {

    const progress =

        SERVER_HERO_MISSION_ENGINE

            .getProgress();

    return ACHIEVEMENTS.map(

        achievement => ({

            ...achievement,

            unlocked:

                isAchievementUnlocked(

                    achievement.id

                ),

            current:

                Math.min(

                    progress.completed,

                    achievement.target

                ),

            percentage:

                Math.min(

                    100,

                    Math.round(

                        (

                            progress.completed /

                            achievement.target

                        ) * 100

                    )

                )

        })

    );

}


// ======================================================
// GET UNLOCKED COUNT
// ======================================================

function getUnlockedAchievementCount() {

    return UNLOCKED_ACHIEVEMENTS.length;

}


// ======================================================
// RESET ACHIEVEMENTS
// ======================================================

function resetAchievements() {

    UNLOCKED_ACHIEVEMENTS = [];

    saveAchievements();

    window.dispatchEvent(

        new CustomEvent(

            "serverhero:achievements-reset"

        )

    );

    return true;

}


// ======================================================
// EXPORT ACHIEVEMENTS
// ======================================================

function exportAchievementData() {

    return {

        unlocked: [

            ...UNLOCKED_ACHIEVEMENTS

        ]

    };

}


// ======================================================
// IMPORT ACHIEVEMENTS
// ======================================================

function importAchievementData(

    data

) {

    if (

        !data ||

        !Array.isArray(

            data.unlocked

        )

    ) {

        return false;

    }

    UNLOCKED_ACHIEVEMENTS =

        data.unlocked.filter(

            achievementId =>

                Boolean(

                    getAchievementById(

                        achievementId

                    )

                )

        );

    saveAchievements();

    return true;

}


// ======================================================
// GLOBAL ACHIEVEMENT API
// ======================================================

window.SERVER_HERO_ACHIEVEMENTS = {

    version:
        "4.0",

    all:
        ACHIEVEMENTS,

    getAll:
        getAchievementList,

    getById:
        getAchievementById,

    isUnlocked:
        isAchievementUnlocked,

    unlock:
        unlockAchievement,

    check:
        checkAchievements,

    getUnlockedCount:
        getUnlockedAchievementCount,

    reset:
        resetAchievements,

    exportData:
        exportAchievementData,

    importData:
        importAchievementData

};


// ======================================================
// EVENT LISTENERS
// ======================================================

window.addEventListener(

    "serverhero:mission-completed",

    () => {

        checkAchievements();

    }

);


// ======================================================
// INITIALIZATION
// ======================================================

checkAchievements();


console.log(

    "======================================"

);

console.log(

    "SERVER HERO PREMIUM V4.0"

);

console.log(

    "ACHIEVEMENT ENGINE READY"

);

console.log(

    "Unlocked Achievements:",

    UNLOCKED_ACHIEVEMENTS.length

);

console.log(

    "======================================"

);

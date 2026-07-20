// ======================================================
// SERVER HERO PREMIUM V4.0
// player-engine.js
// FULL STABLE VERSION
// ======================================================

"use strict";


// ======================================================
// ENGINE REQUIREMENT
// ======================================================

if (!window.SERVER_HERO_STORAGE) {

    throw new Error(

        "storage-engine.js mesti dimuatkan sebelum player-engine.js."

    );

}


// ======================================================
// DEFAULT PLAYER
// ======================================================

const DEFAULT_PLAYER = Object.freeze({

    name:
        "AGENT",

    xp:
        500,

    level:
        1,

    coins:
        100,

    gems:
        10,

    completed:
        0,

    streak:
        1,

    rank:
        "Beginner",

    avatar:
        "👩‍💻",

    createdAt:
        null,

    updatedAt:
        null

});


// ======================================================
// PLAYER STATE
// ======================================================

let PLAYER =

    SERVER_HERO_STORAGE.readObject(

        SERVER_HERO_STORAGE.keys.player,

        {

            ...DEFAULT_PLAYER,

            createdAt:
                new Date().toISOString(),

            updatedAt:
                new Date().toISOString()

        }

    );


// ======================================================
// PLAYER VALIDATION
// ======================================================

function normalizeNumber(

    value,

    fallback = 0

) {

    const numberValue =

        Number(value);

    return Number.isFinite(

        numberValue

    )

        ? numberValue

        : fallback;

}


function sanitizePlayerData(

    data

) {

    const safeData =

        data &&

        typeof data === "object" &&

        !Array.isArray(data)

            ? data

            : {};

    return {

        name:

            String(

                safeData.name ||

                DEFAULT_PLAYER.name

            )

                .trim()

                .slice(

                    0,

                    30

                ) ||

            DEFAULT_PLAYER.name,

        xp:

            Math.max(

                0,

                normalizeNumber(

                    safeData.xp,

                    DEFAULT_PLAYER.xp

                )

            ),

        level:

            Math.max(

                1,

                normalizeNumber(

                    safeData.level,

                    DEFAULT_PLAYER.level

                )

            ),

        coins:

            Math.max(

                0,

                normalizeNumber(

                    safeData.coins,

                    DEFAULT_PLAYER.coins

                )

            ),

        gems:

            Math.max(

                0,

                normalizeNumber(

                    safeData.gems,

                    DEFAULT_PLAYER.gems

                )

            ),

        completed:

            Math.max(

                0,

                normalizeNumber(

                    safeData.completed,

                    DEFAULT_PLAYER.completed

                )

            ),

        streak:

            Math.max(

                1,

                normalizeNumber(

                    safeData.streak,

                    DEFAULT_PLAYER.streak

                )

            ),

        rank:

            String(

                safeData.rank ||

                DEFAULT_PLAYER.rank

            ),

        avatar:

            String(

                safeData.avatar ||

                DEFAULT_PLAYER.avatar

            ),

        createdAt:

            safeData.createdAt ||

            new Date().toISOString(),

        updatedAt:

            new Date().toISOString()

    };

}


// ======================================================
// SAVE PLAYER
// ======================================================

function savePlayer() {

    PLAYER =

        sanitizePlayerData(

            PLAYER

        );

    PLAYER.updatedAt =

        new Date().toISOString();

    SERVER_HERO_STORAGE.write(

        SERVER_HERO_STORAGE.keys.player,

        PLAYER

    );

    return {

        ...PLAYER

    };

}


// ======================================================
// LEVEL CALCULATION
// ======================================================

function calculatePlayerLevel() {

    PLAYER.level =

        Math.max(

            1,

            Math.floor(

                PLAYER.xp / 500

            )

        );

    return PLAYER.level;

}


// ======================================================
// RANK CALCULATION
// ======================================================

function calculatePlayerRank() {

    if (

        PLAYER.xp >= 10000

    ) {

        PLAYER.rank =

            "Legend";

    }

    else if (

        PLAYER.xp >= 7000

    ) {

        PLAYER.rank =

            "Master";

    }

    else if (

        PLAYER.xp >= 5000

    ) {

        PLAYER.rank =

            "Elite";

    }

    else if (

        PLAYER.xp >= 3000

    ) {

        PLAYER.rank =

            "Professional";

    }

    else if (

        PLAYER.xp >= 1500

    ) {

        PLAYER.rank =

            "Advanced";

    }

    else {

        PLAYER.rank =

            "Beginner";

    }

    return PLAYER.rank;

}


// ======================================================
// COMPLETED MISSION COUNT
// ======================================================

function countCompletedMissions() {

    if (

        !Array.isArray(

            window.missions

        )

    ) {

        PLAYER.completed = 0;

        return 0;

    }

    PLAYER.completed =

        window.missions.filter(

            mission =>

                SERVER_HERO_STORAGE

                    .isMissionCompleted(

                        mission.id

                    )

        ).length;

    return PLAYER.completed;

}


// ======================================================
// PLAYER REFRESH
// ======================================================

function refreshPlayer() {

    PLAYER =

        sanitizePlayerData(

            PLAYER

        );

    countCompletedMissions();

    calculatePlayerLevel();

    calculatePlayerRank();

    savePlayer();

    return {

        ...PLAYER

    };

}


// ======================================================
// RESET PLAYER
// ======================================================

function resetPlayer() {

    PLAYER = {

        ...DEFAULT_PLAYER,

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()

    };

    savePlayer();

    return {

        ...PLAYER

    };

}


// ======================================================
// PLAYER REWARDS
// ======================================================

function addXP(amount) {

    const safeAmount =

        Math.max(

            0,

            normalizeNumber(

                amount,

                0

            )

        );

    PLAYER.xp +=

        safeAmount;

    calculatePlayerLevel();

    calculatePlayerRank();

    savePlayer();

    return PLAYER.xp;

}


function addCoins(amount) {

    const safeAmount =

        Math.max(

            0,

            normalizeNumber(

                amount,

                0

            )

        );

    PLAYER.coins +=

        safeAmount;

    savePlayer();

    return PLAYER.coins;

}


function removeCoins(amount) {

    const safeAmount =

        Math.max(

            0,

            normalizeNumber(

                amount,

                0

            )

        );

    if (

        PLAYER.coins <

        safeAmount

    ) {

        return false;

    }

    PLAYER.coins -=

        safeAmount;

    savePlayer();

    return true;

}


function addGems(amount) {

    const safeAmount =

        Math.max(

            0,

            normalizeNumber(

                amount,

                0

            )

        );

    PLAYER.gems +=

        safeAmount;

    savePlayer();

    return PLAYER.gems;

}


function removeGems(amount) {

    const safeAmount =

        Math.max(

            0,

            normalizeNumber(

                amount,

                0

            )

        );

    if (

        PLAYER.gems <

        safeAmount

    ) {

        return false;

    }

    PLAYER.gems -=

        safeAmount;

    savePlayer();

    return true;

}


// ======================================================
// STREAK ENGINE
// ======================================================

function increaseStreak() {

    PLAYER.streak += 1;

    savePlayer();

    return PLAYER.streak;

}


function resetStreak() {

    PLAYER.streak = 1;

    savePlayer();

    return PLAYER.streak;

}


// ======================================================
// PLAYER PROFILE
// ======================================================

function setPlayerName(name) {

    const cleanName =

        String(

            name ||

            ""

        )

            .trim()

            .slice(

                0,

                30

            );

    if (!cleanName) {

        return false;

    }

    PLAYER.name =

        cleanName;

    savePlayer();

    return true;

}


function setPlayerAvatar(avatar) {

    const cleanAvatar =

        String(

            avatar ||

            ""

        )

            .trim()

            .slice(

                0,

                10

            );

    if (!cleanAvatar) {

        return false;

    }

    PLAYER.avatar =

        cleanAvatar;

    savePlayer();

    return true;

}


// ======================================================
// PLAYER IMPORT
// ======================================================

function importPlayerData(data) {

    if (

        !data ||

        typeof data !== "object" ||

        Array.isArray(data)

    ) {

        return false;

    }

    PLAYER =

        sanitizePlayerData({

            ...DEFAULT_PLAYER,

            ...data

        });

    refreshPlayer();

    return true;

}


// ======================================================
// PLAYER EXPORT
// ======================================================

function exportPlayerData() {

    refreshPlayer();

    return {

        ...PLAYER

    };

}


// ======================================================
// DASHBOARD DATA
// ======================================================

function getPlayerDashboardData() {

    refreshPlayer();

    const totalMissions =

        Array.isArray(

            window.missions

        )

            ? window.missions.length

            : 0;

    const percentage =

        totalMissions > 0

            ? Math.round(

                (

                    PLAYER.completed /

                    totalMissions

                ) * 100

            )

            : 0;

    return {

        ...PLAYER,

        totalMissions,

        percentage

    };

}


// ======================================================
// GLOBAL PLAYER API
// ======================================================

window.SERVER_HERO_PLAYER = {

    version:
        "4.0",

    defaults:
        DEFAULT_PLAYER,

    get() {

        return {

            ...PLAYER

        };

    },

    refresh:
        refreshPlayer,

    save:
        savePlayer,

    reset:
        resetPlayer,

    addXP:
        addXP,

    addCoins:
        addCoins,

    removeCoins:
        removeCoins,

    addGems:
        addGems,

    removeGems:
        removeGems,

    increaseStreak:
        increaseStreak,

    resetStreak:
        resetStreak,

    setName:
        setPlayerName,

    setAvatar:
        setPlayerAvatar,

    importData:
        importPlayerData,

    exportData:
        exportPlayerData,

    getDashboardData:
        getPlayerDashboardData,

    countCompletedMissions:
        countCompletedMissions,

    calculateLevel:
        calculatePlayerLevel,

    calculateRank:
        calculatePlayerRank

};


// ======================================================
// INITIALIZATION
// ======================================================

refreshPlayer();


console.log(

    "======================================"

);

console.log(

    "SERVER HERO PREMIUM V4.0"

);

console.log(

    "PLAYER ENGINE READY"

);

console.log(

    "Player:",

    PLAYER.name

);

console.log(

    "Level:",

    PLAYER.level

);

console.log(

    "Rank:",

    PLAYER.rank

);

console.log(

    "======================================"

);

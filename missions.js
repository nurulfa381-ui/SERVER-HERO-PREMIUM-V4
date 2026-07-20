// ======================================================
// SERVER HERO PREMIUM V4.0
// missions.js
// FINAL MISSION DATABASE
// ======================================================

"use strict";


// ======================================================
// MISSION DATABASE
// ======================================================

const missions = Object.freeze([

    {

        id:
            1,

        title:
            "MISSION 01",

        subtitle:
            "Install Windows Server 2019",

        description:
            "Install Windows Server 2019 and prepare the operating system for server deployment.",

        xp:
            250,

        coins:
            50,

        gems:
            2,

        difficulty:
            "Easy",

        duration:
            "20 Minutes",

        category:
            "Operating System",

        icon:
            "💻",

        page:
            "lesson1.html"

    },

    {

        id:
            2,

        title:
            "MISSION 02",

        subtitle:
            "Configure Static IP Address",

        description:
            "Configure a static IPv4 address, subnet mask, default gateway and preferred DNS server.",

        xp:
            300,

        coins:
            60,

        gems:
            2,

        difficulty:
            "Easy",

        duration:
            "20 Minutes",

        category:
            "Networking",

        icon:
            "🌐",

        page:
            "lesson2.html"

    },

    {

        id:
            3,

        title:
            "MISSION 03",

        subtitle:
            "Install Active Directory Domain Services",

        description:
            "Install the AD DS role and promote the server as a Domain Controller for serverhero.local.",

        xp:
            450,

        coins:
            75,

        gems:
            3,

        difficulty:
            "Medium",

        duration:
            "30 Minutes",

        category:
            "Active Directory",

        icon:
            "🏢",

        page:
            "lesson3.html"

    },

    {

        id:
            4,

        title:
            "MISSION 04",

        subtitle:
            "Configure DNS Server",

        description:
            "Configure DNS zones, host records and verify domain name resolution using nslookup.",

        xp:
            450,

        coins:
            75,

        gems:
            3,

        difficulty:
            "Medium",

        duration:
            "30 Minutes",

        category:
            "DNS",

        icon:
            "🛰️",

        page:
            "lesson4.html"

    },

    {

        id:
            5,

        title:
            "MISSION 05",

        subtitle:
            "Configure DHCP Server",

        description:
            "Install DHCP Server, authorize the service, create an IPv4 scope and activate it.",

        xp:
            500,

        coins:
            90,

        gems:
            4,

        difficulty:
            "Medium",

        duration:
            "35 Minutes",

        category:
            "DHCP",

        icon:
            "📡",

        page:
            "lesson5.html"

    },

    {

        id:
            6,

        title:
            "MISSION 06",

        subtitle:
            "Create Organizational Unit and User",

        description:
            "Create Organizational Units, users and groups in Active Directory and organize domain resources.",

        xp:
            600,

        coins:
            100,

        gems:
            5,

        difficulty:
            "Hard",

        duration:
            "40 Minutes",

        category:
            "Active Directory",

        icon:
            "👥",

        page:
            "lesson6.html"

    },

    {

        id:
            7,

        title:
            "MISSION 07",

        subtitle:
            "Join Windows 10 Client to Domain",

        description:
            "Configure the Windows 10 client and join it to the serverhero.local Active Directory domain.",

        xp:
            700,

        coins:
            120,

        gems:
            5,

        difficulty:
            "Hard",

        duration:
            "40 Minutes",

        category:
            "Client Integration",

        icon:
            "🖥️",

        page:
            "lesson7.html"

    },

    {

        id:
            8,

        title:
            "MISSION 08",

        subtitle:
            "Final Server Validation",

        description:
            "Validate Active Directory, DNS, DHCP, domain logon and client connectivity before completing the training.",

        xp:
            1000,

        coins:
            200,

        gems:
            10,

        difficulty:
            "Expert",

        duration:
            "60 Minutes",

        category:
            "Validation",

        icon:
            "🏆",

        page:
            "lesson8.html"

    }

]);


// ======================================================
// TOTAL REWARDS
// ======================================================

const totalMissionXP =

    missions.reduce(

        (

            total,

            mission

        ) =>

            total +

            mission.xp,

        0

    );


const totalMissionCoins =

    missions.reduce(

        (

            total,

            mission

        ) =>

            total +

            mission.coins,

        0

    );


const totalMissionGems =

    missions.reduce(

        (

            total,

            mission

        ) =>

            total +

            mission.gems,

        0

    );


// ======================================================
// MISSION HELPERS
// ======================================================

function getMissionById(

    missionId

) {

    return missions.find(

        mission =>

            mission.id ===

            Number(missionId)

    ) || null;

}


function getMissionByPage(

    pageName

) {

    return missions.find(

        mission =>

            mission.page ===

            String(pageName)

    ) || null;

}


function getMissionCount() {

    return missions.length;

}


// ======================================================
// GLOBAL MISSION DATABASE
// ======================================================

window.missions = missions;

window.SERVER_HERO_MISSIONS = {

    version:
        "4.0",

    all:
        missions,

    total:
        getMissionCount(),

    totalXP:
        totalMissionXP,

    totalCoins:
        totalMissionCoins,

    totalGems:
        totalMissionGems,

    getById:
        getMissionById,

    getByPage:
        getMissionByPage

};


// ======================================================
// INITIALIZATION
// ======================================================

console.log(

    "======================================"

);

console.log(

    "SERVER HERO PREMIUM V4.0"

);

console.log(

    "FINAL MISSION DATABASE READY"

);

console.log(

    "Total Missions:",

    missions.length

);

console.log(

    "Total XP:",

    totalMissionXP

);

console.log(

    "Total Coins:",

    totalMissionCoins

);

console.log(

    "Total Gems:",

    totalMissionGems

);

console.log(

    "======================================"

);

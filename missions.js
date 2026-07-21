// ======================================================
// SERVER HERO PREMIUM V5.0
// missions.js
// FULL DATABASE - 13 MISSIONS
// ======================================================

"use strict";


// ======================================================
// MISSION DATABASE
// ======================================================

const missions = [

    {

        id:
            1,

        title:
            "MISI 01",

        subtitle:
            "Pasang Windows Server 2019",

        description:
            "Pasang Windows Server 2019 dan sediakan sistem operasi untuk konfigurasi server.",

        xp:
            500,

        coins:
            0,

        gems:
            0,

        difficulty:
            "Mudah",

        duration:
            "25 Minit",

        icon:
            "💻",

        page:
            "lesson1.html"

    },

    {

        id:
            2,

        title:
            "MISI 02",

        subtitle:
            "Konfigurasi Alamat IP Statik",

        description:
            "Tetapkan alamat IPv4 statik, subnet mask, default gateway dan DNS server.",

        xp:
            600,

        coins:
            0,

        gems:
            0,

        difficulty:
            "Mudah",

        duration:
            "25 Minit",

        icon:
            "🌐",

        page:
            "lesson2.html"

    },

    {

        id:
            3,

        title:
            "MISI 03",

        subtitle:
            "Pasang Active Directory Domain Services",

        description:
            "Pasang peranan AD DS dan sediakan Active Directory untuk persekitaran domain.",

        xp:
            800,

        coins:
            0,

        gems:
            0,

        difficulty:
            "Sederhana",

        duration:
            "35 Minit",

        icon:
            "🏢",

        page:
            "lesson3.html"

    },

    {

        id:
            4,

        title:
            "MISI 04",

        subtitle:
            "Konfigurasi DNS Server",

        description:
            "Konfigurasi DNS, Forward Lookup Zone dan uji resolusi nama domain.",

        xp:
            700,

        coins:
            0,

        gems:
            0,

        difficulty:
            "Sederhana",

        duration:
            "35 Minit",

        icon:
            "🛰️",

        page:
            "lesson4.html"

    },

    {

        id:
            5,

        title:
            "MISI 05",

        subtitle:
            "Cipta OU dan Akaun Pengguna",

        description:
            "Cipta Organizational Unit, akaun pengguna dan kumpulan dalam Active Directory.",

        xp:
            700,

        coins:
            0,

        gems:
            0,

        difficulty:
            "Sederhana",

        duration:
            "35 Minit",

        icon:
            "👥",

        page:
            "lesson5.html"

    },

    {

        id:
            6,

        title:
            "MISI 06",

        subtitle:
            "Join Windows 10 Client ke Domain",

        description:
            "Sambungkan komputer Windows 10 Client kepada domain serverhero.local dan uji log masuk domain.",

        xp:
            1200,

        coins:
            0,

        gems:
            0,

        difficulty:
            "Sukar",

        duration:
            "45 Minit",

        icon:
            "🖥️",

        page:
            "lesson6.html"

    },

    {

        id:
            7,

        title:
            "MISI 07",

        subtitle:
            "Konfigurasi Group Policy",

        description:
            "Cipta Group Policy Object, link kepada OU dan gunakan polisi keselamatan pengguna.",

        xp:
            700,

        coins:
            0,

        gems:
            0,

        difficulty:
            "Sukar",

        duration:
            "40 Minit",

        icon:
            "🛡️",

        page:
            "lesson7.html"

    },

    {

        id:
            8,

        title:
            "MISI 08",

        subtitle:
            "Konfigurasi DHCP Server",

        description:
            "Pasang DHCP Server, cipta scope dan berikan alamat IP secara automatik kepada client.",

        xp:
            800,

        coins:
            0,

        gems:
            0,

        difficulty:
            "Sukar",

        duration:
            "45 Minit",

        icon:
            "📡",

        page:
            "lesson8.html"

    },

    {

        id:
            9,

        title:
            "MISI 09",

        subtitle:
            "File Server dan Shared Folder",

        description:
            "Sediakan folder perkongsian, Share Permission, NTFS Permission dan uji akses client.",

        xp:
            900,

        coins:
            0,

        gems:
            0,

        difficulty:
            "Sukar",

        duration:
            "45 Minit",

        icon:
            "📁",

        page:
            "lesson9.html"

    },

    {

        id:
            10,

        title:
            "MISI 10",

        subtitle:
            "Konfigurasi Print Server",

        description:
            "Tambah pencetak rangkaian, pasang driver, kongsi printer dan uji cetakan client.",

        xp:
            1000,

        coins:
            0,

        gems:
            0,

        difficulty:
            "Sukar",

        duration:
            "45 Minit",

        icon:
            "🖨️",

        page:
            "lesson10.html"

    },

    {

        id:
            11,

        title:
            "MISI 11",

        subtitle:
            "Windows Server Backup dan Restore",

        description:
            "Cipta backup schedule, simpan Full Server Backup dan uji proses pemulihan data.",

        xp:
            1100,

        coins:
            0,

        gems:
            0,

        difficulty:
            "Sukar",

        duration:
            "45 Minit",

        icon:
            "💾",

        page:
            "lesson11.html"

    },

    {

        id:
            12,

        title:
            "MISI 12",

        subtitle:
            "Server Security dan Monitoring",

        description:
            "Aktifkan firewall, antivirus dan Windows Update serta pantau log dan prestasi server.",

        xp:
            1200,

        coins:
            0,

        gems:
            0,

        difficulty:
            "Pakar",

        duration:
            "50 Minit",

        icon:
            "🔒",

        page:
            "lesson12.html"

    },

    {

        id:
            13,

        title:
            "MISI 13",

        subtitle:
            "Final Boss Challenge",

        description:
            "Gabungkan semua kemahiran untuk membina, menguji dan melindungi Windows Server 2019.",

        xp:
            2500,

        coins:
            0,

        gems:
            0,

        difficulty:
            "Final Boss",

        duration:
            "60 Minit",

        icon:
            "👑",

        page:
            "lesson13.html"

    }

];


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

            (

                Number(

                    mission.xp

                ) || 0

            ),

        0

    );


const totalMissionCoins =

    0;


const totalMissionGems =

    0;


// ======================================================
// DATA VALIDATION
// ======================================================

function validateMissionDatabase() {

    const ids =

        new Set();

    missions.forEach(

        mission => {

            if (

                !Number.isInteger(

                    mission.id

                ) ||

                mission.id < 1

            ) {

                throw new Error(

                    "ID misi tidak sah."

                );

            }

            if (

                ids.has(

                    mission.id

                )

            ) {

                throw new Error(

                    `ID misi berulang: ${mission.id}`

                );

            }

            ids.add(

                mission.id

            );

            if (

                !mission.title ||

                !mission.subtitle ||

                !mission.page

            ) {

                throw new Error(

                    `Data Misi ${mission.id} tidak lengkap.`

                );

            }

        }

    );

    return true;

}


validateMissionDatabase();


// ======================================================
// GLOBAL MISSION API
// ======================================================

window.missions =

    missions;


window.SERVER_HERO_MISSIONS = {

    version:
        "5.0",

    all:
        missions,

    total:
        missions.length,

    totalXP:
        totalMissionXP,

    totalCoins:
        totalMissionCoins,

    totalGems:
        totalMissionGems,

    getById(

        missionId

    ) {

        return missions.find(

            mission =>

                mission.id ===

                Number(

                    missionId

                )

        ) || null;

    },

    getNext(

        missionId

    ) {

        const index =

            missions.findIndex(

                mission =>

                    mission.id ===

                    Number(

                        missionId

                    )

            );

        if (

            index < 0 ||

            index >= missions.length - 1

        ) {

            return null;

        }

        return missions[

            index + 1

        ];

    },

    getPrevious(

        missionId

    ) {

        const index =

            missions.findIndex(

                mission =>

                    mission.id ===

                    Number(

                        missionId

                    )

            );

        if (

            index <= 0

        ) {

            return null;

        }

        return missions[

            index - 1

        ];

    }

};


// ======================================================
// STATUS
// ======================================================

console.log(

    "======================================"

);

console.log(

    "SERVER HERO PREMIUM V5.0"

);

console.log(

    "DATABASE 13 MISI SEDIA"

);

console.log(

    "Jumlah Misi:",

    missions.length

);

console.log(

    "Jumlah XP:",

    totalMissionXP

);

console.log(

    "======================================"

);

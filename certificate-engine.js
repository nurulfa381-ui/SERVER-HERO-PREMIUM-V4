// ======================================================
// SERVER HERO PREMIUM V4.0
// certificate-engine.js
// FULL STABLE VERSION
// ======================================================

"use strict";


// ======================================================
// ENGINE REQUIREMENTS
// ======================================================

if (!window.SERVER_HERO_PLAYER) {

    throw new Error(

        "player-engine.js mesti dimuatkan sebelum certificate-engine.js."

    );

}

if (!window.SERVER_HERO_MISSION_ENGINE) {

    throw new Error(

        "mission-engine.js mesti dimuatkan sebelum certificate-engine.js."

    );

}


// ======================================================
// CERTIFICATE SETTINGS
// ======================================================

const CERTIFICATE_SETTINGS = Object.freeze({

    title:
        "Certificate of Completion",

    course:
        "SERVER HERO PREMIUM",

    subtitle:
        "Windows Server 2019 Interactive Learning Platform",

    issuer:
        "SERVER HERO PREMIUM V4.0"

});


// ======================================================
// CERTIFICATE ELIGIBILITY
// ======================================================

function isCertificateEligible() {

    const progress =

        SERVER_HERO_MISSION_ENGINE

            .getProgress();

    return (

        progress.total > 0 &&

        progress.completed ===

            progress.total

    );

}


// ======================================================
// CERTIFICATE DATA
// ======================================================

function getCertificateData() {

    const player =

        SERVER_HERO_PLAYER.get();

    const progress =

        SERVER_HERO_MISSION_ENGINE

            .getProgress();

    return {

        playerName:
            player.name,

        level:
            player.level,

        rank:
            player.rank,

        xp:
            player.xp,

        completed:
            progress.completed,

        total:
            progress.total,

        percentage:
            progress.percentage,

        date:
            new Date()

                .toLocaleDateString(

                    "en-MY",

                    {

                        day:
                            "2-digit",

                        month:
                            "long",

                        year:
                            "numeric"

                    }

                ),

        certificateId:

            `SHV4-${

                Date.now()

            }`

    };

}


// ======================================================
// BUILD CERTIFICATE HTML
// ======================================================

function buildCertificateHTML() {

    if (

        !isCertificateEligible()

    ) {

        return null;

    }

    const data =

        getCertificateData();

    return `

        <section class="certificate-sheet">

            <div class="certificate-border">

                <div class="certificate-header">

                    <div class="certificate-icon">

                        🏆

                    </div>

                    <h1>

                        ${CERTIFICATE_SETTINGS.title}

                    </h1>

                    <p>

                        ${CERTIFICATE_SETTINGS.course}

                    </p>

                </div>

                <div class="certificate-body">

                    <p>

                        This certificate is proudly presented to

                    </p>

                    <h2>

                        ${data.playerName}

                    </h2>

                    <p>

                        for successfully completing all

                        ${data.total}

                        Windows Server 2019 missions.

                    </p>

                    <div class="certificate-stats">

                        <div>

                            <span>

                                XP

                            </span>

                            <strong>

                                ${data.xp}

                            </strong>

                        </div>

                        <div>

                            <span>

                                Level

                            </span>

                            <strong>

                                ${data.level}

                            </strong>

                        </div>

                        <div>

                            <span>

                                Rank

                            </span>

                            <strong>

                                ${data.rank}

                            </strong>

                        </div>

                    </div>

                    <p class="certificate-date">

                        Completed on ${data.date}

                    </p>

                </div>

                <div class="certificate-footer">

                    <span>

                        ${CERTIFICATE_SETTINGS.subtitle}

                    </span>

                    <span>

                        ID: ${data.certificateId}

                    </span>

                </div>

            </div>

        </section>

    `;

}


// ======================================================
// OPEN CERTIFICATE
// ======================================================

function openCertificate() {

    if (

        !isCertificateEligible()

    ) {

        if (

            window.SERVER_HERO_UI

        ) {

            SERVER_HERO_UI.toast(

                "Complete all missions before generating the certificate.",

                "error"

            );

        }

        return false;

    }

    const certificateWindow =

        window.open(

            "",

            "_blank"

        );

    if (!certificateWindow) {

        return false;

    }

    const certificateHTML =

        buildCertificateHTML();

    certificateWindow.document.write(`

        <!DOCTYPE html>

        <html lang="en">

        <head>

            <meta charset="UTF-8">

            <meta

                name="viewport"

                content="width=device-width, initial-scale=1.0"

            >

            <title>

                SERVER HERO Certificate

            </title>

            <style>

                * {

                    box-sizing:
                        border-box;

                    margin:
                        0;

                    padding:
                        0;

                    font-family:
                        Arial,
                        sans-serif;

                }

                body {

                    min-height:
                        100vh;

                    display:
                        grid;

                    place-items:
                        center;

                    background:
                        #e9eef5;

                    padding:
                        30px;

                }

                .certificate-sheet {

                    width:
                        min(
                            1100px,
                            100%
                        );

                    background:
                        #ffffff;

                    padding:
                        25px;

                    box-shadow:
                        0 20px 60px
                        rgba(
                            0,
                            0,
                            0,
                            0.2
                        );

                }

                .certificate-border {

                    border:
                        10px solid
                        #0f3f73;

                    padding:
                        55px;

                    text-align:
                        center;

                    position:
                        relative;

                }

                .certificate-icon {

                    font-size:
                        70px;

                    margin-bottom:
                        15px;

                }

                h1 {

                    color:
                        #0f3f73;

                    font-size:
                        48px;

                    margin-bottom:
                        12px;

                }

                .certificate-header p {

                    color:
                        #f57c00;

                    font-size:
                        24px;

                    font-weight:
                        700;

                }

                .certificate-body {

                    margin:
                        45px 0;

                }

                .certificate-body > p {

                    font-size:
                        21px;

                    line-height:
                        1.7;

                    color:
                        #334155;

                }

                .certificate-body h2 {

                    margin:
                        25px 0;

                    font-size:
                        44px;

                    color:
                        #111827;

                    border-bottom:
                        3px solid
                        #f57c00;

                    display:
                        inline-block;

                    padding:
                        0 30px 8px;

                }

                .certificate-stats {

                    display:
                        grid;

                    grid-template-columns:
                        repeat(
                            3,
                            1fr
                        );

                    gap:
                        20px;

                    margin:
                        35px auto;

                    max-width:
                        720px;

                }

                .certificate-stats div {

                    padding:
                        20px;

                    border:
                        2px solid
                        #dbe6f1;

                    border-radius:
                        14px;

                }

                .certificate-stats span {

                    display:
                        block;

                    color:
                        #64748b;

                    margin-bottom:
                        8px;

                }

                .certificate-stats strong {

                    color:
                        #0f3f73;

                    font-size:
                        24px;

                }

                .certificate-date {

                    font-weight:
                        700;

                }

                .certificate-footer {

                    display:
                        flex;

                    justify-content:
                        space-between;

                    gap:
                        20px;

                    color:
                        #64748b;

                    font-size:
                        14px;

                    margin-top:
                        35px;

                }

                @media print {

                    body {

                        background:
                            #ffffff;

                        padding:
                            0;

                    }

                    .certificate-sheet {

                        box-shadow:
                            none;

                    }

                }

                @media (

                    max-width:
                        700px

                ) {

                    .certificate-border {

                        padding:
                            30px 20px;

                    }

                    h1 {

                        font-size:
                            34px;

                    }

                    .certificate-body h2 {

                        font-size:
                            32px;

                    }

                    .certificate-stats {

                        grid-template-columns:
                            1fr;

                    }

                    .certificate-footer {

                        flex-direction:
                            column;

                    }

                }

            </style>

        </head>

        <body>

            ${certificateHTML}

            <script>

                window.addEventListener(

                    "load",

                    () => {

                        window.print();

                    }

                );

            <\/script>

        </body>

        </html>

    `);

    certificateWindow.document.close();

    return true;

}


// ======================================================
// GLOBAL CERTIFICATE API
// ======================================================

window.SERVER_HERO_CERTIFICATE = {

    version:
        "4.0",

    isEligible:
        isCertificateEligible,

    getData:
        getCertificateData,

    buildHTML:
        buildCertificateHTML,

    open:
        openCertificate

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

    "CERTIFICATE ENGINE READY"

);

console.log(

    "Eligible:",

    isCertificateEligible()

);

console.log(

    "======================================"

);

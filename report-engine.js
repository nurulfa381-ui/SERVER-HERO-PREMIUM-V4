// ======================================================
// SERVER HERO PREMIUM V4.0
// report-engine.js
// FULL STABLE VERSION
// ======================================================

"use strict";


// ======================================================
// ENGINE REQUIREMENTS
// ======================================================

if (!window.SERVER_HERO_PLAYER) {

    throw new Error(

        "player-engine.js mesti dimuatkan sebelum report-engine.js."

    );

}

if (!window.SERVER_HERO_MISSION_ENGINE) {

    throw new Error(

        "mission-engine.js mesti dimuatkan sebelum report-engine.js."

    );

}

if (!window.SERVER_HERO_ACHIEVEMENTS) {

    throw new Error(

        "achievement-engine.js mesti dimuatkan sebelum report-engine.js."

    );

}


// ======================================================
// REPORT DATA
// ======================================================

function getReportData() {

    const player =

        SERVER_HERO_PLAYER

            .getDashboardData();

    const missions =

        SERVER_HERO_MISSION_ENGINE

            .getAll();

    const progress =

        SERVER_HERO_MISSION_ENGINE

            .getProgress();

    const achievements =

        SERVER_HERO_ACHIEVEMENTS

            .getAll();

    return {

        generatedAt:

            new Date()

                .toLocaleString(

                    "en-MY"

                ),

        player,

        progress,

        missions,

        achievements,

        unlockedAchievements:

            achievements.filter(

                achievement =>

                    achievement.unlocked

            ).length

    };

}


// ======================================================
// REPORT SUMMARY
// ======================================================

function getReportSummary() {

    const data =

        getReportData();

    return {

        playerName:
            data.player.name,

        xp:
            data.player.xp,

        level:
            data.player.level,

        rank:
            data.player.rank,

        completedMissions:
            data.progress.completed,

        totalMissions:
            data.progress.total,

        completion:
            data.progress.percentage,

        achievements:
            data.unlockedAchievements

    };

}


// ======================================================
// BUILD MISSION ROWS
// ======================================================

function buildMissionRows(

    missions

) {

    return missions.map(

        mission => `

            <tr>

                <td>

                    ${mission.id}

                </td>

                <td>

                    ${mission.title}

                </td>

                <td>

                    ${mission.subtitle}

                </td>

                <td>

                    ${mission.status}

                </td>

                <td>

                    ${mission.xp}

                </td>

            </tr>

        `

    ).join("");

}


// ======================================================
// BUILD ACHIEVEMENT ROWS
// ======================================================

function buildAchievementRows(

    achievements

) {

    return achievements.map(

        achievement => `

            <tr>

                <td>

                    ${achievement.icon}

                </td>

                <td>

                    ${achievement.title}

                </td>

                <td>

                    ${achievement.description}

                </td>

                <td>

                    ${

                        achievement.unlocked

                            ? "Unlocked"

                            : "Locked"

                    }

                </td>

            </tr>

        `

    ).join("");

}


// ======================================================
// BUILD REPORT HTML
// ======================================================

function buildReportHTML() {

    const data =

        getReportData();

    return `

        <section class="report-sheet">

            <header class="report-header">

                <div>

                    <h1>

                        SERVER HERO PREMIUM

                    </h1>

                    <p>

                        Student Progress Report

                    </p>

                </div>

                <div class="report-badge">

                    V4.0

                </div>

            </header>

            <section class="report-summary">

                <article>

                    <span>

                        Student

                    </span>

                    <strong>

                        ${data.player.name}

                    </strong>

                </article>

                <article>

                    <span>

                        XP

                    </span>

                    <strong>

                        ${data.player.xp}

                    </strong>

                </article>

                <article>

                    <span>

                        Level

                    </span>

                    <strong>

                        ${data.player.level}

                    </strong>

                </article>

                <article>

                    <span>

                        Rank

                    </span>

                    <strong>

                        ${data.player.rank}

                    </strong>

                </article>

                <article>

                    <span>

                        Completion

                    </span>

                    <strong>

                        ${data.progress.percentage}%

                    </strong>

                </article>

                <article>

                    <span>

                        Achievements

                    </span>

                    <strong>

                        ${data.unlockedAchievements}

                    </strong>

                </article>

            </section>

            <section class="report-section">

                <h2>

                    Mission Progress

                </h2>

                <table>

                    <thead>

                        <tr>

                            <th>

                                No.

                            </th>

                            <th>

                                Mission

                            </th>

                            <th>

                                Topic

                            </th>

                            <th>

                                Status

                            </th>

                            <th>

                                XP

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        ${buildMissionRows(

                            data.missions

                        )}

                    </tbody>

                </table>

            </section>

            <section class="report-section">

                <h2>

                    Achievements

                </h2>

                <table>

                    <thead>

                        <tr>

                            <th>

                                Icon

                            </th>

                            <th>

                                Achievement

                            </th>

                            <th>

                                Requirement

                            </th>

                            <th>

                                Status

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        ${buildAchievementRows(

                            data.achievements

                        )}

                    </tbody>

                </table>

            </section>

            <footer class="report-footer">

                <span>

                    Generated:

                    ${data.generatedAt}

                </span>

                <span>

                    SERVER HERO PREMIUM V4.0

                </span>

            </footer>

        </section>

    `;

}


// ======================================================
// OPEN REPORT
// ======================================================

function openReport() {

    const reportWindow =

        window.open(

            "",

            "_blank"

        );

    if (!reportWindow) {

        return false;

    }

    reportWindow.document.write(`

        <!DOCTYPE html>

        <html lang="en">

        <head>

            <meta charset="UTF-8">

            <meta

                name="viewport"

                content="width=device-width, initial-scale=1.0"

            >

            <title>

                SERVER HERO Progress Report

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

                    background:
                        #eef3f8;

                    color:
                        #172033;

                    padding:
                        30px;

                }

                .report-sheet {

                    width:
                        min(
                            1200px,
                            100%
                        );

                    margin:
                        auto;

                    background:
                        #ffffff;

                    padding:
                        35px;

                    border-radius:
                        20px;

                    box-shadow:
                        0 20px 60px
                        rgba(
                            0,
                            0,
                            0,
                            0.15
                        );

                }

                .report-header {

                    display:
                        flex;

                    justify-content:
                        space-between;

                    align-items:
                        center;

                    gap:
                        20px;

                    padding-bottom:
                        25px;

                    border-bottom:
                        4px solid
                        #0f3f73;

                }

                .report-header h1 {

                    color:
                        #0f3f73;

                    font-size:
                        34px;

                }

                .report-header p {

                    margin-top:
                        8px;

                    color:
                        #64748b;

                }

                .report-badge {

                    background:
                        #f57c00;

                    color:
                        #ffffff;

                    padding:
                        12px 18px;

                    border-radius:
                        999px;

                    font-weight:
                        700;

                }

                .report-summary {

                    display:
                        grid;

                    grid-template-columns:
                        repeat(
                            3,
                            1fr
                        );

                    gap:
                        18px;

                    margin:
                        30px 0;

                }

                .report-summary article {

                    padding:
                        20px;

                    border:
                        1px solid
                        #d7e2ee;

                    border-radius:
                        14px;

                    background:
                        #f8fbff;

                }

                .report-summary span {

                    display:
                        block;

                    color:
                        #64748b;

                    margin-bottom:
                        8px;

                }

                .report-summary strong {

                    color:
                        #0f3f73;

                    font-size:
                        22px;

                }

                .report-section {

                    margin-top:
                        35px;

                }

                .report-section h2 {

                    margin-bottom:
                        16px;

                    color:
                        #0f3f73;

                }

                table {

                    width:
                        100%;

                    border-collapse:
                        collapse;

                }

                th,

                td {

                    padding:
                        13px;

                    border:
                        1px solid
                        #d9e3ee;

                    text-align:
                        left;

                    font-size:
                        14px;

                }

                th {

                    background:
                        #0f3f73;

                    color:
                        #ffffff;

                }

                tbody tr:nth-child(even) {

                    background:
                        #f7faff;

                }

                .report-footer {

                    display:
                        flex;

                    justify-content:
                        space-between;

                    gap:
                        20px;

                    margin-top:
                        35px;

                    padding-top:
                        18px;

                    border-top:
                        1px solid
                        #d9e3ee;

                    color:
                        #64748b;

                    font-size:
                        13px;

                }

                @media print {

                    body {

                        background:
                            #ffffff;

                        padding:
                            0;

                    }

                    .report-sheet {

                        box-shadow:
                            none;

                    }

                }

                @media (

                    max-width:
                        800px

                ) {

                    .report-summary {

                        grid-template-columns:
                            repeat(
                                2,
                                1fr
                            );

                    }

                    .report-header,

                    .report-footer {

                        flex-direction:
                            column;

                        align-items:
                            flex-start;

                    }

                    .report-section {

                        overflow-x:
                            auto;

                    }

                }

                @media (

                    max-width:
                        520px

                ) {

                    .report-summary {

                        grid-template-columns:
                            1fr;

                    }

                }

            </style>

        </head>

        <body>

            ${buildReportHTML()}

        </body>

        </html>

    `);

    reportWindow.document.close();

    return true;

}


// ======================================================
// GLOBAL REPORT API
// ======================================================

window.SERVER_HERO_REPORT = {

    version:
        "4.0",

    getData:
        getReportData,

    getSummary:
        getReportSummary,

    buildHTML:
        buildReportHTML,

    open:
        openReport

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

    "REPORT ENGINE READY"

);

console.log(

    "======================================"

);

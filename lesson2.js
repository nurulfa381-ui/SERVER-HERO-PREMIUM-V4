// ======================================================
// SERVER HERO PREMIUM V4.0
// lesson2.js
// MISI 02 - KONFIGURASI TCP/IP
// FULL STABLE VERSION
// ======================================================

"use strict";


// ======================================================
// ENGINE REQUIREMENTS
// ======================================================

const REQUIRED_ENGINES = [

    "SERVER_HERO_STORAGE",

    "SERVER_HERO_PLAYER",

    "SERVER_HERO_MISSION_ENGINE",

    "SERVER_HERO_ACHIEVEMENTS",

    "SERVER_HERO_UI"

];


REQUIRED_ENGINES.forEach(

    engineName => {

        if (!window[engineName]) {

            throw new Error(

                `${engineName} belum dimuatkan. Semak susunan script dalam lesson2.html.`

            );

        }

    }

);


// ======================================================
// MISSION CONFIGURATION
// ======================================================

const LESSON_ID = 2;

const PASSING_SCORE = 80;

const CORRECT_NETWORK_CONFIG = Object.freeze({

    ipAddress:
        "192.168.10.10",

    subnetMask:
        "255.255.255.0",

    gateway:
        "192.168.10.1",

    dns:
        "192.168.10.10"

});


const LESSON_STORAGE_KEYS = Object.freeze({

    simulationCompleted:
        "lesson2SimulationCompletedV4",

    matchingCompleted:
        "lesson2MatchingCompletedV4",

    quizAnswers:
        "lesson2QuizAnswersV4",

    quizScore:
        "lesson2QuizScoreV4",

    quizPassed:
        "lesson2QuizPassedV4",

    currentQuestion:
        "lesson2CurrentQuestionV4"

});


// ======================================================
// QUIZ DATABASE
// ======================================================

const QUIZ_QUESTIONS = Object.freeze([

    {

        question:
            "Apakah fungsi utama alamat IP?",

        answers: [

            "Mengenal pasti peranti dalam rangkaian",

            "Menentukan saiz storan",

            "Menyimpan kata laluan",

            "Mengawal kelajuan CPU"

        ],

        correctIndex:
            0

    },

    {

        question:
            "Apakah alamat IP statik yang digunakan dalam misi ini?",

        answers: [

            "192.168.1.1",

            "192.168.10.10",

            "10.0.0.1",

            "172.16.0.10"

        ],

        correctIndex:
            1

    },

    {

        question:
            "Apakah Subnet Mask bagi rangkaian /24?",

        answers: [

            "255.0.0.0",

            "255.255.0.0",

            "255.255.255.0",

            "255.255.255.255"

        ],

        correctIndex:
            2

    },

    {

        question:
            "Apakah fungsi Default Gateway?",

        answers: [

            "Laluan ke rangkaian lain",

            "Menyimpan fail pengguna",

            "Mengawal paparan monitor",

            "Memasang Windows"

        ],

        correctIndex:
            0

    },

    {

        question:
            "Apakah Preferred DNS untuk server dalam misi ini?",

        answers: [

            "8.8.8.8",

            "1.1.1.1",

            "192.168.10.10",

            "192.168.10.254"

        ],

        correctIndex:
            2

    },

    {

        question:
            "Mengapa server perlu menggunakan IP statik?",

        answers: [

            "Supaya alamat sentiasa berubah",

            "Supaya alamat kekal dan mudah dicapai",

            "Supaya komputer lebih ringan",

            "Supaya tiada sambungan rangkaian"

        ],

        correctIndex:
            1

    },

    {

        question:
            "Perintah manakah digunakan untuk melihat konfigurasi IP?",

        answers: [

            "format",

            "ipconfig",

            "dir",

            "tasklist"

        ],

        correctIndex:
            1

    },

    {

        question:
            "Perintah manakah digunakan untuk menguji sambungan rangkaian?",

        answers: [

            "ping",

            "copy",

            "mkdir",

            "shutdown"

        ],

        correctIndex:
            0

    },

    {

        question:
            "Di manakah IPv4 dikonfigurasikan pada Windows Server?",

        answers: [

            "Internet Protocol Version 4 Properties",

            "Task Manager",

            "Registry Editor sahaja",

            "Recycle Bin"

        ],

        correctIndex:
            0

    },

    {

        question:
            "Apakah tanda konfigurasi rangkaian berjaya?",

        answers: [

            "IP kosong",

            "Ping berjaya dan ipconfig memaparkan tetapan betul",

            "Server tidak boleh dibuka",

            "Paparan menjadi gelap"

        ],

        correctIndex:
            1

    }

]);


// ======================================================
// APPLICATION STATE
// ======================================================

let simulationCompleted = false;

let matchingCompleted = false;

let quizPassed = false;

let currentQuestionIndex = 0;

let selectedAnswers = new Array(

    QUIZ_QUESTIONS.length

).fill(null);


// ======================================================
// DOM REFERENCES
// ======================================================

const DOM = {

    playerXP:
        document.getElementById("playerXP"),

    playerRank:
        document.getElementById("playerRank"),

    lessonProgress:
        document.getElementById("lessonProgress"),

    lessonProgressText:
        document.getElementById("lessonProgressText"),

    ipAddressInput:
        document.getElementById("ipAddressInput"),

    subnetMaskInput:
        document.getElementById("subnetMaskInput"),

    gatewayInput:
        document.getElementById("gatewayInput"),

    dnsInput:
        document.getElementById("dnsInput"),

    testConfigBtn:
        document.getElementById("testConfigBtn"),

    resetConfigBtn:
        document.getElementById("resetConfigBtn"),

    simulationResult:
        document.getElementById("simulationResult"),

    matchingActivity:
        document.getElementById("matchingActivity"),

    checkMatchingBtn:
        document.getElementById("checkMatchingBtn"),

    matchingResult:
        document.getElementById("matchingResult"),

    questionCounter:
        document.getElementById("questionCounter"),

    quizContainer:
        document.getElementById("quizContainer"),

    quizFeedback:
        document.getElementById("quizFeedback"),

    previousQuestionBtn:
        document.getElementById("previousQuestionBtn"),

    nextQuestionBtn:
        document.getElementById("nextQuestionBtn"),

    resultSection:
        document.getElementById("resultSection"),

    resultTitle:
        document.getElementById("resultTitle"),

    resultMessage:
        document.getElementById("resultMessage"),

    finalScore:
        document.getElementById("finalScore"),

    retryQuizBtn:
        document.getElementById("retryQuizBtn"),

    completeMissionBtn:
        document.getElementById("completeMissionBtn"),

    nextMissionBtn:
        document.getElementById("nextMissionBtn")

};


// ======================================================
// STORAGE
// ======================================================

function loadLessonState() {

    simulationCompleted =

        SERVER_HERO_STORAGE.readRaw(

            LESSON_STORAGE_KEYS.simulationCompleted

        ) === "true";

    matchingCompleted =

        SERVER_HERO_STORAGE.readRaw(

            LESSON_STORAGE_KEYS.matchingCompleted

        ) === "true";

    quizPassed =

        SERVER_HERO_STORAGE.readRaw(

            LESSON_STORAGE_KEYS.quizPassed

        ) === "true";

    const savedAnswers =

        SERVER_HERO_STORAGE.readArray(

            LESSON_STORAGE_KEYS.quizAnswers,

            []

        );

    if (

        savedAnswers.length ===

        QUIZ_QUESTIONS.length

    ) {

        selectedAnswers = savedAnswers;

    }

    currentQuestionIndex =

        Number(

            SERVER_HERO_STORAGE.readRaw(

                LESSON_STORAGE_KEYS.currentQuestion

            )

        ) || 0;

    currentQuestionIndex = Math.max(

        0,

        Math.min(

            QUIZ_QUESTIONS.length - 1,

            currentQuestionIndex

        )

    );

}


function saveLessonState() {

    SERVER_HERO_STORAGE.writeRaw(

        LESSON_STORAGE_KEYS.simulationCompleted,

        simulationCompleted ? "true" : "false"

    );

    SERVER_HERO_STORAGE.writeRaw(

        LESSON_STORAGE_KEYS.matchingCompleted,

        matchingCompleted ? "true" : "false"

    );

    SERVER_HERO_STORAGE.writeRaw(

        LESSON_STORAGE_KEYS.quizPassed,

        quizPassed ? "true" : "false"

    );

    SERVER_HERO_STORAGE.write(

        LESSON_STORAGE_KEYS.quizAnswers,

        selectedAnswers

    );

    SERVER_HERO_STORAGE.writeRaw(

        LESSON_STORAGE_KEYS.currentQuestion,

        String(currentQuestionIndex)

    );

}


// ======================================================
// PLAYER DISPLAY
// ======================================================

function updatePlayerDisplay() {

    const player = SERVER_HERO_PLAYER.get();

    if (DOM.playerXP) {

        DOM.playerXP.textContent = player.xp;

    }

    if (DOM.playerRank) {

        DOM.playerRank.textContent = player.rank;

    }

}


// ======================================================
// PROGRESS
// ======================================================

function calculateLessonProgress() {

    let progress = 10;

    if (simulationCompleted) {

        progress += 30;

    }

    if (matchingCompleted) {

        progress += 25;

    }

    const answeredCount = selectedAnswers.filter(

        answer => answer !== null

    ).length;

    progress += Math.round(

        (

            answeredCount /

            QUIZ_QUESTIONS.length

        ) * 20

    );

    if (quizPassed) {

        progress += 15;

    }

    return Math.min(100, progress);

}


function updateLessonProgress() {

    const value = calculateLessonProgress();

    if (DOM.lessonProgress) {

        SERVER_HERO_UI.animateProgress(

            DOM.lessonProgress,

            value,

            500

        );

    }

    if (DOM.lessonProgressText) {

        DOM.lessonProgressText.textContent =

            `${value}%`;

    }

}


// ======================================================
// NETWORK SIMULATION
// ======================================================

function normalizeIP(value) {

    return String(value || "")

        .trim()

        .replace(/\s+/g, "");

}


function validateIPv4(value) {

    const parts = normalizeIP(value).split(".");

    if (parts.length !== 4) {

        return false;

    }

    return parts.every(

        part => {

            if (!/^\d+$/.test(part)) {

                return false;

            }

            const number = Number(part);

            return number >= 0 && number <= 255;

        }

    );

}


function setInputValidation(

    input,

    valid

) {

    if (!input) {

        return;

    }

    input.classList.remove(

        "valid",

        "invalid"

    );

    input.classList.add(

        valid ? "valid" : "invalid"

    );

}


function testNetworkConfiguration() {

    const values = {

        ipAddress:
            normalizeIP(DOM.ipAddressInput?.value),

        subnetMask:
            normalizeIP(DOM.subnetMaskInput?.value),

        gateway:
            normalizeIP(DOM.gatewayInput?.value),

        dns:
            normalizeIP(DOM.dnsInput?.value)

    };

    const allValidFormat = Object.values(values)

        .every(validateIPv4);

    const exactMatch =

        values.ipAddress ===

            CORRECT_NETWORK_CONFIG.ipAddress &&

        values.subnetMask ===

            CORRECT_NETWORK_CONFIG.subnetMask &&

        values.gateway ===

            CORRECT_NETWORK_CONFIG.gateway &&

        values.dns ===

            CORRECT_NETWORK_CONFIG.dns;

    setInputValidation(

        DOM.ipAddressInput,

        values.ipAddress ===

            CORRECT_NETWORK_CONFIG.ipAddress

    );

    setInputValidation(

        DOM.subnetMaskInput,

        values.subnetMask ===

            CORRECT_NETWORK_CONFIG.subnetMask

    );

    setInputValidation(

        DOM.gatewayInput,

        values.gateway ===

            CORRECT_NETWORK_CONFIG.gateway

    );

    setInputValidation(

        DOM.dnsInput,

        values.dns ===

            CORRECT_NETWORK_CONFIG.dns

    );

    if (!allValidFormat) {

        simulationCompleted = false;

        DOM.simulationResult.textContent =

            "❌ Format alamat IPv4 tidak sah. Pastikan setiap alamat mempunyai empat nombor.";

        DOM.simulationResult.className =

            "feedback-box wrong";

        SERVER_HERO_UI.toast(

            "Format IPv4 tidak sah.",

            "error"

        );

    }

    else if (!exactMatch) {

        simulationCompleted = false;

        DOM.simulationResult.textContent =

            "❌ Tetapan belum tepat. Semak IP Address, Subnet Mask, Gateway dan DNS.";

        DOM.simulationResult.className =

            "feedback-box wrong";

        SERVER_HERO_UI.toast(

            "Konfigurasi belum betul.",

            "error"

        );

    }

    else {

        simulationCompleted = true;

        DOM.simulationResult.textContent =

            "✅ Konfigurasi berjaya. Ping ke 192.168.10.1 menunjukkan Reply.";

        DOM.simulationResult.className =

            "feedback-box correct";

        SERVER_HERO_UI.toast(

            "Konfigurasi TCP/IP berjaya.",

            "success"

        );

    }

    saveLessonState();

    updateLessonProgress();

    updateCompletionState();

}


function resetNetworkConfiguration() {

    if (

        SERVER_HERO_MISSION_ENGINE.isCompleted(

            LESSON_ID

        )

    ) {

        SERVER_HERO_UI.toast(

            "Misi telah selesai. Simulasi dikunci.",

            "info"

        );

        return;

    }

    [

        DOM.ipAddressInput,

        DOM.subnetMaskInput,

        DOM.gatewayInput,

        DOM.dnsInput

    ].forEach(

        input => {

            if (input) {

                input.value = "";

                input.classList.remove(

                    "valid",

                    "invalid"

                );

            }

        }

    );

    simulationCompleted = false;

    DOM.simulationResult.textContent =

        "Masukkan semua tetapan rangkaian.";

    DOM.simulationResult.className =

        "feedback-box";

    saveLessonState();

    updateLessonProgress();

    updateCompletionState();

}


// ======================================================
// MATCHING ACTIVITY
// ======================================================

function getMatchingSelects() {

    if (!DOM.matchingActivity) {

        return [];

    }

    return Array.from(

        DOM.matchingActivity.querySelectorAll(

            "select[data-answer]"

        )

    );

}


function checkMatchingActivity() {

    const selects = getMatchingSelects();

    if (

        selects.some(

            select => !select.value

        )

    ) {

        SERVER_HERO_UI.toast(

            "Lengkapkan semua padanan dahulu.",

            "error"

        );

        return;

    }

    let correctCount = 0;

    selects.forEach(

        select => {

            const article = select.closest("article");

            const correct =

                select.value ===

                select.dataset.answer;

            article?.classList.remove(

                "correct",

                "wrong"

            );

            article?.classList.add(

                correct ? "correct" : "wrong"

            );

            if (correct) {

                correctCount++;

            }

        }

    );

    matchingCompleted =

        correctCount === selects.length;

    if (matchingCompleted) {

        DOM.matchingResult.textContent =

            "✅ Semua padanan adalah betul.";

        DOM.matchingResult.className =

            "feedback-box correct";

        SERVER_HERO_UI.toast(

            "Aktiviti padanan berjaya.",

            "success"

        );

    }

    else {

        DOM.matchingResult.textContent =

            `❌ ${correctCount} daripada ${selects.length} padanan betul. Cuba semula.`;

        DOM.matchingResult.className =

            "feedback-box wrong";

    }

    saveLessonState();

    updateLessonProgress();

    updateCompletionState();

}


// ======================================================
// QUIZ
// ======================================================

function renderQuestion() {

    if (!DOM.quizContainer) {

        return;

    }

    const question =

        QUIZ_QUESTIONS[

            currentQuestionIndex

        ];

    DOM.quizContainer.innerHTML = `

        <div class="quiz-question">

            <h3>

                ${SERVER_HERO_UI.escapeHTML(

                    question.question

                )}

            </h3>

        </div>

        <div class="answer-list">

            ${question.answers.map(

                (

                    answer,

                    answerIndex

                ) => `

                    <button

                        type="button"

                        class="answer-option ${

                            selectedAnswers[

                                currentQuestionIndex

                            ] === answerIndex

                                ? "selected"

                                : ""

                        }"

                        data-answer-index="${answerIndex}"

                    >

                        ${SERVER_HERO_UI.escapeHTML(answer)}

                    </button>

                `

            ).join("")}

        </div>

    `;

    DOM.quizContainer

        .querySelectorAll(

            ".answer-option"

        )

        .forEach(

            button => {

                button.addEventListener(

                    "click",

                    () => {

                        selectedAnswers[

                            currentQuestionIndex

                        ] = Number(

                            button.dataset.answerIndex

                        );

                        renderQuestion();

                    }

                );

            }

        );

    DOM.questionCounter.textContent =

        `${currentQuestionIndex + 1} / ${QUIZ_QUESTIONS.length}`;

    DOM.previousQuestionBtn.disabled =

        currentQuestionIndex === 0;

    DOM.nextQuestionBtn.innerHTML =

        currentQuestionIndex ===

            QUIZ_QUESTIONS.length - 1

            ? `Hantar Kuiz <i class="fa-solid fa-check"></i>`

            : `Seterusnya <i class="fa-solid fa-arrow-right"></i>`;

    DOM.quizFeedback.textContent =

        selectedAnswers[

            currentQuestionIndex

        ] === null

            ? "Pilih satu jawapan."

            : "Jawapan telah dipilih.";

    DOM.quizFeedback.className =

        selectedAnswers[

            currentQuestionIndex

        ] === null

            ? "feedback-box"

            : "feedback-box correct";

    saveLessonState();

    updateLessonProgress();

}


function previousQuestion() {

    if (currentQuestionIndex > 0) {

        currentQuestionIndex--;

        renderQuestion();

    }

}


function nextQuestion() {

    if (

        selectedAnswers[

            currentQuestionIndex

        ] === null

    ) {

        SERVER_HERO_UI.toast(

            "Pilih satu jawapan dahulu.",

            "error"

        );

        return;

    }

    if (

        currentQuestionIndex <

        QUIZ_QUESTIONS.length - 1

    ) {

        currentQuestionIndex++;

        renderQuestion();

        return;

    }

    submitQuiz();

}


function calculateQuizScore() {

    const correctAnswers =

        QUIZ_QUESTIONS.reduce(

            (

                total,

                question,

                index

            ) =>

                total +

                (

                    selectedAnswers[index] ===

                    question.correctIndex

                        ? 1

                        : 0

                ),

            0

        );

    return {

        correctAnswers,

        total:
            QUIZ_QUESTIONS.length,

        percentage:
            Math.round(

                (

                    correctAnswers /

                    QUIZ_QUESTIONS.length

                ) * 100

            )

    };

}


function submitQuiz() {

    if (

        selectedAnswers.some(

            answer => answer === null

        )

    ) {

        SERVER_HERO_UI.toast(

            "Jawab semua soalan dahulu.",

            "error"

        );

        return;

    }

    const result = calculateQuizScore();

    quizPassed =

        result.percentage >=

        PASSING_SCORE;

    SERVER_HERO_STORAGE.writeRaw(

        LESSON_STORAGE_KEYS.quizScore,

        String(result.percentage)

    );

    SERVER_HERO_STORAGE.writeRaw(

        LESSON_STORAGE_KEYS.quizPassed,

        quizPassed ? "true" : "false"

    );

    SERVER_HERO_STORAGE.setMissionQuizPassed(

        LESSON_ID,

        quizPassed

    );

    showQuizResult(result);

    saveLessonState();

    updateLessonProgress();

    updateCompletionState();

}


function showQuizResult(result) {

    DOM.resultSection.classList.remove(

        "hidden"

    );

    DOM.finalScore.textContent =

        `${result.percentage}%`;

    if (quizPassed) {

        DOM.resultTitle.textContent =

            "Tahniah, Anda Lulus!";

        DOM.resultMessage.textContent =

            `Anda menjawab ${result.correctAnswers} daripada ${result.total} soalan dengan betul.`;

        SERVER_HERO_UI.toast(

            "Kuiz Misi 02 berjaya diluluskan.",

            "success"

        );

    }

    else {

        DOM.resultTitle.textContent =

            "Belum Mencapai Markah Lulus";

        DOM.resultMessage.textContent =

            `Markah anda ${result.percentage}%. Markah minimum ialah ${PASSING_SCORE}%.`;

        SERVER_HERO_UI.toast(

            "Cuba semula untuk mencapai 80%.",

            "error"

        );

    }

    DOM.resultSection.scrollIntoView({

        behavior:
            "smooth",

        block:
            "center"

    });

}


function retryQuiz() {

    selectedAnswers = new Array(

        QUIZ_QUESTIONS.length

    ).fill(null);

    currentQuestionIndex = 0;

    quizPassed = false;

    SERVER_HERO_STORAGE.remove(

        LESSON_STORAGE_KEYS.quizScore

    );

    SERVER_HERO_STORAGE.remove(

        LESSON_STORAGE_KEYS.quizPassed

    );

    SERVER_HERO_STORAGE.setMissionQuizPassed(

        LESSON_ID,

        false

    );

    DOM.resultSection.classList.add(

        "hidden"

    );

    saveLessonState();

    renderQuestion();

    updateLessonProgress();

    updateCompletionState();

}


// ======================================================
// COMPLETION
// ======================================================

function updateCompletionState() {

    const canComplete =

        simulationCompleted &&

        matchingCompleted &&

        quizPassed;

    const alreadyCompleted =

        SERVER_HERO_MISSION_ENGINE

            .isCompleted(

                LESSON_ID

            );

    DOM.completeMissionBtn.disabled =

        !canComplete ||

        alreadyCompleted;

    DOM.completeMissionBtn.classList.toggle(

        "ready",

        canComplete &&

        !alreadyCompleted

    );

    if (alreadyCompleted) {

        DOM.completeMissionBtn.innerHTML =

            `<i class="fa-solid fa-circle-check"></i> Misi Telah Selesai`;

    }

    else if (canComplete) {

        DOM.completeMissionBtn.innerHTML =

            `<i class="fa-solid fa-award"></i> Lengkapkan Misi 02`;

    }

    else {

        DOM.completeMissionBtn.innerHTML =

            `<i class="fa-solid fa-lock"></i> Lengkapkan Misi 02`;

    }

    DOM.nextMissionBtn.disabled =

        !alreadyCompleted;

    if (alreadyCompleted) {

        DOM.nextMissionBtn.onclick =

            () => {

                window.location.href =

                    "lesson3.html";

            };

        lockCompletedActivities();

    }

}


function lockCompletedActivities() {

    [

        DOM.ipAddressInput,

        DOM.subnetMaskInput,

        DOM.gatewayInput,

        DOM.dnsInput,

        DOM.testConfigBtn,

        DOM.resetConfigBtn,

        DOM.checkMatchingBtn

    ].forEach(

        element => {

            if (element) {

                element.disabled = true;

            }

        }

    );

    getMatchingSelects().forEach(

        select => {

            select.disabled = true;

        }

    );

}


function completeMission() {

    if (

        !simulationCompleted ||

        !matchingCompleted ||

        !quizPassed

    ) {

        SERVER_HERO_UI.toast(

            "Lengkapkan simulasi, aktiviti dan kuiz dahulu.",

            "error"

        );

        return;

    }

    const result =

        SERVER_HERO_MISSION_ENGINE

            .complete(

                LESSON_ID

            );

    if (result.success) {

        SERVER_HERO_ACHIEVEMENTS.check();

        updatePlayerDisplay();

        updateCompletionState();

        SERVER_HERO_UI.modal({

            title:
                "Misi 02 Selesai",

            message:
                "Tahniah! Mission 03 kini telah dibuka.",

            icon:
                "🌐",

            confirmText:
                "Kembali ke Dashboard",

            onConfirm() {

                window.location.href =

                    "index.html";

            }

        });

        return;

    }

    if (

        result.reason ===

        "already-completed"

    ) {

        SERVER_HERO_UI.toast(

            "Misi ini telah pun diselesaikan.",

            "info"

        );

        updateCompletionState();

    }

}


// ======================================================
// RESTORE UI
// ======================================================

function restoreCompletedState() {

    if (simulationCompleted) {

        DOM.ipAddressInput.value =

            CORRECT_NETWORK_CONFIG.ipAddress;

        DOM.subnetMaskInput.value =

            CORRECT_NETWORK_CONFIG.subnetMask;

        DOM.gatewayInput.value =

            CORRECT_NETWORK_CONFIG.gateway;

        DOM.dnsInput.value =

            CORRECT_NETWORK_CONFIG.dns;

        [

            DOM.ipAddressInput,

            DOM.subnetMaskInput,

            DOM.gatewayInput,

            DOM.dnsInput

        ].forEach(

            input => {

                input.classList.add(

                    "valid"

                );

            }

        );

        DOM.simulationResult.textContent =

            "✅ Simulasi telah diselesaikan.";

        DOM.simulationResult.className =

            "feedback-box correct";

    }

    if (matchingCompleted) {

        getMatchingSelects().forEach(

            select => {

                select.value =

                    select.dataset.answer;

                select.closest("article")

                    ?.classList.add(

                        "correct"

                    );

            }

        );

        DOM.matchingResult.textContent =

            "✅ Aktiviti padanan telah diselesaikan.";

        DOM.matchingResult.className =

            "feedback-box correct";

    }

}


// ======================================================
// EVENT BINDING
// ======================================================

function bindEvents() {

    DOM.testConfigBtn?.addEventListener(

        "click",

        testNetworkConfiguration

    );

    DOM.resetConfigBtn?.addEventListener(

        "click",

        resetNetworkConfiguration

    );

    DOM.checkMatchingBtn?.addEventListener(

        "click",

        checkMatchingActivity

    );

    DOM.previousQuestionBtn?.addEventListener(

        "click",

        previousQuestion

    );

    DOM.nextQuestionBtn?.addEventListener(

        "click",

        nextQuestion

    );

    DOM.retryQuizBtn?.addEventListener(

        "click",

        retryQuiz

    );

    DOM.completeMissionBtn?.addEventListener(

        "click",

        completeMission

    );

}


// ======================================================
// INITIALIZATION
// ======================================================

function initializeLesson2() {

    loadLessonState();

    bindEvents();

    restoreCompletedState();

    renderQuestion();

    updatePlayerDisplay();

    updateLessonProgress();

    updateCompletionState();

    if (quizPassed) {

        const savedScore =

            Number(

                SERVER_HERO_STORAGE.readRaw(

                    LESSON_STORAGE_KEYS.quizScore

                )

            ) || 0;

        showQuizResult({

            correctAnswers:
                Math.round(

                    (

                        savedScore /

                        100

                    ) *

                    QUIZ_QUESTIONS.length

                ),

            total:
                QUIZ_QUESTIONS.length,

            percentage:
                savedScore

        });

    }

    console.log(

        "LESSON 2 ENGINE READY"

    );

}


initializeLesson2();

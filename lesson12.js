// SERVER HERO PREMIUM V4.0 - lesson12.js
"use strict";

const REQUIRED_ENGINES = [
    "SERVER_HERO_STORAGE",
    "SERVER_HERO_PLAYER",
    "SERVER_HERO_MISSION_ENGINE",
    "SERVER_HERO_ACHIEVEMENTS",
    "SERVER_HERO_UI"
];

REQUIRED_ENGINES.forEach((engineName) => {
    if (!window[engineName]) {
        throw new Error(`${engineName} belum dimuatkan. Semak lesson12.html.`);
    }
});

const LESSON_ID = 12;
const PASSING_SCORE = 80;

const CORRECT_SECURITY_CONFIG = Object.freeze({
    firewallStatus: "on",
    antivirusScan: "full-scan",
    threatStatus: "no-threat",
    updateStatus: "up-to-date",
    eventLog: "system-security",
    criticalEvent: "resolved",
    cpuUsage: "35%",
    monitoringStatus: "normal"
});

const KEYS = Object.freeze({
    simulationCompleted: "lesson12SimulationCompletedV4",
    matchingCompleted: "lesson12MatchingCompletedV4",
    quizAnswers: "lesson12QuizAnswersV4",
    quizScore: "lesson12QuizScoreV4",
    quizPassed: "lesson12QuizPassedV4",
    currentQuestion: "lesson12CurrentQuestionV4"
});

const QUIZ_QUESTIONS = Object.freeze([
    {
        question: "Apakah fungsi Windows Defender Firewall?",
        answers: [
            "Mengawal trafik rangkaian",
            "Menyimpan fail",
            "Memberikan alamat IP",
            "Mencipta pengguna"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah fungsi Defender Antivirus?",
        answers: [
            "Mengesan dan menghapuskan malware",
            "Mencipta DNS zone",
            "Mengurus DHCP",
            "Mengawal printer"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah tujuan Windows Update?",
        answers: [
            "Memasang patch keselamatan",
            "Mengubah domain",
            "Memadam log",
            "Menambah RAM"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah fungsi Event Viewer?",
        answers: [
            "Melihat log sistem dan keselamatan",
            "Mencipta backup",
            "Menukar IP",
            "Mengurus folder share"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah fungsi Performance Monitor?",
        answers: [
            "Memantau CPU, memori dan cakera",
            "Mencetak dokumen",
            "Mencipta user",
            "Mengurus GPO"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah status firewall yang betul dalam misi ini?",
        answers: [
            "On",
            "Off",
            "Disabled",
            "Unknown"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah jenis antivirus scan dalam misi ini?",
        answers: [
            "Full Scan",
            "Quick Scan",
            "Offline sahaja",
            "Tiada scan"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah CPU usage yang dianggap normal dalam simulasi?",
        answers: [
            "35%",
            "100%",
            "95%",
            "0% sepanjang masa"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah tindakan selepas menemui Critical Event?",
        answers: [
            "Siasat dan selesaikan puncanya",
            "Padam semua log",
            "Tutup firewall",
            "Format server"
        ],
        correctIndex: 0
    },
    {
        question: "Mengapa firewall tidak patut dimatikan sesuka hati?",
        answers: [
            "Ia boleh mendedahkan server kepada serangan",
            "Ia menambah RAM",
            "Ia menukar DNS",
            "Ia menutup printer"
        ],
        correctIndex: 0
    }
]);

let simulationCompleted = false;
let matchingCompleted = false;
let quizPassed = false;
let currentQuestionIndex = 0;
let selectedAnswers = new Array(QUIZ_QUESTIONS.length).fill(null);

const DOM = {
    playerXP: document.getElementById("playerXP"),
    playerRank: document.getElementById("playerRank"),
    lessonProgress: document.getElementById("lessonProgress"),
    lessonProgressText: document.getElementById("lessonProgressText"),

    firewallStatusSelect: document.getElementById("firewallStatusSelect"),
    antivirusScanSelect: document.getElementById("antivirusScanSelect"),
    threatStatusSelect: document.getElementById("threatStatusSelect"),
    updateStatusSelect: document.getElementById("updateStatusSelect"),
    eventLogSelect: document.getElementById("eventLogSelect"),
    criticalEventSelect: document.getElementById("criticalEventSelect"),
    cpuUsageInput: document.getElementById("cpuUsageInput"),
    monitoringStatusSelect: document.getElementById("monitoringStatusSelect"),
    testSecurityBtn: document.getElementById("testSecurityBtn"),
    resetSecurityBtn: document.getElementById("resetSecurityBtn"),
    securityResult: document.getElementById("securityResult"),

    matchingActivity: document.getElementById("matchingActivity"),
    checkMatchingBtn: document.getElementById("checkMatchingBtn"),
    matchingResult: document.getElementById("matchingResult"),

    questionCounter: document.getElementById("questionCounter"),
    quizContainer: document.getElementById("quizContainer"),
    quizFeedback: document.getElementById("quizFeedback"),
    previousQuestionBtn: document.getElementById("previousQuestionBtn"),
    nextQuestionBtn: document.getElementById("nextQuestionBtn"),

    resultSection: document.getElementById("resultSection"),
    resultTitle: document.getElementById("resultTitle"),
    resultMessage: document.getElementById("resultMessage"),
    finalScore: document.getElementById("finalScore"),
    retryQuizBtn: document.getElementById("retryQuizBtn"),

    completeMissionBtn: document.getElementById("completeMissionBtn"),
    nextMissionBtn: document.getElementById("nextMissionBtn")
};

function normalize(value) {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "");
}

function loadState() {
    simulationCompleted =
        SERVER_HERO_STORAGE.readRaw(KEYS.simulationCompleted) === "true";

    matchingCompleted =
        SERVER_HERO_STORAGE.readRaw(KEYS.matchingCompleted) === "true";

    quizPassed =
        SERVER_HERO_STORAGE.readRaw(KEYS.quizPassed) === "true";

    const savedAnswers =
        SERVER_HERO_STORAGE.readArray(KEYS.quizAnswers, []);

    if (savedAnswers.length === QUIZ_QUESTIONS.length) {
        selectedAnswers = savedAnswers;
    }

    currentQuestionIndex =
        Number(SERVER_HERO_STORAGE.readRaw(KEYS.currentQuestion)) || 0;

    currentQuestionIndex = Math.max(
        0,
        Math.min(QUIZ_QUESTIONS.length - 1, currentQuestionIndex)
    );
}

function saveState() {
    SERVER_HERO_STORAGE.writeRaw(
        KEYS.simulationCompleted,
        simulationCompleted ? "true" : "false"
    );

    SERVER_HERO_STORAGE.writeRaw(
        KEYS.matchingCompleted,
        matchingCompleted ? "true" : "false"
    );

    SERVER_HERO_STORAGE.writeRaw(
        KEYS.quizPassed,
        quizPassed ? "true" : "false"
    );

    SERVER_HERO_STORAGE.write(KEYS.quizAnswers, selectedAnswers);

    SERVER_HERO_STORAGE.writeRaw(
        KEYS.currentQuestion,
        String(currentQuestionIndex)
    );
}

function updatePlayerDisplay() {
    const player = SERVER_HERO_PLAYER.get();
    DOM.playerXP.textContent = player.xp;
    DOM.playerRank.textContent = player.rank;
}

function updateProgress() {
    let progress = 10;

    if (simulationCompleted) progress += 35;
    if (matchingCompleted) progress += 25;

    const answered = selectedAnswers.filter(
        (answer) => answer !== null
    ).length;

    progress += Math.round(
        (answered / QUIZ_QUESTIONS.length) * 15
    );

    if (quizPassed) progress += 15;

    progress = Math.min(progress, 100);

    SERVER_HERO_UI.animateProgress(
        DOM.lessonProgress,
        progress,
        500
    );

    DOM.lessonProgressText.textContent = `${progress}%`;
}

function markField(element, valid) {
    element.classList.remove("valid", "invalid");
    element.classList.add(valid ? "valid" : "invalid");
}

function testSecurityConfiguration() {
    const values = {
        firewallStatus: DOM.firewallStatusSelect.value,
        antivirusScan: DOM.antivirusScanSelect.value,
        threatStatus: DOM.threatStatusSelect.value,
        updateStatus: DOM.updateStatusSelect.value,
        eventLog: DOM.eventLogSelect.value,
        criticalEvent: DOM.criticalEventSelect.value,
        cpuUsage: normalize(DOM.cpuUsageInput.value),
        monitoringStatus: DOM.monitoringStatusSelect.value
    };

    const checks = {
        firewallStatus: values.firewallStatus === CORRECT_SECURITY_CONFIG.firewallStatus,
        antivirusScan: values.antivirusScan === CORRECT_SECURITY_CONFIG.antivirusScan,
        threatStatus: values.threatStatus === CORRECT_SECURITY_CONFIG.threatStatus,
        updateStatus: values.updateStatus === CORRECT_SECURITY_CONFIG.updateStatus,
        eventLog: values.eventLog === CORRECT_SECURITY_CONFIG.eventLog,
        criticalEvent: values.criticalEvent === CORRECT_SECURITY_CONFIG.criticalEvent,
        cpuUsage: values.cpuUsage === CORRECT_SECURITY_CONFIG.cpuUsage,
        monitoringStatus: values.monitoringStatus === CORRECT_SECURITY_CONFIG.monitoringStatus
    };

    markField(DOM.firewallStatusSelect, checks.firewallStatus);
    markField(DOM.antivirusScanSelect, checks.antivirusScan);
    markField(DOM.threatStatusSelect, checks.threatStatus);
    markField(DOM.updateStatusSelect, checks.updateStatus);
    markField(DOM.eventLogSelect, checks.eventLog);
    markField(DOM.criticalEventSelect, checks.criticalEvent);
    markField(DOM.cpuUsageInput, checks.cpuUsage);
    markField(DOM.monitoringStatusSelect, checks.monitoringStatus);

    simulationCompleted =
        Object.values(checks).every(Boolean);

    if (simulationCompleted) {
        DOM.securityResult.textContent =
            "✅ Server selamat, dikemas kini dan prestasi berada pada tahap normal.";
        DOM.securityResult.className =
            "feedback-box correct";
        SERVER_HERO_UI.toast(
            "Konfigurasi keselamatan berjaya.",
            "success"
        );
    } else {
        DOM.securityResult.textContent =
            "❌ Konfigurasi belum tepat. Semak firewall, antivirus, update, log dan monitoring.";
        DOM.securityResult.className =
            "feedback-box wrong";
        SERVER_HERO_UI.toast(
            "Konfigurasi keselamatan belum betul.",
            "error"
        );
    }

    saveState();
    updateProgress();
    updateCompletionState();
}

function resetSecurityConfiguration() {
    if (SERVER_HERO_MISSION_ENGINE.isCompleted(LESSON_ID)) {
        SERVER_HERO_UI.toast(
            "Misi telah selesai. Simulasi dikunci.",
            "info"
        );
        return;
    }

    [
        DOM.firewallStatusSelect,
        DOM.antivirusScanSelect,
        DOM.threatStatusSelect,
        DOM.updateStatusSelect,
        DOM.eventLogSelect,
        DOM.criticalEventSelect,
        DOM.cpuUsageInput,
        DOM.monitoringStatusSelect
    ].forEach((element) => {
        element.value = "";
        element.classList.remove("valid", "invalid");
    });

    simulationCompleted = false;

    DOM.securityResult.textContent =
        "Lengkapkan semua tetapan keselamatan.";
    DOM.securityResult.className =
        "feedback-box";

    saveState();
    updateProgress();
    updateCompletionState();
}

function getMatchingSelects() {
    return Array.from(
        DOM.matchingActivity.querySelectorAll(
            "select[data-answer]"
        )
    );
}

function checkMatchingActivity() {
    const selects = getMatchingSelects();

    if (selects.some((select) => !select.value)) {
        SERVER_HERO_UI.toast(
            "Lengkapkan semua padanan dahulu.",
            "error"
        );
        return;
    }

    let correctCount = 0;

    selects.forEach((select) => {
        const correct =
            select.value === select.dataset.answer;

        const card = select.closest("article");

        card.classList.remove("correct", "wrong");
        card.classList.add(correct ? "correct" : "wrong");

        if (correct) correctCount++;
    });

    matchingCompleted =
        correctCount === selects.length;

    if (matchingCompleted) {
        DOM.matchingResult.textContent =
            "✅ Semua padanan keselamatan adalah betul.";
        DOM.matchingResult.className =
            "feedback-box correct";
    } else {
        DOM.matchingResult.textContent =
            `❌ ${correctCount} daripada ${selects.length} padanan betul.`;
        DOM.matchingResult.className =
            "feedback-box wrong";
    }

    saveState();
    updateProgress();
    updateCompletionState();
}

function renderQuestion() {
    const question =
        QUIZ_QUESTIONS[currentQuestionIndex];

    DOM.quizContainer.innerHTML = `
        <div class="quiz-question">
            <h3>${SERVER_HERO_UI.escapeHTML(question.question)}</h3>
        </div>

        <div class="answer-list">
            ${question.answers.map((answer, answerIndex) => `
                <button
                    type="button"
                    class="answer-option ${
                        selectedAnswers[currentQuestionIndex] === answerIndex
                            ? "selected"
                            : ""
                    }"
                    data-answer-index="${answerIndex}"
                >
                    ${SERVER_HERO_UI.escapeHTML(answer)}
                </button>
            `).join("")}
        </div>
    `;

    DOM.quizContainer
        .querySelectorAll(".answer-option")
        .forEach((button) => {
            button.addEventListener("click", () => {
                selectedAnswers[currentQuestionIndex] =
                    Number(button.dataset.answerIndex);

                renderQuestion();
            });
        });

    DOM.questionCounter.textContent =
        `${currentQuestionIndex + 1} / ${QUIZ_QUESTIONS.length}`;

    DOM.previousQuestionBtn.disabled =
        currentQuestionIndex === 0;

    DOM.nextQuestionBtn.textContent =
        currentQuestionIndex === QUIZ_QUESTIONS.length - 1
            ? "Hantar Kuiz"
            : "Seterusnya";

    DOM.quizFeedback.textContent =
        selectedAnswers[currentQuestionIndex] === null
            ? "Pilih satu jawapan."
            : "Jawapan telah dipilih.";

    DOM.quizFeedback.className =
        selectedAnswers[currentQuestionIndex] === null
            ? "feedback-box"
            : "feedback-box correct";

    saveState();
    updateProgress();
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
}

function nextQuestion() {
    if (selectedAnswers[currentQuestionIndex] === null) {
        SERVER_HERO_UI.toast(
            "Pilih satu jawapan dahulu.",
            "error"
        );
        return;
    }

    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
        return;
    }

    submitQuiz();
}

function submitQuiz() {
    if (selectedAnswers.some((answer) => answer === null)) {
        SERVER_HERO_UI.toast(
            "Jawab semua soalan dahulu.",
            "error"
        );
        return;
    }

    const correctAnswers =
        QUIZ_QUESTIONS.reduce(
            (total, question, index) =>
                total +
                (
                    selectedAnswers[index] === question.correctIndex
                        ? 1
                        : 0
                ),
            0
        );

    const percentage = Math.round(
        (correctAnswers / QUIZ_QUESTIONS.length) * 100
    );

    quizPassed =
        percentage >= PASSING_SCORE;

    SERVER_HERO_STORAGE.writeRaw(
        KEYS.quizScore,
        String(percentage)
    );

    SERVER_HERO_STORAGE.writeRaw(
        KEYS.quizPassed,
        quizPassed ? "true" : "false"
    );

    SERVER_HERO_STORAGE.setMissionQuizPassed(
        LESSON_ID,
        quizPassed
    );

    DOM.resultSection.classList.remove("hidden");
    DOM.finalScore.textContent = `${percentage}%`;

    if (quizPassed) {
        DOM.resultTitle.textContent =
            "Tahniah, Anda Lulus!";

        DOM.resultMessage.textContent =
            `Anda menjawab ${correctAnswers} daripada ${QUIZ_QUESTIONS.length} soalan dengan betul.`;
    } else {
        DOM.resultTitle.textContent =
            "Belum Mencapai Markah Lulus";

        DOM.resultMessage.textContent =
            `Markah anda ${percentage}%. Markah minimum ialah ${PASSING_SCORE}%.`;
    }

    saveState();
    updateProgress();
    updateCompletionState();
}

function retryQuiz() {
    selectedAnswers =
        new Array(QUIZ_QUESTIONS.length).fill(null);

    currentQuestionIndex = 0;
    quizPassed = false;

    SERVER_HERO_STORAGE.remove(KEYS.quizScore);
    SERVER_HERO_STORAGE.remove(KEYS.quizPassed);

    SERVER_HERO_STORAGE.setMissionQuizPassed(
        LESSON_ID,
        false
    );

    DOM.resultSection.classList.add("hidden");

    saveState();
    renderQuestion();
    updateProgress();
    updateCompletionState();
}

function updateCompletionState() {
    const canComplete =
        simulationCompleted &&
        matchingCompleted &&
        quizPassed;

    const alreadyCompleted =
        SERVER_HERO_MISSION_ENGINE.isCompleted(
            LESSON_ID
        );

    DOM.completeMissionBtn.disabled =
        !canComplete || alreadyCompleted;

    DOM.completeMissionBtn.classList.toggle(
        "ready",
        canComplete && !alreadyCompleted
    );

    if (alreadyCompleted) {
        DOM.completeMissionBtn.textContent =
            "✓ Misi Telah Selesai";
    } else if (canComplete) {
        DOM.completeMissionBtn.textContent =
            "Lengkapkan Misi 12";
    } else {
        DOM.completeMissionBtn.textContent =
            "🔒 Lengkapkan Misi 12";
    }

    DOM.nextMissionBtn.disabled =
        !alreadyCompleted;

    if (alreadyCompleted) {
        DOM.nextMissionBtn.onclick = () => {
            window.location.href = "lesson13.html";
        };
    }
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
        SERVER_HERO_MISSION_ENGINE.complete(
            LESSON_ID
        );

    if (result.success) {
        SERVER_HERO_ACHIEVEMENTS.check();
        updatePlayerDisplay();
        updateCompletionState();

        SERVER_HERO_UI.modal({
            title: "Misi 12 Selesai",
            message: "Tahniah! Mission 13 kini telah dibuka.",
            icon: "🛡️",
            confirmText: "Kembali ke Dashboard",
            onConfirm() {
                window.location.href = "index.html";
            }
        });
    }
}

function restoreCompletedState() {
    if (simulationCompleted) {
        DOM.firewallStatusSelect.value = "on";
        DOM.antivirusScanSelect.value = "full-scan";
        DOM.threatStatusSelect.value = "no-threat";
        DOM.updateStatusSelect.value = "up-to-date";
        DOM.eventLogSelect.value = "system-security";
        DOM.criticalEventSelect.value = "resolved";
        DOM.cpuUsageInput.value = "35%";
        DOM.monitoringStatusSelect.value = "normal";

        [
            DOM.firewallStatusSelect,
            DOM.antivirusScanSelect,
            DOM.threatStatusSelect,
            DOM.updateStatusSelect,
            DOM.eventLogSelect,
            DOM.criticalEventSelect,
            DOM.cpuUsageInput,
            DOM.monitoringStatusSelect
        ].forEach((element) => {
            element.classList.add("valid");
        });

        DOM.securityResult.textContent =
            "✅ Simulasi keselamatan telah diselesaikan.";
        DOM.securityResult.className =
            "feedback-box correct";
    }

    if (matchingCompleted) {
        getMatchingSelects().forEach((select) => {
            select.value =
                select.dataset.answer;
            select.closest("article")
                .classList.add("correct");
        });

        DOM.matchingResult.textContent =
            "✅ Aktiviti padanan telah diselesaikan.";
        DOM.matchingResult.className =
            "feedback-box correct";
    }
}

function bindEvents() {
    DOM.testSecurityBtn.addEventListener(
        "click",
        testSecurityConfiguration
    );

    DOM.resetSecurityBtn.addEventListener(
        "click",
        resetSecurityConfiguration
    );

    DOM.checkMatchingBtn.addEventListener(
        "click",
        checkMatchingActivity
    );

    DOM.previousQuestionBtn.addEventListener(
        "click",
        previousQuestion
    );

    DOM.nextQuestionBtn.addEventListener(
        "click",
        nextQuestion
    );

    DOM.retryQuizBtn.addEventListener(
        "click",
        retryQuiz
    );

    DOM.completeMissionBtn.addEventListener(
        "click",
        completeMission
    );
}

function initializeLesson12() {
    loadState();
    bindEvents();
    restoreCompletedState();
    renderQuestion();
    updatePlayerDisplay();
    updateProgress();
    updateCompletionState();

    console.log("LESSON 12 ENGINE READY");
}

initializeLesson12();

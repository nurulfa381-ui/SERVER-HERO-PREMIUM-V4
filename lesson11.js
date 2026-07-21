// SERVER HERO PREMIUM V4.0 - lesson11.js
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
        throw new Error(`${engineName} belum dimuatkan. Semak lesson11.html.`);
    }
});

const LESSON_ID = 11;
const PASSING_SCORE = 80;

const CORRECT_BACKUP_CONFIG = Object.freeze({
    backupType: "full-server",
    backupFrequency: "daily",
    backupTime: "22:00",
    backupDestination: "e:",
    restorePath: "d:\\it-share",
    backupStatus: "success",
    restoreStatus: "restored",
    verification: "verified"
});

const KEYS = Object.freeze({
    simulationCompleted: "lesson11SimulationCompletedV4",
    matchingCompleted: "lesson11MatchingCompletedV4",
    quizAnswers: "lesson11QuizAnswersV4",
    quizScore: "lesson11QuizScoreV4",
    quizPassed: "lesson11QuizPassedV4",
    currentQuestion: "lesson11CurrentQuestionV4"
});

const QUIZ_QUESTIONS = Object.freeze([
    {
        question: "Apakah tujuan utama backup server?",
        answers: [
            "Melindungi data daripada kehilangan",
            "Menambah RAM",
            "Mengubah alamat IP",
            "Mencipta DNS zone"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah maksud Full Server Backup?",
        answers: [
            "Backup keseluruhan server",
            "Backup satu fail sahaja",
            "Backup DNS sahaja",
            "Backup pengguna sahaja"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah fungsi Backup Schedule?",
        answers: [
            "Menjalankan backup secara automatik",
            "Memadam backup",
            "Menukar domain",
            "Mengurus DHCP"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah fungsi Restore?",
        answers: [
            "Memulihkan data daripada backup",
            "Memadam fail",
            "Menukar password",
            "Menambah printer"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah lokasi backup dalam misi ini?",
        answers: [
            "E:",
            "C:",
            "D:",
            "A:"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah masa backup dalam misi ini?",
        answers: [
            "22:00",
            "08:00",
            "12:00",
            "18:00"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah folder yang diuji untuk restore?",
        answers: [
            "D:\\IT-Share",
            "C:\\Windows",
            "E:\\Backup",
            "D:\\Temp"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah System State Backup?",
        answers: [
            "Backup komponen sistem kritikal",
            "Backup wallpaper",
            "Backup printer sahaja",
            "Backup DHCP sahaja"
        ],
        correctIndex: 0
    },
    {
        question: "Mengapa backup perlu diverifikasi?",
        answers: [
            "Memastikan backup boleh digunakan",
            "Memastikan server lebih laju",
            "Mengubah permission",
            "Menambah user"
        ],
        correctIndex: 0
    },
    {
        question: "Di manakah backup sebaiknya disimpan?",
        answers: [
            "Lokasi berasingan daripada data asal",
            "Dalam folder yang sama",
            "Dalam Recycle Bin",
            "Dalam Desktop sahaja"
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

    backupTypeSelect: document.getElementById("backupTypeSelect"),
    backupFrequencySelect: document.getElementById("backupFrequencySelect"),
    backupTimeInput: document.getElementById("backupTimeInput"),
    backupDestinationInput: document.getElementById("backupDestinationInput"),
    restorePathInput: document.getElementById("restorePathInput"),
    backupStatusSelect: document.getElementById("backupStatusSelect"),
    restoreStatusSelect: document.getElementById("restoreStatusSelect"),
    verificationSelect: document.getElementById("verificationSelect"),
    testBackupBtn: document.getElementById("testBackupBtn"),
    resetBackupBtn: document.getElementById("resetBackupBtn"),
    backupResult: document.getElementById("backupResult"),

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

function testBackupConfiguration() {
    const values = {
        backupType: DOM.backupTypeSelect.value,
        backupFrequency: DOM.backupFrequencySelect.value,
        backupTime: DOM.backupTimeInput.value.trim(),
        backupDestination: normalize(DOM.backupDestinationInput.value),
        restorePath: normalize(DOM.restorePathInput.value),
        backupStatus: DOM.backupStatusSelect.value,
        restoreStatus: DOM.restoreStatusSelect.value,
        verification: DOM.verificationSelect.value
    };

    const checks = {
        backupType: values.backupType === CORRECT_BACKUP_CONFIG.backupType,
        backupFrequency: values.backupFrequency === CORRECT_BACKUP_CONFIG.backupFrequency,
        backupTime: values.backupTime === CORRECT_BACKUP_CONFIG.backupTime,
        backupDestination: values.backupDestination === CORRECT_BACKUP_CONFIG.backupDestination,
        restorePath: values.restorePath === CORRECT_BACKUP_CONFIG.restorePath,
        backupStatus: values.backupStatus === CORRECT_BACKUP_CONFIG.backupStatus,
        restoreStatus: values.restoreStatus === CORRECT_BACKUP_CONFIG.restoreStatus,
        verification: values.verification === CORRECT_BACKUP_CONFIG.verification
    };

    markField(DOM.backupTypeSelect, checks.backupType);
    markField(DOM.backupFrequencySelect, checks.backupFrequency);
    markField(DOM.backupTimeInput, checks.backupTime);
    markField(DOM.backupDestinationInput, checks.backupDestination);
    markField(DOM.restorePathInput, checks.restorePath);
    markField(DOM.backupStatusSelect, checks.backupStatus);
    markField(DOM.restoreStatusSelect, checks.restoreStatus);
    markField(DOM.verificationSelect, checks.verification);

    simulationCompleted =
        Object.values(checks).every(Boolean);

    if (simulationCompleted) {
        DOM.backupResult.textContent =
            "✅ Backup harian dan proses restore berjaya dikonfigurasi.";
        DOM.backupResult.className =
            "feedback-box correct";
        SERVER_HERO_UI.toast(
            "Konfigurasi backup berjaya.",
            "success"
        );
    } else {
        DOM.backupResult.textContent =
            "❌ Konfigurasi belum tepat. Semak semua tetapan backup dan restore.";
        DOM.backupResult.className =
            "feedback-box wrong";
        SERVER_HERO_UI.toast(
            "Konfigurasi backup belum betul.",
            "error"
        );
    }

    saveState();
    updateProgress();
    updateCompletionState();
}

function resetBackupConfiguration() {
    if (SERVER_HERO_MISSION_ENGINE.isCompleted(LESSON_ID)) {
        SERVER_HERO_UI.toast(
            "Misi telah selesai. Simulasi dikunci.",
            "info"
        );
        return;
    }

    [
        DOM.backupTypeSelect,
        DOM.backupFrequencySelect,
        DOM.backupTimeInput,
        DOM.backupDestinationInput,
        DOM.restorePathInput,
        DOM.backupStatusSelect,
        DOM.restoreStatusSelect,
        DOM.verificationSelect
    ].forEach((element) => {
        element.value = "";
        element.classList.remove("valid", "invalid");
    });

    simulationCompleted = false;

    DOM.backupResult.textContent =
        "Lengkapkan semua tetapan backup.";
    DOM.backupResult.className =
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
            "✅ Semua padanan backup adalah betul.";
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
            "Lengkapkan Misi 11";
    } else {
        DOM.completeMissionBtn.textContent =
            "🔒 Lengkapkan Misi 11";
    }

    DOM.nextMissionBtn.disabled =
        !alreadyCompleted;

    if (alreadyCompleted) {
        DOM.nextMissionBtn.onclick = () => {
            window.location.href = "lesson12.html";
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
            title: "Misi 11 Selesai",
            message: "Tahniah! Mission 12 kini telah dibuka.",
            icon: "💾",
            confirmText: "Kembali ke Dashboard",
            onConfirm() {
                window.location.href = "index.html";
            }
        });
    }
}

function restoreCompletedState() {
    if (simulationCompleted) {
        DOM.backupTypeSelect.value = "full-server";
        DOM.backupFrequencySelect.value = "daily";
        DOM.backupTimeInput.value = "22:00";
        DOM.backupDestinationInput.value = "E:";
        DOM.restorePathInput.value = "D:\\IT-Share";
        DOM.backupStatusSelect.value = "success";
        DOM.restoreStatusSelect.value = "restored";
        DOM.verificationSelect.value = "verified";

        [
            DOM.backupTypeSelect,
            DOM.backupFrequencySelect,
            DOM.backupTimeInput,
            DOM.backupDestinationInput,
            DOM.restorePathInput,
            DOM.backupStatusSelect,
            DOM.restoreStatusSelect,
            DOM.verificationSelect
        ].forEach((element) => {
            element.classList.add("valid");
        });

        DOM.backupResult.textContent =
            "✅ Simulasi backup telah diselesaikan.";
        DOM.backupResult.className =
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
    DOM.testBackupBtn.addEventListener(
        "click",
        testBackupConfiguration
    );

    DOM.resetBackupBtn.addEventListener(
        "click",
        resetBackupConfiguration
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

function initializeLesson11() {
    loadState();
    bindEvents();
    restoreCompletedState();
    renderQuestion();
    updatePlayerDisplay();
    updateProgress();
    updateCompletionState();

    console.log("LESSON 11 ENGINE READY");
}

initializeLesson11();

// ======================================================
// SERVER HERO PREMIUM V4.0
// lesson5.js
// MISI 05 - ORGANIZATIONAL UNIT DAN AKAUN PENGGUNA
// FULL STABLE VERSION
// ======================================================

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
        throw new Error(
            `${engineName} belum dimuatkan. Semak susunan script dalam lesson5.html.`
        );
    }
});

const LESSON_ID = 5;
const PASSING_SCORE = 80;

const CORRECT_USER_CONFIG = Object.freeze({
    ouName: "it department",
    fullName: "ali",
    username: "ali",
    password: "P@ssw0rd123",
    changePassword: true,
    accountStatus: "enabled"
});

const LESSON_STORAGE_KEYS = Object.freeze({
    simulationCompleted: "lesson5SimulationCompletedV4",
    matchingCompleted: "lesson5MatchingCompletedV4",
    quizAnswers: "lesson5QuizAnswersV4",
    quizScore: "lesson5QuizScoreV4",
    quizPassed: "lesson5QuizPassedV4",
    currentQuestion: "lesson5CurrentQuestionV4"
});

const QUIZ_QUESTIONS = Object.freeze([
    {
        question: "Apakah fungsi utama Organizational Unit (OU)?",
        answers: [
            "Menyusun objek Active Directory secara logik",
            "Memasang sistem operasi",
            "Mengawal suhu server",
            "Menyimpan fail ISO"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah konsol yang digunakan untuk mencipta OU dan pengguna?",
        answers: [
            "Active Directory Users and Computers",
            "Task Manager",
            "Disk Management",
            "Paint"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah nama OU yang digunakan dalam misi ini?",
        answers: [
            "IT Department",
            "Finance",
            "Marketing",
            "Guest"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah username yang digunakan untuk pengguna Ali?",
        answers: [
            "ali",
            "administrator",
            "user01",
            "student"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah contoh kata laluan kukuh dalam misi ini?",
        answers: [
            "P@ssw0rd123",
            "1234",
            "ali",
            "password"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah fungsi pilihan User must change password at next logon?",
        answers: [
            "Memaksa pengguna menukar kata laluan ketika log masuk pertama",
            "Memadam akaun pengguna",
            "Mengunci domain",
            "Menukar nama komputer"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah objek yang mewakili komputer dalam domain?",
        answers: [
            "Computer Object",
            "User Object",
            "Printer Object",
            "File Object"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah fungsi Group Object?",
        answers: [
            "Mengurus kebenaran beberapa pengguna",
            "Menyimpan fail sementara",
            "Menukar alamat IP",
            "Memasang DNS"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah status akaun yang membolehkan pengguna log masuk?",
        answers: [
            "Enabled",
            "Disabled",
            "Deleted",
            "Expired sahaja"
        ],
        correctIndex: 0
    },
    {
        question: "Mengapa OU penting untuk Group Policy?",
        answers: [
            "Memudahkan polisi digunakan kepada kumpulan objek tertentu",
            "Membesarkan kapasiti RAM",
            "Menggantikan DNS",
            "Memformat cakera keras"
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

    ouNameInput: document.getElementById("ouNameInput"),
    fullNameInput: document.getElementById("fullNameInput"),
    usernameInput: document.getElementById("usernameInput"),
    passwordInput: document.getElementById("passwordInput"),
    changePasswordCheckbox: document.getElementById("changePasswordCheckbox"),
    accountStatusSelect: document.getElementById("accountStatusSelect"),
    testUserBtn: document.getElementById("testUserBtn"),
    resetUserBtn: document.getElementById("resetUserBtn"),
    userResult: document.getElementById("userResult"),

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

    const savedAnswers = SERVER_HERO_STORAGE.readArray(
        LESSON_STORAGE_KEYS.quizAnswers,
        []
    );

    if (savedAnswers.length === QUIZ_QUESTIONS.length) {
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
        Math.min(QUIZ_QUESTIONS.length - 1, currentQuestionIndex)
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

function updatePlayerDisplay() {
    const player = SERVER_HERO_PLAYER.get();

    if (DOM.playerXP) {
        DOM.playerXP.textContent = player.xp;
    }

    if (DOM.playerRank) {
        DOM.playerRank.textContent = player.rank;
    }
}

function calculateLessonProgress() {
    let progress = 10;

    if (simulationCompleted) {
        progress += 35;
    }

    if (matchingCompleted) {
        progress += 25;
    }

    const answeredCount = selectedAnswers.filter(
        (answer) => answer !== null
    ).length;

    progress += Math.round(
        (answeredCount / QUIZ_QUESTIONS.length) * 15
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
        DOM.lessonProgressText.textContent = `${value}%`;
    }
}

function normalizeText(value) {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

function markField(element, valid) {
    if (!element) {
        return;
    }

    element.classList.remove("valid", "invalid");
    element.classList.add(valid ? "valid" : "invalid");
}

function testUserConfiguration() {
    const values = {
        ouName: normalizeText(DOM.ouNameInput?.value),
        fullName: normalizeText(DOM.fullNameInput?.value),
        username: normalizeText(DOM.usernameInput?.value),
        password: String(DOM.passwordInput?.value || ""),
        changePassword: Boolean(DOM.changePasswordCheckbox?.checked),
        accountStatus: DOM.accountStatusSelect?.value || ""
    };

    const exactMatch =
        values.ouName === CORRECT_USER_CONFIG.ouName &&
        values.fullName === CORRECT_USER_CONFIG.fullName &&
        values.username === CORRECT_USER_CONFIG.username &&
        values.password === CORRECT_USER_CONFIG.password &&
        values.changePassword === CORRECT_USER_CONFIG.changePassword &&
        values.accountStatus === CORRECT_USER_CONFIG.accountStatus;

    markField(
        DOM.ouNameInput,
        values.ouName === CORRECT_USER_CONFIG.ouName
    );

    markField(
        DOM.fullNameInput,
        values.fullName === CORRECT_USER_CONFIG.fullName
    );

    markField(
        DOM.usernameInput,
        values.username === CORRECT_USER_CONFIG.username
    );

    markField(
        DOM.passwordInput,
        values.password === CORRECT_USER_CONFIG.password
    );

    markField(
        DOM.accountStatusSelect,
        values.accountStatus === CORRECT_USER_CONFIG.accountStatus
    );

    if (DOM.changePasswordCheckbox) {
        DOM.changePasswordCheckbox.closest(".checkbox-label")
            ?.classList.remove("valid", "invalid");

        DOM.changePasswordCheckbox.closest(".checkbox-label")
            ?.classList.add(
                values.changePassword ? "valid" : "invalid"
            );
    }

    if (exactMatch) {
        simulationCompleted = true;

        DOM.userResult.textContent =
            "✅ OU IT Department dan pengguna Ali berjaya dicipta.";

        DOM.userResult.className =
            "feedback-box correct";

        SERVER_HERO_UI.toast(
            "Konfigurasi pengguna berjaya.",
            "success"
        );
    } else {
        simulationCompleted = false;

        DOM.userResult.textContent =
            "❌ Konfigurasi belum tepat. Semak OU, nama, username, kata laluan, pilihan tukar kata laluan dan status akaun.";

        DOM.userResult.className =
            "feedback-box wrong";

        SERVER_HERO_UI.toast(
            "Konfigurasi pengguna belum betul.",
            "error"
        );
    }

    saveLessonState();
    updateLessonProgress();
    updateCompletionState();
}

function resetUserSimulation() {
    if (SERVER_HERO_MISSION_ENGINE.isCompleted(LESSON_ID)) {
        SERVER_HERO_UI.toast(
            "Misi telah selesai. Simulasi dikunci.",
            "info"
        );
        return;
    }

    [
        DOM.ouNameInput,
        DOM.fullNameInput,
        DOM.usernameInput,
        DOM.passwordInput,
        DOM.accountStatusSelect
    ].forEach((element) => {
        if (element) {
            element.value = "";
            element.classList.remove("valid", "invalid");
        }
    });

    if (DOM.changePasswordCheckbox) {
        DOM.changePasswordCheckbox.checked = false;
        DOM.changePasswordCheckbox.closest(".checkbox-label")
            ?.classList.remove("valid", "invalid");
    }

    simulationCompleted = false;

    DOM.userResult.textContent =
        "Lengkapkan semua maklumat pengguna.";

    DOM.userResult.className =
        "feedback-box";

    saveLessonState();
    updateLessonProgress();
    updateCompletionState();
}

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

    if (selects.some((select) => !select.value)) {
        SERVER_HERO_UI.toast(
            "Lengkapkan semua padanan dahulu.",
            "error"
        );
        return;
    }

    let correctCount = 0;

    selects.forEach((select) => {
        const article = select.closest("article");
        const correct =
            select.value === select.dataset.answer;

        article?.classList.remove("correct", "wrong");
        article?.classList.add(
            correct ? "correct" : "wrong"
        );

        if (correct) {
            correctCount++;
        }
    });

    matchingCompleted =
        correctCount === selects.length;

    if (matchingCompleted) {
        DOM.matchingResult.textContent =
            "✅ Semua padanan objek Active Directory adalah betul.";

        DOM.matchingResult.className =
            "feedback-box correct";

        SERVER_HERO_UI.toast(
            "Aktiviti padanan berjaya.",
            "success"
        );
    } else {
        DOM.matchingResult.textContent =
            `❌ ${correctCount} daripada ${selects.length} padanan betul. Cuba semula.`;

        DOM.matchingResult.className =
            "feedback-box wrong";

        SERVER_HERO_UI.toast(
            "Masih ada padanan yang salah.",
            "error"
        );
    }

    saveLessonState();
    updateLessonProgress();
    updateCompletionState();
}

function renderQuestion() {
    if (!DOM.quizContainer) {
        return;
    }

    const question =
        QUIZ_QUESTIONS[currentQuestionIndex];

    DOM.quizContainer.innerHTML = `
        <div class="quiz-question">
            <h3>
                ${SERVER_HERO_UI.escapeHTML(question.question)}
            </h3>
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

    DOM.nextQuestionBtn.innerHTML =
        currentQuestionIndex === QUIZ_QUESTIONS.length - 1
            ? `Hantar Kuiz <i class="fa-solid fa-check"></i>`
            : `Seterusnya <i class="fa-solid fa-arrow-right"></i>`;

    DOM.quizFeedback.textContent =
        selectedAnswers[currentQuestionIndex] === null
            ? "Pilih satu jawapan."
            : "Jawapan telah dipilih.";

    DOM.quizFeedback.className =
        selectedAnswers[currentQuestionIndex] === null
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

function calculateQuizScore() {
    const correctAnswers = QUIZ_QUESTIONS.reduce(
        (total, question, index) =>
            total +
            (
                selectedAnswers[index] === question.correctIndex
                    ? 1
                    : 0
            ),
        0
    );

    return {
        correctAnswers,
        total: QUIZ_QUESTIONS.length,
        percentage: Math.round(
            (correctAnswers / QUIZ_QUESTIONS.length) * 100
        )
    };
}

function submitQuiz() {
    if (selectedAnswers.some((answer) => answer === null)) {
        SERVER_HERO_UI.toast(
            "Jawab semua soalan dahulu.",
            "error"
        );
        return;
    }

    const result = calculateQuizScore();

    quizPassed =
        result.percentage >= PASSING_SCORE;

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
    DOM.resultSection.classList.remove("hidden");
    DOM.finalScore.textContent = `${result.percentage}%`;

    if (quizPassed) {
        DOM.resultTitle.textContent =
            "Tahniah, Anda Lulus!";

        DOM.resultMessage.textContent =
            `Anda menjawab ${result.correctAnswers} daripada ${result.total} soalan dengan betul.`;

        SERVER_HERO_UI.toast(
            "Kuiz Misi 05 berjaya diluluskan.",
            "success"
        );
    } else {
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
        behavior: "smooth",
        block: "center"
    });
}

function retryQuiz() {
    selectedAnswers =
        new Array(QUIZ_QUESTIONS.length).fill(null);

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

    DOM.resultSection.classList.add("hidden");

    saveLessonState();
    renderQuestion();
    updateLessonProgress();
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
        DOM.completeMissionBtn.innerHTML =
            `<i class="fa-solid fa-circle-check"></i> Misi Telah Selesai`;
    } else if (canComplete) {
        DOM.completeMissionBtn.innerHTML =
            `<i class="fa-solid fa-award"></i> Lengkapkan Misi 05`;
    } else {
        DOM.completeMissionBtn.innerHTML =
            `<i class="fa-solid fa-lock"></i> Lengkapkan Misi 05`;
    }

    DOM.nextMissionBtn.disabled = !alreadyCompleted;

    if (alreadyCompleted) {
        DOM.nextMissionBtn.onclick = () => {
            window.location.href = "lesson6.html";
        };

        lockCompletedActivities();
    }
}

function lockCompletedActivities() {
    [
        DOM.ouNameInput,
        DOM.fullNameInput,
        DOM.usernameInput,
        DOM.passwordInput,
        DOM.changePasswordCheckbox,
        DOM.accountStatusSelect,
        DOM.testUserBtn,
        DOM.resetUserBtn,
        DOM.checkMatchingBtn
    ].forEach((element) => {
        if (element) {
            element.disabled = true;
        }
    });

    getMatchingSelects().forEach((select) => {
        select.disabled = true;
    });
}

function completeMission() {
    if (
        !simulationCompleted ||
        !matchingCompleted ||
        !quizPassed
    ) {
        SERVER_HERO_UI.toast(
            "Lengkapkan simulasi, aktiviti padanan dan kuiz dahulu.",
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
            title: "Misi 05 Selesai",
            message:
                "Tahniah! Mission 06 kini telah dibuka.",
            icon: "👥",
            confirmText: "Kembali ke Dashboard",
            onConfirm() {
                window.location.href = "index.html";
            }
        });

        return;
    }

    if (result.reason === "already-completed") {
        SERVER_HERO_UI.toast(
            "Misi ini telah pun diselesaikan.",
            "info"
        );

        updateCompletionState();
    }
}

function restoreCompletedState() {
    if (simulationCompleted) {
        DOM.ouNameInput.value = "IT Department";
        DOM.fullNameInput.value = "Ali";
        DOM.usernameInput.value = "ali";
        DOM.passwordInput.value = "P@ssw0rd123";
        DOM.changePasswordCheckbox.checked = true;
        DOM.accountStatusSelect.value = "enabled";

        [
            DOM.ouNameInput,
            DOM.fullNameInput,
            DOM.usernameInput,
            DOM.passwordInput,
            DOM.accountStatusSelect
        ].forEach((element) => {
            element.classList.add("valid");
        });

        DOM.changePasswordCheckbox.closest(".checkbox-label")
            ?.classList.add("valid");

        DOM.userResult.textContent =
            "✅ Simulasi OU dan pengguna telah diselesaikan.";

        DOM.userResult.className =
            "feedback-box correct";
    }

    if (matchingCompleted) {
        getMatchingSelects().forEach((select) => {
            select.value = select.dataset.answer;

            select.closest("article")
                ?.classList.add("correct");
        });

        DOM.matchingResult.textContent =
            "✅ Aktiviti padanan telah diselesaikan.";

        DOM.matchingResult.className =
            "feedback-box correct";
    }
}

function bindEvents() {
    DOM.testUserBtn?.addEventListener(
        "click",
        testUserConfiguration
    );

    DOM.resetUserBtn?.addEventListener(
        "click",
        resetUserSimulation
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

function initializeLesson5() {
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
            correctAnswers: Math.round(
                (savedScore / 100) * QUIZ_QUESTIONS.length
            ),
            total: QUIZ_QUESTIONS.length,
            percentage: savedScore
        });
    }

    console.log("LESSON 5 ENGINE READY");
}

initializeLesson5();

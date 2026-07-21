// SERVER HERO PREMIUM V4.0 - lesson9.js
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
        throw new Error(`${engineName} belum dimuatkan. Semak lesson9.html.`);
    }
});

const LESSON_ID = 9;
const PASSING_SCORE = 80;

const CORRECT_FILE_SERVER = Object.freeze({
    folderPath: "d:\\it-share",
    shareName: "it-share",
    groupName: "it users",
    sharePermission: "change-read",
    ntfsPermission: "modify",
    uncPath: "\\\\server\\it-share"
});

const KEYS = Object.freeze({
    simulationCompleted: "lesson9SimulationCompletedV4",
    matchingCompleted: "lesson9MatchingCompletedV4",
    quizAnswers: "lesson9QuizAnswersV4",
    quizScore: "lesson9QuizScoreV4",
    quizPassed: "lesson9QuizPassedV4",
    currentQuestion: "lesson9CurrentQuestionV4"
});

const QUIZ_QUESTIONS = Object.freeze([
    {
        question: "Apakah fungsi utama File Server?",
        answers: [
            "Menyimpan dan berkongsi fail dalam rangkaian",
            "Memberikan alamat IP",
            "Mengurus DNS",
            "Memasang Windows"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah maksud Shared Folder?",
        answers: [
            "Folder yang boleh diakses melalui rangkaian",
            "Folder sementara",
            "Folder sistem sahaja",
            "Folder yang dipadam"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah fungsi NTFS Permission?",
        answers: [
            "Mengawal akses fail dan folder",
            "Menukar alamat IP",
            "Mengurus DNS",
            "Mencipta domain"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah fungsi Share Permission?",
        answers: [
            "Mengawal akses melalui rangkaian",
            "Mengawal BIOS",
            "Mengawal paparan monitor",
            "Mengawal DHCP"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah kebenaran Modify membenarkan pengguna lakukan?",
        answers: [
            "Membaca, mengubah dan memadam fail",
            "Melihat fail sahaja",
            "Tiada akses",
            "Mengubah permission sahaja"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah laluan UNC dalam misi ini?",
        answers: [
            "\\\\SERVER\\IT-Share",
            "C:\\IT-Share",
            "D:\\SERVER",
            "http://server"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah nama folder perkongsian dalam misi ini?",
        answers: [
            "IT-Share",
            "Public",
            "Users",
            "Data"
        ],
        correctIndex: 0
    },
    {
        question: "Permission manakah paling tinggi?",
        answers: [
            "Full Control",
            "Read",
            "List Folder",
            "Read & Execute"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah prinsip gabungan Share dan NTFS Permission?",
        answers: [
            "Permission paling ketat akan digunakan",
            "Permission paling longgar digunakan",
            "NTFS sentiasa diabaikan",
            "Share sentiasa diabaikan"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah ujian yang sesuai selepas konfigurasi?",
        answers: [
            "Akses folder dari client dan cipta fail",
            "Format server",
            "Padam domain",
            "Tutup network adapter"
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

    folderPathInput: document.getElementById("folderPathInput"),
    shareNameInput: document.getElementById("shareNameInput"),
    groupNameInput: document.getElementById("groupNameInput"),
    sharePermissionSelect: document.getElementById("sharePermissionSelect"),
    ntfsPermissionSelect: document.getElementById("ntfsPermissionSelect"),
    uncPathInput: document.getElementById("uncPathInput"),
    testFileServerBtn: document.getElementById("testFileServerBtn"),
    resetFileServerBtn: document.getElementById("resetFileServerBtn"),
    fileServerResult: document.getElementById("fileServerResult"),

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
        .replace(/\s+/g, " ");
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

function testFileServerConfiguration() {
    const values = {
        folderPath: normalize(DOM.folderPathInput.value),
        shareName: normalize(DOM.shareNameInput.value),
        groupName: normalize(DOM.groupNameInput.value),
        sharePermission: DOM.sharePermissionSelect.value,
        ntfsPermission: DOM.ntfsPermissionSelect.value,
        uncPath: normalize(DOM.uncPathInput.value)
    };

    const checks = {
        folderPath: values.folderPath === CORRECT_FILE_SERVER.folderPath,
        shareName: values.shareName === CORRECT_FILE_SERVER.shareName,
        groupName: values.groupName === CORRECT_FILE_SERVER.groupName,
        sharePermission: values.sharePermission === CORRECT_FILE_SERVER.sharePermission,
        ntfsPermission: values.ntfsPermission === CORRECT_FILE_SERVER.ntfsPermission,
        uncPath: values.uncPath === CORRECT_FILE_SERVER.uncPath
    };

    markField(DOM.folderPathInput, checks.folderPath);
    markField(DOM.shareNameInput, checks.shareName);
    markField(DOM.groupNameInput, checks.groupName);
    markField(DOM.sharePermissionSelect, checks.sharePermission);
    markField(DOM.ntfsPermissionSelect, checks.ntfsPermission);
    markField(DOM.uncPathInput, checks.uncPath);

    simulationCompleted =
        Object.values(checks).every(Boolean);

    if (simulationCompleted) {
        DOM.fileServerResult.textContent =
            "✅ Shared Folder IT-Share berjaya dikonfigurasi dan boleh diakses.";
        DOM.fileServerResult.className =
            "feedback-box correct";
        SERVER_HERO_UI.toast(
            "Konfigurasi File Server berjaya.",
            "success"
        );
    } else {
        DOM.fileServerResult.textContent =
            "❌ Konfigurasi belum tepat. Semak semua tetapan File Server.";
        DOM.fileServerResult.className =
            "feedback-box wrong";
        SERVER_HERO_UI.toast(
            "Konfigurasi File Server belum betul.",
            "error"
        );
    }

    saveState();
    updateProgress();
    updateCompletionState();
}

function resetFileServerConfiguration() {
    if (SERVER_HERO_MISSION_ENGINE.isCompleted(LESSON_ID)) {
        SERVER_HERO_UI.toast(
            "Misi telah selesai. Simulasi dikunci.",
            "info"
        );
        return;
    }

    [
        DOM.folderPathInput,
        DOM.shareNameInput,
        DOM.groupNameInput,
        DOM.sharePermissionSelect,
        DOM.ntfsPermissionSelect,
        DOM.uncPathInput
    ].forEach((element) => {
        element.value = "";
        element.classList.remove("valid", "invalid");
    });

    simulationCompleted = false;

    DOM.fileServerResult.textContent =
        "Lengkapkan semua tetapan File Server.";
    DOM.fileServerResult.className =
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
            "✅ Semua padanan permission adalah betul.";
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
            "Lengkapkan Misi 09";
    } else {
        DOM.completeMissionBtn.textContent =
            "🔒 Lengkapkan Misi 09";
    }

    DOM.nextMissionBtn.disabled =
        !alreadyCompleted;

    if (alreadyCompleted) {
        DOM.nextMissionBtn.onclick = () => {
            window.location.href = "lesson10.html";
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
            title: "Misi 09 Selesai",
            message: "Tahniah! Mission 10 kini telah dibuka.",
            icon: "📁",
            confirmText: "Kembali ke Dashboard",
            onConfirm() {
                window.location.href = "index.html";
            }
        });
    }
}

function restoreCompletedState() {
    if (simulationCompleted) {
        DOM.folderPathInput.value =
            "D:\\IT-Share";
        DOM.shareNameInput.value =
            "IT-Share";
        DOM.groupNameInput.value =
            "IT Users";
        DOM.sharePermissionSelect.value =
            "change-read";
        DOM.ntfsPermissionSelect.value =
            "modify";
        DOM.uncPathInput.value =
            "\\\\SERVER\\IT-Share";

        [
            DOM.folderPathInput,
            DOM.shareNameInput,
            DOM.groupNameInput,
            DOM.sharePermissionSelect,
            DOM.ntfsPermissionSelect,
            DOM.uncPathInput
        ].forEach((element) => {
            element.classList.add("valid");
        });

        DOM.fileServerResult.textContent =
            "✅ Simulasi File Server telah diselesaikan.";
        DOM.fileServerResult.className =
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
    DOM.testFileServerBtn.addEventListener(
        "click",
        testFileServerConfiguration
    );

    DOM.resetFileServerBtn.addEventListener(
        "click",
        resetFileServerConfiguration
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

function initializeLesson9() {
    loadState();
    bindEvents();
    restoreCompletedState();
    renderQuestion();
    updatePlayerDisplay();
    updateProgress();
    updateCompletionState();

    console.log("LESSON 9 ENGINE READY");
}

initializeLesson9();

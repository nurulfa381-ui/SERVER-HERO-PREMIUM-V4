// SERVER HERO PREMIUM V4.0 - lesson7.js
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
        throw new Error(`${engineName} belum dimuatkan. Semak lesson7.html.`);
    }
});

const LESSON_ID = 7;
const PASSING_SCORE = 80;

const CORRECT_GPO_CONFIG = Object.freeze({
    gpoName: "itsecuritypolicy",
    targetOU: "itdepartment",
    controlPanel: "enabled",
    wallpaper: "c:\\wallpapers\\serverhero.jpg",
    gpupdate: "gpupdate/force",
    gpoLink: "linked"
});

const KEYS = Object.freeze({
    simulationCompleted: "lesson7SimulationCompletedV4",
    matchingCompleted: "lesson7MatchingCompletedV4",
    quizAnswers: "lesson7QuizAnswersV4",
    quizScore: "lesson7QuizScoreV4",
    quizPassed: "lesson7QuizPassedV4",
    currentQuestion: "lesson7CurrentQuestionV4"
});

const QUIZ_QUESTIONS = Object.freeze([
    {
        question: "Apakah fungsi utama Group Policy?",
        answers: [
            "Mengurus konfigurasi pengguna dan komputer secara berpusat",
            "Mengedit video",
            "Menambah RAM",
            "Memformat cakera keras"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah nama GPO dalam misi ini?",
        answers: [
            "IT Security Policy",
            "Default Printer",
            "DNS Policy",
            "Backup Policy"
        ],
        correctIndex: 0
    },
    {
        question: "GPO perlu dilink kepada lokasi mana?",
        answers: [
            "OU IT Department",
            "Recycle Bin",
            "Desktop",
            "Local Users"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah fungsi gpupdate /force?",
        answers: [
            "Memaksa kemas kini polisi",
            "Memadam pengguna",
            "Mengubah alamat IP",
            "Membuka Control Panel"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah fungsi gpresult?",
        answers: [
            "Memaparkan hasil polisi yang digunakan",
            "Mencipta pengguna",
            "Menambah DNS record",
            "Menguji cakera keras"
        ],
        correctIndex: 0
    },
    {
        question: "Di manakah polisi pengguna dikonfigurasi?",
        answers: [
            "User Configuration",
            "Disk Management",
            "Device Manager",
            "Task Scheduler"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah kesan polisi Prohibit access to Control Panel?",
        answers: [
            "Pengguna tidak boleh membuka Control Panel",
            "Pengguna tidak boleh log masuk",
            "Komputer tidak boleh restart",
            "DNS akan dipadam"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah fungsi GPO Link?",
        answers: [
            "Menghubungkan GPO kepada Site, Domain atau OU",
            "Memadam GPO",
            "Membina DHCP scope",
            "Menukar domain"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah dua bahagian utama dalam GPO?",
        answers: [
            "Computer Configuration dan User Configuration",
            "DNS dan DHCP",
            "Disk dan Volume",
            "Server dan Client"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah punca biasa GPO tidak digunakan?",
        answers: [
            "GPO tidak dilink kepada OU sasaran",
            "Monitor terlalu gelap",
            "Papan kekunci rosak",
            "Ikon desktop hilang"
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
    gpoNameInput: document.getElementById("gpoNameInput"),
    targetOUInput: document.getElementById("targetOUInput"),
    controlPanelSelect: document.getElementById("controlPanelSelect"),
    wallpaperInput: document.getElementById("wallpaperInput"),
    gpupdateInput: document.getElementById("gpupdateInput"),
    gpoLinkSelect: document.getElementById("gpoLinkSelect"),
    testGPOBtn: document.getElementById("testGPOBtn"),
    resetGPOBtn: document.getElementById("resetGPOBtn"),
    gpoResult: document.getElementById("gpoResult"),
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

function testGPOConfiguration() {
    const values = {
        gpoName: normalize(DOM.gpoNameInput.value),
        targetOU: normalize(DOM.targetOUInput.value),
        controlPanel: DOM.controlPanelSelect.value,
        wallpaper: normalize(DOM.wallpaperInput.value),
        gpupdate: normalize(DOM.gpupdateInput.value),
        gpoLink: DOM.gpoLinkSelect.value
    };

    const validGPOName = values.gpoName === CORRECT_GPO_CONFIG.gpoName;
    const validOU = values.targetOU === CORRECT_GPO_CONFIG.targetOU;
    const validControl = values.controlPanel === CORRECT_GPO_CONFIG.controlPanel;
    const validWallpaper = values.wallpaper === normalize(CORRECT_GPO_CONFIG.wallpaper);
    const validGpupdate = values.gpupdate === CORRECT_GPO_CONFIG.gpupdate;
    const validLink = values.gpoLink === CORRECT_GPO_CONFIG.gpoLink;

    markField(DOM.gpoNameInput, validGPOName);
    markField(DOM.targetOUInput, validOU);
    markField(DOM.controlPanelSelect, validControl);
    markField(DOM.wallpaperInput, validWallpaper);
    markField(DOM.gpupdateInput, validGpupdate);
    markField(DOM.gpoLinkSelect, validLink);

    simulationCompleted =
        validGPOName &&
        validOU &&
        validControl &&
        validWallpaper &&
        validGpupdate &&
        validLink;

    if (simulationCompleted) {
        DOM.gpoResult.textContent =
            "✅ GPO IT Security Policy berjaya dilink kepada OU IT Department.";
        DOM.gpoResult.className = "feedback-box correct";
        SERVER_HERO_UI.toast("Konfigurasi GPO berjaya.", "success");
    } else {
        DOM.gpoResult.textContent =
            "❌ Konfigurasi belum tepat. Semak semua tetapan GPO.";
        DOM.gpoResult.className = "feedback-box wrong";
        SERVER_HERO_UI.toast("Konfigurasi GPO belum betul.", "error");
    }

    saveState();
    updateProgress();
    updateCompletionState();
}

function resetGPOConfiguration() {
    if (SERVER_HERO_MISSION_ENGINE.isCompleted(LESSON_ID)) {
        SERVER_HERO_UI.toast("Misi telah selesai. Simulasi dikunci.", "info");
        return;
    }

    [
        DOM.gpoNameInput,
        DOM.targetOUInput,
        DOM.controlPanelSelect,
        DOM.wallpaperInput,
        DOM.gpupdateInput,
        DOM.gpoLinkSelect
    ].forEach((element) => {
        element.value = "";
        element.classList.remove("valid", "invalid");
    });

    simulationCompleted = false;
    DOM.gpoResult.textContent = "Lengkapkan semua tetapan GPO.";
    DOM.gpoResult.className = "feedback-box";

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
        SERVER_HERO_UI.toast("Lengkapkan semua padanan dahulu.", "error");
        return;
    }

    let correctCount = 0;

    selects.forEach((select) => {
        const correct = select.value === select.dataset.answer;
        const card = select.closest("article");

        card.classList.remove("correct", "wrong");
        card.classList.add(correct ? "correct" : "wrong");

        if (correct) correctCount++;
    });

    matchingCompleted = correctCount === selects.length;

    if (matchingCompleted) {
        DOM.matchingResult.textContent =
            "✅ Semua padanan GPO adalah betul.";
        DOM.matchingResult.className = "feedback-box correct";
    } else {
        DOM.matchingResult.textContent =
            `❌ ${correctCount} daripada ${selects.length} padanan betul.`;
        DOM.matchingResult.className = "feedback-box wrong";
    }

    saveState();
    updateProgress();
    updateCompletionState();
}

function renderQuestion() {
    const question = QUIZ_QUESTIONS[currentQuestionIndex];

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

    DOM.nextQuestionBtn.innerHTML =
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
        SERVER_HERO_UI.toast("Pilih satu jawapan dahulu.", "error");
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
        SERVER_HERO_UI.toast("Jawab semua soalan dahulu.", "error");
        return;
    }

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

    const percentage = Math.round(
        (correctAnswers / QUIZ_QUESTIONS.length) * 100
    );

    quizPassed = percentage >= PASSING_SCORE;

    SERVER_HERO_STORAGE.writeRaw(KEYS.quizScore, String(percentage));
    SERVER_HERO_STORAGE.writeRaw(KEYS.quizPassed, quizPassed ? "true" : "false");
    SERVER_HERO_STORAGE.setMissionQuizPassed(LESSON_ID, quizPassed);

    DOM.resultSection.classList.remove("hidden");
    DOM.finalScore.textContent = `${percentage}%`;

    if (quizPassed) {
        DOM.resultTitle.textContent = "Tahniah, Anda Lulus!";
        DOM.resultMessage.textContent =
            `Anda menjawab ${correctAnswers} daripada ${QUIZ_QUESTIONS.length} soalan dengan betul.`;
    } else {
        DOM.resultTitle.textContent = "Belum Mencapai Markah Lulus";
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
    SERVER_HERO_STORAGE.setMissionQuizPassed(LESSON_ID, false);

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
        SERVER_HERO_MISSION_ENGINE.isCompleted(LESSON_ID);

    DOM.completeMissionBtn.disabled =
        !canComplete || alreadyCompleted;

    DOM.completeMissionBtn.classList.toggle(
        "ready",
        canComplete && !alreadyCompleted
    );

    if (alreadyCompleted) {
        DOM.completeMissionBtn.textContent = "✓ Misi Telah Selesai";
    } else if (canComplete) {
        DOM.completeMissionBtn.textContent = "Lengkapkan Misi 07";
    } else {
        DOM.completeMissionBtn.textContent = "🔒 Lengkapkan Misi 07";
    }

    DOM.nextMissionBtn.disabled = !alreadyCompleted;

    if (alreadyCompleted) {
        DOM.nextMissionBtn.onclick = () => {
            window.location.href = "lesson8.html";
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
        SERVER_HERO_MISSION_ENGINE.complete(LESSON_ID);

    if (result.success) {
        SERVER_HERO_ACHIEVEMENTS.check();
        updatePlayerDisplay();
        updateCompletionState();

        SERVER_HERO_UI.modal({
            title: "Misi 07 Selesai",
            message: "Tahniah! Mission 08 kini telah dibuka.",
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
        DOM.gpoNameInput.value = "IT Security Policy";
        DOM.targetOUInput.value = "IT Department";
        DOM.controlPanelSelect.value = "enabled";
        DOM.wallpaperInput.value = "C:\\Wallpapers\\serverhero.jpg";
        DOM.gpupdateInput.value = "gpupdate /force";
        DOM.gpoLinkSelect.value = "linked";

        [
            DOM.gpoNameInput,
            DOM.targetOUInput,
            DOM.controlPanelSelect,
            DOM.wallpaperInput,
            DOM.gpupdateInput,
            DOM.gpoLinkSelect
        ].forEach((element) => {
            element.classList.add("valid");
        });

        DOM.gpoResult.textContent =
            "✅ Simulasi GPO telah diselesaikan.";
        DOM.gpoResult.className = "feedback-box correct";
    }

    if (matchingCompleted) {
        getMatchingSelects().forEach((select) => {
            select.value = select.dataset.answer;
            select.closest("article").classList.add("correct");
        });

        DOM.matchingResult.textContent =
            "✅ Aktiviti padanan telah diselesaikan.";
        DOM.matchingResult.className = "feedback-box correct";
    }
}

function bindEvents() {
    DOM.testGPOBtn.addEventListener("click", testGPOConfiguration);
    DOM.resetGPOBtn.addEventListener("click", resetGPOConfiguration);
    DOM.checkMatchingBtn.addEventListener("click", checkMatchingActivity);
    DOM.previousQuestionBtn.addEventListener("click", previousQuestion);
    DOM.nextQuestionBtn.addEventListener("click", nextQuestion);
    DOM.retryQuizBtn.addEventListener("click", retryQuiz);
    DOM.completeMissionBtn.addEventListener("click", completeMission);
}

function initializeLesson7() {
    loadState();
    bindEvents();
    restoreCompletedState();
    renderQuestion();
    updatePlayerDisplay();
    updateProgress();
    updateCompletionState();

    console.log("LESSON 7 ENGINE READY");
}

initializeLesson7();

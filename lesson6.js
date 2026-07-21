// ======================================================
// SERVER HERO PREMIUM V4.0
// lesson6.js
// MISI 06 - JOIN WINDOWS 10 CLIENT KE DOMAIN
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
            `${engineName} belum dimuatkan. Semak susunan script dalam lesson6.html.`
        );
    }
});

const LESSON_ID = 6;
const PASSING_SCORE = 80;

const CORRECT_DOMAIN_JOIN = Object.freeze({
    dns: "192.168.10.10",
    domain: "serverhero.local",
    adminUsername: "administrator",
    adminPassword: "P@ssw0rd123",
    restartStatus: "restarted",
    domainLogin: "serverhero\\ali"
});

const LESSON_STORAGE_KEYS = Object.freeze({
    simulationCompleted: "lesson6SimulationCompletedV4",
    activityCompleted: "lesson6ActivityCompletedV4",
    quizAnswers: "lesson6QuizAnswersV4",
    quizScore: "lesson6QuizScoreV4",
    quizPassed: "lesson6QuizPassedV4",
    currentQuestion: "lesson6CurrentQuestionV4"
});

const QUIZ_QUESTIONS = Object.freeze([
    {
        question: "Apakah tujuan Domain Join?",
        answers: [
            "Menyambungkan komputer client kepada pengurusan domain",
            "Memasang pencetak",
            "Memformat cakera keras",
            "Menukar alamat MAC"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah Preferred DNS client dalam misi ini?",
        answers: [
            "192.168.10.10",
            "8.8.8.8",
            "192.168.10.1",
            "1.1.1.1"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah nama domain yang digunakan?",
        answers: [
            "serverhero.local",
            "serverhero.com",
            "client.local",
            "windows.net"
        ],
        correctIndex: 0
    },
    {
        question: "Mengapa DNS client perlu menunjuk kepada Domain Controller?",
        answers: [
            "Supaya client dapat mencari servis domain",
            "Supaya RAM bertambah",
            "Supaya skrin lebih terang",
            "Supaya cakera keras diformat"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah akaun yang digunakan untuk membenarkan Domain Join?",
        answers: [
            "Akaun pentadbir domain",
            "Akaun Guest",
            "Akaun tempatan tanpa kebenaran",
            "Akaun printer"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah tindakan selepas mesej Welcome to the domain?",
        answers: [
            "Restart komputer",
            "Padam DNS",
            "Format server",
            "Tutup network adapter"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah format log masuk akaun domain Ali?",
        answers: [
            "serverhero\\ali",
            "local\\ali",
            "guest\\ali",
            "workgroup\\ali"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah objek yang diwujudkan selepas client berjaya join domain?",
        answers: [
            "Computer Object",
            "Printer Object",
            "Folder Object",
            "DNS Cache sahaja"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah arahan yang membantu menguji sambungan ke server?",
        answers: [
            "ping",
            "format",
            "mkdir",
            "shutdown"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah punca biasa domain tidak dijumpai?",
        answers: [
            "Tetapan DNS client salah",
            "Monitor terlalu gelap",
            "Papan kekunci rosak",
            "Ikon desktop hilang"
        ],
        correctIndex: 0
    }
]);

let simulationCompleted = false;
let activityCompleted = false;
let quizPassed = false;
let selectedSequence = [];
let currentQuestionIndex = 0;
let selectedAnswers = new Array(QUIZ_QUESTIONS.length).fill(null);

const DOM = {
    playerXP: document.getElementById("playerXP"),
    playerRank: document.getElementById("playerRank"),
    lessonProgress: document.getElementById("lessonProgress"),
    lessonProgressText: document.getElementById("lessonProgressText"),

    clientDNSInput: document.getElementById("clientDNSInput"),
    domainNameInput: document.getElementById("domainNameInput"),
    adminUsernameInput: document.getElementById("adminUsernameInput"),
    adminPasswordInput: document.getElementById("adminPasswordInput"),
    restartStatusSelect: document.getElementById("restartStatusSelect"),
    domainLoginInput: document.getElementById("domainLoginInput"),
    testDomainJoinBtn: document.getElementById("testDomainJoinBtn"),
    resetDomainJoinBtn: document.getElementById("resetDomainJoinBtn"),
    domainJoinResult: document.getElementById("domainJoinResult"),

    sequenceActivity: document.getElementById("sequenceActivity"),
    activityResult: document.getElementById("activityResult"),
    resetActivityBtn: document.getElementById("resetActivityBtn"),

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

    activityCompleted =
        SERVER_HERO_STORAGE.readRaw(
            LESSON_STORAGE_KEYS.activityCompleted
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
        LESSON_STORAGE_KEYS.activityCompleted,
        activityCompleted ? "true" : "false"
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

function normalizeText(value) {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "");
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

    if (activityCompleted) {
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

function markField(element, valid) {
    if (!element) {
        return;
    }

    element.classList.remove("valid", "invalid");
    element.classList.add(valid ? "valid" : "invalid");
}

function testDomainJoin() {
    const values = {
        dns: String(DOM.clientDNSInput?.value || "").trim(),
        domain: normalizeText(DOM.domainNameInput?.value),
        adminUsername: normalizeText(DOM.adminUsernameInput?.value),
        adminPassword: String(DOM.adminPasswordInput?.value || ""),
        restartStatus: DOM.restartStatusSelect?.value || "",
        domainLogin: normalizeText(DOM.domainLoginInput?.value)
    };

    const exactMatch =
        values.dns === CORRECT_DOMAIN_JOIN.dns &&
        values.domain === CORRECT_DOMAIN_JOIN.domain &&
        values.adminUsername === CORRECT_DOMAIN_JOIN.adminUsername &&
        values.adminPassword === CORRECT_DOMAIN_JOIN.adminPassword &&
        values.restartStatus === CORRECT_DOMAIN_JOIN.restartStatus &&
        values.domainLogin === normalizeText(CORRECT_DOMAIN_JOIN.domainLogin);

    markField(DOM.clientDNSInput, values.dns === CORRECT_DOMAIN_JOIN.dns);
    markField(DOM.domainNameInput, values.domain === CORRECT_DOMAIN_JOIN.domain);
    markField(DOM.adminUsernameInput, values.adminUsername === CORRECT_DOMAIN_JOIN.adminUsername);
    markField(DOM.adminPasswordInput, values.adminPassword === CORRECT_DOMAIN_JOIN.adminPassword);
    markField(DOM.restartStatusSelect, values.restartStatus === CORRECT_DOMAIN_JOIN.restartStatus);
    markField(DOM.domainLoginInput, values.domainLogin === normalizeText(CORRECT_DOMAIN_JOIN.domainLogin));

    if (exactMatch) {
        simulationCompleted = true;

        DOM.domainJoinResult.textContent =
            "✅ Windows 10 berjaya join domain serverhero.local dan pengguna serverhero\\ali boleh log masuk.";

        DOM.domainJoinResult.className =
            "feedback-box correct";

        SERVER_HERO_UI.toast(
            "Domain Join berjaya.",
            "success"
        );
    } else {
        simulationCompleted = false;

        DOM.domainJoinResult.textContent =
            "❌ Konfigurasi belum tepat. Semak DNS, domain, akaun pentadbir, restart dan akaun log masuk.";

        DOM.domainJoinResult.className =
            "feedback-box wrong";

        SERVER_HERO_UI.toast(
            "Domain Join belum berjaya.",
            "error"
        );
    }

    saveLessonState();
    updateLessonProgress();
    updateCompletionState();
}

function resetDomainJoin() {
    if (SERVER_HERO_MISSION_ENGINE.isCompleted(LESSON_ID)) {
        SERVER_HERO_UI.toast(
            "Misi telah selesai. Simulasi dikunci.",
            "info"
        );
        return;
    }

    [
        DOM.clientDNSInput,
        DOM.domainNameInput,
        DOM.adminUsernameInput,
        DOM.adminPasswordInput,
        DOM.restartStatusSelect,
        DOM.domainLoginInput
    ].forEach((element) => {
        if (element) {
            element.value = "";
            element.classList.remove("valid", "invalid");
        }
    });

    simulationCompleted = false;

    DOM.domainJoinResult.textContent =
        "Lengkapkan semua tetapan Domain Join.";

    DOM.domainJoinResult.className =
        "feedback-box";

    saveLessonState();
    updateLessonProgress();
    updateCompletionState();
}

function getSequenceButtons() {
    if (!DOM.sequenceActivity) {
        return [];
    }

    return Array.from(
        DOM.sequenceActivity.querySelectorAll(
            "button[data-step]"
        )
    );
}

function handleSequenceSelection(button) {
    if (activityCompleted || button.disabled) {
        return;
    }

    const step = Number(button.dataset.step);

    selectedSequence.push(step);
    button.disabled = true;
    button.classList.add("selected");
    button.textContent =
        `${selectedSequence.length}. ${button.textContent}`;

    if (selectedSequence.length === getSequenceButtons().length) {
        evaluateSequenceActivity();
    }
}

function evaluateSequenceActivity() {
    const correctSequence = [1,2,3,4,5,6,7];

    const correct = selectedSequence.every(
        (value, index) => value === correctSequence[index]
    );

    if (correct) {
        activityCompleted = true;

        getSequenceButtons().forEach((button) => {
            button.classList.remove("selected");
            button.classList.add("correct");
        });

        DOM.activityResult.textContent =
            "✅ Urutan Domain Join adalah betul.";

        DOM.activityResult.className =
            "feedback-box correct";

        SERVER_HERO_UI.toast(
            "Aktiviti susunan berjaya.",
            "success"
        );
    } else {
        DOM.activityResult.textContent =
            "❌ Urutan belum betul. Reset aktiviti dan cuba semula.";

        DOM.activityResult.className =
            "feedback-box wrong";

        SERVER_HERO_UI.toast(
            "Urutan belum betul.",
            "error"
        );
    }

    saveLessonState();
    updateLessonProgress();
    updateCompletionState();
}

function resetSequenceActivity() {
    if (SERVER_HERO_MISSION_ENGINE.isCompleted(LESSON_ID)) {
        SERVER_HERO_UI.toast(
            "Misi telah selesai. Aktiviti dikunci.",
            "info"
        );
        return;
    }

    selectedSequence = [];
    activityCompleted = false;

    getSequenceButtons().forEach((button) => {
        button.textContent =
            button.textContent.replace(/^\d+\.\s*/, "");
        button.disabled = false;
        button.classList.remove("selected", "correct");
    });

    DOM.activityResult.textContent =
        "Pilih semua langkah mengikut urutan.";

    DOM.activityResult.className =
        "feedback-box";

    saveLessonState();
    updateLessonProgress();
    updateCompletionState();
}

function renderQuestion() {
    if (!DOM.quizContainer) {
        return;
    }

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
            "Kuiz Misi 06 berjaya diluluskan.",
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
        behavior:"smooth",
        block:"center"
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
        activityCompleted &&
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
            `<i class="fa-solid fa-award"></i> Lengkapkan Misi 06`;
    } else {
        DOM.completeMissionBtn.innerHTML =
            `<i class="fa-solid fa-lock"></i> Lengkapkan Misi 06`;
    }

    DOM.nextMissionBtn.disabled = !alreadyCompleted;

    if (alreadyCompleted) {
        DOM.nextMissionBtn.onclick = () => {
            window.location.href = "lesson7.html";
        };

        lockCompletedActivities();
    }
}

function lockCompletedActivities() {
    [
        DOM.clientDNSInput,
        DOM.domainNameInput,
        DOM.adminUsernameInput,
        DOM.adminPasswordInput,
        DOM.restartStatusSelect,
        DOM.domainLoginInput,
        DOM.testDomainJoinBtn,
        DOM.resetDomainJoinBtn,
        DOM.resetActivityBtn
    ].forEach((element) => {
        if (element) {
            element.disabled = true;
        }
    });

    getSequenceButtons().forEach((button) => {
        button.disabled = true;
    });
}

function completeMission() {
    if (
        !simulationCompleted ||
        !activityCompleted ||
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
            title:"Misi 06 Selesai",
            message:"Tahniah! Mission 07 kini telah dibuka.",
            icon:"🖥️",
            confirmText:"Kembali ke Dashboard",
            onConfirm(){
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
        DOM.clientDNSInput.value = CORRECT_DOMAIN_JOIN.dns;
        DOM.domainNameInput.value = CORRECT_DOMAIN_JOIN.domain;
        DOM.adminUsernameInput.value = "Administrator";
        DOM.adminPasswordInput.value = CORRECT_DOMAIN_JOIN.adminPassword;
        DOM.restartStatusSelect.value = CORRECT_DOMAIN_JOIN.restartStatus;
        DOM.domainLoginInput.value = "serverhero\\ali";

        [
            DOM.clientDNSInput,
            DOM.domainNameInput,
            DOM.adminUsernameInput,
            DOM.adminPasswordInput,
            DOM.restartStatusSelect,
            DOM.domainLoginInput
        ].forEach((element) => {
            element.classList.add("valid");
        });

        DOM.domainJoinResult.textContent =
            "✅ Simulasi Domain Join telah diselesaikan.";

        DOM.domainJoinResult.className =
            "feedback-box correct";
    }

    if (activityCompleted) {
        getSequenceButtons().forEach((button, index) => {
            button.disabled = true;
            button.classList.add("correct");

            if (!button.textContent.trim().startsWith(`${index + 1}.`)) {
                button.textContent =
                    `${index + 1}. ${button.textContent}`;
            }
        });

        DOM.activityResult.textContent =
            "✅ Aktiviti telah diselesaikan.";

        DOM.activityResult.className =
            "feedback-box correct";
    }
}

function bindEvents() {
    DOM.testDomainJoinBtn?.addEventListener(
        "click",
        testDomainJoin
    );

    DOM.resetDomainJoinBtn?.addEventListener(
        "click",
        resetDomainJoin
    );

    getSequenceButtons().forEach((button) => {
        button.addEventListener("click", () => {
            handleSequenceSelection(button);
        });
    });

    DOM.resetActivityBtn?.addEventListener(
        "click",
        resetSequenceActivity
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

function initializeLesson6() {
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
            correctAnswers:Math.round(
                (savedScore / 100) * QUIZ_QUESTIONS.length
            ),
            total:QUIZ_QUESTIONS.length,
            percentage:savedScore
        });
    }

    console.log("LESSON 6 ENGINE READY");
}

initializeLesson6();

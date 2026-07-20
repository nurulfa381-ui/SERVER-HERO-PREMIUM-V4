// ======================================================
// SERVER HERO PREMIUM V4.0
// lesson3.js
// MISI 03 - ACTIVE DIRECTORY DOMAIN SERVICES
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
            `${engineName} belum dimuatkan. Semak susunan script dalam lesson3.html.`
        );
    }
});

const LESSON_ID = 3;
const PASSING_SCORE = 80;

const CORRECT_PROMOTION_CONFIG = Object.freeze({
    deployment: "new-forest",
    domainName: "serverhero.local",
    forestLevel: "2016",
    dnsRole: "enabled"
});

const LESSON_STORAGE_KEYS = Object.freeze({
    simulationCompleted: "lesson3SimulationCompletedV4",
    activityCompleted: "lesson3ActivityCompletedV4",
    quizAnswers: "lesson3QuizAnswersV4",
    quizScore: "lesson3QuizScoreV4",
    quizPassed: "lesson3QuizPassedV4",
    currentQuestion: "lesson3CurrentQuestionV4"
});

const QUIZ_QUESTIONS = Object.freeze([
    {
        question: "Apakah fungsi utama Active Directory Domain Services?",
        answers: [
            "Mengurus pengguna, komputer dan sumber rangkaian secara berpusat",
            "Mengedit video",
            "Mencetak dokumen",
            "Mengawal kecerahan monitor"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah server yang menjalankan AD DS dikenali sebagai?",
        answers: [
            "Print Server",
            "Domain Controller",
            "Web Client",
            "Workstation"
        ],
        correctIndex: 1
    },
    {
        question: "Apakah nama domain yang digunakan dalam misi ini?",
        answers: [
            "serverhero.com",
            "serverhero.local",
            "windows.local",
            "hero.net"
        ],
        correctIndex: 1
    },
    {
        question: "Apakah pilihan yang digunakan untuk mencipta forest baharu?",
        answers: [
            "Add a new forest",
            "Add printer",
            "Join workgroup",
            "Create local user"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah fungsi DSRM Password?",
        answers: [
            "Kata laluan Wi-Fi",
            "Kata laluan pemulihan Directory Services",
            "Kata laluan tetamu",
            "Kata laluan BIOS"
        ],
        correctIndex: 1
    },
    {
        question: "Apakah syarat penting sebelum memasang AD DS?",
        answers: [
            "Server menggunakan IP statik",
            "Server mesti offline",
            "Tiada kata laluan diperlukan",
            "Semua adapter rangkaian dipadam"
        ],
        correctIndex: 0
    },
    {
        question: "Di manakah peranan AD DS dipasang?",
        answers: [
            "Server Manager",
            "Paint",
            "File Explorer sahaja",
            "Recycle Bin"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah tindakan selepas pemasangan peranan AD DS selesai?",
        answers: [
            "Promote this server to a domain controller",
            "Format hard disk",
            "Padam akaun Administrator",
            "Tutup semua network adapter"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah yang berlaku selepas promosi Domain Controller selesai?",
        answers: [
            "Server biasanya restart",
            "Server bertukar menjadi Windows 10",
            "Semua fail dipadam",
            "Monitor dimatikan"
        ],
        correctIndex: 0
    },
    {
        question: "Alat manakah digunakan untuk menyemak pengguna dan komputer domain?",
        answers: [
            "Active Directory Users and Computers",
            "Task Scheduler",
            "Calculator",
            "Disk Cleanup"
        ],
        correctIndex: 0
    }
]);

let simulationCompleted = false;
let activityCompleted = false;
let quizPassed = false;
let currentQuestionIndex = 0;
let selectedSequence = [];
let selectedAnswers = new Array(QUIZ_QUESTIONS.length).fill(null);

const DOM = {
    playerXP: document.getElementById("playerXP"),
    playerRank: document.getElementById("playerRank"),
    lessonProgress: document.getElementById("lessonProgress"),
    lessonProgressText: document.getElementById("lessonProgressText"),
    deploymentSelect: document.getElementById("deploymentSelect"),
    domainNameInput: document.getElementById("domainNameInput"),
    forestLevelSelect: document.getElementById("forestLevelSelect"),
    dnsRoleSelect: document.getElementById("dnsRoleSelect"),
    testPromotionBtn: document.getElementById("testPromotionBtn"),
    resetPromotionBtn: document.getElementById("resetPromotionBtn"),
    promotionResult: document.getElementById("promotionResult"),
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
        progress += 30;
    }

    if (activityCompleted) {
        progress += 25;
    }

    const answered = selectedAnswers.filter(
        (answer) => answer !== null
    ).length;

    progress += Math.round(
        (answered / QUIZ_QUESTIONS.length) * 20
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

function testPromotionConfiguration() {
    const values = {
        deployment: DOM.deploymentSelect?.value || "",
        domainName: String(DOM.domainNameInput?.value || "")
            .trim()
            .toLowerCase(),
        forestLevel: DOM.forestLevelSelect?.value || "",
        dnsRole: DOM.dnsRoleSelect?.value || ""
    };

    const exactMatch =
        values.deployment === CORRECT_PROMOTION_CONFIG.deployment &&
        values.domainName === CORRECT_PROMOTION_CONFIG.domainName &&
        values.forestLevel === CORRECT_PROMOTION_CONFIG.forestLevel &&
        values.dnsRole === CORRECT_PROMOTION_CONFIG.dnsRole;

    markField(
        DOM.deploymentSelect,
        values.deployment === CORRECT_PROMOTION_CONFIG.deployment
    );

    markField(
        DOM.domainNameInput,
        values.domainName === CORRECT_PROMOTION_CONFIG.domainName
    );

    markField(
        DOM.forestLevelSelect,
        values.forestLevel === CORRECT_PROMOTION_CONFIG.forestLevel
    );

    markField(
        DOM.dnsRoleSelect,
        values.dnsRole === CORRECT_PROMOTION_CONFIG.dnsRole
    );

    if (exactMatch) {
        simulationCompleted = true;

        DOM.promotionResult.textContent =
            "✅ Konfigurasi promosi betul. Domain serverhero.local berjaya disediakan.";

        DOM.promotionResult.className =
            "feedback-box correct";

        SERVER_HERO_UI.toast(
            "Simulasi Domain Controller berjaya.",
            "success"
        );
    } else {
        simulationCompleted = false;

        DOM.promotionResult.textContent =
            "❌ Konfigurasi belum tepat. Semak operation, domain, forest level dan DNS.";

        DOM.promotionResult.className =
            "feedback-box wrong";

        SERVER_HERO_UI.toast(
            "Konfigurasi promosi belum betul.",
            "error"
        );
    }

    saveLessonState();
    updateLessonProgress();
    updateCompletionState();
}

function resetPromotionSimulation() {
    if (SERVER_HERO_MISSION_ENGINE.isCompleted(LESSON_ID)) {
        SERVER_HERO_UI.toast(
            "Misi telah selesai. Simulasi dikunci.",
            "info"
        );

        return;
    }

    [
        DOM.deploymentSelect,
        DOM.domainNameInput,
        DOM.forestLevelSelect,
        DOM.dnsRoleSelect
    ].forEach((element) => {
        if (element) {
            element.value = "";
            element.classList.remove("valid", "invalid");
        }
    });

    simulationCompleted = false;

    DOM.promotionResult.textContent =
        "Lengkapkan semua tetapan promosi.";

    DOM.promotionResult.className =
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
    const correctSequence = [1, 2, 3, 4, 5, 6, 7];

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
            "✅ Urutan promosi Domain Controller adalah betul.";

        DOM.activityResult.className =
            "feedback-box correct";

        SERVER_HERO_UI.toast(
            "Aktiviti susunan berjaya.",
            "success"
        );
    } else {
        DOM.activityResult.textContent =
            "❌ Urutan belum betul. Reset dan cuba semula.";

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
        const originalText = button.textContent
            .replace(/^\d+\.\s*/, "");

        button.textContent = originalText;
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
            "Kuiz Misi 03 berjaya diluluskan.",
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
            `<i class="fa-solid fa-award"></i> Lengkapkan Misi 03`;
    } else {
        DOM.completeMissionBtn.innerHTML =
            `<i class="fa-solid fa-lock"></i> Lengkapkan Misi 03`;
    }

    DOM.nextMissionBtn.disabled = !alreadyCompleted;

    if (alreadyCompleted) {
        DOM.nextMissionBtn.onclick = () => {
            window.location.href = "lesson4.html";
        };

        lockCompletedActivities();
    }
}

function lockCompletedActivities() {
    [
        DOM.deploymentSelect,
        DOM.domainNameInput,
        DOM.forestLevelSelect,
        DOM.dnsRoleSelect,
        DOM.testPromotionBtn,
        DOM.resetPromotionBtn,
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
            title: "Misi 03 Selesai",
            message:
                "Tahniah! Mission 04 kini telah dibuka.",
            icon: "🏢",
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
        DOM.deploymentSelect.value =
            CORRECT_PROMOTION_CONFIG.deployment;

        DOM.domainNameInput.value =
            CORRECT_PROMOTION_CONFIG.domainName;

        DOM.forestLevelSelect.value =
            CORRECT_PROMOTION_CONFIG.forestLevel;

        DOM.dnsRoleSelect.value =
            CORRECT_PROMOTION_CONFIG.dnsRole;

        [
            DOM.deploymentSelect,
            DOM.domainNameInput,
            DOM.forestLevelSelect,
            DOM.dnsRoleSelect
        ].forEach((element) => {
            element.classList.add("valid");
        });

        DOM.promotionResult.textContent =
            "✅ Simulasi promosi telah diselesaikan.";

        DOM.promotionResult.className =
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
    DOM.testPromotionBtn?.addEventListener(
        "click",
        testPromotionConfiguration
    );

    DOM.resetPromotionBtn?.addEventListener(
        "click",
        resetPromotionSimulation
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

function initializeLesson3() {
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

    console.log("LESSON 3 ENGINE READY");
}

initializeLesson3();

// SERVER HERO PREMIUM V4.0 - lesson8.js
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
        throw new Error(`${engineName} belum dimuatkan. Semak lesson8.html.`);
    }
});

const LESSON_ID = 8;
const PASSING_SCORE = 80;

const CORRECT_DHCP_CONFIG = Object.freeze({
    scopeName: "serverhero-lan",
    startIP: "192.168.10.100",
    endIP: "192.168.10.200",
    subnetMask: "255.255.255.0",
    exclusionStart: "192.168.10.100",
    exclusionEnd: "192.168.10.110",
    gateway: "192.168.10.1",
    dns: "192.168.10.10",
    leaseDuration: "8-days",
    scopeStatus: "active"
});

const KEYS = Object.freeze({
    simulationCompleted: "lesson8SimulationCompletedV4",
    matchingCompleted: "lesson8MatchingCompletedV4",
    quizAnswers: "lesson8QuizAnswersV4",
    quizScore: "lesson8QuizScoreV4",
    quizPassed: "lesson8QuizPassedV4",
    currentQuestion: "lesson8CurrentQuestionV4"
});

const QUIZ_QUESTIONS = Object.freeze([
    {
        question: "Apakah fungsi utama DHCP Server?",
        answers: [
            "Memberikan alamat IP secara automatik",
            "Memasang sistem operasi",
            "Mengawal kata laluan domain",
            "Menyimpan fail pengguna"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah maksud DHCP Scope?",
        answers: [
            "Julat alamat IP untuk client",
            "Kata laluan server",
            "Nama domain",
            "Fail konfigurasi DNS"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah fungsi Exclusion Range?",
        answers: [
            "Menghalang alamat tertentu daripada diberikan",
            "Memadam semua client",
            "Menukar subnet mask",
            "Mengaktifkan DNS"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah Option 003 dalam DHCP?",
        answers: [
            "Default Gateway",
            "DNS Server",
            "Lease Duration",
            "Scope Name"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah Option 006 dalam DHCP?",
        answers: [
            "DNS Server",
            "Default Gateway",
            "Scope Status",
            "Computer Name"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah nama Scope dalam misi ini?",
        answers: [
            "SERVERHERO-LAN",
            "SERVERHERO-DNS",
            "CLIENT-NET",
            "DOMAIN-SCOPE"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah Start IP dalam misi ini?",
        answers: [
            "192.168.10.100",
            "192.168.10.1",
            "192.168.10.10",
            "192.168.10.254"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah arahan untuk mendapatkan alamat IP baharu?",
        answers: [
            "ipconfig /renew",
            "ipconfig /flushdns",
            "gpupdate /force",
            "nslookup"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah syarat DHCP Scope boleh memberikan alamat IP?",
        answers: [
            "Scope mesti Active",
            "Scope mesti Inactive",
            "DNS mesti dipadam",
            "Client mesti offline"
        ],
        correctIndex: 0
    },
    {
        question: "Mengapa DHCP Server perlu di-authorize dalam domain?",
        answers: [
            "Untuk membenarkan server memberikan alamat IP",
            "Untuk menambah kapasiti RAM",
            "Untuk menukar nama domain",
            "Untuk memformat cakera"
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

    scopeNameInput: document.getElementById("scopeNameInput"),
    startIPInput: document.getElementById("startIPInput"),
    endIPInput: document.getElementById("endIPInput"),
    subnetMaskInput: document.getElementById("subnetMaskInput"),
    exclusionStartInput: document.getElementById("exclusionStartInput"),
    exclusionEndInput: document.getElementById("exclusionEndInput"),
    gatewayInput: document.getElementById("gatewayInput"),
    dnsInput: document.getElementById("dnsInput"),
    leaseDurationSelect: document.getElementById("leaseDurationSelect"),
    scopeStatusSelect: document.getElementById("scopeStatusSelect"),
    testDHCPBtn: document.getElementById("testDHCPBtn"),
    resetDHCPBtn: document.getElementById("resetDHCPBtn"),
    dhcpResult: document.getElementById("dhcpResult"),

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
    return String(value || "").trim().toLowerCase();
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

function testDHCPConfiguration() {
    const values = {
        scopeName: normalize(DOM.scopeNameInput.value),
        startIP: DOM.startIPInput.value.trim(),
        endIP: DOM.endIPInput.value.trim(),
        subnetMask: DOM.subnetMaskInput.value.trim(),
        exclusionStart: DOM.exclusionStartInput.value.trim(),
        exclusionEnd: DOM.exclusionEndInput.value.trim(),
        gateway: DOM.gatewayInput.value.trim(),
        dns: DOM.dnsInput.value.trim(),
        leaseDuration: DOM.leaseDurationSelect.value,
        scopeStatus: DOM.scopeStatusSelect.value
    };

    const checks = {
        scopeName: values.scopeName === CORRECT_DHCP_CONFIG.scopeName,
        startIP: values.startIP === CORRECT_DHCP_CONFIG.startIP,
        endIP: values.endIP === CORRECT_DHCP_CONFIG.endIP,
        subnetMask: values.subnetMask === CORRECT_DHCP_CONFIG.subnetMask,
        exclusionStart: values.exclusionStart === CORRECT_DHCP_CONFIG.exclusionStart,
        exclusionEnd: values.exclusionEnd === CORRECT_DHCP_CONFIG.exclusionEnd,
        gateway: values.gateway === CORRECT_DHCP_CONFIG.gateway,
        dns: values.dns === CORRECT_DHCP_CONFIG.dns,
        leaseDuration: values.leaseDuration === CORRECT_DHCP_CONFIG.leaseDuration,
        scopeStatus: values.scopeStatus === CORRECT_DHCP_CONFIG.scopeStatus
    };

    markField(DOM.scopeNameInput, checks.scopeName);
    markField(DOM.startIPInput, checks.startIP);
    markField(DOM.endIPInput, checks.endIP);
    markField(DOM.subnetMaskInput, checks.subnetMask);
    markField(DOM.exclusionStartInput, checks.exclusionStart);
    markField(DOM.exclusionEndInput, checks.exclusionEnd);
    markField(DOM.gatewayInput, checks.gateway);
    markField(DOM.dnsInput, checks.dns);
    markField(DOM.leaseDurationSelect, checks.leaseDuration);
    markField(DOM.scopeStatusSelect, checks.scopeStatus);

    simulationCompleted =
        Object.values(checks).every(Boolean);

    if (simulationCompleted) {
        DOM.dhcpResult.textContent =
            "✅ DHCP Scope SERVERHERO-LAN berjaya dikonfigurasi dan diaktifkan.";
        DOM.dhcpResult.className =
            "feedback-box correct";
        SERVER_HERO_UI.toast(
            "Konfigurasi DHCP berjaya.",
            "success"
        );
    } else {
        DOM.dhcpResult.textContent =
            "❌ Konfigurasi belum tepat. Semak semua tetapan DHCP.";
        DOM.dhcpResult.className =
            "feedback-box wrong";
        SERVER_HERO_UI.toast(
            "Konfigurasi DHCP belum betul.",
            "error"
        );
    }

    saveState();
    updateProgress();
    updateCompletionState();
}

function resetDHCPConfiguration() {
    if (SERVER_HERO_MISSION_ENGINE.isCompleted(LESSON_ID)) {
        SERVER_HERO_UI.toast(
            "Misi telah selesai. Simulasi dikunci.",
            "info"
        );
        return;
    }

    [
        DOM.scopeNameInput,
        DOM.startIPInput,
        DOM.endIPInput,
        DOM.subnetMaskInput,
        DOM.exclusionStartInput,
        DOM.exclusionEndInput,
        DOM.gatewayInput,
        DOM.dnsInput,
        DOM.leaseDurationSelect,
        DOM.scopeStatusSelect
    ].forEach((element) => {
        element.value = "";
        element.classList.remove("valid", "invalid");
    });

    simulationCompleted = false;
    DOM.dhcpResult.textContent =
        "Lengkapkan semua tetapan DHCP.";
    DOM.dhcpResult.className =
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
            "✅ Semua padanan DHCP adalah betul.";
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
            "Lengkapkan Misi 08";
    } else {
        DOM.completeMissionBtn.textContent =
            "🔒 Lengkapkan Misi 08";
    }

    DOM.nextMissionBtn.disabled =
        !alreadyCompleted;

    if (alreadyCompleted) {
        DOM.nextMissionBtn.onclick = () => {
            window.location.href = "lesson9.html";
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
            title: "Misi 08 Selesai",
            message: "Tahniah! Mission 09 kini telah dibuka.",
            icon: "📡",
            confirmText: "Kembali ke Dashboard",
            onConfirm() {
                window.location.href = "index.html";
            }
        });
    }
}

function restoreCompletedState() {
    if (simulationCompleted) {
        DOM.scopeNameInput.value =
            "SERVERHERO-LAN";
        DOM.startIPInput.value =
            CORRECT_DHCP_CONFIG.startIP;
        DOM.endIPInput.value =
            CORRECT_DHCP_CONFIG.endIP;
        DOM.subnetMaskInput.value =
            CORRECT_DHCP_CONFIG.subnetMask;
        DOM.exclusionStartInput.value =
            CORRECT_DHCP_CONFIG.exclusionStart;
        DOM.exclusionEndInput.value =
            CORRECT_DHCP_CONFIG.exclusionEnd;
        DOM.gatewayInput.value =
            CORRECT_DHCP_CONFIG.gateway;
        DOM.dnsInput.value =
            CORRECT_DHCP_CONFIG.dns;
        DOM.leaseDurationSelect.value =
            CORRECT_DHCP_CONFIG.leaseDuration;
        DOM.scopeStatusSelect.value =
            CORRECT_DHCP_CONFIG.scopeStatus;

        [
            DOM.scopeNameInput,
            DOM.startIPInput,
            DOM.endIPInput,
            DOM.subnetMaskInput,
            DOM.exclusionStartInput,
            DOM.exclusionEndInput,
            DOM.gatewayInput,
            DOM.dnsInput,
            DOM.leaseDurationSelect,
            DOM.scopeStatusSelect
        ].forEach((element) => {
            element.classList.add("valid");
        });

        DOM.dhcpResult.textContent =
            "✅ Simulasi DHCP telah diselesaikan.";
        DOM.dhcpResult.className =
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
    DOM.testDHCPBtn.addEventListener(
        "click",
        testDHCPConfiguration
    );

    DOM.resetDHCPBtn.addEventListener(
        "click",
        resetDHCPConfiguration
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

function initializeLesson8() {
    loadState();
    bindEvents();
    restoreCompletedState();
    renderQuestion();
    updatePlayerDisplay();
    updateProgress();
    updateCompletionState();

    console.log("LESSON 8 ENGINE READY");
}

initializeLesson8();

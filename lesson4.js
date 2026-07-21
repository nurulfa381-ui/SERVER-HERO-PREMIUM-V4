// ======================================================
// SERVER HERO PREMIUM V4.0
// lesson4.js
// MISI 04 - KONFIGURASI DNS SERVER
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
            `${engineName} belum dimuatkan. Semak susunan script dalam lesson4.html.`
        );
    }
});

const LESSON_ID = 4;
const PASSING_SCORE = 80;

const CORRECT_DNS_CONFIG = Object.freeze({
    zoneType: "primary",
    zoneName: "serverhero.local",
    dynamicUpdate: "secure",
    hostName: "server",
    hostIP: "192.168.10.10",
    lookupName: "server.serverhero.local"
});

const LESSON_STORAGE_KEYS = Object.freeze({
    simulationCompleted: "lesson4SimulationCompletedV4",
    matchingCompleted: "lesson4MatchingCompletedV4",
    quizAnswers: "lesson4QuizAnswersV4",
    quizScore: "lesson4QuizScoreV4",
    quizPassed: "lesson4QuizPassedV4",
    currentQuestion: "lesson4CurrentQuestionV4"
});

const QUIZ_QUESTIONS = Object.freeze([
    {
        question: "Apakah fungsi utama DNS?",
        answers: [
            "Menukar nama domain kepada alamat IP",
            "Menyimpan kata laluan pengguna",
            "Mengawal kipas server",
            "Memformat cakera keras"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah fungsi Forward Lookup Zone?",
        answers: [
            "Menukar nama host kepada alamat IP",
            "Menukar alamat IP kepada nama host",
            "Menyimpan fail pengguna",
            "Mengawal sambungan USB"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah fungsi Reverse Lookup Zone?",
        answers: [
            "Menukar alamat IP kepada nama host",
            "Menukar nama host kepada alamat IP",
            "Menambah RAM",
            "Mencipta akaun tempatan"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah rekod DNS yang memetakan nama host kepada alamat IPv4?",
        answers: [
            "A Record",
            "MX Record",
            "TXT Record",
            "CNAME sahaja"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah nama zone yang digunakan dalam misi ini?",
        answers: [
            "serverhero.local",
            "serverhero.com",
            "dns.local",
            "hero.net"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah Host Name yang digunakan dalam simulasi?",
        answers: [
            "server",
            "client",
            "router",
            "printer"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah alamat IP bagi Host (A) Record dalam misi ini?",
        answers: [
            "192.168.10.10",
            "192.168.10.1",
            "8.8.8.8",
            "10.0.0.1"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah arahan yang digunakan untuk menguji Name Resolution DNS?",
        answers: [
            "nslookup",
            "format",
            "mkdir",
            "shutdown"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah maksud FQDN?",
        answers: [
            "Fully Qualified Domain Name",
            "Fast Query Domain Network",
            "File Queue Data Name",
            "Full Quality Device Number"
        ],
        correctIndex: 0
    },
    {
        question: "Preferred DNS pada Domain Controller sepatutnya menunjuk ke mana?",
        answers: [
            "Alamat IP server sendiri",
            "Alamat IP rawak",
            "Alamat loopback sahaja tanpa DNS",
            "Alamat komputer client"
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

    zoneTypeSelect: document.getElementById("zoneTypeSelect"),
    zoneNameInput: document.getElementById("zoneNameInput"),
    dynamicUpdateSelect: document.getElementById("dynamicUpdateSelect"),
    hostNameInput: document.getElementById("hostNameInput"),
    hostIPInput: document.getElementById("hostIPInput"),
    lookupNameInput: document.getElementById("lookupNameInput"),
    testDNSBtn: document.getElementById("testDNSBtn"),
    resetDNSBtn: document.getElementById("resetDNSBtn"),
    dnsResult: document.getElementById("dnsResult"),

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
    const progressValue = calculateLessonProgress();

    if (DOM.lessonProgress) {
        SERVER_HERO_UI.animateProgress(
            DOM.lessonProgress,
            progressValue,
            500
        );
    }

    if (DOM.lessonProgressText) {
        DOM.lessonProgressText.textContent =
            `${progressValue}%`;
    }
}

function normalizeValue(value) {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "");
}

function validateIPv4(value) {
    const parts = String(value || "").trim().split(".");

    if (parts.length !== 4) {
        return false;
    }

    return parts.every((part) => {
        if (!/^\d+$/.test(part)) {
            return false;
        }

        const number = Number(part);

        return number >= 0 && number <= 255;
    });
}

function markField(element, valid) {
    if (!element) {
        return;
    }

    element.classList.remove("valid", "invalid");
    element.classList.add(valid ? "valid" : "invalid");
}

function testDNSConfiguration() {
    const values = {
        zoneType: DOM.zoneTypeSelect?.value || "",
        zoneName: normalizeValue(DOM.zoneNameInput?.value),
        dynamicUpdate: DOM.dynamicUpdateSelect?.value || "",
        hostName: normalizeValue(DOM.hostNameInput?.value),
        hostIP: String(DOM.hostIPInput?.value || "").trim(),
        lookupName: normalizeValue(DOM.lookupNameInput?.value)
    };

    const exactMatch =
        values.zoneType === CORRECT_DNS_CONFIG.zoneType &&
        values.zoneName === CORRECT_DNS_CONFIG.zoneName &&
        values.dynamicUpdate === CORRECT_DNS_CONFIG.dynamicUpdate &&
        values.hostName === CORRECT_DNS_CONFIG.hostName &&
        values.hostIP === CORRECT_DNS_CONFIG.hostIP &&
        values.lookupName === CORRECT_DNS_CONFIG.lookupName;

    markField(
        DOM.zoneTypeSelect,
        values.zoneType === CORRECT_DNS_CONFIG.zoneType
    );

    markField(
        DOM.zoneNameInput,
        values.zoneName === CORRECT_DNS_CONFIG.zoneName
    );

    markField(
        DOM.dynamicUpdateSelect,
        values.dynamicUpdate === CORRECT_DNS_CONFIG.dynamicUpdate
    );

    markField(
        DOM.hostNameInput,
        values.hostName === CORRECT_DNS_CONFIG.hostName
    );

    markField(
        DOM.hostIPInput,
        validateIPv4(values.hostIP) &&
        values.hostIP === CORRECT_DNS_CONFIG.hostIP
    );

    markField(
        DOM.lookupNameInput,
        values.lookupName === CORRECT_DNS_CONFIG.lookupName
    );

    if (!validateIPv4(values.hostIP)) {
        simulationCompleted = false;

        DOM.dnsResult.textContent =
            "❌ Format alamat IPv4 tidak sah.";

        DOM.dnsResult.className =
            "feedback-box wrong";

        SERVER_HERO_UI.toast(
            "Format alamat IP tidak sah.",
            "error"
        );
    } else if (!exactMatch) {
        simulationCompleted = false;

        DOM.dnsResult.textContent =
            "❌ Konfigurasi DNS belum tepat. Semak Zone Type, Zone Name, Dynamic Update, Host Name, IP dan FQDN.";

        DOM.dnsResult.className =
            "feedback-box wrong";

        SERVER_HERO_UI.toast(
            "Konfigurasi DNS belum betul.",
            "error"
        );
    } else {
        simulationCompleted = true;

        DOM.dnsResult.textContent =
            "✅ DNS berjaya dikonfigurasi. nslookup server.serverhero.local memulangkan 192.168.10.10.";

        DOM.dnsResult.className =
            "feedback-box correct";

        SERVER_HERO_UI.toast(
            "Konfigurasi DNS berjaya.",
            "success"
        );
    }

    saveLessonState();
    updateLessonProgress();
    updateCompletionState();
}

function resetDNSSimulation() {
    if (SERVER_HERO_MISSION_ENGINE.isCompleted(LESSON_ID)) {
        SERVER_HERO_UI.toast(
            "Misi telah selesai. Simulasi dikunci.",
            "info"
        );

        return;
    }

    [
        DOM.zoneTypeSelect,
        DOM.zoneNameInput,
        DOM.dynamicUpdateSelect,
        DOM.hostNameInput,
        DOM.hostIPInput,
        DOM.lookupNameInput
    ].forEach((element) => {
        if (element) {
            element.value = "";
            element.classList.remove("valid", "invalid");
        }
    });

    simulationCompleted = false;

    DOM.dnsResult.textContent =
        "Lengkapkan semua tetapan DNS.";

    DOM.dnsResult.className =
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
            "✅ Semua padanan DNS adalah betul.";

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

    DOM.finalScore.textContent =
        `${result.percentage}%`;

    if (quizPassed) {
        DOM.resultTitle.textContent =
            "Tahniah, Anda Lulus!";

        DOM.resultMessage.textContent =
            `Anda menjawab ${result.correctAnswers} daripada ${result.total} soalan dengan betul.`;

        SERVER_HERO_UI.toast(
            "Kuiz Misi 04 berjaya diluluskan.",
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
            `<i class="fa-solid fa-award"></i> Lengkapkan Misi 04`;
    } else {
        DOM.completeMissionBtn.innerHTML =
            `<i class="fa-solid fa-lock"></i> Lengkapkan Misi 04`;
    }

    DOM.nextMissionBtn.disabled = !alreadyCompleted;

    if (alreadyCompleted) {
        DOM.nextMissionBtn.onclick = () => {
            window.location.href = "lesson5.html";
        };

        lockCompletedActivities();
    }
}

function lockCompletedActivities() {
    [
        DOM.zoneTypeSelect,
        DOM.zoneNameInput,
        DOM.dynamicUpdateSelect,
        DOM.hostNameInput,
        DOM.hostIPInput,
        DOM.lookupNameInput,
        DOM.testDNSBtn,
        DOM.resetDNSBtn,
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
            "Lengkapkan simulasi DNS, aktiviti dan kuiz dahulu.",
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
            title: "Misi 04 Selesai",
            message:
                "Tahniah! Mission 05 kini telah dibuka.",
            icon: "🛰️",
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
        DOM.zoneTypeSelect.value =
            CORRECT_DNS_CONFIG.zoneType;

        DOM.zoneNameInput.value =
            CORRECT_DNS_CONFIG.zoneName;

        DOM.dynamicUpdateSelect.value =
            CORRECT_DNS_CONFIG.dynamicUpdate;

        DOM.hostNameInput.value =
            CORRECT_DNS_CONFIG.hostName;

        DOM.hostIPInput.value =
            CORRECT_DNS_CONFIG.hostIP;

        DOM.lookupNameInput.value =
            CORRECT_DNS_CONFIG.lookupName;

        [
            DOM.zoneTypeSelect,
            DOM.zoneNameInput,
            DOM.dynamicUpdateSelect,
            DOM.hostNameInput,
            DOM.hostIPInput,
            DOM.lookupNameInput
        ].forEach((element) => {
            element.classList.add("valid");
        });

        DOM.dnsResult.textContent =
            "✅ Simulasi DNS telah diselesaikan.";

        DOM.dnsResult.className =
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
    DOM.testDNSBtn?.addEventListener(
        "click",
        testDNSConfiguration
    );

    DOM.resetDNSBtn?.addEventListener(
        "click",
        resetDNSSimulation
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

function initializeLesson4() {
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

    console.log("LESSON 4 ENGINE READY");
}

initializeLesson4();

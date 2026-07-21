// SERVER HERO PREMIUM V4.0 - lesson13.js
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
        throw new Error(`${engineName} belum dimuatkan. Semak lesson13.html.`);
    }
});

const LESSON_ID = 13;
const PASSING_SCORE = 80;

const CORRECT_FINAL_CONFIG = Object.freeze({
    serverName: "server",
    serverIP: "192.168.10.10",
    subnetMask: "255.255.255.0",
    domainName: "serverhero.local",
    ouName: "it department",
    domainUser: "ali",
    dhcpScope: "serverhero-lan",
    dhcpRange: "192.168.10.100-192.168.10.200",
    gpoName: "it security policy",
    fileShare: "\\\\server\\it-share",
    printerShare: "\\\\server\\office-printer",
    backupDestination: "e:",
    firewallStatus: "on",
    monitoringStatus: "normal"
});

const KEYS = Object.freeze({
    simulationCompleted: "lesson13SimulationCompletedV4",
    sequenceCompleted: "lesson13SequenceCompletedV4",
    quizAnswers: "lesson13QuizAnswersV4",
    quizScore: "lesson13QuizScoreV4",
    quizPassed: "lesson13QuizPassedV4",
    currentQuestion: "lesson13CurrentQuestionV4",
    masterUnlocked: "serverHeroMasterUnlockedV4"
});

const QUIZ_QUESTIONS = Object.freeze([
    {
        question: "Apakah sistem operasi server yang digunakan dalam projek ini?",
        answers: [
            "Windows Server 2019",
            "Windows 7",
            "Ubuntu Desktop",
            "Windows XP"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah IP statik server?",
        answers: [
            "192.168.10.10",
            "192.168.10.1",
            "192.168.10.100",
            "8.8.8.8"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah nama domain organisasi?",
        answers: [
            "serverhero.local",
            "serverhero.com",
            "client.local",
            "domain.net"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah fungsi utama AD DS?",
        answers: [
            "Mengurus identiti dan objek domain",
            "Mencetak dokumen",
            "Memberikan alamat IP",
            "Menyimpan backup"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah fungsi DNS dalam domain?",
        answers: [
            "Menterjemah nama kepada alamat IP",
            "Menyimpan fail",
            "Mengurus printer",
            "Menambah RAM"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah nama OU dalam projek ini?",
        answers: [
            "IT Department",
            "Finance",
            "Users",
            "Computers"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah nama pengguna domain yang digunakan?",
        answers: [
            "ali",
            "guest",
            "student",
            "admin01"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah fungsi Domain Join?",
        answers: [
            "Menyambungkan client kepada domain",
            "Memasang printer",
            "Mencipta backup",
            "Mengubah subnet mask"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah nama GPO dalam projek ini?",
        answers: [
            "IT Security Policy",
            "Default Printer",
            "Backup Policy",
            "DNS Policy"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah fungsi gpupdate /force?",
        answers: [
            "Memaksa kemas kini polisi",
            "Menghapuskan user",
            "Memasang DHCP",
            "Menukar domain"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah nama DHCP Scope?",
        answers: [
            "SERVERHERO-LAN",
            "SERVERHERO-DNS",
            "CLIENT-SCOPE",
            "LAN-01"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah fungsi DHCP?",
        answers: [
            "Memberikan alamat IP secara automatik",
            "Mengurus pengguna",
            "Menyimpan log",
            "Mengawal firewall"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah laluan File Share?",
        answers: [
            "\\\\SERVER\\IT-Share",
            "D:\\SERVER",
            "C:\\Users",
            "http://server"
        ],
        correctIndex: 0
    },
    {
        question: "Permission Modify membenarkan pengguna melakukan apa?",
        answers: [
            "Membaca, mengubah dan memadam fail",
            "Membaca sahaja",
            "Tiada akses",
            "Mengubah domain"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah laluan Printer Share?",
        answers: [
            "\\\\SERVER\\OFFICE-PRINTER",
            "C:\\Printer",
            "D:\\Office",
            "http://printer"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah fungsi Full Server Backup?",
        answers: [
            "Menyalin keseluruhan server",
            "Menyalin satu fail",
            "Memadam sistem",
            "Mencipta DHCP"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah lokasi backup dalam projek ini?",
        answers: [
            "E:",
            "C:",
            "A:",
            "Z:"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah fungsi Windows Defender Firewall?",
        answers: [
            "Mengawal trafik rangkaian",
            "Mencipta user",
            "Mengurus DHCP",
            "Menyimpan backup"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah alat untuk melihat log sistem?",
        answers: [
            "Event Viewer",
            "Paint",
            "Notepad",
            "Calculator"
        ],
        correctIndex: 0
    },
    {
        question: "Apakah gelaran selepas menamatkan semua misi?",
        answers: [
            "SERVER HERO MASTER",
            "Junior User",
            "Guest Operator",
            "Basic Client"
        ],
        correctIndex: 0
    }
]);

let simulationCompleted = false;
let sequenceCompleted = false;
let quizPassed = false;
let currentQuestionIndex = 0;
let selectedSequence = [];
let selectedAnswers = new Array(QUIZ_QUESTIONS.length).fill(null);

const DOM = {
    playerXP: document.getElementById("playerXP"),
    playerRank: document.getElementById("playerRank"),
    lessonProgress: document.getElementById("lessonProgress"),
    lessonProgressText: document.getElementById("lessonProgressText"),

    serverNameInput: document.getElementById("serverNameInput"),
    serverIPInput: document.getElementById("serverIPInput"),
    subnetMaskInput: document.getElementById("subnetMaskInput"),
    domainNameInput: document.getElementById("domainNameInput"),
    ouNameInput: document.getElementById("ouNameInput"),
    domainUserInput: document.getElementById("domainUserInput"),
    dhcpScopeInput: document.getElementById("dhcpScopeInput"),
    dhcpRangeInput: document.getElementById("dhcpRangeInput"),
    gpoNameInput: document.getElementById("gpoNameInput"),
    fileShareInput: document.getElementById("fileShareInput"),
    printerShareInput: document.getElementById("printerShareInput"),
    backupDestinationInput: document.getElementById("backupDestinationInput"),
    firewallStatusSelect: document.getElementById("firewallStatusSelect"),
    monitoringStatusSelect: document.getElementById("monitoringStatusSelect"),
    testFinalConfigBtn: document.getElementById("testFinalConfigBtn"),
    resetFinalConfigBtn: document.getElementById("resetFinalConfigBtn"),
    finalConfigResult: document.getElementById("finalConfigResult"),

    sequenceActivity: document.getElementById("sequenceActivity"),
    sequenceResult: document.getElementById("sequenceResult"),
    resetSequenceBtn: document.getElementById("resetSequenceBtn"),

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

    masterSection: document.getElementById("masterSection"),
    completeMissionBtn: document.getElementById("completeMissionBtn"),
    certificateBtn: document.getElementById("certificateBtn")
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

    sequenceCompleted =
        SERVER_HERO_STORAGE.readRaw(KEYS.sequenceCompleted) === "true";

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
        KEYS.sequenceCompleted,
        sequenceCompleted ? "true" : "false"
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

    if (simulationCompleted) {
        progress += 35;
    }

    if (sequenceCompleted) {
        progress += 25;
    }

    const answered = selectedAnswers.filter(
        (answer) => answer !== null
    ).length;

    progress += Math.round(
        (answered / QUIZ_QUESTIONS.length) * 15
    );

    if (quizPassed) {
        progress += 15;
    }

    progress = Math.min(progress, 100);

    SERVER_HERO_UI.animateProgress(
        DOM.lessonProgress,
        progress,
        600
    );

    DOM.lessonProgressText.textContent = `${progress}%`;
}

function markField(element, valid) {
    element.classList.remove("valid", "invalid");
    element.classList.add(valid ? "valid" : "invalid");
}

function testFinalConfiguration() {
    const values = {
        serverName: normalize(DOM.serverNameInput.value),
        serverIP: DOM.serverIPInput.value.trim(),
        subnetMask: DOM.subnetMaskInput.value.trim(),
        domainName: normalize(DOM.domainNameInput.value),
        ouName: normalize(DOM.ouNameInput.value),
        domainUser: normalize(DOM.domainUserInput.value),
        dhcpScope: normalize(DOM.dhcpScopeInput.value),
        dhcpRange: normalize(DOM.dhcpRangeInput.value),
        gpoName: normalize(DOM.gpoNameInput.value),
        fileShare: normalize(DOM.fileShareInput.value),
        printerShare: normalize(DOM.printerShareInput.value),
        backupDestination: normalize(DOM.backupDestinationInput.value),
        firewallStatus: DOM.firewallStatusSelect.value,
        monitoringStatus: DOM.monitoringStatusSelect.value
    };

    const checks = {
        serverName: values.serverName === CORRECT_FINAL_CONFIG.serverName,
        serverIP: values.serverIP === CORRECT_FINAL_CONFIG.serverIP,
        subnetMask: values.subnetMask === CORRECT_FINAL_CONFIG.subnetMask,
        domainName: values.domainName === CORRECT_FINAL_CONFIG.domainName,
        ouName: values.ouName === CORRECT_FINAL_CONFIG.ouName,
        domainUser: values.domainUser === CORRECT_FINAL_CONFIG.domainUser,
        dhcpScope: values.dhcpScope === CORRECT_FINAL_CONFIG.dhcpScope,
        dhcpRange: values.dhcpRange === CORRECT_FINAL_CONFIG.dhcpRange,
        gpoName: values.gpoName === CORRECT_FINAL_CONFIG.gpoName,
        fileShare: values.fileShare === CORRECT_FINAL_CONFIG.fileShare,
        printerShare: values.printerShare === CORRECT_FINAL_CONFIG.printerShare,
        backupDestination: values.backupDestination === CORRECT_FINAL_CONFIG.backupDestination,
        firewallStatus: values.firewallStatus === CORRECT_FINAL_CONFIG.firewallStatus,
        monitoringStatus: values.monitoringStatus === CORRECT_FINAL_CONFIG.monitoringStatus
    };

    markField(DOM.serverNameInput, checks.serverName);
    markField(DOM.serverIPInput, checks.serverIP);
    markField(DOM.subnetMaskInput, checks.subnetMask);
    markField(DOM.domainNameInput, checks.domainName);
    markField(DOM.ouNameInput, checks.ouName);
    markField(DOM.domainUserInput, checks.domainUser);
    markField(DOM.dhcpScopeInput, checks.dhcpScope);
    markField(DOM.dhcpRangeInput, checks.dhcpRange);
    markField(DOM.gpoNameInput, checks.gpoName);
    markField(DOM.fileShareInput, checks.fileShare);
    markField(DOM.printerShareInput, checks.printerShare);
    markField(DOM.backupDestinationInput, checks.backupDestination);
    markField(DOM.firewallStatusSelect, checks.firewallStatus);
    markField(DOM.monitoringStatusSelect, checks.monitoringStatus);

    simulationCompleted =
        Object.values(checks).every(Boolean);

    if (simulationCompleted) {
        DOM.finalConfigResult.textContent =
            "✅ Semua konfigurasi Final Boss adalah betul.";

        DOM.finalConfigResult.className =
            "feedback-box correct";

        SERVER_HERO_UI.toast(
            "Final Boss configuration complete.",
            "success"
        );
    } else {
        DOM.finalConfigResult.textContent =
            "❌ Masih terdapat konfigurasi yang salah. Semak semua medan.";

        DOM.finalConfigResult.className =
            "feedback-box wrong";

        SERVER_HERO_UI.toast(
            "Final Boss belum ditewaskan.",
            "error"
        );
    }

    saveState();
    updateProgress();
    updateCompletionState();
}

function resetFinalConfiguration() {
    if (SERVER_HERO_MISSION_ENGINE.isCompleted(LESSON_ID)) {
        SERVER_HERO_UI.toast(
            "Misi telah selesai. Simulasi dikunci.",
            "info"
        );
        return;
    }

    [
        DOM.serverNameInput,
        DOM.serverIPInput,
        DOM.subnetMaskInput,
        DOM.domainNameInput,
        DOM.ouNameInput,
        DOM.domainUserInput,
        DOM.dhcpScopeInput,
        DOM.dhcpRangeInput,
        DOM.gpoNameInput,
        DOM.fileShareInput,
        DOM.printerShareInput,
        DOM.backupDestinationInput,
        DOM.firewallStatusSelect,
        DOM.monitoringStatusSelect
    ].forEach((element) => {
        element.value = "";
        element.classList.remove("valid", "invalid");
    });

    simulationCompleted = false;

    DOM.finalConfigResult.textContent =
        "Lengkapkan semua konfigurasi Final Boss.";

    DOM.finalConfigResult.className =
        "feedback-box";

    saveState();
    updateProgress();
    updateCompletionState();
}

function getSequenceButtons() {
    return Array.from(
        DOM.sequenceActivity.querySelectorAll(
            "button[data-step]"
        )
    );
}

function handleSequenceSelection(button) {
    if (sequenceCompleted || button.disabled) {
        return;
    }

    const step = Number(button.dataset.step);

    selectedSequence.push(step);
    button.disabled = true;
    button.classList.add("selected");

    if (!button.textContent.trim().startsWith(`${selectedSequence.length}.`)) {
        button.textContent =
            `${selectedSequence.length}. ${button.textContent}`;
    }

    if (selectedSequence.length === getSequenceButtons().length) {
        evaluateSequence();
    }
}

function evaluateSequence() {
    const correctSequence =
        Array.from({ length: 13 }, (_, index) => index + 1);

    const correct =
        selectedSequence.every(
            (value, index) => value === correctSequence[index]
        );

    if (correct) {
        sequenceCompleted = true;

        getSequenceButtons().forEach((button) => {
            button.classList.remove("selected");
            button.classList.add("correct");
        });

        DOM.sequenceResult.textContent =
            "✅ Semua langkah pembangunan server disusun dengan betul.";

        DOM.sequenceResult.className =
            "feedback-box correct";

        SERVER_HERO_UI.toast(
            "Urutan Final Boss berjaya.",
            "success"
        );
    } else {
        DOM.sequenceResult.textContent =
            "❌ Urutan belum betul. Reset dan cuba semula.";

        DOM.sequenceResult.className =
            "feedback-box wrong";

        SERVER_HERO_UI.toast(
            "Urutan Final Boss belum betul.",
            "error"
        );
    }

    saveState();
    updateProgress();
    updateCompletionState();
}

function resetSequence() {
    if (SERVER_HERO_MISSION_ENGINE.isCompleted(LESSON_ID)) {
        SERVER_HERO_UI.toast(
            "Misi telah selesai. Aktiviti dikunci.",
            "info"
        );
        return;
    }

    selectedSequence = [];
    sequenceCompleted = false;

    getSequenceButtons().forEach((button) => {
        button.textContent =
            button.textContent.replace(/^\d+\.\s*/, "");

        button.disabled = false;
        button.classList.remove("selected", "correct");
    });

    DOM.sequenceResult.textContent =
        "Pilih semua langkah mengikut urutan.";

    DOM.sequenceResult.className =
        "feedback-box";

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
            "Final Boss Quiz Lulus!";

        DOM.resultMessage.textContent =
            `Anda menjawab ${correctAnswers} daripada ${QUIZ_QUESTIONS.length} soalan dengan betul.`;

        SERVER_HERO_UI.toast(
            "Kuiz Final Boss berjaya.",
            "success"
        );
    } else {
        DOM.resultTitle.textContent =
            "Final Boss Belum Tewas";

        DOM.resultMessage.textContent =
            `Markah anda ${percentage}%. Markah minimum ialah ${PASSING_SCORE}%.`;

        SERVER_HERO_UI.toast(
            "Cuba semula untuk mencapai 80%.",
            "error"
        );
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
        sequenceCompleted &&
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
            "✓ FINAL BOSS DEFEATED";
    } else if (canComplete) {
        DOM.completeMissionBtn.textContent =
            "Lengkapkan Misi 13";
    } else {
        DOM.completeMissionBtn.textContent =
            "🔒 Lengkapkan Misi 13";
    }

    DOM.certificateBtn.disabled =
        !alreadyCompleted;

    if (alreadyCompleted) {
        DOM.masterSection.classList.remove("hidden");

        DOM.certificateBtn.onclick = () => {
            window.location.href = "certificate.html";
        };
    }
}

function completeMission() {
    if (
        !simulationCompleted ||
        !sequenceCompleted ||
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
        SERVER_HERO_STORAGE.writeRaw(
            KEYS.masterUnlocked,
            "true"
        );

        SERVER_HERO_ACHIEVEMENTS.check();
        updatePlayerDisplay();
        updateCompletionState();

        SERVER_HERO_UI.modal({
            title: "SERVER HERO MASTER",
            message:
                "Tahniah! Anda telah menamatkan semua 13 misi.",
            icon: "👑",
            confirmText: "Kembali ke Dashboard",
            onConfirm() {
                window.location.href = "index.html";
            }
        });
    }
}

function restoreCompletedState() {
    if (simulationCompleted) {
        DOM.serverNameInput.value = "SERVER";
        DOM.serverIPInput.value = "192.168.10.10";
        DOM.subnetMaskInput.value = "255.255.255.0";
        DOM.domainNameInput.value = "serverhero.local";
        DOM.ouNameInput.value = "IT Department";
        DOM.domainUserInput.value = "ali";
        DOM.dhcpScopeInput.value = "SERVERHERO-LAN";
        DOM.dhcpRangeInput.value =
            "192.168.10.100-192.168.10.200";
        DOM.gpoNameInput.value = "IT Security Policy";
        DOM.fileShareInput.value = "\\\\SERVER\\IT-Share";
        DOM.printerShareInput.value =
            "\\\\SERVER\\OFFICE-PRINTER";
        DOM.backupDestinationInput.value = "E:";
        DOM.firewallStatusSelect.value = "on";
        DOM.monitoringStatusSelect.value = "normal";

        [
            DOM.serverNameInput,
            DOM.serverIPInput,
            DOM.subnetMaskInput,
            DOM.domainNameInput,
            DOM.ouNameInput,
            DOM.domainUserInput,
            DOM.dhcpScopeInput,
            DOM.dhcpRangeInput,
            DOM.gpoNameInput,
            DOM.fileShareInput,
            DOM.printerShareInput,
            DOM.backupDestinationInput,
            DOM.firewallStatusSelect,
            DOM.monitoringStatusSelect
        ].forEach((element) => {
            element.classList.add("valid");
        });

        DOM.finalConfigResult.textContent =
            "✅ Simulasi Final Boss telah diselesaikan.";

        DOM.finalConfigResult.className =
            "feedback-box correct";
    }

    if (sequenceCompleted) {
        getSequenceButtons().forEach((button, index) => {
            button.disabled = true;
            button.classList.add("correct");

            if (!button.textContent.trim().startsWith(`${index + 1}.`)) {
                button.textContent =
                    `${index + 1}. ${button.textContent}`;
            }
        });

        DOM.sequenceResult.textContent =
            "✅ Aktiviti susunan telah diselesaikan.";

        DOM.sequenceResult.className =
            "feedback-box correct";
    }
}

function bindEvents() {
    DOM.testFinalConfigBtn.addEventListener(
        "click",
        testFinalConfiguration
    );

    DOM.resetFinalConfigBtn.addEventListener(
        "click",
        resetFinalConfiguration
    );

    getSequenceButtons().forEach((button) => {
        button.addEventListener("click", () => {
            handleSequenceSelection(button);
        });
    });

    DOM.resetSequenceBtn.addEventListener(
        "click",
        resetSequence
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

function initializeLesson13() {
    loadState();
    bindEvents();
    restoreCompletedState();
    renderQuestion();
    updatePlayerDisplay();
    updateProgress();
    updateCompletionState();

    console.log("LESSON 13 FINAL BOSS ENGINE READY");
}

initializeLesson13();

// ======================================================
// SERVER HERO PREMIUM V4.0
// lesson1.js
// MISI 01 - PEMASANGAN WINDOWS SERVER 2019
// FULL STABLE VERSION
// ======================================================

"use strict";


// ======================================================
// ENGINE REQUIREMENTS
// ======================================================

const REQUIRED_ENGINES = [

    "SERVER_HERO_STORAGE",

    "SERVER_HERO_PLAYER",

    "SERVER_HERO_MISSION_ENGINE",

    "SERVER_HERO_ACHIEVEMENTS",

    "SERVER_HERO_UI"

];


REQUIRED_ENGINES.forEach(

    engineName => {

        if (

            !window[engineName]

        ) {

            throw new Error(

                `${engineName} belum dimuatkan. Semak susunan script dalam lesson1.html.`

            );

        }

    }

);


// ======================================================
// MISSION CONFIGURATION
// ======================================================

const LESSON_ID = 1;

const PASSING_SCORE = 80;

const LESSON_STORAGE_KEYS = Object.freeze({

    activityCompleted:
        "lesson1ActivityCompletedV4",

    quizAnswers:
        "lesson1QuizAnswersV4",

    quizScore:
        "lesson1QuizScoreV4",

    quizPassed:
        "lesson1QuizPassedV4",

    currentQuestion:
        "lesson1CurrentQuestionV4"

});


// ======================================================
// QUIZ DATABASE
// ======================================================

const QUIZ_QUESTIONS = Object.freeze([

    {

        question:
            "Apakah tujuan utama Windows Server 2019?",

        answers: [

            "Menjalankan permainan komputer",

            "Mengurus pengguna, komputer dan perkhidmatan rangkaian",

            "Mengedit gambar dan video",

            "Melayari Internet sahaja"

        ],

        correctIndex:
            1,

        explanation:
            "Windows Server 2019 digunakan untuk mengurus sumber rangkaian, pengguna, komputer dan pelbagai perkhidmatan server."

    },

    {

        question:
            "Apakah seni bina pemproses yang diperlukan untuk Windows Server 2019?",

        answers: [

            "16-bit",

            "32-bit sahaja",

            "64-bit",

            "8-bit"

        ],

        correctIndex:
            2,

        explanation:
            "Windows Server 2019 memerlukan pemproses berasaskan 64-bit."

    },

    {

        question:
            "Apakah kapasiti RAM minimum untuk pemasangan Desktop Experience?",

        answers: [

            "512 MB",

            "1 GB",

            "2 GB",

            "16 GB"

        ],

        correctIndex:
            2,

        explanation:
            "Desktop Experience memerlukan sekurang-kurangnya 2 GB RAM."

    },

    {

        question:
            "Perisian manakah yang boleh digunakan untuk mencipta USB bootable?",

        answers: [

            "Rufus",

            "Paint",

            "Calculator",

            "Notepad"

        ],

        correctIndex:
            0,

        explanation:
            "Rufus ialah salah satu perisian yang biasa digunakan untuk mencipta USB bootable."

    },

    {

        question:
            "Di manakah tetapan Boot Priority biasanya diubah?",

        answers: [

            "Control Panel",

            "BIOS atau UEFI",

            "Task Manager",

            "Server Manager"

        ],

        correctIndex:
            1,

        explanation:
            "Boot Priority ditetapkan melalui BIOS atau UEFI."

    },

    {

        question:
            "Apakah pilihan edisi yang perlu dipilih jika mahu menggunakan paparan grafik?",

        answers: [

            "Server Core sahaja",

            "Desktop Experience",

            "Safe Mode",

            "Command Prompt Edition"

        ],

        correctIndex:
            1,

        explanation:
            "Desktop Experience menyediakan antara muka grafik penuh."

    },

    {

        question:
            "Apakah jenis pemasangan yang dipilih untuk pemasangan baharu?",

        answers: [

            "Upgrade",

            "Repair",

            "Custom Installation",

            "Quick Scan"

        ],

        correctIndex:
            2,

        explanation:
            "Custom Installation digunakan untuk pemasangan baharu dan pemilihan partition."

    },

    {

        question:
            "Apakah akaun utama yang digunakan selepas pemasangan selesai?",

        answers: [

            "Guest",

            "Administrator",

            "Student",

            "Visitor"

        ],

        correctIndex:
            1,

        explanation:
            "Akaun Administrator digunakan untuk log masuk pertama selepas pemasangan."

    },

    {

        question:
            "Apakah ciri kata laluan Administrator yang baik?",

        answers: [

            "Menggunakan nama sendiri sahaja",

            "Pendek dan mudah diteka",

            "Gabungan huruf besar, huruf kecil, nombor dan simbol",

            "Tiada kata laluan"

        ],

        correctIndex:
            2,

        explanation:
            "Kata laluan yang kukuh perlu menggunakan gabungan beberapa jenis aksara."

    },

    {

        question:
            "Apakah aplikasi yang biasanya terbuka selepas log masuk pertama?",

        answers: [

            "Microsoft Word",

            "Server Manager",

            "Paint",

            "Windows Media Player"

        ],

        correctIndex:
            1,

        explanation:
            "Server Manager biasanya dibuka secara automatik selepas log masuk."

    }

]);


// ======================================================
// APPLICATION STATE
// ======================================================

let selectedSequence = [];

let currentQuestionIndex = 0;

let selectedAnswers = new Array(

    QUIZ_QUESTIONS.length

).fill(null);

let quizPassed = false;

let activityCompleted = false;


// ======================================================
// DOM REFERENCES
// ======================================================

const DOM = {

    playerXP:
        document.getElementById("playerXP"),

    playerRank:
        document.getElementById("playerRank"),

    lessonProgress:
        document.getElementById("lessonProgress"),

    lessonProgressText:
        document.getElementById("lessonProgressText"),

    sequenceActivity:
        document.getElementById("sequenceActivity"),

    activityResult:
        document.getElementById("activityResult"),

    resetActivityBtn:
        document.getElementById("resetActivityBtn"),

    questionCounter:
        document.getElementById("questionCounter"),

    quizContainer:
        document.getElementById("quizContainer"),

    quizFeedback:
        document.getElementById("quizFeedback"),

    previousQuestionBtn:
        document.getElementById("previousQuestionBtn"),

    nextQuestionBtn:
        document.getElementById("nextQuestionBtn"),

    resultSection:
        document.getElementById("resultSection"),

    resultTitle:
        document.getElementById("resultTitle"),

    resultMessage:
        document.getElementById("resultMessage"),

    finalScore:
        document.getElementById("finalScore"),

    retryQuizBtn:
        document.getElementById("retryQuizBtn"),

    completeMissionBtn:
        document.getElementById("completeMissionBtn"),

    nextMissionBtn:
        document.getElementById("nextMissionBtn")

};


// ======================================================
// STORAGE HELPERS
// ======================================================

function loadLessonState() {

    activityCompleted =

        SERVER_HERO_STORAGE.readRaw(

            LESSON_STORAGE_KEYS.activityCompleted

        ) === "true";

    const savedAnswers =

        SERVER_HERO_STORAGE.readArray(

            LESSON_STORAGE_KEYS.quizAnswers,

            []

        );

    if (

        savedAnswers.length ===

        QUIZ_QUESTIONS.length

    ) {

        selectedAnswers =

            savedAnswers;

    }

    currentQuestionIndex =

        Number(

            SERVER_HERO_STORAGE.readRaw(

                LESSON_STORAGE_KEYS.currentQuestion

            )

        ) || 0;

    currentQuestionIndex =

        Math.max(

            0,

            Math.min(

                QUIZ_QUESTIONS.length - 1,

                currentQuestionIndex

            )

        );

    quizPassed =

        SERVER_HERO_STORAGE.readRaw(

            LESSON_STORAGE_KEYS.quizPassed

        ) === "true";

}


function saveLessonState() {

    SERVER_HERO_STORAGE.writeRaw(

        LESSON_STORAGE_KEYS.activityCompleted,

        activityCompleted

            ? "true"

            : "false"

    );

    SERVER_HERO_STORAGE.write(

        LESSON_STORAGE_KEYS.quizAnswers,

        selectedAnswers

    );

    SERVER_HERO_STORAGE.writeRaw(

        LESSON_STORAGE_KEYS.currentQuestion,

        String(

            currentQuestionIndex

        )

    );

    SERVER_HERO_STORAGE.writeRaw(

        LESSON_STORAGE_KEYS.quizPassed,

        quizPassed

            ? "true"

            : "false"

    );

}


// ======================================================
// PLAYER DISPLAY
// ======================================================

function updatePlayerDisplay() {

    const player =

        SERVER_HERO_PLAYER.get();

    if (DOM.playerXP) {

        DOM.playerXP.textContent =

            player.xp;

    }

    if (DOM.playerRank) {

        DOM.playerRank.textContent =

            player.rank;

    }

}


// ======================================================
// LESSON PROGRESS
// ======================================================

function calculateLessonProgress() {

    let progress = 20;

    if (activityCompleted) {

        progress += 30;

    }

    const answeredCount =

        selectedAnswers.filter(

            answer =>

                answer !== null

        ).length;

    progress += Math.round(

        (

            answeredCount /

            QUIZ_QUESTIONS.length

        ) * 30

    );

    if (quizPassed) {

        progress += 20;

    }

    return Math.min(

        100,

        progress

    );

}


function updateLessonProgress() {

    const progressValue =

        calculateLessonProgress();

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


// ======================================================
// SEQUENCE ACTIVITY
// ======================================================

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


function resetSequenceActivity() {

    selectedSequence = [];

    activityCompleted = false;

    getSequenceButtons().forEach(

        button => {

            button.disabled = false;

            button.classList.remove(

                "selected",

                "correct"

            );

            button.removeAttribute(

                "data-order"

            );

        }

    );

    if (DOM.activityResult) {

        DOM.activityResult.textContent =

            "Pilih semua langkah mengikut urutan.";

        DOM.activityResult.className =

            "feedback-box";

    }

    saveLessonState();

    updateLessonProgress();

    updateCompletionState();

}


function handleSequenceSelection(

    button

) {

    if (

        activityCompleted ||

        button.disabled

    ) {

        return;

    }

    const stepNumber =

        Number(

            button.dataset.step

        );

    selectedSequence.push(

        stepNumber

    );

    button.disabled = true;

    button.classList.add(

        "selected"

    );

    button.dataset.order =

        String(

            selectedSequence.length

        );

    button.textContent =

        `${selectedSequence.length}. ${button.textContent}`;

    if (

        selectedSequence.length ===

        getSequenceButtons().length

    ) {

        evaluateSequenceActivity();

    }

}


function evaluateSequenceActivity() {

    const correctSequence = [

        1,

        2,

        3,

        4,

        5

    ];

    const correct =

        selectedSequence.every(

            (

                value,

                index

            ) =>

                value ===

                correctSequence[index]

        );

    if (correct) {

        activityCompleted = true;

        SERVER_HERO_STORAGE.writeRaw(

            LESSON_STORAGE_KEYS.activityCompleted,

            "true"

        );

        getSequenceButtons().forEach(

            button => {

                button.classList.remove(

                    "selected"

                );

                button.classList.add(

                    "correct"

                );

            }

        );

        if (DOM.activityResult) {

            DOM.activityResult.textContent =

                "✅ Tahniah! Urutan pemasangan adalah betul.";

            DOM.activityResult.className =

                "feedback-box correct";

        }

        SERVER_HERO_UI.toast(

            "Aktiviti berjaya diselesaikan.",

            "success"

        );

    }

    else {

        if (DOM.activityResult) {

            DOM.activityResult.textContent =

                "❌ Urutan belum betul. Tekan Reset Aktiviti dan cuba semula.";

            DOM.activityResult.className =

                "feedback-box wrong";

        }

        SERVER_HERO_UI.toast(

            "Urutan belum betul. Cuba semula.",

            "error"

        );

    }

    saveLessonState();

    updateLessonProgress();

    updateCompletionState();

}


// ======================================================
// QUIZ RENDERING
// ======================================================

function renderQuestion() {

    if (!DOM.quizContainer) {

        return;

    }

    const question =

        QUIZ_QUESTIONS[

            currentQuestionIndex

        ];

    DOM.quizContainer.innerHTML = `

        <div class="quiz-question">

            <h3>

                ${SERVER_HERO_UI.escapeHTML(

                    question.question

                )}

            </h3>

        </div>

        <div class="answer-list">

            ${

                question.answers.map(

                    (

                        answer,

                        answerIndex

                    ) => `

                        <button

                            type="button"

                            class="answer-option ${

                                selectedAnswers[

                                    currentQuestionIndex

                                ] === answerIndex

                                    ? "selected"

                                    : ""

                            }"

                            data-answer-index="${answerIndex}"

                        >

                            ${SERVER_HERO_UI.escapeHTML(

                                answer

                            )}

                        </button>

                    `

                ).join("")

            }

        </div>

    `;

    DOM.quizContainer

        .querySelectorAll(

            ".answer-option"

        )

        .forEach(

            button => {

                button.addEventListener(

                    "click",

                    () => {

                        selectAnswer(

                            Number(

                                button.dataset.answerIndex

                            )

                        );

                    }

                );

            }

        );

    if (DOM.questionCounter) {

        DOM.questionCounter.textContent =

            `${currentQuestionIndex + 1} / ${QUIZ_QUESTIONS.length}`;

    }

    if (DOM.previousQuestionBtn) {

        DOM.previousQuestionBtn.disabled =

            currentQuestionIndex === 0;

    }

    if (DOM.nextQuestionBtn) {

        DOM.nextQuestionBtn.innerHTML =

            currentQuestionIndex ===

            QUIZ_QUESTIONS.length - 1

                ? `Hantar Kuiz <i class="fa-solid fa-check"></i>`

                : `Seterusnya <i class="fa-solid fa-arrow-right"></i>`;

    }

    updateQuizFeedback();

    saveLessonState();

    updateLessonProgress();

}


function selectAnswer(

    answerIndex

) {

    selectedAnswers[

        currentQuestionIndex

    ] = answerIndex;

    renderQuestion();

}


function updateQuizFeedback() {

    if (!DOM.quizFeedback) {

        return;

    }

    const selectedAnswer =

        selectedAnswers[

            currentQuestionIndex

        ];

    if (

        selectedAnswer === null

    ) {

        DOM.quizFeedback.textContent =

            "Pilih satu jawapan.";

        DOM.quizFeedback.className =

            "feedback-box";

        return;

    }

    DOM.quizFeedback.textContent =

        "Jawapan telah dipilih. Tekan Seterusnya untuk meneruskan.";

    DOM.quizFeedback.className =

        "feedback-box correct";

}


// ======================================================
// QUIZ NAVIGATION
// ======================================================

function goToPreviousQuestion() {

    if (

        currentQuestionIndex > 0

    ) {

        currentQuestionIndex--;

        renderQuestion();

    }

}


function goToNextQuestion() {

    if (

        selectedAnswers[

            currentQuestionIndex

        ] === null

    ) {

        SERVER_HERO_UI.toast(

            "Sila pilih satu jawapan dahulu.",

            "error"

        );

        return;

    }

    if (

        currentQuestionIndex <

        QUIZ_QUESTIONS.length - 1

    ) {

        currentQuestionIndex++;

        renderQuestion();

        return;

    }

    submitQuiz();

}


// ======================================================
// QUIZ SCORING
// ======================================================

function calculateQuizScore() {

    let correctAnswers = 0;

    QUIZ_QUESTIONS.forEach(

        (

            question,

            index

        ) => {

            if (

                selectedAnswers[index] ===

                question.correctIndex

            ) {

                correctAnswers++;

            }

        }

    );

    const percentage =

        Math.round(

            (

                correctAnswers /

                QUIZ_QUESTIONS.length

            ) * 100

        );

    return {

        correctAnswers,

        total:

            QUIZ_QUESTIONS.length,

        percentage

    };

}


function submitQuiz() {

    if (

        selectedAnswers.some(

            answer =>

                answer === null

        )

    ) {

        SERVER_HERO_UI.toast(

            "Sila jawab semua soalan dahulu.",

            "error"

        );

        return;

    }

    const result =

        calculateQuizScore();

    quizPassed =

        result.percentage >=

        PASSING_SCORE;

    SERVER_HERO_STORAGE.writeRaw(

        LESSON_STORAGE_KEYS.quizScore,

        String(

            result.percentage

        )

    );

    SERVER_HERO_STORAGE.writeRaw(

        LESSON_STORAGE_KEYS.quizPassed,

        quizPassed

            ? "true"

            : "false"

    );

    SERVER_HERO_STORAGE

        .setMissionQuizPassed(

            LESSON_ID,

            quizPassed

        );

    showQuizResult(

        result

    );

    saveLessonState();

    updateLessonProgress();

    updateCompletionState();

}


// ======================================================
// QUIZ RESULT
// ======================================================

function showQuizResult(

    result

) {

    if (!DOM.resultSection) {

        return;

    }

    DOM.resultSection.classList.remove(

        "hidden"

    );

    if (DOM.finalScore) {

        DOM.finalScore.textContent =

            `${result.percentage}%`;

    }

    if (quizPassed) {

        if (DOM.resultTitle) {

            DOM.resultTitle.textContent =

                "Tahniah, Anda Lulus!";

        }

        if (DOM.resultMessage) {

            DOM.resultMessage.textContent =

                `Anda menjawab ${result.correctAnswers} daripada ${result.total} soalan dengan betul.`;

        }

        SERVER_HERO_UI.toast(

            "Kuiz berjaya diluluskan.",

            "success"

        );

    }

    else {

        if (DOM.resultTitle) {

            DOM.resultTitle.textContent =

                "Belum Mencapai Markah Lulus";

        }

        if (DOM.resultMessage) {

            DOM.resultMessage.textContent =

                `Markah anda ${result.percentage}%. Anda perlu mendapat sekurang-kurangnya ${PASSING_SCORE}%.`;

        }

        SERVER_HERO_UI.toast(

            "Cuba semula untuk mencapai 80%.",

            "error"

        );

    }

    DOM.resultSection.scrollIntoView({

        behavior:
            "smooth",

        block:
            "center"

    });

}


// ======================================================
// RETRY QUIZ
// ======================================================

function retryQuiz() {

    selectedAnswers =

        new Array(

            QUIZ_QUESTIONS.length

        ).fill(null);

    currentQuestionIndex = 0;

    quizPassed = false;

    SERVER_HERO_STORAGE.remove(

        LESSON_STORAGE_KEYS.quizScore

    );

    SERVER_HERO_STORAGE.remove(

        LESSON_STORAGE_KEYS.quizPassed

    );

    SERVER_HERO_STORAGE

        .setMissionQuizPassed(

            LESSON_ID,

            false

        );

    if (DOM.resultSection) {

        DOM.resultSection.classList.add(

            "hidden"

        );

    }

    saveLessonState();

    renderQuestion();

    updateLessonProgress();

    updateCompletionState();

    window.scrollTo({

        top:
            DOM.quizContainer

                ? DOM.quizContainer

                    .getBoundingClientRect()

                    .top +

                    window.scrollY -

                    120

                : 0,

        behavior:
            "smooth"

    });

}


// ======================================================
// MISSION COMPLETION STATE
// ======================================================

function updateCompletionState() {

    const canComplete =

        activityCompleted &&

        quizPassed;

    const alreadyCompleted =

        SERVER_HERO_MISSION_ENGINE

            .isCompleted(

                LESSON_ID

            );

    if (DOM.completeMissionBtn) {

        DOM.completeMissionBtn.disabled =

            !canComplete ||

            alreadyCompleted;

        DOM.completeMissionBtn.classList.toggle(

            "ready",

            canComplete &&

            !alreadyCompleted

        );

        if (alreadyCompleted) {

            DOM.completeMissionBtn.innerHTML =

                `<i class="fa-solid fa-circle-check"></i> Misi Telah Selesai`;

        }

        else if (canComplete) {

            DOM.completeMissionBtn.innerHTML =

                `<i class="fa-solid fa-award"></i> Lengkapkan Misi 01`;

        }

        else {

            DOM.completeMissionBtn.innerHTML =

                `<i class="fa-solid fa-lock"></i> Lengkapkan Misi 01`;

        }

    }

    if (DOM.nextMissionBtn) {

        DOM.nextMissionBtn.disabled =

            !alreadyCompleted;

        if (alreadyCompleted) {

            DOM.nextMissionBtn.onclick =

                () => {

                    window.location.href =

                        "lesson2.html";

                };

        }

    }

}


// ======================================================
// COMPLETE MISSION
// ======================================================

function completeLessonMission() {

    if (

        !activityCompleted ||

        !quizPassed

    ) {

        SERVER_HERO_UI.toast(

            "Lengkapkan aktiviti dan lulus kuiz dahulu.",

            "error"

        );

        return;

    }

    const result =

        SERVER_HERO_MISSION_ENGINE

            .complete(

                LESSON_ID

            );

    if (result.success) {

        updatePlayerDisplay();

        updateCompletionState();

        updateLessonProgress();

        SERVER_HERO_ACHIEVEMENTS

            .check();

        if (DOM.nextMissionBtn) {

            DOM.nextMissionBtn.disabled =

                false;

        }

        window.setTimeout(

            () => {

                SERVER_HERO_UI.modal({

                    title:
                        "Misi 01 Selesai",

                    message:
                        "Tahniah! Mission 02 kini telah dibuka.",

                    icon:
                        "🏆",

                    confirmText:
                        "Kembali ke Dashboard",

                    onConfirm() {

                        window.location.href =

                            "index.html";

                    }

                });

            },

            500

        );

        return;

    }

    if (

        result.reason ===

        "already-completed"

    ) {

        SERVER_HERO_UI.toast(

            "Misi ini telah pun diselesaikan.",

            "info"

        );

        updateCompletionState();

        return;

    }

    SERVER_HERO_UI.toast(

        "Misi tidak dapat diselesaikan.",

        "error"

    );

}


// ======================================================
// RESTORE ACTIVITY UI
// ======================================================

function restoreActivityUI() {

    if (!activityCompleted) {

        return;

    }

    getSequenceButtons().forEach(

        (

            button,

            index

        ) => {

            button.disabled = true;

            button.classList.add(

                "correct"

            );

            if (

                !button.textContent.trim()

                    .startsWith(

                        `${index + 1}.`

                    )

            ) {

                button.textContent =

                    `${index + 1}. ${button.textContent}`;

            }

        }

    );

    if (DOM.activityResult) {

        DOM.activityResult.textContent =

            "✅ Aktiviti telah diselesaikan.";

        DOM.activityResult.className =

            "feedback-box correct";

    }

}


// ======================================================
// EVENT BINDING
// ======================================================

function bindEvents() {

    getSequenceButtons().forEach(

        button => {

            button.addEventListener(

                "click",

                () => {

                    handleSequenceSelection(

                        button

                    );

                }

            );

        }

    );

    if (DOM.resetActivityBtn) {

        DOM.resetActivityBtn.addEventListener(

            "click",

            resetSequenceActivity

        );

    }

    if (DOM.previousQuestionBtn) {

        DOM.previousQuestionBtn.addEventListener(

            "click",

            goToPreviousQuestion

        );

    }

    if (DOM.nextQuestionBtn) {

        DOM.nextQuestionBtn.addEventListener(

            "click",

            goToNextQuestion

        );

    }

    if (DOM.retryQuizBtn) {

        DOM.retryQuizBtn.addEventListener(

            "click",

            retryQuiz

        );

    }

    if (DOM.completeMissionBtn) {

        DOM.completeMissionBtn.addEventListener(

            "click",

            completeLessonMission

        );

    }

}


// ======================================================
// INITIALIZATION
// ======================================================

function initializeLesson1() {

    loadLessonState();

    bindEvents();

    restoreActivityUI();

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

            correctAnswers:

                Math.round(

                    (

                        savedScore /

                        100

                    ) *

                    QUIZ_QUESTIONS.length

                ),

            total:

                QUIZ_QUESTIONS.length,

            percentage:

                savedScore

        });

    }

    console.log(

        "======================================"

    );

    console.log(

        "SERVER HERO PREMIUM V4.0"

    );

    console.log(

        "LESSON 1 ENGINE READY"

    );

    console.log(

        "Activity Completed:",

        activityCompleted

    );

    console.log(

        "Quiz Passed:",

        quizPassed

    );

    console.log(

        "======================================"

    );

}


initializeLesson1();

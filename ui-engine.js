// ======================================================
// SERVER HERO PREMIUM V4.0
// ui-engine.js
// FULL STABLE VERSION
// ======================================================

"use strict";


// ======================================================
// UI STATE
// ======================================================

const UI_STATE = {

    activeToast:
        null,

    activeModal:
        null,

    loadingOverlay:
        null

};


// ======================================================
// BASIC HELPERS
// ======================================================

function escapeHTML(value) {

    const element =

        document.createElement(

            "div"

        );

    element.textContent =

        value == null

            ? ""

            : String(value);

    return element.innerHTML;

}


function removeElement(

    element

) {

    if (

        element &&

        element.parentNode

    ) {

        element.parentNode

            .removeChild(

                element

            );

    }

}


// ======================================================
// TOAST NOTIFICATION
// ======================================================

function showToast(

    message,

    type = "info",

    duration = 3000

) {

    if (

        UI_STATE.activeToast

    ) {

        removeElement(

            UI_STATE.activeToast

        );

        UI_STATE.activeToast =

            null;

    }

    const toast =

        document.createElement(

            "div"

        );

    toast.className =

        `toast ${type}`;

    toast.setAttribute(

        "role",

        "status"

    );

    toast.setAttribute(

        "aria-live",

        "polite"

    );

    toast.textContent =

        String(message);

    document.body.appendChild(

        toast

    );

    UI_STATE.activeToast =

        toast;

    window.requestAnimationFrame(

        () => {

            toast.classList.add(

                "show"

            );

        }

    );

    window.setTimeout(

        () => {

            toast.classList.remove(

                "show"

            );

        },

        Math.max(

            500,

            Number(duration) - 500

        )

    );

    window.setTimeout(

        () => {

            removeElement(

                toast

            );

            if (

                UI_STATE.activeToast ===

                toast

            ) {

                UI_STATE.activeToast =

                    null;

            }

        },

        Math.max(

            1000,

            Number(duration)

        )

    );

    return toast;

}


// ======================================================
// MODAL
// ======================================================

function closeModal() {

    if (

        !UI_STATE.activeModal

    ) {

        return false;

    }

    removeElement(

        UI_STATE.activeModal

    );

    UI_STATE.activeModal =

        null;

    document.body.classList

        .remove(

            "modal-open"

        );

    return true;

}


function showModal(options = {}) {

    closeModal();

    const title =

        options.title ||

        "SERVER HERO";

    const message =

        options.message ||

        "";

    const icon =

        options.icon ||

        "ℹ️";

    const confirmText =

        options.confirmText ||

        "OK";

    const cancelText =

        options.cancelText ||

        "Cancel";

    const showCancel =

        Boolean(

            options.showCancel

        );

    const overlay =

        document.createElement(

            "div"

        );

    overlay.className =

        "ui-modal-overlay";

    overlay.setAttribute(

        "role",

        "dialog"

    );

    overlay.setAttribute(

        "aria-modal",

        "true"

    );

    overlay.innerHTML = `

        <div class="ui-modal">

            <div class="ui-modal-icon">

                ${escapeHTML(icon)}

            </div>

            <h2>

                ${escapeHTML(title)}

            </h2>

            <p>

                ${escapeHTML(message)}

            </p>

            <div class="ui-modal-actions">

                ${

                    showCancel

                        ? `

                            <button

                                type="button"

                                class="ui-modal-cancel"

                            >

                                ${escapeHTML(

                                    cancelText

                                )}

                            </button>

                        `

                        : ""

                }

                <button

                    type="button"

                    class="ui-modal-confirm"

                >

                    ${escapeHTML(

                        confirmText

                    )}

                </button>

            </div>

        </div>

    `;

    document.body.appendChild(

        overlay

    );

    UI_STATE.activeModal =

        overlay;

    document.body.classList

        .add(

            "modal-open"

        );

    const confirmButton =

        overlay.querySelector(

            ".ui-modal-confirm"

        );

    const cancelButton =

        overlay.querySelector(

            ".ui-modal-cancel"

        );

    if (confirmButton) {

        confirmButton.addEventListener(

            "click",

            () => {

                if (

                    typeof options.onConfirm ===

                    "function"

                ) {

                    options.onConfirm();

                }

                closeModal();

            }

        );

    }

    if (cancelButton) {

        cancelButton.addEventListener(

            "click",

            () => {

                if (

                    typeof options.onCancel ===

                    "function"

                ) {

                    options.onCancel();

                }

                closeModal();

            }

        );

    }

    overlay.addEventListener(

        "click",

        event => {

            if (

                event.target ===

                overlay &&

                options.closeOnOverlay !==

                false

            ) {

                closeModal();

            }

        }

    );

    return overlay;

}


// ======================================================
// CONFIRM DIALOG
// ======================================================

function confirmAction(

    message,

    onConfirm,

    title = "Confirmation"

) {

    return showModal({

        title,

        message,

        icon:
            "⚠️",

        confirmText:
            "Confirm",

        cancelText:
            "Cancel",

        showCancel:
            true,

        onConfirm

    });

}


// ======================================================
// LOADING OVERLAY
// ======================================================

function showLoading(

    message = "Loading..."

) {

    hideLoading();

    const overlay =

        document.createElement(

            "div"

        );

    overlay.className =

        "ui-loading-overlay";

    overlay.innerHTML = `

        <div class="ui-loading-card">

            <div class="ui-spinner"></div>

            <p>

                ${escapeHTML(

                    message

                )}

            </p>

        </div>

    `;

    document.body.appendChild(

        overlay

    );

    UI_STATE.loadingOverlay =

        overlay;

    return overlay;

}


function hideLoading() {

    if (

        UI_STATE.loadingOverlay

    ) {

        removeElement(

            UI_STATE.loadingOverlay

        );

        UI_STATE.loadingOverlay =

            null;

    }

}


// ======================================================
// REWARD POPUP
// ======================================================

function showRewardPopup(

    rewardData = {}

) {

    const mission =

        rewardData.mission ||

        {};

    const reward =

        rewardData.reward ||

        {};

    const popup =

        document.createElement(

            "div"

        );

    popup.className =

        "reward-popup";

    popup.innerHTML = `

        <h2>

            🎉 Mission Completed

        </h2>

        <p>

            ${escapeHTML(

                mission.subtitle ||

                mission.title ||

                "Mission"

            )}

        </p>

        <p>

            +${Number(

                reward.xp

            ) || 0} XP

        </p>

        <p>

            +${Number(

                reward.coins

            ) || 0} Coins

        </p>

        <p>

            +${Number(

                reward.gems

            ) || 0} Gems

        </p>

        <button

            type="button"

        >

            Continue

        </button>

    `;

    document.body.appendChild(

        popup

    );

    window.requestAnimationFrame(

        () => {

            popup.classList.add(

                "show"

            );

        }

    );

    const button =

        popup.querySelector(

            "button"

        );

    if (button) {

        button.addEventListener(

            "click",

            () => {

                removeElement(

                    popup

                );

            }

        );

    }

    return popup;

}


// ======================================================
// ACHIEVEMENT POPUP
// ======================================================

function showAchievementPopup(

    achievement

) {

    if (!achievement) {

        return null;

    }

    return showModal({

        title:
            "Achievement Unlocked",

        message:
            `${achievement.title} — ${achievement.description}`,

        icon:
            achievement.icon ||

            "🏆",

        confirmText:
            "Continue"

    });

}


// ======================================================
// PROGRESS ANIMATION
// ======================================================

function animateProgress(

    progressElement,

    targetValue,

    duration = 700

) {

    if (!progressElement) {

        return;

    }

    const startValue =

        Number(

            progressElement.value

        ) || 0;

    const target =

        Math.max(

            0,

            Math.min(

                100,

                Number(

                    targetValue

                ) || 0

            )

        );

    const startTime =

        performance.now();

    function update(

        currentTime

    ) {

        const elapsed =

            currentTime -

            startTime;

        const progress =

            Math.min(

                1,

                elapsed /

                duration

            );

        progressElement.value =

            Math.round(

                startValue +

                (

                    target -

                    startValue

                ) *

                progress

            );

        if (

            progress < 1

        ) {

            window.requestAnimationFrame(

                update

            );

        }

    }

    window.requestAnimationFrame(

        update

    );

}


// ======================================================
// BUTTON LOCK
// ======================================================

function setButtonState(

    button,

    enabled,

    enabledText,

    disabledText

) {

    if (!button) {

        return;

    }

    button.disabled =

        !enabled;

    if (enabled) {

        if (enabledText) {

            button.textContent =

                enabledText;

        }

    }

    else if (disabledText) {

        button.textContent =

            disabledText;

    }

}


// ======================================================
// GLOBAL UI API
// ======================================================

window.SERVER_HERO_UI = {

    version:
        "4.0",

    toast:
        showToast,

    modal:
        showModal,

    confirm:
        confirmAction,

    closeModal:
        closeModal,

    showLoading:
        showLoading,

    hideLoading:
        hideLoading,

    showReward:
        showRewardPopup,

    showAchievement:
        showAchievementPopup,

    animateProgress:
        animateProgress,

    setButtonState:
        setButtonState,

    escapeHTML:
        escapeHTML

};


// ======================================================
// EVENT LISTENERS
// ======================================================

window.addEventListener(

    "serverhero:mission-completed",

    event => {

        showRewardPopup(

            event.detail

        );

    }

);


window.addEventListener(

    "serverhero:achievement-unlocked",

    event => {

        showAchievementPopup(

            event.detail

                .achievement

        );

    }

);


window.addEventListener(

    "serverhero:missions-reset",

    () => {

        showToast(

            "Mission progress has been reset.",

            "info"

        );

    }

);


// ======================================================
// INITIALIZATION
// ======================================================

console.log(

    "======================================"

);

console.log(

    "SERVER HERO PREMIUM V4.0"

);

console.log(

    "UI ENGINE READY"

);

console.log(

    "======================================"

);

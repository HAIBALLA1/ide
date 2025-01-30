function applyMinimalStyleMode() {
    applyDefaultStyleMode();

    document.querySelectorAll(".judge0-hidden-for-minimal-style").forEach(e => {
        e.classList.add("judge0-hidden");
    });
    document.getElementById("run-btn").classList.remove("judge0-run-btn");
}

function reverseMinimalStyleMode() {
    document.querySelectorAll(".judge0-hidden-for-minimal-style").forEach(e => {
        e.classList.remove("judge0-hidden");
    });
    document.getElementById("run-btn").classList.add("judge0-run-btn");
}

function applyDefaultStyleMode() {
    reverseMinimalStyleMode();
}

function applyStyleMode(styleMode) {
    if (styleMode === "minimal") {
        applyMinimalStyleMode();
    } else {
        applyDefaultStyleMode();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const styleMode = getQueryVariable("style");
    const supportedStyleModes = ["default", "minimal"];
    const defaultStyleMode = "default";
    applyStyleMode(supportedStyleModes.includes(styleMode) ? styleMode : defaultStyleMode);
});

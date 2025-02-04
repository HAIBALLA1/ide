const SUPPORTED_STYLE_MODES = ["default", "minimal", "standalone"];
const DEFAULT_STYLE_MODE = "default";

function applyStyleMode(styleMode) {
    applyDefaultStyleMode();

    document.querySelectorAll(`.judge0-hidden-for-${styleMode}-style`).forEach(e => {
        e.classList.add("judge0-hidden");
    });
}

function reverseStyleMode(styleMode) {
    document.querySelectorAll(`.judge0-hidden-for-${styleMode}-style`).forEach(e => {
        e.classList.remove("judge0-hidden");
    });
}

function applyDefaultStyleMode() {
    SUPPORTED_STYLE_MODES.forEach(s => reverseStyleMode(s));
}

document.addEventListener("DOMContentLoaded", function () {
    const styleMode = getQueryVariable("style");
    applyStyleMode(SUPPORTED_STYLE_MODES.includes(styleMode) ? styleMode : DEFAULT_STYLE_MODE);
});

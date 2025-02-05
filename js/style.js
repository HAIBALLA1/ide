import { IS_ELECTRON } from "./electron.js";
import { IS_PUTER } from "./puter.js";
import { getQueryVariable } from "./query.js";

const SUPPORTED_STYLE_MODES = ["default", "minimal", "standalone", "electron", "puter"];
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
    if (IS_ELECTRON) {
        applyStyleMode("electron");
    } else if (IS_PUTER) {
        applyStyleMode("puter");
    } else {
        applyStyleMode(SUPPORTED_STYLE_MODES.includes(styleMode) ? styleMode : DEFAULT_STYLE_MODE);
    }
});

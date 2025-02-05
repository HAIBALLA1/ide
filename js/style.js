import { IS_ELECTRON } from "./electron.js";
import { IS_PUTER } from "./puter.js";
import query from "./query.js";

const SUPPORTED_STYLE_MODES = ["default", "minimal", "standalone", "electron"];
const DEFAULT_STYLE_MODE = "default";

function applyStyleMode(styleMode) {
    applyDefaultStyleMode();

    document.querySelectorAll(`.judge0-${styleMode}-hidden`).forEach(e => {
        e.classList.add("judge0-hidden");
    });
}

function reverseStyleMode(styleMode) {
    document.querySelectorAll(`.judge0-${styleMode}-hidden`).forEach(e => {
        e.classList.remove("judge0-hidden");
    });
}

function applyDefaultStyleMode() {
    SUPPORTED_STYLE_MODES.forEach(s => reverseStyleMode(s));
}

document.addEventListener("DOMContentLoaded", function () {
    const styleMode = query.get("style");
    if (IS_ELECTRON) {
        applyStyleMode("electron");
    } else if (IS_PUTER) {
        applyStyleMode("standalone");
    } else {
        applyStyleMode(SUPPORTED_STYLE_MODES.includes(styleMode) ? styleMode : DEFAULT_STYLE_MODE);
    }
});

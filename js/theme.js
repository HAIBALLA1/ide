"use strict";

import query from "./query.js";
import ls from "./local_storage.js";

const theme = {
    SUPPORTED_THEMES: ["light", "dark", "system", "reverse-system"],
    DEFAULT_THEME: "system",
    set(name, save = false) {
        const resolvedTheme = name === "system" ? theme.getSystemTheme() : (name === "reverse-system" ? theme.getReverseSystemTheme() : name);
        const isLight = resolvedTheme === "light";

        document.body.style.background = `url("./images/logo_${isLight ? "white" : "black"}.svg") center center / 33% no-repeat ${isLight ? "#e0e1e2" : "#1b1c1d"} `;

        document.getElementById("judge0-golden-layout-dark-theme-stylesheet").disabled = isLight;
        document.getElementById("judge0-golden-layout-light-theme-stylesheet").disabled = !isLight;

        monaco.editor.setTheme(isLight ? "vs-light" : "vs-dark");

        [".ui.menu", ".ui.input"].forEach(s => document.querySelectorAll(s).forEach(e => {
            if (isLight) {
                e.classList.remove("inverted");
            } else {
                e.classList.add("inverted");
            }
        }));

        document.querySelectorAll(".label").forEach(e => {
            if (isLight) {
                e.classList.remove("black");
            } else {
                e.classList.add("black");
            }
        });

        document.getElementById("judge0-theme-toggle-btn").setAttribute("data-content", `Switch between dark, light, and system theme (currently ${name} theme)`);
        const themeToggleBtnIcon = document.getElementById("judge0-theme-toggle-btn-icon");
        if (name === "dark") {
            themeToggleBtnIcon.classList = "moon icon";
        } else if (name === "light") {
            themeToggleBtnIcon.classList = "sun icon";
        } else {
            themeToggleBtnIcon.classList = "adjust icon";
        }

        document.querySelectorAll("[data-content]").forEach(e => {
            if (isLight) {
                e.setAttribute("data-variation", "very wide");
            } else {
                e.setAttribute("data-variation", "inverted very wide");
            }
        });

        document.head.querySelectorAll("meta[name='theme-color'], meta[name='msapplication-TileColor']").forEach(e => {
            e.setAttribute("content", isLight ? "#ffffff" : "#1b1c1d");
        });

        if (save) {
            ls.set("JUDGE0_THEME_MODE", name);
        }
    },
    get() {
        return ls.get("JUDGE0_THEME_MODE") || "system";
    },
    toggle() {
        const current = theme.get();
        if (current === "system") {
            if (theme.getSystemTheme() === "dark") {
                theme.set("light", true);
            } else {
                theme.set("dark", true);
            }
        } else if (current === "reverse-system") {
            if (theme.getReverseSystemTheme() === "dark") {
                theme.set("light", true);
            } else {
                theme.set("dark", true);
            }
        } else if (current === "dark") {
            if (theme.getSystemTheme() === "dark") {
                theme.set("system", true);
            } else {
                theme.set("light", true);
            }
        } else if (current === "light") {
            if (theme.getSystemTheme() === "light") {
                theme.set("system", true);
            } else {
                theme.set("dark", true);
            }
        }
    },
    getSystemTheme() {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    },
    getReverseSystemTheme() {
        return theme.getSystemTheme() === "dark" ? "light" : "dark";
    }
};

export default theme;

document.addEventListener("DOMContentLoaded", function () {
    require(["vs/editor/editor.main"], function () {
        const desiredTheme = query.get("theme");
        theme.set(theme.SUPPORTED_THEMES.includes(desiredTheme) ? desiredTheme : theme.get(), true);
    });
});

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (theme.get() === "system") {
        theme.set("system");
    } else if (theme.get() === "reverse-system") {
        theme.set("reverse-system");
    }
});

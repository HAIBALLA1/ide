function setThemeProperties(isLightMode) {
    document.body.style.background = `url("./images/logo_${isLightMode ? "white" : "black"}.svg") center center / 33% no-repeat ${isLightMode ? "#e0e1e2" : "#1b1c1d"} `;

    document.getElementById("judge0-golden-layout-dark-theme-stylesheet").disabled = isLightMode;
    document.getElementById("judge0-golden-layout-light-theme-stylesheet").disabled = !isLightMode;

    document.getElementById("site-logo-black").style.display = isLightMode ? "block" : "none";
    document.getElementById("site-logo-white").style.display = isLightMode ? "none" : "block";

    monaco.editor.setTheme(isLightMode ? "vs-light" : "vs-dark");
    document.querySelectorAll(".ui.menu").forEach(menu => {
        if (isLightMode) {
            menu.classList.remove("inverted");
        } else {
            menu.classList.add("inverted");
        }
    });

    document.getElementById("judge0-theme-toggle-btn").setAttribute("data-tooltip", `Switch between dark and light mode (currently ${isLightMode ? "light" : "dark"} mode)`);
    const themeToggleBtnIcon = document.getElementById("judge0-theme-toggle-btn-icon");
    if (isLightMode) {
        themeToggleBtnIcon.classList.remove("sun");
        themeToggleBtnIcon.classList.add("moon");
    } else {
        themeToggleBtnIcon.classList.remove("moon");
        themeToggleBtnIcon.classList.add("sun");
    }

    document.querySelectorAll("[data-tooltip]").forEach(e => {
        if (isLightMode) {
            e.setAttribute("data-inverted", "");
        } else {
            e.removeAttribute("data-inverted");
        }
    });
}

function setLightMode(saveToLocalStorage = false) {
    setThemeProperties(true);
    if (saveToLocalStorage) {
        localStorageSetItem("JUDGE0_THEME_MODE", "light");
    }
}

function setDarkMode(saveToLocalStorage = false) {
    setThemeProperties(false);
    if (saveToLocalStorage) {
        localStorageSetItem("JUDGE0_THEME_MODE", "dark");
    }
}

function getThemeMode() {
    return localStorageGetItem("JUDGE0_THEME_MODE") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}

function toggleThemeMode() {
    if (getThemeMode() === "dark") {
        setLightMode(true);
    } else {
        setDarkMode(true);
    }
}

function setThemeMode(themeMode) {
    if (themeMode === "light") {
        setLightMode();
    } else {
        setDarkMode();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    require(["vs/editor/editor.main"], function (ignorable) {
        setThemeMode(getThemeMode());
    });
});

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (e.matches) {
        setDarkMode();
    } else {
        setLightMode();
    }
});

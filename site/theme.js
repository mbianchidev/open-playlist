(() => {
  "use strict";

  const storageKey = "open-playlist-theme";

  function readSavedTheme() {
    try {
      return window.localStorage.getItem(storageKey);
    } catch (error) {
      console.warn("Unable to read the saved theme preference.", error);
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch (error) {
      console.warn("Unable to save the theme preference.", error);
    }
  }

  function currentTheme() {
    return document.documentElement.dataset.theme === "light" ? "light" : "dark";
  }

  function updateThemeControls() {
    const nextTheme = currentTheme() === "dark" ? "light" : "dark";
    const actionLabel = `Switch to ${nextTheme} mode`;

    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.setAttribute("aria-label", actionLabel);
      button.setAttribute("title", actionLabel);

      const label = button.querySelector("[data-theme-toggle-label]");
      if (label) {
        label.textContent = `${nextTheme[0].toUpperCase()}${nextTheme.slice(1)} mode`;
      }
    });
  }

  function applyTheme(theme, persist = true) {
    const selectedTheme = theme === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = selectedTheme;

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.content = selectedTheme === "dark" ? "#0b1120" : "#ffffff";
    }

    if (persist) {
      saveTheme(selectedTheme);
    }

    updateThemeControls();
    document.dispatchEvent(new CustomEvent("themechange", { detail: { theme: selectedTheme } }));
  }

  const initialTheme = readSavedTheme() === "light" ? "light" : "dark";
  applyTheme(initialTheme, false);

  function initializeThemeControls() {
    updateThemeControls();

    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        applyTheme(currentTheme() === "dark" ? "light" : "dark");
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeThemeControls, { once: true });
  } else {
    initializeThemeControls();
  }

  window.OpenPlaylistTheme = {
    current: currentTheme,
    set: applyTheme
  };
})();

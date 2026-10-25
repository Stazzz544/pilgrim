export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "pilgrim-theme";

// Выполняется в <head> до отрисовки, иначе тёмная тема мигнёт светлой.
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=d?"dark":"light";}catch(e){}})();`;

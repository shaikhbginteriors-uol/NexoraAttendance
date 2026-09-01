import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Apply theme before render to prevent flash of wrong theme
(() => {
  try {
    const stored = localStorage.getItem("nexora-theme");
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
    if (stored === "dark" || (!stored && prefersDark)) {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    }
  } catch {}
})();

createRoot(document.getElementById("root")!).render(<App />);

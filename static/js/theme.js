const toggleBtn = document.getElementById("themeToggle");

if (toggleBtn) {
    // Load saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        toggleBtn.textContent = "🌙";
    }

    toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark");

        const isDark = document.body.classList.contains("dark");
        toggleBtn.textContent = isDark ? "🌙" : "☀️";
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
}

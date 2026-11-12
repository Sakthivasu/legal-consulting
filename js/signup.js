/* Frontend-only demo signup: accepts any values without saving them. */
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");
  const currentYear = document.getElementById("current-year");
  const passwordToggles = document.querySelectorAll('.signup-page .password-toggle[data-password-target]');

  if (currentYear) currentYear.textContent = new Date().getFullYear();
  window.lucide?.createIcons?.();

  passwordToggles.forEach((toggle) => toggle.addEventListener("click", () => {
    const input = document.getElementById(toggle.dataset.passwordTarget);
    if (!input) return;
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    toggle.innerHTML = show ? '<i data-lucide="eye-off"></i>' : '<i data-lucide="eye"></i>';
    toggle.setAttribute("aria-label", show ? "Hide password" : "Show password");
    toggle.setAttribute("aria-pressed", String(show));
    window.lucide?.createIcons?.();
  }));

  signupForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    window.location.href = "login.html";
  });
  passwordToggles.forEach((toggle) => toggle.setAttribute("aria-pressed", "false"));
});

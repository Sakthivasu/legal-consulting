/* Frontend-only demo login: accepts any values and routes by selected role. */
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const password = document.getElementById("login-password");
  const passwordToggle = document.getElementById("login-password-toggle");
  const accountTypeOptions = document.querySelectorAll('.auth-account-option input[name="account-type"]');
  const currentYear = document.getElementById("current-year");
  const forgotTrigger = document.getElementById("forgot-password-trigger");
  const forgotPanel = document.getElementById("forgot-password-panel");
  const forgotBack = document.getElementById("forgot-password-back");

  const initializeIcons = () => window.lucide?.createIcons?.();
  initializeIcons();
  if (currentYear) currentYear.textContent = new Date().getFullYear();

  accountTypeOptions.forEach((option) => option.addEventListener("change", () => {
    accountTypeOptions.forEach((radio) => radio.closest(".auth-account-option")?.classList.toggle("active", radio.checked));
  }));

  passwordToggle?.addEventListener("click", () => {
    if (!password) return;
    const show = password.type === "password";
    password.type = show ? "text" : "password";
    passwordToggle.innerHTML = show ? '<i data-lucide="eye-off"></i>' : '<i data-lucide="eye"></i>';
    passwordToggle.setAttribute("aria-label", show ? "Hide password" : "Show password");
    passwordToggle.setAttribute("aria-pressed", String(show));
    initializeIcons();
  });

  loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const role = document.querySelector('input[name="account-type"]:checked')?.value?.toLowerCase() || "client";
    window.location.href = ["agent", "agency"].includes(role) ? "agency-dashboard.html" : "client-dashboard.html";
  });

  const toggleForgotPanel = (open) => {
    if (!forgotPanel) return;
    forgotPanel.hidden = !open;
    if (loginForm) loginForm.hidden = open;
    document.querySelector(".auth-account-type")?.toggleAttribute("hidden", open);
    document.querySelector(".auth-heading")?.toggleAttribute("hidden", open);
    document.querySelector(".auth-security-note")?.toggleAttribute("hidden", open);
  };
  forgotTrigger?.addEventListener("click", () => toggleForgotPanel(true));
  forgotBack?.addEventListener("click", () => toggleForgotPanel(false));
  document.getElementById("forgot-password-form")?.addEventListener("submit", (event) => event.preventDefault());
  if (forgotPanel) forgotPanel.hidden = true;
  passwordToggle?.setAttribute("aria-pressed", "false");
});

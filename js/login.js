
/* =========================================================
   LEXORA LEGAL & ADVISORY
   LOGIN PAGE JAVASCRIPT
   File: js/login.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =========================================
       1. ELEMENT REFERENCES
    ========================================= */

    const loginForm = document.getElementById("login-form");
    const loginEmail = document.getElementById("login-email");
    const loginPassword = document.getElementById("login-password");

    const loginEmailError = document.getElementById("login-email-error");
    const loginPasswordError = document.getElementById("login-password-error");

    const loginStatus = document.getElementById("login-form-status");

    const passwordToggle = document.getElementById("login-password-toggle");

    const forgotTrigger = document.getElementById("forgot-password-trigger");
    const forgotPanel = document.getElementById("forgot-password-panel");
    const forgotForm = document.getElementById("forgot-password-form");
    const forgotEmail = document.getElementById("forgot-email");
    const forgotEmailError = document.getElementById("forgot-email-error");
    const forgotStatus = document.getElementById("forgot-password-status");
    const forgotBackButton = document.getElementById("forgot-password-back");

    const accountTypeOptions = document.querySelectorAll(
        '.auth-account-option input[name="account-type"]'
    );

    const accountTypeContainer = document.querySelector(".auth-account-type");
    const authHeading = document.querySelector(".auth-heading");
    const authSecurityNote = document.querySelector(".auth-security-note");
    const currentYear = document.getElementById("current-year");


    /* =========================================
       2. LUCIDE ICON INITIALIZATION
    ========================================= */

    function initializeIcons() {
        if (window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons();
        }
    }

    initializeIcons();


    /* =========================================
       3. CURRENT YEAR
    ========================================= */

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =========================================
       4. EMAIL VALIDATION
    ========================================= */

    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return emailPattern.test(email);
    }


    /* =========================================
       5. STATUS MESSAGE HANDLER
    ========================================= */

    function showStatus(element, message, type = "info") {
        if (!element) return;

        element.textContent = message;
        element.className = `${element.id === "login-form-status"
            ? "auth-form-status"
            : "forgot-password-status"} ${type}`;
    }

    function clearStatus(element) {
        if (!element) return;

        element.textContent = "";
        element.className =
            element.id === "login-form-status"
                ? "auth-form-status"
                : "forgot-password-status";
    }


    /* =========================================
       6. FIELD ERROR HANDLER
    ========================================= */

    function showFieldError(element, message) {
        if (!element) return;

        element.textContent = message;
    }

    function clearFieldError(element) {
        if (!element) return;

        element.textContent = "";
    }


    /* =========================================
       7. ACCOUNT TYPE SELECTION
    ========================================= */

    accountTypeOptions.forEach((option) => {
        option.addEventListener("change", () => {
            accountTypeOptions.forEach((radio) => {
                const parent = radio.closest(".auth-account-option");

                if (parent) {
                    parent.classList.toggle("active", radio.checked);
                }
            });

            clearStatus(loginStatus);
        });
    });


    /* =========================================
       8. PASSWORD SHOW / HIDE
    ========================================= */

    if (passwordToggle && loginPassword) {
        passwordToggle.addEventListener("click", () => {
            const isPassword = loginPassword.type === "password";

            loginPassword.type = isPassword ? "text" : "password";

            passwordToggle.innerHTML = isPassword
                ? '<i data-lucide="eye-off"></i>'
                : '<i data-lucide="eye"></i>';

            passwordToggle.setAttribute(
                "aria-label",
                isPassword ? "Hide password" : "Show password"
            );

            passwordToggle.setAttribute(
                "aria-pressed",
                String(isPassword)
            );

            initializeIcons();
        });
    }


    /* =========================================
       9. LOGIN INPUT LIVE VALIDATION
    ========================================= */

    if (loginEmail) {
        loginEmail.addEventListener("input", () => {
            clearFieldError(loginEmailError);
            clearStatus(loginStatus);
        });

        loginEmail.addEventListener("blur", () => {
            const email = loginEmail.value.trim();

            if (email && !isValidEmail(email)) {
                showFieldError(
                    loginEmailError,
                    "Please enter a valid email address."
                );
            }
        });
    }

    if (loginPassword) {
        loginPassword.addEventListener("input", () => {
            clearFieldError(loginPasswordError);
            clearStatus(loginStatus);
        });
    }


    /* =========================================
       10. LOGIN FORM VALIDATION
    ========================================= */

    function validateLoginForm() {
        let isValid = true;

        const email = loginEmail ? loginEmail.value.trim() : "";
        const password = loginPassword ? loginPassword.value : "";

        clearFieldError(loginEmailError);
        clearFieldError(loginPasswordError);

        if (!email) {
            showFieldError(
                loginEmailError,
                "Email address is required."
            );

            isValid = false;
        } else if (!isValidEmail(email)) {
            showFieldError(
                loginEmailError,
                "Please enter a valid email address."
            );

            isValid = false;
        }

        if (!password.trim()) {
            showFieldError(
                loginPasswordError,
                "Password is required."
            );

            isValid = false;
        } else if (password.length < 8) {
            showFieldError(
                loginPasswordError,
                "Password must contain at least 8 characters."
            );

            isValid = false;
        }

        return isValid;
    }


    /* =========================================
       11. LOGIN FORM SUBMISSION
    ========================================= */

    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();

            clearStatus(loginStatus);

            if (!validateLoginForm()) {
                showStatus(
                    loginStatus,
                    "Please correct the highlighted fields and try again.",
                    "error"
                );

                return;
            }

            const selectedAccount = document.querySelector(
                'input[name="account-type"]:checked'
            );

            const accountType = selectedAccount
                ? selectedAccount.value
                : "client";

            /*
              Frontend validation only.

              Connect your real authentication API here
              before enabling actual login functionality.
              Do not store passwords in localStorage.
            */

            showStatus(
                loginStatus,
                `Your details passed validation for the ${accountType} account. Connect the authentication backend to sign in.`,
                "info"
            );
        });
    }


    /* =========================================
       12. OPEN FORGOT PASSWORD PANEL
    ========================================= */

    function openForgotPassword() {
        if (!forgotPanel) return;

        if (loginForm) {
            loginForm.hidden = true;
        }

        if (accountTypeContainer) {
            accountTypeContainer.hidden = true;
        }

        if (authHeading) {
            authHeading.hidden = true;
        }

        if (authSecurityNote) {
            authSecurityNote.hidden = true;
        }

        forgotPanel.hidden = false;

        clearStatus(loginStatus);
        clearStatus(forgotStatus);
        clearFieldError(forgotEmailError);

        if (forgotEmail) {
            forgotEmail.value = loginEmail
                ? loginEmail.value.trim()
                : "";

            forgotEmail.focus();
        }
    }

    if (forgotTrigger) {
        forgotTrigger.addEventListener("click", openForgotPassword);
    }


    /* =========================================
       13. CLOSE FORGOT PASSWORD PANEL
    ========================================= */

    function closeForgotPassword() {
        if (forgotPanel) {
            forgotPanel.hidden = true;
        }

        if (loginForm) {
            loginForm.hidden = false;
        }

        if (accountTypeContainer) {
            accountTypeContainer.hidden = false;
        }

        if (authHeading) {
            authHeading.hidden = false;
        }

        if (authSecurityNote) {
            authSecurityNote.hidden = false;
        }

        clearStatus(forgotStatus);
        clearFieldError(forgotEmailError);

        if (loginEmail) {
            loginEmail.focus();
        }
    }

    if (forgotBackButton) {
        forgotBackButton.addEventListener(
            "click",
            closeForgotPassword
        );
    }


    /* =========================================
       14. FORGOT EMAIL LIVE VALIDATION
    ========================================= */

    if (forgotEmail) {
        forgotEmail.addEventListener("input", () => {
            clearFieldError(forgotEmailError);
            clearStatus(forgotStatus);
        });

        forgotEmail.addEventListener("blur", () => {
            const email = forgotEmail.value.trim();

            if (email && !isValidEmail(email)) {
                showFieldError(
                    forgotEmailError,
                    "Please enter a valid email address."
                );
            }
        });
    }


    /* =========================================
       15. FORGOT PASSWORD FORM SUBMISSION
    ========================================= */

    if (forgotForm) {
        forgotForm.addEventListener("submit", (event) => {
            event.preventDefault();

            clearFieldError(forgotEmailError);
            clearStatus(forgotStatus);

            const email = forgotEmail
                ? forgotEmail.value.trim()
                : "";

            if (!email) {
                showFieldError(
                    forgotEmailError,
                    "Please enter your registered email address."
                );

                return;
            }

            if (!isValidEmail(email)) {
                showFieldError(
                    forgotEmailError,
                    "Please enter a valid email address."
                );

                return;
            }

            /*
              Password reset is not sent from this frontend.

              Connect a secure password-reset API to send
              a real reset email.
            */

            showStatus(
                forgotStatus,
                "Email validation completed. Connect the password-reset backend to send a reset link.",
                "info"
            );
        });
    }


    /* =========================================
       16. RESET FORM ERRORS ON PAGE LOAD
    ========================================= */

    clearFieldError(loginEmailError);
    clearFieldError(loginPasswordError);
    clearFieldError(forgotEmailError);

    clearStatus(loginStatus);
    clearStatus(forgotStatus);


    /* =========================================
       17. ACCESSIBILITY
    ========================================= */

    if (passwordToggle) {
        passwordToggle.setAttribute("aria-pressed", "false");
    }

    if (forgotPanel) {
        forgotPanel.hidden = true;
    }

});

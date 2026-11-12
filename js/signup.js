
/* =========================================================
   LEXORA LEGAL & ADVISORY
   SIGNUP PAGE JAVASCRIPT
   File: js/signup.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";


    /* =========================================
       1. ELEMENT REFERENCES
    ========================================= */

    const signupForm = document.getElementById("signup-form");

    const firstName = document.getElementById("signup-first-name");
    const lastName = document.getElementById("signup-last-name");
    const email = document.getElementById("signup-email");
    const phone = document.getElementById("signup-phone");

    const companyGroup = document.getElementById("signup-company-group");
    const company = document.getElementById("signup-company");

    const password = document.getElementById("signup-password");
    const confirmPassword = document.getElementById("signup-confirm-password");

    const terms = document.getElementById("signup-terms");

    const submitButton = document.getElementById("signup-submit-btn");
    const formStatus = document.getElementById("signup-form-status");

    const accountTypeOptions = document.querySelectorAll(
        'input[name="signup-account-type"]'
    );

    const currentYear = document.getElementById("current-year");


    /* =========================================
       2. ERROR ELEMENT REFERENCES
    ========================================= */

    const errors = {
        firstName: document.getElementById("signup-first-name-error"),
        lastName: document.getElementById("signup-last-name-error"),
        email: document.getElementById("signup-email-error"),
        phone: document.getElementById("signup-phone-error"),
        company: document.getElementById("signup-company-error"),
        password: document.getElementById("signup-password-error"),
        confirmPassword: document.getElementById("signup-confirm-password-error"),
        terms: document.getElementById("signup-terms-error")
    };


    /* =========================================
       3. LUCIDE ICON INITIALIZATION
    ========================================= */

    function initializeIcons() {
        if (
            window.lucide &&
            typeof window.lucide.createIcons === "function"
        ) {
            window.lucide.createIcons();
        }
    }

    initializeIcons();


    /* =========================================
       4. CURRENT YEAR
    ========================================= */

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =========================================
       5. STATUS MESSAGE HANDLER
    ========================================= */

    function showStatus(message, type = "info") {
        if (!formStatus) return;

        formStatus.textContent = message;
        formStatus.className = `auth-form-status ${type}`;
    }

    function clearStatus() {
        if (!formStatus) return;

        formStatus.textContent = "";
        formStatus.className = "auth-form-status";
    }


    /* =========================================
       6. FIELD ERROR HANDLER
    ========================================= */

    function showError(field, message) {
        const errorElement = errors[field];

        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    function clearError(field) {
        const errorElement = errors[field];

        if (errorElement) {
            errorElement.textContent = "";
        }
    }

    function clearAllErrors() {
        Object.keys(errors).forEach((field) => {
            clearError(field);
        });
    }


    /* =========================================
       7. VALIDATION HELPERS
    ========================================= */

    function isValidEmail(value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return emailPattern.test(value);
    }

    function isValidName(value) {
        return /^[\p{L}][\p{L}\s.'-]*$/u.test(value);
    }

    function isValidPhone(value) {
        const cleanedPhone = value.replace(/[\s()-]/g, "");

        return /^\+?[0-9]{7,15}$/.test(cleanedPhone);
    }

    function hasStrongPassword(value) {
        const hasMinimumLength = value.length >= 8;
        const hasLetter = /[A-Za-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);

        return hasMinimumLength && hasLetter && hasNumber;
    }


    /* =========================================
       8. GET SELECTED ACCOUNT TYPE
    ========================================= */

    function getAccountType() {
        const selectedAccount = document.querySelector(
            'input[name="signup-account-type"]:checked'
        );

        return selectedAccount
            ? selectedAccount.value
            : "customer";
    }


    /* =========================================
       9. ACCOUNT TYPE SELECTION
    ========================================= */

    function updateAccountType() {
        const accountType = getAccountType();

        accountTypeOptions.forEach((option) => {
            const parent = option.closest(".auth-account-option");

            if (parent) {
                parent.classList.toggle("active", option.checked);
            }
        });

        const isAgency = accountType === "agency";

        if (companyGroup) {
            companyGroup.hidden = !isAgency;
        }

        if (company) {
            company.required = isAgency;

            if (!isAgency) {
                company.value = "";
                clearError("company");
            }
        }

        clearStatus();
    }

    accountTypeOptions.forEach((option) => {
        option.addEventListener("change", updateAccountType);
    });

    // Set initial account type state.
    updateAccountType();


    /* =========================================
       10. PASSWORD SHOW / HIDE
    ========================================= */

    const passwordToggles = document.querySelectorAll(
        '.signup-page .password-toggle[data-password-target]'
    );

    passwordToggles.forEach((toggle) => {
        toggle.addEventListener("click", () => {
            const targetId = toggle.dataset.passwordTarget;
            const targetInput = document.getElementById(targetId);

            if (!targetInput) return;

            const isPassword = targetInput.type === "password";

            targetInput.type = isPassword ? "text" : "password";

            toggle.innerHTML = isPassword
                ? '<i data-lucide="eye-off"></i>'
                : '<i data-lucide="eye"></i>';

            toggle.setAttribute(
                "aria-label",
                isPassword ? "Hide password" : "Show password"
            );

            toggle.setAttribute(
                "aria-pressed",
                String(isPassword)
            );

            initializeIcons();
        });
    });


    /* =========================================
       11. FIRST NAME VALIDATION
    ========================================= */

    function validateFirstName() {
        if (!firstName) return false;

        const value = firstName.value.trim();

        if (!value) {
            showError("firstName", "First name is required.");
            return false;
        }

        if (value.length < 2) {
            showError("firstName", "First name must contain at least 2 characters.");
            return false;
        }

        if (!isValidName(value)) {
            showError("firstName", "Please enter a valid first name.");
            return false;
        }

        clearError("firstName");
        return true;
    }


    /* =========================================
       12. LAST NAME VALIDATION
    ========================================= */

    function validateLastName() {
        if (!lastName) return false;

        const value = lastName.value.trim();

        if (!value) {
            showError("lastName", "Last name is required.");
            return false;
        }

        if (value.length < 2) {
            showError("lastName", "Last name must contain at least 2 characters.");
            return false;
        }

        if (!isValidName(value)) {
            showError("lastName", "Please enter a valid last name.");
            return false;
        }

        clearError("lastName");
        return true;
    }


    /* =========================================
       13. EMAIL VALIDATION
    ========================================= */

    function validateEmail() {
        if (!email) return false;

        const value = email.value.trim();

        if (!value) {
            showError("email", "Email address is required.");
            return false;
        }

        if (!isValidEmail(value)) {
            showError("email", "Please enter a valid email address.");
            return false;
        }

        clearError("email");
        return true;
    }


    /* =========================================
       14. PHONE VALIDATION
    ========================================= */

    function validatePhone() {
        if (!phone) return false;

        const value = phone.value.trim();

        if (!value) {
            showError("phone", "Phone number is required.");
            return false;
        }

        if (!isValidPhone(value)) {
            showError(
                "phone",
                "Enter a valid phone number with 7 to 15 digits."
            );

            return false;
        }

        clearError("phone");
        return true;
    }


    /* =========================================
       15. COMPANY VALIDATION
    ========================================= */

    function validateCompany() {
        if (getAccountType() !== "agency") {
            clearError("company");
            return true;
        }

        if (!company) return false;

        const value = company.value.trim();

        if (!value) {
            showError(
                "company",
                "Company or organisation name is required."
            );

            return false;
        }

        if (value.length < 2) {
            showError(
                "company",
                "Please enter a valid company name."
            );

            return false;
        }

        clearError("company");
        return true;
    }


    /* =========================================
       16. PASSWORD VALIDATION
    ========================================= */

    function validatePassword() {
        if (!password) return false;

        const value = password.value;

        if (!value) {
            showError("password", "Password is required.");
            return false;
        }

        if (value.length < 8) {
            showError(
                "password",
                "Password must contain at least 8 characters."
            );

            return false;
        }

        if (!/[A-Za-z]/.test(value)) {
            showError(
                "password",
                "Password must contain at least one letter."
            );

            return false;
        }

        if (!/[0-9]/.test(value)) {
            showError(
                "password",
                "Password must contain at least one number."
            );

            return false;
        }

        clearError("password");
        return true;
    }


    /* =========================================
       17. CONFIRM PASSWORD VALIDATION
    ========================================= */

    function validateConfirmPassword() {
        if (!confirmPassword || !password) return false;

        const confirmValue = confirmPassword.value;

        if (!confirmValue) {
            showError(
                "confirmPassword",
                "Please confirm your password."
            );

            return false;
        }

        if (confirmValue !== password.value) {
            showError(
                "confirmPassword",
                "Passwords do not match."
            );

            return false;
        }

        clearError("confirmPassword");
        return true;
    }


    /* =========================================
       18. TERMS VALIDATION
    ========================================= */

    function validateTerms() {
        if (!terms) return false;

        if (!terms.checked) {
            showError(
                "terms",
                "Please accept the Terms of Service and Privacy Policy."
            );

            return false;
        }

        clearError("terms");
        return true;
    }


    /* =========================================
       19. COMPLETE FORM VALIDATION
    ========================================= */

    function validateSignupForm() {
        const results = [
            validateFirstName(),
            validateLastName(),
            validateEmail(),
            validatePhone(),
            validateCompany(),
            validatePassword(),
            validateConfirmPassword(),
            validateTerms()
        ];

        return results.every(Boolean);
    }


    /* =========================================
       20. LIVE FIELD VALIDATION
    ========================================= */

    const liveValidationFields = [
        [firstName, "firstName", validateFirstName],
        [lastName, "lastName", validateLastName],
        [email, "email", validateEmail],
        [phone, "phone", validatePhone],
        [company, "company", validateCompany],
        [password, "password", validatePassword],
        [confirmPassword, "confirmPassword", validateConfirmPassword]
    ];

    liveValidationFields.forEach(([element, field, validator]) => {
        if (!element) return;

        element.addEventListener("input", () => {
            clearError(field);
            clearStatus();

            // Validate password confirmation when password changes.
            if (element === password && confirmPassword && confirmPassword.value) {
                validateConfirmPassword();
            }
        });

        element.addEventListener("blur", () => {
            if (element.value.trim()) {
                validator();
            }
        });
    });

    if (terms) {
        terms.addEventListener("change", () => {
            clearError("terms");
            clearStatus();

            if (terms.checked) {
                validateTerms();
            }
        });
    }


    /* =========================================
       21. SIGNUP FORM SUBMISSION
    ========================================= */

    if (signupForm) {
        signupForm.addEventListener("submit", (event) => {
            event.preventDefault();

            clearStatus();

            if (!validateSignupForm()) {
                showStatus(
                    "Please review the highlighted fields and correct the errors.",
                    "error"
                );

                const firstInvalidField = signupForm.querySelector(
                    ".form-error:not(:empty)"
                );

                if (firstInvalidField) {
                    const parentGroup = firstInvalidField.closest(".form-group");

                    const input = parentGroup
                        ? parentGroup.querySelector("input")
                        : null;

                    if (input) {
                        input.focus();
                    } else if (terms && !terms.checked) {
                        terms.focus();
                    }
                }

                return;
            }

            const accountType = getAccountType();

            /*
              Frontend validation only.

              Connect your real registration API here.
              Send the registration data securely to your backend.

              Never store passwords in localStorage.
              Never treat frontend validation as account creation.
            */

            showStatus(
                `Your ${accountType === "agency" ? "Agency" : "Client"} registration details passed validation. Connect the registration backend to create your account.`,
                "info"
            );

            // No fake registration or automatic login.
        });
    }


    /* =========================================
       22. INITIAL FORM STATE
    ========================================= */

    clearAllErrors();
    clearStatus();

    passwordToggles.forEach((toggle) => {
        toggle.setAttribute("aria-pressed", "false");
    });


    /* =========================================
       23. PREVENT ACCIDENTAL EMPTY SUBMISSION
    ========================================= */

    if (submitButton) {
        submitButton.addEventListener("click", () => {
            clearStatus();
        });
    }


    /* =========================================
       24. END OF SIGNUP SCRIPT
    ========================================= */

});

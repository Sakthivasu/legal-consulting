
/* =========================================================
   LEXORA LEGAL & ADVISORY
   CONTACT PAGE - JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    /* =====================================================
       01. ELEMENT REFERENCES
    ===================================================== */

    const contactForm = document.getElementById("contact-form");

    const formStatus = document.getElementById("form-status");

    const submitButton = document.getElementById("contact-submit-btn");

    const currentYear = document.getElementById("current-year");


    /* =====================================================
       02. CURRENT YEAR
    ===================================================== */

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =====================================================
       03. LUCIDE ICON INITIALIZATION
    ===================================================== */

    function initializeIcons() {

        if (window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons();
        }

    }

    initializeIcons();


    /* =====================================================
       04. CONTACT FORM ELEMENTS
    ===================================================== */

    if (!contactForm) {
        return;
    }

    const fields = {

        name: document.getElementById("contact-name"),

        email: document.getElementById("contact-email"),

        phone: document.getElementById("contact-phone"),

        service: document.getElementById("contact-service"),

        subject: document.getElementById("contact-subject"),

        message: document.getElementById("contact-message"),

        consent: document.getElementById("contact-consent")

    };


    /* =====================================================
       05. ERROR ELEMENT REFERENCES
    ===================================================== */

    const errors = {

        name: document.getElementById("contact-name-error"),

        email: document.getElementById("contact-email-error"),

        phone: document.getElementById("contact-phone-error"),

        service: document.getElementById("contact-service-error"),

        subject: document.getElementById("contact-subject-error"),

        message: document.getElementById("contact-message-error"),

        consent: document.getElementById("contact-consent-error")

    };


    /* =====================================================
       06. SHOW FIELD ERROR
    ===================================================== */

    function showError(fieldName, message) {

        const field = fields[fieldName];
        const errorElement = errors[fieldName];

        if (!field || !errorElement) {
            return;
        }

        errorElement.textContent = message;

        field.classList.add("is-invalid");

        field.setAttribute("aria-invalid", "true");

    }


    /* =====================================================
       07. CLEAR FIELD ERROR
    ===================================================== */

    function clearError(fieldName) {

        const field = fields[fieldName];
        const errorElement = errors[fieldName];

        if (!field || !errorElement) {
            return;
        }

        errorElement.textContent = "";

        field.classList.remove("is-invalid");

        field.removeAttribute("aria-invalid");

    }


    /* =====================================================
       08. CLEAR ALL ERRORS
    ===================================================== */

    function clearAllErrors() {

        Object.keys(fields).forEach((fieldName) => {
            clearError(fieldName);
        });

        if (formStatus) {

            formStatus.textContent = "";

            formStatus.className = "form-status";

        }

    }


    /* =====================================================
       09. NAME VALIDATION
    ===================================================== */

    function validateName() {

        const field = fields.name;

        if (!field) {
            return true;
        }

        const value = field.value.trim();

        if (!value) {

            showError("name", "Please enter your full name.");

            return false;

        }

        if (value.length < 2) {

            showError("name", "Name must contain at least 2 characters.");

            return false;

        }

        if (value.length > 80) {

            showError("name", "Name cannot exceed 80 characters.");

            return false;

        }

        clearError("name");

        return true;

    }


    /* =====================================================
       10. EMAIL VALIDATION
    ===================================================== */

    function validateEmail() {

        const field = fields.email;

        if (!field) {
            return true;
        }

        const value = field.value.trim();

        if (!value) {

            showError("email", "Please enter your email address.");

            return false;

        }

        field.value = value;

        if (!field.validity.valid) {

            showError("email", "Please enter a valid email address.");

            return false;

        }

        clearError("email");

        return true;

    }


    /* =====================================================
       11. PHONE VALIDATION
    ===================================================== */

    function validatePhone() {

        const field = fields.phone;

        if (!field) {
            return true;
        }

        const value = field.value.trim();

        if (!value) {

            showError("phone", "Please enter your phone number.");

            return false;

        }

        const digits = value.replace(/\D/g, "");

        if (!/^[+\d\s().-]+$/.test(value)) {

            showError("phone", "Please enter a valid phone number.");

            return false;

        }

        if (digits.length < 7 || digits.length > 15) {

            showError(
                "phone",
                "Phone number must contain 7 to 15 digits."
            );

            return false;

        }

        clearError("phone");

        return true;

    }


    /* =====================================================
       12. SERVICE VALIDATION
    ===================================================== */

    function validateService() {

        const field = fields.service;

        if (!field) {
            return true;
        }

        if (!field.value.trim()) {

            showError("service", "Please select a service.");

            return false;

        }

        clearError("service");

        return true;

    }


    /* =====================================================
       13. SUBJECT VALIDATION
    ===================================================== */

    function validateSubject() {

        const field = fields.subject;

        if (!field) {
            return true;
        }

        const value = field.value.trim();

        if (!value) {

            showError("subject", "Please enter an enquiry subject.");

            return false;

        }

        if (value.length < 3) {

            showError(
                "subject",
                "Subject must contain at least 3 characters."
            );

            return false;

        }

        if (value.length > 120) {

            showError(
                "subject",
                "Subject cannot exceed 120 characters."
            );

            return false;

        }

        clearError("subject");

        return true;

    }


    /* =====================================================
       14. MESSAGE VALIDATION
    ===================================================== */

    function validateMessage() {

        const field = fields.message;

        if (!field) {
            return true;
        }

        const value = field.value.trim();

        if (!value) {

            showError("message", "Please enter your message.");

            return false;

        }

        if (value.length < 10) {

            showError(
                "message",
                "Message must contain at least 10 characters."
            );

            return false;

        }

        if (value.length > 3000) {

            showError(
                "message",
                "Message cannot exceed 3000 characters."
            );

            return false;

        }

        clearError("message");

        return true;

    }


    /* =====================================================
       15. CONSENT VALIDATION
    ===================================================== */

    function validateConsent() {

        const field = fields.consent;

        if (!field) {
            return true;
        }

        if (!field.checked) {

            showError(
                "consent",
                "Please accept the privacy policy before submitting."
            );

            return false;

        }

        clearError("consent");

        return true;

    }


    /* =====================================================
       16. VALIDATE COMPLETE FORM
    ===================================================== */

    function validateForm() {

        const results = [

            validateName(),

            validateEmail(),

            validatePhone(),

            validateService(),

            validateSubject(),

            validateMessage(),

            validateConsent()

        ];

        return results.every(Boolean);

    }


    /* =====================================================
       17. REAL-TIME INPUT VALIDATION
    ===================================================== */

    const validationEvents = {

        name: "input",

        email: "input",

        phone: "input",

        service: "change",

        subject: "input",

        message: "input",

        consent: "change"

    };

    const validators = {

        name: validateName,

        email: validateEmail,

        phone: validatePhone,

        service: validateService,

        subject: validateSubject,

        message: validateMessage,

        consent: validateConsent

    };

    Object.keys(fields).forEach((fieldName) => {

        const field = fields[fieldName];

        if (!field) {
            return;
        }

        field.addEventListener(
            validationEvents[fieldName],
            () => {

                if (formStatus) {

                    formStatus.textContent = "";

                    formStatus.className = "form-status";

                }

                validators[fieldName]();

            }
        );

    });


    /* =====================================================
       18. FORM SUBMISSION
    ===================================================== */

    contactForm.addEventListener("submit", (event) => {

        event.preventDefault();

        clearAllErrors();

        const isValid = validateForm();

        if (!isValid) {

            if (formStatus) {

                formStatus.textContent =
                    "Please correct the highlighted fields and try again.";

                formStatus.className = "form-status is-error";

            }

            const firstInvalidField =
                contactForm.querySelector(".is-invalid");

            if (firstInvalidField) {

                firstInvalidField.focus();

            }

            return;

        }


        /* ---------------------------------------------
           DEMO VALIDATION SUCCESS

           No backend API is connected here.
           This does not send or store the enquiry.
        --------------------------------------------- */

        if (formStatus) {

            formStatus.textContent =
                "Your form details passed validation. Please connect a backend service to send and securely store your enquiry.";

            formStatus.className = "form-status is-success";

        }

        if (submitButton) {

            submitButton.blur();

        }

        console.log(
            "LEXORA contact form validation completed successfully."
        );

    });


    /* =====================================================
       19. FAQ ACCORDION
    ===================================================== */

    const faqItems = document.querySelectorAll(
        ".contact-faq-item"
    );

    faqItems.forEach((item) => {

        item.addEventListener("toggle", () => {

            if (!item.open) {
                return;
            }

            faqItems.forEach((otherItem) => {

                if (otherItem !== item && otherItem.open) {

                    otherItem.open = false;

                }

            });

        });

    });


    /* =====================================================
       20. FINAL ICON REFRESH
    ===================================================== */

    initializeIcons();


});

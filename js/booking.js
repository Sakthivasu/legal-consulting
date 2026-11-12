
/* =========================================================
   LEXORA LEGAL & ADVISORY
   BOOKING PAGE - JAVASCRIPT
   File: js/booking.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* ---------------------------------------------------------
     ELEMENT REFERENCES
  --------------------------------------------------------- */

  const bookingForm = document.getElementById("booking-form");
  const bookingSuccess = document.getElementById("booking-success");

  if (!bookingForm) return;

  const bookingSteps = Array.from(
    document.querySelectorAll("[data-booking-step]")
  );

  const progressSteps = Array.from(
    document.querySelectorAll("[data-progress-step]")
  );

  const progressLine = document.querySelector(".booking-progress-line");

  const previousButton = document.querySelector(".booking-prev-btn");
  const nextButton = document.querySelector(".booking-next-btn");
  const submitButton = document.querySelector(".booking-submit-btn");

  const formStatus = document.getElementById("booking-form-status");

  const fileInput = document.getElementById("booking-document");
  const fileName = document.getElementById("booking-file-name");

  const copyReferenceButton = document.querySelector(
    ".booking-copy-reference"
  );

  const referenceElement = document.getElementById(
    "booking-reference"
  );

  let currentStep = 1;
  const totalSteps = bookingSteps.length || 4;
  let generatedReference = "";

  /* ---------------------------------------------------------
     HELPER FUNCTIONS
  --------------------------------------------------------- */

  function getField(name) {
    return bookingForm.querySelector(`[name="${name}"]`);
  }

  function getFieldValue(name) {
    const field = getField(name);

    if (!field) return "";

    if (field.type === "radio") {
      const selected = bookingForm.querySelector(
        `[name="${name}"]:checked`
      );

      return selected ? selected.value : "";
    }

    return field.value.trim();
  }

  function getSelectedOption(name) {
    const selected = bookingForm.querySelector(
      `input[name="${name}"]:checked`
    );

    return selected ? selected.value : "";
  }

  function showStatus(message, type = "error") {
    if (!formStatus) return;

    formStatus.textContent = message;
    formStatus.className = `booking-form-status ${type}`;
  }

  function clearStatus() {
    if (!formStatus) return;

    formStatus.textContent = "";
    formStatus.className = "booking-form-status";
  }

  function showFieldError(field, message) {
    if (!field) return;

    field.classList.add("is-invalid");
    field.setAttribute("aria-invalid", "true");

    const group = field.closest(".booking-field-group");

    if (!group) return;

    let errorElement = group.querySelector(".booking-error");

    if (!errorElement) {
      errorElement = document.createElement("small");
      errorElement.className = "booking-error";
      group.appendChild(errorElement);
    }

    errorElement.textContent = message;
  }

  function clearFieldError(field) {
    if (!field) return;

    field.classList.remove("is-invalid");
    field.removeAttribute("aria-invalid");

    const group = field.closest(".booking-field-group");

    if (!group) return;

    const errorElement = group.querySelector(".booking-error");

    if (errorElement) {
      errorElement.textContent = "";
    }
  }

  function clearStepErrors(step) {
    if (!step) return;

    step.querySelectorAll(".is-invalid").forEach((field) => {
      clearFieldError(field);
    });

    step.querySelectorAll(".booking-error").forEach((error) => {
      error.textContent = "";
    });
  }

  function scrollToForm() {
    const formArea = document.querySelector(".booking-form-area");

    if (formArea) {
      formArea.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }

  /* ---------------------------------------------------------
     STEP NAVIGATION
  --------------------------------------------------------- */

  function showStep(stepNumber) {
    currentStep = Math.max(
      1,
      Math.min(stepNumber, totalSteps)
    );

    bookingSteps.forEach((step, index) => {
      const isActive = index + 1 === currentStep;

      step.classList.toggle("active", isActive);
      step.hidden = !isActive;
    });

    progressSteps.forEach((step, index) => {
      const stepNumberValue = index + 1;

      step.classList.toggle(
        "active",
        stepNumberValue === currentStep
      );

      step.classList.toggle(
        "completed",
        stepNumberValue < currentStep
      );

      step.setAttribute(
        "aria-current",
        stepNumberValue === currentStep ? "step" : "false"
      );
    });

    if (progressLine) {
      const progressPercentage =
        ((currentStep - 1) / Math.max(totalSteps - 1, 1)) * 100;

      progressLine.style.setProperty(
        "--progress-width",
        `${progressPercentage}%`
      );
    }

    if (previousButton) {
      previousButton.hidden = currentStep === 1;
    }

    if (nextButton) {
      nextButton.hidden = currentStep === totalSteps;
    }

    if (submitButton) {
      submitButton.hidden = currentStep !== totalSteps;
    }

    clearStatus();

    scrollToForm();
  }

  /* ---------------------------------------------------------
     VALIDATION HELPERS
  --------------------------------------------------------- */

  function validateRequired(name, message) {
    const field = getField(name);

    if (!field) return true;

    const value = getFieldValue(name);

    if (!value) {
      showFieldError(field, message);
      return false;
    }

    clearFieldError(field);
    return true;
  }

  function validateRadio(name, message) {
    const selected = bookingForm.querySelector(
      `input[name="${name}"]:checked`
    );

    const firstOption = bookingForm.querySelector(
      `input[name="${name}"]`
    );

    if (!selected) {
      if (firstOption) {
        showFieldError(firstOption, message);
      }

      return false;
    }

    if (firstOption) {
      clearFieldError(firstOption);
    }

    return true;
  }

  function validateEmail() {
    const field = getField("email");

    if (!field) return true;

    const email = field.value.trim();

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailPattern.test(email)) {
      showFieldError(field, "Please enter a valid email address.");
      return false;
    }

    clearFieldError(field);
    return true;
  }

  function validatePhone() {
    const field = getField("phone");

    if (!field) return true;

    const phone = field.value.trim();

    const digits = phone.replace(/\D/g, "");

    if (digits.length < 7 || digits.length > 15) {
      showFieldError(
        field,
        "Please enter a valid phone number."
      );

      return false;
    }

    clearFieldError(field);
    return true;
  }

  function validateBookingDate() {
    const field = getField("booking-date");

    if (!field || !field.value) return true;

    const selectedDate = new Date(
      `${field.value}T00:00:00`
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      showFieldError(
        field,
        "Please select today or a future date."
      );

      return false;
    }

    clearFieldError(field);
    return true;
  }

  function validateDescription() {
    const field = getField("description");

    if (!field) return true;

    if (field.value.trim().length < 10) {
      showFieldError(
        field,
        "Please provide at least 10 characters about your requirements."
      );

      return false;
    }

    clearFieldError(field);
    return true;
  }

  function validateDocument() {
    if (!fileInput || !fileInput.files.length) {
      return true;
    }

    const file = fileInput.files[0];

    const allowedExtensions = [
      "pdf",
      "doc",
      "docx",
      "jpg",
      "jpeg",
      "png"
    ];

    const extension = file.name
      .split(".")
      .pop()
      .toLowerCase();

    const maxSize = 5 * 1024 * 1024;

    if (!allowedExtensions.includes(extension)) {
      showStatus(
        "Unsupported file format. Upload PDF, DOC, DOCX, JPG or PNG."
      );

      return false;
    }

    if (file.size > maxSize) {
      showStatus(
        "File size must not exceed 5 MB."
      );

      return false;
    }

    return true;
  }

  /* ---------------------------------------------------------
     STEP VALIDATION
  --------------------------------------------------------- */

  function validateStep(stepNumber) {
    clearStatus();

    const currentStepElement = bookingSteps[stepNumber - 1];

    if (currentStepElement) {
      clearStepErrors(currentStepElement);
    }

    let isValid = true;

    if (stepNumber === 1) {
      isValid =
        validateRadio(
          "consultation-type",
          "Please select a consultation type."
        ) && isValid;

      isValid =
        validateRadio(
          "consultation-format",
          "Please select a consultation format."
        ) && isValid;

      isValid =
        validateRequired(
          "professional",
          "Please select a professional."
        ) && isValid;
    }

    if (stepNumber === 2) {
      isValid =
        validateRequired(
          "booking-date",
          "Please select your preferred date."
        ) && isValid;

      isValid =
        validateBookingDate() && isValid;

      isValid =
        validateRadio(
          "booking-time",
          "Please select a preferred time."
        ) && isValid;
    }

    if (stepNumber === 3) {
      isValid =
        validateRequired(
          "first-name",
          "First name is required."
        ) && isValid;

      isValid =
        validateRequired(
          "last-name",
          "Last name is required."
        ) && isValid;

      isValid =
        validateRequired(
          "email",
          "Email address is required."
        ) && isValid;

      if (getField("email")?.value.trim()) {
        isValid = validateEmail() && isValid;
      }

      isValid =
        validateRequired(
          "phone",
          "Phone number is required."
        ) && isValid;

      if (getField("phone")?.value.trim()) {
        isValid = validatePhone() && isValid;
      }

      isValid =
        validateRequired(
          "description",
          "Please describe your requirements."
        ) && isValid;

      if (getField("description")?.value.trim()) {
        isValid = validateDescription() && isValid;
      }

      const consent = getField("consent");

      if (consent && !consent.checked) {
        showFieldError(
          consent,
          "Please accept the terms before continuing."
        );

        isValid = false;
      } else if (consent) {
        clearFieldError(consent);
      }

      isValid = validateDocument() && isValid;
    }

    if (!isValid) {
      showStatus(
        "Please correct the highlighted fields before continuing."
      );

      const firstInvalid = currentStepElement?.querySelector(
        ".is-invalid"
      );

      if (firstInvalid) {
        firstInvalid.focus();
      }
    }

    return isValid;
  }

  /* ---------------------------------------------------------
     REVIEW DETAILS
  --------------------------------------------------------- */

  function setReviewValue(elementId, value, fallback = "—") {
    const element = document.getElementById(elementId);

    if (!element) return;

    element.textContent = value || fallback;
  }

  function formatDate(dateValue) {
    if (!dateValue) return "Not selected";

    const date = new Date(`${dateValue}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  }

  function updateReview() {
    const fullName = [
      getFieldValue("first-name"),
      getFieldValue("last-name")
    ].filter(Boolean).join(" ");

    setReviewValue(
      "review-consultation",
      getSelectedOption("consultation-type")
    );

    setReviewValue(
      "review-format",
      getSelectedOption("consultation-format")
    );

    setReviewValue(
      "review-professional",
      getFieldValue("professional")
    );

    setReviewValue(
      "review-date",
      formatDate(getFieldValue("booking-date"))
    );

    setReviewValue(
      "review-time",
      getSelectedOption("booking-time")
    );

    setReviewValue(
      "review-name",
      fullName
    );

    setReviewValue(
      "review-email",
      getFieldValue("email")
    );

    setReviewValue(
      "review-phone",
      getFieldValue("phone")
    );

    setReviewValue(
      "review-company",
      getFieldValue("company")
    );

    setReviewValue(
      "review-description",
      getFieldValue("description")
    );
  }

  /* ---------------------------------------------------------
     NEXT AND PREVIOUS BUTTONS
  --------------------------------------------------------- */

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      if (!validateStep(currentStep)) return;

      if (currentStep < totalSteps) {
        if (currentStep === 3) {
          updateReview();
        }

        showStep(currentStep + 1);
      }
    });
  }

  if (previousButton) {
    previousButton.addEventListener("click", () => {
      if (currentStep > 1) {
        showStep(currentStep - 1);
      }
    });
  }

  /* ---------------------------------------------------------
     FILE UPLOAD
  --------------------------------------------------------- */

  if (fileInput) {
    fileInput.addEventListener("change", () => {
      clearStatus();

      if (!validateDocument()) {
        fileInput.value = "";

        if (fileName) {
          fileName.textContent = "No file selected";
        }

        return;
      }

      if (fileName) {
        fileName.textContent = fileInput.files.length
          ? fileInput.files[0].name
          : "No file selected";
      }
    });
  }

  /* ---------------------------------------------------------
     LIVE FIELD ERROR CLEARING
  --------------------------------------------------------- */

  bookingForm.addEventListener("input", (event) => {
    const field = event.target;

    if (
      field.matches("input, textarea, select") &&
      field.type !== "radio" &&
      field.type !== "checkbox"
    ) {
      clearFieldError(field);
    }

    clearStatus();
  });

  bookingForm.addEventListener("change", (event) => {
    const field = event.target;

    if (field.matches('input[type="radio"]')) {
      const groupFirstOption = bookingForm.querySelector(
        `input[name="${field.name}"]`
      );

      clearFieldError(groupFirstOption);
      clearStatus();
    }

    if (field.type === "checkbox") {
      clearFieldError(field);
      clearStatus();
    }
  });

  /* ---------------------------------------------------------
     GENERATE BOOKING REFERENCE
  --------------------------------------------------------- */

  function generateReference() {
    const randomNumber = Math.floor(
      100000 + Math.random() * 900000
    );

    const dateCode = new Date()
      .toISOString()
      .slice(2, 10)
      .replace(/-/g, "");

    return `LEX-DEMO-${dateCode}-${randomNumber}`;
  }

  /* ---------------------------------------------------------
     SUCCESS SCREEN
  --------------------------------------------------------- */

  function showSuccess() {
    generatedReference = generateReference();

    if (referenceElement) {
      referenceElement.textContent = generatedReference;
    }

    bookingForm.hidden = true;

    if (bookingSuccess) {
      bookingSuccess.hidden = false;

      bookingSuccess.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }

  /* ---------------------------------------------------------
     FORM SUBMISSION
  --------------------------------------------------------- */

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (currentStep !== totalSteps) {
      return;
    }

    if (!validateStep(3)) {
      showStep(3);
      return;
    }

    if (!validateStep(4)) {
      return;
    }

    showSuccess();
  });

  /* ---------------------------------------------------------
     COPY REFERENCE NUMBER
  --------------------------------------------------------- */

  if (copyReferenceButton) {
    copyReferenceButton.addEventListener("click", async () => {
      if (!generatedReference) return;

      try {
        await navigator.clipboard.writeText(generatedReference);

        const originalText =
          copyReferenceButton.textContent;

        copyReferenceButton.textContent = "Copied!";

        setTimeout(() => {
          copyReferenceButton.textContent =
            originalText || "Copy Reference";
        }, 2000);
      } catch (error) {
        const temporaryInput = document.createElement("textarea");

        temporaryInput.value = generatedReference;
        temporaryInput.style.position = "fixed";
        temporaryInput.style.opacity = "0";

        document.body.appendChild(temporaryInput);

        temporaryInput.select();

        try {
          document.execCommand("copy");
          copyReferenceButton.textContent = "Copied!";
        } catch (copyError) {
          copyReferenceButton.textContent = "Copy unavailable";
        }

        temporaryInput.remove();
      }
    });
  }

  /* ---------------------------------------------------------
     DOWNLOAD DEMO RECEIPT
  --------------------------------------------------------- */

  function downloadReceipt() {
    const fullName = [
      getFieldValue("first-name"),
      getFieldValue("last-name")
    ].filter(Boolean).join(" ");

    const receipt = `
LEXORA LEGAL & ADVISORY
BOOKING CONFIRMATION

Reference Number: ${generatedReference}

Client Name: ${fullName}
Email: ${getFieldValue("email")}
Phone: ${getFieldValue("phone")}

Consultation Type: ${getSelectedOption("consultation-type")}
Consultation Format: ${getSelectedOption("consultation-format")}
Professional: ${getFieldValue("professional")}

Preferred Date: ${formatDate(getFieldValue("booking-date"))}
Preferred Time: ${getSelectedOption("booking-time")}

Description:
${getFieldValue("description")}

----------------------------------------
DEMO CONFIRMATION ONLY

This is a frontend demonstration receipt.
No actual appointment has been booked.
Please contact LEXORA to confirm your appointment.
----------------------------------------
`;

    const blob = new Blob([receipt], {
      type: "text/plain;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");

    downloadLink.href = url;
    downloadLink.download = `${generatedReference}-receipt.txt`;

    document.body.appendChild(downloadLink);

    downloadLink.click();

    downloadLink.remove();

    URL.revokeObjectURL(url);
  }

  const downloadButton = document.querySelector(
    ".booking-success-actions .booking-download-btn"
  );

  if (downloadButton) {
    downloadButton.addEventListener("click", downloadReceipt);
  }

  /* ---------------------------------------------------------
     INITIALIZE
  --------------------------------------------------------- */

  showStep(1);

});

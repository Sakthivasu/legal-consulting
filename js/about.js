
"use strict";

/* =========================================================
   LEXORA LEGAL & ADVISORY
   ABOUT PAGE JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     1. LUCIDE ICON INITIALIZATION
  =============================== */

  function initializeAboutIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  initializeAboutIcons();


  /* ===============================
     2. ABOUT PAGE REVEAL ANIMATION
  =============================== */

  const revealElements = document.querySelectorAll(
    ".about-page .about-intro-grid, " +
    ".about-page .about-story-grid, " +
    ".about-page .mission-vision-card, " +
    ".about-page .about-value-card, " +
    ".about-page .about-why-item, " +
    ".about-page .about-process-card, " +
    ".about-page .about-commitment-grid"
  );

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !prefersReducedMotion) {

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add("is-revealed");

            observer.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element) => {

      element.classList.add("about-reveal");

      revealObserver.observe(element);

    });

  } else {

    revealElements.forEach((element) => {
      element.classList.add("is-revealed");
    });

  }


  /* ===============================
     3. IMAGE LOAD ERROR HANDLING
  =============================== */

  const aboutImages = document.querySelectorAll(
    ".about-page main img"
  );

  aboutImages.forEach((image) => {

    image.addEventListener("error", () => {

      image.classList.add("image-load-error");

      console.warn(
        "LEXORA About: Image could not be loaded:",
        image.src
      );

    });

    image.addEventListener("load", () => {

      image.classList.add("image-loaded");

    });

  });


  /* ===============================
     4. EXTERNAL LINK PROTECTION
  =============================== */

  document.querySelectorAll(
    '.about-page a[target="_blank"]'
  ).forEach((link) => {

    link.setAttribute("rel", "noopener noreferrer");

  });


  /* ===============================
     5. ACCESSIBILITY SUPPORT
  =============================== */

  const mobileMenu = document.getElementById("mobile-navigation");
  const menuToggle = document.getElementById("mobile-menu-toggle");

  if (mobileMenu && menuToggle) {

    const accessibilityObserver = new MutationObserver(() => {

      const isOpen =
        mobileMenu.classList.contains("active") ||
        mobileMenu.classList.contains("is-open");

      mobileMenu.setAttribute(
        "aria-hidden",
        String(!isOpen)
      );

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

    });

    accessibilityObserver.observe(mobileMenu, {
      attributes: true,
      attributeFilter: ["class"]
    });

  }


  /* ===============================
     6. FOOTER YEAR FALLBACK
  =============================== */

  const yearElement = document.getElementById("current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  /* ===============================
     7. INITIALIZE PAGE
  =============================== */

  document.documentElement.classList.add("about-page-ready");

  console.log(
    "LEXORA About Page Initialized Successfully."
  );

});

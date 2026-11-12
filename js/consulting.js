
"use strict";

/* =========================================
   LEXORA - CONSULTING PAGE JAVASCRIPT
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     1. ELEMENT SELECTORS
     ========================================= */

  const preloader = document.getElementById("preloader");
  const preloaderProgress = document.getElementById("preloader-progress");
  const preloaderPercentage = document.getElementById("preloader-percentage");

  const siteHeader = document.getElementById("site-header");

  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenuClose = document.getElementById("mobile-menu-close");
  const mobileNavigation = document.getElementById("mobile-navigation");
  const mobileMenuOverlay = document.getElementById("mobile-menu-overlay");

  const backToTop = document.getElementById("back-to-top");
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


  /* Shell behaviour (preloader, header, mobile menu, back-to-top, anchors, year)
     is provided by js/script.js on every page. */


  /* =========================================
     8. REVEAL ANIMATIONS
     ========================================= */

  const revealElements = document.querySelectorAll(
    ".legal-service-card, " +
    ".framework-card, " +
    ".stat-card, " +
    ".additional-support-item, " +
    ".about-preview-content, " +
    ".services-intro-heading, " +
    ".services-intro-description"
  );

  if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver((entries, observer) => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add("is-visible");

          observer.unobserve(entry.target);

        }

      });

    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    });


    revealElements.forEach(element => {

      element.classList.add("reveal");

      revealObserver.observe(element);

    });

  } else {

    revealElements.forEach(element => {
      element.classList.add("is-visible");
    });

  }


  /* =========================================
     9. IMAGE LOADING SUPPORT
     ========================================= */

  const images = document.querySelectorAll("img");

  images.forEach(image => {

    image.addEventListener("error", () => {
      image.classList.add("image-error");
    });

  });


  /* =========================================
     10. CURRENT YEAR
     ========================================= */

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }


  /* =========================================
     11. CTA BUTTON INTERACTION
     ========================================= */

  const bookingLinks = document.querySelectorAll(
    'a[href="booking.html"]'
  );

  bookingLinks.forEach(link => {

    link.addEventListener("click", () => {

      link.classList.add("is-clicked");

    });

  });


  /* =========================================
     12. ACCESSIBILITY SUPPORT
     ========================================= */

  if (mobileNavigation) {
    mobileNavigation.setAttribute("aria-label", "Mobile navigation");
  }

  if (mobileMenuOverlay) {
    mobileMenuOverlay.setAttribute("aria-hidden", "true");
  }


  /* =========================================
     13. FINAL INITIALIZATION
     ========================================= */

  initializeIcons();

  console.log("LEXORA Consulting Page Initialized Successfully.");

});

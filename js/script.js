"use strict";

/* =========================================================
   LEXORA LEGAL & ADVISORY
   SHARED SITE SCRIPT  (loaded on every page)

   Provides the common shell behaviour:
   1. Lucide icons
   2. Preloader
   3. Sticky header state
   4. Mobile navigation
   5. Back to top button
   6. Smooth in-page anchors
   7. Footer year
   8. Scroll reveals
   9. Image load handling
========================================================= */

(function () {

  /* ---------------------------------------------------------
     Preloader is started immediately (script is deferred, so
     the DOM is already parsed) so it can never be skipped.
  --------------------------------------------------------- */

  const preloader = document.getElementById("preloader");
  const progressBar = document.getElementById("preloader-progress");
  const percentageText = document.getElementById("preloader-percentage");

  const MIN_VISIBLE_MS = 700;      // keep the brand screen on for a moment
  const MAX_VISIBLE_MS = 6000;     // never block the page longer than this
  const startedAt = Date.now();

  let progress = 0;
  let preloaderFinished = false;
  let progressTimer = null;

  function setProgress(value) {
    progress = Math.max(0, Math.min(100, Math.round(value)));

    if (progressBar) {
      progressBar.style.width = progress + "%";
    }

    if (percentageText) {
      percentageText.textContent = progress + "%";
    }
  }

  function tickProgress() {
    if (preloaderFinished) return;

    // Ease towards 92% while the page is still loading.
    const step = Math.max(1, Math.round((92 - progress) * 0.12));
    setProgress(Math.min(92, progress + step));
  }

  function hidePreloader() {
    if (preloaderFinished) return;

    preloaderFinished = true;
    window.clearInterval(progressTimer);
    setProgress(100);

    const wait = Math.max(0, MIN_VISIBLE_MS - (Date.now() - startedAt));

    window.setTimeout(() => {
      if (preloader) {
        preloader.classList.add("is-hidden");
      }

      document.body.classList.remove("preloader-active");

      window.setTimeout(() => {
        if (preloader) {
          preloader.style.display = "none";
        }
      }, 850);
    }, wait + 250);
  }

  if (preloader) {
    document.body.classList.add("preloader-active");
    setProgress(0);
    progressTimer = window.setInterval(tickProgress, 120);

    if (document.readyState === "complete") {
      hidePreloader();
    } else {
      window.addEventListener("load", hidePreloader, { once: true });
    }

    window.setTimeout(hidePreloader, MAX_VISIBLE_MS);

    // Back/forward cache restore: never show a stale, stuck preloader.
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) {
        preloaderFinished = false;
        hidePreloader();
      }
    });
  }


  /* ---------------------------------------------------------
     Everything below needs the DOM
  --------------------------------------------------------- */

  function init() {

    /* 1. LUCIDE ICONS */

    function initializeIcons() {
      if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
      }
    }

    initializeIcons();
    // Icon library can finish loading after DOM ready on slow networks.
    window.addEventListener("load", initializeIcons, { once: true });


    /* 3. HEADER SCROLL EFFECT */

    const header = document.getElementById("site-header");

    function handleHeaderScroll() {
      if (!header) return;
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    }

    window.addEventListener("scroll", handleHeaderScroll, { passive: true });
    handleHeaderScroll();


    /* 4. MOBILE NAVIGATION */

    const menuToggle = document.getElementById("mobile-menu-toggle");
    const menuClose = document.getElementById("mobile-menu-close");
    const mobileNavigation = document.getElementById("mobile-navigation");
    const mobileOverlay = document.getElementById("mobile-menu-overlay");

    function isMenuOpen() {
      return !!mobileNavigation && mobileNavigation.classList.contains("is-open");
    }

    function openMobileMenu() {
      if (!mobileNavigation || !mobileOverlay) return;

      mobileNavigation.classList.add("is-open");
      mobileOverlay.classList.add("is-active");
      document.body.classList.add("menu-open");
      mobileNavigation.setAttribute("aria-hidden", "false");

      if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation");
      }
    }

    function closeMobileMenu() {
      if (!mobileNavigation || !mobileOverlay) return;

      mobileNavigation.classList.remove("is-open");
      mobileOverlay.classList.remove("is-active");
      document.body.classList.remove("menu-open");
      mobileNavigation.setAttribute("aria-hidden", "true");

      if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      }
    }

    if (mobileNavigation) {
      mobileNavigation.setAttribute("aria-hidden", "true");

      // The panel is authored inside <header>, whose stacking context sits
      // below the dark overlay. Re-parent it to <body> so it is drawn above
      // the overlay and its links/buttons receive taps and clicks.
      if (mobileNavigation.parentElement !== document.body) {
        document.body.appendChild(mobileNavigation);
      }
    }

    if (menuToggle) {
      menuToggle.addEventListener("click", () => {
        if (isMenuOpen()) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }
      });
    }

    if (menuClose) menuClose.addEventListener("click", closeMobileMenu);
    if (mobileOverlay) mobileOverlay.addEventListener("click", closeMobileMenu);

    if (mobileNavigation) {
      mobileNavigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isMenuOpen()) {
        closeMobileMenu();
        if (menuToggle) menuToggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1100) {
        closeMobileMenu();
      }
    });


    /* 5. BACK TO TOP */

    const backToTop = document.getElementById("back-to-top");

    function handleBackToTopVisibility() {
      if (!backToTop) return;
      backToTop.classList.toggle("is-visible", window.scrollY > 400);
    }

    window.addEventListener("scroll", handleBackToTopVisibility, { passive: true });
    handleBackToTopVisibility();

    if (backToTop) {
      backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }


    /* 6. SMOOTH IN-PAGE ANCHORS */

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") return;

        let targetElement = null;

        try {
          targetElement = document.querySelector(targetId);
        } catch (error) {
          return;
        }

        if (!targetElement) return;

        event.preventDefault();

        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.scrollY -
          headerHeight -
          15;

        window.scrollTo({ top: targetPosition, behavior: "smooth" });
      });
    });


    /* 7. FOOTER YEAR */

    const currentYear = document.getElementById("current-year");

    if (currentYear) {
      currentYear.textContent = new Date().getFullYear();
    }


    /* 8. SCROLL REVEALS */

    const revealElements = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right"
    );

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
    } else {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

      revealElements.forEach((element) => revealObserver.observe(element));
    }

    if (prefersReducedMotion) {
      document.documentElement.classList.add("reduced-motion");
    }


    /* 9. IMAGE LOAD HANDLING */

    document.querySelectorAll("main img").forEach((image) => {
      image.addEventListener("error", () => image.classList.add("image-load-error"));
      image.addEventListener("load", () => image.classList.add("image-loaded"));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();

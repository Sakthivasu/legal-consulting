/* =========================================================
   LEXORA LEGAL & ADVISORY
   SERVICES PAGE JAVASCRIPT
   File: js/services.js
========================================================= */

"use strict";


/* =========================================================
   PAGE INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    // Shell behaviour (preloader, header, mobile menu, back-to-top, anchors, year)
    // is provided by js/script.js on every page.

    initializeScrollAnimations();

    initializeActiveNavigation();

});


/* =========================================================
   5. SCROLL REVEAL ANIMATIONS
========================================================= */

function initializeScrollAnimations() {

    const animatedElements = document.querySelectorAll(`

        .services-hero-content,

        .services-intro-content,

        .services-intro-image,

        .section-heading,

        .legal-service-card,

        .framework-card,

        .additional-support-heading,

        .additional-support-item,

        .why-choose-card,

        .services-cta-content,

        .footer-brand,

        .footer-column

    `);


    if (!animatedElements.length) return;


    // Fallback for browsers without IntersectionObserver

    if (!("IntersectionObserver" in window)) {

        animatedElements.forEach((element) => {

            element.classList.add("is-visible");

        });

        return;

    }


    const observer = new IntersectionObserver(

        (entries, currentObserver) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("is-visible");

                    currentObserver.unobserve(entry.target);

                }

            });

        },

        {

            threshold: 0.12,

            rootMargin: "0px 0px -40px 0px"

        }

    );


    animatedElements.forEach((element) => {

        element.classList.add("reveal");

        observer.observe(element);

    });


    // Reduced motion accessibility

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );


    if (reducedMotion.matches) {

        animatedElements.forEach((element) => {

            element.classList.add("is-visible");

            observer.unobserve(element);

        });

    }

}


/* =========================================================
   9. ACTIVE NAVIGATION
========================================================= */

function initializeActiveNavigation() {

    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();


    const navigationLinks = document.querySelectorAll(
        ".desktop-navigation .nav-link, .mobile-navigation .nav-link"
    );


    navigationLinks.forEach((link) => {

        const linkPage = link.getAttribute("href");

        if (!linkPage) return;


        const normalizedLink = linkPage
            .split("/")
            .pop()
            .toLowerCase();


        if (normalizedLink === currentPage) {

            link.classList.add("active");

            link.setAttribute("aria-current", "page");

        } else {

            link.classList.remove("active");

            link.removeAttribute("aria-current");

        }

    });

}


/* =========================================================
   10. ADDITIONAL SUPPORT CARD INTERACTIONS
========================================================= */

function initializeSupportInteractions() {

    const supportItems = document.querySelectorAll(
        ".additional-support-item"
    );


    supportItems.forEach((item) => {

        item.addEventListener("mouseenter", () => {

            item.classList.add("is-hovered");

        });


        item.addEventListener("mouseleave", () => {

            item.classList.remove("is-hovered");

        });

    });

}


/* =========================================================
   11. PAGE VISIBILITY HANDLING
========================================================= */

document.addEventListener("visibilitychange", () => {

    if (document.hidden) {

        document.body.classList.add("page-hidden");

    } else {

        document.body.classList.remove("page-hidden");

    }

});


/* =========================================================
   12. INITIALIZE ADDITIONAL INTERACTIONS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeSupportInteractions();

});


/* =========================================================
   LEXORA SERVICES PAGE JAVASCRIPT COMPLETE
========================================================= */

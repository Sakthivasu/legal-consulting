
/* =========================================================
   LEXORA LEGAL & ADVISORY
   INSIGHTS PAGE - COMPLETE JAVASCRIPT
   File: js/insights.js
========================================================= */

"use strict";

/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     ELEMENT SELECTORS
  ======================================================= */

  const body = document.body;

  const preloader = document.getElementById("preloader");
  const preloaderProgress = document.getElementById("preloader-progress");
  const preloaderPercentage = document.getElementById("preloader-percentage");

  const siteHeader = document.getElementById("site-header");

  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenuClose = document.getElementById("mobile-menu-close");
  const mobileNavigation = document.getElementById("mobile-navigation");
  const mobileMenuOverlay = document.getElementById("mobile-menu-overlay");

  const backToTop = document.getElementById("back-to-top");

  const searchInput = document.getElementById("insights-search");
  const searchClear = document.getElementById("insights-search-clear");

  const sortSelect = document.getElementById("insights-sort-select");

  const categoryContainer = document.getElementById("insights-category-filters");

  const articleGrid = document.getElementById("insights-article-grid");

  const noResults = document.getElementById("insights-no-results");
  const resetFiltersButton = document.getElementById("insights-reset-filters");

  const pagination = document.getElementById("insights-pagination");
  const previousPageButton = document.getElementById("insights-prev-page");
  const nextPageButton = document.getElementById("insights-next-page");
  const pageNumber = document.getElementById("insights-page-number");

  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterEmail = document.getElementById("newsletter-email");
  const newsletterEmailError = document.getElementById("newsletter-email-error");
  const newsletterStatus = document.getElementById("newsletter-status");

  const currentYear = document.getElementById("current-year");


  /* =======================================================
     LUCIDE ICON INITIALIZATION
  ======================================================= */

  function initializeIcons() {

    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }

  }

  initializeIcons();


  /* Shell behaviour (preloader, header, mobile menu, back-to-top, year) lives in js/script.js. */


  /* =======================================================
     INSIGHTS ARTICLE SEARCH / FILTER / SORT / PAGINATION
  ======================================================= */

  if (articleGrid) {

    const articleCards = Array.from(
      articleGrid.querySelectorAll(".insight-card")
    );

    const filterButtons = categoryContainer
      ? Array.from(categoryContainer.querySelectorAll("[data-filter]"))
      : [];

    const topicCards = document.querySelectorAll("[data-topic-filter]");

    const ARTICLES_PER_PAGE = 6;

    let selectedCategory = "all";
    let searchTerm = "";
    let selectedSort = "latest";
    let currentPage = 1;

    let filteredArticles = [];


    /* ===================================================
       GET ARTICLE DATE
    =================================================== */

    function getArticleDate(card) {

      const dateValue = card.dataset.date || "";

      const parsedDate = new Date(dateValue);

      if (Number.isNaN(parsedDate.getTime())) {
        return new Date(0);
      }

      return parsedDate;

    }


    /* ===================================================
       GET ARTICLE TITLE
    =================================================== */

    function getArticleTitle(card) {

      return (
        card.dataset.title ||
        card.querySelector("h3")?.textContent ||
        ""
      ).trim().toLowerCase();

    }


    /* ===================================================
       FILTER ARTICLES
    =================================================== */

    function filterArticles() {

      filteredArticles = articleCards.filter(card => {

        const category = (
          card.dataset.category || ""
        ).trim().toLowerCase();

        const title = getArticleTitle(card);

        const cardText = (
          card.textContent || ""
        ).toLowerCase();

        const matchesCategory =
          selectedCategory === "all" ||
          category === selectedCategory;

        const matchesSearch =
          searchTerm === "" ||
          title.includes(searchTerm) ||
          cardText.includes(searchTerm);

        return matchesCategory && matchesSearch;

      });

    }


    /* ===================================================
       SORT ARTICLES
    =================================================== */

    function sortArticles() {

      filteredArticles.sort((a, b) => {

        if (selectedSort === "latest") {

          return getArticleDate(b) - getArticleDate(a);

        }

        if (selectedSort === "oldest") {

          return getArticleDate(a) - getArticleDate(b);

        }

        if (selectedSort === "alphabetical") {

          return getArticleTitle(a).localeCompare(
            getArticleTitle(b)
          );

        }

        return 0;

      });

    }


    /* ===================================================
       UPDATE PAGINATION
    =================================================== */

    function updatePagination(totalPages) {

      const hasResults = filteredArticles.length > 0;

      if (pagination) {

        pagination.hidden = !hasResults || totalPages <= 1;

      }

      if (previousPageButton) {

        previousPageButton.disabled =
          currentPage <= 1 || !hasResults;

      }

      if (nextPageButton) {

        nextPageButton.disabled =
          currentPage >= totalPages || !hasResults;

      }

      if (pageNumber) {

        pageNumber.textContent = hasResults
          ? currentPage
          : 0;

      }

    }


    /* ===================================================
       UPDATE CATEGORY BUTTONS
    =================================================== */

    function updateCategoryButtons() {

      filterButtons.forEach(button => {

        const filterValue = (
          button.dataset.filter || "all"
        ).toLowerCase();

        const isActive = filterValue === selectedCategory;

        button.classList.toggle("active", isActive);

        button.setAttribute(
          "aria-pressed",
          String(isActive)
        );

      });

    }


    /* ===================================================
       UPDATE SEARCH CLEAR BUTTON
    =================================================== */

    function updateSearchClearButton() {

      if (!searchClear) {
        return;
      }

      searchClear.classList.toggle(
        "is-visible",
        searchTerm.length > 0
      );

      searchClear.setAttribute(
        "aria-label",
        "Clear search"
      );

    }


    /* ===================================================
       RENDER ARTICLES
    =================================================== */

    function renderArticles() {

      filterArticles();

      sortArticles();

      const totalArticles = filteredArticles.length;

      const totalPages = Math.ceil(
        totalArticles / ARTICLES_PER_PAGE
      );

      if (currentPage > totalPages) {
        currentPage = Math.max(1, totalPages);
      }

      const startIndex =
        (currentPage - 1) * ARTICLES_PER_PAGE;

      const endIndex =
        startIndex + ARTICLES_PER_PAGE;

      const visibleArticles = filteredArticles.slice(
        startIndex,
        endIndex
      );

      // Hide all articles before showing the current page.
      articleCards.forEach(card => {

        card.hidden = true;

      });

      // Display articles belonging to the current page.
      visibleArticles.forEach(card => {

        card.hidden = false;

      });

      // Show the no-results message when necessary.
      if (noResults) {

        noResults.hidden = totalArticles !== 0;

      }

      updatePagination(totalPages);

      updateCategoryButtons();

      updateSearchClearButton();

    }


    /* ===================================================
       CATEGORY FILTER EVENTS
    =================================================== */

    filterButtons.forEach(button => {

      button.addEventListener("click", () => {

        selectedCategory = (
          button.dataset.filter || "all"
        ).trim().toLowerCase();

        currentPage = 1;

        renderArticles();

      });

    });


    /* ===================================================
       SEARCH INPUT EVENT
    =================================================== */

    if (searchInput) {

      searchInput.addEventListener("input", () => {

        searchTerm = searchInput.value
          .trim()
          .toLowerCase();

        currentPage = 1;

        renderArticles();

      });

    }


    /* ===================================================
       CLEAR SEARCH
    =================================================== */

    if (searchClear) {

      searchClear.addEventListener("click", () => {

        if (searchInput) {

          searchInput.value = "";

        }

        searchTerm = "";
        currentPage = 1;

        renderArticles();

        if (searchInput) {
          searchInput.focus();
        }

      });

    }


    /* ===================================================
       SORT EVENT
    =================================================== */

    if (sortSelect) {

      sortSelect.addEventListener("change", () => {

        selectedSort = sortSelect.value;

        currentPage = 1;

        renderArticles();

      });

    }


    /* ===================================================
       PREVIOUS PAGE
    =================================================== */

    if (previousPageButton) {

      previousPageButton.addEventListener("click", () => {

        if (currentPage > 1) {

          currentPage--;

          renderArticles();

          const library = document.getElementById(
            "insights-library"
          );

          if (library) {
            library.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
          }

        }

      });

    }


    /* ===================================================
       NEXT PAGE
    =================================================== */

    if (nextPageButton) {

      nextPageButton.addEventListener("click", () => {

        const totalPages = Math.ceil(
          filteredArticles.length / ARTICLES_PER_PAGE
        );

        if (currentPage < totalPages) {

          currentPage++;

          renderArticles();

          const library = document.getElementById(
            "insights-library"
          );

          if (library) {
            library.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
          }

        }

      });

    }


    /* ===================================================
       RESET FILTERS
    =================================================== */

    function resetFilters() {

      selectedCategory = "all";
      searchTerm = "";
      selectedSort = "latest";
      currentPage = 1;

      if (searchInput) {
        searchInput.value = "";
      }

      if (sortSelect) {
        sortSelect.value = "latest";
      }

      renderArticles();

    }


    if (resetFiltersButton) {

      resetFiltersButton.addEventListener(
        "click",
        resetFilters
      );

    }


    /* ===================================================
       TOPIC CARD FILTER
    =================================================== */

    topicCards.forEach(topic => {

      topic.addEventListener("click", event => {

        const topicFilter = (
          topic.dataset.topicFilter || ""
        ).trim().toLowerCase();

        if (!topicFilter) {
          return;
        }

        event.preventDefault();

        selectedCategory = topicFilter;

        currentPage = 1;

        if (searchInput) {

          searchInput.value = "";
          searchTerm = "";

        }

        renderArticles();

        const library = document.getElementById(
          "insights-library"
        );

        if (library) {

          library.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }

      });

    });


    /* ===================================================
       INITIAL ARTICLE RENDER
    =================================================== */

    renderArticles();

  }


  /* =======================================================
     NEWSLETTER FORM VALIDATION
  ======================================================= */

  if (newsletterForm && newsletterEmail) {

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;


    function showEmailError(message) {

      if (newsletterEmailError) {
        newsletterEmailError.textContent = message;
      }

      newsletterEmail.setAttribute("aria-invalid", "true");

    }


    function clearEmailError() {

      if (newsletterEmailError) {
        newsletterEmailError.textContent = "";
      }

      newsletterEmail.removeAttribute("aria-invalid");

    }


    newsletterEmail.addEventListener("input", () => {

      clearEmailError();

      if (newsletterStatus) {
        newsletterStatus.textContent = "";
      }

    });


    newsletterForm.addEventListener("submit", event => {

      event.preventDefault();

      const email = newsletterEmail.value.trim();

      if (!email) {

        showEmailError("Please enter your email address.");

        newsletterEmail.focus();

        return;

      }

      if (!emailPattern.test(email)) {

        showEmailError(
          "Please enter a valid email address."
        );

        newsletterEmail.focus();

        return;

      }

      clearEmailError();

      if (newsletterStatus) {

        newsletterStatus.textContent =
          "Your email is valid. Newsletter subscription requires a connected backend.";

      }

      newsletterForm.reset();

    });

  }


  /* =======================================================
     INITIAL PAGE STATE
  ======================================================= */

  initializeIcons();

});

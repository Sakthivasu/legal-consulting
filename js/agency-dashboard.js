
/* =========================================================
   LEXORA LEGAL & ADVISORY
   AGENCY DASHBOARD JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =======================================================
     1. ELEMENT SELECTORS
     ======================================================= */

  const sidebar = document.getElementById("dashboard-sidebar");
  const sidebarOverlay = document.getElementById("dashboard-overlay");
  const menuToggle = document.getElementById("dashboard-menu-toggle");
  const sidebarClose = document.getElementById("dashboard-sidebar-close");

  const userTrigger = document.getElementById("dashboard-user-trigger");
  const userDropdown = document.getElementById("dashboard-user-dropdown");

  const currentPage = document.getElementById("dashboard-current-page");
  const currentYear = document.getElementById("dashboard-current-year");

  const globalSearch = document.getElementById("dashboard-global-search");

  const modal = document.getElementById("dashboard-modal");
  const modalTitle = document.getElementById("dashboard-modal-title");
  const modalMessage = document.getElementById("dashboard-modal-message");

  const toast = document.getElementById("dashboard-toast");
  const toastMessage = document.getElementById("dashboard-toast-message");

  let toastTimer = null;
  let lastFocusedElement = null;

  /* =======================================================
     2. COMMON INITIALIZATION
     ======================================================= */

  // Initialize Lucide icons safely.
  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  refreshIcons();

  // Update dashboard footer year.
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // Keep dashboard sections hidden unless active.
  const dashboardPanels = document.querySelectorAll(
    "[data-dashboard-panel]"
  );

  const dashboardNavLinks = document.querySelectorAll(
    "[data-dashboard-section]"
  );

  /* =======================================================
     3. TOAST NOTIFICATION
     ======================================================= */

  function showToast(message) {
    if (!toast || !toastMessage) {
      console.log(message);
      return;
    }

    toastMessage.textContent = message;

    toast.classList.add("show");

    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
      toastTimer = null;
    }, 3200);
  }

  /* =======================================================
     4. MODAL MANAGEMENT
     ======================================================= */

  function openModal(title, message) {
    if (!modal || !modalTitle || !modalMessage) {
      showToast(message);
      return;
    }

    lastFocusedElement = document.activeElement;

    modalTitle.textContent = title;
    modalMessage.textContent = message;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    const closeButton = modal.querySelector(".dashboard-modal-close");

    if (closeButton) {
      closeButton.focus();
    }
  }

  function closeModal() {
    if (!modal) return;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  document.querySelectorAll("[data-modal-close]").forEach((element) => {
    element.addEventListener("click", closeModal);
  });

  /* =======================================================
     5. SIDEBAR MANAGEMENT
     ======================================================= */

  function openSidebar() {
    if (!sidebar) return;

    sidebar.classList.add("is-open");

    if (sidebarOverlay) {
      sidebarOverlay.classList.add("active");
    }

    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    if (sidebar) {
      sidebar.classList.remove("is-open");
    }

    if (sidebarOverlay) {
      sidebarOverlay.classList.remove("active");
    }

    document.body.style.overflow = "";
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", openSidebar);
  }

  if (sidebarClose) {
    sidebarClose.addEventListener("click", closeSidebar);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeSidebar);
  }

  /* =======================================================
     6. DASHBOARD SECTION NAVIGATION
     ======================================================= */

  const sectionNames = {
    overview: "Overview",
    consultations: "Consultations",
    clients: "Clients",
    team: "Team Members",
    documents: "Documents",
    reports: "Reports & Analytics",
    notifications: "Notifications",
    profile: "Agency Settings"
  };

  function showSection(sectionName, updateHash = true) {
    const targetSection = document.querySelector(
      `[data-dashboard-panel="${sectionName}"]`
    );

    if (!targetSection) {
      return;
    }

    // Hide all sections.
    dashboardPanels.forEach((panel) => {
      panel.classList.remove("active");
      panel.hidden = true;
    });

    // Display selected section.
    targetSection.hidden = false;
    targetSection.classList.add("active");

    // Update navigation active state.
    dashboardNavLinks.forEach((link) => {
      const isActive =
        link.dataset.dashboardSection === sectionName;

      if (link.classList.contains("dashboard-nav-link")) {
        link.classList.toggle("active", isActive);
      }

      if (link.hasAttribute("aria-current")) {
        link.removeAttribute("aria-current");
      }

      if (isActive && link.classList.contains("dashboard-nav-link")) {
        link.setAttribute("aria-current", "page");
      }
    });

    // Update breadcrumb.
    if (currentPage) {
      currentPage.textContent =
        sectionNames[sectionName] || "Dashboard";
    }

    // Update URL hash.
    if (updateHash) {
      history.replaceState(null, "", `#${sectionName}`);
    }

    // Close mobile sidebar.
    closeSidebar();

    // Close user dropdown.
    closeUserDropdown();

    // Return page to top.
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    // Refresh icons.
    refreshIcons();
  }

  dashboardNavLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const sectionName = link.dataset.dashboardSection;

      if (!sectionName) return;

      event.preventDefault();
      showSection(sectionName);
    });
  });

  // Open a section based on the current URL hash.
  function initializeSectionFromHash() {
    const hash = window.location.hash.replace("#", "");

    if (hash && sectionNames[hash]) {
      showSection(hash, false);
    } else {
      showSection("overview", false);
    }
  }

  initializeSectionFromHash();

  window.addEventListener("hashchange", () => {
    const hash = window.location.hash.replace("#", "");

    if (hash && sectionNames[hash]) {
      showSection(hash, false);
    }
  });

  /* =======================================================
     7. USER DROPDOWN
     ======================================================= */

  function closeUserDropdown() {
    if (!userDropdown || !userTrigger) return;

    userDropdown.hidden = true;
    userTrigger.setAttribute("aria-expanded", "false");
  }

  if (userTrigger && userDropdown) {
    userTrigger.addEventListener("click", (event) => {
      event.stopPropagation();

      const isOpening = userDropdown.hidden;

      userDropdown.hidden = !isOpening;

      userTrigger.setAttribute(
        "aria-expanded",
        String(isOpening)
      );
    });

    userDropdown.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    document.addEventListener("click", (event) => {
      if (
        !userDropdown.contains(event.target) &&
        !userTrigger.contains(event.target)
      ) {
        closeUserDropdown();
      }
    });
  }

  /* =======================================================
     8. KEYBOARD SHORTCUTS
     ======================================================= */

  document.addEventListener("keydown", (event) => {

    // Escape closes open interfaces.
    if (event.key === "Escape") {
      closeSidebar();
      closeUserDropdown();
      closeModal();
    }

    // Ctrl + K / Cmd + K opens global search.
    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "k"
    ) {
      if (globalSearch) {
        event.preventDefault();
        globalSearch.focus();
      }
    }

    // Prevent Tab navigation from being trapped in the modal.
    if (
      event.key === "Tab" &&
      modal &&
      modal.classList.contains("is-open")
    ) {
      const focusableElements = modal.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
      );

      if (!focusableElements.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === lastElement
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  });

  /* =======================================================
     9. TABLE SEARCH HELPER
     ======================================================= */

  function filterTableRows(table, searchValue, filterCallback) {
    if (!table) return 0;

    const rows = table.querySelectorAll("tbody tr");
    let visibleCount = 0;

    const searchText = searchValue.trim().toLowerCase();

    rows.forEach((row) => {
      const rowText = row.textContent.toLowerCase();

      const matchesSearch =
        !searchText || rowText.includes(searchText);

      const matchesFilter =
        typeof filterCallback === "function"
          ? filterCallback(row)
          : true;

      const isVisible = matchesSearch && matchesFilter;

      row.hidden = !isVisible;

      if (isVisible) {
        visibleCount++;
      }
    });

    return visibleCount;
  }

  function updateEmptyState(emptyElement, visibleCount) {
    if (!emptyElement) return;

    emptyElement.hidden = visibleCount > 0;
  }

  /* =======================================================
     10. CONSULTATIONS SEARCH AND FILTER
     ======================================================= */

  const consultationTable = document.getElementById(
    "consultations-table"
  );

  const consultationSearch = document.getElementById(
    "consultation-search"
  );

  const consultationStatusFilter = document.getElementById(
    "consultation-status-filter"
  );

  const consultationsEmpty = document.getElementById(
    "consultations-empty"
  );

  function filterConsultations() {
    const searchValue = consultationSearch
      ? consultationSearch.value
      : "";

    const selectedStatus = consultationStatusFilter
      ? consultationStatusFilter.value.toLowerCase()
      : "all";

    const visibleCount = filterTableRows(
      consultationTable,
      searchValue,
      (row) => {
        if (selectedStatus === "all") return true;

        const statusCell = row.cells[4];

        if (!statusCell) return false;

        return statusCell.textContent
          .trim()
          .toLowerCase()
          .includes(selectedStatus);
      }
    );

    updateEmptyState(consultationsEmpty, visibleCount);
  }

  if (consultationSearch) {
    consultationSearch.addEventListener(
      "input",
      filterConsultations
    );
  }

  if (consultationStatusFilter) {
    consultationStatusFilter.addEventListener(
      "change",
      filterConsultations
    );
  }

  /* =======================================================
     11. CLIENT SEARCH AND FILTER
     ======================================================= */

  const clientsTable = document.getElementById("clients-table");
  const clientSearch = document.getElementById("client-search");

  const clientTypeFilter = document.getElementById(
    "client-type-filter"
  );

  const clientsEmpty = document.getElementById("clients-empty");

  function filterClients() {
    const searchValue = clientSearch
      ? clientSearch.value
      : "";

    const selectedType = clientTypeFilter
      ? clientTypeFilter.value.toLowerCase()
      : "all";

    const visibleCount = filterTableRows(
      clientsTable,
      searchValue,
      (row) => {
        if (selectedType === "all") return true;

        const typeCell = row.cells[1];

        if (!typeCell) return false;

        return typeCell.textContent
          .trim()
          .toLowerCase() === selectedType;
      }
    );

    updateEmptyState(clientsEmpty, visibleCount);
  }

  if (clientSearch) {
    clientSearch.addEventListener("input", filterClients);
  }

  if (clientTypeFilter) {
    clientTypeFilter.addEventListener("change", filterClients);
  }

  /* =======================================================
     12. DOCUMENT SEARCH AND FILTER
     ======================================================= */

  const documentsTable = document.getElementById(
    "documents-table"
  );

  const documentSearch = document.getElementById(
    "document-search"
  );

  const documentTypeFilter = document.getElementById(
    "document-type-filter"
  );

  const documentsEmpty = document.getElementById(
    "documents-empty"
  );

  function filterDocuments() {
    const searchValue = documentSearch
      ? documentSearch.value
      : "";

    const selectedType = documentTypeFilter
      ? documentTypeFilter.value.toLowerCase()
      : "all";

    const visibleCount = filterTableRows(
      documentsTable,
      searchValue,
      (row) => {
        if (selectedType === "all") return true;

        const typeCell = row.cells[1];

        if (!typeCell) return false;

        const fileType = typeCell.textContent.toLowerCase();

        if (selectedType === "doc") {
          return fileType.includes("word") ||
            fileType.includes("doc");
        }

        return fileType.includes(selectedType);
      }
    );

    updateEmptyState(documentsEmpty, visibleCount);
  }

  if (documentSearch) {
    documentSearch.addEventListener("input", filterDocuments);
  }

  if (documentTypeFilter) {
    documentTypeFilter.addEventListener(
      "change",
      filterDocuments
    );
  }

  /* =======================================================
     13. GLOBAL SEARCH
     ======================================================= */

  const searchableSections = [
    {
      name: "consultations",
      table: consultationTable,
      empty: consultationsEmpty
    },
    {
      name: "clients",
      table: clientsTable,
      empty: clientsEmpty
    },
    {
      name: "documents",
      table: documentsTable,
      empty: documentsEmpty
    }
  ];

  function clearGlobalSearchFilters() {
    if (consultationSearch) consultationSearch.value = "";
    if (clientSearch) clientSearch.value = "";
    if (documentSearch) documentSearch.value = "";

    if (consultationStatusFilter) {
      consultationStatusFilter.value = "all";
    }

    if (clientTypeFilter) {
      clientTypeFilter.value = "all";
    }

    if (documentTypeFilter) {
      documentTypeFilter.value = "all";
    }

    filterConsultations();
    filterClients();
    filterDocuments();
  }

  function performGlobalSearch(searchValue) {
    const value = searchValue.trim().toLowerCase();

    if (!value) {
      clearGlobalSearchFilters();
      return;
    }

    let firstMatchingSection = null;

    searchableSections.forEach((section) => {
      if (!section.table) return;

      const visibleCount = filterTableRows(
        section.table,
        value
      );

      updateEmptyState(section.empty, visibleCount);

      if (visibleCount > 0 && !firstMatchingSection) {
        firstMatchingSection = section.name;
      }
    });

    // Navigate to the first section containing a match.
    if (firstMatchingSection) {
      showSection(firstMatchingSection);
    }
  }

  if (globalSearch) {
    globalSearch.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        performGlobalSearch(globalSearch.value);
      }
    });

    globalSearch.addEventListener("input", () => {
      if (!globalSearch.value.trim()) {
        clearGlobalSearchFilters();
      }
    });
  }

  /* =======================================================
     14. NOTIFICATION MANAGEMENT
     ======================================================= */

  const notificationList = document.getElementById(
    "dashboard-notification-list"
  );

  const markAllNotifications = document.getElementById(
    "mark-all-notifications"
  );

  const notificationTrigger = document.getElementById(
    "dashboard-notification-trigger"
  );

  function updateNotificationCount() {
    const unreadCount = document.querySelectorAll(
      ".notification-item.unread"
    ).length;

    document.querySelectorAll(".notification-count").forEach(
      (badge) => {
        badge.textContent = unreadCount;
        badge.hidden = unreadCount === 0;
      }
    );

    const notificationDot = document.querySelector(
      ".notification-dot"
    );

    if (notificationDot) {
      notificationDot.hidden = unreadCount === 0;
    }

    if (markAllNotifications) {
      markAllNotifications.disabled = unreadCount === 0;
    }
  }

  if (notificationList) {
    notificationList.addEventListener("click", (event) => {
      const readButton = event.target.closest(
        ".notification-read-btn"
      );

      if (!readButton) return;

      const notification = readButton.closest(
        ".notification-item"
      );

      if (!notification) return;

      if (notification.classList.contains("unread")) {
        notification.classList.remove("unread");
        updateNotificationCount();
        showToast("Notification marked as read.");
      }
    });
  }

  if (markAllNotifications) {
    markAllNotifications.addEventListener("click", () => {
      document.querySelectorAll(
        ".notification-item.unread"
      ).forEach((item) => {
        item.classList.remove("unread");
      });

      updateNotificationCount();

      showToast("All notifications marked as read.");
    });
  }

  if (notificationTrigger) {
    notificationTrigger.addEventListener("click", () => {
      showSection("notifications");
    });
  }

  updateNotificationCount();

  /* =======================================================
     15. ADD CLIENT BUTTON
     ======================================================= */

  const addClientButton = document.getElementById(
    "add-client-btn"
  );

  if (addClientButton) {
    addClientButton.addEventListener("click", () => {
      openModal(
        "Add New Client",
        "Client registration requires a connected backend and database. The current dashboard is using sample data, so no client has been created."
      );
    });
  }

  /* =======================================================
     16. ADD TEAM MEMBER BUTTON
     ======================================================= */

  const addTeamButton = document.getElementById(
    "add-team-member-btn"
  );

  if (addTeamButton) {
    addTeamButton.addEventListener("click", () => {
      openModal(
        "Add Team Member",
        "Team member creation requires backend authentication and database integration. No team member has been added."
      );
    });
  }

  /* =======================================================
     17. CLIENT VIEW ACTION
     ======================================================= */

  document.addEventListener("click", (event) => {
    const viewButton = event.target.closest(
      '[data-action="view"][data-client]'
    );

    if (!viewButton) return;

    const clientName = viewButton.dataset.client;

    openModal(
      "Client Information",
      `You selected ${clientName}. Detailed client records will be available after connecting the client database.`
    );
  });

  /* =======================================================
     18. DOCUMENT UPLOAD
     ======================================================= */

  const uploadDocumentButton = document.getElementById(
    "upload-document-btn"
  );

  const fileInput = document.getElementById(
    "dashboard-file-input"
  );

  if (uploadDocumentButton && fileInput) {
    uploadDocumentButton.addEventListener("click", () => {
      fileInput.click();
    });

    fileInput.addEventListener("change", () => {
      const selectedFile = fileInput.files
        ? fileInput.files[0]
        : null;

      if (!selectedFile) return;

      showToast(`Selected file: ${selectedFile.name}`);

      openModal(
        "Document Selected",
        `${selectedFile.name} has been selected. The file is not uploaded yet. Secure document storage requires a backend upload endpoint.`
      );

      // Allow selecting the same file again.
      fileInput.value = "";
    });
  }

  /* =======================================================
     19. REPORT PERIOD FILTER
     ======================================================= */

  const reportPeriod = document.getElementById(
    "report-period"
  );

  function updateReportPeriod() {
    if (!reportPeriod) return;

    const chartColumns = document.querySelectorAll(
      ".report-chart-column"
    );

    const selectedPeriod = reportPeriod.value;

    chartColumns.forEach((column, index) => {
      if (selectedPeriod === "six") {
        column.hidden = index < 6;
      } else {
        column.hidden = false;
      }
    });
  }

  if (reportPeriod) {
    reportPeriod.addEventListener(
      "change",
      updateReportPeriod
    );

    updateReportPeriod();
  }

  /* =======================================================
     20. CSV EXPORT HELPER
     ======================================================= */

  function escapeCSVValue(value) {
    const text = String(value ?? "")
      .replace(/\s+/g, " ")
      .trim();

    return `"${text.replace(/"/g, '""')}"`;
  }

  function downloadCSV(filename, rows) {
    if (!rows || !rows.length) {
      showToast("There is no data available to export.");
      return;
    }

    const csvContent = rows
      .map((row) => row.map(escapeCSVValue).join(","))
      .join("\r\n");

    // Add UTF-8 BOM for spreadsheet compatibility.
    const csvBlob = new Blob(
      ["\uFEFF" + csvContent],
      {
        type: "text/csv;charset=utf-8;"
      }
    );

    const downloadURL = URL.createObjectURL(csvBlob);

    const downloadLink = document.createElement("a");

    downloadLink.href = downloadURL;
    downloadLink.download = filename;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    URL.revokeObjectURL(downloadURL);

    showToast("CSV report downloaded successfully.");
  }

  function getTableCSVRows(table) {
    if (!table) return [];

    const rows = [];

    const headerCells = table.querySelectorAll("thead th");

    if (headerCells.length) {
      rows.push(
        Array.from(headerCells).map((cell) => cell.textContent)
      );
    }

    table.querySelectorAll("tbody tr").forEach((row) => {
      if (row.hidden) return;

      const cells = Array.from(row.cells).map((cell) => {
        return cell.textContent.trim();
      });

      rows.push(cells);
    });

    return rows;
  }

  /* =======================================================
     21. EXPORT OVERVIEW
     ======================================================= */

  const exportOverviewButton = document.getElementById(
    "dashboard-export-overview"
  );

  if (exportOverviewButton) {
    exportOverviewButton.addEventListener("click", () => {
      const overviewRows = [
        ["LEXORA AGENCY DASHBOARD"],
        ["Report Generated", new Date().toLocaleString()],
        [],
        ["Metric", "Value"],
        ["Total Consultations", "248"],
        ["Active Clients", "186"],
        ["Pending Requests", "24"],
        ["Team Members", "12"],
        [],
        ["Recent Consultation Details"]
      ];

      const consultationRows = getTableCSVRows(
        document.querySelector(
          "#overview .dashboard-table"
        )
      );

      const combinedRows = [
        ...overviewRows,
        ...consultationRows
      ];

      downloadCSV(
        "LEXORA-Agency-Overview.csv",
        combinedRows
      );
    });
  }

  /* =======================================================
     22. EXPORT REPORT
     ======================================================= */

  const exportReportButton = document.getElementById(
    "dashboard-export-report"
  );

  if (exportReportButton) {
    exportReportButton.addEventListener("click", () => {
      const reportRows = [
        ["LEXORA PERFORMANCE REPORT"],
        ["Generated Date", new Date().toLocaleString()],
        [],
        ["Performance Metric", "Value"],
        ["Total Consultations", "248"],
        ["New Clients", "36"],
        ["Completed Cases", "92"],
        [],
        ["Month", "Consultation Activity"]
      ];

      const chartColumns = document.querySelectorAll(
        ".report-chart-column"
      );

      chartColumns.forEach((column) => {
        if (column.hidden) return;

        const month = column.querySelector("small");
        const bar = column.querySelector(".chart-bar");

        if (!month || !bar) return;

        const height = parseFloat(
          bar.style.getPropertyValue("--bar-height")
        );

        const estimatedActivity = Number.isFinite(height)
          ? Math.round(height)
          : 0;

        reportRows.push([
          month.textContent.trim(),
          estimatedActivity
        ]);
      });

      downloadCSV(
        "LEXORA-Performance-Report.csv",
        reportRows
      );
    });
  }

  /* =======================================================
     23. AGENCY PROFILE FORM VALIDATION
     ======================================================= */

  const profileForm = document.getElementById(
    "agency-profile-form"
  );

  const profileStatus = document.getElementById(
    "agency-profile-status"
  );

  if (profileForm) {
    profileForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const agencyName = document.getElementById(
        "agency-name"
      );

      const agencyEmail = document.getElementById(
        "agency-email"
      );

      const agencyPhone = document.getElementById(
        "agency-phone"
      );

      const agencyWebsite = document.getElementById(
        "agency-website"
      );

      let isValid = true;
      let firstInvalidField = null;

      const fields = [
        agencyName,
        agencyEmail,
        agencyPhone
      ];

      fields.forEach((field) => {
        if (!field) return;

        field.setCustomValidity("");

        if (!field.value.trim()) {
          field.setCustomValidity("This field is required.");
          isValid = false;

          if (!firstInvalidField) {
            firstInvalidField = field;
          }
        }
      });

      if (
        agencyEmail &&
        agencyEmail.value.trim() &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          agencyEmail.value.trim()
        )
      ) {
        agencyEmail.setCustomValidity(
          "Please enter a valid email address."
        );

        isValid = false;

        if (!firstInvalidField) {
          firstInvalidField = agencyEmail;
        }
      }

      if (
        agencyPhone &&
        agencyPhone.value.trim() &&
        !/^[+\d\s()-]{7,20}$/.test(
          agencyPhone.value.trim()
        )
      ) {
        agencyPhone.setCustomValidity(
          "Please enter a valid phone number."
        );

        isValid = false;

        if (!firstInvalidField) {
          firstInvalidField = agencyPhone;
        }
      }

      if (
        agencyWebsite &&
        agencyWebsite.value.trim()
      ) {
        try {
          const websiteURL = new URL(
            agencyWebsite.value.trim()
          );

          if (
            !["http:", "https:"].includes(websiteURL.protocol)
          ) {
            throw new Error("Invalid website protocol");
          }
        } catch {
          agencyWebsite.setCustomValidity(
            "Please enter a valid website URL."
          );

          isValid = false;

          if (!firstInvalidField) {
            firstInvalidField = agencyWebsite;
          }
        }
      }

      if (!isValid) {
        if (profileStatus) {
          profileStatus.textContent =
            "Please correct the highlighted information.";
          profileStatus.style.color = "#C84B4B";
        }

        if (firstInvalidField) {
          firstInvalidField.reportValidity();
          firstInvalidField.focus();
        }

        return;
      }

      if (profileStatus) {
        profileStatus.textContent =
          "Validation successful. Backend integration is required to permanently save these changes.";

        profileStatus.style.color = "#16865B";
      }

      showToast("Profile information validated successfully.");
    });

    // Clear custom validation messages when the user edits a field.
    profileForm.querySelectorAll("input, textarea").forEach(
      (field) => {
        field.addEventListener("input", () => {
          field.setCustomValidity("");

          if (profileStatus) {
            profileStatus.textContent = "";
          }
        });
      }
    );
  }

  /* =======================================================
     24. LOGOUT BUTTON
     ======================================================= */

  const logoutButton = document.getElementById(
    "dashboard-logout-btn"
  );

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      closeUserDropdown();

      openModal(
        "Authentication Required",
        "The logout action is not connected yet. Please integrate your authentication backend to securely end the current session."
      );
    });
  }

  /* =======================================================
     25. RESPONSIVE SIDEBAR
     ======================================================= */

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeSidebar();
    }
  });

  /* =======================================================
     26. INITIAL DASHBOARD STATE
     ======================================================= */

  filterConsultations();
  filterClients();
  filterDocuments();

  updateNotificationCount();
  refreshIcons();

  console.log(
    "LEXORA Agency Dashboard JavaScript initialized successfully."
  );

});


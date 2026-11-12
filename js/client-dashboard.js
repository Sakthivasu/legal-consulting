
/* =========================================================
   LEXORA LEGAL & ADVISORY
   CLIENT DASHBOARD JAVASCRIPT
   ========================================================= */

"use strict";

/* ================= DOM READY ================= */

document.addEventListener("DOMContentLoaded", () => {
  initClientDashboard();
});

function initClientDashboard() {
  initDashboardNavigation();
  initMobileSidebar();
  initUserDropdown();
  initConsultationFilters();
  initDocumentFeatures();
  initNotifications();
  initProfileForm();
  initSettings();
  initDashboardModal();
  initGlobalSearch();
  initLogout();
  initDashboardFooter();
}

/* ================= HELPER FUNCTIONS ================= */

const clientDashboard = {
  select(selector, parent = document) {
    return parent.querySelector(selector);
  },

  selectAll(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
  },

  showToast(message) {
    const toast = this.select("#dashboard-toast");
    const toastMessage = this.select("#dashboard-toast-message");

    if (!toast || !toastMessage) {
      console.info(message);
      return;
    }

    toastMessage.textContent = message;
    toast.classList.add("show");

    clearTimeout(toast._timer);

    toast._timer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  },

  openModal(title, message) {
    const modal = this.select("#dashboard-modal");
    const modalTitle = this.select("#dashboard-modal-title");
    const modalMessage = this.select("#dashboard-modal-message");

    if (!modal) {
      this.showToast(message);
      return;
    }

    if (modalTitle) modalTitle.textContent = title;
    if (modalMessage) modalMessage.textContent = message;

    modal.hidden = false;
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
  },

  closeModal() {
    const modal = this.select("#dashboard-modal");

    if (!modal) return;

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    setTimeout(() => {
      if (!modal.classList.contains("active")) {
        modal.hidden = true;
      }
    }, 250);
  }
};

/* ================= DASHBOARD NAVIGATION ================= */

function initDashboardNavigation() {
  const navLinks = clientDashboard.selectAll(
    "[data-dashboard-section]"
  );

  const sections = clientDashboard.selectAll(
    "[data-dashboard-panel]"
  );

  const currentPage = clientDashboard.select(
    "#dashboard-current-page"
  );

  if (!navLinks.length || !sections.length) return;

  function activateSection(sectionId) {
    const targetSection = clientDashboard.select(
      `[data-dashboard-panel="${sectionId}"]`
    );

    if (!targetSection) return;

    navLinks.forEach(link => {
      const isActive =
        link.dataset.dashboardSection === sectionId;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    sections.forEach(section => {
      const isActive =
        section.dataset.dashboardPanel === sectionId;

      section.hidden = !isActive;
      section.classList.toggle("active", isActive);
    });

    const activeLink = navLinks.find(
      link => link.dataset.dashboardSection === sectionId
    );

    if (currentPage && activeLink) {
      currentPage.textContent =
        activeLink.dataset.pageTitle ||
        activeLink.textContent.trim();
    }

    closeMobileSidebar();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  navLinks.forEach(link => {
    link.addEventListener("click", event => {
      const sectionId = link.dataset.dashboardSection;

      if (!sectionId) return;

      const targetSection = clientDashboard.select(
        `[data-dashboard-panel="${sectionId}"]`
      );

      if (!targetSection) return;

      event.preventDefault();

      activateSection(sectionId);

      if (history.replaceState) {
        history.replaceState(null, "", `#${sectionId}`);
      }
    });
  });

  // Quick action links can navigate to dashboard sections.
  clientDashboard.selectAll(
    "[data-dashboard-go]"
  ).forEach(button => {
    button.addEventListener("click", () => {
      const sectionId = button.dataset.dashboardGo;

      if (sectionId) {
        activateSection(sectionId);
      }
    });
  });

  // Open the correct section if the URL contains a valid hash.
  const initialSection = window.location.hash.replace("#", "");

  if (
    initialSection &&
    clientDashboard.select(
      `[data-dashboard-panel="${initialSection}"]`
    )
  ) {
    activateSection(initialSection);
  }
}

/* ================= MOBILE SIDEBAR ================= */

function initMobileSidebar() {
  const sidebar = clientDashboard.select("#dashboard-sidebar");
  const overlay = clientDashboard.select("#dashboard-overlay");
  const menuToggle = clientDashboard.select("#dashboard-menu-toggle");
  const closeButton = clientDashboard.select("#dashboard-sidebar-close");

  if (!sidebar) return;

  function openSidebar() {
    sidebar.classList.add("active");

    if (overlay) {
      overlay.classList.add("active");
      overlay.setAttribute("aria-hidden", "false");
    }

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "true");
    }

    document.body.style.overflow = "hidden";
  }

  if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", () => {
      if (sidebar.classList.contains("active")) {
        closeMobileSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (closeButton) {
    closeButton.addEventListener("click", closeMobileSidebar);
  }

  if (overlay) {
    overlay.addEventListener("click", closeMobileSidebar);
  }

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeMobileSidebar();
      closeUserDropdown();
      clientDashboard.closeModal();
    }
  });
}

function closeMobileSidebar() {
  const sidebar = clientDashboard.select("#dashboard-sidebar");
  const overlay = clientDashboard.select("#dashboard-overlay");
  const menuToggle = clientDashboard.select("#dashboard-menu-toggle");

  if (sidebar) sidebar.classList.remove("active");

  if (overlay) {
    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");
  }

  if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", "false");
  }

  if (!clientDashboard.select("#dashboard-modal.active")) {
    document.body.style.overflow = "";
  }
}

/* ================= USER DROPDOWN ================= */

function initUserDropdown() {
  const trigger = clientDashboard.select("#dashboard-user-trigger");
  const dropdown = clientDashboard.select("#dashboard-user-dropdown");

  if (!trigger || !dropdown) return;

  trigger.setAttribute("aria-expanded", "false");

  function toggleDropdown() {
    const isOpen = dropdown.classList.toggle("active");

    trigger.setAttribute("aria-expanded", String(isOpen));
  }

  trigger.addEventListener("click", event => {
    event.stopPropagation();
    toggleDropdown();
  });

  dropdown.addEventListener("click", event => {
    event.stopPropagation();
  });

  document.addEventListener("click", closeUserDropdown);
}

function closeUserDropdown() {
  const trigger = clientDashboard.select("#dashboard-user-trigger");
  const dropdown = clientDashboard.select("#dashboard-user-dropdown");

  if (!trigger || !dropdown) return;

  dropdown.classList.remove("active");
  trigger.setAttribute("aria-expanded", "false");
}

/* ================= CONSULTATION SEARCH AND FILTER ================= */

function initConsultationFilters() {
  const searchInput = clientDashboard.select(
    "#client-consultation-search"
  );

  const statusFilter = clientDashboard.select(
    "#client-consultation-filter"
  );

  const table = clientDashboard.select(
    "#client-consultations-table"
  );

  const emptyState = clientDashboard.select(
    "#client-consultations-empty"
  );

  if (!table) return;

  const rows = clientDashboard.selectAll(
    "tbody tr",
    table
  );

  function filterConsultations() {
    const searchValue = searchInput
      ? searchInput.value.toLowerCase().trim()
      : "";

    const selectedStatus = statusFilter
      ? statusFilter.value.toLowerCase()
      : "all";

    let visibleCount = 0;

    rows.forEach(row => {
      const rowText = row.textContent.toLowerCase();

      const rowStatus = (
        row.dataset.status || ""
      ).toLowerCase();

      const matchesSearch =
        rowText.includes(searchValue);

      const matchesStatus =
        selectedStatus === "all" ||
        rowStatus === selectedStatus;

      const isVisible =
        matchesSearch && matchesStatus;

      row.hidden = !isVisible;

      if (isVisible) visibleCount++;
    });

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }
  }

  if (searchInput) {
    searchInput.addEventListener(
      "input",
      filterConsultations
    );
  }

  if (statusFilter) {
    statusFilter.addEventListener(
      "change",
      filterConsultations
    );
  }

  filterConsultations();
}

/* ================= DOCUMENT FEATURES ================= */

function initDocumentFeatures() {
  const searchInput = clientDashboard.select(
    "#client-document-search"
  );

  const filterSelect = clientDashboard.select(
    "#client-document-filter"
  );

  const documentList = clientDashboard.select(
    "#client-document-list"
  );

  const emptyState = clientDashboard.select(
    "#client-documents-empty"
  );

  const uploadButton = clientDashboard.select(
    "#client-upload-document-btn"
  );

  if (documentList) {
    const documentItems = clientDashboard.selectAll(
      ".client-document-item",
      documentList
    );

    function filterDocuments() {
      const searchValue = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

      const selectedType = filterSelect
        ? filterSelect.value.toLowerCase()
        : "all";

      let visibleCount = 0;

      documentItems.forEach(item => {
        const itemText = item.textContent.toLowerCase();

        const fileType = (
          item.dataset.type ||
          item.querySelector(".document-file-icon")?.className ||
          ""
        ).toLowerCase();

        const matchesSearch =
          itemText.includes(searchValue);

        const matchesType =
          selectedType === "all" ||
          fileType.includes(selectedType);

        const visible =
          matchesSearch && matchesType;

        item.hidden = !visible;

        if (visible) visibleCount++;
      });

      if (emptyState) {
        emptyState.hidden = visibleCount !== 0;
      }
    }

    if (searchInput) {
      searchInput.addEventListener(
        "input",
        filterDocuments
      );
    }

    if (filterSelect) {
      filterSelect.addEventListener(
        "change",
        filterDocuments
      );
    }

    filterDocuments();
  }

  // Create a file input if the HTML does not already contain one.
  let fileInput = clientDashboard.select(
    "#client-document-file-input"
  );

  if (!fileInput && uploadButton) {
    fileInput = document.createElement("input");

    fileInput.type = "file";
    fileInput.id = "client-document-file-input";
    fileInput.accept = ".pdf,.doc,.docx";
    fileInput.hidden = true;

    document.body.appendChild(fileInput);
  }

  if (uploadButton && fileInput) {
    uploadButton.addEventListener("click", () => {
      fileInput.click();
    });

    fileInput.addEventListener("change", () => {
      const file = fileInput.files?.[0];

      if (!file) return;

      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];

      const allowedExtensions = /\.(pdf|doc|docx)$/i;

      if (
        !allowedTypes.includes(file.type) &&
        !allowedExtensions.test(file.name)
      ) {
        clientDashboard.showToast(
          "Please select a PDF, DOC or DOCX file."
        );

        fileInput.value = "";
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        clientDashboard.showToast(
          "File size must be less than 10 MB."
        );

        fileInput.value = "";
        return;
      }

      clientDashboard.showToast(
        `${file.name} selected. Connect a backend to upload it securely.`
      );

      fileInput.value = "";
    });
  }

  // Document action buttons.
  if (documentList) {
    documentList.addEventListener("click", event => {
      const actionButton = event.target.closest(
        ".table-action-btn"
      );

      if (!actionButton) return;

      const documentItem = actionButton.closest(
        ".client-document-item"
      );

      const documentName =
        documentItem?.querySelector(
          ".client-document-details strong"
        )?.textContent.trim() || "Document";

      clientDashboard.showToast(
        `${documentName}: Connect secure document storage to enable downloads.`
      );
    });
  }
}

/* ================= NOTIFICATIONS ================= */

function initNotifications() {
  const notificationList = clientDashboard.select(
    "#client-notification-list"
  );

  const markAllButton = clientDashboard.select(
    "#client-mark-all-read"
  );

  if (!notificationList) return;

  function updateNotificationState(notification) {
    notification.classList.remove("unread");

    const readButton = notification.querySelector(
      ".notification-read-btn"
    );

    if (readButton) {
      readButton.setAttribute("aria-label", "Notification read");
      readButton.disabled = true;
    }

    updateUnreadCount();
  }

  function updateUnreadCount() {
    const unreadCount = notificationList.querySelectorAll(
      ".dashboard-notification.unread"
    ).length;

    const countElements = clientDashboard.selectAll(
      "[data-unread-count]"
    );

    countElements.forEach(element => {
      element.textContent = unreadCount;
      element.hidden = unreadCount === 0;
    });
  }

  notificationList.addEventListener("click", event => {
    const readButton = event.target.closest(
      ".notification-read-btn"
    );

    if (!readButton) return;

    const notification = readButton.closest(
      ".dashboard-notification"
    );

    if (notification) {
      updateNotificationState(notification);
      clientDashboard.showToast("Notification marked as read.");
    }
  });

  if (markAllButton) {
    markAllButton.addEventListener("click", () => {
      const unreadNotifications = notificationList.querySelectorAll(
        ".dashboard-notification.unread"
      );

      if (!unreadNotifications.length) {
        clientDashboard.showToast(
          "You have no unread notifications."
        );
        return;
      }

      unreadNotifications.forEach(notification => {
        updateNotificationState(notification);
      });

      clientDashboard.showToast(
        "All notifications marked as read."
      );
    });
  }

  updateUnreadCount();
}

/* ================= PROFILE FORM ================= */

function initProfileForm() {
  const profileForm = clientDashboard.select(
    "#client-profile-form"
  );

  const statusMessage = clientDashboard.select(
    "#client-profile-status"
  );

  if (!profileForm) return;

  profileForm.addEventListener("submit", event => {
    event.preventDefault();

    if (!profileForm.checkValidity()) {
      profileForm.reportValidity();
      return;
    }

    const formData = new FormData(profileForm);

    const firstName =
      formData.get("firstName") ||
      clientDashboard.select("#client-first-name")?.value;

    const lastName =
      formData.get("lastName") ||
      clientDashboard.select("#client-last-name")?.value;

    const email =
      formData.get("email") ||
      clientDashboard.select("#client-email")?.value;

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))
    ) {
      if (statusMessage) {
        statusMessage.textContent =
          "Please enter a valid email address.";

        statusMessage.classList.add("error");
      }

      return;
    }

    const fullName = [
      firstName,
      lastName
    ].filter(Boolean).join(" ").trim();

    const userName = clientDashboard.select(
      ".dashboard-user-details strong"
    );

    if (userName && fullName) {
      userName.textContent = fullName;
    }

    if (statusMessage) {
      statusMessage.textContent =
        "Profile validated. Connect your backend to save these changes.";

      statusMessage.classList.remove("error");
    }

    clientDashboard.showToast(
      "Profile details validated successfully."
    );
  });
}

/* ================= SETTINGS ================= */

function initSettings() {
  const saveButton = clientDashboard.select(
    "#save-client-settings"
  );

  const statusMessage = clientDashboard.select(
    "#client-settings-status"
  );

  const changePasswordButton = clientDashboard.select(
    "#client-change-password-btn"
  );

  if (saveButton) {
    saveButton.addEventListener("click", () => {
      const settingIds = [
        "#setting-consultations",
        "#setting-documents",
        "#setting-announcements"
      ];

      const settings = {};

      settingIds.forEach(selector => {
        const checkbox = clientDashboard.select(selector);

        if (checkbox) {
          settings[selector] = checkbox.checked;
        }
      });

      console.info(
        "Client notification preferences:",
        settings
      );

      if (statusMessage) {
        statusMessage.textContent =
          "Preferences validated. Connect a backend to save them permanently.";

        statusMessage.classList.remove("error");
      }

      clientDashboard.showToast(
        "Settings preferences updated for this session."
      );
    });
  }

  if (changePasswordButton) {
    changePasswordButton.addEventListener("click", () => {
      clientDashboard.openModal(
        "Change Password",
        "Password changes require a secure backend authentication endpoint. Please connect your authentication system before enabling this feature."
      );
    });
  }

  const settingsLogout = clientDashboard.select(
    "#client-settings-logout"
  );

  if (settingsLogout) {
    settingsLogout.addEventListener("click", () => {
      confirmLogout();
    });
  }
}

/* ================= MODAL ================= */

function initDashboardModal() {
  const modal = clientDashboard.select("#dashboard-modal");

  if (!modal) return;

  const closeButtons = clientDashboard.selectAll(
    "[data-modal-close]",
    modal
  );

  closeButtons.forEach(button => {
    button.addEventListener("click", () => {
      clientDashboard.closeModal();
    });
  });

  modal.addEventListener("click", event => {
    if (
      event.target.classList.contains(
        "dashboard-modal-backdrop"
      )
    ) {
      clientDashboard.closeModal();
    }
  });
}

/* ================= GLOBAL SEARCH ================= */

function initGlobalSearch() {
  const searchInput = clientDashboard.select(
    "#dashboard-global-search"
  );

  if (!searchInput) return;

  searchInput.addEventListener("keydown", event => {
    if (event.key !== "Enter") return;

    const query = searchInput.value.trim().toLowerCase();

    if (!query) return;

    const sections = clientDashboard.selectAll(
      "[data-dashboard-panel]"
    );

    let matchedSection = null;

    sections.forEach(section => {
      if (matchedSection) return;

      const text = section.textContent.toLowerCase();

      if (text.includes(query)) {
        matchedSection = section;
      }
    });

    if (matchedSection) {
      const sectionId =
        matchedSection.dataset.dashboardPanel;

      const matchingLink = clientDashboard.select(
        `[data-dashboard-section="${sectionId}"]`
      );

      if (matchingLink) {
        matchingLink.click();
        clientDashboard.showToast(
          "Matching dashboard section opened."
        );
      }
    } else {
      clientDashboard.showToast(
        "No matching information found in the dashboard."
      );
    }
  });
}

/* ================= LOGOUT ================= */

function initLogout() {
  const logoutButton = clientDashboard.select(
    "#dashboard-logout-btn"
  );

  if (logoutButton) {
    logoutButton.addEventListener("click", event => {
      event.preventDefault();
      confirmLogout();
    });
  }
}

function confirmLogout() {
  clientDashboard.openModal(
    "Logout Confirmation",
    "You are about to leave the client dashboard. Connect your authentication system to perform a secure logout."
  );

  const modal = clientDashboard.select("#dashboard-modal");

  if (!modal) return;

  const actions = modal.querySelector(
    ".dashboard-modal-actions"
  );

  if (!actions) return;

  actions.innerHTML = `
    <button type="button" class="btn btn-outline" data-modal-close>
      Cancel
    </button>
    <button type="button" class="btn btn-primary" id="confirm-client-logout">
      Continue
    </button>
  `;

  actions.querySelectorAll("[data-modal-close]").forEach(button => {
    button.addEventListener("click", () => {
      clientDashboard.closeModal();
    });
  });

  const confirmButton = clientDashboard.select(
    "#confirm-client-logout"
  );

  if (confirmButton) {
    confirmButton.addEventListener("click", () => {
      clientDashboard.closeModal();

      clientDashboard.showToast(
        "Secure logout is not connected yet. Add your authentication endpoint."
      );
    });
  }
}

/* ================= FOOTER YEAR ================= */

function initDashboardFooter() {
  const yearElement = clientDashboard.select(
    "#dashboard-current-year"
  );

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}


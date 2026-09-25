document.addEventListener("DOMContentLoaded", function () {

  loadHeader();
  initScrollReveal();
  initToast();
  updateFooterYear();

});

function loadHeader() {

  const headerPlaceholder = document.getElementById("header-placeholder");

  if (!headerPlaceholder) {
    return;
  }

  fetch("header.html")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Header loading failed");
      }
      return response.text();
    })
    .then(function (data) {

      headerPlaceholder.innerHTML = data;

      setActiveNavLink();
      initMobileNav();
      initNotification();

    })
    .catch(function (error) {
      console.error("Error rendering header:", error);
    });

}

function setActiveNavLink() {

  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".main-nav a");

  navLinks.forEach(function (link) {

    link.classList.remove("active");

    const linkHref = link.getAttribute("href");

    if (
      currentPath.endsWith(linkHref) ||
      (currentPath === "/" && linkHref === "index.html")
    ) {
      // link.classList.add("active");
    }

  });

}
function initNotification() {

  const bellBtn = document.getElementById("bellBtn");
  const notificationPanel = document.getElementById("notificationPanel");
  const notificationClose = document.getElementById("notificationClose");

  if (!bellBtn || !notificationPanel) {
    return;
  }

  bellBtn.onclick = function (event) {

    event.preventDefault();
    event.stopPropagation();

    notificationPanel.classList.toggle("show");

  };

  if (notificationClose) {

    notificationClose.onclick = function (event) {

      event.preventDefault();
      event.stopPropagation();

      notificationPanel.classList.remove("show");

    };

  }

  document.addEventListener("click", function (event) {

    if (
      !notificationPanel.contains(event.target) &&
      !bellBtn.contains(event.target)
    ) {
      notificationPanel.classList.remove("show");
    }

  });

}

function initScrollReveal() {

  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {

    const observer = new IntersectionObserver(
      function (entries) {

        entries.forEach(function (entry) {

          if (entry.isIntersecting) {

            entry.target.classList.add("in");
            observer.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealEls.forEach(function (element) {
      observer.observe(element);
    });

  } else {

    revealEls.forEach(function (element) {
      element.classList.add("in");
    });

  }

}

function initToast() {

  const toastEl = document.getElementById("mkToast");

  if (!toastEl) {
    return;
  }

  if (sessionStorage.getItem("mk_toast_seen")) {
    return;
  }

  setTimeout(function () {

    toastEl.classList.add("show");
    sessionStorage.setItem("mk_toast_seen", "1");

  }, 1600);

  const closeBtn = toastEl.querySelector(".mk-toast-close");

  if (closeBtn) {

    closeBtn.onclick = function () {
      toastEl.classList.remove("show");
    };

  }

  setTimeout(function () {
    toastEl.classList.remove("show");
  }, 11000);

}

function updateFooterYear() {

  document.querySelectorAll(".js-year").forEach(function (element) {

    element.textContent = new Date().getFullYear();

  });

}

function initMobileNav() {

  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  if (!navToggle || !mainNav) {
    return;
  }

  navToggle.onclick = function (event) {

    event.preventDefault();
    event.stopPropagation();

    const isOpen = mainNav.getAttribute("data-menu-open") === "true";

    if (isOpen) {

      mainNav.setAttribute("data-menu-open", "false");
      mainNav.style.display = "none";
      navToggle.classList.remove("menu-open");

    } else {

      mainNav.setAttribute("data-menu-open", "true");

      mainNav.style.cssText += `
        display:flex !important;
        flex-direction:column !important;
        position:absolute !important;
        top:100% !important;
        left:0 !important;
        right:0 !important;
        width:100% !important;
        height:auto !important;
        background:#fff !important;
        padding:15px 20px !important;
        margin:0 !important;
        gap:0 !important;
        z-index:999999 !important;
        visibility:visible !important;
        opacity:1 !important;
        pointer-events:auto !important;
        box-shadow:0 12px 30px rgba(0,0,0,0.15) !important;
      `;

      const links = mainNav.querySelectorAll("a");

      links.forEach(function (link) {

        link.style.cssText += `
          display:block !important;
          width:100% !important;
          padding:14px 5px !important;
          color:#1f2937 !important;
          visibility:visible !important;
          opacity:1 !important;
          pointer-events:auto !important;
          cursor:pointer !important;
        `;

      });

      navToggle.classList.add("menu-open");

    }

  };

}

function trackWebsiteVisit() {

    fetch(
        API_BASE_URL +
        "/mkcarrer/visit?pageUrl=" +
        encodeURIComponent(window.location.pathname),
        {
            method: "POST"
        }
    ).catch(function (error) {
        console.error("Visitor tracking failed:", error);
    });

}
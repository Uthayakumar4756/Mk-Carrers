document.addEventListener("DOMContentLoaded", function () {

    if (localStorage.getItem("mkLogin") !== "true") {
        window.location.href = "login.html";
        return;
    }

    const username =
        localStorage.getItem("mkUsername") || "Admin";

    const role =
        localStorage.getItem("mkRole") || "Administrator";

    const sidebarUsername =
        document.getElementById("sidebarUsername");

    const sidebarRole =
        document.getElementById("sidebarRole");

    const topUsername =
        document.getElementById("topUsername");

    const sidebarAvatar =
        document.getElementById("sidebarAvatar");

    if (sidebarUsername) {
        sidebarUsername.textContent = username;
    }

    if (sidebarRole) {
        sidebarRole.textContent = role;
    }

    if (topUsername) {
        topUsername.textContent = username;
    }

    if (sidebarAvatar) {
        sidebarAvatar.textContent =
            username.charAt(0).toUpperCase();
    }

    setupLogout();
    setupMobileMenu();

});

function setupLogout() {

    const logoutButton =
        document.getElementById("logoutButton");

    if (!logoutButton) {
        return;
    }

    logoutButton.addEventListener("click", function () {

        localStorage.removeItem("mkLogin");
        localStorage.removeItem("mkUserId");
        localStorage.removeItem("mkUsername");
        localStorage.removeItem("mkRole");

        window.location.href = "login.html";

    });

}

function setupMobileMenu() {

    const button =
        document.getElementById("mobileMenuButton");

    const sidebar =
        document.getElementById("sidebar");

    const overlay =
        document.getElementById("mobileOverlay");

    if (!button || !sidebar || !overlay) {
        return;
    }

    button.addEventListener("click", function () {

        sidebar.classList.toggle("open");
        overlay.classList.toggle("show");

    });

    overlay.addEventListener("click", function () {

        sidebar.classList.remove("open");
        overlay.classList.remove("show");

    });

}
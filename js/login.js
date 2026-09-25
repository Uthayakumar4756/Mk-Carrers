document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const loginError = document.getElementById("loginError");
    const loginButton = document.getElementById("loginButton");
    const loginText = document.getElementById("loginText");
    const loginLoader = document.getElementById("loginLoader");
    const togglePassword = document.getElementById("togglePassword");

    if (!loginForm) {
        return;
    }

    togglePassword.addEventListener("click", function () {

        if (password.type === "password") {

            password.type = "text";
            togglePassword.textContent = "Hide";

        } else {

            password.type = "password";
            togglePassword.textContent = "Show";

        }

    });

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        loginError.style.display = "none";

        loginButton.disabled = true;
        loginText.style.display = "none";
        loginLoader.style.display = "block";

        try {

            const response = await fetch(
                API_BASE_URL + "/mkcarrer/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: username.value.trim(),
                        password: password.value
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Invalid username or password"
                );
            }

            localStorage.setItem("mkLogin", "true");
            localStorage.setItem("mkUserId", data.userId);
            localStorage.setItem("mkUsername", data.username);
            localStorage.setItem("mkRole", data.role);

            window.location.href = "dashboard.html";

        } catch (error) {

            loginError.textContent =
                error.message || "Unable to login";

            loginError.style.display = "block";

        } finally {

            loginButton.disabled = false;
            loginText.style.display = "inline";
            loginLoader.style.display = "none";

        }

    });

});

document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("registrationModal");

    if (!modal) return;

    modal.addEventListener("show.bs.modal", function () {
        const modalBody = document.getElementById("registrationModalBody");

        fetch("./registration.html")
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("registration.html not found");
                }
                return response.text();
            })
            .then(function (html) {
                modalBody.innerHTML = html;
                loadRegistrationScript();
            })
            .catch(function (error) {
                console.error("Registration loading error:", error);

                modalBody.innerHTML = `
                    <div class="alert alert-danger">
                        Unable to load registration form.
                    </div>
                `;
            });
    });
});

function loadRegistrationScript() {
    const form = document.getElementById("registrationForm");

    if (!form) return;

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const submitBtn = document.getElementById("submitBtn");

        submitBtn.disabled = true;
        submitBtn.innerText = "Saving...";

        const data = {
            fullName: document.getElementById("fullName").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            email: document.getElementById("email").value.trim(),
            grade: document.getElementById("grade").value,
            counsellingTopic: document.getElementById("counsellingTopic").value,
            message: document.getElementById("message").value.trim()
        };

        try {
            const response = await fetch(
                API_BASE_URL + "/mkcarrer/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            );

            if (!response.ok) {
                throw new Error("Registration API failed");
            }

            const result = await response.json();

            if (!result.success) {
                alert(result.message || "Registration failed.");
                submitBtn.disabled = false;
                submitBtn.innerText = "Book My Session";
                return;
            }

            localStorage.setItem("studentId", result.studentId);
            localStorage.setItem("studentName", data.fullName);

            const whatsappMessage =
                "New Counselling Registration%0A%0A" +
                "Name: " + encodeURIComponent(data.fullName) + "%0A" +
                "Phone: " + encodeURIComponent(data.phone) + "%0A" +
                "Email: " + encodeURIComponent(data.email || "Not provided") + "%0A" +
                "Grade: " + encodeURIComponent(data.grade) + "%0A" +
                "Topic: " + encodeURIComponent(data.counsellingTopic || "Not selected") + "%0A" +
                "Message: " + encodeURIComponent(data.message || "No message") + "%0A" +
                "Student ID: " + encodeURIComponent(result.studentId);

            const whatsappUrl =
                "https://wa.me/919500344960?text=" + whatsappMessage;

            document.getElementById("registrationModalBody").innerHTML = `
                <div class="text-center py-4">
                    <div class="mb-3">
                        <i class="bi bi-check-circle-fill text-success"
                           style="font-size: 60px;"></i>
                    </div>

                    <h4 class="text-success">Registration Successful!</h4>

                    <p class="text-muted">
                        Thank you, ${data.fullName}.
                        Our team will contact you shortly.
                    </p>

                    <a href="${whatsappUrl}"
                       target="_blank"
                       class="btn btn-success">
                        Send Details on WhatsApp
                    </a>

                    <button type="button"
                            class="btn btn-secondary ms-2"
                            data-bs-dismiss="modal">
                        Close
                    </button>
                </div>
            `;

        } catch (error) {
            console.error(error);

            alert("Unable to connect to server.");

            submitBtn.disabled = false;
            submitBtn.innerText = "Book My Session";
        }
    });
}

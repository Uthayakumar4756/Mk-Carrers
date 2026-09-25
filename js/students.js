document.addEventListener("DOMContentLoaded", function () {

    loadStudents();

    const refreshButton =
        document.getElementById("refreshStudents");

    if (refreshButton) {
        refreshButton.addEventListener(
            "click",
            loadStudents
        );
    }

});

async function loadStudents() {

    const tbody =
        document.getElementById("studentTableBody");

    const count =
        document.getElementById("studentCount");

    if (!tbody) {
        return;
    }

    tbody.innerHTML =
        '<tr><td colspan="7" class="loading">Loading students...</td></tr>';

    try {

        const response =
            await fetch(
                API_BASE_URL +
                "/mkcarrer/dashboard/students"
            );

        if (!response.ok) {
            throw new Error("Student API failed");
        }

        const students =
            await response.json();

        if (count) {
            count.textContent =
                students.length +
                " students found";
        }

        if (!students.length) {

            tbody.innerHTML =
                '<tr><td colspan="7" class="loading">No students found</td></tr>';

            return;
        }

        tbody.innerHTML = "";

        students.forEach(function (student) {

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>${student.id || "-"}</td>
                <td>${escapeHtml(student.fullName)}</td>
                <td>${escapeHtml(student.phone || "-")}</td>
                <td>${escapeHtml(student.email || "-")}</td>
                <td>${escapeHtml(student.grade || "-")}</td>
                <td>${escapeHtml(student.counsellingTopic || "-")}</td>
                <td>${formatDate(student.createdAt)}</td>
            `;

            tbody.appendChild(row);

        });

    } catch (error) {

        console.error(
            "Student list error:",
            error
        );

        tbody.innerHTML =
            '<tr><td colspan="7" class="loading">Unable to load students</td></tr>';

        if (count) {
            count.textContent = "Unable to load students";
        }

    }

}

function formatDate(value) {

    if (!value) {
        return "-";
    }

    const date =
        new Date(value);

    if (isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString("en-IN");

}

function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}
document.addEventListener("DOMContentLoaded", function () {
    loadMockResults();

    const refreshButton = document.getElementById("refreshResults");

    if (refreshButton) {
        refreshButton.addEventListener("click", loadMockResults);
    }
});

async function loadMockResults() {

    const tbody = document.getElementById("mockTableBody");
    const count = document.getElementById("resultCount");

    if (!tbody) {
        return;
    }

    tbody.innerHTML =
        '<tr><td colspan="9" class="loading">Loading results...</td></tr>';

    const apiUrl =
        API_BASE_URL + "/mkcarrer/dashboard/mock-results";

    console.log("Mock Result API URL:", apiUrl);

    try {

        const response = await fetch(apiUrl);

        console.log("Mock Result Status:", response.status);
        console.log("Mock Result Status Text:", response.statusText);

        const responseText = await response.text();

        console.log("Mock Result Raw Response:", responseText);

        if (!response.ok) {

            throw new Error(
                "API Error " +
                response.status +
                ": " +
                responseText
            );
        }

        const results = JSON.parse(responseText);

        console.log("Mock Results:", results);

        if (count) {
            count.textContent =
                results.length +
                " mock test attempts found";
        }

        if (!results.length) {

            tbody.innerHTML =
                '<tr><td colspan="9" class="loading">No mock test results found</td></tr>';

            return;
        }

        tbody.innerHTML = "";

        results.forEach(function (result) {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${result.id || "-"}</td>

                <td>
                    <strong>
                        ${escapeHtml(result.studentName || "-")}
                    </strong>
                </td>

                <td>
                    ${escapeHtml(result.studentMobile || "-")}
                </td>

                <td>
                    ${result.totalQuestions || 0}
                </td>

                <td class="correct">
                    ${result.correctAnswers || 0}
                </td>

                <td class="wrong">
                    ${result.wrongAnswers || 0}
                </td>

                <td>
                    <strong>
                        ${result.score || 0}
                    </strong>
                </td>

                <td>
                    ${result.percentage || 0}%
                </td>

                <td>
                    ${formatDate(result.createdAt)}
                </td>
            `;

            tbody.appendChild(row);
        });

    } catch (error) {

        console.error("Mock results error:", error);

        tbody.innerHTML =
            '<tr><td colspan="9" class="loading">' +
            escapeHtml(error.message) +
            '</td></tr>';

        if (count) {
            count.textContent = "Unable to load results";
        }
    }
}

function formatDate(value) {

    if (!value) {
        return "-";
    }

    const date = new Date(value);

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
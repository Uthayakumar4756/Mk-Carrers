document.addEventListener("DOMContentLoaded", function () {

    loadVisitors();

    const refreshButton =
        document.getElementById("refreshVisitors");

    if (refreshButton) {
        refreshButton.addEventListener(
            "click",
            loadVisitors
        );
    }

});

async function loadVisitors() {

    const tbody =
        document.getElementById("visitorTableBody");

    const total =
        document.getElementById("visitorTotal");

    const unique =
        document.getElementById("visitorUnique");

    const count =
        document.getElementById("visitorCount");

    if (!tbody) {
        return;
    }

    tbody.innerHTML =
        '<tr><td colspan="5" class="loading">Loading visitors...</td></tr>';

    try {

        const response =
            await fetch(
                API_BASE_URL +
                "/mkcarrer/dashboard/visits"
            );

        if (!response.ok) {
            throw new Error("Visitor API failed");
        }

        const visits =
            await response.json();

        const uniqueIps =
            new Set(
                visits
                    .map(function (visit) {
                        return visit.ipAddress;
                    })
                    .filter(Boolean)
            ).size;

        if (total) {
            total.textContent =
                visits.length;
        }

        if (unique) {
            unique.textContent =
                uniqueIps;
        }

        if (count) {
            count.textContent =
                visits.length +
                " visits found";
        }

        if (!visits.length) {

            tbody.innerHTML =
                '<tr><td colspan="5" class="loading">No visitor history found</td></tr>';

            return;
        }

        tbody.innerHTML = "";

        visits
            .slice()
            .reverse()
            .forEach(function (visit) {

                const row =
                    document.createElement("tr");

                row.innerHTML = `
                    <td>${visit.id || "-"}</td>

                    <td>
                        ${escapeHtml(
                            visit.pageUrl || "-"
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            visit.ipAddress || "-"
                        )}
                    </td>

                    <td title="${escapeHtml(
                        visit.userAgent || ""
                    )}">
                        ${getBrowserName(
                            visit.userAgent
                        )}
                    </td>

                    <td>
                        ${formatDate(
                            visit.visitedAt
                        )}
                    </td>
                `;

                tbody.appendChild(row);

            });

    } catch (error) {

        console.error(
            "Visitor list error:",
            error
        );

        tbody.innerHTML =
            '<tr><td colspan="5" class="loading">Unable to load visitors</td></tr>';

    }

}

function getBrowserName(userAgent) {

    if (!userAgent) {
        return "-";
    }

    if (userAgent.includes("Edg")) {
        return "Microsoft Edge";
    }

    if (userAgent.includes("Chrome")) {
        return "Google Chrome";
    }

    if (userAgent.includes("Firefox")) {
        return "Mozilla Firefox";
    }

    if (userAgent.includes("Safari")) {
        return "Safari";
    }

    return "Other";

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
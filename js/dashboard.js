document.addEventListener("DOMContentLoaded", function () {
    loadDashboardSummary();
    
});

async function loadDashboardSummary() {

    try {

        const response =
            await fetch(
                API_BASE_URL +
                "/mkcarrer/dashboard/summary"
            );

        if (!response.ok) {
            throw new Error("Dashboard API failed");
        }

        const data =
            await response.json();

        setText("totalStudents", data.students);
        setText("totalQuestions", data.mockQuestions);
        setText("totalTests", data.mockTests);
        setText("totalVisits", data.totalVisits);
        setText("uniqueVisitors", data.uniqueVisitors);

        setText("overviewStudents", data.students);
        setText("overviewTests", data.mockTests);
        setText("overviewVisits", data.totalVisits);
        setText("overviewUnique", data.uniqueVisitors);

    } catch (error) {

        console.error(
            "Dashboard summary error:",
            error
        );

    }

}

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = value || 0;
    }

}
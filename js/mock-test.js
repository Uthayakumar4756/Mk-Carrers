let questions = [];
let currentQuestion = 0;
let answers = [];

document.addEventListener("DOMContentLoaded", function () {

    const studentId = localStorage.getItem("studentId");

    if (!studentId) {
        alert("Please register before starting the mock test.");
        window.location.href = "index.html";
        return;
    }

    const quizModalElement = document.getElementById("quizModal");

    if (!quizModalElement) {
        console.error("quizModal not found");
        return;
    }

    const quizModal = new bootstrap.Modal(quizModalElement);

    loadQuestions();

    quizModal.show();

    document.getElementById("nextBtn").addEventListener("click", nextQuestion);
    document.getElementById("backBtn").addEventListener("click", previousQuestion);

    document.getElementById("doneBtn").addEventListener("click", function () {
        window.location.href = "index.html";
    });
});

async function loadQuestions() {

    try {

        const response = await fetch(
            API_BASE_URL + "/mkcarrer/quiz/questions"
        );

        if (!response.ok) {
            throw new Error("Unable to load questions");
        }

        questions = await response.json();

        console.log("Questions received:", questions);

        if (!questions || questions.length === 0) {
            alert("No quiz questions available.");
            return;
        }

        answers = new Array(questions.length).fill(null);

        currentQuestion = 0;

        showQuestion();

    } catch (error) {

        console.error("Question loading error:", error);

        document.getElementById("questionText").innerText =
            "Unable to load quiz questions.";
    }
}

function showQuestion() {

    if (!questions || questions.length === 0) {
        return;
    }

    const question = questions[currentQuestion];

    document.getElementById("questionNumber").innerText =
        "QUESTION " + (currentQuestion + 1);

    document.getElementById("progressText").innerText =
        "Question " + (currentQuestion + 1) +
        " of " + questions.length;

    document.getElementById("questionText").innerText =
        question.question;

    const progress =
        ((currentQuestion + 1) / questions.length) * 100;

    document.getElementById("progressBar").style.width =
        progress + "%";

    const optionsContainer =
        document.getElementById("optionsContainer");

    optionsContainer.innerHTML = "";

    const options = [
        {
            letter: "A",
            text: question.optionA
        },
        {
            letter: "B",
            text: question.optionB
        },
        {
            letter: "C",
            text: question.optionC
        },
        {
            letter: "D",
            text: question.optionD
        }
    ];

    options.forEach(function (option) {

        const optionDiv = document.createElement("div");

        optionDiv.className = "option";

        if (
            answers[currentQuestion] &&
            answers[currentQuestion].questionId === question.id &&
            answers[currentQuestion].selectedAnswer === option.letter
        ) {
            optionDiv.classList.add("selected");
        }

        optionDiv.innerHTML = `
            <span class="option-letter">
                ${option.letter}
            </span>
            <span>${option.text}</span>
        `;

        optionDiv.addEventListener("click", function () {

            answers[currentQuestion] = {
                questionId: question.id,
                selectedAnswer: option.letter
            };

            document
                .querySelectorAll("#optionsContainer .option")
                .forEach(function (item) {
                    item.classList.remove("selected");
                });

            optionDiv.classList.add("selected");

            console.log(
                "Selected answer:",
                answers[currentQuestion]
            );
        });

        optionsContainer.appendChild(optionDiv);
    });

    document.getElementById("backBtn").disabled =
        currentQuestion === 0;

    const nextBtn = document.getElementById("nextBtn");

    if (currentQuestion === questions.length - 1) {
        nextBtn.innerText = "Submit Quiz";
    } else {
        nextBtn.innerText = "Next →";
    }
}

function nextQuestion() {

    if (!answers[currentQuestion]) {

        alert("Please select an answer.");

        return;
    }

    if (currentQuestion < questions.length - 1) {

        currentQuestion++;

        showQuestion();

    } else {

        submitQuiz();
    }
}

function previousQuestion() {

    if (currentQuestion > 0) {

        currentQuestion--;

        showQuestion();
    }
}

function submitQuiz() {

    const answerList = answers.filter(function (answer) {
        return answer !== null;
    });

    if (answerList.length !== questions.length) {
        alert("Please answer all questions.");
        return;
    }

    const requestData = {
        studentId: Number(localStorage.getItem("studentId")),
        answers: answerList
    };

    console.log("Quiz result request:", requestData);

    $.ajax({
        url: API_BASE_URL + "/mkcarrer/quiz/result",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(requestData),

        success: function (response) {

            console.log("Quiz result response:", response);

            showResult(response);
        },

        error: function (xhr) {

            console.error(
                "Quiz result error:",
                xhr.status,
                xhr.responseText
            );

            alert("Unable to save quiz result.");
        }
    });
}

function showResult(result) {

    document.getElementById("quizContainer")
        .classList.add("d-none");

    document.getElementById("quizFooter")
        .classList.add("d-none");

    document.getElementById("resultContainer")
        .classList.remove("d-none");

    document.getElementById("resultScore").innerText =
        result.score + "/10";

    document.getElementById("correctCount").innerText =
        result.correctAnswers;

    document.getElementById("wrongCount").innerText =
        result.wrongAnswers;

    let message = "";

    if (result.score === 10) {

        message =
            "Excellent! Your answers show strong career awareness.";

    } else if (result.score >= 6) {

        message =
            "Good job! You have some strong career interests.";

    } else {

        message =
            "Good attempt! Explore different career areas and discover your strengths.";
    }

    document.getElementById("resultMessage").innerText =
        message;
}

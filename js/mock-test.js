let questions = [];
let currentQuestion = 0;
let answers = [];

let studentName = "";
let studentMobile = "";

let quizModal;
let studentInfoModal;

document.addEventListener("DOMContentLoaded", function () {

    const quizModalElement =
        document.getElementById("quizModal");

    const studentInfoModalElement =
        document.getElementById("studentInfoModal");

    if (!quizModalElement || !studentInfoModalElement) {
        console.error("Quiz modal not found");
        return;
    }

    quizModal =
        new bootstrap.Modal(quizModalElement);

    studentInfoModal =
        new bootstrap.Modal(studentInfoModalElement);

    const studentInfoForm =
        document.getElementById("studentInfoForm");

    const nextBtn =
        document.getElementById("nextBtn");

    const backBtn =
        document.getElementById("backBtn");

    const doneBtn =
        document.getElementById("doneBtn");

    if (studentInfoForm) {
        studentInfoForm.addEventListener(
            "submit",
            startQuiz
        );
    }

    if (nextBtn) {
        nextBtn.addEventListener(
            "click",
            nextQuestion
        );
    }

    if (backBtn) {
        backBtn.addEventListener(
            "click",
            previousQuestion
        );
    }

    if (doneBtn) {
        doneBtn.addEventListener(
            "click",
            function () {
                window.location.href = "index.html";
            }
        );
    }

    quizModal.show();

    loadQuestions();

    setTimeout(function () {

        const quizBackground =
            document.getElementById("quizBackground");

        if (quizBackground) {
            quizBackground.classList.add("quiz-blur");
        }

        studentInfoModal.show();

    }, 300);

});

async function startQuiz(event) {

    event.preventDefault();

    const nameInput =
        document.getElementById("studentName");

    const mobileInput =
        document.getElementById("studentMobile");

    const errorBox =
        document.getElementById("studentInfoError");

    studentName =
        nameInput.value.trim();

    studentMobile =
        mobileInput.value.trim();

    errorBox.classList.add("d-none");
    errorBox.innerText = "";

    if (!studentName) {

        errorBox.innerText =
            "Please enter your name.";

        errorBox.classList.remove("d-none");

        nameInput.focus();

        return;
    }

    if (
        studentMobile &&
        !/^[0-9]{10,15}$/.test(studentMobile)
    ) {

        errorBox.innerText =
            "Please enter a valid mobile number.";

        errorBox.classList.remove("d-none");

        mobileInput.focus();

        return;
    }

    localStorage.setItem(
        "mockStudentName",
        studentName
    );

    localStorage.setItem(
        "mockStudentMobile",
        studentMobile
    );

    studentInfoModal.hide();

    const quizBackground =
        document.getElementById("quizBackground");

    if (quizBackground) {
        quizBackground.classList.remove("quiz-blur");
    }
}

async function loadQuestions() {

    try {

        document
            .getElementById("questionText")
            .innerText =
            "Loading question...";

        const response =
            await fetch(
                API_BASE_URL +
                "/mkcarrer/quiz/questions"
            );

        if (!response.ok) {
            throw new Error(
                "Unable to load questions"
            );
        }

        questions =
            await response.json();

        console.log(
            "Questions received:",
            questions
        );

        if (
            !questions ||
            questions.length === 0
        ) {

            document
                .getElementById("questionText")
                .innerText =
                "No quiz questions available.";

            return;
        }

        answers =
            new Array(
                questions.length
            ).fill(null);

        currentQuestion = 0;

        showQuestion();

    } catch (error) {

        console.error(
            "Question loading error:",
            error
        );

        document
            .getElementById("questionText")
            .innerText =
            "Unable to load quiz questions.";
    }
}

function showQuestion() {

    if (
        !questions ||
        questions.length === 0
    ) {
        return;
    }

    const question =
        questions[currentQuestion];

    document
        .getElementById("questionNumber")
        .innerText =
        "QUESTION " +
        (currentQuestion + 1);

    document
        .getElementById("progressText")
        .innerText =
        "Question " +
        (currentQuestion + 1) +
        " of " +
        questions.length;

    document
        .getElementById("questionText")
        .innerText =
        question.question;

    const progress =
        (
            (currentQuestion + 1) /
            questions.length
        ) * 100;

    document
        .getElementById("progressBar")
        .style.width =
        progress + "%";

    const optionsContainer =
        document.getElementById(
            "optionsContainer"
        );

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

        const optionDiv =
            document.createElement("div");

        optionDiv.classList.add("option");

        optionDiv.setAttribute(
            "data-answer",
            option.letter
        );

        optionDiv.innerHTML = `
            <span class="option-letter">
                ${option.letter}
            </span>
            <span class="option-text">
                ${option.text}
            </span>
        `;

        const selectedAnswer =
            answers[currentQuestion];

        if (
            selectedAnswer &&
            selectedAnswer.questionId ===
                question.id &&
            selectedAnswer.selectedAnswer ===
                option.letter
        ) {

            optionDiv.classList.add(
                "selected"
            );
        }

        optionDiv.addEventListener(
            "click",
            function () {

                selectOption(
                    question,
                    option.letter,
                    optionDiv
                );

            }
        );

        optionsContainer.appendChild(
            optionDiv
        );

    });

    document
        .getElementById("backBtn")
        .disabled =
        currentQuestion === 0;

    const nextBtn =
        document.getElementById("nextBtn");

    if (
        currentQuestion ===
        questions.length - 1
    ) {

        nextBtn.innerText =
            "Submit Quiz";

    } else {

        nextBtn.innerText =
            "Next →";
    }
}

function selectOption(
    question,
    selectedLetter,
    selectedElement
) {

    answers[currentQuestion] = {
        questionId: question.id,
        selectedAnswer: selectedLetter
    };

    const allOptions =
        document.querySelectorAll(
            "#optionsContainer .option"
        );

    allOptions.forEach(function (option) {

        option.classList.remove(
            "selected"
        );

    });

    selectedElement.classList.add(
        "selected"
    );

    console.log(
        "Selected:",
        selectedLetter
    );

}

function nextQuestion() {

    if (
        !answers[currentQuestion]
    ) {

        alert(
            "Please select an answer."
        );

        return;
    }

    if (
        currentQuestion <
        questions.length - 1
    ) {

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
        studentName: studentName,
        studentMobile: studentMobile || "",
        answers: answerList
    };

    console.log("Sending quiz result:", requestData);

    $.ajax({
        url: API_BASE_URL + "/mkcarrer/quiz/result",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(requestData),

        success: function (response) {

            console.log("Quiz result response:", response);

            if (response.success) {
                showResult(response);
            } else {
                alert(response.message || "Unable to save quiz result.");
            }
        },

        error: function (xhr) {

            console.error("Quiz result error:");
            console.error("Status:", xhr.status);
            console.error("Response:", xhr.responseText);

            let message = "Unable to save quiz result.";

            try {
                const response = JSON.parse(xhr.responseText);

                if (response.message) {
                    message = response.message;
                }
            } catch (e) {
                console.error("Invalid JSON response");
            }

            alert(message);
        }
    });
}

function showResult(result) {

    document
        .getElementById("quizContainer")
        .classList.add("d-none");

    document
        .getElementById("quizFooter")
        .classList.add("d-none");

    document
        .getElementById("resultContainer")
        .classList.remove("d-none");

    document
        .getElementById("resultScore")
        .innerText =
        result.score + "/10";

    document
        .getElementById("correctCount")
        .innerText =
        result.correctAnswers;

    document
        .getElementById("wrongCount")
        .innerText =
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

    document
        .getElementById("resultMessage")
        .innerText =
        message;
}
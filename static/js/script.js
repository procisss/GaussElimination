let currentMatrixSize = 3;


// =========================
// GENERATE MATRIX
// =========================

function generateMatrix(size) {

    const table = document.getElementById("matrixTable");

    table.innerHTML = "";

    const cols = size + 1;

    for (let i = 0; i < size; i++) {

        const row = document.createElement("tr");

        for (let j = 0; j < cols; j++) {

            const cell = document.createElement("td");

            const input = document.createElement("input");

            input.type = "number";

            input.step = "any";

            input.id = `cell-${i}-${j}`;

            cell.appendChild(input);

            row.appendChild(cell);
        }

        table.appendChild(row);
    }
}


// =========================
// SWITCH MATRIX SIZE
// =========================

function setMatrixSize(size) {

    currentMatrixSize = size;

    generateMatrix(size);

    document
        .getElementById("btn3")
        .classList.remove("active");

    document
        .getElementById("btn4")
        .classList.remove("active");

    if (size === 3) {

        document
            .getElementById("btn3")
            .classList.add("active");

    } else {

        document
            .getElementById("btn4")
            .classList.add("active");
    }
}


// =========================
// SOLVE SYSTEM
// =========================

async function solveSystem() {

    const size = currentMatrixSize;

    let matrix = [];

    for (let i = 0; i < size; i++) {

        let row = [];

        for (let j = 0; j < size + 1; j++) {

            const value = parseFloat(
                document.getElementById(`cell-${i}-${j}`).value
            ) || 0;

            row.push(value);
        }

        matrix.push(row);
    }

    // =========================
    // DISPLAY INPUT MATRIX
    // =========================

    let matrixHTML = `

    <div class="matrix-wrapper">

        <div class="matrix-values">

    `;

    matrix.forEach(r => {

        matrixHTML += `<div class="matrix-row">`;

        r.forEach((val, index) => {

            if (index === matrix[0].length - 1) {

                matrixHTML += `
                    <span class="divider">|</span>
                `;
            }

            matrixHTML += `
                <span>${val}</span>
            `;
        });

        matrixHTML += `</div>`;
    });

    matrixHTML += `
        </div>
    </div>
    `;

    document.getElementById(
        "matrixDisplay"
    ).innerHTML = matrixHTML;

    // =========================
    // FETCH SOLUTION
    // =========================

    const response = await fetch("/solve", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            matrix: matrix
        })
    });

    const data = await response.json();

    // =========================
    // ERROR HANDLING
    // =========================

    if (data.error) {

        document.getElementById(
            "solution"
        ).innerHTML = data.error;

        return;
    }

    // =========================
    // DISPLAY SOLUTION
    // =========================

    let solutionHTML = "";

    data.solution.forEach((value, index) => {

        solutionHTML += `

            x${index + 1} = ${Number(value).toFixed(4)}

            &nbsp;&nbsp;

            (${data.fraction_solution[index]})

            <br><br>
        `;
    });

    document.getElementById(
        "solution"
    ).innerHTML = solutionHTML;

    // =========================
    // DISPLAY STEPS
    // =========================

    const stepsDiv = document.getElementById(
        "steps"
    );

    stepsDiv.innerHTML = "";

    data.steps.forEach((step, index) => {

        stepsDiv.innerHTML += `

            <div class="step">

                <strong>
                    Step ${index + 1}
                </strong>

                <br><br>

                ${step}

            </div>
        `;
    });
}


// =========================
// EXAMPLE TABS
// =========================

function showExample(exampleNumber) {

    const examples = document.querySelectorAll(
        ".example-content"
    );

    examples.forEach(example => {

        example.classList.remove(
            "active-example"
        );
    });

    document.getElementById(
        `example${exampleNumber}`
    ).classList.add(
        "active-example"
    );

    const buttons = document.querySelectorAll(
        ".tab-btn"
    );

    buttons.forEach(btn => {

        btn.classList.remove("active");
    });

    buttons[exampleNumber - 1]
        .classList.add("active");
}


// =========================
// PAGE LOAD
// =========================

window.onload = function () {

    generateMatrix(3);
};
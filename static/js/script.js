async function solveSystem() {

    const inputs = document.querySelectorAll('input')

    let matrix = []
    let row = []

    inputs.forEach((input, index) => {

        row.push(parseFloat(input.value))

        if ((index + 1) % 4 === 0) {

            matrix.push(row)

            row = []

        }

    })

    // =========================
    // DISPLAY INPUT MATRIX
    // =========================

    let matrixHTML = `

    <div class="matrix-wrapper">

        <div class="matrix-bracket left">
            [
        </div>

        <div class="matrix-values">

    `

    matrix.forEach(r => {

        matrixHTML += `<div class="matrix-row">`

        r.forEach((val, index) => {

            if(index === 3){

                matrixHTML += `
                    <span class="divider">|</span>
                `
            }

            matrixHTML += `
                <span>${val}</span>
            `
        })

        matrixHTML += `</div>`

    })

    matrixHTML += `

        </div>

        <div class="matrix-bracket right">
            ]
        </div>

    </div>

    `

    document.getElementById(
        'matrixDisplay'
    ).innerHTML = matrixHTML


    // =========================
    // FETCH SOLUTION
    // =========================

    const response = await fetch('/solve', {

        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            matrix: matrix
        })

    })

    const data = await response.json()

    // =========================
    // ERROR HANDLING
    // =========================

    if(data.error){

        document.getElementById(
            'solution'
        ).innerHTML = data.error

        return

    }

    // =========================
    // DISPLAY SOLUTION
    // =========================

        document.getElementById(
        'solution'
    ).innerHTML = `

        x₁ = ${data.solution[0]}
        &nbsp;&nbsp;
        (${data.fraction_solution[0]})
        <br><br>

        x₂ = ${data.solution[1]}
        &nbsp;&nbsp;
        (${data.fraction_solution[1]})
        <br><br>

        x₃ = ${data.solution[2]}
        &nbsp;&nbsp;
        (${data.fraction_solution[2]})

    `

    // =========================
    // DISPLAY STEPS
    // =========================

    const stepsDiv = document.getElementById(
        'steps'
    )

    stepsDiv.innerHTML = ''

    data.steps.forEach((step, index) => {

        stepsDiv.innerHTML += `

            <div class="step">

                <strong>
                    Step ${index + 1}
                </strong>

                <br><br>

                ${step}

            </div>

        `

    })

}

function showExample(exampleNumber){

    const examples = document.querySelectorAll(
        '.example-content'
    )

    examples.forEach(example => {

        example.classList.remove(
            'active-example'
        )

    })

    document.getElementById(
        `example${exampleNumber}`
    ).classList.add(
        'active-example'
    )

    const buttons = document.querySelectorAll(
        '.tab-btn'
    )

    buttons.forEach(btn => {

        btn.classList.remove('active')

    })

    buttons[exampleNumber - 1]
    .classList.add('active')

}
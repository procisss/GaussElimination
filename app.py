from flask import Flask, render_template, request, jsonify
import numpy as np
from fractions import Fraction

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/discussion')
def discussion():
    return render_template('discussion.html')


@app.route('/examples')
def examples():
    return render_template('examples.html')


@app.route('/calculator')
def calculator():
    return render_template('calculator.html')


@app.route('/solve', methods=['POST'])
def solve():

    data = request.json

    matrix = data['matrix']

    A = np.array(matrix, dtype=float)

    n = len(A)

    steps = []

    matrices = []

    # =========================
    # FORWARD ELIMINATION
    # =========================

    for i in range(n):

        # PARTIAL PIVOTING

        max_row = i

        for k in range(i + 1, n):

            if abs(A[k][i]) > abs(A[max_row][i]):

                max_row = k

        if A[max_row][i] == 0:

            return jsonify({
                'error': 'No unique solution exists.'
            })

        # SWAP ROWS

        if max_row != i:

            A[[i, max_row]] = A[[max_row, i]]

            steps.append(
                f"Swap R{i+1} and R{max_row+1}"
            )

            matrices.append(A.copy().tolist())

        # ELIMINATION

        for j in range(i + 1, n):

            multiplier = A[j][i] / A[i][i]

            steps.append(
                f"R{j+1} = R{j+1} - ({multiplier:.4f})R{i+1}"
            )

            A[j] = A[j] - multiplier * A[i]

            matrices.append(A.copy().tolist())

    # =========================
    # BACK SUBSTITUTION
    # =========================

    x = np.zeros(n)

    for i in range(n - 1, -1, -1):

        sum_ax = 0

        for j in range(i + 1, n):

            sum_ax += A[i][j] * x[j]

        x[i] = (A[i][-1] - sum_ax) / A[i][i]

    # DECIMAL + FRACTION SOLUTIONS

    solution = []

    fraction_solution = []

    for value in x:

        solution.append(round(value, 6))

        fraction_solution.append(
            str(Fraction(value).limit_denominator())
        )

    # FINAL MATRIX

    final_matrix = []

    for row in A:

        final_matrix.append([
            round(v, 6) for v in row
        ])

    return jsonify({

        'solution': solution,

        'fraction_solution': fraction_solution,

        'steps': steps,

        'matrix': final_matrix,

        'matrices': matrices

    })


if __name__ == '__main__':
    app.run(debug=True)
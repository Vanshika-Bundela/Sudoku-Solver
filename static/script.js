// =========================================================
// SUDOKU SOLVER - FRONTEND
// =========================================================


// =========================================================
// GET HTML ELEMENTS
// =========================================================

const cells = document.querySelectorAll(".cell");

const numberButtons = document.querySelectorAll(".number-btn");

const solveButton = document.getElementById("solve-btn");
const hintButton = document.getElementById("hint-btn");
const clearButton = document.getElementById("clear-btn");
const resetButton = document.getElementById("reset-btn");
const newPuzzleButton = document.getElementById("new-puzzle-btn");
const eraseButton = document.getElementById("erase-btn");

const status = document.getElementById("status");

const timerElement = document.getElementById("timer");
const mistakesElement = document.getElementById("mistakes");


// =========================================================
// VARIABLES
// =========================================================

let selectedCell = null;

let mistakes = 0;

let seconds = 0;

let timerStarted = false;

let timerInterval = null;

let originalBoard = [];

let currentPuzzleIndex = 0;


// =========================================================
// PUZZLES
// =========================================================

const puzzles = [

    [
        ["5", "3", ".", ".", "7", ".", ".", ".", "."],
        ["6", ".", ".", "1", "9", "5", ".", ".", "."],
        [".", "9", "8", ".", ".", ".", ".", "6", "."],

        ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
        ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
        ["7", ".", ".", ".", "2", ".", ".", ".", "6"],

        [".", "6", ".", ".", ".", ".", "2", "8", "."],
        [".", ".", ".", "4", "1", "9", ".", ".", "5"],
        [".", ".", ".", ".", "8", ".", ".", "7", "9"]
    ],


    [
        [".", ".", "3", ".", "2", ".", "6", ".", "."],
        ["9", ".", ".", "3", ".", "5", ".", ".", "1"],
        [".", ".", "1", "8", ".", "6", "4", ".", "."],

        [".", ".", "8", "1", ".", "2", "9", ".", "."],
        ["7", ".", ".", ".", ".", ".", ".", ".", "8"],
        [".", ".", "6", "7", ".", "8", "2", ".", "."],

        [".", ".", "2", "6", ".", "9", "5", ".", "."],
        ["8", ".", ".", "2", ".", "3", ".", ".", "9"],
        [".", ".", "5", ".", "1", ".", "3", ".", "."]
    ],


    [
        ["8", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", "3", "6", ".", ".", ".", ".", "."],
        [".", "7", ".", ".", "9", ".", "2", ".", "."],

        [".", "5", ".", ".", ".", "7", ".", ".", "."],
        [".", ".", ".", ".", "4", "5", "7", ".", "."],
        [".", ".", ".", "1", ".", ".", ".", "3", "."],

        [".", ".", "1", ".", ".", ".", ".", "6", "8"],
        [".", ".", "8", "5", ".", ".", ".", "1", "."],
        [".", "9", ".", ".", ".", ".", "4", ".", "."]
    ]

];


// =========================================================
// LOAD PUZZLE
// =========================================================

function loadPuzzle(puzzle) {

    originalBoard = puzzle.map(row => [...row]);

    selectedCell = null;

    mistakes = 0;

    mistakesElement.textContent = "0";

    resetTimer();


    cells.forEach(cell => {

        const row = Number(cell.dataset.row);
        const col = Number(cell.dataset.col);

        const value = originalBoard[row][col];


        cell.value = "";

        cell.classList.remove(
            "fixed",
            "error",
            "solved",
            "selected"
        );

        cell.style.backgroundColor = "";


        if (value !== ".") {

            cell.value = value;

            cell.classList.add("fixed");
        }

    });


    showStatus(
        "New puzzle loaded.",
        "info"
    );
}


// =========================================================
// INITIAL LOAD
// =========================================================

loadPuzzle(puzzles[0]);


// =========================================================
// CELL CLICK
// =========================================================

cells.forEach(cell => {

    cell.addEventListener("click", () => {

        selectedCell = cell;

        highlightRelatedCells(cell);

    });


    cell.addEventListener("input", () => {

        if (cell.classList.contains("fixed")) {
            return;
        }


        cell.value = cell.value.replace(
            /[^1-9]/g,
            ""
        );


        if (cell.value.length > 1) {

            cell.value =
                cell.value.slice(0, 1);
        }


        cell.classList.remove(
            "error",
            "solved"
        );


        if (cell.value === "") {

            highlightRelatedCells(cell);

            return;
        }


        startTimer();


        const row = Number(cell.dataset.row);
        const col = Number(cell.dataset.col);

        const number = cell.value;


        if (!isValidMove(row, col, number)) {

            cell.classList.add("error");

            mistakes++;

            mistakesElement.textContent = mistakes;

            showStatus(
                "Invalid move.",
                "error"
            );

        } else {

            showStatus(
                "Number entered.",
                "info"
            );
        }


        highlightRelatedCells(cell);

    });

});


// =========================================================
// HIGHLIGHT RELATED CELLS
// =========================================================

function highlightRelatedCells(cell) {

    cells.forEach(otherCell => {

        otherCell.classList.remove("selected");

        otherCell.style.backgroundColor = "";

    });


    if (!cell) {
        return;
    }


    const selectedRow =
        Number(cell.dataset.row);

    const selectedCol =
        Number(cell.dataset.col);

    const selectedNumber =
        cell.value;


    cells.forEach(otherCell => {

        const row =
            Number(otherCell.dataset.row);

        const col =
            Number(otherCell.dataset.col);


        if (row === selectedRow) {

            otherCell.style.backgroundColor =
                "#eff6ff";
        }


        if (col === selectedCol) {

            otherCell.style.backgroundColor =
                "#eff6ff";
        }


        if (
            selectedNumber !== "" &&
            otherCell.value === selectedNumber
        ) {

            otherCell.style.backgroundColor =
                "#dbeafe";
        }

    });


    cell.classList.add("selected");

    cell.style.backgroundColor =
        "#bfdbfe";
}


// =========================================================
// NUMBER BUTTONS
// =========================================================

numberButtons.forEach(button => {

    button.addEventListener("click", () => {

        if (button.id === "erase-btn") {
            return;
        }


        if (!selectedCell) {

            showStatus(
                "Select a cell first.",
                "error"
            );

            return;
        }


        if (
            selectedCell.classList.contains("fixed")
        ) {

            showStatus(
                "You cannot change an original number.",
                "error"
            );

            return;
        }


        const number =
            button.dataset.number;


        selectedCell.value = number;


        selectedCell.classList.remove(
            "error",
            "solved"
        );


        startTimer();


        const row =
            Number(selectedCell.dataset.row);

        const col =
            Number(selectedCell.dataset.col);


        if (
            !isValidMove(
                row,
                col,
                number
            )
        ) {

            selectedCell.classList.add(
                "error"
            );

            mistakes++;

            mistakesElement.textContent =
                mistakes;

            showStatus(
                "Invalid move.",
                "error"
            );

        } else {

            showStatus(
                "Number entered.",
                "info"
            );
        }


        highlightRelatedCells(selectedCell);

    });

});


// =========================================================
// ERASE
// =========================================================

eraseButton.addEventListener(
    "click",
    () => {

        if (!selectedCell) {

            showStatus(
                "Select a cell first.",
                "error"
            );

            return;
        }


        if (
            selectedCell.classList.contains("fixed")
        ) {

            showStatus(
                "You cannot erase an original number.",
                "error"
            );

            return;
        }


        selectedCell.value = "";

        selectedCell.classList.remove(
            "error",
            "solved"
        );


        showStatus(
            "Cell cleared.",
            "info"
        );


        highlightRelatedCells(
            selectedCell
        );

    }
);


// =========================================================
// KEYBOARD INPUT
// =========================================================

document.addEventListener(
    "keydown",
    event => {

        if (!selectedCell) {
            return;
        }


        if (
            selectedCell.classList.contains("fixed")
        ) {
            return;
        }


        if (
            event.key >= "1" &&
            event.key <= "9"
        ) {

            selectedCell.value =
                event.key;


            selectedCell.classList.remove(
                "error",
                "solved"
            );


            startTimer();


            const row =
                Number(selectedCell.dataset.row);

            const col =
                Number(selectedCell.dataset.col);


            if (
                !isValidMove(
                    row,
                    col,
                    event.key
                )
            ) {

                selectedCell.classList.add(
                    "error"
                );

                mistakes++;

                mistakesElement.textContent =
                    mistakes;

                showStatus(
                    "Invalid move.",
                    "error"
                );

            } else {

                showStatus(
                    "Number entered.",
                    "info"
                );
            }


            highlightRelatedCells(
                selectedCell
            );
        }


        if (
            event.key === "Backspace" ||
            event.key === "Delete"
        ) {

            selectedCell.value = "";

            selectedCell.classList.remove(
                "error",
                "solved"
            );


            highlightRelatedCells(
                selectedCell
            );
        }

    }
);


// =========================================================
// VALIDATE MOVE
// =========================================================

function isValidMove(row, col, number) {

    // Row

    for (let c = 0; c < 9; c++) {

        if (c === col) {
            continue;
        }


        const cell =
            document.querySelector(
                `.cell[data-row="${row}"][data-col="${c}"]`
            );


        if (cell.value === number) {
            return false;
        }

    }


    // Column

    for (let r = 0; r < 9; r++) {

        if (r === row) {
            continue;
        }


        const cell =
            document.querySelector(
                `.cell[data-row="${r}"][data-col="${col}"]`
            );


        if (cell.value === number) {
            return false;
        }

    }


    // 3 x 3 box

    const startRow =
        Math.floor(row / 3) * 3;

    const startCol =
        Math.floor(col / 3) * 3;


    for (
        let r = startRow;
        r < startRow + 3;
        r++
    ) {

        for (
            let c = startCol;
            c < startCol + 3;
            c++
        ) {

            if (
                r === row &&
                c === col
            ) {
                continue;
            }


            const cell =
                document.querySelector(
                    `.cell[data-row="${r}"][data-col="${c}"]`
                );


            if (cell.value === number) {
                return false;
            }

        }

    }


    return true;
}


// =========================================================
// GET BOARD
// =========================================================

function getBoard() {

    const board = [];


    for (let row = 0; row < 9; row++) {

        const currentRow = [];


        for (let col = 0; col < 9; col++) {

            const cell =
                document.querySelector(
                    `.cell[data-row="${row}"][data-col="${col}"]`
                );


            if (cell.value === "") {

                currentRow.push(".");

            } else {

                currentRow.push(cell.value);
            }

        }


        board.push(currentRow);
    }


    return board;
}


// =========================================================
// SOLVE
// =========================================================

solveButton.addEventListener(
    "click",
    async () => {

        const board = getBoard();


        showStatus(
            "Solving Sudoku...",
            "info"
        );


        solveButton.disabled = true;

        solveButton.textContent =
            "Solving...";


        try {

            const response =
                await fetch(
                    "/solve",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            board: board
                        })
                    }
                );


            const data =
                await response.json();


            if (data.solved) {

                displaySolvedBoard(
                    data.board
                );


                stopTimer();


                showStatus(
                    "Sudoku solved successfully.",
                    "success"
                );

            } else {

                showStatus(
                    "This Sudoku puzzle cannot be solved.",
                    "error"
                );

            }

        } catch (error) {

            console.error(error);


            showStatus(
                "Could not connect to Flask.",
                "error"
            );

        }


        solveButton.disabled = false;

        solveButton.textContent =
            "Solve Sudoku";

    }
);


// =========================================================
// DISPLAY SOLUTION
// =========================================================

function displaySolvedBoard(board) {

    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            const cell =
                document.querySelector(
                    `.cell[data-row="${row}"][data-col="${col}"]`
                );


            if (
                cell.classList.contains("fixed")
            ) {
                continue;
            }


            cell.value =
                board[row][col];


            cell.classList.remove(
                "error"
            );


            cell.classList.add(
                "solved"
            );

        }

    }
}


// =========================================================
// HINT
// =========================================================

hintButton.addEventListener(
    "click",
    async () => {

        const board = getBoard();


        let emptyCell = null;


        // Find an empty cell

        for (let row = 0; row < 9; row++) {

            for (let col = 0; col < 9; col++) {

                if (
                    board[row][col] === "."
                ) {

                    emptyCell = {
                        row: row,
                        col: col
                    };

                    break;
                }

            }


            if (emptyCell !== null) {
                break;
            }

        }


        if (emptyCell === null) {

            showStatus(
                "The board is already complete.",
                "success"
            );

            return;
        }


        showStatus(
            "Finding a hint...",
            "info"
        );


        hintButton.disabled = true;

        hintButton.textContent =
            "Finding...";


        try {

            const response =
                await fetch(
                    "/solve",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            board: board
                        })
                    }
                );


            const data =
                await response.json();


            if (!data.solved) {

                showStatus(
                    "No valid solution exists from the current board.",
                    "error"
                );

                return;
            }


            const row =
                emptyCell.row;

            const col =
                emptyCell.col;


            const cell =
                document.querySelector(
                    `.cell[data-row="${row}"][data-col="${col}"]`
                );


            cell.value =
                data.board[row][col];


            cell.classList.remove(
                "error"
            );


            cell.classList.add(
                "solved"
            );


            showStatus(
                `Hint added: ${data.board[row][col]}`,
                "success"
            );


            startTimer();


            highlightRelatedCells(
                cell
            );

        } catch (error) {

            console.error(error);


            showStatus(
                "Could not connect to Flask.",
                "error"
            );

        }


        hintButton.disabled = false;

        hintButton.textContent =
            "Hint";

    }
);


// =========================================================
// CLEAR
// =========================================================

clearButton.addEventListener(
    "click",
    () => {

        cells.forEach(cell => {

            if (
                !cell.classList.contains("fixed")
            ) {

                cell.value = "";

                cell.classList.remove(
                    "error",
                    "solved",
                    "selected"
                );

                cell.style.backgroundColor =
                    "";

            }

        });


        selectedCell = null;


        mistakes = 0;

        mistakesElement.textContent =
            "0";


        resetTimer();


        showStatus(
            "Board cleared.",
            "info"
        );

    }
);


// =========================================================
// RESET
// =========================================================

resetButton.addEventListener(
    "click",
    () => {

        loadPuzzle(
            originalBoard
        );


        showStatus(
            "Puzzle reset.",
            "info"
        );

    }
);


// =========================================================
// NEW PUZZLE
// =========================================================

newPuzzleButton.addEventListener(
    "click",
    () => {

        let newIndex;


        do {

            newIndex =
                Math.floor(
                    Math.random() *
                    puzzles.length
                );

        } while (
            puzzles.length > 1 &&
            newIndex === currentPuzzleIndex
        );


        currentPuzzleIndex =
            newIndex;


        loadPuzzle(
            puzzles[currentPuzzleIndex]
        );


        showStatus(
            "New puzzle loaded.",
            "info"
        );

    }
);


// =========================================================
// STATUS
// =========================================================

function showStatus(message, type) {

    status.textContent =
        message;


    status.classList.remove(
        "success",
        "error",
        "info"
    );


    status.classList.add(
        type
    );
}


// =========================================================
// TIMER
// =========================================================

function startTimer() {

    if (timerStarted) {
        return;
    }


    timerStarted = true;


    timerInterval =
        setInterval(
            () => {

                seconds++;


                const minutes =
                    Math.floor(
                        seconds / 60
                    )
                    .toString()
                    .padStart(2, "0");


                const remainingSeconds =
                    (
                        seconds % 60
                    )
                    .toString()
                    .padStart(2, "0");


                timerElement.textContent =
                    `${minutes}:${remainingSeconds}`;

            },
            1000
        );
}


// =========================================================
// STOP TIMER
// =========================================================

function stopTimer() {

    clearInterval(
        timerInterval
    );

    timerStarted = false;
}


// =========================================================
// RESET TIMER
// =========================================================

function resetTimer() {

    clearInterval(
        timerInterval
    );

    timerStarted = false;

    seconds = 0;

    timerElement.textContent =
        "00:00";
}


// =========================================================
// INITIAL STATUS
// =========================================================

showStatus(
    "Select a cell and enter a number.",
    "info"
);
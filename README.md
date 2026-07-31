# Sudoku Solver

A modern, interactive Sudoku Solver web application built with **Python, Flask, HTML, CSS, and JavaScript**. The application combines a clean user interface with a **Backtracking Algorithm** to solve Sudoku puzzles efficiently.

## Live Demo

**Live Website:** https://sudoku-solver-i2ox.onrender.com/

## Preview

<img width="428" height="575" alt="image" src="https://github.com/user-attachments/assets/609cd5cc-7d7c-427b-8f04-7ed46337e2bd" />


## Features

* Interactive 9×9 Sudoku board
* Multiple Sudoku puzzles
* Real-time mistake detection
* Timer to track solving time
* Hint system
* Automatic Sudoku solving
* Clear board functionality
* Reset current puzzle
* Generate a new puzzle
* Interactive number pad
* Keyboard input support
* Visual highlighting of selected cells
* Visual indication of incorrect numbers
* Responsive design for different screen sizes

## Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Python
* Flask

### Algorithm

* Backtracking Algorithm

### Deployment

* GitHub
* Render

## How It Works

The Sudoku Solver uses a **Backtracking Algorithm** to find a valid solution.

The algorithm follows these basic steps:

1. Find an empty cell.
2. Try numbers from 1 to 9.
3. Check whether the number is valid in the current row.
4. Check whether the number is valid in the current column.
5. Check whether the number is valid in the 3×3 box.
6. If the number is valid, place it in the cell.
7. Recursively continue solving the remaining cells.
8. If the current choice leads to an invalid state, remove the number and try another possibility.
9. Continue until the complete Sudoku is solved.

This process is called **backtracking** because the algorithm goes back to a previous decision whenever it reaches an invalid state.




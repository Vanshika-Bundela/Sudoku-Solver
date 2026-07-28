class Solution:

    def solveSudoku(self, board):

        def is_valid(row, col, num):

            # Check row
            for j in range(9):
                if board[row][j] == num:
                    return False

            # Check column
            for i in range(9):
                if board[i][col] == num:
                    return False

            # Check 3 x 3 box
            start_row = (row // 3) * 3
            start_col = (col // 3) * 3

            for i in range(start_row, start_row + 3):
                for j in range(start_col, start_col + 3):

                    if board[i][j] == num:
                        return False

            return True


        def solve():

            # Find empty cell
            for row in range(9):
                for col in range(9):

                    if board[row][col] == ".":

                        # Try numbers 1 to 9
                        for num in "123456789":

                            if is_valid(row, col, num):

                                # Place number
                                board[row][col] = num

                                # Recursion
                                if solve():
                                    return True

                                # Backtrack
                                board[row][col] = "."

                        return False

            return True


        solve()



def print_sudoku(board):

    line = "+-------+-------+-------+"

    print(line)

    for i in range(9):

        print("|", end=" ")

        for j in range(9):

            print(board[i][j], end=" ")

            if j == 2 or j == 5 or j == 8:
                print("|", end=" ")

        print()

        if i == 2 or i == 5 or i == 8:
            print(line)


#BOARD

board = [
    ["5", "3", ".", ".", "7", ".", ".", ".", "."],
    ["6", ".", ".", "1", "9", "5", ".", ".", "."],
    [".", "9", "8", ".", ".", ".", ".", "6", "."],

    ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
    ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
    ["7", ".", ".", ".", "2", ".", ".", ".", "6"],

    [".", "6", ".", ".", ".", ".", "2", "8", "."],
    [".", ".", ".", "4", "1", "9", ".", ".", "5"],
    [".", ".", ".", ".", "8", ".", ".", "7", "9"]
]


#MAIN

sudoku = Solution()

print("Original Sudoku:")
print_sudoku(board)

sudoku.solveSudoku(board)

print("\nSolved Sudoku:")
print_sudoku(board)

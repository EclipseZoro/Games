import React, { useState, useEffect } from "react";
import "./style.css";

const Sudoku = () => {
  const size = 9;
  const [grid, setGrid] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  // Sample Sudoku puzzle (moderate difficulty)
  const puzzle = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ];

  useEffect(() => {
    setGrid(puzzle.map((row) => [...row]));
  }, []);

  const handleChange = (row, col, value) => {
    if (!/^[1-9]?$/.test(value)) return;
    const newGrid = [...grid];
    newGrid[row][col] = value ? parseInt(value) : 0;
    setGrid(newGrid);
  };

  const validateSudoku = (grid) => {
    const isValidBlock = (block) => {
      const set = new Set(block.filter((num) => num > 0));
      return set.size === block.length;
    };

    for (let i = 0; i < size; i++) {
      const row = grid[i];
      const col = grid.map((row) => row[i]);

      if (!isValidBlock(row) || !isValidBlock(col)) return false;

      if (i % 3 === 0) {
        for (let j = 0; j < size; j += 3) {
          const subgrid = [
            ...grid[i].slice(j, j + 3),
            ...grid[i + 1].slice(j, j + 3),
            ...grid[i + 2].slice(j, j + 3),
          ];
          if (!isValidBlock(subgrid)) return false;
        }
      }
    }
    return true;
  };

  const checkAnswer = () => {
    if (grid.flat().includes(0)) {
      setFeedback("Sudoku is not complete.");
      return;
    }
    if (validateSudoku(grid)) {
      setFeedback("Sudoku is correct!");
      setIsCompleted(true);
    } else {
      setFeedback("Sudoku is incorrect.");
    }
  };

  return (
    <div className="sudoku-container">
      {/* <div className="game-controls">
        <button onClick={() => (window.location.href = "../index.html")}>
          Return to Levels
        </button>
        <button
          className="next-level-button"
          onClick={() => (window.location.href = "../6/index.html")}
          style={{ display: isCompleted ? "block" : "none" }}
        >
          Next Level
        </button>
      </div> */}
      <h1>Sudoku Game</h1>
      <div className="sudoku-board">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="text"
              maxLength="1"
              value={cell !== 0 ? cell : ""}
              disabled={puzzle[rowIndex][colIndex] !== 0}
              onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
            />
          ))
        )}
      </div>
      <button onClick={checkAnswer}>Check Answer</button>
      <p className="feedback">{feedback}</p>

      {isCompleted && (
        <div className="win-message">
          <h2>Congratulations! 🎉</h2>
          <p>You've completed the sudoku</p>
          <div className="win-buttons">
            <button onClick={() => (window.location.href = "./game.jsx")}>
              Restart
            </button>
            {/* <button onClick={() => (window.location.href = "../6/index.html")}>
              Next Level
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sudoku;

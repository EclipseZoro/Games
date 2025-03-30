import React, { useState, useEffect } from 'react';
import './style.css';

const BOARD_SIZE = 7;
const INITIAL_BOARD = [
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 2, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 0, 0]
];

const PegSolitaire = () => {
  const [board, setBoard] = useState(JSON.parse(JSON.stringify(INITIAL_BOARD)));
  const [selectedPeg, setSelectedPeg] = useState(null);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  // Reset the game
  const resetGame = () => {
    setBoard(JSON.parse(JSON.stringify(INITIAL_BOARD)));
    setSelectedPeg(null);
    setMoves(0);
    setGameOver(false);
    setWon(false);
  };

  // Handle peg selection
  const handlePegClick = (row, col) => {
    if (gameOver) return;

    // If no peg is selected and clicked cell has a peg, select it
    if (selectedPeg === null && board[row][col] === 1) {
      setSelectedPeg({ row, col });
      return;
    }

    // If same peg is clicked again, deselect it
    if (selectedPeg && selectedPeg.row === row && selectedPeg.col === col) {
      setSelectedPeg(null);
      return;
    }

    // If a peg is already selected, try to move it
    if (selectedPeg) {
      if (board[row][col] === 2) {
        // Check if this is a valid jump
        if (isValidMove(selectedPeg.row, selectedPeg.col, row, col)) {
          makeMove(selectedPeg.row, selectedPeg.col, row, col);
        }
      } else if (board[row][col] === 1) {
        // Select the new peg
        setSelectedPeg({ row, col });
      }
    }
  };

  // Check if a move is valid
  const isValidMove = (fromRow, fromCol, toRow, toCol) => {
    // Check if moving exactly 2 spaces in one direction
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    if ((rowDiff === 2 && colDiff === 0) || (rowDiff === 0 && colDiff === 2)) {
      const midRow = (fromRow + toRow) / 2;
      const midCol = (fromCol + toCol) / 2;
      
      // Check if there's a peg in the middle
      return board[midRow][midCol] === 1;
    }
    return false;
  };

  // Execute a valid move
  const makeMove = (fromRow, fromCol, toRow, toCol) => {
    const newBoard = [...board.map(row => [...row])];
    const midRow = (fromRow + toRow) / 2;
    const midCol = (fromCol + toCol) / 2;

    // Move the peg
    newBoard[fromRow][fromCol] = 2;
    newBoard[midRow][midCol] = 2;
    newBoard[toRow][toCol] = 1;

    setBoard(newBoard);
    setSelectedPeg(null);
    setMoves(moves + 1);

    // Check win condition
    checkWinCondition(newBoard);
  };

  // Check if the game is won
  const checkWinCondition = (currentBoard) => {
    let pegCount = 0;
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (currentBoard[i][j] === 1) pegCount++;
        if (pegCount > 1) return;
      }
    }

    if (pegCount === 1) {
      setWon(true);
      setGameOver(true);
    } else {
      // Check if any valid moves remain
      if (!hasValidMoves(currentBoard)) {
        setGameOver(true);
      }
    }
  };

  // Check if any valid moves remain
  const hasValidMoves = (currentBoard) => {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (currentBoard[i][j] === 1) {
          // Check all four directions for possible jumps
          if (i > 1 && currentBoard[i-1][j] === 1 && currentBoard[i-2][j] === 2) return true;
          if (i < BOARD_SIZE-2 && currentBoard[i+1][j] === 1 && currentBoard[i+2][j] === 2) return true;
          if (j > 1 && currentBoard[i][j-1] === 1 && currentBoard[i][j-2] === 2) return true;
          if (j < BOARD_SIZE-2 && currentBoard[i][j+1] === 1 && currentBoard[i][j+2] === 2) return true;
        }
      }
    }
    return false;
  };

  // Get cell class based on its state
  const getCellClass = (row, col, value) => {
    if (value === 0) return 'cell invalid';
    if (value === 2) return 'cell empty';
    
    // Highlight selected peg
    if (selectedPeg && selectedPeg.row === row && selectedPeg.col === col) {
      return 'cell peg selected';
    }
    return 'cell peg';
  };

  return (
    <div className="peg-solitaire">
      <h1>Peg Solitaire</h1>
      <div className="game-info">
        <span>Moves: {moves}</span>
        <button onClick={resetGame}>Reset Game</button>
      </div>
      
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="board-row">
            {row.map((cell, colIndex) => (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className={getCellClass(rowIndex, colIndex, cell)}
                onClick={() => handlePegClick(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="game-overlay">
          <div className="game-over-message">
            {won ? (
              <>
                <h2>Congratulations!</h2>
                <p>You won in {moves} moves!</p>
              </>
            ) : (
              <>
                <h2>Game Over</h2>
                <p>No more valid moves</p>
              </>
            )}
            <button onClick={resetGame}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PegSolitaire;
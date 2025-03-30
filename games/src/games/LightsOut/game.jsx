import React, { useState, useEffect } from 'react';
import './style.css';

const LightsOut = () => {
  const BOARD_SIZE = 5;
  const [gameState, setGameState] = useState('welcome'); // 'welcome', 'playing', 'won'
  const [moves, setMoves] = useState(0);
  const [board, setBoard] = useState(Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(false)));

  // Initialize the game board
  useEffect(() => {
    if (gameState === 'playing') {
      randomizeBoard();
    }
  }, [gameState]);

  // Create a randomized board
  const randomizeBoard = () => {
    const newBoard = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(false));
    
    // Make random moves to create a solvable puzzle
    for (let i = 0; i < BOARD_SIZE * 2; i++) {
      const row = Math.floor(Math.random() * BOARD_SIZE);
      const col = Math.floor(Math.random() * BOARD_SIZE);
      toggleLights(newBoard, row, col);
    }
    
    setBoard(newBoard);
    setMoves(0);
  };

  // Toggle lights (the clicked cell and adjacent cells)
  const toggleLights = (currentBoard, row, col) => {
    const newBoard = currentBoard.map(row => [...row]);
    const positions = [
      [row, col],
      [row - 1, col],
      [row + 1, col],
      [row, col - 1],
      [row, col + 1]
    ];

    positions.forEach(([r, c]) => {
      if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
        newBoard[r][c] = !newBoard[r][c];
      }
    });

    return newBoard;
  };

  // Handle cell click
  const handleCellClick = (row, col) => {
    if (gameState !== 'playing') return;
    
    const newBoard = toggleLights(board, row, col);
    setBoard(newBoard);
    setMoves(moves + 1);
    checkWin(newBoard);
  };

  // Check if all lights are off (win condition)
  const checkWin = (currentBoard) => {
    const hasWon = currentBoard.every(row => row.every(cell => !cell));
    if (hasWon) {
      setGameState('won');
    }
  };

  // Start the game
  const startGame = () => {
    setGameState('playing');
    randomizeBoard();
  };

  // Restart the game
  const restartGame = () => {
    setGameState('playing');
    randomizeBoard();
  };

  // Show rules
  const showRules = () => {
    alert(`Rules:\n\n1. Click on cells to toggle lights\n2. Clicking a cell toggles its state and its adjacent cells\n3. Turn off all lights to win the game\n4. Try to win in minimum moves possible!`);
  };

  // Reset the current game
  const resetGame = () => {
    randomizeBoard();
  };

  return (
    <div className="lights-out-container">
      {gameState === 'welcome' && (
      <div className="welcome-screen">
        <h1>Lights Out</h1>
        <div className="rules">
          <h3>Game Rules</h3>
          <p>Click on cells to toggle lights</p>
          <p>Clicking a cell toggles its state and adjacent cells</p>
          <p>Turn off all lights to win the game</p>
          <p>Try to win in minimum moves possible!</p>
        </div>
        <button onClick={startGame}>Start Game</button>
      </div>
    )}

      {gameState === 'playing' && (
        <div className="game-area">
          <div className="game-board">
            {board.map((row, rowIndex) => (
              <div key={rowIndex} className="board-row">
                {row.map((cell, colIndex) => (
                  <div
                    key={colIndex}
                    className={`cell ${cell ? 'on' : ''}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="moves-counter">Moves: {moves}</div>
          <div className="game-controls">
            <button className="rules-button" onClick={showRules}>Show Rules</button>
            <button className="reset-button" onClick={resetGame}>Reset Game</button>
          </div>
        </div>
      )}

      {gameState === 'won' && (
        <div className="congrats-screen">
          <h1>Congratulations! 🎉</h1>
          <p>You've won the game in {moves} moves!</p>
          <button onClick={restartGame}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default LightsOut;
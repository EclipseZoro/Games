import React, { useState, useEffect } from 'react';
import './style.css';

const KakuroGame = () => {
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'won'
  const [selectedCell, setSelectedCell] = useState(null);
  const [playerGrid, setPlayerGrid] = useState(Array(8).fill().map(() => Array(8).fill(0)));
  const [showRules, setShowRules] = useState(false);

  // Puzzle definition
  const puzzle = [
    [0, 0, [0,4], [0,10], [0,16], 0, [0,24], [0,17]],
    [0, [16,4], -1, -1, -1, [0,24], -1, -1],
    [[0,23], -1, -1, -1, -1, -1, -1, -1],
    [[0,16], -1, -1, -1, [16,3], -1, -1, 0],
    [[0,20], -1, -1, -1, -1, -1, -1, [0,15]],
    [0, [16,12], -1, -1, -1, -1, -1, -1],
    [[0,17], -1, -1, -1, [0,12], -1, -1, 0],
    [[0,11], -1, -1, 0, [0,7], -1, -1, 0]
  ];

  // Solution grid
  const solution = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 3, 2, 0, 9, 8],
    [0, 5, 7, 4, 3, 2, 1, 1],
    [0, 8, 5, 3, 0, 1, 2, 0],
    [0, 9, 2, 4, 1, 3, 1, 0],
    [0, 0, 3, 4, 5, 7, 8, 9],
    [0, 9, 8, 7, 0, 5, 7, 0],
    [0, 2, 9, 0, 0, 3, 4, 0]
  ];

  const startGame = () => {
    setGameState('playing');
    setPlayerGrid(Array(8).fill().map(() => Array(8).fill(0)));
    setSelectedCell(null);
  };

  const restartGame = () => {
    setPlayerGrid(Array(8).fill().map(() => Array(8).fill(0)));
    setSelectedCell(null);
    setGameState('playing');
  };

  const selectCell = (row, col) => {
    if (puzzle[row][col] !== -1) return;
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (num) => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    const newGrid = [...playerGrid];
    
    if (num === 0) {
      // Clear cell
      newGrid[row][col] = 0;
    } else {
      // Set number
      newGrid[row][col] = num;
    }
    
    setPlayerGrid(newGrid);
    validateMove(newGrid, row, col);
    checkWin(newGrid);
  };

  const validateMove = (grid, row, col) => {
    // In a real implementation, you would validate the sums
    // For this example, we'll just compare with the solution
    return grid[row][col] === solution[row][col];
  };

  const checkWin = (grid) => {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (puzzle[i][j] === -1 && grid[i][j] !== solution[i][j]) {
          return false;
        }
      }
    }
    setGameState('won');
    return true;
  };

  const handleKeyDown = (e) => {
    if (e.key >= '0' && e.key <= '9') {
      handleNumberInput(parseInt(e.key));
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedCell, playerGrid]);

  return (
    <div className="kakuro-container">
      {gameState === 'start' && (
        <div className="start-screen">
          <h1>KAKURO</h1>
          <div className="subtitle">Mathematical Crossword Puzzle</div>
          <div className="instructions">
            <p>Fill the grid with numbers 1-9 that sum to the given clues.</p>
            <div className="rules-list">
              <h3>Rules:</h3>
              <ul>
                <li>Use numbers 1-9 only</li>
                <li>No number can be repeated in a sum</li>
                <li>Numbers must add up to the clue given</li>
                <li>Empty cells must be filled with a single digit</li>
              </ul>
            </div>
          </div>
          <button className="start-button" onClick={startGame}>
            START GAME
          </button>
          <button className="rules-button" onClick={() => setShowRules(true)}>
            HOW TO PLAY
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="game-screen">
          <div className="game-header">
            <h2>KAKURO</h2>
            <div className="game-controls">
              <button className="control-button" onClick={() => setShowRules(true)}>
                Rules
              </button>
              <button className="control-button" onClick={restartGame}>
                Restart
              </button>
            </div>
          </div>

          <div className="game-board">
            <div className="grid">
              {puzzle.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  const cellClasses = ['cell'];
                  let content = null;

                  if (cell === 0) {
                    cellClasses.push('blocked');
                  } else if (Array.isArray(cell)) {
                    cellClasses.push('clue');
                    content = (
                      <>
                        {cell[0] > 0 && <div className="clue-down">{cell[0]}</div>}
                        {cell[1] > 0 && <div className="clue-right">{cell[1]}</div>}
                      </>
                    );
                  } else {
                    cellClasses.push('empty');
                    if (playerGrid[rowIndex][colIndex] > 0) {
                      content = playerGrid[rowIndex][colIndex];
                    }
                    if (selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex) {
                      cellClasses.push('selected');
                    }
                  }

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={cellClasses.join(' ')}
                      onClick={() => selectCell(rowIndex, colIndex)}
                    >
                      {content}
                    </div>
                  );
                })
              )}
            </div>
            <div className="number-pad">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  className="num-btn"
                  onClick={() => handleNumberInput(num)}
                >
                  {num}
                </button>
              ))}
              <button
                className="num-btn clear"
                onClick={() => handleNumberInput(0)}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState === 'won' && (
        <div className="win-screen">
          <h2>Congratulations!</h2>
          <div className="win-message">
            <p>You've solved the Kakuro puzzle!</p>
            <div className="sparkles">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="sparkle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
          </div>
          <div className="win-buttons">
            <button onClick={restartGame}>Play Again</button>
          </div>
        </div>
      )}

      {showRules && (
        <div className="modal" onClick={() => setShowRules(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={() => setShowRules(false)}>
              ×
            </button>
            <h2>How to Play Kakuro</h2>
            <div className="rules-content">
              <div className="rules-section">
                <h3>Basic Rules:</h3>
                <ul>
                  <li>Fill empty cells with numbers 1-9</li>
                  <li>Numbers in each run must sum to the clue number</li>
                  <li>No number can be repeated in a run</li>
                  <li>Clues are given as sums for rows (→) and columns (↓)</li>
                </ul>
              </div>
              <div className="rules-section">
                <h3>How to Play:</h3>
                <ol>
                  <li>Click an empty cell to select it</li>
                  <li>Use the number pad to enter a number</li>
                  <li>Click 'Clear' to remove a number</li>
                  <li>Complete all runs to win the game</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KakuroGame;
import React, { useState, useEffect } from 'react';
import './style.css';

const SlidingPuzzle = () => {
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'won'
  const [tiles, setTiles] = useState([]);
  const [isGameWon, setIsGameWon] = useState(false);
  const [message, setMessage] = useState('');
  
  const size = 4; // 4x4 grid

  // Initialize the puzzle
  const createPuzzle = () => {
    const newTiles = [...Array(size * size).keys()].slice(1);
    newTiles.push(null);
    setTiles(newTiles);
    setIsGameWon(false);
    setMessage('');
  };

  // Shuffle the tiles
  const shuffleTiles = () => {
    let shuffledTiles;
    do {
      shuffledTiles = [...tiles.filter(tile => tile !== null)];
      // Fisher-Yates shuffle algorithm
      for (let i = shuffledTiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledTiles[i], shuffledTiles[j]] = [shuffledTiles[j], shuffledTiles[i]];
      }
      shuffledTiles.push(null);
    } while (!isSolvable(shuffledTiles));

    setTiles(shuffledTiles);
    setIsGameWon(false);
    setMessage('');
  };

  // Check if the puzzle is solvable
  const isSolvable = (tileArray) => {
    const filteredTiles = tileArray.filter(tile => tile !== null);
    let inversions = 0;
    
    for (let i = 0; i < filteredTiles.length - 1; i++) {
      for (let j = i + 1; j < filteredTiles.length; j++) {
        if (filteredTiles[i] > filteredTiles[j]) inversions++;
      }
    }

    const emptyIndex = tileArray.indexOf(null);
    const emptyRowFromBottom = Math.floor(emptyIndex / size) + 1;
    return (inversions + emptyRowFromBottom) % 2 === 0;
  };

  // Move a tile
  const moveTile = (index) => {
    if (isGameWon) return;

    const emptyIndex = tiles.indexOf(null);
    const validMoves = [
      emptyIndex - 1, emptyIndex + 1,
      emptyIndex - size, emptyIndex + size
    ];

    // Check if the move is valid (adjacent and not wrapping around the grid)
    if (validMoves.includes(index) && 
        !(emptyIndex % size === 0 && index % size === size - 1) && 
        !(emptyIndex % size === size - 1 && index % size === 0)) {
      
      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]];
      setTiles(newTiles);
      checkWin(newTiles);
    }
  };

  // Check if the player has won
  const checkWin = (currentTiles) => {
    if (currentTiles.slice(0, -1).every((tile, index) => tile === index + 1)) {
      setIsGameWon(true);
      setMessage('Congratulations! You solved the puzzle!');
    }
  };

  // Start the game
  const startGame = () => {
    setGameState('playing');
    createPuzzle();
    shuffleTiles();
  };

  // Restart the game
  const restartGame = () => {
    createPuzzle();
    shuffleTiles();
  };

  // Initialize the game
  useEffect(() => {
    createPuzzle();
  }, []);

  return (
    <div className="sliding-puzzle-container">
      {gameState === 'start' && (
        <div className="start-page">
          <h1>Sliding Puzzle Game</h1>
          <button className="start-button" onClick={startGame}>
            Start Game
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="game-container">
          <div className="puzzle">
            {tiles.map((tile, index) => (
              <div
                key={index}
                className={`tile ${tile === null ? 'empty' : ''}`}
                onClick={() => moveTile(index)}
              >
                {tile}
              </div>
            ))}
          </div>
          <button className="shuffle-button" onClick={shuffleTiles}>
            Shuffle & Start
          </button>
          <div className="message">{message}</div>
          {isGameWon && (
            <button className="restart-button" onClick={restartGame}>
              Play Again
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SlidingPuzzle;
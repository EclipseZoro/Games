import React, { useState, useEffect, useCallback } from 'react';
import './style.css';

const COLORS = ['red', 'blue', 'green', 'yellow'];
const INITIAL_DELAY = 1000;
const SEQUENCE_DELAY = 800;
const FLASH_DURATION = 500;
const WINNING_SCORE = 10;

const SimonSays = () => {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComputerTurn, setIsComputerTurn] = useState(true);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(false);
  const [activeColor, setActiveColor] = useState(null);

  // Initialize the game
  const startGame = useCallback(() => {
    setSequence([]);
    setPlayerSequence([]);
    setScore(0);
    setGameOver(false);
    setWinner(false);
    setIsPlaying(true);
    setIsComputerTurn(true);
    setTimeout(() => addToSequence(), INITIAL_DELAY);
  }, []);

  // Add a new color to the sequence
  const addToSequence = useCallback(() => {
    const newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    setSequence(prev => [...prev, newColor]);
  }, []);

  // Play the sequence correctly
  const playSequence = useCallback(() => {
    let i = 0;
    setIsComputerTurn(true);
    
    const playNext = () => {
      if (i < sequence.length) {
        setActiveColor(sequence[i]);
        setTimeout(() => {
          setActiveColor(null);
          i++;
          setTimeout(playNext, SEQUENCE_DELAY);
        }, FLASH_DURATION);
      } else {
        setTimeout(() => setIsComputerTurn(false), SEQUENCE_DELAY);
      }
    };
    
    setTimeout(playNext, INITIAL_DELAY);
  }, [sequence]);

  // Handle player input
  const handleColorClick = (color) => {
    if (!isPlaying || isComputerTurn || gameOver || winner) return;

    setActiveColor(color);
    setTimeout(() => setActiveColor(null), FLASH_DURATION / 2);

    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);

    // Check if the player's input matches the full sequence so far
    for (let i = 0; i < newPlayerSequence.length; i++) {
      if (newPlayerSequence[i] !== sequence[i]) {
        setGameOver(true);
        setIsPlaying(false);
        return;
      }
    }

    // If the player correctly repeats the full sequence, move to the next round
    if (newPlayerSequence.length === sequence.length) {
      const newScore = score + 1;
      setScore(newScore);
      if (newScore >= WINNING_SCORE) {
        setWinner(true);
        setIsPlaying(false);
        return;
      }
      setTimeout(() => {
        setPlayerSequence([]);
        setIsComputerTurn(true);
        addToSequence();
      }, INITIAL_DELAY);
    }
  };

  // Start the game or play the sequence when it changes
  useEffect(() => {
    if (isPlaying && isComputerTurn && sequence.length > 0) {
      playSequence();
    }
  }, [sequence, isPlaying, isComputerTurn, playSequence]);

  // Start the game on first render
  useEffect(() => {
    startGame();
  }, [startGame]);

  return (
    <div className="simon-container">
      <h1>Simon Says</h1>
      <div className="score">Score: {score}</div>
      
      <div className="simon-board">
        {COLORS.map(color => (
          <button
            key={color}
            className={`simon-button ${color} ${activeColor === color ? 'active' : ''}`}
            onClick={() => handleColorClick(color)}
            disabled={isComputerTurn || gameOver || winner}
          />
        ))}
      </div>

      {gameOver && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Your score: {score}</p>
          <button onClick={startGame}>Play Again</button>
        </div>
      )}

      {winner && (
        <div className="winner-message">
          <h2>Congratulations! You Won!</h2>
          <button onClick={startGame}>Restart</button>
        </div>
      )}

      {!isPlaying && !gameOver && !winner && (
        <button className="start-button" onClick={startGame}>
          Start Game
        </button>
      )}
    </div>
  );
};

export default SimonSays;
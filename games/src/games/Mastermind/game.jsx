import React, { useState, useEffect } from 'react';
import './style.css'
const MastermindGame = () => {
  const COLORS = [
    '#FF6B6B', // Red
    '#4ECDC4', // Turquoise
    '#FFD93D', // Yellow
    '#95A5A6', // Gray
    '#6C5CE7', // Purple
    '#A8E6CF'  // Mint
  ];

  const CODE_LENGTH = 4;
  const MAX_ATTEMPTS = 10;

  const [secretCode, setSecretCode] = useState([]);
  const [currentGuess, setCurrentGuess] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const generateSecretCode = () => {
    const code = [];
    for (let i = 0; i < CODE_LENGTH; i++) {
      code.push(Math.floor(Math.random() * COLORS.length));
    }
    return code;
  };

  const initializeGame = () => {
    setSecretCode(generateSecretCode());
    setCurrentGuess([]);
    setAttempts([]);
    setAttemptsLeft(MAX_ATTEMPTS);
    setGameOver(false);
    setGameWon(false);
    setGameStarted(true);
  };

  const addColorToGuess = (colorIndex) => {
    if (currentGuess.length < CODE_LENGTH && !gameOver && !gameWon) {
      setCurrentGuess([...currentGuess, colorIndex]);
    }
  };

  const removeColorFromGuess = () => {
    if (currentGuess.length > 0 && !gameOver && !gameWon) {
      setCurrentGuess(currentGuess.slice(0, -1));
    }
  };

  const checkGuess = () => {
    if (currentGuess.length !== CODE_LENGTH || gameOver || gameWon) return;

    const feedback = [];
    const codeCopy = [...secretCode];
    const guessCopy = [...currentGuess];

    // Check for correct color and position (black pegs)
    for (let i = 0; i < CODE_LENGTH; i++) {
      if (guessCopy[i] === codeCopy[i]) {
        feedback.push('black');
        codeCopy[i] = null;
        guessCopy[i] = null;
      }
    }

    // Check for correct color but wrong position (white pegs)
    for (let i = 0; i < CODE_LENGTH; i++) {
      if (guessCopy[i] !== null) {
        const colorIndex = codeCopy.findIndex(color => color === guessCopy[i]);
        if (colorIndex !== -1) {
          feedback.push('white');
          codeCopy[colorIndex] = null;
        }
      }
    }

    // Sort feedback: black pegs first, then white pegs
    feedback.sort((a, b) => {
      if (a === 'black' && b !== 'black') return -1;
      if (b === 'black' && a !== 'black') return 1;
      return 0;
    });

    // Add empty pegs if needed
    while (feedback.length < CODE_LENGTH) {
      feedback.push('empty');
    }

    const newAttempts = [...attempts, {
      guess: [...currentGuess],
      feedback: [...feedback]
    }];

    setAttempts(newAttempts);
    setCurrentGuess([]);
    setAttemptsLeft(attemptsLeft - 1);

    // Check if player won
    const blackPegs = feedback.filter(f => f === 'black').length;
    if (blackPegs === CODE_LENGTH) {
      setGameWon(true);
      setGameOver(true);
    } else if (attemptsLeft - 1 === 0) {
      setGameOver(true);
    }
  };

  const renderCurrentGuess = () => {
    return Array(CODE_LENGTH).fill().map((_, index) => (
      <div
        key={`current-${index}`}
        className={`guess-peg ${currentGuess[index] === undefined ? 'empty' : ''}`}
        style={{ background: currentGuess[index] !== undefined ? COLORS[currentGuess[index]] : '' }}
        onClick={removeColorFromGuess}
      />
    ));
  };

  const renderAttempts = () => {
    return attempts.map((attempt, attemptIndex) => (
      <div key={attemptIndex} className="attempt-row">
        <div className="pegs">
          {attempt.guess.map((colorIndex, pegIndex) => (
            <div
              key={`${attemptIndex}-${pegIndex}`}
              className="guess-peg"
              style={{ background: COLORS[colorIndex] }}
            />
          ))}
        </div>
        <div className="feedback">
          {attempt.feedback.map((fb, fbIndex) => (
            <div
              key={`${attemptIndex}-fb-${fbIndex}`}
              className={`feedback-peg ${fb}`}
            />
          ))}
        </div>
      </div>
    ));
  };

  const renderColorOptions = () => {
    return COLORS.map((color, index) => (
      <div
        key={`color-${index}`}
        className="color-option"
        style={{ background: color }}
        onClick={() => addColorToGuess(index)}
      />
    ));
  };

  const renderSecretCode = () => {
    return secretCode.map((colorIndex, index) => (
      <div
        key={`secret-${index}`}
        className="guess-peg"
        style={{ background: COLORS[colorIndex] }}
      />
    ));
  };

  return (
    <div className="mastermind-container">
      {!gameStarted ? (
        <div className="start-screen">
          <h1>MASTERMIND</h1>
          <div className="instructions">
            <p>Break the secret color code in 10 tries!</p>
            <div className="color-guide">
              {COLORS.map((color, index) => (
                <div key={`guide-${index}`} className="color-sample" style={{ background: color }} />
              ))}
            </div>
            <p>🎯 Select colors and click 'Check' to submit your guess</p>
            <p>⚫ Black peg = Correct color & position</p>
            <p>⚪ White peg = Correct color, wrong position</p>
          </div>
          <div className="start-buttons">
            <button className="start-button" onClick={initializeGame}>START GAME</button>
            <button className="rules-button" onClick={() => setShowRules(true)}>HOW TO PLAY</button>
          </div>
        </div>
      ) : (
        <div className="game-screen">
          <div className="game-header">
            <h2>MASTERMIND</h2>
            <div className="game-controls">
              <button className="rules-button" onClick={() => setShowRules(true)}>Rules</button>
              <div className="game-info">
                <span className="attempts-count">Attempts: {attemptsLeft}</span>
                <button className="restart-button" onClick={initializeGame}>New Game</button>
              </div>
            </div>
          </div>

          <div className="game-board">
            <div className="attempts-container">
              {renderAttempts()}
            </div>
            
            <div className="color-picker">
              <div className="colors">
                {renderColorOptions()}
              </div>
              <div className="current-guess">
                {renderCurrentGuess()}
              </div>
              <button
                className="check-button"
                onClick={checkGuess}
                disabled={currentGuess.length !== CODE_LENGTH || gameOver}
              >
                Check
              </button>
            </div>
          </div>
        </div>
      )}

      {showRules && (
        <div className="modal" onClick={() => setShowRules(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={() => setShowRules(false)}>×</button>
            <h2>How to Play</h2>
            <div className="rules-content">
              <p>🎯 Break the secret color code in 10 attempts!</p>
              <div className="rules-section">
                <h3>Colors Available:</h3>
                <div className="color-guide">
                  {COLORS.map((color, index) => (
                    <div key={`rules-guide-${index}`} className="color-sample" style={{ background: color }} />
                  ))}
                </div>
              </div>
              <div className="rules-section">
                <h3>How to Play:</h3>
                <ul>
                  <li>Select colors to create your guess</li>
                  <li>Click 'Check' to submit your guess</li>
                  <li>Use the feedback pegs to deduce the code</li>
                </ul>
              </div>
              <div className="rules-section">
                <h3>Feedback Pegs:</h3>
                <div className="feedback-guide">
                  <div className="feedback-item">
                    <div className="feedback-peg black" />
                    <span>Correct color & position</span>
                  </div>
                  <div className="feedback-item">
                    <div className="feedback-peg white" />
                    <span>Correct color, wrong position</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {gameWon && (
        <div className="win-screen">
          <h2 className="win-title">Congratulations! 🎉</h2>
          <p>You broke the code!</p>
          <div className="win-buttons">
            <button className="restart-button" onClick={initializeGame}>Play Again</button>
          </div>
        </div>
      )}

      {gameOver && !gameWon && (
        <div className="game-over-screen">
          <h2>Game Over!</h2>
          <p>The secret code was:</p>
          <div className="secret-code">
            {renderSecretCode()}
          </div>
          <div className="win-buttons">
            <button className="restart-button" onClick={initializeGame}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MastermindGame;
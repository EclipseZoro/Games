import React, { useState, useEffect } from "react";
import "./style.css";

const words = [
  "javascript", "react", "developer", "computer", "algorithm",
  "variable", "object", "string", "number", "boolean"
];

const Hangman = () => {
  const [word, setWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const maxMistakes = 6;

  useEffect(() => {
    setWord(words[Math.floor(Math.random() * words.length)].toUpperCase());
  }, []);

  const handleGuess = (letter) => {
    if (gameOver || guessedLetters.includes(letter)) return;

    setGuessedLetters(prevLetters => [...prevLetters, letter]);

    if (!word.includes(letter)) {
      setMistakes(prevMistakes => prevMistakes + 1);
    }
  };

  const displayWord = () => {
    return word
      .split("")
      .map(letter => (guessedLetters.includes(letter) ? letter : "_"))
      .join(" ");
  };

  useEffect(() => {
    if (mistakes >= maxMistakes) {
      setGameOver(true);
    } else if (word && word.split("").every(letter => guessedLetters.includes(letter))) {
      setGameOver(true);
    }
  }, [mistakes, guessedLetters, word]);

  return (
    <div className="hangman">
      <h1>Hangman</h1>
      <p className="word">{displayWord()}</p>
      <p className="mistakes">Mistakes: {mistakes} / {maxMistakes}</p>

      <div className="alphabet">
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(letter => (
          <button
            key={letter}
            className="letter"
            onClick={() => handleGuess(letter)}
            disabled={guessedLetters.includes(letter) || gameOver}
          >
            {letter}
          </button>
        ))}
      </div>

      <button onClick={() => window.location.reload()} className="reset-button">Restart</button>

      {gameOver && (
  <p className={`game-over ${mistakes >= maxMistakes ? 'lose' : 'win'}`}>
    {mistakes >= maxMistakes 
      ? `You Lost! 😞 The word was ${word}` 
      : "You Won! 🎉"}
  </p>
)}
    </div>
  );
};

export default Hangman;

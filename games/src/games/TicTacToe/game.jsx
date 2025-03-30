import React, { useState, useEffect } from "react";
import './style.css'; // Ensure the CSS file path is correct

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true); // Player is "X", AI is "O"
  const [gameStatus, setGameStatus] = useState("In Progress");
  const [winningLine, setWinningLine] = useState([]);
  const [animationPhase, setAnimationPhase] = useState(false);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    
    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: line };
      }
    }
    
    if (!squares.includes(null)) {
      return { winner: "Draw", line: [] };
    }
    
    return { winner: null, line: [] };
  };

  const handleClick = (index) => {
    if (board[index] || gameStatus !== "In Progress") return;

    const newBoard = [...board];
    newBoard[index] = "X"; // Player always plays "X"
    setBoard(newBoard);

    const result = calculateWinner(newBoard);
    if (result.winner) {
      setGameStatus(result.winner === "Draw" ? "Draw" : "Winner");
      setWinningLine(result.line);
      setAnimationPhase(true);
      return;
    }

    setIsXNext(false); // Switch to AI's turn
  };

  // AI Move using Minimax
  const aiMove = () => {
    if (gameStatus !== "In Progress") return;

    const bestMove = findBestMove(board);
    if (bestMove !== -1) {
      const newBoard = [...board];
      newBoard[bestMove] = "O"; // AI plays "O"
      setBoard(newBoard);

      const result = calculateWinner(newBoard);
      if (result.winner) {
        setGameStatus(result.winner === "Draw" ? "Draw" : "Winner");
        setWinningLine(result.line);
        setAnimationPhase(true);
        return;
      }
    }

    setIsXNext(true); // Back to player's turn
  };

  useEffect(() => {
    if (!isXNext) {
      setTimeout(aiMove, 500); // AI plays after 500ms delay for realism
    }
  }, [isXNext]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameStatus("In Progress");
    setWinningLine([]);
    setAnimationPhase(false);
  };

  // Minimax Algorithm to find the best move
  const minimax = (newBoard, depth, isMaximizing) => {
    const result = calculateWinner(newBoard);
    if (result.winner === "X") return -10 + depth;
    if (result.winner === "O") return 10 - depth;
    if (result.winner === "Draw") return 0;

    let bestScore = isMaximizing ? -Infinity : Infinity;

    for (let i = 0; i < 9; i++) {
      if (!newBoard[i]) {
        newBoard[i] = isMaximizing ? "O" : "X";
        let score = minimax(newBoard, depth + 1, !isMaximizing);
        newBoard[i] = null;
        bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);
      }
    }
    
    return bestScore;
  };

  const findBestMove = (board) => {
    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "O"; // AI's move
        let score = minimax(board, 0, false);
        board[i] = null;

        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }

    return move;
  };

  let statusText;
  if (gameStatus === "Winner") {
    statusText = `Winner: ${isXNext ? "O" : "X"}`;
  } else if (gameStatus === "Draw") {
    statusText = "It's a Draw!";
  } else {
    statusText = `Your Turn (X)`;
  }

  return (
    <div className="tic-tac-toe">
      <div className="game-container">
        <h1 className="title">Tic Tac Toe</h1>
        
        <div className="status-container">
          <div className={`status ${gameStatus !== "In Progress" ? "status-highlight" : ""}`}>
            {statusText}
          </div>
        </div>
        
        <div className="board">
          {board.map((cell, index) => (
            <button
              key={index}
              className={`cell ${cell === "X" ? "x-cell" : cell === "O" ? "o-cell" : ""} 
                ${winningLine.includes(index) ? "winning-cell" : ""}`}
              onClick={() => handleClick(index)}
              disabled={!!cell || gameStatus !== "In Progress"}
            >
              {cell && (
                <span className={`cell-content ${cell === "X" ? "x-mark" : "o-mark"}`}>
                  {cell}
                </span>
              )}
            </button>
          ))}
        </div>
        
        <button className="reset-button" onClick={resetGame}>
          Restart Game
        </button>
      </div>

      {/* Confetti effect */}
      {gameStatus === "Winner" && animationPhase && (
        <div className="confetti-container">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
              }}
            />
          ))}
        </div>
      )}

      {/* Background elements */}
      <div className="background">
        <div className="bg-circle circle-1"></div>
        <div className="bg-circle circle-2"></div>
        <div className="bg-circle circle-3"></div>
      </div>
    </div>
  );
};

export default TicTacToe;

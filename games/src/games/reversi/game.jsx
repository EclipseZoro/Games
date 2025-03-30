import React, { useState, useEffect } from 'react';
import './style.css';

const ReversiGame = () => {
  const [board, setBoard] = useState(Array(8).fill().map(() => Array(8).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState('black');
  const [gameOver, setGameOver] = useState(false);
  const [scores, setScores] = useState({ black: 2, white: 2 });
  const [validMoves, setValidMoves] = useState([]);
  const [aiThinking, setAiThinking] = useState(false);

  // Initialize the game board
  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const newBoard = Array(8).fill().map(() => Array(8).fill(null));
    // Initial setup
    newBoard[3][3] = 'white';
    newBoard[3][4] = 'black';
    newBoard[4][3] = 'black';
    newBoard[4][4] = 'white';
    
    setBoard(newBoard);
    setCurrentPlayer('black');
    setGameOver(false);
    setScores({ black: 2, white: 2 });
    calculateValidMoves(newBoard, 'black');
    setAiThinking(false);
  };

  // Calculate valid moves for a player
  const calculateValidMoves = (board, player) => {
    const opponent = player === 'black' ? 'white' : 'black';
    const moves = [];

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (board[y][x] !== null) continue;

        // Check all 8 directions
        const directions = [
          [-1, -1], [-1, 0], [-1, 1],
          [0, -1],          [0, 1],
          [1, -1],  [1, 0], [1, 1]
        ];

        let isValid = false;

        for (const [dy, dx] of directions) {
          let ny = y + dy;
          let nx = x + dx;
          let foundOpponent = false;

          while (ny >= 0 && ny < 8 && nx >= 0 && nx < 8) {
            if (board[ny][nx] === opponent) {
              foundOpponent = true;
              ny += dy;
              nx += dx;
            } else if (board[ny][nx] === player && foundOpponent) {
              isValid = true;
              break;
            } else {
              break;
            }
          }

          if (isValid) break;
        }

        if (isValid) {
          moves.push({ x, y });
        }
      }
    }

    setValidMoves(moves);
    return moves;
  };

  // Make a move
  const makeMove = (x, y) => {
    if (gameOver || board[y][x] !== null || !validMoves.some(move => move.x === x && move.y === y)) {
      return;
    }

    const newBoard = JSON.parse(JSON.stringify(board));
    const opponent = currentPlayer === 'black' ? 'white' : 'black';
    newBoard[y][x] = currentPlayer;

    // Flip opponent's pieces
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],          [0, 1],
      [1, -1],  [1, 0], [1, 1]
    ];

    let flipped = 0;

    for (const [dy, dx] of directions) {
      let ny = y + dy;
      let nx = x + dx;
      const toFlip = [];

      while (ny >= 0 && ny < 8 && nx >= 0 && nx < 8) {
        if (newBoard[ny][nx] === opponent) {
          toFlip.push([ny, nx]);
          ny += dy;
          nx += dx;
        } else if (newBoard[ny][nx] === currentPlayer && toFlip.length > 0) {
          // Flip all pieces in toFlip
          toFlip.forEach(([fy, fx]) => {
            newBoard[fy][fx] = currentPlayer;
            flipped++;
          });
          break;
        } else {
          break;
        }
      }
    }

    // Update board and scores
    setBoard(newBoard);
    const newBlackCount = countPieces(newBoard, 'black');
    const newWhiteCount = countPieces(newBoard, 'white');
    setScores({ black: newBlackCount, white: newWhiteCount });

    // Check if game is over
    const nextPlayer = currentPlayer === 'black' ? 'white' : 'black';
    const nextMoves = calculateValidMoves(newBoard, nextPlayer);

    if (nextMoves.length === 0) {
      // Current player gets another turn
      const currentMoves = calculateValidMoves(newBoard, currentPlayer);
      if (currentMoves.length === 0) {
        setGameOver(true);
      }
    } else {
      setCurrentPlayer(nextPlayer);
      
      // AI move if it's white's turn
      if (nextPlayer === 'white') {
        setAiThinking(true);
        setTimeout(() => {
          makeAIMove(newBoard);
          setAiThinking(false);
        }, 800); // Delay to make it feel more natural
      }
    }
  };

  // Count pieces for a player
  const countPieces = (board, player) => {
    return board.flat().filter(cell => cell === player).length;
  };

  // AI move - uses a simple heuristic with some randomness
  const makeAIMove = (currentBoard) => {
    const moves = calculateValidMoves(currentBoard, 'white');
    
    if (moves.length === 0) {
      // No moves available for AI
      const nextMoves = calculateValidMoves(currentBoard, 'black');
      if (nextMoves.length === 0) {
        setGameOver(true);
      } else {
        setCurrentPlayer('black');
      }
      return;
    }

    // Evaluate each move with a simple heuristic
    const evaluatedMoves = moves.map(move => {
      const { x, y } = move;
      let score = 0;
      
      // Prefer corners and edges
      if ((x === 0 || x === 7) && (y === 0 || y === 7)) score += 10; // Corner
      else if (x === 0 || x === 7 || y === 0 || y === 7) score += 3; // Edge
      
      // Avoid spots next to corners unless capturing them
      if (
        (x === 1 && y === 1) || (x === 1 && y === 6) ||
        (x === 6 && y === 1) || (x === 6 && y === 6)
      ) score -= 5;
      
      // Add some randomness to make it less predictable
      score += Math.random() * 2;
      
      return { ...move, score };
    });
    
    // Sort by score and pick the best move
    evaluatedMoves.sort((a, b) => b.score - a.score);
    const bestMove = evaluatedMoves[0];
    
    // Sometimes (20% chance) pick a suboptimal move to make it beatable
    const shouldMakeSuboptimalMove = Math.random() < 0.2 && evaluatedMoves.length > 1;
    const moveToMake = shouldMakeSuboptimalMove ? evaluatedMoves[1] : bestMove;
    
    // Actually make the move
    const newBoard = JSON.parse(JSON.stringify(currentBoard));
    newBoard[moveToMake.y][moveToMake.x] = 'white';
    
    // Flip opponent's pieces
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],          [0, 1],
      [1, -1],  [1, 0], [1, 1]
    ];

    for (const [dy, dx] of directions) {
      let ny = moveToMake.y + dy;
      let nx = moveToMake.x + dx;
      const toFlip = [];

      while (ny >= 0 && ny < 8 && nx >= 0 && nx < 8) {
        if (newBoard[ny][nx] === 'black') {
          toFlip.push([ny, nx]);
          ny += dy;
          nx += dx;
        } else if (newBoard[ny][nx] === 'white' && toFlip.length > 0) {
          // Flip all pieces in toFlip
          toFlip.forEach(([fy, fx]) => {
            newBoard[fy][fx] = 'white';
          });
          break;
        } else {
          break;
        }
      }
    }

    // Update board and scores
    setBoard(newBoard);
    const newBlackCount = countPieces(newBoard, 'black');
    const newWhiteCount = countPieces(newBoard, 'white');
    setScores({ black: newBlackCount, white: newWhiteCount });

    // Check if game continues
    const nextMoves = calculateValidMoves(newBoard, 'black');
    if (nextMoves.length === 0) {
      const aiMoves = calculateValidMoves(newBoard, 'white');
      if (aiMoves.length === 0) {
        setGameOver(true);
      } else {
        // AI gets another turn
        setTimeout(() => {
          makeAIMove(newBoard);
        }, 800);
      }
    } else {
      setCurrentPlayer('black');
    }
  };

  // Render a cell
  const renderCell = (x, y) => {
    const cellValue = board[y][x];
    const isValidMove = validMoves.some(move => move.x === x && move.y === y) && currentPlayer === 'black' && !aiThinking;
    
    let cellClass = 'cell';
    if (cellValue === 'black') cellClass += ' black';
    if (cellValue === 'white') cellClass += ' white';
    if (isValidMove) cellClass += ' valid-move';
    
    return (
      <div 
        key={`${x}-${y}`} 
        className={cellClass}
        onClick={() => !aiThinking && makeMove(x, y)}
      >
        {isValidMove && <div className="hint-dot"></div>}
      </div>
    );
  };

  return (
    <div className="reversi-game">
      <h1>Reversi (Othello)</h1>
      
      <div className="game-info">
        <div className={`player-turn ${currentPlayer}`}>
          {aiThinking ? 'AI is Thinking...' : currentPlayer === 'black' ? 'Your Turn (Black)' : 'AI Turn (White)'}
        </div>
        <div className="scores">
          <span className="black-score">You: {scores.black}</span>
          <span className="white-score">AI: {scores.white}</span>
        </div>
      </div>
      
      <div className="board">
        {board.map((row, y) => (
          <div key={y} className="row">
            {row.map((_, x) => renderCell(x, y))}
          </div>
        ))}
      </div>
      
      <div className="controls">
        <button onClick={resetGame}>New Game</button>
      </div>
      
      {gameOver && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>
            {scores.black > scores.white ? 'You Win!' : 
             scores.white > scores.black ? 'AI Wins!' : 'It\'s a Tie!'}
          </p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default ReversiGame;
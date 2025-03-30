import React, { useState, useEffect } from 'react';
import './style.css';

const HexGame = () => {
  const SIZE = 11;
  const [board, setBoard] = useState(Array(SIZE).fill().map(() => Array(SIZE).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState('red');
  const [winner, setWinner] = useState(null);
  const [aiThinking, setAiThinking] = useState(false);

  // Hex neighbor offsets for even-r offset coordinates
  const evenROffsets = {
    even: [
      [0, -1], [1, -1],   // Top neighbors
      [-1, 0], [1, 0],    // Side neighbors
      [0, 1], [1, 1]      // Bottom neighbors
    ],
    odd: [
      [-1, -1], [0, -1],  // Top neighbors
      [-1, 0], [1, 0],    // Side neighbors
      [-1, 1], [0, 1]     // Bottom neighbors
    ]
  };

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    setBoard(Array(SIZE).fill().map(() => Array(SIZE).fill(null)));
    setCurrentPlayer('red');
    setWinner(null);
    setAiThinking(false);
  };

  const getNeighbors = (x, y) => {
    const parity = y % 2 === 0 ? 'even' : 'odd';
    return evenROffsets[parity].map(([dx, dy]) => [x + dx, y + dy]);
  };

  const checkWin = (board, player) => {
    const visited = Array(SIZE).fill().map(() => Array(SIZE).fill(false));
    const queue = [];
    
    // Initialize queue with starting edge cells
    if (player === 'red') {
      for (let x = 0; x < SIZE; x++) {
        if (board[0][x] === player) {
          queue.push([x, 0]);
          visited[0][x] = true;
        }
      }
    } else {
      for (let y = 0; y < SIZE; y++) {
        if (board[y][0] === player) {
          queue.push([0, y]);
          visited[y][0] = true;
        }
      }
    }

    // Perform BFS
    while (queue.length > 0) {
      const [cx, cy] = queue.shift();

      // Check if reached opposite edge
      if (player === 'red' && cy === SIZE - 1) return true;
      if (player === 'blue' && cx === SIZE - 1) return true;

      // Check all hex neighbors
      const neighbors = getNeighbors(cx, cy);
      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE && 
            board[ny][nx] === player && !visited[ny][nx]) {
          visited[ny][nx] = true;
          queue.push([nx, ny]);
        }
      }
    }

    return false;
  };

  // Calculate shortest path potential for a player
  const calculatePathPotential = (board, player) => {
    const distance = Array(SIZE).fill().map(() => Array(SIZE).fill(Infinity));
    const queue = [];
    
    // Initialize distances for starting edge
    if (player === 'red') {
      for (let x = 0; x < SIZE; x++) {
        if (board[0][x] === player) {
          distance[0][x] = 0;
          queue.push([x, 0]);
        } else if (board[0][x] === null) {
          distance[0][x] = 1;
          queue.push([x, 0]);
        }
      }
    } else {
      for (let y = 0; y < SIZE; y++) {
        if (board[y][0] === player) {
          distance[y][0] = 0;
          queue.push([0, y]);
        } else if (board[y][0] === null) {
          distance[y][0] = 1;
          queue.push([0, y]);
        }
      }
    }

    // Dijkstra's algorithm to find shortest path potential
    while (queue.length > 0) {
      queue.sort((a, b) => distance[a[1]][a[0]] - distance[b[1]][b[0]]);
      const [cx, cy] = queue.shift();

      // Check neighbors
      const neighbors = getNeighbors(cx, cy);
      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE) {
          let newDist = distance[cy][cx];
          if (board[ny][nx] === player) {
            newDist += 0;
          } else if (board[ny][nx] === null) {
            newDist += 1;
          } else {
            continue; // opponent's piece - can't move through
          }

          if (newDist < distance[ny][nx]) {
            distance[ny][nx] = newDist;
            queue.push([nx, ny]);
          }
        }
      }
    }

    // Find minimum distance to opposite edge
    let minDistance = Infinity;
    if (player === 'red') {
      for (let x = 0; x < SIZE; x++) {
        minDistance = Math.min(minDistance, distance[SIZE-1][x]);
      }
    } else {
      for (let y = 0; y < SIZE; y++) {
        minDistance = Math.min(minDistance, distance[y][SIZE-1]);
      }
    }

    return minDistance;
  };

  const makeMove = (x, y) => {
    if (winner || board[y][x] !== null || aiThinking) return;

    const newBoard = board.map(row => [...row]);
    newBoard[y][x] = currentPlayer;
    setBoard(newBoard);

    if (checkWin(newBoard, currentPlayer)) {
      setWinner(currentPlayer);
      return;
    }

    const nextPlayer = currentPlayer === 'red' ? 'blue' : 'red';
    setCurrentPlayer(nextPlayer);

    if (nextPlayer === 'blue' && !winner) {
      setAiThinking(true);
      setTimeout(() => makeAIMove(newBoard), 500);
    }
  };

  const makeAIMove = (currentBoard) => {
    const emptyCells = [];
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        if (currentBoard[y][x] === null) {
          emptyCells.push([x, y]);
        }
      }
    }

    if (emptyCells.length === 0) {
      setAiThinking(false);
      return;
    }

    // Enhanced AI with path potential evaluation
    let bestScore = -Infinity;
    let bestMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    for (const [x, y] of emptyCells) {
      let score = 0;

      // Immediate win check
      const testBoardWin = currentBoard.map(row => [...row]);
      testBoardWin[y][x] = 'blue';
      if (checkWin(testBoardWin, 'blue')) {
        bestMove = [x, y];
        bestScore = Infinity;
        break;
      }

      // Block opponent's immediate win
      const testBoardBlock = currentBoard.map(row => [...row]);
      testBoardBlock[y][x] = 'red';
      if (checkWin(testBoardBlock, 'red')) {
        score += 10000;
      }

      // Calculate path potentials
      const bluePotential = calculatePathPotential(currentBoard, 'blue');
      const redPotential = calculatePathPotential(currentBoard, 'red');
      
      // Test this move's effect on potentials
      const testBoard = currentBoard.map(row => [...row]);
      testBoard[y][x] = 'blue';
      const newBluePotential = calculatePathPotential(testBoard, 'blue');
      const newRedPotential = calculatePathPotential(testBoard, 'red');

      // Score based on improving our path and blocking opponent
      score += (bluePotential - newBluePotential) * 100;
      score += (redPotential - newRedPotential) * 50;

      // Center control bonus
      const centerDist = Math.sqrt(Math.pow(x - SIZE/2, 2) + Math.pow(y - SIZE/2, 2));
      score += (SIZE - centerDist) * 2;

      // Randomness to make AI less predictable
      score += Math.random() * 20;

      if (score > bestScore) {
        bestScore = score;
        bestMove = [x, y];
      }
    }

    // Make the AI move
    const [x, y] = bestMove;
    const newBoard = currentBoard.map(row => [...row]);
    newBoard[y][x] = 'blue';
    setBoard(newBoard);

    if (checkWin(newBoard, 'blue')) {
      setWinner('blue');
    } else {
      setCurrentPlayer('red');
    }
    
    setAiThinking(false);
  };

  const renderHex = (x, y) => {
    const value = board[y][x];
    let hexClass = 'hex';
    if (value === 'red') hexClass += ' red';
    if (value === 'blue') hexClass += ' blue';
    if (value === null && !winner && !aiThinking && currentPlayer === 'red') hexClass += ' clickable';

    return (
      <div 
        key={`${x}-${y}`}
        className={hexClass}
        onClick={() => makeMove(x, y)}
        style={{
          gridColumn: x + 1,
          gridRow: y + 1
        }}
      >
        <div className="hex-top"></div>
        <div className="hex-middle"></div>
        <div className="hex-bottom"></div>
      </div>
    );
  };

  return (
    <div className="hex-game">
      <h1>Hex</h1>
      
      <div className="game-info">
        <div className={`player-turn ${currentPlayer}`}>
          {aiThinking ? 'AI is Thinking...' : winner ? 
            `${winner === 'red' ? 'You' : 'AI'} Won!` : 
            currentPlayer === 'red' ? 'Your Turn (Red)' : 'AI Turn (Blue)'}
        </div>
      </div>
      
      <div className="board-container">
        <div className="board">
          {board.map((row, y) => 
            row.map((_, x) => renderHex(x, y)))
          }
        </div>
        <div className="border border-top"></div>
        <div className="border border-bottom"></div>
        <div className="border border-left"></div>
        <div className="border border-right"></div>
      </div>
      
      <div className="controls">
        <button onClick={resetGame}>New Game</button>
      </div>
    </div>
  );
};

export default HexGame;
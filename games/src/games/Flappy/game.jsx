import React, { useState, useEffect, useRef } from "react";
import "./style.css";

// Adjust these constants to control the bird's behavior
const GRAVITY = 0.1;
const JUMP_STRENGTH = 5;
const DESCEND_STRENGTH = 2; // New constant for descending
const PIPE_WIDTH = 60;
const PIPE_GAP = 180;
const PIPE_SPEED = 3;
const BIRD_X_POSITION = 100;
const GAME_HEIGHT = 600;
const GAME_WIDTH = 800;
const WIN_SCORE = 12;

const FlappyBird = () => {
    const [birdY, setBirdY] = useState(GAME_HEIGHT / 2);
    const [pipes, setPipes] = useState([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const gameLoopRef = useRef(null);

    // Use a ref to manage game state to avoid stale closures
    const gameStateRef = useRef({
        birdY: GAME_HEIGHT / 2,
        velocity: 0,
        pipes: [],
        score: 0,
        scoredPipes: new Set()
    });

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!gameOver && !gameWon) {
                if (event.code === "ArrowUp") {
                    // Jump when up arrow is pressed
                    gameStateRef.current.velocity = -JUMP_STRENGTH;
                } else if (event.code === "ArrowDown") {
                    // Descend faster when down arrow is pressed
                    gameStateRef.current.velocity += DESCEND_STRENGTH;
                }
            }
        };
        
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [gameOver, gameWon]);

    useEffect(() => {
        resetGame();
    }, []);

    useEffect(() => {
        if (!gameOver && !gameWon) {
            gameLoopRef.current = requestAnimationFrame(gameLoop);
        }
        return () => cancelAnimationFrame(gameLoopRef.current);
    }, [gameOver, gameWon]);

    const gameLoop = () => {
        const gs = gameStateRef.current;

        // Update bird position with gravity
        gs.birdY = Math.max(0, Math.min(gs.birdY + gs.velocity, GAME_HEIGHT - 30));
        gs.velocity += GRAVITY;

        // Update pipes
        gs.pipes = gs.pipes
            .map(pipe => ({ ...pipe, x: pipe.x - PIPE_SPEED }))
            .filter(pipe => pipe.x + PIPE_WIDTH > 0);

        // Add new pipe if needed
        if (gs.pipes.length === 0 || gs.pipes[gs.pipes.length - 1].x < GAME_WIDTH - 300) {
            const topHeight = Math.floor(Math.random() * (GAME_HEIGHT - PIPE_GAP - 100)) + 50;
            const bottomHeight = GAME_HEIGHT - PIPE_GAP - topHeight;
            gs.pipes.push({ x: GAME_WIDTH, topHeight, bottomHeight, id: Date.now() });
        }

        // Check collisions and score
        checkCollision(gs);
        checkScore(gs);

        // Update state for rendering
        setBirdY(gs.birdY);
        setPipes([...gs.pipes]);
        setScore(gs.score);

        if (!gameOver && !gameWon) {
            gameLoopRef.current = requestAnimationFrame(gameLoop);
        }
    };

    const checkCollision = (gs) => {
        // Check floor collision
        if (gs.birdY >= GAME_HEIGHT - 30) {
            endGame();
            return;
        }

        // Check pipe collisions
        for (const pipe of gs.pipes) {
            if (BIRD_X_POSITION + 30 > pipe.x && 
                BIRD_X_POSITION < pipe.x + PIPE_WIDTH &&
                (gs.birdY < pipe.topHeight || gs.birdY + 30 > GAME_HEIGHT - pipe.bottomHeight)) {
                endGame();
                return;
            }
        }
    };

    const checkScore = (gs) => {
        for (const pipe of gs.pipes) {
            if (!gs.scoredPipes.has(pipe.id) && pipe.x + PIPE_WIDTH < BIRD_X_POSITION) {
                gs.score++;
                gs.scoredPipes.add(pipe.id);
                if (gs.score >= WIN_SCORE) {
                    setGameWon(true);
                }
            }
        }
    };

    const endGame = () => {
        setGameOver(true);
        cancelAnimationFrame(gameLoopRef.current);
    };

    const resetGame = () => {
        gameStateRef.current = {
            birdY: GAME_HEIGHT / 2,
            velocity: 0,
            pipes: [],
            score: 0,
            scoredPipes: new Set()
        };
        setBirdY(GAME_HEIGHT / 2);
        setPipes([]);
        setScore(0);
        setGameOver(false);
        setGameWon(false);
        
        if (gameLoopRef.current) {
            cancelAnimationFrame(gameLoopRef.current);
        }
        gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    return (
        <div className="game-wrapper">
            <div className="game-container">
                <h2>Flappy Bird</h2>
                <div className="game-area" style={{ height: GAME_HEIGHT + 'px', width: GAME_WIDTH + 'px' }}>
                    <div className="bird" style={{ top: birdY + "px", left: BIRD_X_POSITION + "px" }}></div>
                    {pipes.map((pipe) => (
                        <React.Fragment key={pipe.id}>
                            <div 
                                className="pipe pipe-top" 
                                style={{ 
                                    height: `${pipe.topHeight}px`, 
                                    left: `${pipe.x}px` 
                                }}
                            />
                            <div 
                                className="pipe pipe-bottom" 
                                style={{ 
                                    height: `${pipe.bottomHeight}px`, 
                                    left: `${pipe.x}px`,
                                    top: `${GAME_HEIGHT - pipe.bottomHeight}px`
                                }}
                            />
                        </React.Fragment>
                    ))}
                </div>
                <p className="score">Score: {score}</p>
                
                {(gameOver || gameWon) && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h3>{gameWon ? "You Win! 🎉" : "You Lose!"}</h3>
                            <p>Your score: {score}</p>
                            <button onClick={resetGame} className="restart-btn">
                                Restart Game
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlappyBird;
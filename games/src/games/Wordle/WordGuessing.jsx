import React, { useState, useEffect, useCallback } from "react";
import "./WordGuessing.css";

const words = [
    'about', 'above', 'abuse', 'actor', 'acute', 'admit', 'adopt', 'adult', 'after', 'again',
    'agent', 'agree', 'ahead', 'alarm', 'album', 'alert', 'alien', 'allow', 'alone', 'alter',
    'among', 'anger', 'angle', 'angry', 'apart', 'apple', 'apply', 'argue', 'arise', 'array',
    'aside', 'asset', 'audio', 'audit', 'avoid', 'award', 'aware', 'badly', 'baker', 'bases',
    'basic', 'basis', 'beach', 'began', 'begin', 'begun', 'being', 'below', 'bench', 'birth',
    'black', 'blame', 'blind', 'block', 'blood', 'board', 'brain', 'brand', 'bread', 'break',
    'breed', 'brief', 'bring', 'broad', 'broke', 'brown', 'build', 'built', 'catch', 'cause',
    'chain', 'chair', 'chart', 'check', 'chief', 'child', 'china', 'choir', 'civil', 'claim',
    'class', 'clean', 'clear', 'climb', 'clock', 'close', 'coach', 'coach', 'coast', 'could',
    'count', 'court', 'cover', 'craft', 'crash', 'cream', 'crime', 'cross', 'crowd', 'crown',
    'curve', 'cycle', 'daily', 'dance', 'dated', 'dealt', 'death', 'debut', 'delay', 'depth',
    'doing', 'doubt', 'dozen', 'draft', 'drama', 'drawn', 'dream', 'dress', 'drill', 'drink',
    'drive', 'dying', 'eager', 'early', 'earth', 'eight', 'elite', 'enemy', 'enjoy', 'enter',
    'entry', 'equal', 'error', 'event', 'every', 'exact', 'exist', 'extra', 'faith', 'false',
    'fault', 'favor', 'fever', 'fiber', 'field', 'fifth', 'fifty', 'fight', 'final', 'first',
    'fixed', 'flash', 'fleet', 'floor', 'focus', 'force', 'forge', 'forth', 'forty', 'forum',
    'found', 'frame', 'frank', 'fraud', 'fresh', 'front', 'fruit', 'fully', 'funny', 'giant',
    'given', 'glass', 'globe', 'going', 'grace', 'grade', 'grand', 'grant', 'grass', 'great',
    'green', 'gross', 'group', 'grown', 'guard', 'guess', 'guest', 'guide', 'happy', 'harry',
    'heart', 'heavy', 'hence', 'henry', 'horse', 'hotel', 'house', 'human', 'ideal', 'image',
    'index', 'inner', 'input', 'issue', 'japan', 'jimmy', 'joint', 'jones', 'judge', 'known',
    'label', 'large', 'laser', 'later', 'laugh', 'layer', 'learn', 'lease', 'least', 'leave',
    'legal', 'level', 'lewis', 'light', 'limit', 'links', 'lives', 'local', 'logic', 'loose',
    'lower', 'lucky', 'lunch', 'lying', 'magic', 'major', 'maker', 'march', 'maria', 'match',
    'maybe', 'mayor', 'meant', 'media', 'metal', 'might', 'minor', 'minus', 'mixed', 'model',
    'money', 'month', 'moral', 'motor', 'mount', 'mouse', 'mouth', 'movie', 'music', 'needs',
    'nerve', 'never', 'newly', 'night', 'noise', 'north', 'noted', 'novel', 'nurse', 'occur',
    'ocean', 'offer', 'often', 'order', 'other', 'ought', 'paint', 'panel', 'paper', 'party',
    'peace', 'peter', 'phase', 'phone', 'photo', 'piece', 'pilot', 'pitch', 'place', 'plain',
    'plane', 'plant', 'plate', 'point', 'pound', 'power', 'press', 'price', 'pride', 'prime',
    'print', 'prior', 'prize', 'proof', 'proud', 'prove', 'queen', 'quick', 'quiet', 'quite',
    'radio', 'raise', 'reach', 'ready', 'refer', 'right', 'rival', 'river', 'robot', 'roger',
    'roman', 'rough', 'round', 'route', 'royal', 'rural', 'scale', 'scene', 'scope', 'score',
    'sense', 'serve', 'seven', 'shall', 'shape', 'share', 'sharp', 'sheet', 'shelf', 'shell',
    'shift', 'shirt', 'shock', 'shoot', 'shore', 'short', 'shown', 'sight', 'since', 'sixth',
    'sixty', 'sized', 'skill', 'sleep', 'slide', 'small', 'smart', 'smile', 'smith', 'smoke',
    'solid', 'solve', 'sorry', 'sound', 'south', 'space', 'spare', 'speak', 'speed', 'spend',
    'spent', 'split', 'spoke', 'sport', 'staff', 'stage', 'stake', 'stand', 'start', 'state',
    'steam', 'steel', 'stick', 'still', 'stock', 'stone', 'stood', 'store', 'storm', 'story',
    'strip', 'stuck', 'study', 'stuff', 'style', 'sugar', 'suite', 'super', 'sweet', 'table',
    'taken', 'taste', 'taxes', 'teach', 'teeth', 'terry', 'texas', 'thank', 'theft', 'their',
    'theme', 'there', 'these', 'thick', 'thing', 'think', 'third', 'those', 'three', 'threw',
    'throw', 'tight', 'times', 'tired', 'title', 'today', 'topic', 'total', 'touch', 'tough',
    'tower', 'track', 'trade', 'train', 'treat', 'trend', 'trial', 'tried', 'tries', 'truck',
    'truly', 'trust', 'truth', 'twice', 'under', 'undue', 'union', 'unity', 'until', 'upper',
    'upset', 'urban', 'usage', 'usual', 'vague', 'valid', 'value', 'video', 'visit', 'vital',
    'voice', 'virus', 'waste', 'watch', 'water', 'wheel', 'where', 'which', 'while', 'white',
    'whole', 'whose', 'woman', 'women', 'world', 'worry', 'worse', 'worst', 'worth', 'would',
    'wound', 'write', 'wrong', 'wrote', 'yield', 'young', 'youth'
];

const WordGuessing = () => {
    const wordLength = 5;
    const maxAttempts = 6;
    
    const [word, setWord] = useState(() =>
        words[Math.floor(Math.random() * words.length)].toUpperCase()
    );

    const [grid, setGrid] = useState(() =>
        Array(maxAttempts).fill("").map(() => Array(wordLength).fill(""))
    );

    const [currentRow, setCurrentRow] = useState(0);
    const [currentCol, setCurrentCol] = useState(0);
    const [message, setMessage] = useState("");
    const [gameOver, setGameOver] = useState(false);
    const [rowStatuses, setRowStatuses] = useState(() =>
        Array(maxAttempts).fill().map(() => Array(wordLength).fill(""))
    );

    const checkWord = useCallback((guessedWord) => {
        const targetWordArray = word.split("");
        const statusArray = Array(wordLength).fill("incorrect");
        const usedIndices = new Set();

        // First pass: Check for correct positions (green)
        for (let i = 0; i < wordLength; i++) {
            if (guessedWord[i] === targetWordArray[i]) {
                statusArray[i] = "correct";
                usedIndices.add(i);
                targetWordArray[i] = null; // Mark as used
            }
        }

        // Second pass: Check for misplaced letters (yellow)
        for (let i = 0; i < wordLength; i++) {
            if (statusArray[i] !== "correct") {
                const foundIndex = targetWordArray.findIndex(
                    (char, index) => char === guessedWord[i] && !usedIndices.has(index)
                );
                if (foundIndex !== -1) {
                    statusArray[i] = "misplaced";
                    usedIndices.add(foundIndex);
                }
            }
        }

        return statusArray;
    }, [word]);

    const handleKeyPress = useCallback((key) => {
        if (gameOver) return;

        if (message) {
            setMessage("");
        }

        if (key === "ENTER" && currentCol === wordLength) {
            const guessedWord = grid[currentRow].join("").toUpperCase();

            const wordStatus = checkWord(guessedWord);

            setRowStatuses(prevStatuses => {
                const newStatuses = [...prevStatuses];
                newStatuses[currentRow] = wordStatus;
                return newStatuses;
            });

            if (guessedWord === word) {
                setMessage("🎉 You Win!");
                setGameOver(true);
            } else {
                if (currentRow < maxAttempts - 1) {
                    setCurrentRow(prevRow => prevRow + 1);
                    setCurrentCol(0);
                } else {
                    setMessage(`😢 Game Over! The word was ${word}`);
                    setGameOver(true);
                }
            }
        } else if (key === "BACKSPACE" && currentCol > 0) {
            setGrid(prevGrid => {
                const newGrid = [...prevGrid];
                newGrid[currentRow][currentCol - 1] = "";
                return newGrid;
            });
            setCurrentCol(prevCol => prevCol - 1);
        } else if (/^[A-Z]$/.test(key) && currentCol < wordLength) {
            setGrid(prevGrid => {
                const newGrid = [...prevGrid];
                newGrid[currentRow][currentCol] = key;
                return newGrid;
            });
            setCurrentCol(prevCol => prevCol + 1);
        }
    }, [gameOver, currentCol, currentRow, wordLength, maxAttempts, word, grid, checkWord, message]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(""), 2000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const resetGame = useCallback(() => {
        setWord(words[Math.floor(Math.random() * words.length)].toUpperCase());
        setGrid(Array(maxAttempts).fill("").map(() => Array(wordLength).fill("")));
        setCurrentRow(0);
        setCurrentCol(0);
        setMessage("");
        setGameOver(false);
        setRowStatuses(Array(maxAttempts).fill().map(() => Array(wordLength).fill("")));
    }, [maxAttempts, wordLength]);

    return (
        <div className="word-guessing-container">
            <h2>Word Guessing Game</h2>
            <div className="grid">
                {grid.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                        {row.map((letter, colIndex) => {
                            let className = "tile";
                            if (rowIndex < currentRow || (rowIndex === currentRow && currentCol === wordLength)) {
                                className += ` ${rowStatuses[rowIndex][colIndex]}`;
                            }
                            return <div key={colIndex} className={className}>{letter}</div>;
                        })}
                    </div>
                ))}
            </div>

            <Keyboard onKeyPress={handleKeyPress} />

            {message && <p className="message">{message}</p>}

            <button onClick={resetGame}>Restart</button>
        </div>
    );
};

const Keyboard = React.memo(({ onKeyPress }) => {
    const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

    return (
        <div className="keyboard">
            {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="keyboard-row">
                    {row.split("").map((letter) => (
                        <button key={letter} className="key" onClick={() => onKeyPress(letter)}>
                            {letter}
                        </button>
                    ))}
                </div>
            ))}
            <div className="keyboard-row">
                <button className="key enter" onClick={() => onKeyPress("ENTER")}>ENTER</button>
                <button className="key backspace" onClick={() => onKeyPress("BACKSPACE")}>⌫</button>
            </div>
        </div>
    );
});

export default WordGuessing;
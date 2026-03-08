import { useState, useCallback, useEffect, useMemo } from 'react';
import { evaluateGuess, getRandomWords } from '../utils/gameLogic';
import { TARGET_WORDS, VALID_WORDS } from '../utils/words';

// useGameState handles ONLY COMMITTED game state now.
export function useGameState(boardCount = 4) {
  const [targetWords, setTargetWords] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing'); // playing, won, lost

  const initializeGame = useCallback(() => {
    setTargetWords(getRandomWords(boardCount, TARGET_WORDS));
    setGuesses([]);
    setGameStatus('playing');
  }, [boardCount]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const solvedBoards = useMemo(() => {
    return targetWords.map(target => guesses.includes(target));
  }, [targetWords, guesses]);

  // Determine global status
  useEffect(() => {
    if (targetWords.length === 0) return;
    const allSolved = solvedBoards.every(solved => solved);
    if (allSolved) {
      setGameStatus('won');
    } else if (guesses.length >= boardCount + 5) { // e.g. 1 board=6 tries, 4 boards=9 tries
      setGameStatus('lost');
    } else {
      setGameStatus('playing');
    }
  }, [guesses, targetWords, boardCount, solvedBoards]);

  // We no longer track key presses here for building strings, 
  // we just provide a method to COMMIT a completed string guess.
  const commitGuess = useCallback((guess) => {
    if (gameStatus !== 'playing') return false;
    if (guess.length !== 5) return false;
    
    // Check validation
    if (!VALID_WORDS.includes(guess.toLowerCase()) && !TARGET_WORDS.includes(guess.toLowerCase())) {
        return false; // Tells caller it's invalid
    }
    
    setGuesses((prev) => [...prev, guess.toLowerCase()]);
    return true; // Valid guess, accepted
  }, [gameStatus]);

  return {
    targetWords,
    guesses,
    gameStatus,
    solvedBoards,
    maxGuesses: boardCount + 5,
    commitGuess,
    initializeGame
  };
}

import React from 'react';
import './Keyboard.css';
import { evaluateGuess, getGridLayout } from '../utils/gameLogic';
import { globalInputManager } from '../utils/InputManager';

const KEYS = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['Enter','z','x','c','v','b','n','m','Backspace']
];

export const Keyboard = React.memo(function Keyboard({ targetWords, guesses, solvedBoards, commitGuess, gameStatus }) {
  const boardCount = targetWords.length;

  const handleKeyPress = (key) => {
    if (gameStatus !== 'playing') return;

    if (key === 'Enter') {
      const guess = globalInputManager.currentGuess;
      if (guess.length !== 5) return;
      const success = commitGuess(guess);
      if (success) {
        globalInputManager.clear();
      } else {
        globalInputManager.setInvalid();
      }
    } else if (key === 'Backspace') {
      globalInputManager.setCurrentGuess(globalInputManager.currentGuess.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(key) && globalInputManager.currentGuess.length < 5) {
      globalInputManager.setCurrentGuess(globalInputManager.currentGuess + key.toLowerCase());
    }
  };

  const keyStatuses = {}; 
  const keyGuessed = {}; // Tracks if a key was EVER guessed (turns base dark gray)

  // Initialize
  KEYS.flat().forEach(k => {
    keyStatuses[k.toLowerCase()] = Array(boardCount).fill('unknown');
    keyGuessed[k.toLowerCase()] = false;
  });

  // Determine base key guessed status
  guesses.forEach(guess => {
    guess.split('').forEach(letter => {
      if (keyGuessed[letter] !== undefined) {
        keyGuessed[letter] = true;
      }
    });
  });

  // Determine grid block statuses
  targetWords.forEach((target, boardIdx) => {
    if (solvedBoards[boardIdx]) {
      // Keep it 'unknown' so it renders transparent/no highlight when solved.
      return; 
    }

    guesses.forEach(guess => {
      const statusArray = evaluateGuess(guess, target);
      guess.split('').forEach((letter, i) => {
        const letterLower = letter.toLowerCase();
        if (!keyStatuses[letterLower]) return;

        const status = statusArray[i];
        const currentBest = keyStatuses[letterLower][boardIdx];
        
        if (status === 'correct') {
          keyStatuses[letterLower][boardIdx] = 'correct';
        } else if (status === 'present' && currentBest !== 'correct') {
          keyStatuses[letterLower][boardIdx] = 'present';
        } else if (status === 'absent' && currentBest !== 'correct' && currentBest !== 'present') {
          // In an active board, an absent letter just turns transparent/absent overlay.
          keyStatuses[letterLower][boardIdx] = 'absent';
        }
      });
    });
  });

  // Fetch fractional multi-board overlay properties mathematically
  const { cols, rows } = getGridLayout(boardCount);

  return (
    <div className="keyboard">
      {KEYS.map((row, i) => (
        <div key={i} className="keyboard-row">
          {row.map((key) => {
            const isGuessed = keyGuessed[key.toLowerCase()];
            const isFuncKey = key.length > 1;
            const containerClass = `key-container ${isFuncKey ? 'large' : ''} ${isGuessed ? 'guessed' : ''}`;
            const boardStatusArray = keyStatuses[key.toLowerCase()] || [];

            return (
              <button
                key={key}
                className={containerClass}
                onClick={() => handleKeyPress(key)}
              >
                {!isFuncKey && boardCount > 1 && (
                  <div className="key-grid-overlay" style={{
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    gridTemplateRows: `repeat(${rows}, 1fr)`
                  }}>
                    {boardStatusArray.map((status, idx) => (
                      <div key={idx} className={`key-grid-cell ${status}`} />
                    ))}
                  </div>
                )}
                
                {/* Fallback for single board Wordle mode */}
                {!isFuncKey && boardCount === 1 && (
                  <div className={`key-single-overlay ${boardStatusArray[0]}`} />
                )}

                <span className="key-text">
                  {key === 'Backspace' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                      <path fill="currentColor" d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"></path>
                    </svg>
                  ) : (
                    key
                  )}
                </span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
});

import React, { useMemo } from 'react';
import { Cell } from './Cell';

import './Board.css';
import { evaluateGuess } from '../utils/gameLogic';

import { ActiveRow } from './ActiveRow';
import { EmptyRows } from './EmptyRows';

export const Board = React.memo(function Board({ targetWord, guesses, maxGuesses, isSolved }) {
  const indexOfCorrect = guesses.indexOf(targetWord);
  const displayedGuesses = indexOfCorrect !== -1 ? guesses.slice(0, indexOfCorrect + 1) : guesses;
  
  const empties = Math.max(0, maxGuesses - displayedGuesses.length - (isSolved ? 0 : 1));

  const historicalRows = useMemo(() => {
    return displayedGuesses.map((guess, i) => {
      const statusArray = evaluateGuess(guess, targetWord);
      return (
        <div key={i} className="row">
          {guess.split('').map((char, j) => (
            <Cell key={j} value={char} status={statusArray[j]} isCompleted={true} />
          ))}
        </div>
      );
    });
  }, [displayedGuesses, targetWord]);

  return (
    <div className={`board ${isSolved ? 'solved' : ''}`}>
      {historicalRows}

      {!isSolved && displayedGuesses.length < maxGuesses && (
        <ActiveRow />
      )}

      <EmptyRows count={empties} />
      
      {isSolved && <div className="solved-overlay">Solved!</div>}
    </div>
  );
});

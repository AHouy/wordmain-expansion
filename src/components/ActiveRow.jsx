import React, { useEffect, useRef } from 'react';
import { globalInputManager } from '../utils/InputManager';
import './Board.css'; // Relies on shared board CSS

export const ActiveRow = React.memo(function ActiveRow() {
  const rowRef = useRef(null);

  useEffect(() => {
    // Initialize immediately in case it mounts while a guess is halfway typed
    updateDOM(globalInputManager.currentGuess, globalInputManager.isInvalid);

    // Subscribe to instantaneous keystroke updates bypassing React render queue
    return globalInputManager.subscribe((guess, invalid) => {
      updateDOM(guess, invalid);
    });

    function updateDOM(guess, invalid) {
      if (!rowRef.current) return;
      
      if (invalid) rowRef.current.classList.add('shake');
      else rowRef.current.classList.remove('shake');

      const cells = rowRef.current.querySelectorAll('.cell');
      for (let i = 0; i < 5; i++) {
        const char = guess[i] || '';
        const cellFront = cells[i].querySelector('.cell-front');
        
        if (cellFront && cellFront.textContent !== char) {
          cellFront.textContent = char;
        }
        
        if (char) cells[i].classList.add('filled');
        else cells[i].classList.remove('filled');
      }
    }
  }, []);

  return (
    <div className="row" ref={rowRef}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={`active-${i}`} className="cell">
          <div className="cell-inner">
            <div className="cell-front"></div>
            <div className="cell-back"></div>
          </div>
        </div>
      ))}
    </div>
  );
});

import { useState, useEffect, useCallback } from 'react';
import { globalInputManager } from './utils/InputManager';
import { getGridLayout } from './utils/gameLogic';
import './App.css';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { Keyboard } from './components/Keyboard';
import { SettingsModal } from './components/SettingsModal';
import { useGameState } from './hooks/useGameState';

function App() {
  const [boardCount, setBoardCount] = useState(4); // Default Quordle
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    targetWords,
    guesses,
    gameStatus,
    solvedBoards,
    maxGuesses,
    commitGuess,
    initializeGame
  } = useGameState(boardCount);

  // Manage Physical Keyboard Input Globally
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || gameStatus !== 'playing') return;
      const key = e.key;
      
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

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commitGuess, gameStatus]);

  // Use centralized layout logic for responsive dynamic grid sizing
  const { cols } = getGridLayout(boardCount);

  // Pass custom CSS variable if the boards count isn't standard
  const gridStyle = boardCount > 8 ? {
    gridTemplateColumns: `repeat(${cols}, 1fr)`
  } : {};

  return (
    <div className="app-container">
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />
      
      <main className="game-area">
        <div 
          className={`boards-container boards-${boardCount} ${boardCount > 16 ? 'massive-boards' : ''}`}
          style={gridStyle}
        >
          {targetWords.map((word, i) => (
            <Board 
              key={i}
              targetWord={word}
              guesses={guesses}
              maxGuesses={maxGuesses}
              isSolved={solvedBoards[i]}
            />
          ))}
        </div>
      </main>

      {gameStatus === 'won' && (
        <div className="game-over-banner top win">
          Congratulations! You solved all {boardCount} words!
          <button className="play-again" onClick={initializeGame}>Play Again</button>
        </div>
      )}

      {gameStatus === 'lost' && (
        <div className="game-over-banner top loss">
          Game Over. The words were: {targetWords.join(', ').toUpperCase()}
          <button className="play-again" onClick={initializeGame}>Play Again</button>
        </div>
      )}
      <Keyboard 
        targetWords={targetWords}
        guesses={guesses}
        solvedBoards={solvedBoards}
        commitGuess={commitGuess}
        gameStatus={gameStatus}
      />

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        boardCount={boardCount}
        setBoardCount={setBoardCount}
        initializeGame={initializeGame}
      />
    </div>
  );
}

export default App;

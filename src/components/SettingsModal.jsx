import React, { useState } from 'react';
import './SettingsModal.css';

export function SettingsModal({ isOpen, onClose, boardCount, setBoardCount, initializeGame }) {
  const [customCount, setCustomCount] = useState('');

  if (!isOpen) return null;

  const handleSelect = (count) => {
    setBoardCount(count);
    initializeGame();
    onClose();
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const count = parseInt(customCount, 10);
    if (count > 0 && count <= 2000) {
      handleSelect(count);
      setCustomCount('');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <p>Select Number of Boards:</p>
          <div className="board-options">
            {[1, 2, 4, 8].map(count => (
              <button 
                key={count} 
                className={`board-btn ${boardCount === count ? 'active' : ''}`}
                onClick={() => handleSelect(count)}
              >
                {count} {count === 1 ? 'Board' : 'Boards'}
                {count === 1 ? ' (Wordle)' : count === 2 ? ' (Dordle)' : count === 4 ? ' (Quordle)' : ' (Octordle)'}
              </button>
            ))}
          </div>
          <p style={{ marginTop: '16px', marginBottom: '8px' }}>Or enter custom amount (Max 2000):</p>
          <form className="custom-board-form" onSubmit={handleCustomSubmit}>
            <input 
              type="number" 
              value={customCount} 
              onChange={(e) => setCustomCount(e.target.value)} 
              min="1" 
              max="2000"
              placeholder="Custom #"
              className="custom-input"
            />
            <button type="submit" className="board-btn custom-submit">Play</button>
          </form>
          <p className="warning">Changing boards will reset the current game!</p>
        </div>
      </div>
    </div>
  );
}

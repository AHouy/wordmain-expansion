import React from 'react';
import './Cell.css';

export const Cell = React.memo(function Cell({ value, status, isCompleted, isCurrentRow }) {
  let classes = 'cell';
  
  if (value) classes += ' filled';
  if (status) classes += ` ${status}`;
  if (isCompleted && status) classes += ' flipped';

  return (
    <div className={classes}>
      <div className="cell-inner">
        <div className="cell-front">{value}</div>
        <div className={`cell-back ${status}`}>{value}</div>
      </div>
    </div>
  );
});

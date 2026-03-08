import React from 'react';
import { Cell } from './Cell';

export const EmptyRows = React.memo(function EmptyRows({ count }) {
  if (count <= 0) return null;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={`empty-${i}`} className="row">
          {Array.from({ length: 5 }).map((_, j) => (
            <Cell key={`empty-cell-${i}-${j}`} value="" />
          ))}
        </div>
      ))}
    </>
  );
});

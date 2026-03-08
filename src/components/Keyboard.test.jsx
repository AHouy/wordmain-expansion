import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Keyboard } from './Keyboard';

describe('Keyboard Component Tests', () => {

  const defaultProps = {
    targetWords: ['apple', 'berry'],
    guesses: ['peach'],
    solvedBoards: [false, false],
    commitGuess: vi.fn(),
    gameStatus: 'playing'
  };

  it('renders all physical keyboard keys', () => {
    const { container } = render(<Keyboard {...defaultProps} />);
    
    // 26 letters + Enter + Backspace = 28 keys total
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(28);

    expect(screen.getByText('Enter')).toBeDefined();
    // Backspace uses an SVG, test standard character keys
    expect(screen.getByText('q')).toBeDefined();
    expect(screen.getByText('m')).toBeDefined();
  });

  it('generates fractional grids equal to the number of active boards', () => {
    const { container } = render(<Keyboard {...defaultProps} />);
    
    // Example: 'q' key button
    const qButton = screen.getByText('q').closest('button');
    const fractionalGrid = qButton.querySelector('.key-grid-overlay');
    
    // Should exist because we are in multi-board mode (2 boards)
    expect(fractionalGrid).not.toBeNull();
    
    const fractionCells = fractionalGrid.querySelectorAll('.key-grid-cell');
    expect(fractionCells.length).toBe(2);
  });

  it('grays out letters that have been guessed', () => {
    const { container } = render(<Keyboard {...defaultProps} />);
    
    // 'peach' was guessed. 'p' should be grayed out globally.
    const pButton = screen.getByText('p').closest('button');
    expect(pButton.classList.contains('guessed')).toBe(true);

    // 'z' was not guessed.
    const zButton = screen.getByText('z').closest('button');
    expect(zButton.classList.contains('guessed')).toBe(false);
  });
});

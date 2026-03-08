import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Board } from './Board';
import { globalInputManager as inputManager } from '../utils/InputManager';

describe('Board Component Tests', () => {

  beforeEach(() => {
    inputManager.clear();
  });

  const defaultProps = {
    targetWord: 'apple',
    guesses: [],
    maxGuesses: 6,
    isSolved: false,
  };

  it('renders correctly with empty rows', () => {
    const { container } = render(<Board {...defaultProps} />);
    
    // 1 active row + 5 empty rows = 6 rows total
    const rows = container.querySelectorAll('.row');
    expect(rows.length).toBe(6);
  });

  it('renders historical guesses', () => {
    const props = {
      ...defaultProps,
      guesses: ['peach', 'grape']
    };
    const { container } = render(<Board {...props} />);

    const cells = container.querySelectorAll('.cell');
    
    // First guess: 'peach' - should render into UI
    const firstRowFronts = Array.from(cells).slice(0, 5).map(c => c.querySelector('.cell-front').textContent);
    expect(firstRowFronts[0]).toBe('p');
    expect(firstRowFronts[1]).toBe('e');
    expect(firstRowFronts[2]).toBe('a');
    expect(firstRowFronts[3]).toBe('c');
    expect(firstRowFronts[4]).toBe('h');
  });

  it('displays solved overlay if isSolved is true', () => {
    const props = {
      ...defaultProps,
      isSolved: true
    };
    render(<Board {...props} />);
    
    const overlay = screen.getByText('Solved!');
    expect(overlay).toBeDefined();
  });

  it('hides active row when solved', () => {
    const props = {
      ...defaultProps,
      isSolved: true,
      guesses: ['apple']
    };
    const { container } = render(<Board {...props} />);
    
    // Only 1 row (the historical correct guess) + 5 empty rows = 6 rows. 
    // No active row should be appended.
    const rows = container.querySelectorAll('.row');
    expect(rows.length).toBe(6);
  });
});

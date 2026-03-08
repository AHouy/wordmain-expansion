import { describe, it, expect } from 'vitest';
import { evaluateGuess, getRandomWords, getGridLayout } from './gameLogic';

describe('gameLogic Tests', () => {

  describe('evaluateGuess', () => {
    it('returns all correct for exact match', () => {
      const result = evaluateGuess('apple', 'apple');
      expect(result).toEqual(['correct', 'correct', 'correct', 'correct', 'correct']);
    });

    it('returns all absent for no match', () => {
      const result = evaluateGuess('ghost', 'apple');
      expect(result).toEqual(['absent', 'absent', 'absent', 'absent', 'absent']);
    });

    it('identifies present letters', () => {
      const result = evaluateGuess('pleap', 'apple');
      expect(result).toEqual(['present', 'present', 'present', 'present', 'present']);
    });

    it('handles duplicate letters correctly (Wordle logic)', () => {
      // Guess has two E's, target has one E.
      // E at index 2 is correct. The other E should be absent.
      const result1 = evaluateGuess('steep', 'trees');
      expect(result1).toEqual(['present', 'present', 'correct', 'correct', 'absent']);

      const result2 = evaluateGuess('trees', 'sweet');
      expect(result2).toEqual(['present', 'absent', 'correct', 'correct', 'present']);
    });
  });

  describe('getRandomWords', () => {
    it('returns the requested number of words', () => {
      const list = ['apple', 'berry', 'cherry', 'date'];
      const result = getRandomWords(2, list);
      expect(result.length).toBe(2);
    });

    it('returns unique words', () => {
      const list = ['apple', 'berry', 'cherry', 'date', 'elder'];
      const result = getRandomWords(4, list);
      const unique = new Set(result);
      expect(unique.size).toBe(4);
    });
  });

  describe('getGridLayout', () => {
    it('handles predefined board counts', () => {
      expect(getGridLayout(1)).toEqual({ cols: 1, rows: 1 });
      expect(getGridLayout(2)).toEqual({ cols: 2, rows: 1 });
      expect(getGridLayout(4)).toEqual({ cols: 2, rows: 2 });
      expect(getGridLayout(8)).toEqual({ cols: 4, rows: 2 });
    });

    it('dynamically calculates massive board counts', () => {
      const layout40 = getGridLayout(40);
      expect(layout40.cols).toBe(7); // ceil(sqrt(40)) = 7
      expect(layout40.rows).toBe(6); // ceil(40 / 7) = 6
    });
  });
});

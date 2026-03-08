import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameState } from './useGameState';
import { TARGET_WORDS } from '../utils/words';

describe('useGameState Hook Tests', () => {

  it('initializes game with correct default structures', () => {
    const { result } = renderHook(() => useGameState(4));

    expect(result.current.targetWords.length).toBe(4);
    expect(result.current.guesses).toEqual([]);
    expect(result.current.gameStatus).toBe('playing');
    expect(result.current.solvedBoards).toEqual([false, false, false, false]);
    expect(result.current.maxGuesses).toBe(9); // 4 + 5
  });

  it('commits a valid guess to state', () => {
    const { result } = renderHook(() => useGameState(4));
    
    // Target common word guaranteed to be in dictionary
    const validWord = 'apple';

    let success;
    act(() => {
      success = result.current.commitGuess(validWord);
    });

    expect(success).toBe(true);
    expect(result.current.guesses).toContain(validWord);
  });

  it('rejects invalid inputs on commit attempt', () => {
    const { result } = renderHook(() => useGameState(4));
    
    let successLength;
    let successFake;

    act(() => {
      successLength = result.current.commitGuess('app');
      successFake = result.current.commitGuess('abcde');
    });

    expect(successLength).toBe(false);
    expect(successFake).toBe(false);
    expect(result.current.guesses.length).toBe(0);
  });
});

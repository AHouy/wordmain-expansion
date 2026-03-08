import { describe, it, expect, beforeEach, vi } from 'vitest';
import { globalInputManager as inputManager } from './InputManager';

describe('InputManager Tests', () => {

  beforeEach(() => {
    inputManager.clear();
  });

  it('initializes with empty guess and valid status', () => {
    expect(inputManager.currentGuess).toBe('');
    expect(inputManager.isInvalid).toBe(false);
  });

  it('updates current guess correctly', () => {
    inputManager.setCurrentGuess('a');
    expect(inputManager.currentGuess).toBe('a');
    
    inputManager.setCurrentGuess('apple');
    expect(inputManager.currentGuess).toBe('apple');
  });

  it('sets invalid status and then clears it', () => {
    inputManager.setInvalid();
    expect(inputManager.isInvalid).toBe(true);

    inputManager.clear();
    expect(inputManager.isInvalid).toBe(false);
    expect(inputManager.currentGuess).toBe('');
  });

  it('notifies subscribers on guess change', () => {
    const callback = vi.fn();
    const unsubscribe = inputManager.subscribe(callback);

    inputManager.setCurrentGuess('abc');
    expect(callback).toHaveBeenCalledWith('abc', false);

    unsubscribe();
    inputManager.setCurrentGuess('abcd');
    // Callback should not be called again after unsubscribe (called initially + once during 'abc')
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('notifies subscribers on invalid status shake', () => {
    // We mock set timeout to test the shake reset instantly
    vi.useFakeTimers();
    
    const callback = vi.fn();
    inputManager.subscribe(callback);

    inputManager.setInvalid();
    expect(callback).toHaveBeenCalledWith('', true); // Instantly set to true

    vi.advanceTimersByTime(600);
    expect(callback).toHaveBeenCalledWith('', false); // Auto resets after 600ms

    vi.useRealTimers();
  });
});

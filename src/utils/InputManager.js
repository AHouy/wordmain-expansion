export class InputManager {
  constructor() {
    this.listeners = new Set();
    this.currentGuess = '';
    this.isInvalid = false;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.currentGuess, this.isInvalid);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(l => l(this.currentGuess, this.isInvalid));
  }

  setCurrentGuess(guess) {
    this.currentGuess = guess;
    this.notify();
  }

  setInvalid() {
    this.isInvalid = true;
    this.notify();
    setTimeout(() => {
      this.isInvalid = false;
      this.notify();
    }, 600);
  }

  clear() {
    this.currentGuess = '';
    this.isInvalid = false;
    this.notify();
  }
}

// Global singleton instance so everything stays perfectly synced without props drilling
export const globalInputManager = new InputManager();

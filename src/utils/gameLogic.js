export function evaluateGuess(guess, target) {
  const result = Array(5).fill('absent');
  const targetChars = target.split('');
  const guessChars = guess.split('');

  // First pass: find correct letters
  guessChars.forEach((char, i) => {
    if (char === targetChars[i]) {
      result[i] = 'correct';
      targetChars[i] = null; // Mark as used
    }
  });

  // Second pass: find present letters
  guessChars.forEach((char, i) => {
    if (result[i] !== 'correct' && targetChars.includes(char)) {
      result[i] = 'present';
      targetChars[targetChars.indexOf(char)] = null; // Mark as used
    }
  });

  return result;
}

export function getRandomWords(count, wordList) {
  const words = [];
  const usedIndices = new Set();
  
  while (words.length < count) {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex);
      words.push(wordList[randomIndex]);
    }
  }
  
  return words;
}

export function getGridLayout(boardCount) {
  if (boardCount <= 1) return { cols: 1, rows: 1 };
  if (boardCount === 2) return { cols: 2, rows: 1 };
  if (boardCount === 4) return { cols: 2, rows: 2 };
  if (boardCount === 8) return { cols: 4, rows: 2 };

  const cols = Math.ceil(Math.sqrt(boardCount));
  const rows = Math.ceil(boardCount / cols);
  return { cols, rows };
}

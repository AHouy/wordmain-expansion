const fs = require("fs");
const https = require("https");

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => resolve(data));
    }).on("error", reject);
  });
}

async function run() {
  const wordsData = await fetchUrl("https://raw.githubusercontent.com/tabatkins/wordle-list/master/words");
  const commonData = await fetchUrl("https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-no-swears.txt");

  // We need a secondary general dictionary to check for 3-letter and 4-letter singular base words, 
  // because the Wordle list ONLY contains 5-letter words. We'll reuse the commonData for this.
  const valid4LetterWords = new Set(commonData.split("\n").map(w => w.trim().toLowerCase()).filter(w => w.length === 4));
  const valid3LetterWords = new Set(commonData.split("\n").map(w => w.trim().toLowerCase()).filter(w => w.length === 3));

  const validWords = wordsData.split("\n").map(w => w.trim().toLowerCase()).filter(w => w.length === 5);
  const commonWordsRaw = commonData.split("\n").map(w => w.trim().toLowerCase()).filter(w => w.length === 5);
  
  const commonSet = new Set(commonWordsRaw);

  // A word is a "simple plural" if it ends in 's', DOES NOT end in 'ss' or 'us', 
  // AND its base form (without the 's' or 'es') is actually a recognized word in the English dictionary.
  const isSimplePlural = (word) => {
    if (word.endsWith('ss') || word.endsWith('us') || word.endsWith('is') || word.endsWith('os')) return false; 
    
    // Check 'es' plurals (like boxes -> box, trees -> tree)
    if (word.endsWith('es')) {
      const base3 = word.slice(0, 3);
      const base4 = word.slice(0, 4);
      if (valid3LetterWords.has(base3) || valid4LetterWords.has(base4)) {
        // Exception filter for valid words ending in 'es' that are not plurals
        const allowedEs = ['guess', 'times', 'games', 'rules', 'notes', 'lines', 'shoes', 'types', 'pages', 'bones', 'tones', 'zones', 'miles', 'sales'];
        if (allowedEs.includes(word)) return false;
        return true; 
      }
    }
    
    // Check 's' plurals (like plants -> plant, words -> word)
    if (word.endsWith('s')) {
      const base4 = word.slice(0, 4);
      if (valid4LetterWords.has(base4)) {
         // Exception filter for valid words ending in 's' that are not plurals
         const allowedS = ['guess', 'glass', 'class', 'grass', 'cross', 'press', 'bliss', 'chess', 'chaos', 'basis', 'virus', 'bonus', 'focus', 'locus', 'minus', 'lotus', 'nexus'];
         if (allowedS.includes(word)) return false;
         return true;
      }
    }
    return false;
  };

  const targetWords = validWords.filter(w => commonSet.has(w) && !isSimplePlural(w));
  console.log("Filtered out", (validWords.filter(w => commonSet.has(w)).length - targetWords.length), "plural words.");
  
  if (targetWords.length === 0) {
    console.error("Failed to fetch words.");
    return;
  }

  const jsContent = `export const VALID_WORDS = ${JSON.stringify(validWords)};\n\nexport const TARGET_WORDS = ${JSON.stringify(targetWords)};\n`;
  const path = require("path");
  fs.writeFileSync(path.join(__dirname, "../src/utils/words.js"), jsContent);
  console.log("Dictionary updated with " + targetWords.length + " common target words and " + validWords.length + " total valid words.");
}

run();

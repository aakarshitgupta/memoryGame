export function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }
  
  export function createShuffledDeck(symbols, gridSize) {
    const numPairs = (gridSize * gridSize) / 2;
    const selected = symbols.slice(0, numPairs);
    const deck = shuffleArray([...selected, ...selected]).map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false,
      isMatched: false
    }));
    return deck;
  }
  
  // 🆕 Function to get the best score from localStorage
  export function getBestScore(gridSize, gameMode) {
    const best = JSON.parse(localStorage.getItem('bestScores')) || {};
    const key = `grid${gridSize}-${gameMode}`;
    return best[key] || { time: Infinity, attempts: Infinity }; // Return default if no score found
  }
  
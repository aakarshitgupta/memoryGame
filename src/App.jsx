import { useEffect, useState } from 'react';
import GameBoard from './components/GameBoard';
import { createShuffledDeck, getBestScore } from './utils/helpers';
import { SYMBOLS, THEMES } from './data/cards';
import './styles/styles.css';
import flipSfx from './assets/sounds/card.wav';
import matchSfx from './assets/sounds/match.wav';
import winSfx from './assets/sounds/win.wav';

const flipSound = new Audio(flipSfx);
const matchSound = new Audio(matchSfx);
const winSound = new Audio(winSfx);

export default function App() {
  const [gridSize, setGridSize] = useState(4);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const [gameMode, setGameMode] = useState('zen'); // 'zen' or 'timed'
  const [timeLeft, setTimeLeft] = useState(60);

  const [bestScore, setBestScore] = useState({ time: Infinity, attempts: Infinity });

  const [selectedTheme, setSelectedTheme] = useState('default');

  useEffect(() => {
    let timer;
    if (startTime && !gameComplete && gameMode === 'zen') {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [startTime, gameComplete, gameMode]);

  useEffect(() => {
    if (gameMode !== 'timed' || gameComplete) return;

    if (timeLeft <= 0) {
      setGameComplete(true);
      return;
    }

    const countdown = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [gameMode, timeLeft, gameComplete]);

  const initGame = () => {
    const newDeck = createShuffledDeck(THEMES[selectedTheme], gridSize);
    setCards(newDeck);
    setFlipped([]);
    setAttempts(0);
    setMatches(0);
    setGameComplete(false);
    setElapsedTime(0);
    setStartTime(Date.now());

    if (gameMode === 'timed') {
      setTimeLeft(60);
    }

    const best = getBestScore(gridSize, gameMode);
    setBestScore(best);
  };

  useEffect(() => {
    initGame();
  }, [gridSize, gameMode, selectedTheme]);

  const handleCardClick = (index) => {
    if (
      cards[index].isFlipped ||
      cards[index].isMatched ||
      flipped.length === 2 ||
      gameComplete
    )
      return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    const newFlipped = [...flipped, index];
    setCards(newCards);
    setFlipped(newFlipped);

    flipSound.play();

    if (newFlipped.length === 2) {
      setAttempts((prev) => prev + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.symbol === secondCard.symbol) {
        newCards[firstIdx].isMatched = true;
        newCards[secondIdx].isMatched = true;
        setCards(newCards);
        setMatches((prev) => prev + 1);
        setFlipped([]);
        matchSound.play();
      } else {
        setTimeout(() => {
          newCards[firstIdx].isFlipped = false;
          newCards[secondIdx].isFlipped = false;
          setCards([...newCards]);
          setFlipped([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    const totalPairs = (gridSize * gridSize) / 2;
    if (matches === totalPairs && !gameComplete) {
      setGameComplete(true);
      winSound.play();

      const score = gameMode === 'zen' ? elapsedTime : 60 - timeLeft;
      const best = JSON.parse(localStorage.getItem('bestScores')) || {};
      const key = `grid${gridSize}-${gameMode}`;

      if (
        !best[key] ||
        score < best[key].time ||
        (score === best[key].time && attempts < best[key].attempts)
      ) {
        best[key] = { time: score, attempts };
        localStorage.setItem('bestScores', JSON.stringify(best));
        setBestScore({ time: score, attempts });
      }
    }
  }, [matches, gameComplete, elapsedTime, attempts, gridSize, gameMode, timeLeft]);

  return (
    <div className="app">
      <h1>🧠 Memory Match Game</h1>

      <div className="controls">
        <label>Difficulty:</label>
        <select value={gridSize} onChange={(e) => setGridSize(parseInt(e.target.value))}>
          <option value={2}>2x2 (Easy)</option>
          <option value={4}>4x4 (Medium)</option>
          <option value={6}>6x6 (Hard)</option>
        </select>

        <label>Mode:</label>
        <select value={gameMode} onChange={(e) => setGameMode(e.target.value)}>
          <option value="zen">🧘 Zen</option>
          <option value="timed">⏱️ Timed</option>
        </select>

        <label>Theme:</label>
        <select value={selectedTheme} onChange={(e) => setSelectedTheme(e.target.value)}>
          <option value="default">🍎 Default</option>
          <option value="tech">💻 Tech</option>
          <option value="nature">🌳 Nature</option>
        </select>

        <button onClick={initGame}>🔁 Restart</button>
      </div>

      <GameBoard cards={cards} handleCardClick={handleCardClick} gridSize={gridSize} />

      <div className="stats">
        {gameMode === 'zen' ? (
          <p>🕒 Time: {elapsedTime}s</p>
        ) : (
          <p className={`timer ${timeLeft <= 10 ? 'warning' : ''}`}>⏱ Time Left: {timeLeft}s</p>
        )}
        <p>🎯 Attempts: {attempts}</p>
        <p>✅ Matches: {matches}</p>

        <p className="best-score">
          Best Score: {bestScore.time === Infinity ? 'No score yet' : `${bestScore.time}s, ${bestScore.attempts} attempts`}
        </p>

        {gameComplete && (
          <p className="win-msg">
            {matches === (gridSize * gridSize) / 2
              ? '🎉 You matched all cards!'
              : gameMode === 'timed'
              ? '⏱️ Time’s up! Try again.'
              : '✅ Game complete'}
          </p>
        )}
      </div>
    </div>
  );
}

<div className="game-mode-selector">
  <label>
    Game Mode:
    <select
      value={gameMode}
      onChange={(e) => {
        setGameMode(e.target.value);
        if (e.target.value === 'timed') {
          setTimeLeft(60); // reset timer if switched to timed
        }
      }}
    >
      <option value="zen">🧘 Zen Mode</option>
      <option value="timed">⏱️ Timed Mode</option>
    </select>
  </label>
</div>

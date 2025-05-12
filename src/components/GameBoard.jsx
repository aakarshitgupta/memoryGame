import Card from './card';

export default function GameBoard({ cards, handleCardClick, gridSize }) {
  const gridStyle = {
    gridTemplateColumns: `repeat(${gridSize}, 1fr)`
  };

  return (
    <div className="game-board" style={gridStyle}>
      {cards.map((card, idx) => (
        <Card key={card.id} card={card} onClick={() => handleCardClick(idx)} />
      ))}
    </div>
  );
}

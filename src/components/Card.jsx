// import './Card.css';

export default function Card({ card, onClick }) {
    return (
      <div
        className={`card ${card.isFlipped || card.isMatched ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
        onClick={onClick}
      >
        <div className="card-inner">
          <div className="card-front">?</div>
          <div className="card-back">{card.symbol}</div>
  
          {/* Particle effect container, only shown when card is matched */}
          {card.isMatched && (
            <div className="particle-container">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="particle"
                  style={{
                    '--x': `${Math.random() * 100 - 50}px`,  // Random x movement
                    '--y': `${Math.random() * 100 - 50}px`,  // Random y movement
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
  
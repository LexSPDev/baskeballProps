import './DetalleModal.css'; // Asegúrate de crear este archivo CSS para el modal

const DetalleModal = ({ isOpen, onClose, playerGames, playerName }) => {
  if (!isOpen || !playerGames) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        
        <button className="modal-close-btn" onClick={onClose}>×</button>
        
        <h2>Historial de Partidos de {playerName}</h2>

        {/* --- Historial: Últimos Partidos --- */}
        <h3>Últimos Partidos Jugados</h3>
        <div className="game-section">
          <div className="gameWrapper header">
            <span>DATE</span>
            <span>MIN</span>
            <span>PTS</span>
            <span>AST</span>
            <span>REB</span>
          </div>
          {Object.values(playerGames.lastGames?.games ?? {}).map(
            (game, gIndex) => (
              <div key={`lg-${gIndex}`} className="gameWrapper">
                <span>{game?.date?.toString() ?? "-"}</span>
                <span>{game?.min ?? "-"}</span>
                <span>{game?.pts ?? "-"}</span>
                <span>{game?.ast ?? "-"}</span>
                <span>{game?.reb ?? "-"}</span>
              </div>
            )
          )}
        </div>

        {/* --- Historial: Últimos Enfrentamientos --- */}
        <h3>Últimos Partidos contra el Rival</h3>
        <div className="game-section">
          <div className="gameWrapper header">
            <span>DATE</span>
            <span>MIN</span>
            <span>PTS</span>
            <span>AST</span>
            <span>REB</span>
          </div>
          {Object.values(playerGames.lastAgainst?.games ?? {}).map(
            (game, gIndex) => (
              <div key={`la-${gIndex}`} className="gameWrapper">
                <span>{game?.date?.toString() ?? "-"}</span>
                <span>{game?.min ?? "-"}</span>
                <span>{game?.pts ?? "-"}</span>
                <span>{game?.ast ?? "-"}</span>
                <span>{game?.reb ?? "-"}</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalleModal;
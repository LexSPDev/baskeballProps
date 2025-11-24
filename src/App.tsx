import React, { useEffect, useState } from "react";
// Asumo que el modal está en una subcarpeta 'components'
import DetalleModal from './components/DetalleModal.tsx'; 
import "./App.css";

// ---------------------------------------------------------------------
// DEFINICIÓN DE TIPOS
// ---------------------------------------------------------------------

type singleGameObject = {
  date?: string; // Cambiado a string para mayor flexibilidad
  min?: number;
  pts?: number;
  ast?: number;
  reb?: number;
  triples?: number;
  triplesattemps?: number;
};
type singleGamesObject = {
  [key: string]: singleGameObject;
};
type GameObject = {
  games?: singleGamesObject;
};
type GamesDataObject = {
  lastAgainst?: GameObject;
  lastAgainstStatus?: GameObject;
  lastGames?: GameObject;
  lastGamesStatus?: GameObject;
};

type Player = {
  pace: any;
  dvp: any;
  advanced: any;
  games?: GamesDataObject; 
  playerName: string;
  playerId: string;
  playerTeam: string;
};

type Game = {
  id: string;
  homeTeamName: string;
  awayTeamName: string;
  time: string;
  home?: Player[];
  away?: Player[];
};

// ---------------------------------------------------------------------

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [playersHome, setPlayersHome] = useState<Player[]>([]);
  const [playersAway, setPlayersAway] = useState<Player[]>([]);
  
  // Estado para el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{games: GamesDataObject | null, name: string}>({ 
    games: null, 
    name: '' 
  });
  
  // ------------------------- LÓGICA DE DATOS --------------------------

  const fetchGames = async () => {
    try {
      // URL para obtener los datos
      const response = await fetch("https://basketballpropsbackend-production.up.railway.app/games");
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };
  useEffect(() => {
    fetchGames();
  }, []);

  const refreshData = (game: Game) => {
    setPlayersAway(game.away ?? []);
    setPlayersHome(game.home ?? []);
  };
  
  const FALLBACK_IMAGE_URL = "https://lexfitcode.github.io/dummieweb/nbaPlayers/general.png";

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const imgElement = event.currentTarget as HTMLImageElement;
    if (imgElement.src !== FALLBACK_IMAGE_URL) {
      imgElement.src = FALLBACK_IMAGE_URL;
    }
  };
  
  // ------------------------- LÓGICA DEL MODAL -------------------------
  
  // Función para abrir el modal y cargar los datos (CORREGIDA)
  const openPlayerModal = (playerData: Player, playerName: string) => {
    // CORRECCIÓN CLAVE: Accedemos a playerData.games
    setModalData({
      games: playerData.games ?? null,
      name: playerName
    });
    setIsModalOpen(true); 
  };

  const closePlayerModal = () => {
    setIsModalOpen(false);
    setModalData({ games: null, name: '' });
  };
  
  // ------------------------------------------------------------------
  
  return (
    <>
      <h2>Games</h2>

      {/* CARRUSEL DE GAMES */}
      <div>
        {games.length === 0 ? (
          <p>Loading games...</p>
        ) : (
          <div className="carrusel-react">

            <div className="carrusel-inner-react">
              {games.map((game) => (

                <div
                  key={game.id}
                  onClick={() => refreshData(game)}
                  className="tarjeta-partido-react"
                >
                  <div>
                    <div className="gameItem">

                      {/* Logo del Equipo Local */}
                      <img
                        src={`https://lexfitcode.github.io/dummieweb/logos%20nba/${game.homeTeamName}.png`}
                        alt={`Logo de ${game.homeTeamName}`}
                        onError={handleImageError}
                        className="team-logo"
                      />

                      <div className="vs-text">VS</div>

                      {/* Logo del Equipo Visitante */}
                      <img
                        src={`https://lexfitcode.github.io/dummieweb/logos%20nba/${game.awayTeamName}.png`}
                        alt={`Logo de ${game.awayTeamName}`}
                        onError={handleImageError}
                        className="team-logo"
                      />
                    </div>

                    <div className="game-time-display"> {game.time} </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <h2>Players Stats</h2>

      {/* LISTAS DE ESTADÍSTICAS */}
      <div className="container-listas">

        {/* --- Lista 1: Equipo Local --- */}
        {playersHome.length > 0 && (
          <div className="lista-estadisticas">

            {/* Encabezados */}
            <div className="GridEstadisticas encabezados">
              <div>NAME</div>
              <div>POS</div>
              <div>PER</div>
              <div>USG</div>
              <div>PTS</div>
              <div>TS</div>
              <div>REB</div>
              <div>D-REB</div>
              <div>O-REB</div>
              <div>ASIST</div>
              <div>A-PER</div>
            </div>

            {/* Filas de Datos */}
            {playersHome.map((player) => (
              // Evento onClick para abrir el modal
              <div 
                className="GridEstadisticas" 
                key={player.playerId} 
                onClick={() => openPlayerModal(player, player.playerName)}
              >
                <div>{player.playerName}</div>
                <div>{player.advanced.position}</div>
                <div className={player.advanced.playerEfficiencyRating > 18 ? "goodMatchup" : ""}>{player.advanced.playerEfficiencyRating}</div>
                <div className={player.advanced.usagePercentage > 23 ? "goodMatchup" : ""}>{player.advanced.usagePercentage}</div>
                <div className={player.dvp.ptsGoodMatchup ? "goodMatchup" : ""}>{player.dvp.pts}</div>
                <div className={player.advanced.trueShootingPercentage > .500 ? "goodMatchup" : ""}>{player.advanced.trueShootingPercentage}</div>
                <div className={player.dvp.rebGoodMatchup ? "goodMatchup" : ""}>{player.dvp.reb}</div>
                <div className={
                  player.advanced.position === "C" && player.advanced.defensiveReboundPercentage > 30 ? "goodMatchup" :
                  player.advanced.position === "PF" && player.advanced.defensiveReboundPercentage > 25 ? "goodMatchup" :
                  player.advanced.position === "PG" && player.advanced.defensiveReboundPercentage > 18 ? "goodMatchup" :
                  player.advanced.position === "SG" && player.advanced.defensiveReboundPercentage > 10 ? "goodMatchup" :
                  player.advanced.position === "SF" && player.advanced.defensiveReboundPercentage > 8 ? "goodMatchup" :
                  ""
                }>{player.advanced.defensiveReboundPercentage}</div>
                <div className={
                  player.advanced.position === "C" && player.advanced.offensiveReboundPercentage > 12 ? "goodMatchup" :
                  player.advanced.position === "PF" && player.advanced.offensiveReboundPercentage > 10 ? "goodMatchup" :
                  player.advanced.position === "PG" && player.advanced.offensiveReboundPercentage > 8 ? "goodMatchup" :
                  player.advanced.position === "SG" && player.advanced.offensiveReboundPercentage > 7 ? "goodMatchup" :
                  player.advanced.position === "SF" && player.advanced.offensiveReboundPercentage > 6 ? "goodMatchup" :
                  ""
                }>{player.advanced.offensiveReboundPercentage}</div>
                <div className={player.dvp.astGoodMatchup ? "goodMatchup" : ""}>{player.dvp.ast}</div>
                <div className={
                  player.advanced.position === "C" && player.advanced.assistPercentage > 15 ? "goodMatchup" :
                  player.advanced.position === "PF" && player.advanced.assistPercentage > 18 ? "goodMatchup" :
                  player.advanced.position === "PG" && player.advanced.assistPercentage > 35 ? "goodMatchup" :
                  player.advanced.position === "SG" && player.advanced.assistPercentage > 25 ? "goodMatchup" :
                  player.advanced.position === "SF" && player.advanced.assistPercentage > 20 ? "goodMatchup" :
                  ""
                }>{player.advanced.assistPercentage}</div>
              </div>
            ))}
          </div>
        )}
        
        {/* --- Lista 2: Equipo Visitante --- */}
        {playersAway.length > 0 && (
          <div className="lista-estadisticas">

            {/* Encabezados */}
            <div className="GridEstadisticas encabezados">
              <div>NAME</div>
              <div>POS</div>
              <div>PER</div>
              <div>USG</div>
              <div>PTS</div>
              <div>TS</div>
              <div>REB</div>
              <div>D-REB</div>
              <div>O-REB</div>
              <div>ASIST</div>
              <div>A-PER</div>
            </div>

            {/* Filas de Datos */}
            {playersAway.map((player) => (
              // Evento onClick para abrir el modal
              <div 
                className="GridEstadisticas" 
                key={player.playerId} 
                onClick={() => openPlayerModal(player, player.playerName)}
              >
                <div>{player.playerName}</div>
                <div>{player.advanced.position}</div>
                <div className={player.advanced.playerEfficiencyRating > 18 ? "goodMatchup" : ""}>{player.advanced.playerEfficiencyRating}</div>
                <div className={player.advanced.usagePercentage > 23 ? "goodMatchup" : ""}>{player.advanced.usagePercentage}</div>
                <div className={player.dvp.ptsGoodMatchup ? "goodMatchup" : ""}>{player.dvp.pts}</div>
                <div className={player.advanced.trueShootingPercentage > .500 ? "goodMatchup" : ""}>{player.advanced.trueShootingPercentage}</div>
                <div className={player.dvp.rebGoodMatchup ? "goodMatchup" : ""}>{player.dvp.reb}</div>
                <div className={
                  player.advanced.position === "C" && player.advanced.defensiveReboundPercentage > 30 ? "goodMatchup" :
                  player.advanced.position === "PF" && player.advanced.defensiveReboundPercentage > 25 ? "goodMatchup" :
                  player.advanced.position === "PG" && player.advanced.defensiveReboundPercentage > 18 ? "goodMatchup" :
                  player.advanced.position === "SG" && player.advanced.defensiveReboundPercentage > 10 ? "goodMatchup" :
                  player.advanced.position === "SF" && player.advanced.defensiveReboundPercentage > 8 ? "goodMatchup" :
                  ""
                }>{player.advanced.defensiveReboundPercentage}</div>
                <div className={
                  player.advanced.position === "C" && player.advanced.offensiveReboundPercentage > 12 ? "goodMatchup" :
                  player.advanced.position === "PF" && player.advanced.offensiveReboundPercentage > 10 ? "goodMatchup" :
                  player.advanced.position === "PG" && player.advanced.offensiveReboundPercentage > 8 ? "goodMatchup" :
                  player.advanced.position === "SG" && player.advanced.offensiveReboundPercentage > 7 ? "goodMatchup" :
                  player.advanced.position === "SF" && player.advanced.offensiveReboundPercentage > 6 ? "goodMatchup" :
                  ""
                }>{player.advanced.offensiveReboundPercentage}</div>
                <div className={player.dvp.astGoodMatchup ? "goodMatchup" : ""}>{player.dvp.ast}</div>
                <div className={
                  player.advanced.position === "C" && player.advanced.assistPercentage > 15 ? "goodMatchup" :
                  player.advanced.position === "PF" && player.advanced.assistPercentage > 18 ? "goodMatchup" :
                  player.advanced.position === "PG" && player.advanced.assistPercentage > 35 ? "goodMatchup" :
                  player.advanced.position === "SG" && player.advanced.assistPercentage > 25 ? "goodMatchup" :
                  player.advanced.position === "SF" && player.advanced.assistPercentage > 20 ? "goodMatchup" :
                  ""
                }>{player.advanced.assistPercentage}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RENDERIZADO DEL MODAL */}
      <DetalleModal
        isOpen={isModalOpen}
        onClose={closePlayerModal}
        playerGames={modalData.games}
        playerName={modalData.name}
      />
    </>
  );
}

export default App;
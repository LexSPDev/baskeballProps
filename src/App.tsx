import React, { useEffect, useState } from "react";
import "./App.css";

type Game = {
  id: string;
  homeTeamName: string;
  awayTeamName: string;
  time: string;
  home?: Player[];
  away?: Player[];
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

type GamesDataObject = {
  lastAgainst?: GameObject;
  lastAgainstStatus?: GameObject;
  lastGames?: GameObject;
  lastGamesStatus?: GameObject;
};

type GameObject = {
  games?: singleGamesObject;
};
type singleGamesObject = {
  1?: singleGameObject;
  2?: singleGameObject;
  3?: singleGameObject;
  4?: singleGameObject;
  5?: singleGameObject;
};

type singleGameObject = {
  date?: Date;
  min?: number;
  pts?: number;
  ast?: number;
  reb?: number;
  triples?: number;
  triplesattemps?: number;
};

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [playersHome, setPlayersHome] = useState<Player[]>([]);
  const [playersAway, setPlayersAway] = useState<Player[]>([]);

  const fetchGames = async () => {
    try {
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
    console.log(game);
    setPlayersAway(game.away ?? []);
    setPlayersHome(game.home ?? []);
  };
  const FALLBACK_IMAGE_URL =
    "https://lexfitcode.github.io/dummieweb/nbaPlayers/general.png";

  // 2. Define la función de manejo de error (colócala fuera del map pero dentro del componente)
  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const imgElement = event.currentTarget as HTMLImageElement;

    // Evitar bucle infinito y cambiar solo si no es la imagen de fallback
    if (imgElement.src !== FALLBACK_IMAGE_URL) {
      imgElement.src = FALLBACK_IMAGE_URL;
    }
  };
  return (
    <>
      <h2>Games</h2>

      {/* GAMES */}
      <div>
        {games.length === 0 ? (
          <p>Loading games...</p>
        ) : (
          <div className="carrusel-react">

            {/* Contenedor interno de las tarjetas (donde se aplica el display: flex) */}
            <div className="carrusel-inner-react">
              {games.map((game) => (

                // Cada ítem individual es una tarjeta con la clase de snap-align
                <div
                  key={game.id}
                  onClick={() => refreshData(game)}
                  className="tarjeta-partido-react" // 👈 CLASE CRUCIAL para el snap
                >
                  <div>
                    <div className="gameItem">

                      {/* Logo del Equipo Local */}
                      <img
                        src={`https://lexfitcode.github.io/dummieweb/logos%20nba/${game.homeTeamName}.png`}
                        alt={`Logo de ${game.homeTeamName}`}
                        onError={handleImageError}
                        className="team-logo" // Clase opcional para estilos de imagen
                      />

                      <div className="vs-text">VS</div>

                      {/* Logo del Equipo Visitante */}
                      <img
                        src={`https://lexfitcode.github.io/dummieweb/logos%20nba/${game.awayTeamName}.png`}
                        alt={`Logo de ${game.awayTeamName}`}
                        onError={handleImageError}
                        className="team-logo" // Clase opcional para estilos de imagen
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

      <div className="container-listas">

        {/* --- Lista 1: Equipo Local (Quedará arriba en móvil) --- */}
        {playersHome.length > 0 && (
          <div className="lista-estadisticas">

            {/* Encabezados (NAME con ancho fijo 150px) */}
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
              <div className="GridEstadisticas" key={player.playerId}>
                <div>{player.playerName}</div>
                <div>{player.advanced.position}</div>
                <div className={player.advanced.playerEfficiencyRating > 18 ? "goodMatchup" : ""}>{player.advanced.playerEfficiencyRating}</div>
                <div className={player.advanced.usagePercentage > 23 ? "goodMatchup" : ""}>{player.advanced.usagePercentage}</div>
                <div className={player.dvp.ptsGoodMatchup}>{player.dvp.pts}</div>
                <div className={player.advanced.trueShootingPercentage > .500 ? "goodMatchup" : ""}>{player.advanced.trueShootingPercentage}</div>
                <div className={player.dvp.rebGoodMatchup}>{player.dvp.reb}</div>
                <div className={
                  // 1. Centro (C) y su umbral (ej. > 12)
                  player.advanced.position === "C" && player.advanced.defensiveReboundPercentage > 30 ? "goodMatchup" :
                    // 2. Ala-Pívot (PF) y su umbral (ej. > 10)
                    player.advanced.position === "PF" && player.advanced.defensiveReboundPercentage > 25 ? "goodMatchup" :
                      // 3. Base (PG) y su umbral (ej. > 8)
                      player.advanced.position === "PG" && player.advanced.defensiveReboundPercentage > 18 ? "goodMatchup" :
                        // 4. Escolta (SG) y su umbral (ej. > 7)
                        player.advanced.position === "SG" && player.advanced.defensiveReboundPercentage > 10 ? "goodMatchup" :
                          // 5. El Resto y su umbral (ej. > 6)
                          player.advanced.position === "SF" && player.advanced.defensiveReboundPercentage > 8 ? "goodMatchup" :
                            // Valor por defecto si ninguna de las condiciones anteriores es verdadera
                            ""
                }>{player.advanced.defensiveReboundPercentage}</div>
                <div className={
                  // 1. Centro (C) y su umbral (ej. > 12)
                  player.advanced.position === "C" && player.advanced.offensiveReboundPercentage > 12 ? "goodMatchup" :
                    // 2. Ala-Pívot (PF) y su umbral (ej. > 10)
                    player.advanced.position === "PF" && player.advanced.offensiveReboundPercentage > 10 ? "goodMatchup" :
                      // 3. Base (PG) y su umbral (ej. > 8)
                      player.advanced.position === "PG" && player.advanced.offensiveReboundPercentage > 8 ? "goodMatchup" :
                        // 4. Escolta (SG) y su umbral (ej. > 7)
                        player.advanced.position === "SG" && player.advanced.offensiveReboundPercentage > 7 ? "goodMatchup" :
                          // 5. El Resto y su umbral (ej. > 6)
                          player.advanced.position === "SF" && player.advanced.offensiveReboundPercentage > 6 ? "goodMatchup" :
                            // Valor por defecto si ninguna de las condiciones anteriores es verdadera
                            ""
                }>{player.advanced.offensiveReboundPercentage}</div>
                <div className={player.dvp.astGoodMatchup}>{player.dvp.ast}</div>
                <div className={
                  // 1. Centro (C) y su umbral (ej. > 12)
                  player.advanced.position === "C" && player.advanced.assistPercentage > 15 ? "goodMatchup" :
                    // 2. Ala-Pívot (PF) y su umbral (ej. > 10)
                    player.advanced.position === "PF" && player.advanced.assistPercentage > 18 ? "goodMatchup" :
                      // 3. Base (PG) y su umbral (ej. > 8)
                      player.advanced.position === "PG" && player.advanced.assistPercentage > 35 ? "goodMatchup" :
                        // 4. Escolta (SG) y su umbral (ej. > 7)
                        player.advanced.position === "SG" && player.advanced.assistPercentage > 25 ? "goodMatchup" :
                          // 5. El Resto y su umbral (ej. > 6)
                          player.advanced.position === "SF" && player.advanced.assistPercentage > 20 ? "goodMatchup" :
                            // Valor por defecto si ninguna de las condiciones anteriores es verdadera
                            ""
                }>{player.advanced.assistPercentage}</div>
              </div>
            ))}
          </div>
        )}
        {/* --- Lista 2: Equipo Visitante (Quedará abajo en móvil) --- */}
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
              <div className="GridEstadisticas" key={player.playerId}>
                <div>{player.playerName}</div>
                <div>{player.advanced.position}</div>
                <div className={player.advanced.playerEfficiencyRating > 18 ? "goodMatchup" : ""}>{player.advanced.playerEfficiencyRating}</div>
                <div className={player.advanced.usagePercentage > 23 ? "goodMatchup" : ""}>{player.advanced.usagePercentage}</div>
                <div className={player.dvp.ptsGoodMatchup}>{player.dvp.pts}</div>
                <div className={player.advanced.trueShootingPercentage > .500 ? "goodMatchup" : ""}>{player.advanced.trueShootingPercentage}</div>
                <div className={player.dvp.rebGoodMatchup}>{player.dvp.reb}</div>
                <div className={
                  // 1. Centro (C) y su umbral (ej. > 12)
                  player.advanced.position === "C" && player.advanced.defensiveReboundPercentage > 30 ? "goodMatchup" :
                    // 2. Ala-Pívot (PF) y su umbral (ej. > 10)
                    player.advanced.position === "PF" && player.advanced.defensiveReboundPercentage > 25 ? "goodMatchup" :
                      // 3. Base (PG) y su umbral (ej. > 8)
                      player.advanced.position === "PG" && player.advanced.defensiveReboundPercentage > 18 ? "goodMatchup" :
                        // 4. Escolta (SG) y su umbral (ej. > 7)
                        player.advanced.position === "SG" && player.advanced.defensiveReboundPercentage > 10 ? "goodMatchup" :
                          // 5. El Resto y su umbral (ej. > 6)
                          player.advanced.position === "SF" && player.advanced.defensiveReboundPercentage > 8 ? "goodMatchup" :
                            // Valor por defecto si ninguna de las condiciones anteriores es verdadera
                            ""
                }>{player.advanced.defensiveReboundPercentage}</div>
                <div className={
                  // 1. Centro (C) y su umbral (ej. > 12)
                  player.advanced.position === "C" && player.advanced.offensiveReboundPercentage > 12 ? "goodMatchup" :
                    // 2. Ala-Pívot (PF) y su umbral (ej. > 10)
                    player.advanced.position === "PF" && player.advanced.offensiveReboundPercentage > 10 ? "goodMatchup" :
                      // 3. Base (PG) y su umbral (ej. > 8)
                      player.advanced.position === "PG" && player.advanced.offensiveReboundPercentage > 8 ? "goodMatchup" :
                        // 4. Escolta (SG) y su umbral (ej. > 7)
                        player.advanced.position === "SG" && player.advanced.offensiveReboundPercentage > 7 ? "goodMatchup" :
                          // 5. El Resto y su umbral (ej. > 6)
                          player.advanced.position === "SF" && player.advanced.offensiveReboundPercentage > 6 ? "goodMatchup" :
                            // Valor por defecto si ninguna de las condiciones anteriores es verdadera
                            ""
                }>{player.advanced.offensiveReboundPercentage}</div>
                <div className={player.dvp.astGoodMatchup}>{player.dvp.ast}</div>
                <div className={
                  // 1. Centro (C) y su umbral (ej. > 12)
                  player.advanced.position === "C" && player.advanced.assistPercentage > 15 ? "goodMatchup" :
                    // 2. Ala-Pívot (PF) y su umbral (ej. > 10)
                    player.advanced.position === "PF" && player.advanced.assistPercentage > 18 ? "goodMatchup" :
                      // 3. Base (PG) y su umbral (ej. > 8)
                      player.advanced.position === "PG" && player.advanced.assistPercentage > 35 ? "goodMatchup" :
                        // 4. Escolta (SG) y su umbral (ej. > 7)
                        player.advanced.position === "SG" && player.advanced.assistPercentage > 25 ? "goodMatchup" :
                          // 5. El Resto y su umbral (ej. > 6)
                          player.advanced.position === "SF" && player.advanced.assistPercentage > 20 ? "goodMatchup" :
                            // Valor por defecto si ninguna de las condiciones anteriores es verdadera
                            ""
                }>{player.advanced.assistPercentage}</div>
              </div>
            ))}
          </div>

        )}
      </div>

    </>
  );
}

export default App;

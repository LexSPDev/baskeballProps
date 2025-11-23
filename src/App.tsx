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
      const response = await fetch("/api/games");
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
          <div className="marketsWrapper">
            {games.map((game) => (
              <div key={game.id} onClick={() => refreshData(game)}>
                <div className="gameItemMain">
                  <div className="gameItem">
                    <img
                      src={`https://lexfitcode.github.io/dummieweb/logos%20nba/${game.homeTeamName}.png`}
                      alt={`Foto de ${game.homeTeamName}`}
                      onError={handleImageError}
                    />
                    <div>VS</div>
                    <img
                      src={`https://lexfitcode.github.io/dummieweb/logos%20nba/${game.awayTeamName}.png`}
                      alt={`Foto de ${game.homeTeamName}`}
                      onError={handleImageError}
                    />
                  </div>
                  <div> {game.time} </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <h2>Players Stats</h2>

      <div className="statusWrapper">
        <div className="playerWrapper">
          {playersHome.map((player, pIndex) => (
            <div key={player.playerName ?? pIndex} className="cardHeight">
              <div className="dataWrapper">
                <div className="nameWrapper">
                  <div className="playerPosition">
                                                         <span className="playerPosition">
                        {player.advanced.position}
                      </span>
                  <img
                    src={`https://lexfitcode.github.io/dummieweb/nbaPlayers/${player.playerTeam}/${player.playerId}.png`}
                    alt={`Foto de ${player.playerName}`}
                    onError={handleImageError}
                    className="playerImage"
                  />

                  </div>
                  <div className="gap">
                    <div>
                      <span className="playerName">{player.playerName}</span>
   
                    </div>
                    <div className="generalWrapper">
                      <span className="playePosition">
                        PER : {player.advanced.playerEfficiencyRating}
                      </span>
                      <span
                        className={
                          player.advanced?.usagePercentage > 24
                            ? "playePosition goodMatchup"
                            : ""
                        }
                      >
                        USG : {player.advanced.usagePercentage}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relevantsWrapper">
                  <div className="dvpWrapper">
                    <span>DVP</span>
                    <span
                      className={
                        player.dvp?.ptsGoodMatchup ? "goodMatchup" : ""
                      }
                    >
                      PTS: {player.dvp?.pts}
                    </span>
                    <span
                      className={
                        player.dvp?.astGoodMatchup ? "goodMatchup" : ""
                      }
                    >
                      AST: {player.dvp?.ast}
                    </span>
                    <span
                      className={player.dvp?.rebGoodMatchu ? "goodMatchup" : ""}
                    >
                      REB: {player.dvp?.reb}
                    </span>
                  </div>
                  <div className="dvpWrapper">
                    <span>Pace</span>
                    <span
                      className={
                        player.pace?.team?.lastThree > 100 ? "goodMatchup" : ""
                      }
                    >
                      {" "}
                      {player.pace?.team?.lastThree}
                    </span>

                    <span
                      className={
                        player.pace?.against?.lastThree > 100
                          ? "goodMatchup"
                          : ""
                      }
                    >
                      {" "}
                      vs {player.pace?.against?.lastThree}
                    </span>
                  </div>
                  <div className="dvpWrapper">
                    <span>Points relevants</span>
                    <span
                      className={
                        player.advanced?.trueShootingPercentage > 0.5
                          ? "goodMatchup"
                          : ""
                      }
                    >
                      TS {player.advanced?.trueShootingPercentage}
                    </span>
                  </div>
                  <div className="dvpWrapper">
                    <span>Rebounds relevants</span>
                    <span
                      className={
                        // 1. Centro (C) y su umbral (ej. > 12)
                        player.advanced?.position === "C" &&
                        player.advanced?.defensiveReboundPercentage > 30
                          ? "goodMatchup"
                          : // 2. Ala-Pívot (PF) y su umbral (ej. > 10)
                          player.advanced?.position === "PF" &&
                            player.advanced?.defensiveReboundPercentage > 25
                          ? "goodMatchup"
                          : // 3. Base (PG) y su umbral (ej. > 8)
                          player.advanced?.position === "PG" &&
                            player.advanced?.defensiveReboundPercentage > 8
                          ? "goodMatchup"
                          : // 4. Escolta (SG) y su umbral (ej. > 7)
                          player.advanced?.position === "SG" &&
                            player.advanced?.defensiveReboundPercentage > 10
                          ? "goodMatchup"
                          : // 5. El Resto y su umbral (ej. > 6)
                          player.advanced?.position === "SF" &&
                            player.advanced?.defensiveReboundPercentage > 18
                          ? "goodMatchup"
                          : // Valor por defecto si ninguna de las condiciones anteriores es verdadera
                            ""
                      }
                    >
                      D-REB {player.advanced?.defensiveReboundPercentage}
                    </span>
                    <span
                      className={
                        // 1. Centro (C) y su umbral (ej. > 12)
                        player.advanced?.position === "C" &&
                        player.advanced?.offensiveReboundPercentage > 12
                          ? "goodMatchup"
                          : // 2. Ala-Pívot (PF) y su umbral (ej. > 10)
                          player.advanced?.position === "PF" &&
                            player.advanced?.offensiveReboundPercentage > 10
                          ? "goodMatchup"
                          : // 3. Base (PG) y su umbral (ej. > 8)
                          player.advanced?.position === "PG" &&
                            player.advanced?.offensiveReboundPercentage > 2
                          ? "goodMatchup"
                          : // 4. Escolta (SG) y su umbral (ej. > 7)
                          player.advanced?.position === "SG" &&
                            player.advanced?.offensiveReboundPercentage > 3
                          ? "goodMatchup"
                          : // 5. El Resto y su umbral (ej. > 6)
                          player.advanced?.position === "SF" &&
                            player.advanced?.offensiveReboundPercentage > 6
                          ? "goodMatchup"
                          : // Valor por defecto si ninguna de las condiciones anteriores es verdadera
                            ""
                      }
                    >
                      O-REB {player.advanced?.offensiveReboundPercentage}
                    </span>
                  </div>
                  <div className="dvpWrapper">
                    <span>Assists relevants</span>
                    <span
                      className={
                        // 1. Centro (C) y su umbral (ej. > 12)
                        player.advanced?.position === "C" &&
                        player.advanced?.assistPercentage > 15
                          ? "goodMatchup"
                          : // 2. Ala-Pívot (PF) y su umbral (ej. > 10)
                          player.advanced?.position === "PF" &&
                            player.advanced?.assistPercentage > 18
                          ? "goodMatchup"
                          : // 3. Base (PG) y su umbral (ej. > 8)
                          player.advanced?.position === "PG" &&
                            player.advanced?.assistPercentage > 35
                          ? "goodMatchup"
                          : // 4. Escolta (SG) y su umbral (ej. > 7)
                          player.advanced?.position === "SG" &&
                            player.advanced?.assistPercentage > 25
                          ? "goodMatchup"
                          : // 5. El Resto y su umbral (ej. > 6)
                          player.advanced?.position === "SF" &&
                            player.advanced?.assistPercentage > 20
                          ? "goodMatchup"
                          : // Valor por defecto si ninguna de las condiciones anteriores es verdadera
                            ""
                      }
                    >
                      A-Per {player.advanced?.assistPercentage}
                    </span>
                  </div>
                </div>
              </div>
              <div className="games">
                <div>
                  <div className="gameWrapper">
                    <span>DATE</span>
                    <span>MIN</span>
                    <span>PTS</span>
                    <span>AST</span>
                    <span>REB</span>
                  </div>
                  {Object.values(player.games?.lastGames?.games ?? {}).map(
                    (game, gIndex) => (
                      <div key={gIndex} className="gameWrapper">
                        <span>{game?.date?.toString() ?? "-"}</span>
                        <span>{game?.min ?? "-"}</span>
                        <span>{game?.pts ?? "-"}</span>
                        <span>{game?.ast ?? "-"}</span>
                        <span>{game?.reb ?? "-"}</span>
                      </div>
                    )
                  )}
                </div>
                <div>
                  <div className="gameWrapper">
                    <span>DATE</span>
                    <span>MIN</span>
                    <span>PTS</span>
                    <span>AST</span>
                    <span>REB</span>
                  </div>
                  {Object.values(player.games?.lastAgainst?.games ?? {})
                    .length > 0 ? (
                    // Caso: Hay juegos para mostrar

                    Object.values(player.games?.lastAgainst?.games ?? {}).map(
                      (game, gIndex) => (
                        <>
                          <div key={gIndex} className="gameWrapper">
                            <span>{game?.date?.toString() ?? "-"}</span>
                            <span>{game?.min ?? "-"}</span>
                            <span>{game?.pts ?? "-"}</span>
                            <span>{game?.ast ?? "-"}</span>
                            <span>{game?.reb ?? "-"}</span>
                          </div>
                        </>
                      )
                    )
                  ) : (
                    // Caso: There's no games to show (el "else")
                    <div className="noGames">There's no games to show</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="playerWrapper">
          {playersAway.map((player, pIndex) => (
            <div key={player.playerName ?? pIndex} className="cardHeight">
              <div className="dataWrapper">
                <div className="nameWrapper">
                  <div className="playerPosition">
                                                         <span className="playerPosition">
                        {player.advanced.position}
                      </span>
                  <img
                    src={`https://lexfitcode.github.io/dummieweb/nbaPlayers/${player.playerTeam}/${player.playerId}.png`}
                    alt={`Foto de ${player.playerName}`}
                    onError={handleImageError}
                    className="playerImage"
                  />

                  </div>
                  <div className="gap">
                    <div>
                      <span className="playerName">{player.playerName}</span>
   
                    </div>
                    <div className="generalWrapper">
                      <span className="playePosition">
                        PER : {player.advanced.playerEfficiencyRating}
                      </span>
                      <span
                        className={
                          player.advanced?.usagePercentage > 24
                            ? "playePosition goodMatchup"
                            : ""
                        }
                      >
                        USG : {player.advanced.usagePercentage}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relevantsWrapper">
                  <div className="dvpWrapper">
                    <span>DVP</span>
                    <span
                      className={
                        player.dvp?.ptsGoodMatchup ? "goodMatchup" : ""
                      }
                    >
                      PTS: {player.dvp?.pts}
                    </span>
                    <span
                      className={
                        player.dvp?.astGoodMatchup ? "goodMatchup" : ""
                      }
                    >
                      AST: {player.dvp?.ast}
                    </span>
                    <span
                      className={player.dvp?.rebGoodMatchu ? "goodMatchup" : ""}
                    >
                      REB: {player.dvp?.reb}
                    </span>
                  </div>
                  <div className="dvpWrapper">
                    <span>Pace</span>
                    <span
                      className={
                        player.pace?.team?.lastThree > 100 ? "goodMatchup" : ""
                      }
                    >
                      {" "}
                      {player.pace?.team?.lastThree}
                    </span>

                    <span
                      className={
                        player.pace?.against?.lastThree > 100
                          ? "goodMatchup"
                          : ""
                      }
                    >
                      {" "}
                      vs {player.pace?.against?.lastThree}
                    </span>
                  </div>
                  <div className="dvpWrapper">
                    <span>Points relevants</span>
                    <span
                      className={
                        player.advanced?.trueShootingPercentage > 0.5
                          ? "goodMatchup"
                          : ""
                      }
                    >
                      TS {player.advanced?.trueShootingPercentage}
                    </span>
                  </div>
                  <div className="dvpWrapper">
                    <span>Rebounds relevants</span>
                    <span
                      className={
                        // 1. Centro (C) y su umbral (ej. > 12)
                        player.advanced?.position === "C" &&
                        player.advanced?.defensiveReboundPercentage > 30
                          ? "goodMatchup"
                          : // 2. Ala-Pívot (PF) y su umbral (ej. > 10)
                          player.advanced?.position === "PF" &&
                            player.advanced?.defensiveReboundPercentage > 25
                          ? "goodMatchup"
                          : // 3. Base (PG) y su umbral (ej. > 8)
                          player.advanced?.position === "PG" &&
                            player.advanced?.defensiveReboundPercentage > 8
                          ? "goodMatchup"
                          : // 4. Escolta (SG) y su umbral (ej. > 7)
                          player.advanced?.position === "SG" &&
                            player.advanced?.defensiveReboundPercentage > 10
                          ? "goodMatchup"
                          : // 5. El Resto y su umbral (ej. > 6)
                          player.advanced?.position === "SF" &&
                            player.advanced?.defensiveReboundPercentage > 18
                          ? "goodMatchup"
                          : // Valor por defecto si ninguna de las condiciones anteriores es verdadera
                            ""
                      }
                    >
                      D-REB {player.advanced?.defensiveReboundPercentage}
                    </span>
                    <span
                      className={
                        // 1. Centro (C) y su umbral (ej. > 12)
                        player.advanced?.position === "C" &&
                        player.advanced?.offensiveReboundPercentage > 12
                          ? "goodMatchup"
                          : // 2. Ala-Pívot (PF) y su umbral (ej. > 10)
                          player.advanced?.position === "PF" &&
                            player.advanced?.offensiveReboundPercentage > 10
                          ? "goodMatchup"
                          : // 3. Base (PG) y su umbral (ej. > 8)
                          player.advanced?.position === "PG" &&
                            player.advanced?.offensiveReboundPercentage > 2
                          ? "goodMatchup"
                          : // 4. Escolta (SG) y su umbral (ej. > 7)
                          player.advanced?.position === "SG" &&
                            player.advanced?.offensiveReboundPercentage > 3
                          ? "goodMatchup"
                          : // 5. El Resto y su umbral (ej. > 6)
                          player.advanced?.position === "SF" &&
                            player.advanced?.offensiveReboundPercentage > 6
                          ? "goodMatchup"
                          : // Valor por defecto si ninguna de las condiciones anteriores es verdadera
                            ""
                      }
                    >
                      O-REB {player.advanced?.offensiveReboundPercentage}
                    </span>
                  </div>
                  <div className="dvpWrapper">
                    <span>Assists relevants</span>
                    <span
                      className={
                        // 1. Centro (C) y su umbral (ej. > 12)
                        player.advanced?.position === "C" &&
                        player.advanced?.assistPercentage > 15
                          ? "goodMatchup"
                          : // 2. Ala-Pívot (PF) y su umbral (ej. > 10)
                          player.advanced?.position === "PF" &&
                            player.advanced?.assistPercentage > 18
                          ? "goodMatchup"
                          : // 3. Base (PG) y su umbral (ej. > 8)
                          player.advanced?.position === "PG" &&
                            player.advanced?.assistPercentage > 35
                          ? "goodMatchup"
                          : // 4. Escolta (SG) y su umbral (ej. > 7)
                          player.advanced?.position === "SG" &&
                            player.advanced?.assistPercentage > 25
                          ? "goodMatchup"
                          : // 5. El Resto y su umbral (ej. > 6)
                          player.advanced?.position === "SF" &&
                            player.advanced?.assistPercentage > 20
                          ? "goodMatchup"
                          : // Valor por defecto si ninguna de las condiciones anteriores es verdadera
                            ""
                      }
                    >
                      A-Per {player.advanced?.assistPercentage}
                    </span>
                  </div>
                </div>
              </div>
              <div className="games">
                <div>
                  <div className="gameWrapper">
                    <span>DATE</span>
                    <span>MIN</span>
                    <span>PTS</span>
                    <span>AST</span>
                    <span>REB</span>
                  </div>
                  {Object.values(player.games?.lastGames?.games ?? {}).map(
                    (game, gIndex) => (
                      <div key={gIndex} className="gameWrapper">
                        <span>{game?.date?.toString() ?? "-"}</span>
                        <span>{game?.min ?? "-"}</span>
                        <span>{game?.pts ?? "-"}</span>
                        <span>{game?.ast ?? "-"}</span>
                        <span>{game?.reb ?? "-"}</span>
                      </div>
                    )
                  )}
                </div>
                <div>
                  <div className="gameWrapper">
                    <span>DATE</span>
                    <span>MIN</span>
                    <span>PTS</span>
                    <span>AST</span>
                    <span>REB</span>
                  </div>
                  {Object.values(player.games?.lastAgainst?.games ?? {})
                    .length > 0 ? (
                    // Caso: Hay juegos para mostrar

                    Object.values(player.games?.lastAgainst?.games ?? {}).map(
                      (game, gIndex) => (
                        <>
                          <div key={gIndex} className="gameWrapper">
                            <span>{game?.date?.toString() ?? "-"}</span>
                            <span>{game?.min ?? "-"}</span>
                            <span>{game?.pts ?? "-"}</span>
                            <span>{game?.ast ?? "-"}</span>
                            <span>{game?.reb ?? "-"}</span>
                          </div>
                        </>
                      )
                    )
                  ) : (
                    // Caso: There's no games to show (el "else")
                    <div className="noGames">There's no games to show</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;

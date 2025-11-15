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
          {playersAway.map((player, pIndex) => (
            <div key={player.playerName ?? pIndex}>
              <img
                src={`https://lexfitcode.github.io/dummieweb/nbaPlayers/${player.playerTeam}/${player.playerId}.png`}
                alt={`Foto de ${player.playerName}`}
                onError={handleImageError}
                className="playerImage"
              />
              <div className="gap">
                <span className="playerName">{player.playerName}</span> 
                <span className="playePosition">{player.shooting.position}</span>
                <span className="playePosition">{player.advanced.playerEfficiencyRating}</span>
                <span className="playePosition">{player.advanced.usagePercentage}</span>
              </div>
              
              <div></div>
              <div className="dvpWrapper">
                <span>DVP</span>
                <span className={player.dvp.ptsGoodMatchup ? "goodMatchup": "nonMatchup"}>PTS: {player.dvp.pts}</span>
                <span className={player.dvp.astGoodMatchup ? "goodMatchup": "nonMatchup"}>AST: {player.dvp.ast}</span>
                <span className={player.dvp.rebGoodMatchup ? "goodMatchup": "nonMatchup"}>REB: {player.dvp.reb}</span>
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
          {playersHome.map((player, pIndex) => (
            <div key={player.playerName ?? pIndex}>
              <img
                src={`https://lexfitcode.github.io/dummieweb/nbaPlayers/${player.playerTeam}/${player.playerId}.png`}
                alt={`Foto de ${player.playerName}`}
                onError={handleImageError}
                className="playerImage"
              />
              <div className="gap">
                <span className="playerName">{player.playerName}</span> 
                <span className="playePosition">{player.shooting.position}</span>
                <span className="playePosition">{player.advanced.playerEfficiencyRating}</span>
                <span className="playePosition">{player.advanced.usagePercentage}</span>
              </div>
              
              <div></div>
              <div className="dvpWrapper">
                <span>DVP</span>
                <span className={player.dvp.pts.GoodMatchup ? "goodMatchup": "nonMatchup"}>PTS: {player.dvp.pts}</span>
                <span className={player.dvp.ast.GoodMatchup ? "goodMatchup": "nonMatchup"}>AST: {player.dvp.ast}</span>
                <span className={player.dvp.reb.GoodMatchup ? "goodMatchup": "nonMatchup"}>REB: {player.dvp.reb}</span>
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

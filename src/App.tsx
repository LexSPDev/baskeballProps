import { useEffect, useState } from "react";
import "./App.css";

import MarketsCard from "./components/marketsCard.tsx";

type Game = { id: string; homeTeamName: string; awayTeamName: string, time: string };
type dataGame = { date: Date; value: number };
type lastObject = {
  1?: dataGame;
  2?: dataGame;
  3?: dataGame;
  4?: dataGame;
  5?: dataGame;
};

type OddsObject = {
  line: number;
  overOdd: number;
  underOdd: number;
  lastAgainst: lastObject;
  lastFive: lastObject;
  lastAgainstStatus: lastObject;
  lastFiveStatus: lastObject;
  green?: greenObject;
  statistics?: statisticsObject;
  streak?: streakObject;
  dvpValue?: number;
};
type greenObject = {
  lastFive?: lastObjectGreen;
  lastAgainst?: lastObjectGreen;
};
type streakObject = {
  lastFive?: number;
  lastFiveAgainst?: number;
};
type lastObjectGreen = {
  over?: number;
  under?: number;
  total?: number;
};
type MarketObject = {
  rebounds: OddsObject;
  assists: OddsObject;
  points: OddsObject;
  pointsReboundsAssists: OddsObject;
  pointsAssistsRebounds: OddsObject;
  pointsRebounds: OddsObject;
  pointsAssists: OddsObject;
  assistsRebounds: OddsObject;
};

type Player = {
  _id: string;
  name: string;
  team: string;
  opponent: string;
  markets: MarketObject; // <-- ahora es un objeto, no un array
  position: PositionObject;
};
type PositionObject = {
  name: string;
  pos: string;
  team: string;
  titular: number;
};
type statisticsObject = {
  avg: number;
  min: number;
  mode: number;
};

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playersFiltered, setPlayersFiltered] = useState<Player[]>([]);
  const [playersSelected, setPlayersSelected] = useState<Player[]>([]);
  const fetchGames = async () => {
    try {
      const response = await fetch("/api/games");
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await fetch("/api/players");
      const data = await response.json();
      setPlayers(data);
      setPlayersFiltered(data);
      setPlayersSelected(data);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  useEffect(() => {
    fetchGames();
    fetchPlayers();
  }, []);

  const refreshData = (game: Game) => {
    const filtered = players.filter(
      (player) =>
        player.team === game.homeTeamName || player.team === game.awayTeamName
    );
    setPlayersFiltered(filtered);
    setPlayersSelected(filtered);
  };
  const playerSelected = (nameSelected: string) => {
    const filtered = players.filter((p) => p.name === nameSelected);
    setPlayersSelected(filtered);
  };

  return (
    <>
      <h1>Stats</h1>

      {/* GAMES */}
      <div>
        {games.length === 0 ? (
          <p>Loading games...</p>
        ) : (
          <div className="gameWrapper">
            {games.map((game) => (
              <span
                key={game.id}
                className="gameItem"
                onClick={() => refreshData(game)}
              >
                {game.homeTeamName} vs {game.awayTeamName} - {game.time}
              </span>
            ))}
          </div>
        )}
      </div>
      <div>
        <h2>Players Stats</h2>
        <div className="playersList">
          {playersFiltered.map((player) => (
            <div
              className="playerItem"
              key={player._id}
              onClick={() => playerSelected(player.name)}
            >
              <div>
                <span>{player.name}</span>
                <span> - </span>
                <span>
                  {player.position.pos} - {player.position.titular}
                </span>
                <span> - </span>
                <span>{player.team}</span>
              </div>
              <div className="oddsList">
                <div className="oddsItem">
                  <span>Pts </span>
                  <span>{player.markets.points.line}</span>
                  <span
                    className={
                      player.markets.points.line <=
                      (player?.markets?.points?.statistics?.avg ??
                        Number.NEGATIVE_INFINITY)
                        ? "green"
                        : "red"
                    }
                  >
                    {player.markets.points.statistics?.avg}
                  </span>
                  <span
                    className={
                      player.markets.points.line <=
                      (player?.markets?.points?.dvpValue ??
                        Number.NEGATIVE_INFINITY)
                        ? "green"
                        : "red"
                    }
                  >
                    {player.markets.points.dvpValue}
                  </span>
                </div>
                <div className="oddsItem">
                  <span>Reb </span>
                  <span>{player.markets.rebounds.line}</span>
                  <span
                    className={
                      player.markets.rebounds.line <=
                      (player?.markets?.rebounds?.statistics?.avg ??
                        Number.NEGATIVE_INFINITY)
                        ? "green"
                        : "red"
                    }
                  >
                    {player.markets.rebounds.statistics?.avg}
                  </span>
                  <span
                    className={
                      player.markets.rebounds.line <=
                      (player?.markets?.rebounds?.dvpValue ??
                        Number.NEGATIVE_INFINITY)
                        ? "green"
                        : "red"
                    }
                  >
                    {player.markets.rebounds.dvpValue}
                  </span>
                </div>
                <div className="oddsItem">
                  <span>Ast</span>
                  <span>{player.markets.assists.line}</span>
                  <span
                    className={
                      player.markets.assists.line <=
                      (player?.markets?.assists?.statistics?.avg ??
                        Number.NEGATIVE_INFINITY)
                        ? " green"
                        : " red"
                    }
                  >
                    {player.markets.assists.statistics?.avg}
                  </span>
                  <span
                    className={
                      player.markets.assists.line <=
                      (player?.markets?.assists?.dvpValue ??
                        Number.NEGATIVE_INFINITY)
                        ? "green"
                        : "red"
                    }
                  >
                    {player.markets.assists.dvpValue}
                  </span>
                </div>
                <div className="oddsItem">
                  <span>PRA </span>
                  <span>{player.markets.pointsAssistsRebounds.line}</span>
                  <span
                    className={
                      player.markets.pointsAssistsRebounds.line <=
                      (player?.markets?.pointsAssistsRebounds?.statistics
                        ?.avg ?? Number.NEGATIVE_INFINITY)
                        ? "green"
                        : "red"
                    }
                  >
                    {player.markets.pointsAssistsRebounds.statistics?.avg}
                  </span>
                  <span
                    className={
                      player.markets.pointsAssistsRebounds.line <=
                      (player?.markets?.pointsAssistsRebounds?.dvpValue ??
                        Number.NEGATIVE_INFINITY)
                        ? "green"
                        : " red"
                    }
                  >
                    {player.markets.pointsAssistsRebounds.dvpValue}
                  </span>
                </div>
                <div className="oddsItem">
                  <span>PR </span>
                  <span>{player.markets.pointsRebounds.line}</span>
                  <span
                    className={
                      player.markets.pointsRebounds.line <=
                      (player?.markets?.pointsRebounds?.statistics?.avg ??
                        Number.NEGATIVE_INFINITY)
                        ? "green"
                        : "red"
                    }
                  >
                    {player.markets.pointsRebounds.statistics?.avg}
                  </span>
                  <span
                    className={
                      player.markets.pointsRebounds.line <=
                      (player?.markets?.pointsRebounds?.dvpValue ??
                        Number.NEGATIVE_INFINITY)
                        ? "green"
                        : "red"
                    }
                  >
                    {player.markets.pointsRebounds.dvpValue}
                  </span>
                </div>
                <div className="oddsItem">
                  <span>PA </span>
                  <span>{player.markets.pointsAssists.line}</span>
                  <span
                    className={
                      player.markets.pointsAssists.line <=
                      (player.markets.pointsAssists?.statistics?.avg ??
                        Number.NEGATIVE_INFINITY)
                        ? " green"
                        : " red"
                    }
                  >
                    {player.markets.pointsAssists.statistics?.avg}
                  </span>
                  <span
                    className={
                      player.markets.pointsAssists.line <=
                      (player.markets.pointsAssists?.dvpValue ??
                        Number.NEGATIVE_INFINITY)
                        ? " green"
                        : " red"
                    }
                  >
                    {player.markets.pointsAssists.dvpValue}
                  </span>
                </div>
                <div className="oddsItem">
                  <span>AR </span>
                  <span> {player.markets.assistsRebounds.line}</span>
                  <span
                    className={
                      player.markets.assistsRebounds.line <=
                      (player.markets.assistsRebounds?.statistics?.avg ??
                        Number.NEGATIVE_INFINITY)
                        ? "green"
                        : "red"
                    }
                  >
                    {player.markets.assistsRebounds.statistics?.avg}
                  </span>
                  <span
                    className={
                      player.markets.assistsRebounds.line <=
                      (player.markets.assistsRebounds?.dvpValue ??
                        Number.NEGATIVE_INFINITY)
                        ? "green"
                        : "red"
                    }
                  >
                    {player.markets.assistsRebounds.dvpValue}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {playersSelected.map((player) => (
          <div key={player._id}>
            <h3>{player.name}</h3>
            <div className="marketsWrapper">
              <MarketsCard market={player.markets.points} marketName="Points" />
              <MarketsCard
                market={player.markets.rebounds}
                marketName="Rebounds"
              />
              <MarketsCard
                market={player.markets.assists}
                marketName="Assists"
              />
              <MarketsCard
                market={player.markets.pointsAssists}
                marketName="Points & Asissts"
              />
              <MarketsCard
                market={player.markets.pointsRebounds}
                marketName="Points & Rebounds"
              />
              <MarketsCard
                market={player.markets.assistsRebounds}
                marketName="Assists & Rebounds"
              />
              <MarketsCard
                market={player.markets.pointsAssistsRebounds}
                marketName="Points, Assists & Rebounds"
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;

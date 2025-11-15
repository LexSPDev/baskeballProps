import MarketsGames from "./MarketsGames.tsx";

type OddsObject = {
  line: number;
  overOdd: number;
  underOdd: number;
  games: gamesObject;
  dvp_used?: number;
  Projection?: number;
  Prob_Under?: number;
  Prob_Over?: number;
  is_good_matchup: boolean
};
type gamesObject = {
  lastFive?: gameObject;
  lastFiveStatus?: gameObject;
  LastAgainst?: gameObject;
  lastFiveAgainstStatus?: gameObject;
};
type gameObject = {
  1?: statsObject;
  2?: statsObject;
  3?: statsObject;
  4?: statsObject;
  5?: statsObject;
  logros?: logrosObject;
  url?: string;
};
type logrosObject = {
  alpha: logroObject;
  beta: logroObject;
  gama: logroObject;
  delta: logroObject;
  epsilon: logroObject;
  zeta: logroObject;
  eta: logroObject;
};
type logroObject = {
  meta: number;
  cumplido: number;
};
type statsObject = {
  min: number;
  date: Date;
  pts?: number;
  reb?: number;
  ast?: number;
};

type MarketProps = {
  market: OddsObject;
  marketName: string;
};
export default function MarketsCard({ market, marketName }: MarketProps) {
  return (
    <>
      <div className="marketsCard">
        <div
          className={
            market?.is_good_matchup
              ? "marketsOdds star-corner"
              : "marketsOdds red"
          }
        >
          <span className="">{marketName}</span>
          <span>LINE : {market?.line}</span>
          <span>DVP : {market?.dvp_used}</span>
          <span>Proj : {market?.Projection}</span>
          <span>Prob : {market?.Prob_Over}</span>
          <div className="">
            <span>{market?.overOdd}</span>
            <span>{market?.underOdd}</span>
          </div>
        </div>
        <div>
          <span><a href={market.games.lastFive?.url}>Last games</a> </span>
          <MarketsGames games={market.games.lastFive} line={market?.line} />
          <span  ><a href={market.games.LastAgainst?.url}>H2H:</a> </span>
          <MarketsGames
            games={market.games.LastAgainst}
            line={market?.line}
          />

        </div>
      </div>
    </>
  );
}

import MarketsGames from "./MarketsGames.tsx";

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
  dvpValue : number
};

type MarketProps = {
  market: OddsObject;
  marketName: string;
};
export default function MarketsCard({ market, marketName }: MarketProps) {
  return (
    <>
      <div className="marketsCard">
        <div className="marketsOdds">
          <span className="marketName">{marketName}</span>
          <span>LINE : {market.line}</span>
          <span>DVP : {market.dvpValue}</span>
          <div className="odds">
          <span>{market.underOdd}</span>
          <span>{market.overOdd}</span>
          </div>
        </div>
        <div className="marketsGames">
          <div>
            <span>Last games</span>
            <MarketsGames games={market.lastFive} line={market.line} />
          </div>
          <div>
            <span>Last games status</span>
            <MarketsGames games={market.lastFiveStatus} line={market.line} />
          </div>
          <div>
            <span>H2H</span>
            <MarketsGames games={market.lastAgainst} line={market.line} />
          </div>
          <div>
            <span>H2H status</span>
            <MarketsGames games={market.lastAgainstStatus} line={market.line} />
          </div>
        </div>
      </div>
    </>
  );
}

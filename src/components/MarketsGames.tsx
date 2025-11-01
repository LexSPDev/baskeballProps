type dataGame = { date: Date; value: number };
type lastObject = {
  1?: dataGame;
  2?: dataGame;
  3?: dataGame;
  4?: dataGame;
  5?: dataGame;
};

type GamesProps = {
  games: lastObject;
  line: number;
};
export default function MarketsGames({games, line} : GamesProps) {
  return (

        <div className="marketsGames">
          <div>
            {Object.values(games || {}).map((value, i) => {
              if (value) {
                return (
                  <span
                    key={i}
                    className={
                      line < value.value
                        ? "lastFiveItem empty green"
                        : "lastFiveItem empty red"
                    }
                    title={`${value.date}`}
                  >
                    {value.value}
                  </span>
                );
              }
              return (
                <span key={i} className="lastFiveItem empty">
                  —
                </span>
              );
            })}
          </div>
        </div>


  );
}

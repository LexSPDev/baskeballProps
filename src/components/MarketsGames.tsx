type gameObject = {
  1?: statsObject;
  2?: statsObject;
  3?: statsObject;
  4?: statsObject;
  5?: statsObject;
  logros?: logrosObject;
  url?: string;
  value?: number;
  date?: Date;
  min?: number
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
  date?: Date;
  min?: number;
  value?: number;
};

type GamesProps = {
  games?: { [key: string]: gameObject };
  line: number;
};
export default function MarketsGames({ games, line }: GamesProps) {
  return (
    <div className="marketsGames">
      <div>
        {Object.values(games || {}).map((value, i) => {
          if (value.value) {
            return (
              <>
                <span
                  key={i}
                  className={
                    line < (value?.value ?? Number.NEGATIVE_INFINITY)
                      ? "lastFiveItem empty green"
                      : "lastFiveItem empty red"
                  }
                  title={`${value?.date}`}
                >
                  {value?.value}
                </span>
              </>
            );
          }
        })}
                {Object.values(games || {}).map((value, i) => {
          if (value.value) {
            return (
              <>
                <span
                  key={i}
                  className={
                    line < (value?.value ?? Number.NEGATIVE_INFINITY)
                      ? "lastFiveItem empty green"
                      : "lastFiveItem empty red"
                  }
                  title={`${value?.date}`}
                >
                  {value?.min} min
                </span>
              </>
            );
          }
        })}
      </div>

    </div>
  );
}

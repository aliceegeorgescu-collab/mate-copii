import { memo, useMemo } from "react";
import { rand } from "../../utils/random";

function BackgroundEnvironmentComponent() {
  const nori = useMemo(
    () => [1, 2, 3, 4].map((id) => ({ id, top: rand(5, 25), delay: rand(0, 10), dur: rand(30, 60) })),
    []
  );
  const fluturi = useMemo(
    () => [1, 2, 3].map((id) => ({ id, delay: rand(0, 5), dur: rand(15, 25) })),
    []
  );
  const stele = useMemo(
    () => Array.from({ length: 15 }).map((_, index) => ({
      id: index,
      left: rand(0, 100),
      top: rand(0, 40),
      delay: rand(0, 3),
    })),
    []
  );
  const fireDeIarba = useMemo(
    () => Array.from({ length: 20 }).map((_, index) => ({ id: index, delay: rand(0, 2) })),
    []
  );

  return (
    <div className="bg-env">
      <div className="soare">☀️</div>
      <div className="curcubeu">🌈</div>
      {nori.map((nor) => (
        <div
          key={nor.id}
          className="nor"
          style={{ top: `${nor.top}%`, animationDuration: `${nor.dur}s`, animationDelay: `-${nor.delay}s` }}
        >
          ☁️
        </div>
      ))}
      <div className="stele-bg">
        {stele.map((stea) => (
          <span
            key={stea.id}
            className="stea-bg"
            style={{ left: `${stea.left}%`, top: `${stea.top}%`, animationDelay: `${stea.delay}s` }}
          >
            ⭐
          </span>
        ))}
      </div>
      <div className="iarba-container">
        {fireDeIarba.map((fir) => (
          <div key={fir.id} className="fir-iarba" style={{ animationDelay: `${fir.delay}s` }} />
        ))}
      </div>
      {fluturi.map((fluture) => (
        <div
          key={fluture.id}
          className="fluture"
          style={{ animationDuration: `${fluture.dur}s`, animationDelay: `-${fluture.delay}s` }}
        >
          🦋
        </div>
      ))}
    </div>
  );
}

const BackgroundEnvironment = memo(BackgroundEnvironmentComponent);

export default BackgroundEnvironment;

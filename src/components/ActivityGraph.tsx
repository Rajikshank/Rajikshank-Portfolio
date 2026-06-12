import { useEffect, useMemo, useRef, useState } from "react";
import { activityClusters, type ActivityCluster } from "../data/portfolio";
import { SectionHeading } from "./SectionHeading";

const useCountUp = (target: number, durationMs: number) => {
  const [value, setValue] = useState(0);
  const startRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    startRef.current = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - startRef.current) / durationMs, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, durationMs]);

  return value;
};

const buildSparklinePath = (cells: number[], width: number, height: number) => {
  if (cells.length === 0) {
    return { line: "", area: "" };
  }
  const max = 3;
  const stepX = width / (cells.length - 1);
  const points = cells.map((v, i) => {
    const x = i * stepX;
    const y = height - (v / max) * (height - 2) - 1;
    return { x, y };
  });
  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L${width} ${height} L0 ${height} Z`;
  return { line, area };
};

const Sparkline = ({ cells }: { cells: number[] }) => {
  const width = 220;
  const height = 28;
  const { line, area } = useMemo(() => buildSparklinePath(cells, width, height), [cells]);
  return (
    <svg
      className="activity-spark"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path className="activity-spark-area" d={area} />
      <path className="activity-spark-line" d={line} />
      {cells.map((v, i) => {
        const x = (i / (cells.length - 1)) * width;
        const y = height - (v / 3) * (height - 2) - 1;
        return <circle key={i} cx={x} cy={y} r={1.4} className="activity-spark-dot" />;
      })}
    </svg>
  );
};

export const ActivityGraph = () => {
  const [active, setActive] = useState<ActivityCluster>(activityClusters[0]!);

  const totalCommits = useMemo(
    () => active.cells.reduce((sum, c) => sum + c.level, 0) * 6 + 24,
    [active]
  );
  const animatedTotal = useCountUp(totalCommits, 700);

  return (
    <section id="activity" className="section reveal-section">
      <SectionHeading
        index="01"
        title="GitHub activity"
        note="A compressed view of the last 16 weeks — training work, side projects, and shipping."
      />

      <div className="activity-panel reveal-item">
        <div className="activity-grid" aria-label="Activity heatmap">
          {activityClusters.map((cluster) => (
            <div className="activity-row" key={cluster.label}>
              <span>{cluster.label}</span>
              <div className="activity-cells">
                {cluster.cells.map((cell, index) => (
                  <button
                    key={`${cluster.label}-${index}`}
                    type="button"
                    className={`activity-cell l-${cell.level}`}
                    data-tip={cell.tip}
                    aria-label={`${cluster.title}, level ${cell.level}`}
                    onMouseEnter={() => setActive(cluster)}
                    onFocus={() => setActive(cluster)}
                    onClick={() => setActive(cluster)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="activity-axis" aria-hidden="true">
          <span>2024</span>
          <span>today</span>
        </div>

        <aside className="activity-readout" aria-live="polite">
          <div className="activity-readout-head">
            <kbd>{active.label}</kbd>
            <span className="activity-count">
              <strong>{animatedTotal}</strong>
              <em>commits / 16w</em>
            </span>
          </div>
          <h3>{active.title}</h3>
          <p>{active.description}</p>
          <Sparkline cells={active.cells.map((c) => c.level)} />
        </aside>
      </div>
    </section>
  );
};

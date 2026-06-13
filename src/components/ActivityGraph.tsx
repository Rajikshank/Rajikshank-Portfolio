import { useEffect, useMemo, useRef, useState } from "react";
import { activityClusters, type ActivityCluster } from "../data/portfolio";
import { SectionHeading } from "./SectionHeading";

const useCountUp = (target: number, durationMs: number) => {
  const [value, setValue] = useState(0);
  const startRef = useRef(0);
  const rafRef = useRef(0);
  const lastTargetRef = useRef<number | null>(null);

  useEffect(() => {
    if (!Number.isFinite(target) || target <= 0) {
      if (lastTargetRef.current !== 0) {
        lastTargetRef.current = 0;
        setValue(0);
      }
      return;
    }
    lastTargetRef.current = target;
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

const buildSparkline = (cells: number[], width: number, height: number) => {
  const max = 3;
  const stepX = width / (cells.length - 1);
  const points = cells.map((v, i) => {
    const x = i * stepX;
    const y = height - (v / max) * (height - 4) - 2;
    return { x, y };
  });
  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L${width} ${height} L0 ${height} Z`;
  return { line, area, points };
};

const Sparkline = ({ cells }: { cells: number[] }) => {
  const width = 240;
  const height = 36;
  const { line, area, points } = useMemo(() => buildSparkline(cells, width, height), [cells]);
  const last = points[points.length - 1]!;

  return (
    <svg
      className="activity-spark"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--orange)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--orange)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path className="activity-spark-area" d={area} fill="url(#spark-fill)" />
      <path
        className="activity-spark-line"
        d={line}
        pathLength={100}
        strokeDasharray="100"
        strokeDashoffset="0"
      />
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={1.6}
          className={`activity-spark-dot ${i === points.length - 1 ? "activity-spark-dot-end" : ""}`}
        />
      ))}
      <circle
        className="activity-spark-pulse"
        cx={last.x}
        cy={last.y}
        r={3}
        fill="none"
        stroke="var(--orange)"
        strokeWidth={1.2}
      />
    </svg>
  );
};

export const ActivityGraph = () => {
  const [active, setActive] = useState<ActivityCluster>(activityClusters[0]!);
  const [pulse, setPulse] = useState(0);
  const [now, setNow] = useState(() => new Date());

  const totalCommits = useMemo(
    () => active.cells.reduce((sum, c) => sum + c.level, 0) * 6 + 24,
    [active]
  );
  const animatedTotal = useCountUp(totalCommits, 700);

  // Live "now" ticker
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Pick a "current" cell to highlight
  useEffect(() => {
    const id = window.setInterval(() => {
      setPulse((p) => (p + 1) % activityClusters.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, []);

  const nowStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <section id="activity" className="section reveal-section">
      <SectionHeading
        index="01"
        title="GitHub activity"
        note="A compressed view of the last 16 weeks — training work, side projects, and shipping."
      />

      <div className="activity-panel reveal-item">
        <div className="activity-panel-head">
          <div className="activity-live">
            <span className="activity-live-dot" aria-hidden="true" />
            <span>live</span>
          </div>
          <div className="activity-panel-meta">
            <span>updated {nowStr}</span>
          </div>
        </div>

        <div className="activity-grid" aria-label="Activity heatmap">
          {activityClusters.map((cluster, rowIndex) => (
            <div className="activity-row" key={cluster.label}>
              <span>{cluster.label}</span>
              <div className="activity-cells">
                {cluster.cells.map((cell, index) => {
                  const isLastCol = index === cluster.cells.length - 1;
                  const isPulsing = rowIndex === pulse && isLastCol;
                  return (
                    <button
                      key={`${cluster.label}-${index}`}
                      type="button"
                      className={`activity-cell l-${cell.level} ${
                        isPulsing ? "is-pulsing" : ""
                      } ${isLastCol ? "is-current" : ""}`}
                      data-tip={cell.tip}
                      aria-label={`${cluster.title}, level ${cell.level}`}
                      onMouseEnter={() => setActive(cluster)}
                      onFocus={() => setActive(cluster)}
                      onClick={() => setActive(cluster)}
                    />
                  );
                })}
                <span className="activity-scan" aria-hidden="true" />
              </div>
            </div>
          ))}
        </div>

        <div className="activity-axis" aria-hidden="true">
          <span>2024</span>
          <span>now</span>
        </div>

        <aside className="activity-readout" aria-live="polite">
          <div className="activity-readout-head">
            <kbd>{active.label}</kbd>
            <span className="activity-count">
              <strong>{animatedTotal.toLocaleString()}</strong>
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

import { useEffect, useMemo, useRef, useState } from "react";
import { activityClusters, type ActivityCluster } from "../data/portfolio";
import { SectionHeading } from "./SectionHeading";

const COLORS = {
  core: "#e25822",
  ai: "#f59e6b",
  ship: "#c97a44",
};

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

type Point = { x: number; y: number };
type PathShape = { line: string; area: string; points: Point[] };

const buildSmoothPath = (
  values: number[],
  width: number,
  height: number,
  padding = 6
): PathShape => {
  if (values.length < 2) {
    return { line: "", area: "", points: [] };
  }
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const stepX = (width - padding * 2) / (values.length - 1);
  const points: Point[] = values.map((v, i) => {
    const x = padding + i * stepX;
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return { x, y };
  });

  // Smooth Bezier path (Catmull-Rom-like)
  let line = `M ${points[0]!.x.toFixed(2)} ${points[0]!.y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[Math.min(points.length - 1, i + 2)]!;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    line += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }

  const area = `${line} L ${points[points.length - 1]!.x.toFixed(2)} ${height - padding} L ${points[0]!.x.toFixed(2)} ${height - padding} Z`;
  return { line, area, points };
};

const SERIES = ["core", "ai", "ship"] as const;
type SeriesKey = (typeof SERIES)[number];

const SERIES_LABELS: Record<SeriesKey, string> = {
  core: "Core",
  ai: "AI",
  ship: "Ship",
};

const W = 280;
const H = 96;
const PADDING = 8;

const LineChart = ({ clusters, active }: { clusters: ActivityCluster[]; active: SeriesKey }) => {
  const seriesData = useMemo(() => {
    return SERIES.map((key) => {
      const cluster = clusters.find((c) => c.label === SERIES_LABELS[key])!;
      return {
        key,
        values: cluster.cells.map((c) => c.level + 0.2),
      };
    });
  }, [clusters]);

  const paths = useMemo(() => {
    return seriesData.map((s) => buildSmoothPath(s.values, W, H, PADDING));
  }, [seriesData]);

  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [pulseX, setPulseX] = useState(0);

  // Animate pulse position across the chart
  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const animate = (now: number) => {
      const t = ((now - start) / 5000) % 1; // 5s loop
      setPulseX(PADDING + t * (W - PADDING * 2));
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * W;
    const stepX = (W - PADDING * 2) / 15;
    const idx = Math.round((x - PADDING) / stepX);
    setHoverIdx(Math.max(0, Math.min(15, idx)));
  };

  const activePath = paths[SERIES.indexOf(active)]!;
  const lastPoint = activePath.points[activePath.points.length - 1] ?? { x: 0, y: 0 };
  const activePoint = activePath.points[hoverIdx ?? 15] ?? lastPoint;

  return (
    <svg
      className="activity-chart-svg"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      onMouseMove={handleMove}
      onMouseLeave={() => setHoverIdx(null)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="area-grad-core" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.core} stopOpacity="0.35" />
          <stop offset="100%" stopColor={COLORS.core} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="area-grad-ai" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.ai} stopOpacity="0.4" />
          <stop offset="100%" stopColor={COLORS.ai} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="area-grad-ship" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.ship} stopOpacity="0.3" />
          <stop offset="100%" stopColor={COLORS.ship} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="scan-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={COLORS.core} stopOpacity="0" />
          <stop offset="50%" stopColor={COLORS.core} stopOpacity="0.5" />
          <stop offset="100%" stopColor={COLORS.core} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid */}
      {[0.25, 0.5, 0.75].map((p) => (
        <line
          key={p}
          x1={PADDING}
          y1={PADDING + p * (H - PADDING * 2)}
          x2={W - PADDING}
          y2={PADDING + p * (H - PADDING * 2)}
          stroke="var(--line)"
          strokeWidth="0.5"
          strokeDasharray="2 3"
          opacity="0.4"
        />
      ))}

      {/* Areas (in order so active is on top) */}
      {SERIES.map((key, i) => (
        <path
          key={key}
          d={paths[i]!.area}
          fill={`url(#area-grad-${key})`}
          className="activity-chart-area"
          style={{ animationDelay: `${0.3 + i * 0.15}s` }}
        />
      ))}

      {/* Lines */}
      {SERIES.map((key, i) => (
        <path
          key={key}
          d={paths[i]!.line}
          fill="none"
          stroke={COLORS[key]}
          strokeWidth={key === active ? 1.8 : 1}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={key === active ? 1 : 0.4}
          className="activity-chart-line"
          pathLength={100}
          strokeDasharray="100"
          strokeDashoffset="100"
          style={{ animationDelay: `${0.1 + i * 0.12}s` }}
        />
      ))}

      {/* Dots on active line */}
      {activePath.points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={i === 15 ? 2.5 : i === (hoverIdx ?? -1) ? 2.5 : 1.2}
          fill={COLORS[active]}
          opacity={i === 15 || i === hoverIdx ? 1 : 0.5}
          className="activity-chart-dot"
          style={{ animationDelay: `${0.5 + i * 0.04}s` }}
        />
      ))}

      {/* "Now" line marker */}
      <line
        x1={pulseX}
        y1={PADDING}
        x2={pulseX}
        y2={H - PADDING}
        stroke={COLORS.core}
        strokeWidth="0.6"
        strokeDasharray="2 2"
        opacity="0.5"
        className="activity-chart-now"
      />
      <rect
        x={pulseX - 12}
        y={PADDING - 2}
        width="24"
        height="2"
        fill="url(#scan-grad)"
        className="activity-chart-scan"
      />

      {/* Hover crosshair */}
      {hoverIdx !== null && activePoint ? (
        <g className="activity-chart-hover">
          <line
            x1={activePoint.x}
            y1={PADDING}
            x2={activePoint.x}
            y2={H - PADDING}
            stroke="var(--ink)"
            strokeWidth="0.5"
            strokeDasharray="1 2"
            opacity="0.5"
          />
          <circle
            cx={activePoint.x}
            cy={activePoint.y}
            r="3"
            fill="var(--bg-soft)"
            stroke={COLORS[active]}
            strokeWidth="1.4"
          />
        </g>
      ) : null}
    </svg>
  );
};

export const ActivityGraph = () => {
  const [active, setActive] = useState<ActivityCluster>(activityClusters[0]!);
  const [now, setNow] = useState(() => new Date());

  const totalCommits = useMemo(
    () =>
      active.cells.reduce((sum, c) => sum + c.level, 0) * 6 + 24,
    [active]
  );
  const animatedTotal = useCountUp(totalCommits, 700);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const activeKey = (SERIES.find((s) => SERIES_LABELS[s] === active.label) ?? "core") as SeriesKey;

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
        note="The last 16 weeks, plotted live — training work, side projects, shipping."
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

        <div className="activity-chart-wrap">
          <LineChart clusters={activityClusters} active={activeKey} />
        </div>

        <div className="activity-readout">
          <div className="activity-readout-head">
            <kbd>{active.label}</kbd>
            <span className="activity-count">
              <strong>{animatedTotal.toLocaleString()}</strong>
              <em>commits / 16w</em>
            </span>
          </div>
          <h3>{active.title}</h3>
          <p>{active.description}</p>
        </div>

        <div className="activity-legend">
          {activityClusters.map((cluster) => {
            const key = (SERIES.find((s) => SERIES_LABELS[s] === cluster.label) ?? "core") as SeriesKey;
            const total = cluster.cells.reduce((s, c) => s + c.level, 0) * 6 + 24;
            const isActive = active.label === cluster.label;
            return (
              <button
                key={cluster.label}
                type="button"
                className={`activity-legend-item ${isActive ? "is-active" : ""}`}
                onMouseEnter={() => setActive(cluster)}
                onFocus={() => setActive(cluster)}
                onClick={() => setActive(cluster)}
                style={{ ["--c" as string]: COLORS[key] }}
              >
                <span className="activity-legend-dot" aria-hidden="true" />
                <span className="activity-legend-label">{cluster.label}</span>
                <span className="activity-legend-count">{total}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

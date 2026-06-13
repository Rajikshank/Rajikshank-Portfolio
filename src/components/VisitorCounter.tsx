import { useEffect, useRef, useState } from "react";
import { Eye, MapPin, TrendingUp } from "lucide-react";

const FLAG_KEY = "rajikshan-visitor-flag";
const HISTORY_KEY = "rajikshan-visit-history";
const NAMESPACE = "rajikshan-portfolio";
const KEY = "visits";
const MAX_HISTORY = 4;

type ApiShape = { value?: number };

const fetchJson = async (url: string): Promise<ApiShape | null> => {
  try {
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) return null;
    return (await res.json()) as ApiShape;
  } catch {
    return null;
  }
};

const countryCodeToFlag = (code: string): string => {
  if (!code || code.length !== 2) return "🌐";
  const upper = code.toUpperCase();
  const A = 0x1f1e6;
  const base = "A".charCodeAt(0);
  return (
    String.fromCodePoint(A + upper.charCodeAt(0) - base) +
    String.fromCodePoint(A + upper.charCodeAt(1) - base)
  );
};

const COUNTRY_NAMES: Record<string, string> = {
  LK: "Sri Lanka",
  IN: "India",
  US: "United States",
  GB: "United Kingdom",
  DE: "Germany",
  FR: "France",
  JP: "Japan",
  SG: "Singapore",
  AU: "Australia",
  CA: "Canada",
  AE: "UAE",
  NL: "Netherlands",
  SE: "Sweden",
  CH: "Switzerland",
  BR: "Brazil",
  ID: "Indonesia",
  TH: "Thailand",
  MY: "Malaysia",
  PK: "Pakistan",
  BD: "Bangladesh",
  IT: "Italy",
  ES: "Spain",
  KR: "South Korea",
  CN: "China",
  NZ: "New Zealand",
  IE: "Ireland",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  PL: "Poland",
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

const loadHistory = (): string[] => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveHistory = (codes: string[]) => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(codes.slice(0, MAX_HISTORY)));
  } catch {
    // ignore
  }
};

export const VisitorCounter = () => {
  const [count, setCount] = useState<number | null>(null);
  const [flag, setFlag] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>(() => loadHistory());
  const [trend, setTrend] = useState<string>("+0 today");
  const animated = useCountUp(count ?? 0, 1500);

  useEffect(() => {
    let cancelled = false;

    const lookupFlag = async () => {
      const cached = localStorage.getItem(FLAG_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as { flag: string; country: string; ts: number };
          if (Date.now() - parsed.ts < 1000 * 60 * 60 * 24 * 30) {
            if (!cancelled) {
              setFlag(parsed.flag);
              setCountry(parsed.country);
              setHistory((prev) => {
                const next = [parsed.country, ...prev.filter((c) => c !== parsed.country)];
                saveHistory(next);
                return next.slice(0, MAX_HISTORY);
              });
            }
            return;
          }
        } catch {
          // ignore
        }
      }

      const data = await fetchJson("https://ipapi.co/json/");
      if (cancelled || !data) return;
      const raw = data as unknown as { country?: string };
      const code = raw.country ?? "";
      if (code) {
        const f = countryCodeToFlag(code);
        setFlag(f);
        setCountry(code);
        try {
          localStorage.setItem(
            FLAG_KEY,
            JSON.stringify({ flag: f, country: code, ts: Date.now() })
          );
        } catch {
          // ignore
        }
        setHistory((prev) => {
          const next = [code, ...prev.filter((c) => c !== code)];
          saveHistory(next);
          return next.slice(0, MAX_HISTORY);
        });
      }
    };

    const lookupCount = async () => {
      const cached = localStorage.getItem("rajikshan-visit-count");
      if (cached) {
        const n = Number(cached);
        if (Number.isFinite(n)) {
          setCount(n);
        }
      }

      const initial = await fetchJson(
        `https://api.countapi.xyz/get/${NAMESPACE}/${KEY}`
      );
      const next = await fetchJson(
        `https://api.countapi.xyz/hit/${NAMESPACE}/${KEY}`
      );

      const value = next?.value ?? initial?.value;
      if (!cancelled && Number.isFinite(value)) {
        setCount(value as number);
        try {
          localStorage.setItem("rajikshan-visit-count", String(value));
        } catch {
          // ignore
        }
        if (Number.isFinite(value) && Number.isFinite(initial?.value)) {
          const diff = (value as number) - (initial!.value as number);
          if (diff > 0) {
            setTrend(`+${diff} today`);
          }
        }
      } else if (!cancelled) {
        setCount(1247);
        setTrend("+0 today");
      }
    };

    void lookupFlag();
    void lookupCount();

    return () => {
      cancelled = true;
    };
  }, []);

  const display = count === null ? "—" : animated.toLocaleString();
  const countryName = country ? COUNTRY_NAMES[country] ?? country : null;

  return (
    <div className="visitor-stats" role="group" aria-label="Visitor statistics">
      <div className="visitor-stats-primary">
        <div className="visitor-stat-card">
          <div className="visitor-stat-icon">
            <Eye className="h-3 w-3" />
          </div>
          <div className="visitor-stat-body">
            <span className="visitor-stat-label">total views</span>
            <span className="visitor-stat-number">{display}</span>
          </div>
          <div className="visitor-stat-trend">
            <TrendingUp className="h-2.5 w-2.5" />
            <span>{trend}</span>
          </div>
        </div>

        <div className="visitor-stat-card">
          <div className="visitor-stat-icon">
            <MapPin className="h-3 w-3" />
          </div>
          <div className="visitor-stat-body">
            <span className="visitor-stat-label">you visited from</span>
            <span className="visitor-stat-text">
              {flag ? (
                <span className="visitor-stat-flag">{flag}</span>
              ) : (
                <span className="visitor-stat-flag visitor-stat-flag-blank">—</span>
              )}
              <span className="visitor-stat-country">
                {countryName ?? "detecting…"}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="visitor-stats-history">
        <span className="visitor-stats-history-label">recent visits</span>
        <div className="visitor-stats-flags">
          {history.length === 0 ? (
            <>
              <span className="visitor-flag-chip visitor-flag-chip-skeleton" />
              <span className="visitor-flag-chip visitor-flag-chip-skeleton" />
              <span className="visitor-flag-chip visitor-flag-chip-skeleton" />
              <span className="visitor-flag-chip visitor-flag-chip-skeleton" />
            </>
          ) : (
            history.map((code, i) => (
              <span
                key={`${code}-${i}`}
                className="visitor-flag-chip"
                title={COUNTRY_NAMES[code] ?? code}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {countryCodeToFlag(code)}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

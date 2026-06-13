import { useEffect, useRef, useState } from "react";
import { Eye, MapPin } from "lucide-react";

const FLAG_KEY = "rajikshan-visitor-flag";
const NAMESPACE = "rajikshan-portfolio";
const KEY = "visits";

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

const COUNTRY_CODES: Record<string, string> = {
  LK: "sri lanka",
  IN: "india",
  US: "united states",
  GB: "united kingdom",
  DE: "germany",
  FR: "france",
  JP: "japan",
  SG: "singapore",
  AU: "australia",
  CA: "canada",
  AE: "uae",
  NL: "netherlands",
  SE: "sweden",
  CH: "switzerland",
  BR: "brazil",
  ID: "indonesia",
  TH: "thailand",
  MY: "malaysia",
  PK: "pakistan",
  BD: "bangladesh",
  IT: "italy",
  ES: "spain",
  KR: "south korea",
  CN: "china",
  NZ: "new zealand",
  IE: "ireland",
  NO: "norway",
  DK: "denmark",
  FI: "finland",
  PL: "poland",
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

export const VisitorCounter = () => {
  const [count, setCount] = useState<number | null>(null);
  const [flag, setFlag] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const animated = useCountUp(count ?? 0, 1200);

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
      } else if (!cancelled) {
        setCount(1247);
      }
    };

    void lookupFlag();
    void lookupCount();

    return () => {
      cancelled = true;
    };
  }, []);

  const display = count === null ? "—" : animated.toLocaleString();
  const countryName = country ? COUNTRY_CODES[country] ?? country.toLowerCase() : null;

  return (
    <div className="visit-stamp" role="status" aria-label="Visitor counter">
      <div className="visit-stamp-corner visit-stamp-corner-tl" aria-hidden="true" />
      <div className="visit-stamp-corner visit-stamp-corner-tr" aria-hidden="true" />
      <div className="visit-stamp-corner visit-stamp-corner-bl" aria-hidden="true" />
      <div className="visit-stamp-corner visit-stamp-corner-br" aria-hidden="true" />

      <span className="visit-stamp-dot" aria-hidden="true" />

      <span className="visit-stamp-section">
        <Eye className="visit-stamp-icon" aria-hidden="true" />
        <span className="visit-stamp-key">arrival</span>
        <span className="visit-stamp-value">{display}</span>
      </span>

      <span className="visit-stamp-divider" aria-hidden="true" />

      <span className="visit-stamp-section">
        <MapPin className="visit-stamp-icon" aria-hidden="true" />
        <span className="visit-stamp-key">from</span>
        <span className="visit-stamp-flag" aria-hidden="true">
          {flag ?? "··"}
        </span>
        <span className="visit-stamp-value">
          {countryName ?? "detecting"}
        </span>
      </span>

      <span className="visit-stamp-divider" aria-hidden="true" />

      <span className="visit-stamp-section visit-stamp-status">
        <span className="visit-stamp-pulse" aria-hidden="true" />
        <span>live</span>
      </span>
    </div>
  );
};

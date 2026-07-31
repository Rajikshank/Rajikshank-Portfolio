import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const sessionId = "gf-ms77walu";
const target = resolve(`.opengraph-creator/sessions/${sessionId}/project.og.json`);
const now = new Date().toISOString();
const effects = { shadow: false, glow: false, blur: 0 };

const shape = (id, name, x, y, width, height, fill, radius = 0, rotation = 0) => ({
  id,
  kind: "shape",
  name,
  x,
  y,
  width,
  height,
  rotation,
  opacity: 1,
  locked: false,
  hidden: false,
  shapeType: radius ? "rounded-rectangle" : "rectangle",
  fill,
  radius,
  effects,
});

const text = (id, name, value, x, y, width, height, size, weight, color, family, lineHeight = 1.1) => ({
  id,
  kind: "text",
  name,
  x,
  y,
  width,
  height,
  rotation: 0,
  opacity: 1,
  locked: false,
  hidden: false,
  text: value,
  fontFamily: family,
  fontSize: size,
  fontWeight: weight,
  color,
  align: "left",
  lineHeight,
  effects,
});

const background = {
  id: "background",
  kind: "background",
  name: "Warm Graphite Canvas",
  x: 0,
  y: 0,
  width: 1200,
  height: 630,
  rotation: 0,
  opacity: 1,
  locked: true,
  hidden: false,
  fill: "#11100f",
  radius: 0,
  effects,
};

const makeLayers = ({ routeLabel, headline, subtitle, proof }) => [
  background,
  shape("top-rule", "Top Registration Rule", 64, 76, 1072, 2, "#37332e"),
  shape("orange-register", "Orange Evidence Register", 64, 76, 5, 490, "#ed642b", 2),
  text("signature-spark", "Editable Signature Spark", "✦", 83, 89, 32, 42, 28, 650, "#ed642b", "Arial, sans-serif"),
  text("brand", "Editable KR Brand", "KR", 122, 93, 80, 42, 24, 650, "#f2ede4", "Geist, Arial, sans-serif"),
  text("route-label", "Editable Route Label", routeLabel, 862, 94, 274, 34, 18, 560, "#a9a197", "Geist Mono, Consolas, monospace"),
  text("headline", "Editable Headline", headline, 100, 166, 1000, 112, 68, 560, "#f2ede4", "Fraunces, Georgia, serif", 1.02),
  text("subtitle", "Editable Route Thesis", subtitle, 103, 302, 880, 94, 30, 430, "#c4bcb1", "Geist, Arial, sans-serif", 1.28),
  shape("proof-rule", "Proof Strip Rule", 100, 456, 1000, 2, "#37332e"),
  shape("proof-register", "Proof Strip Accent", 100, 482, 42, 8, "#ed642b", 4),
  text("proof-one", "Editable Proof Label One", proof[0], 100, 510, 310, 38, 17, 560, "#a9a197", "Geist Mono, Consolas, monospace"),
  text("proof-two", "Editable Proof Label Two", proof[1], 438, 510, 310, 38, 17, 560, "#a9a197", "Geist Mono, Consolas, monospace"),
  text("proof-three", "Editable Proof Label Three", proof[2], 776, 510, 324, 38, 17, 560, "#a9a197", "Geist Mono, Consolas, monospace"),
];

const variants = [
  {
    id: "home",
    route: "/",
    title: "Krishnakumar Rajikshan",
    description: "Full-stack AI engineer building useful web products and developer tools.",
    exportPath: "public/og/home.png",
    sourceFile: "src/pages/index.astro",
    routeLabel: "PORTFOLIO / HOME",
    headline: "Krishnakumar Rajikshan",
    subtitle: "Full-stack AI engineer building useful web products and developer tools.",
    proof: ["PROJECTS", "GITHUB ACTIVITY", "BATTICALOA, LK"],
  },
  {
    id: "work",
    route: "/work",
    title: "Projects",
    description: "A small selection of useful web products and developer tools.",
    exportPath: "public/og/work.png",
    sourceFile: "src/pages/work/index.astro",
    routeLabel: "PORTFOLIO / WORK",
    headline: "Projects",
    subtitle: "A small selection of useful web products and developer tools.",
    proof: ["OPENGRAPH CREATOR", "GIZUME", "HIVE HUB"],
  },
  {
    id: "notes",
    route: "/notes",
    title: "Blog",
    description: "Practical writing about building and shipping software.",
    exportPath: "public/og/notes.png",
    sourceFile: "src/pages/notes/index.astro",
    routeLabel: "PORTFOLIO / NOTES",
    headline: "Blog",
    subtitle: "Practical writing about building and shipping software.",
    proof: ["AI WORKFLOWS", "ENGINEERING", "PRODUCT"],
  },
  {
    id: "about",
    route: "/about",
    title: "About Krishnakumar",
    description: "Background, experience, education, and capabilities of a full-stack AI engineer.",
    exportPath: "public/og/about.png",
    sourceFile: "src/pages/about.astro",
    routeLabel: "PORTFOLIO / ABOUT",
    headline: "About",
    subtitle: "I build full-stack products, AI workflows, and tools that make complicated work simpler.",
    proof: ["TYPESCRIPT", "AI WORKFLOWS", "WEB PRODUCTS"],
  },
].map((variant) => ({
  id: variant.id,
  route: variant.route,
  title: variant.title,
  description: variant.description,
  exportPath: variant.exportPath,
  status: "draft",
  layers: makeLayers(variant),
  sourceContext: {
    route: variant.route,
    routeFile: variant.sourceFile,
    detectedTitle: variant.title,
    detectedDescription: variant.description,
    confidence: "high",
  },
}));

const project = {
  schemaVersion: "1.0",
  projectId: "krishnakumar-rajikshan-portfolio-2026",
  sessionId,
  name: "Krishnakumar Rajikshan Portfolio",
  sourceRepo: resolve("."),
  strategy: "hybrid",
  generationMode: "template",
  targetPages: variants.map((variant) => variant.route),
  canvas: { width: 1200, height: 630, safeInset: 64, background: "#11100f" },
  brand: {
    name: "Krishnakumar Rajikshan",
    accent: "#ed642b",
    surface: "#181715",
    text: "#f2ede4",
  },
  sourceArtifacts: [],
  layers: variants[0].layers,
  activePageId: "home",
  pages: variants,
  sharedDesign: {
    name: "Crafted personal index",
    description: "Warm graphite typographic poster with an orange registration mark and editable proof strip.",
    lockedStyleLayerIds: ["background", "top-rule", "orange-register"],
  },
  createdAt: now,
  updatedAt: now,
};

await writeFile(target, `${JSON.stringify(project, null, 2)}\n`, "utf8");
console.log(`Generated ${target}`);

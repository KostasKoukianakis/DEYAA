/** First-viewport hero entrance — DOM hooks + timing (seconds) */
export const HERO_ENTRANCE = {
  shader: 0.45,
  shaderToBrand: 0,
  brand: 0.7,
  brandToNav: 0.12,
  nav: 0.32,
  navToStation: 0.08,
  station: 0.38,
  baseReveal: 0.15,
  rightHoriz: 0.4,
  rightVert: 0.36,
  rightHoriz2: 0.3,
  cornerReveal: 0.16,
  leftRun: 0.5,
  leftElbowH: 0.28,
  leftElbowV: 0.5,
  ui: 0.35,
  staggerBase: 0.03,
  staggerPipe: 0.04,
  /** Station + pipes overlap — larger = pipes start sooner after logo beat */
  pipesOverlap: 0.32,
} as const;

export const HERO_ENTRANCE_SELECTORS = {
  root: "#section-01",
  shaderScene: ".hero-entrance-shader-scene",
  brand: ".hero-entrance-brand",
  nav: "header.site-nav-header",
  station: ".hero-entrance-station",
  stationSideStubA: ".hero-entrance-station-side-stub--a",
  stationSideStubB: ".hero-entrance-station-side-stub--b",
  stationDownStub: ".hero-entrance-station-down-stub",
  rightBase: ".hero-entrance-right-base",
  rightSegH1: ".hero-entrance-right-seg--h1",
  rightSegC1: ".hero-entrance-right-seg--c1",
  rightSegV: ".hero-entrance-right-seg--v",
  rightSegC2: ".hero-entrance-right-seg--c2",
  rightSegH2: ".hero-entrance-right-seg--h2",
  leftBase: ".hero-entrance-left-base",
  leftFoot: ".hero-entrance-left-foot",
  leftRun: ".hero-entrance-left-run",
  leftElbowH: ".hero-entrance-left-elbow-h",
  leftElbowC: ".hero-entrance-left-elbow-c",
  leftElbowV: ".hero-entrance-left-elbow-v",
  ui: ".hero-entrance-ui",
} as const;

/** Shared grow tween — matches scroll-scrubbed down pipes (linear extension) */
export const HERO_PIPE_GROW = {
  ease: "none" as const,
  force3D: true,
};

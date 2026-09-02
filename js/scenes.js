window.FFScenes = (function () {
  const configs = window.FF_SCENES || {};
  const instances = [];
  const LITE_LIVE_CAP = 4;
  let seq = 0;
  let observer = null;
  let hiddenBound = false;

  function has(slug) {
    return Boolean(configs[slug]);
  }

  function configOf(slug, viewIndex) {
    const entry = configs[slug];
    if (!entry) return null;
    const index = viewIndex || 0;
    const variant = (entry.variants && entry.variants[index]) || entry.variants[0] || {};
    const palette = Object.assign({}, entry.palette, variant.palette || {});
    return {
      slug: slug,
      family: entry.family,
      seed: entry.seed,
      catalog: entry.catalog || {},
      sheet: entry.sheet || {},
      palette: palette,
      layout: variant.layout || "",
      wind: variant.wind != null ? variant.wind : (entry.wind || 1),
      noShadow: variant.noShadow != null ? variant.noShadow : entry.noShadow,
      ground: variant.ground || { x: 0.5, y: 0.92 },
      light: variant.light || null,
      eyes: variant.eyes || null,
      viewIndex: index
    };
  }

  function rng(seed) {
    let s = (seed >>> 0) || 1;
    return function () {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  function uid(slug, viewIndex) {
    seq += 1;
    return "ffsc-" + slug + "-" + viewIndex + "-" + seq;
  }

  function debugOn() {
    return /(?:^|[?&])debug=anchors(?:&|$)/.test(location.search);
  }

  function reduced() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.classList.contains("ff-pause-motion");
  }

  function svgOpen(extraClass) {
    return '<svg class="diorama-layer ' + extraClass + '" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">';
  }

  function px(n) {
    return n.toFixed(1);
  }

  function particleCount(base, lite, intensity) {
    const scaled = lite ? base * 0.5 * intensity : base * intensity;
    return Math.max(lite ? 2 : 3, Math.round(scaled));
  }

  function glowAt(anchor, color, opacity, extraClass) {
    if (!anchor) return "";
    const cx = anchor.x * 100;
    const cy = anchor.y * 100;
    const klass = extraClass ? " " + extraClass : "";
    return '<circle class="diorama-anim glow-soft' + klass + '" cx="' + px(cx) + '" cy="' + px(cy) +
      '" r="6.5" fill="' + color + '" opacity="' + opacity + '"/>' +
      '<rect class="diorama-anim glow-core' + klass + '" x="' + px(cx - 0.55) + '" y="' + px(cy - 0.55) +
      '" width="1.1" height="1.1" fill="' + color + '"/>';
  }

  function emberItems(rnd, gx, gy, count, palette) {
    let html = "";
    let i = 0;
    for (i = 0; i < count; i += 1) {
      const x = gx - 16 + rnd() * 32;
      const y = gy - 1 - rnd() * 5;
      const size = 0.55 + rnd() * 0.85;
      const dx = (-6 + rnd() * 12).toFixed(1);
      const dur = (3.4 + rnd() * 3.2).toFixed(2);
      const delay = (-rnd() * 5).toFixed(2);
      const fill = rnd() > 0.45 ? palette.ember : palette.emberHot;
      html += '<rect class="diorama-anim ember" x="' + px(x) + '" y="' + px(y) +
        '" width="' + size.toFixed(2) + '" height="' + size.toFixed(2) + '" fill="' + fill +
        '" style="--dx:' + dx + "px;--dur:" + dur + "s;--delay:" + delay + 's"></rect>';
    }
    return html;
  }

  function buildFeu(ctx) {
    const p = ctx.palette;
    const gx = ctx.ground.x * 100;
    const gy = ctx.ground.y * 100;
    const id = ctx.id;
    const lite = ctx.lite;
    const unfurled = ctx.layout === "unfurled";

    const bg =
      svgOpen("diorama-bg") +
        '<defs><linearGradient id="' + id + '-bg" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="' + p.bgTop + '"/>' +
          '<stop offset="1" stop-color="' + p.bgBot + '"/>' +
        "</linearGradient>" +
        '<radialGradient id="' + id + '-warm" cx="' + (ctx.ground.x).toFixed(2) + '" cy="0.86" r="0.46">' +
          '<stop offset="0" stop-color="' + p.crack + '" stop-opacity="0.38"/>' +
          '<stop offset="1" stop-color="' + p.bgBot + '" stop-opacity="0"/>' +
        "</radialGradient></defs>" +
        '<rect width="100" height="100" fill="url(#' + id + '-bg)"/>' +
        '<rect width="100" height="100" fill="url(#' + id + '-warm)"/>' +
      "</svg>";

    let far = svgOpen("diorama-far");
    far += '<path fill="' + p.rock + '" d="M4 86L12 64 21 74 29 58 41 86Z"/>';
    if (unfurled) {
      far += '<path fill="' + p.rock + '" opacity=".7" d="M62 88L70 70 79 78 88 62 98 88Z"/>';
      if (!lite) far += '<path fill="' + p.rock + '" opacity=".45" d="M46 90L52 76 60 90Z"/>';
    } else {
      far += '<path fill="' + p.rock + '" opacity=".55" d="M72 90L80 78 88 86 96 74 100 90Z"/>';
    }
    far += "</svg>";

    const ground =
      svgOpen("diorama-ground") +
        '<ellipse cx="' + px(gx) + '" cy="' + px(gy + 1.4) +
          '" rx="' + (unfurled ? "24" : "22") + '" ry="3.2" fill="' + p.shadow + '" opacity=".72"/>' +
        '<path class="diorama-anim crack" fill="none" stroke="' + p.crack +
          '" stroke-width="0.7" d="M' + px(gx - 14) + " " + px(gy) +
          " L" + px(gx - 6) + " " + px(gy - 1.2) +
          " L" + px(gx) + " " + px(gy) + '"/>' +
        '<path class="diorama-anim crack" fill="none" stroke="' + p.emberHot +
          '" stroke-width="0.55" d="M' + px(gx) + " " + px(gy) +
          " L" + px(gx + 8) + " " + px(gy - 0.8) +
          " L" + px(gx + 16) + " " + px(gy) + '"/>' +
        (unfurled && !lite
          ? '<path fill="none" stroke="' + p.crack + '" stroke-width="0.4" opacity=".5" d="M' +
            px(gx - 4) + " " + px(gy + 1.4) + " L" + px(gx + 3) + " " + px(gy + 0.6) + '"/>'
          : "") +
      "</svg>";

    const near =
      svgOpen("diorama-near") +
        emberItems(ctx.rnd, gx, gy, particleCount(unfurled ? 9 : 7, lite, ctx.intensity), p) +
      "</svg>";

    return { bg: bg, far: far, ground: ground, near: near };
  }

  function buildEau(ctx) {
    const p = ctx.palette;
    const gx = ctx.ground.x * 100;
    const gy = ctx.ground.y * 100;
    const id = ctx.id;
    const lite = ctx.lite;
    const rnd = ctx.rnd;
    const hunched = ctx.layout === "hunched";

    const bg =
      svgOpen("diorama-bg") +
        '<defs><linearGradient id="' + id + '-bg" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="' + p.bgTop + '"/>' +
          '<stop offset="1" stop-color="' + p.bgBot + '"/>' +
        "</linearGradient></defs>" +
        '<rect width="100" height="100" fill="url(#' + id + '-bg)"/>' +
        (hunched
          ? '<polygon fill="' + p.shaft + '" opacity=".07" points="22,0 30,0 24,100 12,100"/>' +
            '<polygon fill="' + p.shaft + '" opacity=".05" points="70,0 76,0 84,100 74,100"/>'
          : '<polygon fill="' + p.shaft + '" opacity=".08" points="38,0 46,0 40,100 28,100"/>' +
            '<polygon fill="' + p.shaft + '" opacity=".05" points="58,0 64,0 70,100 60,100"/>') +
      "</svg>";

    let far = svgOpen("diorama-far");
    far += '<path fill="' + p.rock + '" d="M6 92L10 78 18 84 24 76 32 92Z"/>';
    far += '<path fill="' + p.rock + '" opacity=".65" d="M74 94L80 80 88 86 96 78 102 94Z"/>';
    const moteN = particleCount(5, lite, ctx.intensity);
    let i = 0;
    for (i = 0; i < moteN; i += 1) {
      const x = rnd() > 0.5 ? 8 + rnd() * 12 : 80 + rnd() * 14;
      const y = 22 + rnd() * 50;
      const r = 0.4 + rnd() * 0.7;
      const dur = (6 + rnd() * 4).toFixed(2);
      const delay = (-rnd() * 6).toFixed(2);
      const dx = (-2 + rnd() * 4).toFixed(1);
      far += '<circle class="diorama-anim bubble" cx="' + px(x) + '" cy="' + px(y) +
        '" r="' + r.toFixed(2) + '" fill="' + p.bubble + '" opacity=".35" style="--dx:' + dx +
        "px;--dur:" + dur + "s;--delay:" + delay + 's"></circle>';
    }
    far += "</svg>";

    const siltRx = hunched ? 28 : 18;
    const ground =
      svgOpen("diorama-ground") +
        '<ellipse cx="' + px(gx) + '" cy="' + px(gy + 1) +
          '" rx="' + siltRx + '" ry="3.4" fill="' + p.silt + '" opacity=".55"/>' +
        '<path fill="' + p.silt + '" d="M0 96 Q' + px(gx) + " " + px(gy - (hunched ? 1 : 2)) +
          " 100 97 L100 100 L0 100Z\"/>" +
      "</svg>";

    let near = svgOpen("diorama-near");
    near += '<path class="diorama-anim kelp" fill="' + p.kelp +
      '" d="M14 100 C12 86 20 78 13 64 C18 76 10 88 14 100Z"/>';
    if (!lite) {
      near += '<path class="diorama-anim kelp kelp-b" fill="' + p.kelp +
        '" opacity=".8" d="M88 100 C92 84 82 76 90 58 C86 74 94 88 88 100Z"/>';
    }
    const bubbles = particleCount(3, lite, ctx.intensity);
    for (i = 0; i < bubbles; i += 1) {
      const x = rnd() > 0.5 ? 8 + rnd() * 10 : 84 + rnd() * 8;
      const y = 55 + rnd() * 30;
      const r = 0.5 + rnd() * 0.7;
      const dur = (5 + rnd() * 4).toFixed(2);
      const delay = (-rnd() * 6).toFixed(2);
      const dx = (-3 + rnd() * 6).toFixed(1);
      near += '<circle class="diorama-anim bubble" cx="' + px(x) + '" cy="' + px(y) +
        '" r="' + r.toFixed(2) + '" fill="' + p.bubble + '" opacity=".4" style="--dx:' + dx +
        "px;--dur:" + dur + "s;--delay:" + delay + 's"></circle>';
    }
    near += "</svg>";
    return { bg: bg, far: far, ground: ground, near: near };
  }

  function buildSpectral(ctx) {
    const p = ctx.palette;
    const gx = ctx.ground.x * 100;
    const gy = ctx.ground.y * 100;
    const id = ctx.id;
    const lite = ctx.lite;
    const hooded = ctx.layout === "hooded";
    const eyeCx = ctx.eyes ? ctx.eyes.x.toFixed(2) : "0.42";
    const eyeCy = ctx.eyes ? ctx.eyes.y.toFixed(2) : "0.28";

    const bg =
      svgOpen("diorama-bg") +
        '<defs><linearGradient id="' + id + '-bg" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="' + p.bgTop + '"/>' +
          '<stop offset="1" stop-color="' + p.bgBot + '"/>' +
        "</linearGradient>" +
        '<radialGradient id="' + id + '-cold" cx="' + eyeCx + '" cy="' + eyeCy + '" r="0.42">' +
          '<stop offset="0" stop-color="' + p.mist + '" stop-opacity="0.18"/>' +
          '<stop offset="1" stop-color="' + p.bgBot + '" stop-opacity="0"/>' +
        "</radialGradient></defs>" +
        '<rect width="100" height="100" fill="url(#' + id + '-bg)"/>' +
        '<rect width="100" height="100" fill="url(#' + id + '-cold)"/>' +
      "</svg>";

    let far = svgOpen("diorama-far");
    if (hooded) {
      far += '<path fill="' + p.ruin + '" d="M6 88 L6 58 L18 50 L18 88Z" opacity=".4"/>';
      far += '<path fill="none" stroke="' + p.ruin + '" stroke-width="1.1" d="M78 90 L78 56 L94 56" opacity=".35"/>';
    } else {
      far += '<path fill="' + p.ruin + '" d="M8 86 L8 48 L14 48 L14 40 L22 40 L22 48 L28 48 L28 86Z" opacity=".55"/>';
      far += '<path fill="none" stroke="' + p.ruin + '" stroke-width="1.2" d="M70 90 L70 52 L88 52" opacity=".4"/>';
    }
    if (ctx.eyes && !lite) {
      far += glowAt(ctx.eyes, p.filament, 0.14);
    }
    far += "</svg>";

    const ground = svgOpen("diorama-ground") + "</svg>";

    const near =
      svgOpen("diorama-near") +
        '<path class="diorama-anim mist" fill="' + p.mist + '" opacity=".26" d="M' +
          px(gx - 26) + " " + px(gy + 3) + " L" + px(gx - 12) + " " + px(gy - 5) + " L" +
          px(gx + 4) + " " + px(gy - 2) + " L" + px(gx + 22) + " " + px(gy + 2) + " L" +
          px(gx + 16) + " " + px(gy + 7) + " L" + px(gx - 18) + " " + px(gy + 7) + 'Z"/>' +
        '<path class="diorama-anim mist mist-b" fill="' + p.mist + '" opacity=".16" d="M' +
          px(gx - 8) + " " + px(gy - 1) + " L" + px(gx + 6) + " " + px(gy - 9) + " L" +
          px(gx + 20) + " " + px(gy - 4) + " L" + px(gx + 14) + " " + px(gy + 3) + " L" +
          px(gx - 4) + " " + px(gy + 4) + 'Z"/>' +
        (lite ? "" :
          '<path class="diorama-anim filament" fill="none" stroke="' + p.filament +
            '" stroke-width="0.45" d="M' + px(gx - 12) + " " + px(gy - 8) +
            " C" + px(gx - 4) + " " + px(gy - 18) + " " + px(gx + 2) +
            " " + px(gy - 4) + " " + px(gx + 10) + " " + px(gy - 12) + '"/>' +
          '<path class="diorama-anim filament filament-b" fill="none" stroke="' + p.filament +
            '" stroke-width="0.35" d="M' + px(gx + 2) + " " + px(gy - 6) +
            " C" + px(gx + 10) + " " + px(gy - 16) + " " + px(gx + 16) +
            " " + px(gy - 2) + " " + px(gx + 22) + " " + px(gy - 10) + '"/>') +
      "</svg>";

    return { bg: bg, far: far, ground: ground, near: near };
  }

  function buildSylvestre(ctx) {
    const p = ctx.palette;
    const gx = ctx.ground.x * 100;
    const gy = ctx.ground.y * 100;
    const id = ctx.id;
    const lite = ctx.lite;
    const rnd = ctx.rnd;
    const orb = ctx.layout === "orb";
    const light = ctx.light;

    const bg =
      svgOpen("diorama-bg") +
        '<defs><linearGradient id="' + id + '-bg" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="' + p.bgTop + '"/>' +
          '<stop offset="1" stop-color="' + p.bgBot + '"/>' +
        "</linearGradient>" +
        (light
          ? '<radialGradient id="' + id + '-canopy" cx="' + light.x.toFixed(2) + '" cy="' + light.y.toFixed(2) + '" r="0.34">' +
              '<stop offset="0" stop-color="' + p.firefly + '" stop-opacity="0.16"/>' +
              '<stop offset="1" stop-color="' + p.bgBot + '" stop-opacity="0"/>' +
            "</radialGradient>"
          : "") +
        "</defs>" +
        '<rect width="100" height="100" fill="url(#' + id + '-bg)"/>' +
        (light ? '<rect width="100" height="100" fill="url(#' + id + '-canopy)"/>' : "") +
        '<polygon fill="' + p.firefly + '" opacity=".05" points="28,0 44,0 36,64 18,64"/>' +
      "</svg>";

    const far =
      svgOpen("diorama-far") +
        '<path fill="' + p.bark + '" d="M6 20 L10 18 L12 70 L8 72Z"/>' +
        '<path fill="' + p.leaf + '" d="M12 22 L4 30 L14 28 L8 40 L16 32 L22 42 L18 24Z"/>' +
        (orb
          ? '<path fill="' + p.bark + '" d="M88 14 L93 18 L86 82 L81 78Z"/>' +
            '<path fill="' + p.leaf + '" d="M84 20 L96 28 L82 30 L92 42 L78 32 L74 44 L80 22Z"/>'
          : '<path fill="' + p.bark + '" d="M90 8 L94 10 L88 78 L84 76Z"/>' +
            '<path fill="' + p.leaf + '" d="M86 16 L96 24 L84 26 L94 38 L80 28 L76 40 L82 20Z"/>') +
        (light && !lite ? glowAt(light, p.firefly, 0.16) : "") +
      "</svg>";

    const ground =
      svgOpen("diorama-ground") +
        '<ellipse cx="' + px(gx) + '" cy="' + px(gy + 1) +
          '" rx="' + (orb ? "20" : "18") + '" ry="2.8" fill="' + p.shadow + '" opacity=".65"/>' +
        '<path fill="' + p.bark + '" d="M' + px(gx - 16) + " " + px(gy) +
          " Q" + px(gx) + " " + px(gy - 3) + " " + px(gx + 16) +
          " " + px(gy) + " L" + px(gx + 14) + " 100 L" + px(gx - 14) + ' 100Z"/>' +
      "</svg>";

    let near = svgOpen("diorama-near");
    near += '<path fill="' + p.grass + '" d="M8 100 L10 82 L12 100 L14 86 L16 100Z"/>';
    near += '<path fill="' + p.grass + '" d="M82 100 L84 84 L86 100 L89 80 L91 100Z"/>';
    if (!lite) {
      near += '<path fill="' + p.grass + '" opacity=".85" d="M22 100 L24 88 L25 100 L27 84 L29 100Z"/>';
    }
    const flies = particleCount(5, lite, ctx.intensity);
    let i = 0;
    for (i = 0; i < flies; i += 1) {
      let x;
      let y;
      if (light && i < Math.ceil(flies / 2)) {
        x = light.x * 100 + (rnd() - 0.5) * 10;
        y = light.y * 100 + 6 + rnd() * 16;
      } else {
        x = 8 + rnd() * 12;
        y = 28 + rnd() * 46;
      }
      const dur = (3.5 + rnd() * 3).toFixed(2);
      const delay = (-rnd() * 4).toFixed(2);
      const dx = (-5 + rnd() * 10).toFixed(1);
      const dy = (-6 + rnd() * 8).toFixed(1);
      near += '<rect class="diorama-anim firefly" x="' + px(x) + '" y="' + px(y) +
        '" width="0.9" height="0.9" fill="' + p.firefly + '" style="--dx:' + dx + "px;--dy:" + dy +
        "px;--dur:" + dur + "s;--delay:" + delay + 's"></rect>';
    }
    near += "</svg>";
    return { bg: bg, far: far, ground: ground, near: near };
  }

  function buildMineral(ctx) {
    const p = ctx.palette;
    const gx = ctx.ground.x * 100;
    const gy = ctx.ground.y * 100;
    const id = ctx.id;
    const lite = ctx.lite;
    const rnd = ctx.rnd;
    const runes = ctx.layout === "runes";
    const light = ctx.light || { x: ctx.ground.x + 0.06, y: 0.35 };
    const glow = p.glow || p.crystal;

    const bg =
      svgOpen("diorama-bg") +
        '<defs><linearGradient id="' + id + '-bg" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="' + p.bgTop + '"/>' +
          '<stop offset="1" stop-color="' + p.bgBot + '"/>' +
        "</linearGradient>" +
        '<radialGradient id="' + id + '-gem" cx="' + light.x.toFixed(2) + '" cy="' + light.y.toFixed(2) + '" r="0.24">' +
          '<stop offset="0" stop-color="' + glow + '" stop-opacity="0.26"/>' +
          '<stop offset="1" stop-color="' + p.bgBot + '" stop-opacity="0"/>' +
        "</radialGradient></defs>" +
        '<rect width="100" height="100" fill="url(#' + id + '-bg)"/>' +
        '<rect width="100" height="100" fill="url(#' + id + '-gem)"/>' +
      "</svg>";

    const far =
      svgOpen("diorama-far") +
        '<path fill="' + p.rock + '" d="M0 70 L18 52 L28 70 L22 100 L0 100Z"/>' +
        (runes
          ? '<path fill="' + p.crystal + '" opacity=".4" d="M74 44 L82 30 L90 48 L84 68 L76 62Z"/>'
          : '<path fill="' + p.crystal + '" opacity=".35" d="M78 48 L84 36 L90 50 L86 70 L80 66Z"/>') +
        '<path fill="' + p.rock + '" d="M86 60 L100 46 L100 100 L80 100Z"/>' +
        (lite ? "" : glowAt(light, glow, 0.14)) +
      "</svg>";

    const ground =
      svgOpen("diorama-ground") +
        '<ellipse cx="' + px(gx) + '" cy="' + px(gy + 1.2) +
          '" rx="22" ry="3.2" fill="' + p.shadow + '" opacity=".82"/>' +
        '<path fill="' + p.slab + '" d="M' + px(gx - 22) + " " + px(gy) +
          " L" + px(gx - 8) + " " + px(gy - 4) +
          " L" + px(gx + 10) + " " + px(gy - 3.2) +
          " L" + px(gx + 24) + " " + px(gy) +
          " L" + px(gx + 18) + " 100 L" + px(gx - 16) + ' 100Z"/>' +
      "</svg>";

    let near = svgOpen("diorama-near");
    near += '<path fill="' + p.crystal + '" opacity=".7" d="M10 94 L14 80 L20 95Z"/>';
    if (!lite) {
      near += '<path fill="' + p.crystal + '" opacity=".45" d="M84 92 L88 78 L94 93Z"/>';
      if (runes) {
        near += '<path fill="' + glow + '" opacity=".35" d="M16 90 L18 84 L21 91Z"/>';
      }
    }
    const dust = particleCount(4, lite, ctx.intensity);
    let i = 0;
    for (i = 0; i < dust; i += 1) {
      const x = gx - 12 + rnd() * 24;
      const y = gy - 2 - rnd() * 4;
      const dur = (6 + rnd() * 5).toFixed(2);
      const delay = (-rnd() * 7).toFixed(2);
      near += '<rect class="diorama-anim dust" x="' + px(x) + '" y="' + px(y) +
        '" width="0.8" height="0.8" fill="' + p.dust +
        '" style="--dur:' + dur + "s;--delay:" + delay + 's"></rect>';
    }
    near += "</svg>";
    return { bg: bg, far: far, ground: ground, near: near };
  }

  function buildCeleste(ctx) {
    const p = ctx.palette;
    const gx = ctx.ground.x * 100;
    const gy = ctx.ground.y * 100;
    const id = ctx.id;
    const lite = ctx.lite;
    const blade = ctx.layout === "blade";
    const light = ctx.light || { x: 0.5, y: 0.18 };
    const wind = ctx.wind || 1;

    const bg =
      svgOpen("diorama-bg") +
        '<defs><linearGradient id="' + id + '-bg" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="' + p.bgTop + '"/>' +
          '<stop offset="1" stop-color="' + p.bgBot + '"/>' +
        "</linearGradient>" +
        '<radialGradient id="' + id + '-back" cx="' + light.x.toFixed(2) + '" cy="' + light.y.toFixed(2) + '" r="0.4">' +
          '<stop offset="0" stop-color="' + p.light + '" stop-opacity="0.3"/>' +
          '<stop offset="1" stop-color="' + p.bgBot + '" stop-opacity="0"/>' +
        "</radialGradient></defs>" +
        '<rect width="100" height="100" fill="url(#' + id + '-bg)"/>' +
        '<rect width="100" height="100" fill="url(#' + id + '-back)"/>' +
      "</svg>";

    const far =
      svgOpen("diorama-far") +
        '<g class="diorama-anim cloud">' +
          (blade
            ? '<path fill="' + p.cloud + '" d="M62 26 L74 20 L90 26 L84 34 L64 32Z" opacity=".5"/>' +
              '<path fill="' + p.cloud + '" d="M6 22 L18 16 L32 22 L26 30 L10 28Z" opacity=".35"/>'
            : '<path fill="' + p.cloud + '" d="M8 28 L18 22 L32 26 L28 34 L12 34Z" opacity=".55"/>' +
              '<path fill="' + p.cloud + '" d="M68 18 L80 14 L94 20 L90 28 L70 26Z" opacity=".4"/>') +
        "</g>" +
        (lite ? "" : glowAt(light, p.light, 0.2)) +
      "</svg>";

    const ground =
      svgOpen("diorama-ground") +
        '<ellipse cx="' + px(gx) + '" cy="' + px(gy + 0.8) +
          '" rx="16" ry="2.4" fill="' + p.shadow + '" opacity=".45"/>' +
      "</svg>";

    let near = svgOpen("diorama-near");
    if (blade) {
      near += '<path class="diorama-anim streak" fill="none" stroke="' + p.streak +
        '" stroke-width="0.45" d="M94 28 L76 24"/>';
      near += '<path class="diorama-anim streak streak-b" fill="none" stroke="' + p.streak +
        '" stroke-width="0.35" d="M92 86 L74 82"/>';
      if (!lite) {
        near += '<path class="diorama-anim streak streak-c" fill="none" stroke="' + p.streak +
          '" stroke-width="0.3" d="M22 18 L6 14"/>';
      }
    } else {
      near += '<path class="diorama-anim streak" fill="none" stroke="' + p.streak +
        '" stroke-width="0.45" d="M6 24 L24 20"/>';
      near += '<path class="diorama-anim streak streak-b" fill="none" stroke="' + p.streak +
        '" stroke-width="0.35" d="M8 86 L26 82"/>';
      if (!lite) {
        near += '<path class="diorama-anim streak streak-c" fill="none" stroke="' + p.streak +
          '" stroke-width="0.3" d="M76 22 L94 18"/>';
      }
    }
    near += "</svg>";
    return { bg: bg, far: far, ground: ground, near: near, wind: wind };
  }

  const builders = {
    feu: buildFeu,
    eau: buildEau,
    spectral: buildSpectral,
    sylvestre: buildSylvestre,
    mineral: buildMineral,
    celeste: buildCeleste
  };

  function layers(cfg, mode) {
    const id = uid(cfg.slug, cfg.viewIndex);
    const lite = mode === "lite";
    const builder = builders[cfg.family];
    const intensity = lite
      ? (cfg.catalog.intensity != null ? cfg.catalog.intensity : 0.5)
      : (cfg.sheet.intensity != null ? cfg.sheet.intensity : 1);
    const ctx = {
      id: id,
      lite: lite,
      palette: cfg.palette,
      ground: cfg.ground || { x: 0.5, y: 0.92 },
      light: cfg.light,
      eyes: cfg.eyes,
      layout: cfg.layout,
      rnd: rng(cfg.seed + (cfg.viewIndex || 0) * 17),
      wind: cfg.wind || 1,
      noShadow: cfg.noShadow,
      intensity: intensity
    };
    return builder ? builder(ctx) : { bg: "", far: "", ground: "", near: "" };
  }

  function debugMark(anchor, label, color) {
    if (!anchor) return "";
    return '<circle cx="' + (anchor.x * 100).toFixed(1) + '" cy="' + (anchor.y * 100).toFixed(1) +
      '" r="1.5" fill="' + color + '"/>' +
      '<text x="' + (anchor.x * 100 + 2).toFixed(1) + '" y="' + (anchor.y * 100 - 2).toFixed(1) +
      '" fill="' + color + '" font-size="3" font-family="monospace">' + label + "</text>";
  }

  function debugSvg(cfg) {
    return svgOpen("diorama-debug") +
      '<rect x="0.5" y="0.5" width="99" height="99" fill="none" stroke="#ff4d6d" stroke-width="0.4" stroke-dasharray="2 2"/>' +
      debugMark(cfg.ground, "sol", "#ff4d6d") +
      debugMark(cfg.light, "lum", "#f0e080") +
      debugMark(cfg.eyes, "yeux", "#80e0ff") +
      '<text x="3" y="7" fill="#ff4d6d" font-size="3.2" font-family="monospace">' +
        cfg.slug + " v" + (cfg.viewIndex + 1) + " " + (cfg.layout || "") + "</text>" +
      "</svg>";
  }

  function markup(creature, viewIndex, options) {
    const opts = options || {};
    const cfg = configOf(creature.slug, viewIndex);
    if (!cfg) return "";
    const mode = opts.mode || "full";
    const built = layers(cfg, mode);
    const src = opts.src || "";
    const alt = opts.alt || "";
    const dim = opts.size || (mode === "lite" ? 240 : 480);
    const loading = opts.lazy ? ' loading="lazy" decoding="async"' : ' decoding="async"';
    const wind = cfg.wind || 1;
    return (
      '<div class="diorama diorama-' + cfg.family + (mode === "lite" ? " is-lite" : " is-full") +
        '" data-scene="' + creature.slug + '" data-view="' + viewIndex +
        '" data-mode="' + mode + '" data-wind="' + wind + '">' +
        '<div class="diorama-stage">' +
          built.bg + built.far + built.ground +
          '<img class="diorama-sprite' + (opts.zoomClass ? " " + opts.zoomClass : "") +
            '" src="' + src + '" alt="' + alt + '" width="' + dim + '" height="' + dim + '"' + loading + ">" +
          built.near +
          (debugOn() ? debugSvg(cfg) : "") +
        "</div>" +
      "</div>"
    );
  }

  function applyLiveCap() {
    const lites = [];
    instances.forEach(function (item) {
      const node = item.node;
      if (!node.classList.contains("is-lite")) return;
      if (!node.classList.contains("is-live")) {
        node.classList.remove("is-capped");
        return;
      }
      lites.push(node);
    });
    lites.forEach(function (node, index) {
      const hot = node.classList.contains("is-hot");
      node.classList.toggle("is-capped", !hot && index >= LITE_LIVE_CAP);
    });
  }

  function ensureObserver() {
    if (observer) return observer;
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle("is-live", entry.isIntersecting);
      });
      applyLiveCap();
    }, { rootMargin: "48px 0px", threshold: 0.15 });
    return observer;
  }

  function bindHidden() {
    if (hiddenBound) return;
    hiddenBound = true;
    document.addEventListener("visibilitychange", function () {
      document.documentElement.classList.toggle("ff-tab-hidden", document.hidden);
    });
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = function () {
      document.documentElement.classList.toggle("ff-still", media.matches);
    };
    apply();
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", apply);
    }
    if (localStorage.getItem("ff-pause-motion") === "1") {
      document.documentElement.classList.add("ff-pause-motion");
    }
  }

  function attachParallax(node) {
    if (reduced() || node.getAttribute("data-mode") !== "full") return function () {};
    const far = node.querySelector(".diorama-far");
    const near = node.querySelector(".diorama-near");
    if (!far || !near) return function () {};
    const onMove = function (event) {
      const box = node.getBoundingClientRect();
      const nx = ((event.clientX - box.left) / box.width - 0.5);
      far.style.transform = "translate(" + (nx * 3).toFixed(2) + "px,0)";
      near.style.transform = "translate(" + (-nx * 4).toFixed(2) + "px,0)";
    };
    const reset = function () {
      far.style.transform = "";
      near.style.transform = "";
    };
    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", reset);
    return function () {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", reset);
    };
  }

  function attachHot(node) {
    if (node.getAttribute("data-mode") !== "lite") return function () {};
    const host = node.closest(".plate") || node;
    const on = function () {
      node.classList.add("is-hot");
      applyLiveCap();
    };
    const off = function () {
      node.classList.remove("is-hot");
      applyLiveCap();
    };
    host.addEventListener("pointerenter", on);
    host.addEventListener("pointerleave", off);
    host.addEventListener("focusin", on);
    host.addEventListener("focusout", off);
    return function () {
      host.removeEventListener("pointerenter", on);
      host.removeEventListener("pointerleave", off);
      host.removeEventListener("focusin", on);
      host.removeEventListener("focusout", off);
    };
  }

  function mount(root) {
    bindHidden();
    const scope = root || document;
    const nodes = scope.querySelectorAll(".diorama");
    const obs = ensureObserver();
    nodes.forEach(function (node) {
      if (node.getAttribute("data-bound") === "1") return;
      node.setAttribute("data-bound", "1");
      obs.observe(node);
      const releaseParallax = attachParallax(node);
      const releaseHot = attachHot(node);
      instances.push({
        node: node,
        release: function () {
          releaseParallax();
          releaseHot();
        }
      });
    });
    applyLiveCap();
  }

  function destroyAll() {
    instances.forEach(function (item) {
      if (observer && item.node) observer.unobserve(item.node);
      if (item.release) item.release();
      if (item.node) item.node.removeAttribute("data-bound");
    });
    instances.length = 0;
  }

  function setPaused(paused) {
    document.documentElement.classList.toggle("ff-pause-motion", paused);
    localStorage.setItem("ff-pause-motion", paused ? "1" : "0");
  }

  function isPaused() {
    return document.documentElement.classList.contains("ff-pause-motion") ||
      document.documentElement.classList.contains("ff-still");
  }

  return {
    has: has,
    markup: markup,
    mount: mount,
    destroyAll: destroyAll,
    setPaused: setPaused,
    isPaused: isPaused
  };
})();

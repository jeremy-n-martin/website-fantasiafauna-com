/* Décors des dioramas — fichier distinct du manifeste.
 *
 * Clé = slug de FF_DATA. Ne pas attribuer une scène par ressemblance de nom.
 * family: feu | eau | spectral | sylvestre | mineral | celeste
 * variants[i] correspond à l’image i (Vue 1, Vue 2).
 * Ancrages {x,y} dans [0, 1], repère de l’image source (identique au viewBox SVG 0 0 100 100).
 *
 * Pour ajouter une composition : copier un bloc, régler family / palette / seed,
 * puis ground (et éventuellement light, eyes, wind, layout) pour chaque vue.
 */
window.FF_SCENES = {
  "dragon-rouge": {
    family: "feu",
    seed: 1409,
    catalog: { intensity: 0.55 },
    sheet: { intensity: 1 },
    palette: {
      bgTop: "#120806",
      bgBot: "#2a1008",
      rock: "#1a0d0a",
      crack: "#e08a3a",
      ember: "#ffb060",
      emberHot: "#ff6a2a",
      shadow: "#070304"
    },
    variants: [
      {
        layout: "coiled",
        ground: { x: 0.48, y: 0.86 }
      },
      {
        layout: "unfurled",
        ground: { x: 0.50, y: 0.85 },
        palette: {
          crack: "#f09848",
          emberHot: "#ff7838"
        }
      }
    ]
  },
  "aboleth": {
    family: "eau",
    seed: 2217,
    catalog: { intensity: 0.5 },
    sheet: { intensity: 1 },
    palette: {
      bgTop: "#163044",
      bgBot: "#071018",
      kelp: "#1c3a32",
      shaft: "#8fd0d8",
      bubble: "#d4f4f8",
      silt: "#0e2230",
      rock: "#142830"
    },
    variants: [
      {
        layout: "serpent",
        ground: { x: 0.50, y: 0.95 }
      },
      {
        layout: "hunched",
        ground: { x: 0.50, y: 0.92 },
        palette: {
          bgTop: "#1a2430",
          kelp: "#243a28",
          shaft: "#7ec0c8"
        }
      }
    ]
  },
  "fantome": {
    family: "spectral",
    seed: 3084,
    noShadow: true,
    catalog: { intensity: 0.5 },
    sheet: { intensity: 1 },
    palette: {
      bgTop: "#101816",
      bgBot: "#0a1010",
      mist: "#8ebfb0",
      filament: "#cfeee4",
      ruin: "#1a2422"
    },
    variants: [
      {
        layout: "tattered",
        ground: { x: 0.50, y: 0.90 },
        eyes: { x: 0.62, y: 0.18 }
      },
      {
        layout: "hooded",
        ground: { x: 0.50, y: 0.93 },
        eyes: { x: 0.55, y: 0.15 },
        palette: {
          bgTop: "#141018",
          bgBot: "#0c0a12",
          mist: "#7ec8c8",
          filament: "#99f2f2",
          ruin: "#2a2230"
        }
      }
    ]
  },
  "dryade": {
    family: "sylvestre",
    seed: 4175,
    catalog: { intensity: 0.5 },
    sheet: { intensity: 1 },
    palette: {
      bgTop: "#152014",
      bgBot: "#0c140c",
      leaf: "#2a4a22",
      grass: "#3d5c28",
      firefly: "#e8f08a",
      bark: "#1a2814",
      shadow: "#070a06"
    },
    variants: [
      {
        layout: "antlers",
        ground: { x: 0.55, y: 0.95 },
        light: { x: 0.75, y: 0.15 }
      },
      {
        layout: "orb",
        ground: { x: 0.50, y: 0.94 },
        light: { x: 0.78, y: 0.12 },
        palette: {
          firefly: "#9ec8f0",
          leaf: "#24503a"
        }
      }
    ]
  },
  "golem": {
    family: "mineral",
    seed: 5620,
    catalog: { intensity: 0.45 },
    sheet: { intensity: 1 },
    palette: {
      bgTop: "#161412",
      bgBot: "#0c0a09",
      rock: "#3a342c",
      slab: "#2a2620",
      crystal: "#c9aa69",
      glow: "#6ad4e0",
      dust: "#b8a890",
      shadow: "#050403"
    },
    variants: [
      {
        layout: "bands",
        ground: { x: 0.52, y: 0.95 },
        light: { x: 0.58, y: 0.35 },
        eyes: { x: 0.58, y: 0.12 }
      },
      {
        layout: "runes",
        ground: { x: 0.52, y: 0.92 },
        light: { x: 0.58, y: 0.35 },
        eyes: { x: 0.55, y: 0.15 }
      }
    ]
  },
  "aasimar": {
    family: "celeste",
    seed: 6803,
    catalog: { intensity: 0.5 },
    sheet: { intensity: 1 },
    palette: {
      bgTop: "#1a222c",
      bgBot: "#0c1016",
      cloud: "#3a4654",
      light: "#f0e0b0",
      streak: "#d8e4f0",
      shadow: "#080a0e"
    },
    variants: [
      {
        layout: "halo",
        wind: 1,
        ground: { x: 0.55, y: 0.95 },
        light: { x: 0.55, y: 0.10 }
      },
      {
        layout: "blade",
        wind: -1,
        ground: { x: 0.52, y: 0.94 },
        light: { x: 0.52, y: 0.12 },
        palette: {
          light: "#dce8f4",
          streak: "#b8e4ee"
        }
      }
    ]
  }
};

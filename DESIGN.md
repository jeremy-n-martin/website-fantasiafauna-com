---
version: alpha
name: Fantasia Fauna Orfèvrerie
description: Chrome UI for Fantasia Fauna — brass-bound cabinet that echoes combat socles; never the trading cards or campaign map.
colors:
  background: "#0A0908"
  surface: "#17120E"
  surface-raised: "#221A14"
  on-surface: "#F5E8D0"
  on-surface-muted: "#A8987C"
  outline: "#5A4020"
  outline-soft: "#2C2218"
  primary: "#C9AA69"
  primary-shine: "#F0E0B0"
  on-primary: "#1A1408"
  primary-deep: "#5A4020"
  secondary: "#5D7F6C"
  tertiary: "#C46A4A"
  ink: "#0A0908"
  parchment: "#F5E8D0"
typography:
  brand:
    fontFamily: Cormorant Garamond
    fontSize: 3.4rem
    fontWeight: "600"
    lineHeight: 1
    letterSpacing: -0.02em
  headline:
    fontFamily: Cormorant Garamond
    fontSize: 2.2rem
    fontWeight: "600"
    lineHeight: 1.1
    letterSpacing: -0.01em
  body:
    fontFamily: Source Sans 3
    fontSize: 1rem
    fontWeight: "400"
    lineHeight: 1.5
  label:
    fontFamily: Cinzel
    fontSize: 0.68rem
    fontWeight: "700"
    lineHeight: 1.2
    letterSpacing: 0.2em
rounded:
  sm: 6px
  md: 10px
  lg: 14px
  xl: 16px
spacing:
  xs: 6px
  sm: 10px
  md: 16px
  lg: 24px
  xl: 40px
  shell: 20px
  measure: 1680px
components:
  topbar:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.xl}"
    padding: 20px
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: 10px
  button-ghost-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
  input-field:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 12px
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.xl}"
    padding: 18px
  badge:
    backgroundColor: "{colors.outline-soft}"
    textColor: "{colors.on-surface-muted}"
    rounded: "{rounded.md}"
    padding: 8px
---

## Overview

A **brass-bound curiosity cabinet** in a warm stone atelier — leather desks edged with polished metal, the same orfévrerie language as the combat figure bases (socles). Not neon HUD, not purple glass — gilt rims, parchment ink, soft lamplight.

The product is Fantasia Fauna: French fantasy bestiary and combat prototype. The **chrome** (shell, navigation, filters, panels, lobby, combat table furniture) follows this metal-and-leather language. **Trading cards** and the **campaign map** keep their own treatments — this document does not restyle them.

## Colors

Single gilt system on warm dark stone, aligned with socle metals (`#c9aa69` / `#f0e0b0` / `#5a4020`).

- **Background** `{colors.background}`: near-black umber walls.
- **Surface / raised** `{colors.surface}` / `{colors.surface-raised}`: worn leather and desk wood with a slight metal sheen on edges.
- **Primary gilt** `{colors.primary}` + shine `{colors.primary-shine}`: interactive brass — active tabs, CTAs, eyebrows.
- **Primary deep** `{colors.primary-deep}`: pressed metal / rim shadow.
- **Moss** `{colors.secondary}`: calm nature / end-turn accent.
- **Clay** `{colors.tertiary}`: sparse combat / warning warmth.
- Atmosphere: soft amber lamp + muted teal spill at low opacity — never purple→indigo.

## Typography

- **Cormorant Garamond**: brand and section titles.
- **Cinzel**: small labels / eyebrows (matches combat stat lettering spirit).
- **Source Sans 3**: body UI and filters.

## Elevation & Depth

Metal-bound matte depth, not glassmorphism.

- Panels use a thin **conic brass rim** (padding-box / border-box) echoing socle rims.
- Inset highlights (`#fff2`) and deep inner shadow — like bevel + plate layers.
- Gilt glow only on **active** controls, thin and warm.

## Do's and Don'ts

- **Do** echo socle brass: conic rims, bevel insets, scarce shine.
- **Do** leave `.ff-card`, frames, card art, and campaign map (`.camp-map*`, `.world-map`, `.place`) untouched.
- **Don't** restyle `.cbt-socle*` / `.cbt-token` from this chrome pass.
- **Don't** introduce purple themes, Inter/Roboto, or dashboard clutter above the catalogue.

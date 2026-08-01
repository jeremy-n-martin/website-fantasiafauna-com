---
version: alpha
name: Fantasia Fauna Archive
description: Chrome UI for the Fantasia Fauna bestiary — never the trading cards themselves.
colors:
  background: "#0C0A09"
  surface: "#16110E"
  surface-raised: "#1E1814"
  on-surface: "#F3E6CF"
  on-surface-muted: "#B5A48A"
  outline: "#3F3428"
  outline-soft: "#2A221C"
  primary: "#D4AF5A"
  on-primary: "#1A1408"
  primary-deep: "#8A6A28"
  secondary: "#6E8F7A"
  tertiary: "#C46A4A"
  ink: "#0C0A09"
  parchment: "#F3E6CF"
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
    fontFamily: Source Sans 3
    fontSize: 0.72rem
    fontWeight: "700"
    lineHeight: 1.2
    letterSpacing: 0.22em
rounded:
  sm: 6px
  md: 10px
  lg: 14px
  xl: 18px
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

A **court naturalist's leather-bound bestiary ledger**, opened under brass lamplight in a stone scriptorium. Not a neon card-game HUD and not a purple glass dashboard — a warm archival interface that frames mythical creatures as catalogue specimens.

The product is Fantasia Fauna: a French fantasy bestiary and combat prototype. The **chrome** (shell, navigation, filters, panels, combat table furniture) follows this archive language. The **trading cards** are a separate artifact and must keep their own frame, foil, and art treatment — DESIGN.md does not restyle cards.

## Colors

A single-ink-plus-gilt system on warm dark parchment.

- **Background** `{colors.background}`: near-black umber void of the scriptorium walls — never cool purple-black.
- **Surface / Surface raised** `{colors.surface}` / `{colors.surface-raised}`: worn leather panels and desk wood; matte, slightly warmer than pure charcoal.
- **On-surface** `{colors.on-surface}`: aged parchment ink for readable text.
- **Muted** `{colors.on-surface-muted}`: captions, counts, secondary copy.
- **Primary gilt** `{colors.primary}`: the only interactive accent — brass leaf for active tabs, primary CTAs, eyebrows. Scarcity makes it mean "chosen."
- **Primary deep** `{colors.primary-deep}`: pressed / hover brass.
- **Secondary moss** `{colors.secondary}`: rare calm accent (ally / nature), never the main CTA.
- **Tertiary clay** `{colors.tertiary}`: sparse warning / enemy warmth — not decoration.
- **Outline** `{colors.outline}`: hairline brass-brown rules, not glowing neon edges.

Background atmosphere may use soft radial lamps of deep amber and muted teal *as distant stained-glass spill*, low opacity — never saturated purple→indigo washes.

## Typography

Dual voice: archival display + clear catalogue body.

- **Cormorant Garamond** `{typography.brand}` / `{typography.headline}`: the ledger title voice — literary, slightly condensed at large sizes. Brand name and section titles only.
- **Source Sans 3** `{typography.body}` / `{typography.label}`: the naturalist's hand for UI, filters, helper text. Labels are small caps-style tracking, not shouty weight stacks.

Do not use Inter, Roboto, Arial, or system-ui as the designed voice. Do not put display serif on dense filter rows.

## Layout

Editorial shell with generous breathing room around the specimen grid.

- Shell max width `{spacing.measure}`, padding `{spacing.shell}`.
- Topbar is one horizontal instrument strip: brand, tabs, counts.
- Bestiaire section head sits above tools (style palette, faction filters, search) — tools are catalogue controls, not marketing chips.
- Card gallery spacing belongs to the catalogue grid; chrome does not crowd specimen edges.
- Combat table is a green-felt desk metaphor framed like the archive panels — still matte leather + gilt, not arcade neon.

## Elevation & Depth

Matte desk depth, not glassmorphism.

- Level 0: `{colors.background}` with soft lamp radials.
- Level 1 panels: opaque `{colors.surface}` with `{colors.outline}` hairline — light shadow only (`0 18px 48px` near-black at low opacity).
- Level 2 topbar / raised tools: `{colors.surface-raised}`, same hairline, slightly stronger shadow.
- Interactive gilt glow is reserved for **active** controls (tab/filter), thin and warm — never a permanent multi-layer bloom on every surface.

## Shapes

Soft archival corners — `{rounded.md}` / `{rounded.xl}` for panels and inputs.

- Prefer rounded rectangles over pill stadiums for primary chrome buttons when possible; filters may stay compact but should read as catalogue tags, not candy pills.
- Avoid zero-radius broadsheet harshness and avoid oversized 24–32px candy radii on every control.

## Components

### Topbar
`{components.topbar}` — leather strip with brand eyebrow in gilt label type, Cormorant title, muted subtitle, ghost tabs, and count badges.

### Tabs & filters
Ghost buttons use outline soft; **active** state flips to solid gilt `{colors.primary}` on `{colors.on-primary}`. One accent driver only.

### Search & inputs
`{components.input-field}` — deep ink well, parchment text, gilt focus ring (1–2px), no neon cyan.

### Panels
`{components.panel}` wraps list and combat furniture. Panels frame content; they do not restyle `.ff-card` internals.

### Combat chrome
Towers, mana strip, mid buttons, and log inherit surface / outline / gilt language. Mini battlefield cards stay out of scope.

## Do's and Don'ts

- **Do** keep the scriptorium metaphor: brass, parchment, leather, lamplight.
- **Do** treat gilt as scarce interaction pigment.
- **Do** leave trading-card frames, rims, foils, art windows, and card typography untouched.
- **Don't** introduce purple-on-white, purple→indigo hero gradients, or default AI glassmorphism.
- **Don't** use Inter / Roboto / Arial as brand fonts.
- **Don't** plaster glow, emoji, or badge clusters on the first viewport chrome.
- **Don't** turn the bestiary into a dashboard of competing stats strips above the cards.
- **Don't** restyle `.ff-card`, `.card-rim`, `.card-art`, or frame-* card skins from this document.

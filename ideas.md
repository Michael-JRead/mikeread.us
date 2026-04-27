# Portfolio Hero — Design Brainstorm

## Three Design Approaches

<response>
<text>

### Idea 1: "Terminal Noir"
**Design Movement:** Brutalist Cyberpunk / Dark Terminal Aesthetic
**Core Principles:**
- Near-black backgrounds with deep charcoal gradients; no pure black
- Monospaced type for labels and metadata; bold grotesque for display names
- Red/crimson accent as the single danger-signal color (matching reference)
- Asymmetric left-heavy hero layout with floating portrait on the right

**Color Philosophy:**
- Background: #0d0d0d → #1a1a1a radial gradient (depth without flatness)
- Accent: #c0392b (crimson red) — signals authority, urgency, precision
- Text: #f0f0f0 primary, #888 secondary
- Emotional intent: controlled menace, professional authority

**Layout Paradigm:**
- Full-viewport hero with left-aligned text block occupying ~50% width
- Portrait in a glowing crimson-bordered circle on the right (~45% width)
- Navigation bar: minimal, spaced, monospaced initials logo on left

**Signature Elements:**
- Glowing red circular border around headshot (box-shadow radial)
- Monospaced "HI, MY NAME IS" label above the large display name
- Subtle scanline texture overlay on hero background

**Interaction Philosophy:**
- Nav links have a subtle underline-slide hover effect
- Buttons have a slight border-glow pulse on hover
- Portrait circle border brightens on hover

**Animation:**
- Fade-in stagger: label → name → title → bio → buttons (50ms delay each)
- Portrait scales in from 0.95 to 1.0 with fade

**Typography System:**
- Display: Space Grotesk 700 (name, headings)
- Label: Space Mono 400 (small caps labels)
- Body: Inter 400 (bio text)
- Hierarchy: 72px name / 28px title / 16px body

</text>
<probability>0.08</probability>
</response>

<response>
<text>

### Idea 2: "Obsidian Grid"
**Design Movement:** Swiss Modernism meets Dark Mode
**Core Principles:**
- Strict typographic grid; everything aligns to an 8px baseline
- Deep navy-black background with subtle blue-tinted gradients
- Single accent: electric blue (#3b82f6)
- Clean geometric forms; no decorative elements beyond the grid

**Color Philosophy:**
- Background: #080c14 → #0f1623
- Accent: #3b82f6 electric blue
- Emotional intent: precision, intelligence, trustworthiness

**Layout Paradigm:**
- Two-column split: 55% left content / 45% right portrait
- Rigid vertical rhythm, generous line-height

**Signature Elements:**
- Thin horizontal rule separating nav from hero
- Blue glowing ring around portrait
- Monospaced role tag with blinking cursor

**Interaction Philosophy:**
- Hover states reveal blue underlines
- Buttons invert on hover (fill ↔ outline)

**Animation:**
- Typewriter effect on the role title
- Slide-up entrance for text blocks

**Typography System:**
- Display: DM Sans 800
- Body: DM Sans 400
- Mono: JetBrains Mono for labels

</text>
<probability>0.07</probability>
</response>

<response>
<text>

### Idea 3: "Ember Dark" (SELECTED)
**Design Movement:** Dark Editorial / High-Contrast Noir
**Core Principles:**
- True deep black (#0a0a0a) background with warm ember-red glow accents
- Space Grotesk for display, Space Mono for technical labels
- Asymmetric hero: large left text block, right portrait with ember glow ring
- Minimal nav with letter-spaced small-caps links

**Color Philosophy:**
- Background: #0a0a0a with subtle radial warm glow behind portrait
- Accent: #e63946 (ember red) — matches reference image crimson
- Muted text: #9ca3af
- Emotional intent: dark authority, technical precision, bold identity

**Layout Paradigm:**
- Full-bleed hero, left-aligned content starting at ~10% from left
- Portrait right-aligned with glowing ember ring
- Nav: transparent, borderless, letter-spaced links

**Signature Elements:**
- Ember-glow radial behind portrait (red → transparent)
- Monospaced small-caps "HI, MY NAME IS" label
- Crimson-filled "Get in Touch" button; ghost buttons for LinkedIn/GitHub

**Interaction Philosophy:**
- Nav links: letter-spacing expands on hover
- Buttons: subtle scale + glow on hover
- Portrait: ring brightness pulses on hover

**Animation:**
- Staggered fade-up for hero text elements
- Portrait slides in from right with fade
- Subtle particle/noise texture on background

**Typography System:**
- Display: Space Grotesk 700/800 (name)
- Labels: Space Mono 400 (small caps)
- Body: Inter 400 (bio)
- Hierarchy: 80px name / 30px title / 16px body

</text>
<probability>0.09</probability>
</response>

## Selected Approach: **"Ember Dark"**
Deep black background, ember-red accents, Space Grotesk display type, asymmetric left-text / right-portrait layout.

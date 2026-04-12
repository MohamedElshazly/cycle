# Design System Strategy: The Breathing Page

## 1. Overview & Creative North Star
This design system is anchored by the Creative North Star: **"The Breathing Page."** 

We are not building a utility; we are crafting a digital sanctuary for self-awareness. To move beyond the "app-like" feel of standard UI, we embrace the elegance of high-end editorial design. This means rejecting the rigid, boxed-in constraints of traditional grids in favor of **intentional asymmetry** and **generous whitespace**. 

The goal is a "Stillness" that feels expensive and deliberate. We achieve this by treating the screen as a singular piece of tactile paper where elements are not just "placed," but "settled." We prioritize a "High-End Editorial" experience through sophisticated tonal layering, allowing the user's thoughts to be the only high-contrast element.

---

## 2. Colors & Tonal Logic
The palette is a study in muted depth. By removing high-contrast indicators like red or green, we force the UI to communicate through nuance.

### Dark Mode (Core Tones)
- **Primary Bg (`surface`):** `#0F1117` – The deep foundation.
- **Secondary Bg (`surface-container`):** `#161B27` – For primary content blocks.
- **Tertiary Bg (`surface-container-high`):** `#1E2535` – For elevated interaction states.
- **Accent (`primary`):** `#B08A9E` (Dusty Mauve) – Our singular point of focus.

### The "No-Line" Rule
Standard UI relies on borders to separate ideas. This design system **prohibits 1px solid borders** for sectioning. Boundaries must be defined solely through background color shifts. 
- *Implementation:* Place a `surface-container` card directly onto a `surface` background. The 1%–2% shift in value is enough for the human eye to perceive a boundary without creating visual "noise."

### The "Glass & Gradient" Rule
To add a "signature" soul to the interface:
- **Floating Elements:** Use `backdrop-blur` (20px+) with a semi-transparent version of the `surface-container` color (60% opacity). This ensures the UI feels integrated and ethereal rather than "stuck on."
- **Soft Gradients:** Apply a subtle linear gradient to main Action Buttons—transitioning from the Accent `#B08A9E` to a slightly deeper tone—to provide a professional, three-dimensional polish that flat hex codes cannot achieve.

---

## 3. Typography: The Editorial Voice
We use **Plus Jakarta Sans** as our sole typeface. Its modern, geometric clarity serves as the quiet anchor of the system.

- **Display/Heading 1 (28px, 600 weight):** Used for primary entry points. Increase letter-spacing to `-0.02em` for a tighter, premium feel.
- **Title/Heading 2 (20px, 600 weight):** Used for section headers. Always provide a minimum of 40px top-margin to ensure the text "breathes."
- **Body (15px, 400 weight):** Set to a **1.6 line-height**. This wide leading is non-negotiable; it transforms a block of text into a journal entry.
- **Label (12px, 500 weight):** Use for metadata. Decrease opacity to 60% (`secondary text`) to keep the hierarchy clear.

---

## 4. Elevation & Depth
In this design system, height is not achieved through shadows, but through **Tonal Layering**.

### The Layering Principle
Think of the UI as stacked sheets of fine paper. 
- **Lowest:** `surface-container-low` (The background canvas).
- **Elevated:** `surface-container` (The main content card).
- **Highest:** `surface-container-highest` (Active/Hovered states).

### Ambient Shadows
If a "floating" effect is required for a modal or a primary input, use an **Ambient Shadow**:
- `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);`
The shadow must be extra-diffused and low-opacity. Never use a pure black shadow; tint it with the `on-surface` color to mimic natural, atmospheric light.

### The "Ghost Border" Fallback
If a border is required for accessibility, it must be a "Ghost Border." Use the `border` token (`#252D3D` for dark, `#E2E4EC` for light) at **20% opacity**. It should be felt, not seen.

---

## 5. Components

### Cards & Lists
- **The Divider Rule:** Forbid the use of horizontal divider lines. 
- **Separation:** Content must be separated by vertical whitespace (32px or 48px from the spacing scale) or a subtle background shift between the card and the page background. 
- **Radius:** 12px for cards; 8px for inner elements to create "nested harmony."

### Buttons
- **Primary:** Background `#B08A9E`, 8px radius. Text should be high-contrast (`on-primary`). 
- **Secondary (Ghost):** No background, no border. Use the Accent color for text. This keeps the layout light and minimizes cognitive load.

### Input Fields
- **Editorial Style:** Inputs should not look like boxes. They should look like a "line for thought." Use a transparent background with a 1px "Ghost Border" at the bottom only, or a very subtle `surface-container-lowest` fill.
- **States:** On focus, the bottom border should transition to the Accent color (`#B08A9E`) with a soft 2px glow.

### Additional Signature Component: "The Pulse Indicator"
For self-awareness tracking, avoid graphs. Use a singular, soft-glowing Mauve circle that expands or contracts based on intensity. This keeps the aesthetic "journal-like" and intimate.

---

## 6. Do’s and Don’ts

### Do
- **Embrace Asymmetry:** Align headings to the left and allow content to trail off into whitespace.
- **Prioritize Margin over Border:** If elements feel too close, add 16px of space instead of a line.
- **Use "Tinted" Neutrals:** Ensure your "Secondary Text" always has a hint of the background hue to maintain a cohesive color temperature.

### Don’t
- **No Red or Green:** Even for errors or success. Use the Accent color for "Success" and a desaturated version of the background for "Error" to maintain the "Quiet" theme.
- **No Decorative Icons:** Icons must be functional only (e.g., a simple chevron or a plus sign). Never use icons for decoration.
- **No Standard Grids:** Avoid three-column layouts. Stick to a single-column (max-width 720px) to mimic the experience of reading a physical book or journal.

---

*Director's Final Note: Remember, every pixel should feel like a choice. If an element doesn't contribute to "Stillness," it shouldn't be there.*
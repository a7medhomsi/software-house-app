# CLAUDE.md — Frontend Website Rules

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Project Overview — Software House
- **File:** `d:/Software House/index.html` — HTML shell linking to `assets/css/styles.css` and `assets/js/main.js`
- **Company:** Software House — targeting MENA region clients
- **No Tailwind in use** — all styles are hand-written vanilla CSS in `assets/css/styles.css`

### Page Sections (in order)
| Section | ID/Class | Notes |
|---|---|---|
| Hero | `.hero` | Floating elliptical shapes animation, badge, headline, CTA buttons |
| Marquee | `.marquee-section` | Scrolling client logos strip |
| Services | `#services` | 5 cards in 3+2 grid layout, spotlight border-glow effect |
| Our Main Projects header | inline `<section>` | Centered label + title + subtitle only |
| Case Study 1 | `#showcase .case-study` | Image left, content right (Integrations Hub / OpenWater) |
| Case Study 2 | `.case-study` (2nd) | Content left, image right (KUN / KUN Sports) |
| Process | `.process` | 4-step horizontal layout |
| Stats | `.stats` | Numbers / MENA track record |
| Clients | `.clients` | Client logos grid |
| CTA / Contact | `.cta` | Get in touch section |

### Key Implemented Patterns

**Floating hero shapes (vanilla CSS)**
- `.elegant-shape` wrapper uses `@keyframes shapeEnter` with `--shape-delay` and `--shape-rotate` CSS vars
- Inner `.elegant-shape-inner` uses `@keyframes shapeFloat` for the perpetual up/down float
- Never use `transition-all` — only animate `transform` and `opacity`

**Service card spotlight border-glow**
- Cards use `--mouse-x` / `--mouse-y` CSS custom properties (default `-9999px` = hidden)
- `::before` pseudo-element draws the gradient using `mask-composite: exclude` + `padding: 1px` technique (border-only glow, not fill)
- JS uses per-card `pointermove` / `pointerleave` listeners with `getBoundingClientRect()` for card-relative coords
- Do NOT use `document.addEventListener('pointermove')` globally — that makes ALL cards glow at once
- Do NOT use `background-attachment: fixed` — causes viewport vs card coordinate mismatch

**Services grid (uniform 3-column layout)**
- `grid-template-columns: repeat(3, 1fr)` with `gap: 28px`, `max-width: 920px`, centered with `margin: 0 auto`
- Header centered: `.services-header { max-width: 760px; margin: 0 auto; text-align: center; }`
- Subtitle also centered: `.services-header .section-subtitle { margin: 0 auto; }`
- Cards use `padding: 54px 40px 58px` with `border-radius: 20px`

**Case study layout**
- CSS grid: `grid-template-columns: 1fr 1fr` with `gap: 20px`, `padding: 80px 184px`
- Case 1 (image left): `<div class="case-image-wrap">` first, then `<div class="case-content">`
- Case 2 (content left / KUN): `<div class="case-content">` first — use `justify-self: end` + `max-width: 400px` to push content toward image
- Images use `align-self: stretch; height: 100%; min-height: 360px` to match content column height
- Country flags: use `<img src="https://flagcdn.com/XX.svg" class="case-flag">` — CSS class handles sizing/shape (Windows Chrome doesn't render flag emojis)
- `.case-success` key success point card: `width: fit-content` — do not stretch to full column width
- "Our Main Projects" header is a standalone `<section>` with `text-align: center` between services and case studies

**Section label centering**
- `.section-label` uses `display: inline-flex` — add `justify-content: center` inline when centering is needed (or update base class)
- Process and Stats headers use `.process-header` / `.stats-header` with `max-width` + `margin: 0 auto` + `text-align: center`

**JS animation stagger — per-section reset**
- Use separate `querySelectorAll` per selector so each section resets the delay index to 0
- Pattern: `['.service-card', '.process-step', '.stat-item', '.client-logo'].forEach(sel => querySelectorAll(sel).forEach((el, i) => ...))`
- Do NOT combine selectors in one `querySelectorAll` — that causes accumulated delays across sections

**Navbar scroll state guard**
- Track `navScrolled` boolean to avoid redundant style assignments on every scroll event
- Only update styles on state transition (scrolled ↔ not-scrolled)

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `node serve.mjs` (serves the project root at `http://localhost:3000`)
- `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.

## Context Mode (Token Saving)
Always prefer `context-mode` MCP tools over standard tools when dealing with large data. These tools sandbox output so it never bloats the context window.

### Tool Substitution Rules
| Instead of | Use | When |
|---|---|---|
| `Bash` | `ctx_execute` | Command output is large (logs, build output, file listings, npm installs) |
| `Read` | `ctx_execute_file` | File is large (>100 lines) and you only need specific info from it |
| `WebFetch` | `ctx_fetch_and_index` | Fetching external docs, API references, or any URL for research |
| Multiple `Bash` calls | `ctx_batch_execute` | Running several commands + searching results in one codebase analysis pass |

### When to use ctx_search
- After `ctx_fetch_and_index` or `ctx_index`, use `ctx_search` to query the indexed content instead of re-fetching.

### Always use standard tools for:
- Short Bash commands where full output is needed and small (e.g. `git status`, `node -v`)
- Reading small known files directly with `Read` (configs, short source files under ~100 lines)

### Session hygiene
- Run `ctx_stats` at the end of long sessions to confirm token savings.
- Run `ctx_doctor` if context-mode tools return errors.

## Screenshot Workflow
- Puppeteer Chrome path: `C:/Users/97155/.cache/puppeteer/chrome/win64-146.0.7680.153/chrome-win64/chrome.exe`
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots are saved automatically to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:3000 label` → saves as `screenshot-N-label.png`
- `screenshot.mjs` lives in the project root. Use it as-is.
- After screenshotting, read the PNG from `temporary screenshots/` with the Read tool — Claude can see and analyze the image directly.
- For section-specific screenshots, use Puppeteer inline with `page.$('.selector').then(el => el.boundingBox())` and `clip` option.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Output Defaults
- Single `index.html` file, all styles inline, no build step, no Tailwind CDN
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Brand Assets
- Always check the `brand_assests/` folder (note spelling) before designing.
- Contains `Brand Guidelines.jpg` — use for exact colors, fonts, logo usage rules.
- Do not invent brand colors; derive everything from the guidelines.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Use subtle color-tinted semi-transparent overlays for depth — do NOT add SVG noise/grain filters (causes visible graininess on components).
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color
- Do not remove the spotlight border-glow from service cards — the user explicitly wants it kept
- Do NOT load Tailwind CDN — all styles are hand-written vanilla CSS, no Tailwind classes are used
- Do NOT use a single combined `querySelectorAll` for animation stagger across multiple sections — reset index per selector
- Do NOT use `background-attachment: fixed` on card gradient effects — causes viewport vs card coordinate mismatch

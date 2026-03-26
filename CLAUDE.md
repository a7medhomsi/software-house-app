# CLAUDE.md — Frontend Website Rules

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Project Overview — Software House
- **Files:** `index.html` → `assets/css/styles.css` + `assets/js/main.js`
- **Company:** Software House — software engineering startup targeting MENA region
- **No Tailwind** — all styles are hand-written vanilla CSS

### Page Sections (in order)
| Section | ID/Class | Notes |
|---|---|---|
| Hero | `.hero` | Floating elliptical shapes animation, badge, headline, CTA buttons |
| Marquee | `.marquee-section` | Scrolling client logos strip |
| Services | `#services` | 6 cards in 2×3 grid, spotlight border-glow effect |
| Our Main Projects header | inline `<section>` | Centered label + title + subtitle only |
| Case Study 1 — TrackFlow | `#showcase .case-study` | Image left (`Vehicle-and-Fleet-Management-System.webp`), content right |
| Case Study 2 — Hadir | `.case-study` (2nd) | Content left, image right (`employee_management_system_dashboard_with_attendance_calculation_slide01.jpg`) |
| Process | `.process` | 4-step horizontal layout |
| Stats | `.stats` | Numbers / MENA track record |
| Clients | `.clients` | Client logos grid |
| CTA / Contact | `.cta` | Get in touch section |

### Key Implemented Patterns

**Floating hero shapes (vanilla CSS)**
- `.elegant-shape` uses `@keyframes shapeEnter` with `--shape-delay` / `--shape-rotate` CSS vars
- Inner `.elegant-shape-inner` uses `@keyframes shapeFloat` for perpetual float
- Only animate `transform` and `opacity` — never `transition-all`

**Service card spotlight border-glow**
- Cards use `--mouse-x` / `--mouse-y` CSS vars (default `-9999px` = hidden)
- `::before` pseudo-element uses `mask-composite: exclude` + `padding: 1px` (border-only glow)
- JS uses per-card `pointermove` / `pointerleave` + `getBoundingClientRect()` for card-relative coords
- Do NOT use global `document.addEventListener('pointermove')` — makes all cards glow at once
- Do NOT use `background-attachment: fixed` — causes viewport vs card coordinate mismatch

**Services grid (6 cards, uniform 3-column)**
- `grid-template-columns: repeat(3, 1fr)` with `gap: 28px`, `max-width: 920px`, centered
- Header + subtitle centered: `.services-header { max-width: 760px; margin: 0 auto; text-align: center; }`
- Cards: `padding: 54px 40px 58px`, `border-radius: 20px`

**Case study layout**
- Grid: `grid-template-columns: minmax(300px, 480px) minmax(300px, 480px)` with `gap: 60px`, `justify-content: center`, `padding: 80px 184px`
- Case 1 (TrackFlow): `<div class="case-image-wrap">` first, then `<div class="case-content">`
- Case 2 (Hadir): `<div class="case-content">` first — `justify-self: end` + `max-width: 400px` pushes content toward image
- All `.case-content` has `max-width: 480px`
- Images: `align-self: center`, `height: auto`, `max-height: 420px`, `object-fit: cover`, `background: #141414`
- No arrow buttons on images
- Country flags: `<img src="https://flagcdn.com/XX.svg" class="case-flag">` (Windows Chrome doesn't render flag emojis)
- `.case-success` key success card stretches to full content width (no `width: fit-content`)
- "Our Main Projects" header is a standalone `<section>` centered between services and case studies

**Section label centering**
- `.section-label` uses `display: inline-flex` — add `justify-content: center` inline when centering is needed
- Process and Stats headers: `.process-header` / `.stats-header` with `max-width` + `margin: 0 auto` + `text-align: center`

**JS animation stagger — per-section reset**
- Separate `querySelectorAll` per selector — each section resets delay index to 0
- Do NOT combine selectors in one `querySelectorAll` — causes accumulated delays across sections

**Navbar scroll state guard**
- `navScrolled` boolean tracks state — only update styles on transition, not every scroll event

## Screenshot Workflow
- Puppeteer Chrome: `C:/Users/97155/.cache/puppeteer/chrome/win64-146.0.7680.153/chrome-win64/chrome.exe`
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots saved to `./temporary screenshots/screenshot-N.png` (auto-incremented)
- **Viewport: 1920×1080** — matches the user's actual screen. Do not use 1440px.
- For section-specific screenshots use `screenshot-section.mjs` with `deviceScaleFactor: 1`
- After screenshotting, read the PNG with the Read tool to analyze it directly

## Local Server
- Start: `node serve.mjs` (serves at `http://localhost:3000`)
- If already running, do not start a second instance

## Context Mode (Token Saving)
| Instead of | Use | When |
|---|---|---|
| `Bash` | `ctx_execute` | Large command output |
| `Read` | `ctx_execute_file` | File >100 lines, need specific info |
| `WebFetch` | `ctx_fetch_and_index` | External docs/URLs |

## Hard Rules
- Do not use `transition-all`
- Do not load Tailwind CDN
- Do not remove the spotlight border-glow from service cards
- Do NOT use a single combined `querySelectorAll` for animation stagger — reset index per selector
- Do NOT use `background-attachment: fixed` on card gradients
- Do not add sections or features not requested
- Do not "improve" a reference design — match it exactly

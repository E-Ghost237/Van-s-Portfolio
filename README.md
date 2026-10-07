# Van Nisterooyl — Portfolio

A modern, animation-rich developer portfolio built with **vanilla HTML + CSS + JavaScript** — no frameworks, no build step, no dependencies. Deployed as static files.

## ✨ Design & features

- **Terminal-style preloader** with a typed boot sequence (shows once per session)
- **Interactive particle-network canvas** in the hero that reacts to the cursor
- **Typing animation** cycling through roles (Full-Stack Developer, Cloud & DevOps, AI-Augmented Engineer…)
- **Live terminal** in the About section that types out `whoami`, `cat stack.txt`, `./ship.sh`
- **Animated tech marquee** with 16 brand-colored technology icons
- **Skills bento grid** — Cloud & DevOps, AI-Augmented Development (the superpower card), Frontend, Backend, Mobile — with hover-glowing tech chips
- **Project cards** with 3D tilt, shine sweep and live/code links
- **Magnetic buttons**, cursor glow, scroll-progress bar, animated counters, scroll reveals
- Fully **responsive** (desktop → mobile), **reduced-motion friendly**, **no-JS fallbacks**, keyboard accessible (skip link, focus rings, ARIA labels)
- SEO: meta description, Open Graph / Twitter cards, JSON-LD person schema, SVG favicon

## 🧱 Structure

```
index.html          # single page — all sections
css/style.css       # design system + all styling
js/main.js          # all interactions & animations (zero dependencies)
assets/
  favicon.svg       # gradient "V_" mark
  img/              # profile, project covers, og banner
```

## 🖼️ Add a new project

Copy an `<article class="project">` block in `index.html`, swap the image, text, tags and links. Even-numbered projects automatically flip to image-on-right. Drop the cover image in `assets/img/`.

## 🔗 Links to personalize

Search for `TODO` in `index.html` — the LinkedIn and X/Twitter icons currently point to `#`.

## 🚀 Run locally

Just open `index.html` — or serve it:

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

## 📦 Deployment

Pushing to `main` triggers the GitHub Action (`.github/workflows/deploy.yml`) which pulls the repo on the VPS and serves it via Nginx. Nothing to build.

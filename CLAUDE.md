# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands must be run from the `gitfolio/` directory:

```bash
npm run dev      # Dev server at localhost:3000
npm run build    # Static export to /out (required for GitHub Pages)
npm run lint     # ESLint check
```

## Architecture

### Single-file content model
All portfolio content and every UI component live in **`gitfolio/app/page.tsx`** — intentionally flat for beginner accessibility. There are no separate component files. Components (`ProjectCard`, `SocialLink`, `ArrowRightIcon`, `ArrowUpRightIcon`) are defined at the bottom of that file.

### Dual basePath pattern
The project is deployed as a static export to GitHub Pages. Two places must stay in sync when the repo name changes:

```tsx
// gitfolio/app/page.tsx — controls image src prefixes
const basePath = process.env.NODE_ENV === "production" ? "/gfbs3-portfolio-demo" : "";

// gitfolio/next.config.ts — controls Next.js routing
basePath: isProd ? "/gfbs3-portfolio-demo" : "",
```

### Static export
`next.config.ts` sets `output: "export"` and `images: { unoptimized: true }`. The build produces a static site in `/out` — no server-side features (API routes, SSR, ISR) are available.

### GitHub Pages deployment
`.github/workflows/deploy.yml` inside `gitfolio/` triggers on push to `main` and deploys the `/out` folder automatically.

## Design system

Cyberpunk / retro-futuristic aesthetic. Maintain these conventions:

| Color | Use | Example class |
|---|---|---|
| Cyan | Links, accents, borders | `text-cyan-400`, `border-cyan-500/30` |
| Fuchsia | Highlights, emphasis, CTAs | `text-fuchsia-400`, `bg-fuchsia-600` |
| Yellow/Orange | Primary call-to-action | `text-yellow-400` |
| Purple | Gradients | `text-purple-400` |

Glow effects use arbitrary Tailwind shadows:
```tsx
// Text glow
className="drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
// Hover box glow
className="hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
```

`ProjectCard` titles use `UPPERCASE_SNAKE_CASE`. Tags are uppercase strings. The `color` prop must be one of `"cyan" | "fuchsia" | "purple" | "yellow"`.

## Common tasks

- **Content edits** → `gitfolio/app/page.tsx` only
- **Add an image** → place in `gitfolio/public/`, reference as `` `${basePath}/filename` ``
- **Add a nav-linked section** → give it an `id` matching the nav `href` (e.g. `id="work"`, `href="#work"`)
- **Deployment issues** → verify the repo name matches `basePath` in both `page.tsx` and `next.config.ts`

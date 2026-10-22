# Canopy Forge Lab

AI-assisted real-time 3D ARPG workflow experiment. Desktop web demo. **Current character is only a rough placeholder; premium character asset pipeline is a later milestone.**

## Local development
Requirements: recent Node.js LTS, npm, Chrome or Edge with WebGL2.

```bash
npm install
npm run dev
```

Visit the URL printed by Vite (usually http://localhost:5173).

```bash
npm run build
npm run preview
```

## Controls
WASD / arrows: move; Shift: run; Space: jump; mouse left/J: attack.

## Codex
Read `AGENTS.md` and `docs/MASTER_PLAN.md`. Work through milestones sequentially; update `docs/PROGRESS.md` and `docs/DECISIONS.md` before commits. Codex can operate locally; connect a GitHub repo for durable versioned history.

## Repository initialization
```bash
git init
git add .
git commit -m "chore: bootstrap canopy forge web 3d lab"
# Create a private repository called canopy-forge-lab in GitHub UI, then:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/canopy-forge-lab.git
git push -u origin main
```

> Do not commit copyrighted 3D assets without permission. The demo only uses procedural geometry.

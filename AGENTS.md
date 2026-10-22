# Instructions for Codex — Canopy Forge Lab

## Mission
Develop a REAL-TIME, INTERACTIVE, browser-based 3D ARPG prototype with Diablo/PoE-style angled camera, nighttime tropical jungle, one controllable premium-quality humanoid hero, and one monster. This is an AI game development workflow evaluation, not a commercial game.

## Priorities
1. Playable and verifiable functionality before visual polish.
2. Character visual quality is the main later-stage evaluation target.
3. Keep browser download / runtime costs modest: five showcase trees, limited foliage, no giant landscapes, lazy loading and compressed GLBs.
4. TypeScript + Three.js + Vite; Blender only for asset preparation; NO Unreal Engine for v1.
5. Absolutely no prerendered video masquerading as 3D interaction.

## Working rules
- Read `docs/MASTER_PLAN.md`, `docs/DECISIONS.md`, and `docs/PROGRESS.md` at start of each task.
- Complete ONE milestone at a time, run `npm run build`, report test evidence and blockers.
- Update `docs/PROGRESS.md`, `docs/DECISIONS.md` and asset provenance before each commit.
- Don't mark any feature as verified unless it was actually tested; rendering/controls require browser testing.
- Do not introduce a backend, authentication, multiplayer, database or monetization.
- Don't commit unlicensed or unknown-license character meshes, textures or sounds.
- Never silently swap the high-quality real character acceptance target for a primitive placeholder.
- Keep code modular as features mature; avoid giant all-in-one files after bootstrap.
- Git commit per accepted milestone; branch + PR optional. Never commit node_modules or huge unoptimized models.
- When GUI or GPU is not available, state that manual local validation remains necessary.

## Acceptance criteria for final visual milestone
- Authentic independent third-person control: walk, run, jump and sword attack.
- Real skinned mesh humanoid, proper animations, transitions, and attached sword.
- Monster receives hit response, HP decrements, eventually dies or respawns.
- At least five trees and small amount of vegetation, moonlit rain forest; FPS overlay and network transfer report.
- Tested in recent Chrome desktop at ~1080p, with documented FPS observed (never invented).

## Immediate next step
Current `src/main.ts` is a *primitive placeholder test harness*, not a polished or final game. First refactor it into camera/input/character/combat/world modules, then validate controls and resolve camera-relative directional motion. Follow phases in MASTER_PLAN.md.

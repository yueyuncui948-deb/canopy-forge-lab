# Canopy Forge Lab — Master Plan

## Goal
Use Codex to iteratively build a real, browser-playable 3D ARPG scene. Camera: angled follow-cam inspired by Path of Exile, not a first-person view. Theme: compact nighttime Amazon-inspired humid jungle. Character: polished human, sword attacks, agile jumping/running, combat against one creature.

## Technical decision
- TypeScript + Vite + Three.js, desktop-first, WebGL2 baseline.
- Asset authoring may use Blender and Blender Python/MCP. Export glTF/GLB, optimize assets before delivery.
- No Unreal Engine / backend in the first version.
- Keep possibility to migrate later; 3D assets in neutral GLB format.

## MVP visual budget (targets, measure later)
- Terrain 30–40 meters, 5 main trees, sparse foliage/rocks.
- Aim at 60fps desktop on a mid-range GPU; record measured 1% lows/average and device info; do not promise actual FPS.
- Aim first-load compressed payload < 25MB and document actual size; increase only with justification if hero quality requires it.
- One premium hero (rigged GLB), one enemy, sword, three to six essential animation clips.
- Asset license manifest required.

## Phases
### P0 Project foundation
Repository, lint/typecheck/build, README, AGENTS.md, milestone docs, static deployment instructions.
Acceptance: `npm install` and `npm run build` pass; `npm run dev` launches.
### P1 Interaction proof (placeholder visuals)
Angled-follow camera; keyboard movement; sprint, jump, attack; simple target enemy and HP; few trees. Validate browser interaction.
Acceptance: no prerecorded animation/video; controls responsive and actual hit/HP change.
### P2 Systems quality
Split scene/camera/control/physics/combat, correct delta time, jumping and grounded checks, attack cooldown, hit detection based on direction and attack timing, enemy feedback, simple debug overlay and regression tests.
Acceptance: movement smooth and repeatable, no attack spam bug, collisions stable.
### P3 Premium character
Find a LEGALLY licensed, rigged realistic human asset; wire idle/walk/run/jump/attack/hit and correct transitions; sword connected to hand bone. Document sourcing, commercial restrictions and credits.
Acceptance: visually credible character with no sliding feet or visibly broken joints during normal movement.
### P4 Night jungle artistry
5 trees, a few vines, stones, damp ground using PBR roughness variation, fog, moonlight, contact shadows and restrained vegetation. Create composition emphasizing hero. Optimize texture, shadow, LOD and draw calls.
Acceptance: playable atmosphere, not just background screenshot.
### P5 Monster combat
Creature skinned model, chase/attack/hit/death, proximity checks, hero health, cooldowns and reaction VFX. Optional simple blade trails. No complex AI.
Acceptance: repeatable encounter from spawn to enemy death/respawn.
### P6 Profiling and visual polish
Record GPU / browser / dimensions / average FPS / asset bytes, compare quality before/after, remove stutters and memory leaks, improve animation blending, display user-selectable graphics presets.
Acceptance: publish measured facts and a short screen recording with test instructions.
### P7 Review
Document Codex prompts used, tool calls where available, change rationale, commits, failure cases, manual intervention required, and reproducibility steps.
Acceptance: complete experiment report answering what AI completed autonomously.

## Definition of done per task
- Code committed (once GitHub connection/configuration exists).
- Build/typecheck passes.
- Browser interaction tested or marked UNVERIFIED.
- docs/PROGRESS.md updated with files changed, results, blockers, and next task.
- docs/DECISIONS.md updated for architecture choices.
- docs/ASSETS.md updated for downloaded assets.

## Codex start prompt
Read AGENTS.md and docs/*.md. Continue from first unverified milestone. Do NOT skip to realistic character before stabilizing interaction. Make the smallest testable change, run available checks, update progress and decisions. Report exactly which checks ran and what requires local visual inspection.

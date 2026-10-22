# Architecture Decision Log

## ADR-001 — Web first
Decision: Desktop browser via TypeScript/Three.js/Vite before Unreal Engine.
Reason: Quick iteration for Codex and direct evaluation of interactive realtime graphics.
Trade-off: Lower practical visual ceiling than high-end native Unreal projects, particularly for sophisticated lighting.

## ADR-002 — Placeholder first
Decision: Use primitive mock humanoid for P1; replace with high-quality licensed rigged GLB in P3.
Reason: Separate technical success in movement/combat from model creation and art polish. Placeholder is not accepted as final art.

## ADR-003 — Git as memory, not entire conversation
Decision: Keep immutable commits and explicit `AGENTS.md`, `MASTER_PLAN.md`, `PROGRESS.md`, `DECISIONS.md`.
Reason: Codex sessions may not share complete context. GitHub stores checked-in artifacts, not an automatic complete memory of assistant reasoning.

export interface GameSnapshot {
  time: number;
  frame: number;
  hero: { x: number; y: number; z: number; hp: number };
  monster: { x: number; y: number; z: number; hp: number; visible: boolean; respawnAt: number | null };
  attackCooldown: number;
  heroAction: string | null;
  heroDead: boolean;
  showcase: boolean;
  resources: { geometries: number; textures: number };
  character: { id: string; loaded: boolean; skinnedMeshes: number; bones: number; triangles: number; animation: string; clip: string; animationTime: number; swordAttachedTo: string; hand: { x: number; y: number; z: number }; upperArm: number[]; forward: { x: number; z: number }; rootYaw: number };
  camera: { distance: number; desiredDistance: number; minDistance: number; maxDistance: number; azimuth: number };
}

// 明確開啟 ?debug=1 才提供唯讀快照；不提供改位置、扣血或推進時間的方法。
export function installDebugSnapshot(read: () => GameSnapshot): void {
  if (new URLSearchParams(location.search).get('debug') !== '1') return;
  Object.defineProperty(window, '__CANOPY_DEBUG__', { get: read, configurable: true });
}

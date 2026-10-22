import * as THREE from 'three';
import { DEFAULT_DISTANCE, MIN_DISTANCE, MAX_DISTANCE, zoomDistance } from './zoom';

export function createFollowCamera(camera: THREE.PerspectiveCamera, canvas: HTMLCanvasElement) {
  let desiredDistance = DEFAULT_DISTANCE;
  let distance = desiredDistance;
  let portraitDistance = MIN_DISTANCE;
  let focusHeight = 1.9;
  let azimuth = 0.5;
  let elevationOffset = 0;
  let drag: { x: number; y: number } | null = null;
  const target = new THREE.Vector3();
  const offset = new THREE.Vector3();

  canvas.addEventListener('wheel', event => {
    event.preventDefault();
    const pixels = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? canvas.clientHeight : 1);
    desiredDistance = zoomDistance(desiredDistance, pixels);
  }, { passive: false });
  canvas.addEventListener('contextmenu', event => event.preventDefault());
  canvas.addEventListener('pointerdown', event => {
    if (event.button !== 2) return;
    drag = { x: event.clientX, y: event.clientY };
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', event => {
    if (!drag) return;
    azimuth -= (event.clientX - drag.x) * 0.006;
    elevationOffset = THREE.MathUtils.clamp(elevationOffset + (event.clientY - drag.y) * 0.004, -0.2, 0.55);
    drag = { x: event.clientX, y: event.clientY };
  });
  const stopDrag = () => { drag = null; };
  canvas.addEventListener('pointerup', stopDrag);
  canvas.addEventListener('pointercancel', stopDrag);
  canvas.addEventListener('lostpointercapture', stopDrag);
  window.addEventListener('blur', stopDrag);
  window.addEventListener('keydown', event => {
    if (event.key.toLowerCase() === 'r') { desiredDistance = DEFAULT_DISTANCE; azimuth = 0.5; elevationOffset = 0; }
  });

  return {
    setCharacter(chibi: boolean) {
      const viewingPortrait = desiredDistance <= 2.5;
      portraitDistance = chibi ? 2.5 : MIN_DISTANCE;
      focusHeight = chibi ? 1.65 : 1.9;
      if (viewingPortrait) desiredDistance = portraitDistance;
    },
    preset(close: boolean) { desiredDistance = close ? portraitDistance : 5.5; azimuth = 0.15; elevationOffset = close ? -0.1 : -0.2; },
    update(position: THREE.Vector3, dt: number) {
      distance = THREE.MathUtils.lerp(distance, desiredDistance, 1 - Math.exp(-12 * dt));
      const close = 1 - THREE.MathUtils.smoothstep(distance, MIN_DISTANCE, 7);
      const elevation = THREE.MathUtils.clamp(0.6 - close * 0.38 + elevationOffset, 0.14, 1.12);
      target.copy(position).add(new THREE.Vector3(0, THREE.MathUtils.lerp(1.05, focusHeight, close), 0));
      offset.set(Math.sin(azimuth) * Math.cos(elevation), Math.sin(elevation), Math.cos(azimuth) * Math.cos(elevation)).multiplyScalar(distance);
      camera.position.copy(target).add(offset);
      camera.lookAt(target);
    },
    // 水平輸入以目前鏡頭方位為基準，右鍵轉鏡頭後仍直覺。
    movement(dx: number, dz: number) {
      const length = Math.hypot(dx, dz) || 1;
      return { x: (Math.cos(azimuth) * dx + Math.sin(azimuth) * dz) / length,
        z: (-Math.sin(azimuth) * dx + Math.cos(azimuth) * dz) / length };
    },
    snapshot: () => ({ distance, desiredDistance, minDistance: MIN_DISTANCE, maxDistance: MAX_DISTANCE, azimuth }),
  };
}

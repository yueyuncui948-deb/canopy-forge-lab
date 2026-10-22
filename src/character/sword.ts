import * as THREE from 'three';

export function createSword() {
  const root = new THREE.Group();
  root.name = 'HandAttachedSword';
  const steel = new THREE.MeshStandardMaterial({ color: '#d7e3eb', metalness: 0.92, roughness: 0.24 });
  const gold = new THREE.MeshStandardMaterial({ color: '#bd9453', metalness: 0.82, roughness: 0.3 });
  const leather = new THREE.MeshStandardMaterial({ color: '#302b27', roughness: 0.85 });
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(-0.055, 0.12); bladeShape.lineTo(-0.045, 0.85);
  bladeShape.lineTo(0, 1.08); bladeShape.lineTo(0.045, 0.85); bladeShape.lineTo(0.055, 0.12); bladeShape.closePath();
  const blade = new THREE.Mesh(new THREE.ExtrudeGeometry(bladeShape, { depth: 0.018, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.008, bevelThickness: 0.008 }), steel);
  blade.position.z = -0.009; root.add(blade);
  const guard = new THREE.Mesh(new THREE.CapsuleGeometry(0.024, 0.27, 3, 8), gold);
  guard.rotation.z = Math.PI / 2; guard.position.y = 0.1; root.add(guard);
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.024, 0.2, 12), leather);
  handle.position.y = -0.03; root.add(handle);
  const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 8), gold);
  pommel.position.y = -0.15; root.add(pommel);
  root.traverse(object => { if (object instanceof THREE.Mesh) { object.castShadow = true; object.receiveShadow = true; } });
  return root;
}

import * as THREE from 'three';
import './style.css';

// Phase-1 placeholder demo. Replace primitive meshes with licensed GLB characters in Phase 3.
const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `<div class="hud"><div class="badge">CANOPY FORGE / PROTOTYPE 0.1</div><strong>Moonfall Jungle — Combat Lab</strong><p>W A S D 移動 · Shift 跑步 · Space 跳躍<br>滑鼠左鍵 / J 揮刀 · 點擊場景後按方向鍵也可移動</p><div class="hp"><div id="hp-bar"></div></div><p id="status">狀態：待命</p></div><div class="foot">Procedural prototype · Primitive characters only<br>目標：先驗證真正的 3D 操作與戰鬥，再導入精緻角色</div>`;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#06131a');
scene.fog = new THREE.FogExp2('#0b2221', 0.027);
const camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, 0.1, 150);
camera.position.set(18, 21, 21);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
app.prepend(renderer.domElement);
scene.add(new THREE.HemisphereLight('#7098bf', '#18361b', 1.3));
const moon = new THREE.DirectionalLight('#b6c9ff', 2.6);
moon.position.set(-12, 20, 6); moon.castShadow = true;
moon.shadow.mapSize.set(2048, 2048); moon.shadow.camera.left=-24;moon.shadow.camera.right=24;moon.shadow.camera.top=24;moon.shadow.camera.bottom=-24;
scene.add(moon);
const fill = new THREE.PointLight('#45c49b', 18, 16); fill.position.set(4, 4, -3); scene.add(fill);
const floor = new THREE.Mesh(new THREE.PlaneGeometry(46,46), new THREE.MeshStandardMaterial({color:'#233a2e',roughness:.86,metalness:.06}));
floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;scene.add(floor);
const limit=18;
const trunkMaterial = new THREE.MeshStandardMaterial({color:'#493a2a',roughness:1});
const leafMaterial = new THREE.MeshStandardMaterial({color:'#184b38',roughness:.9,side:THREE.DoubleSide});
function tree(x:number,z:number,s=1){
 const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.33*s,.54*s,7*s,8),trunkMaterial);trunk.position.set(x,3.5*s,z);trunk.castShadow=true;scene.add(trunk);
 for(let i=0;i<3;i++) { const foliage=new THREE.Mesh(new THREE.IcosahedronGeometry((2.45-i*.3)*s,1),leafMaterial);foliage.scale.set(1.4,.62,1.15);foliage.position.set(x+(i-1)*.6*s,(7.1+i*.55)*s,z+((i%2)?-.7:.5)*s); foliage.castShadow=true;scene.add(foliage); }
}
[[-13,-12,1.2],[-11,10,1.35],[12,-11,1.15],[13,12,1.3],[-16,1,1.1]].forEach(([x,z,s])=>tree(x,z,s));
const stoneMat = new THREE.MeshStandardMaterial({color:'#394842',roughness:1});
for(let i=0;i<22;i++){const x=Math.sin(i*11.7)*16,z=Math.cos(i*4.9)*16;if(Math.abs(x)<3 && Math.abs(z)<3)continue; const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(.23+(i%4)*.12,0),stoneMat);rock.position.set(x,.12,z);rock.rotation.set(i,i*.2,i*.9);rock.castShadow=true;scene.add(rock);}
function humanoid(color:string,blade=false){
 const root=new THREE.Group();
 const cloth=new THREE.MeshStandardMaterial({color,roughness:.77,metalness:.15});
 const skin=new THREE.MeshStandardMaterial({color:'#a99b7c',roughness:.85});
 const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.42,.75,6,12),cloth);torso.position.y=1.45;torso.castShadow=true;root.add(torso);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.31,16,12),skin);head.position.y=2.3;head.castShadow=true;root.add(head);
 const limbs:THREE.Mesh[]=[];
 for(const x of [-.28,.28]){
   const leg=new THREE.Mesh(new THREE.CapsuleGeometry(.14,.65,5,8),cloth);leg.position.set(x,.63,0);leg.castShadow=true;root.add(leg);limbs.push(leg);
   const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.12,.55,5,8),cloth);arm.position.set(x*2,1.48,0);arm.castShadow=true;root.add(arm);limbs.push(arm);
 }
 const weaponPivot=new THREE.Group();weaponPivot.position.set(.63,1.25,0);root.add(weaponPivot);
 if(blade){const bladeMesh=new THREE.Mesh(new THREE.BoxGeometry(.10,1.5,.19),new THREE.MeshStandardMaterial({color:'#c5dce7',metalness:.85,roughness:.25}));bladeMesh.position.set(0,.8,0);bladeMesh.castShadow=true;weaponPivot.add(bladeMesh);}
 return {root,limbs,weaponPivot};
}
const hero=humanoid('#526d70',true);scene.add(hero.root);hero.root.position.set(0,0,3);
const monster=humanoid('#79423f');monster.root.scale.set(1.25,1.2,1.25);monster.root.position.set(5,0,-1);scene.add(monster.root);
const keys=new Set<string>();let jumpV=0, jumpY=0,attackT=0,attackCooldown=0,monsterHP=3,hitDone=false,heroHP=100,gameT=0;
const status=document.getElementById('status')!; const hpBar=document.getElementById('hp-bar')!;
const normKey=(v:string)=>v.toLowerCase();
window.addEventListener('keydown',e=>{const k=normKey(e.key);keys.add(k);if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(k))e.preventDefault();if(k===' '&&jumpY<=.001)jumpV=8.5;if(k==='j')startAttack();});
window.addEventListener('keyup',e=>keys.delete(normKey(e.key)));
window.addEventListener('blur',()=>keys.clear());
renderer.domElement.addEventListener('pointerdown',e=>{if(e.button===0)startAttack();});
function startAttack(){if(attackCooldown>0)return;attackT=.32;attackCooldown=.5;hitDone=false;}
let last=performance.now();
function tick(now:number){requestAnimationFrame(tick);const dt=Math.min((now-last)/1000,.045);last=now;gameT+=dt;
 const dx=Number(keys.has('d')||keys.has('arrowright'))-Number(keys.has('a')||keys.has('arrowleft'));
 const dz=Number(keys.has('s')||keys.has('arrowdown'))-Number(keys.has('w')||keys.has('arrowup'));
 const moving=dx!==0||dz!==0; const run=keys.has('shift'); const speed=run?8:4.3;
 if(moving){const length=Math.hypot(dx,dz);const vx=(dx+dz)/Math.SQRT2/length,vz=(dz-dx)/Math.SQRT2/length;
 hero.root.position.x=THREE.MathUtils.clamp(hero.root.position.x+vx*speed*dt,-limit,limit);hero.root.position.z=THREE.MathUtils.clamp(hero.root.position.z+vz*speed*dt,-limit,limit);
 hero.root.rotation.y=Math.atan2(vx,vz);}
 jumpV-=22*dt;jumpY=Math.max(0,jumpY+jumpV*dt);if(jumpY===0&&jumpV<0)jumpV=0;
 hero.root.position.y=jumpY;
 const swing=moving?Math.sin(gameT*(run?14:9))*.5:0;
 hero.limbs[0].rotation.x=swing;hero.limbs[2].rotation.x=-swing;
 hero.limbs[1].rotation.x=-swing;hero.limbs[3].rotation.x=swing;
 attackCooldown=Math.max(0,attackCooldown-dt);attackT=Math.max(0,attackT-dt);
 hero.weaponPivot.rotation.z=attackT>0?-Math.sin((.32-attackT)/.32*Math.PI)*1.9:0;
 if(attackT>0&&!hitDone&&attackT<.18){hitDone=true;const dist=hero.root.position.distanceTo(monster.root.position);if(dist<3.2){monsterHP--;status.textContent=`命中怪物！剩餘生命：${Math.max(0,monsterHP)}`; monster.root.scale.x=1.4;}}
 monster.root.scale.x=THREE.MathUtils.lerp(monster.root.scale.x,1.25,.12);
 if(monsterHP<=0){monster.root.visible=false; status.textContent='成功擊敗怪物！3 秒後重新生成';if(!('respawn' in monster.userData))monster.root.userData.respawn=gameT+3;}
 if(monster.root.userData.respawn&&gameT>=monster.root.userData.respawn){monsterHP=3;monster.root.visible=true;delete monster.root.userData.respawn;status.textContent='怪物已重新出現';}
 if(monsterHP>0){const d=monster.root.position.distanceTo(hero.root.position);if(d>2.4&&d<10){const dir=hero.root.position.clone().sub(monster.root.position);dir.y=0;dir.normalize();monster.root.position.addScaledVector(dir,dt*.65);}monster.root.lookAt(hero.root.position.x,monster.root.position.y,hero.root.position.z);
 if(d<1.55 && Math.sin(gameT*2.2)>0.995){heroHP=Math.max(0,heroHP-3);hpBar.style.width=heroHP+'%';status.textContent='怪物攻擊了你';}}
 const ideal=hero.root.position.clone().add(new THREE.Vector3(16,20,20));camera.position.lerp(ideal,Math.min(1,dt*3.5));camera.lookAt(hero.root.position.x,1,hero.root.position.z);
 renderer.render(scene,camera);
}
requestAnimationFrame(tick);
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});

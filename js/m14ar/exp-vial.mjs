// Vial (M-07): a roadway piece of the port. Chapter 4 (40–70 s), cinematic, at 1:20 like the physical model.
//  40.0–41.5  the road appears: neighbour slabs, markings, sidewalk with walkers, lamps, a container terminal behind
//  41.6–48.0  a container truck crosses the real piece; wheel-load pulses, gold outline; the identity tag answers
//  43.2–55.0  "X-ray" section behind the road: 20 mm PE + {canto} mm concrete vs the 80 mm of a pedestrian piece,
//             illustrative load arrows under each wheel on the piece, and the identity tag inside the PE
//  48.4–55.6  a reach stacker carries a container slowly over the piece (reversing beeps); a runner on the sidewalk
//  50.0–55.0  a forklift brings a bag of flakes from the batch the other way
//  55.2       a ship's horn from the port
//  56.0–61.0  rain: streaks, ripples, wet sheen on the road; the light drops
//  60.0–70.0  night: lamps, headlights and long light trails of the late traffic; final image of the glowing piece
// Load arrows and tag readings are explanatory drawings, labelled as illustrative: no structural result is shown.
import {THREE,RoundedBoxGeometry,GOLD,MINT,seg,io,out,win,lerp,clamp,label,setFade,outline,truck,forklift,pallet,bigBag,container,MATS} from './kit.mjs?v=9.0';
import {base} from './zones.mjs?v=9.0';
import {tr,fmt} from './text.mjs?v=9.0';

const CAPTION={kick:['04 · USO','04 · USE','04 · ÚS'],
 title:['El puerto no se detiene.','The port never stops.','El port no s’atura.'],
 text:['Pieza de vial en {pos}: contenedores, carretillas y lluvia, de día y de noche. Por eso lleva {canto} mm de hormigón.',
  'A roadway piece at {pos}: containers, forklifts and rain, day and night. That is why it carries {canto} mm of concrete.',
  'Peça de vial a {pos}: contenidors, carretons i pluja, de dia i de nit. Per això porta {canto} mm de formigó.']};
const TXT={section:['Sección · {canto} mm de hormigón','Section · {canto} mm of concrete','Secció · {canto} mm de formigó'],
 pe:['{pe} mm de PE reciclado','{pe} mm of recycled PE','{pe} mm de PE reciclat'],
 loads:['Reparto de cargas · ilustrativo','Load spreading · illustrative','Repartiment de càrregues · il·lustratiu'],
 walk:['80 mm · pieza peatonal','80 mm · pedestrian piece','80 mm · peça per a vianants'],
 tag:['Etiqueta de identidad','Identity tag','Etiqueta d’identitat'],
 read:['{id} · lectura de paso · ilustrativa','{id} · passing reading · illustrative','{id} · lectura de pas · il·lustrativa'],
 rain:['Lluvia en el muelle','Rain on the quay','Pluja al moll'],
 night:['De noche, el tráfico sigue','At night, the traffic goes on','De nit, el trànsit continua']};

export function vialExperience(ctx){
 const{P,TABLE,piece,vars,lang,glow,lights}=ctx,b=base(ctx),{g}=b,X=k=>fmt(tr(TXT[k],lang),vars);
 const span=P.w*3+.32,roadZ=0,walkZ=P.d/2+.022,backZ=-(P.d/2+.022);
 b.slab(-(P.w+.007));b.slab(P.w+.007);b.posLabel(`${piece.position} · ${piece.id}`,0,P.d/2+.044);

 // Road markings (one shared geometry per kind).
 const markMat=new THREE.MeshBasicMaterial({color:0xf2f2ea,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2});
 const edgeMat=new THREE.MeshBasicMaterial({color:0xf2c46b,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2});
 const dashGeo=new THREE.PlaneGeometry(.022,.0025);dashGeo.rotateX(-Math.PI/2);
 for(let x=-P.w*1.5;x<P.w*1.5;x+=.04){const d=new THREE.Mesh(dashGeo,markMat);d.position.set(x+.011,.0004,roadZ);g.add(d)}
 const edgeGeo=new THREE.PlaneGeometry(P.w*3+.014,.0018);edgeGeo.rotateX(-Math.PI/2);
 for(const z of[-1,1]){const e=new THREE.Mesh(edgeGeo,edgeMat);e.position.set(0,.0004,z*(P.d/2-.006));g.add(e)}
 // Wet sheen over the road (rain): a glossy additive film with moving streak highlights.
 const wetMat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uOpacity:{value:0},uTime:{value:0}},
  vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:'uniform float uOpacity,uTime;varying vec2 vUv;void main(){float s=.5+.5*sin(vUv.x*90.+uTime*1.3)*sin(vUv.y*23.-uTime*.7);float e=smoothstep(0.,.08,vUv.y)*smoothstep(1.,.92,vUv.y)*smoothstep(0.,.1,vUv.x)*smoothstep(1.,.9,vUv.x);gl_FragColor=vec4(vec3(.55,.7,.85)*(.35+.65*s*s),uOpacity*e*.35);}'});
 const wet=new THREE.Mesh(new THREE.PlaneGeometry(P.w*3+.014,P.d),wetMat);wet.rotation.x=-Math.PI/2;wet.position.y=.0006;wet.renderOrder=2;g.add(wet);

 // Sidewalk on the reader's side, kerb at slab height, with walkers and a runner.
 const walkMat=new THREE.MeshStandardMaterial({color:0xb9b5aa,roughness:.95,transparent:true});
 const sidewalk=new THREE.Mesh(new RoundedBoxGeometry(span,P.h+.002,.03,1,.0008),walkMat);sidewalk.position.set(0,TABLE+(P.h+.002)/2,walkZ);sidewalk.receiveShadow=true;g.add(sidewalk);
 const people=b.walkers([{speed:.05,z:walkZ-.006,dir:1,span},{speed:.042,z:walkZ+.007,dir:-1,span,color:0xe6b8a2},{speed:.13,z:walkZ+.001,dir:-1,span,phase:.55,stride:.07,color:0x9fc9c0}]);

 // A container terminal behind the road: low stacks, readable as a backdrop.
 const term=new THREE.Group();g.add(term);
 const stack=[[MATS.orange,-P.w*.95,0],[MATS.teal,-P.w*.95,1],[MATS.white,-P.w*.2,0],[MATS.blue,P.w*.55,0],[MATS.orange,P.w*.55,1],[MATS.teal,P.w*1.3,0]];
 for(const[m,x,lv]of stack){const c=container(m,.3);c.scale.setScalar(.5);c.position.set(x,TABLE+lv*.13*.5,-(P.d/2+.13));c.rotation.y=lv?.03:-.02;term.add(c)}

 // Street lamps; heads and light pools come on as the light drops.
 const poleGeo=new THREE.CylinderGeometry(.0013,.0018,.19,8),armGeo=new THREE.BoxGeometry(.03,.0016,.0016),headGeo=new THREE.BoxGeometry(.012,.004,.007);
 const headMat=new THREE.MeshStandardMaterial({color:0xfff6dc,emissive:0xffd98a,emissiveIntensity:0}),poolMat=new THREE.MeshBasicMaterial({map:glow,color:0xffd98a,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:0});
 const poolGeo=new THREE.PlaneGeometry(.12,.09);poolGeo.rotateX(-Math.PI/2);
 const lampX=[-P.w*1.05,0,P.w*1.05];
 for(const x of lampX){const lamp=new THREE.Group(),pole=new THREE.Mesh(poleGeo,MATS.dark),arm=new THREE.Mesh(armGeo,MATS.dark),head=new THREE.Mesh(headGeo,headMat);
  pole.position.y=.095;arm.position.set(0,.19,.014);head.position.set(0,.187,.026);pole.castShadow=true;lamp.add(pole,arm,head);lamp.position.set(x,TABLE,backZ);g.add(lamp);
  const pool=new THREE.Mesh(poolGeo,poolMat);pool.position.set(x,.0008,-.012);g.add(pool)}

 // Vehicles at 1:20 (slightly reduced so they stay readable on a phone).
 const TS=.8;
 // Container truck: tractor + chassis + 20 ft container.
 const ctr=new THREE.Group();{const cab=new THREE.Mesh(new RoundedBoxGeometry(.07,.1,.11,2,.008),MATS.white),glass=new THREE.Mesh(new THREE.BoxGeometry(.002,.032,.088),new THREE.MeshStandardMaterial({color:0x1f3b46,roughness:.2,metalness:.3})),
  chassis=new THREE.Mesh(new THREE.BoxGeometry(.36,.012,.09),MATS.dark),box=container(MATS.orange,.3);
  cab.position.set(.17,.07,0);glass.position.set(.206,.09,0);chassis.position.set(0,.03,0);box.position.set(-.025,.036,0);box.scale.set(1,.92,.93);ctr.add(cab,glass,chassis,box);ctr.userData.wheels=[];
  for(const x of[.16,-.08,-.14])for(const z of[-.047,.047]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.024,.024,.018,20),MATS.rubber);w.rotation.x=Math.PI/2;w.position.set(x,.024,z);ctr.add(w);ctr.userData.wheels.push(w)}
  ctr.traverse(o=>{if(o.isMesh)o.castShadow=true})}
 const CS=.66;ctr.scale.setScalar(CS);g.add(ctr);
 const t2=truck();t2.scale.setScalar(TS);g.add(t2);
 const van=new THREE.Group();{const body=new THREE.Mesh(new RoundedBoxGeometry(.2,.05,.085,3,.01),MATS.white),cab=new THREE.Mesh(new RoundedBoxGeometry(.12,.035,.078,3,.012),new THREE.MeshStandardMaterial({color:0x1d3540,roughness:.2,metalness:.3}));body.position.y=.04;cab.position.set(.02,.074,0);van.add(body,cab);
  const band=new THREE.Mesh(new THREE.BoxGeometry(.201,.008,.086),MATS.blue);band.position.y=.042;van.add(band);van.userData.wheels=[];
  for(const x of[-.065,.065])for(const z of[-.038,.038]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.016,.016,.012,16),MATS.rubber);w.rotation.x=Math.PI/2;w.position.set(x,.016,z);van.add(w);van.userData.wheels.push(w)}van.traverse(o=>{if(o.isMesh)o.castShadow=true})}
 g.add(van);
 // Reach stacker carrying a container (slow, reversing beeps).
 const RS=.62,rs=new THREE.Group();{const body=new THREE.Mesh(new RoundedBoxGeometry(.2,.06,.11,2,.01),MATS.yellow),cab=new THREE.Mesh(new RoundedBoxGeometry(.05,.05,.06,2,.006),new THREE.MeshStandardMaterial({color:0x1f3b46,roughness:.25,metalness:.3})),cw=new THREE.Mesh(new RoundedBoxGeometry(.04,.05,.1,1,.006),MATS.dark);
  body.position.set(0,.05,0);cab.position.set(.02,.105,.03);cw.position.set(-.11,.05,0);
  const boom=new THREE.Mesh(new THREE.BoxGeometry(.26,.022,.03),MATS.yellow);boom.position.set(.07,.13,0);boom.rotation.z=.32;
  const spreader=new THREE.Mesh(new THREE.BoxGeometry(.03,.01,.3),MATS.dark);spreader.position.set(.19,.168,0);
  const box=container(MATS.blue,.3);box.rotation.y=Math.PI/2;box.position.set(.19,.035,0);box.scale.set(1,.9,.9);
  rs.add(body,cab,cw,boom,spreader,box);rs.userData.wheels=[];
  for(const x of[.07,-.08])for(const z of[-.055,.055]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.022,20),MATS.rubber);w.rotation.x=Math.PI/2;w.position.set(x,.03,z);rs.add(w);rs.userData.wheels.push(w)}
  rs.traverse(o=>{if(o.isMesh)o.castShadow=true})}
 rs.scale.setScalar(RS);g.add(rs);
 const fk=forklift(),fkLoad=new THREE.Group();fkLoad.add(pallet());{const bag=bigBag();bag.position.y=.007;fkLoad.add(bag)}g.add(fk,fkLoad);

 // Headlights (white glow ahead), tail lights (red) and long light trails behind each vehicle.
 const beamGeo=new THREE.BufferGeometry();beamGeo.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,.16,0,-.05,.16,0,.05],3));
 const trailTex=(()=>{const c=document.createElement('canvas');c.width=256;c.height=8;const x=c.getContext('2d'),gr=x.createLinearGradient(0,0,256,0);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(.85,'rgba(255,255,255,.9)');gr.addColorStop(1,'rgba(255,255,255,1)');x.fillStyle=gr;x.fillRect(0,0,256,8);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t})();
 const trailGeo=new THREE.PlaneGeometry(1,.006);trailGeo.translate(-.5,0,0); // vertical ribbon facing the reader
 const lightsFor=(len,w)=>{const h=new THREE.Group(),beamMat=new THREE.MeshBasicMaterial({color:0xffe6a8,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide});
  const beam=new THREE.Mesh(beamGeo,beamMat);beam.position.y=.002;h.add(beam);
  const spots=[-1,1].map(s=>{const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:glow,color:0xfff0c8,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:0}));sp.scale.setScalar(.022);sp.position.set(0,.03,s*w);h.add(sp);return sp});
  const tails=[-1,1].map(s=>{const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:glow,color:0xff3b2e,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:0}));sp.scale.setScalar(.016);sp.position.set(-len,.03,s*w);h.add(sp);return sp});
  const trails=[[-1,0xfff0c8,0],[1,0xfff0c8,0],[-1,0xff4a3a,1],[1,0xff4a3a,1]].map(([s,c,tail])=>{const m=new THREE.Mesh(trailGeo,new THREE.MeshBasicMaterial({map:trailTex,color:c,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));
   m.position.set(tail?-len:0,.03,s*w);m.userData.tail=tail;h.add(m);return m});
  g.add(h);h.userData={beamMat,spots,tails,trails};return h};
 const hlC=lightsFor(.32*CS,.03),hl2=lightsFor(.3*TS,.034),hlv=lightsFor(.2,.03),hlR=lightsFor(.22*RS,.03);

 // Wheel-load pulses on the slab (pooled).
 const pulseMat=new THREE.SpriteMaterial({map:glow,color:0xf2c46b,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:0});
 const pulses=Array.from({length:10},()=>{const s=new THREE.Sprite(pulseMat.clone());s.scale.setScalar(.03);g.add(s);return s});
 const load=outline(P.w+.004,P.d+.004,GOLD,.0018);load.position.y=.0006;g.add(load);
 // Identity reading on the real piece: a ring that expands from the centre when a vehicle passes (illustrative).
 const ringGeo=new THREE.RingGeometry(.92,1,64);ringGeo.rotateX(-Math.PI/2);
 const ring=new THREE.Mesh(ringGeo,new THREE.MeshBasicMaterial({color:MINT,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));ring.position.y=.0009;g.add(ring);
 const readLabel=label({title:X('read'),px:.00011});readLabel.position.set(0,.02,P.d/2-.01);g.add(readLabel);

 // X-ray section standing behind the road (vertical, facing the reader, never hiding the real piece). Exaggerated thickness like chapter 2.
 const K=1.6,boardH=.0026*K,conH=.0026*piece.concreteMm/piece.peMm*1.13*K,walkH=.0026*80/piece.peMm*1.13*K;
 const sec=new THREE.Group();sec.position.set(0,.135,-(P.d/2+.05));g.add(sec); // high enough to read over a passing truck
 const secBack=new THREE.Mesh(new THREE.PlaneGeometry(P.w+.03,conH+boardH+.03),new THREE.MeshBasicMaterial({color:0x05222b,transparent:true,opacity:.58,depthWrite:false}));secBack.position.y=(conH+boardH)/2;sec.add(secBack);
 const conSec=new THREE.Mesh(new THREE.PlaneGeometry(P.w,conH),new THREE.MeshBasicMaterial({map:ctx.conTex,color:0x9a9f95,transparent:true}));conSec.position.y=boardH+conH/2;conSec.position.z=.0005;conSec.name='concrete';sec.add(conSec);
 const peSec=new THREE.Mesh(new THREE.PlaneGeometry(P.w,boardH),new THREE.MeshBasicMaterial({color:0x2f9a7e,transparent:true}));peSec.position.y=boardH/2;peSec.position.z=.0005;peSec.name='pe';sec.add(peSec);
 // The identity tag inside the PE layer, with a reading pulse.
 const chip=new THREE.Mesh(new THREE.PlaneGeometry(.012,boardH*.7),new THREE.MeshBasicMaterial({color:0xf2c46b,transparent:true}));chip.position.set(P.w*.3,boardH/2,.001);chip.name='passport';sec.add(chip);
 const chipGlow=new THREE.Sprite(new THREE.SpriteMaterial({map:glow,color:0x7edbc2,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:0}));chipGlow.position.set(P.w*.3,boardH/2,.002);chipGlow.scale.setScalar(.02);sec.add(chipGlow);
 const chipLabel=label({lines:[X('tag')],px:.0001,accent:'#f2c46b'});chipLabel.position.set(P.w*.3,-.016,0);sec.add(chipLabel);
 // Dashed outline: how thick a pedestrian piece would be.
 const dash=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(P.w*.32,walkH)),new THREE.LineDashedMaterial({color:0x9fd8c5,dashSize:.003,gapSize:.002,transparent:true}));dash.computeLineDistances();dash.position.set(-P.w*.32,boardH+walkH/2,.001);sec.add(dash);
 const arrowGeo=new THREE.ConeGeometry(.0026,.007,10);arrowGeo.rotateX(Math.PI);
 const arrows=Array.from({length:18},()=>{const a=new THREE.Mesh(arrowGeo,new THREE.MeshBasicMaterial({color:0xf2c46b,transparent:true,opacity:0,depthWrite:false}));a.position.z=.002;sec.add(a);return a});
 const secLabel=label({title:X('section'),lines:[X('pe'),X('loads')]});secLabel.position.set(-P.w*.05,conH+boardH+.018,0);sec.add(secLabel);
 const walkLabel=label({lines:[X('walk')],px:.0001,accent:'#9fd8c5'});walkLabel.position.set(-P.w*.32,boardH+walkH+.004,0);sec.add(walkLabel);
 const rainLabel=label({lines:[X('rain')],px:.00011,accent:'#9fc9e0'});rainLabel.position.set(-P.w*.9,.2,backZ-.03);g.add(rainLabel);
 const nightLabel=label({lines:[X('night')],px:.00011,accent:'#f2c46b'});nightLabel.position.set(P.w*.8,.2,backZ-.03);g.add(nightLabel);

 // Rain: falling streaks (one LineSegments) and ripples on the road (pooled sprites).
 const RN=320,rainPos=new Float32Array(RN*6),seeds=Array.from({length:RN},(_,i)=>[(Math.sin(i*12.9898)*43758.5453)%1,(Math.sin(i*78.233)*12345.678)%1,(Math.sin(i*39.71)*9876.54)%1].map(v=>Math.abs(v)));
 const rainGeo=new THREE.BufferGeometry();rainGeo.setAttribute('position',new THREE.BufferAttribute(rainPos,3));
 const rain=new THREE.LineSegments(rainGeo,new THREE.LineBasicMaterial({color:0xcfe4f2,transparent:true,opacity:0,depthWrite:false}));rain.frustumCulled=false;g.add(rain);
 const rippleGeo=new THREE.RingGeometry(.7,1,24);rippleGeo.rotateX(-Math.PI/2);
 const ripples=Array.from({length:12},(_,i)=>{const r=new THREE.Mesh(rippleGeo,new THREE.MeshBasicMaterial({color:0xd8ecf6,transparent:true,opacity:0,depthWrite:false}));r.userData.seed=i*.618%1;g.add(r);return r});
 const RH=.24,RW=span*.8,RD=P.d+.08;

 const wheelX=(veh,s,x,dir)=>veh.userData.wheels.map(w=>({x:x+dir*w.position.x*s,z:w.position.z*s}));
 function drive(t,veh,hl,t0,t1v,dir,s,front){
  const k=seg(t,t0,t1v),x=lerp(-dir*span/2,dir*span/2,io(k)*.15+k*.85);veh.visible=k>0&&k<1;
  veh.position.set(x,0,roadZ);veh.rotation.y=dir>0?0:Math.PI;for(const w of veh.userData.wheels||[])w.rotation.y=-dir*x/.024;
  hl.visible=veh.visible;hl.position.set(x+dir*front*s,0,roadZ);hl.rotation.y=dir>0?0:Math.PI;
  const speed=Math.abs(span/(t1v-t0))*(k>0&&k<1?1:0);hl.userData.speed=speed;
  return veh.visible?wheelX(veh,s,x,dir):[]}
 const night=new THREE.Color(0x30406a),warm=new THREE.Color(0xffd7a0),cold=new THREE.Color(0x7d92c4);
 let lastRead=-9;

 return{duration:30,group:g,caption:CAPTION,retOff:[0,.0012,0],pickables:[conSec,peSec,chip],
  cues:[['engine',41.6],['explode',43.4],['beep',48.6],['engine',50],['horn',55.2],['thunder',56.6],['splash',58.2],['engine',61.2],['engine',64.6]],
  update(t,time,pf){
   b.walk(people,t,40.6,69.4);for(const f of people)f.position.y+=P.h+.002;
   // Light: rain darkens, then night falls (lights are reset by the scene every frame).
   const rainK=win(t,56,61.4,1.2,1.4),nightK=seg(t,59.5,63.5)*(1-seg(t,68.4,70)),dim=Math.max(rainK*.45,nightK)*pf;
   lights.hemi.intensity*=1-.72*dim;lights.hemi.color.lerp(night,dim*.8);lights.hemi.groundColor.lerp(night,dim*.5);
   lights.key.intensity*=1-.82*dim;lights.key.color.lerp(nightK>rainK*.45?warm:cold,dim*.6);lights.fill.intensity*=1-.4*dim;lights.fill.color.lerp(cold,dim);
   const lampK=Math.max(seg(t,56.4,58)*.6,nightK);headMat.emissiveIntensity=lampK*1.8;poolMat.opacity=lampK*.34*pf;
   setFade(rainLabel,win(t,56.4,60.8,.6,.8)*pf);setFade(nightLabel,win(t,61,67.6,.8,1)*pf);
   // Traffic.
   const contacts=[...drive(t,ctr,hlC,41.6,48,1,CS,.205),...drive(t,rs,hlR,48.4,55.6,-1,RS,.21),...drive(t,t2,hl2,61.2,66.6,1,TS,.19),...drive(t,van,hlv,64.6,68.6,-1,1,.1)];
   const fs=seg(t,50,55),fx=lerp(span/2,-span/2,io(fs));fk.visible=fkLoad.visible=fs>0&&fs<1;fk.position.set(fx,0,-P.d*.2);fk.rotation.y=Math.PI;fkLoad.position.set(fx-.07,.012,-P.d*.2);
   if(fk.visible&&Math.abs(fx)<P.w/2)contacts.push({x:fx+.025,z:-P.d*.2},{x:fx-.028,z:-P.d*.2});
   for(const[h,base]of[[hlC,.2],[hlR,.25],[hl2,1],[hlv,1]]){const u=h.userData,lit=pf*Math.max(base*.6,lampK),dark=Math.max(rainK*.5,nightK);
    u.beamMat.opacity=pf*.1*dark;u.spots.forEach(s=>{s.material.opacity=lit;s.scale.setScalar(.022+.016*dark)});u.tails.forEach(s=>{s.material.opacity=lit*.9;s.scale.setScalar(.016+.012*dark)});
    // Long-exposure trails: length grows with speed, only in the dark.
    const L=Math.min(.42,.04+u.speed*.9)*dark;u.trails.forEach(m=>{m.scale.x=Math.max(.001,L);m.material.opacity=pf*dark*(m.userData.tail?.8:.6)*(h.visible?1:0)})}
   // Wheel loads on the piece and the identity reading they trigger (illustrative).
   const onPiece=contacts.filter(c=>Math.abs(c.x)<P.w/2);
   pulses.forEach((p,i)=>{const c=onPiece[i];p.visible=!!c;if(c){p.position.set(c.x,.003,c.z);p.material.opacity=pf*(.55+.35*Math.sin(time*18+i));p.scale.setScalar(.026+.006*Math.sin(time*18+i))}});
   load.material.uniforms.uOpacity.value=pf*(.22+.78*(onPiece.length?(.6+.4*Math.sin(time*20)):0)+nightK*.4*(t>67?(.5+.5*Math.sin(time*3)):0));
   let cue=null;if(onPiece.length&&t-lastRead>3.2){lastRead=t;cue='chime'}if(t<lastRead-1)lastRead=-9;
   const rk=seg(t,lastRead,lastRead+1.4);ring.visible=rk>0&&rk<1;ring.scale.setScalar(.01+out(rk)*P.w*.7);ring.material.opacity=pf*(1-rk)*.9;
   setFade(readLabel,(rk>0&&rk<1?Math.sin(Math.min(1,rk*2.2)*Math.PI*.5)*(1-seg(rk,.75,1)):0)*pf);
   // X-ray section.
   const sv=win(t,43.2,55,.9,1);setFade(sec,sv*pf);sec.scale.set(1,Math.max(.001,io(seg(t,43.2,44.4))),1);
   chipGlow.material.opacity=sv*pf*(rk>0&&rk<1?1-rk:.25+.15*Math.sin(time*3));chipGlow.scale.setScalar(.014+(rk>0&&rk<1?.03*out(rk):0));
   const cols=onPiece.map(c=>c.x).slice(0,6);
   arrows.forEach((a,i)=>{const col=cols[Math.floor(i/3)],fan=(i%3-1);if(col===undefined||sv<.05){a.material.opacity=0;return}
    const k=((time*1.6+i*.13)%1),y=boardH+conH-k*conH;a.position.set(col+fan*k*conH*.9,y,.002);a.rotation.z=-fan*.5;a.material.opacity=pf*sv*Math.sin(k*Math.PI)*.95});
   // Rain and wet road.
   rain.visible=rainK>.01;
   if(rain.visible){for(let i=0;i<RN;i++){const[sx,sy,sz]=seeds[i],y=RH*(1-((time*1.9+sy)%1)),x=(sx-.5)*RW,z=(sz-.5)*RD,o=i*6;
     rainPos[o]=x;rainPos[o+1]=y;rainPos[o+2]=z;rainPos[o+3]=x-.002;rainPos[o+4]=y-.014;rainPos[o+5]=z}rainGeo.attributes.position.needsUpdate=true;rain.material.opacity=pf*rainK*.55}
   ripples.forEach((r,i)=>{const k=(time*.9+r.userData.seed*7)%1,cx=((r.userData.seed*13.1)%1-.5)*P.w*2.6,cz=((r.userData.seed*7.7)%1-.5)*(P.d-.02);
    r.visible=rainK>.01;r.position.set(cx,.0009,cz);r.scale.setScalar(.002+k*.012);r.material.opacity=pf*rainK*(1-k)*.55});
   const wetK=Math.max(rainK,seg(t,58,60)*(1-seg(t,66,69.5)));wetMat.uniforms.uOpacity.value=pf*wetK;wetMat.uniforms.uTime.value=time;
   return cue?{cue}:{};
  }};
}

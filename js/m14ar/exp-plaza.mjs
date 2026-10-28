// Plaza (M-14, the original QR) · Moll de Pescadors, Port Vell: life on the pilot square, works arrive, a tower
// crane assembles and takes the piece up — and the visitor decides. Drag to swing the crane:
//  A = {reuse} (reuse on the square)  ·  B = the truck back to PLASTICPeople (Vinyols i els Arcs, ≈116,6 km by road).
// Each choice has its own ending; both say what the field test actually recorded (F6 stock -> F7 Q-01 -> F8 return).
import {THREE,RoundedBoxGeometry,MINT,GOLD,seg,io,out,back,win,lerp,clamp,label,setFade,fadeable,outline,ribbon,ribbonMaterial,
 canvasTexture,person,bench,sailBoat,MATS,peTexture} from './kit.mjs?v=8.0';
import {base} from './zones.mjs?v=8.0';
import {T,tr,fmt} from './text.mjs?v=8.0';

const TXT={
 caption:{kick:['04 · USO Y REÚSO','04 · USE & REUSE','04 · ÚS I REÚS'],title:['Cambia de lugar. Sigue siendo {id}.','A different place. Still {id}.','Canvia de lloc. Continua sent {id}.'],
  text:['Moll de Pescadors, en servicio en {pos}. Llegan obras: la grúa desmonta la pieza… y tú decides adónde va. Escena ilustrativa.','Moll de Pescadors, in service at {pos}. Works arrive: the crane takes the piece up… and you decide where it goes. Illustrative scene.','Moll de Pescadors, en servei a {pos}. Arriben obres: la grua desmunta la peça… i tu decideixes on va. Escena il·lustrativa.']},
 quay:['Moll de Pescadors · Port Vell','Moll de Pescadors · Port Vell','Moll de Pescadors · Port Vell'],
 works:['F6 · Obras en la plaza: se desmonta','F6 · Works on the square: taken up','F6 · Obres a la plaça: es desmunta'],
 prompt:['¿Adónde llevas {id}? Gira la grúa con el dedo.','Where do you take {id}? Swing the crane with your finger.','On portes {id}? Gira la grua amb el dit.'],
 kick:['TÚ DECIDES','YOUR CALL','TU DECIDEIXES'],
 aLabel:['{reuse} · Reúso','{reuse} · Reuse','{reuse} · Reús'],aDetail:['Vuelve a la plaza: nuevo lugar, misma identidad.','Back on the square: new place, same identity.','Torna a la plaça: nou lloc, mateixa identitat.'],
 bLabel:['Planta · Retorno','Plant · Return','Planta · Retorn'],bDetail:['Al camión y a PLASTICPeople: la materia empieza otro ciclo.','Onto the truck to PLASTICPeople: the material starts another loop.','Al camió i a PLASTICPeople: la matèria comença un altre cicle.'],
 drag:['Arrastra para girar','Drag to swing','Arrossega per girar'],
 release:['Suelta aquí','Release here','Deixa-la aquí'],
 aDone:['F7 · Instalada en {reuse}','F7 · Installed at {reuse}','F7 · Instal·lada a {reuse}'],
 bDone:['F8 · Retorno a planta','F8 · Return to the plant','F8 · Retorn a planta'],
 aNote:['Así lo registró la prueba de campo del 16/10.','This is what the 16/10 field test recorded.','Així ho va registrar la prova de camp del 16/10.'],
 bNote:['En la prueba, {id} pasó por {reuse} y después retornó.','In the test, {id} went to {reuse} first and then returned.','A la prova, {id} va passar per {reuse} i després va retornar.'],
 truck:['Camión · retorno','Truck · return','Camió · retorn'],
 plant:['PLASTICPeople · Vinyols i els Arcs','PLASTICPeople · Vinyols i els Arcs','PLASTICPeople · Vinyols i els Arcs'],
 km:['≈ 116,6 km por carretera desde el Puerto · trayecto no a escala','≈ 116.6 km by road from the Port · route not to scale','≈ 116,6 km per carretera des del Port · trajecte no a escala'],
 rollers:['La materia vuelve a ser plancha','The material becomes a board again','La matèria torna a ser planxa'],
 life:['La plaza vuelve a la vida','Life returns to the square','La plaça torna a la vida'],
};

// Barriers with red/white chevrons (works on the square).
function barrierTexture(){return canvasTexture(256,64,(g,w,h)=>{g.fillStyle='#f4f4ef';g.fillRect(0,0,w,h);g.fillStyle='#d8392b';for(let x=-h;x<w+h;x+=48){g.beginPath();g.moveTo(x,0);g.lineTo(x+24,0);g.lineTo(x+24+h,h);g.lineTo(x+h,h);g.closePath();g.fill()}})}
// A small dog: body, head, tail, four legs that trot.
function dog(color=0xb98a5a){const g=new THREE.Group(),m=new THREE.MeshStandardMaterial({color,roughness:.7}),body=new THREE.Mesh(new THREE.CapsuleGeometry(.0042,.012,3,8),m);body.rotation.z=Math.PI/2;body.position.y=.011;
 const head=new THREE.Mesh(new THREE.SphereGeometry(.0042,10,8),m);head.position.set(.011,.0155,0);const snout=new THREE.Mesh(new THREE.BoxGeometry(.004,.0025,.003),m);snout.position.set(.0152,.0145,0);
 const tail=new THREE.Mesh(new THREE.CylinderGeometry(.0007,.0005,.008,5),m);tail.position.set(-.0105,.0145,0);tail.rotation.z=.9;g.add(body,head,snout,tail);
 const legs=[[.006,.0025],[.006,-.0025],[-.006,.0025],[-.006,-.0025]].map(([x,z])=>{const p=new THREE.Group(),l=new THREE.Mesh(new THREE.CylinderGeometry(.0009,.0009,.008,5),m);l.position.y=-.004;p.add(l);p.position.set(x,.008,z);g.add(p);return p});
 g.traverse(o=>{if(o.isMesh)o.castShadow=true});g.userData.update=ph=>{legs.forEach((l,i)=>l.rotation.z=Math.sin(ph+(i%2?Math.PI:0)+(i>1?Math.PI/2:0))*.6);tail.rotation.x=Math.sin(ph*2)*.4};return g}
// A cyclist: two wheels, a frame and a seated rider pedalling.
function cyclist(color=0x2b7f7a){const g=new THREE.Group(),dark=MATS.dark,wheelGeo=new THREE.TorusGeometry(.0125,.0011,6,24);
 const w1=new THREE.Mesh(wheelGeo,dark),w2=new THREE.Mesh(wheelGeo,dark);w1.position.set(.019,.0135,0);w2.position.set(-.019,.0135,0);
 const frame=new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints([[.019,.0135],[.002,.03],[.002,.03],[-.019,.0135],[-.019,.0135],[-.004,.0135],[-.004,.0135],[.002,.03],[.002,.03],[-.006,.034],[.019,.0135],[.016,.036]].map(([x,y])=>new THREE.Vector3(x,y,0))),new THREE.LineBasicMaterial({color}));
 const rider=person(0xe6b8a2,{seated:true});rider.scale.setScalar(.92);rider.position.set(-.008,-.008,0);rider.rotation.z=-.12;g.add(w1,w2,frame,rider);w1.castShadow=w2.castShadow=true;
 g.userData.update=ph=>{w1.rotation.z=w2.rotation.z=-ph;rider.children[0].rotation.z=Math.PI/2+Math.sin(ph)*.35;rider.children[1].rotation.z=Math.PI/2-Math.sin(ph)*.35};return g}

export function plazaExperience(ctx){
 const{P,TABLE,piece,vars,lang,glow,lights}=ctx,L=k=>fmt(tr(TXT[k],lang),vars),b=base(ctx),{g}=b;
 const Q=P.w+.007,quayZ=-(P.d/2+.03),W=Math.max(.5,P.w*3.3),GH=.0145; // GH: height of the piece hologram (PE + concrete)
 const HOLD=54,DUR=30,END=40+DUR;
 // --- 1 · Moll de Pescadors: water, the llaüt, gulls, people, a kid, a bench ---
 const wat=b.quay(quayZ,W);
 const slotQ=outline(P.w,P.d);slotQ.position.set(Q,TABLE+.0003,0);g.add(slotQ);
 const own=outline(P.w+.004,P.d+.004,GOLD);own.position.y=.0005;g.add(own);
 b.posLabel(`${piece.position} · ${piece.id}`);const qLabel=b.posLabel(piece.reuse||'Q-01',Q);
 const quayL=label({lines:[L('quay')],px:.00012});quayL.position.set(-W*.36,TABLE+.003,quayZ-.018);g.add(quayL);
 const people=b.walkers([{speed:.06,z:P.d*.16,dir:1},{speed:.045,z:-P.d*.37,dir:-1},{speed:.052,z:P.d*.42,dir:1}]);
 const kid=b.walkers([{speed:.07,z:P.d*.3,dir:-1,phase:.6,stride:.03,color:0xf2c46b}])[0];kid.scale.setScalar(.62);
 const seat=bench();seat.position.set(Q*.55,TABLE,quayZ+.016);seat.rotation.y=Math.PI;g.add(seat);
 const sitter=person(0xb8c4d6,{seated:true});sitter.position.set(Q*.55,TABLE-.017,quayZ+.014);sitter.rotation.y=Math.PI/2;g.add(sitter);
 const llaut=sailBoat();llaut.scale.setScalar(.9);g.add(llaut);
 const birds=b.gulls(3);
 // the walkers after ending A: two people, a dog and a cyclist cross the reused piece
 const after=b.walkers([{speed:.05,z:.012,dir:1,span:.42,phase:.1},{speed:.042,z:-.02,dir:-1,span:.42,phase:.55}]);
 const pup=dog();g.add(pup);const bike=cyclist();g.add(bike);
 // --- 2 · works: barriers, the truck reversing in, the tower crane assembling ---
 const barMat=new THREE.MeshStandardMaterial({map:barrierTexture(),roughness:.6}),barGeo=new THREE.BoxGeometry(1,.009,.0022),footGeo=new THREE.BoxGeometry(.003,.0025,.008);
 const barriers=new THREE.Group();g.add(barriers);
 for(const[x,z,len,rot]of[[0,-(P.d/2+.012),P.w+.02,0],[0,P.d/2+.012,P.w+.02,0],[-(P.w/2+.012),0,P.d+.02,Math.PI/2],[P.w/2+.012,0,P.d+.02,Math.PI/2]]){
  const bar=new THREE.Group(),board=new THREE.Mesh(barGeo,barMat);board.scale.x=len;board.position.y=.009;board.castShadow=true;bar.add(board);
  for(const s of[-.45,.45]){const f=new THREE.Mesh(footGeo,MATS.dark);f.position.set(s*len,.0012,0);bar.add(f);const post=new THREE.Mesh(new THREE.BoxGeometry(.0015,.009,.0015),MATS.white);post.position.set(s*len,.0055,0);bar.add(post)}
  bar.position.set(x,0,z);bar.rotation.y=rot;barriers.add(bar)}
 const worksL=label({title:L('works')});g.add(worksL);
 const M=new THREE.Vector3(0,TABLE,quayZ+.004),H=.19,JIB=.2,SEGS=6;
 const targets={P:{x:0,z:0},A:{x:Q,z:0},B:{x:-Q,z:.022}};
 for(const k in targets){const v=targets[k];v.a=Math.atan2(v.z-M.z,v.x-M.x);v.r=Math.hypot(v.x-M.x,v.z-M.z)}
 const crane=new THREE.Group();crane.position.copy(M);g.add(crane);
 const yellow=MATS.yellow,steel=new THREE.LineBasicMaterial({color:0xb08a1d,transparent:true});
 // the mast in SEGS stacked sections, so it can be erected section by section
 const sections=[];{const sh=H/SEGS,legGeo=new THREE.BoxGeometry(.0016,sh,.0016),pts=[];for(let y=0;y<sh;y+=.012)for(const[a,b2]of[[[-1,-1],[1,-1]],[[1,-1],[1,1]],[[1,1],[-1,1]],[[-1,1],[-1,-1]]])pts.push(new THREE.Vector3(a[0]*.0055,y,a[1]*.0055),new THREE.Vector3(b2[0]*.0055,Math.min(sh,y+.012),b2[1]*.0055));
  const braceGeo=new THREE.BufferGeometry().setFromPoints(pts);
  for(let i=0;i<SEGS;i++){const s=new THREE.Group();for(const[x,z]of[[-1,-1],[1,-1],[1,1],[-1,1]]){const leg=new THREE.Mesh(legGeo,yellow);leg.position.set(x*.0055,sh/2,z*.0055);leg.castShadow=true;s.add(leg)}s.add(new THREE.LineSegments(braceGeo,steel));s.position.y=i*sh;crane.add(s);sections.push(s)}}
 const footing=new THREE.Mesh(new THREE.BoxGeometry(.03,.004,.03),MATS.stone);footing.position.y=.002;crane.add(footing);
 const slew=new THREE.Group();slew.position.y=H;crane.add(slew);
 const jibArm=new THREE.Group();slew.add(jibArm); // unfolds from vertical to horizontal
 const jib=new THREE.Mesh(new THREE.BoxGeometry(JIB,.0045,.0045),yellow);jib.position.x=JIB/2;jib.castShadow=true;
 {const pts=[];for(let x=0;x<JIB-.006;x+=.01)pts.push(new THREE.Vector3(x,.0022,0),new THREE.Vector3(x+.01,-.0022,0));jibArm.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts),steel))}
 const trolley=new THREE.Mesh(new THREE.BoxGeometry(.009,.004,.007),MATS.dark);trolley.position.y=-.004;jibArm.add(jib,trolley);
 const cjib=new THREE.Mesh(new THREE.BoxGeometry(.06,.0045,.0045),yellow);cjib.position.x=-.03;
 const weight=new THREE.Mesh(new RoundedBoxGeometry(.018,.012,.012,1,.002),MATS.stone);weight.position.set(-.052,-.006,0);
 const cab=new THREE.Mesh(new RoundedBoxGeometry(.012,.01,.01,1,.002),MATS.white);cab.position.set(.008,-.007,.008);
 const apex=new THREE.Mesh(new THREE.ConeGeometry(.005,.03,4),yellow);apex.position.y=.017;
 const beacon=new THREE.Sprite(new THREE.SpriteMaterial({map:glow,color:0xffa53a,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));beacon.scale.setScalar(.012);beacon.position.y=.034;
 const ties=new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,.032,0),new THREE.Vector3(JIB*.8,0,0),new THREE.Vector3(0,.032,0),new THREE.Vector3(-.055,0,0)]),steel);
 slew.add(cjib,weight,cab,apex,beacon,ties);[cjib,weight,cab,apex].forEach(m=>m.castShadow=true);
 const hook=new THREE.Group(),block=new THREE.Mesh(new RoundedBoxGeometry(.007,.008,.005,1,.0015),MATS.dark),hk=new THREE.Mesh(new THREE.TorusGeometry(.0028,.0008,6,12,Math.PI*1.4),MATS.iron);hk.position.y=-.007;hook.add(block,hk);g.add(hook);
 const lineGeo=(n,color=0xe9e1c8)=>{const geo=new THREE.BufferGeometry().setFromPoints(Array.from({length:n},()=>new THREE.Vector3()));const l=new THREE.LineSegments(geo,new THREE.LineBasicMaterial({color,transparent:true}));l.frustumCulled=false;g.add(l);return l};
 const cable=lineGeo(2),slings=lineGeo(16); // 4 slings × 2 segments (they sag until tensioned)
 // dust puff when the piece leaves its place, and a "clack" pulse when it lands
 const puff=Array.from({length:10},(_,i)=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glow,color:0xe8e0cc,transparent:true,depthWrite:false,opacity:0}));s.userData.a=i/10*Math.PI*2;g.add(s);return s});
 const clack=ribbon(Array.from({length:80},(_,i)=>{const a=i/80*Math.PI*2;return[Math.cos(a),Math.sin(a)]}),.03,true,ribbonMaterial(MINT,0));clack.material.uniforms.uProg.value=1;g.add(clack);
 // --- 3 · the truck (ending B) with its own load, and the reused slab (ending A) ---
 const truck=new THREE.Group();{const cabT=new THREE.Mesh(new RoundedBoxGeometry(.05,.062,.078,2,.008),MATS.white),glass=new THREE.Mesh(new THREE.BoxGeometry(.002,.022,.064),new THREE.MeshStandardMaterial({color:0x1f3b46,roughness:.2,metalness:.3})),deck=new THREE.Mesh(new THREE.BoxGeometry(.18,.006,.088),MATS.dark),rail=new THREE.Mesh(new THREE.BoxGeometry(.18,.004,.002),MATS.yellow);
  cabT.position.set(-.118,.041,0);glass.position.set(-.144,.052,0);deck.position.set(0,.026,0);rail.position.set(0,.031,.044);truck.add(cabT,glass,deck,rail);
  for(const x of[-.11,-.04,.06])for(const z of[-.038,.038]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.013,.013,.01,16),MATS.rubber);w.rotation.x=Math.PI/2;w.position.set(x,.013,z);truck.add(w)}
  truck.traverse(o=>{if(o.isMesh)o.castShadow=true});g.add(truck)}
 const DECK=TABLE+.029,peMat=new THREE.MeshStandardMaterial({map:peTexture(),roughness:.6,color:0xd8edcf}),coMat=new THREE.MeshStandardMaterial({map:ctx.conTex,roughness:.92,color:0xcfd3c6});
 const slabOf=()=>{const s=new THREE.Group(),pe=new THREE.Mesh(new RoundedBoxGeometry(P.w,.0026,P.d,2,.0006),peMat),co=new THREE.Mesh(new RoundedBoxGeometry(P.w,GH-.0026,P.d,2,.0009),coMat);
  pe.position.y=.0013;co.position.y=.0026+(GH-.0026)/2;s.add(pe,co);s.traverse(o=>{if(o.isMesh){o.castShadow=o.receiveShadow=true}});return s};
 const reused=slabOf();reused.position.set(Q,TABLE,0);g.add(reused);
 const load=slabOf();load.position.y=.029;truck.add(load);
 const glints=Array.from({length:14},(_,i)=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glow,color:0xa9f2da,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:0}));s.userData.k=i/14;g.add(s);return s});
 // the road to the plant: a glowing route on the table, the plant with its rollers turning out a new board
 const route=new THREE.CatmullRomCurve3([new THREE.Vector3(targets.B.x,TABLE,targets.B.z),new THREE.Vector3(targets.B.x-.07,TABLE,.06),new THREE.Vector3(targets.B.x-.11,TABLE,.12),new THREE.Vector3(targets.B.x-.15,TABLE,.15)]);
 const rpts=route.getPoints(90),road=ribbon(rpts.map(p=>[p.x,p.z]),.006,false,ribbonMaterial(GOLD,14));road.position.y=TABLE+.0008;g.add(road);
 const plant=new THREE.Group(),PIN=rpts.at(-1);plant.position.set(PIN.x,TABLE,PIN.z);g.add(plant);
 {const pad=new THREE.Mesh(new RoundedBoxGeometry(.08,.004,.05,1,.002),MATS.dark);pad.position.y=.002;plant.add(pad);
  const shed=new THREE.Mesh(new THREE.BoxGeometry(.05,.026,.036),new THREE.MeshStandardMaterial({color:0x2b7f7a,roughness:.6,transparent:true,opacity:.9}));shed.position.set(-.012,.017,-.004);plant.add(shed);
  const roof=new THREE.Mesh(new THREE.BoxGeometry(.054,.003,.04),MATS.white);roof.position.set(-.012,.0315,-.004);plant.add(roof)}
 const rollers=[0,1,2].map(i=>{const r=new THREE.Mesh(new THREE.CylinderGeometry(.0038,.0038,.03,14),MATS.iron);r.rotation.x=Math.PI/2;r.position.set(.012+i*.0085,.0085,.004);plant.add(r);return r});
 const newBoard=new THREE.Mesh(new THREE.BoxGeometry(.034,.0016,.026),peMat);newBoard.position.set(.02,.004,.004);plant.add(newBoard);
 plant.traverse(o=>{if(o.isMesh)o.castShadow=true});
 const plantL=label({title:L('plant'),lines:[L('km')],accent:'#f2c46b'});plantL.position.set(PIN.x,.06,PIN.z);g.add(plantL);
 const rollL=label({lines:[L('rollers')],accent:'#7edbc2'});rollL.position.set(PIN.x+.02,.032,PIN.z+.03);g.add(rollL);
 // --- decision helpers: targets, a dashed preview arc from the hook to the aimed target, labels ---
 const markA=outline(P.w+.01,P.d+.01,MINT,.0024);markA.position.set(Q,TABLE+.0006,0);g.add(markA);
 const markB=outline(.19,.098,GOLD,.0024);g.add(markB);
 const ringA=new THREE.Mesh(new THREE.CylinderGeometry(P.w*.62,P.w*.62,.06,48,1,true),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,
  uniforms:{uOpacity:{value:0},uTime:{value:0},uColor:{value:MINT.clone()}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:'uniform float uOpacity,uTime;uniform vec3 uColor;varying vec2 vUv;void main(){float a=pow(1.-vUv.y,2.)*(.35+.25*sin(vUv.y*30.-uTime*5.))*uOpacity;gl_FragColor=vec4(uColor,a);}'}));
 ringA.scale.z=P.d/P.w;ringA.position.set(Q,TABLE+.03,0);g.add(ringA);
 const PRE=40,preGeo=new THREE.BufferGeometry().setFromPoints(Array.from({length:PRE},()=>new THREE.Vector3()));
 const preview=new THREE.Line(preGeo,new THREE.LineDashedMaterial({color:0xffffff,dashSize:.005,gapSize:.004,transparent:true}));preview.frustumCulled=false;g.add(preview);
 const dragL=label({lines:['⟷  '+L('drag')],accent:'#f2c46b'});g.add(dragL);
 const relL=label({lines:['↓  '+L('release')],accent:'#ffffff'});g.add(relL);
 const aL=label({title:fmt(tr(TXT.aLabel,lang),vars),accent:'#7edbc2'}),bL=label({title:L('truck'),accent:'#f2c46b'});g.add(aL,bL);
 const doneA=label({title:L('aDone'),lines:[L('aNote')]}),doneB=label({title:L('bDone'),lines:[L('bNote')],accent:'#f2c46b'}),lifeL=label({lines:[L('life')]});g.add(doneA,doneB,lifeL);
 for(const l of[worksL,dragL,relL,aL,bL,doneA,doneB,lifeL,plantL,rollL])fadeable(l);
 fadeable(plant);fadeable(barriers);

 // --- interaction ---
 let theta=targets.P.a,thetaTarget=targets.P.a,radius=targets.P.r,dragging=false,choiceAt=0,theta0=0,lastWall=0,lastHover=null,fired={};
 const plane=new THREE.Plane(),hit=new THREE.Vector3(),nrm=new THREE.Vector3(),org=new THREE.Vector3();
 const lo=Math.min(targets.A.a,targets.B.a)-.15,hi=Math.max(targets.A.a,targets.B.a)+.15;
 function groundAngle(rc){g.updateWorldMatrix(true,false);nrm.set(0,1,0).transformDirection(g.matrixWorld);org.setFromMatrixPosition(g.matrixWorld);plane.setFromNormalAndCoplanarPoint(nrm,org);
  if(!rc.ray.intersectPlane(plane,hit))return null;g.worldToLocal(hit);return clamp(Math.atan2(hit.z-M.z,hit.x-M.x),lo,hi)}
 const near=a=>Math.abs(a-targets.A.a)<.2?'A':Math.abs(a-targets.B.a)<.2?'B':null;
 const it={holdAt:HOLD-40,choice:null,hover:null,kick:TXT.kick,prompt:TXT.prompt.map(s=>fmt(s,vars)),
  options:[{id:'A',label:TXT.aLabel.map(s=>fmt(s,vars)),detail:TXT.aDetail,color:'#7edbc2'},{id:'B',label:TXT.bLabel,detail:TXT.bDetail,color:'#f2c46b'}],
  pointer(type,rc){if(it.choice)return false;const a=groundAngle(rc);
   if(type==='down'){if(a===null)return false;dragging=true;thetaTarget=a;return true}
   if(type==='move'&&dragging){if(a!==null)thetaTarget=a;return true}
   if(type==='hover'){if(a!==null)it.hover=near(a);return false}
   if(type==='up'&&dragging){dragging=false;const pick=near(thetaTarget)||near(theta);if(pick){it.choose(pick);return true}return true}
   return false},
  choose(id){if(it.choice)return;it.choice=id;choiceAt=-1;theta0=theta;fired={}},
  reset(){it.choice=null;it.hover=null;dragging=false;theta=thetaTarget=targets.P.a;fired={};lastHover=null}};

 const tmpV=new THREE.Vector3(),warm=new THREE.Color(0xffb46a),dusk=new THREE.Color(0x6a7fb8);
 const once=(k,cond,name)=>{if(cond&&!fired[k]){fired[k]=1;return name}return null};
 return{group:g,duration:DUR,caption:TXT.caption,interaction:it,retOff:[Q,TABLE+.012,0],
  cues:[['water',40.2],['gull',41.4],['horn',42.6],['beep',44.8],['whirr',46.6],['lift',50.4],['gull',52.4]],
  update(t,time,pf,camera,{waiting}){
   const dtw=lastWall?Math.min(.05,time-lastWall):0;lastWall=time;let cue=null;
   if(t<HOLD-.5&&it.choice)it.reset();                       // the visitor went back in the story
   if(t>HOLD+.05&&!it.choice){it.choice='A';choiceAt=HOLD;theta0=theta;fired={}} // skipped ahead: the recorded path
   if(it.choice&&choiceAt<0)choiceAt=t;
   const T0=it.choice?choiceAt:Infinity,A=it.choice==='A',B=it.choice==='B';
   // the square
   wat.userData.update(time,out(seg(t,40.2,42.6))*W*.6);b.fly(birds,time);
   b.walk(people,t,41,45.6);b.walk([kid],t,41.4,45.2);kid.scale.multiplyScalar(.62);
   sitter.visible=t<45.6||(A&&t>T0+7);sitter.rotation.z=.02*Math.sin(time*.8);
   const ls=seg(t,40.4,END-1),lx=lerp(W/2,-W/2,ls);llaut.position.set(lx,TABLE+.004+.0012*Math.sin(time*1.9),quayZ-.095);llaut.rotation.y=Math.PI;llaut.rotation.x=.04*Math.sin(time*1.3);
   llaut.scale.setScalar(.9*Math.max(.001,Math.min(1,Math.min(ls,1-ls)*9)));
   quayL.material.opacity=pf;
   // works: barriers pop in, the truck reverses in (with its beeps), the crane is erected section by section
   const bar=back(seg(t,44.6,45.6))*(A?1-seg(t,T0+6.4,T0+7.4):1);barriers.children.forEach((c,i)=>c.scale.set(1,Math.max(.001,clamp(bar*1.3-i*.08)),1));setFade(barriers,pf*(bar>0?1:0));
   const rev=io(seg(t,44.6,47.4));
   let tp=new THREE.Vector3(lerp(-W*.62,targets.B.x,rev),TABLE,targets.B.z),tdir=null,tScale=1;
   if(B&&t>T0+6.6){const k=io(seg(t,T0+6.6,T0+12.6));route.getPointAt(k,tp);route.getTangentAt(Math.min(.999,k),tmpV);tdir=tmpV;tScale=lerp(1,.45,seg(k,.6,1))}
   truck.position.copy(tp);truck.rotation.y=tdir?Math.atan2(tdir.z,-tdir.x):0;truck.scale.setScalar(tScale);truck.visible=t>44.6&&!(B&&t>T0+13.4);
   markB.position.set(truck.position.x,DECK+.004,truck.position.z);
   const erect=seg(t,46.4,48.8);sections.forEach((s,i)=>{const k=clamp(erect*SEGS-i);s.visible=k>0;s.scale.set(1,Math.max(.001,out(k)),1);s.position.y=i*H/SEGS});
   const unfold=io(seg(t,48.4,49.6)),gone=it.choice?io(seg(t,T0+8.6,T0+10.6)):0;
   slew.visible=erect>=1;jibArm.rotation.z=(1-unfold)*Math.PI*.48;
   crane.visible=erect>0&&gone<1;crane.scale.set(1,Math.max(.001,1-gone),1);
   beacon.material.opacity=crane.visible?.5+.5*Math.max(0,Math.sin(time*6)):0;
   // hook, slings and the piece
   let hookY=H-.012,gy=0,ga=0,carrying=false,tension=1,sway=0;
   if(!it.choice){
    if(t<HOLD){theta=lerp(targets.A.a+.4,targets.P.a,io(seg(t,49.2,50.6)));radius=lerp(.05,targets.P.r,io(seg(t,49.4,50.8)))}
    const lower=io(seg(t,50.6,51.6)),raise=io(seg(t,52.2,53.8)),carryY=.075;
    tension=seg(t,51.6,52.2);hookY=t<52.2?lerp(H-.02,GH+.036,lower):lerp(GH+.03,carryY+GH+.03,raise);
    gy=t<52.2?.0002:lerp(.0002,carryY,raise);ga=t>50.8?1:0;carrying=t>51.4;sway=raise*Math.exp(-(t-52.6)*.7)*Math.sin((t-52.2)*5.2)*.004;
    if(waiting){theta+=(thetaTarget-theta)*Math.min(1,dtw*6);radius=lerp(radius,theta<targets.P.a?lerp(targets.P.r,targets.A.r,clamp((targets.P.a-theta)/(targets.P.a-targets.A.a))):lerp(targets.P.r,targets.B.r,clamp((theta-targets.P.a)/(targets.B.a-targets.P.a))),Math.min(1,dtw*6));
     it.hover=dragging?near(thetaTarget):it.hover;hookY=carryY+GH+.03+.002*Math.sin(time*2);gy=carryY+.002*Math.sin(time*1.7);sway=.0025*Math.sin(time*1.3)}
   }else{
    const dest=targets[it.choice],sw=io(seg(t,T0,T0+2.6)),low=io(seg(t,T0+2.8,T0+4.6)),rel=io(seg(t,T0+4.9,T0+6.2));
    theta=lerp(theta0,dest.a,sw);radius=lerp(radius,dest.r,Math.min(1,sw*1.2));
    const floor=A?TABLE:DECK,carryY=.075;gy=lerp(carryY,floor,low);hookY=t<T0+4.9?gy+GH+.03:lerp(floor+GH+.03,H-.02,rel);carrying=t<T0+4.9;ga=1;
    sway=Math.sin((t-T0)*4.4)*.005*(1-sw)*(1-low)+Math.sin((t-T0)*3)*.003*sw*(1-low);tension=1-seg(t,T0+4.7,T0+5.2);
   }
   if(it.hover!==lastHover){if(waiting&&it.hover)cue='chime';lastHover=it.hover}
   slew.rotation.y=-theta;trolley.position.x=radius;
   const hx=M.x+Math.cos(theta)*radius,hz=M.z+Math.sin(theta)*radius;hook.position.set(hx,TABLE+hookY,hz);hook.visible=crane.visible&&slew.visible;
   const cp=cable.geometry.attributes.position;cp.setXYZ(0,hx,TABLE+H-.004,hz);cp.setXYZ(1,hx,TABLE+hookY,hz);cp.needsUpdate=true;cable.visible=hook.visible;
   // the hologram hangs from the hook (with a little sway) while carried
   let gp=[hx+sway,TABLE+gy,hz+sway*.4];if(!it.choice&&t<52.2)gp=[0,.0002,0];
   if(B&&t>T0+4.6)gp=[truck.position.x,DECK,truck.position.z];
   if(A&&t>T0+4.6)gp=[Q,TABLE,0];
   const sp=slings.geometry.attributes.position,top=gp[1]+GH;let k=0;
   for(const[sx,sz]of[[-1,-1],[1,-1],[1,1],[-1,1]]){const cx=gp[0]+sx*P.w*.42,cz=gp[2]+sz*P.d*.42,cy=top,hy=TABLE+hookY-.006,mx=(hx+cx)/2,mz=(hz+cz)/2,my=(hy+cy)/2-(1-tension)*.018;
    sp.setXYZ(k++,hx,hy,hz);sp.setXYZ(k++,mx,my,mz);sp.setXYZ(k++,mx,my,mz);sp.setXYZ(k++,cx,cy,cz)}
   sp.needsUpdate=true;slings.visible=carrying&&ga>0&&hook.visible;
   // dust when it leaves P-14
   const pu=seg(t,52.2,53.6);puff.forEach(s=>{const a=s.userData.a,r=P.w*.45+pu*.03;s.position.set(Math.cos(a)*r,.004+pu*.01,Math.sin(a)*r*P.d/P.w);s.material.opacity=pf*Math.sin(pu*Math.PI)*.45;s.scale.setScalar(.012+pu*.02)});
   // decision: targets, dashed preview arc, labels
   const dec=!it.choice&&t>=HOLD-.6,aim=it.hover||(dragging?null:null),pick=near(thetaTarget);
   markA.material.uniforms.uOpacity.value=pf*(dec?.5+.5*(it.hover==='A'?1:.35+.25*Math.sin(time*5)):0);markB.material.uniforms.uOpacity.value=pf*(dec?.5+.5*(it.hover==='B'?1:.35+.25*Math.sin(time*5+1)):0);
   preview.visible=dec&&!!(pick||dragging);
   if(preview.visible){const tg=pick?targets[pick]:{x:M.x+Math.cos(thetaTarget)*targets.P.r,z:M.z+Math.sin(thetaTarget)*targets.P.r},ty=pick==='B'?DECK+.02:TABLE+.02,pa=preGeo.attributes.position;
    for(let i=0;i<PRE;i++){const u=i/(PRE-1);pa.setXYZ(i,lerp(hx,tg.x,u),lerp(TABLE+gy,ty,u)+Math.sin(u*Math.PI)*.03,lerp(hz,tg.z,u))}pa.needsUpdate=true;preview.computeLineDistances();
    preview.material.color.set(pick==='A'?0x7edbc2:pick==='B'?0xf2c46b:0xffffff);preview.material.opacity=pf*(.6+.4*Math.sin(time*8))}
   setFade(aL,dec?pf:0);aL.position.set(Q,.04,0);setFade(bL,dec||(B&&t<T0+7)?pf:0);bL.position.set(truck.position.x,.09,truck.position.z);
   setFade(dragL,dec&&!dragging?pf*(.6+.4*Math.sin(time*3)):0);dragL.position.set(hx,TABLE+hookY+.025,hz);
   setFade(relL,dec&&dragging&&pick?pf:0);relL.position.set(hx,TABLE+hookY+.025,hz);
   setFade(worksL,win(t,45,52.6,.5,.6));worksL.position.set(0,.11,0);
   // ending A: the clack, the F7 light ring, life returns (people, a dog, a bike) under golden light
   const solid=A?io(seg(t,T0+5,T0+6.4)):0;reused.visible=solid>0;reused.scale.y=Math.max(.001,solid);
   const ck=A?seg(t,T0+4.6,T0+5.6):0;clack.visible=ck>0&&ck<1;clack.position.set(Q,TABLE+.0008,0);clack.scale.set(P.w*.6+ck*P.w*.5,1,P.d*.6+ck*P.d*.5);clack.material.uniforms.uOpacity.value=pf*(1-ck);
   cue=cue||once('clack',A&&t>T0+4.6,'join')||once('f7',A&&t>T0+6,'chime');
   ringA.visible=A&&t>T0+5.6;ringA.material.uniforms.uOpacity.value=pf*win(t,T0+5.6,END,.8,1.2);ringA.material.uniforms.uTime.value=time;ringA.scale.y=Math.max(.001,out(seg(t,T0+5.6,T0+6.8)));ringA.position.y=TABLE+.03*ringA.scale.y;
   setFade(doneA,A?win(t,T0+6,END,.6,.8):0);doneA.position.set(Q,.075,0);
   setFade(lifeL,A?win(t,T0+9,END,.6,.8):0);lifeL.position.set(Q*.4,.045,P.d*.6);
   for(const f of after){f.visible=A;if(!A)continue;b.walk([f],t,T0+7,END);f.position.x+=Q*.6;f.position.y=Math.abs(f.position.x-Q)<P.w/2&&Math.abs(f.position.z)<P.d/2?.0008:f.position.y}
   pup.visible=bike.visible=A&&t>T0+7.4;
   if(pup.visible){const s=seg(t,T0+7.4,END),x=lerp(-.1,Q+.12,s);pup.position.set(x+Q*.05,b.ground(x,.03)+.0004,.03);pup.userData.update((t-T0)*14);pup.scale.setScalar(Math.min(1,s*10,(1-s)*10))}
   if(bike.visible){const s=seg(t,T0+8.6,END-.4),x=lerp(Q+P.w*.9,-.14,s);bike.position.set(x,b.ground(x,-.012),-.012);bike.rotation.y=Math.PI;bike.userData.update((t-T0)*9);bike.scale.setScalar(Math.max(.001,Math.min(1,s*10,(1-s)*10)))}
   // ending B: onto the truck, the road to PLASTICPeople lights up, rollers turn the material into a new board
   load.visible=B&&t>T0+5.2;
   const drive=B?seg(t,T0+6.6,T0+12.6):0;road.visible=B&&t>T0+6;road.material.uniforms.uProg.value=io(drive);road.material.uniforms.uOpacity.value=pf*win(t,T0+6,END,.6,1.2);
   const pl=B?win(t,T0+9.4,END,.8,1.2):0;setFade(plant,pl);plant.scale.setScalar(Math.max(.001,back(seg(t,T0+9.4,T0+10.6))));
   rollers.forEach(r=>r.rotation.y=-time*4);const nb=B?seg(t,T0+12.6,T0+16):0;newBoard.position.x=.012+nb*.04;newBoard.visible=nb>0;
   setFade(plantL,pl);setFade(rollL,B?win(t,T0+12.8,END,.6,.8):0);
   setFade(doneB,B?win(t,T0+6.4,END,.6,.8):0);doneB.position.set(-W*.3,.1,.05);
   glints.forEach(s=>{const k2=(time*.9+s.userData.k)%1,o=B&&drive>0&&drive<1?1:0;s.material.opacity=pf*o*(1-k2)*.8;s.position.set(truck.position.x+(k2-.3)*.06,DECK+.02+k2*.03,truck.position.z+(s.userData.k-.5)*.05);s.scale.setScalar(.006+k2*.008)});
   cue=cue||once('go',B&&t>T0+6.6,'engine')||once('arrive',B&&t>T0+12.6,'chime');
   // golden hour over the square after the decision
   const gold=it.choice?seg(t,T0+7,T0+11)*(1-seg(t,END-1.2,END+1)):0;
   if(gold>0){lights.key.color.lerp(warm,.75*gold);lights.key.intensity*=1-.18*gold;lights.hemi.color.lerp(warm,.25*gold);lights.hemi.groundColor.lerp(dusk,.4*gold);lights.fill.color.lerp(dusk,.6*gold)}
   qLabel.material.opacity=pf;
   const ret=B?[PIN.x+.02,TABLE+.006,PIN.z]:[Q,TABLE+.012,0];
   const ghostEnd=A?1-io(seg(t,T0+5.4,T0+6.6)):B?1-io(seg(t,T0+5,T0+5.6)):1;
   return{ghost:{pos:gp,a:t<50.8?0:Math.min(ga,ghostEnd)*win(t,50.8,END+1.6,.5,1.4)},retOff:ret,cue};
  }};
}

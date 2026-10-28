// «La saca»: the batch bag LOTE-BCN-PE-001, the shared origin of the 20 pieces — told with the port's own story.
//  1 Refit (Port Vell): a yacht on its cradle; two workers pull the PE cover off.
//  2 The Port's shed (Moll de l'Energia): the cover is shredded, washed and bagged — into this bag;
//    «El Puerto, una mina de plástico» rises as a data hologram (orders of magnitude).
//  3 Batch: the bag is read under the antenna arch (F0), its passport opens and the batch travels by road
//    to PLASTICPeople in Vinyols i els Arcs.
//  4 Choose (interactive): drag the flakes into a mould — rollers press the board, concrete is poured, the piece
//    is born and starts its first life (promenade, roadway or quay edge).
//  5 Loop: the material flies back into the bag.
// Anchored with gravity as up (the QR is on the top of the bag). Origin = QR centre; props stay around the bag,
// on a holographic floor at the label's height.
import {THREE,RoundedBoxGeometry,MINT,GOLD,PE_COLORS,clamp,seg,io,out,back,win,lerp,rng,peTexture,concreteTexture,valueNoise,tarpTexture,noiseTexture,glowTexture,canvasTexture,label,fadeable,setFade,ribbonMaterial,ribbon,outline,water,person,palm,truck,bigBag,bench,gull,MATS,motorBoat} from './kit.mjs?v=8.0';
import {FLAKE_VS,FLAKE_FS} from './scene.mjs?v=8.0';
import {T,tr,fmt,num} from './text.mjs?v=8.0';

const ZONE_COLORS={paseo:'#9fd8c5',vial:'#f2c46b',plataforma:'#e58f4f',plaza:'#7edbc2',borde:'#6fb5d8'};
// The three moulds (sizes at 1:40 around the bag; thickness exaggerated like the pieces' material chapter).
const MOULDS=[
 {id:'paseo',ids:'M-01 … M-06',m:[3,3],canto:80,a:-2.35},
 {id:'vial',ids:'M-07 … M-09',m:[6,3],canto:220,a:-1.57},
 {id:'borde',ids:'M-19 · M-20',m:[1.5,1.5],canto:80,a:-.79}];
// Plastic waste in the port by type, t/year (order of magnitude, ≈2.300 t/year in total).
const MINE=[['Film LDPE',815,'#7edbc2'],[['Mixto','Mixed','Mixt'],512,'#9fd8c5'],['PP',466,'#f2c46b'],['HDPE',349,'#e58f4f'],['EPS/PS',116,'#6fb5d8'],['PET',70,'#d9c7a7']];
const TXT={
 ch:[
  {kick:['01 · REFIT','01 · REFIT','01 · REFIT'],title:['Las lonas que protegían los barcos.','The tarps that protected the boats.','Les lones que protegien els vaixells.'],text:['Zona de refit del Port Vell: al terminar cada trabajo, la funda de PE se retira del barco.','Port Vell refit area: when each job ends, the PE cover comes off the boat.','Zona de refit del Port Vell: en acabar cada treball, la funda de PE es retira del vaixell.']},
  {kick:['02 · NAVE DEL PUERTO','02 · THE PORT’S SHED','02 · NAU DEL PORT'],title:['Triturar, lavar, ensacar.','Shred, wash, bag.','Triturar, rentar, ensacar.'],text:['En la nave del Moll de l’Energia la lona se tritura en escama, se lava y llena esta saca. El Puerto es una mina de plástico.','In the shed on Moll de l’Energia the tarp is shredded into flakes, washed and fills this bag. The port is a plastic mine.','A la nau del Moll de l’Energia la lona es tritura en escama, es renta i omple aquesta saca. El Port és una mina de plàstic.']},
  {kick:['03 · LOTE','03 · BATCH','03 · LOT'],title:['Una saca, un lote, un registro.','One bag, one batch, one record.','Una saca, un lot, un registre.'],text:['El arco de antenas lee la saca (F0): nace el lote {batch}. Viaja por carretera hasta PLASTICPeople, en Vinyols i els Arcs.','The antenna arch reads the bag (F0): batch {batch} is born. It travels by road to PLASTICPeople, in Vinyols i els Arcs.','L’arc d’antenes llegeix la saca (F0): neix el lot {batch}. Viatja per carretera fins a PLASTICPeople, a Vinyols i els Arcs.']},
  {kick:['04 · ELIGE','04 · CHOOSE','04 · TRIA'],title:['Un lote, muchas vidas.','One batch, many lives.','Un lot, moltes vides.'],text:['La misma escama puede ser paseo, vial o borde del muelle. Tú eliges cuál nace ahora.','The same flakes can become promenade, roadway or quay edge. You choose which one is born now.','La mateixa escama pot ser passeig, vial o vora del moll. Tu tries quina neix ara.']},
  {kick:['05 · CICLO','05 · LOOP','05 · CICLE'],title:['Todo vuelve a empezar aquí.','It all starts again here.','Tot torna a començar aquí.'],text:['Cuando una pieza retorna, su materia puede volver a una saca con nuevo lote y la misma memoria.','When a piece returns, its material can go back into a bag with a new batch and the same memory.','Quan una peça retorna, la seva matèria pot tornar a una saca amb un nou lot i la mateixa memòria.']},
 ],
 short:[['Refit','Refit','Refit'],['Nave','Shed','Nau'],['Lote','Batch','Lot'],['Elige','Choose','Tria'],['Ciclo','Loop','Cicle']],
 refit:['Zona de refit · Port Vell','Refit area · Port Vell','Zona de refit · Port Vell'],
 cover:['Funda de PE','PE cover','Funda de PE'],
 shed:['Nave del Puerto','The Port’s shed','Nau del Port'],shedSub:['Moll de l’Energia · triturado y lavado','Moll de l’Energia · shredding and washing','Moll de l’Energia · triturat i rentat'],
 shredder:['Trituradora','Shredder','Trituradora'],wash:['Lavado','Washing','Rentat'],
 mine:['El Puerto, una mina de plástico','The port, a plastic mine','El Port, una mina de plàstic'],
 mineLines:[['≈ 2.300 t/año de residuo plástico','302 empresas · orden de magnitud','≈ 200 t/año de lonas de PE · estimación'],['≈ 2,300 t/year of plastic waste','302 companies · order of magnitude','≈ 200 t/year of PE tarps · estimate'],['≈ 2.300 t/any de residu plàstic','302 empreses · ordre de magnitud','≈ 200 t/any de lones de PE · estimació']],
 arch:['Arco de antenas · lectura F0','Antenna arch · reading F0','Arc d’antenes · lectura F0'],
 plant:['PLASTICPeople · Vinyols i els Arcs','PLASTICPeople · Vinyols i els Arcs','PLASTICPeople · Vinyols i els Arcs'],plantLines:[['≈ 114 km por carretera','ruta ilustrativa'],['≈ 114 km by road','illustrative route'],['≈ 114 km per carretera','ruta il·lustrativa']],
 port:['Port de Barcelona','Port de Barcelona','Port de Barcelona'],
 estimated:['estimado','estimated','estimat'],
 kick:['TÚ DECIDES','YOUR CALL','TU DECIDEIXES'],
 prompt:['¿Qué construyes con este lote? Arrastra la escama hasta un molde.','What will you build with this batch? Drag the flakes into a mould.','Què construeixes amb aquest lot? Arrossega l’escama fins a un motlle.'],
 drag:['Arrastra la escama','Drag the flakes','Arrossega l’escama'],
 opt:{paseo:[['Paseo','Promenade','Passeig'],['3 × 3 m · para caminar junto al agua.','3 × 3 m · for walking by the water.','3 × 3 m · per caminar vora l’aigua.']],
  vial:[['Vial','Roadway','Vial'],['6 × 3 m · 220 mm de hormigón para el tráfico.','6 × 3 m · 220 mm of concrete for traffic.','6 × 3 m · 220 mm de formigó per al trànsit.']],
  borde:[['Borde','Quay edge','Vora'],['1,5 × 1,5 m · en el límite con el mar.','1.5 × 1.5 m · right at the sea’s edge.','1,5 × 1,5 m · al límit amb el mar.']]},
 press:['Rodillos: la escama se hace plancha','Rollers: flakes become a board','Corrons: l’escama es fa planxa'],
 pour:['Capa de hormigón','Concrete layer','Capa de formigó'],
 born:['Nace una pieza de {zone}','A {zone} piece is born','Neix una peça de {zone}'],
 bornLines:[['{m} m · PE 20 mm + hormigón {canto} mm','{ids} · lote {batch}'],['{m} m · PE 20 mm + concrete {canto} mm','{ids} · batch {batch}'],['{m} m · PE 20 mm + formigó {canto} mm','{ids} · lot {batch}']],
 note:['Del mismo lote salieron las 20 piezas del muelle.','The 20 pieces of the quay came from this same batch.','Del mateix lot van sortir les 20 peces del moll.'],
};
const TRI=()=>{const g=new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute([-1,0,-.7,1,0,-.5,-.1,0,1],3));g.computeVertexNormals();return g};
/** Clone the materials of a prop so fading it never touches the shared kit materials. */
const own=o=>{o.traverse(m=>{if(m.isMesh||m.isLine)m.material=Array.isArray(m.material)?m.material.map(x=>x.clone()):m.material.clone()});return o};
/** Particles that travel along a curve (chips in the shed, concrete from the chute…). */
function flow(N,palette,size,seed){
 const mesh=new THREE.InstancedMesh(TRI(),new THREE.MeshStandardMaterial({roughness:.6,side:THREE.DoubleSide}),N),r=rng(seed),c=new THREE.Color(),sd=Array.from({length:N},()=>[r(),r(),r(),r()]);
 for(let i=0;i<N;i++)mesh.setColorAt(i,c.set(palette[i%palette.length]));mesh.frustumCulled=false;
 const m=new THREE.Matrix4(),q=new THREE.Quaternion(),v=new THREE.Vector3(),s=new THREE.Vector3(),p=new THREE.Vector3();
 mesh.userData.draw=(curve,on,time,speed=.5,jit=.004)=>{mesh.visible=on>0;if(!on)return;for(let i=0;i<N;i++){const[a,b,cc,d]=sd[i],u=(time*speed+a)%1;curve.getPointAt(u,p);p.x+=(b-.5)*jit;p.z+=(cc-.5)*jit;p.y+=(d-.5)*jit*.5;
  q.setFromAxisAngle(v.set(b-.5,1,cc-.5).normalize(),time*(3+d*4)+a*20);s.setScalar(size*(.6+d)*on*Math.min(1,Math.sin(u*Math.PI)*3));m.compose(p,q,s);mesh.setMatrixAt(i,m)}mesh.instanceMatrix.needsUpdate=true};
 return mesh;
}
function yacht(){
 const g=new THREE.Group(),L=.15,B=.042,sh=new THREE.Shape();
 sh.moveTo(-L/2,-B/2);sh.lineTo(L*.2,-B/2);sh.quadraticCurveTo(L*.44,-B*.32,L/2,0);sh.quadraticCurveTo(L*.44,B*.32,L*.2,B/2);sh.lineTo(-L/2,B/2);sh.closePath();
 const hg=new THREE.ExtrudeGeometry(sh,{depth:.022,bevelEnabled:true,bevelSize:.0018,bevelThickness:.0018,bevelSegments:2});hg.rotateX(Math.PI/2);hg.translate(0,.022,0);
 const hull=new THREE.Mesh(hg,MATS.white),boot=new THREE.Mesh(hg.clone(),new THREE.MeshStandardMaterial({color:0x14324a,roughness:.5}));boot.scale.set(1.01,.18,1.04);
 const t1=new THREE.Mesh(new RoundedBoxGeometry(.075,.013,.034,2,.004),MATS.white),t2=new THREE.Mesh(new RoundedBoxGeometry(.042,.011,.027,2,.004),MATS.white);t1.position.set(-.012,.029,0);t2.position.set(-.018,.041,0);
 const glass=new THREE.MeshStandardMaterial({color:0x1d3540,roughness:.15,metalness:.4}),w1=new THREE.Mesh(new THREE.BoxGeometry(.068,.004,.0348),glass),w2=new THREE.Mesh(new THREE.BoxGeometry(.036,.0035,.0275),glass);w1.position.set(-.012,.031,0);w2.position.set(-.018,.042,0);
 const mast=new THREE.Mesh(new THREE.CylinderGeometry(.0008,.0008,.03,6),MATS.dark);mast.position.set(-.022,.06,0);
 g.add(hull,boot,t1,t2,w1,w2,mast);
 const cradle=new THREE.Group();for(const x of[-.05,.03])for(const z of[-1,1]){const post=new THREE.Mesh(new THREE.BoxGeometry(.004,.012,.004),MATS.iron);post.position.set(x,-.006,z*.016);cradle.add(post)}
 for(const x of[-.05,.03]){const bar=new THREE.Mesh(new THREE.BoxGeometry(.006,.003,.04),MATS.iron);bar.position.set(x,-.0115,0);cradle.add(bar)}
 g.add(cradle);g.traverse(o=>{if(o.isMesh)o.castShadow=true});return own(g);
}

export function createBagScene({lang='es',passport=null,catalog=[],shadows=true}={}){
 const root=new THREE.Group(),stage=new THREE.Group();root.add(stage);
 const vars={batch:passport?.identity?.batchReference||'LOTE-BCN-PE-001',kg:num(passport?.metrics?.estimatedMassKg??700,lang)},L=k=>fmt(tr(T[k],lang),vars),X=k=>fmt(tr(TXT[k],lang),vars);
 const cues=[];let t=0,paused=false,lastT=0;
 stage.add(new THREE.HemisphereLight(0xf2fff4,0x1b3940,1.6));
 const key=new THREE.DirectionalLight(0xfff3dc,2.4);key.position.set(.12,.34,.2);stage.add(key,key.target);
 if(shadows){key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-.32,right:.32,top:.32,bottom:-.32,near:.05,far:1.2});key.shadow.bias=-.0004}
 const glow=glowTexture(),USE_END=66,RS=USE_END-53;
 const TL={loopStart:5,loopEnd:USE_END+10,chapters:[5,17,29,40,USE_END],useEnd:USE_END,hold:42};

 // Holographic floor around the bag (the real bag stays clear in the middle).
 const floor=new THREE.Mesh(new THREE.RingGeometry(.075,.31,128,6),new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{uOpacity:{value:0},uTime:{value:0},uColor:{value:MINT.clone()}},
  vertexShader:'varying vec2 vP;void main(){vP=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:'uniform float uOpacity,uTime;uniform vec3 uColor;varying vec2 vP;void main(){float r=length(vP),a=atan(vP.y,vP.x);float c=abs(fract(r/.03+.5)-.5)*.03;float l1=1.-smoothstep(.0004,.0012,c);float s=abs(fract(a/.2618+.5)-.5)*.2618*r;float l2=1.-smoothstep(.0003,.001,s);float sweep=pow(max(0.,cos(a-uTime*.7)),24.)*.5;float e=smoothstep(.31,.22,r)*smoothstep(.075,.1,r);float al=(.05+.45*max(l1,l2*.55)+sweep*.25)*e*uOpacity;if(al<.003)discard;gl_FragColor=vec4(uColor,al);}'}));
 floor.rotation.x=-Math.PI/2;floor.position.y=-.0015;stage.add(floor);
 const halo=ribbon(Array.from({length:120},(_,i)=>{const a=i/120*Math.PI*2;return[Math.cos(a)*.035,Math.sin(a)*.035]}),.0016,true,ribbonMaterial(MINT,18));halo.position.y=.001;stage.add(halo);
 const title=fadeable(label({title:tr(T.bagTitle,lang),lines:[vars.batch,L('piecesOfBatch')]}));title.position.set(0,.05,0);stage.add(title);

 // --- 1 · refit: a yacht on its cradle, a PE cover, two workers ---
 const Y=new THREE.Vector3(.19,.012,-.07),YR=-.35,boat=yacht();boat.position.copy(Y);boat.rotation.y=YR;stage.add(fadeable(boat));
 const workers=[own(person(0xe3b53a)),own(person(0xd9792b))];workers.forEach(w=>{w.scale.setScalar(.24);stage.add(w);fadeable(w)});
 const refitL=fadeable(label({title:X('refit'),accent:'#6fb5d8'}));stage.add(refitL);
 const bird=own(gull());stage.add(bird);fadeable(bird);
 const noise=valueNoise(77),TW=.19,TD=.068;
 const tarpGeo=new THREE.PlaneGeometry(1,1,44,22);tarpGeo.rotateX(-Math.PI/2);const tarpBase=Float32Array.from(tarpGeo.attributes.position.array);
 const tarpMat=new THREE.MeshStandardMaterial({map:tarpTexture(),alphaMap:noiseTexture(noise),alphaTest:.001,side:THREE.DoubleSide,roughness:.78});
 const tarp=new THREE.Mesh(tarpGeo,tarpMat);tarp.castShadow=true;tarp.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,alphaMap:tarpMat.alphaMap,alphaTest:.001});stage.add(tarp);
 const wave=(x,z,w)=>.0034*Math.sin(x*11+w*2.1)+.0022*Math.sin(z*15-w*1.6+x*4)+.0014*Math.sin((x+z)*21+w*2.9);
 // Local shape: draped over the hull (soft dome hanging on the sides) -> flat and waving in the air -> folded into the hopper.
 function shapeTarp(drape,fold,time){const p=tarpGeo.attributes.position.array,sc=1-fold*.75;for(let i=0;i<p.length;i+=3){const x=tarpBase[i],z=tarpBase[i+2],dome=Math.max(0,1-(x*x*2.4+z*z*7))*.03;
  p[i]=x*TW*sc;p[i+1]=wave(x,-z,time)*(1-drape)*(1-fold)+(dome-.03)*drape-fold*Math.abs(x)*.02;p[i+2]=z*TD*sc}tarpGeo.attributes.position.needsUpdate=true;tarpGeo.computeVertexNormals()}
 const tarpLabel=fadeable(label({title:X('cover')}));stage.add(tarpLabel);

 // --- 2 · the Port's shed: shredder, washing tank, chips into the bag; the plastic mine ---
 const S=new THREE.Vector3(-.17,0,-.075),shed=new THREE.Group();shed.position.copy(S);stage.add(shed);
 {const holo=new THREE.LineBasicMaterial({color:MINT,transparent:true,opacity:.55});
  const slab=new THREE.Mesh(new THREE.BoxGeometry(.17,.003,.11),new THREE.MeshStandardMaterial({color:0x52605f,roughness:.9}));slab.position.y=.0015;slab.receiveShadow=true;shed.add(slab);
  const frame=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(.17,.075,.11)),holo);frame.position.y=.0375;shed.add(frame);
  const truss=[];for(let k=0;k<=4;k++){const x=-.085+k*.0425;truss.push(new THREE.Vector3(x,.075,-.055),new THREE.Vector3(x,.092,0),new THREE.Vector3(x,.092,0),new THREE.Vector3(x,.075,.055))}
  shed.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(truss),holo));
  const wall=new THREE.Mesh(new THREE.PlaneGeometry(.17,.075),new THREE.MeshBasicMaterial({color:MINT,transparent:true,opacity:.07,side:THREE.DoubleSide,depthWrite:false}));wall.position.set(0,.0375,-.055);shed.add(wall)}
 const shredder=new THREE.Group();shredder.position.set(.035,0,-.01);shed.add(shredder);
 const body=new THREE.Mesh(new RoundedBoxGeometry(.04,.032,.034,2,.003),new THREE.MeshStandardMaterial({color:0x2b7f7a,roughness:.55}));body.position.y=.016;
 const hopper=new THREE.Mesh(new THREE.CylinderGeometry(.03,.017,.02,4,1,true),new THREE.MeshStandardMaterial({color:0x8a9592,roughness:.5,metalness:.4,side:THREE.DoubleSide}));hopper.rotation.y=Math.PI/4;hopper.position.y=.042;
 const blades=[0,1].map(k=>{const b=new THREE.Group(),core=new THREE.Mesh(new THREE.CylinderGeometry(.0055,.0055,.026,10),MATS.iron);core.rotation.z=Math.PI/2;b.add(core);
  for(let i=0;i<6;i++){const tooth=new THREE.Mesh(new THREE.BoxGeometry(.0025,.014,.003),MATS.iron);tooth.position.x=-.011+i*.0044;tooth.rotation.x=i*1.05;b.add(tooth)}b.position.set(0,.034,(k?1:-1)*.006);shredder.add(b);return b});
 const motor=new THREE.Mesh(new THREE.CylinderGeometry(.007,.007,.012,14),MATS.dark);motor.rotation.z=Math.PI/2;motor.position.set(.026,.018,0);
 shredder.add(body,hopper,motor);
 const tank=new THREE.Group();tank.position.set(-.035,0,.012);shed.add(tank);
 {const tm=new THREE.MeshStandardMaterial({color:0xb9c3c0,roughness:.4,metalness:.3,transparent:true,opacity:.55,side:THREE.DoubleSide});
  for(const[x,z,w,d]of[[0,-.017,.05,.002],[0,.017,.05,.002],[-.025,0,.002,.034],[.025,0,.002,.034]]){const p=new THREE.Mesh(new THREE.BoxGeometry(w,.022,d),tm);p.position.set(x,.011,z);tank.add(p)}
  const wat=new THREE.Mesh(new THREE.PlaneGeometry(.048,.032),new THREE.MeshStandardMaterial({color:0x2f8c99,roughness:.1,metalness:.2,transparent:true,opacity:.8}));wat.rotation.x=-Math.PI/2;wat.position.y=.017;tank.add(wat);tank.userData.water=wat}
 const bubbles=Array.from({length:10},(_,i)=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glow,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:0,color:0xd9fbff}));s.scale.setScalar(.004);s.userData.k=i/10;tank.add(s);return s});
 const shedL=fadeable(label({title:X('shed'),lines:[X('shedSub')]}));shedL.position.set(S.x,.11,S.z);stage.add(shedL);
 const partL=[fadeable(label({lines:[X('shredder')],px:.0001})),fadeable(label({lines:[X('wash')],px:.0001}))];stage.add(...partL);
 fadeable(shed);
 const chipColors=['#eef1ec','#2a6ba8','#d8dfdc',...PE_COLORS],SHRED_OUT=new THREE.Vector3(S.x+.035,.006,S.z+.01),TANK=new THREE.Vector3(S.x-.035,.02,S.z+.012);
 const toTank=new THREE.CatmullRomCurve3([SHRED_OUT,new THREE.Vector3(S.x+.012,.03,S.z+.02),new THREE.Vector3(S.x-.03,.03,S.z+.014),TANK]);
 const toBag=new THREE.CatmullRomCurve3([new THREE.Vector3(TANK.x+.02,.022,TANK.z+.012),new THREE.Vector3(S.x+.03,.07,S.z+.07),new THREE.Vector3(-.07,.07,-.01),new THREE.Vector3(-.015,.03,0),new THREE.Vector3(0,.006,0)]);
 const chips=flow(260,chipColors,.0011,41),washed=flow(320,PE_COLORS,.0011,43);stage.add(chips,washed);
 const fill=new THREE.Mesh(new THREE.CircleGeometry(.026,40),new THREE.MeshStandardMaterial({map:peTexture(),roughness:.7,transparent:true}));fill.rotation.x=-Math.PI/2;fill.position.y=.0015;stage.add(fadeable(fill));
 // the plastic mine: six columns by type, behind the bag
 const mine=new THREE.Group();mine.position.set(.01,0,-.19);stage.add(mine);
 const bars=MINE.map(([n,v,c],i)=>{const h=v/815*.085,g=new THREE.Group(),m=new THREE.Mesh(new THREE.BoxGeometry(.018,1,.018),new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:.35,roughness:.4,transparent:true,opacity:.85}));m.position.y=.5;g.add(m);
  const edge=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(.018,1,.018)),new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.5}));edge.position.y=.5;g.add(edge);
  g.position.x=-.0625+i*.025;g.userData.h=h;mine.add(g);const l=label({lines:[`${tr(Array.isArray(n)?n:[n,n,n],lang)} · ${num(v,lang)}`],accent:c,px:.000085});l.position.set(g.position.x,0,0);mine.add(l);g.userData.l=l;return g});
 const mineL=label({title:X('mine'),lines:tr(TXT.mineLines,lang),accent:'#f2c46b',px:.00012});mineL.position.set(0,.115,0);mine.add(mineL);fadeable(mine);

 // --- 3 · batch: the antenna arch reads the bag (F0), the passport, the road to PLASTICPeople ---
 const arch=new THREE.Group();stage.add(arch);
 {const am=new THREE.MeshStandardMaterial({color:0xdfe7e4,roughness:.5,metalness:.3});for(const x of[-.075,.075]){const p=new THREE.Mesh(new THREE.BoxGeometry(.006,.1,.012),am);p.position.set(x,.05,0);p.castShadow=true;arch.add(p);const ant=new THREE.Mesh(new THREE.BoxGeometry(.002,.03,.01),new THREE.MeshStandardMaterial({color:0x1d3540}));ant.position.set(x*.94,.06,0);arch.add(ant)}
  const beam=new THREE.Mesh(new THREE.BoxGeometry(.156,.006,.012),am);beam.position.y=.1;arch.add(beam)}
 const waves=[0,1,2].map(i=>{const r=new THREE.Mesh(new THREE.TorusGeometry(1,.012,6,48),new THREE.MeshBasicMaterial({color:MINT,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));r.rotation.x=Math.PI/2;r.userData.k=i/3;arch.add(r);return r});
 const archL=label({lines:[X('arch')],px:.0001});archL.position.set(0,.108,0);arch.add(archL);fadeable(arch);
 const column=new THREE.Mesh(new THREE.CylinderGeometry(.03,.036,.09,40,1,true),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,
  uniforms:{uTime:{value:0},uOpacity:{value:0},uColor:{value:MINT.clone()}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:'uniform float uTime,uOpacity;uniform vec3 uColor;varying vec2 vUv;void main(){float a=pow(1.-vUv.y,1.6)*(.25+.15*sin(vUv.y*42.-uTime*6.))*uOpacity;gl_FragColor=vec4(uColor,a);}'}));column.position.y=.045;stage.add(column);
 const f0=(passport?.history||[]).find(e=>e.type==='lote');
 const clock=at=>{try{return new Intl.DateTimeFormat('es-ES',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit',timeZone:'Europe/Madrid'}).format(new Date(at))}catch{return''}};
 const card=fadeable(label({title:'CUEVA-BCN-SACA',lines:[L('passportCard'),`${tr(T.batch,lang)} ${vars.batch} · PE`,`F0 · ${f0?clock(f0.at):'16/10'} · ${L('integrity').split('·')[0].trim()}`,`≈ ${vars.kg} kg · ${X('estimated')}`],px:.00014}));card.position.set(0,.13,0);stage.add(card);
 // a stylised map on the floor: the port at the bag, the coast to the south-west, PLASTICPeople inland
 const MAP={w:.34,d:.2,cx:-.1022,cz:.0367},mp=(x,y)=>new THREE.Vector3((x/1024-.5)*MAP.w+MAP.cx,0,(y/600-.5)*MAP.d+MAP.cz);
 const COAST=[[1010,70],[900,135],[820,190],[740,255],[680,300],[600,340],[520,368],[430,410],[340,445],[270,472],[200,505],[130,540],[40,585]];
 const mapTex=canvasTexture(1024,600,(g,w,h)=>{g.clearRect(0,0,w,h);const sea=g.createLinearGradient(w,0,w*.4,h);sea.addColorStop(0,'rgba(40,140,165,.8)');sea.addColorStop(1,'rgba(25,95,120,.45)');g.fillStyle='rgba(126,219,194,.1)';g.fillRect(0,0,w,h);
  g.beginPath();g.moveTo(COAST[0][0],COAST[0][1]);for(const[x,y]of COAST)g.lineTo(x,y);g.lineTo(w,h);g.lineTo(w,0);g.closePath();g.fillStyle=sea;g.fill();
  g.strokeStyle='rgba(185,243,226,.9)';g.lineWidth=4;g.beginPath();COAST.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke();
  g.strokeStyle='rgba(126,219,194,.18)';g.lineWidth=1;for(let x=0;x<w;x+=64){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke()}for(let y=0;y<h;y+=64){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke()}
  g.fillStyle='rgba(234,250,243,.85)';g.font='600 30px Inter, Arial, sans-serif';g.fillText('Barcelona',840,150);g.fillText('Tarragona',250,440);g.font='italic 28px Instrument, serif';g.fillStyle='rgba(185,243,226,.7)';g.fillText('Mediterrània',560,520);
  const vg=g.createRadialGradient(w/2,h/2,h*.45,w/2,h/2,w*.62);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,1)');g.globalCompositeOperation='destination-out';g.fillStyle=vg;g.fillRect(0,0,w,h);
  g.globalCompositeOperation='destination-out';g.beginPath();g.arc(820,190,60,0,7);g.fill()});
 const map=new THREE.Mesh(new THREE.PlaneGeometry(MAP.w,MAP.d),new THREE.MeshBasicMaterial({map:mapTex,transparent:true,depthWrite:false}));map.rotation.x=-Math.PI/2;map.position.set(MAP.cx,-.0012,MAP.cz);stage.add(map);fadeable(map);
 const D=mp(160,450),ROUTE=[[820,190],[760,215],[700,232],[620,262],[540,300],[450,350],[360,392],[270,420],[200,440],[160,450]].map(([x,y])=>mp(x,y));
 const routeR=ribbon(ROUTE.map(v=>[v.x,v.z]),.0024,false,ribbonMaterial(GOLD,26));routeR.position.y=.0006;stage.add(routeR);
 const routeC=new THREE.CatmullRomCurve3(ROUTE.map(v=>v.clone().setY(.001)));
 const lorry=own(truck());lorry.scale.setScalar(.14);const lBag=own(bigBag(.6));lBag.position.set(-.035,.07,0);lorry.add(lBag);stage.add(lorry);fadeable(lorry);
 const plant=new THREE.Group();{const pm=new THREE.MeshStandardMaterial({color:0xe9ecea,roughness:.6}),rm=new THREE.MeshStandardMaterial({color:0x2b7f7a,roughness:.5});const b=new THREE.Mesh(new THREE.BoxGeometry(.034,.014,.022),pm);b.position.y=.007;plant.add(b);
  for(let i=0;i<3;i++){const r=new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,.0112,3,1),rm);r.rotation.x=Math.PI/2;r.rotation.y=Math.PI/2;r.position.set(-.011+i*.011,.016,0);plant.add(r)}
  const chim=new THREE.Mesh(new THREE.CylinderGeometry(.0015,.0018,.02,8),pm);chim.position.set(.013,.017,-.006);plant.add(chim);plant.traverse(o=>{if(o.isMesh)o.castShadow=true})}
 plant.position.copy(D);stage.add(plant);fadeable(plant);
 const plantL=fadeable(label({title:X('plant'),lines:tr(TXT.plantLines,lang),accent:'#f2c46b'}));plantL.position.set(D.x,.04,D.z);stage.add(plantL);
 const portL=fadeable(label({lines:[X('port')],px:.0001}));portL.position.set(.035,.012,.035);stage.add(portL);

 // --- 4 · choose: moulds, a stream of flakes that follows the finger, rollers, concrete, a first life ---
 const conTex=concreteTexture(),peMat=new THREE.MeshStandardMaterial({map:peTexture(),roughness:.6,color:0xd8edcf}),conMat=new THREE.MeshStandardMaterial({map:conTex,roughness:.9,color:0xd5d8cc});
 const R0=.16,choose=new THREE.Group();stage.add(choose);
 const moulds=MOULDS.map(m=>{const w=m.m[0]/40,d=m.m[1]/40,g=new THREE.Group(),c=new THREE.Color(ZONE_COLORS[m.id]);g.position.set(Math.cos(m.a)*R0,0,-Math.sin(m.a)*R0);
  const wallM=new THREE.MeshStandardMaterial({color:0x6c7a78,roughness:.7,transparent:true});
  for(const[x,z,ww,dd]of[[0,-d/2-.002,w+.008,.004],[0,d/2+.002,w+.008,.004],[-w/2-.002,0,.004,d],[w/2+.002,0,.004,d]]){const wall=new THREE.Mesh(new THREE.BoxGeometry(ww,.012,dd),wallM);wall.position.set(x,.006,z);wall.castShadow=true;g.add(wall)}
  const ring=outline(w+.014,d+.014,c,.0022);ring.position.y=.0004;g.add(ring);
  const lbl=label({title:tr(TXT.opt[m.id][0],lang),lines:[`${m.m[0]} × ${m.m[1]} m`.replace(/\./g,lang==='en'?'.':',')],accent:ZONE_COLORS[m.id],px:.0001});lbl.position.set(0,.022,0);g.add(lbl);
  const H1=.0016,H2=H1*m.canto/20*1.13*.7,pe=new THREE.Mesh(new THREE.BoxGeometry(w,H1,d),peMat),co=new THREE.Mesh(new THREE.BoxGeometry(w,H2,d),conMat);pe.position.y=H1/2;co.position.y=H1+H2/2;
  const slab=new THREE.Group();slab.add(pe,co);slab.traverse(o=>{if(o.isMesh)o.castShadow=o.receiveShadow=true});g.add(slab);
  g.userData={m,w,d,ring,lbl,slab,pe,co,H1,H2,walls:g.children.filter(o=>o.isMesh&&o.material===wallM)};choose.add(g);return g});
 fadeable(choose);
 // rollers that press the flakes into a board, and the concrete chute
 const press=new THREE.Group();{const rm=new THREE.MeshStandardMaterial({color:0x9aa6a3,roughness:.3,metalness:.7});for(const y of[.006,.017]){const r=new THREE.Mesh(new THREE.CylinderGeometry(.0045,.0045,1,18),rm);r.rotation.x=Math.PI/2;r.position.y=y;r.castShadow=true;press.add(r)}
  const fm=new THREE.MeshStandardMaterial({color:0xe3b53a,roughness:.5});for(const z of[-.5,.5]){const f=new THREE.Mesh(new THREE.BoxGeometry(.012,.026,.004),fm);f.position.set(0,.013,z);f.userData.side=z;press.add(f)}}
 stage.add(press);fadeable(press);
 const pressL=fadeable(label({lines:[X('press')],px:.0001})),pourL=fadeable(label({lines:[X('pour')],px:.0001}));stage.add(pressL,pourL);
 const chute=new THREE.Group();{const cm=new THREE.MeshStandardMaterial({color:0x8a9592,roughness:.5,metalness:.4}),drum=new THREE.Mesh(new THREE.CylinderGeometry(.011,.008,.03,16),new THREE.MeshStandardMaterial({color:0xe9ecea,roughness:.5}));drum.rotation.z=Math.PI/2.6;drum.position.set(.022,.06,0);
  const spout=new THREE.Mesh(new THREE.BoxGeometry(.03,.003,.008),cm);spout.position.set(.006,.047,0);spout.rotation.z=-.5;chute.add(drum,spout);chute.userData.drum=drum;chute.traverse(o=>{if(o.isMesh)o.castShadow=true})}
 stage.add(chute);fadeable(chute);
 const concreteFlow=flow(140,['#c9ccc2','#b3b7ad','#dfe1da'],.0009,77);stage.add(concreteFlow);
 // the stream: instanced flakes travelling along an arc from the bag mouth to the target
 const SN=240,stream=new THREE.InstancedMesh(TRI(),new THREE.MeshStandardMaterial({color:0xffffff,side:THREE.DoubleSide,roughness:.6}),SN);
 const sr=rng(31),scol=new THREE.Color();for(let i=0;i<SN;i++){stream.setColorAt(i,scol.set(PE_COLORS[i%PE_COLORS.length]))}stream.frustumCulled=false;stage.add(stream);
 const sm=new THREE.Matrix4(),sq=new THREE.Quaternion(),sv=new THREE.Vector3(),ss=new THREE.Vector3(),seeds=Array.from({length:SN},()=>[sr(),sr(),sr(),sr()]),bp=new THREE.Vector3(),mid=new THREE.Vector3();
 const target=new THREE.Vector3(0,0,R0),aim=new THREE.Vector3(0,0,R0);
 function drawStream(on,time,to){stream.visible=on>0;if(!on)return;for(let i=0;i<SN;i++){const[a,b,c,d]=seeds[i],u=(time*.7+a)%1;mid.set(to.x*.5,.07+.02*b,to.z*.5);
  bp.set(0,.012,0).multiplyScalar((1-u)*(1-u)).addScaledVector(mid,2*u*(1-u)).addScaledVector(to,u*u);bp.x+=(b-.5)*.008*Math.sin(u*Math.PI);bp.z+=(c-.5)*.008*Math.sin(u*Math.PI);
  sq.setFromAxisAngle(sv.set(b-.5,1,c-.5).normalize(),time*(2+d*4)+a*20);ss.setScalar(.0011*(.6+d)*on*Math.sin(Math.min(1,u*1.2)*Math.PI*.95+.05));sm.compose(bp,sq,ss);stream.setMatrixAt(i,sm)}stream.instanceMatrix.needsUpdate=true}
 // first lives
 const life=new THREE.Group();stage.add(life);
 const walkers=[own(person(0xeef6f0)),own(person(0xd9c7a7))];walkers.forEach(w=>{w.scale.setScalar(.5);life.add(w)});
 const tree=own(palm(.1,3));tree.scale.setScalar(.42);const seat=own(bench()),sitter=own(person(0x9fc9c0,{seated:true}));seat.scale.setScalar(.5);sitter.scale.setScalar(.5);life.add(tree,seat,sitter);
 const van=own(truck());van.scale.setScalar(.22);life.add(van);
 const lane=new THREE.Mesh(new THREE.PlaneGeometry(1,.0014),new THREE.MeshBasicMaterial({color:0xf2c46b,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2}));lane.rotation.x=-Math.PI/2;life.add(lane);
 const sea=water(.16,.07,0,-.0005);life.add(sea);const dinghy=own(motorBoat());dinghy.scale.setScalar(.3);life.add(dinghy);const lifeBird=own(gull());lifeBird.scale.setScalar(.7);life.add(lifeBird);
 fadeable(life);
 const engr=new THREE.Mesh(new THREE.PlaneGeometry(.03,.009),new THREE.MeshBasicMaterial({transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-3,map:canvasTexture(512,150,g=>{g.fillStyle='#2f5653';g.font='600 64px Mono, monospace';g.fillText('CUEVA-BCN',14,72);g.font='500 38px Mono, monospace';g.fillText(vars.batch,16,126)})}));
 engr.rotation.x=-Math.PI/2;stage.add(fadeable(engr));
 const pulse=new THREE.Mesh(new THREE.RingGeometry(.9,1,64),new THREE.MeshBasicMaterial({color:MINT,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));pulse.rotation.x=-Math.PI/2;stage.add(pulse);
 const dragL=fadeable(label({lines:['⟷  '+tr(TXT.drag,lang)],accent:'#f2c46b'}));stage.add(dragL);
 let bornLabel=null;
 const plane=new THREE.Plane(),hit=new THREE.Vector3(),nrm=new THREE.Vector3(),org=new THREE.Vector3();
 function groundPoint(rc){stage.updateWorldMatrix(true,false);nrm.set(0,1,0).transformDirection(stage.matrixWorld);org.setFromMatrixPosition(stage.matrixWorld);plane.setFromNormalAndCoplanarPoint(nrm,org);
  if(!rc.ray.intersectPlane(plane,hit))return null;stage.worldToLocal(hit);const l=Math.hypot(hit.x,hit.z);if(l>.26)hit.multiplyScalar(.26/l);hit.y=0;return hit.clone()}
 const nearest=p=>{let best=null,bd=1e9;for(const g of moulds){const d=Math.hypot(p.x-g.position.x,p.z-g.position.z);if(d<bd){bd=d;best=g}}return bd<Math.max(best.userData.w,best.userData.d)/2+.03?best.userData.m.id:null};
 let dragging=false,choiceAt=-1;const once=new Set();
 const it={holdAt:TL.hold-40,choice:null,hover:null,kick:TXT.kick,prompt:TXT.prompt,
  options:MOULDS.map(m=>({id:m.id,label:TXT.opt[m.id][0],detail:TXT.opt[m.id][1],color:ZONE_COLORS[m.id]})),
  pointer(type,rc){if(it.choice)return false;const p=groundPoint(rc);
   if(type==='down'){if(!p)return false;dragging=true;aim.copy(p);return true}
   if(type==='move'&&dragging){if(p)aim.copy(p);it.hover=nearest(aim);return true}
   if(type==='hover'){if(p)it.hover=nearest(p);return false}
   if(type==='up'&&dragging){dragging=false;const pick=nearest(aim);if(pick)it.choose(pick);return true}
   return false},
  choose(id){if(it.choice)return;it.choice=id;choiceAt=-1},
  reset(){it.choice=null;it.hover=null;dragging=false;choiceAt=-1;once.clear();if(bornLabel){stage.remove(bornLabel);const i=labels.indexOf(bornLabel);if(i>=0)labels.splice(i,1);bornLabel=null}}};

 // --- 5 · loop: the material of the new piece flies back into the bag (same flake shader as the pieces) ---
 const N=2200,tri=new THREE.InstancedBufferGeometry();tri.setAttribute('position',new THREE.Float32BufferAttribute([-1,0,-.7,1,0,-.5,-.1,0,1],3));tri.instanceCount=N;
 const aUv=new Float32Array(N*2),aLand=new Float32Array(N*3),aSeed=new Float32Array(N*4),aColor=new Float32Array(N*3),r=rng(9),pe=PE_COLORS.map(c=>new THREE.Color(c));
 for(let i=0;i<N;i++){const u=r(),v=r(),a=r()*Math.PI*2,rr=Math.sqrt(r())*.024;aUv.set([u,v],i*2);aLand.set([Math.cos(a)*rr,.002+r()*.004,Math.sin(a)*rr],i*3);aSeed.set([noise(u,v),r(),r(),r()],i*4);const c=pe[Math.floor(r()*pe.length)];aColor.set([c.r,c.g,c.b],i*3)}
 for(const[k,a,n]of[['aUv',aUv,2],['aLand',aLand,3],['aSeed',aSeed,4],['aColor',aColor,3]])tri.setAttribute(k,new THREE.InstancedBufferAttribute(a,n));
 const U={uTime:{value:0},uTear:{value:0},uSwirl:{value:0},uLand:{value:0},uSettle:{value:0},uMode:{value:1},uRise:{value:0},uConverge:{value:0},uVis:{value:0},uWaveT:{value:0},
  uTarpC:{value:new THREE.Vector3()},uTarpS:{value:new THREE.Vector2(TW,TD)},uRetOff:{value:new THREE.Vector3(0,0,R0)},uSwirlR:{value:.07},uInfR:{value:.2},uSize:{value:.0013}};
 const flakes=new THREE.Mesh(tri,new THREE.ShaderMaterial({uniforms:U,vertexShader:FLAKE_VS,fragmentShader:FLAKE_FS,side:THREE.DoubleSide}));flakes.frustumCulled=false;stage.add(flakes);
 const flash=new THREE.Sprite(new THREE.SpriteMaterial({map:glow,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:0}));stage.add(flash);

 const CUES=[['ring',.05],['horn',5.4],['gull',7.6],['tarp',9.2],['whirr',17.6],['splash',19.6],['land',22.2],['explode',24.2],['beep',29.6],['chime',30.8],['engine',33.4],['lift',40.5],
  ['dissolve',53.6+RS],['rise',55+RS],['converge',58.2+RS],['flash',60+RS]];
 let standby=false,lastWall=0;const waiting=()=>!it.choice&&t>=TL.hold-1e-6;
 const cue=(n,at)=>{if(lastT<at&&t>=at)cues.push(n)};
 const shot=(k,n,cond)=>{if(cond&&!once.has(k)){once.add(k);cues.push(n)}};
 const camPos=new THREE.Vector3(),tmp=new THREE.Vector3(),tmp2=new THREE.Vector3(),cT=new THREE.Vector3(),tan=new THREE.Vector3();
 const yawOf=(lp,ws)=>new THREE.Vector3(lp[0],0,lp[2]).applyAxisAngle(new THREE.Vector3(0,1,0),YR).add(Y).setY(ws);
 function update(dt,camera){
  if(!paused&&!standby){lastT=t;t+=dt;if(!it.choice&&lastT<=TL.hold&&t>TL.hold)t=TL.hold;if(t>=TL.loopEnd){t=TL.loopStart;lastT=t-1e-4;it.reset()}}
  const time=performance.now()/1000,tR=t-RS,dtw=lastWall?Math.min(.05,time-lastWall):0;lastWall=time;for(const[n,a]of CUES)cue(n,a);
  if(standby){halo.material.uniforms.uProg.value=1;halo.material.uniforms.uOpacity.value=.45+.25*Math.sin(time*4);for(const o of stage.children)if(!o.isLight&&o!==halo&&o!==key.target)o.visible=false;return}
  for(const o of stage.children)o.visible=true;
  if(t<.05)once.clear();
  halo.material.uniforms.uProg.value=io(seg(t,.2,2));halo.material.uniforms.uOpacity.value=.5+.4*Math.sin(time*2);
  floor.material.uniforms.uOpacity.value=Math.min(1,seg(t,.4,2.4))*(t>40&&t<USE_END?.55:1);floor.material.uniforms.uTime.value=time;
  setFade(title,win(t,1.5,9,.6,.8));
  // 1 · refit
  const boatOn=win(t,4.6,21,1,1.4);setFade(boat,boatOn);setFade(refitL,win(t,5.4,16.5,.6,.8));refitL.position.set(Y.x,.11,Y.z);
  workers.forEach((w,i)=>{setFade(w,boatOn);const side=i?1:-1,pull=io(seg(t,8.8,11.6)),walk=seg(t,5,8.6);const lp=[(i?.03:-.035)-pull*.018*(i?-1:1)*0,0,side*(.04+pull*.03)];
   const wp=yawOf(lp,Y.y-.012);w.position.copy(wp);w.rotation.y=YR+(i?Math.PI/2:-Math.PI/2)+Math.PI;w.userData.update(t<8.6?walk*20:t<11.6?pull*14:0)});
  setFade(bird,win(t,5,17,1,1));{const a=time*.6;bird.position.set(Y.x+Math.cos(a)*.08,.12+.01*Math.sin(time),Y.z+Math.sin(a)*.05);bird.rotation.y=-a;bird.userData.update(time*9)}
  // the cover: draped -> lifted -> flown to the shed -> folded into the hopper
  const lift=io(seg(t,9.2,11.6)),carry=io(seg(t,11.6,15.8)),fold=io(seg(t,17,18.6));
  const HOP=new THREE.Vector3(S.x+.035,.062,S.z-.01),draped=new THREE.Vector3(Y.x,Y.y+.046,Y.z);
  cT.copy(draped).lerp(new THREE.Vector3(Y.x,.12,Y.z),lift).lerp(new THREE.Vector3(HOP.x,.1,HOP.z),carry);if(t>17)cT.lerp(HOP,fold);cT.y+=.004*Math.sin(time*1.3)*lift*(1-fold);
  tarp.visible=t>4.6&&t<19.2;if(tarp.visible){shapeTarp(1-lift,fold,time);tarp.position.copy(cT);tarp.rotation.y=YR*(1-carry);const thr=t<18?1-io(seg(t,4.6,6.4))*.999:io(seg(t,18,19));tarpMat.alphaTest=tarp.customDepthMaterial.alphaTest=clamp(thr,.001,.999)}
  setFade(tarpLabel,win(t,6,16.6,.5,.4));tarpLabel.position.set(cT.x-.06,cT.y+.016,cT.z);
  // 2 · shed
  const shedOn=win(t,12.6,29.4,1,1.2);setFade(shed,shedOn);setFade(shedL,win(t,13.4,28.8,.8,1));
  const spin=t>17.4&&t<24.6?1:0;blades[0].rotation.x=-time*12*spin;blades[1].rotation.x=time*12*spin;shredder.position.y=spin*.0004*Math.sin(time*60);
  partL[0].position.set(S.x+.035,.07,S.z+.012);partL[1].position.set(S.x-.035,.045,S.z+.03);setFade(partL[0],win(t,17.4,23.6,.4,.6));setFade(partL[1],win(t,19,24.4,.4,.6));
  tank.userData.water.position.y=.016+.0006*Math.sin(time*7);
  bubbles.forEach(b=>{const k=(time*.9+b.userData.k)%1;b.position.set(-.02+b.userData.k*.04,.014+k*.012,(b.userData.k*7%1-.5)*.026);b.material.opacity=shedOn*(t>19&&t<25?Math.sin(k*Math.PI)*.8:0)});
  chips.userData.draw(toTank,shedOn*win(t,18.4,24.2,.5,.6),time,.55,.006);
  washed.userData.draw(toBag,shedOn*win(t,19.4,25.4,.6,.8),time,.42,.006);
  const fk=t<40?seg(t,20.4,25):1;setFade(fill,t<USE_END?fk*(t>40?.4:1):1-seg(tR,53.6,55));fill.scale.setScalar(Math.max(.001,.35+.65*fk));
  const mineOn=win(t,23.6,29.6,.6,1);setFade(mine,mineOn);bars.forEach((g,i)=>{const k=out(seg(t,24.1+i*.18,25.6+i*.18));g.scale.y=Math.max(.001,g.userData.h*k);g.userData.l.position.y=g.userData.h*k+.003});mine.rotation.y=.12*Math.sin(time*.3);
  // 3 · batch
  const ar=win(t,29,33,.6,.8);setFade(arch,ar);waves.forEach(w=>{const k=((time*.8)+w.userData.k)%1;w.scale.setScalar(.03+k*.06);w.position.y=.05;w.material.opacity=ar*(t>29.4&&t<31.4?(1-k)*.6:0)});
  const id=win(t,30,39.6,1,1.2);column.material.uniforms.uOpacity.value=id;column.material.uniforms.uTime.value=time;column.visible=id>0;
  const cardIn=back(seg(t,30.6,31.6));setFade(card,id*seg(t,30.6,31));card.position.y=.13+.003*Math.sin(time*1.1);
  const mo=win(t,31.8,39.8,.8,1);setFade(map,mo);setFade(portL,mo);routeR.material.uniforms.uProg.value=io(seg(t,32.2,34.6));routeR.material.uniforms.uOpacity.value=mo;
  const ts=io(seg(t,33.4,38.4));setFade(lorry,mo*(ts>0?1:0));if(ts>0){routeC.getPointAt(Math.min(.999,ts),lorry.position);routeC.getTangentAt(Math.min(.999,ts),tan);lorry.rotation.y=Math.atan2(-tan.z,tan.x)}
  setFade(plant,win(t,34.4,39.8,.6,1));setFade(plantL,win(t,35.6,39.8,.6,1));
  // 4 · choose
  if(t<TL.hold-.5&&it.choice)it.reset();if(t>TL.hold+.05&&!it.choice){it.choice='paseo';choiceAt=TL.hold}if(it.choice&&choiceAt<0)choiceAt=t;
  const cf=win(t,40,USE_END+.6,.8,1.2);setFade(choose,cf);
  const T0=choiceAt,chosen=moulds.find(g=>g.userData.m.id===it.choice);
  moulds.forEach((g,i)=>{const u=g.userData,appear=back(seg(t,40.2+i*.25,41+i*.25)),isC=g===chosen;g.scale.setScalar(Math.max(.001,appear*(it.choice&&!isC?1-seg(t,T0,T0+1):1)));
   const hot=!it.choice&&it.hover===u.m.id;u.ring.material.uniforms.uOpacity.value=cf*(hot?1:.45+.25*Math.sin(time*4+i));u.lbl.material.opacity=cf*(it.choice&&!isC?0:1);
   // the rollers pass from left to right: the board appears behind them; then concrete; then the piece is lifted out
   const rollK=isC?io(seg(t,T0+1.2,T0+3.6)):0,pour=isC?io(seg(t,T0+3.8,T0+6.4)):0,lift=isC?io(seg(t,T0+6.6,T0+7.8)):0;
   u.slab.visible=rollK>0;u.pe.scale.set(Math.max(.001,rollK),1,1);u.pe.position.set(-u.w/2*(1-rollK),u.H1/2,0);
   u.co.visible=pour>0;u.co.scale.y=Math.max(.001,pour);u.co.position.y=u.H1+u.H2*pour/2;
   u.slab.position.y=lift*.004;u.walls.forEach(w=>{w.material.opacity=1-lift;w.visible=lift<1})});
  if(waiting()){if(!dragging){const k=(time*.25)%MOULDS.length|0,m=moulds[k];aim.lerp(new THREE.Vector3(m.position.x*.9,0,m.position.z*.9),Math.min(1,dtw*1.5))}target.lerp(aim,Math.min(1,dtw*10))}
  else if(chosen)target.lerp(new THREE.Vector3(chosen.position.x,.012,chosen.position.z),Math.min(1,dtw*6));
  drawStream(waiting()?1:(chosen&&t<T0+2.2?1-seg(t,T0+1.4,T0+2.2):0),time,target);
  setFade(dragL,waiting()&&!dragging?.6+.4*Math.sin(time*3):0);dragL.position.set(target.x*.6,.075,target.z*.6);
  if(chosen){const P=chosen.position,u=chosen.userData,z=u.m.id;
   // rollers and chute
   const pr=win(t,T0+.8,T0+4,.4,.4),rk=io(seg(t,T0+1.2,T0+3.6));setFade(press,pr*cf);press.position.set(P.x-u.w/2+u.w*rk,0,P.z);press.children.forEach(o=>{if(o.geometry.type==='CylinderGeometry'){o.scale.y=u.d+.012;o.rotation.y=0;o.rotation.z=0;o.rotation.x=Math.PI/2;o.rotateY(-time*8)}else o.position.z=o.userData.side*(u.d+.012)});
   setFade(pressL,win(t,T0+1.2,T0+3.8,.4,.4));pressL.position.set(P.x,.04,P.z);
   const ch=win(t,T0+3.4,T0+6.8,.4,.5);setFade(chute,ch*cf);chute.position.set(P.x-.006,0,P.z);chute.userData.drum.rotation.y=time*3;
   const spoutTip=new THREE.Vector3(P.x-.008,.044,P.z);concreteFlow.userData.draw(new THREE.LineCurve3(spoutTip,new THREE.Vector3(P.x+(Math.sin(time*2)*u.w*.3),u.H1+.002,P.z+(Math.cos(time*1.7)*u.d*.25))),ch*(t>T0+3.8&&t<T0+6.4?1:0),time,1.3,.003);
   setFade(pourL,win(t,T0+3.9,T0+6.6,.4,.4));pourL.position.set(P.x,.075,P.z);
   const pj=seg(t,T0+7.6,T0+8.8);pulse.visible=pj>0&&pj<1;pulse.scale.setScalar(Math.max(u.w,u.d)*(.6+pj*.9));pulse.material.opacity=(1-pj)*.8;pulse.position.set(P.x,.006,P.z);
   const top=u.H1+u.H2+.004;setFade(engr,win(t,T0+7.8,USE_END,.6,1));engr.position.set(P.x,top+.0002,P.z+u.d*.18);engr.scale.setScalar(Math.min(1,u.w/.04));
   shot('press','whirr',t>T0+1.2);shot('pour','pour',t>T0+3.9);shot('set','set',t>T0+7.6);shot('born','chime',t>T0+8);
   // first life
   const lf=win(t,T0+8,USE_END+.4,.8,1.4);setFade(life,lf);
   walkers.forEach((w,i)=>{w.visible=z==='paseo';const s=seg(t,T0+8.4+i*1.4,T0+17+i*1.4),x=lerp(-u.w/2-.02,u.w/2+.02,s);w.position.set(P.x+x*(i?-1:1),top,P.z+(i?.012:-.01));w.rotation.y=i?Math.PI:0;w.userData.update((t-T0)*7)});
   tree.visible=seat.visible=sitter.visible=z==='paseo';tree.position.set(P.x+u.w/2+.012,0,P.z-u.d/2);seat.position.set(P.x-u.w/2-.006,0,P.z-u.d/2+.012);seat.rotation.y=Math.PI/2;sitter.position.set(P.x-u.w/2-.004,-.0085,P.z-u.d/2+.012);sitter.rotation.y=0;
   van.visible=lane.visible=z==='vial';const vs=seg(t,T0+8.4,T0+14.4),vs2=seg(t,T0+15.6,T0+21.6);van.position.set(P.x+(vs2>0?lerp(u.w,-u.w,vs2):lerp(-u.w,u.w,vs)),top-.004,P.z+(vs2>0?-.004:.004));van.rotation.y=vs2>0?Math.PI:0;van.userData.wheels.forEach(w=>w.rotation.y=-(t-T0)*6);
   lane.position.set(P.x,top+.0003,P.z);lane.scale.x=u.w*.9;shot('van','engine',z==='vial'&&t>T0+8.4);shot('van2','engine',z==='vial'&&t>T0+15.6);
   sea.visible=dinghy.visible=lifeBird.visible=z==='borde';sea.position.set(P.x,-.0005,P.z-u.d/2-.004-.035);sea.userData.update(time,.2);const bs=out(seg(t,T0+8.4,T0+13));dinghy.position.set(P.x+lerp(-.12,.01,bs),.002+.001*Math.sin(time*2),P.z-u.d/2-.03);dinghy.rotation.z=.04*Math.sin(time*1.8);
   {const a=time*.7;lifeBird.position.set(P.x+Math.cos(a)*.05,.07+.006*Math.sin(time),P.z-u.d/2-.03+Math.sin(a)*.03);lifeBird.rotation.y=-a;lifeBird.userData.update(time*9)}shot('gull','gull',z==='borde'&&t>T0+9);shot('wave','water',z==='borde'&&t>T0+8.2);
   if(!bornLabel&&t>T0+7.8){const zn=tr(TXT.opt[z][0],lang).toLowerCase(),mm=`${u.m.m[0]} × ${u.m.m[1]}`.replace(/\./g,lang==='en'?'.':',');
    bornLabel=fadeable(label({title:fmt(tr(TXT.born,lang),{zone:zn}),lines:[...tr(TXT.bornLines,lang).map(l=>fmt(l,{m:mm,canto:u.m.canto,ids:u.m.ids,batch:vars.batch})),tr(TXT.note,lang)],accent:ZONE_COLORS[z],px:.00011}));bornLabel.userData.s0=bornLabel.scale.clone();labels.push(bornLabel);stage.add(bornLabel)}
   if(bornLabel){setFade(bornLabel,win(t,T0+8,USE_END,.6,1));bornLabel.position.set(P.x,.07,P.z)}
   U.uRetOff.value.set(P.x,top,P.z)}
  else{for(const o of[press,chute,pressL,pourL,engr,life])setFade(o,0);concreteFlow.visible=false;pulse.visible=false}
  // 5 · loop
  U.uTime.value=time;U.uWaveT.value=time;U.uRise.value=io(seg(tR,53.6,56.2));U.uConverge.value=io(seg(tR,58,60.2));U.uVis.value=tR>=53&&tR<61?1:0;flakes.visible=U.uVis.value>0;
  const fl=seg(tR,59.8,61.2);flash.visible=fl>0&&fl<1;flash.material.opacity=Math.sin(fl*Math.PI)*.95;flash.scale.setScalar(.01+fl*.09);flash.position.y=.004;
  if(camera){camera.getWorldPosition(camPos);const s=root.getWorldScale(tmp2).x;for(const l of labels){if(!l.visible)continue;l.getWorldPosition(tmp);const k=clamp(camPos.distanceTo(tmp)/s/.32,.42,1.15);l.scale.set(l.userData.s0.x*k,l.userData.s0.y*k*(l===card?Math.max(.001,cardIn):1),1)}}
 }
 const labels=[];root.traverse(o=>{if(o.isSprite&&o.userData.isLabel){o.userData.s0=o.scale.clone();labels.push(o)}});
 const captions=TXT.ch.map(c=>({kick:tr(c.kick,lang),title:tr(c.title,lang),text:fmt(tr(c.text,lang),vars)}));
 return{root,piece:{id:'SACA',zone:'bag'},captions,chapterNames:TXT.short.map(c=>tr(c,lang)),timeline:TL,interaction:it,waiting,
  setStandby:v=>{standby=v},get standby(){return standby},
  pointer:(type,rc)=>waiting()?it.pointer(type,rc):false,
  get time(){return t},get paused(){return paused},setPaused:v=>{paused=v},seek:v=>{t=v;lastT=v},
  chapterAt:(v=t)=>{if(v<TL.chapters[0])return -1;let i=0;TL.chapters.forEach((c,k)=>{if(v>=c)i=k});return i},
  restart:()=>{t=0;lastT=0;it.reset()},takeCues:()=>cues.splice(0),update,setViewHeight:()=>{},infoVars:vars,
  pick:raycaster=>raycaster.intersectObject(card)[0]||raycaster.intersectObjects(moulds,true)[0]||raycaster.intersectObject(mine,true)[0]?{kind:'bag'}:null,
  dispose(){root.traverse(o=>{o.geometry?.dispose();for(const m of[o.material].flat().filter(Boolean)){m.map?.dispose();m.alphaMap?.dispose();m.dispose()}})}};
}

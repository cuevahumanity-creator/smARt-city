// «PLASTICPeople»: the company's presentation, staged on the table around a printed QR (25 mm label on a card).
//  1 El reto        — plastic rains on the table; 350 million tonnes a year, under 15 % collected and recycled.
//  2 Transformar    — the heap lifts into a whirlwind, sorted by colour, shredded into flakes and poured into a hot press.
//  3 Materiales     — a helix with the 26 materials of the catalogue, which lands as a rippling mosaic.
//  4 Diseñar        — a board is cut by CNC and its parts fold into a chair; a shelf and a table join it.
//  5 CUEVA          — the furniture gets its tags, its digital passport (DPP) and its link to the Hub.
//  6 El ciclo       — flakes flow along a closed ring, people walk around it: community, workshops, jobs.
//  7 PLASTICPeople  — the flakes become a halo around symbol and logo; «Powered by CUEVA»; and it loops.
// Units: metres. Origin = QR centre, Y up, table at y = 0, the reader towards +Z. Figures and claims come from the
// company's website; the material samples are drawn here, in their colours, and are marked as illustrative.
import {THREE,clamp,seg,io,out,back,win,lerp,rng,canvasTexture,label,fadeable,setFade,ribbonMaterial,ribbon,person} from './kit.mjs?v=12.0';
import {tr} from './text.mjs?v=12.0';
import {createCuevaScore} from './cueva-score.mjs?v=12.0';

const C={ink:'#f6f6f2',mint:'#37d6a0',coral:'#ff5a3c',hot:'#ff7a1f',night:'#050606',blue:'#0a0af0',cyan:'#56DCE6'};
const BEAT=.5,CH=[1,10,20,32,42,50,60],END=72,RING=.165;
// The scene clock stands still from 42 to 50 s while the finished furniture gets its CUEVA layer.
const warp=c=>c<42?c:c<50?42:c-8;
const L3=(es,en,ca)=>[es,en,ca];
const SITE='weareplasticpeople.com';

const TXT={
 ch:[
  {kick:L3('01 · EL RETO','01 · THE CHALLENGE','01 · EL REPTE'),title:L3('Más de 350 millones de toneladas al año.','Over 350 million tonnes a year.','Més de 350 milions de tones l’any.'),
   text:L3('Menos del 15 % se recolecta y se recicla. El modelo actual no es una solución a largo plazo. ¿Cómo lo podemos hacer mejor?','Less than 15 % is collected and recycled. The current model is not a long-term solution. How can we do better?','Menys del 15 % es recull i es recicla. El model actual no és una solució a llarg termini. Com ho podem fer millor?')},
  {kick:L3('02 · TRANSFORMAR','02 · TRANSFORM','02 · TRANSFORMAR'),title:L3('Todo tipo de residuo plástico.','All kinds of plastic waste.','Tota mena de residu plàstic.'),
   text:L3('Recogida, triturado, escama, mezcla y prensa en caliente. El residuo sale convertido en plancha, en la planta de Vinyols i els Arcs (Tarragona).','Collection, shredding, flakes, mixing and hot press. The waste comes out as a board, at the Vinyols i els Arcs plant (Tarragona).','Recollida, triturat, escama, mescla i premsa en calent. El residu surt convertit en planxa, a la planta de Vinyols i els Arcs (Tarragona).')},
  {kick:L3('03 · MATERIALES','03 · MATERIALS','03 · MATERIALS'),title:L3('Polivalentes, seguros y de diseño.','Versatile, safe and designed.','Polivalents, segurs i de disseny.'),
   text:L3('TPP, SPA, Glaze, Terrazzo, Marble, Granite, Onyx, Quartz… Muestras dibujadas a modo ilustrativo: el catálogo real está en weareplasticpeople.com.','TPP, SPA, Glaze, Terrazzo, Marble, Granite, Onyx, Quartz… Samples drawn for illustration: the real catalogue is at weareplasticpeople.com.','TPP, SPA, Glaze, Terrazzo, Marble, Granite, Onyx, Quartz… Mostres dibuixades a tall il·lustratiu: el catàleg real és a weareplasticpeople.com.')},
  {kick:L3('04 · DISEÑAR','04 · DESIGN','04 · DISSENYAR'),title:L3('Diseñar, construir, fabricar.','Design, build, make.','Dissenyar, construir, fabricar.'),
   text:L3('Profesionales creativos usan estos materiales para crear soluciones inteligentes para un futuro sostenible.','Creative professionals use these materials to make smart solutions for a sustainable future.','Professionals creatius fan servir aquests materials per crear solucions intel·ligents per a un futur sostenible.')},
  {kick:L3('05 · CUEVA','05 · CUEVA','05 · CUEVA'),title:L3('Cada mueble tiene memoria.','Every piece of furniture has a memory.','Cada moble té memòria.'),
   text:L3('Con CUEVA, cada pieza lleva su tag y su pasaporte digital (DPP): de qué está hecha, de dónde viene y cómo vuelve al ciclo. Las lecturas llegan al Hub por la red local, también sin internet. Ejemplo ilustrativo.','With CUEVA, every piece carries its tag and its digital passport (DPP): what it is made of, where it comes from and how it returns to the cycle. Readings reach the Hub over the local network, offline too. Illustrative example.','Amb CUEVA, cada peça porta el seu tag i el seu passaport digital (DPP): de què està feta, d’on ve i com torna al cicle. Les lectures arriben al Hub per la xarxa local, també sense internet. Exemple il·lustratiu.')},
  {kick:L3('06 · EL CICLO','06 · THE CYCLE','06 · EL CICLE'),title:L3('Todos podemos ser parte de la solución.','We can all be part of the solution.','Tots podem ser part de la solució.'),
   text:L3('Los residuos de la propia fabricación vuelven a ser materia prima. Se crean puestos de trabajo y hay talleres para empresas, fabricantes, escuelas y la comunidad.','The waste from manufacturing becomes raw material again. It creates jobs, and there are workshops for companies, makers, schools and the community.','Els residus de la mateixa fabricació tornen a ser matèria primera. Es creen llocs de treball i hi ha tallers per a empreses, fabricants, escoles i la comunitat.')},
  {kick:L3('07 · PLASTICPEOPLE','07 · PLASTICPEOPLE','07 · PLASTICPEOPLE'),title:L3('Creando impacto positivo.','Creating positive impact.','Creant impacte positiu.'),
   text:L3('Ambiental y social. Una solución circular al reto del plástico.','Environmental and social. A circular solution to the plastic challenge.','Ambiental i social. Una solució circular al repte del plàstic.')},
 ],
 short:[L3('Reto','Challenge','Repte'),L3('Transformar','Transform','Transformar'),L3('Materiales','Materials','Materials'),L3('Diseñar','Design','Dissenyar'),['CUEVA','CUEVA','CUEVA'],L3('Ciclo','Cycle','Cicle'),L3('Logo','Logo','Logo')],
 tonnes:L3('toneladas de plástico al año','tonnes of plastic a year','tones de plàstic l’any'),
 share:L3('menos del 15 % se recolecta y se recicla','less than 15 % is collected and recycled','menys del 15 % es recull i es recicla'),
 ask:[L3('¿CÓMO LO PODEMOS HACER MEJOR?','HOW CAN WE DO BETTER?','COM HO PODEM FER MILLOR?')],
 steps:[L3('Recogida','Collection','Recollida'),L3('Triturado','Shredding','Triturat'),L3('Escama y mezcla','Flakes and mixing','Escama i mescla'),L3('Prensa en caliente','Hot press','Premsa en calent'),L3('Plancha 100 % reciclada','100 % recycled board','Planxa 100 % reciclada')],
 cat:[L3('26 MATERIALES','26 MATERIALS','26 MATERIALS'),L3('muestras ilustrativas','illustrative samples','mostres il·lustratives')],
 cards:[[L3('DISEÑAR.','DESIGN.','DISSENYAR.')],[L3('CONSTRUIR.','BUILD.','CONSTRUIR.')],[L3('FABRICAR.','MAKE.','FABRICAR.')]],
 cnc:L3('Corte CNC','CNC cutting','Tall CNC'),
 ring:[L3('Residuo','Waste','Residu'),L3('Escama','Flakes','Escama'),L3('Plancha','Board','Planxa'),L3('Producto','Product','Producte')],
 closed:[L3('EL CICLO SE CIERRA.','THE CYCLE CLOSES.','EL CICLE ES TANCA.')],
 jobs:L3('Puestos de trabajo para nuestra comunidad','Jobs for our community','Llocs de treball per a la nostra comunitat'),
 work:L3('Talleres · empresas, fabricantes, escuelas','Workshops · companies, makers, schools','Tallers · empreses, fabricants, escoles'),
 port:[L3('Lonas del puerto → planchas → piezas de muelle','Port tarps → boards → quay pieces','Lones del port → planxes → peces de moll'),L3('propuesta smARt city · Port de Barcelona','smARt city proposal · Port de Barcelona','proposta smARt city · Port de Barcelona')],
 tagged:[L3('CADA PIEZA, CON SU TAG.','EVERY PIECE, WITH ITS TAG.','CADA PEÇA, AMB EL SEU TAG.'),L3('identidad CUEVA','CUEVA identity','identitat CUEVA')],
 hub:[['CUEVA Hub','CUEVA Hub','CUEVA Hub'],L3('red local, también sin internet','local network, offline too','xarxa local, també sense internet')],
 dpp:{head:L3('Pasaporte digital · DPP','Digital passport · DPP','Passaport digital · DPP'),rows:[[L3('Pieza','Piece','Peça'),L3('Silla · CUEVA-PP-0042','Chair · CUEVA-PP-0042','Cadira · CUEVA-PP-0042')],[L3('Material','Material','Material'),L3('TERRAZZO WI · 100 % reciclado','TERRAZZO WI · 100 % recycled','TERRAZZO WI · 100 % reciclat')],[L3('Planta','Plant','Planta'),['Vinyols i els Arcs','Vinyols i els Arcs','Vinyols i els Arcs']],[L3('Lecturas','Readings','Lectures'),L3('fabricada → entregada → en uso','made → delivered → in use','fabricada → lliurada → en ús')],[L3('Fin de vida','End of life','Fi de vida'),L3('vuelve a ser materia prima','becomes raw material again','torna a ser matèria primera')]],foot:L3('ejemplo ilustrativo · CUEVA × PLASTICPeople','illustrative example · CUEVA × PLASTICPeople','exemple il·lustratiu · CUEVA × PLASTICPeople')},
 impact:L3('Impacto positivo, ambiental y social.','Positive impact, environmental and social.','Impacte positiu, ambiental i social.'),
};
// name, base colour, chip colours, chips, min and max size, stretch. Palettes taken by eye from the catalogue.
const MATS=[['TPA+GRAY','#8b8d86',['#6f716b','#a9aaa3','#5d605c','#3c9a66'],1500,1,7,3],['TPA-SILVER','#a3a39b',['#bcbcb3','#7e7f79','#d0d0c8','#5f7f6c'],1500,1,7,3],['CPA','#7f8a80',['#9da79c','#5f6a62','#3f9a62','#c4c8bc'],1200,2,10,2],
 ['TPP','#d7d0b4',['#c9a93a','#7a7a70','#f4f0dc','#3f5f9f','#2d2d28'],1400,3,12,1.2],['TPP+','#b9bab2',['#e8e8df','#34507f','#55554f','#8aa0c4'],1500,2,10,1.2],
 ['SPA GRAY','#96968f',['#a8a8a1','#85857f'],1800,.6,2,1],['SPA BLACK','#191a1b',['#26272a','#101112'],1800,.6,2,1],['SPA BLUE','#5b8fc6',['#74a4d6','#477cb4','#a8c8e8'],1700,.6,2.4,1.4],['SPA RED','#c26876',['#d58794','#ac525f'],1700,.6,2.4,1.4],['SPA GREEN','#7ea392',['#94b8a8','#688c7c'],1700,.6,2.4,1.4],
 ['GLAZE BLUE','#1a2f8c',['#2c49c4','#0e1c5c','#f0f4ff','#4b6be0'],900,2,10,2.4],['GLAZE RED','#b4141e',['#e0303a','#7c0c14','#ffe8e4','#f05a5a'],900,2,10,2.4],['GLAZE GREEN','#0f7a2a',['#1ea544','#085018','#e8ffe8','#38c05c'],700,2,10,2.4],
 ['TERRAZZO BLUE','#d9dbe2',['#1f2f70','#42537f','#8a8f9c','#f6f6f6','#2a2a30'],1500,2,9,1.2],['TERRAZZO WI','#f4f3ef',['#e8452f','#2a8a4f','#2c6bd0','#f2c21f','#e8782a','#1b1b1b'],500,2,10,1.3],['TERRAZZO WII','#f0efeb',['#1b1b1b','#55555a','#8e8e92'],800,2,11,1.2],
 ['MHP MEADOWS','#eef0e8',['#1f9a4d','#57b96e','#0e6a38','#b8dcb0'],520,4,18,3.2],['MHP OCEAN','#1a6fd0',['#0d4aa0','#6cc4f0','#e8f6ff','#2a8ee8'],600,4,18,3.2],['TUTTIFRUITTI','#d8d4c4',['#d8402f','#2a8a4f','#2458b8','#f0b81f','#e8e4d4','#16161a','#d86a9a'],1400,2,10,2.4],
 ['MARBLE','#e3ddcb',['#d6cfbb','#efeadb','#c6bfa9'],700,2,10,2],['GRANITE','#e6e6e4',['#17181a','#3c3d40','#8b8c8f','#ffffff'],1300,1.5,7,1.2],['ONYX','#e4dfd0',['#f2eee2','#c9c2ac','#b3ab94'],420,4,26,4],['QUARTZ','#8a8270',['#b9b29d','#5a5345','#d8d2bf','#3e3a30'],1500,2,10,1.8],
 ['MSP GALAXY','#1c86d8',['#0f5aa8','#5fd0e8','#e2f4f8','#3a6f9a','#8cc4e0'],260,10,60,5],['PAF','#b4ae9a',['#e8e4d6','#8a8472','#d8402f','#e2b52c','#5a7a4a','#2a2a28'],900,4,24,1.4],['POLES','#1c1e22',['#3a3d42','#6c6a62','#8b8e94','#26282c'],0,0,0,1]];
const WASTE=['#2c6bd0','#e8452f','#2a9a55','#f2c21f','#eef0ea','#16a0a8','#e8782a'];
const IDX=Object.fromEntries(MATS.map((m,i)=>[m[0],i]));

function drawSample(g,S,[,base,chips,n,min,max,stretch],seed){
 const r=rng(seed);g.fillStyle=base;g.fillRect(0,0,S,S);
 if(!n){let x=0;while(x<S){const w=S*(.08+r()*.14);g.fillStyle=chips[Math.floor(r()*chips.length)];g.fillRect(x,0,w,S);x+=w+S*.012}return} // poles
 for(let i=0;i<n;i++){const x=r()*S,y=r()*S,s=(min+r()*(max-min))*S/256,a=r()*Math.PI*2,ca=Math.cos(a),sa=Math.sin(a),sides=3+Math.floor(r()*3);g.fillStyle=chips[Math.floor(r()*chips.length)];g.beginPath();
  for(let k=0;k<sides;k++){const b=k/sides*Math.PI*2,u=Math.cos(b)*s*stretch*(.6+r()*.6),v=Math.sin(b)*s*(.6+r()*.6);g.lineTo(x+u*ca-v*sa,y+u*sa+v*ca)}g.closePath();g.fill()}
}

// A flake is a torn, uneven shard; a bottle is a turned profile with neck and cap (height 2.6 units, centred).
function shardGeometry(){const P=[[1.15,.12],[.15,.5],[-1,.3],[-.5,-.6],[.5,-.42]],pos=[];for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length];pos.push(0,0,0,a[0],a[1],0,b[0],b[1],0)}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.computeVertexNormals();return g}
function bottleGeometry(){const g=new THREE.LatheGeometry([[0,-1.3],[.42,-1.3],[.5,-1.15],[.5,.2],[.42,.55],[.2,.85],[.18,1.05],[.24,1.05],[.24,1.3],[0,1.3]].map(([x,y])=>new THREE.Vector2(x,y)),8);g.computeVertexNormals();return g}

export function createPPScene({lang='es'}={}){
 const root=new THREE.Group(),stage=new THREE.Group();root.add(stage);root.name='pp-root';
 const cues=[],labels=[];let t=0,clock=0,lastClock=0,paused=false,lastT=0,standby=false;
 const TL={loopStart:0,loopEnd:END,chapters:CH,hold:null};
 const score=createCuevaScore({bpm:120,prog:[[60,64,67],[57,60,64],[65,69,72],[67,71,74]],root:[36,33,41,43],sections:[[0,'intro'],[10,'build'],[20,'world'],[32,'pulse'],[42,'swarm'],[50,'os'],[58,'rise'],[60,'logo'],[71,'tail']],booms:[10,20,32,42,50,60],risers:[[8,2],[18,2],[30,2],[40,2],[48,2],[58,2]],rise:[58,2],logo:60,finalChord:[36,48,52,55,60,64,67,72]});
 const add=(o,parent=stage)=>{parent.add(o);return o};
 const std=(o={})=>new THREE.MeshStandardMaterial({roughness:.55,...o});
 const GLOW=canvasTexture(64,64,(g,w)=>{const gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.25,'rgba(255,255,255,.55)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,w,w)});
 const glow=(color,size,op=1)=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({map:GLOW,color,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:op}));s.material.userData.base=op;s.scale.setScalar(size);return s};
 const tag=s=>{s.userData.s0=s.scale.clone();labels.push(s);return s};
 const lab=o=>{const s=tag(fadeable(label({accent:C.mint,...o,px:(o.px||.0001)*1.7})));stage.add(s);return s};
 const tr3=x=>tr(x,lang);
 function card([main,sub],w=.22,accent=C.mint){const m=tr3(main),s=sub?tr3(sub):'',W=1024,H=s?260:180;
  const tex=canvasTexture(W,H,g=>{let fs=108;const F=f=>`800 ${f}px Archivo, Inter, Arial, sans-serif`;g.font=F(fs);while(g.measureText(m).width>W-70&&fs>36){fs-=4;g.font=F(fs)}
   g.textAlign='center';g.shadowColor='rgba(0,0,0,.8)';g.shadowBlur=26;g.fillStyle=C.ink;g.fillText(m,W/2,30+fs*.86);g.shadowBlur=0;g.fillStyle=accent;g.fillRect(W/2-70,52+fs*.9,140,6);
   if(s){g.font='500 38px Mono, ui-monospace, monospace';g.fillStyle=accent;g.fillText(s,W/2,52+fs*.9+60)}});
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:false,depthWrite:false,opacity:0}));sp.material.userData.base=1;sp.scale.set(w,w*H/W,1);sp.center.set(.5,0);sp.renderOrder=46;sp.userData.isLabel=true;stage.add(sp);return tag(sp)}
 const showCard=(c,a,b,y=.27,at=t)=>{const v=win(at,a,b,.08,.6),k=at-a,fl=k>0&&k<.3?(Math.sin(k*140)>-.2?1:.25):1;setFade(c,v*fl);c.position.y=y;c.userData.pop=1+.06*(1-out(seg(at,a,a+.8)))};

 stage.add(new THREE.HemisphereLight(0xffffff,0x1a1a1a,1.7));
 const key=new THREE.DirectionalLight(0xffffff,1.6);key.position.set(.2,.5,.35);stage.add(key,key.target);
 // Black room, like the company's website: it tints the real room around the scene.
 const dome=new THREE.Mesh(new THREE.SphereGeometry(1.6,24,12),new THREE.MeshBasicMaterial({color:C.night,transparent:true,opacity:0,depthWrite:false,side:THREE.BackSide}));dome.renderOrder=-20;dome.frustumCulled=false;root.add(dome);
 const contour=add(ribbon(Array.from({length:97},(_,i)=>[Math.cos(i/96*Math.PI*2)*.03,Math.sin(i/96*Math.PI*2)*.03]),.0012,false,ribbonMaterial(new THREE.Color(C.mint),0)));contour.material.uniforms.uProg.value=1;contour.position.y=.001;

 const brand=(src,draw)=>{const c=typeof document!=='undefined'?document.createElement('canvas'):null,map=new THREE.CanvasTexture(c);map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=4;if(globalThis.Image){const im=new Image();im.onload=()=>{draw(c,im);map.needsUpdate=true};im.src=src}return map};
 const symbolMap=brand('assets/brand/plasticpeople-simbolo.png',(c,im)=>{c.width=c.height=512;const g=c.getContext('2d');g.fillStyle=C.blue;g.beginPath();g.roundRect(0,0,512,512,70);g.fill();g.drawImage(im,66,66,380,380)});
 const symbol=size=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(size,size),new THREE.MeshBasicMaterial({map:symbolMap,transparent:true,depthTest:false,depthWrite:false}));m.renderOrder=45;return m};

 // ---------- plastic: flakes and bottles, driven by one timeline ----------
 const r=rng(2023),NS=760,NB=110,dummy=new THREE.Object3D(),col=new THREE.Color();
 const shards=add(new THREE.InstancedMesh(shardGeometry(),std({side:THREE.DoubleSide,roughness:.45}),NS)),bottles=add(new THREE.InstancedMesh(bottleGeometry(),std({roughness:.22}),NB));
 shards.frustumCulled=bottles.frustumCulled=false;
 const seed=n=>{const c=Math.floor(r()*WASTE.length),a=r()*Math.PI*2,R=Math.sqrt(r()),s={c,a,R,u:r(),v:r(),w:r(),ax:r()*6,ay:r()*6,hx:Math.cos(a)*R*.135,hz:Math.sin(a)*R*.135,hy:(1-R)*.075*(.3+r()*.7)+.004,mx:(r()-.5)*.22,mz:(r()-.5)*.145,sx:(r()-.5)*.5,sz:(r()-.5)*.5};s.at=1+s.u*7;return s};
 const SS=Array.from({length:NS},()=>seed()),BS=Array.from({length:NB},()=>seed());
 SS.forEach((s,i)=>shards.setColorAt(i,col.set(WASTE[s.c])));BS.forEach((s,i)=>bottles.setColorAt(i,col.set(WASTE[s.c])));
 const pv=new THREE.Vector3();
 // Where one piece of plastic is at time t (seek-safe: a pure function of t). Returns its size.
 function plastic(s,time,flake){
  const a=s.a+time*(1.2+s.w*.8),ring=s.a+time*.55,lift=io(seg(t,10+s.v*.8,12)),band=(s.c+s.w*.7)/WASTE.length,vy=.06+.28*lerp(s.u,band,seg(t,12,13.5)),vr=.05+.17*(vy-.06)/.28;
  let size=flake?.003+s.w*.004:.0105;
  if(t<10){const k=seg(t,s.at,s.at+.85);if(k<=0)return 0;pv.set(lerp(s.sx,s.hx,k),lerp(.58,s.hy,k*k),lerp(s.sz,s.hz,k))}
  else if(t<15){pv.set(lerp(s.hx,Math.cos(a)*vr,lift),lerp(s.hy,vy,lift),lerp(s.hz,Math.sin(a)*vr,lift));size*=lerp(1,.68,seg(t,12.4,13.4))}
  else if(t<17.7){const k=io(seg(t,15+s.v*.9,16.7));pv.set(lerp(Math.cos(a)*vr,s.mx,k),lerp(vy,.024+s.w*.004,k),lerp(Math.sin(a)*vr,s.mz,k));size*=.68}
  else if(t<42)return 0;
  else if(t<52){const k=io(seg(t,42+s.v*1.4,44));pv.set(Math.cos(ring)*RING*k+s.sx*.04,.012+s.w*.018,Math.sin(ring)*RING*k+s.sz*.04);size*=.72*k}
  else{const k=io(seg(t,52+s.v*.7,54)),ha=s.a+time*.22,hr=.13+s.u*.12,hy=.215+Math.sin(s.a*3+time*.5)*.1*s.v;pv.set(lerp(Math.cos(ring)*RING,Math.cos(ha)*hr,k),lerp(.02,hy,k),lerp(Math.sin(ring)*RING,Math.sin(ha)*hr*.7-.05,k));size*=.72*(1-seg(t,61.8,63.4))}
  return size}
 const updatePlastic=time=>{
  const tum=t<17.7||t>42;shards.visible=tum;bottles.visible=t<13.2;
  if(tum)SS.forEach((s,i)=>{const z=plastic(s,time,true);dummy.position.copy(pv);const rest=t<10&&seg(t,s.at,s.at+.85)>=1;dummy.rotation.set(rest?-Math.PI/2+s.ax*.08:s.ax+time*1.7,rest?s.ay*.08:s.ay+time*1.3,0);dummy.scale.setScalar(Math.max(z,1e-5));dummy.updateMatrix();shards.setMatrixAt(i,dummy.matrix)});
  if(bottles.visible)BS.forEach((s,i)=>{const z=plastic(s,time,false)*(1-seg(t,12.4+s.w*.4,13));dummy.position.copy(pv);const rest=t<10&&seg(t,s.at,s.at+.85)>=1;dummy.rotation.set(rest?Math.PI/2:s.ax+time*2.2,rest?0:s.ay+time,rest?s.ay:0);dummy.scale.setScalar(Math.max(z,1e-5));dummy.updateMatrix();bottles.setMatrixAt(i,dummy.matrix)});
  shards.instanceMatrix.needsUpdate=bottles.instanceMatrix.needsUpdate=true};

 // ---------- 1 · the challenge ----------
 const CNT={W:1024,H:230},cntCanvas=canvasTexture(CNT.W,CNT.H,()=>{}),counter=new THREE.Sprite(new THREE.SpriteMaterial({map:cntCanvas,transparent:true,depthTest:false,depthWrite:false}));counter.material.userData.base=1;counter.scale.set(.25,.25*CNT.H/CNT.W,1);counter.center.set(.5,0);counter.renderOrder=46;counter.userData.isLabel=true;add(tag(counter));
 let cntN=-1;const drawCounter=n=>{if(n===cntN)return;cntN=n;const g=cntCanvas.image.getContext('2d');g.clearRect(0,0,CNT.W,CNT.H);g.textAlign='center';g.font='800 128px Archivo, Inter, Arial, sans-serif';g.fillStyle=C.ink;g.shadowColor='rgba(0,0,0,.8)';g.shadowBlur=24;g.fillText(n.toLocaleString('es-ES'),CNT.W/2,126);g.shadowBlur=0;g.font='500 40px Mono, ui-monospace, monospace';g.fillStyle=C.coral;g.fillText(tr3(TXT.tonnes),CNT.W/2,192);cntCanvas.needsUpdate=true};
 const arc=(a0,a1,R)=>Array.from({length:81},(_,i)=>{const a=lerp(a0,a1,i/80)-Math.PI/2;return[Math.cos(a)*R,Math.sin(a)*R]});
 const ringAll=add(ribbon(arc(0,Math.PI*2,.168),.01,false,ribbonMaterial(new THREE.Color(C.coral),12))),ring15=add(ribbon(arc(0,Math.PI*2*.15,.168),.014,false,ribbonMaterial(new THREE.Color(C.mint),12)));ringAll.position.y=.002;ring15.position.y=.003;
 const lShare=lab({title:'< 15 %',lines:[tr3(TXT.share)],accent:C.mint}),cAsk=card(TXT.ask,.24),askSym=add(symbol(.05));

 // ---------- 2 · the press ----------
 const steel=std({color:'#3b3f42',metalness:.65,roughness:.35}),hotPlate=std({color:'#2d2f31',metalness:.5,roughness:.4,emissive:C.hot,emissiveIntensity:0});
 const press=add(new THREE.Group()),base=new THREE.Mesh(new THREE.BoxGeometry(.26,.02,.18),steel),top=new THREE.Mesh(new THREE.BoxGeometry(.26,.03,.18),hotPlate);base.position.y=.01;press.add(base,top);
 const posts=[[-.122,-.082],[.122,-.082],[.122,.082],[-.122,.082]].map(([x,z])=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,.27,10),steel);p.position.set(x,.135,z);press.add(p);return p});
 const crown=new THREE.Mesh(new THREE.BoxGeometry(.26,.018,.18),steel);crown.position.y=.27;press.add(crown);fadeable(press);
 const heat=add(glow(C.hot,.5,.7));heat.position.y=.05;
 const steam=Array.from({length:14},(_,i)=>{const s=add(glow('#ffffff',.04,.28));s.userData.a=i/14*Math.PI*2;return s});
 const sampleTex=def=>canvasTexture(256,256,(g,S)=>drawSample(g,S,def,IDX[def[0]]*97+7));
 const sheetMat=std({map:sampleTex(MATS[IDX['TERRAZZO WI']]),roughness:.5}),sheet=add(new THREE.Mesh(new THREE.BoxGeometry(.24,.006,.165),sheetMat));
 const lSteps=TXT.steps.map(x=>lab({title:tr3(x),lines:[],accent:C.hot,px:.00009}));
 const STEP_AT=[[10.2,12.2],[12.2,14.8],[14.8,17],[17.2,19.6],[19.8,22]];

 // ---------- 3 · the catalogue: the same board in 26 finishes ----------
 const BW=.085,BH=.1,boardG=new THREE.BoxGeometry(BW,BH,.0025),edge=std({color:'#111214'});
 const boards=MATS.map((def,i)=>{const tex=canvasTexture(256,301,(g,w,h)=>{g.fillStyle='#050606';g.fillRect(0,0,w,h);g.save();g.beginPath();g.roundRect(6,6,w-12,w-12,16);g.clip();g.translate(6,6);drawSample(g,w-12,def,i*97+7);g.restore();g.textAlign='center';g.fillStyle='#fff';let f=24;g.font=`500 ${f}px Inter, Arial, sans-serif`;while(g.measureText(def[0]).width>w-16&&f>14){f-=1;g.font=`500 ${f}px Inter, Arial, sans-serif`}g.fillText(def[0],w/2,h-14)});
  const face=std({map:tex,roughness:.5}),m=new THREE.Mesh(boardG,[edge,edge,edge,edge,face,face]);add(m);
  const row=i<5?0:i<10?1:i<16?2:i<21?3:4,n=row===2?6:5,col_=i-[0,5,10,16,21][row];return{m,i,at:21+i*.13,ha:i/26*Math.PI*4,hy:.05+i*.0092,gx:(col_-(n-1)/2)*.062,gz:(row-2)*.076,fall:27.6+((i*7)%26)*.04}});
 const cCat=card(TXT.cat);
 const hq=new THREE.Quaternion(),fq=new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/2,0,0));

 // ---------- 4 · cut and assemble ----------
 const pieceMat=(name)=>std({map:sampleTex(MATS[IDX[name]]),roughness:.5});
 const bench=add(new THREE.Group());fadeable(bench);
 const THICK=.008,box=(w,d,m)=>new THREE.Mesh(new THREE.BoxGeometry(w,THICK,d),m);
 const eul=(x,y,z)=>new THREE.Quaternion().setFromEuler(new THREE.Euler(x,y,z));
 // Flat on the board (fx, fz), then folded into a chair: seat, back and two sides.
 const CHAIR=[{w:.095,d:.095,fx:-.055,fz:-.03,p:[0,.078,0],q:eul(0,0,0)},{w:.095,d:.075,fx:.055,fz:-.03,p:[0,.122,-.046],q:eul(Math.PI/2,0,0)},{w:.08,d:.06,fx:-.055,fz:.05,p:[-.05,.04,0],q:eul(0,0,Math.PI/2)},{w:.08,d:.06,fx:.045,fz:.05,p:[.05,.04,0],q:eul(0,0,Math.PI/2)}].map((P,k)=>{const m=box(P.w,P.d,sheetMat);add(m);return{...P,m,at:37.2+k*.28,pos:new THREE.Vector3(...P.p),flat:new THREE.Quaternion()}});
 const backSym=symbol(.024);backSym.material.depthTest=true;backSym.renderOrder=0;backSym.rotation.x=-Math.PI/2;backSym.position.set(0,THICK/2+.0004,-.012);CHAIR[1].m.add(backSym);
 const cuts=CHAIR.map((P,k)=>{const c=[[-P.w/2,-P.d/2],[P.w/2,-P.d/2],[P.w/2,P.d/2],[-P.w/2,P.d/2]],pts=[];for(let j=0;j<4;j++)for(let i=0;i<14;i++){const a=c[j],b=c[(j+1)%4];pts.push([P.fx+lerp(a[0],b[0],i/14),P.fz+lerp(a[1],b[1],i/14)])}const R=add(ribbon(pts,.0016,true,ribbonMaterial(new THREE.Color(C.coral),60)));R.position.y=.0285;return{R,pts,at:33.2+k*.9,dur:.85}});
 const gantry=add(new THREE.Group()),beam=new THREE.Mesh(new THREE.BoxGeometry(.28,.012,.018),steel),head=new THREE.Mesh(new THREE.BoxGeometry(.018,.03,.026),steel);beam.position.y=.07;head.position.y=.05;gantry.add(beam,head);for(const x of[-.14,.14]){const l=new THREE.Mesh(new THREE.BoxGeometry(.01,.07,.012),steel);l.position.set(x,.035,0);gantry.add(l)}fadeable(gantry);
 const spark=add(glow(C.coral,.05));const lCnc=lab({title:tr3(TXT.cnc),lines:[],accent:C.coral,px:.00009});
 const part=(g,w,h,d,x,y,z,m)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);b.position.set(x,y,z);g.add(b);return b};
 const shelfM=pieceMat('MHP OCEAN'),shelf=add(new THREE.Group());for(const x of[-.05,.05])part(shelf,.007,.17,.04,x,.085,0,shelfM);for(const y of[.03,.08,.13,.168])part(shelf,.107,.007,.04,0,y,0,shelfM);shelf.position.set(-.135,0,-.06);shelf.rotation.y=.35;
 const tableM=pieceMat('GLAZE RED'),table=add(new THREE.Group());part(table,.14,.008,.09,0,.072,0,tableM);for(const x of[-.058,.058])part(table,.008,.068,.08,x,.034,0,tableM);table.position.set(.14,0,-.05);table.rotation.y=-.35;
 const cSteps=TXT.cards.map(c=>card(c,.2));

 // ---------- CUEVA: tags, passport and link to the Hub, over the finished furniture ----------
 const layer=add(new THREE.Group()),HUB=new THREE.Vector3(0,.012,.105),ringTex=canvasTexture(128,128,(g,w)=>{g.strokeStyle='#fff';g.lineWidth=6;g.beginPath();g.arc(64,64,58,0,7);g.stroke()});
 const hubBody=new THREE.Mesh(new THREE.CylinderGeometry(.03,.033,.01,32),std({color:'#0d2730',metalness:.4,emissive:C.cyan,emissiveIntensity:.25}));hubBody.position.copy(HUB).setY(.006);layer.add(hubBody);
 const hubMap=brand('assets/brand/cueva-blanco.svg',(c,im)=>{c.width=c.height=256;c.getContext('2d').drawImage(im,0,0,256,256)}),hubLogo=new THREE.Mesh(new THREE.CircleGeometry(.027,32),new THREE.MeshBasicMaterial({map:hubMap,transparent:true,depthWrite:false}));hubLogo.rotation.x=-Math.PI/2;hubLogo.position.copy(HUB).setY(.0118);layer.add(hubLogo);
 const hubGlow=glow(C.cyan,.1,.6);hubGlow.position.copy(HUB).setY(.02);layer.add(hubGlow);
 const wave=new THREE.Mesh(new THREE.RingGeometry(.97,1,64),new THREE.MeshBasicMaterial({color:C.cyan,transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending}));wave.rotation.x=-Math.PI/2;wave.position.copy(HUB).setY(.003);layer.add(wave);
 const TAGS=[[0,.168,-.044],[-.133,.178,-.04],[.14,.082,-.012]].map((p,i)=>{const P=new THREE.Vector3(...p),chip=new THREE.Mesh(new THREE.BoxGeometry(.022,.014,.003),std({color:C.mint,emissive:C.mint,emissiveIntensity:.9}));chip.position.copy(P);layer.add(chip);const gl=glow(C.mint,.07,.9);gl.position.copy(P);layer.add(gl);
  const pings=[0,1].map(()=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({map:ringTex,color:C.mint,transparent:true,depthWrite:false,depthTest:false}));s.position.copy(P);layer.add(s);return s});
  const cv=new THREE.QuadraticBezierCurve3(P,P.clone().lerp(HUB,.5).setY(Math.max(P.y,.05)+.07),HUB.clone().setY(.016)),line=new THREE.Mesh(new THREE.TubeGeometry(cv,40,.0013,6,false),new THREE.MeshBasicMaterial({color:C.cyan,transparent:true,depthWrite:false}));line.frustumCulled=false;layer.add(line);
  const sparks=[0,1,2].map(()=>{const s=glow(C.ink,.024);layer.add(s);return s});return{chip,gl,pings,cv,line,sparks,at:42.5+i*.45,linkAt:45.6+i*.3}});
 const cTagged=card(TXT.tagged),lHub=lab({title:tr3(TXT.hub[0]),lines:[tr3(TXT.hub[1])],accent:C.cyan,px:.00011});
 const imgs={};if(globalThis.Image)for(const[k,src]of[['c','assets/brand/cueva-blanco.svg'],['p','assets/brand/plasticpeople-simbolo.png']]){const i=new Image();i.src=src;imgs[k]=i}
 const DW=760,DH=540,dppTex=canvasTexture(DW,DH,()=>{}),dpp=new THREE.Sprite(new THREE.SpriteMaterial({map:dppTex,transparent:true,depthTest:false,depthWrite:false}));dpp.material.userData.base=1;dpp.scale.set(.215,.215*DH/DW,1);dpp.center.set(.5,0);dpp.renderOrder=46;dpp.userData.isLabel=true;layer.add(tag(dpp));
 let dppN=-1;const drawDpp=n=>{if(n===dppN)return;dppN=n;const g=dppTex.image.getContext('2d');g.clearRect(0,0,DW,DH);g.fillStyle='rgba(4,18,24,.93)';g.beginPath();g.roundRect(2,2,DW-4,DH-4,26);g.fill();g.strokeStyle=C.cyan;g.lineWidth=3;g.stroke();
  if(imgs.c?.complete&&imgs.c.naturalWidth)g.drawImage(imgs.c,22,18,64,64);if(imgs.p?.complete&&imgs.p.naturalWidth){g.fillStyle=C.blue;g.beginPath();g.roundRect(DW-84,20,60,60,10);g.fill();g.drawImage(imgs.p,DW-78,26,48,48)}
  g.textAlign='left';g.fillStyle=C.ink;g.font='700 38px Inter, Arial, sans-serif';g.fillText(tr3(TXT.dpp.head),98,62);g.fillStyle=C.cyan;g.fillRect(24,96,DW-48,2);
  TXT.dpp.rows.forEach(([a,b],i)=>{if(i>=n)return;const y=142+i*68;g.font='500 25px Mono, ui-monospace, monospace';g.fillStyle=C.cyan;g.fillText(tr3(a),28,y);g.font='600 37px Inter, Arial, sans-serif';g.fillStyle=C.ink;g.fillText(tr3(b),28,y+35)});
  if(n>=TXT.dpp.rows.length){g.font='500 24px Mono, ui-monospace, monospace';g.fillStyle='rgba(232,238,242,.8)';g.fillText(tr3(TXT.dpp.foot),28,DH-14)}dppTex.needsUpdate=true};
 const leader=new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(TAGS[0].chip.position,new THREE.Vector3(0,.205,-.03)),1,.001,6,false),new THREE.MeshBasicMaterial({color:C.cyan,transparent:true,depthWrite:false}));leader.frustumCulled=false;layer.add(leader);
 const CLOCK_CUES=[['chime',42.2],...TAGS.map(T=>['node',T.at]),['beep',42.6],['chime',44.4],['trace',45.6],['node',46.4],['riser',48],['boom',50]];

 // ---------- 5 · the cycle ----------
 const cycle=add(ribbon(arc(0,Math.PI*2,RING),.006,false,ribbonMaterial(new THREE.Color(C.mint),10)));cycle.position.y=.004;
 const arrow=add(new THREE.Mesh(new THREE.ConeGeometry(.012,.028,3),new THREE.MeshBasicMaterial({color:C.mint,transparent:true})));
 const lRing=TXT.ring.map((x,i)=>{const a=i/4*Math.PI*2-Math.PI/4;const l=lab({title:tr3(x),lines:[],accent:C.mint,px:.00009});l.position.set(Math.cos(a)*RING,.03,Math.sin(a)*RING);return l});
 const people=Array.from({length:12},(_,i)=>{const p=person(new THREE.Color().setHSL(i/12,.55,.62).getHex());p.scale.setScalar(.82);fadeable(p);add(p);return{p,a0:i/12*Math.PI*2}});
 const lJobs=lab({title:tr3(TXT.jobs),lines:[],accent:C.mint}),lWork=lab({title:tr3(TXT.work),lines:[],accent:C.mint}),lPort=lab({title:tr3(TXT.port[0]),lines:[tr3(TXT.port[1])],accent:C.mint,px:.00009}),cClosed=card(TXT.closed);

 // ---------- 6 · logo, and a small «Powered by CUEVA» ----------
 const LW=.25,LH=LW*286/1840,logoMap=brand('assets/brand/plasticpeople.svg',(c,im)=>{c.width=1840;c.height=286;c.getContext('2d').drawImage(im,0,0,1840,286)});
 const logo=add(new THREE.Group()),logoM=new THREE.Mesh(new THREE.PlaneGeometry(LW,LH),new THREE.MeshBasicMaterial({map:logoMap,transparent:true,depthTest:false,depthWrite:false}));logoM.renderOrder=45;logo.add(logoM);
 const flash=glow('#ffffff',.36,0);logo.add(flash);const logoSym=symbol(.066);logoSym.position.y=.062;logo.add(logoSym);
 const lImpact=card([TXT.impact]),lSite=lab({title:'',lines:[SITE],accent:C.ink,px:.00008});
 const poweredMap=brand('assets/brand/cueva-blanco.svg',(c,im)=>{c.width=900;c.height=144;const g=c.getContext('2d');g.font='500 60px Inter, Arial, sans-serif';g.fillStyle='#fff';g.textBaseline='middle';g.textAlign='left';const tx='Powered by CUEVA',w=g.measureText(tx).width,x=(900-w-144)/2;g.drawImage(im,x,6,132,132);g.fillText(tx,x+144,75)});
 const powered=new THREE.Sprite(new THREE.SpriteMaterial({map:poweredMap,transparent:true,depthTest:false,depthWrite:false,opacity:0}));powered.material.userData.base=.95;powered.scale.set(.17,.17*144/900,1);powered.center.set(.5,0);powered.renderOrder=46;powered.userData.isLabel=true;add(tag(powered));

 const CUES=[['pulse',.3],['pour',1.2],['splash',4.8],['chime',5.2],['riser',8],['boom',10],['swirl',10.2],['whirr',12.3],['glitch',12.5],['converge',15],['lift',16.8],['set',17.6],['thunder',17.7],['chime',19.8],['riser',18],['boom',20],...MATS.filter((_,i)=>i%3===0).map((_,k)=>['node',21+k*.39]),['swirl',25],['pour',27.6],['land',28.8],['boom',32],['whirr',33.2],['beep',33.4],['lift',37.2],['set',38.6],['join',38.9],['chime',39],['set',39.6],['set',40.2],['riser',40],['boom',42],['trace',42.2],['chime',46],['riser',50],['converge',52],['logo',54],['flash',55],['dissolve',61.8],['lock',63.4]];
 const camPos=new THREE.Vector3(),camL=new THREE.Vector3(),tmp=new THREE.Vector3(),tmp2=new THREE.Vector3(),q0=new THREE.Quaternion();

 function update(dt,camera){
  if(!paused&&!standby){lastT=t;lastClock=clock;clock+=dt;if(clock>=TL.loopEnd){clock=TL.loopStart;lastT=lastClock=-1e-4}t=warp(clock)}
  score.update(clock,!standby&&!paused);
  const time=performance.now()/1000;
  if(camera){camera.getWorldPosition(camPos);camL.copy(camPos);root.worldToLocal(camL)}else camL.set(0,.4,.5);
  if(standby){contour.material.uniforms.uOpacity.value=.45+.3*Math.sin(time*4);for(const o of stage.children)o.visible=o===contour||o.isLight;dome.visible=false;return}
  for(const o of stage.children)o.visible=true;
  if(!paused){for(const[n,a]of CUES)if(lastT<a&&t>=a)cues.push(n);for(const[n,a]of CLOCK_CUES)if(lastClock<a&&clock>=a)cues.push(n)}
  contour.visible=false;
  const beat=Math.exp(-((t%BEAT+BEAT)%BEAT)*7),faceY=Math.atan2(camL.x,camL.z);
  dome.material.opacity=clamp(io(seg(t,.2,4))*(1-io(seg(t,62.4,64))))*.86;dome.visible=dome.material.opacity>.01;dome.position.copy(camL);
  updatePlastic(time);

  // 1 · the challenge
  {const v=win(t,1.2,5.2,.3,.5);setFade(counter,v);if(v>0)drawCounter(Math.round(350e6*io(seg(t,1.3,4))/1e6)*1e6);counter.position.y=.24;
   const k=seg(t,5,6.8),e=win(t,5,9.8,.3,.5);ringAll.visible=ring15.visible=e>0;ringAll.material.uniforms.uProg.value=k;ringAll.material.uniforms.uOpacity.value=e*.75;ring15.material.uniforms.uProg.value=seg(t,6.6,7.2);ring15.material.uniforms.uOpacity.value=e;
   setFade(lShare,win(t,6.8,9.8,.3,.4));lShare.position.set(0,.2,0)}
  showCard(cAsk,8.2,10.2,.28);
  {const k=back(seg(t,8.5,9)),v=win(t,8.5,10.2,.1,.5);askSym.visible=v>0;askSym.material.opacity=v;askSym.position.set(0,.345,0);askSym.rotation.set(0,faceY,0);askSym.scale.setScalar(Math.max(.01,k))}

  // 2 · sort, shred, press
  lSteps.forEach((l,i)=>{const[a,b]=STEP_AT[i];setFade(l,win(t,a,b,.2,.3));l.position.set(0,i<3?.35:.31,0)});
  {const v=win(t,15.4,21,.6,.8),close=io(seg(t,16.8,17.6))*(1-io(seg(t,19.2,20))),py=lerp(.2,.05,close),hk=seg(t,17.6,18.6)*(1-seg(t,19.2,20.4));setFade(press,v);top.position.y=py;hotPlate.emissiveIntensity=hk*.85;
   heat.visible=hk>0;heat.material.opacity=hk*(.55+.2*beat);heat.position.y=.04;
   steam.forEach((s,i)=>{const u=((time*.5+i/14)%1),on=seg(t,17.7,18.3)*(1-seg(t,19.6,20.4));s.visible=on>0;s.position.set(Math.cos(s.userData.a)*(.16+u*.03),.05+u*.2,Math.sin(s.userData.a)*(.11+u*.03));s.material.opacity=on*(1-u)*.3;s.scale.setScalar(.03+u*.07)});
   const sv=t>=17.6&&t<38.2?1:0;sheet.visible=sv>0;const cool=seg(t,18.6,20.2),rise=io(seg(t,20.2,21.2));sheetMat.color.setRGB(lerp(1.6,1,cool),lerp(.55,1,cool),lerp(.2,1,cool));
   // after the press, the board becomes the first board of the catalogue, then returns to be cut
   const away=t<32?seg(t,21,21.6):1-io(seg(t,32,33));sheet.scale.setScalar(Math.max(.001,1-away));sheet.position.set(0,lerp(.024,t<32?.14:.024,t<32?rise:0),0);sheet.rotation.x=t<32?-rise*.6:0;
   if(t>=37.2)sheet.scale.setScalar(Math.max(.001,1-seg(t,38.6,39.4)));}

  // 3 · helix, then a rippling mosaic on the table
  {const mv=t<21?0:t<33?1:0;
   boards.forEach(B=>{const{m}=B;if(!mv&&!(t>=32&&t<33.2)){m.visible=false;return}
    const a=B.ha+time*(.28+.7*seg(t,24.4,26)*(1-seg(t,27,28))),R=.15,x=Math.cos(a)*R,z=Math.sin(a)*R,y=B.hy+.012*Math.sin(time+B.i),deal=back(seg(t,B.at,B.at+.45)),fall=io(seg(t,B.fall,B.fall+.9)),rip=Math.sin(time*2.6-Math.hypot(B.gx,B.gz)*22)*seg(t,29,30);
    if(deal<=0){m.visible=false;return}
    m.visible=true;const gone=t>=32?io(seg(t,32,33)):0;
    m.position.set(lerp(lerp(0,x,deal),B.gx,fall),lerp(lerp(.12,y,deal),.004+.008*(rip+1),fall)-gone*.01,lerp(lerp(0,z,deal),B.gz,fall));
    hq.setFromAxisAngle(tmp.set(0,1,0),Math.atan2(x,z));q0.copy(hq).slerp(fq,fall);m.quaternion.copy(q0);m.rotateX(rip*.14*fall);
    const k=lerp(1,.68,fall)*(1-gone);m.scale.setScalar(Math.max(.001,deal*k))})}
  showCard(cCat,29.4,31.9,.2);

  // 4 · cut and fold
  {const v=win(t,33,37.4,.4,.5);setFade(gantry,v);gantry.visible=v>0;spark.visible=false;
   cuts.forEach(C_=>{const k=seg(t,C_.at,C_.at+C_.dur),on=t>=C_.at&&t<37.4;C_.R.visible=on;C_.R.material.uniforms.uProg.value=k;C_.R.material.uniforms.uOpacity.value=on?1:0;
    if(k>0&&k<1){const P=C_.pts[Math.min(C_.pts.length-1,Math.floor(k*C_.pts.length))];gantry.position.set(0,.02,P[1]);head.position.x=P[0];spark.visible=true;spark.position.set(P[0],.032,P[1]);spark.material.opacity=.7+.3*Math.sin(time*50);spark.scale.setScalar(.03+.03*Math.random())}});
   setFade(lCnc,win(t,33.4,37,.3,.4));lCnc.position.set(0,.2,0);
   CHAIR.forEach(P=>{const k=io(seg(t,P.at,P.at+1.1)),on=t>=P.at&&t<43.4;P.m.visible=on;if(!on)return;const off=seg(t,42,43.2),lift=Math.sin(k*Math.PI)*.08;P.m.position.set(lerp(P.fx,P.pos.x*1.15,k),lerp(.028,P.pos.y*1.15,k)+lift,lerp(P.fz,P.pos.z*1.15,k));P.m.quaternion.copy(P.flat).slerp(P.q,k);P.m.scale.setScalar(Math.max(.001,1.15*(1-off)))});backSym.visible=t>=38.6;
   const pop=(g,a)=>{const k=back(seg(t,a,a+.55)),off=seg(t,42,43.2);g.visible=t>=a&&t<43.4;g.scale.setScalar(Math.max(.001,k*(1-off)));g.position.y=(1-out(seg(t,a,a+.45)))*.12};
   pop(shelf,39.4);pop(table,40)}
  showCard(cSteps[0],33.2,36.2,.24);showCard(cSteps[1],37.4,39.4,.3);showCard(cSteps[2],39.6,41.8,.3);

  // CUEVA layer: runs on the real clock while the scene clock stands still
  {const v=win(clock,42.1,50.4,.3,.6);layer.visible=v>0;
   if(v>0){const pu=(clock%1.5)/1.5;wave.scale.setScalar(.03+pu*.34);wave.material.opacity=v*(1-pu)*.7;hubGlow.material.opacity=v*(.4+.4*beat);hubBody.material.opacity=hubLogo.material.opacity=v;
    TAGS.forEach((T,i)=>{const k=back(seg(clock,T.at,T.at+.35)),on=clock>=T.at;T.chip.visible=T.gl.visible=on;T.chip.scale.setScalar(Math.max(.01,k));T.gl.material.opacity=v*(.55+.4*beat);T.chip.lookAt(tmp.copy(camL));
     T.pings.forEach((s,j)=>{const u=(clock*.7+j*.5+i*.2)%1;s.visible=on;s.scale.setScalar(.018+u*.075);s.material.opacity=v*(1-u)*.8});
     const l=seg(clock,T.linkAt,T.linkAt+.7);T.line.visible=l>0;T.line.geometry.setDrawRange(0,Math.ceil(1440*l));T.line.material.opacity=v*.75;
     T.sparks.forEach((s,j)=>{s.visible=l>=1;if(l>=1){T.cv.getPoint((clock*.55+j/3+i*.3)%1,s.position);s.material.opacity=v}})});
    drawDpp(clock<44.4?0:Math.min(TXT.dpp.rows.length,Math.floor((clock-44.4)/.32)+1));const d=win(clock,44.3,50.4,.25,.6);setFade(dpp,d);dpp.position.set(0,.198,0);leader.visible=d>0;leader.material.opacity=d*.8;
    setFade(lHub,win(clock,45.8,50.2,.3,.4));lHub.position.set(0,.03,.145);showCard(cTagged,42.3,44.3,.25,clock)}
   else{setFade(dpp,0);setFade(lHub,0);setFade(cTagged,0)}}

  // 5 · the cycle
  {const v=win(t,42.2,52.6,.5,.7),k=seg(t,42.4,44.4);cycle.visible=v>0;cycle.material.uniforms.uProg.value=k;cycle.material.uniforms.uOpacity.value=v*(.7+.3*beat);
   const a=time*.55;arrow.visible=v>0&&k>=1;arrow.position.set(Math.cos(a)*RING,.012,Math.sin(a)*RING);arrow.rotation.set(Math.PI/2,0,-a);arrow.material.opacity=v;
   lRing.forEach((l,i)=>setFade(l,v*win(t,43+i*.4,49.6,.3,.4)));
   people.forEach(({p,a0},i)=>{const g=a0-time*.14,R=RING+.05,on=v*out(seg(t,44+i*.1,45+i*.1));p.visible=on>.01;if(!p.visible)return;p.position.set(Math.cos(g)*R,0,Math.sin(g)*R);p.rotation.y=-g;p.scale.setScalar(.82*Math.max(.01,on));p.userData.update(time*5+i)});
   setFade(lJobs,win(t,44.6,47.6,.3,.4));lJobs.position.set(0,.14,0);setFade(lWork,win(t,47.4,50.4,.3,.4));lWork.position.set(0,.14,0);setFade(lPort,win(t,48,51.8,.3,.4));lPort.position.set(0,.2,0)}
  showCard(cClosed,44.4,47.2,.2);

  // 6 · logo
  {const k=io(seg(t,54,55.2)),v=t>=53.2&&t<63.4?1-seg(t,62.4,63.4):0,sk=back(seg(t,53.2,53.9));logo.visible=v>0;logoSym.material.opacity=v;logoSym.scale.setScalar(Math.max(.01,sk));logoSym.rotation.z=(1-io(seg(t,53.2,54.1)))*Math.PI*2;logo.position.set(0,.24+.004*Math.sin(time*1.4),0);logo.rotation.y=faceY;logoM.material.opacity=t>=54?v:0;
   logoMap.repeat.x=Math.max(.001,k);logoM.scale.x=Math.max(.001,k);logoM.position.x=-LW/2*(1-k);
   flash.material.opacity=Math.max(0,1-Math.abs(t-55.1)*2.4)*.8;flash.visible=flash.material.opacity>0;
   showCard(lImpact,55.6,62.6,.172);setFade(lSite,win(t,56.6,62.6,.5,.6));lSite.position.set(0,.14,0);
   setFade(powered,win(t,57,63.2,.6,.5));powered.position.set(0,.096,0)}

  // labels keep a readable size at any distance
  if(camera){const s=root.getWorldScale(tmp2).x;for(const l of labels){if(!l.visible)continue;l.getWorldPosition(tmp);const k=clamp(camPos.distanceTo(tmp)/s/.38,.5,1.2),p=l.userData.pop||1;l.scale.set(l.userData.s0.x*k*p,l.userData.s0.y*k*p,1)}}
 }

 const captions=TXT.ch.map(c=>({kick:tr3(c.kick),title:tr3(c.title),text:tr3(c.text)}));
 return{root,piece:{id:'PP',zone:'pp'},captions,chapterNames:TXT.short.map(tr3),timeline:TL,interaction:null,waiting:()=>false,score,
  setStandby:v=>{standby=v},get standby(){return standby},pointer:()=>false,
  get time(){return clock},get paused(){return paused},setPaused:v=>{paused=v},seek:v=>{clock=lastClock=v;t=lastT=warp(v)},
  chapterAt:(v=clock)=>{if(v<CH[0])return -1;let i=0;CH.forEach((c,k)=>{if(v>=c)i=k});return i},
  restart:()=>{t=lastT=clock=lastClock=0},takeCues:()=>cues.splice(0),update,setViewHeight:()=>{},infoVars:{id:'PP'},
  pick:rc=>{const vis=boards.map(B=>B.m).filter(m=>m.visible);return rc.intersectObjects(vis,false)[0]?{kind:'pp'}:null},
  dispose(){score.stop();root.traverse(o=>{o.geometry?.dispose();for(const m of[o.material].flat().filter(Boolean)){m.map?.dispose();m.dispose()}})}};
}

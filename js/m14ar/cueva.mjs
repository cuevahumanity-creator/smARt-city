// «CUEVA»: the trailer of the whole proposal, staged on the table around a printed QR (25 mm label on a card).
//  1 Un punto     — the amber point of the logo rises; the milestones ring out; the 75 × 75 cm grid unfolds as PLANO
//                   (paper, ink, red pencil) and a scanning blade turns it into GEMELO (night, cyan, mint).
//  2 Gramática    — J pieces fall onto the grid and assemble a house; the 3.355 envelopes spin as a galaxy.
//  3 Identidad    — a piece goes back to its mould and is born with its tag; every piece pings; its readings
//                   flow into the site's memory.
//  4 Neuronas     — six reader neurons wake, find each other, one leads, the memory is shared out; one falls
//                   (tap one to switch it off) and the swarm heals; the internet link is cut and it keeps working.
//  5 Registro     — readings sealed in a chain; a tampered link is caught by the verification and restored.
//  6 CUEVA OS     — boot, the three layers (readers & neurons · Hub · Manager) and the four interfaces orbiting.
//  7 Constelación — the ecosystem in orbit over a map of the network, with smARt city and the Port de Barcelona.
//  8 CUEVA        — the logo is rebuilt from its strokes, then everything collapses into the point and loops.
// Units: metres. Origin = QR centre, Y up, table at y = 0, the reader towards +Z. Simulations are illustrative.
import {THREE,RoundedBoxGeometry,clamp,seg,io,out,back,win,lerp,rng,canvasTexture,label,fadeable,setFade,ribbonMaterial,ribbon,outline} from './kit.mjs?v=9.0';
import {tr,fmt} from './text.mjs?v=9.0';
import {createCuevaScore} from './cueva-score.mjs?v=9.0';

const C={ink:'#E8EEF2',cyan:'#56DCE6',mint:'#00D4AA',sky:'#0EA5E9',coral:'#FF6B4A',amber:'#F59E0B',paper:'#f4efe2',pencil:'#d8452f',night:'#03101a'};
const BEAT=.6,CH=[2.4,14.4,26.4,38.4,55.2,64.8,79.2,91.2],END=103.2,M=.0375; // 75 cm module at 1:20
const L3=(es,en,ca)=>[es,en,ca];

const TXT={
 ch:[
  {kick:L3('01 · UN PUNTO','01 · ONE POINT','01 · UN PUNT'),title:L3('Un punto. Todo lo demás.','One point. Everything else.','Un punt. Tota la resta.'),
   text:L3('Todo empieza en un punto y en una trama de 75 × 75 cm: primero se dibuja (plano, lo diseñado) y después se verifica (gemelo, lo que de verdad ocurre).','It all starts with a point and a 75 × 75 cm grid: first it is drawn (the plan, as designed), then it is verified (the twin, what really happens).','Tot comença en un punt i en una trama de 75 × 75 cm: primer es dibuixa (plànol, el dissenyat) i després es verifica (bessó, el que passa de debò).')},
  {kick:L3('02 · LA GRAMÁTICA','02 · THE GRAMMAR','02 · LA GRAMÀTICA'),title:L3('Siete formatos. Una gramática.','Seven formats. One grammar.','Set formats. Una gramàtica.'),
   text:L3('Las piezas encajan sobre la misma trama, del forjado a la casa entera. Alrededor, las 3.355 envolventes que caben en ella.','The pieces fit on the same grid, from the floor slab to the whole house. Around it, the 3,355 envelopes it can hold.','Les peces encaixen sobre la mateixa trama, del forjat a la casa sencera. Al voltant, les 3.355 envolupants que hi caben.')},
  {kick:L3('03 · IDENTIDAD','03 · IDENTITY','03 · IDENTITAT'),title:L3('Cada pieza sabe quién es.','Every piece knows who it is.','Cada peça sap qui és.'),
   text:L3('La etiqueta nace en el molde. Cada lectura (fabricada, expedida, montada) se suma a la memoria de la pieza y de la obra.','The tag is born in the mould. Every reading (made, shipped, installed) adds to the memory of the piece and of the site.','L’etiqueta neix al motlle. Cada lectura (fabricada, expedida, muntada) se suma a la memòria de la peça i de l’obra.')},
  {kick:L3('04 · NEURONAS','04 · NEURONS','04 · NEURONES'),title:L3('Cada lector es una neurona.','Every reader is a neuron.','Cada lector és una neurona.'),
   text:L3('Se encuentran por la red local, una hace de principal y reparten la memoria. Si una cae, el enjambre se cura. Sin internet y sin nube. Simulación ilustrativa.','They find each other on the local network, one leads and they share out the memory. If one goes down, the swarm heals. No internet, no cloud. Illustrative simulation.','Es troben per la xarxa local, una fa de principal i reparteixen la memòria. Si una cau, l’eixam es cura. Sense internet i sense núvol. Simulació il·lustrativa.')},
  {kick:L3('05 · REGISTRO SELLADO','05 · SEALED LOG','05 · REGISTRE SEGELLAT'),title:L3('Nadie retoca la historia.','Nobody rewrites history.','Ningú retoca la història.'),
   text:L3('Cada lectura se sella en una cadena. Si alguien altera un eslabón, la verificación lo detecta. Simulación ilustrativa.','Every reading is sealed into a chain. If someone alters a link, the verification catches it. Illustrative simulation.','Cada lectura se segella en una cadena. Si algú altera una baula, la verificació ho detecta. Simulació il·lustrativa.')},
  {kick:L3('06 · CUEVA OS','06 · CUEVA OS','06 · CUEVA OS'),title:L3('Un mismo dato, cuatro interfaces.','One set of data, four interfaces.','Una mateixa dada, quatre interfícies.'),
   text:L3('Debajo, lectores y neuronas, Hub y Manager. Encima, Dashboard, Auditor, Marketplace y Comunidad, cada una en su estado real.','Underneath, readers and neurons, Hub and Manager. On top, Dashboard, Auditor, Marketplace and Community, each in its real status.','A sota, lectors i neurones, Hub i Manager. A sobre, Dashboard, Auditor, Marketplace i Comunitat, cadascuna en el seu estat real.')},
  {kick:L3('07 · CONSTELACIÓN','07 · CONSTELLATION','07 · CONSTEL·LACIÓ'),title:L3('Una gramática, muchos mundos.','One grammar, many worlds.','Una gramàtica, molts mons.'),
   text:L3('NANCA, OADAC, iPath, mOOlDe, Alsina, iD Stone, i-Slab y smARt city, con el Port de Barcelona y PLASTICPeople, sobre los lugares del ecosistema y sus obras.','NANCA, OADAC, iPath, mOOlDe, Alsina, iD Stone, i-Slab and smARt city, with the Port de Barcelona and PLASTICPeople, over the places of the ecosystem and its works.','NANCA, OADAC, iPath, mOOlDe, Alsina, iD Stone, i-Slab i smARt city, amb el Port de Barcelona i PLASTICPeople, sobre els llocs de l’ecosistema i les seves obres.')},
  {kick:L3('08 · CUEVA','08 · CUEVA','08 · CUEVA'),title:L3('Un punto. Todo lo demás.','One point. Everything else.','Un punt. Tota la resta.'),
   text:L3('Sistema constructivo, identidad de pieza, neuronas y CUEVA OS: una sola propuesta. Y vuelta a empezar.','Building system, piece identity, neurons and CUEVA OS: one single proposal. And back to the start.','Sistema constructiu, identitat de peça, neurones i CUEVA OS: una sola proposta. I tornem a començar.')},
 ],
 short:[L3('Punto','Point','Punt'),L3('Gramática','Grammar','Gramàtica'),L3('Identidad','Identity','Identitat'),L3('Neuronas','Neurons','Neurones'),L3('Registro','Log','Registre'),L3('OS','OS','OS'),L3('Red','Network','Xarxa'),L3('CUEVA','CUEVA','CUEVA')],
 cards:{
  punto:[L3('UN PUNTO.','ONE POINT.','UN PUNT.'),''],todo:[L3('TODO LO DEMÁS.','EVERYTHING ELSE.','TOTA LA RESTA.'),''],
  gram:[L3('UNA GRAMÁTICA.','ONE GRAMMAR.','UNA GRAMÀTICA.'),L3('siete formatos · trama de 75 × 75 cm','seven formats · 75 × 75 cm grid','set formats · trama de 75 × 75 cm')],
  iden:[L3('CADA PIEZA SABE QUIÉN ES.','EVERY PIECE KNOWS WHO IT IS.','CADA PEÇA SAP QUI ÉS.'),L3('y dónde va','and where it goes','i on va')],
  neur:[L3('CADA LECTOR, UNA NEURONA.','EVERY READER, A NEURON.','CADA LECTOR, UNA NEURONA.'),L3('juntas recuerdan la obra','together they remember the site','juntes recorden l’obra')],
  offl:[L3('SIN INTERNET. SIN NUBE.','NO INTERNET. NO CLOUD.','SENSE INTERNET. SENSE NÚVOL.'),L3('y sigue funcionando','and it keeps working','i continua funcionant')],
  seal:[L3('NADIE RETOCA LA HISTORIA.','NOBODY REWRITES HISTORY.','NINGÚ RETOCA LA HISTÒRIA.'),L3('registro sellado','sealed log','registre segellat')],
  os:[L3('CUEVA OS','CUEVA OS','CUEVA OS'),L3('un mismo dato · cuatro interfaces','one set of data · four interfaces','una mateixa dada · quatre interfícies')],
  world:[L3('MUCHOS MUNDOS.','MANY WORLDS.','MOLTS MONS.'),L3('una misma gramática','one shared grammar','una mateixa gramàtica')],
 },
 final:L3('Un punto. Todo lo demás.','One point. Everything else.','Un punt. Tota la resta.'),finalSub:'smARt city-Cueva · Port de Barcelona × PLASTICPeople',
 years:[['2008',L3('Fundación','Founded','Fundació')],['2014',L3('Patente de los elementos modulares','Patent of the modular elements','Patent dels elements modulars')],['2020',L3('BIM e identidad de pieza','BIM and piece identity','BIM i identitat de peça')],['2025',L3('IA y gemelo','AI and twin','IA i bessó')]],
 plano:L3('PLANO · lo diseñado','PLAN · as designed','PLÀNOL · el dissenyat'),gemelo:L3('GEMELO · lo verificado','TWIN · as verified','BESSÓ · el verificat'),
 module:L3('módulo 75 × 75 cm','75 × 75 cm module','mòdul 75 × 75 cm'),
 galaxy:[L3('3.355 envolventes','3,355 envelopes','3.355 envolupants'),L3('sobre una misma trama','on one shared grid','sobre una mateixa trama')],
 mould:[L3('Molde','Mould','Motlle'),L3('la etiqueta nace aquí','the tag is born here','l’etiqueta neix aquí')],
 passport:[L3('J2 · pieza 03','J2 · piece 03','J2 · peça 03'),[L3('fabricada → expedida → montada','made → shipped → installed','fabricada → expedida → muntada'),L3('cada lectura, a su memoria','every reading, into its memory','cada lectura, a la seva memòria'),L3('simulación ilustrativa','illustrative simulation','simulació il·lustrativa')]],
 memory:L3('memoria de la obra','the site’s memory','memòria de l’obra'),
 neurons:[L3('Hub · la obra','Hub · the site','Hub · l’obra'),L3('Fábrica','Factory','Fàbrica'),L3('Transporte','Transport','Transport'),L3('Lector de mano','Handheld reader','Lector de mà'),L3('Montaje','Assembly','Muntatge'),L3('Casa','Home','Casa')],
 neuronSub:L3('neurona','neuron','neurona'),
 code:L3('código de unión · seis cifras','pairing code · six digits','codi d’unió · sis xifres'),
 principal:[L3('Principal','Leader','Principal'),L3('coordina el enjambre','coordinates the swarm','coordina l’eixam')],
 tap:L3('Toca una neurona para apagarla','Tap a neuron to switch it off','Toca una neurona per apagar-la'),
 fell:L3('cae una neurona','a neuron goes down','cau una neurona'),
 heal:[L3('El enjambre se cura','The swarm heals','L’eixam es cura'),L3('la memoria se vuelve a repartir','the memory is shared out again','la memòria es torna a repartir')],
 cloud:L3('internet · nube','internet · cloud','internet · núvol'),offline:L3('sin conexión','offline','sense connexió'),
 sim:L3('simulación ilustrativa','illustrative simulation','simulació il·lustrativa'),
 altered:L3('alterado','altered','alterat'),caught:L3('la verificación lo detecta','verification catches it','la verificació ho detecta'),restored:L3('cadena restaurada','chain restored','cadena restaurada'),
 boot:[['CUEVA OS','CUEVA OS','CUEVA OS'],L3('▸ enjambre · 6 neuronas en línea','▸ swarm · 6 neurons online','▸ eixam · 6 neurones en línia'),L3('▸ registro sellado · verificado','▸ sealed log · verified','▸ registre segellat · verificat'),L3('▸ hub local · sin nube','▸ local hub · no cloud','▸ hub local · sense núvol'),
  ['▸ Manager · Designer · Nexus · Plaza','▸ Manager · Designer · Nexus · Plaza','▸ Manager · Designer · Nexus · Plaza'],L3('● listo','● ready','● a punt')],
 layers:[[L3('Lectores y neuronas','Readers and neurons','Lectors i neurones'),L3('leen cada pieza y hacen avanzar su estado','read every piece and move its state on','llegeixen cada peça i en fan avançar l’estat')],
  [['Hub','Hub','Hub'],L3('guarda la obra en local, también sin internet','keeps the site locally, offline too','guarda l’obra en local, també sense internet')],
  [['Manager','Manager','Manager'],L3('lleva cada pieza de la fábrica a la casa','takes each piece from factory to home','porta cada peça de la fàbrica a la casa')]],
 ifaces:[['Dashboard','01','dev',L3('avance de obra en tiempo real','site progress in real time','avenç d’obra en temps real'),['Dashboard','Dashboard','Dashboard']],
  ['Auditor','02','dev',L3('hitos verificados y trazabilidad','verified milestones and traceability','fites verificades i traçabilitat'),['Auditor','Auditor','Auditor']],
  ['Marketplace','03','def',L3('componentes y material de segundo ciclo','components and second-cycle material','components i material de segon cicle'),['Marketplace','Marketplace','Marketplace']],
  ['Comunidad','04','use',L3('estudios, fabricantes y montadores','studios, makers and installers','estudis, fabricants i muntadors'),L3('Comunidad','Community','Comunitat')]],
 iface:L3('Interfaz','Interface','Interfície'),
 status:{dev:L3('en desarrollo','in development','en desenvolupament'),def:L3('definida','defined','definida'),use:L3('en uso','in use','en ús'),proto:L3('prototipo','prototype','prototip')},
 tools:[['Designer','use'],['Nexus','proto'],['Plaza','use']],
 eco:[['NANCA','#dff37a',L3('licenciataria · Península','licensee · Iberian Peninsula','llicenciatària · Península')],['OADAC','#3f8fc4',L3('licenciataria · Illes Balears','licensee · Balearic Islands','llicenciatària · Illes Balears')],
  ['iPath','#A8E600',L3('ciudad','city','ciutat')],['mOOlDe','#b8ff00',L3('encofrado','formwork','encofrat')],['Alsina','#2fc4c8',L3('encofrado conectado','connected formwork','encofrat connectat')],
  ['iD Stone','#5a7bff',L3('piedra','stone','pedra')],['i-Slab','#00D4AA',L3('losa','slab','llosa')],['smARt city','#56DCE6',L3('Port de Barcelona × PLASTICPeople','Port de Barcelona × PLASTICPeople','Port de Barcelona × PLASTICPeople')]],
 moons:['M-14','M-07','M-19',L3('Saca','Bag','Sac')],
 port:[['Port de Barcelona','Port de Barcelona','Port de Barcelona'],L3('× PLASTICPeople · smARt city','× PLASTICPeople · smARt city','× PLASTICPeople · smARt city')],
 places:[['Vinyols i els Arcs',[1.04,41.10]],['Penedès',[1.70,41.345]],['Sentmenat',[2.135,41.61]],['Piedrahita',[-5.33,40.46]],['Navalcarnero',[-4.01,40.29]],['Plasencia',[-6.09,40.03]],['Menorca',[3.92,40.0]]],
 mapNote:L3('lugares del ecosistema y de sus obras','places of the ecosystem and its works','llocs de l’ecosistema i de les seves obres'),
};
// Rough outlines (lon, lat) for the holographic map.
const IBERIA=[[3.32,42.32],[3.0,41.85],[2.2,41.35],[1.0,41.05],[.7,40.75],[0,40],[-.33,39.45],[.2,38.75],[-.5,38.3],[-.8,37.65],[-1.65,37.35],[-2.1,36.72],[-3.5,36.72],[-4.4,36.72],[-5.35,36.1],[-6,36.4],[-6.4,36.8],[-7.4,37.2],[-8,37],[-8.9,37],[-8.8,38],[-9.5,38.75],[-9.4,39.4],[-8.9,40.2],[-8.75,41],[-8.85,41.9],[-9.3,42.9],[-9,43.2],[-8.2,43.6],[-7,43.55],[-5.7,43.58],[-4.5,43.4],[-3.5,43.45],[-2,43.3],[-1.6,43.38],[-1.4,43.05],[-.5,42.8],[.7,42.85],[1.7,42.5],[2.6,42.4],[3.2,42.43]];
const ISLES=[[[2.35,39.6],[3.1,39.95],[3.45,39.7],[3.25,39.35],[2.7,39.45]],[[3.8,40],[4.3,39.95],[4.25,39.82],[3.85,39.93]],[[1.2,38.95],[1.6,39.1],[1.55,38.85],[1.3,38.85]]];
const MAP={lon:[-9.8,4.6],lat:[35.8,44],w:.42};MAP.h=MAP.w*(MAP.lat[1]-MAP.lat[0])/((MAP.lon[1]-MAP.lon[0])*Math.cos(40*Math.PI/180));
const mapXZ=([lon,lat])=>[(lon-(MAP.lon[0]+MAP.lon[1])/2)/(MAP.lon[1]-MAP.lon[0])*MAP.w,-(lat-(MAP.lat[0]+MAP.lat[1])/2)/(MAP.lat[1]-MAP.lat[0])*MAP.h];
// The logo, stroke by stroke (from the brand SVG, 240 × 240 units).
const hex=[[91.56,74.75],[91.56,89.25],[79,96.5],[66.44,89.25],[66.44,74.75],[79,67.5]];
const rect=(x,y,w,h)=>[[x,y],[x+w,y],[x+w,y+h],[x,y+h]];
const LOGO=[{p:Array.from({length:96},(_,i)=>[120+92*Math.cos(i/96*Math.PI*2),120+92*Math.sin(i/96*Math.PI*2)]),c:C.ink,closed:true,w:2.4},
 {p:hex,c:C.cyan,closed:true,w:2.3},{p:[[91.8,82],[97.2,82]],c:C.mint,w:2},{p:rect(97.2,80.1,3.8,3.8),c:C.mint,closed:true,w:2},
 {p:rect(130,72,37,18),c:C.ink,closed:true,w:2.35},{p:[[148.5,90],[148.5,95]],c:C.sky,w:2},{p:rect(146.7,95,3.6,3.6),c:C.sky,closed:true,w:2},
 {p:rect(70,139,27,27),c:C.ink,closed:true,w:2.3},{p:[[97,152.5],[102.3,152.5]],c:C.coral,w:1.9},{p:rect(102.3,150.7,3.6,3.6),c:C.coral,closed:true,w:1.9},
 {p:rect(116,168,45,18),c:C.sky,closed:true,w:2.25},{p:[[161,177],[166.2,177]],c:C.mint,w:1.9},{p:rect(166.2,175.2,3.6,3.6),c:C.mint,closed:true,w:1.9}];
const LOGO_DOTS=[[176,177,3.7,C.mint],[120,120,2.6,C.amber]];
// House on the grid: 6 × 4 modules, seven formats in play (J1 1×1 … J8 4×2).
const TILES=[[0,0,4,2,'J8'],[4,0,2,2,'J4'],[0,2,2,1,'J2'],[2,2,2,1,'J2'],[4,2,1,1,'J1'],[5,2,1,1,'J1'],[0,3,2,1,'J2'],[2,3,1,1,'J1'],[3,3,2,1,'J2'],[5,3,1,1,'J1']];
const NEURONS=[[0,.085,-.2],[-.165,.055,-.1],[-.155,.045,.11],[0,.035,.19],[.155,.05,.11],[.165,.06,-.1]]; // hub, factory, transport, handheld, assembly, home
const LINKS=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[1,4],[2,5],[0,3]];
const HASH=['#3fa9c1','#81d0e2','#c4417b','#0a9f53','#e6237d','#5b11c8','#97e40a'],BAD='#9e00f2';

export function createCuevaScene({lang='es'}={}){
 const X=k=>tr(TXT[k],lang),root=new THREE.Group(),stage=new THREE.Group();root.add(stage);root.name='cueva-root';
 const cues=[],labels=[],disposables=[];let t=0,paused=false,lastT=0,standby=false;
 const TL={loopStart:0,loopEnd:END,chapters:CH,hold:null};
 const score=createCuevaScore();
 const col=h=>new THREE.Color(h);
 const GLOW=canvasTexture(64,64,(g,w)=>{const gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.25,'rgba(255,255,255,.55)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,w,w)});
 const add=(o,parent=stage)=>{parent.add(o);return o};
 const basic=(color,o={})=>new THREE.MeshBasicMaterial({color,transparent:true,depthWrite:false,...o});
 const glow=(color,size,op=1)=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({map:GLOW,color,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:op}));s.material.userData.base=op;s.scale.setScalar(size);s.userData.size=size;return s};
 const tag=s=>{s.userData.s0=s.scale.clone();labels.push(s);return s};
 const lab=(o)=>tag(fadeable(label({...o,px:(o.px||.0001)*1.7}))); // readable from 40–60 cm
 const pulse=x=>Math.exp(-((x%BEAT+BEAT)%BEAT)*7); // flash on every beat of the score

 stage.add(new THREE.HemisphereLight(0xe8fff8,0x0b2630,1.5));
 const key=new THREE.DirectionalLight(0xffffff,1.4);key.position.set(.2,.5,.3);stage.add(key,key.target);

 // Mood dome: tints the real room around the scene (paper for PLANO, night for GEMELO).
 const dome=new THREE.Mesh(new THREE.SphereGeometry(1.6,24,12),new THREE.MeshBasicMaterial({color:C.night,transparent:true,opacity:0,depthWrite:false,side:THREE.BackSide}));
 dome.renderOrder=-20;dome.frustumCulled=false;root.add(dome);const PAPER=col(C.paper),NIGHT=col(C.night);

 // ---------- standby / intro: contour around the QR ----------
 const contour=add(outline(.034,.034,col(C.mint),.0012));contour.position.y=.0005;
 const ringIn=add(ribbon(Array.from({length:96},(_,i)=>{const a=i/96*Math.PI*2;return[Math.cos(a)*.028,Math.sin(a)*.028]}),.0012,true,ribbonMaterial(col(C.amber),16)));ringIn.position.y=.0006;

 // ---------- 1 · the point, the years, the grid ----------
 const point=new THREE.Group();add(point);
 const pCore=new THREE.Mesh(new THREE.SphereGeometry(.0045,20,14),basic(C.amber));const pGlow=glow(C.amber,.05),pHalo=glow(C.amber,.14,.35);point.add(pCore,pGlow,pHalo);
 const yearRings=TXT.years.map(([y,txt],i)=>{const r=new THREE.Mesh(new THREE.RingGeometry(.985,1,128),basic(i%2?C.cyan:C.amber,{side:THREE.DoubleSide,blending:THREE.AdditiveBlending}));r.rotation.x=-Math.PI/2;r.position.y=.001+i*.0002;add(r);
  const l=lab({title:y,lines:[tr(txt,lang)],accent:i%2?C.cyan:C.amber,px:.00009});add(l);return{r,l,R:.05+i*.04,a:.5+i*1.35}});
 const cPunto=card(TXT.cards.punto,C.amber),cTodo=card(TXT.cards.todo,C.cyan);
 const gridU={uOpacity:{value:0},uReveal:{value:0},uSweep:{value:-1},uTime:{value:0},uR:{value:.31},uDim:{value:1}};
 const grid=add(new THREE.Mesh(new THREE.PlaneGeometry(.64,.64),new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,uniforms:gridU,
  vertexShader:'varying vec2 vP;void main(){vP=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:`uniform float uOpacity,uReveal,uSweep,uTime,uR,uDim;varying vec2 vP;
 float ln(float v,float c,float w){float d=abs(fract(v/c+.5)-.5)*c;return 1.-smoothstep(w,w+.0005,d);}
 void main(){float r=length(vP);float m=smoothstep(uReveal,uReveal-.03,r)*smoothstep(uR,uR*.7,r);if(m<.003)discard;
  float c=${M};float major=max(ln(vP.x,c,.00035),ln(vP.y,c,.00035));float minor=max(ln(vP.x,c/3.,.00015),ln(vP.y,c/3.,.00015));
  float gem=step(vP.x,uSweep);
  vec3 pc=mix(vec3(.957,.937,.886),vec3(.13,.17,.19),major*.9+minor*.3);
  vec2 q=abs(fract(vP/c+.5)-.5)*c;float node=1.-smoothstep(.0007,.0018,length(q));
  float wave=.5+.5*sin(r*80.-uTime*3.);
  vec3 gc=vec3(.01,.07,.1)+vec3(.34,.86,.9)*major*(.7+.4*wave)+vec3(.34,.86,.9)*minor*.3+vec3(0.,.83,.67)*node*1.4;
  float ga=(.38+major*.55+node*.6)*uDim;
  float blade=exp(-abs(vP.x-uSweep)*380.)*step(-.33,uSweep)*step(uSweep,.33);
  vec3 col=mix(pc,gc,gem)+vec3(.75,1.,1.)*blade;float a=mix(.9,ga,gem)+blade*.9;
  gl_FragColor=vec4(col,min(1.,a)*m*uOpacity);}`})));
 grid.rotation.x=-Math.PI/2;grid.position.y=.0004;grid.renderOrder=-2;
 const blade=add(new THREE.Mesh(new THREE.PlaneGeometry(.6,.11),new THREE.MeshBasicMaterial({map:canvasTexture(32,256,(g,w,h)=>{const gr=g.createLinearGradient(0,h,0,0);gr.addColorStop(0,'rgba(150,250,255,.95)');gr.addColorStop(1,'rgba(86,220,230,0)');g.fillStyle=gr;g.fillRect(0,0,w,h)}),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide})));
 blade.rotation.y=Math.PI/2;blade.position.y=.055;
 // red pencil: a dimension line on one module and a hand circle around the point
 const pencil=new THREE.Group();add(pencil);
 {const pm=()=>{const m=ribbonMaterial(col(C.pencil),900);m.uniforms.uProg.value=1;return m},r=rng(7);
  const dim=ribbon([[-M*2,M*1.5+.006],[-M,M*1.5+.006]],.0016,false,pm());const t1=ribbon([[-M*2,M*1.5+.002],[-M*2,M*1.5+.01]],.0011,false,pm()),t2=ribbon([[-M,M*1.5+.002],[-M,M*1.5+.01]],.0011,false,pm());
  const circ=ribbon(Array.from({length:70},(_,i)=>{const a=i/64*Math.PI*2,rr=.045*(1+(r()-.5)*.08);return[Math.cos(a)*rr,Math.sin(a)*rr*.96]}),.0012,false,pm());
  pencil.add(dim,t1,t2,circ);pencil.position.y=.0012;fadeable(pencil)}
 const lPlano=add(lab({title:X('plano'),lines:[X('module')],accent:C.pencil,tone:'light',px:.00009})),lGemelo=add(lab({title:X('gemelo'),lines:[X('module')],accent:C.cyan,px:.00009}));
 lPlano.position.set(-M*1.5,.02,M*1.5+.02);lGemelo.position.set(M*1.5,.02,M*1.5+.02);

 // ---------- 2 · the grammar: the house ----------
 const x0=-3*M,z0=-2*M,house=new THREE.Group();add(house);
 const edgeMat=()=>new THREE.LineBasicMaterial({color:C.cyan,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
 const tiles=TILES.map(([c,r,w,d,f],i)=>{const W=w*M-.0016,D=d*M-.0016,g=new THREE.Group();
  const body=new THREE.Mesh(new RoundedBoxGeometry(W,.004,D,2,.001),new THREE.MeshStandardMaterial({color:'#123b44',emissive:'#0d5f66',emissiveIntensity:.55,roughness:.45,transparent:true}));
  const edges=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(W,.004,D)),edgeMat());
  const chip=new THREE.Mesh(new THREE.BoxGeometry(.006,.0016,.004),basic(C.mint));chip.position.y=.0028;const chipG=glow(C.mint,.018,.9);chipG.position.y=.004;
  g.add(body,edges,chip,chipG);house.add(fadeable(g));
  const home=new THREE.Vector3(x0+(c+w/2)*M,.002,z0+(r+d/2)*M);g.position.copy(home);
  const ring=new THREE.Mesh(new THREE.RingGeometry(.9,1,48),basic(C.cyan,{side:THREE.DoubleSide,blending:THREE.AdditiveBlending}));ring.rotation.x=-Math.PI/2;add(ring);
  return{g,body,edges,chip,chipG,ring,home,f,w,d,land:15+i*.6,ping:32.4+(c+r*.5)*.28}});
 const cols=[[-3,-2],[0,-2],[3,-2],[-3,2],[0,2],[3,2]].map(([a,b])=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(.0016,.0016,.12,8),basic(C.cyan,{opacity:.85}));m.geometry.translate(0,.06,0);m.position.set(a*M,.004,b*M);house.add(fadeable(m));return m});
 const walls=[[0,-2,6,0],[0,2,6,0],[-3,0,4,1],[3,0,4,1]].map(([a,b,len,rot])=>{const g=new THREE.Group(),w=len*M;
  const p=new THREE.Mesh(new THREE.PlaneGeometry(w,.116),basic(C.cyan,{opacity:.07,side:THREE.DoubleSide}));p.position.y=.062;
  const e=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(w,.116)),edgeMat());e.position.y=.062;e.material.opacity=.5;e.material.userData.base=.5;
  // mullions every module
  const mul=new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(Array.from({length:len-1},(_,i)=>[-w/2+(i+1)*M,.004,0,-w/2+(i+1)*M,.12,0]).flat(),3)),edgeMat());mul.material.opacity=.3;mul.material.userData.base=.3;
  g.add(p,e,mul);g.position.set(a*M,0,b*M);g.rotation.y=rot?Math.PI/2:0;house.add(fadeable(g));return g});
 const roof=new THREE.Group();{const W=6*M,D=4*M,b=new THREE.Mesh(new RoundedBoxGeometry(W,.004,D,2,.001),new THREE.MeshStandardMaterial({color:'#0f3a44',emissive:'#0b5560',emissiveIntensity:.5,roughness:.4,transparent:true,opacity:.75}));
  const e=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(W,.004,D)),edgeMat());const gl=new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute([...Array.from({length:5},(_,i)=>[-W/2+(i+1)*M,.0022,-D/2,-W/2+(i+1)*M,.0022,D/2]).flat(),...Array.from({length:3},(_,i)=>[-W/2,.0022,-D/2+(i+1)*M,W/2,.0022,-D/2+(i+1)*M]).flat()],3)),edgeMat());gl.material.opacity=.35;gl.material.userData.base=.35;
  roof.add(b,e,gl);house.add(fadeable(roof))}
 // the 3.355 envelopes: a galaxy of points
 const NG=3355,galaxy=new THREE.Group();galaxy.rotation.order='YXZ';add(galaxy);
 {const r=rng(3355),pos=new Float32Array(NG*3),colr=new Float32Array(NG*3),pal=[col(C.cyan),col(C.mint),col(C.ink),col(C.amber),col(C.sky)],c=new THREE.Color();
  for(let i=0;i<NG;i++){const arm=i%3,R=.03+Math.pow(r(),.7)*.27,a=arm*2.094+R*9+(r()-.5)*.5;pos.set([Math.cos(a)*R,(r()-.5)*.02*(1-R/.3),Math.sin(a)*R],i*3);c.copy(pal[r()<.08?3:Math.floor(r()*3)]).multiplyScalar(.6+.4*r());colr.set([c.r,c.g,c.b],i*3)}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('color',new THREE.BufferAttribute(colr,3));
  const pts=new THREE.Points(g,new THREE.PointsMaterial({size:.0032,map:GLOW,vertexColors:true,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,sizeAttenuation:true}));pts.frustumCulled=false;galaxy.add(pts);galaxy.userData.pts=pts}
 const lGalaxy=add(lab({title:tr(TXT.galaxy[0],lang),lines:[tr(TXT.galaxy[1],lang)],accent:C.cyan,px:.0001}));
 const cGram=card(TXT.cards.gram,C.cyan);

 // ---------- 3 · identity: mould, tags, readings, memory ----------
 const MOULD=new THREE.Vector3(.02,0,.15);
 const mould=new THREE.Group();{const W=2*M+.008,D=M+.008;const e=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(W,.014,D)),new THREE.LineBasicMaterial({color:C.amber,transparent:true,depthWrite:false}));e.position.y=.007;
  const f=new THREE.Mesh(new THREE.PlaneGeometry(W,D),basic(C.amber,{opacity:.12,side:THREE.DoubleSide}));f.rotation.x=-Math.PI/2;f.position.y=.0005;mould.add(e,f)}
 mould.position.copy(MOULD);add(fadeable(mould));
 const lMould=add(lab({title:tr(TXT.mould[0],lang),lines:[tr(TXT.mould[1],lang)],accent:C.amber,px:.00009}));lMould.position.set(MOULD.x+.05,.02,MOULD.z+.01);
 const tagDrop=add(new THREE.Mesh(new THREE.BoxGeometry(.006,.0016,.004),basic(C.mint)));const tagFlash=add(glow(C.mint,.08));
 const lPass=add(lab({title:tr(TXT.passport[0],lang),lines:TXT.passport[1].map(l=>tr(l,lang)),accent:C.mint,px:.00009}));
 const ORB=new THREE.Vector3(0,.22,0),orb=new THREE.Group();orb.position.copy(ORB);add(orb);
 const orbWire=new THREE.Mesh(new THREE.IcosahedronGeometry(.022,1),basic(C.cyan,{wireframe:true,opacity:.55,blending:THREE.AdditiveBlending}));const orbGlow=glow(C.mint,.09,.8);orb.add(orbWire,orbGlow);fadeable(orb);
 const lMem=add(lab({title:X('memory'),lines:[X('sim')],accent:C.mint,px:.00009}));
 const NR=TILES.length*14,readG=new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(new Float32Array(NR*3),3));
 const reads=add(new THREE.Points(readG,new THREE.PointsMaterial({size:.005,map:GLOW,color:C.mint,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending})));reads.frustumCulled=false;
 const cIden=card(TXT.cards.iden,C.mint);

 // ---------- 4 · neurons ----------
 const neurons=NEURONS.map((p,i)=>{const g=new THREE.Group();g.position.set(...p);add(g);
  const core=new THREE.Mesh(new THREE.SphereGeometry(.0055,16,12),basic(C.mint));const halo=glow(C.mint,.06,.9),shell=new THREE.Mesh(new THREE.IcosahedronGeometry(.013,0),basic(C.cyan,{wireframe:true,opacity:.6,blending:THREE.AdditiveBlending}));
  // dendrites: a seeded branching tree, sorted by generation so they grow outwards
  const r=rng(101+i*17),segs=[];const grow=(from,dir,len,gen)=>{if(gen>3||len<.003)return;const to=from.clone().addScaledVector(dir,len);segs.push([gen,from,to]);
   for(let k=0;k<(gen<2?2:1);k++){const d=dir.clone().add(new THREE.Vector3(r()-.5,(r()-.5)*.6-.15,r()-.5).multiplyScalar(1.1)).normalize();grow(to,d,len*(.62+r()*.2),gen+1)}};
  for(let b=0;b<6;b++){const a=b/6*Math.PI*2+r();grow(new THREE.Vector3(),new THREE.Vector3(Math.cos(a),-.35+r()*.7,Math.sin(a)).normalize(),.014+r()*.006,0)}
  segs.sort((a,b)=>a[0]-b[0]);const dg=new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(segs.flatMap(([,a,b])=>[a.x,a.y,a.z,b.x,b.y,b.z]),3));
  const den=new THREE.LineSegments(dg,new THREE.LineBasicMaterial({color:C.cyan,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));den.userData.n=segs.length*2;
  const hit=new THREE.Mesh(new THREE.SphereGeometry(.03,8,6),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,colorWrite:false}));hit.userData.i=i;
  const beacon=new THREE.Mesh(new THREE.RingGeometry(.9,1,48),basic(C.cyan,{side:THREE.DoubleSide,blending:THREE.AdditiveBlending}));beacon.rotation.x=-Math.PI/2;beacon.position.set(p[0],.001,p[2]);add(beacon);
  const stem=new THREE.Mesh(new THREE.CylinderGeometry(.0005,.0005,p[1],4),basic(C.cyan,{opacity:.35}));stem.position.y=-p[1]/2;
  g.add(core,halo,shell,den,hit,stem);
  const l=add(lab({title:tr(TXT.neurons[i],lang),lines:[X('neuronSub')],accent:i?C.cyan:C.amber,px:.00008}));
  return{g,core,halo,shell,den,hit,beacon,stem,l,p:new THREE.Vector3(...p),wake:38.6+i*.32}});
 const hits=neurons.map(n=>n.hit);
 const curve=(a,b,lift)=>{const m=a.clone().add(b).multiplyScalar(.5);m.y+=lift;return new THREE.QuadraticBezierCurve3(a.clone(),m,b.clone())};
 const links=LINKS.map(([a,b],j)=>{const cv=curve(neurons[a].p,neurons[b].p,.03),geo=new THREE.BufferGeometry().setFromPoints(cv.getPoints(24));
  const line=add(new THREE.Line(geo,new THREE.LineBasicMaterial({color:C.cyan,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending})));line.frustumCulled=false;
  const spark=add(glow(C.ink,.016));return{a,b,cv,line,spark,at:40.2+j*.3}});
 const codes=Array.from({length:7},(_,k)=>{const r=rng(482913+k*7),d=k===6?'482 913':`${Math.floor(r()*900+100)} ${Math.floor(r()*900+100)}`;return add(lab({title:(k===6?'✓ ':'')+d,lines:[X('code')],accent:k===6?C.mint:C.cyan,px:.00008}))});
 const crown=add(new THREE.Mesh(new THREE.TorusGeometry(.024,.0011,6,64),basic(C.amber,{blending:THREE.AdditiveBlending})));
 const lPrin=add(lab({title:tr(TXT.principal[0],lang),lines:[tr(TXT.principal[1],lang)],accent:C.amber,px:.00008}));
 const NS=12,shards=add(new THREE.InstancedMesh(new THREE.OctahedronGeometry(.0034),new THREE.MeshBasicMaterial({transparent:true,depthWrite:false}),NS*2));shards.frustumCulled=false;
 {const c=new THREE.Color();for(let i=0;i<NS*2;i++)shards.setColorAt(i,c.set(i<NS?C.mint:C.sky))}
 const holder=i=>i<NS?i%6:(i-NS+3)%6;
 const lTap=add(lab({title:X('tap'),lines:[],accent:C.coral,px:.0001}));lTap.position.set(0,.16,.06);
 const lFell=add(lab({title:X('fell'),lines:[X('sim')],accent:C.coral,px:.00008})),lHeal=add(lab({title:tr(TXT.heal[0],lang),lines:[tr(TXT.heal[1],lang)],accent:C.mint,px:.00009}));
 const cloud=add(new THREE.Sprite(new THREE.SpriteMaterial({map:canvasTexture(512,300,g=>{g.clearRect(0,0,512,300);g.lineWidth=12;g.strokeStyle='#e8eef2';g.beginPath();g.arc(170,170,70,Math.PI*.55,Math.PI*1.6);g.arc(260,120,85,Math.PI*1.05,Math.PI*1.95);g.arc(350,175,62,Math.PI*1.5,Math.PI*.45);g.closePath();g.stroke();
  g.font='600 40px Mono, ui-monospace, monospace';g.fillStyle='#e8eef2';g.textAlign='center';g.fillText('internet',256,285)}),transparent:true,depthWrite:false})));
 cloud.scale.set(.06,.035,1);cloud.position.set(0,.3,-.2);cloud.material.userData.base=1;
 const cutX=add(new THREE.Sprite(new THREE.SpriteMaterial({map:canvasTexture(256,256,g=>{g.clearRect(0,0,256,256);g.strokeStyle='#FF6B4A';g.lineWidth=26;g.lineCap='round';g.beginPath();g.moveTo(50,50);g.lineTo(206,206);g.moveTo(206,50);g.lineTo(50,206);g.stroke()}),transparent:true,depthWrite:false})));cutX.scale.setScalar(.03);cutX.position.copy(cloud.position);
 const lOff=add(lab({title:X('offline'),lines:[X('cloud')],accent:C.coral,px:.00008}));lOff.position.set(0,.325,-.2);
 const netLine=[0,1].map(()=>{const l=add(new THREE.Line(new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(new Float32Array(12*3),3)),new THREE.LineBasicMaterial({color:C.cyan,transparent:true,depthWrite:false})));l.frustumCulled=false;return l});
 const cNeur=card(TXT.cards.neur,C.mint),cOffl=card(TXT.cards.offl,C.coral);

 // ---------- 5 · sealed log ----------
 const blocks=HASH.map((h,i)=>{const g=new THREE.Group(),x=-.15+i*.05;g.position.set(x,.2+.012*Math.sin(i*1.3),.05-.06*(x/.15)**2);add(g);
  const box=new THREE.Mesh(new RoundedBoxGeometry(.032,.02,.02,2,.003),new THREE.MeshStandardMaterial({color:'#0e2f38',emissive:'#0a4e58',emissiveIntensity:.6,roughness:.3,transparent:true,opacity:.92}));
  const e=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(.032,.02,.02)),edgeMat());const gl=glow(C.cyan,.05,.35);g.add(box,e,gl);fadeable(g);
  const l=add(lab({title:h,lines:[`#${String(i+1).padStart(2,'0')}`],accent:C.cyan,px:.00007})),lb=i===3?add(lab({title:BAD,lines:[X('altered')],accent:C.coral,px:.00007})):null;
  return{g,box,e,gl,l,lb,at:55.6+i*.75}});
 const chain=blocks.slice(1).map((b,i)=>{const a=blocks[i].g.position,c=b.g.position,m=new THREE.Mesh(new THREE.TorusGeometry(.006,.0013,6,18),basic(C.cyan,{blending:THREE.AdditiveBlending}));m.position.copy(a).add(c).multiplyScalar(.5);m.lookAt(c.x,c.y,c.z);m.rotateY(Math.PI/2);add(m);return m});
 const feed=blocks.map(()=>add(glow(C.mint,.02)));
 const scanner=add(glow(C.ink,.06));const lCaught=add(lab({title:X('caught'),lines:[X('sim')],accent:C.coral,px:.00008})),lRest=add(lab({title:X('restored'),lines:['✓'],accent:C.mint,px:.00008}));
 const cSeal=card(TXT.cards.seal,C.cyan);

 // ---------- 6 · CUEVA OS ----------
 const bootC=document.createElement('canvas');bootC.width=1024;bootC.height=560;const bootT=new THREE.CanvasTexture(bootC);bootT.colorSpace=THREE.SRGBColorSpace;let bootN=-1;
 const drawBoot=n=>{const g=bootC.getContext('2d');g.clearRect(0,0,1024,560);g.fillStyle='rgba(3,18,26,.86)';g.beginPath();g.roundRect(4,4,1016,552,28);g.fill();g.strokeStyle=C.cyan;g.lineWidth=3;g.stroke();
  for(let k=0;k<Math.min(n,TXT.boot.length);k++){const s=tr(TXT.boot[k],lang);g.font=k===0?'800 68px Archivo, Inter, Arial, sans-serif':'500 38px Mono, ui-monospace, monospace';g.fillStyle=k===0?'#f4fffb':k===TXT.boot.length-1?C.mint:C.cyan;g.fillText(s,56,k===0?100:120+k*70)}
  if(n<TXT.boot.length&&n>0){g.fillStyle=C.cyan;g.fillRect(56,120+n*70-30,22,36)}bootT.needsUpdate=true};
 const boot=add(new THREE.Sprite(new THREE.SpriteMaterial({map:bootT,transparent:true,depthTest:false,depthWrite:false})));boot.scale.set(.2,.11,1);boot.position.set(0,.2,0);boot.renderOrder=44;boot.material.userData.base=1;
 const LAYER_C=[C.mint,C.cyan,C.sky],layerTex=canvasTexture(1024,1024,(g,w)=>{g.clearRect(0,0,w,w);g.translate(w/2,w/2);g.strokeStyle='#ffffff';
  for(const[r,lw,a]of[[500,6,.9],[470,2,.5],[380,2,.35],[260,2,.3]]){g.globalAlpha=a;g.lineWidth=lw;g.beginPath();g.arc(0,0,r,0,7);g.stroke()}
  g.globalAlpha=.7;for(let i=0;i<120;i++){const a=i/120*Math.PI*2,l=i%10?14:40;g.lineWidth=i%10?2:5;g.beginPath();g.moveTo(Math.cos(a)*(500-l),Math.sin(a)*(500-l));g.lineTo(Math.cos(a)*500,Math.sin(a)*500);g.stroke()}
  g.globalAlpha=.55;g.lineWidth=16;for(let i=0;i<6;i++){g.beginPath();g.arc(0,0,425,i*1.05,i*1.05+.6);g.stroke()}
  g.globalAlpha=.12;g.fillStyle='#ffffff';g.beginPath();g.arc(0,0,500,0,7);g.fill()});
 const layers=TXT.layers.map(([n,d],k)=>{const R=[.17,.14,.11][k],m=add(new THREE.Mesh(new THREE.CircleGeometry(R,64),new THREE.MeshBasicMaterial({map:layerTex,color:LAYER_C[k],transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide})));
  m.rotation.x=-Math.PI/2;m.position.y=[.05,.12,.19][k];m.material.userData.base=.9;const l=add(lab({title:tr(n,lang),lines:[tr(d,lang)],accent:LAYER_C[k],px:.00008}));l.position.set(-R*.45,m.position.y+.004,R*.85);return{m,l,R,at:68.2+k*.55}});
 const NF=360,flowG=new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(new Float32Array(NF*3),3)).setAttribute('color',new THREE.BufferAttribute(new Float32Array(NF*3),3));
 const flow=add(new THREE.Points(flowG,new THREE.PointsMaterial({size:.0042,map:GLOW,vertexColors:true,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending})));flow.frustumCulled=false;
 const flowSeed=(()=>{const r=rng(64);return Array.from({length:NF},(_,i)=>[r(),r(),i%6,i%4])})();
 const STC={dev:C.amber,def:C.sky,use:C.mint,proto:C.coral};
 const panel=(name,num,st,desc,k)=>{const tex=canvasTexture(640,400,(g,w,h)=>{g.clearRect(0,0,w,h);g.fillStyle='rgba(3,20,28,.9)';g.beginPath();g.roundRect(3,3,w-6,h-6,26);g.fill();g.strokeStyle=C.cyan;g.lineWidth=3;g.stroke();
   g.font='500 24px Mono, ui-monospace, monospace';g.fillStyle='rgba(200,240,240,.75)';g.fillText(`${X('iface')} ${num}`,34,52);
   g.font='800 50px Archivo, Inter, Arial, sans-serif';g.fillStyle='#f4fffb';g.fillText(name,34,108);
   const s=tr(TXT.status[st],lang);g.font='600 24px Mono, ui-monospace, monospace';const sw=g.measureText(s).width+34;g.fillStyle=STC[st];g.globalAlpha=.2;g.beginPath();g.roundRect(34,128,sw,40,20);g.fill();g.globalAlpha=1;g.strokeStyle=STC[st];g.lineWidth=2;g.stroke();g.fillStyle=STC[st];g.fillText(s,51,156);
   g.font='500 24px Mono, ui-monospace, monospace';g.fillStyle='rgba(200,240,240,.8)';g.fillText(desc,34,210);
   g.save();g.translate(34,236);const r=rng(9+k*5);g.strokeStyle=C.cyan;g.fillStyle=C.cyan;
   if(k===0){for(let i=0;i<9;i++){const bh=30+r()*100;g.globalAlpha=.85;g.fillRect(i*60,130-bh,38,bh)}}
   else if(k===1){for(let i=0;i<3;i++){g.globalAlpha=.9;g.lineWidth=3;g.strokeRect(0,i*44,28,28);g.fillStyle=C.mint;g.font='700 26px Inter';g.fillText('✓',4,i*44+24);g.fillStyle='rgba(200,240,240,.5)';g.fillRect(48,i*44+10,320+r()*150,8)}}
   else if(k===2){for(let i=0;i<4;i++){g.globalAlpha=.85;g.lineWidth=3;g.strokeRect(i*140,0,118,128);g.fillStyle=[C.mint,C.cyan,C.amber,C.sky][i];g.fillRect(i*140+14,14,90,60);g.fillStyle='rgba(200,240,240,.5)';g.fillRect(i*140+14,90,70,10)}}
   else{const P=Array.from({length:9},()=>[r()*540,r()*125]);g.lineWidth=2;g.globalAlpha=.5;for(let i=0;i<9;i++)for(let j=i+1;j<9;j++)if((i*7+j)%3===0){g.beginPath();g.moveTo(...P[i]);g.lineTo(...P[j]);g.stroke()}g.globalAlpha=1;P.forEach(([x,y],i)=>{g.fillStyle=[C.mint,C.cyan,C.amber][i%3];g.beginPath();g.arc(x,y,12,0,7);g.fill()})}
   g.restore()});
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:false,depthWrite:false}));s.material.userData.base=1;s.scale.set(.072,.045,1);s.renderOrder=42;s.userData.isLabel=true;return add(tag(s))};
 const panels=TXT.ifaces.map(([,num,st,desc,names],k)=>({s:panel(tr(names,lang),num,st,tr(desc,lang),k),at:70+k*.6,a0:k*Math.PI/2+.4}));
 const tools=TXT.tools.map(([n,st],k)=>({s:add(lab({title:n,lines:[tr(TXT.status[st],lang)],accent:STC[st],px:.00008})),at:73.6+k*.4,a0:k*2.094}));
 const cOS=card(TXT.cards.os,C.cyan);

 // ---------- 7 · constellation over the network map ----------
 const mapTex=canvasTexture(1024,Math.round(1024*MAP.h/MAP.w),(g,w,h)=>{g.clearRect(0,0,w,h);const P=([lon,lat])=>[(lon-MAP.lon[0])/(MAP.lon[1]-MAP.lon[0])*w,(MAP.lat[1]-lat)/(MAP.lat[1]-MAP.lat[0])*h];
  g.strokeStyle='rgba(86,220,230,.12)';g.lineWidth=1;for(let lon=-9;lon<=4;lon++){const[x]=P([lon,0]);g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke()}for(let lat=36;lat<=44;lat++){const[,y]=P([0,lat]);g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke()}
  const shape=pts=>{g.beginPath();pts.forEach((p,i)=>{const[x,y]=P(p);i?g.lineTo(x,y):g.moveTo(x,y)});g.closePath()};
  for(const pts of[IBERIA,...ISLES]){shape(pts);g.fillStyle='rgba(8,60,72,.55)';g.fill();g.strokeStyle='rgba(126,230,220,.95)';g.lineWidth=3;g.stroke()}
  g.font='500 22px Mono, ui-monospace, monospace';g.fillStyle='rgba(200,240,240,.7)';g.fillText(X('mapNote'),30,h-26)});
 const map=add(new THREE.Mesh(new THREE.PlaneGeometry(MAP.w,MAP.h),new THREE.MeshBasicMaterial({map:mapTex,transparent:true,depthWrite:false,side:THREE.DoubleSide})));map.rotation.x=-Math.PI/2;map.position.y=.0008;map.renderOrder=-1;
 const BCN=mapXZ([2.17,41.37]),bcn=new THREE.Vector3(BCN[0],.002,BCN[1]);
 const bcnDot=add(glow(C.amber,.04)),bcnRing=add(new THREE.Mesh(new THREE.RingGeometry(.9,1,48),basic(C.amber,{side:THREE.DoubleSide,blending:THREE.AdditiveBlending})));bcnRing.rotation.x=-Math.PI/2;bcnDot.position.copy(bcn);bcnRing.position.copy(bcn);
 const lBcn=add(lab({title:tr(TXT.port[0],lang),lines:[tr(TXT.port[1],lang)],accent:C.amber,px:.00008}));lBcn.position.set(bcn.x,.03,bcn.z);
 const places=TXT.places.map(([n,ll],j)=>{const[x,z]=mapXZ(ll),p=new THREE.Vector3(x,.002,z),d=p.distanceTo(bcn),cv=curve(bcn,p,.015+d*.25),geo=new THREE.BufferGeometry().setFromPoints(cv.getPoints(32));
  const line=add(new THREE.Line(geo,new THREE.LineBasicMaterial({color:C.mint,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending})));line.frustumCulled=false;
  const dot=add(glow(C.mint,.022));dot.position.copy(p);const spark=add(glow(C.ink,.012));const l=d>.05?add(lab({title:n,lines:[],accent:C.mint,px:.00007})):null;if(l)l.position.set(x,.012,z);return{line,dot,spark,cv,l,at:81.4+j*.35}});
 const SUN=new THREE.Vector3(0,.2,0),sun=new THREE.Group();sun.position.copy(SUN);add(sun);const sunCore=new THREE.Mesh(new THREE.SphereGeometry(.007,20,14),basic(C.amber));const sunGlow=glow(C.amber,.07);sun.add(sunCore,sunGlow);
 const orbit=new THREE.Group();orbit.position.copy(SUN);orbit.rotation.x=.32;orbit.rotation.z=-.08;add(orbit);
 const orbitRing=new THREE.Mesh(new THREE.RingGeometry(.995,1,128),basic(C.cyan,{opacity:.35,side:THREE.DoubleSide,blending:THREE.AdditiveBlending}));orbitRing.rotation.x=-Math.PI/2;orbitRing.material.userData.base=.35;orbit.add(orbitRing);
 const planets=TXT.eco.map(([n,c,d],k)=>{const g=new THREE.Group(),big=k===7,s=new THREE.Mesh(new THREE.SphereGeometry(big?.0085:.0062,16,12),basic(c)),gl=glow(c,big?.05:.034,.85);g.add(s,gl);orbit.add(g);
  const l=lab({title:n,lines:[tr(d,lang)],accent:c,px:big?.00009:.00007});add(l);
  const moons=big?TXT.moons.map((m,j)=>{const mo=new THREE.Mesh(new THREE.SphereGeometry(.0028,10,8),basic(j===3?C.amber:C.ink));g.add(mo);const ml=lab({title:tr(m,lang),lines:[],accent:C.cyan,px:.00006});add(ml);return{mo,ml}}):[];
  return{g,l,moons,a0:k/8*Math.PI*2,at:82.2+k*.3}});
 const cWorld=card(TXT.cards.world,C.mint);

 // ---------- 8 · the logo ----------
 const logo=new THREE.Group();add(logo);const logoPlane=new THREE.Group();logoPlane.rotation.x=Math.PI/2;logo.add(logoPlane);const LS=.22/240;
 const strokes=LOGO.map((s,k)=>{const pts=s.p.map(([x,y])=>[(x-120)*LS,(y-120)*LS]),r=ribbon(pts,s.w*LS*1.7,!!s.closed,ribbonMaterial(col(s.c),40)),h=ribbon(pts,s.w*LS*5,!!s.closed,ribbonMaterial(col(s.c),0));
  h.material.blending=THREE.AdditiveBlending;logoPlane.add(h,r);return{r,h,at:93.6+k*.09,dur:k?.9:1.6}});
 const logoDots=LOGO_DOTS.map(([x,y,rr,c])=>{const d=new THREE.Mesh(new THREE.CircleGeometry(rr*LS*1.4,24),basic(c,{side:THREE.DoubleSide}));d.position.set((x-120)*LS,-.0002,(y-120)*LS);d.rotation.x=-Math.PI/2;const g=glow(c,.03);g.position.copy(d.position);logoPlane.add(d,g);return{d,g}});
 const cFinal=card([['CUEVA','CUEVA','CUEVA'],TXT.final],C.amber,.2,TXT.finalSub);

 // ---------- helpers ----------
 function card([main,sub],accent,w=.26,sub2=''){const m=tr(main,lang),s=sub?tr(sub,lang):'',W=1024,H=s?(sub2?340:290):190;
  const tex=canvasTexture(W,H,g=>{g.clearRect(0,0,W,H);let fs=112;const F=f=>`800 ${f}px Archivo, Inter, Arial, sans-serif`;g.font=F(fs);while(g.measureText(m).width>W-70&&fs>40){fs-=4;g.font=F(fs)}
   g.textAlign='center';g.shadowColor=accent;g.shadowBlur=30;g.fillStyle='#f6fffc';g.fillText(m,W/2,30+fs*.86);g.shadowBlur=0;g.fillStyle=accent;g.fillRect(W/2-70,52+fs*.9,140,6);
   if(s){g.font='500 40px Mono, ui-monospace, monospace';g.fillStyle=accent;g.fillText(s,W/2,52+fs*.9+64)}
   if(sub2){g.font='500 30px Mono, ui-monospace, monospace';g.fillStyle='rgba(232,238,242,.85)';g.fillText(sub2,W/2,52+fs*.9+118)}});
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:false,depthWrite:false,opacity:0}));sp.material.userData.base=1;sp.scale.set(w,w*H/W,1);sp.center.set(.5,0);sp.renderOrder=46;sp.userData.isLabel=true;sp.position.set(0,.27,0);
  stage.add(sp);return tag(sp)}
 // A trailer title: hard cut in with a short flicker, a slight push, then a soft fade.
 const showCard=(c,a,b,y=.27)=>{const v=win(t,a,b,.08,.7),k=t-a,fl=k>0&&k<.32?(Math.sin(k*140)>-.2?1:.25):1;setFade(c,v*fl);c.position.y=y;c.userData.pop=1+.06*(1-out(seg(t,a,a+.8)))};
 const at=(o,x,y,z)=>o.position.set(x,y,z);
 const CUES=[['pulse',.3],['rise',1],['pulse',2.4],['pulse',4.8],['ring',2.8],['ring',3.8],['ring',4.8],['ring',5.8],['explode',6.6],['trace',7],['riser',10.2],['swirl',10.4],['boom',14.4],
  ...TILES.map((_,i)=>[i%3?'node':'join',15+i*.6]),['lift',20.6],['set',22.9],['swirl',23],['converge',25.4],['boom',26.4],
  ['lift',27],['set',29.3],['chime',29.8],['set',32],['rise',34],['boom',38.4],...NEURONS.map((_,i)=>['pulse',38.6+i*.32]),['trace',40.2],['chime',42.6],['ring',43.2],['swirl',46.2],
  ['glitch',53],['riser',52.8],['boom',55.2],...HASH.map((_,i)=>['node',55.6+i*.75]),['glitch',60.8],['beep',61.6],['glitch',62.15],['chime',63],['boom',64.8],['boot',65.2],['whirr',68.2],['boom',67.6],['chime',70],['chime',71.8],
  ['riser',76.8],['boom',79.2],['trace',81.4],...TXT.eco.map((_,k)=>['node',82.2+k*.3]),['riser',88.8],['converge',91.2],['logo',93.6],['flash',94.8],['dissolve',99.8],['converge',101.2],['lock',102.6]];
 const cue=(n,a)=>{if(lastT<a&&t>=a)cues.push(n)};
 let fallen=-1,fallAt=Infinity;
 const camPos=new THREE.Vector3(),camL=new THREE.Vector3(),tmp=new THREE.Vector3(),tmp2=new THREE.Vector3(),tmpQ=new THREE.Quaternion(),mtx=new THREE.Matrix4(),one=new THREE.Vector3(1,1,1);
 const shardPos=(i,time,out)=>{const h=holder(i),n=neurons[h===fallen&&t>fallAt+.9?(h+1)%6:h].g.position,a=time*1.6+(i%NS)*.53+(i>=NS?Math.PI:0);return out.set(n.x+Math.cos(a)*.021,n.y+Math.sin(a*1.3)*.008,n.z+Math.sin(a)*.021)};

 function update(dt,camera){
  if(!paused&&!standby){lastT=t;t+=dt;if(t>=TL.loopEnd){t=TL.loopStart;lastT=t-1e-4}}
  if(t<47){fallen=-1;fallAt=Infinity}
  score.update(t,!standby&&!paused);
  const time=performance.now()/1000;
  if(camera){camera.getWorldPosition(camPos);camL.copy(camPos);root.worldToLocal(camL)}else camL.set(0,.4,.5);
  if(standby){contour.material.uniforms.uOpacity.value=.45+.3*Math.sin(time*4);for(const o of stage.children)o.visible=o===contour||o.isLight;dome.visible=false;return}
  for(const o of stage.children)o.visible=true;
  if(!paused)for(const[n,a]of CUES)cue(n,a);
  if(fallen<0&&t>=50.4&&lastT<50.4+.5){fallen=4;fallAt=50.4}
  if(fallAt<Infinity&&lastT<fallAt&&t>=fallAt)cues.push('glitch');
  if(fallAt<Infinity&&lastT<fallAt+2.1&&t>=fallAt+2.1)cues.push('chime');
  const bp=pulse(t);

  // mood: paper while drawing, night once verified; back to day at the end of the loop
  const paperK=win(t,5.6,12.2,1,1.4)*.22,nightK=clamp(io(seg(t,10.2,12.6))*(1-io(seg(t,99.6,102.6))))*(t<38.4?.55:t<55.2?.66:t<79.2?.6:t<93.6?.56:.7);
  dome.material.color.copy(PAPER).lerp(NIGHT,clamp(nightK*3));dome.material.opacity=Math.max(paperK,nightK);dome.visible=dome.material.opacity>.01;dome.position.copy(camL);

  // ---------- 1 ----------
  contour.material.uniforms.uOpacity.value=Math.max(win(t,0,6,.3,1.2),win(t,101.6,END+1,.5,.1))*(.7+.3*bp);
  ringIn.material.uniforms.uProg.value=out(seg(t,.2,1.6));ringIn.material.uniforms.uOpacity.value=win(t,.2,6.5,.3,1);
  // the point: rises from the QR, falls back to burst the grid, then becomes the sun and the logo's centre
  {let y,s=1;if(t<6.6)y=lerp(.004,.07,out(seg(t,.3,2.6)))-lerp(0,.066,io(seg(t,5.9,6.6)));else if(t<79.2)y=.004;else if(t<99.6)y=.2;else y=lerp(.205,.004,io(seg(t,99.6,102.6)));
   const vis=t<7?win(t,0,7.2,.25,.6):t>=79.2&&t<102.9?1:0;point.visible=vis>0;point.position.set(0,y,0);s=(1+.5*bp*(t<7?1:0))*(t<1?out(seg(t,0,1)):1)*(t>101.6?1-seg(t,101.6,102.9)*.7:1);point.scale.setScalar(s);
   pGlow.material.opacity=vis;pCore.material.opacity=vis;pHalo.material.opacity=.35*vis*(.6+.4*bp);if(t>=79.2&&t<99.6)point.visible=false}
  yearRings.forEach((y,i)=>{const a=2.6+i*1,k=out(seg(t,a,a+1.4)),v=win(t,a,8.6,.2,1.2);y.r.visible=v>0;y.r.scale.setScalar(.004+y.R*k);y.r.material.opacity=v*(1-.6*k)+.25*v;
   setFade(y.l,v);y.l.position.set(Math.sin(y.a)*y.R*k,.012+i*.004,Math.cos(y.a)*y.R*k)});
  showCard(cPunto,2.4,6.2,.11);showCard(cTodo,6.6,10,.15);
  gridU.uReveal.value=lerp(0,.34,out(seg(t,6.6,9.4)));gridU.uSweep.value=lerp(-.33,.34,io(seg(t,10.2,12.6)));gridU.uTime.value=time;
  gridU.uOpacity.value=t<79.2?1:t<101?1-seg(t,79.2,80.4):0;gridU.uDim.value=t<38.4?1:.7;grid.visible=gridU.uOpacity.value>0&&gridU.uReveal.value>0;if(t<6.6)grid.visible=false;
  {const v=win(t,10.1,12.7,.2,.3);setFade(blade,v);blade.position.x=gridU.uSweep.value}
  setFade(pencil,win(t,7.4,11.6,.8,.6));pencil.children.forEach((r,i)=>{r.material.uniforms.uProg.value=out(seg(t,7.4+i*.4,8.4+i*.4))});
  setFade(lPlano,win(t,8,11.4,.5,.5));setFade(lGemelo,win(t,12,15,.5,.8));

  // ---------- 2 · house ----------
  const houseA=t<38.4?1:t<55.2?1-.4*seg(t,38.4,40):t<79.2?.45-.2*seg(t,68,70):t<92?.25*(1-seg(t,79.2,80.6)):0;
  tiles.forEach((T,i)=>{let p=T.home,y=p.y,x=p.x,z=p.z,rx=0;const k=seg(t,T.land-.45,T.land);
   if(t<T.land){y=p.y+.13*(1-k*k);rx=(1-k)*.6*(i%2?1:-1)}else y=p.y+.004*Math.sin(seg(t,T.land,T.land+.25)*Math.PI);
   if(i===2&&t>=27&&t<32.2){ // the piece goes back to its mould and is born again with its tag
    const up=io(seg(t,27,27.8)),fly=io(seg(t,27.8,28.8)),dn=io(seg(t,28.8,29.3)),bk=io(seg(t,30.8,31.6)),ld=io(seg(t,31.6,32.1));
    if(t<30.8){x=lerp(p.x,MOULD.x,fly);z=lerp(p.z,MOULD.z,fly);y=p.y+.08*up-.0785*dn+.03*Math.sin(fly*Math.PI)}else{x=lerp(MOULD.x,p.x,bk);z=lerp(MOULD.z,p.z,bk);y=p.y+.07*Math.sin(bk*Math.PI)+.0015*(1-ld)}}
   T.g.position.set(x,y,z);T.g.rotation.set(rx,0,0);
   const v=(t<T.land?seg(t,T.land-.6,T.land-.3):1)*houseA;setFade(T.g,v);
   T.body.material.emissiveIntensity=.55+.9*Math.exp(-Math.max(0,t-T.land)*4)*(t>=T.land?1:0)+(t>T.ping?.9*Math.exp(-(t-T.ping)*3):0)+(i===2?1.4*win(t,29.7,30.6,.05,.6):0)+(t>52.8&&t<55.2?.5*bp:0);
   const chipV=t>T.ping?houseA:0;T.chip.visible=T.chipG.visible=chipV>0&&!(i===2&&t<29.8&&t>27);T.chip.material.opacity=chipV;T.chipG.material.opacity=chipV*(.5+.5*Math.exp(-Math.max(0,t-T.ping)*2)+.3*bp*(t>38.4?1:0));
   const rk=seg(t,T.land,T.land+.6),pk=seg(t,T.ping,T.ping+.7),rr=t<T.ping?rk:pk;T.ring.visible=rr>0&&rr<1&&houseA>0;T.ring.scale.setScalar(.01+rr*.05);T.ring.material.opacity=(1-rr)*.8;T.ring.position.set(p.x,.003,p.z);T.ring.material.color.set(t<T.ping?C.cyan:C.mint)});
  {const k=io(seg(t,20.6,22.2));cols.forEach(c=>{c.scale.y=Math.max(.001,k);setFade(c,k>0?houseA:0)});
   const w=io(seg(t,21,22.6));walls.forEach(g=>{g.scale.y=Math.max(.001,w);setFade(g,w>0?houseA:0)});
   const r=seg(t,22.4,22.9);roof.position.y=lerp(.2,.124,r*r)+.003*Math.sin(seg(t,22.9,23.2)*Math.PI);setFade(roof,(t<22.4?0:1)*houseA)}
  {const k=out(seg(t,22.8,24.2)),c=io(seg(t,25.4,26.4)),fin=t>=93.6?out(seg(t,94,96))*(1-io(seg(t,99.6,101.4))):0;
   const v=t<93.6?win(t,22.8,26.4,.3,.1):fin;galaxy.visible=v>0;galaxy.userData.pts.material.opacity=v;
   if(t<93.6){galaxy.position.set(0,lerp(.2,.13,c),0);galaxy.scale.setScalar(Math.max(.01,k*(1-c)));galaxy.rotation.set(0,0,0);galaxy.userData.pts.rotation.y=time*.35}
   else{galaxy.position.set(0,.205,0);galaxy.scale.setScalar(.45+.15*fin);galaxy.rotation.set(Math.PI/2-.25,Math.atan2(camL.x,camL.z),0);galaxy.userData.pts.rotation.y=time*.15}
   setFade(lGalaxy,win(t,23.4,26,.5,.5));at(lGalaxy,0,.265,0)}
  showCard(cGram,15.4,20,.22);

  // ---------- 3 · identity ----------
  setFade(mould,win(t,26.8,32.4,.6,.8));setFade(lMould,win(t,27.4,31,.4,.6));
  {const k=seg(t,29.3,29.8);tagDrop.visible=k>0&&k<1;tagDrop.position.set(MOULD.x,lerp(.07,.0045,io(k)),MOULD.z);tagDrop.rotation.y=k*6;
   const f=seg(t,29.8,30.6);tagFlash.visible=f>0&&f<1;tagFlash.material.opacity=Math.sin(f*Math.PI);tagFlash.scale.setScalar(.03+f*.09);tagFlash.position.set(MOULD.x,.006,MOULD.z)}
  setFade(lPass,win(t,32.6,37.6,.5,.6));at(lPass,tiles[2].home.x-.02,.07,tiles[2].home.z+.03);
  {const v=t<38.4?win(t,33.6,46.2,.8,.3):t<46.2?1:1-seg(t,46.2,47.4);setFade(orb,v);orb.scale.setScalar(.5+.5*out(seg(t,33.6,37))+.15*bp*(t<46.2?1:0));orbWire.rotation.set(time*.4,time*.6,0);
   setFade(lMem,win(t,35,40,.5,.5));at(lMem,.05,.26,0)}
  {const P=readG.attributes.position,on=win(t,34,39.2,.4,.6);reads.visible=on>0;reads.material.opacity=on;if(on>0)for(let i=0;i<NR;i++){const T=tiles[i/14|0],u=((time*.45+(i%14)/14)%1);
    tmp.copy(T.home);tmp.y=.006;const s=1-u;P.setXYZ(i,s*s*tmp.x+2*s*u*tmp.x*.6+u*u*ORB.x,s*s*tmp.y+2*s*u*.2+u*u*ORB.y,s*s*tmp.z+2*s*u*tmp.z*.6+u*u*ORB.z)}P.needsUpdate=true}
  showCard(cIden,32.4,36.4,.16);

  // ---------- 4 · neurons ----------
  const nV=t<38.4?0:t<64.8?1:t<79.2?.85:1-seg(t,79.2,80.6);
  const lead=fallen===0&&t>fallAt+1.4?5:0;
  neurons.forEach((n,i)=>{const w=seg(t,n.wake,n.wake+.6),dead=i===fallen?seg(t,fallAt,fallAt+1.5):0,glitch=i===fallen&&t>fallAt&&t<fallAt+.8;
   const v=nV*(w>0?1:0);n.g.visible=v>0;n.beacon.visible=v>0;n.l.visible=false;if(!v){setFade(n.l,0);return}
   const roam=i===3?Math.sin(time*.5)*.03:0;n.g.position.set(n.p.x+roam,i===fallen?lerp(n.p.y,.006,out(seg(t,fallAt+.7,fallAt+1.5))):n.p.y,n.p.z);
   const s=back(w)*(1+.25*bp*(1-dead))*(glitch&&Math.sin(time*90)>0?1.3:1);n.core.scale.setScalar(Math.max(.01,s));
   const c=dead>0?C.coral:i===lead?C.amber:C.mint;n.core.material.color.set(c);n.halo.material.color.set(c);n.core.material.opacity=v*(glitch?(Math.sin(time*70)>0?1:.2):1)*(i===fallen?1-.65*seg(t,fallAt+.8,fallAt+1.5):1);
   n.halo.material.opacity=v*(.55+.45*bp)*(1-dead*.85);n.halo.scale.setScalar(.06*(1+.3*bp));
   n.shell.rotation.set(time*.7+i,time*.5,0);n.shell.material.opacity=.6*v*(1-dead*.8);n.shell.position.x=glitch?(Math.sin(time*97)*.003):0;
   n.den.geometry.setDrawRange(0,Math.floor(n.den.userData.n*io(seg(t,n.wake,n.wake+1.4))/2)*2);n.den.material.opacity=v*(.75-.6*dead);n.den.material.color.set(dead>.5?'#5a6f74':C.cyan);n.stem.material.opacity=.35*v;
   const bk=((t-n.wake)%1.6)/1.6;n.beacon.scale.setScalar(.01+bk*.06);n.beacon.material.opacity=v*(1-bk)*.6*(t<47?1:.5)*(1-dead);n.beacon.position.set(n.g.position.x,.001,n.p.z);
   setFade(n.l,v*win(t,n.wake+.2,44.6,.4,.6));n.l.position.set(n.g.position.x,n.p.y+.022,n.p.z)});
  links.forEach((L,j)=>{const k=seg(t,L.at,L.at+.5),dead=L.a===fallen||L.b===fallen?seg(t,fallAt,fallAt+.6):0,v=nV*(k>0?1:0)*(t<64.8?1:.5);
   L.line.visible=v>0;L.line.geometry.setDrawRange(0,Math.max(2,Math.ceil(25*k)));L.line.material.opacity=v*(.45+.35*bp)*(1-.8*dead);L.line.material.color.set(dead>0?C.coral:C.cyan);
   const sp=t>52.8&&t<55.2?2.4:1,u=((time*.5*sp+j*.27)%1),from=(j%2)?L.cv.getPointAt(1-u,tmp):L.cv.getPointAt(u,tmp);L.spark.position.copy(from);L.spark.material.opacity=v*(1-dead)*(k>=1?1:0);L.spark.visible=L.spark.material.opacity>0});
  {const step=Math.floor(Math.max(0,t-40.4)/.12),fin=t>=42.4;codes.forEach((c,k)=>{const show=t>=40.4&&t<44.2&&(fin?k===6:k===step%6);setFade(c,show?1:0)});const m=links[0].cv.getPointAt(.5,tmp);codes.forEach(c=>c.position.set(m.x,m.y+.012,m.z))}
  {const hp=neurons[lead].g.position,k=out(seg(t,43.2,44)),v=nV*(t>=43.2?1:0);crown.visible=v>0;crown.material.opacity=v*(.7+.3*bp);crown.position.set(hp.x,hp.y+.004,hp.z);crown.scale.setScalar(Math.max(.01,k*(1+.08*bp)));crown.rotation.set(Math.PI/2+.35*Math.sin(time*.8),time*1.2,0);
   setFade(lPrin,win(t,43.4,46.6,.4,.5)+(lead?win(t,fallAt+1.4,fallAt+3.6,.4,.5):0));lPrin.position.set(hp.x,hp.y+.035,hp.z)}
  {const v=nV*(t>=46.2?1:0);shards.visible=v>0;shards.material.opacity=v;if(v>0){for(let i=0;i<NS*2;i++){const a=46.2+(i%NS)*.11+(i>=NS?.4:0),k=io(seg(t,a,a+1));shardPos(i,time,tmp2);
     tmp.copy(ORB).lerp(tmp2,k);tmp.y+=Math.sin(k*Math.PI)*.04;if(holder(i)===fallen&&t>fallAt+.9&&t<fallAt+2.1){const h=neurons[holder(i)].g.position,r=io(seg(t,fallAt+.9,fallAt+2.1));tmp.set(h.x,h.y,h.z).lerp(tmp2,r);tmp.y+=Math.sin(r*Math.PI)*.03}
     tmpQ.setFromAxisAngle(tmp2.set(0,1,0),time*2+i);mtx.compose(tmp,tmpQ,one.setScalar(k>0?1:.001));shards.setMatrixAt(i,mtx)}one.set(1,1,1);shards.instanceMatrix.needsUpdate=true}}
  {const v=fallen<0?win(t,47.4,50.4,.4,.2):0;setFade(lTap,v*(.75+.25*Math.sin(time*6)))}
  if(fallen>=0){const fp=neurons[fallen].g.position;setFade(lFell,win(t,fallAt+.1,fallAt+2,.2,.4));lFell.position.set(fp.x*.55,.06,fp.z*.55);setFade(lHeal,win(t,fallAt+1.9,fallAt+4,.3,.6));lHeal.position.set(0,.16,0)}else{setFade(lFell,0);setFade(lHeal,0)}
  {const v=nV*win(t,51.4,55.4,.5,.4)*(t<64.8?1:0),cut=seg(t,53,54.2),hp=neurons[lead].g.position;setFade(cloud,v*(t<53?1:.45));setFade(cutX,v*(t>=53?out(seg(t,53,53.3)):0));setFade(lOff,v*(t>=53.2?1:0));
   netLine.forEach((l,h)=>{l.visible=v>0;const P=l.geometry.attributes.position;for(let i=0;i<12;i++){const u=h?.5+i/11*.5:i/11*.5;tmp.copy(hp).lerp(cloud.position,u);tmp.y+=.02*Math.sin(u*Math.PI)-cut*cut*.06*(h?(1-u)*2:u*2);P.setXYZ(i,tmp.x,tmp.y,tmp.z)}P.needsUpdate=true;
    l.material.color.set(t<53?C.cyan:C.coral);l.material.opacity=v*(t<53?.5+.5*((time*3)%1):1-cut)})}
  showCard(cNeur,38.8,42.6,.24);showCard(cOffl,53.3,55.1,.21);

  // ---------- 5 · sealed log ----------
  const bV=t<55.2?0:1-seg(t,64.6,65.6);
  blocks.forEach((B,i)=>{const k=back(seg(t,B.at,B.at+.45)),bad=i===3&&t>=60.8&&t<63,v=bV*(t>=B.at?1:0);setFade(B.g,v);B.g.scale.setScalar(Math.max(.01,k));
   B.g.rotation.y=time*.3+i;B.g.position.x=-.15+i*.05+(bad&&t<61.6?Math.sin(time*80)*.003:0);
   B.box.material.color.set(bad?'#4a1010':'#0e2f38');B.box.material.emissive.set(bad?C.coral:'#0a4e58');B.e.material.color.set(bad?C.coral:C.cyan);B.gl.material.color.set(bad?C.coral:C.cyan);B.gl.material.opacity=v*(.3+.3*bp+(i===3&&t>=63?.8*Math.exp(-(t-63)*2):0));
   setFade(B.l,v*(bad?0:1));B.l.position.set(B.g.position.x,B.g.position.y+.016,B.g.position.z);if(B.lb){setFade(B.lb,v*(bad?1:0));B.lb.position.copy(B.l.position)}
   const f=seg(t,B.at-.5,B.at),src=neurons[i%6].g.position;feed[i].visible=f>0&&f<1&&bV>0;feed[i].position.copy(src).lerp(B.g.position,io(f));feed[i].position.y+=Math.sin(f*Math.PI)*.04});
  chain.forEach((c,i)=>{const v=bV*(t>=blocks[i+1].at+.2?1:0),bad=(i===2||i===3)&&t>=60.8&&t<63;c.visible=v>0;c.material.opacity=v*(.6+.4*bp);c.material.color.set(bad?C.coral:C.cyan)});
  {const k=seg(t,61.6,62.8);scanner.visible=k>0&&k<1&&bV>0;const i=k*6,a=blocks[Math.floor(i)].g.position,b=blocks[Math.min(6,Math.floor(i)+1)].g.position;scanner.position.copy(a).lerp(b,i%1);scanner.material.color.set(Math.abs(i-3)<.4?C.coral:C.ink);
   setFade(lCaught,bV*win(t,62.15,63.4,.15,.4));lCaught.position.set(blocks[3].g.position.x,.25,blocks[3].g.position.z);setFade(lRest,bV*win(t,63,64.6,.3,.5));lRest.position.set(blocks[3].g.position.x,.255,blocks[3].g.position.z)}
  showCard(cSeal,62.9,64.7,.27);

  // ---------- 6 · CUEVA OS ----------
  {const v=win(t,65,68.6,.2,.4),n=Math.min(TXT.boot.length,Math.floor(Math.max(0,t-65.2)/.45)+1);if(v>0&&n!==bootN){bootN=n;drawBoot(n)}setFade(boot,v);boot.scale.set(.2,.11*(1-io(seg(t,68.1,68.6))),1);boot.position.y=.2}
  const osV=t<68.2?0:t<79.2?1:1-seg(t,79.2,80.2);
  layers.forEach((Y,k)=>{const s=back(seg(t,Y.at,Y.at+.6)),v=osV*(t>=Y.at?1:0);Y.m.visible=v>0;Y.m.material.opacity=v*(.55+.25*bp);Y.m.scale.setScalar(Math.max(.01,s));Y.m.rotation.z=time*(k%2?-.15:.1);setFade(Y.l,v*win(t,Y.at+.3,72.6,.4,.6))});
  const PR=.165,PY=.29,pa=time*.18;
  panels.forEach((P,k)=>{const a=P.a0+pa,v=osV*out(seg(t,P.at,P.at+.6));setFade(P.s,v);P.s.position.set(Math.cos(a)*PR,PY+.006*Math.sin(time*1.3+k),Math.sin(a)*PR*.85);P.s.userData.pop=.6+.4*out(seg(t,P.at,P.at+.6))});
  tools.forEach((T,k)=>{const a=T.a0-time*.3,v=osV*out(seg(t,T.at,T.at+.5));setFade(T.s,v);T.s.position.set(Math.cos(a)*.12,.135,Math.sin(a)*.12)});
  {const P=flowG.attributes.position,Cc=flowG.attributes.color,v=osV*seg(t,68.6,69.6);flow.visible=v>0;flow.material.opacity=v;if(v>0){for(let i=0;i<NF;i++){const[s,r2,ni,pk]=flowSeed[i],u=(time*.16+s)%1,n=neurons[ni].p,a0=Math.atan2(n.z,n.x);let x,y,z,cr=.34,cg=.86,cb=.9;
     if(u<.75){const w=u/.75,R=lerp(.25,.03,w),a=a0+w*4.2+r2*.4;x=Math.cos(a)*R;z=Math.sin(a)*R;y=lerp(n.y,.24,w);cr=lerp(0,.34,w);cg=.83;cb=lerp(.67,.9,w)}
     else{const w=(u-.75)/.25,pp=panels[pk].s.position,on=t>=panels[pk].at;if(on){x=lerp(0,pp.x,w);z=lerp(0,pp.z,w);y=lerp(.24,pp.y,w);cr=.96;cg=.62;cb=.04}else{const a=w*9+r2*6;x=Math.cos(a)*.03*w;z=Math.sin(a)*.03*w;y=.24;cr=.34;cg=.86;cb=.9}}
     P.setXYZ(i,x,y,z);Cc.setXYZ(i,cr,cg,cb)}P.needsUpdate=Cc.needsUpdate=true}}
  showCard(cOS,67.6,71.6,.32);

  // ---------- 7 · constellation ----------
  const mV=t<79.2?0:t<92?out(seg(t,79.6,81))*(1-seg(t,92,93.6)):0;map.visible=mV>0;map.material.opacity=mV*.95;
  bcnDot.visible=bcnRing.visible=mV>0;bcnDot.material.opacity=mV;bcnDot.scale.setScalar(.04*(1+.6*bp));{const k=(t%1.2)/1.2;bcnRing.scale.setScalar(.005+k*.05);bcnRing.material.opacity=mV*(1-k)}
  setFade(lBcn,mV*win(t,81,91.4,.5,.6));
  places.forEach((Pl,j)=>{const k=seg(t,Pl.at,Pl.at+.6),v=mV*(k>0?1:0);Pl.line.visible=v>0;Pl.line.geometry.setDrawRange(0,Math.max(2,Math.ceil(33*k)));Pl.line.material.opacity=v*.8;
   Pl.dot.visible=v>0&&k>=1;Pl.dot.material.opacity=v*(.7+.3*bp);const u=(time*.35+j*.19)%1;Pl.cv.getPointAt(u,Pl.spark.position);Pl.spark.visible=v>0&&k>=1;Pl.spark.material.opacity=v;if(Pl.l)setFade(Pl.l,v*(k>=1?1:0)*win(t,Pl.at,91.4,.5,.5))});
  {const v=t<79.2?0:t<93.6?seg(t,80.6,81.6):0,col2=io(seg(t,91.2,93.4));sun.visible=v>0||(t>=93.6&&t<99.6);sun.position.set(0,lerp(.2,.205,col2),0);sunCore.scale.setScalar((t>=93.6?.55:1)*(1+.3*bp));sunGlow.material.opacity=sun.visible?1:0;sunGlow.scale.setScalar((t>=93.6?.045:.07)*(1+.4*bp));
   orbit.visible=v>0;setFade(orbitRing,v*(1-col2));
   planets.forEach((Pn,k)=>{const s=back(seg(t,Pn.at,Pn.at+.5)),a=Pn.a0+time*.22,R=(k===7?.16:.135)*(1-col2);Pn.g.visible=v>0&&s>0;Pn.g.position.set(Math.cos(a+col2*4)*R,0,Math.sin(a+col2*4)*R);Pn.g.scale.setScalar(Math.max(.01,s*(1-col2*.8)));
    Pn.g.getWorldPosition(tmp);stage.worldToLocal(tmp);setFade(Pn.l,v*(s>.5?1:0)*(1-col2)*win(t,Pn.at,91.6,.4,.5));Pn.l.position.set(tmp.x,tmp.y+.014,tmp.z);
    Pn.moons.forEach((Mn,j)=>{const ma=time*1.1+j*Math.PI/2;Mn.mo.position.set(Math.cos(ma)*.026,Math.sin(ma*.7)*.006,Math.sin(ma)*.026);Mn.mo.getWorldPosition(tmp2);stage.worldToLocal(tmp2);setFade(Mn.ml,v*(1-col2)*win(t,84.4+j*.25,91.4,.4,.5));Mn.ml.position.set(tmp2.x,tmp2.y+.006,tmp2.z)})})}
  showCard(cWorld,80.2,84.4,.32);

  // ---------- 8 · logo ----------
  {const v=t>=93.6&&t<102?1:0;logo.visible=v>0;logo.position.set(0,.205+.004*Math.sin(time*1.4),0);logo.rotation.y=Math.atan2(camL.x,camL.z);
   const un=io(seg(t,99.6,101.6));strokes.forEach(S=>{const k=out(seg(t,S.at,S.at+S.dur))*(1-un);S.r.material.uniforms.uProg.value=k;S.r.material.uniforms.uOpacity.value=v;S.h.material.uniforms.uProg.value=k;S.h.material.uniforms.uOpacity.value=v*(.18+.12*bp)});
   logoDots.forEach((D,i)=>{const k=back(seg(t,94.6+i*.15,95.1+i*.15))*(1-un);D.d.scale.setScalar(Math.max(.01,k));D.d.material.opacity=v;D.g.material.opacity=v*k*(.6+.4*bp);D.g.scale.setScalar(.03*(1+.5*bp))})}
  showCard(cFinal,95.2,100.6,.02);

  // ---------- labels keep a readable size at any distance ----------
  if(camera){const s=root.getWorldScale(tmp2).x;for(const l of labels){if(!l.visible)continue;l.getWorldPosition(tmp);const k=clamp(camPos.distanceTo(tmp)/s/.38,.5,1.2),p=l.userData.pop||1;l.scale.set(l.userData.s0.x*k*p,l.userData.s0.y*k*p,1)}}
 }

 const captions=TXT.ch.map(c=>({kick:tr(c.kick,lang),title:tr(c.title,lang),text:tr(c.text,lang)}));
 return{root,piece:{id:'CUEVA',zone:'cueva'},captions,chapterNames:TXT.short.map(c=>tr(c,lang)),timeline:TL,interaction:null,waiting:()=>false,score,
  setStandby:v=>{standby=v},get standby(){return standby},
  pointer(type,rc){if(type!=='down'||fallen>=0||t<47.4||t>50.4||standby)return false;const h=rc.intersectObjects(hits,false)[0];if(!h)return false;fallen=h.object.userData.i;fallAt=t+.05;return true},
  get time(){return t},get paused(){return paused},setPaused:v=>{paused=v},seek:v=>{t=v;lastT=v;if(v<47){fallen=-1;fallAt=Infinity}},
  chapterAt:(v=t)=>{if(v<TL.chapters[0])return -1;let i=0;TL.chapters.forEach((c,k)=>{if(v>=c)i=k});return i},
  restart:()=>{t=0;lastT=0;fallen=-1;fallAt=Infinity},takeCues:()=>cues.splice(0),update,setViewHeight:()=>{},infoVars:{id:'CUEVA'},
  pick:raycaster=>{const vis=[...hits.filter(h=>h.parent.visible),...tiles.map(T=>T.body).filter(b=>b.parent.visible),...blocks.map(B=>B.box).filter(b=>b.parent.visible)];return raycaster.intersectObjects(vis,false)[0]?{kind:'cueva'}:null},
  dispose(){score.stop();root.traverse(o=>{o.geometry?.dispose();for(const m of[o.material].flat().filter(Boolean)){m.map?.dispose();m.dispose()}})}};
}

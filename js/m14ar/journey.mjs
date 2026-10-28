// Holographic map of the piece's real journey: Port de Barcelona → PLASTICPeople (Vinyols i els Arcs) →
// precast plant in the Penedès → back to the port. Coastline simplified; road km from the project route.
import {THREE,MINT,canvasTexture,glowTexture} from './kit.mjs?v=9.0';

const LON=[.85,2.4],LAT=[40.95,41.55],W=1024,H=Math.round(W*.6/((LON[1]-LON[0])*Math.cos(41.2*Math.PI/180)));
const xy=([lon,lat])=>[(lon-LON[0])/(LON[1]-LON[0])*W,(LAT[1]-lat)/(LAT[1]-LAT[0])*H];
const COAST=[[2.42,41.5],[2.3,41.45],[2.19,41.39],[2.12,41.33],[2.05,41.29],[1.98,41.265],[1.81,41.235],[1.725,41.215],[1.62,41.18],[1.52,41.16],[1.4,41.135],[1.25,41.11],[1.15,41.07],[1.06,41.07],[.95,41.02],[.85,40.97]];
export const PLACES={port:[2.178,41.372],plant:[1.04,41.10],precast:[1.70,41.345]};
// Road-like legs (waypoints) and their km.
const LEGS=[{from:'port',to:'plant',via:[[2.05,41.33],[1.75,41.25],[1.45,41.19],[1.2,41.14]],km:116.6},
 {from:'plant',to:'precast',via:[[1.2,41.2],[1.45,41.3]],km:58.3},
 {from:'precast',to:'port',via:[[1.9,41.36],[2.05,41.36]],km:58.3}];
const TXT={title:['El viaje de {id}','{id}’s journey','El viatge de {id}'],port:['Port de Barcelona','Port de Barcelona','Port de Barcelona'],
 plant:['PLASTICPeople · Vinyols i els Arcs','PLASTICPeople · Vinyols i els Arcs','PLASTICPeople · Vinyols i els Arcs'],precast:['Prefabricador · Penedès','Precast plant · Penedès','Prefabricador · Penedès'],
 note:['km por carretera · ruta del demostrador','road km · demonstrator route','km per carretera · ruta del demostrador'],sea:['Mar Mediterrània','Mediterranean Sea','Mar Mediterrània']};
const pick=(a,lang)=>a[lang==='en'?1:lang==='ca'?2:0];

/** Returns {mesh, dot, update(u, a)}: u = 0..1 along the whole route, a = opacity. size = width in metres. */
export function createJourneyMap({id='M-14',lang='es',size=.2}={}){
 const pts=[],legStart=[];let total=0;
 for(const leg of LEGS){legStart.push(pts.length);const seq=[PLACES[leg.from],...leg.via,PLACES[leg.to]].map(xy);for(let i=0;i<seq.length;i++){if(pts.length&&i===0)continue;pts.push(seq[i])}}
 const lens=[0];for(let i=1;i<pts.length;i++)lens.push(lens[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));total=lens.at(-1);
 const tex=canvasTexture(W,H,g=>{
  g.clearRect(0,0,W,H);const r=26;g.fillStyle='rgba(4,28,36,.72)';g.beginPath();g.roundRect(2,2,W-4,H-4,r);g.fill();
  // sea below the coastline
  g.save();g.beginPath();g.roundRect(2,2,W-4,H-4,r);g.clip();g.beginPath();const c=COAST.map(xy);g.moveTo(c[0][0],c[0][1]);c.forEach(p=>g.lineTo(p[0],p[1]));g.lineTo(0,H);g.lineTo(W,H);g.closePath();
  const sea=g.createLinearGradient(0,H*.3,0,H);sea.addColorStop(0,'rgba(40,140,150,.55)');sea.addColorStop(1,'rgba(10,70,90,.35)');g.fillStyle=sea;g.fill();
  for(let y=H*.62;y<H;y+=14){g.strokeStyle='rgba(160,230,220,.08)';g.lineWidth=1;g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke()}g.restore();
  g.strokeStyle='rgba(126,219,194,.85)';g.lineWidth=3;g.beginPath();const cc=COAST.map(xy);g.moveTo(cc[0][0],cc[0][1]);cc.forEach(p=>g.lineTo(p[0],p[1]));g.stroke();
  // route
  g.setLineDash([16,10]);g.strokeStyle='#f2c46b';g.lineWidth=5;g.lineJoin='round';g.beginPath();g.moveTo(pts[0][0],pts[0][1]);pts.forEach(p=>g.lineTo(p[0],p[1]));g.stroke();g.setLineDash([]);
  // km labels mid-leg
  g.font='600 30px Mono, ui-monospace, monospace';g.fillStyle='#f6dca0';
  LEGS.forEach((leg,i)=>{const a=pts[legStart[i]],b=pts[(legStart[i+1]??pts.length-1)],m=[(a[0]+b[0])/2,(a[1]+b[1])/2];const t=`≈ ${String(leg.km).replace('.',lang==='en'?'.':',')} km`;g.fillText(t,m[0]-50,m[1]+(i===0?46:i===1?-18:-22))});
  // places
  for(const k of['port','plant','precast']){const[x,y]=xy(PLACES[k]);g.fillStyle='#ffffff';g.beginPath();g.arc(x,y,11,0,7);g.fill();g.strokeStyle='#7edbc2';g.lineWidth=5;g.beginPath();g.arc(x,y,20,0,7);g.stroke();
   g.font='650 30px Inter, Arial, sans-serif';g.fillStyle='#f4fff9';const label=pick(TXT[k],lang),w=g.measureText(label).width;g.fillText(label,k==='port'?x-w+10:k==='plant'?x+24:x-w/2-40,k==='precast'?y-34:k==='port'?y+52:y+10)}
  g.font='700 40px Archivo, Inter, sans-serif';g.fillStyle='#f4fff9';g.fillText(pick(TXT.title,lang).replace('{id}',id),34,62);
  g.font='500 24px Mono, ui-monospace, monospace';g.fillStyle='rgba(200,235,225,.8)';g.fillText(pick(TXT.note,lang),36,98);
  g.font='italic 400 28px Instrument, serif';g.fillStyle='rgba(180,230,225,.6)';g.fillText(pick(TXT.sea,lang),W*.55,H*.88);
 });
 const h=size*H/W,mesh=new THREE.Mesh(new THREE.PlaneGeometry(size,h),new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,side:THREE.DoubleSide,opacity:0}));mesh.renderOrder=30;
 const dot=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture(),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,color:0xf2c46b,opacity:0}));dot.scale.setScalar(size*.07);dot.renderOrder=31;mesh.add(dot);
 const at=u=>{const d=Math.max(0,Math.min(1,u))*total;let i=1;while(i<lens.length-1&&lens[i]<d)i++;const k=(d-lens[i-1])/((lens[i]-lens[i-1])||1),p=[pts[i-1][0]+(pts[i][0]-pts[i-1][0])*k,pts[i-1][1]+(pts[i][1]-pts[i-1][1])*k];return[(p[0]/W-.5)*size,(.5-p[1]/H)*h]};
 // Where each phase happens along the route (fractions of the total length).
 const f=i=>lens[legStart[i]]/total,phaseU={F1:f(1),F2:f(2),F3:(f(2)+1)/2,F4:1,F5:1,F6:1,F7:1,F8:1};
 return{mesh,dot,phaseU,update(u,a){mesh.material.opacity=a;mesh.visible=a>.002;const[x,y]=at(u);dot.position.set(x,y,.002);dot.material.opacity=a;dot.scale.setScalar(size*(.06+.015*Math.sin(performance.now()/180)))}};
}

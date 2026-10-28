// Borde (M-19, J1 75 × 75 mm): a day at the edge of Moll de Pescadors, Port Vell. Cinematic chapter 4, 40–70 s.
//  40–45   dawn: rosy light, the sea opens, a llaüt (fishing boat) comes in · a net mender works on the next slab
//  45.8–50 a fisherman on the quay catches the line thrown from the boat and moors it · a ferry passes far off (horn)
//  51–58.4 squall (illustrative): light drops, rain, wind, waves hit the quay and spray over the edge, lightning
//  58.4–60 the storm passes; the piece's passport "breathes": a reading pulse, its identity stays with it
//  60–70   golden evening: low sun, a glitter path on the water, the quay lamp and the boat light come on.
import {THREE,RoundedBoxGeometry,MINT,seg,io,out,win,lerp,clamp,label,person,bollard,rope,canvasTexture,outline,MATS} from './kit.mjs?v=8.0';
import {base} from './zones.mjs?v=8.0';
import {tr,fmt} from './text.mjs?v=8.0';

const CAPTION={
 kick:['04 · USO','04 · USE','04 · ÚS'],
 title:['Un día en el borde del muelle.','A day at the edge of the quay.','Un dia a la vora del moll.'],
 text:['Posición {pos}, Moll de Pescadors: amarres al alba, temporal y atardecer. Escena ilustrativa; su pasaporte guarda las lecturas reales.','Position {pos}, Moll de Pescadors: moorings at dawn, a squall and dusk. Illustrative scene; its passport keeps the real readings.','Posició {pos}, Moll de Pescadors: amarratges a l’alba, temporal i capvespre. Escena il·lustrativa; el seu passaport guarda les lectures reals.'],
};
const TXT={
 dawn:['Alba en el Moll de Pescadors','Dawn at Moll de Pescadors','Alba al Moll de Pescadors'],
 llaut:['Llaüt de pesca','Fishing llaüt','Llaüt de pesca'],
 storm:['Temporal · ilustrativo','Squall · illustrative','Temporal · il·lustratiu'],
 pulse:['{id} · su pasaporte sigue con ella','{id} · its passport stays with it','{id} · el passaport continua amb ella'],
 pulseSub:['Lectura ilustrativa · los datos reales están en el pasaporte','Illustrative reading · real data is in the passport','Lectura il·lustrativa · les dades reals són al passaport'],
};

/** Many small particles in one draw call. */
function particles(n,size,color,map,blending=THREE.AdditiveBlending){
 const geo=new THREE.BufferGeometry(),pos=new Float32Array(n*3);geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
 const pts=new THREE.Points(geo,new THREE.PointsMaterial({size,map,color,transparent:true,opacity:0,depthWrite:false,blending,sizeAttenuation:true}));
 pts.frustumCulled=false;return pts;
}
/** Double-ended Mediterranean fishing boat (llaüt) with mast, lateen yard and a small wheelhouse. */
function llaut(){
 const boat=new THREE.Group(),shape=new THREE.Shape([[-.058,0],[-.04,-.017],[.04,-.017],[.062,0],[.04,.017],[-.04,.017]].map(([x,z])=>new THREE.Vector2(x,z)));
 const hg=new THREE.ExtrudeGeometry(shape,{depth:.012,bevelEnabled:true,bevelSize:.0015,bevelThickness:.0015,bevelSegments:2});hg.rotateX(Math.PI/2);hg.translate(0,.012,0);
 const hull=new THREE.Mesh(hg,MATS.white),band=new THREE.Mesh(hg.clone(),MATS.blue);band.scale.set(1.012,.2,1.04);band.position.y=.0075;
 const deck=new THREE.Mesh(new THREE.BoxGeometry(.088,.0015,.026),MATS.wood);deck.position.y=.0125;
 const house=new THREE.Mesh(new RoundedBoxGeometry(.022,.014,.018,2,.002),MATS.white);house.position.set(-.022,.02,0);
 const mast=new THREE.Mesh(new THREE.CylinderGeometry(.0008,.0009,.07,6),MATS.wood);mast.position.set(.012,.047,0);
 const yard=new THREE.Mesh(new THREE.CylinderGeometry(.0006,.0006,.07,6),MATS.wood);yard.position.set(.016,.066,0);yard.rotation.z=-1.05;
 const lamp=new THREE.Mesh(new THREE.SphereGeometry(.0018,8,6),new THREE.MeshStandardMaterial({color:0xfff2d0,emissive:0xffd890,emissiveIntensity:0}));lamp.position.set(-.022,.029,0);
 boat.add(hull,band,deck,house,mast,yard,lamp);boat.traverse(o=>{if(o.isMesh)o.castShadow=true});boat.userData.lamp=lamp;return boat;
}
/** Far-off ferry silhouette with window lights that come on at dusk. */
function ferry(){
 const g=new THREE.Group(),navy=new THREE.MeshStandardMaterial({color:0x1d2f3a,roughness:.7}),white=new THREE.MeshStandardMaterial({color:0xe9eef0,roughness:.6});
 const hull=new THREE.Mesh(new THREE.BoxGeometry(.3,.022,.04),navy);hull.position.y=.011;
 const deck1=new THREE.Mesh(new THREE.BoxGeometry(.22,.016,.034),white);deck1.position.set(-.01,.03,0);
 const deck2=new THREE.Mesh(new THREE.BoxGeometry(.14,.012,.028),white);deck2.position.set(-.025,.044,0);
 const funnel=new THREE.Mesh(new THREE.BoxGeometry(.018,.02,.014),new THREE.MeshStandardMaterial({color:0x2f6f86,roughness:.5}));funnel.position.set(-.06,.058,0);
 const win=new THREE.MeshBasicMaterial({color:0xffd99a,transparent:true,opacity:0});
 const wins=new THREE.Mesh(new THREE.BoxGeometry(.2,.003,.0352),win);wins.position.set(-.01,.031,0);
 g.add(hull,deck1,deck2,funnel,wins);g.userData.win=win;return g;
}

export function bordeExperience(ctx){
 const{P,TABLE,piece,vars,lang,glow,lights}=ctx,b=base(ctx),{g}=b,L=a=>fmt(tr(a,lang),vars);
 // Neutral radial glow, so warm colours stay warm (the shared glow texture is mint).
 const warm=canvasTexture(64,64,(c,w)=>{const gr=c.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.4,'rgba(255,255,255,.45)');gr.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=gr;c.fillRect(0,0,w,w)});
 const quayZ=-(P.d/2+.007),W=Math.max(.5,P.w*6),BZ=quayZ-.034,WZ=quayZ-.085;
 const wat=b.quay(quayZ,W,{bollards:false});b.slab(-(P.w+.007));b.slab(P.w+.007);b.posLabel(`${piece.position} · ${piece.id}`);

 // Sky/sea tints over the water (the shared water shader keeps its own colours).
 const sheet=(color,blend,op)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(W*.92,.17),new THREE.MeshBasicMaterial({color,transparent:true,opacity:0,depthWrite:false,blending:blend,map:op}));m.rotation.x=-Math.PI/2;m.position.set(0,TABLE+.0007,WZ);g.add(m);return m};
 const dawnSea=sheet(0xff9fb0,THREE.AdditiveBlending,warm),stormSea=sheet(0x0a1820,THREE.NormalBlending,null),goldSea=sheet(0xff8a4c,THREE.AdditiveBlending,warm);
 const glitter=new THREE.Mesh(new THREE.PlaneGeometry(.035,.17,1,12),new THREE.MeshBasicMaterial({map:warm,color:0xffc070,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending}));glitter.rotation.x=-Math.PI/2;glitter.position.set(-.06,TABLE+.0009,WZ);g.add(glitter);
 const sun=new THREE.Sprite(new THREE.SpriteMaterial({map:warm,color:0xff7a3a,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:0}));sun.scale.setScalar(.16);g.add(sun);

 // Quay furniture: the mooring bollard right of the piece, a lamp on the left.
 const post=bollard();post.position.set(P.w/2+.035,TABLE+.0065,quayZ+.0045);g.add(post);
 const lamp=new THREE.Group(),lampHead=new THREE.MeshStandardMaterial({color:0xfff6dc,emissive:0xffd890,emissiveIntensity:0,roughness:.4});
 {const pole=new THREE.Mesh(new THREE.CylinderGeometry(.0012,.0016,.17,8),MATS.dark),arm=new THREE.Mesh(new THREE.BoxGeometry(.018,.0015,.0015),MATS.dark),head=new THREE.Mesh(new THREE.SphereGeometry(.0045,12,8),lampHead);
  pole.position.y=.085;arm.position.set(.008,.168,0);head.position.set(.016,.164,0);pole.castShadow=true;lamp.add(pole,arm,head)}
 lamp.position.set(-(P.w/2+.05),TABLE,quayZ+.012);g.add(lamp);
 const lampGlow=new THREE.Sprite(new THREE.SpriteMaterial({map:warm,color:0xffc878,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:0}));lampGlow.scale.setScalar(.05);lampGlow.position.set(lamp.position.x+.016,TABLE+.164,lamp.position.z);g.add(lampGlow);
 const pool=new THREE.Mesh(new THREE.CircleGeometry(.05,32),new THREE.MeshBasicMaterial({map:warm,color:0xffb860,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:0}));pool.rotation.x=-Math.PI/2;pool.position.set(lamp.position.x+.016,.0006,lamp.position.z+.02);g.add(pool);
 const lampRefl=new THREE.Mesh(new THREE.PlaneGeometry(.012,.08),new THREE.MeshBasicMaterial({map:warm,color:0xffc070,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending}));lampRefl.rotation.x=-Math.PI/2;lampRefl.position.set(lamp.position.x+.016,TABLE+.001,quayZ-.045);g.add(lampRefl);

 // The llaüt with its fisherman, its wake and the mooring line.
 const boat=llaut();g.add(boat);const line=rope();g.add(line);
 const skipper=person(0xd9c7a7);skipper.position.set(.018,.0125,0);skipper.scale.setScalar(.92);boat.add(skipper);
 const cabinLight=new THREE.Sprite(new THREE.SpriteMaterial({map:warm,color:0xffd9a0,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:0}));cabinLight.scale.setScalar(.024);g.add(cabinLight);
 const wake=particles(24,.007,0xffffff,glow);g.add(wake);
 const bowLocal=new THREE.Vector3(.062,.014,0),houseLocal=new THREE.Vector3(-.022,.029,0),bow=new THREE.Vector3(),cab=new THREE.Vector3();
 const llautL=label({title:L(TXT.llaut),px:.0001});g.add(llautL);

 // On the quay: a fisherman walks to the bollard and moors; a neighbour mends nets on the left slab.
 const mooring=person(0x9fc9c0);g.add(mooring);
 const mender=person(0xe6b8a2,{seated:true});mender.position.set(-(P.w+.007)-.008,-.039,-.002);mender.rotation.y=-Math.PI/2;g.add(mender);
 const netMat=new THREE.MeshStandardMaterial({color:0x3f7d5c,roughness:.95}),net=new THREE.Mesh(new THREE.SphereGeometry(.016,14,10),netMat);net.scale.set(1.3,.32,1);net.position.set(-(P.w+.007)+.018,.004,.006);net.castShadow=true;g.add(net);
 const floats=new THREE.Group();for(let i=0;i<7;i++){const f=new THREE.Mesh(new THREE.SphereGeometry(.0018,8,6),MATS.orange);const a=i/7*Math.PI*1.4-.4;f.position.set(net.position.x+Math.cos(a)*.019,.006,net.position.z+Math.sin(a)*.013);floats.add(f)}g.add(floats);

 // Far off: a ferry crossing the harbour.
 const ship=ferry();ship.position.set(.3,TABLE+.002,quayZ-.42);ship.scale.setScalar(.6);g.add(ship);
 const birds=b.gulls(3);

 // Weather: foam always breathing, rain streaks, spray bursts against the quay, lightning, a wet patch on the piece.
 const foam=particles(40,.006,0xffffff,glow);g.add(foam);
 const RN=220,rainGeo=new THREE.BufferGeometry();rainGeo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(RN*6),3));
 const rain=new THREE.LineSegments(rainGeo,new THREE.LineBasicMaterial({color:0xcfe3ee,transparent:true,opacity:0,depthWrite:false}));rain.frustumCulled=false;g.add(rain);
 const rseed=Array.from({length:RN},(_,i)=>[((Math.sin(i*91.3)*43758.5)%1+1)%1,((Math.sin(i*12.7)*24634.6)%1+1)%1,((Math.sin(i*55.1)*13758.9)%1+1)%1]);
 const BURSTS=[52.6,53.8,55,56.2],SPRAY=160,spray=particles(SPRAY,.008,0xf4fdff,warm,THREE.NormalBlending);g.add(spray);
 const sseed=Array.from({length:SPRAY},(_,i)=>({x:(Math.sin(i*12.9898)*.5)*.2,v:.32+((i*7)%10)/10*.22,vz:.06+((i*3)%10)/10*.11,vx:((i*5)%10/10-.5)*.07,burst:i%BURSTS.length}));
 const boltGeo=new THREE.BufferGeometry(),boltPts=[];{let x=.05,y=.32;for(let i=0;i<9;i++){const nx=x+(Math.sin(i*7.1)*.5)*.03,ny=y-.036;boltPts.push(x,y,0,nx,ny,0);x=nx;y=ny}}
 boltGeo.setAttribute('position',new THREE.Float32BufferAttribute(boltPts,3));const bolt=new THREE.LineSegments(boltGeo,new THREE.LineBasicMaterial({color:0xf2f7ff,transparent:true,opacity:0,depthWrite:false}));bolt.position.set(0,TABLE,quayZ-.38);bolt.frustumCulled=false;g.add(bolt);
 const boltGlow=new THREE.Sprite(new THREE.SpriteMaterial({map:warm,color:0xdce8ff,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:0}));boltGlow.scale.setScalar(.5);boltGlow.position.set(.06,.16,quayZ-.38);g.add(boltGlow);
 const wet=new THREE.Mesh(new THREE.PlaneGeometry(P.w*1.9,P.d*.8),new THREE.MeshBasicMaterial({color:0x10262c,transparent:true,opacity:0,depthWrite:false,
  alphaMap:canvasTexture(128,64,(c,w,h)=>{const gr=c.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#fff');gr.addColorStop(1,'#000');c.fillStyle=gr;c.fillRect(0,0,w,h)})}));
 wet.material.alphaMap.colorSpace=THREE.NoColorSpace;wet.rotation.x=-Math.PI/2;wet.position.set(0,.0005,-P.d/2+P.d*.4);g.add(wet);

 // The passport "breathes" after the storm: a reading pulse around the piece.
 const pulses=[0,1,2].map(()=>{const o=outline(P.w+.006,P.d+.006,MINT,.0016);o.position.y=.0008;g.add(o);return o});
 const pulseL=label({title:L(TXT.pulse),lines:[L(TXT.pulseSub)],px:.0001});g.add(pulseL);
 const dawnL=label({lines:[L(TXT.dawn)],px:.00011}),stormL=label({lines:[L(TXT.storm)],px:.00011});g.add(dawnL,stormL);

 const C=hex=>new THREE.Color(hex),COL={rose:C(0xffc4cf),roseKey:C(0xffb39a),storm:C(0x8ea4b8),stormKey:C(0xa3bcd6),gold:C(0xffd09a),goldKey:C(0xffa25a),goldGround:C(0x3a2a40),goldFill:C(0xff9a70)};
 const op=(m,a)=>{m.opacity=a;m.visible=a>.002},opM=(mesh,a)=>{mesh.material.opacity=a;mesh.visible=a>.002};
 return{duration:30,group:g,caption:CAPTION,retOff:[0,.0012,0],pickables:[],
  cues:[['water',40.2],['gull',42.4],['engine',41.2],['horn',47.4],['set',49.4],['gull',50.2],['water',51.4],['splash',52.6],['splash',53.8],['thunder',54.3],['splash',55],['thunder',55.3],['splash',56.2],['chime',58.6],['node',61.2],['horn',64.5],['gull',66]],
  update(t,time,pf){
   const dawn=1-seg(t,43.5,46.5),storm=win(t,51,58.4,1.6,1.8),gold=seg(t,59,62.5),flashA=win(t,54.25,54.42,.03,.12),flashB=win(t,55.22,55.36,.03,.1),flash=Math.max(flashA,flashB);
   // Light: rosy dawn, grey squall with lightning, golden evening. Scaled by pf so other chapters are untouched.
   if(lights&&pf>0){const{hemi,key,fill}=lights,k=pf;
    hemi.color.lerp(COL.rose,dawn*.45*k);key.color.lerp(COL.roseKey,dawn*.55*k);hemi.intensity*=1-dawn*.2*k;key.intensity*=1-dawn*.25*k;
    hemi.color.lerp(COL.storm,storm*.75*k);key.color.lerp(COL.stormKey,storm*.6*k);hemi.intensity*=1-storm*.42*k;key.intensity*=1-storm*.72*k;fill.intensity*=1-storm*.5*k;
    key.intensity+=flash*7*k;hemi.intensity+=flash*1.6*k;
    hemi.color.lerp(COL.gold,gold*.42*k);hemi.groundColor.lerp(COL.goldGround,gold*.4*k);key.color.lerp(COL.goldKey,gold*.7*k);fill.color.lerp(COL.goldFill,gold*.5*k);key.intensity*=1-gold*.12*k}
   wat.userData.update(time*(1+storm*1.4),out(seg(t,40.2,42.6))*W*.6);
   opM(dawnSea,dawn*.22*pf);opM(stormSea,storm*.45*pf);opM(goldSea,gold*.32*pf);opM(glitter,gold*(.55+.25*Math.sin(time*6))*pf);
   sun.position.set(-.06,TABLE+.02+gold*.012,quayZ-.3);op(sun.material,(gold*.85+dawn*.35)*pf);sun.material.color.set(dawn>gold?0xff9fb0:0xff7a3a);
   b.fly(birds,time);birds.forEach((bd,i)=>{const away=storm;bd.position.y+=away*.12+i*.01;bd.position.z-=away*.2;bd.scale.setScalar(Math.max(.001,(1-away*.95)*(.8+.2*(1-gold))))});
   // The llaüt: arrives at dawn, the skipper throws the line, rocks hard in the squall.
   const arrive=out(seg(t,41,46.4)),bx=lerp(-W*.45,post.position.x-.022,arrive),amp=1+storm*3.6;
   boat.position.set(bx,TABLE+.004+.0016*amp*Math.sin(time*2.3),BZ+.005*storm*Math.sin(time*1.7));boat.rotation.set(.03*amp*Math.sin(time*1.4),.06*(1-arrive),.045*amp*Math.sin(time*1.9));
   boat.updateMatrixWorld();bow.copy(bowLocal).applyMatrix4(boat.matrix);cab.copy(houseLocal).applyMatrix4(boat.matrix);
   cabinLight.position.copy(cab);op(cabinLight.material,(gold*.9+dawn*.4)*pf);boat.userData.lamp.material.emissiveIntensity=gold*1.5+dawn*.6;
   const throwK=seg(t,47.1,47.8);skipper.userData.update(0);skipper.children[4].rotation.z=-throwK*1.6*(1-seg(t,47.8,48.4));skipper.rotation.y=Math.PI/2*seg(t,46.2,46.8);
   const speed=1-arrive,wp=wake.geometry.attributes.position;
   for(let i=0;i<24;i++){const k=((time*1.4+i/24)%1);wp.setXYZ(i,bx-.06-k*.08,TABLE+.002,BZ+((i%2)*2-1)*.012*k)}wp.needsUpdate=true;wake.material.opacity=pf*.55*speed;
   setFade(llautL,win(t,42,46.6,.5,.6)*pf);llautL.position.set(bx,.06,BZ);
   // Mooring: walk to the bollard, catch the line, tie it; step back from the waves in the squall.
   const wk=io(seg(t,45.8,48)),mx=lerp(-.012,post.position.x-.013,wk),mz=-P.d/2+.009,back=storm*.012;
   mooring.position.set(mx,b.ground(mx,mz),mz+back);mooring.rotation.y=wk<1?0:Math.PI/2;mooring.userData.update(t<48?(t-45.8)*.05/.045*Math.PI:0);
   mooring.scale.setScalar(Math.max(.001,seg(t,44.8,45.8)));
   const hand={x:mooring.position.x+.004,y:mooring.position.y+.05,z:mooring.position.z-.008},top={x:post.position.x,y:post.position.y+.004,z:post.position.z};
   const thr=seg(t,47.6,48.5),tie=seg(t,48.6,49.6);line.visible=thr>0;line.material.opacity=pf*.95;
   const end=tie>0?{x:lerp(hand.x,top.x,tie),y:lerp(hand.y,top.y,tie),z:lerp(hand.z,top.z,tie)}:{x:lerp(bow.x,hand.x,thr),y:lerp(bow.y,hand.y,thr)+Math.sin(thr*Math.PI)*.035,z:lerp(bow.z,hand.z,thr)};
   line.userData.set(bow,end,(tie>=1?.004+.006*(1-storm)*(.5+.5*Math.sin(time*2.3)):.008)*(1-storm*.7));
   // Net mender: hands moving over the net, unbothered (he packs up a little in the rain).
   mender.children[4].rotation.z=-.9+.25*Math.sin(time*3.1);mender.children[5].rotation.z=-.9+.25*Math.sin(time*3.1+1.4);mender.rotation.z=.015*Math.sin(time*.8);
   net.scale.y=.32-storm*.06;
   // Ferry: slow crossing, horn at 47.4 and 64.5, lit windows at dusk.
   const fs=seg(t,40,70);ship.position.x=lerp(.32,-.34,fs);ship.position.y=TABLE+.002+.0008*Math.sin(time*.9);op(ship.userData.win,gold*.9*pf);
   // Foam, rain, spray bursts, lightning, wet patch.
   const fp=foam.geometry.attributes.position;
   for(let i=0;i<40;i++){const k=(time*(.6+storm*1.1)+i*.37)%1;fp.setXYZ(i,(i/39-.5)*W*.55,TABLE+.002+k*.005*storm,quayZ-.003-k*.012*(1+storm*1.5))}fp.needsUpdate=true;foam.material.opacity=pf*(.35+.5*storm);
   const rp=rainGeo.attributes.position,wind=.35;
   for(let i=0;i<RN;i++){const[a,c,d]=rseed[i],k=(time*(1.6+d*.6)+a)%1,x=(c-.5)*.42-k*.06*wind,y=.26*(1-k)+TABLE,z=quayZ-.2+d*.3;rp.setXYZ(i*2,x,y,z);rp.setXYZ(i*2+1,x+.004*wind,y+.012,z)}
   rp.needsUpdate=true;opM(rain,storm*.55*pf);
   const sp=spray.geometry.attributes.position;let live=0;
   for(let i=0;i<SPRAY;i++){const q=sseed[i],a=t-BURSTS[q.burst];
    if(a>0&&a<.95){const y=TABLE+q.v*a-.7*a*a;sp.setXYZ(i,q.x+q.vx*a,Math.max(TABLE+.001,y),quayZ-.004+q.vz*a);live++}else sp.setXYZ(i,0,-1,0)}
   sp.needsUpdate=true;spray.material.opacity=pf*(live?.95:0);
   opM(bolt,flash*pf);op(boltGlow.material,flash*.8*pf);
   opM(wet,clamp(seg(t,52.8,54)*.55-seg(t,60,68)*.55,0,.55)*pf);
   // Passport pulse after the storm.
   pulses.forEach((o,i)=>{const k=seg(t,58.6+i*.45,60+i*.45);o.visible=k>0&&k<1;o.scale.set(1+k*1.4,1,1+k*1.4);o.material.uniforms.uOpacity.value=Math.sin(k*Math.PI)*pf});
   setFade(pulseL,win(t,58.8,62.2,.5,.6)*pf);pulseL.position.set(0,.045,0);
   setFade(dawnL,win(t,40.6,44.6,.6,.6)*pf);dawnL.position.set(-.08,.07,WZ);
   setFade(stormL,win(t,51.6,57.6,.5,.6)*pf);stormL.position.set(-.06,.075,quayZ-.04);
   // Dusk: the lamp switches on with a small flicker; its reflection trembles on the water.
   const on=seg(t,61,61.5),flick=on<1?(Math.sin(t*90)>0?1:.3):1;
   lampHead.emissiveIntensity=on*1.4*flick;op(lampGlow.material,on*.9*flick*pf);op(pool.material,on*.35*pf);
   lampRefl.scale.x=1+.3*Math.sin(time*7);opM(lampRefl,on*.5*pf);
  }};
}
function setFade(obj,a){obj.material.opacity=a;obj.visible=a>.002}

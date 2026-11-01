// CUEVA trailer score: a synthesised music cue that follows the story clock (no audio files).
// 100 BPM in D minor (Dm · B♭ · F · C), building chapter by chapter, with risers into each chapter,
// impacts on the cuts and a D major chord on the logo. Every note is scheduled ~0.15 s ahead from the
// story time and stops by itself, so the music resyncs after a seek or a loop and goes quiet when the
// story stops calling update() (tracking lost, paused, page hidden).
const BPM=100,BEAT=60/BPM,BAR=BEAT*4,STEP=BEAT/4,LOOK=.15,LEVEL=.32;
const mtof=m=>440*Math.pow(2,(m-69)/12);
const PROG=[[62,65,69],[58,62,65],[60,65,69],[60,64,67]],ROOT=[38,34,41,36];
// Sections (story seconds). Chapter cuts sit on bar lines: 2.4 · 14.4 · 26.4 · 38.4 · 55.2 · 64.8 · 79.2 · 91.2.
const SECTIONS=[[0,'intro'],[14.4,'build'],[26.4,'pulse'],[38.4,'swarm'],[52.8,'break'],[55.2,'seal'],[64.8,'os'],[79.2,'world'],[91.2,'rise'],[93.6,'logo'],[102.6,'tail']];
const BOOMS=[14.4,26.4,38.4,55.2,64.8,79.2,93.6],RISERS=[[12,2.4],[24,2.4],[36,2.4],[52.8,2.4],[62.4,2.4],[76.8,2.4],[88.8,2.4],[91.2,2.4]];
const sectionAt=s=>{let n='intro';for(const[a,k]of SECTIONS)if(s>=a-1e-6)n=k;return n};
const near=(s,a)=>Math.abs(s-a)<STEP/2;

export function createCuevaScore(){
 let ac=null,out=null,noise=null,cursor=null,lastCall=0,watch=null,playing=false;
 function init(ctx,dest){
  if(!ctx)return;if(ctx===ac){if(!watch)watch=setInterval(()=>{if(playing&&performance.now()-lastCall>300)duck()},200);return}stop();ac=ctx;
  out=ac.createGain();out.gain.value=0;out.connect(dest);
  noise=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate);const d=noise.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  // Watchdog: if the story stops driving the score, fade it out.
  watch=setInterval(()=>{if(playing&&performance.now()-lastCall>300)duck()},200);
 }
 function duck(){playing=false;cursor=null;if(out&&ac)out.gain.setTargetAtTime(0,ac.currentTime,.06)}
 function stop(){duck();if(watch)clearInterval(watch);watch=null}

 // ---------- instruments (at = AudioContext time) ----------
 const env=(g,at,a,peak,d)=>{g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(peak,at+a);g.gain.exponentialRampToValueAtTime(.0001,at+a+d)};
 const gain=(to=out)=>{const g=ac.createGain();g.connect(to);return g};
 function osc(type,f,at,dur,to){const o=ac.createOscillator();o.type=type;o.frequency.setValueAtTime(f,at);o.connect(to);o.start(at);o.stop(at+dur+.05);return o}
 function nz(at,dur,to){const s=ac.createBufferSource();s.buffer=noise;s.connect(to);s.start(at,Math.random()*1.5);s.stop(at+dur+.05);return s}
 function filter(type,f,q,to){const b=ac.createBiquadFilter();b.type=type;b.frequency.value=f;b.Q.value=q;b.connect(to);return b}
 function kick(at,v=.8){const g=gain();env(g,at,.002,v,.32);const o=osc('sine',165,at,.4,g);o.frequency.exponentialRampToValueAtTime(46,at+.13);
  const c=gain();env(c,at,.001,v*.25,.02);nz(at,.03,filter('highpass',2500,.7,c))}
 function hat(at,v=.08,open=false){const g=gain();env(g,at,.001,v,open?.16:.03);nz(at,open?.2:.05,filter('highpass',open?6500:8000,.8,g))}
 function clap(at,v=.2){const g=gain(),f=filter('bandpass',1600,.9,g);g.gain.setValueAtTime(0,at);for(const k of[0,.011,.022]){g.gain.linearRampToValueAtTime(v,at+k+.001);g.gain.linearRampToValueAtTime(v*.3,at+k+.009)}g.gain.exponentialRampToValueAtTime(.0001,at+.2);nz(at,.22,f)}
 function tick(at,v=.05){const g=gain();env(g,at,.001,v,.025);osc('sine',2600,at,.04,g)}
 function bass(at,m,dur,v=.16){const g=gain(),f=filter('lowpass',900,4,g);f.frequency.setValueAtTime(900,at);f.frequency.exponentialRampToValueAtTime(220,at+dur);env(g,at,.005,v,dur);osc('sawtooth',mtof(m),at,dur,f);osc('sine',mtof(m-12),at,dur,g)}
 function pluck(at,m,v=.05,type='triangle',bright=3200){const g=gain(),f=filter('lowpass',bright,1,g);env(g,at,.003,v,.2);osc(type,mtof(m),at,.24,f)}
 function pad(at,notes,dur,v=.05,bright=1100){const g=gain(),f=filter('lowpass',bright,.7,g);g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(v,at+Math.min(.7,dur*.3));g.gain.setValueAtTime(v,at+dur*.7);g.gain.linearRampToValueAtTime(0,at+dur);
  for(const m of notes)for(const det of[-7,7]){const o=osc('sawtooth',mtof(m),at,dur,f);o.detune.value=det}}
 function riser(at,dur,v=.12){const g=gain(),f=filter('bandpass',300,2.2,g);f.frequency.setValueAtTime(300,at);f.frequency.exponentialRampToValueAtTime(7000,at+dur);g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(v,at+dur*.95);g.gain.linearRampToValueAtTime(0,at+dur+.04);nz(at,dur+.05,f);
  const s=gain();s.gain.setValueAtTime(0,at);s.gain.linearRampToValueAtTime(v*.25,at+dur*.95);s.gain.linearRampToValueAtTime(0,at+dur+.04);const o=osc('sine',220,at,dur,s);o.frequency.exponentialRampToValueAtTime(880,at+dur)}
 function boom(at,v=.6){const g=gain();env(g,at,.003,v,1.8);const o=osc('sine',90,at,2,g);o.frequency.exponentialRampToValueAtTime(32,at+1.4);
  const n=gain();env(n,at,.002,v*.5,.6);nz(at,.7,filter('lowpass',420,.6,n));const h=gain();env(h,at,.002,v*.12,.9);osc('triangle',mtof(50),at,1,h)}
 function chord(at,notes,dur,v=.07){pad(at,notes,dur,v,2400);for(const m of notes)pluck(at,m+12,v*.6,'square',5000)}

 // ---------- one 16th step of the arrangement ----------
 function step(k,at){
  const s=k*STEP,bar=Math.floor(k/16),st=k%16,i=bar%4,ch=PROG[i],root=ROOT[i],sec=sectionAt(s);
  for(const b of BOOMS)if(near(s,b))boom(at,b===93.6?.5:.4);
  for(const[r,d]of RISERS)if(near(s,r))riser(at,d,r===91.2?.16:.11);
  if(sec==='intro'){if(st===0){pad(at,[ch[0]-12,ch[0],ch[2]],BAR*1.05,.035,700);kick(at,.55)}if(st===3)kick(at,.35);if(s>=9.6&&st%4===2)hat(at,.035);return}
  if(sec==='build'){if(st===0)pad(at,ch,BAR*1.05,.04,900);if(st===0||st===8)kick(at,.7);if(st%2===0)hat(at,.05);if([0,6,8,14].includes(st))bass(at,root,.32,.13);return}
  if(sec==='pulse'){if(st===0)pad(at,ch,BAR*1.05,.04,1300);if(st%4===0)kick(at,.75);if(st%2===0)hat(at,st%4===2?.07:.04,st%8===6);if(st%2===0)bass(at,root,.2,.12);if(st%2===1)pluck(at,ch[(st>>1)%3]+12,.03);return}
  if(sec==='swarm'){if(st===0)pad(at,ch,BAR*1.05,.045,1600);if(st%4===0)kick(at,.8);if(st===4||st===12)clap(at,.16);hat(at,st%2?.035:.06,st%8===6);if(st%2===0)bass(at,root,.18,.13);pluck(at,ch[st%3]+(st%6<3?12:24),.032,'triangle',4200);return}
  if(sec==='break'){if(st===0)pad(at,ch,BAR*1.05,.05,700);if(st%8===0)tick(at,.04);return}
  if(sec==='seal'){if(st===0)pad(at,[ch[0]-12,...ch],BAR*1.05,.04,800);if(st===0||st===8)kick(at,.75);if(st%2===0)tick(at,.045);if(st%2===0)bass(at,root,.12,.1);if(st===12)clap(at,.12);return}
  if(sec==='os'){if(st===0)pad(at,ch,BAR*1.05,.045,1900);if(st%4===0)kick(at,.8);if(st===4||st===12)clap(at,.15);hat(at,st%2?.03:.055,st%8===6);if(st%2===0)bass(at,root,.18,.13);pluck(at,ch[(st*2)%3]+24,.026,'square',5200);return}
  if(sec==='world'){if(st===0)pad(at,[...ch,ch[0]+12],BAR*1.05,.05,2200);if(st%4===0)kick(at,.82);if(st===4||st===12)clap(at,.17);hat(at,st%2?.035:.06,st%4===2);if(st%2===0)bass(at,root,.2,.14);pluck(at,ch[st%3]+(st<8?12:24),.03,'triangle',4800);return}
  if(sec==='rise'){const r=(s-91.2)/2.4;clap(at,.03+.14*r);if(st%4===0)kick(at,.4+.4*r);return}
  if(sec==='logo'){if(near(s,93.6))chord(at,[38,50,54,57,62,66,69,74],6,.085);
   if(s>=99.6){if(st===0)pad(at,[50,57,62],BAR*1.1,.03,700);if(st===0)kick(at,.45);if(st===3)kick(at,.3)}
   else if(s>=96){if(st===0)pad(at,[50,54,57,62],BAR*1.05,.04,1400);if(st%2===0)pluck(at,[62,66,69,74][(st>>1)%4]+12,.02,'triangle',4000)}return}
 }

 return{init,stop,
  /** Called by the story every frame. t = story time (s); playing = not standby and not paused. */
  update(t,on){
   lastCall=performance.now();if(!ac||!out)return;
   if(!on){if(playing)duck();return}
   if(!playing){playing=true;out.gain.cancelScheduledValues(ac.currentTime);out.gain.setTargetAtTime(LEVEL,ac.currentTime,.05)}
   if(ac.state!=='running')return;
   if(cursor===null||t<cursor-LOOK-.25||t>cursor+.5)cursor=t; // seek, loop or a jump: start again from here
   const end=t+LOOK,now=ac.currentTime;
   for(let k=Math.ceil(cursor/STEP-1e-6);k*STEP<end;k++){const at=now+(k*STEP-t);if(k*STEP>=cursor-1e-6&&at>=now-.02)try{step(k,Math.max(now,at))}catch{}}
   cursor=end;
  },
  get level(){return LEVEL}};
}

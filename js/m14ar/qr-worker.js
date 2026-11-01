// Finds the QR in a luminance frame and returns its 4 outer corners (topLeft, topRight, bottomRight, bottomLeft).
// `locate` = expected module count: when the code is too small to decode, jsQR (patched) still returns its corners.
importScripts('../../vendor/jsqr/jsQR.js');
let codes=[];
self.onmessage=({data:m})=>{
 if(m.codes){codes=m.codes;return}
 const{id,w,h,flip,locate}=m;let px=new Uint8ClampedArray(m.buffer);
 if(flip){const out=new Uint8ClampedArray(px.length);for(let y=0;y<h;y++)out.set(px.subarray((h-1-y)*w,(h-y)*w),y*w);px=out}
 let r=null,scale=1,img=px,W=w,H=h;const t0=performance.now();
 try{r=jsQR(px,w,h,{inversionAttempts:'dontInvert',locateDimension:locate})}catch(e){}
 // Small or distant codes (and 640×480 cameras, common on Android): a 2× bilinear upscale of the region
 // lets the finder patterns be found with sub-pixel corners. The page only asks for it on small regions.
 // Arm's length (40–55 cm) with a 25 mm label is ~1.4 px per module: those regions come with a 3× upscale.
 if(!r&&m.upscale){const k=m.upscale===3?3:2;try{const u=upscale(px,w,h,k);r=jsQR(u,w*k,h*k,{inversionAttempts:'dontInvert',locateDimension:locate});if(r){scale=1/k;img=u;W=w*k;H=h*k}}catch(e){}}
 const ms=performance.now()-t0;
 if(!r){self.postMessage({id,found:false,ms});return}
 const L=r.location,match=r.locatedOnly&&codes.length?matchCode(img,W,H,[L.topLeftCorner,L.topRightCorner,L.bottomRightCorner,L.bottomLeftCorner],codes):null;
 self.postMessage({id,found:true,ms,data:r.data,locatedOnly:r.locatedOnly,match,upscaled:scale<1,corners:[L.topLeftCorner,L.topRightCorner,L.bottomRightCorner,L.bottomLeftCorner].map(p=>({x:(p.x+.5)*scale-.5,y:(p.y+.5)*scale-.5}))});
};
function upscale(src,w,h,k=2){
 const W=w*k,H=h*k,out=new Uint8ClampedArray(W*H);
 for(let y=0;y<H;y++){const sy=Math.min(h-1,Math.max(0,(y+.5)/k-.5)),y0=Math.floor(sy),y1=Math.min(h-1,y0+1),fy=sy-y0;
  for(let x=0;x<W;x++){const sx=Math.min(w-1,Math.max(0,(x+.5)/k-.5)),x0=Math.floor(sx),x1=Math.min(w-1,x0+1),fx=sx-x0;
   const a=src[y0*w+x0],b=src[y0*w+x1],c=src[y1*w+x0],d=src[y1*w+x1];out[y*W+x]=(a+(b-a)*fx)*(1-fy)+(c+(d-c)*fx)*fy}}
 return out;
}
// Too blurred or too small to read, but we know which codes exist: sample the located square on the 33 × 33 grid and
// compare it with each of them. The finder patterns are left out, since every code (and any false detection) has them.
const inFinder=(i,j,n)=>(i<8&&j<8)||(i<8&&j>=n-8)||(i>=n-8&&j<8);
function matchCode(px,w,h,c,list){
 const n=33,dx1=c[1].x-c[2].x,dy1=c[1].y-c[2].y,dx2=c[3].x-c[2].x,dy2=c[3].y-c[2].y,sx=c[0].x-c[1].x+c[2].x-c[3].x,sy=c[0].y-c[1].y+c[2].y-c[3].y,den=dx1*dy2-dy1*dx2;if(!den)return null;
 const g=(sx*dy2-sy*dx2)/den,k=(dx1*sy-dy1*sx)/den,a=c[1].x-c[0].x+g*c[1].x,b=c[3].x-c[0].x+k*c[3].x,d=c[1].y-c[0].y+g*c[1].y,e=c[3].y-c[0].y+k*c[3].y;
 const v=[];for(let i=0;i<n;i++)for(let j=0;j<n;j++){if(inFinder(i,j,n))continue;const u=(j+.5)/n,t=(i+.5)/n,q=g*u+k*t+1,x=Math.round((a*u+b*t+c[0].x)/q),y=Math.round((d*u+e*t+c[0].y)/q);
  if(x<0||y<0||x>=w||y>=h)return null;v.push(px[y*w+x])}
 const mean=v.reduce((p,q)=>p+q,0)/v.length,sd=Math.sqrt(v.reduce((p,q)=>p+(q-mean)**2,0)/v.length);if(sd<4)return null;
 let best=null,second=-1;
 for(const code of list){let sum=0,sum2=0,cross=0,m=0;for(let i=0;i<n;i++)for(let j=0;j<n;j++){if(inFinder(i,j,n))continue;const light=code.rows[i][j]==='1'?-1:1;sum+=light;sum2+=1;cross+=light*(v[m++]-mean)}
  const score=cross/(v.length*sd*Math.sqrt(sum2/v.length-(sum/v.length)**2));if(!best||score>best.score){second=best?best.score:-1;best={id:code.id,score}}else if(score>second)second=score}
 return{id:best.id,score:+best.score.toFixed(3),margin:+(best.score-second).toFixed(3)};
}

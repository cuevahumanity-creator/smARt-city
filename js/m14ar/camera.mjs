// Android camera. The engine asks for 960×720 (Samsung Internet: from 640×480) and then scales that up to its pixel array,
// so a 25 mm label can only be read from ≈ 16–24 cm: closer than many Android cameras can focus. It never sets the focus
// either. Here the same request asks for more real detail, with the same 4:3 field of view. iPhones are left alone.
export const isAndroid=(ua=globalThis.navigator?.userAgent||'')=>/Android/i.test(ua);

/** How much camera this phone can afford: SLAM must keep its frame rate. Unknown phones get the safe choice. */
export function cameraPlan({cores=0,memory=0}={}){
 return cores>=6&&memory>=4?{width:1600,height:1200,maxDimension:1600}:{width:1280,height:960,maxDimension:1280};
}
/** The engine's getUserMedia video constraints -> the sharper ones; anything else is returned untouched. */
export function upgradeVideoConstraints(video,plan){
 if(!video||typeof video!=='object')return video;
 const facing=video.facingMode?.exact??video.facingMode;if(facing==='user'||(Array.isArray(facing)&&facing.includes('user')))return video;
 const asked=video.width?.exact??video.width?.min??video.width?.ideal??0;if(!asked||asked>=plan.width||asked>=1280)return video;
 return{...video,width:{ideal:plan.width},height:{ideal:plan.height},aspectRatio:{ideal:4/3}};
}
/** Focus modes to apply, best first; `capabilities` comes from MediaStreamTrack.getCapabilities(). */
export function focusSteps(capabilities){
 const modes=capabilities?.focusMode||[];
 return modes.includes('continuous')?[{focusMode:'continuous'}]:modes.includes('single-shot')?[{focusMode:'single-shot'}]:[];
}

/** Wraps getUserMedia once, before the engine starts. `info` fills up for the diagnostics line. */
export function installAndroidCamera(plan){
 const md=navigator.mediaDevices,original=md.getUserMedia.bind(md),info={plan,asked:null,got:null,focus:[],focusSet:'-',track:null};
 const setFocus=async track=>{
  info.track=track;const caps=track.getCapabilities?.()||null;info.focus=caps?.focusMode||[];
  for(const s of focusSteps(caps)){try{await track.applyConstraints({advanced:[s]});info.focusSet=s.focusMode}catch{}}
  const v=track.getSettings?.()||{};info.got=`${v.width||'?'}x${v.height||'?'}`;
 };
 md.getUserMedia=async c=>{
  const video=upgradeVideoConstraints(c?.video,plan);
  if(video===c?.video)return original(c);
  info.asked=`${c.video.width?.exact??c.video.width?.min}x${c.video.height?.exact??c.video.height?.min}`;
  let stream;try{stream=await original({...c,video})}catch{stream=await original(c)} // never worse than the engine's own request
  const track=stream.getVideoTracks?.()[0];if(track)setFocus(track);
  return stream;
 };
 /** Asks the lens to look for focus again (the visitor may have moved closer). */
 info.refocus=()=>{const t=info.track;if(!t||!info.focus.includes('single-shot'))return;
  t.applyConstraints({advanced:[{focusMode:'single-shot'}]}).then(()=>info.focus.includes('continuous')&&t.applyConstraints({advanced:[{focusMode:'continuous'}]})).catch(()=>{})};
 return info;
}

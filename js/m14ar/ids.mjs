// Which piece a scanned QR belongs to. Our codes are the site root (M-14) or the root with ?p=<ID>.
// The site lives at cuevahumanity-creator.github.io/smARt-city/; labels printed for the earlier
// address (nancananca.github.io/CuevaConectCity/) are still recognised in the camera.
export function idFromQr(text){
 try{const u=new URL(text);if(!/^\/(smARt-city|CuevaConectCity)\/?(index\.html)?$/i.test(u.pathname))return null;
  const p=(u.searchParams.get('p')||'M-14').toUpperCase();return/^(M-\d{2}|SACA|CUEVA)$/.test(p)?p:null}catch{return null}
}

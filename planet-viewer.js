// Lokálny 3D model: ortografický lúč pretína guľu a prstence.
// Canvas API vykresľuje matematický 3D model bez externej knižnice.
(() => {
  const viewer = document.getElementById('planet-viewer');
  const canvas = document.getElementById('planet-canvas');
  const stage = canvas.parentElement;
  const status = document.getElementById('planet-texture-status');
  const credit = document.getElementById('planet-texture-credit');
  const gpu = vytvorGpuRenderer();
  let gpuEnabled = !!gpu;
  canvas.dataset.renderer = gpuEnabled ? 'webgl' : 'canvas';
  const fallback = document.getElementById('detail-img');
  const minus = document.getElementById('planet-zoom-out');
  const plus = document.getElementById('planet-zoom-in');
  const reset = document.getElementById('planet-reset');
  let ctx;
  try { ctx = canvas.getContext('2d', { alpha: true }); }
  catch (error) { return; }
  if (!ctx) return; // Bez Canvas zostane pôvodná ilustrácia.
  const scratch = document.createElement('canvas');
  const source = scratch.getContext('2d', { willReadFrequently: true });
  if (!source) return;
  const TAU = Math.PI * 2;
  const baseLight = [-.48, .34, .86].map(v => v / Math.hypot(.48,.34,.86));
  const atmospheres={slnko:[0,0,0],merkur:[0,0,0],venusa:[.35,.23,.10],zem:[.12,.45,.95],mars:[.23,.10,.05],jupiter:[.12,.09,.05],saturn:[.15,.12,.07],uran:[.12,.32,.38],neptun:[.09,.22,.48]};
  const records=new Map();
  const cards=new Map([...document.querySelectorAll(".planet-card")].map(card=>[card.dataset.planet,card.querySelector("img")]));
  let selected='', texture=null, yaw=0, pitch=.24, zoom=1, visible=false, pending=0, last=0, failed=false;
  const pointers=new Map();
  let previousDistance=0, frameInterval=42, dirty=true, manualUntil=0;
  let mapState='loading';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const clamp=(x,min,max)=>Math.max(min,Math.min(max,x));
  // Rovnaká kamera, svetlo a radiálny profil pre náhľad aj interaktívny model.
  const views={slnko:[.15,.10,0],merkur:[.12,.12,-.06],venusa:[.10,.12,-.04],zem:[.20,-.16,.10],mars:[.15,.12,.10],jupiter:[.20,.06,.06],saturn:[.12,-.43,-.25],uran:[.12,-.32,1.12],neptun:[.15,.10,.08]};
  const motion=()=>!reduced.matches && document.documentElement.classList.contains('motion-enabled');
  const ringOf=id=>id==='saturn'?2:id==='uran'?1:0;
  const radiusOf=id=>id==='saturn'?.415:id==='uran'?.48:.82;
  const gaussian=(x,c,w)=>Math.exp(-Math.pow((x-c)/w,2));
  const profiles=[null,new Float32Array(2048),new Float32Array(2048)];
  // Urán: tmavé úzke prstence, nie široký disk. Saturn: C, B, Cassiniho delenie, A.
  for(let i=0;i<2048;i++){
    const r=1.2+i/2047*1.08;
    profiles[1][i]=clamp(.13*gaussian(r,1.63,.022)+.21*gaussian(r,1.71,.014)+.18*gaussian(r,1.78,.014)+.24*gaussian(r,1.85,.017)+.55*gaussian(r,1.98,.022),0,1);
    const band=r<1.52?.30:r<1.91?.93:r<2.00?.055:.70;
    profiles[2][i]=clamp(band*(.90+.065*Math.sin(r*125)+.035*Math.sin(r*367))*(1-.83*gaussian(r,2.17,.012)),0,1);
  }
  const profile=(type,r)=>profiles[type][Math.round(clamp((r-1.2)/1.08,0,1)*2047)];
  function makeCpuRenderer(target,context) {
    let geometry,pixels,oldKey;
    function prepare(radius,roll){
      const w=target.width,key=[w,radius,roll].join(':');
      if(key===oldKey)return;oldKey=key;
      pixels=context.createImageData(w,w);
      const count=w*w, c=Math.cos(roll),s=Math.sin(roll),step=2/(w*radius);
      const light=[c*baseLight[0]+s*baseLight[1],-s*baseLight[0]+c*baseLight[1],baseLight[2]];
      geometry={x:new Float32Array(count),y:new Float32Array(count),z:new Float32Array(count),shade:new Float32Array(count),rim:new Float32Array(count),alpha:new Uint8Array(count),light};
      const g=geometry;
      for(let j=0,i=0;j<w;j++)for(let k=0;k<w;k++,i++){
        const sx=((k+.5)/w*2-1)/radius,sy=(1-(j+.5)/w*2)/radius;
        const x=c*sx+s*sy,y=-s*sx+c*sy,d=Math.hypot(x,y);g.x[i]=x;g.y[i]=y;
        if(d>1+step*.6)continue;
        const z=Math.sqrt(Math.max(0,1-x*x-y*y));g.z[i]=z;
        const diffuse=Math.max(0,x*light[0]+y*light[1]+z*light[2]);
        g.shade[i]=.19+.81*Math.pow(diffuse,.62);
        g.rim[i]=Math.pow(1-z,3.1)*(.10+.90*diffuse)*.29*255;
        g.alpha[i]=Math.round(clamp((1-d)/step+.5,0,1)*255);
      }
    }
    return function render(tex,id,yaw,pitch,radius,roll){
      prepare(radius,roll);
      const g=geometry,out=pixels.data,tw=tex.width,th=tex.height,data=tex.data,light=g.light;
      const cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch),atm=atmospheres[id];
      const ringType=ringOf(id),outer=ringType===2?2.28:2.04,inner=ringType===2?1.24:1.53;
      const denom=cp*light[1]-sp*light[2];
      for(let i=0,o=0;i<g.x.length;i++,o+=4){
        const x=g.x[i],y=g.y[i],z=g.z[i];let a=g.alpha[i]/255,r=0,b=0,v=0;
        if(a){
          const py=clamp(cp*y-sp*z,-1,1),pz=sp*y+cp*z;
          const px=cy*x+sy*pz,pzz=-sy*x+cy*pz;
          const u=Math.atan2(px,pzz)/TAU+.5,vv=.5-Math.asin(py)/Math.PI;
          const fx=u*tw-.5,fy=clamp(vv*th-.5,0,th-1),ix=Math.floor(fx),iy=Math.floor(fy);
          const tx=(ix+tw)%tw,nx=(tx+1)%tw,ny=Math.min(th-1,iy+1),wx=fx-ix,wy=fy-iy;
          const t0=(iy*tw+tx)*4,t1=(iy*tw+nx)*4,t2=(ny*tw+tx)*4,t3=(ny*tw+nx)*4;
          const a0=(1-wx)*(1-wy),a1=wx*(1-wy),a2=(1-wx)*wy,a3=wx*wy;
          let shade=id==='slnko'? .64+.36*z : g.shade[i];const rim=g.rim[i];
          if(ringType&&Math.abs(denom)>.001){const d=-(cp*y-sp*z)/denom;if(d>0){const qx=x+d*light[0],qy=y+d*light[1],qz=z+d*light[2],rr=Math.hypot(qx,sp*qy+cp*qz);if(rr>inner&&rr<outer)shade*=1-(ringType===2?.46:.17)*profile(ringType,rr);}}
          const tr=data[t0]*a0+data[t1]*a1+data[t2]*a2+data[t3]*a3;
          const tg=data[t0+1]*a0+data[t1+1]*a1+data[t2+1]*a2+data[t3+1]*a3;
          const tb=data[t0+2]*a0+data[t1+2]*a1+data[t2+2]*a2+data[t3+2]*a3;
          const spec=id==='zem'&&tb>tg*1.18&&tb>tr*1.35?12*Math.pow(Math.max(0,light[0]*.5*x+light[1]*.5*y+.95*z),26):0;
          r=tr*shade+atm[0]*rim+spec;v=tg*shade+atm[1]*rim+spec;b=tb*shade+atm[2]*rim+spec;
        }
        if(ringType&&Math.abs(sp)>.025){
          const rz=cp*y/sp,rr=Math.hypot(x,sp*y+cp*rz);
          if(rr>inner&&rr<outer&&(!a||rz>z)){
            const edge=clamp((rr-inner)/.025,0,1)*clamp((outer-rr)/.025,0,1);
            const ra=clamp(profile(ringType,rr)*edge*(ringType===2?1:.69),0,1);
            const dot=x*light[0]+y*light[1]+rz*light[2];
            const shadow=dot<0&&x*x+y*y+rz*rz-dot*dot<1?.36:1;
            const ringColor=ringType===2?(rr<1.52?[172,160,145]:rr<1.91?[232,218,190]:[204,192,173]):[139,151,155];
            const alpha=ra+a*(1-ra),rest=a*(1-ra);
            if(alpha){r=(ringColor[0]*shadow*ra+r*rest)/alpha;v=(ringColor[1]*shadow*ra+v*rest)/alpha;b=(ringColor[2]*shadow*ra+b*rest)/alpha;}a=alpha;
          }
        }
        out[o]=r;out[o+1]=v;out[o+2]=b;out[o+3]=Math.round(a*255);
      }
      context.putImageData(pixels,0,0);
    };
  }
  const renderDetail=makeCpuRenderer(canvas,ctx);
  const preview=document.createElement('canvas');preview.width=preview.height=400;
  const previewContext=preview.getContext('2d');
  const renderPreview=previewContext&&makeCpuRenderer(preview,previewContext);
  function paintCard(id,record){
    const img=cards.get(id);if(!renderPreview||!record.tex)return;
    const [y,p,roll]=views[id];renderPreview(record.tex,id,y,p,radiusOf(id),roll);
    const src=preview.toDataURL('image/webp',.95), typ=record.real?'real':'fallback';
    if(img){img.src=src;img.dataset.texture=typ;}
    document.querySelectorAll(`[data-planet-preview="${id}"]`).forEach(nahlad=>{
      nahlad.src=src;nahlad.dataset.texture=typ;
    });
  }
  function draw() {
    if(!texture||failed||document.hidden)return;
    const size=Math.min(gpuEnabled?900:(pointers.size?420:680),Math.max(1,Math.round(canvas.clientWidth*Math.min(Math.max(devicePixelRatio||1,1.5),2.5))));
    if(canvas.width!==size||canvas.height!==size){canvas.width=size;canvas.height=size;}
    const radius=radiusOf(selected)*zoom,roll=views[selected][2];
    if(gpuEnabled){
      try { if(gpu.draw(ctx,canvas.width,texture,yaw,pitch,radius,ringOf(selected),selected==='zem',atmospheres[selected],roll,selected==='slnko'))return; } catch (_) {}
      gpuEnabled=false;canvas.dataset.renderer='canvas';
    }
    renderDetail(texture,selected,yaw,pitch,radius,roll);
  }
  function requestDraw(force=false) {
    if(force===true)dirty=true;
    if(!pending&&!failed&&(visible||dirty)&&!document.hidden&&texture)pending=requestAnimationFrame(frame);
  }
  function frame(time) {
    pending=0;
    if(document.hidden||failed||(!visible&&!dirty))return;
    const auto=visible&&motion()&&!pointers.size&&time>=manualUntil;
    if(!dirty&&auto&&last&&time-last<frameInterval){requestDraw();return;}
    const dt=last?Math.min(70,time-last):0;last=time;
    if(auto)yaw=(yaw+dt*.00023)%TAU;
    if(dirty||auto){
      dirty=false;const start=performance.now();draw();
      frameInterval=gpuEnabled?16:clamp((performance.now()-start)*1.25,24,100);
    }
    if(visible&&motion()&&!pointers.size)requestDraw();else last=0;
  }
  function manual() { manualUntil=performance.now()+3500;last=0;requestDraw(true); }
  function updateZoom(value) {
    zoom=clamp(value,.65,1.75); minus.disabled=zoom<=.65; plus.disabled=zoom>=1.75; manual();
  }
  function resetView() { [yaw,pitch]=views[selected]; updateZoom(1); }
  function useFallback() { viewer.hidden=true; fallback.hidden=false; }
  function showStatus(state) {
    mapState=state;
    const messages={loading:'Načítava sa astronomická mapa…',real:'Astronomická mapa (spracovaná z pozorovaní; farby môžu byť upravené).',fallback:'Ilustračná textúra – astronomická mapa nie je dostupná.'};
    status.textContent=t(messages[state]);credit.hidden=![...records.values()].some(r=>r.real);
    canvas.dataset.texture=state;
  }
  function activate(tex,id,real) {
    if(failed||id!==selected)return;
    texture=tex;viewer.hidden=false;fallback.hidden=true;last=0;
    if(real)showStatus('real');
    requestDraw(true);
  }
  function loadTexture(url,remote,done) {
    const image=new Image();
    if(remote)image.crossOrigin='anonymous';
    let finished=false;
    const timer=setTimeout(()=>finish(null),remote?12000:6000);
    function finish(tex){if(finished)return;finished=true;clearTimeout(timer);image.onload=null;image.onerror=null;done(tex);}
    image.onload=()=>{
      try {
        scratch.width=image.naturalWidth;scratch.height=image.naturalHeight;
        source.drawImage(image,0,0);finish(source.getImageData(0,0,scratch.width,scratch.height));
      } catch(_){finish(null);}
    };
    image.onerror=()=>finish(null);image.src=url;
  }
  // Jeden záznam a jedno načítanie pre kartu aj detail; zmena planéty nezruší sťahovanie.
  function loadPlanet(id){
    if(records.has(id))return records.get(id);
    const record={tex:null,real:false,state:'loading'};records.set(id,record);
    function publish(tex,real){
      record.tex=tex;record.real=real;
      if(real)record.state='real';
      paintCard(id,record);
      if(id===selected){activate(tex,id,real);showStatus(record.state);}
      else if(real)credit.hidden=false;
    }
    record.done=new Promise(resolve=>{
      // Lokálna mapa je okamžitá náhrada; skutočná mapa ju nahradí súčasne v oboch zobrazeniach.
      loadTexture(planetTextures[id],false,tex=>{if(tex&&!record.real)publish(tex,false);});
      const local=lokalneAstronomickeMapy[id];
      loadTexture(local||astronomickeMapy[id],!local,tex=>{
        if(tex)publish(tex,true);
        else {record.state='fallback';if(id===selected)showStatus('fallback');}
        resolve();
      });
    });
    return record;
  }
  function choose(id) {
    if(failed||!Object.hasOwn(planetTextures,id))return;
    canvas.setAttribute('aria-label',t('Interaktívny 3D model: {name}',{name:t(id==='slnko'?slnkoData.nazov:planety[id].nazov)}));
    if(id===selected){showStatus(mapState);return;}
    clearPointers();selected=id;texture=null;resetView();
    useFallback();showStatus('loading');
    const record=loadPlanet(id);
    if(record.tex)activate(record.tex,id,record.real);
    showStatus(record.state);
  }
  // Načítavanie ostatných kariet až pri priblížení sekcie, najviac tri súbežne.
  let previewsStarted=false;
  function loadPreviews(){
    if(previewsStarted)return;previewsStarted=true;
    const ids=['slnko',...cards.keys()];
    async function worker(){while(ids.length){const id=ids.shift();await loadPlanet(id).done;}}
    for(let i=0;i<3;i++)worker();
  }
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();loadPreviews();}},{rootMargin:'400px'});for(const prvok of document.querySelectorAll('.orbit-model, .solar-overview, .planet-grid'))observer.observe(prvok);}
  else loadPreviews();
  function distance(){const [a,b]=pointers.values();return a&&b?Math.hypot(a.x-b.x,a.y-b.y):0;}
  function clearPointers(){
    for(const id of pointers.keys()){
      try{if(stage.hasPointerCapture(id))stage.releasePointerCapture(id);}catch(_){}
    }
    pointers.clear();previousDistance=0;stage.classList.remove('is-dragging');
  }
  stage.addEventListener('pointerdown',e=>{
    if(e.pointerType==='mouse'&&e.button!==0)return;
    e.preventDefault();
    pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    // Ak capture nie je dostupný, window poslucháče stále spracujú drag.
    try{stage.setPointerCapture(e.pointerId);}catch(_){}
    previousDistance=distance();stage.classList.add('is-dragging');manual();
  });
  window.addEventListener('pointermove',e=>{
    const prev=pointers.get(e.pointerId);if(!prev)return;
    if(e.pointerType==='mouse'&&e.buttons===0){release(e);return;}
    if(e.cancelable)e.preventDefault();
    pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(pointers.size===1){yaw-=(e.clientX-prev.x)*.012;pitch=clamp(pitch+(e.clientY-prev.y)*.012,-1.48,1.48);manual();}
    else if(pointers.size===2){const d=distance();if(previousDistance>0&&d>0)updateZoom(zoom*d/previousDistance);previousDistance=d;}
  },{passive:false,capture:true});
  function release(e){
    if(!pointers.delete(e.pointerId))return;
    try{if(stage.hasPointerCapture(e.pointerId))stage.releasePointerCapture(e.pointerId);}catch(_){}
    previousDistance=distance();if(!pointers.size)stage.classList.remove('is-dragging');manual();
  }
  for(const event of ['pointerup','pointercancel'])window.addEventListener(event,release,true);
  stage.addEventListener('lostpointercapture',release);
  window.addEventListener('blur',()=>{clearPointers();manual();});
  stage.addEventListener('wheel',e=>{e.preventDefault();updateZoom(zoom*Math.exp(-e.deltaY*(e.deltaMode===1?.055:e.deltaMode===2?.7:.0015)));},{passive:false});
  minus.addEventListener('click',()=>updateZoom(zoom/1.2));plus.addEventListener('click',()=>updateZoom(zoom*1.2));reset.addEventListener('click',resetView);
  canvas.addEventListener('keydown',e=>{
    switch(e.key){case 'ArrowLeft':yaw+=.15;break;case 'ArrowRight':yaw-=.15;break;case 'ArrowUp':pitch=clamp(pitch-.15,-1.48,1.48);break;case 'ArrowDown':pitch=clamp(pitch+.15,-1.48,1.48);break;case '+':case '=':updateZoom(zoom*1.2);break;case '-':updateZoom(zoom/1.2);break;case 'Home':resetView();break;default:return;}
    e.preventDefault();manual();
  });
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0;if(!visible&&pending){cancelAnimationFrame(pending);pending=0;}requestDraw(true);}).observe(viewer);
  if('ResizeObserver' in window)new ResizeObserver(()=>requestDraw(true)).observe(canvas); else window.addEventListener('resize',()=>requestDraw(true));
  document.addEventListener('visibilitychange',()=>{last=0;if(document.hidden&&pending){cancelAnimationFrame(pending);pending=0;}requestDraw();});
  new MutationObserver(()=>requestDraw(true)).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  reduced.addEventListener('change',()=>requestDraw(true));
  canvas.addEventListener('contextlost',e=>{e.preventDefault();failed=true;if(pending)cancelAnimationFrame(pending);useFallback();});
  document.addEventListener('vesmir:planet',e=>choose(e.detail));
  document.addEventListener('vesmir:language',()=>showStatus(mapState));
  choose(vybranaPlaneta);
})();

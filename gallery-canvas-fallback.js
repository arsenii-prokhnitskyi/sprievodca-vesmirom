/* Ilustratívne priestorové scény galérie. Lokálne objemové mapy a galaxie,
   nie merané 3D dáta. Načítanie textúr až pri prvom otvorení scény. */
const GalleryCanvasFallback = (() => {
  const TAU = Math.PI * 2, clamp = (v,a,b) => Math.max(a,Math.min(b,v));
  const cache = new Map(), base = 'assets/gallery-scenes/';
  function load(path) {
    if (!cache.has(path)) {
      const img = new Image(); img.src = path; cache.set(path,img);
      if(cache.size>16)cache.delete(cache.keys().next().value);
    }
    return cache.get(path);
  }
  const ready = img => img && img.complete && img.naturalWidth > 0;
  const failed = img => img && img.complete && !img.naturalWidth;
  // Maximum pixel budgets include both dimensions, not just width.
  const profiles = Object.freeze({
    low:    {dpr:1,   scale:.8, maxSide:1600, maxPixels:1600000, hd:false},
    medium: {dpr:2,   scale:1,  maxSide:2560, maxPixels:3500000, hd:false},
    high:   {dpr:3,   scale:1,  maxSide:4096, maxPixels:8000000, hd:true,  },
    ultra:  {dpr:4,   scale:1.5,maxSide:5120,maxPixels:12000000,hd:true,  }
  });
  function resolution(width,height,dpr,quality) {
    const p=profiles[quality]||profiles.high;
    const ratio=Math.min(Math.min(dpr||1,p.dpr)*p.scale,p.maxSide/Math.max(1,width,height),Math.sqrt(p.maxPixels/Math.max(1,width*height)));
    return {width:Math.max(1,Math.floor(width*ratio)),height:Math.max(1,Math.floor(height*ratio)),ratio};
  }
  function hdStatus(s) {
    return [...(s.atlases||[]),...(s.sprites||[]),...(s.hdAtlases||[]),...(s.hdSprites||[]),s.gpuAtlas].filter(Boolean).map(im=>ready(im)?1:failed(im)?2:0).join('');
  }
  function hdSprites(s) {
    if(!s.hdSprites)s.hdSprites=Array.from({length:6},(_,i)=>load(base+'galaxy-hd-'+i+'.webp'));
    if(s.hdSprites.every(ready))return s.hdSprites;
    if(!s.hdSprites.some(failed))s.hdPending=true;else s.hdFallback=true;
    return s.sprites;
  }
  function hdVolume(s,ax) {
    if(!s.hdAtlases)s.hdAtlases=[];
    const im=s.hdAtlases[ax]||(s.hdAtlases[ax]=load(base+s.typ+'-sharp-'+ax+'.webp'));
    if(ready(im))return im;
    if(!failed(im))s.hdPending=true;else s.hdFallback=true;
    return null;
  }
  function rng(seed) { return () => {seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}; }
  function create(typ) {
    const r=rng({carina:151,pillars:232,cartwheel:333,'deep-field':489}[typ]||1);
    const scene={typ,yaw:typ==='cartwheel'?-.27:-.12,pitch:typ==='cartwheel'?.23:.05,zoom:1,panX:0,panY:0,stars:[],galaxies:[],atlases:[],time:0};
    for(let i=0;i<850;i++) scene.stars.push({x:(r()-.5)*7,y:(r()-.5)*5,z:(r()-.5)*5,size:.4+Math.pow(r(),5)*2.3,alpha:.25+r()*.73,color:r()<.2?'#ffdab3':r()<.4?'#aacaff':'#e9efff'});
    if(['carina','pillars','cartwheel'].includes(typ)) scene.atlases=[];
    if(typ==='cartwheel'){scene.knots=[];for(let i=0;i<1700;i++){const a=r()*TAU,rad=.72+(r()-.5)*.085+.020*Math.sin(a*5);scene.knots.push({x:rad*Math.cos(a)*1.13,y:rad*Math.sin(a)*1.13,z:(r()-.5)*.10,size:.22+Math.pow(r(),4)*1.25,alpha:.10+r()*.68,color:r()<.5?'#ffb0a0':'#c2d7ff'});}}
    if(typ==='cartwheel'){
      for(let i=0;i<1200;i++){
        const a=r()*TAU,rad=i<700?.19+(r()-.5)*.05:Math.sqrt(r())*.10;
        scene.knots.push({x:rad*Math.cos(a)*1.13,y:rad*Math.sin(a)*1.13,z:(r()-.5)*.10,size:.19+Math.pow(r(),4)*.65,alpha:.12+r()*.52,color:r()<.65?'#ffcf9e':'#c5d9ff'});
      }
      for(let i=0;i<750;i++){
        const rad=.23+r()*.44,angle=(Math.floor(r()*7)*TAU-rad*4.5)/7+(r()-.5)*.075;
        scene.knots.push({x:rad*Math.cos(angle)*1.13,y:rad*Math.sin(angle)*1.13,z:(r()-.5)*.06,size:.18+Math.pow(r(),4)*.52,alpha:.08+r()*.30,color:r()<.5?'#e8a8ae':'#b4c9fa'});
      }
    }
    if(typ==='deep-field'||typ==='cartwheel') {
      scene.sprites=Array.from({length:6},(_,i)=>load(base+'galaxy-'+i+'.webp'));
      const add=(x,y,z,size,variant,angle,tilt,alpha=1)=>scene.galaxies.push({x,y,z,size,variant,angle,tilt,alpha});
      if(typ==='cartwheel') {add(-1.23,.62,-.16,.35,0,.6,.35);add(-1.39,.07,-.10,.24,4,-.4,.3);}
      else {
        for(let i=0;i<390;i++) add((r()-.5)*4.9,(r()-.5)*3.5,(r()-.5)*4.2,.013+Math.pow(r(),5)*.22,Math.floor(r()*6),r()*TAU,(r()-.5)*2.7,.55+r()*.45);
        add(-.55,.24,.4,.37,1,.8,.4);add(.48,-.38,.26,.28,0,-.8,.65);add(.13,.08,.7,.25,4,.5,.85);add(.83,.55,-.3,.25,2,2.6,.4);
        for(let i=0;i<240;i++)add((r()-.5)*4.9,(r()-.5)*3.5,-.7-r()*2.0,.013+r()*.034,Math.floor(r()*6),r()*TAU,(r()-.5)*2.7,.28+r()*.40);
      }
    }
    return scene;
  }
  // Ortonormálna báza kamery; x doprava, y nahor, z k pozorovateľovi.
  function basis(s) {
    const c=Math.cos(s.yaw),d=Math.sin(s.yaw),p=Math.cos(s.pitch),q=Math.sin(s.pitch);
    return [[c,0,-d],[-d*q,p,-c*q],[d*p,q,c*p]];
  }
  const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
  function project(v,b,w,h,scale,s,perspective=false) {
    const z=dot(b[2],v),f=perspective?5/Math.max(1.15,5-z):1;
    return [w/2+s.panX*w+dot(b[0],v)*scale*f,h/2+s.panY*h-dot(b[1],v)*scale*f,z,f];
  }
  function stars(ctx,s,b,w,h,scale) {
    ctx.fillStyle='#050711';ctx.fillRect(0,0,w,h);
    const haze=ctx.createRadialGradient(w*.46,h*.42,0,w*.46,h*.42,Math.max(w,h)*.66);
    haze.addColorStop(0,'#101526');haze.addColorStop(1,'#03050b');ctx.fillStyle=haze;ctx.fillRect(0,0,w,h);
    const ref=s.referenceWidth||w, density=w/ref;
    const k=clamp(ref/900,.7,1.5)*density;
    for(const a of s.stars) {
      const [x,y,,f]=project([a.x,a.y,a.z],b,w,h,scale*.66,s,true);
      if(x<0||x>w||y<0||y>h)continue;
      const rad=a.size*k*clamp(f,.5,1.7)*.76;ctx.globalAlpha=a.alpha;ctx.fillStyle=a.color;
      ctx.beginPath();ctx.arc(x,y,rad*.68,0,TAU);ctx.fill();
      if(rad>1.8*density){ctx.globalAlpha=a.alpha*.18;ctx.fillRect(x-rad*2.6,y-.34*density,rad*5.2,.68*density);ctx.fillRect(x-.34*density,y-rad*2.6,.68*density,rad*5.2);}
    }
    ctx.globalAlpha=1;
  }
  function volume(ctx,s,b,w,h,scale) {
    // 48 základných alebo 96 detailných rezov. Jeden atlas na os, načítaný pri otvorení scény.
    const stretch=s.typ==='carina'?[1.48,1,.95]:s.typ==='pillars'?[1.04,1,.95]:[1.13,1.13,.78];
    const weights=b[2].map((v,i)=>Math.abs(v/stretch[i]));const ax=weights.indexOf(Math.max(...weights));
    s.backend='Canvas 2D';
    const img=s.atlases[ax]||(s.atlases[ax]=load(base+s.typ+'-'+ax+'.webp'));
    const high=profiles[s.quality||'high'].hd;
    const hd=high&&(!s.motionPreview||!ready(img))?hdVolume(s,ax):null;
    // Preload the next likely view direction before the dominant axis changes.
    const neighbor=[0,1,2].filter(i=>i!==ax).sort((a,b)=>weights[b]-weights[a])[0];
    if(weights[neighbor]>weights[ax]*.72){
      if(!s.atlases[neighbor])s.atlases[neighbor]=load(base+s.typ+'-'+neighbor+'.webp');
      if(high&&!s.motionPreview)hdVolume(s,neighbor);
    }
    if(!hd&&!ready(img))return false;
    const count=hd?96:48, tile=hd?256:144, cols=hd?12:8;
    s.volumeSlices=count; s.volumeTile=tile;
    const uv=[0,1,2].filter(i=>i!==ax),u=uv[0],v=uv[1],dir=b[2][ax]>=0?1:-1;
    const ux=b[0][u]*stretch[u]*scale,uy=-b[1][u]*stretch[u]*scale,vx=b[0][v]*stretch[v]*scale,vy=-b[1][v]*stretch[v]*scale;
    const cx=w/2+s.panX*w+(s.typ==='cartwheel'?w*.08:0),cy=h/2+s.panY*h+(s.typ==='carina'?h*.03:0);
    for(let j=0;j<count;j++){
      const i=dir>0?j:count-1-j, a=(2*(i+.5)/count-1)*stretch[ax]*scale;
      const px=cx+b[0][ax]*a-ux-vx,py=cy-b[1][ax]*a-uy-vy;
      const local=i;
      if(px+Math.max(0,2*ux)+Math.max(0,2*vx)<0||px+Math.min(0,2*ux)+Math.min(0,2*vx)>w||py+Math.max(0,2*uy)+Math.max(0,2*vy)<0||py+Math.min(0,2*uy)+Math.min(0,2*vy)>h)continue;
      ctx.setTransform(ux*2/tile,uy*2/tile,vx*2/tile,vy*2/tile,px,py);
      ctx.drawImage(hd||img,(local%cols)*(tile+4)+2,Math.floor(local/cols)*(tile+4)+2,tile,tile,0,0,tile,tile);
    }
    ctx.setTransform(1,0,0,1,0,0);return true;
  }
  function galaxies(ctx,s,b,w,h,scale) {
    const sprites=profiles[s.quality||'high'].hd?hdSprites(s):s.sprites;
    s.spriteSize=sprites===s.sprites?256:1024;
    const visible=s.galaxies.map(g=>({g,p:project([g.x,g.y,g.z],b,w,h,scale,s,true)})).sort((a,b)=>a.p[2]-b.p[2]);
    for(const {g,p:[x,y,z,f]} of visible){
      const img=sprites[g.variant];if(!ready(img))continue;
      const radius=g.size*scale*f;if(x+radius<0||x-radius>w||y+radius<0||y-radius>h)continue;
      const ca=Math.cos(g.angle),sa=Math.sin(g.angle),ct=Math.cos(g.tilt),st=Math.sin(g.tilt);
      const u=[ca,sa,0],v=[-sa*ct,ca*ct,st];
      ctx.globalAlpha=g.alpha;
      ctx.setTransform(dot(b[0],u)*radius/128,-dot(b[1],u)*radius/128,dot(b[0],v)*radius/128,-dot(b[1],v)*radius/128,x,y);
      ctx.drawImage(img,-128,-128,256,256);
    }
    ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;
    if(s.typ==='deep-field'){
      // Zakrivené svetelné oblúky naznačujú gravitačné šošovkovanie; nie vedecké meranie.
      const p=project([.12,.1,.4],b,w,h,scale,s,true);const rad=scale*.37*p[3];
      ctx.save();ctx.translate(p[0],p[1]);ctx.scale(1,Math.max(.3,Math.abs(Math.cos(s.pitch))));ctx.rotate(-s.yaw*.5);
      for(let i=0;i<5;i++){ctx.strokeStyle=i%2?'#f9ad79aa':'#f8d5a277';ctx.lineWidth=Math.max(.8,scale*.0045);ctx.beginPath();ctx.arc(0,0,rad*(.78+i*.16),.42+i*1.2,.67+i*1.2);ctx.stroke();}ctx.restore();
    }
  }
  function draw(ctx,s,w,h){
    s.hdPending=false;s.hdFallback=false;
    ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';s.backend='Canvas 2D';s.raySteps=0;s.volumeRaster='';
    const b=basis(s),scale=Math.min(w/(s.typ==='carina'?3.05:s.typ==='cartwheel'?3.25:2.45),h/2.15)*s.zoom;
    stars(ctx,s,b,w,h,scale);
    if(s.typ==='deep-field'){galaxies(ctx,s,b,w,h,scale);return s.sprites.every(ready);}
    if(s.typ==='cartwheel')galaxies(ctx,s,b,w,h,scale);
    const ok=volume(ctx,s,b,w,h,scale);
    if(ok&&s.knots){for(const a of s.knots){const p=project([a.x,a.y,a.z],b,w,h,scale,s);ctx.globalAlpha=a.alpha;ctx.fillStyle=a.color;ctx.beginPath();ctx.arc(p[0]+w*.08,p[1],a.size*Math.min(1.8,Math.max(.6,scale/(w/(s.referenceWidth||w))/245))*(w/(s.referenceWidth||w)),0,TAU);ctx.fill();}ctx.globalAlpha=1;}

    return ok;
  }
  return {create,draw,profiles,resolution,hdStatus,release(){cache.clear();}};
})();

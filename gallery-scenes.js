/* Scene data and camera for the gallery. World-space depths are illustrative. */
const GalleryScenes = (() => {
  const profiles = Object.freeze({
    low:    {scale:.68,dpr:1.25,pixels:510000,motionPixels:300000,steps:56,motionSteps:40,detail:0,motionDetail:0,galaxySteps:6},
    medium: {scale:1,dpr:1.75,pixels:1100000,motionPixels:480000,steps:96,motionSteps:57,detail:1,motionDetail:0,galaxySteps:10},
    high:   {scale:1,dpr:2.5,pixels:2900000,motionPixels:520000,steps:176,motionSteps:76,detail:2,motionDetail:0,galaxySteps:15},
    ultra:  {scale:1.45,dpr:3,pixels:5600000,motionPixels:1100000,steps:256,motionSteps:110,detail:3,motionDetail:1,galaxySteps:20}
  });
  const volumes = {
    carina: {name:'cliffs',size:[304,192,128],extent:[1.70,1.18,.91],rayLength:2.62,samplesPerUnit:88},
    pillars: {name:'pillars',size:[208,272,144],extent:[1.16,1.21,.81],rayLength:2.35,samplesPerUnit:104},
    cartwheel: {name:'cartwheel',size:[304,304,80],extent:[1.26,1.26,.31],rayLength:1.4,samplesPerUnit:119}
  };
  const choices=['low','medium','high','ultra'], TAU=2*Math.PI;
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  let fallbackScript;

  function random(seed) {
    return () => {
      seed=(Math.imul(seed,1664525)+1013904223)>>>0;
      return seed/4294967296;
    };
  }

  function makeStars(typ) {
    const r=random({carina:151,pillars:232,cartwheel:333,'deep-field':489}[typ]);
    const count=typ==='deep-field'?1300:typ==='cartwheel'?1530:4580;
    const data=[];
    for(let i=0;i<count;i++) {
      const tint=r();
      const color=tint<.21?[1,.70,.45]:tint>.65?[.51,.70,1]:[.88,.91,1];
      const size=.28+.83*r()**2+1.9*r()**15;
      const strength=.13+.64*r()**2;
      data.push((r()-.5)*10,(r()-.5)*7,(r()-.64)*5,size,...color,strength);
    }
    const foreground={
      carina:[[-.96,.64,.4,5.2],[-.34,.24,1.2,3.3],[1.17,.44,.5,4.4],[.51,-.15,1.2,2.3],[-.69,-.40,1.2,2.8],[-1.54,-.61,.9,3.65]],
      pillars:[[-.87,.72,.9,4.1],[.59,.63,.2,5.1],[.34,-.06,1.05,3.7],[-.27,.84,.89,1.6],[-.79,-.69,.8,2.0]],
      cartwheel:[[-1.39,-.57,.9,3.4],[1.32,.57,.9,2.8],[.92,-.87,-.33,1.9]],
      'deep-field':[[-.19,.26,1.24,7.6],[-.84,.62,1.34,4.8],[-.78,-.67,1.1,3.2],[1.1,.61,.8,2.4],[-1.55,-.2,.45,2.7],[.94,-.81,.6,3.9]]
    }[typ];
    if(typ==='cartwheel'){
      // Compact young star clusters follow the same asymmetric shock front as the gas.
      for(let i=0;i<540;i++){
        const arm=Math.floor(r()*14), a=(arm+.53+(r()+r()+r()-1.5)*.78)*TAU/14;
        const ring=.86+.026*Math.sin(a*3+.71)+.022*Math.sin(a*7-.9)+.013*Math.sin(a*12+2);
        const radius=ring+.027+(r()+r()+r()-1.5)*.078;
        const z=.026*Math.sin(a*2+.64)*radius**2+.016*Math.cos(a*5)*radius+(r()-.32)*.082;
        const color=r()<.22?[1,.41,.31]:[.51,.65,1];
        data.push(radius*Math.cos(a),radius*Math.sin(a)/1.10,z,-(.25+r()**4*.81),...color,.18+r()**2*.59);
      }
    }
    const behind=data.length/8;
    for(let i=0;i<foreground.length;i++){
      const p=foreground[i];
      const tint=i%3===1?[1,.81,.57]:[.76,.84,1];
      data.push(...p,...tint,.96);
    }
    return {data:new Float32Array(data),behind};
  }

  function makeGalaxies(typ) {
    const r=random(1795), data=[];
    const add=(x,y,z,radius,type,heading,tilt,seed,tint,energy)=>{
      const c=Math.cos(heading),s=Math.sin(heading),ct=Math.cos(tilt),st=Math.sin(tilt);
      data.push(x,y,z,radius,c,s,0,type,-s*ct,c*ct,st,seed,...tint,energy);
    };
    if(typ==='cartwheel'){
      add(-1.47,.61,-.11,.28,1,.38,.43,.67,[.88,.79,1],1.48);
      add(-1.52,.10,-.03,.22,2,-.6,1.22,.28,[1,.68,.48],1.19);
      add(1.47,-.7,-1.17,.066,0,1.1,.55,.54,[1,.76,.66],.26);
    }
    if(typ==='deep-field'){
      const colors=[[1,.60,.36],[1,.79,.61],[.49,.62,1],[1,.44,.27],[.82,.76,1],[1,.92,.81]];
      for(let i=0;i<1440;i++){
        const z=-3.9+5.15*r()**1.55;
        const isCluster=i<310;
        const x=(r()-.5)*(isCluster?4.35:11),y=(r()-.5)*(isCluster?3.2:7.7);
        const size=.007+.051*r()**2.3+.113*r()**20;
        const brightness=(.22+.52*r()**1.1)*(z>-.1?1.12:.94);
        const type=Math.floor(r()*4), tint=colors[Math.floor(r()*colors.length)];
        add(x,y,z,size,type,r()*TAU,Math.acos(r()*2-1),r(),tint,brightness);
      }
      const named=[
        [.09,.02,.12,.32,0,.55,.44,.15,[1,.86,.66],1.26],
        [-.28,.23,.08,.19,0,.87,.62,.67,[1,.88,.73],.94],
        [ .37,-.25,.05,.21,0,1.03,1.2,.55,[1,.80,.59],.88],
        [-.72,-.24,.31,.25,1,-1.2,.52,.81,[.75,.77,1],1.07],
        [ .94,.32,.17,.25,1,.70,.80,.34,[1,.74,.60],.97],
        [-1.11,.52,-.16,.18,2,.62,.63,.17,[.58,.73,1],.91],
        [ .67,-.65,-.13,.18,3,.15,1.18,.75,[1,.61,.45],.98],
        [1.18,-.42,.22,.16,2,.9,.67,.88,[1,.55,.43],.63],
        [-.42,-.66,-.46,.16,3,.86,1.35,.16,[1,.71,.58],.63],
        [-.46,.63,.36,.17,1,2.66,1.09,.24,[.63,.68,1],.93]
      ];
      for(const g of named)add(...g);
      // Apparent lensed images in the cluster field, drawn as thin curved emission regions.
      const arcs=[[.74,.08,.83],[.64,.57,.64],[.98,.69,.52],[.87,.95,.52],[.54,.38,.38]];
      for(const [radius,phase,energy] of arcs) {
        add(.09,.015,-.04,radius,4,.08,.24,phase,[1,.54,.28],energy);
      }
    }
    return new Float32Array(data);
  }

  function reset(scene) {
    const orbit=scene.typ==='cartwheel'?[-.63,.32]:[-.12,.05];
    const state={yaw:orbit[0],pitch:orbit[1],zoom:1,panX:0,panY:0};
    Object.assign(scene,state);
    scene.view={...state};
  }

  function create(typ) {
    const object=['carina','pillars','cartwheel','deep-field'].indexOf(typ);
    const scene={typ,object,volume:volumes[typ],status:'new',autoIndex:2,abort:new AbortController()};
    reset(scene);
    return scene;
  }

  function camera(s,width,height) {
    const c=Math.cos(s.yaw),d=Math.sin(s.yaw),p=Math.cos(s.pitch),q=Math.sin(s.pitch);
    const fitX=[3.75,2.51,3.42,3.55][s.object];
    const fitY=[2.32,2.78,2.34,2.2][s.object];
    const units=Math.max(fitX/width,fitY/height)/s.zoom;
    const baseDistance=s.object===3?7.6:5.55;
    const right=[c,0,-d],up=[-d*q,p,-c*q];
    const roll=s.object===2?.25:0, cr=Math.cos(roll),sr=Math.sin(roll);
    return {right:right.map((v,i)=>v*cr+up[i]*sr),up:up.map((v,i)=>v*cr-right[i]*sr),front:[d*p,q,c*p],
      halfX:width*units*.5,halfY:height*units*.5,distance:baseDistance/s.zoom**.40,zoom:s.zoom,
      shiftX:2*(s.panX+(s.object===2?.095:0)),shiftY:-2*(s.panY+(s.object===0?-.015:0))};
  }

  function resolution(width,height,dpr,profile,moving,limit,factor,galaxiesOnly=false) {
    const pixelLimit=moving&&!galaxiesOnly?profile.motionPixels:profile.pixels;
    const ratio=Math.min(Math.min(dpr,profile.dpr)*profile.scale,limit/Math.max(width,height),
      Math.sqrt(pixelLimit/(width*height)))*factor;
    return {width:Math.max(1,Math.round(width*ratio)),height:Math.max(1,Math.round(height*ratio)),ratio};
  }

  function tune(s,now,elapsed,moving,coarse) {
    if(!s.autoChecked){
      s.autoIndex=coarse?1:2;
      s.autoChecked=now;s.autoSamples=0;
    }
    if(!moving){s.autoSamples=0;return;}
    if(!elapsed||elapsed>250)return;
    s.cadence=s.autoSamples?s.cadence*.86+elapsed*.14:elapsed;
    s.autoSamples++;
    if(s.autoSamples<12||now-s.autoChecked<680)return;
    const slow=(s.gpuMs??0)>19||s.cadence>25;
    const fast=(s.gpuMs??15)<8.5&&s.cadence<17.5;
    if(slow)s.autoIndex=Math.max(0,s.autoIndex-1);
    else if(fast)s.autoIndex=Math.min(coarse?1:2,s.autoIndex+1);
    if(s.autoIndex===0&&slow)s.autoFactor=Math.max(.59,(s.autoFactor||1)*.84);
    if(fast&&s.autoFactor)s.autoFactor=Math.min(1,s.autoFactor*1.12);
    s.autoChecked=now;s.autoSamples=0;
  }

  async function voxels(volume,signal) {
    // A classic script can load the compressed local data even when the site is opened via file://.
    const encoded=await new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      const clean=()=>{
        signal.removeEventListener('abort',abort);
        script.onload=null;script.onerror=null;script.remove();
      };
      const abort=()=>{clean();reject(signal.reason);};
      if(signal.aborted){abort();return;}
      signal.addEventListener('abort',abort,{once:true});
      script.src='assets/gallery-scenes/'+volume.name+'.volume.js';
      script.onload=()=>{
        const payload=script.galleryVolume;
        script.galleryVolume=null;clean();
        if(typeof payload==='string')resolve(payload);
        else reject(Error('Invalid gallery volume script '+volume.name));
      };
      script.onerror=()=>{clean();reject(Error('Could not load gallery volume '+volume.name));};
      document.head.append(script);
    });
    if(signal.aborted)throw signal.reason;
    let packed;
    if(typeof Uint8Array.fromBase64==='function')packed=Uint8Array.fromBase64(encoded);
    else {
      const decoded=atob(encoded);
      packed=new Uint8Array(decoded.length);
      for(let i=0;i<decoded.length;i++)packed[i]=decoded.charCodeAt(i);
    }
    const stream=new Blob([packed]).stream().pipeThrough(new DecompressionStream('gzip'));
    const bytes=new Uint8Array(await new Response(stream).arrayBuffer());
    if(bytes.length!==volume.size.reduce((a,b)=>a*b,4))throw Error('Invalid gallery volume '+volume.name);
    for(let i=4;i<bytes.length;i++)bytes[i]+=bytes[i-4];
    return bytes;
  }

  async function start(scene,renderer,onReady) {
    if(scene.status!=='new')return;
    const {signal}=scene.abort;
    scene.status='loading';
    if(renderer){
      try {
        scene.stars=makeStars(scene.typ);
        scene.galaxies=makeGalaxies(scene.typ);
        renderer.prepare(scene);
        scene.stars=null;scene.galaxies=null;
        if(scene.volume) {
          const data=await voxels(scene.volume,signal);
          if(signal.aborted)return;
          renderer.upload(scene,data);
        }
        scene.status='ready';onReady();
        return;
      } catch(error) {
        if(signal.aborted)return;
        console.warn('Gallery WebGL2:',error.message);
        renderer.release();
      }
    }
    try {
      if(!fallbackScript){
        fallbackScript=new Promise((resolve,reject)=>{
          const script=document.createElement('script');
          script.src='gallery-canvas-fallback.js';
          script.onload=resolve;script.onerror=()=>reject(Error('Gallery fallback script unavailable'));
          document.head.append(script);
        }).catch(error=>{fallbackScript=null;throw error;});
      }
      await fallbackScript;
      if(signal.aborted)return;
      scene.fallback=GalleryCanvasFallback.create(scene.typ);
      scene.status='fallback';
    }catch(error){
      if(signal.aborted)return;
      scene.status='error';
      console.warn(error.message);
    }
    onReady();
  }

  function release(scene,renderer) {
    scene?.abort.abort();
    renderer?.release();
    if(scene?.fallback)GalleryCanvasFallback.release();
  }

  return {profiles,choices,camera,create,reset,resolution,tune,start,release,clamp};
})();

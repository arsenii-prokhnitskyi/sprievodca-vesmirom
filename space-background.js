// Dekoratívne pozadie: jeden viewport, tri hĺbky, lokálne textúry a adaptívna snímková frekvencia.
(() => {
  'use strict';
  const root = document.documentElement, background = document.querySelector('.space-background');
  const canvas = document.getElementById('starfield'), ctx = canvas?.getContext('2d');
  if (!ctx || !background) return;
  const dust = [...background.querySelectorAll('.space-dust')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = matchMedia('(pointer: coarse)');
  const constrained = (navigator.deviceMemory && navigator.deviceMemory <= 4) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || navigator.connection?.saveData;
  let w=1,h=1,dpr=1,stars=[],frame=0,last=0,time=0,meteor=null,nextMeteor=12000;
  let tier=0, expensive=0, viewerVisible=false, pointerX=0,pointerY=0,px=0,py=0,scroll=0,sy=0;
  let samples=0,paintTotal=0,paintMax=0,draws=0;
  const profiles=[{fps:30,count:420,dpr:1.5},{fps:20,count:220,dpr:1.25},{fps:12,count:120,dpr:1}];
  const rand=(()=>{let n=87143;return ()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};})();
  const fract=x=>x-Math.floor(x);
  const light=()=>root.dataset.theme==='light';
  const dialogOpen=()=>!!document.querySelector('dialog[open]');
  const active=()=>root.classList.contains('motion-enabled')&&!reduced.matches&&!document.hidden&&!dialogOpen()&&!viewerVisible;
  const baseTier=()=>constrained?2:(coarse.matches||w<700?1:0);
  function stop(){if(frame)cancelAnimationFrame(frame);frame=0;last=0;}
  function resize(){
    w=Math.max(1,innerWidth);h=Math.max(1,innerHeight);tier=Math.max(baseTier(),tier);
    const p=profiles[tier];dpr=Math.min(devicePixelRatio||1,p.dpr,Math.sqrt(2500000/(w*h)));
    canvas.width=Math.max(1,Math.round(w*dpr));canvas.height=Math.max(1,Math.round(h*dpr));
    ctx.setTransform(canvas.width/w,0,0,canvas.height/h,0,0);
    if(!stars.length)stars=Array.from({length:420},(_,i)=>({x:rand(),y:rand(),depth:i%3,r:.35+rand()*1.2,phase:rand()*6.283,speed:.4+rand(),color:rand()}));
    if(!document.hidden)paint();sync();
  }
  // Dve malé galaxie ako vopred vykreslené sprity; bez opakovaného generovania štruktúry.
  function galaxy(seed){
    const c=document.createElement('canvas');c.width=192;c.height=112;const g=c.getContext('2d');
    let n=seed;const r=()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};
    g.translate(96,56);g.rotate(-.32);g.scale(1,.50);
    const glow=g.createRadialGradient(0,0,0,0,0,77);glow.addColorStop(0,'rgba(255,219,177,.85)');glow.addColorStop(.12,'rgba(181,172,222,.45)');glow.addColorStop(.55,'rgba(112,143,212,.14)');glow.addColorStop(1,'rgba(112,143,212,0)');g.fillStyle=glow;g.fillRect(-80,-80,160,160);
    for(let i=0;i<1200;i++){const rr=5+Math.pow(r(),.8)*70,a=rr*.069+(i%2)*Math.PI+(r()-.5)*(.38+rr*.006);g.globalAlpha=.12+r()*.46;g.fillStyle=i%5===0?'#ffd6b0':'#a9caff';g.fillRect(Math.cos(a)*rr,Math.sin(a)*rr,.65+r(),.65+r());}return c;
  }
  const galaxies=[galaxy(232),galaxy(6821)];
  // Reuse tiny pre-rendered optical halos rather than applying a blur to each star.
  const halos=['#b4caff','#ffe0ba'].map(color=>{const c=document.createElement('canvas');c.width=c.height=32;const g=c.getContext('2d');const halo=g.createRadialGradient(16,16,0,16,16,16);halo.addColorStop(0,color+'bb');halo.addColorStop(.16,color+'55');halo.addColorStop(.45,color+'18');halo.addColorStop(1,color+'00');g.fillStyle=halo;g.fillRect(0,0,32,32);return c;});
  function paint(){
    const begin=performance.now(),day=light(),p=profiles[tier];
    ctx.clearRect(0,0,w,h);
    // Posun kamery je malý, plynulý a rozdielny pre každú hĺbku.
    if(!reduced.matches){px+=(pointerX-px)*.075;py+=(pointerY-py)*.075;sy+=(scroll-sy)*.055;}
    else{px=py=sy=0;}
    for(let layer=0;layer<(tier===2?1:2);layer++){
      const k=layer+1, dx=Math.sin(time/41000+layer*2)*9*k+px*8*k,dy=Math.cos(time/49000+layer)*6*k+py*5*k+Math.sin(sy/850)*10*k;
      if(tier===0) dust[layer].style.opacity=String((day?(layer===0?.22:.14):(layer===0?.70:.49))*(.95+.05*Math.sin(time/47000+layer*2)));
      else dust[layer].style.removeProperty('opacity');
      dust[layer].style.transform=`translate3d(${dx.toFixed(2)}px,${dy.toFixed(2)}px,0) scale(${(1.025+Math.sin(time/90000+layer)*.015).toFixed(4)})`;
    }
    if(!day&&tier<2){ctx.globalAlpha=.38;ctx.drawImage(galaxies[0],w*.80+px*9-39,h*.16+py*6+Math.sin(sy/700)*12-23,78,46);ctx.globalAlpha=.24;ctx.drawImage(galaxies[1],w*.08+px*6,h*.73+Math.sin(sy/850)*15,56,33);}
    // Malé hviezdy bez tieňov a filtrov; len svetlejšie blízke hviezdy dostanú jemné lúče.
    const count=Math.min(p.count,Math.max(65,Math.round(w*h/2900)));
    for(let i=0;i<count;i++){
      const s=stars[i],z=s.depth+1,dx=px*9*z,dy=py*6*z+sy*.014*z;
      const x=fract(s.x+(dx+time*.00042*z)/w)*w,y=fract(s.y+(dy+time*.00021*z)/h)*h;
      const a=(.45+.22*Math.sin(time*.0009*s.speed+s.phase))*(.48+z*.17);
      ctx.globalAlpha=day?a*.48:a;ctx.fillStyle=day?'#6482b0':s.color>.91?'#f6d7af':s.color<.26?'#9abfff':'#e4ecff';
      const radius=s.r*(.55+z*.24);
      ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.fill();
      if(!day&&tier===0&&z===3&&s.r>1.43){ctx.globalAlpha=a*.42;const size=8+radius*5;ctx.drawImage(halos[s.color>.91?1:0],x-size/2,y-size/2,size,size);ctx.globalAlpha=a*.18;ctx.fillRect(x-3.4,y-.25,6.8,.5);ctx.fillRect(x-.25,y-3.4,.5,6.8);}
    }
    ctx.globalAlpha=1;
    if(meteor&&tier<2){
      const q=(time-meteor.start)/1100;if(q>=1)meteor=null;
      else{const x=meteor.x+q*w*.29,y=meteor.y+q*h*.20,dx=100,dy=45;const g=ctx.createLinearGradient(x-dx,y-dy,x,y);g.addColorStop(0,'transparent');g.addColorStop(1,day?'#577db2':'#e5edff');ctx.globalAlpha=Math.sin(q*Math.PI)*.7;ctx.strokeStyle=g;ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x-dx,y-dy);ctx.lineTo(x,y);ctx.stroke();ctx.globalAlpha=1;}
    }
    const cost=performance.now()-begin;draws++;samples++;paintTotal+=cost;paintMax=Math.max(paintMax,cost);
    if(cost>10)expensive++;else expensive=Math.max(0,expensive-1);
    if(expensive>=12&&tier<2){tier++;expensive=0;queueMicrotask(resize);}
  }
  function tick(now){
    frame=0;if(!active())return;
    const dt=now-last;if(dt>=1000/profiles[tier].fps-1){time+=Math.min(dt,150);last=now;if(time>=nextMeteor){meteor={x:w*(.1+rand()*.55),y:h*(.08+rand()*.5),start:time};nextMeteor=time+14000+rand()*13000;}paint();}
    if(!frame&&active())frame=requestAnimationFrame(tick);
  }
  function sync(){
    if(active()){if(!frame){scroll=window.scrollY;last=performance.now();frame=requestAnimationFrame(tick);}}
    else{stop();meteor=null;}
    background.dataset.running=String(active());background.dataset.quality=['high','medium','low'][tier];
  }
  window.addEventListener('pointermove',e=>{if(!active()||coarse.matches)return;pointerX=e.clientX/w*2-1;pointerY=e.clientY/h*2-1;},{passive:true});
  document.addEventListener('pointerleave',()=>{pointerX=pointerY=0;});
  window.addEventListener('scroll',()=>{if(active())scroll=window.scrollY;},{passive:true});
  window.addEventListener('resize',()=>{w=Math.max(1,innerWidth);h=Math.max(1,innerHeight);tier=baseTier();resize();},{passive:true});
  document.addEventListener('visibilitychange',sync);
  reduced.addEventListener('change',()=>{if(reduced.matches){pointerX=pointerY=scroll=px=py=sy=0;meteor=null;}if(!document.hidden)paint();sync();});
  new MutationObserver(records=>{if(records.some(r=>r.attributeName==='data-theme')&&!document.hidden)paint();sync();}).observe(root,{attributes:true,attributeFilter:['class','data-theme']});
  for(const d of document.querySelectorAll('dialog'))new MutationObserver(sync).observe(d,{attributes:true,attributeFilter:['open']});
  const viewer=document.getElementById('planet-viewer');
  if(viewer&&'IntersectionObserver' in window)new IntersectionObserver(([e])=>{viewerVisible=e.isIntersecting&&!viewer.hidden;sync();}).observe(viewer);
  // Read-only diagnostics for verifying throttling and frame costs in DevTools.
  window.spaceBackgroundStats=()=>({running:!!frame,quality:['high','medium','low'][tier],fpsCap:profiles[tier].fps,draws,meanPaintMs:samples?paintTotal/samples:0,maxPaintMs:paintMax,resolution:[canvas.width,canvas.height],stars:Math.min(profiles[tier].count,Math.max(65,Math.round(w*h/2900)))});
  w=innerWidth;h=innerHeight;tier=baseTier();scroll=sy=window.scrollY;resize();
})();

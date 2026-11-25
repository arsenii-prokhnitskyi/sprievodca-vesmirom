// Software 3D renderer: textured triangular meshes, smooth normals, depth buffer.
// Procedural geometry and colours are illustrative, not measured shape models.
window.SpaceObjectRenderer = (() => {
  const meshes = new Map(), maps = new Map();
  const N = 100, M = 64, stride = N+1, TAU = Math.PI*2;
  const specs = {
    moon:[1,1,1,.008], europa:[1,1,1,.001], titan:[1,1,1,.001], ganymede:[1,1,1,.008],
    pluto:[1,1,1,.005], ceres:[1,.93,1,.025], eris:[1,1,1,.002], haumea:[1,.57,.78,.006],
    makemake:[1,.94,1,.004], vesta:[1,.78,.92,.085], eros:[1,.45,.49,.13],
    bennu:[1,.94,1,.10], halley:[1,.56,.60,.14], halebopp:[1,.84,.90,.13], '67p':[1,.63,.67,.14]
  };
  const comet = id => ['halley','halebopp','67p'].includes(id);
  const normalize = a => {const d=Math.hypot(...a)||1;return a.map(x=>x/d);};
  function point(id,u,v) {
    const [a,b,c,rough] = specs[id];
    const x=Math.cos(v)*Math.cos(u), y=Math.sin(v), z=Math.cos(v)*Math.sin(u);
    let r=1+rough*(.47*Math.sin(8*x+3*y)*Math.cos(7*z-2*y)+.24*Math.sin(16*y+4*z)*Math.cos(11*x)+.07*Math.sin(29*z+8*x)*Math.cos(23*y));
    if(id==='bennu') r*=1+.26*(1-Math.abs(y))-.12*y*y;
    let py=y*b*r, pz=z*c*r;
    if(id==='eros') {const neck=1-.28*Math.exp(-x*x*11);py*=neck;pz*=neck;py+=.15*(x*x-.4);}
    if(id==='67p') {const neck=1-.57*Math.exp(-Math.pow(x-.08,2)*19);py*=neck*(1-.22*x);pz*=neck*(1-.25*x);py+=.10*x;}
    return [x*a*r,py,pz];
  }
  function mesh(id) {
    if(meshes.has(id))return meshes.get(id);
    const verts=[];
    for(let j=0;j<=M;j++)for(let i=0;i<=N;i++){
      const u=i/N*TAU-Math.PI,v=j/M*Math.PI-Math.PI/2,p=point(id,u,v);
      const l=point(id,u-.001,v),r=point(id,u+.001,v),t=point(id,u,v-.001),b=point(id,u,v+.001);
      const A=r.map((x,k)=>x-l[k]),B=b.map((x,k)=>x-t[k]);
      let n=normalize([A[1]*B[2]-A[2]*B[1],A[2]*B[0]-A[0]*B[2],A[0]*B[1]-A[1]*B[0]]);
      if(n.reduce((s,x,k)=>s+x*p[k],0)<0)n=n.map(x=>-x);
      if(j===0||j===M)n=[0,j===0?-1:1,0];
      verts.push({p,n,u:i/N,v:j/M});
    }
    meshes.set(id,verts);return verts;
  }
  function load(id) {
    if(maps.has(id))return maps.get(id);
    const promise=new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0);resolve({data:ctx.getImageData(0,0,c.width,c.height).data,w:c.width,h:c.height});};img.onerror=reject;img.src=window.spaceObjectTextures[id];});
    maps.set(id,promise);return promise;
  }
  const work=document.createElement('canvas'),wc=work.getContext('2d');
  let pixels,depth,side=0;
  function solid(ctx,id,map,w,h,yaw,pitch,zoom) {
    const size=Math.max(160,Math.min(640,Math.round(Math.min(w,h))));
    if(size!==side){side=size;work.width=work.height=size;pixels=wc.createImageData(size,size);depth=new Float32Array(size*size);}
    const out=pixels.data;out.fill(0);depth.fill(-Infinity);
    const cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
    const rotate=([x,y,z])=>{const a=x*cy+z*sy,b=-x*sy+z*cy;return [a,y*cp-b*sp,y*sp+b*cp];};
    const radius=size*(comet(id)?.105:id==='haumea'?.26:.32)*zoom;
    const x0=size*(comet(id)?.62:.5),y0=size*(comet(id)?.56:.49);
    const verts=mesh(id).map(({p,n,u,v})=>{const q=rotate(p),nn=rotate(n);const lam=Math.max(0,-.48*nn[0]+.52*nn[1]+.705*nn[2]);const light=.19+.91*Math.pow(lam,.85);return [x0+q[0]*radius,y0-q[1]*radius,q[2],u*(map.w-1),v*(map.h-1),light];});
    function tri(a,b,c){
      const area=(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);if(Math.abs(area)<.005)return;
      const xmin=Math.max(0,Math.floor(Math.min(a[0],b[0],c[0]))),xmax=Math.min(size-1,Math.ceil(Math.max(a[0],b[0],c[0]))),ymin=Math.max(0,Math.floor(Math.min(a[1],b[1],c[1]))),ymax=Math.min(size-1,Math.ceil(Math.max(a[1],b[1],c[1])));
      for(let y=ymin;y<=ymax;y++)for(let x=xmin;x<=xmax;x++){
        const px=x+.5-a[0],py=y+.5-a[1],v=(px*(c[1]-a[1])-py*(c[0]-a[0]))/area,t=((b[0]-a[0])*py-(b[1]-a[1])*px)/area,s=1-v-t;
        if(s<0||v<0||t<0)continue;const z=s*a[2]+v*b[2]+t*c[2],i=y*size+x;if(z<=depth[i])continue;depth[i]=z;
        const U=Math.max(0,Math.min(map.w-1,s*a[3]+v*b[3]+t*c[3])),V=Math.max(0,Math.min(map.h-1,s*a[4]+v*b[4]+t*c[4]));
        const ix=U|0,iy=V|0,fx=U-ix,fy=V-iy,j=(iy*map.w+ix)*4,jx=(iy*map.w+Math.min(ix+1,map.w-1))*4,jy=(Math.min(iy+1,map.h-1)*map.w+ix)*4,jxy=(Math.min(iy+1,map.h-1)*map.w+Math.min(ix+1,map.w-1))*4;
        const light=s*a[5]+v*b[5]+t*c[5],k=i*4;
        for(let ch=0;ch<3;ch++)out[k+ch]=((map.data[j+ch]*(1-fx)+map.data[jx+ch]*fx)*(1-fy)+(map.data[jy+ch]*(1-fx)+map.data[jxy+ch]*fx)*fy)*light;
        out[k+3]=255;
      }
    }
    for(let j=0;j<M;j++)for(let i=0;i<N;i++){const k=j*stride+i;tri(verts[k],verts[k+1],verts[k+stride]);tri(verts[k+1],verts[k+stride+1],verts[k+stride]);}
    wc.putImageData(pixels,0,0);const d=Math.min(w,h);ctx.drawImage(work,(w-d)/2,(h-d)/2,d,d);
  }
  function glow(ctx,x,y,r,color,alpha){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${color},${alpha})`);g.addColorStop(.35,`rgba(${color},${alpha*.42})`);g.addColorStop(1,`rgba(${color},0)`);ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);}
  // Dust and ion tails extend away from the illustrative light source; not a measured trajectory.
  function tails(ctx,id,w,h,yaw,pitch,zoom){const d=Math.min(w,h),cx=(w-d)/2+d*.62,cy=(h-d)/2+d*.56,r=d*.105*zoom;const ang=-2.55+Math.sin(yaw)*.22+pitch*.25;
    ctx.save();ctx.translate(cx,cy);ctx.rotate(ang);ctx.globalCompositeOperation='screen';
    for(let j=0;j<26;j++){const t=j/25;const length=id==='halebopp'?5.1:id==='halley'?4.3:3.6;const x=r*(.15+t*length),y=r*(.65*t*t);glow(ctx,x,y,r*(.33+t*.65),'210,188,144',(.36*(1-t)+.022));glow(ctx,x,-r*.78*t,r*(.13+t*.22),'96,155,225',(.29*(1-t)+.012));}
    // Deterministic filamentary dust, no random flicker from frame to frame.
    for(let j=0;j<250;j++){const t=((j*73)%251)/251,s=Math.sin(j*127.1)*Math.cos(j*33.8);const x=r*(.2+t*4.4),y=r*(.35*t*t+s*(.12+t*.48));ctx.fillStyle=`rgba(232,214,177,${.14*(1-t)})`;ctx.fillRect(x,y,Math.max(.65,d/700),Math.max(.65,d/700));}
    ctx.restore();glow(ctx,cx,cy,r*1.7,'170,192,213',.22);
  }
  function render(ctx,id,map,w,h,yaw=.22,pitch=-.18,zoom=1){
    if(!map)return;
    const d=Math.min(w,h),x=w/2,y=h/2-d*.01;
    if(comet(id))tails(ctx,id,w,h,yaw,pitch,zoom);
    if(id==='titan')glow(ctx,x,y,d*.36*zoom,'216,151,67',.55);
    if(id==='haumea'){ctx.save();ctx.translate(x,y);ctx.rotate(-.22);ctx.strokeStyle='rgba(209,198,179,.50)';ctx.lineWidth=Math.max(1,d*.008*zoom);ctx.beginPath();ctx.ellipse(0,0,d*.39*zoom,d*(.09+Math.abs(Math.sin(pitch))*.11)*zoom,0,Math.PI,TAU);ctx.stroke();ctx.restore();}
    solid(ctx,id,map,w,h,yaw,pitch,zoom);
    if(id==='haumea'){ctx.save();ctx.translate(x,y);ctx.rotate(-.22);ctx.strokeStyle='rgba(209,198,179,.65)';ctx.lineWidth=Math.max(1,d*.008*zoom);ctx.beginPath();ctx.ellipse(0,0,d*.39*zoom,d*(.09+Math.abs(Math.sin(pitch))*.11)*zoom,0,0,Math.PI);ctx.stroke();ctx.restore();}
  }
  return {load,render};
})();

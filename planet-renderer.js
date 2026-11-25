// Voliteľný GPU renderer. Lúč z kamery pretína 3D guľu a rovinu prstencov.
// Nepoužíva statický obrázok: pri každom pohybe sa prepočítajú normály a UV súradnice.
function vytvorGpuRenderer() {
  const povrch = document.createElement('canvas');
  let gl;
  try { gl = povrch.getContext('webgl', {alpha:true, premultipliedAlpha:false, preserveDrawingBuffer:true, antialias:false}); }
  catch (_) { return null; }
  if (!gl) return null;
  const vertex = `attribute vec2 position; void main(){gl_Position=vec4(position,0.,1.);}`;
  const fragment = `precision highp float;
    uniform sampler2D mapa; uniform vec2 rozmer; uniform float yaw,pitch,radius,ring,earth,roll,sun;
    uniform vec3 atmosfera;
    const float PI=3.14159265359;
    const vec3 baseL=vec3(-0.4608,0.3264,0.8256);
    float gauss(float x,float c,float w){float d=(x-c)/w;return exp(-d*d);}
    float ringProfile(float r){
      if(ring<1.5)return clamp(.13*gauss(r,1.63,.022)+.21*gauss(r,1.71,.014)+.18*gauss(r,1.78,.014)+.24*gauss(r,1.85,.017)+.55*gauss(r,1.98,.022),0.,1.);
      float band=r<1.52?.30:r<1.91?.93:r<2.00?.055:.70;
      return clamp(band*(.90+.065*sin(r*125.)+.035*sin(r*367.))*(1.-.83*gauss(r,2.17,.012)),0.,1.);
    }
    void main(){
      vec2 screen=(gl_FragCoord.xy/rozmer*2.-1.)/radius;
      float cr=cos(roll),sr=sin(roll);vec2 xy=vec2(cr*screen.x+sr*screen.y,-sr*screen.x+cr*screen.y);
      vec3 L=normalize(vec3(cr*baseL.x+sr*baseL.y,-sr*baseL.x+cr*baseL.y,baseL.z));float x=xy.x,y=xy.y;
      float d=length(xy),z=sqrt(max(0.,1.-dot(xy,xy))),a=clamp((1.-d)*rozmer.x*radius*.5+.5,0.,1.);
      float cp=cos(pitch),sp=sin(pitch),cy=cos(yaw),sy=sin(yaw),outer=ring>1.5?2.28:2.04,inner=ring>1.5?1.24:1.53;
      vec3 c=vec3(0.); vec3 n=vec3(x,y,z);
      if(a>0.){
        float py=clamp(cp*y-sp*z,-1.,1.),pz=sp*y+cp*z;
        vec2 uv=vec2(atan(cy*x+sy*pz,-sy*x+cy*pz)/(2.*PI)+.5,.5-asin(py)/PI);
        vec3 col=texture2D(mapa,uv).rgb;
        float light=max(0.,dot(n,L));float shade=sun>.5?.64+.36*z:.19+.81*pow(light,.62);
        if(ring>.5){float denom=cp*L.y-sp*L.z;if(abs(denom)>.001){float t=-(cp*y-sp*z)/denom;vec3 q=n+t*L;float rr=length(vec2(q.x,sp*q.y+cp*q.z));if(t>0.&&rr>inner&&rr<outer)shade*=1.-(ring>1.5?.46:.17)*ringProfile(rr);}}
        float rim=pow(1.-z,3.1)*(.10+.90*light);
        float spec=earth>.5&&col.b>col.g*1.18&&col.b>col.r*1.35?.04706*pow(max(0.,dot(n,vec3(L.x*.5,L.y*.5,.95))),26.):0.;
        c=col*shade+atmosfera*rim*.29+spec;
      }
      if(ring>.5&&abs(sp)>.025){float rz=cp*y/sp,rr=length(vec2(x,sp*y+cp*rz));if(rr>inner&&rr<outer&&(a==0.||rz>z)){
        float edge=clamp((rr-inner)/.025,0.,1.)*clamp((outer-rr)/.025,0.,1.);float ra=clamp(ringProfile(rr)*edge*(ring>1.5?1.:.69),0.,1.);vec3 q=vec3(x,y,rz);float k=dot(q,L);float shadow=k<0.&&dot(q,q)-k*k<1.?.36:1.;vec3 rc=(ring>1.5?(rr<1.52?vec3(172.,160.,145.):rr<1.91?vec3(232.,218.,190.):vec3(204.,192.,173.)):vec3(139.,151.,155.))*shadow/255.;float total=ra+a*(1.-ra);if(total>0.)c=(rc*ra+c*a*(1.-ra))/total;a=total;
      }}
      gl_FragColor=vec4(c,a);
    }`;
  try {
    function shader(type, text) { const s=gl.createShader(type);gl.shaderSource(s,text);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s; }
    const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return null;gl.useProgram(program);
    const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);const loc=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
    const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    const u={};for(const key of ['mapa','rozmer','yaw','pitch','radius','ring','earth','atmosfera','roll','sun'])u[key]=gl.getUniformLocation(program,key);
    let lastTexture=null;
    return { draw(ctx,size,texture,yaw,pitch,radius,ring,earth,atmosphere,roll,sun=false){
      if(gl.isContextLost())return false;
      if(povrch.width!==size||povrch.height!==size){povrch.width=size;povrch.height=size;gl.viewport(0,0,size,size);}
      if(lastTexture!==texture){gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,texture);if(gl.getError()!==gl.NO_ERROR)return false;lastTexture=texture;}
      gl.uniform1i(u.mapa,0);gl.uniform2f(u.rozmer,size,size);gl.uniform1f(u.yaw,yaw);gl.uniform1f(u.pitch,pitch);gl.uniform1f(u.radius,radius);gl.uniform1f(u.ring,ring);gl.uniform1f(u.earth,earth?1:0);gl.uniform3fv(u.atmosfera,atmosphere);gl.uniform1f(u.roll,roll);gl.uniform1f(u.sun,sun?1:0);
      gl.drawArrays(gl.TRIANGLE_STRIP,0,4);if(gl.getError()!==gl.NO_ERROR)return false;ctx.clearRect(0,0,size,size);ctx.drawImage(povrch,0,0);return true;
    }};
  } catch (_) { return null; }
}

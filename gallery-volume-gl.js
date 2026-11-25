/* WebGL2 gallery. Transparent 3D media are integrated along perspective rays.
   The galaxy and star passes batch all objects of each type in a single draw. */
const GalleryVolumeGL = (() => {
  const camera = [
    'uniform vec3 right, up, front;',
    'uniform vec2 halfFrame, shift, raster;',
    'uniform float distance;',
    'vec2 project(vec3 p) {',
    '  float perspective=distance/(distance-dot(p,front));',
    '  return vec2(dot(p,right),dot(p,up))*perspective/halfFrame+shift;',
    '}'
  ].join('\n');
  const ray = [
    '',
    'vec3 eyeRay() {',
    '  vec2 xy=((gl_FragCoord.xy/raster)*2.-1.-shift)*halfFrame;',
    '  return normalize(right*xy.x+up*xy.y-front*distance);',
    '}'
  ].join('\n');
  const fragmentHeader = '#version 300 es\nprecision highp float;\n' + camera + ray + '\nout vec4 pixel;\n';
  const fullVertex = '#version 300 es\nvoid main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.-1.,0.,1.);}';
  const tone = [
    'vec3 tone(vec3 linear){',
    '  vec3 c=max(linear,vec3(0.));',
    '  return pow(1.-exp(-c),vec3(.454545));',
    '}'
  ].join('\n');
  const skyFragment = fragmentHeader + [
    'uniform int object;',
    'void main(){',
    '  vec3 ray=eyeRay();',
    '  float haze=pow(max(0.,dot(ray,normalize(vec3(-.2,.1,-1.)))),7.);',
    '  vec3 color=object==3 ? vec3(.010,.009,.017) : vec3(.011,.016,.033);',
    '  pixel=vec4(vec3(.012,.016,.031)+color*haze,1.);',
    '}'
  ].join('\n');
  const starVertex = '#version 300 es\nprecision highp float;\n' + camera + [
    '',
    'layout(location=0) in vec4 position;',
    'layout(location=1) in vec4 tint;',
    'uniform float pixelRatio, zoom;',
    'out vec4 star;',
    'out float diffraction;',
    'void main(){',
    '  float z=dot(position.xyz,front);',
    '  float perspective=distance/max(1.,distance-z);',
    '  bool compactCluster=position.w<0.;',
    '  float radius=abs(position.w)*clamp(perspective,.60,1.55)*(compactCluster?pow(zoom,.67):1.);',
    '  diffraction=compactCluster?0.:smoothstep(1.35,3.9,radius)*tint.a;',
    '  star=vec4(tint.rgb,tint.a*min(1.,radius+.25));',
    '  gl_PointSize=max(2.,(radius*3.3+diffraction*(12.+radius*3.2))*pixelRatio);',
    '  gl_Position=distance-z>.30?vec4(project(position.xyz),0.,1.):vec4(3.,3.,0.,1.);',
    '}'
  ].join('\n');
  const starFragment = '#version 300 es\nprecision highp float;\nin vec4 star;\nin float diffraction;\nout vec4 pixel;\n' + tone + [
    '',
    'void main(){',
    '  vec2 p=gl_PointCoord*2.-1.;',
    '  float r=length(p);',
    '  float core=exp(-r*r*mix(4.3,126.,diffraction));',
    '  float aperture=exp(-r*mix(13.,36.,diffraction))*.40;',
    '  float spikes=0.;',
    '  for(int i=0;i<3;i++){',
    '    float a=.16+float(i)*1.0472;',
    '    vec2 axis=vec2(cos(a),sin(a));',
    '    spikes+=exp(-abs(dot(vec2(-axis.y,axis.x),p))*63.)*exp(-abs(dot(axis,p))*5.0);',
    '  }',
    '  float glow=(core+aperture+spikes*diffraction*.59)*star.a*(1.-smoothstep(.62,1.,r));',
    '  pixel=vec4(tone(star.rgb*glow*glow*1.55),0.);',
    '}'
  ].join('\n');
  const volumeFragment = fragmentHeader + tone + [
    '',
    'precision highp sampler3D;',
    'uniform sampler3D medium, grain;',
    'uniform vec3 bounds;',
    'uniform vec2 march;',
    'uniform int object, steps, detail;',
    'float dustGrain(vec3 p, float footprint){',
    '  float lod=max(0.,log2(max(.3,footprint*69.)));',
    '  vec3 flow=vec3(p.x+.29*p.y,p.y*.72+.16*p.z,p.z-.22*p.x);',
    '  float a=textureLod(grain,flow*1.82,lod).r;',
    '  if(detail<2) return a-.5;',
    '  float b=textureLod(grain,(flow+vec3(a*.047))*3.96+vec3(.20,.73,.14),max(0.,log2(footprint*190.))).r;',
    '  if(detail<3)return a*.59+b*.41-.5;',
    '  float c=textureLod(grain,flow*8.23+vec3(.49,.11,.84),max(0.,log2(footprint*420.))).r;',
    '  return a*.53+b*.36+c*.11-.5;',
    '}',
    'void main(){',
    '  vec3 ray=eyeRay(), origin=front*distance;',
    '  vec3 inverseRay=1./(sign(ray)*max(vec3(.00001),abs(ray))+vec3(equal(ray,vec3(0.)))*.00001);',
    '  vec3 lo=(-bounds-origin)*inverseRay, hi=(bounds-origin)*inverseRay;',
    '  vec3 a=min(lo,hi), b=max(lo,hi);',
    '  float entry=max(0.,max(a.x,max(a.y,a.z))), exit=min(b.x,min(b.y,b.z));',
    '  float segment=exit-entry;',
    '  if(segment<=0.) discard;',
    '  int count=clamp(int(ceil(segment*march.x)),16,steps);',
    '  float delta=segment/float(count);',
    '  float footprint=max(halfFrame.x/raster.x,halfFrame.y/raster.y)*2.;',
    '  float lod=max(0.,log2(footprint*march.y));',
    '  uvec2 px=uvec2(gl_FragCoord.xy);',
    '  uint key=(px.x*1664525u+px.y*2246822519u)^(px.x<<13);',
    '  key=(key^(key>>16))*2246822519u;',
    '  float jitter=.19+.62*float((key^(key>>13))&1023u)/1023.;',
    '  vec3 p=origin+(entry+jitter*delta)*ray, stride=ray*delta;',
    '  vec3 uvScale=.5/bounds;',
    '  vec3 lightVector=object==0?vec3(-.37,.84,-.4):vec3(.62,.68,-.39);',
    '  vec3 lightOffset=lightVector*.037*uvScale;',
    '  vec3 radiance=vec3(0.); float trans=1.;',
    '  for(int i=0;i<256;i++,p+=stride){',
    '    if(i>=count||trans<.009) break;',
    '    vec3 uv=p*uvScale+.5;',
    '    vec4 v=textureLod(medium,uv,lod);',
    '    v*=v;',
    '    if(v.x+v.y+v.z<.00016) continue;',
    '    float fine=detail==0 ? 0. : dustGrain(p,max(footprint,delta*.26));',
    '    float absorption; vec3 emission;',
    '    if(object==2){',
    '      absorption=v.x*(4.2+fine*5.1)+.15*v.y;',
    '      float contrast=max(.16,.7+fine*2.2);',
    '      vec3 older=vec3(1.77,1.04,.69)*v.z;',
    '      vec3 young=vec3(.24,.49,1.60)*v.y;',
    '      vec3 hydrogen=mix(vec3(1.52,.14,.095),vec3(1.90,.50,.19),smoothstep(.04,.48,v.a))*v.a;',
    '      emission=older*6.8+young*5.5*contrast+hydrogen*6.1*contrast;',
    '    } else {',
    '      float relief=.77;',
    '      float edge=0.;',
    '      if(detail>0){',
    '        float neighbor=textureLod(medium,uv+lightOffset,lod).x;',
    '        edge=v.x-neighbor*neighbor;',
    '        relief=clamp(.77+edge*5.6+fine*3.1,.10,1.65);',
    '      }',
    '      absorption=v.x*(16.4+fine*19.5);',
    '      float light=pow(v.a,1.35)*relief;',
    '      vec3 shadow=vec3(.016,.006,.006)+vec3(.037,.050,.082)*smoothstep(.0,.18,v.z);',
    '      vec3 dustTint=mix(vec3(.77,.155,.052),vec3(1.18,.64,.29),smoothstep(.38,1.25,light));',
    '      vec3 scattered=shadow+dustTint*light;',
    '      vec3 heated=vec3(1.57,.84,.32)*v.y*(.17+light*.71+max(edge,0.)*1.7);',
    '      vec3 hydrogen=vec3(.060,.33,1.09)*v.z;',
    '      emission=scattered*absorption+heated*3.25+hydrogen*1.92;',
    '    }',
    '    float tau=exp(-absorption*delta);',
    '    radiance+=trans*emission*(absorption>.01?(1.-tau)/absorption:delta);',
    '    trans*=tau;',
    '  }',
    '  float alpha=1.-trans;',
    '  // Bound the output alpha by emitted light as well as extinction for premultiplied blending.',
    '  vec3 light=tone(radiance);',
    '  pixel=vec4(light,max(alpha,max(light.r,max(light.g,light.b))*.85));',
    '}'
  ].join('\n');
  const galaxyVertex = '#version 300 es\nprecision highp float;\n' + camera + [
    '',
    'layout(location=0) in vec4 position;',
    'layout(location=1) in vec4 axisX;',
    'layout(location=2) in vec4 axisY;',
    'layout(location=3) in vec4 tint;',
    'flat out vec4 galaxy, ux, uy, hue;',
    'void main(){',
    '  const vec2 corners[6]=vec2[6](vec2(-1,-1),vec2(1,-1),vec2(-1,1),vec2(-1,1),vec2(1,-1),vec2(1,1));',
    '  float z=distance-dot(position.xyz,front);',
    '  float projected=position.w*distance/max(1.,z-position.w);',
    '  vec2 margin=vec2(projected)/halfFrame+2./raster;',
    '  gl_Position=z>position.w+.30?vec4(project(position.xyz)+corners[gl_VertexID]*margin,0.,1.):vec4(3.,3.,0.,1.);',
    '  galaxy=position; ux=axisX;uy=axisY;hue=tint;',
    '}'
  ].join('\n');
  const galaxyFragment = fragmentHeader + tone + [
    '',
    'flat in vec4 galaxy,ux,uy,hue;',
    'uniform int galaxySteps;',
    'float hash(vec3 p){p=fract(p*.3183099+vec3(.18,.43,.36));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}',
    'float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);',
    '  return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),',
    '    mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}',
    'void main(){',
    '  vec3 ray=eyeRay(), eye=front*distance-galaxy.xyz;',
    '  mat3 axes=mat3(ux.xyz,uy.xyz,cross(ux.xyz,uy.xyz));',
    '  vec3 ro=(eye*axes)/galaxy.w, rd=ray*axes;',
    '  float type=ux.w, seed=uy.w;',
    '  float minor=type==0. ? .78+seed*.16 : type==2. ? .82 : 1.;',
    '  float thickness=type==0. ? .68 : type==4. ? .066 : .39;',
    '  vec3 stretch=vec3(1.,minor,thickness);',
    '  vec3 o=ro/stretch, d=rd/stretch;',
    '  float a=dot(d,d),b=dot(o,d),c=dot(o,o)-1.;',
    '  float discriminant=b*b-a*c;',
    '  if (discriminant<=0.) discard;',
    '  float root=sqrt(discriminant), entry=(-b-root)/a;',
    '  float span=2.*root/a;',
    '  int count=clamp(int(ceil(galaxy.w*distance/length(eye)*raster.y/halfFrame.y*.16)),4,galaxySteps);',
    '  float delta=span/float(count);',
    '  vec3 p=ro+rd*(entry+.5*delta);',
    '  vec3 light=vec3(0.);float trans=1.;',
    '  for(int i=0;i<20;i++,p+=rd*delta){',
    '    if(i>=count)break;',
    '    vec3 q=p/stretch;',
    '    float r=length(q.xy), s=length(q);',
    '    float tip=1.-smoothstep(.73,1.,s);',
    '    float t=atan(p.y,p.x);',
    '    vec3 emit;float dust=0.;',
    '    if(type==4.){',
    '      float along=abs(atan(sin(t-seed*6.283),cos(t-seed*6.283)));',
    '      float bend=.74+.027*cos(t*5.+seed*16.)+.008*sin(t*19.+seed*7.);',
    '      float arc=exp(-pow((r-bend)/(.008+.009*seed),2.)-q.z*q.z*7.5)*(1.-smoothstep(.06,.30+seed*.10,along));',
    '      float beads=.26+.74*pow(noise(vec3(t*24.+seed*10.,8.,4.)),1.6);',
    '      emit=hue.rgb*arc*beads*32.;',
    '    }else if(type==0.){',
    '      float bulge=exp(-s*(8.1+seed*6.));',
    '      emit=hue.rgb*(bulge*6.3+.49*exp(-s*20.));',
    '    }else{',
    '      float n=noise(p*15.+vec3(seed*33.));',
    '      float band=exp(-abs(p.z)*(type==2.?14.:29.));',
    '      float phase=(type==3.?3.:2.)*t-5.3*log(.14+r)+seed*9.;',
    '      float ridge=.5+.5*cos(phase+.57*n);',
    '      float arms=pow(ridge,5.9);',
    '      float unequal=.67+.33*cos(t+seed*9.);',
    '      float disk=exp(-2.65*r)*band;',
    '      float bulge=exp(-13.2*length(p*vec3(type==3.?.72:1.,1.65,1.92)));',
    '      float high=noise(p*39.+vec3(14.,seed*37.,4.));',
    '      float clump=type==2.?pow(n,1.3)*(.30+high*1.65):arms*(.09+n*1.8)*unequal;',
    '      float knots=clump*smoothstep(.36,.82,high);',
    '      float lane=pow(.5+.5*cos(phase+.87),9.);',
    '      dust=band*disk*(.11+lane*n*4.2);',
    '      emit=hue.rgb*(bulge*8.9+disk*(.035+clump*.75+knots*5.8));',
    '      emit+=vec3(.18,.39,1.0)*clump*disk*.82;',
    '    }',
    '    light+=emit*tip*delta*trans;',
    '    trans*=exp(-dust*delta);',
    '  }',
    '  vec3 color=tone(light*hue.a);',
    '  pixel=vec4(color,0.);',
    '}'
  ].join('\n');

  function makeProgram(gl,vertex,fragment) {
    const shaders=[];
    const program=gl.createProgram();
    try {
      for(const [type,source] of [[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,fragment]]) {
        const shader=gl.createShader(type);
        shaders.push(shader);
        gl.shaderSource(shader,source);
        gl.compileShader(shader);
        if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(shader));
        gl.attachShader(program,shader);
      }
      gl.linkProgram(program);
      if(!gl.getProgramParameter(program,gl.LINK_STATUS)) throw Error(gl.getProgramInfoLog(program));
      const uniforms={};
      const count=gl.getProgramParameter(program,gl.ACTIVE_UNIFORMS);
      for(let i=0;i<count;i++){
        const {name}=gl.getActiveUniform(program,i);
        uniforms[name]=gl.getUniformLocation(program,name);
      }
      return {program,uniforms};
    } catch(error) {
      gl.deleteProgram(program);
      throw error;
    } finally {
      for(const shader of shaders)gl.deleteShader(shader);
    }
  }

  function instances(gl,data,attributeCount,divisor) {
    const vao=gl.createVertexArray(), buffer=gl.createBuffer();
    gl.bindVertexArray(vao);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
    const stride=attributeCount*16;
    for(let i=0;i<attributeCount;i++){
      gl.enableVertexAttribArray(i);
      gl.vertexAttribPointer(i,4,gl.FLOAT,false,stride,i*16);
      gl.vertexAttribDivisor(i,divisor);
    }
    return {vao,buffer,count:data.length/(attributeCount*4)};
  }

  function texture(gl, bytes, size, channels, repeat=false) {
    const t=gl.createTexture();
    gl.bindTexture(gl.TEXTURE_3D,t);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT,1);
    gl.texStorage3D(gl.TEXTURE_3D,1+Math.floor(Math.log2(Math.max(...size))),
      channels===1?gl.R8:gl.RGBA8,...size);
    gl.texSubImage3D(gl.TEXTURE_3D,0,0,0,0,...size,channels===1?gl.RED:gl.RGBA,gl.UNSIGNED_BYTE,bytes);
    for(const axis of [gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T,gl.TEXTURE_WRAP_R]){
      gl.texParameteri(gl.TEXTURE_3D,axis,repeat?gl.REPEAT:gl.CLAMP_TO_EDGE);
    }
    gl.texParameteri(gl.TEXTURE_3D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_3D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.generateMipmap(gl.TEXTURE_3D);
    const error=gl.getError();
    if(error!==gl.NO_ERROR){
      gl.deleteTexture(t);
      throw Error('Gallery 3D texture upload: '+error);
    }
    return t;
  }

  function buildGrain() {
    const size=64, bytes=new Uint8Array(size**3);
    const lattice=new Uint8Array(16**3);
    let seed=915;
    for(let i=0;i<lattice.length;i++){
      seed=(Math.imul(seed,1664525)+1013904223)>>>0;
      lattice[i]=seed>>>24;
    }
    const mix=(a,b,t)=>a+(b-a)*t;
    const ease=[0,.15625,.5,.84375];
    for(let z=0,p=0;z<size;z++)for(let y=0;y<size;y++)for(let x=0;x<size;x++){
      const i=x>>2,j=y>>2,k=z>>2, u=(i+1)&15,v=(j+1)&15,w=(k+1)&15;
      const a=ease[x&3],b=ease[y&3],c=ease[z&3];
      const i1=16*(j+16*k),i2=16*(v+16*k),i3=16*(j+16*w),i4=16*(v+16*w);
      bytes[p++]=mix(mix(mix(lattice[i1+i],lattice[i1+u],a),mix(lattice[i2+i],lattice[i2+u],a),b),
        mix(mix(lattice[i3+i],lattice[i3+u],a),mix(lattice[i4+i],lattice[i4+u],a),b),c);
    }
    return bytes;
  }

  function create(canvas) {
    const gl=canvas.getContext('webgl2',{alpha:false,antialias:false,depth:false,stencil:false,powerPreference:'high-performance'});
    if(!gl)return null;
    const ext=gl.getExtension('EXT_disjoint_timer_query_webgl2');
    const resources={sky:null,volume:null,stars:null,galaxies:null,vao:gl.createVertexArray(),grain:null};
    const empty=resources.vao;
    const renderLimits=gl.getParameter(gl.MAX_VIEWPORT_DIMS);
    const limit=Math.min(gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),...renderLimits);
    let stars, behind, galaxies, field, timed=null, lastGpuMs=null, bytes=0;

    function programFor(name,vertex,fragment) {
      return resources[name] ||= makeProgram(gl,vertex,fragment);
    }
    function release() {
      if(timed)gl.deleteQuery(timed);
      timed=null;lastGpuMs=null;bytes=0;
      for(const mesh of [stars,galaxies])if(mesh){
        gl.deleteVertexArray(mesh.vao);gl.deleteBuffer(mesh.buffer);
      }
      if(field)gl.deleteTexture(field);
      stars=null;galaxies=null;field=null;
      gl.bindVertexArray(null);
      gl.bindBuffer(gl.ARRAY_BUFFER,null);
      canvas.width=1;canvas.height=1;
    }
    function prepare(scene) {
      stars=instances(gl,scene.stars.data,2,0);
      behind=scene.stars.behind;
      if(scene.galaxies.length)galaxies=instances(gl,scene.galaxies,4,1);
      programFor('sky',fullVertex,skyFragment);
      programFor('stars',starVertex,starFragment);
      if(galaxies)programFor('galaxies',galaxyVertex,galaxyFragment);
      bytes=scene.stars.data.byteLength+scene.galaxies.byteLength;
    }
    function upload(scene, voxels) {
      programFor('volume',fullVertex,volumeFragment);
      if(!resources.grain)resources.grain=texture(gl,buildGrain(),[64,64,64],1,true);
      field=texture(gl,voxels,scene.volume.size,4);
      bytes+=Math.ceil((voxels.byteLength+64**3)*8/7);
    }
    function use(pass,view,width,height) {
      gl.useProgram(pass.program);
      const u=pass.uniforms;
      gl.uniform3fv(u.right,view.right);gl.uniform3fv(u.up,view.up);gl.uniform3fv(u.front,view.front);
      gl.uniform2f(u.halfFrame,view.halfX,view.halfY);
      gl.uniform2f(u.shift,view.shiftX,view.shiftY);
      gl.uniform2f(u.raster,width,height);gl.uniform1f(u.distance,view.distance);
      return u;
    }
    function draw(scene,view,profile,moving,pixelRatio,measure) {
      const width=canvas.width,height=canvas.height;
      const sample=ext&&measure;
      if(timed&&gl.getQueryParameter(timed,gl.QUERY_RESULT_AVAILABLE)){
        if(!gl.getParameter(ext.GPU_DISJOINT_EXT))lastGpuMs=gl.getQueryParameter(timed,gl.QUERY_RESULT)/1e6;
        gl.deleteQuery(timed);
        timed=null;
      }
      const query=sample&&!timed ? gl.createQuery() : null;
      if(query)gl.beginQuery(ext.TIME_ELAPSED_EXT,query);
      gl.viewport(0,0,width,height);
      gl.disable(gl.BLEND);
      gl.bindVertexArray(empty);
      let u=use(resources.sky,view,width,height);
      gl.uniform1i(u.object,scene.object);
      gl.drawArrays(gl.TRIANGLES,0,3);
      gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE);
      u=use(resources.stars,view,width,height);
      gl.uniform1f(u.pixelRatio,pixelRatio);
      gl.uniform1f(u.zoom,view.zoom);
      gl.bindVertexArray(stars.vao);
      gl.drawArrays(gl.POINTS,0,field?behind:stars.count);
      if(galaxies) {
        u=use(resources.galaxies,view,width,height);
        gl.uniform1i(u.galaxySteps,profile.galaxySteps);
        gl.bindVertexArray(galaxies.vao);
        gl.drawArraysInstanced(gl.TRIANGLES,0,6,galaxies.count);
      }
      if(field) {
        gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
        u=use(resources.volume,view,width,height);
        gl.bindVertexArray(empty);
        gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_3D,field);gl.uniform1i(u.medium,0);
        gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_3D,resources.grain);gl.uniform1i(u.grain,1);
        gl.uniform3fv(u.bounds,scene.volume.extent);
        gl.uniform1i(u.object,scene.object);
        const steps=moving?profile.motionSteps:profile.steps;
        gl.uniform1i(u.steps,steps);gl.uniform1i(u.detail,moving?profile.motionDetail:profile.detail);
        gl.uniform2f(u.march,steps/scene.volume.rayLength,scene.volume.samplesPerUnit*.77);
        gl.drawArrays(gl.TRIANGLES,0,3);
        gl.blendFunc(gl.ONE,gl.ONE);
        u=use(resources.stars,view,width,height);
        gl.uniform1f(u.pixelRatio,pixelRatio);
        gl.uniform1f(u.zoom,view.zoom);
        gl.bindVertexArray(stars.vao);
        gl.drawArrays(gl.POINTS,behind,stars.count-behind);
      }
      if(query){
        gl.endQuery(ext.TIME_ELAPSED_EXT);
        timed=query;
      }
      return {gpuMs:lastGpuMs,bytes,draws:2+Number(!!galaxies)+2*Number(!!field)};
    }
    return {limit,prepare,upload,draw,release};
  }
  return {create};
})();

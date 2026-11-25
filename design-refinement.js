// Progressive visual enhancements. The original translated text and 3D modules are not changed.
(() => {
  'use strict';
  const root=document.documentElement, header=document.querySelector('.site-header');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const motion=()=>root.classList.contains('motion-enabled')&&!reduced.matches&&!document.hidden&&!document.querySelector('dialog[open]');
  const sections=[...document.querySelectorAll('main > section[id]')];
  const links=[...document.querySelectorAll('#site-navigation a[href^="#"]')];
  let navFrame=0;
  function updateNav(){
    navFrame=0;const h=header.getBoundingClientRect().height;
    root.style.setProperty('--header-offset',`${Math.ceil(h+14)}px`);
    const threshold=h+Math.min(130,innerHeight*.18);
    let current=sections[0];for(const s of sections)if(s.getBoundingClientRect().top<=threshold)current=s;
    if(scrollY>0&&scrollY+innerHeight>=document.documentElement.scrollHeight-4)current=sections.at(-1);
    for(const a of links){if(a.hash==='#'+current.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');}
    header.style.setProperty('--reading-progress',Math.min(1,Math.max(0,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight))));
  }
  function scheduleNav(){if(!navFrame)navFrame=requestAnimationFrame(updateNav);}
  addEventListener('scroll',scheduleNav,{passive:true});addEventListener('resize',scheduleNav,{passive:true});
  // Explicit in-page navigation keeps the sticky-header offset consistent after closing mobile menu.
  for(const link of links)link.addEventListener('click',e=>{if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const target=document.getElementById(link.hash.slice(1));if(!target)return;e.preventDefault();updateNav();try{if(location.hash!==link.hash)history.pushState(null,'',link.hash);}catch{}target.scrollIntoView({block:'start',behavior:motion()?'smooth':'instant'});scheduleNav();});
  document.addEventListener('vesmir:language',scheduleNav);if('ResizeObserver'in window)new ResizeObserver(scheduleNav).observe(header);updateNav();
  if(!('IntersectionObserver'in window))return;
  const playing=new Set(), seen=new WeakSet(), counts=new Map();let countFrame=0;
  const revealTargets=[...document.querySelectorAll('.hero-copy > h1,.hero-description,.hero-actions,.hero-art,main .section h2,.section-description,.solar-overview > .info-card,.planet-grid > .planet-card,.planet-detail,.fact-box,.table-scroll,.gallery-item,.mission-quiz,.about-stats > div,.about-subtitle,.about-card,.about-tech,.about-implementation > article,.author-card')];
  const reveal=new IntersectionObserver(entries=>{
    let i=0;for(const e of entries){const el=e.target;
      if(!e.isIntersecting){if(seen.has(el)){el.classList.remove('premium-enter','premium-chart-enter');playing.delete(el);reveal.unobserve(el);}continue;}
      if(seen.has(el))continue;seen.add(el);if(!motion()){reveal.unobserve(el);continue;}
      el.style.setProperty('--reveal-delay',`${Math.min(i++,4)*55}ms`);el.classList.add('premium-enter');playing.add(el);
      if(el.matches('.table-scroll'))el.classList.add('premium-chart-enter');
      const done=ev=>{if(ev.target!==el||ev.animationName!=='premium-arrive')return;el.removeEventListener('animationend',done);el.classList.remove('premium-enter');if(!el.matches('.table-scroll')){playing.delete(el);reveal.unobserve(el);}};
      el.addEventListener('animationend',done);
      if(el.matches('.table-scroll')){const chartDone=ev=>{if(ev.animationName!=='premium-bar')return;el.removeEventListener('animationend',chartDone);el.classList.remove('premium-chart-enter');playing.delete(el);reveal.unobserve(el);};el.addEventListener('animationend',chartDone);}
    }
  },{threshold:0.08});revealTargets.forEach(el=>reveal.observe(el));
  // Animate a visual, aria-hidden overlay. Exact original text remains in the DOM, preserving
  // translation references, accessibility, original precision and units even if interrupted.
  const targets=[...document.querySelectorAll('.about-stats strong,.diameter-value,.distance-value,#sun-detail .planet-facts dd,#detail-diameter,#detail-distance,#detail-year,.solar-stat')];
  function parse(text){const m=text.match(/^([+−-]?\d[\d \u00a0\u202f]*(?:[.,]\d+)?)(.*)$/u);if(!m||/\d/.test(m[2]))return null;
    const raw=m[1].trimEnd(), decimal=raw.match(/[.,](\d+)$/), sep=decimal?.[0][0]||'.';const n=Number(raw.replace(/[ \u00a0\u202f]/g,'').replace('−','-').replace(',','.'));
    if(!Number.isFinite(n)||n<=0)return null;return {n,dp:decimal?.[1].length||0,sep,group:raw.match(/[ \u00a0\u202f]/)?.[0]||'',suffix:text.slice(raw.length),plus:raw.startsWith('+')};}
  function format(v,p){let [a,b]=v.toFixed(p.dp).split('.');if(p.group)a=a.replace(/\B(?=(\d{3})+(?!\d))/g,p.group);return (p.plus?'+':'')+a+(b?p.sep+b:'')+p.suffix;}
  function finish(el){const s=counts.get(el);if(!s)return;s.overlay.remove();el.classList.remove('counting');el.style.removeProperty('--count-ink');counts.delete(el);}
  function tick(now){countFrame=0;for(const [el,s] of counts){if(!motion()||!el.isConnected||el.firstChild!==s.original||s.original.textContent!==s.text||el.getBoundingClientRect().bottom<0||el.getBoundingClientRect().top>innerHeight){finish(el);continue;}const p=Math.min(1,(now-s.start)/850);if(p>=1){finish(el);continue;}s.overlay.textContent=format(s.parsed.n*(1-Math.pow(1-p,3)),s.parsed);}
    if(counts.size)countFrame=requestAnimationFrame(tick);
  }
  const numeric=new IntersectionObserver(entries=>{for(const e of entries){if(!e.isIntersecting)continue;numeric.unobserve(e.target);const el=e.target;if(!motion()||el.childNodes.length!==1||el.firstChild.nodeType!==Node.TEXT_NODE)continue;const text=el.textContent,parsed=parse(text);if(!parsed)continue;const overlay=document.createElement('span');overlay.className='count-visual';overlay.setAttribute('aria-hidden','true');overlay.textContent=format(0,parsed);el.style.setProperty('--count-ink',getComputedStyle(el).color);counts.set(el,{overlay,original:el.firstChild,text,parsed,start:performance.now()});el.append(overlay);el.classList.add('counting');}if(counts.size&&!countFrame)countFrame=requestAnimationFrame(tick);},{threshold:.35});targets.forEach(el=>numeric.observe(el));
  function stop(){for(const el of counts.keys())finish(el);if(countFrame)cancelAnimationFrame(countFrame);countFrame=0;for(const el of playing){el.classList.remove('premium-enter','premium-chart-enter');reveal.unobserve(el);}playing.clear();document.querySelectorAll('.premium-chart-enter').forEach(el=>el.classList.remove('premium-chart-enter'));}
  document.addEventListener('focusin',e=>{for(const el of playing)if(el.contains(e.target)){el.classList.remove('premium-enter','premium-chart-enter');playing.delete(el);reveal.unobserve(el);}});
  document.addEventListener('vesmir:language',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});reduced.addEventListener('change',stop);
  new MutationObserver(()=>{if(!motion())stop();}).observe(root,{attributes:true,attributeFilter:['class','data-theme']});
  for(const dialog of document.querySelectorAll('dialog'))new MutationObserver(()=>{if(dialog.open)stop();}).observe(dialog,{attributes:true,attributeFilter:['open']});
})();

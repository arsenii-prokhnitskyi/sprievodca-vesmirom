// Voliteľné vizuálne efekty. Bez tohto súboru zostáva pôvodná stránka použiteľná.
(() => {
  const koren = document.documentElement;
  const hero = document.querySelector('.hero');
  const art = document.querySelector('.hero-art');
  const tlacidlo = document.getElementById('motion-toggle');
  const obmedzenyPohyb = matchMedia('(prefers-reduced-motion: reduce)');
  let pozastavene = false;
  let heroViditelne = true;
  const kratkeAnimacie = new Set();
  const pohybPovoleny = () => !pozastavene && !obmedzenyPohyb.matches;

  // Osem planét v správnom poradí. Model je zámerne schematický, nie simulácia fyziky.
  const model = document.createElement('div');
  model.className = 'orbit-model';
  model.setAttribute('role', 'group');
  const objekty = new Map();
  function vytvorTeleso(id, nazov, trieda) {
    const button = document.createElement('button');
    button.type = 'button'; button.className = `orbit-target ${trieda}`;
    button.dataset.object = id;
    const image = document.createElement('img');
    image.src = `assets/${id}-detail.webp`; image.dataset.planetPreview = id;
    image.alt = ''; image.width = image.height = 400;
    const label = document.createElement('span'); label.className = 'orbit-tooltip';
    label.setAttribute('aria-hidden','true');
    button.append(image, label); objekty.set(id, {button,label,nazov});
    button.addEventListener('click', () => otvorTeleso(id));
    button.addEventListener('pointerdown', () => model.classList.add('orbit-pressed'));
    return button;
  }
  const slnko = vytvorTeleso('slnko', 'Slnko', 'orbit-sun');
  model.append(slnko);
  const drahy = [
    ['merkur', 19, 3.3, 9, 30], ['venusa', 29, 4.7, 14, 145],
    ['zem', 39, 5.3, 20, 260], ['mars', 49, 4, 27, 65],
    ['jupiter', 60, 9, 38, 200], ['saturn', 71, 11, 49, 325],
    ['uran', 81, 6.3, 62, 115], ['neptun', 91, 6.2, 76, 235]
  ];
  drahy.forEach(([id, priemer, velkost, rychlost, faza]) => {
    const kruh = document.createElement('div'); kruh.className = 'orbit-ring';
    kruh.style.setProperty('--orbit-size', `${priemer}%`);
    kruh.style.setProperty('--planet-size', `${velkost / priemer * 100}%`);
    kruh.style.setProperty('--orbit-time', `${rychlost}s`);
    kruh.style.setProperty('--phase', `${faza}deg`);
    const button = vytvorTeleso(id, planety[id].nazov, 'orbit-planet-button');
    kruh.append(button); model.append(kruh);
  });
  for (const event of ['pointerup','pointercancel','blur']) window.addEventListener(event, () => model.classList.remove('orbit-pressed'));
  // Alternatívny výber pre veľmi malé obrazovky a klávesnicu.
  const vyber = document.createElement('details'); vyber.className = 'orbit-picker';
  const vyberTitle = document.createElement('summary'); vyber.append(vyberTitle);
  const zoznam = document.createElement('div'); vyber.append(zoznam);
  for (const [id, objekt] of objekty) {
    const b = document.createElement('button'); b.type = 'button';
    b.addEventListener('click', () => { vyber.open = false; otvorTeleso(id); });
    objekt.alternativa = b; zoznam.append(b);
  }
  const nadpis = document.createElement('p');
  nadpis.className = 'orbit-heading';
  const info = document.createElement('details');
  info.className = 'orbit-info';
  const ikona = document.createElement('summary');
  ikona.textContent = 'ⓘ';
  const poznamka = document.createElement('p');
  info.append(ikona, poznamka);
  art.append(nadpis, model, info, vyber);
  art.querySelector(':scope > img').hidden = true;
  tlacidlo.hidden = false;

  function aktualizujTexty() {
    nadpis.textContent = t('Vyber teleso priamo v modeli.');
    vyberTitle.textContent = t('Vybrať objekt');
    for (const objekt of objekty.values()) {
      const meno = t(objekt.nazov); objekt.label.textContent = meno; objekt.alternativa.textContent = meno;
      objekt.button.setAttribute('aria-label', t('Zobraziť detail: {name}', {name: meno}));
    }
    ikona.setAttribute('aria-label', t('Informácia o mierke modelu'));
    ikona.title = t('Informácia o mierke modelu');
    poznamka.textContent = t('Schematický model: veľkosti, vzdialenosti a rýchlosti nie sú v mierke.');
    model.setAttribute('aria-label', t('Model Slnka a ôsmich planét na obežných dráhach'));
    tlacidlo.textContent = t(obmedzenyPohyb.matches ? 'Obmedzenie pohybu je zapnuté v nastaveniach zariadenia.' : pozastavene ? 'Spustiť animácie' : 'Pozastaviť animácie');
    tlacidlo.disabled = obmedzenyPohyb.matches;
    tlacidlo.setAttribute('aria-pressed', String(!pohybPovoleny()));
  }

  // Pohyb obežných dráh je nezávislý od celostránkového pozadia.
  function aktualizujSnimky() {
    const bezi = pohybPovoleny() && heroViditelne && !document.hidden;
    model.classList.toggle('orbit-offscreen', !bezi);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([vstup]) => {
      heroViditelne = vstup.isIntersecting;
      aktualizujSnimky();
    }).observe(hero);

  }
  // Krátke prechody dynamických textov, bez zmeny stavu alebo výmeny uzlov DOM.
  function jemnyPrechod(prvok) {
    if (!pohybPovoleny() || !prvok || !prvok.animate) return;
    for (const animacia of kratkeAnimacie) if (animacia.effect.target === prvok) animacia.cancel();
    const animacia = prvok.animate([{ opacity: .72, transform: 'translateY(3px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 220, easing: 'ease-out' });
    kratkeAnimacie.add(animacia);
    animacia.finished.catch(() => {}).finally(() => kratkeAnimacie.delete(animacia));
  }
  document.addEventListener('vesmir:fact', () => {
    jemnyPrechod(document.querySelector('.fact-content'));
    jemnyPrechod(document.getElementById('fact-image'));
  });
  document.addEventListener('vesmir:question', () => jemnyPrechod(document.getElementById('quiz-question')));
  document.addEventListener('vesmir:language', () => {
    aktualizujTexty();
    jemnyPrechod(document.querySelector('.hero-copy h1'));
    if (!document.getElementById('quiz-play').hidden) jemnyPrechod(document.getElementById('quiz-question'));
  });
  document.querySelectorAll('.planet-card').forEach(karta => karta.addEventListener('click', () => jemnyPrechod(document.getElementById('detail-img'))));
  function nastavPohyb() {
    koren.classList.toggle('motion-enabled', pohybPovoleny());
    if (!pohybPovoleny()) {
      for (const animacia of kratkeAnimacie) animacia.cancel();
      document.querySelectorAll('.reveal-in').forEach(prvok => prvok.classList.remove('reveal-in'));
    }
    aktualizujTexty(); aktualizujSnimky();
  }
  tlacidlo.addEventListener('click', () => { pozastavene = !pozastavene; nastavPohyb(); });
  obmedzenyPohyb.addEventListener('change', nastavPohyb);
  document.addEventListener('visibilitychange', nastavPohyb);
  window.addEventListener('focus', nastavPohyb);
  nastavPohyb();
})();

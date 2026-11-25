// Sprievodca vesmírom — jednoduchý JavaScript bez externých knižníc.

// Jazyk: pôvodné texty uložíme raz, aby prepínanie zachovalo HTML aj udalosti.
let aktualnyJazyk = "sk";
try {
  const ulozeny = localStorage.getItem("vesmir-jazyk");
  if (["sk", "en", "uk"].includes(ulozeny)) aktualnyJazyk = ulozeny;
} catch (error) { /* Úložisko nemusí byť dostupné. */ }

function t(text, hodnoty = {}) {
  const preklad = preklady[text]?.[aktualnyJazyk] ?? text;
  return preklad.replace(/\{(\w+)\}/g, (cela, kluc) => hodnoty[kluc] ?? cela);
}

const statickeTexty = [];
const statickeAtributy = [];
const strom = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
while (strom.nextNode()) {
  const uzol = strom.currentNode;
  const text = uzol.textContent.trim();
  if (!uzol.parentElement.closest("script, style") && Object.hasOwn(preklady, text)) {
    statickeTexty.push({ uzol, text, povodny: uzol.textContent });
  }
}
document.querySelectorAll("[alt], [aria-label], [title], meta[name='description']").forEach((prvok) => {
  for (const atribut of ["alt", "aria-label", "title", "content"]) {
    const text = prvok.getAttribute(atribut);
    if (text && Object.hasOwn(preklady, text)) statickeAtributy.push({ prvok, atribut, text });
  }
});

function prelozStatickyObsah() {
  document.documentElement.lang = aktualnyJazyk;
  statickeTexty.forEach(({ uzol, text, povodny }) => {
    uzol.textContent = povodny.replace(text, () => t(text));
  });
  statickeAtributy.forEach(({ prvok, atribut, text }) => prvok.setAttribute(atribut, t(text)));
}

// 0. Tmavý a svetlý režim: voľba sa uchová vo webovom úložisku.
// Pri zablokovanom úložisku sa prepínanie stále dá používať počas návštevy.
const prepinacTemy = document.getElementById("theme-toggle");
const ikonaTemy = prepinacTemy.querySelector(".theme-toggle-icon");
const popisTemy = prepinacTemy.querySelector(".theme-toggle-text");

function aktualizujPrepinacTemy() {
  const svetlaTema = document.documentElement.dataset.theme === "light";
  const oznacenie = t(svetlaTema ? "Zapnúť tmavý režim" : "Zapnúť svetlý režim");
  prepinacTemy.setAttribute("aria-label", oznacenie);
  prepinacTemy.title = oznacenie;
  ikonaTemy.textContent = svetlaTema ? "☾" : "☀";
  popisTemy.textContent = t(svetlaTema ? "Tmavý režim" : "Svetlý režim");
}
prepinacTemy.addEventListener("click", () => {
  const dalsiaTema = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = dalsiaTema;
  try {
    localStorage.setItem("vesmir-farebny-rezim", dalsiaTema);
  } catch (error) {
    // Stránka funguje aj v súkromnom režime s blokovaným localStorage.
  }
  aktualizujPrepinacTemy();
});
aktualizujPrepinacTemy();

// 1. Planéty: približné údaje podľa NASA Science a NASA/JPL.
// Priemery sú rovníkové; pri obroch je teplota uvedená pri tlaku približne 1 bar.
const planety = {
  merkur: {
    nazov: "Merkúr",
    poradie: "1.",
    typ: "Kamenná planéta",
    priemer: "4 880 km",
    vzdialenost: "57,9 mil. km",
    rok: "88 dní",
    teplota: "+167 °C",
    opis: "Merkúr je najmenšia planéta Slnečnej sústavy a je najbližšie k Slnku. Jeho kamenistý povrch je pokrytý krátermi.",
    zaujimavost: "Cez deň môže teplota vystúpiť približne na 430 °C a v noci klesnúť až na −180 °C."
  },
  venusa: {
    nazov: "Venuša",
    poradie: "2.",
    typ: "Kamenná planéta",
    priemer: "12 104 km",
    vzdialenost: "108,2 mil. km",
    rok: "224,7 dňa",
    teplota: "+464 °C",
    opis: "Venuša má hustú atmosféru, ktorú tvorí najmä oxid uhličitý. Silný skleníkový efekt zohrieva jej povrch.",
    zaujimavost: "Venuša je najhorúcejšia planéta Slnečnej sústavy."
  },
  zem: {
    nazov: "Zem",
    poradie: "3.",
    typ: "Kamenná planéta",
    priemer: "12 756 km",
    vzdialenost: "149,6 mil. km",
    rok: "365,25 dňa",
    teplota: "+15 °C",
    opis: "Zem je naša domovská planéta a jediné známe miesto s potvrdeným životom. Má atmosféru a oceány.",
    zaujimavost: "Voda pokrýva približne 71 % povrchu Zeme."
  },
  mars: {
    nazov: "Mars",
    poradie: "4.",
    typ: "Kamenná planéta",
    priemer: "6 792 km",
    vzdialenost: "228 mil. km",
    rok: "687 dní",
    teplota: "−65 °C",
    opis: "Mars je chladná kamenná planéta s riedkou atmosférou. Jeho červenkastý povrch obsahuje oxidy železa.",
    zaujimavost: "Na Marse sa nachádza Olympus Mons, najväčšia známa sopka Slnečnej sústavy."
  },
  jupiter: {
    nazov: "Jupiter",
    poradie: "5.",
    typ: "Plynný obor",
    priemer: "142 984 km",
    vzdialenost: "778,5 mil. km",
    rok: "11,86 roka",
    teplota: "−110 °C",
    opis: "Jupiter je najväčšia planéta Slnečnej sústavy. Tvoria ho predovšetkým vodík a hélium.",
    zaujimavost: "Veľká červená škvrna na Jupiteri je obrovská búrka, ktorú astronómovia pozorujú už viac než sto rokov."
  },
  saturn: {
    nazov: "Saturn",
    poradie: "6.",
    typ: "Plynný obor",
    priemer: "120 536 km",
    vzdialenost: "1 432 mil. km",
    rok: "29,45 roka",
    teplota: "−140 °C",
    opis: "Saturn je druhá najväčšia planéta a plynný obor. Je známy svojimi výraznými prstencami.",
    zaujimavost: "Saturnove prstence tvoria najmä kúsky ľadu, hornín a prach."
  },
  uran: {
    nazov: "Urán",
    poradie: "7.",
    typ: "Ľadový obor",
    priemer: "51 118 km",
    vzdialenost: "2 867 mil. km",
    rok: "84 rokov",
    teplota: "−195 °C",
    opis: "Urán má modrozelenú farbu vďaka metánu v atmosfére. Je to jeden z dvoch ľadových obrov.",
    zaujimavost: "Os otáčania Uránu je naklonená približne o 98°, preto sa otáča takmer na boku."
  },
  neptun: {
    nazov: "Neptún",
    poradie: "8.",
    typ: "Ľadový obor",
    priemer: "49 528 km",
    vzdialenost: "4 500 mil. km",
    rok: "164,8 roka",
    teplota: "−200 °C",
    opis: "Neptún je najvzdialenejšia planéta od Slnka. Je to studený ľadový obor s modrastou atmosférou.",
    zaujimavost: "Vetry na Neptúne môžu dosiahnuť rýchlosť viac než 2 000 km/h."
  }
};

const slnkoData = { nazov: "Slnko" };
let vybranaPlaneta = "zem";
const detailPlanety = document.getElementById("planet-detail");
const detailSlnka = document.getElementById("sun-detail");
const spolocnyModel = detailPlanety.querySelector(".detail-image");
const slotSlnka = detailSlnka.querySelector(".sun-viewer-slot");
const statickeSlnko = document.getElementById("sun-static");
const tlacidlaPlanet = document.querySelectorAll(".planet-card");

function vyberPlanetu(id) {
  if (id !== "slnko" && !Object.hasOwn(planety, id)) return;
  vybranaPlaneta = id;
  const jeSlnko = id === "slnko";
  if (jeSlnko) {
    if (spolocnyModel.parentElement !== slotSlnka) slotSlnka.append(spolocnyModel);
    statickeSlnko.hidden = true;
    detailPlanety.hidden = true;
    detailSlnka.hidden = false;
    const obrazok = document.getElementById("detail-img");
    obrazok.src = "assets/slnko-detail.webp";
    obrazok.alt = t("Ilustrácia Slnka");
    tlacidlaPlanet.forEach(karta => { karta.classList.remove("active"); karta.setAttribute("aria-pressed", "false"); });
    document.dispatchEvent(new CustomEvent("vesmir:planet", { detail: id }));
    return;
  }
  if (spolocnyModel.parentElement !== detailPlanety) detailPlanety.prepend(spolocnyModel);
  detailSlnka.hidden = true;
  detailPlanety.hidden = false;
  const planeta = planety[id];
  const polia = {
    "detail-name": planeta.nazov, "detail-text": planeta.opis,
    "detail-order": planeta.poradie, "detail-type": planeta.typ,
    "detail-diameter": planeta.priemer, "detail-distance": planeta.vzdialenost,
    "detail-year": planeta.rok, "detail-temperature": planeta.teplota,
    "detail-fact": planeta.zaujimavost
  };
  Object.entries(polia).forEach(([idPola, hodnota]) => {
    document.getElementById(idPola).textContent = t(hodnota);
  });
  const obrazok = document.getElementById("detail-img");
  obrazok.src = `assets/${id}-detail.webp`;
  obrazok.alt = t("Ilustrácia planéty {name}", { name: t(planeta.nazov) });
  tlacidlaPlanet.forEach((karta) => {
    const vybrana = karta.dataset.planet === id;
    karta.classList.toggle("active", vybrana);
    karta.setAttribute("aria-pressed", String(vybrana));
  });
  document.dispatchEvent(new CustomEvent("vesmir:planet", { detail: id }));
}
tlacidlaPlanet.forEach((karta) => {
  karta.addEventListener("click", () => vyberPlanetu(karta.dataset.planet));
});

// Odkazy z obežného modelu a prehľadu: výber, fokus a plynulý presun k detailu.
function otvorTeleso(id) {
  vyberPlanetu(id);
  const detail = id === "slnko" ? detailSlnka : detailPlanety;
  detail.querySelector("h3").focus({ preventScroll: true });
  const pohyb = document.documentElement.classList.contains("motion-enabled") && !matchMedia("(prefers-reduced-motion: reduce)").matches;
  detail.scrollIntoView({ behavior: pohyb ? "smooth" : "instant", block: "start" });
}
document.querySelectorAll("[data-open-object]").forEach(odkaz => odkaz.addEventListener("click", event => {
  event.preventDefault(); otvorTeleso(odkaz.dataset.openObject);
}));
// Pri načítaní zosúladíme detail, obrázok a aktívnu kartu s údajmi.
vyberPlanetu("zem");

// 2. Zachovaný generátor zaujímavostí (bez okamžitého opakovania).
const zaujimavosti = [
  "Na Venuši je vyššia priemerná povrchová teplota než na Merkúre, hoci je ďalej od Slnka.",
  "Svetlo zo Slnka sa k Zemi dostane približne za 8 minút a 20 sekúnd.",
  "Jupiter je väčší než všetky ostatné planéty Slnečnej sústavy.",
  "Na Marse sa nachádza Olympus Mons, jedna z najväčších známych sopiek Slnečnej sústavy.",
  "Mesiac je prirodzený satelit Zeme.",
  "Prstence nemá iba Saturn – majú ich aj Jupiter, Urán a Neptún.",
  "Povrch Zeme má rozlohu približne 510 miliónov km². Voda (H₂O) pokrýva asi 71 % jej povrchu.",
  "Merkúr obehne Slnko približne za 88 pozemských dní.",
  "Rok na Marse trvá približne 687 pozemských dní.",
  "Neptún potrebuje na jeden obeh okolo Slnka približne 165 pozemských rokov.",
  "Modrozelenú farbu Uránu spôsobuje najmä metán v jeho atmosfére.",
  "Saturn obehne Slnko približne za 29,5 pozemského roka."
];
const ilustracieFaktov = [
  [
    "venusa",
    "Venuša",
    "Najhorúcejšia planéta"
  ],
  [
    "zem",
    "Zem",
    "Cesta slnečného svetla"
  ],
  [
    "jupiter",
    "Jupiter",
    "Obor Slnečnej sústavy"
  ],
  [
    "mars",
    "Mars",
    "Obrovská sopka"
  ],
  [
    "zem",
    "Zem",
    "Náš prirodzený satelit"
  ],
  [
    "saturn",
    "Saturn",
    "Svet prstencov"
  ],
  [
    "zem",
    "Zem",
    "Modrá planéta"
  ],
  [
    "merkur",
    "Merkúr",
    "Krátky rok"
  ],
  [
    "mars",
    "Mars",
    "Dlhý marťanský rok"
  ],
  [
    "neptun",
    "Neptún",
    "Dlhá cesta okolo Slnka"
  ],
  [
    "uran",
    "Urán",
    "Ľadový obor"
  ],
  [
    "saturn",
    "Saturn",
    "Takmer tri desaťročia"
  ]
];
let poslednyFakt = 0;
const objaveneFakty = new Set([0]);
const historiaFaktov = [0];
const predchadzajuciFakt = document.getElementById("prev-fact");
predchadzajuciFakt.hidden = false;
function zobrazFakt(animovat = false) {
  const [id, kategoria, nadpis] = ilustracieFaktov[poslednyFakt];
  const obrazok = document.getElementById("fact-image");
  const karta = document.querySelector(`.planet-card[data-planet="${id}"] img`);
  obrazok.dataset.planetPreview = id;
  obrazok.src = karta.getAttribute("src");
  if (karta.dataset.texture) obrazok.dataset.texture = karta.dataset.texture;
  else delete obrazok.dataset.texture;
  document.getElementById("fact-category").textContent = t(kategoria);
  document.getElementById("fact-title").textContent = t(nadpis);
  // Zachovávame aj sémantické horné a dolné indexy z pôvodného textu.
  const textFaktu = document.getElementById("random-fact");
  const text = t(zaujimavosti[poslednyFakt]);
  textFaktu.replaceChildren();
  text.split(/([²₂])/).forEach(cast => {
    if (cast === "²" || cast === "₂") {
      const index = document.createElement(cast === "²" ? "sup" : "sub");
      index.textContent = "2"; textFaktu.append(index);
    } else textFaktu.append(cast);
  });
  document.getElementById("fact-count").textContent = t("Prečítané: {n} z {total}", { n: objaveneFakty.size, total: zaujimavosti.length });
  document.getElementById("fact-progress-bar").style.width = `${objaveneFakty.size / zaujimavosti.length * 100}%`;
  predchadzajuciFakt.disabled = historiaFaktov.length < 2;
  if (animovat) document.dispatchEvent(new Event("vesmir:fact"));
}
document.getElementById("new-fact").addEventListener("click", () => {
  if (zaujimavosti.length <= 1) return;
  // Najprv ukazujeme neprečítané fakty, potom opakujeme bez okamžitého opakovania.
  let moznosti = zaujimavosti.map((_, i) => i).filter(i => !objaveneFakty.has(i));
  if (!moznosti.length) moznosti = zaujimavosti.map((_, i) => i).filter(i => i !== poslednyFakt);
  poslednyFakt = moznosti[Math.floor(Math.random() * moznosti.length)];
  objaveneFakty.add(poslednyFakt);
  historiaFaktov.push(poslednyFakt);
  if (historiaFaktov.length > 100) historiaFaktov.shift();
  zobrazFakt(true);
});
predchadzajuciFakt.addEventListener("click", () => {
  if (historiaFaktov.length < 2) return;
  historiaFaktov.pop();
  poslednyFakt = historiaFaktov.at(-1);
  zobrazFakt(true);
});


// 3. Mobilné rozbaľovacie menu: Escape, klik mimo menu a výber odkazu.
const tlacidloMenu = document.getElementById("menu-toggle");
const navigacia = document.getElementById("site-navigation");

function nastavMenu(otvorene, presunFokusu = false) {
  tlacidloMenu.setAttribute("aria-expanded", String(otvorene));
  tlacidloMenu.setAttribute("aria-label", t(otvorene ? "Zavrieť navigáciu" : "Otvoriť navigáciu"));
  navigacia.classList.toggle("is-open", otvorene);
  if (!otvorene && presunFokusu) tlacidloMenu.focus();
}
tlacidloMenu.addEventListener("click", () => {
  nastavMenu(tlacidloMenu.getAttribute("aria-expanded") !== "true");
});
navigacia.querySelectorAll("a").forEach((odkaz) => {
  odkaz.addEventListener("click", () => nastavMenu(false));
});
document.addEventListener("click", (udalost) => {
  if (!tlacidloMenu.contains(udalost.target) && !navigacia.contains(udalost.target)
      && !udalost.target.closest(".language-switch")) {
    nastavMenu(false);
  }
});
document.addEventListener("keydown", (udalost) => {
  if (udalost.key === "Escape" && tlacidloMenu.getAttribute("aria-expanded") === "true") {
    nastavMenu(false, true);
  }
});
window.addEventListener("resize", () => {
  if (window.innerWidth > 960) nastavMenu(false);
});

// 4. Galéria: interaktívna fotografia + ilustratívne 3D skúmanie.
// Externé oficiálne fotografie majú pre offline režim lokálne SVG ilustrácie.
const polozkyGalerie = Array.from(document.querySelectorAll(".gallery-open"));
const galeriaModal = document.getElementById("gallery-modal");
const modalnyObrazok = document.getElementById("gallery-modal-image");
const oznacenieNahrady = document.getElementById("gallery-modal-fallback");
const galleryStage = document.getElementById("gallery-stage");
const galleryViewport = document.getElementById("gallery-viewport");
const galleryCanvas = document.getElementById("gallery-3d-canvas");
const galleryFallbackCanvas = document.getElementById("gallery-3d-fallback");
const galleryPhotoHint = document.getElementById("gallery-photo-hint");
const gallery3dNote = document.getElementById("gallery-3d-note");
const galleryModePhoto = document.getElementById("gallery-mode-photo");
const galleryMode3d = document.getElementById("gallery-mode-3d");
const galleryZoomIn = document.getElementById("gallery-zoom-in");
const galleryZoomOut = document.getElementById("gallery-zoom-out");
const galleryRotateLeft = document.getElementById("gallery-rotate-left");
const galleryRotateRight = document.getElementById("gallery-rotate-right");
const galleryResetView = document.getElementById("gallery-reset-view");
const galleryFullscreen = document.getElementById("gallery-fullscreen");
const galleryAuto = document.getElementById("gallery-auto");
const galleryFullscreenExit = document.getElementById("gallery-fullscreen-exit");
const galleryFullscreenReset = document.getElementById("gallery-fullscreen-reset");
const galleryFullscreenControls = document.getElementById("gallery-fullscreen-controls");
let galleryAutoRotate=false;
const galleryQualityPanel = document.getElementById('gallery-quality-panel');
const galleryQuality = document.getElementById('gallery-quality');
const galleryQualityResolution = document.getElementById('gallery-quality-resolution');
let galleryQualityValue = 'auto';
try { const saved = localStorage.getItem('vesmir-galeria-kvalita'); if(saved === "auto" || Object.hasOwn(GalleryScenes.profiles,saved)) galleryQualityValue=saved; } catch (_) {}
galleryQuality.value=galleryQualityValue;
let indexFotografie = 0;
let galleryMode = "photo";
let aktualnaPolozkaGalerie = null;
let animaciaSceny = 0;
let galeriaScena = null;
const fotoStav = { mierka: 1, x: 0, y: 0, rotacia: 0 };
const fotoTah = { aktivny: false };
const galleryTexty = {
  "Automatická rotácia": { en: "Auto-rotate", uk: "Автообертання" },
  "Grafická kvalita": { en: "Graphics quality", uk: "Якість графіки" },
  "Nízka": { en: "Low", uk: "Низька" },
  "Stredná": { en: "Medium", uk: "Середня" },
  "Vysoká": { en: "High", uk: "Висока" },
  "Ultra": { en: "Ultra", uk: "Ультра" },
  "Auto": { en: "Auto", uk: "Авто" },
  "Načítavam 3D scénu": { en: "Loading 3D scene", uk: "Завантаження 3D-сцени" },
  "Základná vizualizácia": { en: "Basic rendering", uk: "Резервна візуалізація" },
  "3D scéna nie je dostupná": { en: "3D scene unavailable", uk: "3D-сцена недоступна" },
  "Fotografia": { en: "Photo", uk: "Фотографія" },
  "3D skúmanie": { en: "3D exploration", uk: "3D-дослідження" },
  "Režim zobrazenia galérie": { en: "Gallery display mode", uk: "Режим перегляду галереї" },
  "Prepnúť na režim fotografie": { en: "Switch to photo mode", uk: "Перемкнути на режим фотографії" },
  "Prepnúť na režim 3D skúmania": { en: "Switch to 3D exploration mode", uk: "Перемкнути на режим 3D-дослідження" },
  "Priblížiť fotografiu": { en: "Zoom in", uk: "Збільшити" },
  "Oddialiť fotografiu": { en: "Zoom out", uk: "Зменшити" },
  "Otočiť doľava": { en: "Rotate left", uk: "Повернути ліворуч" },
  "Otočiť doprava": { en: "Rotate right", uk: "Повернути праворуч" },
  "Obnoviť pohľad": { en: "Reset view", uk: "Скинути вигляд" },
  "Na celú obrazovku": { en: "Fullscreen", uk: "На весь екран" },
  "Ukončiť celú obrazovku": { en: "Exit fullscreen", uk: "Вийти з повноекранного режиму" },
  "Kolieskom približuj, potiahnutím posúvaj a tlačidlami môžeš fotografiu otáčať.": { en: "Zoom with the mouse wheel, drag to pan and use the buttons to rotate the photo.", uk: "Збільшуй колесиком, перетягуй для переміщення та використовуй кнопки, щоб обертати фотографію." },
  "Otáčaj potiahnutím · zoom kolieskom alebo dvoma prstami · posun Shift + ťah alebo šípky v scéne.": { en: "Drag to orbit · wheel or pinch to zoom · Shift-drag or arrow keys in the scene to pan.", uk: "Перетягуй для обертання · колесико або два пальці для масштабу · Shift + перетягування чи стрілки в сцені для переміщення." },
  "Ilustratívna 3D simulácia": { en: "Illustrative 3D simulation", uk: "Ілюстративна 3D-симуляція" },
  "Táto scéna je priestorová interpretácia inšpirovaná pôvodnou fotografiou.": { en: "This scene is a spatial interpretation inspired by the original photograph.", uk: "Ця сцена — просторова інтерпретація, натхненна оригінальною фотографією." }
};
function tg(text) {
  return galleryTexty[text]?.[aktualnyJazyk] ?? t(text);
}

function cestaNahrady(cesta) {
  return aktualnyJazyk === "sk" ? cesta : cesta.replace(/\.svg$/, `-${aktualnyJazyk}.svg`);
}
function aktualizujNahradu(obrazok) {
  const jeNahrada = obrazok.classList.contains("is-fallback");
  const alt = t(obrazok.dataset.originalAlt || "");
  obrazok.alt = jeNahrada ? `${t("Náhradná ilustrácia:")} ${alt}` : alt;
  if (jeNahrada) {
    const cesta = cestaNahrady(obrazok.dataset.fallback);
    if (!obrazok.src.endsWith(cesta)) obrazok.src = cesta;
  }
}
function nastavNahradnyObrazok(obrazok) {
  obrazok.dataset.originalAlt = obrazok.alt;
  const pouziNahradu = () => {
    if (obrazok.dataset.fallback && !obrazok.classList.contains("is-fallback")) {
      obrazok.classList.add("is-fallback");
      if (obrazok === modalnyObrazok) oznacenieNahrady.hidden = false;
      aktualizujNahradu(obrazok);
    }
  };
  obrazok.addEventListener("error", pouziNahradu);
  if (obrazok.complete && !obrazok.naturalWidth) pouziNahradu();
}
document.querySelectorAll(".gallery-open img").forEach(nastavNahradnyObrazok);
nastavNahradnyObrazok(modalnyObrazok);

function aktualizujGaleriuTexty() {
  document.getElementById('gallery-quality-label').textContent=tg('Grafická kvalita');
  Array.from(galleryQuality.options).forEach(option=>{option.textContent=tg(galleryQualityLabels[option.value]);});
  galleryAuto.textContent=tg("Automatická rotácia");
  galleryAuto.disabled=matchMedia("(prefers-reduced-motion: reduce)").matches;
  galleryFullscreenExit.textContent=tg("Ukončiť celú obrazovku");
  galleryFullscreenReset.textContent=tg("Obnoviť pohľad");
  aktualizujRozlisenieGalerie();
  document.querySelector(".modal-mode-switch").setAttribute("aria-label", tg("Režim zobrazenia galérie"));
  galleryModePhoto.textContent = tg("Fotografia");
  galleryMode3d.textContent = tg("3D skúmanie");
  galleryModePhoto.setAttribute("aria-label", tg("Prepnúť na režim fotografie"));
  galleryMode3d.setAttribute("aria-label", tg("Prepnúť na režim 3D skúmania"));
  galleryZoomIn.setAttribute("aria-label", tg("Priblížiť fotografiu"));
  galleryZoomOut.setAttribute("aria-label", tg("Oddialiť fotografiu"));
  galleryRotateLeft.setAttribute("aria-label", tg("Otočiť doľava"));
  galleryRotateRight.setAttribute("aria-label", tg("Otočiť doprava"));
  galleryResetView.textContent = tg("Obnoviť pohľad");
  galleryResetView.setAttribute("aria-label", tg("Obnoviť pohľad"));
  aktualizujFullscreenTlacidlo();
  galleryPhotoHint.textContent = tg("Kolieskom približuj, potiahnutím posúvaj a tlačidlami môžeš fotografiu otáčať.");
  gallery3dNote.innerHTML = `<strong>${tg("Ilustratívna 3D simulácia")}</strong><span>${tg("Táto scéna je priestorová interpretácia inšpirovaná pôvodnou fotografiou.")}</span><span class="gallery-scene-hint">${tg("Otáčaj potiahnutím · zoom kolieskom alebo dvoma prstami · posun Shift + ťah alebo šípky v scéne.")}</span>`;
}

function obnovFotoPohlad() {
  fotoStav.mierka = 1;
  fotoStav.x = 0;
  fotoStav.y = 0;
  fotoStav.rotacia = 0;
  aplikujFotoTransformaciu();
}
function aplikujFotoTransformaciu() {
  modalnyObrazok.style.transform = `translate(${fotoStav.x}px, ${fotoStav.y}px) scale(${fotoStav.mierka}) rotate(${fotoStav.rotacia}deg)`;
}
function nastavMierkuFotky(dalsiaMierka) {
  fotoStav.mierka = Math.min(6, Math.max(0.6, dalsiaMierka));
  aplikujFotoTransformaciu();
}
function zmenRotaciuFotky(delta) {
  fotoStav.rotacia = (fotoStav.rotacia + delta + 360) % 360;
  aplikujFotoTransformaciu();
}

// Request frames only for camera motion, resource updates or changes to the viewport.
const obmedzenyPohybGalerie = matchMedia('(prefers-reduced-motion: reduce)');
const galleryCoarsePointer = matchMedia('(pointer: coarse)');
const galleryCameraFields = ['yaw','pitch','zoom','panX','panY'];
let galleryRenderer, galleryFallbackContext, galleryWebGLTried=false;
let galleryWake = 0;
const galleryQualityLabels = {auto:'Auto', low:'Nízka', medium:'Stredná', high:'Vysoká', ultra:'Ultra'};

function aktualizujRozlisenieGalerie() {
  const s=galeriaScena;
  if(!s||galleryMode!=='3d')return;
  const canvas=s.fallback?galleryFallbackCanvas:galleryCanvas;
  const resolution=canvas.width>1?canvas.width+' × '+canvas.height+' px':'';
  const effective=galleryQualityValue==='auto'&&s.effectiveQuality?tg(galleryQualityLabels[s.effectiveQuality]):'';
  const status={
    new:tg('Načítavam 3D scénu'),
    loading:tg('Načítavam 3D scénu'),
    fallback:tg('Základná vizualizácia'),
    error:tg('3D scéna nie je dostupná')
  }[s.status];
  const label=[status,resolution,effective].filter(Boolean).join(' · ');
  if(galleryQualityResolution.textContent!==label)galleryQualityResolution.textContent=label;
  galleryQualityResolution.title=s.fallback?'Canvas 2D':s.status==='ready'?'WebGL 2':'';
}

galleryQuality.addEventListener('change',()=>{
  if(!Object.hasOwn(galleryQualityLabels,galleryQuality.value))return;
  galleryQualityValue=galleryQuality.value;
  try{localStorage.setItem('vesmir-galeria-kvalita',galleryQualityValue);}catch(_){}
  if(galeriaScena){
    galeriaScena.renderKey='';
    galeriaScena.autoChecked=0;
    galeriaScena.autoFactor=1;
  }
  spustiScenuAkTreba();
});

function vykresliScenu(cas) {
  animaciaSceny=0;
  const s=galeriaScena;
  if(!s||!galeriaModal.open||galleryMode!=='3d'||document.hidden)return;
  if(s.status!=='ready'&&s.status!=='fallback'){
    aktualizujRozlisenieGalerie();
    return;
  }
  const rect=galleryStage.getBoundingClientRect();
  if(rect.width<1||rect.height<1)return;
  const elapsed=s.lastFrame?cas-s.lastFrame:16.7;
  s.lastFrame=cas;
  const autoEnabled=galleryAutoRotate&&!obmedzenyPohybGalerie.matches&&document.documentElement.classList.contains('motion-enabled');
  const auto=autoEnabled&&!fotoTah.aktivny&&cas>=(s.manualUntil||0);
  if(auto)s.yaw+=Math.min(elapsed,45)*.00016;
  let easing=false;
  const ease=obmedzenyPohybGalerie.matches?1:1-Math.exp(-Math.min(60,elapsed)/42);
  for(const field of galleryCameraFields){
    const distance=s[field]-s.view[field];
    if(Math.abs(distance)<.00022||ease===1)s.view[field]=s[field];
    else {s.view[field]+=distance*ease;easing=true;}
  }
  const moving=auto||easing||cas<(s.lastInput||0)+115;
  const useAuto=galleryQualityValue==='auto';
  if(useAuto)GalleryScenes.tune(s,cas,elapsed,moving,galleryCoarsePointer.matches);
  s.effectiveQuality=useAuto?GalleryScenes.choices[s.autoIndex]:galleryQualityValue;
  const profile=GalleryScenes.profiles[s.effectiveQuality];
  const fallback=s.fallback;
  const {width,height,ratio}=GalleryScenes.resolution(rect.width,rect.height,devicePixelRatio||1,profile,
    moving,galleryRenderer?.limit||4096,useAuto&&moving?(s.autoFactor||1):1,s.object===3&&!fallback);
  const canvas=fallback?galleryFallbackCanvas:galleryCanvas;
  const assetStatus=fallback?GalleryCanvasFallback.hdStatus(fallback):'';
  const key=[width,height,s.effectiveQuality,moving,assetStatus,...galleryCameraFields.map(field=>s.view[field])].join(':');
  if(s.renderKey!==key){
    if(canvas.width!==width)canvas.width=width;
    if(canvas.height!==height)canvas.height=height;
    const start=performance.now();
    let ready=true, draw={};
    if(fallback){
      Object.assign(fallback,s.view,{quality:s.effectiveQuality,referenceWidth:rect.width,motionPreview:moving});
      ready=GalleryCanvasFallback.draw(galleryFallbackContext,fallback,width,height);
    }else{
      const view=GalleryScenes.camera({...s.view,object:s.object},rect.width,rect.height);
      draw=galleryRenderer.draw(s,view,profile,moving,ratio,auto||easing||fotoTah.aktivny);
      s.gpuMs=draw.gpuMs;
    }
    Object.assign(galleryCanvas.dataset,{
      renderMs:(performance.now()-start).toFixed(2),scene:s.typ,ready:String(ready),
      quality:s.effectiveQuality,preview:String(moving),backend:fallback?'Canvas 2D':'WebGL2',
      volumeRaster:!fallback&&s.volume?width+' × '+height:'',
      raySteps:!fallback&&s.volume?String(moving?profile.motionSteps:profile.steps):'0',
      gpuMs:draw.gpuMs?.toFixed(2)||'',resourceBytes:draw.bytes||0,drawCalls:draw.draws||0
    });
    s.renderKey=key;
    aktualizujRozlisenieGalerie();
  }
  const pending=fallback&&GalleryCanvasFallback.hdStatus(fallback).includes('0');
  if(auto||moving||pending)animaciaSceny=requestAnimationFrame(vykresliScenu);
  else if(autoEnabled&&!fotoTah.aktivny&&s.manualUntil>cas){
    galleryWake=setTimeout(spustiScenuAkTreba,s.manualUntil-cas);
  }
}

function zastavScenu() {
  if(animaciaSceny)cancelAnimationFrame(animaciaSceny);
  clearTimeout(galleryWake);
  animaciaSceny=0;
  galleryWake=0;
}

function resetujScenu(typ) {
  zastavScenu();
  GalleryScenes.release(galeriaScena,galleryRenderer);
  galleryFallbackCanvas.width=1;
  galleryFallbackCanvas.height=1;
  galeriaScena=GalleryScenes.create(typ||aktualnaPolozkaGalerie?.dataset.scene||'carina');
  clearGalleryPointers();
  galleryFallbackCanvas.hidden=true;
  if(galleryMode==='3d')galleryCanvas.hidden=false;
  galleryCanvas.dataset.ready='false';
}

function spustiScenuAkTreba() {
  if(galleryMode!=='3d'||!galeriaModal.open||document.hidden)return;
  clearTimeout(galleryWake);
  galleryWake=0;
  if(!galeriaScena||galeriaScena.typ!==aktualnaPolozkaGalerie?.dataset.scene)resetujScenu();
  if(!galleryWebGLTried){
    galleryWebGLTried=true;
    try{galleryRenderer=GalleryVolumeGL.create(galleryCanvas);}catch(error){console.warn('Gallery WebGL2:',error.message);}
  }
  const s=galeriaScena;
  if(s.status==='new'){
    GalleryScenes.start(s,galleryRenderer,()=>{
      if(s!==galeriaScena||galleryMode!=='3d')return;
      if(s.fallback)galleryFallbackContext ||= galleryFallbackCanvas.getContext('2d');
      if(s.fallback&&!galleryFallbackContext){
        s.fallback=null;
        s.status='error';
      }
      galleryCanvas.hidden=Boolean(s.fallback);
      galleryFallbackCanvas.hidden=!s.fallback;
          aktualizujRozlisenieGalerie();
      spustiScenuAkTreba();
    });
  }
  if(!animaciaSceny)animaciaSceny=requestAnimationFrame(vykresliScenu);
}

function restartGalleryRenderer() {
  if(galleryMode!=='3d'||!galeriaScena)return;
  const previous=galeriaScena;
  resetujScenu(previous.typ);
  for(const field of galleryCameraFields)galeriaScena[field]=previous[field];
  galeriaScena.view={...previous.view};
  spustiScenuAkTreba();
}
galleryCanvas.addEventListener('webglcontextlost',event=>{
  event.preventDefault();
  galleryRenderer=null;
  restartGalleryRenderer();
});
galleryCanvas.addEventListener('webglcontextrestored',()=>{
  galleryWebGLTried=false;
  restartGalleryRenderer();
});

function nastavGalerijnyRezim(rezim) {
  galleryMode = rezim === "3d" ? "3d" : "photo";
  const je3D = galleryMode === "3d";
  galleryModePhoto.classList.toggle("is-active", !je3D);
  galleryMode3d.classList.toggle("is-active", je3D);
  galleryModePhoto.setAttribute("aria-pressed", String(!je3D));
  galleryMode3d.setAttribute("aria-pressed", String(je3D));
  modalnyObrazok.hidden = je3D;
  galleryCanvas.hidden = !je3D || Boolean(galeriaScena?.fallback);
  galleryFallbackCanvas.hidden = !je3D || !galeriaScena?.fallback;
  clearGalleryPointers();
  gallery3dNote.hidden = !je3D;
  galleryQualityPanel.hidden = !je3D;
  galleryPhotoHint.hidden = je3D;
  oznacenieNahrady.hidden = je3D || !modalnyObrazok.classList.contains("is-fallback");
  galleryStage.tabIndex = je3D ? 0 : -1;
  galleryStage.classList.remove("is-grabbing");
  galleryStage.classList.toggle("is-3d", je3D);
  if (je3D) {
    spustiScenuAkTreba();
  } else {
    zastavScenu();
    GalleryScenes.release(galeriaScena,galleryRenderer);
    galeriaScena=null;
    galleryFallbackCanvas.width=1;
    galleryFallbackCanvas.height=1;
    galleryCanvas.dataset.resourceBytes='0';
  }
}
function galleryIsFullscreen() {
  return document.fullscreenElement===galleryViewport||galleryViewport.classList.contains('is-gallery-expanded');
}
function aktualizujFullscreenTlacidlo() {
  const jeFullscreen=galleryIsFullscreen();
  galleryFullscreenControls.hidden=!jeFullscreen;
  galleryFullscreen.textContent = tg(jeFullscreen ? "Ukončiť celú obrazovku" : "Na celú obrazovku");
  galleryFullscreen.setAttribute("aria-label", galleryFullscreen.textContent);
}
function obnovPohladGalerie() {
  if (galleryMode === "3d") {
    if(galeriaScena)GalleryScenes.reset(galeriaScena);
    spustiScenuAkTreba();
  } else {
    obnovFotoPohlad();
  }
}
function otocGaleriu(delta) {
  if (galleryMode === "3d") {
    if (galeriaScena) { galeriaScena.yaw += delta * (Math.PI / 180); manualGallery(); }
  } else {
    zmenRotaciuFotky(delta);
  }
}
function priblizGaleriu(delta) {
  if (galleryMode === "3d") {
    if (galeriaScena) { galeriaScena.zoom = Math.max(0.6, Math.min(3.4, galeriaScena.zoom * Math.exp(delta))); manualGallery(); }
  } else {
    nastavMierkuFotky(fotoStav.mierka + delta);
  }
}
function nastavModalnyZdroj(polozka, obrazok, jeNahrada) {
  const zaloznyZdroj = jeNahrada ? cestaNahrady(obrazok.dataset.fallback) : obrazok.src;
  const preferovanyZdroj = !jeNahrada && polozka.dataset.fullres ? polozka.dataset.fullres : zaloznyZdroj;
  modalnyObrazok.classList.toggle("is-fallback", jeNahrada);
  modalnyObrazok.dataset.originalAlt = obrazok.dataset.originalAlt;
  modalnyObrazok.alt = obrazok.alt;
  modalnyObrazok.dataset.fallback = obrazok.dataset.fallback;
  oznacenieNahrady.hidden = !jeNahrada;
  modalnyObrazok.onerror = () => {
    if (modalnyObrazok.src !== zaloznyZdroj) {
      modalnyObrazok.src = zaloznyZdroj;
    } else if (obrazok.dataset.fallback) {
      modalnyObrazok.classList.add("is-fallback");
      modalnyObrazok.src = cestaNahrady(obrazok.dataset.fallback);
      aktualizujNahradu(modalnyObrazok);
      oznacenieNahrady.hidden = false;
    }
  };
  modalnyObrazok.src = preferovanyZdroj;
}
function zobrazFotografiu(index, zachovajPohlad = false) {
  indexFotografie = (index + polozkyGalerie.length) % polozkyGalerie.length;
  const polozka = polozkyGalerie[indexFotografie];
  const obrazok = polozka.querySelector("img");
  const jeNahrada = obrazok.classList.contains("is-fallback");
  aktualnaPolozkaGalerie = polozka;
  nastavModalnyZdroj(polozka, obrazok, jeNahrada);
  document.getElementById("gallery-modal-counter").textContent = `${indexFotografie + 1} / ${polozkyGalerie.length}`;
  document.getElementById("gallery-modal-title").textContent = t(polozka.dataset.title);
  document.getElementById("gallery-modal-description").textContent = t(polozka.dataset.description);
  document.getElementById("gallery-modal-credit").textContent = `${t("Zdroj:")} ${t(polozka.dataset.credit)}`;
  document.getElementById("gallery-modal-source").href = polozka.dataset.source;
  if (!zachovajPohlad) obnovFotoPohlad();
  if (galleryMode === "3d" && !zachovajPohlad) {
    resetujScenu(polozka.dataset.scene);
    spustiScenuAkTreba();
  }
}
polozkyGalerie.forEach((polozka, index) => polozka.addEventListener("click", () => {
  nastavGalerijnyRezim("photo");
  zobrazFotografiu(index);
  galeriaModal.showModal();
}));

function zavriGaleriu() {
  GalleryScenes.release(galeriaScena,galleryRenderer);
  galeriaScena=null;
  galleryFallbackCanvas.width=1;
  galleryFallbackCanvas.height=1;
  galleryCanvas.dataset.resourceBytes='0';
  galeriaModal.close();
  zavriGaleriuFullscreen();
  zastavScenu();
  galleryStage.classList.remove("is-grabbing");
}
document.getElementById("gallery-close").addEventListener("click", zavriGaleriu);
galeriaModal.addEventListener("cancel", (udalost) => {
  udalost.preventDefault();
  if(galleryIsFullscreen())zavriGaleriuFullscreen();
  else zavriGaleriu();
});
document.getElementById("gallery-prev").addEventListener("click", () => zobrazFotografiu(indexFotografie - 1));
document.getElementById("gallery-next").addEventListener("click", () => zobrazFotografiu(indexFotografie + 1));
galeriaModal.addEventListener("click", (udalost) => {
  if (udalost.target === galeriaModal) zavriGaleriu();
});
document.addEventListener("keydown", (udalost) => {
  if (!galeriaModal.open || udalost.target === galleryQuality) return;
  if (udalost.key === "ArrowRight") zobrazFotografiu(indexFotografie + 1);
  if (udalost.key === "ArrowLeft") zobrazFotografiu(indexFotografie - 1);
});

galleryAuto.addEventListener("click",()=>{if(obmedzenyPohybGalerie.matches)return;galleryAutoRotate=!galleryAutoRotate;galleryAuto.setAttribute("aria-pressed",String(galleryAutoRotate));spustiScenuAkTreba();});
function zavriGaleriuFullscreen(){
  galleryViewport.classList.remove('is-gallery-expanded');
  if(document.fullscreenElement===galleryViewport)document.exitFullscreen().catch(()=>{});
  aktualizujFullscreenTlacidlo();
  spustiScenuAkTreba();
}
galleryFullscreenExit.addEventListener("click",zavriGaleriuFullscreen);
galleryFullscreenReset.addEventListener("click",obnovPohladGalerie);
galleryModePhoto.addEventListener("click", () => nastavGalerijnyRezim("photo"));
galleryMode3d.addEventListener("click", () => nastavGalerijnyRezim("3d"));
galleryZoomIn.addEventListener("click", () => priblizGaleriu(galleryMode === "3d" ? 0.18 : 0.25));
galleryZoomOut.addEventListener("click", () => priblizGaleriu(galleryMode === "3d" ? -0.18 : -0.25));
galleryRotateLeft.addEventListener("click", () => otocGaleriu(galleryMode === "3d" ? -18 : -90));
galleryRotateRight.addEventListener("click", () => otocGaleriu(galleryMode === "3d" ? 18 : 90));
galleryResetView.addEventListener("click", obnovPohladGalerie);
galleryFullscreen.addEventListener("click", async () => {
  if(galleryIsFullscreen()){
    zavriGaleriuFullscreen();
    return;
  }
  try {
    await galleryViewport.requestFullscreen?.();
  } catch (_) { /* The stage can also fill the browser viewport. */ }
  if(galeriaModal.open&&!galleryIsFullscreen())galleryViewport.classList.add('is-gallery-expanded');
  aktualizujFullscreenTlacidlo();
  spustiScenuAkTreba();
});
document.addEventListener("fullscreenchange",()=>{
  aktualizujFullscreenTlacidlo();
  spustiScenuAkTreba();
});

galleryStage.addEventListener("wheel", (udalost) => {
  if (!galeriaModal.open) return;
  udalost.preventDefault();
  if(galleryMode==='3d'&&galeriaScena){
    const s=galeriaScena,r=galleryStage.getBoundingClientRect();
    const dy=udalost.deltaY*(udalost.deltaMode===1?16:udalost.deltaMode===2?r.height:1);
    const next=Math.max(.6,Math.min(3.4,s.zoom*Math.exp(-Math.max(-240,Math.min(240,dy))*.0025)));
    const factor=next/s.zoom,cx=(udalost.clientX-r.left)/r.width-.5-(s.typ==='cartwheel'?.095:0),cy=(udalost.clientY-r.top)/r.height-.5-(s.typ==='carina'?-.015:0);
    s.panX=Math.max(-.60,Math.min(.60,cx+(s.panX-cx)*factor));s.panY=Math.max(-.60,Math.min(.60,cy+(s.panY-cy)*factor));s.zoom=next;manualGallery();
  }else priblizGaleriu(udalost.deltaY<0?.18:-.18);
}, { passive: false });

const galleryPointers = new Map();
function bodyGesture() {
  const [a,b]=galleryPointers.values(); if(!a||!b)return null;
  return {distance:Math.hypot(a.x-b.x,a.y-b.y),angle:Math.atan2(b.y-a.y,b.x-a.x),x:(a.x+b.x)/2,y:(a.y+b.y)/2};
}
function manualGallery(){if(galeriaScena&&galleryMode==='3d'){galeriaScena.manualUntil=performance.now()+2200;galeriaScena.lastInput=performance.now();spustiScenuAkTreba();}}
function clearGalleryPointers(){galleryPointers.clear();fotoTah.aktivny=false;galleryStage.classList.remove('is-grabbing');}
galleryStage.addEventListener('pointerdown',e=>{
  if(e.button!==0||galleryPointers.size>=2)return;
  e.preventDefault();galleryStage.focus({preventScroll:true});galleryPointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  fotoTah.aktivny=true;galleryStage.classList.add('is-grabbing');manualGallery();
  try{galleryStage.setPointerCapture(e.pointerId);}catch(_){}
});
galleryStage.addEventListener('pointermove',e=>{
  const prev=galleryPointers.get(e.pointerId);if(!prev)return;
  if(e.pointerType==='mouse'&&!e.buttons){releaseGalleryPointer(e);return;}
  const before=bodyGesture();galleryPointers.set(e.pointerId,{x:e.clientX,y:e.clientY});const after=bodyGesture();
  const dx=e.clientX-prev.x,dy=e.clientY-prev.y,rect=galleryStage.getBoundingClientRect();
  if(galleryMode==='3d'&&galeriaScena){
    const s=galeriaScena;
    if(before&&after&&before.distance>1){const next=Math.max(.6,Math.min(3.4,s.zoom*after.distance/before.distance)),f=next/s.zoom;
      const ax=(before.x-rect.left)/rect.width-.5-(s.typ==='cartwheel'?.095:0),ay=(before.y-rect.top)/rect.height-.5-(s.typ==='carina'?-.015:0);
      s.panX=ax+(s.panX-ax)*f+(after.x-before.x)/rect.width;s.panY=ay+(s.panY-ay)*f+(after.y-before.y)/rect.height;s.zoom=next;}
    else if(e.shiftKey){s.panX+=dx/rect.width;s.panY+=dy/rect.height;}
    else{const speed=2.65/Math.max(280,Math.min(rect.width,rect.height));s.yaw+=dx*speed;s.pitch=Math.max(-1.45,Math.min(1.45,s.pitch+dy*speed));}
    s.panX=Math.max(-.60,Math.min(.60,s.panX));s.panY=Math.max(-.60,Math.min(.60,s.panY));manualGallery();
  }else if(before&&after&&before.distance>1){
    fotoStav.x+=after.x-before.x;fotoStav.y+=after.y-before.y;fotoStav.rotacia+=(after.angle-before.angle)*180/Math.PI;nastavMierkuFotky(fotoStav.mierka*after.distance/before.distance);
  }else{fotoStav.x+=dx;fotoStav.y+=dy;aplikujFotoTransformaciu();}
});
function releaseGalleryPointer(e){if(!galleryPointers.delete(e.pointerId))return;if(!galleryPointers.size)clearGalleryPointers();manualGallery();}
for(const name of ['pointerup','pointercancel','lostpointercapture'])galleryStage.addEventListener(name,releaseGalleryPointer);
window.addEventListener('blur',clearGalleryPointers);
galeriaModal.addEventListener('close',()=>{
  // The dialog may have reopened before its queued close event is dispatched.
  if(!galeriaModal.open){clearGalleryPointers();zastavScenu();}
});
galleryStage.addEventListener('keydown',e=>{
  if(galleryMode!=='3d'||!galeriaScena)return;const s=galeriaScena;
  switch(e.key){case 'ArrowLeft':s.panX-=.06;break;case 'ArrowRight':s.panX+=.06;break;case 'ArrowUp':s.panY-=.06;break;case 'ArrowDown':s.panY+=.06;break;case '+':case '=':priblizGaleriu(.18);break;case '-':priblizGaleriu(-.18);break;case 'Home':obnovPohladGalerie();break;default:return;}
  s.panX=Math.max(-.60,Math.min(.60,s.panX));s.panY=Math.max(-.60,Math.min(.60,s.panY));e.preventDefault();e.stopPropagation();manualGallery();
});
if(typeof ResizeObserver!=='undefined'){
  new ResizeObserver(()=>spustiScenuAkTreba()).observe(galleryStage);
}else{
  window.addEventListener('resize',spustiScenuAkTreba);
}
document.getElementById('motion-toggle').addEventListener('click',()=>{if(galeriaModal.open&&galleryMode==='3d')spustiScenuAkTreba();});
obmedzenyPohybGalerie.addEventListener('change',()=>{galleryAuto.disabled=obmedzenyPohybGalerie.matches;if(galeriaModal.open&&galleryMode==='3d')spustiScenuAkTreba();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)zastavScenu();else if(galeriaModal.open&&galleryMode==='3d')spustiScenuAkTreba();});

aktualizujGaleriuTexty();

// 5. Kvíz je samostatný modul quiz.js.

// 6. Porovnávacia tabuľka: číselné triedenie a pôvodné poradie.
const teloTabulky = document.querySelector("#planet-comparison tbody");
const povodneRiadky = Array.from(teloTabulky.rows);
const tlacidlaTriedenia = document.querySelectorAll("[data-sort]");
const nadpisPriemeru = document.getElementById("diameter-heading");
const nadpisVzdialenosti = document.getElementById("distance-heading");
let aktualneTriedenie = "original";
const popisyTriedenia = {
  original: "Pôvodné poradie od Slnka.",
  "diameter-asc": "Zoradené podľa priemeru od najmenšej planéty.",
  "diameter-desc": "Zoradené podľa priemeru od najväčšej planéty.",
  "distance-asc": "Zoradené podľa vzdialenosti od Slnka – od najbližšej.",
  "distance-desc": "Zoradené podľa vzdialenosti od Slnka – od najvzdialenejšej."
};
function ziskajPriemer(riadok) { return Number(riadok.cells[1].dataset.diameter); }
function ziskajVzdialenost(riadok) { return Number(riadok.cells[2].dataset.distance); }
function aktualizujTriedenie() {
  document.getElementById("sort-status").textContent = t(popisyTriedenia[aktualneTriedenie]);
}
function zoradPlanety(rezim) {
  // Zachovávame aj pôvodné volania s true / false.
  if (typeof rezim === "boolean") rezim = rezim ? "diameter-asc" : "diameter-desc";
  if (!Object.hasOwn(popisyTriedenia, rezim)) return;
  aktualneTriedenie = rezim;
  const riadky = [...povodneRiadky];
  const vzdialenost = rezim.startsWith("distance");
  const vzostupne = rezim.endsWith("asc");
  if (rezim !== "original") {
    const hodnota = vzdialenost ? ziskajVzdialenost : ziskajPriemer;
    riadky.sort((a, b) => (hodnota(a) - hodnota(b)) * (vzostupne ? 1 : -1));
  }
  riadky.forEach(riadok => teloTabulky.appendChild(riadok));
  tlacidlaTriedenia.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.sort === rezim)));
  nadpisPriemeru.removeAttribute("aria-sort");
  nadpisVzdialenosti.removeAttribute("aria-sort");
  if (rezim !== "original") (vzdialenost ? nadpisVzdialenosti : nadpisPriemeru).setAttribute("aria-sort", vzostupne ? "ascending" : "descending");
  aktualizujTriedenie();
}
tlacidlaTriedenia.forEach(b => b.addEventListener("click", () => zoradPlanety(b.dataset.sort)));
document.querySelector(".comparison-sort").hidden = false;

// 7. Prepínanie jazyka bez obnovy stránky. Stav kvízu a ostatných funkcií sa nemení.
const tlacidlaJazyka = document.querySelectorAll("[data-language]");
function nastavJazyk(jazyk) {
  if (!["sk", "en", "uk"].includes(jazyk)) return;
  aktualnyJazyk = jazyk;
  prelozStatickyObsah();
  tlacidlaJazyka.forEach(tlacidlo => tlacidlo.setAttribute("aria-pressed", String(tlacidlo.dataset.language === jazyk)));
  aktualizujPrepinacTemy();
  nastavMenu(tlacidloMenu.getAttribute("aria-expanded") === "true");
  vyberPlanetu(vybranaPlaneta);
  zobrazFakt();
  document.querySelectorAll(".gallery-open img").forEach(aktualizujNahradu);
  aktualizujGaleriuTexty();
  if (galeriaModal.open) zobrazFotografiu(indexFotografie, true);
  aktualizujTriedenie();
  try { localStorage.setItem("vesmir-jazyk", jazyk); } catch (error) { /* Prepínanie funguje aj bez úložiska. */ }
  document.dispatchEvent(new Event("vesmir:language"));
}
tlacidlaJazyka.forEach(tlacidlo => tlacidlo.addEventListener("click", () => nastavJazyk(tlacidlo.dataset.language)));
document.querySelector(".language-switch").hidden = false;
nastavJazyk(aktualnyJazyk);

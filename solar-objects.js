(function () {
  const spaceUiText = {
    exploreCategory: { sk: "Preskúmať kategóriu", en: "Explore category", uk: "Дослідити категорію" },
    categoryLabel: { sk: "Kategória vesmírnych telies", en: "Space object category", uk: "Категорія космічних тіл" },
    closeWindow: { sk: "Zavrieť informačné okno", en: "Close information window", uk: "Закрити інформаційне вікно" },
    close: { sk: "Zavrieť", en: "Close", uk: "Закрити" },
    interactiveModel: { sk: "Interaktívny model", en: "Interactive model", uk: "Інтерактивна модель" },
    modelHint: {
      sk: "Potiahni pre otáčanie. Kolieskom alebo dvoma prstami približuj a odďaľuj.",
      en: "Drag to rotate. Use the mouse wheel or two fingers to zoom in and out.",
      uk: "Перетягуй для обертання. Колесиком або двома пальцями збільшуй і зменшуй."
    },
    modelControls: { sk: "Ovládanie modelu", en: "Model controls", uk: "Керування моделлю" },
    zoomOut: { sk: "Oddialiť model", en: "Zoom out", uk: "Зменшити модель" },
    zoomIn: { sk: "Priblížiť model", en: "Zoom in", uk: "Збільшити модель" },
    resetView: { sk: "Obnoviť pohľad", en: "Reset view", uk: "Скинути вигляд" },
    categoryOverview: { sk: "Prehľad kategórie", en: "Category overview", uk: "Огляд категорії" },
    interestingFacts: { sk: "Zaujímavé fakty", en: "Interesting facts", uk: "Цікаві факти" },
    examplesTitle: { sk: "Príklady a zaujímavé objekty", en: "Examples and notable objects", uk: "Приклади та цікаві об’єкти" },
    examplesText: {
      sk: "Klikni na konkrétny objekt a zobrazia sa jeho základné údaje.",
      en: "Click a specific object to see its basic data.",
      uk: "Натисни на конкретний об’єкт, щоб побачити його основні дані."
    },
    selectedObject: { sk: "Vybraný objekt", en: "Selected object", uk: "Вибраний об’єкт" },
    openCategoryCard: { sk: "Otvoriť kartu kategórie", en: "Open category card", uk: "Відкрити картку категорії" }
  };

  const spaceCategories = {
    moons: {
      accent: "#c8d8ff",
      title: { sk: "Mesiace", en: "Moons", uk: "Супутники" },
      description: {
        sk: "Mesiace sú prirodzené satelity planét a trpasličích planét. V Slnečnej sústave majú rozmanité podoby – od skalnatého Mesiaca až po oceánsky svet Európu či dusíkový Titan.",
        en: "Moons are natural satellites of planets and dwarf planets. In the Solar System they come in many forms – from our rocky Moon to the ocean world Europa and the hazy Titan.",
        uk: "Супутники — це природні тіла, що обертаються навколо планет і карликових планет. У Сонячній системі вони дуже різні: від кам’янистого Місяця до крижаного світу Європи та туманного Титана."
      },
      stats: [
        { value: "300+", label: { sk: "potvrdených mesiacov pri planétach aj trpasličích planétach", en: "confirmed moons around planets and dwarf planets", uk: "підтверджених супутників у планет і карликових планет" } },
        { value: { sk: "Skala až ľad", en: "Rock to ice", uk: "Від скелі до льоду" }, label: { sk: "zloženie sa líši podľa vzniku a vzdialenosti od Slnka", en: "composition depends on origin and distance from the Sun", uk: "склад залежить від походження та відстані від Сонця" } },
        { value: { sk: "Oceány pod povrchom", en: "Subsurface oceans", uk: "Підповерхневі океани" }, label: { sk: "niektoré ľadové mesiace môžu skrývať tekutú vodu", en: "some icy moons may hide liquid water", uk: "деякі крижані супутники можуть приховувати рідку воду" } },
        { value: { sk: "Rezonancie a slapové sily", en: "Resonances and tides", uk: "Резонанси й припливні сили" }, label: { sk: "gravitácia planét silno ovplyvňuje ich povrch a vnútro", en: "planetary gravity strongly shapes their interiors and surfaces", uk: "гравітація планет сильно впливає на їхню будову та поверхню" } }
      ],
      facts: [
        { sk: "Ganymedes je najväčší mesiac Slnečnej sústavy a je väčší než Merkúr.", en: "Ganymede is the largest moon in the Solar System and is larger than Mercury.", uk: "Ганімед — найбільший супутник Сонячної системи й навіть більший за Меркурій." },
        { sk: "Europa a Enceladus patria medzi hlavné ciele pri hľadaní podmienok vhodných pre život.", en: "Europa and Enceladus are among the main targets in the search for habitable conditions.", uk: "Європа та Енцелад — одні з головних цілей у пошуках умов, придатних для життя." },
        { sk: "Titan má hustú atmosféru a jazerá kvapalných uhľovodíkov.", en: "Titan has a dense atmosphere and lakes of liquid hydrocarbons.", uk: "Титан має густу атмосферу та озера з рідких вуглеводнів." }
      ],
      examples: [
        {
          id: "moon",
          thumbVariant: "neutral",
          thumb: "assets/mesiace.webp",
          tag: { sk: "Zem", en: "Earth", uk: "Земля" },
          name: { sk: "Mesiac", en: "The Moon", uk: "Місяць" },
          title: { sk: "Mesiac", en: "Moon", uk: "Місяць" },
          subtitle: { sk: "Náš najbližší kozmický sused", en: "Our closest cosmic neighbour", uk: "Наш найближчий космічний сусід" },
          description: { sk: "Jediný prirodzený satelit Zeme formuje príliv a odliv a uchováva stopy dávnej histórie Slnečnej sústavy.", en: "Earth’s only natural satellite shapes tides and preserves traces of the Solar System’s early history.", uk: "Єдиний природний супутник Землі впливає на припливи й відпливи та зберігає сліди ранньої історії Сонячної системи." },
          stats: [
            { label: { sk: "Priemer", en: "Diameter", uk: "Діаметр" }, value: "3 474 km" },
            { label: { sk: "Obeh okolo Zeme", en: "Orbit around Earth", uk: "Оберт навколо Землі" }, value: { sk: "27,3 dňa", en: "27.3 days", uk: "27,3 доби" } },
            { label: { sk: "Povrch", en: "Surface", uk: "Поверхня" }, value: { sk: "Krátre a moria", en: "Craters and maria", uk: "Кратери та моря" } },
            { label: { sk: "Zaujímavosť", en: "Highlight", uk: "Особливість" }, value: { sk: "Stále sa od Zeme pomaly vzďaľuje", en: "Slowly drifting away from Earth", uk: "Повільно віддаляється від Землі" } }
          ],
          render: { kind: "sphere", base: "#b8bcc4", glow: "#f5f7ff", craters: true }
        },
        {
          id: "europa",
          thumbVariant: "cold",
          thumb: "assets/mesiace.webp",
          tag: { sk: "Jupiter", en: "Jupiter", uk: "Юпітер" },
          name: { sk: "Európa", en: "Europa", uk: "Європа" },
          title: { sk: "Európa", en: "Europa", uk: "Європа" },
          subtitle: { sk: "Ľadový svet so skrytým oceánom", en: "An icy world with a hidden ocean", uk: "Крижаний світ із прихованим океаном" },
          description: { sk: "Mesiac Jupitera pokrýva popraskaný ľad. Pod jeho povrchom sa pravdepodobne nachádza slaný globálny oceán.", en: "This moon of Jupiter is covered by fractured ice. Beneath its surface there is likely a salty global ocean.", uk: "Супутник Юпітера вкритий потрісканим льодом. Під поверхнею, ймовірно, прихований солоний глобальний океан." },
          stats: [
            { label: { sk: "Priemer", en: "Diameter", uk: "Діаметр" }, value: "3 122 km" },
            { label: { sk: "Obeh okolo Jupitera", en: "Orbit around Jupiter", uk: "Оберт навколо Юпітера" }, value: { sk: "3,55 dňa", en: "3.55 days", uk: "3,55 доби" } },
            { label: { sk: "Vrstva na povrchu", en: "Surface layer", uk: "Поверхневий шар" }, value: { sk: "Vodný ľad", en: "Water ice", uk: "Водяний лід" } },
            { label: { sk: "Misia", en: "Mission", uk: "Місія" }, value: { sk: "Europa Clipper", en: "Europa Clipper", uk: "Europa Clipper" } }
          ],
          render: { kind: "sphere", base: "#d7d9d1", glow: "#ffffff", stripes: true, stripeColor: "rgba(116,90,68,.55)" }
        },
        {
          id: "titan",
          thumbVariant: "warm",
          thumb: "assets/mesiace.webp",
          tag: { sk: "Saturn", en: "Saturn", uk: "Сатурн" },
          name: { sk: "Titan", en: "Titan", uk: "Титан" },
          title: { sk: "Titan", en: "Titan", uk: "Титан" },
          subtitle: { sk: "Mesiac s hustou atmosférou", en: "A moon with a thick atmosphere", uk: "Супутник із густою атмосферою" },
          description: { sk: "Najväčší mesiac Saturna je obalený hustou dusíkovou atmosférou a na jeho povrchu sa nachádzajú jazerá metánu a etánu.", en: "Saturn’s largest moon is wrapped in a thick nitrogen atmosphere and has lakes of methane and ethane on its surface.", uk: "Найбільший супутник Сатурна має густу азотну атмосферу та озера метану й етану на поверхні." },
          stats: [
            { label: { sk: "Priemer", en: "Diameter", uk: "Діаметр" }, value: "5 150 km" },
            { label: { sk: "Atmosféra", en: "Atmosphere", uk: "Атмосфера" }, value: { sk: "Dusík + metán", en: "Nitrogen + methane", uk: "Азот + метан" } },
            { label: { sk: "Povrchové jazerá", en: "Surface lakes", uk: "Поверхневі озера" }, value: { sk: "Áno", en: "Yes", uk: "Так" } },
            { label: { sk: "Výskum", en: "Exploration", uk: "Дослідження" }, value: { sk: "Dragonfly (plánovaná)", en: "Dragonfly (planned)", uk: "Dragonfly (планується)" } }
          ],
          render: { kind: "sphere", base: "#c79b64", glow: "#fff2c8", craters: true, atmosphere: true, atmosphereColor: "rgba(255,193,117,.35)" }
        },
        {
          id: "ganymede",
          thumbVariant: "dust",
          thumb: "assets/mesiace.webp",
          tag: { sk: "Jupiter", en: "Jupiter", uk: "Юпітер" },
          name: { sk: "Ganymedes", en: "Ganymede", uk: "Ганімед" },
          title: { sk: "Ganymedes", en: "Ganymede", uk: "Ганімед" },
          subtitle: { sk: "Najväčší mesiac Slnečnej sústavy", en: "The Solar System’s largest moon", uk: "Найбільший супутник Сонячної системи" },
          description: { sk: "Ganymedes je väčší než Merkúr a ako jediný mesiac má vlastné magnetické pole. Jeho povrch je zmesou starých tmavých oblastí a svetlejších pruhov.", en: "Ganymede is larger than Mercury and is the only moon known to have its own magnetic field. Its surface mixes old dark regions with brighter grooved terrain.", uk: "Ганімед більший за Меркурій і єдиний серед супутників має власне магнітне поле. Його поверхня поєднує старі темні області та світлі борознисті ділянки." },
          stats: [
            { label: { sk: "Priemer", en: "Diameter", uk: "Діаметр" }, value: "5 268 km" },
            { label: { sk: "Špecifikum", en: "Special feature", uk: "Особливість" }, value: { sk: "Magnetické pole", en: "Magnetic field", uk: "Магнітне поле" } },
            { label: { sk: "Obeh okolo Jupitera", en: "Orbit around Jupiter", uk: "Оберт навколо Юпітера" }, value: { sk: "7,15 dňa", en: "7.15 days", uk: "7,15 доби" } },
            { label: { sk: "Pod povrchom", en: "Below the surface", uk: "Під поверхнею" }, value: { sk: "Možný slaný oceán", en: "Possible salty ocean", uk: "Можливий солоний океан" } }
          ],
          render: { kind: "sphere", base: "#9e958d", glow: "#eceef2", craters: true, stripes: true, stripeColor: "rgba(216,228,255,.2)" }
        }
      ]
    },
    dwarfs: {
      accent: "#e4d2c3",
      title: { sk: "Trpasličie planéty", en: "Dwarf planets", uk: "Карликові планети" },
      description: {
        sk: "Trpasličie planéty obiehajú Slnko, majú dostatočnú gravitáciu na približne guľový tvar, ale nevyčistili okolie svojej dráhy od ďalších telies.",
        en: "Dwarf planets orbit the Sun and are massive enough to become nearly round, but they have not cleared their orbital neighbourhoods.",
        uk: "Карликові планети обертаються навколо Сонця, мають достатню гравітацію для майже кулястої форми, але не очистили околиці своїх орбіт від інших тіл."
      },
      stats: [
        { value: "5", label: { sk: "oficiálne uznaných trpasličích planét Medzinárodnou astronomickou úniou", en: "official dwarf planets recognised by the International Astronomical Union", uk: "офіційно визнаних карликових планет Міжнародним астрономічним союзом" } },
        { value: { sk: "Ceres až Eris", en: "Ceres to Eris", uk: "Від Церери до Еріди" }, label: { sk: "nachádzajú sa v páse asteroidov aj v Kuiperovom páse", en: "they live in the asteroid belt and the Kuiper belt", uk: "вони розташовані в поясі астероїдів і поясі Койпера" } },
        { value: { sk: "Ľad a horniny", en: "Ice and rock", uk: "Лід і каміння" }, label: { sk: "zloženie závisí od miesta vzniku a teploty", en: "composition depends on where and how they formed", uk: "склад залежить від місця та умов формування" } },
        { value: { sk: "Možné kryovulkány", en: "Possible cryovolcanoes", uk: "Можливі кріовулкани" }, label: { sk: "niektoré povrchy vykazujú mladé geologické štruktúry", en: "some surfaces show young geological features", uk: "деякі поверхні мають молоді геологічні структури" } }
      ],
      facts: [
        { sk: "Ceres je jediná trpasličia planéta vo vnútornom páse asteroidov medzi Marsom a Jupiterom.", en: "Ceres is the only dwarf planet in the inner asteroid belt between Mars and Jupiter.", uk: "Церера — єдина карликова планета у внутрішньому поясі астероїдів між Марсом і Юпітером." },
        { sk: "Haumea má veľmi rýchlu rotáciu a výrazne pretiahnutý tvar.", en: "Haumea spins very fast and has a distinctly elongated shape.", uk: "Хаумеа дуже швидко обертається й має помітно витягнуту форму." },
        { sk: "Pluto má tenkú atmosféru, ktorá sa mení podľa vzdialenosti od Slnka.", en: "Pluto has a thin atmosphere that changes with its distance from the Sun.", uk: "Плутон має тонку атмосферу, що змінюється залежно від відстані до Сонця." }
      ],
      examples: [
        { id: "pluto", thumbVariant: "cold", thumb: "assets/trpaslicie.webp", tag: { sk: "Kuiperov pás", en: "Kuiper belt", uk: "Пояс Койпера" }, name: { sk: "Pluto", en: "Pluto", uk: "Плутон" }, title: { sk: "Pluto", en: "Pluto", uk: "Плутон" }, subtitle: { sk: "Najznámejšia trpasličia planéta", en: "The best-known dwarf planet", uk: "Найвідоміша карликова планета" }, description: { sk: "Pluto má ľadové hory, planiny z dusíkového ľadu a päť známych mesiacov. Sonda New Horizons odhalila prekvapivo pestrý svet.", en: "Pluto features icy mountains, plains of nitrogen ice and five known moons. New Horizons revealed a surprisingly diverse world.", uk: "Плутон має крижані гори, рівнини з азотного льоду та п’ять відомих супутників. Місія New Horizons відкрила напрочуд різноманітний світ." }, stats: [ { label: { sk: "Priemer", en: "Diameter", uk: "Діаметр" }, value: "2 377 km" }, { label: { sk: "Obežná doba", en: "Orbital period", uk: "Період обертання" }, value: { sk: "248 rokov", en: "248 years", uk: "248 років" } }, { label: { sk: "Atmosféra", en: "Atmosphere", uk: "Атмосфера" }, value: { sk: "Veľmi tenká", en: "Very thin", uk: "Дуже тонка" } }, { label: { sk: "Mesiace", en: "Moons", uk: "Супутники" }, value: "5" } ], render: { kind: "sphere", base: "#b38d73", glow: "#f8ead6", craters: true } },
        { id: "ceres", thumbVariant: "dust", thumb: "assets/trpaslicie.webp", tag: { sk: "Pás asteroidov", en: "Asteroid belt", uk: "Пояс астероїдів" }, name: { sk: "Ceres", en: "Ceres", uk: "Церера" }, title: { sk: "Ceres", en: "Ceres", uk: "Церера" }, subtitle: { sk: "Trpasličia planéta medzi asteroidmi", en: "A dwarf planet among asteroids", uk: "Карликова планета серед астероїдів" }, description: { sk: "Ceres je guľaté teleso v hlavnom páse asteroidov. Na jej povrchu sa nachádzajú svetlé usadeniny solí a stopy po vode.", en: "Ceres is a round body in the main asteroid belt. Its surface shows bright salt deposits and evidence of water-related activity.", uk: "Церера — кулясте тіло в головному поясі астероїдів. На її поверхні є яскраві сольові відкладення та сліди водної активності." }, stats: [ { label: { sk: "Priemer", en: "Diameter", uk: "Діаметр" }, value: "940 km" }, { label: { sk: "Objav", en: "Discovery", uk: "Відкриття" }, value: "1801" }, { label: { sk: "Povrch", en: "Surface", uk: "Поверхня" }, value: { sk: "Krátre a soli", en: "Craters and salts", uk: "Кратери та солі" } }, { label: { sk: "Výskum", en: "Exploration", uk: "Дослідження" }, value: "Dawn" } ], render: { kind: "sphere", base: "#8f7c71", glow: "#d9cec6", craters: true } },
        { id: "eris", thumbVariant: "cold", thumb: "assets/trpaslicie.webp", tag: { sk: "Rozptýlený disk", en: "Scattered disc", uk: "Розсіяний диск" }, name: { sk: "Eris", en: "Eris", uk: "Еріда" }, title: { sk: "Eris", en: "Eris", uk: "Еріда" }, subtitle: { sk: "Masívny ľadový svet ďaleko od Slnka", en: "A massive icy world far from the Sun", uk: "Масивний крижаний світ далеко від Сонця" }, description: { sk: "Eris je jedna z najhmotnejších trpasličích planét. Leží ďaleko za obežnou dráhou Pluta a má malý mesiac Dysnomia.", en: "Eris is one of the most massive dwarf planets. It lies far beyond Pluto and has a small moon called Dysnomia.", uk: "Еріда — одна з наймасивніших карликових планет. Вона розташована далеко за орбітою Плутона та має малий супутник Дисномію." }, stats: [ { label: { sk: "Priemer", en: "Diameter", uk: "Діаметр" }, value: "2 326 km" }, { label: { sk: "Obežná doba", en: "Orbital period", uk: "Період обертання" }, value: { sk: "558 rokov", en: "558 years", uk: "558 років" } }, { label: { sk: "Povrch", en: "Surface", uk: "Поверхня" }, value: { sk: "Ľadový", en: "Icy", uk: "Крижаний" } }, { label: { sk: "Mesiac", en: "Moon", uk: "Супутник" }, value: "Dysnomia" } ], render: { kind: "sphere", base: "#d7dfe6", glow: "#ffffff" } },
        { id: "haumea", thumbVariant: "warm", thumb: "assets/trpaslicie.webp", tag: { sk: "Rýchla rotácia", en: "Fast spin", uk: "Швидке обертання" }, name: { sk: "Haumea", en: "Haumea", uk: "Хаумеа" }, title: { sk: "Haumea", en: "Haumea", uk: "Хаумеа" }, subtitle: { sk: "Pretiahnutá a veľmi rýchla", en: "Elongated and very fast", uk: "Витягнута й дуже швидка" }, description: { sk: "Haumea rotuje tak rýchlo, že má sploštený, pretiahnutý tvar. Okolo nej sa nachádza prstenec a dva známe mesiace.", en: "Haumea rotates so quickly that it has a flattened, elongated shape. It also has a ring and two known moons.", uk: "Хаумеа обертається настільки швидко, що має сплющену витягнуту форму. Навколо неї є кільце та два відомі супутники." }, stats: [ { label: { sk: "Tvar", en: "Shape", uk: "Форма" }, value: { sk: "Pretiahnutý elipsoid", en: "Elongated ellipsoid", uk: "Витягнутий еліпсоїд" } }, { label: { sk: "Rotácia", en: "Rotation", uk: "Обертання" }, value: { sk: "~4 hodiny", en: "~4 hours", uk: "~4 години" } }, { label: { sk: "Prstenec", en: "Ring", uk: "Кільце" }, value: { sk: "Áno", en: "Yes", uk: "Так" } }, { label: { sk: "Mesiace", en: "Moons", uk: "Супутники" }, value: "2" } ], render: { kind: "haumea", base: "#eee3d6", glow: "#fff8ef", ring: true } },
        { id: "makemake", thumbVariant: "warm", thumb: "assets/trpaslicie.webp", tag: { sk: "Kuiperov pás", en: "Kuiper belt", uk: "Пояс Койпера" }, name: { sk: "Makemake", en: "Makemake", uk: "Макемаке" }, title: { sk: "Makemake", en: "Makemake", uk: "Макемаке" }, subtitle: { sk: "Červenohnedý svet s metánovým ľadom", en: "A reddish world with methane ice", uk: "Червоно-бурий світ із метановим льодом" }, description: { sk: "Makemake patrí medzi najväčšie objekty Kuiperovho pásu. Jeho povrch je pokrytý ľadom z metánu a možno etánu.", en: "Makemake is one of the largest objects in the Kuiper belt. Its surface is covered with methane ice and perhaps ethane.", uk: "Макемаке — один із найбільших об’єктів у поясі Койпера. Його поверхня вкрита метановим льодом і, можливо, етаном." }, stats: [ { label: { sk: "Priemer", en: "Diameter", uk: "Діаметр" }, value: "1 430 km" }, { label: { sk: "Farba", en: "Colour", uk: "Колір" }, value: { sk: "Červenkastá", en: "Reddish", uk: "Червоно-бура" } }, { label: { sk: "Objav", en: "Discovery", uk: "Відкриття" }, value: "2005" }, { label: { sk: "Mesiac", en: "Moon", uk: "Супутник" }, value: { sk: "1 potvrdený", en: "1 confirmed", uk: "1 підтверджений" } } ], render: { kind: "sphere", base: "#b27456", glow: "#f8d8bc", craters: true } }
      ]
    },
    asteroids: {
      accent: "#d9c1a8",
      title: { sk: "Asteroidy", en: "Asteroids", uk: "Астероїди" },
      description: {
        sk: "Asteroidy sú pozostatky z obdobia vzniku planét. Väčšina sa nachádza v hlavnom páse medzi Marsom a Jupiterom, no niektoré križujú dráhu Zeme alebo obiehajú blízko Slnka.",
        en: "Asteroids are leftovers from the era of planet formation. Most live in the main belt between Mars and Jupiter, while some cross Earth’s orbit or travel much closer to the Sun.",
        uk: "Астероїди — це залишки епохи формування планет. Більшість міститься в головному поясі між Марсом і Юпітером, але деякі перетинають орбіту Землі або підходять набагато ближче до Сонця."
      },
      stats: [
        { value: { sk: "Milióny telies", en: "Millions of bodies", uk: "Мільйони тіл" }, label: { sk: "od veľkých protoplanét po drobné kamenné úlomky", en: "from large protoplanets to tiny rocky fragments", uk: "від великих протопланет до дрібних кам’яних уламків" } },
        { value: { sk: "Hlavný pás", en: "Main belt", uk: "Головний пояс" }, label: { sk: "najhustejšia populácia asteroidov je medzi Marsom a Jupiterom", en: "the densest asteroid population lies between Mars and Jupiter", uk: "найщільніша популяція астероїдів лежить між Марсом і Юпітером" } },
        { value: { sk: "Kontakt s misiami", en: "Visited by missions", uk: "Відвідані місіями" }, label: { sk: "Dawn, NEAR Shoemaker, OSIRIS-REx a ďalšie", en: "Dawn, NEAR Shoemaker, OSIRIS-REx and more", uk: "Dawn, NEAR Shoemaker, OSIRIS-REx та інші" } },
        { value: { sk: "Skladba", en: "Composition", uk: "Склад" }, label: { sk: "kremičitany, kovy, uhlíkatý materiál aj ľad", en: "silicates, metals, carbon-rich material and even ice", uk: "силікати, метали, вуглецевий матеріал і навіть лід" } }
      ],
      facts: [
        { sk: "Vesta je natoľko veľká a diferencovaná, že sa správa takmer ako malá planéta.", en: "Vesta is so large and differentiated that it behaves almost like a small planet.", uk: "Веста настільки велика й диференційована, що майже поводиться як мала планета." },
        { sk: "Bennu je objekt blízky Zemi, z ktorého sonda OSIRIS-REx priniesla vzorky na Zem.", en: "Bennu is a near-Earth object from which OSIRIS-REx returned samples to Earth.", uk: "Бенну — навколоземний об’єкт, з якого місія OSIRIS-REx доставила зразки на Землю." },
        { sk: "Niektoré asteroidy majú sprievodné mesiace alebo sú dvojteliesne systémy.", en: "Some asteroids have small moons or even form binary systems.", uk: "Деякі астероїди мають супутники або навіть утворюють подвійні системи." }
      ],
      examples: [
        { id: "vesta", thumbVariant: "dust", thumb: "assets/asteroidy.webp", tag: { sk: "Hlavný pás", en: "Main belt", uk: "Головний пояс" }, name: { sk: "Vesta", en: "Vesta", uk: "Веста" }, title: { sk: "Vesta", en: "Vesta", uk: "Веста" }, subtitle: { sk: "Jedno z najväčších telies hlavného pásu", en: "One of the largest main-belt bodies", uk: "Одне з найбільших тіл головного поясу" }, description: { sk: "Vesta má obrovské impaktné panvy a diferencované vnútro. Sonda Dawn zmapovala jej povrch v detailoch.", en: "Vesta has giant impact basins and a differentiated interior. The Dawn mission mapped its surface in detail.", uk: "Веста має величезні ударні басейни та диференційоване внутрішнє ядро. Місія Dawn детально дослідила її поверхню." }, stats: [ { label: { sk: "Priemer", en: "Diameter", uk: "Діаметр" }, value: "525 km" }, { label: { sk: "Typ", en: "Type", uk: "Тип" }, value: { sk: "Skalnatý", en: "Rocky", uk: "Кам’янистий" } }, { label: { sk: "Impaktné panvy", en: "Impact basins", uk: "Ударні басейни" }, value: { sk: "Áno, veľmi výrazné", en: "Yes, very prominent", uk: "Так, дуже виразні" } }, { label: { sk: "Misia", en: "Mission", uk: "Місія" }, value: "Dawn" } ], render: { kind: "sphere", base: "#8c857c", glow: "#e8ded0", craters: true } },
        { id: "eros", thumbVariant: "warm", thumb: "assets/asteroidy.webp", tag: { sk: "Blízkozemský objekt", en: "Near-Earth object", uk: "Навколоземний об’єкт" }, name: { sk: "Eros", en: "Eros", uk: "Ерос" }, title: { sk: "Eros", en: "Eros", uk: "Ерос" }, subtitle: { sk: "Pretiahnutý asteroid v tvare zemiaka", en: "An elongated, potato-shaped asteroid", uk: "Витягнутий астероїд «картопляної» форми" }, description: { sk: "Eros je pretiahnuté teleso, ktoré navštívila sonda NEAR Shoemaker a napokon na ňom pristála.", en: "Eros is an elongated body visited by NEAR Shoemaker, which eventually landed on it.", uk: "Ерос — витягнуте тіло, яке дослідила місія NEAR Shoemaker і зрештою здійснила на ньому посадку." }, stats: [ { label: { sk: "Rozmery", en: "Dimensions", uk: "Розміри" }, value: "34 × 11 km" }, { label: { sk: "Tvar", en: "Shape", uk: "Форма" }, value: { sk: "Pretiahnutý", en: "Elongated", uk: "Витягнутий" } }, { label: { sk: "Misia", en: "Mission", uk: "Місія" }, value: "NEAR Shoemaker" }, { label: { sk: "Povrch", en: "Surface", uk: "Поверхня" }, value: { sk: "Balvany a krátery", en: "Boulders and craters", uk: "Валуни й кратери" } } ], render: { kind: "asteroid", base: "#9b7a59", glow: "#eed5b5", craters: true } },
        { id: "bennu", thumbVariant: "tail", thumb: "assets/asteroidy.webp", tag: { sk: "Vzorky na Zemi", en: "Samples on Earth", uk: "Зразки на Землі" }, name: { sk: "Bennu", en: "Bennu", uk: "Бенну" }, title: { sk: "Bennu", en: "Bennu", uk: "Бенну" }, subtitle: { sk: "Aktívny objekt bohatý na uhlík", en: "A carbon-rich active object", uk: "Вуглецевий активний об’єкт" }, description: { sk: "Bennu je tmavý uhlíkatý asteroid s voľne naviazaným povrchovým materiálom. Sonda OSIRIS-REx priniesla jeho vzorky v roku 2023 na Zem.", en: "Bennu is a dark carbon-rich asteroid with a loosely bound surface. OSIRIS-REx returned samples from it to Earth in 2023.", uk: "Бенну — темний вуглецевий астероїд із пухкою поверхнею. Місія OSIRIS-REx доставила його зразки на Землю у 2023 році." }, stats: [ { label: { sk: "Priemer", en: "Diameter", uk: "Діаметр" }, value: "~490 m" }, { label: { sk: "Skladba", en: "Composition", uk: "Склад" }, value: { sk: "Uhlíkatá", en: "Carbon-rich", uk: "Вуглецева" } }, { label: { sk: "Povrch", en: "Surface", uk: "Поверхня" }, value: { sk: "Voľné kamene", en: "Loose boulders", uk: "Пухкі валуни" } }, { label: { sk: "Misia", en: "Mission", uk: "Місія" }, value: "OSIRIS-REx" } ], render: { kind: "asteroid", base: "#5b544d", glow: "#d5cbc0", diamond: true } }
      ]
    },
    comets: {
      accent: "#cce6ff",
      title: { sk: "Kométy", en: "Comets", uk: "Комети" },
      description: {
        sk: "Kométy sú krehké telesá bohaté na ľad a prchavé látky. Keď sa priblížia k Slnku, zahrievajú sa a vytvárajú komu a žiarivé chvosty.",
        en: "Comets are fragile bodies rich in ice and volatile compounds. As they approach the Sun, they warm up and produce comae and luminous tails.",
        uk: "Комети — крихкі тіла, багаті на лід і леткі речовини. Коли вони наближаються до Сонця, нагріваються й утворюють кому та яскраві хвости."
      },
      stats: [
        { value: { sk: "Krátkoperiodické aj dlhoperiodické", en: "Short- and long-period", uk: "Коротко- й довгоперіодичні" }, label: { sk: "niektoré sa vracajú často, iné iba raz za tisícročia", en: "some return often, others only once in millennia", uk: "деякі повертаються часто, інші — лише раз на тисячоліття" } },
        { value: { sk: "Dva hlavné chvosty", en: "Two main tails", uk: "Два основні хвости" }, label: { sk: "prachový a iónový, vždy smerujú od jadra do priestoru", en: "dust and ion tails stream away from the nucleus", uk: "пиловий та іонний хвости простягаються від ядра" } },
        { value: { sk: "Oortov oblak a Kuiperov pás", en: "Oort Cloud and Kuiper Belt", uk: "Хмара Оорта й пояс Койпера" }, label: { sk: "hlavné zásobárne komét na okrajoch sústavy", en: "the main comet reservoirs at the Solar System’s edges", uk: "головні резервуари комет на краях системи" } },
        { value: { sk: "Rosetta, Giotto, Deep Impact", en: "Rosetta, Giotto, Deep Impact", uk: "Rosetta, Giotto, Deep Impact" }, label: { sk: "misie, ktoré kométy skúmali zblízka", en: "missions that explored comets up close", uk: "місії, що вивчали комети зблизька" } }
      ],
      facts: [
        { sk: "Kométne chvosty nesmerujú „za“ kométu, ale od Slnka – vytvára ich slnečný vietor a tlak žiarenia.", en: "Comet tails do not point behind the comet – they point away from the Sun due to solar wind and radiation pressure.", uk: "Хвости комет не тягнуться просто «позаду» них — вони спрямовані від Сонця завдяки сонячному вітру та тиску випромінювання." },
        { sk: "Jadro kométy je zmes ľadu, prachu a tmavého organického materiálu.", en: "A comet nucleus is a mixture of ice, dust and dark organic material.", uk: "Ядро комети — це суміш льоду, пилу та темного органічного матеріалу." },
        { sk: "Niektoré kométy sa po mnohých návratoch rozpadnú alebo sa zmenia na menej aktívne telesá.", en: "Some comets break apart or become much less active after many returns.", uk: "Деякі комети після багатьох повернень розпадаються або стають значно менш активними." }
      ],
      examples: [
        { id: "halley", thumbVariant: "tail", thumb: "assets/komety.webp", tag: { sk: "Periodická", en: "Periodic", uk: "Періодична" }, name: { sk: "Halleyova kométa", en: "Halley’s Comet", uk: "Комета Галлея" }, title: { sk: "Halleyova kométa", en: "Halley’s Comet", uk: "Комета Галлея" }, subtitle: { sk: "Najslávnejšia periodická kométa", en: "The most famous periodic comet", uk: "Найвідоміша періодична комета" }, description: { sk: "Halleyova kométa sa vracia približne každých 76 rokov. Ľudia ju pozorujú už tisícročia a bola cieľom misie Giotto.", en: "Halley’s Comet returns roughly every 76 years. People have observed it for millennia and it was visited by the Giotto mission.", uk: "Комета Галлея повертається приблизно кожні 76 років. Люди спостерігають її тисячоліттями, а місія Giotto дослідила її зблизька." }, stats: [ { label: { sk: "Perióda", en: "Period", uk: "Період" }, value: { sk: "~76 rokov", en: "~76 years", uk: "~76 років" } }, { label: { sk: "Pôvod", en: "Origin", uk: "Походження" }, value: { sk: "Krátkoperiodická", en: "Short-period", uk: "Короткоперіодична" } }, { label: { sk: "Pozorovanie", en: "Observation", uk: "Спостереження" }, value: { sk: "Voľným okom", en: "Visible to the naked eye", uk: "Видима неозброєним оком" } }, { label: { sk: "Misia", en: "Mission", uk: "Місія" }, value: "Giotto" } ], render: { kind: "comet", base: "#c5cad1", glow: "#ffffff", tail: "#bcd9ff" } },
        { id: "halebopp", thumbVariant: "tail", thumb: "assets/komety.webp", tag: { sk: "Veľmi jasná", en: "Very bright", uk: "Дуже яскрава" }, name: { sk: "Hale–Bopp", en: "Hale–Bopp", uk: "Гейла—Боппа" }, title: { sk: "Hale–Bopp", en: "Hale–Bopp", uk: "Гейла—Боппа" }, subtitle: { sk: "Veľkolepá kométa 90. rokov", en: "The spectacular comet of the 1990s", uk: "Вражаюча комета 1990-х" }, description: { sk: "Kométa Hale–Bopp bola mimoriadne jasná a viditeľná celé mesiace. Preslávila sa mohutným prachovým aj iónovým chvostom.", en: "Comet Hale–Bopp was exceptionally bright and visible for months. It became famous for its prominent dust and ion tails.", uk: "Комета Гейла—Боппа була надзвичайно яскравою та видимою протягом місяців. Вона прославилася потужним пиловим та іонним хвостами." }, stats: [ { label: { sk: "Najväčšia sláva", en: "Peak fame", uk: "Пік слави" }, value: "1997" }, { label: { sk: "Chvosty", en: "Tails", uk: "Хвости" }, value: { sk: "Prachový aj iónový", en: "Dust and ion", uk: "Пиловий та іонний" } }, { label: { sk: "Viditeľnosť", en: "Visibility", uk: "Видимість" }, value: { sk: "Mimoriadne dobrá", en: "Exceptional", uk: "Виняткова" } }, { label: { sk: "Perióda", en: "Period", uk: "Період" }, value: { sk: "Veľmi dlhá", en: "Very long", uk: "Дуже довгий" } } ], render: { kind: "comet", base: "#d6dfef", glow: "#ffffff", tail: "#fff4d4", secondTail: "#9fd0ff" } },
        { id: "67p", thumbVariant: "tail", thumb: "assets/komety.webp", tag: { sk: "Rosetta", en: "Rosetta", uk: "Rosetta" }, name: { sk: "67P/Čurjumov–Gerasimenko", en: "67P/Churyumov–Gerasimenko", uk: "67P/Чурюмова—Герасименко" }, title: { sk: "67P/Čurjumov–Gerasimenko", en: "67P/Churyumov–Gerasimenko", uk: "67P/Чурюмова—Герасименко" }, subtitle: { sk: "„Gumová kačička“ komét", en: "The “rubber duck” comet", uk: "«Гумова качечка» серед комет" }, description: { sk: "Túto kométu preslávila misia Rosetta a lander Philae. Jej jadro má dva spojené laloky a výrazne nepravidelný tvar.", en: "This comet became famous thanks to Rosetta and the Philae lander. Its nucleus has two connected lobes and a very irregular shape.", uk: "Цю комету прославили місія Rosetta та апарат Philae. Її ядро має дві з’єднані частки та дуже нерівну форму." }, stats: [ { label: { sk: "Tvar jadra", en: "Nucleus shape", uk: "Форма ядра" }, value: { sk: "Dvojlaločné", en: "Bilobed", uk: "Дволопатеве" } }, { label: { sk: "Misia", en: "Mission", uk: "Місія" }, value: "Rosetta / Philae" }, { label: { sk: "Aktivita", en: "Activity", uk: "Активність" }, value: { sk: "Výtrysky plynu a prachu", en: "Gas and dust jets", uk: "Струмені газу й пилу" } }, { label: { sk: "Typ", en: "Type", uk: "Тип" }, value: { sk: "Krátkoperiodická", en: "Short-period", uk: "Короткоперіодична" } } ], render: { kind: "duck-comet", base: "#8d857a", glow: "#ece8e1", tail: "#bad6ff" } }
      ]
    }
  };

  const interactiveCards = Array.from(document.querySelectorAll("[data-space-category]"));
  const objectModal = document.getElementById("object-modal");
  if (!interactiveCards.length || !objectModal) return;

  const objectModalClose = document.getElementById("object-modal-close");
  const objectModalKicker = document.getElementById("object-modal-kicker");
  const objectModalEyebrow = document.getElementById("object-modal-eyebrow");
  const objectModalTitle = document.getElementById("object-modal-title");
  const objectModalDescription = document.getElementById("object-modal-description");
  const objectModalFactsTitle = document.getElementById("object-modal-facts-title");
  const objectModalFactsList = document.getElementById("object-modal-facts-list");
  const objectModalStats = document.getElementById("object-modal-stats");
  const objectModalExamplesTitle = document.getElementById("object-modal-examples-title");
  const objectModalExamplesText = document.getElementById("object-modal-examples-text");
  const objectModalSelection = document.getElementById("object-modal-selection");
  const objectModalExampleGrid = document.getElementById("object-modal-example-grid");
  const objectModalCurrentType = document.getElementById("object-modal-current-type");
  const objectModalCurrentName = document.getElementById("object-modal-current-name");
  const objectModalCurrentDescription = document.getElementById("object-modal-current-description");
  const objectModalDetailStats = document.getElementById("object-modal-detail-stats");
  const objectModalStageLabel = document.querySelector(".object-modal-stage-label");
  const objectModalStageHint = document.getElementById("object-modal-stage-hint");
  const objectModalCanvas = document.getElementById("object-modal-canvas");
  const objectModalContext = objectModalCanvas.getContext("2d");
  const readyMaps = new Map();
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let lastFrame = 0, lastView = "";
  function loadExample(id) {
    if (readyMaps.has(id)) return;
    readyMaps.set(id, null);
    SpaceObjectRenderer.load(id).then(map => { readyMaps.set(id, map); lastView = ""; }).catch(() => { readyMaps.set(id, false); lastView = ""; });
  }
  const objectModalZoomIn = document.getElementById("object-modal-zoom-in");
  const objectModalZoomOut = document.getElementById("object-modal-zoom-out");
  const objectModalReset = document.getElementById("object-modal-reset");
  const objectModalControls = document.querySelector(".object-modal-controls");

  const state = {
    categoryId: "moons",
    exampleId: "moon",
    rotation: 0.22,
    tilt: -0.18,
    zoom: 1,
    dragging: false,
    pointerId: null,
    lastX: 0,
    lastY: 0,
    animation: 0,
    pinch: null,
    stars: Array.from({ length: 160 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.6 + 0.3, a: Math.random() * 0.7 + 0.25 }))
  };

  function lang() {
    return document.documentElement.lang || "sk";
  }
  function pick(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) return value[lang()] ?? value.sk ?? "";
    return value ?? "";
  }
  function ui(key) {
    return pick(spaceUiText[key]);
  }
  function currentCategory() {
    return spaceCategories[state.categoryId] || spaceCategories.moons;
  }
  function currentExample() {
    return currentCategory().examples.find((item) => item.id === state.exampleId) || currentCategory().examples[0];
  }
  function resetView() {
    state.rotation = 0.22;
    state.tilt = -0.18;
    state.zoom = 1;
  }

  function updateStaticTexts() {
    objectModalKicker.textContent = ui("categoryLabel");
    objectModalEyebrow.textContent = ui("categoryOverview");
    objectModalFactsTitle.textContent = ui("interestingFacts");
    objectModalExamplesTitle.textContent = ui("examplesTitle");
    objectModalExamplesText.textContent = ui("examplesText");
    objectModalCurrentType.textContent = ui("selectedObject");
    objectModalStageLabel.textContent = ({sk:"Ilustračný 3D model",en:"Illustrative 3D model",uk:"Ілюстративна 3D-модель"})[lang()];
    objectModalStageHint.textContent = ui("modelHint");
    objectModalZoomIn.setAttribute("aria-label", ui("zoomIn"));
    objectModalZoomOut.setAttribute("aria-label", ui("zoomOut"));
    objectModalReset.textContent = ui("resetView");
    objectModalClose.setAttribute("aria-label", ui("closeWindow"));
    objectModalClose.innerHTML = `✕ ${ui("close")}`;
    objectModalCanvas.setAttribute("aria-label", ui("interactiveModel"));
    objectModalControls.setAttribute("aria-label", ui("modelControls"));
    interactiveCards.forEach((card) => {
      const title = card.querySelector("h3")?.textContent?.trim() || "";
      card.setAttribute("aria-label", `${ui("openCategoryCard")}: ${title}`);
      const cta = card.querySelector(".solar-card-cta");
      if (cta) cta.innerHTML = `${ui("exploreCategory")} <span aria-hidden="true">→</span>`;
    });
  }

  function renderCategory(categoryId) {
    state.categoryId = categoryId in spaceCategories ? categoryId : "moons";
    const category = currentCategory();
    if (!category.examples.some((item) => item.id === state.exampleId)) state.exampleId = category.examples[0].id;
    objectModalTitle.textContent = pick(category.title);
    objectModalDescription.textContent = pick(category.description);
    objectModalStats.innerHTML = category.stats.map((stat) => `
      <div class="object-modal-stat">
        <span class="object-modal-stat-value">${pick(stat.value)}</span>
        <span class="object-modal-stat-label">${pick(stat.label)}</span>
      </div>`).join("");
    objectModalFactsList.innerHTML = category.facts.map((fact) => `<li>${pick(fact)}</li>`).join("");
    renderExampleGrid();
    renderExampleDetails();
  }

  function renderExampleGrid() {
    const category = currentCategory();
    objectModalExampleGrid.innerHTML = category.examples.map((example) => `
      <button class="object-example-card ${example.id === state.exampleId ? "is-active" : ""}" type="button" aria-pressed="${example.id === state.exampleId}" data-example-id="${example.id}">
        <div class="object-example-thumb" style="--thumb-image:url('assets/objects/${example.id}.webp');">
          <span class="object-example-tag">${pick(example.tag)}</span>
        </div>
        <strong>${pick(example.name)}</strong>
        <p>${pick(example.subtitle)}</p>
      </button>`).join("");
    objectModalExampleGrid.querySelectorAll("[data-example-id]").forEach((button) => {
      button.addEventListener("click", () => {
        state.exampleId = button.dataset.exampleId;
        resetView();
        renderExampleGrid();
        objectModalExampleGrid.querySelector(`[data-example-id="${state.exampleId}"]`).focus({preventScroll:true});
        renderExampleDetails();
      });
    });
  }

  function renderExampleDetails() {
    const example = currentExample();
    loadExample(example.id);
    objectModalSelection.textContent = pick(example.name);
    objectModalCurrentName.textContent = pick(example.title);
    objectModalCurrentDescription.textContent = pick(example.description);
    objectModalDetailStats.innerHTML = example.stats.map((stat) => `<div><dt>${pick(stat.label)}</dt><dd>${pick(stat.value)}</dd></div>`).join("");
  }

  function openCategory(categoryId) {
    const category = spaceCategories[categoryId] || spaceCategories.moons;
    state.categoryId = categoryId in spaceCategories ? categoryId : "moons";
    state.exampleId = category.examples[0].id;
    resetView();
    updateStaticTexts();
    renderCategory(state.categoryId);
    if (!objectModal.open) objectModal.showModal();
    startAnimation();
  }
  function closeModal() {
    if (objectModal.open) objectModal.close();
    stopAnimation();
    state.dragging = false;
    state.pointerId = null;
    state.pinch = null;
    objectModalCanvas.classList.remove("is-dragging");
  }

  interactiveCards.forEach((card) => {
    card.addEventListener("click", () => openCategory(card.dataset.spaceCategory));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openCategory(card.dataset.spaceCategory);
      }
    });
  });
  objectModalClose.addEventListener("click", closeModal);
  objectModal.addEventListener("cancel", (event) => { event.preventDefault(); closeModal(); });
  objectModal.addEventListener("click", (event) => { if (event.target === objectModal) closeModal(); });
  objectModalZoomIn.addEventListener("click", () => { state.zoom = Math.min(2.8, state.zoom + 0.14); });
  objectModalZoomOut.addEventListener("click", () => { state.zoom = Math.max(0.65, state.zoom - 0.14); });
  objectModalReset.addEventListener("click", resetView);

  function drawBackground(ctx, width, height, accent, time) {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#09101d");
    gradient.addColorStop(1, "#121e37");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    const glow = ctx.createRadialGradient(width * 0.3, height * 0.18, 0, width * 0.3, height * 0.18, width * 0.42);
    glow.addColorStop(0, `${accent}44`);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
    state.stars.forEach((star, index) => {
      const alpha = star.a * (0.8 + Math.sin(time * 0.001 + index) * 0.15);
      ctx.fillStyle = `rgba(235,243,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(star.x * width, star.y * height, star.r * Math.max(1, Math.min(width, height) / 720), 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.strokeStyle = "rgba(173, 196, 255, .12)";
    ctx.lineWidth = 1.1;
    ctx.beginPath(); ctx.ellipse(width * 0.5, height * 0.54, width * 0.34, height * 0.22, -0.4, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(width * 0.48, height * 0.52, width * 0.22, height * 0.12, 0.55, 0, Math.PI * 2); ctx.stroke();
  }

  // Render only while the dialog is open; redraw on demand when motion is disabled.
  function renderCanvas(time = 0) {
    state.animation = 0;
    if (!objectModal.open || !objectModalContext) return;
    state.animation = requestAnimationFrame(renderCanvas);
    const rect = objectModalCanvas.getBoundingClientRect();
    const size = Math.max(200, Math.min(640, Math.round(rect.width * Math.min(devicePixelRatio || 1, 1.5))));
    const example = currentExample();
    const motion = !reducedMotion.matches && document.documentElement.classList.contains("motion-enabled");
    if (time - lastFrame < 33) return;
    if (motion && !state.dragging && !state.pinch) state.rotation += Math.min(time-lastFrame, 70)*.00024;
    lastFrame = time;
    const key = [size,example.id,state.rotation,state.tilt,state.zoom,!!readyMaps.get(example.id),lang()].join("|");
    if (key === lastView) return;
    lastView = key;
    if (objectModalCanvas.width !== size || objectModalCanvas.height !== size) objectModalCanvas.width = objectModalCanvas.height = size;
    drawBackground(objectModalContext,size,size,currentCategory().accent,0);
    const map = readyMaps.get(example.id);
    if (map) SpaceObjectRenderer.render(objectModalContext,example.id,map,size,size,state.rotation,state.tilt,state.zoom);
    else {
      objectModalContext.fillStyle = "#d8e4fb"; objectModalContext.font = "16px system-ui"; objectModalContext.textAlign = "center";
      objectModalContext.fillText((map===false?{sk:"Model nie je dostupný",en:"Model unavailable",uk:"Модель недоступна"}:{sk:"Načítavam model…",en:"Loading model…",uk:"Завантаження моделі…"})[lang()],size/2,size/2);
    }
  }
  function startAnimation() {
    lastView = "";
    if (!state.animation && objectModalContext) state.animation = requestAnimationFrame(renderCanvas);
  }
  function stopAnimation() {
    if (state.animation) cancelAnimationFrame(state.animation);
    state.animation = 0;
  }

  objectModalCanvas.addEventListener("wheel", (event) => {
    if (!objectModal.open) return;
    event.preventDefault();
    state.zoom = Math.max(0.65, Math.min(2.8, state.zoom + (event.deltaY < 0 ? 0.1 : -0.1)));
  }, { passive: false });
  objectModalCanvas.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || state.dragging) return;
    state.dragging = true;
    state.pointerId = event.pointerId;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    objectModalCanvas.classList.add("is-dragging");
    objectModalCanvas.setPointerCapture(event.pointerId);
  });
  objectModalCanvas.addEventListener("pointermove", (event) => {
    if (!state.dragging || state.pointerId !== event.pointerId || state.pinch) return;
    const dx = event.clientX - state.lastX;
    const dy = event.clientY - state.lastY;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    state.rotation += dx * 0.01;
    state.tilt = Math.max(-0.9, Math.min(0.9, state.tilt + dy * 0.004));
  });
  function finishPointer(event) {
    if (state.pointerId !== event.pointerId) return;
    state.dragging = false;
    state.pointerId = null;
    objectModalCanvas.classList.remove("is-dragging");
  }
  objectModalCanvas.addEventListener("pointerup", finishPointer);
  objectModalCanvas.addEventListener("pointercancel", finishPointer);
  objectModalCanvas.addEventListener("lostpointercapture", finishPointer);
  objectModalCanvas.addEventListener("keydown", (event) => {
    if (["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","+","=","-","_","r","R"].includes(event.key)) event.preventDefault();
    if (event.key === "ArrowLeft") state.rotation -= 0.15;
    if (event.key === "ArrowRight") state.rotation += 0.15;
    if (event.key === "ArrowUp") state.tilt = Math.max(-0.9, state.tilt - 0.08);
    if (event.key === "ArrowDown") state.tilt = Math.min(0.9, state.tilt + 0.08);
    if (event.key === "+" || event.key === "=") state.zoom = Math.min(2.8, state.zoom + 0.1);
    if (event.key === "-" || event.key === "_") state.zoom = Math.max(0.65, state.zoom - 0.1);
    if (event.key.toLowerCase() === "r") resetView();
  });
  objectModalCanvas.addEventListener("touchstart", (event) => {
    if (event.touches.length !== 2) return;
    const [a, b] = event.touches;
    state.pinch = { distance: Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY), zoom: state.zoom };
  }, { passive: true });
  objectModalCanvas.addEventListener("touchmove", (event) => {
    if (!state.pinch || event.touches.length !== 2) return;
    event.preventDefault();
    const [a, b] = event.touches;
    const distance = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
    state.zoom = Math.max(0.65, Math.min(2.8, state.pinch.zoom * (distance / state.pinch.distance)));
  }, { passive: false });
  window.addEventListener("touchend", () => { state.pinch = null; }, { passive: true });
  window.addEventListener("touchcancel", () => { state.pinch = null; }, { passive: true });
  window.addEventListener("resize", () => { if (objectModal.open) startAnimation(); });

  document.addEventListener("vesmir:language", () => {
    updateStaticTexts();
    if (objectModal.open) renderCategory(state.categoryId);
  });
  objectModal.addEventListener("close", stopAnimation);
  updateStaticTexts();
})();

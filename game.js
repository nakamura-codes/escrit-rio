/* HELLWARD | Vanilla JS | GitHub Pages / file:// compatible.
   All game data is embedded locally; no dependencies, network requests or backend. */
(() => {
  'use strict';

  const SAVE_VERSION = 2;
  const ENEMIES_PER_PHASE = 10;
  const PHASES_PER_ZONE = 10;
  const PROFILE_INDEX_KEY = 'cinzas_profiles_v1';
  const SAVE_PREFIX = 'cinzas_save_v1_';
  const MAX_NUMBER = 1e250;
  const MAX_LEVEL = 1500;
  const MAX_RANK = 800;
  const MAX_INVENTORY = 80;
  const MAX_OFFLINE_SECONDS = 12 * 60 * 60;
  const MAX_OFFLINE_KILLS = 30000;
  const SAVE_INTERVAL = 10000;
  const TABS = new Set(['upgrades', 'inventory', 'zones', 'ascension']);
  const SLOTS = ['weapon', 'armor', 'ring', 'relic'];
  const SLOT_NAMES = { weapon: 'Arma', armor: 'Armadura', ring: 'Anel', relic: 'Relíquia' };
  const SLOT_SYMBOLS = { weapon: '⚔', armor: '♜', ring: '◉', relic: '✧' };
  const RARITIES = [
    {id: 'comum', label: 'Comum', multiplier: 1},
    {id: 'incomum', label: 'Incomum', multiplier: 1.35},
    {id: 'raro', label: 'Raro', multiplier: 1.95},
    {id: 'epico', label: 'Épico', multiplier: 3},
    {id: 'lendario', label: 'Lendário', multiplier: 5}
  ];
  const ZONES = [
    {name: 'Campos de Cinza', subtitle: 'Onde os primeiros condenados despertam.', names: ['Condenado Errante', 'Guerreiro Esquelético', 'Sentinela Caída', 'Arqueiro Macabro', 'Zumbi Errante'], miniboss:'Espadachim Corrompido', boss:'Cavaleiro Decapitado', level: 1, kills: 0, rune: 'I', art: 'skeleton'},
    {name: 'Bosque Profanado', subtitle: 'Raízes antigas escondem fome e maldição.', names: ['Lobo Sombrio', 'Ratazana Pestilenta', 'Lobo da Praga', 'Entorpecido de Musgo', 'Goblin Selvagem'], miniboss:'Rei das Ratazanas', boss:'Hidra Profanada', level: 5, kills: 20, rune: 'II', art: 'beast'},
    {name: 'Criptas Afogadas', subtitle: 'Os ecos dos esquecidos nunca se calam.', names: ['Espectro da Cripta', 'Alma Enregelada', 'Lamento Submerso', 'Afogado Sem Rosto', 'Sacerdote Esquecido'], miniboss:'Bruxa das Criptas', boss:'Rei Lich', level: 12, kills: 65, rune: 'III', art: 'wraith'},
    {name: 'Fortaleza de Ferro', subtitle: 'O aço morto ainda guarda seus segredos.', names: ['Golem Ferrugem', 'Carcereiro Rúnico', 'Guardião de Basalto', 'Orc Carniceiro', 'Construto Enferrujado'], miniboss:'Ogro do Ferro', boss:'Cavaleiro do Abismo', level: 23, kills: 150, rune: 'IV', art: 'golem'},
    {name: 'Fendas Infernais', subtitle: 'Onde os pactos são escritos em brasas.', names: ['Arauto das Chamas', 'Demônio Carmesim', 'Flagelo Abissal', 'Súcubo das Cinzas', 'Sombra Incandescente'], miniboss:'Devorador Mórbido', boss:'Dragão das Fendas', level: 38, kills: 300, rune: 'V', art: 'demon'},
    {name: 'Trono do Crepúsculo', subtitle: 'O fim de toda luz. O início de outra era.', names: ['Lich Imortal', 'Rei das Sombras', 'Devorador de Estrelas', 'Sacerdote do Vazio', 'Arauto do Eclipse'], miniboss:'Medusa do Eclipse', boss:'Imperador do Crepúsculo', level: 60, kills: 600, rune: 'VI', art: 'lich'}
  ];
  const UPGRADES = [
    {id: 'strike', icon: '⚔', title: 'Lâmina Afiada', desc: 'Reforce os golpes para causar mais dano a cada clique.', base: 12, growth: 1.16, effect: '+2,4 dano por nível'},
    {id: 'ritual', icon: '✥', title: 'Ritual Arcano', desc: 'Invoca energia ancestral que fere inimigos automaticamente.', base: 22, growth: 1.175, effect: '+1,8 DPS por nível'},
    {id: 'banner', icon: '✦', title: 'Estandarte Dourado', desc: 'Cada vitória rende mais ouro às suas reservas.', base: 75, growth: 1.20, effect: '+7% de ouro por nível'},
    {id: 'focus', icon: '✧', title: 'Olhar do Predador', desc: 'Aprimora a precisão dos seus ataques críticos.', base: 110, growth: 1.23, effect: '+0,7% de crítico por nível'}
  ];
  const SKILL_PATHS = [
    {id: 'warrior', name: 'Caminho do Guerreiro', subtitle: 'FORÇA • PRECISÃO • PODER', icon: '⚔'},
    {id: 'sage', name: 'Caminho do Sábio', subtitle: 'RITUAL • OURO • TEMPO', icon: '✥'},
    {id: 'raider', name: 'Caminho do Saqueador', subtitle: 'SORTE • TESOURO • ALMAS', icon: '✧'}
  ];
  const SKILLS = [
    {id: 'w1', path:'warrior', icon:'⚔', name:'Golpe Ancestral', desc:'+20% dano de clique/nível', max:10, cost:1, growth:1.7},
    {id: 'w2', path:'warrior', icon:'✣', name:'Sangue Frio', desc:'+2% chance crítica/nível', max:8, cost:2, growth:1.8, req:'w1', reqRank:1},
    {id: 'w3', path:'warrior', icon:'✦', name:'Fio do Destino', desc:'+22% dano crítico/nível', max:8, cost:3, growth:1.8, req:'w2', reqRank:2},
    {id: 'w4', path:'warrior', icon:'♜', name:'Caçador de Tesouros', desc:'+35% dano em eventos/nível', max:5, cost:6, growth:2, req:'w3', reqRank:2},
    {id: 's1', path:'sage', icon:'☽', name:'Ecos Arcanos', desc:'+25% de DPS/nível', max:10, cost:1, growth:1.7},
    {id: 's2', path:'sage', icon:'◈', name:'Tempo Retido', desc:'+12% de ganho offline/nível', max:8, cost:2, growth:1.8, req:'s1', reqRank:1},
    {id: 's3', path:'sage', icon:'✥', name:'Alquimia Solar', desc:'+10% de ouro/nível', max:8, cost:3, growth:1.85, req:'s2', reqRank:2},
    {id: 's4', path:'sage', icon:'✶', name:'Tempestade Etérea', desc:'+30% de DPS/nível', max:6, cost:6, growth:2, req:'s3', reqRank:2},
    {id: 'r1', path:'raider', icon:'◇', name:'Mãos Afortunadas', desc:'+6% de sorte/nível', max:10, cost:1, growth:1.7},
    {id: 'r2', path:'raider', icon:'✧', name:'Olhar do Abismo', desc:'Melhora raridades de itens', max:8, cost:2, growth:1.8, req:'r1', reqRank:1},
    {id: 'r3', path:'raider', icon:'♢', name:'Ímã de Relíquias', desc:'Eventos +frequentes e +3s', max:6, cost:3, growth:1.9, req:'r2', reqRank:2},
    {id: 'r4', path:'raider', icon:'◆', name:'Legado Eterno', desc:'+12% almas no renascer/nível', max:6, cost:6, growth:2, req:'r3', reqRank:2}
  ];
  const EQUIPMENT_WORDS = {
    weapon: ['Espada', 'Machado', 'Lâmina', 'Adaga', 'Gadanha'],
    armor: ['Armadura', 'Couraça', 'Manto', 'Peitoral', 'Veste'],
    ring: ['Anel', 'Sinete', 'Selo', 'Aliança', 'Aro'],
    relic: ['Amuleto', 'Talismã', 'Ídolo', 'Relicário', 'Orbe']
  };
  const PREFIXES = {comum:['Gasto','Rústico','Esquecido'], incomum:['Temperado','Velado','Vigilante'], raro:['Rúnico','Sombrio','Venerável'], epico:['Espectral','Imperial','Profanado'], lendario:['Eterno','do Ocaso','da Última Aurora']};

  // 42 creature slots: 17 unique custom PNGs + 25 individual SVGs (5 common, 1 miniboss, 1 boss per area).
  // The names are intentionally indexed by the combat roster to eliminate shared art and hue swaps.
  const MONSTER_SPRITES = [
    ['condenado-errante', 'guerreiro-esqueletico.png', 'sentinela-caida', 'arqueiro-macabro', 'zumbi-errante.png', 'espadachim-corrompido.png', 'cavaleiro-decapitado.png'], 
    ['lobo-sombrio.png', 'ratazana-pestilenta.png', 'lobo-da-praga', 'entorpecido-de-musgo', 'goblin-selvagem.png', 'rei-das-ratazanas.png', 'hidra-profanada.png'], 
    ['espectro-da-cripta', 'alma-enregelada', 'lamento-submerso', 'afogado-sem-rosto', 'sacerdote-esquecido', 'bruxa-das-criptas.png', 'rei-lich.png'], 
    ['golem-ferrugem', 'carcereiro-runico', 'guardiao-de-basalto', 'orc-carniceiro.png', 'construto-enferrujado', 'ogro-do-ferro.png', 'cavaleiro-do-abismo.png'], 
    ['arauto-das-chamas', 'demonio-carmesim', 'flagelo-abissal', 'sucubo-das-cinzas', 'sombra-incandescente', 'devorador-morbido.png', 'dragao-das-fendas.png'], 
    ['lich-imortal', 'rei-das-sombras', 'devorador-de-estrelas', 'sacerdote-do-vazio', 'arauto-do-eclipse', 'medusa-do-eclipse.png', 'imperador-do-crepusculo'], 
  ];

  // The custom illustrations are transparent PNGs; legacy creatures remain individual SVGs.
  const monsterSrc = (zoneIndex, creatureIndex) => {
    const slug = MONSTER_SPRITES[zoneIndex][creatureIndex];
    return `assets/monsters/${slug.endsWith('.png') ? slug : slug + '.svg'}`;
  };

  // Shape-specific movement: skeletons, beasts, spirits, constructs, and cosmic beings move differently.
  const MONSTER_FAMILIES = [
    ['humanoid', 'humanoid', 'humanoid', 'humanoid', 'humanoid', 'humanoid', 'humanoid'], 
    ['quad', 'quad', 'quad', 'humanoid', 'humanoid', 'abomination', 'colossus'], 
    ['wraith', 'wraith', 'wraith', 'drowned', 'wraith', 'wraith', 'humanoid'], 
    ['colossus', 'humanoid', 'colossus', 'humanoid', 'colossus', 'colossus', 'humanoid'], 
    ['humanoid', 'humanoid', 'arthropod', 'humanoid', 'wraith', 'abomination', 'colossus'], 
    ['humanoid', 'humanoid', 'cosmic', 'wraith', 'cosmic', 'wraith', 'cosmic'], 
  ];

  const EVENT_ART = {
    goblin: `<svg viewBox="0 0 85 78" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M19 33 3 19l17-1 11 14m35 1 16-14-18-1-10 14" fill="#88ac52" stroke="#314721" stroke-width="3"/><path d="M18 30Q20 8 42 7q25 2 25 25l-6 27-18 14-19-14Z" fill="#70994b" stroke="#263d20" stroke-width="4"/><path d="M20 28 32 23l10 10-13 9Zm45 0-13-5-10 10 13 9Z" fill="#f2c76c" stroke="#283a20" stroke-width="3"/><path d="m41 43-7 12 8 4 8-4Z" fill="#4b642f"/><path d="m26 61 16 9 17-9" stroke="#e5c28b" stroke-width="3"/><circle cx="13" cy="61" r="12" fill="#d4a043" stroke="#ffe091" stroke-width="3"/><path d="M13 54v14m-5-10h10" stroke="#ffeb9d" stroke-width="2"/></svg>`,
    chest: `<svg viewBox="0 0 85 78" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M14 32 17 14 42 5l25 9 4 18Z" fill="#8e562b" stroke="#f1c96a" stroke-width="4"/><path d="M12 32h61v35H12Z" fill="#7e4525" stroke="#f0b956" stroke-width="4"/><path d="M12 41h61" stroke="#edc065" stroke-width="6"/><path d="M28 14v53m29-53v53" stroke="#d4a256" stroke-width="5"/><path d="M36 32h13v23H36Z" fill="#ffdd79" stroke="#986331" stroke-width="2"/><path d="M42 5V0m-18 7-5-5m47 5 5-5" stroke="#ffe8a8" stroke-width="2"/><circle cx="42" cy="44" r="4" fill="#734324"/></svg>`
  };

  const $ = (id) => document.getElementById(id);
  const now = () => Date.now();
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const number = (v, fallback = 0, min = 0, max = MAX_NUMBER) => {
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
  };
  const integer = (v, fallback = 0, min = 0, max = MAX_NUMBER) => Math.floor(number(v, fallback, min, max));
  const add = (a, b) => Math.min(MAX_NUMBER, Math.max(0, a) + Math.max(0, b));
  const multiply = (a, b) => (a <= 0 || b <= 0) ? 0 : (a >= MAX_NUMBER / b ? MAX_NUMBER : a * b);
  const power = (b, e) => {
    if (b <= 0) return 0;
    const exponent = Math.log(b) * e;
    return exponent >= Math.log(MAX_NUMBER) ? MAX_NUMBER : Math.min(MAX_NUMBER, Math.exp(exponent));
  };
  const safeName = (v, max = 42) => String(v == null ? '' : v).replace(/[\x00-\x1f<>]/g, '').trim().slice(0, max);
  const esc = (v) => String(v).replace(/[&<>"']/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const fmt = (v, decimals = 0) => {
    const n = number(v);
    if (n < 1000) return n.toLocaleString('pt-BR', {maximumFractionDigits: decimals});
    const units = ['','k','M','B','T','Qa','Qi','Sx','Sp','Oc','No','Dc'];
    const group = Math.floor(Math.log10(n) / 3);
    if (group >= units.length) return n.toExponential(2).replace('e+', 'e');
    const scaled = n / (10 ** (group * 3));
    return `${scaled.toLocaleString('pt-BR',{maximumFractionDigits:scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2})}${units[group]}`;
  };
  const fmtPercent = (n) => `${(number(n) * 100).toLocaleString('pt-BR',{maximumFractionDigits:1})}%`;
  const uid = () => (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).slice(2,12)}`;
  const xpNeeded = (lv) => Math.floor(Math.min(MAX_NUMBER, 24 * power(1.21, Math.max(0, lv-1)) + lv * 7));
  const slotStats = () => ({click:0, dps:0, crit:0, gold:0, luck:0});
  const emptyRanks = (table) => Object.fromEntries(table.map(x => [x.id, 0]));
  const timeLabel = () => new Date().toLocaleTimeString('pt-BR', {hour:'2-digit',minute:'2-digit'});
  const randEventDelay = () => rand(39000, 75000);
  const validZone = (z) => Math.min(ZONES.length-1, integer(z, 0, 0, ZONES.length-1));
  const freshProgress = () => ({stage:1,kills:0,minibossDefeated:false,bossDefeated:false,cleared:false});
  const progressAt = (s) => s.zoneProgress[s.zone];
  // Bosses remain mandatory: no amount of farming, XP or offline DPS skips them.
  const unlockedZone = (s,z) => z === 0 || s.zoneProgress[z-1].cleared;
  const requiredBossKind = (progress) => progress.cleared ? null :
    (progress.stage === 5 && progress.kills >= ENEMIES_PER_PHASE && !progress.minibossDefeated ? 'miniboss' :
    (progress.stage === PHASES_PER_ZONE && progress.kills >= ENEMIES_PER_PHASE && !progress.bossDefeated ? 'boss' : null));
  const phaseMultiplier = (s) => power(1.36,progressAt(s).stage-1);
  const rewardGold = (s) => Math.max(1,Math.floor(multiply(12 * power(2.35,s.zone),multiply(phaseMultiplier(s),1+Math.min(10000,s.zoneKills[s.zone])*.0075))));
  const rewardXp = (s) => Math.max(1,Math.floor(multiply(9 * power(1.95,s.zone),multiply(phaseMultiplier(s),1+Math.min(10000,s.zoneKills[s.zone])*.005))));
  const maxMobHp = (s,kind='normal') => {
    const base=multiply(28*power(2.9,s.zone),phaseMultiplier(s));
    return Math.max(1,Math.floor(multiply(base,kind==='boss'?18:kind==='miniboss'?9:1)));
  };
  const freshMob = (s,previousName='') => {
    const zone=ZONES[s.zone],progress=progressAt(s);
    const kind=requiredBossKind(progress)||'normal';
    const names=zone.names.filter(name=>name!==previousName);
    const maxHp=maxMobHp(s,kind);
    const name=kind==='boss'?zone.boss:kind==='miniboss'?zone.miniboss:pick(names.length?names:zone.names);
    return {name,kind,hp:maxHp,maxHp,level:1+s.zone*12+(progress.stage-1)*2+(kind==='normal'?0:kind==='boss'?4:2)};
  };
  const newState = (name) => {
    const s = {version:SAVE_VERSION,name:safeName(name,18) || 'Errante',createdAt:now(),lastSeen:now(),level:1,xp:0,gold:0,souls:0,shards:0,zone:0,zoneKills:Array(ZONES.length).fill(0),zoneProgress:ZONES.map(freshProgress),upgrades:emptyRanks(UPGRADES),skills:emptyRanks(SKILLS),inventory:[],equipment:Object.fromEntries(SLOTS.map(x=>[x,null])),mob:null,event:null,nextEventAt:now()+randEventDelay(),lastEventAt:0,runKills:0,runGold:0,lifetimeKills:0,rebirths:0};
    s.mob = freshMob(s);
    return s;
  };
  function normalizeItem(item) {
    if (!item || typeof item !== 'object' || !SLOTS.includes(item.slot)) return null;
    if (!RARITIES.some(r=>r.id === item.rarity)) return null;
    const stats = slotStats();
    for (const key of Object.keys(stats)) stats[key] = number(item.stats?.[key],0,0,1e8);
    return {id:String(item.id ?? '').replace(/[^a-zA-Z0-9_-]/g,'').slice(0,90) || uid(),slot:item.slot,rarity:item.rarity,name:safeName(item.name,75) || 'Relíquia sem Nome',level:integer(item.level,1,1,MAX_LEVEL),stats,createdAt:integer(item.createdAt,now(),0,now()+100000)};
  }
  function normalizeSave(raw, fallbackName) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw) || raw.version > SAVE_VERSION) throw Error('Versão de save incompatível.');
    const s = newState(fallbackName);
    s.name = safeName(raw.name,18) || safeName(fallbackName,18) || 'Errante';
    s.createdAt = integer(raw.createdAt,now(),0,now());
    s.lastSeen = integer(raw.lastSeen,now(),0,now());
    s.level = integer(raw.level,1,1,MAX_LEVEL);
    s.xp = number(raw.xp,0);
    s.gold = number(raw.gold);
    s.souls = integer(raw.souls);
    s.shards = integer(raw.shards,0,0,9);
    s.runKills = integer(raw.runKills,0,0,1e10);
    s.runGold = number(raw.runGold);
    s.lifetimeKills = integer(raw.lifetimeKills,0,0,1e12);
    s.rebirths = integer(raw.rebirths,0,0,1e8);
    for (const x of UPGRADES) s.upgrades[x.id] = integer(raw.upgrades?.[x.id],0,0,MAX_RANK);
    for (const x of SKILLS) s.skills[x.id] = integer(raw.skills?.[x.id],0,0,x.max);
    if (Array.isArray(raw.zoneKills)) s.zoneKills = ZONES.map((_,i)=>integer(raw.zoneKills[i],0,0,1e10));
    if (Array.isArray(raw.zoneProgress) && raw.version === SAVE_VERSION) {
      s.zoneProgress=ZONES.map((_,i)=>{
        const r=raw.zoneProgress[i] || {};
        const p=freshProgress();
        p.stage=integer(r.stage,1,1,PHASES_PER_ZONE);
        p.kills=integer(r.kills,0,0,ENEMIES_PER_PHASE);
        p.minibossDefeated=Boolean(r.minibossDefeated);
        p.bossDefeated=Boolean(r.bossDefeated);
        p.cleared=Boolean(r.cleared);
        // Reject inconsistent stage/boss flags from malformed backups.
        if(p.stage>5)p.minibossDefeated=true;
        if(p.bossDefeated && p.stage===PHASES_PER_ZONE)p.cleared=true;
        if(p.cleared){p.stage=PHASES_PER_ZONE;p.kills=ENEMIES_PER_PHASE;p.minibossDefeated=true;p.bossDefeated=true;}
        else {
          p.bossDefeated=false;
          if(p.stage<5)p.minibossDefeated=false;
          if(p.stage===5 && p.minibossDefeated){p.stage=6;p.kills=0;}
          if(p.stage<PHASES_PER_ZONE && p.kills===ENEMIES_PER_PHASE && p.stage!==5){p.stage++;p.kills=0;}
        }
        return p;
      });
      // A zone can only be reached after finishing the preceding zone.
      for(let i=1;i<ZONES.length;i++)if(!s.zoneProgress[i-1].cleared)s.zoneProgress[i]=freshProgress();
    }else{
      // v1 migration: previously unlocked regions stay available; progress is
      // converted to phases, with the new boss checkpoints still required.
      let legacyReached=0;
      for(let i=1;i<ZONES.length;i++)if(s.level>=ZONES[i].level && s.runKills>=ZONES[i].kills)legacyReached=i;
      legacyReached=Math.max(legacyReached,validZone(raw.zone));
      for(let i=0;i<legacyReached;i++){
        s.zoneProgress[i]={stage:10,kills:10,minibossDefeated:true,bossDefeated:true,cleared:true};
      }
      const current=s.zoneProgress[legacyReached];
      const historicalKills=s.zoneKills[legacyReached];
      if(historicalKills>=40){
        current.stage=5;current.kills=10;current.minibossDefeated=false;
      }else{
        current.stage=1+Math.floor(historicalKills/ENEMIES_PER_PHASE);
        current.kills=historicalKills%ENEMIES_PER_PHASE;
      }
    }
    s.zone=validZone(raw.zone);
    if(!unlockedZone(s,s.zone))s.zone=ZONES.reduce((z,_,i)=>unlockedZone(s,i)?i:z,0);
    const seen = new Set();
    if (Array.isArray(raw.inventory)) for (const entry of raw.inventory.slice(0,MAX_INVENTORY)) {
      const item = normalizeItem(entry);
      if (item && !seen.has(item.id)) {s.inventory.push(item);seen.add(item.id);}
    }
    for (const slot of SLOTS) {
      const id = safeName(raw.equipment?.[slot],90);
      s.equipment[slot] = s.inventory.some(i=>i.id===id && i.slot===slot) ? id : null;
    }
    s.mob = freshMob(s);
    if(raw.mob && typeof raw.mob==='object' && raw.version===SAVE_VERSION){
      const kind=requiredBossKind(progressAt(s))||'normal';
      const expectedMax=maxMobHp(s,kind);
      // Rebuild identity and maximum health from trusted area/phase definitions.
      const name=kind==='boss'?ZONES[s.zone].boss:kind==='miniboss'?ZONES[s.zone].miniboss:
        (ZONES[s.zone].names.includes(raw.mob.name)?raw.mob.name:s.mob.name);
      s.mob={name,kind,hp:number(raw.mob.hp,expectedMax,0,expectedMax)||expectedMax,maxHp:expectedMax,level:s.mob.level};
    }
    s.lastEventAt = integer(raw.lastEventAt,0,0,now());
    s.nextEventAt = integer(raw.nextEventAt,now()+randEventDelay(),0,now()+120000);
    if (raw.event && ['goblin','chest'].includes(raw.event.type) && number(raw.event.expiresAt)>now()) {
      const hp = number(raw.event.hp,1,1,MAX_NUMBER);
      const maxHp = number(raw.event.maxHp,hp,hp,MAX_NUMBER);
      s.event = {type:raw.event.type,hp,maxHp,expiresAt:integer(raw.event.expiresAt,now(),0,now()+18000)};
    }
    return s;
  }
  class Game {
    constructor() {
      this.state = null;
      this.profileId = null;
      this.tab = 'upgrades';
      this.buyQuantity = 1;
      this.inventoryFilter = 'all';
      this.inventorySort = 'new';
      this.lastFrameAt = 0;
      this.lastCoreRender = 0;
      this.lastPanelRender = 0;
      this.lastZoneRendered = -1;
      this.lastEventRendered = '';
      this.startedLoop = false;
      this.sessionStorage = new Map();
      this.storageAvailable = this.testStorage();
      this.bindEvents();
      this.showAuth();
      window.addEventListener('pagehide',()=>this.save());
      window.addEventListener('beforeunload',()=>this.save());
      document.addEventListener('visibilitychange',()=>{
        if (this.state) {this.stepClock();this.save();this.renderCore();}
      });
      setInterval(()=>this.save(),SAVE_INTERVAL);
    }
    testStorage() {
      try {localStorage.setItem('cinzas_probe','1');localStorage.removeItem('cinzas_probe');return true;}
      catch (_) {return false;}
    }
    read(key) {
      if (!this.storageAvailable) return this.sessionStorage.get(key) || null;
      try {return localStorage.getItem(key);} catch (_) {this.storageAvailable=false;return this.sessionStorage.get(key)||null;}
    }
    write(key, value) {
      if (!this.storageAvailable) {this.sessionStorage.set(key,value);return false;}
      try {localStorage.setItem(key,value);return true;}
      catch (_) {this.storageAvailable=false;this.sessionStorage.set(key,value);this.toast('Armazenamento indisponível. Exporte seu save para não perder progresso.');return false;}
    }
    getProfiles() {
      try {
        const data=JSON.parse(this.read(PROFILE_INDEX_KEY)||'[]');
        if (!Array.isArray(data)) return [];
        return data.slice(0,35).filter(p=>p && typeof p.id==='string' && /^[a-zA-Z0-9_-]{1,90}$/.test(p.id))
          .map(p=>({id:p.id,name:safeName(p.name,18)||'Errante',lastPlayed:integer(p.lastPlayed,0,0,now())}));
      } catch (_) {return [];}
    }
    storeProfiles(profiles) {this.write(PROFILE_INDEX_KEY,JSON.stringify(profiles.slice(0,35)));}
    touchProfile() {
      if (!this.state || !this.profileId) return;
      const profiles=this.getProfiles();
      const profile=profiles.find(p=>p.id===this.profileId);
      if (profile) {profile.name=this.state.name;profile.lastPlayed=now();this.storeProfiles(profiles);}
    }
    showAuth() {
      const profiles=this.getProfiles().sort((a,b)=>b.lastPlayed-a.lastPlayed);
      const list=$('profileList');
      list.replaceChildren();
      for (const profile of profiles) {
        const btn=document.createElement('button');btn.type='button';btn.className='saved-profile';
        const name=document.createElement('strong');name.textContent='♜  '+profile.name;
        const detail=document.createElement('small');detail.textContent='CONTINUAR  ❯';
        btn.append(name,detail);btn.addEventListener('click',()=>this.openProfile(profile));list.append(btn);
      }
      $('savedProfiles').hidden=profiles.length===0;
      $('authScreen').hidden=false;
      $('newProfileName').value='';
    }
    createProfile(name, preloaded = null) {
      const clean=safeName(name,18);
      if (clean.length < 2) {this.toast('Escolha um nome com pelo menos 2 caracteres.');return;}
      const profiles=this.getProfiles();
      if (profiles.length>=35) {this.toast('Limite de 35 perfis locais atingido.');return;}
      const profile={id:uid().replace(/[^a-zA-Z0-9_-]/g,''),name:clean,lastPlayed:now()};
      const state=preloaded || newState(clean);
      state.name=clean;
      profiles.push(profile);this.storeProfiles(profiles);
      this.write(SAVE_PREFIX+profile.id,JSON.stringify(state));
      this.activate(profile,state);
    }
    openProfile(profile) {
      try {
        const data=this.read(SAVE_PREFIX+profile.id);
        if (!data) {this.toast('Save não encontrado. Uma nova jornada foi iniciada.');this.activate(profile,newState(profile.name));return;}
        const raw=JSON.parse(data);
        this.activate(profile,normalizeSave(raw,profile.name));
      } catch (error) {
        this.dialog('Save danificado','Não foi possível ler este perfil. O arquivo local não foi substituído. Importe um backup JSON ou crie um novo aventureiro.',[{text:'ENTENDI'}],'⚠');
      }
    }
    activate(profile,state) {
      this.state=state;
      this.profileId=profile.id;
      this.lastZoneRendered=-1;
      this.lastEventRendered='';
      this.lastFrameAt=now();
      $('authScreen').hidden=true;
      const seconds=Math.min(MAX_OFFLINE_SECONDS,Math.max(0,(now()-state.lastSeen)/1000));
      const offline=this.grantOffline(seconds);
      state.lastSeen=now();
      if (state.event && state.event.expiresAt <= now()) state.event=null;
      state.nextEventAt=now()+this.nextEventDelay();
      this.touchProfile();
      this.renderEverything();
      this.addLog('Uma chama ressurge nas ruínas. A caçada continua.','✦','good');
      if (!this.storageAvailable) this.toast('Modo temporário: seu navegador bloqueou o armazenamento. Exporte backups JSON.');
      if (offline.kills>0) {
        this.addLog(`Seu ritual venceu ${fmt(offline.kills)} inimigos durante sua ausência.`, '☽', 'good');
        this.dialog('O mundo seguiu em frente',`Enquanto você esteve ausente por ${this.formatDuration(seconds)}, suas forças arcanas derrotaram ${fmt(offline.kills)} inimigos.\n\n+${fmt(offline.gold)} ouro  ·  +${fmt(offline.xp)} XP\n\nAté 12 horas de progresso offline.`,[{text:'RETOMAR A CAÇADA',primary:true}],'☽');
      }
      this.save();
      if (!this.startedLoop) {this.startedLoop=true;requestAnimationFrame((t)=>this.loop(t));}
    }
    bindEvents() {
      $('createProfileForm').addEventListener('submit',(e)=>{e.preventDefault();this.createProfile($('newProfileName').value);});
      $('switchProfile').addEventListener('click',()=>{if(this.state){this.save();this.state=null;this.profileId=null;this.showAuth();}});
      $('attackTarget').addEventListener('click',()=>this.attack());
      $('eventTarget').addEventListener('click',(e)=>{e.stopPropagation();this.attackEvent();});
      document.querySelectorAll('[data-tab]').forEach(btn=>btn.addEventListener('click',()=>this.changeTab(btn.dataset.tab)));
      $('tabBody').addEventListener('click',(e)=>this.onPanelClick(e));
      $('tabBody').addEventListener('change',(e)=>{
        if(e.target.id==='inventoryFilter'){this.inventoryFilter=e.target.value;this.renderPanel();}
        if(e.target.id==='inventorySort'){this.inventorySort=e.target.value;this.renderPanel();}
      });
      $('exportSave').addEventListener('click',()=>this.exportSave());
      $('importSave').addEventListener('click',()=>this.pickImport());
      $('importFromAuth').addEventListener('click',()=>this.pickImport());
      $('saveFileInput').addEventListener('change',(e)=>{const file=e.target.files?.[0];if(file)this.importSave(file);e.target.value='';});
      document.addEventListener('keydown',(e)=>{
        if (!this.state || !$('dialogBackdrop').hidden || !$('authScreen').hidden) return;
        const interactive=['INPUT','BUTTON','SELECT','TEXTAREA'].includes(document.activeElement?.tagName);
        if(e.code==='Space' && !interactive){e.preventDefault();this.attack();}
      });
    }
    pickImport() {$('saveFileInput').click();}
    save() {
      if (!this.state || !this.profileId) return;
      this.stepClock();
      this.state.lastSeen=now();
      const success=this.write(SAVE_PREFIX+this.profileId,JSON.stringify(this.state));
      $('saveIndicator').classList.toggle('warning',!success);
      $('saveIndicator').title=success?'Progresso salvo localmente':'Exportar JSON recomendado';
    }
    exportSave() {
      if (!this.state) {this.toast('Abra um perfil para exportar o progresso.');return;}
      this.save();
      const output={type:'cinzas-do-crepusculo',format:1,exportedAt:new Date().toISOString(),state:this.state};
      const blob=new Blob([JSON.stringify(output,null,2)],{type:'application/json;charset=utf-8'});
      const url=URL.createObjectURL(blob);
      const anchor=document.createElement('a');
      anchor.href=url;anchor.download=`hellward-save-${this.state.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9_-]+/g,'-')||'aventureiro'}.json`;
      document.body.append(anchor);anchor.click();anchor.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1200);
      this.toast('Backup JSON exportado com sucesso.','good');
    }
    async importSave(file) {
      if (file.size>2*1024*1024) {this.toast('Arquivo muito grande. O limite é 2 MB.');return;}
      try {
        const imported=JSON.parse(await file.text());
        if (imported?.type!=='cinzas-do-crepusculo' || imported?.format!==1 || !imported?.state || typeof imported.state!=='object') throw Error('Arquivo não é um backup válido do jogo.');
        const state=normalizeSave(imported.state,'Errante');
        const perform=()=>{
          if(this.state){state.name=this.state.name;this.activate({id:this.profileId,name:state.name},state);this.toast('Backup importado e validado.','good');}
          else {this.createProfile(state.name,state);this.toast('Backup importado em um novo perfil.','good');}
        };
        if (this.state) this.dialog('Substituir o progresso?',`O backup pertence a “${state.name}”, nível ${state.level}. Importá-lo irá substituir o progresso do perfil atual. Exporte um backup antes, se necessário.`,[{text:'CANCELAR'},{text:'IMPORTAR',primary:true,action:perform}],'⚠');
        else perform();
      } catch(error){this.toast(`Falha na importação: ${safeName(error?.message,100)||'JSON inválido'}`);}
    }
    dialog(title,body,actions=[{text:'CONTINUAR',primary:true}],glyph='✦') {
      $('dialogIcon').textContent=glyph;
      $('dialogTitle').textContent=title;
      $('dialogText').textContent=body;
      const container=$('dialogActions');container.replaceChildren();
      for (const act of actions) {
        const btn=document.createElement('button');btn.type='button';btn.className=act.primary?'primary-button':'subtle-button';btn.textContent=act.text;
        btn.addEventListener('click',()=>{$('dialogBackdrop').hidden=true;if(act.action)act.action();});container.append(btn);
      }
      $('dialogBackdrop').hidden=false;
      container.querySelector('button:last-child')?.focus();
    }
    toast(text,kind='') {
      const node=document.createElement('div');node.className=`toast ${kind}`;node.textContent=text;
      const box=$('toastStack');box.prepend(node);
      while(box.children.length>4)box.lastElementChild.remove();
      setTimeout(()=>node.remove(),3800);
    }
    addLog(text,glyph='⚔',kind='') {
      if(!this.state) return;
      const row=document.createElement('div');row.className=`log-entry ${kind}`;
      const symbol=document.createElement('div');symbol.className='log-glyph';symbol.textContent=glyph;
      const content=document.createElement('div');const paragraph=document.createElement('p');paragraph.textContent=text;
      const date=document.createElement('time');date.textContent=timeLabel();
      content.append(paragraph,date);row.append(symbol,content);
      const log=$('combatLog');
      const historyOpen=log.scrollTop>12,previousHeight=log.scrollHeight;
      log.prepend(row);
      while(log.children.length>70)log.lastElementChild.remove();
      log.scrollTop=historyOpen?log.scrollTop+(log.scrollHeight-previousHeight):0;
    }
    formatDuration(seconds) {
      const total=Math.floor(seconds);
      if(total>=3600) return `${Math.floor(total/3600)}h ${Math.floor(total%3600/60)}min`;
      if(total>=60) return `${Math.floor(total/60)}min`;
      return `${total}s`;
    }
    equippedStats() {
      const stats=slotStats();const s=this.state;
      for(const slot of SLOTS){
        const id=s.equipment[slot];
        if (!id) continue;
        const item=s.inventory.find(x=>x.id===id && x.slot===slot);
        if(item)for(const key of Object.keys(stats))stats[key]+=item.stats[key];
      }
      return stats;
    }
    bonuses() {
      const s=this.state,eq=this.equippedStats();
      const click=multiply(2+s.level*.5+s.upgrades.strike*2.4+eq.click,1+s.skills.w1*.2);
      const dps=multiply(s.upgrades.ritual*1.8+eq.dps,1+s.skills.s1*.25+s.skills.s4*.3);
      const crit=Math.min(.75,.08+s.upgrades.focus*.007+s.skills.w2*.02+eq.crit);
      const critDamage=1.7+s.skills.w3*.22;
      const luck=s.skills.r1*.06+eq.luck;
      const gold=1+s.upgrades.banner*.07+s.skills.s3*.10+eq.gold;
      const drop=Math.min(.7,.18+luck*.12);
      return {click,dps,crit,critDamage,luck,gold,drop,offline:.6*(1+s.skills.s2*.12),eventDamage:1+s.skills.w4*.35};
    }
    awardGold(amount) {
      const value=number(amount);
      const s=this.state;
      const previous=s.gold;
      s.gold=add(previous,value);
      const earned=s.gold-previous;
      s.runGold=add(s.runGold,earned);
      return earned;
    }
    awardXp(amount) {
      const s=this.state;
      const before=s.level;
      s.xp=add(s.xp,number(amount));
      let iterations=0;
      while(s.level<MAX_LEVEL && s.xp>=xpNeeded(s.level) && iterations++<MAX_LEVEL){
        s.xp-=xpNeeded(s.level);
        s.level++;
      }
      if(s.level>=MAX_LEVEL)s.xp=0;
      if(s.level>before){
        this.addLog(`Você alcançou o nível ${s.level}!`,'✦','good');
        this.toast(`NÍVEL ${s.level} — seu poder aumentou!`,'good');
        this.renderPanel();
      }
    }
    grantOffline(seconds) {
      const s=this.state;
      if(!s||seconds<1)return {kills:0,gold:0,xp:0};
      const bonus=this.bonuses();
      if(bonus.dps<=0)return {kills:0,gold:0,xp:0};
      let remaining=multiply(bonus.dps,Math.min(MAX_OFFLINE_SECONDS,seconds)*bonus.offline);
      let kills=0,gold=0,xp=0;
      // At most 100 regular enemies are simulated before each mandatory boss.
      // Offline progression stops at the miniboss/boss, so gated areas cannot be skipped.
      while(remaining>0 && kills<MAX_OFFLINE_KILLS && !requiredBossKind(progressAt(s))){
        const mob=s.mob;
        if(mob.kind!=='normal'){s.mob=freshMob(s);break;}
        if(remaining<mob.hp){mob.hp-=remaining;break;}
        remaining-=mob.hp;
        gold=add(gold,multiply(rewardGold(s),bonus.gold));
        xp=add(xp,rewardXp(s));
        s.runKills++;s.lifetimeKills++;s.zoneKills[s.zone]++;
        const progress=progressAt(s);
        if(!progress.cleared){
          progress.kills++;
          if(progress.kills===ENEMIES_PER_PHASE && progress.stage!==5 && progress.stage!==10){
            progress.stage++;progress.kills=0;
          }
        }
        kills++;
        s.mob=freshMob(s,mob.name);
      }
      if(kills){this.awardGold(Math.floor(gold));this.awardXp(Math.floor(xp));}
      return {kills,gold:Math.floor(gold),xp:Math.floor(xp)};
    }
    stepClock() {
      if(!this.state)return;
      const t=now();
      if(!this.lastFrameAt){this.lastFrameAt=t;return;}
      const raw=(t-this.lastFrameAt)/1000;
      this.lastFrameAt=t;
      if(raw<=0)return;
      if(this.state.event && this.state.event.expiresAt<=t)this.expireEvent();
      if(raw>2){
        const result=this.grantOffline(Math.min(MAX_OFFLINE_SECONDS,raw));
        if(result.kills && document.visibilityState!=='hidden')this.addLog(`${fmt(result.kills)} abates em segundo plano: +${fmt(result.gold)} ouro.`,'☽','good');
      }else{
        const dps=this.bonuses().dps;
        if(dps>0)this.damageMob(multiply(dps,Math.min(raw,2)),false,false);
      }
      if(document.visibilityState==='visible' && !this.state.event && t>=this.state.nextEventAt)this.spawnEvent();
    }
    loop() {
      if(this.state){
        this.stepClock();
        const t=now();
        if(t-this.lastCoreRender>90){this.renderCore();this.lastCoreRender=t;}
        if(t-this.lastPanelRender>1750){
          if(this.tab==='upgrades' || this.tab==='ascension')this.renderPanel();
          this.lastPanelRender=t;
        }
      }
      requestAnimationFrame(()=>this.loop());
    }
    attack() {
      if(!this.state || !$('dialogBackdrop').hidden)return;
      const b=this.bonuses(),critical=Math.random()<b.crit;
      const hit=multiply(b.click,critical?b.critDamage:1);
      this.damageMob(hit,true,critical);
      const target=$('attackTarget');
      target.classList.remove('damaged');void target.offsetWidth;target.classList.add('damaged');
      setTimeout(()=>target.classList.remove('damaged'),170);
    }
    floatNumber(text,style='') {
      const layer=$('damageLayer');
      const node=document.createElement('span');node.className=`float-damage ${style}`;
      node.textContent=text;
      node.style.marginLeft=`${rand(-55,55)}px`;
      layer.append(node);
      while(layer.children.length>24)layer.firstElementChild.remove();
      setTimeout(()=>node.remove(),900);
    }
    damageMob(amount,fromClick,critical) {
      const s=this.state;
      if(!s || amount<=0)return;
      if(fromClick)this.floatNumber(`${critical?'CRÍTICO! ':''}−${fmt(amount)}`,critical?'crit':'');
      let remaining=amount;
      let chain=0;
      while(remaining>0 && chain++<12){
        const mob=s.mob;
        if(!mob || mob.hp<=0){s.mob=freshMob(s);continue;}
        if(remaining<mob.hp){mob.hp=Math.max(0,mob.hp-remaining);break;}
        remaining-=mob.hp;
        mob.hp=0;
        this.killMob();
      }
    }
    killMob() {
      const s=this.state;
      const defeated=s.mob;
      const kind=defeated.kind||'normal';
      const name=defeated.name;
      const multiplier=kind==='boss'?18:kind==='miniboss'?7:1;
      const gold=Math.floor(multiply(multiply(rewardGold(s),multiplier),this.bonuses().gold));
      const xp=Math.floor(multiply(rewardXp(s),kind==='boss'?14:kind==='miniboss'?6:1));
      this.awardGold(gold);
      s.runKills++;s.lifetimeKills++;s.zoneKills[s.zone]++;
      this.awardXp(xp);
      const progress=progressAt(s);
      let travelNext=false;
      if(kind==='miniboss'){
        progress.minibossDefeated=true;
        progress.stage=6;progress.kills=0;
        this.dropItem('raro');
        this.addLog(`MINIBOSS ${name} vencido! Fase 6 desbloqueada. +${fmt(gold)} ouro e +${fmt(xp)} XP.`,'⚔','epic');
        this.toast('✦ MINIBOSS VENCIDO! A fase 6 foi liberada!','epic');
      }else if(kind==='boss'){
        progress.bossDefeated=true;progress.cleared=true;progress.stage=10;progress.kills=10;
        this.dropItem('epico');
        this.addLog(`CHEFÃO ${name} DERROTADO! ${ZONES[s.zone].name} foi conquistada! +${fmt(gold)} ouro e +${fmt(xp)} XP.`,'◆','epic');
        this.toast(`CHEFÃO DERROTADO! ${s.zone===ZONES.length-1?'Todas as regiões conquistadas!':'Nova região liberada!'}`,'epic');
        travelNext=s.zone<ZONES.length-1;
      }else{
        if(!progress.cleared){
          progress.kills++;
          if(progress.kills===ENEMIES_PER_PHASE){
            if(progress.stage===5){
              this.addLog(`Os dez inimigos da fase 5 caíram. O MINIBOSS surgiu!`,'☠','rare');
              this.toast('⚠ MINIBOSS — Uma criatura poderosa bloqueia o caminho!');
            }else if(progress.stage===10){
              this.addLog(`Os dez inimigos da fase 10 caíram. O CHEFÃO FINAL despertou!`,'☠','epic');
              this.toast('⚠ CHEFÃO DA REGIÃO! Prepare seus golpes!','epic');
            }else{
              progress.stage++;progress.kills=0;
              this.addLog(`FASE ${progress.stage} liberada em ${ZONES[s.zone].name}!`,'✦','good');
            }
          }
        }
        if(Math.random()<this.bonuses().drop)this.dropItem();
        this.addLog(`${name} derrotado. +${fmt(gold)} ouro · +${fmt(xp)} XP.`,'⚔');
      }
      if(!s.event && now()-s.lastEventAt>17000 && Math.random()<(.029+s.skills.r3*.007))this.spawnEvent();
      if(travelNext){
        const previousZone=ZONES[s.zone].name;
        s.zone++;
        s.event=null;
        s.nextEventAt=now()+this.nextEventDelay();
        this.lastZoneRendered=-1;
        this.addLog(`✧ ${previousZone} concluída. Você avançou para ${ZONES[s.zone].name}!`,'⚑','good');
        this.toast(`REGIÃO ${ZONES[s.zone].rune} — ${ZONES[s.zone].name}`,'good');
      }
      s.mob=freshMob(s,defeated.name);
      this.renderCore();
      if(this.tab==='inventory'||this.tab==='zones')this.renderPanel();
    }
    nextEventDelay() {return Math.floor(randEventDelay()/(1+this.state.skills.r3*.14));}
    spawnEvent() {
      const s=this.state;
      if(!s || s.event || document.visibilityState==='hidden')return;
      const type=Math.random()<.55?'goblin':'chest';
      const maxHp=Math.max(18,Math.ceil(this.bonuses().click*8));
      s.event={type,hp:maxHp,maxHp,expiresAt:now()+11000+s.skills.r3*3000};
      s.lastEventAt=now();s.nextEventAt=now()+this.nextEventDelay();
      this.lastEventRendered='';
      this.addLog(type==='goblin'?'Um Goblin do Tesouro apareceu!':'Um Baú Raro emergiu das sombras!','✦','rare');
      this.toast('✦ EVENTO RARO! Clique no tesouro antes que fuja!');
      this.renderEvent();
    }
    attackEvent() {
      const s=this.state;
      if(!s?.event || !$('dialogBackdrop').hidden)return;
      if(now()>=s.event.expiresAt){this.expireEvent();return;}
      const b=this.bonuses();
      const critical=Math.random()<b.crit;
      const dmg=multiply(b.click*(critical?b.critDamage:1),b.eventDamage);
      s.event.hp=Math.max(0,s.event.hp-dmg);
      this.floatNumber(`−${fmt(dmg)}`,'event-hit');
      if(s.event.hp<=0)this.winEvent();
      this.renderEvent();
    }
    expireEvent() {
      if(!this.state?.event)return;
      this.addLog(this.state.event.type==='goblin'?'O goblin escapou com suas riquezas.':'O baú desapareceu nas sombras.','☾');
      this.state.event=null;this.renderEvent();
    }
    winEvent() {
      const s=this.state,event=s.event;
      if(!event)return;
      s.event=null;
      const gold=Math.floor(multiply(rewardGold(s),event.type==='goblin'?38:27)*this.bonuses().gold);
      const xp=Math.floor(multiply(rewardXp(s),9));
      const shards=rand(event.type==='goblin'?3:2,7);
      this.awardGold(gold);this.awardXp(xp);
      s.shards+=shards;
      const souls=Math.floor(s.shards/10);
      if(souls){s.souls=add(s.souls,souls);s.shards%=10;}
      const rarity=Math.random()<(.16+s.skills.r2*.035)?'lendario':'epico';
      const item=this.dropItem(rarity);
      const name=event.type==='goblin'?'Goblin do Tesouro':'Baú Raro';
      this.floatNumber(`+${fmt(gold)} OURO`,'reward');
      this.addLog(`${name}: +${fmt(gold)} ouro, +${fmt(xp)} XP, ${shards} fragmentos${souls?`, +${souls} alma(s)`:''}!`,'✦','epic');
      this.toast(`TESOURO! +${fmt(gold)} ouro · ${rarity==='lendario'?'LENDÁRIO':'ÉPICO'} · ${shards} fragmentos`,'epic');
      if(item)this.addLog(`Tesouro raro: ${item.name}!`,'◆','epic');
      this.renderEverything();this.save();
    }
    rollRarity() {
      const s=this.state,b=this.bonuses();
      const bias=s.skills.r2+b.luck*2+s.zone*.25;
      const weights=[Math.max(15,58-bias*4),Math.max(10,27-bias),11+bias*.8,3.3+bias*1.5,.7+bias*.8];
      const sum=weights.reduce((a,v)=>a+v,0);
      let pickValue=Math.random()*sum;
      for(let i=0;i<weights.length;i++){pickValue-=weights[i];if(pickValue<=0)return RARITIES[i].id;}
      return 'comum';
    }
    makeItem(forcedRarity=null) {
      const s=this.state;
      const rarity=RARITIES.find(r=>r.id===forcedRarity)||RARITIES.find(r=>r.id===this.rollRarity())||RARITIES[0];
      const slot=pick(SLOTS);
      const base=(1+s.level*.16+s.zone*.65)*rarity.multiplier;
      const stats=slotStats();
      const roll=()=>.84+Math.random()*.35;
      if(slot==='weapon'){stats.click=Math.round(base*3.5*roll());if(rarity.multiplier>=1.95)stats.crit=Number((.007*rarity.multiplier*roll()).toFixed(4));}
      if(slot==='armor'){stats.dps=Math.round(base*2.3*roll()*10)/10;if(rarity.multiplier>=3)stats.click=Math.round(base*roll());}
      if(slot==='ring'){stats.gold=Number((base*.019*roll()).toFixed(3));stats.crit=Number((rarity.multiplier*.008*roll()).toFixed(4));}
      if(slot==='relic'){stats.luck=Number((base*.013*roll()).toFixed(3));stats.dps=Math.round(base*1.2*roll()*10)/10;}
      const prefix=pick(PREFIXES[rarity.id]);
      const title=pick(EQUIPMENT_WORDS[slot]);
      const name=prefix.startsWith('do ')||prefix.startsWith('da ')?`${title} ${prefix}`:`${title} ${prefix}`;
      return {id:uid(),slot,rarity:rarity.id,name,level:s.level,stats,createdAt:now()};
    }
    dropItem(forceRarity=null) {
      const item=this.makeItem(forceRarity);
      const s=this.state;
      if(s.inventory.length>=MAX_INVENTORY){
        if(forceRarity){
          // Event treasures are guaranteed: replace the weakest un-equipped item.
          const protectedIds=new Set(Object.values(s.equipment).filter(Boolean));
          const weakest=s.inventory.filter(i=>!protectedIds.has(i.id)).sort((a,b)=>
            RARITIES.findIndex(r=>r.id===a.rarity)-RARITIES.findIndex(r=>r.id===b.rarity) || this.itemPower(a)-this.itemPower(b))[0];
          if(weakest){
            s.inventory=s.inventory.filter(i=>i.id!==weakest.id);
            this.awardGold(this.itemPrice(weakest));
            this.addLog(`Inventário cheio: ${weakest.name} foi vendido para receber o tesouro raro.`,'♢');
          }
        }else{
          const sell=this.itemPrice(item);
          this.awardGold(sell);
          this.addLog(`Inventário cheio: ${item.name} convertido em ${fmt(sell)} ouro.`,'♢');
          return null;
        }
      }
      s.inventory.push(item);
      if(['epico','lendario'].includes(item.rarity)){
        this.addLog(`${item.rarity==='lendario'?'LENDÁRIO':'ÉPICO'} encontrado: ${item.name}!`,'◆',item.rarity==='lendario'?'rare':'epic');
        this.toast(`✦ ${item.name} encontrado!`,item.rarity==='lendario'?'rare':'epic');
      }else if(s.inventory.length<6){this.addLog(`Equipamento encontrado: ${item.name}.`,'♢');}
      $('inventoryCount').textContent=s.inventory.length;
      if(this.tab==='inventory')this.renderPanel();
      return item;
    }
    itemPrice(item) {
      return Math.max(4,Math.floor((6+item.level*4)*RARITIES.find(r=>r.id===item.rarity).multiplier*power(1.42,this.state.zone)));
    }
    equipItem(id) {
      const item=this.state.inventory.find(x=>x.id===id);
      if(!item)return;
      if(this.state.equipment[item.slot]===id)this.state.equipment[item.slot]=null;
      else this.state.equipment[item.slot]=id;
      this.renderPanel();this.renderCore();
    }
    sellItem(id) {
      const s=this.state,index=s.inventory.findIndex(x=>x.id===id);
      if(index<0)return;
      const item=s.inventory[index];
      if(s.equipment[item.slot]===id){this.toast('Desequipe este item antes de vendê-lo.');return;}
      s.inventory.splice(index,1);
      const price=this.itemPrice(item);this.awardGold(price);
      this.toast(`Item vendido por ${fmt(price)} ouro.`);this.renderPanel();
    }
    sellLowRarities() {
      const s=this.state;
      const equipped=new Set(Object.values(s.equipment).filter(Boolean));
      const toSell=s.inventory.filter(i=>['comum','incomum'].includes(i.rarity)&&!equipped.has(i.id));
      if(!toSell.length){this.toast('Nenhum equipamento comum/incomum disponível para venda.');return;}
      let total=0;for(const item of toSell)total=add(total,this.itemPrice(item));
      const ids=new Set(toSell.map(x=>x.id));s.inventory=s.inventory.filter(i=>!ids.has(i.id));
      this.awardGold(total);this.toast(`${toSell.length} itens vendidos por ${fmt(total)} ouro.`,'good');this.renderPanel();
    }
    upgradeCost(up) {
      return Math.max(1,Math.floor(multiply(up.base,power(up.growth,this.state.upgrades[up.id]))));
    }
    upgradeQuote(up,desired) {
      const s=this.state;
      const capacity=Math.max(0,MAX_RANK-s.upgrades[up.id]);
      const wanted=desired==='max'?capacity:Math.min(desired,capacity);
      let affordable=0,total=0;
      for(let i=0;i<wanted;i++){
        const price=Math.max(1,Math.floor(multiply(up.base,power(up.growth,s.upgrades[up.id]+i))));
        if(price>MAX_NUMBER-total || total+price>s.gold)break;
        total+=price;affordable++;
      }
      return {count:affordable,total};
    }
    buyUpgrade(id) {
      const up=UPGRADES.find(x=>x.id===id);
      if(!up)return;
      const quote=this.upgradeQuote(up,this.buyQuantity);
      if(!quote.count){this.toast('Ouro insuficiente para essa melhoria.');return;}
      this.state.gold=Math.max(0,this.state.gold-quote.total);
      this.state.upgrades[id]+=quote.count;
      this.renderCore();this.renderPanel();
    }
    skillCost(skill) {
      return Math.max(1,Math.floor(multiply(skill.cost,power(skill.growth,this.state.skills[skill.id]))));
    }
    buySkill(id) {
      const skill=SKILLS.find(x=>x.id===id);
      if(!skill)return;
      const s=this.state;
      if(s.skills[id]>=skill.max || (skill.req && s.skills[skill.req]<skill.reqRank))return;
      const price=this.skillCost(skill);
      if(s.souls<price){this.toast('Almas insuficientes. Renascimentos concedem novas almas.');return;}
      s.souls-=price;s.skills[id]++;
      this.addLog(`A habilidade ${skill.name} alcançou grau ${s.skills[id]}.`,'✧','epic');
      this.renderEverything();
    }
    previewPrestige() {
      const s=this.state;
      if(s.level<15 || s.runKills<100)return 0;
      const base=Math.floor(Math.sqrt(s.runGold/2900)+s.level/12+s.zone*2);
      return Math.max(1,Math.floor(base*(1+s.skills.r4*.12)));
    }
    requestAscension() {
      const gain=this.previewPrestige();
      if(!gain){this.toast('Requer nível 15 e pelo menos 100 abates nesta jornada.');return;}
      this.dialog('Renascer das Cinzas?',`Você receberá ${fmt(gain)} alma(s) permanente(s). Nível, XP, ouro, upgrades e regiões serão reiniciados.\n\nEquipamentos, inventário, fragmentos, almas e toda a árvore de habilidades serão preservados.`,[
        {text:'AINDA NÃO'},
        {text:'RENASCER',primary:true,action:()=>this.performAscension(gain)}
      ],'◆');
    }
    performAscension(gain) {
      const s=this.state;
      s.souls=add(s.souls,gain);
      s.level=1;s.xp=0;s.gold=0;s.zone=0;s.zoneKills=Array(ZONES.length).fill(0);s.zoneProgress=ZONES.map(freshProgress);
      s.upgrades=emptyRanks(UPGRADES);s.runKills=0;s.runGold=0;
      s.rebirths++;s.event=null;s.mob=freshMob(s);s.nextEventAt=now()+this.nextEventDelay();
      this.lastZoneRendered=-1;this.lastEventRendered='';
      this.changeTab('ascension');this.renderEverything();
      this.addLog(`RENASCIMENTO ${s.rebirths}: ${fmt(gain)} almas recebidas.`,'◆','epic');
      this.toast(`Você renasceu e conquistou ${fmt(gain)} almas eternas!`,'epic');
      this.save();
    }
    travelTo(z) {
      const index=validZone(z);
      if(!unlockedZone(this.state,index)){this.toast(`Região bloqueada. Derrote o chefão da área anterior para entrar.`);return;}
      if(index===this.state.zone)return;
      this.state.zone=index;
      this.state.mob=freshMob(this.state);
      this.state.event=null;
      this.state.nextEventAt=now()+this.nextEventDelay();
      this.lastZoneRendered=-1;
      this.addLog(`Você atravessou para ${ZONES[index].name}.`,'⚑','rare');
      this.changeTab('zones');this.renderEverything();this.save();
    }
    changeTab(name) {
      if(!TABS.has(name) || !this.state)return;
      this.tab=name;
      for(const btn of document.querySelectorAll('[data-tab]')){
        const active=btn.dataset.tab===name;
        btn.classList.toggle('active',active);
        btn.setAttribute('aria-selected',String(active));
      }
      this.renderPanel();
    }
    renderEverything() {this.renderCore();this.renderPanel();this.renderEvent();}
    renderScene() {
      const s=this.state;
      if(s.zone===this.lastZoneRendered)return;
      const z=ZONES[s.zone];
      $('battlefield').className=`battlefield zone-${s.zone}`;
      $('zoneName').textContent=z.name;
      $('zoneSubtitle').textContent=z.subtitle;
      $('zoneCrest').textContent=z.rune;
      // Battlefield background changes per zone; sprite changes per individual monster.
      this.lastZoneRendered=s.zone;
    }
    renderCore() {
      const s=this.state;
      if(!s)return;
      const b=this.bonuses();
      this.renderScene();
      $('goldValue').textContent=fmt(s.gold);
      $('prestigeValue').textContent=fmt(s.souls);
      $('fragmentValue').textContent=`${s.shards} / 10`;
      $('profileName').textContent=s.name;
      $('levelValue').textContent=fmt(s.level);
      const required=xpNeeded(s.level);
      $('xpLabel').textContent=s.level===MAX_LEVEL?'NÍVEL MÁXIMO':`${fmt(s.xp)} / ${fmt(required)} XP`;
      const pct=s.level>=MAX_LEVEL?100:Math.max(0,Math.min(100,s.xp/required*100));
      $('xpFill').style.width=`${pct}%`;
      $('xpProgress').setAttribute('aria-valuenow',String(Math.round(pct)));
      $('clickStat').textContent=fmt(b.click,1);
      $('dpsStat').textContent=fmt(b.dps,1);
      $('critStat').textContent=fmtPercent(b.crit);
      $('luckStat').textContent=fmtPercent(b.luck);
      $('runKills').textContent=fmt(s.runKills);
      $('runGold').textContent=fmt(s.runGold);
      $('rebirths').textContent=fmt(s.rebirths);
      $('runStatus').textContent=`JORNADA ${this.roman(Math.min(30,s.rebirths+1))}`;
      $('currentZoneShort').textContent=ZONES[s.zone].rune;
      const phase=progressAt(s),bossKind=s.mob.kind;
      $('mobName').textContent=s.mob.name;
      // A save cannot inject an arbitrary src: choose only from our bundled roster.
      const visualIndex = bossKind === 'boss' ? 6 : bossKind === 'miniboss' ? 5
        : Math.max(0, ZONES[s.zone].names.indexOf(s.mob.name));
      const sprite = monsterSrc(s.zone,visualIndex);
      const artNode = $('monsterArt');
      artNode.dataset.family = MONSTER_FAMILIES[s.zone][visualIndex];
      if (artNode.dataset.sprite !== sprite) {
        artNode.dataset.sprite = sprite;
        const portrait = document.createElement('img');
        portrait.src = sprite;
        portrait.width = 300;
        portrait.height = 315;
        portrait.alt = '';
        portrait.draggable = false;
        portrait.decoding = 'async';
        artNode.replaceChildren(portrait);
      }
      $('mobLevel').textContent=bossKind==='boss'?'☠ CHEFÃO':bossKind==='miniboss'?'✦ MINIBOSS':`Nv. ${fmt(s.mob.level)}`;
      $('battlefield').classList.toggle('boss-fight',bossKind==='boss');
      $('battlefield').classList.toggle('miniboss-fight',bossKind==='miniboss');
      $('stageNumber').textContent=`FASE ${phase.stage} / 10`;
      $('stageKills').textContent=phase.cleared?'REGIÃO CONQUISTADA':bossKind==='boss'?'CHEFÃO FINAL':bossKind==='miniboss'?'MINIBOSS':`${phase.kills} / 10 INIMIGOS`;
      $('stageProgressFill').style.width=`${phase.cleared?100:phase.kills*10}%`;
      $('stageProgressTrack').setAttribute('aria-valuenow',String(phase.cleared?100:phase.kills*10));
      for(const bar of $('stagePips').children){
        const n=Number(bar.dataset.stage);
        bar.classList.toggle('completed',phase.cleared||n<phase.stage);
        bar.classList.toggle('active',!phase.cleared&&n===phase.stage);
      }
      $('intelMob').textContent=s.mob.name;
      $('mobHPText').textContent=`${fmt(Math.ceil(s.mob.hp))} / ${fmt(s.mob.maxHp)}`;
      $('mobHPFill').style.width=`${Math.max(0,Math.min(100,100*s.mob.hp/Math.max(1,s.mob.maxHp)))}%`;
      $('zoneKillsLabel').textContent=`${fmt(s.zoneKills[s.zone])} ABATES · FASE ${phase.stage}/10`;
      const rewardScale=bossKind==='boss'?18:bossKind==='miniboss'?7:1;
      $('intelReward').textContent=`+${fmt(Math.floor(multiply(rewardGold(s),rewardScale)*b.gold))} ouro · +${fmt(Math.floor(rewardXp(s)*(bossKind==='boss'?14:bossKind==='miniboss'?6:1)))} XP`;
      $('dropChance').textContent=fmtPercent(b.drop);
      $('goldBonus').textContent=`+${fmtPercent(b.gold-1)}`;
      $('prestigePreview').textContent=fmt(this.previewPrestige());
      $('inventoryCount').textContent=s.inventory.length;
      this.renderMilestone();
      this.renderEvent();
    }
    roman(n) {
      const pairs=[[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
      let result='';for(const [a,b] of pairs)while(n>=a){result+=b;n-=a;}
      return result;
    }
    renderMilestone() {
      const s=this.state,p=progressAt(s),z=ZONES[s.zone];
      if(p.cleared){
        $('milestoneTitle').textContent='Região conquistada!';
        $('milestoneDescription').textContent=s.zone===ZONES.length-1?'O Imperador caiu. Todas as seis regiões foram conquistadas!':'Você venceu o chefão! A próxima região foi liberada. Volte às regiões anteriores quando quiser.';
      }else if(s.mob.kind==='miniboss'){
        $('milestoneTitle').textContent=`✦ MINIBOSS: ${z.miniboss}`;
        $('milestoneDescription').textContent='Derrote o guardião da fase 5 para avançar à fase 6. É obrigatório vencê-lo.';
      }else if(s.mob.kind==='boss'){
        $('milestoneTitle').textContent=`☠ CHEFÃO: ${z.boss}`;
        $('milestoneDescription').textContent='A vitória abre a próxima região automaticamente. Não é possível ignorar o chefão.';
      }else{
        const remaining=ENEMIES_PER_PHASE-p.kills;
        $('milestoneTitle').textContent=`Fase ${p.stage} · ${z.name}`;
        $('milestoneDescription').textContent=`Faltam ${remaining} inimigo${remaining===1?'':'s'} para ${p.stage===5?'desafiar o miniboss':p.stage===10?'desafiar o chefão':`chegar à fase ${p.stage+1}`}.`;
      }
    }
    renderEvent() {
      const e=this.state?.event,overlay=$('eventOverlay');
      if(!e){overlay.hidden=true;this.lastEventRendered='';return;}
      if(e.expiresAt<=now()){this.expireEvent();return;}
      overlay.hidden=false;
      const key=`${e.type}-${e.expiresAt}`;
      if(this.lastEventRendered!==key){
        $('eventTitle').textContent=e.type==='goblin'?'Goblin do Tesouro':'Baú Raro';
        $('eventArt').innerHTML=EVENT_ART[e.type]; // trusted built-in illustrations
        $('eventTarget').setAttribute('aria-label',`Atacar ${e.type==='goblin'?'goblin':'baú'} do evento`);
        this.lastEventRendered=key;
      }
      $('eventHPFill').style.width=`${Math.max(0,Math.min(100,e.hp/e.maxHp*100))}%`;
      $('eventTime').textContent=`${Math.max(0,(e.expiresAt-now())/1000).toFixed(1)}s`;
    }
    renderPanel() {
      if(!this.state)return;
      let html='';
      switch(this.tab){
        case 'upgrades':html=this.renderUpgrades();break;
        case 'inventory':html=this.renderInventory();break;
        case 'zones':html=this.renderZones();break;
        case 'ascension':html=this.renderAscension();break;
      }
      const body=$('tabBody');
      const top=body.scrollTop;
      body.innerHTML=html;
      body.scrollTop=top;
      this.lastPanelRender=now();
    }
    renderUpgrades() {
      return `<div class="section-headline"><div><h2>Forja &amp; Rituais</h2><p>Invista o ouro conquistado para fortalecer esta jornada. Melhorias básicas reiniciam na ascensão.</p></div><div class="quantity-control"><small>COMPRAR</small>${[1,10,'max'].map(n=>`<button class="mini-button ${this.buyQuantity===n?'selected':''}" data-qty="${n}" type="button">${n==='max'?'MÁX':`x${n}`}</button>`).join('')}</div></div>
      <div class="upgrade-grid">${UPGRADES.map(up=>{
        const rank=this.state.upgrades[up.id],quote=this.upgradeQuote(up,this.buyQuantity);
        const maxed=rank>=MAX_RANK;
        const label=maxed?'MELHORIA MÁXIMA':quote.count?`COMPRAR ${quote.count} · ✦ ${fmt(quote.total)}`:`✦ ${fmt(this.upgradeCost(up))} OURO`;
        return `<article class="upgrade-card"><div class="upgrade-icon">${up.icon}</div><h3 class="upgrade-name">${esc(up.title)}</h3><div class="upgrade-description">${esc(up.desc)}</div><div class="upgrade-rank"><span>NÍVEL <strong>${fmt(rank)}</strong></span><span>${esc(up.effect)}</span></div><button type="button" data-buy="${up.id}" class="buy-button" ${!quote.count?'disabled':''}>${label}</button></article>`;
      }).join('')}</div>`;
    }
    itemStatLines(item) {
      const a=item.stats,lines=[];
      if(a.click)lines.push(`+${fmt(a.click,1)} golpe`);
      if(a.dps)lines.push(`+${fmt(a.dps,1)} DPS`);
      if(a.crit)lines.push(`+${fmtPercent(a.crit)} crítico`);
      if(a.gold)lines.push(`+${fmtPercent(a.gold)} ouro`);
      if(a.luck)lines.push(`+${fmtPercent(a.luck)} sorte`);
      return lines.join(' · ') || 'Poder ancestral';
    }
    itemPower(item) {const a=item.stats;return a.click+a.dps*2+a.crit*150+a.gold*30+a.luck*35;}
    renderInventory() {
      const s=this.state;
      const equipment=SLOTS.map(slot=>{
        const item=s.inventory.find(x=>x.id===s.equipment[slot]);
        return `<div class="equip-slot"><span class="equip-symbol">${SLOT_SYMBOLS[slot]}</span><div><small>${SLOT_NAMES[slot].toUpperCase()}</small><strong title="${esc(item?.name||'Vazio')}">${item?esc(item.name):'Vazio'}</strong></div></div>`;
      }).join('');
      const filters=['all',...SLOTS];
      const filterOptions=filters.map(f=>`<option value="${f}" ${this.inventoryFilter===f?'selected':''}>${f==='all'?'Todos os tipos':SLOT_NAMES[f]}</option>`).join('');
      const sortOptions=[['new','Mais recentes'],['rarity','Maior raridade'],['power','Maior poder']].map(([key,label])=>`<option value="${key}" ${this.inventorySort===key?'selected':''}>${label}</option>`).join('');
      const items=s.inventory.filter(i=>this.inventoryFilter==='all'||i.slot===this.inventoryFilter).slice().sort((a,b)=>{
        if(this.inventorySort==='rarity')return RARITIES.findIndex(x=>x.id===b.rarity)-RARITIES.findIndex(x=>x.id===a.rarity);
        if(this.inventorySort==='power')return this.itemPower(b)-this.itemPower(a);
        return b.createdAt-a.createdAt;
      });
      return `<div class="section-headline"><div><h2>Arsenal do Errante</h2><p>Equipamentos são preservados após a ascensão. Espaço ocupado: ${s.inventory.length}/${MAX_INVENTORY}.</p></div></div>
        <div class="equipment-strip">${equipment}</div>
        <div class="inventory-tools"><div class="filter-control"><label for="inventoryFilter">TIPO</label><select class="dark-select" id="inventoryFilter">${filterOptions}</select><label for="inventorySort">ORDEM</label><select class="dark-select" id="inventorySort">${sortOptions}</select></div><button type="button" class="subtle-button" data-sell-low>VENDER COMUNS + INCOMUNS</button></div>
        ${items.length?`<div class="inventory-grid">${items.map(item=>{
          const rarity=RARITIES.find(x=>x.id===item.rarity);
          const equipped=s.equipment[item.slot]===item.id;
          return `<article class="item-card rarity-${item.rarity} ${equipped?'equipped':''}"><div class="item-top"><div class="item-glyph">${SLOT_SYMBOLS[item.slot]}</div><div><div class="rarity">${rarity.label} · NV. ${item.level}</div><h3>${esc(item.name)}</h3></div></div><div class="item-stats">${esc(this.itemStatLines(item))}</div><div class="item-actions"><button type="button" data-equip="${esc(item.id)}">${equipped?'DESEQUIPAR':'EQUIPAR'}</button><button type="button" data-sell="${esc(item.id)}" ${equipped?'disabled':''}>VENDER · ${fmt(this.itemPrice(item))}</button></div></article>`;
        }).join('')}</div>`:`<div class="empty-state"><div class="empty-glyph">◇</div><strong>Nenhum equipamento encontrado</strong>Derrote criaturas ou abra tesouros para conquistar recompensas.</div>`}`;
    }
    renderZones() {
      const s=this.state;
      return `<div class="section-headline"><div><h2>Mapa das Terras Perdidas</h2><p>Cada região possui 10 fases. Derrote 10 criaturas por fase; vença o miniboss da fase 5 e o chefão da fase 10 para liberar o próximo território.</p></div></div><div class="zone-grid">${ZONES.map((z,index)=>{
        const unlocked=unlockedZone(s,index),current=index===s.zone,p=s.zoneProgress[index];
        const gate=!unlocked?'Derrote o chefão da região anterior':p.cleared?'✦ REGIÃO CONQUISTADA':`FASE ${p.stage}/10 · ${p.kills}/10 INIMIGOS`;
        const progressPercent=p.cleared?100:((p.stage-1)*10+p.kills)*100/100;
        const bossNote=p.cleared?'Chefão derrotado':p.stage===5&&!p.minibossDefeated?'✦ Miniboss na fase 5':p.stage===10?'☠ Chefão na fase 10':'Miniboss F5 · Chefão F10';
        return `<article class="zone-card ${current?'current':''} ${!unlocked?'locked':''} ${p.cleared?'cleared':''}"><div class="zone-index">${p.cleared?'◆':unlocked?'✧':'♜'} &nbsp; REGIÃO ${z.rune}</div><h3>${esc(z.name)}</h3><p>${esc(z.subtitle)}</p><div class="zone-requirement">${gate}</div><div class="zone-progress-track"><span style="width:${progressPercent}%"></span></div><div class="zone-boss-note">${bossNote}</div><div class="zone-bestiary" aria-label="Bestiário de ${esc(z.name)}">${[...z.names,z.miniboss,z.boss].map((mobName,mobIndex)=>`<button type="button" class="bestiary-creature ${mobIndex>=5?'elite':''} ${MONSTER_SPRITES[index][mobIndex].endsWith('.png')?'original-art':''}" data-inspect-zone="${index}" data-inspect-creature="${mobIndex}" aria-label="Ver ${esc(mobName)}" title="${esc(mobName)}${MONSTER_SPRITES[index][mobIndex].endsWith('.png')?' · Arte personalizada':''}${mobIndex===5?' (Miniboss)':mobIndex===6?' (Chefão)':''}"><img src="${monsterSrc(index,mobIndex)}" width="56" height="60" loading="lazy" alt=""/></button>`).join('')}</div><button type="button" data-travel="${index}" ${!unlocked||current?'disabled':''}>${current?'ATUAL':unlocked?'VIAJAR':'BLOQUEADA'}</button></article>`;
      }).join('')}</div>`;
    }
    renderAscension() {
      const s=this.state,gain=this.previewPrestige(),ready=gain>0;
      const paths=SKILL_PATHS.map(path=>{
        const nodes=SKILLS.filter(x=>x.path===path.id).map((skill)=>{
          const rank=s.skills[skill.id];
          const maxed=rank>=skill.max;
          const locked=Boolean(skill.req && s.skills[skill.req]<skill.reqRank);
          const price=this.skillCost(skill);
          const afford=s.souls>=price;
          const disabled=locked||maxed||!afford;
          const caption=maxed?'DOMINADA':locked?`REQUER ${SKILLS.find(x=>x.id===skill.req).name} ${skill.reqRank}`:`◆ ${fmt(price)} ALMA${price>1?'S':''}`;
          return `<button type="button" class="skill-node ${rank?'unlocked':''} ${locked?'locked':''} ${!disabled?'available':''}" data-skill="${skill.id}" ${disabled?'disabled':''} title="${esc(skill.desc)}"><span class="node-symbol">${skill.icon}</span><span class="node-copy"><strong>${esc(skill.name)} · ${rank}/${skill.max}</strong><span>${esc(skill.desc)}</span><em>${esc(caption)}</em></span></button>`;
        }).join('');
        return `<div class="skill-path"><div class="skill-path-header"><span class="path-icon">${path.icon}</span><strong>${esc(path.name)}</strong><small>${esc(path.subtitle)}</small></div>${nodes}</div>`;
      }).join('');
      return `<div class="section-headline"><div><h2>O Pacto Eterno</h2><p>Almas persistem entre vidas. Desbloqueie nodos sucessivos e molde seu próprio legado.</p></div><span class="eyebrow">◆ ${fmt(s.souls)} ALMAS DISPONÍVEIS</span></div><div class="ascension-layout"><aside class="ascension-info"><div class="ascension-sigil">◆</div><h3>Renascimento</h3><p>Entregue o poder desta jornada ao crepúsculo. Sua próxima vida começará no nível 1, mas com equipamentos e habilidades permanentes.</p><div class="ascension-gain"><strong>+${fmt(gain)}</strong><span>ALMAS AO RENASCER</span></div><button type="button" class="buy-button ascend-button" data-ascend ${!ready?'disabled':''}>${ready?'INICIAR ASCENSÃO ✧':'ASCENSÃO BLOQUEADA'}</button><div class="ascension-note">${ready?'Pronto para transcender.':`Requer nível 15 (${s.level}/15) e 100 abates (${fmt(s.runKills)}/100).`} O inventário, almas, fragmentos e habilidades permanecem.</div></aside><div class="skill-tree">${paths}</div></div>`;
    }
    inspectMonster(zoneIndex,creatureIndex) {
      if (!Number.isInteger(zoneIndex) || !Number.isInteger(creatureIndex) ||
          zoneIndex<0 || zoneIndex>=ZONES.length || creatureIndex<0 || creatureIndex>6) return;
      const zone=ZONES[zoneIndex];
      const names=[...zone.names,zone.miniboss,zone.boss];
      const creature=names[creatureIndex];
      const rank=creatureIndex===6?'CHEFÃO — FASE 10':creatureIndex===5?'MINIBOSS — FASE 5':'CRIATURA COMUM';
      const isCustom=MONSTER_SPRITES[zoneIndex][creatureIndex].endsWith('.png');
      this.dialog(creature,`${rank}  ·  ${zone.name}${isCustom?'  ·  ARTE EXCLUSIVA':''}`,[{text:'FECHAR',primary:true}],creatureIndex===6?'☠':creatureIndex===5?'✦':'◇');
      const art=document.createElement('img');
      art.className='dialog-monster-preview';
      art.src=monsterSrc(zoneIndex,creatureIndex);
      art.alt='';
      art.width=260;art.height=274;art.draggable=false;
      $('dialogText').prepend(art);
    }
    onPanelClick(e) {
      if(!this.state)return;
      const b=e.target.closest('button');if(!b||b.disabled)return;
      if(b.dataset.inspectZone!==undefined){this.inspectMonster(Number(b.dataset.inspectZone),Number(b.dataset.inspectCreature));return;}
      if(b.dataset.qty){this.buyQuantity=b.dataset.qty==='max'?'max':integer(b.dataset.qty,1,1,10);this.renderPanel();return;}
      if(b.dataset.buy){this.buyUpgrade(b.dataset.buy);return;}
      if(b.dataset.equip){this.equipItem(b.dataset.equip);return;}
      if(b.dataset.sell){this.sellItem(b.dataset.sell);return;}
      if(b.hasAttribute('data-sell-low')){this.sellLowRarities();return;}
      if(b.dataset.travel!==undefined){this.travelTo(integer(b.dataset.travel));return;}
      if(b.dataset.skill){this.buySkill(b.dataset.skill);return;}
      if(b.hasAttribute('data-ascend')){this.requestAscension();}
    }
  }
  new Game();
})();

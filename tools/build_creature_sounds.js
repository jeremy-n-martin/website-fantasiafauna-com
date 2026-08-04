/**
 * Génère creature_sounds.json : mapping id créature → attack/defend/move/wince
 * à partir de audio_catalog.json (packs HoMM-style).
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const cat = require(path.join(root, 'audio_catalog.json'));
const g = fs.readFileSync(path.join(root, 'game.js'), 'utf8');
const creatures = eval(g.match(/const CREATURES = (\[.*?\]);/s)[1]);

const CODE_NAMES = {
  AAGL:'Archangel', ADVL:'Archdevil', AELM:'Air Elemental', AGRM:'Archer', ALIZ:'Alizard',
  AMAG:'Archmage', ANGL:'Angel', APEG:'Pegasus', AZUR:'Azure Dragon', BASL:'Basilisk',
  BDRF:'Battle Dwarf', BGOR:'Gorgon', BHDR:'Black Dragon', BKDR:'Red Dragon', BKNT:'Black Knight',
  BLRD:'Battle Lord', BMTH:'Behemoth', BOAR:'Boar', BODR:'Gold Dragon', BTRE:'Battle Dwarf',
  CALF:'Cavalier', CAVA:'Cavalier', CCYC:'Cyclops', CERB:'Cerberus', CGOR:'Gorgon',
  CHMP:'Champion', CHYD:'Chaos Hydra', CNTR:'Centaur', CRUS:'Crusader', CRYS:'Crystal Dragon',
  CYCL:'Cyclops', DEVL:'Devil', DFLY:'Dragon Fly', DGLM:'Diamond Golem', DHDM:'Dendroid',
  DWRF:'Dwarf', ECNT:'Elf Centaur', EELM:'Earth Elemental', EFRT:'Efreet', ENCH:'Enchanter',
  ENER:'Energy Elemental', ESUL:'Efreet Sultan', EVLI:'Evil Eye', FAER:'Fairy Dragon',
  FDFL:'Firebird', FELM:'Fire Elemental', FIRB:'Firebird', FMLR:'Familiar', GBAS:'Greater Basilisk',
  GBLN:'Goblin', GELF:'Grand Elf', GENI:'Genie', GGLM:'Gold Golem', GHDR:'Green Dragon',
  GNLM:'Gunslinger', GNOL:'Gnoll', GODR:'Gold Dragon', GOGG:'Gog', GRDR:'Green Dragon',
  GRIF:'Griffin', GTIT:'Giant Titan', GWRD:'Guard', HALB:'Halberdier', HALF:'Halfling',
  HARP:'Harpy', HCRS:'Crossbowman', HGOB:'Hobgoblin', HGWR:'Hell Hound', HHAG:'Hag',
  HHND:'Hell Hound', HYDR:'Hydra', ICEL:'Ice Elemental', IGLM:'Iron Golem', IMPP:'Imp',
  ITRG:'Iron Golem', LCRS:'Sharpshooter', LICH:'Lich', LTIT:'Lightning Titan', MAGE:'Mage',
  MAGM:'Magma Elemental', MANT:'Manticore', MEDQ:'Medusa Queen', MEDU:'Medusa', MGEL:'Mage',
  MGOG:'Magog', MGRM:'Master Gremlin', MINK:'Minotaur King', MINO:'Minotaur', MONK:'Monk',
  MUMY:'Mummy', NGRD:'Naga', NMAD:'Nomad', NOSF:'Nosferatu', NSEN:'Naga', OGRE:'Ogre',
  OGRG:'Ogre Magi', OGRM:'Ogre Mage', OORC:'Orc', ORCC:'Orc', PEGA:'Pegasus', PFND:'Phoenix',
  PFOE:'Phoenix', PHOE:'Phoenix', PIKE:'Pikeman', PIXI:'Pixie', PLCH:'Power Lich',
  PLIZ:'Power Lizard', PSNT:'Peasant', PSYC:'Psychic Elemental', RDDR:'Red Dragon',
  RGRF:'Royal Griffin', ROCC:'Roc', ROGU:'Rogue', RUST:'Rust Dragon', SCRP:'Serpent Fly',
  SGLM:'Stone Golem', SGRG:'Sea Serpent', SHDM:'Shadow', SKEL:'Skeleton', SKLW:'Skeleton Warrior',
  SPRT:'Sprite', STOR:'Storm Elemental', SWRD:'Swordsman', TBRD:'Thunderbird', TREE:'Treant',
  TRLL:'Troll', TROG:'Troglodyte', UNIC:'Unicorn', VAMP:'Vampire', WELF:'Wood Elf',
  WELM:'Water Elemental', WGHT:'Wight', WRTH:'Wraith', WUNC:'War Unicorn', WYVM:'Wyvern Monarch',
  WYVN:'Wyvern', YBMH:'Ancient Behemoth', ZELT:'Zealot', ZMBL:'Zombie', ZOMB:'Zombie',
};

function norm(s){
  return String(s || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

const ALIASES = {
  'ange':'angel', 'valkyrie':'angel', 'pegase':'pegasus', 'griffon':'griffin',
  'exorciste':'monk', 'chevalier':'swordsman', 'paladin':'crusader', 'archer':'archer',
  'templier':'crusader', 'guerrier':'swordsman', 'pretre':'monk', 'spadassin':'swordsman',
  'kenku':'harpy', 'clerc':'monk', 'page':'pikeman', 'arbaletrier':'crossbowman',
  'moine':'monk', 'acolyte':'monk', 'aasimar':'angel', 'ecuyer':'pikeman',
  'alerion':'griffin', 'voleur':'rogue', 'elfe':'wood elf', 'licorne':'unicorn',
  'centaure':'centaur', 'druide':'wood elf', 'hippogriffe':'griffin', 'dragon vert':'green dragon',
  'demi elfe':'wood elf', 'treant':'treant', 'faune':'centaur', 'rodeur':'sharpshooter',
  'dryade':'dendroid', 'satyre':'centaur', 'elfe des neiges':'grand elf', 'leshy':'dendroid',
  'ours hibou':'behemoth', 'vouivre':'wyvern', 'firbolg':'dendroid', 'amphiptere':'wyvern',
  'basajaun':'dendroid', 'nain':'dwarf', 'runiste':'battle dwarf', 'xorn':'earth elemental',
  'dao':'earth elemental', 'tatzelwurm':'wyvern', 'halfling':'halfling', 'jackalope':'boar',
  'barde':'enchanter', 'kikimora':'pixie', 'tomte':'halfling', 'boggart':'imp',
  'nisse':'halfling', 'brownie':'pixie', 'aitvaras':'dragon fly',
  'vampire':'vampire', 'zombie':'zombie', 'fantome':'wraith', 'squelette':'skeleton',
  'liche':'lich', 'momie':'mummy', 'nosferatu':'nosferatu', 'necromancien':'lich',
  'wendigo':'wight', 'poltergeist':'wraith', 'banshee':'wraith', 'chevalier de la mort':'black knight',
  'goule':'zombie', 'spectre':'wraith', 'revenant':'wight', 'wraith':'wraith',
  'dullahan':'black knight', 'dracoliche':'black dragon', 'nidhogg':'black dragon',
  'strigoi':'vampire', 'draugr':'wight', 'mort vivant':'zombie', 'dame blanche':'wraith',
  'ombre':'shadow', 'wight':'wight', 'preta':'wight', 'sluagh':'wraith',
  'varcolac':'hell hound', 'ghast':'zombie', 'alp':'wraith', 'strige':'harpy',
  'valravn':'harpy', 'ankou':'wraith', 'vetala':'vampire',
  'meduse':'medusa', 'gorgone':'gorgon', 'assassin':'rogue', 'mothman':'harpy',
  'araignee geante':'serpent fly', 'doppelganger':'rogue', 'illithid':'evil eye',
  'mimique':'troglodyte', 'tyrannoeil':'evil eye', 'basilic':'basilisk',
  'dragon d ombre':'black dragon', 'shoggoth':'behemoth', 'drow':'wood elf',
  'occultiste':'mage', 'svartalf':'dwarf', 'umber hulk':'behemoth',
  'monstre rouilleur':'rust dragon', 'cube gelatinueux':'water elemental',
  'arachne':'medusa', 'otyugh':'ogre', 'gibbering mouther':'evil eye',
  'myconide':'dendroid', 'peryton':'griffin', 'troglodyte':'troglodyte',
  'slaad':'troglodyte', 'fauve desagregateur':'behemoth', 'flumph':'air elemental',
  'gueteur':'evil eye', 'grell':'evil eye', 'amphisbene':'serpent fly',
  'orc':'orc', 'minotaure':'minotaur', 'warg':'hell hound', 'wyverne':'wyvern',
  'barbare':'ogre', 'behemoth':'behemoth', 'berserker':'ogre',
  'chupacabra':'hell hound', 'demi orc':'orc', 'drake':'wyvern',
  'tigre garou':'hell hound', 'gnoll':'gnoll', 'cynocephale':'gnoll',
  'sciapode':'halfling', 'blemmye':'ogre', 'arimaspe':'cyclops',
  'diable':'devil', 'demon':'archdevil', 'cerbere':'cerberus', 'typhon':'behemoth',
  'incubus':'devil', 'succube':'devil', 'balor':'archdevil', 'pit fiend':'archdevil',
  'erinyes':'devil', 'marilith':'archdevil', 'glabrezu':'archdevil',
  'cambion':'devil', 'imp':'imp', 'quasit':'imp', 'dretch':'imp',
  'hezrou':'ogre', 'vrock':'harpy', 'nalfeshnee':'ogre', 'goristro':'behemoth',
  'yugoloth':'devil', 'rakshasa':'mage', 'efreet':'efreet', 'mephit':'imp',
  'homoncule':'familiar', 'goleme':'stone golem', 'automate':'iron golem',
  'shield guardian':'gold golem', 'helmed horror':'iron golem', 'modron':'iron golem',
  'dactyle':'dwarf', 'forgelet':'iron golem', 'cabire':'dwarf',
  'gobelin':'goblin', 'kobold':'goblin', 'hobgobelin':'hobgoblin', 'cocatrix':'serpent fly',
  'redcap':'goblin', 'homme rat':'gnoll', 'bulette':'behemoth', 'gobelours':'ogre',
  'barghest':'hell hound', 'trow':'troll',
  'dragon':'azure dragon', 'phenix':'phoenix', 'titan':'giant titan', 'sphinx':'manticore',
  'djinn':'genie', 'dragon rouge':'red dragon', 'quetzalcoatl':'thunderbird',
  'dragon d or':'gold dragon', 'dragon bleu':'azure dragon', 'dragon d argent':'azure dragon',
  'archimage':'archmage', 'dragon d airain':'red dragon', 'elementaire':'earth elemental',
  'garuda':'griffin', 'qilin':'unicorn', 'dragon de cuivre':'red dragon',
  'enchanteresse':'enchanter', 'nephilim':'angel', 'oracle':'mage', 'lamassu':'griffin',
  'pyromancien':'fire elemental', 'enchanteur':'enchanter', 'sleipnir':'cavalier',
  'norne':'enchanter', 'oiseau tonnerre':'thunderbird', 'salamandre':'fire elemental',
  'ensorceleur':'mage', 'simurgh':'phoenix', 'asura':'archangel', 'mage':'mage',
  'apsara':'pixie', 'illusionniste':'mage', 'peri':'pixie', 'yaksha':'sprite',
  'chronomancien':'psychic elemental', 'anzu':'thunderbird', 'invocateur':'mage',
  'mushussu':'azure dragon', 'volva':'hag', 'cryomancien':'ice elemental', 'jann':'genie',
  'sylphe':'air elemental', 'genasi':'energy elemental', 'githyanki':'psychic elemental',
  'aarakocra':'harpy', 'ziz':'roc', 'githzerai':'psychic elemental', 'augure':'mage',
  'thaumaturge':'archmage',
  'troll':'troll', 'geant':'cyclops', 'yeti':'ice elemental', 'ogre':'ogre',
  'cyclope':'cyclops', 'fenrir':'hell hound', 'sasquatch':'behemoth', 'wyrm':'wyvern',
  'grendel':'ogre', 'jotunn':'cyclops', 'yuki onna':'ice elemental', 'roc':'roc',
  'lindworm':'wyvern', 'tarasque':'behemoth', 'zmey':'green dragon',
  'geant des glaces':'ice elemental', 'oreade':'earth elemental', 'fomorien':'cyclops',
  'ettin':'ogre', 'goliath':'cyclops', 'hecatonchire':'behemoth', 'amarok':'hell hound',
  'barbegazi':'ice elemental',
  'sorciere':'hag', 'loup garou':'hell hound', 'fee':'pixie', 'leprechaun':'halfling',
  'sorcier':'mage', 'baba yaga':'hag', 'kitsune':'sprite', 'lycanthrope':'hell hound',
  'mandragore':'dendroid', 'tanuki':'boar', 'pixie':'pixie', 'yokai':'sprite',
  'nekomata':'sprite', 'jabberwock':'chaos hydra', 'tengu':'harpy', 'baku':'manticore',
  'changeling':'sprite', 'sprite':'sprite', 'chaman':'mage', 'rokurokubi':'hag',
  'nymphe':'sprite', 'guenaude':'hag', 'pooka':'boar', 'sidhe':'sprite',
  'lutin':'pixie', 'spriggan':'dendroid', 'fee dragon':'fairy dragon', 'huldra':'sprite',
  'mara':'wraith', 'korrigan':'pixie', 'bete du gevaudan':'hell hound',
  'tabaxi':'sprite', 'farfadet':'pixie', 'vila':'sprite', 'croquemitaine':'wraith',
  'cu sith':'hell hound', 'bucca':'pixie',
  'kraken':'sea serpent', 'leviathan':'sea serpent', 'hydre':'hydra',
  'jormungandr':'sea serpent', 'kappa':'troglodyte', 'dragon noir':'black dragon',
  'sirene':'sprite', 'dragon marin':'sea serpent', 'dragon de bronze':'azure dragon',
  'kelpie':'water elemental', 'naga':'naga', 'scylla':'sea serpent',
  'rusalka':'wraith', 'melusine':'naga', 'selkie':'water elemental',
  'triton':'water elemental', 'yuan ti':'naga', 'homme lezard':'alizard',
  'naiade':'water elemental', 'ondine':'water elemental', 'hippocampe':'water elemental',
  'nereide':'water elemental', 'marid':'water elemental', 'grindylow':'troglodyte',
  'nixe':'water elemental', 'sahuagin':'troglodyte', 'vodyanoi':'water elemental',
  'kuo toa':'troglodyte', 'aspidochelone':'behemoth', 'lusca':'sea serpent',
  'peluda':'wyvern', 'aboleth':'evil eye', 'catoblepas':'behemoth', 'chuul':'troglodyte',
};

function catalogEntries(){
  return Object.entries(cat.creatures).map(([code, data]) => {
    const pretty = CODE_NAMES[code] || data.name;
    const core = {};
    for (const [k, act] of [['attack','ATTK'],['defend','DFND'],['move','MOVE'],['wince','WNCE'],['death','KILL']]){
      if (data.sounds?.[act]?.file) core[k] = data.sounds[act].file;
    }
    if (!core.wince && core.death) core.wince = core.death;
    if (!core.defend && core.wince) core.defend = core.wince;
    if (!core.move && core.attack) core.move = core.attack;
    const ok = !!(core.attack && core.defend && core.move && core.wince);
    return { code, pretty, prettyN: norm(pretty), dataNameN: norm(data.name), core, ok };
  }).filter(e => e.ok);
}

const packs = catalogEntries();
const byNorm = new Map();
for (const p of packs){
  byNorm.set(p.prettyN, p);
  byNorm.set(p.dataNameN, p);
  byNorm.set(norm(p.code), p);
}

function findPack(query){
  const n = norm(query);
  if (!n) return null;
  if (byNorm.has(n)) return byNorm.get(n);
  let best = null, bestScore = 0;
  for (const p of packs){
    if (p.prettyN === n || p.dataNameN === n) return p;
    if (p.prettyN.includes(n) || n.includes(p.prettyN)){
      const score = Math.min(n.length, p.prettyN.length) / Math.max(n.length, p.prettyN.length);
      if (score > bestScore){ bestScore = score; best = p; }
    }
  }
  return bestScore >= 0.55 ? best : null;
}

const THEMES = [
  { test: c => /dragon/i.test(c.name), pack: 'Azure Dragon' },
  { test: c => (c.natures || []).includes('mort-vivant'), pack: 'Skeleton' },
  { test: c => (c.natures || []).includes('méchanique') || /goleme|automate|modron|forgelet/i.test(c.name), pack: 'Iron Golem' },
  { test: c => (c.roles || []).includes('volant') && /(aarak|harpy|phénix|phenix|roc|ziz|oiseau)/i.test(c.name), pack: 'Harpy' },
  { test: c => (c.roles || []).includes('volant'), pack: 'Griffin' },
  { test: c => (c.roles || []).includes('ranged') || (c.roles || []).includes('lancer'), pack: 'Archer' },
  { test: c => (c.roles || []).includes('caster') && /(mage|sorc|oracle|archimage|illusion)/i.test(c.name), pack: 'Mage' },
  { test: c => (c.roles || []).includes('caster'), pack: 'Mage' },
  { test: c => (c.natures || []).includes('végétal'), pack: 'Treant' },
  { test: c => (c.natures || []).includes('éthéré') && /(fée|fee|pix|sprite|sidhe)/i.test(c.name), pack: 'Pixie' },
  { test: c => (c.natures || []).includes('éthéré'), pack: 'Wraith' },
  { test: c => (c.natures || []).includes('aberration'), pack: 'Evil Eye' },
  { test: c => /élémentaire|elementaire|genasi|sylphe|salamandre|dao|djinn|efreet|marid/i.test(c.name), pack: 'Earth Elemental' },
  { test: c => c.origin === 'Féérique', pack: 'Sprite' },
  { test: c => c.origin === 'Infernal' || c.origin === 'Abyssal', pack: 'Devil' },
  { test: c => c.origin === 'Céleste' || c.origin === 'Empyréen', pack: 'Angel' },
  { test: c => c.origin === 'Nécrotique', pack: 'Skeleton' },
  { test: c => (c.roles || []).includes('tank'), pack: 'Behemoth' },
  { test: c => true, pack: 'Swordsman' },
];

const mapping = {};
const stats = { exact: 0, alias: 0, theme: 0, fallback: 0 };
for (const c of creatures){
  const n = norm(c.name);
  let pack = findPack(c.name);
  let how = 'exact';
  if (!pack && ALIASES[n]){
    pack = findPack(ALIASES[n]);
    how = 'alias';
  }
  if (!pack){
    for (const [k, v] of Object.entries(ALIASES)){
      if (n.includes(k) || k.includes(n)){ pack = findPack(v); how = 'alias'; break; }
    }
  }
  if (!pack){
    for (const t of THEMES){
      if (t.test(c)){ pack = findPack(t.pack); how = 'theme'; break; }
    }
  }
  if (!pack){
    pack = packs.find(p => p.code === 'SWRD') || packs[0];
    how = 'fallback';
  }
  stats[how] = (stats[how] || 0) + 1;
  mapping[c.id] = {
    name: c.name,
    source: pack.code,
    sourceName: pack.pretty,
    match: how,
    attack: pack.core.attack,
    defend: pack.core.defend,
    move: pack.core.move,
    wince: pack.core.wince,
  };
}

const out = {
  version: 1,
  generatedAt: new Date().toISOString().slice(0, 10),
  note: 'Mapping logique créature → sons (attack/defend/move/wince). Plusieurs cartes peuvent partager le même pack.',
  stats,
  byId: mapping,
};
fs.writeFileSync(path.join(root, 'creature_sounds.json'), JSON.stringify(out, null, 2));
console.log('mapped', Object.keys(mapping).length, stats);
for (const id of [1, 8, 22, 56, 120, 199, 248, 308]){
  const m = mapping[id];
  console.log(id, m.name, '→', m.sourceName, '(' + m.match + ')');
}

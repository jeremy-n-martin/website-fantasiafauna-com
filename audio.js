/* Sons créatures — attack / defend / move / wince */
(function(){
  const ACTION_ALIASES = {
    attack: 'attack', attk: 'attack',
    defend: 'defend', dfnd: 'defend', hit: 'defend',
    move: 'move', play: 'move', summon: 'move',
    wince: 'wince', wnce: 'wince', death: 'wince', die: 'wince', kill: 'wince',
  };

  let catalog = null;
  let loading = null;
  let unlocked = false;
  const cache = new Map();
  const lastPlay = new Map();

  function ensureCatalog(){
    if(catalog) return Promise.resolve(catalog);
    if(loading) return loading;
    loading = fetch('creature_sounds.json')
      .then(r => {
        if(!r.ok) throw new Error('creature_sounds.json '+r.status);
        return r.json();
      })
      .then(data => {
        catalog = data;
        return catalog;
      })
      .catch(err => {
        console.warn('[audio]', err);
        catalog = { byId: {} };
        return catalog;
      });
    return loading;
  }

  function unlockAudio(){
    if(unlocked) return;
    unlocked = true;
    try{
      const a = new Audio();
      a.volume = 0;
      const p = a.play();
      if(p && p.catch) p.catch(()=>{});
    }catch(_){}
  }

  function entryFor(card){
    if(!catalog?.byId || !card) return null;
    const id = card.id != null ? String(card.id) : null;
    if(id && catalog.byId[id]) return catalog.byId[id];
    if(card.name){
      const found = Object.values(catalog.byId).find(e => e.name === card.name);
      if(found) return found;
    }
    return null;
  }

  function getAudio(src){
    let a = cache.get(src);
    if(!a){
      a = new Audio(src);
      a.preload = 'auto';
      cache.set(src, a);
    }
    return a;
  }

  function playFile(src, {volume=0.72, throttleMs=80}={}){
    if(!src) return;
    const now = performance.now();
    const prev = lastPlay.get(src) || 0;
    if(now - prev < throttleMs) return;
    lastPlay.set(src, now);
    try{
      const base = getAudio(src);
      const node = base.cloneNode();
      node.volume = volume;
      const p = node.play();
      if(p && p.catch) p.catch(()=>{});
    }catch(_){}
  }

  function playCreatureSound(card, action, opts={}){
    unlockAudio();
    const act = ACTION_ALIASES[String(action||'').toLowerCase()] || action;
    ensureCatalog().then(()=>{
      const entry = entryFor(card);
      if(!entry) return;
      const file = entry[act];
      if(!file) return;
      playFile(file, opts);
    });
  }

  if(typeof document !== 'undefined'){
    const unlock = () => unlockAudio();
    document.addEventListener('pointerdown', unlock, {once:true, capture:true});
    document.addEventListener('keydown', unlock, {once:true, capture:true});
  }

  ensureCatalog();

  window.FFAudio = {
    ensureCatalog,
    playCreatureSound,
    unlockAudio,
  };
  window.playCreatureSound = playCreatureSound;
})();

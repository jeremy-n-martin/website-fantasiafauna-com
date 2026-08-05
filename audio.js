/* Sons créatures — attack / defend / move / wince + contrôle volume */
(function(){
  const ACTION_ALIASES = {
    attack: 'attack', attk: 'attack',
    defend: 'defend', dfnd: 'defend', hit: 'defend',
    move: 'move', play: 'move', summon: 'move',
    wince: 'wince', wnce: 'wince', death: 'wince', die: 'wince', kill: 'wince',
    shoot: 'shoot', shot: 'shoot', ranged: 'shoot', cast: 'shoot', spell: 'shoot',
  };
  const PREFS_KEY = 'ff-audio-prefs';

  let catalog = null;
  let loading = null;
  let unlocked = false;
  let audioCtx = null;
  const lastPlay = new Map();

  let volume = 0.78;       // 0..1
  let muted = false;
  let volumeBeforeMute = 0.78;

  function loadPrefs(){
    try{
      const raw = localStorage.getItem(PREFS_KEY);
      if(!raw) return;
      const p = JSON.parse(raw);
      if(typeof p.volume === 'number') volume = Math.max(0, Math.min(1, p.volume));
      if(typeof p.muted === 'boolean') muted = p.muted;
      if(typeof p.volumeBeforeMute === 'number') volumeBeforeMute = Math.max(0, Math.min(1, p.volumeBeforeMute));
      if(muted && volume > 0) volumeBeforeMute = volume;
    }catch(_){}
  }
  function savePrefs(){
    try{
      localStorage.setItem(PREFS_KEY, JSON.stringify({volume, muted, volumeBeforeMute}));
    }catch(_){}
  }
  loadPrefs();

  function effectiveVolume(){
    if(muted || volume <= 0) return 0;
    return volume;
  }
  function isEffectivelyMuted(){
    return muted || volume <= 0 || effectiveVolume() <= 0;
  }
  function getState(){
    return {
      volume,
      muted: isEffectivelyMuted(),
      userMuted: muted,
      slider: Math.round(volume * 100),
    };
  }

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
      const AC = window.AudioContext || window.webkitAudioContext;
      if(AC){
        audioCtx = audioCtx || new AC();
        if(audioCtx.state === 'suspended') audioCtx.resume().catch(()=>{});
      }
    }catch(_){}
    try{
      const a = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAECcAACJWAAACABAAZGF0YQAAAAA=');
      a.volume = 0.01;
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

  function prefersRangedSfx(card){
    if(!card) return false;
    const tags = [...(card.roles||[]), ...(card.abilities||[])];
    return tags.some(t =>
      t==='caster' || t==='ranged' || t==='assassin' || t==='lancer' || t==='lancer-mod' || t==='lancer-max'
      || t==='sort-degat' || t==='sort-degat-mod' || t==='sort-degat-max'
    );
  }

  function resolveSoundFile(card, act){
    const entry = entryFor(card);
    if(!entry) return null;
    if(act==='attack'){
      // Caster / ranged : préférer shoot (Evil Eye, archers…) quand dispo
      if(prefersRangedSfx(card) && entry.shoot) return entry.shoot;
      return entry.attack || entry.shoot || entry.move || null;
    }
    if(act==='shoot') return entry.shoot || entry.attack || null;
    return entry[act] || null;
  }

  function playFile(src, {volume: volScale=1, throttleMs=60}={}){
    if(!src) return;
    const vol = effectiveVolume() * Math.max(0, Math.min(1, volScale));
    if(vol <= 0) return;
    const now = performance.now();
    const prev = lastPlay.get(src) || 0;
    if(now - prev < throttleMs) return;
    lastPlay.set(src, now);
    try{
      ensureCachedAudio(src); // préchauffe le cache navigateur
      const node = new Audio(encodeURI(src));
      node.preload = 'auto';
      node.volume = Math.max(0, Math.min(1, vol));
      const start = ()=>{
        try{
          node.currentTime = 0;
          const p = node.play();
          if(p && p.catch) p.catch(err => console.warn('[audio] play fail', src, err));
        }catch(err){
          console.warn('[audio] play error', src, err);
        }
      };
      if(node.readyState >= 2) start();
      else {
        node.addEventListener('canplay', start, {once:true});
        node.addEventListener('error', ()=>console.warn('[audio] load fail', src), {once:true});
        try{ node.load(); }catch(_){}
      }
    }catch(err){
      console.warn('[audio] play error', src, err);
    }
  }

  const audioCache = new Map();
  function ensureCachedAudio(src){
    let node = audioCache.get(src);
    if(node) return node;
    node = new Audio(encodeURI(src));
    node.preload = 'auto';
    try{ node.load(); }catch(_){}
    audioCache.set(src, node);
    return node;
  }

  function urlsForCard(card){
    const entry = entryFor(card);
    if(!entry) return [];
    return ['attack','defend','move','wince','shoot']
      .map(k => entry[k])
      .filter(Boolean);
  }

  /** Précharge le catalogue + les OGG des cartes données (decks / mains de combat). */
  function preloadCreatureSounds(cards, opts={}){
    const list = Array.isArray(cards) ? cards : [];
    const timeoutMs = opts.timeoutMs ?? 4000;
    return ensureCatalog().then(()=>{
      const urls = new Set();
      list.forEach(c => urlsForCard(c).forEach(u => urls.add(u)));
      if(!urls.size) return {loaded:0};
      const jobs = [...urls].map(src => new Promise(resolve=>{
        const node = ensureCachedAudio(src);
        if(node.readyState >= 3){ resolve(true); return; }
        let done=false;
        const finish=(ok)=>{
          if(done) return;
          done=true;
          resolve(!!ok);
        };
        node.addEventListener('canplaythrough', ()=>finish(true), {once:true});
        node.addEventListener('error', ()=>finish(false), {once:true});
        setTimeout(()=>finish(node.readyState>=2), timeoutMs);
      }));
      return Promise.all(jobs).then(results=>({loaded: results.filter(Boolean).length, total: urls.size}));
    });
  }

  function playFromEntry(card, act, opts){
    const file = resolveSoundFile(card, act);
    if(!file) return;
    playFile(file, opts);
  }

  function playCreatureSound(card, action, opts={}){
    unlockAudio();
    const act = ACTION_ALIASES[String(action||'').toLowerCase()] || action;
    if(catalog){
      playFromEntry(card, act, opts);
      return;
    }
    ensureCatalog().then(()=> playFromEntry(card, act, opts));
  }

  function syncVolumeUi(){
    const root = document.querySelector('.ff-volume');
    if(!root) return;
    const st = getState();
    const mutedNow = st.muted;
    root.classList.toggle('is-muted', mutedNow);
    root.dataset.muted = mutedNow ? '1' : '0';
    const btn = root.querySelector('.ff-volume-mute');
    if(btn){
      btn.setAttribute('aria-pressed', mutedNow ? 'true' : 'false');
      btn.setAttribute('aria-label', mutedNow ? 'Activer le son' : 'Couper le son');
      btn.title = mutedNow ? 'Son coupé — cliquer pour activer' : 'Son activé — cliquer pour couper';
      btn.innerHTML = mutedNow ? ICON_MUTED : ICON_ON;
    }
    const slider = root.querySelector('.ff-volume-slider');
    if(slider && document.activeElement !== slider){
      slider.value = String(st.slider);
      slider.setAttribute('aria-valuetext', mutedNow ? 'Muet' : `${st.slider}%`);
    }
    const label = root.querySelector('.ff-volume-pct');
    if(label) label.textContent = mutedNow ? 'Muet' : `${st.slider}%`;
  }

  const ICON_ON = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
  const ICON_MUTED = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`;

  function volumeControlHtml(){
    const st = getState();
    const mutedNow = st.muted;
    return `<div class="ff-volume${mutedNow?' is-muted':''}" data-muted="${mutedNow?'1':'0'}" role="group" aria-label="Volume">
      <button type="button" class="ff-volume-mute" onclick="FFAudio.toggleMute()" aria-pressed="${mutedNow?'true':'false'}" aria-label="${mutedNow?'Activer le son':'Couper le son'}" title="${mutedNow?'Son coupé — cliquer pour activer':'Son activé — cliquer pour couper'}">${mutedNow?ICON_MUTED:ICON_ON}</button>
      <input class="ff-volume-slider" type="range" min="0" max="100" step="1" value="${st.slider}" aria-label="Niveau du volume" oninput="FFAudio.setVolume(this.value/100)" />
      <span class="ff-volume-pct" aria-hidden="true">${mutedNow?'Muet':`${st.slider}%`}</span>
    </div>`;
  }

  function setVolume(v){
    unlockAudio();
    const next = Math.max(0, Math.min(1, Number(v)));
    if(Number.isNaN(next)) return getState();
    volume = next;
    if(volume <= 0){
      muted = true;
    } else {
      muted = false;
      volumeBeforeMute = volume;
    }
    savePrefs();
    syncVolumeUi();
    return getState();
  }

  function toggleMute(){
    unlockAudio();
    if(isEffectivelyMuted()){
      muted = false;
      if(volume <= 0) volume = volumeBeforeMute > 0 ? volumeBeforeMute : 0.78;
    } else {
      if(volume > 0) volumeBeforeMute = volume;
      muted = true;
    }
    savePrefs();
    syncVolumeUi();
    return getState();
  }

  if(typeof document !== 'undefined'){
    const unlock = () => unlockAudio();
    document.addEventListener('pointerdown', unlock, {once:false, capture:true});
    document.addEventListener('keydown', unlock, {once:false, capture:true});
  }

  ensureCatalog();

  window.FFAudio = {
    ensureCatalog,
    preloadCreatureSounds,
    playCreatureSound,
    unlockAudio,
    getState,
    setVolume,
    toggleMute,
    syncVolumeUi,
    volumeControlHtml,
    effectiveVolume,
  };
  window.playCreatureSound = playCreatureSound;
})();

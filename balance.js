/* Mode équilibre auto semi-actif — dual IA, sessions de 2 parties, log JSONL. */
(function () {
  const GAMES_PER_SESSION = 2;
  const STORAGE_KEY = 'ff-balance-log-backup';

  /** Profils d’IA : mêmes noms que combat.js AI_PROFILES. */
  const SESSION_AI_PLAN = [
    { player: 'standard', enemy: 'standard', focus: 'balance', note: 'Même niveau — signal d’équilibre factions/créatures' },
    { player: 'sharp', enemy: 'novice', focus: 'ai-skill', note: 'Écart de niveau — mesure l’impact des heuristiques' },
  ];

  function nowId() {
    return `bal-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  }

  function ensureSession() {
    if (!state.balanceSession) {
      state.balanceSession = {
        id: null,
        status: 'idle',
        gamesTotal: GAMES_PER_SESSION,
        gamesDone: 0,
        matches: [],
        aiPlan: SESSION_AI_PLAN.slice(),
        lastFlush: null,
      };
    }
    return state.balanceSession;
  }

  function isActive() {
    const s = state.balanceSession;
    return !!(s && s.status === 'running');
  }

  function isDualAutoplay() {
    return !!(state.battle && state.battle.autoplay && state.battle.autoplay.dual);
  }

  function ensureMatchStats(b) {
    if (!b) return null;
    if (!b.balanceStats) {
      b.balanceStats = {
        startedAt: Date.now(),
        faceDmg: { player: 0, enemy: 0 },
        creatures: {},
        decisions: {
          player: { plays: 0, attacksFace: 0, attacksMinion: 0, lethalsTaken: 0, activates: 0, randomPlays: 0 },
          enemy: { plays: 0, attacksFace: 0, attacksMinion: 0, lethalsTaken: 0, activates: 0, randomPlays: 0 },
        },
      };
    }
    return b.balanceStats;
  }

  function creatureBucket(stats, c, side) {
    const key = String(c.id);
    if (!stats.creatures[key]) {
      stats.creatures[key] = {
        id: c.id,
        name: c.name,
        capital: c.capital,
        cost: c.cost | 0,
        attack: c.attack | 0,
        health: c.health | c.maxHp | 0,
        roles: Array.isArray(c.roles) ? c.roles.slice() : [],
        abilities: Array.isArray(c.abilities) ? c.abilities.slice(0, 4) : [],
        sides: { player: 0, enemy: 0 },
        plays: 0,
        deaths: 0,
        kills: 0,
        faceDmg: 0,
        minionDmg: 0,
        survivedEnd: 0,
      };
    }
    const row = stats.creatures[key];
    if (side === 'player' || side === 'enemy') row.sides[side] = (row.sides[side] || 0) + 0;
    return row;
  }

  function trackPlay(who, card) {
    const b = state.battle;
    if (!b?.autoplay?.dual || !card) return;
    const stats = ensureMatchStats(b);
    const row = creatureBucket(stats, card, who);
    row.plays += 1;
    row.sides[who] = (row.sides[who] || 0) + 1;
    stats.decisions[who].plays += 1;
  }

  function trackActivate(who) {
    const b = state.battle;
    if (!b?.autoplay?.dual) return;
    ensureMatchStats(b).decisions[who].activates += 1;
  }

  function trackStrike(atkSide, atk, target, dealtCreature, dealtFace, wasLethal) {
    const b = state.battle;
    if (!b?.autoplay?.dual || !atk) return;
    const stats = ensureMatchStats(b);
    const row = creatureBucket(stats, atk, atkSide);
    if (dealtFace > 0) {
      row.faceDmg += dealtFace;
      stats.faceDmg[atkSide] += dealtFace;
      stats.decisions[atkSide].attacksFace += 1;
    }
    if (dealtCreature > 0) {
      row.minionDmg += dealtCreature;
      stats.decisions[atkSide].attacksMinion += 1;
    }
    if (wasLethal) stats.decisions[atkSide].lethalsTaken += 1;
  }

  function trackKill(victimSide, victim, killer) {
    const b = state.battle;
    if (!b?.autoplay?.dual || !victim) return;
    const stats = ensureMatchStats(b);
    creatureBucket(stats, victim, victimSide).deaths += 1;
    if (killer) {
      const kSide = victimSide === 'player' ? 'enemy' : 'player';
      creatureBucket(stats, killer, kSide).kills += 1;
    }
  }

  function trackSurvivors(b) {
    const stats = ensureMatchStats(b);
    if (!stats) return;
    for (const who of ['player', 'enemy']) {
      for (const c of b[who].board || []) {
        creatureBucket(stats, c, who).survivedEnd += 1;
      }
    }
  }

  function pickFactionsForMatch() {
    const all = typeof allFactions === 'function' ? allFactions() : [];
    const pick = typeof pickN === 'function' ? pickN : (arr, n) => arr.slice(0, n);
    const playerFactions = pick(all, Math.min(2, all.length));
    const rest = all.filter((f) => !playerFactions.includes(f));
    const enemyPool = rest.length >= 2 ? rest : all;
    const enemyFactions = pick(enemyPool, Math.min(2, enemyPool.length));
    return { playerFactions, enemyFactions, factions: [...new Set([...playerFactions, ...enemyFactions])] };
  }

  function startSession(opts = {}) {
    const session = ensureSession();
    if (session.status === 'running') return;
    session.id = nowId();
    session.status = 'running';
    session.gamesDone = 0;
    session.matches = [];
    session.aiPlan = SESSION_AI_PLAN.slice();
    session.lastFlush = null;
    session.startedAt = Date.now();
    session.headless = !!opts.headless;
    startMatch(0);
  }

  function abortSession() {
    const session = ensureSession();
    session.status = 'idle';
    if (state.battle?.autoplay) state.battle.autoplay = null;
  }

  function startMatch(index) {
    const session = ensureSession();
    if (session.status !== 'running') return;
    const plan = session.aiPlan[index] || SESSION_AI_PLAN[0];
    const { playerFactions, enemyFactions, factions } = pickFactionsForMatch();
    const playerFirst = Math.random() < 0.5;
    const headless = !!session.headless;
    state.tab = 'combat';
    state.combatView = 'equilibre';
    state.battle = {
      mode: 'equilibre',
      factions,
      playerFactions,
      enemyFactions,
      turn: 1,
      active: playerFirst ? 'player' : 'enemy',
      phase: 'mulligan',
      player: makeSide(playerFactions, 15, 4),
      enemy: makeSide(enemyFactions, 15, 4),
      selectedHandUid: null,
      insertAt: null,
      attackSource: null,
      aimLock: null,
      winner: null,
      coin: playerFirst ? 'Camp A commence' : 'Camp B commence',
      log: [],
      anim: null,
      flashUids: null,
      firstPlayer: playerFirst ? 'player' : 'enemy',
      autoplay: {
        dual: true,
        pace: headless ? 0 : 0.72,
        headless,
        ai: { player: plan.player, enemy: plan.enemy },
        focus: plan.focus,
        matchIndex: index,
        sessionId: session.id,
      },
      _balanceRecorded: false,
    };
    ensureMatchStats(state.battle);
    if (typeof combatLog === 'function') {
      combatLog(`Équilibre ${index + 1}/${GAMES_PER_SESSION} — A: ${playerFactions.join(' · ')} [${plan.player}] · B: ${enemyFactions.join(' · ')} [${plan.enemy}].`);
      combatLog(`Focus: ${plan.focus}. ${plan.note}`);
    }
    if (typeof preloadBattleSounds === 'function') preloadBattleSounds(state.battle);
    // Mulligan auto (spectateur)
    state.battle.phase = 'main';
    if (typeof beginTurn === 'function') beginTurn(state.battle.firstPlayer, true);
    if (typeof render === 'function') render();
  }

  function decisionRates(dec) {
    const attacks = (dec.attacksFace || 0) + (dec.attacksMinion || 0);
    return {
      ...dec,
      faceRatio: attacks ? +(dec.attacksFace / attacks).toFixed(3) : null,
      activatePerPlay: dec.plays ? +(dec.activates / dec.plays).toFixed(3) : null,
    };
  }

  function topCreatures(creatures, key, n = 5) {
    return Object.values(creatures || {})
      .filter((c) => (c[key] || 0) > 0)
      .sort((a, b) => (b[key] || 0) - (a[key] || 0))
      .slice(0, n)
      .map((c) => ({
        id: c.id,
        name: c.name,
        capital: c.capital,
        cost: c.cost,
        [key]: c[key],
        plays: c.plays,
        valueHint: c.plays ? +((c.faceDmg + c.minionDmg + c.kills * 3) / Math.max(1, c.cost * c.plays)).toFixed(2) : 0,
      }));
  }

  function underOverHints(creatures) {
    const rows = Object.values(creatures || {}).filter((c) => c.plays >= 1);
    const scored = rows.map((c) => {
      const dmg = c.faceDmg + c.minionDmg;
      const efficiency = (dmg + c.kills * 4 + c.survivedEnd * 2 - c.deaths) / Math.max(1, (c.cost || 1) * c.plays);
      return { id: c.id, name: c.name, capital: c.capital, cost: c.cost, plays: c.plays, efficiency: +efficiency.toFixed(3), faceDmg: c.faceDmg, kills: c.kills, deaths: c.deaths };
    });
    scored.sort((a, b) => b.efficiency - a.efficiency);
    return {
      // Efficacité haute → trop forte pour son coût (sous-évaluée)
      maybeUndervalued: scored.slice(0, 4),
      // Efficacité basse → trop faible pour son coût (surévaluée)
      maybeOvervalued: scored.slice().reverse().slice(0, 4),
    };
  }

  function factionOutcome(b, winner) {
    const out = {};
    for (const f of b.playerFactions || []) {
      out[f] = out[f] || { asA: 0, asB: 0, wins: 0, losses: 0, draws: 0 };
      out[f].asA += 1;
      if (winner === 'player') out[f].wins += 1;
      else if (winner === 'enemy') out[f].losses += 1;
      else out[f].draws += 1;
    }
    for (const f of b.enemyFactions || []) {
      out[f] = out[f] || { asA: 0, asB: 0, wins: 0, losses: 0, draws: 0 };
      out[f].asB += 1;
      if (winner === 'enemy') out[f].wins += 1;
      else if (winner === 'player') out[f].losses += 1;
      else out[f].draws += 1;
    }
    return out;
  }

  function buildMatchSummary(b) {
    trackSurvivors(b);
    const stats = ensureMatchStats(b);
    const durationMs = Date.now() - (stats.startedAt || Date.now());
    const winner = b.winner;
    return {
      matchIndex: b.autoplay?.matchIndex ?? 0,
      focus: b.autoplay?.focus || 'balance',
      winner,
      winnerLabel: winner === 'player' ? 'A' : winner === 'enemy' ? 'B' : 'draw',
      durationMs,
      firstPlayer: b.firstPlayer,
      hp: { A: b.player.hp, B: b.enemy.hp },
      turns: { A: b.player.turnCount, B: b.enemy.turnCount },
      factions: { A: b.playerFactions.slice(), B: b.enemyFactions.slice() },
      ai: { A: b.autoplay?.ai?.player || 'standard', B: b.autoplay?.ai?.enemy || 'standard' },
      faceDmg: { A: stats.faceDmg.player, B: stats.faceDmg.enemy },
      decisions: {
        A: decisionRates(stats.decisions.player),
        B: decisionRates(stats.decisions.enemy),
      },
      topFaceDealers: topCreatures(stats.creatures, 'faceDmg', 5),
      topKillers: topCreatures(stats.creatures, 'kills', 5),
      creatureHints: underOverHints(stats.creatures),
      factionsOutcome: factionOutcome(b, winner),
      creatures: stats.creatures,
    };
  }

  function aggregateSessionHints(matches) {
    const faction = {};
    const creature = {};
    for (const m of matches) {
      for (const [name, fo] of Object.entries(m.factionsOutcome || {})) {
        const row = (faction[name] = faction[name] || { wins: 0, losses: 0, draws: 0, games: 0 });
        row.wins += fo.wins;
        row.losses += fo.losses;
        row.draws += fo.draws;
        row.games += fo.wins + fo.losses + fo.draws;
      }
      for (const c of Object.values(m.creatures || {})) {
        const row = (creature[c.id] = creature[c.id] || {
          id: c.id,
          name: c.name,
          capital: c.capital,
          cost: c.cost,
          plays: 0,
          faceDmg: 0,
          kills: 0,
          deaths: 0,
          survivedEnd: 0,
          minionDmg: 0,
        });
        row.plays += c.plays;
        row.faceDmg += c.faceDmg;
        row.kills += c.kills;
        row.deaths += c.deaths;
        row.survivedEnd += c.survivedEnd;
        row.minionDmg += c.minionDmg;
      }
    }
    const factionRank = Object.entries(faction)
      .map(([name, r]) => ({
        name,
        ...r,
        winRate: r.games ? +((r.wins + 0.5 * r.draws) / r.games).toFixed(3) : null,
      }))
      .sort((a, b) => (b.winRate || 0) - (a.winRate || 0));

    const creatureRank = Object.values(creature)
      .filter((c) => c.plays >= 2)
      .map((c) => {
        const eff = (c.faceDmg + c.minionDmg + c.kills * 4 + c.survivedEnd * 2 - c.deaths) / Math.max(1, (c.cost || 1) * c.plays);
        return { ...c, efficiency: +eff.toFixed(3) };
      })
      .sort((a, b) => b.efficiency - a.efficiency);

    return {
      factionsStrong: factionRank.slice(0, 3),
      factionsWeak: factionRank.slice().reverse().slice(0, 3),
      // Fortes / faibles au regard du coût (signal d’équilibrage fin)
      creaturesMaybeUndervalued: creatureRank.slice(0, 6),
      creaturesMaybeOvervalued: creatureRank.slice().reverse().slice(0, 6),
      aiCompare: matches.map((m) => ({
        match: m.matchIndex,
        focus: m.focus,
        ai: m.ai,
        winner: m.winnerLabel,
        faceRatio: { A: m.decisions?.A?.faceRatio, B: m.decisions?.B?.faceRatio },
        activates: { A: m.decisions?.A?.activates, B: m.decisions?.B?.activates },
      })),
    };
  }

  async function flushSessionLog(session) {
    const payload = {
      type: 'balance-session',
      sessionId: session.id,
      games: session.gamesDone,
      durationMs: Date.now() - (session.startedAt || Date.now()),
      matches: session.matches.map((m) => {
        // alléger le log : garder résumé + top créatures, pas tout le dictionnaire brut si trop gros
        const { creatures, ...rest } = m;
        return {
          ...rest,
          creatureSample: Object.values(creatures || {})
            .filter((c) => c.plays > 0)
            .sort((a, b) => b.faceDmg + b.kills * 3 - (a.faceDmg + a.kills * 3))
            .slice(0, 12),
        };
      }),
      sessionHints: aggregateSessionHints(session.matches),
      aiProfilesStudied: ['novice', 'standard', 'sharp'],
      readme: 'Session 2 parties. Match0=balance same-AI ; Match1=sharp vs novice. sessionHints pour équilibrage fin + IA.',
    };

    // Backup localStorage (historique court)
    try {
      const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const next = Array.isArray(prev) ? prev : [];
      next.push(payload);
      while (next.length > 20) next.shift();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (_) { /* ignore */ }

    let serverOk = false;
    if (typeof window.FFBalanceWriteLog === 'function') {
      try {
        window.FFBalanceWriteLog(payload);
        serverOk = true;
      } catch (_) {
        serverOk = false;
      }
    } else {
      try {
        const res = await fetch('/api/balance-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        serverOk = res.ok;
      } catch (_) {
        serverOk = false;
      }
    }
    session.lastFlush = { at: Date.now(), serverOk };
    if (typeof combatLog === 'function') {
      combatLog(serverOk
        ? 'Session écrite dans balance_sessions.jsonl (serveur).'
        : 'Session sauvée en localStorage (serveur injoignable — lance python server.py).');
    }
    return { serverOk, payload };
  }

  function onMatchEnd() {
    const b = state.battle;
    const session = ensureSession();
    if (!b || !b.autoplay?.dual || session.status !== 'running') return;
    if (b._balanceRecorded) return;
    b._balanceRecorded = true;
    const summary = buildMatchSummary(b);
    session.matches.push(summary);
    session.gamesDone += 1;
    if (typeof combatLog === 'function') {
      combatLog(`Fin partie ${session.gamesDone}/${GAMES_PER_SESSION} — vainqueur ${summary.winnerLabel} (${summary.durationMs} ms).`);
    }
    if (session.gamesDone < GAMES_PER_SESSION) {
      const delay = session.headless ? 0 : 1800;
      setTimeout(() => {
        if (ensureSession().status !== 'running') return;
        startMatch(session.gamesDone);
      }, delay);
      if (typeof render === 'function' && !session.headless) render();
      return;
    }
    session.status = 'done';
    flushSessionLog(session).then(() => {
      if (typeof render === 'function' && !session.headless) render();
    });
    if (typeof render === 'function' && !session.headless) render();
  }

  function statusBannerHtml() {
    const session = ensureSession();
    if (session.status === 'idle' && !isDualAutoplay()) return '';
    const b = state.battle;
    const idx = (b?.autoplay?.matchIndex ?? session.gamesDone) + (b?.winner ? 0 : 0);
    const n = session.gamesDone + (b && !b.winner && session.status === 'running' ? 1 : 0);
    const aiA = b?.autoplay?.ai?.player || '—';
    const aiB = b?.autoplay?.ai?.enemy || '—';
    if (session.status === 'done') {
      const ok = session.lastFlush?.serverOk;
      return `<div class="cbt-balance-banner done">
        <b>Session équilibre terminée</b>
        <span>2 parties · log ${ok ? 'écrit sur disque' : 'localStorage seulement'}</span>
        <button type="button" class="cbt-end" onclick="backToCombatLobby()">Lobby</button>
        <button type="button" class="cbt-start" onclick="startBalanceSession()">Relancer 2 parties</button>
      </div>`;
    }
    return `<div class="cbt-balance-banner">
      <b>Spectateur · Équilibre</b>
      <span>Partie ${Math.min(n || 1, GAMES_PER_SESSION)}/${GAMES_PER_SESSION}</span>
      <span>A=${aiA} · B=${aiB}</span>
      <button type="button" class="cbt-end" onclick="abortBalanceSession()">Stop</button>
    </div>`;
  }

  async function runHeadlessSessions(count = 25) {
    const n = Math.max(1, Math.min(500, count | 0));
    const results = [];
    for (let i = 0; i < n; i++) {
      abortSession();
      startSession({ headless: true });
      // Avec timers sync, les 2 matchs sont déjà finis ; attendre le flush async
      let guard = 0;
      while (ensureSession().status === 'running' && guard++ < 50) {
        await Promise.resolve();
      }
      if (ensureSession().status === 'done') {
        let g2 = 0;
        while (!ensureSession().lastFlush && g2++ < 50) await Promise.resolve();
        results.push(ensureSession().lastFlush);
      }
    }
    return { sessions: n, flushed: results.filter(Boolean).length };
  }

  window.FFBalance = {
    startSession,
    abortSession,
    onMatchEnd,
    trackPlay,
    trackActivate,
    trackStrike,
    trackKill,
    isActive,
    isDualAutoplay,
    ensureMatchStats,
    statusBannerHtml,
    runHeadlessSessions,
    GAMES_PER_SESSION,
  };
  window.startBalanceSession = () => startSession({ headless: false });
  window.abortBalanceSession = () => {
    abortSession();
    if (typeof backToCombatLobby === 'function') backToCombatLobby();
    else if (typeof render === 'function') render();
  };
  window.runHeadlessBalance = runHeadlessSessions;
})();

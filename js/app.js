(function () {
  const data = window.FF_DATA || { creatures: [] };
  const notices = window.FF_NOTICES || {};
  const fiches = window.FF_FICHES || {};
  const app = document.getElementById("app");
  const dialog = document.getElementById("viewer");
  const dialogImage = document.getElementById("viewer-image");
  const dialogTitle = document.getElementById("viewer-title");
  const catalogNav = document.getElementById("nav-catalog");

  const sectionDefs = [
    { keys: ["fascination", "presentation", "présentation"], title: "Pourquoi cette terreur fascine", id: "fascination" },
    { keys: ["legendes", "légendes", "origines", "origins"], title: "La créature dans les légendes", id: "legendes" },
    { keys: ["anomalies", "capacites", "capacités", "abilities"], title: "Le cabinet des anomalies", id: "anomalies" },
    { keys: ["naturelle", "histoire-naturelle"], title: "Histoire naturelle", id: "naturelle" },
    { keys: ["reliques", "trivia", "sources"], title: "Reliques et curiosités", id: "reliques" }
  ];

  const creatures = (data.creatures || []).map(function (entry) {
    const notice = notices[entry.slug] || {};
    const merged = Object.assign({}, entry, notice);
    if (notice.sections) {
      merged.sections = notice.sections;
    }
    return merged;
  });

  const bySlug = {};
  creatures.forEach(function (creature, index) {
    creature.index = index;
    bySlug[creature.slug] = creature;
  });

  let viewName = "";
  let activeImage = 0;
  let viewerTrigger = null;

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function dangerDots(level) {
    const n = Math.max(1, Math.min(5, Number(level) || 1));
    return '<span class="danger-dots" aria-label="Danger ' + n + ' sur 5">' +
      "●".repeat(n) + "○".repeat(5 - n) +
      "</span>";
  }

  function dossierHtml(creature) {
    const fiche = fiches[creature.slug];
    if (!fiche) return "";
    const rows = [
      ["Nom", escapeHtml(fiche.nom || creature.name)],
      ["Accroche", "«&nbsp;" + escapeHtml(fiche.accroche) + "&nbsp;»"],
      ["Origine", escapeHtml(fiche.origine)],
      ["Tradition", escapeHtml(fiche.tradition)],
      ["Famille", escapeHtml(fiche.famille)],
      ["Danger", dangerDots(fiche.danger)],
      ["Habitat imaginaire", escapeHtml(fiche.habitat)],
      ["Trait remarquable", escapeHtml(fiche.trait)]
    ];
    return '<dl class="dossier">' + rows.map(function (row) {
      return "<div><dt>" + row[0] + "</dt><dd>" + row[1] + "</dd></div>";
    }).join("") + "</dl>";
  }

  function assetUrl(path) {
    if (!path) return "";
    const clean = path.replace(/^\/+/, "");
    return "/" + clean.split("/").map(encodeURIComponent).join("/");
  }

  function fold(value) {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function padIndex(n) {
    return String(n).padStart(3, "0");
  }

  function routeFromLocation() {
    const path = location.pathname.replace(/\/+$/, "") || "/";
    const params = new URLSearchParams(location.search);
    const match = path.match(/^\/creatures\/([^/]+)$/);
    if (path === "/" || path === "/index.html") {
      return {
        name: "catalog",
        q: params.get("q") || "",
        sort: params.get("sort") === "za" ? "za" : "az"
      };
    }
    if (match) {
      return { name: "creature", slug: decodeURIComponent(match[1]) };
    }
    return { name: "notfound" };
  }

  function catalogHref(q, sort) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (sort && sort !== "az") params.set("sort", sort);
    const query = params.toString();
    return query ? "/?" + query : "/";
  }

  function rememberCatalog(route) {
    if (route.name !== "catalog") return;
    sessionStorage.setItem("ff-catalog", catalogHref(route.q, route.sort));
    sessionStorage.setItem("ff-scroll", String(window.scrollY));
  }

  function go(href, mode) {
    const url = new URL(href, location.origin);
    if (mode === "replace") {
      history.replaceState({}, "", url.pathname + url.search);
    } else {
      history.pushState({}, "", url.pathname + url.search);
    }
    render();
  }

  function setTitle(title, description) {
    document.title = title;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
  }

  function categoriesOf() {
    const values = [];
    creatures.forEach(function (creature) {
      if (creature.category && values.indexOf(creature.category) === -1) {
        values.push(creature.category);
      }
    });
    return values.sort(function (a, b) { return fold(a).localeCompare(fold(b), "fr"); });
  }

  function originsOf() {
    const values = [];
    creatures.forEach(function (creature) {
      if (creature.origin && values.indexOf(creature.origin) === -1) {
        values.push(creature.origin);
      }
    });
    return values.sort(function (a, b) { return fold(a).localeCompare(fold(b), "fr"); });
  }

  function filtered(route) {
    const query = fold(route.q);
    let list = creatures.filter(function (creature) {
      if (!query) return true;
      const hay = creature.search || fold(creature.name);
      return hay.indexOf(query) !== -1;
    });
    list = list.slice().sort(function (a, b) {
      const cmp = fold(a.name).localeCompare(fold(b.name), "fr");
      return route.sort === "za" ? -cmp : cmp;
    });
    return list;
  }

  function sectionsOf(creature) {
    const source = creature.sections || {};
    return sectionDefs
      .map(function (def) {
        let data = null;
        def.keys.forEach(function (key) {
          if (!data && source[key]) data = source[key];
        });
        return data ? { id: def.id, title: def.title, data: data } : null;
      })
      .filter(Boolean);
  }

  function validSources(sources) {
    return (Array.isArray(sources) ? sources : []).filter(function (source) {
      if (!source || !Number.isInteger(source.id) || source.id < 1 || !source.title) return false;
      try {
        const url = new URL(source.url);
        return (url.protocol === "https:" || url.protocol === "http:") && !url.username && !url.password;
      } catch (_) {
        return false;
      }
    });
  }

  function renderNoticeText(text, sources) {
    const ids = new Set(validSources(sources).map(function (source) { return source.id; }));
    return escapeHtml(text).replace(/\[(\d+)\]/g, function (call, id) {
      if (!ids.has(Number(id))) return call;
      const href = window.location.pathname + window.location.search + "#source-" + id;
      return '<sup class="source-call"><a href="' + escapeHtml(href) + '" aria-label="Source ' + id + '">' + call + '</a></sup>';
    });
  }

  function renderSources(sources) {
    const refs = validSources(sources);
    if (!refs.length) return "";
    return '<footer class="notice-sources" aria-labelledby="sources-title"><h3 id="sources-title">Sources et lectures</h3><ol>' +
      refs.map(function (source) {
        return '<li id="source-' + source.id + '" value="' + source.id + '"><a href="' + escapeHtml(source.url) +
          '" target="_blank" rel="noopener noreferrer">' + escapeHtml(source.title) + '</a></li>';
      }).join("") + '</ol></footer>';
  }

  function renderSectionContent(data, sources) {
    if (!data) return "";
    if (typeof data === "string") {
      return "<p>" + renderNoticeText(data, sources) + "</p>";
    }
    if (Array.isArray(data)) {
      return data.map(function (paragraph) {
        return "<p>" + renderNoticeText(paragraph, sources) + "</p>";
      }).join("");
    }
    let html = "";
    if (data.lead) html += renderSectionContent(data.lead, sources);
    if (data.parts && data.parts.length) {
      html += data.parts.map(function (part) {
        const body = part.body || part.text;
        if (!part.title && !body) return "";
        return (part.title ? "<h3>" + escapeHtml(part.title) + "</h3>" : "") +
          renderSectionContent(body, sources);
      }).join("");
    }
    return html;
  }

  function imageTag(path, className, alt, lazy, size) {
    const dim = size || 240;
    const loading = lazy ? ' loading="lazy" decoding="async"' : ' decoding="async"';
    if (!path) {
      return '<span class="missing-art">Image absente</span>';
    }
    return (
      '<img class="' + className + '" src="' + escapeHtml(assetUrl(path)) +
      '" alt="' + escapeHtml(alt) + '" width="' + dim + '" height="' + dim + '"' +
      loading + '>'
    );
  }

  function foilWrap(path, innerHtml, className) {
    if (!path) return innerHtml;
    const cls = className || "creature-foil";
    return (
      '<span class="' + cls + '" style="--foil:url(\'' + escapeHtml(assetUrl(path)) + '\')">' +
        innerHtml +
      "</span>"
    );
  }

  function renderGrid(list) {
    if (!list.length) {
      return (
        '<div class="empty" role="status">' +
          '<svg viewBox="0 0 200 120" aria-hidden="true">' +
            '<g fill="none" stroke="#D2B48C" stroke-width="1.15" stroke-linecap="round">' +
              '<path d="M58 78c8-28 28-46 42-46s34 18 42 46" opacity=".85"/>' +
              '<path d="M70 78c6-16 16-26 30-26s24 10 30 26" opacity=".4"/>' +
              '<circle cx="88" cy="52" r="2.6" fill="#D2B48C" stroke="none">' +
                '<animate attributeName="opacity" values=".35;1;.35" dur="2.6s" repeatCount="indefinite"/>' +
              "</circle>" +
              '<circle cx="112" cy="52" r="2.6" fill="#D2B48C" stroke="none">' +
                '<animate attributeName="opacity" values=".35;1;.35" dur="2.6s" begin=".4s" repeatCount="indefinite"/>' +
              "</circle>" +
            "</g>" +
          "</svg>" +
          "<h2>Aucune créature ne correspond</h2>" +
          "<p>Modifiez la recherche ou réinitialisez les filtres.</p>" +
          '<p><a href="/">Réinitialiser</a></p>' +
        "</div>"
      );
    }
    return (
      '<div class="catalog-grid">' +
        list.map(function (creature, position) {
          const thumb = creature.images && creature.images[0] ? creature.images[0].thumb : "";
          return (
            '<a class="plate" href="/creatures/' + encodeURIComponent(creature.slug) + '">' +
              '<span class="plate-case">' +
                '<span class="plate-bezel">' +
                  '<span class="plate-scene">' +
                    '<img class="specimen-frame" src="/img/ornaments/specimen-frame.svg?v=3" alt="" aria-hidden="true" width="300" height="300" loading="lazy">' +
                    foilWrap(thumb, imageTag(thumb, "sprite", "", position >= 8, 240)) +
                  "</span>" +
                "</span>" +
                '<span class="plate-label">' +
                  '<span class="plate-index">' + padIndex(creature.index + 1) + "</span>" +
                  '<h2 class="plate-name">' + escapeHtml(creature.name) + "</h2>" +
                  '<svg class="plate-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>' +
                "</span>" +
              "</span>" +
            "</a>"
          );
        }).join("") +
      "</div>"
    );
  }

  function renderCatalog(route) {
    const list = filtered(route);
    const cats = categoriesOf();
    const origins = originsOf();
    const hasFilters = cats.length > 0 || origins.length > 0;
    const resetNeeded = Boolean(route.q) || route.sort !== "az";
    setTitle(
      "Fantasia Fauna — Le fantastique, espèce par espèce.",
      "Catalogue visuel de " + creatures.length + " créatures fantastiques."
    );
    catalogNav.setAttribute("aria-current", "page");

    app.innerHTML =
      '<section class="catalog-intro" aria-labelledby="catalog-title">' +
        '<div class="intro-copy">' +
          '<p class="kicker"><span aria-hidden="true">✧</span> Cabinet de curiosités</p>' +
          '<h1 class="catalog-brand" id="catalog-title">Le fantastique,<br><em>espèce par espèce.</em></h1>' +
          '<p class="catalog-lead">Un bestiaire illustré aux frontières du mythe et de l’imaginaire. Entrez, observez, laissez-vous surprendre.</p>' +
          '<a class="explore-link" href="#catalog-form">Explorer le bestiaire <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16m-6-6 6 6 6-6"/></svg></a>' +
        '</div>' +
        '<figure class="atlas-figure">' +
          '<img src="/img/ornaments/moth-atlas.svg" width="600" height="500" alt="Gravure dorée d’un papillon imaginaire, entouré de cercles célestes et de feuillages">' +
          '<figcaption><span aria-hidden="true">—</span> Les merveilles prennent forme <span aria-hidden="true">—</span></figcaption>' +
        '</figure>' +
      '</section>' +
      '<div class="collection-heading">' +
        '<div><p class="kicker">Les archives de l’imaginaire</p><h2>La collection</h2></div>' +
        '<p class="census"><b>' + creatures.length + '</b> créatures à découvrir</p>' +
      '</div>' +
      '<form class="toolbar" role="search" id="catalog-form">' +
        '<div class="search">' +
          '<label for="q">Recherche</label>' +
          '<div class="search-field">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><path class="search-line" d="M16 16l5 5"></path></svg>' +
            '<input id="q" name="q" type="search" placeholder="Nom de la créature" value="' +
              escapeHtml(route.q) + '" autocomplete="off">' +
          "</div>" +
        "</div>" +
        '<div class="sorter">' +
          '<label for="sort">Tri</label>' +
          '<select id="sort" name="sort">' +
            '<option value="az"' + (route.sort === "az" ? " selected" : "") + ">Alphabétique A–Z</option>" +
            '<option value="za"' + (route.sort === "za" ? " selected" : "") + ">Alphabétique Z–A</option>" +
          "</select>" +
        "</div>" +
        (hasFilters ? '<p class="result-count">Filtres disponibles</p>' : "") +
        '<div class="tools">' +
          '<span class="result-count" id="result-count" aria-live="polite">' + list.length + " résultat" + (list.length > 1 ? "s" : "") + "</span>" +
          '<a class="quiet" href="/" id="reset-filters"' + (resetNeeded ? "" : " hidden") + ">Réinitialiser</a>" +
          '<button class="quiet" type="button" id="random-btn">' +
            '<svg class="dice" viewBox="0 0 16 16" aria-hidden="true"><circle class="dice-orbit" cx="8" cy="8" r="5.4" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 7"/><circle class="dice-dot" cx="8" cy="8" r="1.5"/></svg>' +
            "Une créature au hasard" +
          "</button>" +
        "</div>" +
      "</form>" +
      '<div id="catalog-results">' + renderGrid(list) + "</div>";
    pauseMotion();
  }

  function updateCatalog(route) {
    const list = filtered(route);
    const results = document.getElementById("catalog-results");
    const count = document.getElementById("result-count");
    const input = document.getElementById("q");
    const sort = document.getElementById("sort");
    if (!results) {
      renderCatalog(route);
      return;
    }
    results.innerHTML = renderGrid(list);
    if (count) {
      count.textContent = list.length + " résultat" + (list.length > 1 ? "s" : "");
    }
    if (input && input.value !== route.q) input.value = route.q;
    if (sort) sort.value = route.sort;
    const reset = document.getElementById("reset-filters");
    if (reset) reset.hidden = !route.q && route.sort === "az";
    pauseMotion();
  }

  function renderCreature(slug) {
    const creature = bySlug[slug];
    if (!creature) {
      renderNotFound();
      return;
    }
    catalogNav.removeAttribute("aria-current");
    const images = creature.images || [];
    activeImage = 0;
    const current = images[0] || {};
    const sections = sectionsOf(creature);
    const back = sessionStorage.getItem("ff-catalog") || "/";
    const prev = creatures[(creature.index - 1 + creatures.length) % creatures.length];
    const next = creatures[(creature.index + 1) % creatures.length];
    const desc = creature.description || "Fiche de " + creature.name + " dans le bestiaire Fantasia Fauna.";
    setTitle(creature.name + " — Fantasia Fauna", desc);

    const dossier = dossierHtml(creature);
    const metaItems = [];
    if (!dossier && creature.category) {
      metaItems.push("<li><span>Catégorie</span>" + escapeHtml(creature.category) + "</li>");
    }
    if (!dossier && creature.origin) {
      metaItems.push("<li><span>Origine</span>" + escapeHtml(creature.origin) + "</li>");
    }

    const toc = sections.length
      ? '<nav class="toc" aria-label="Sommaire">' +
          sections.map(function (section) {
            return '<a href="#' + section.id + '">' + escapeHtml(section.title) + "</a>";
          }).join("") +
        "</nav>"
      : "";

    const noticeHtml = sections.length
      ? '<div class="notice">' +
          sections.map(function (section) {
            return '<section id="' + section.id + '"><h2>' + escapeHtml(section.title) + "</h2>" +
              renderSectionContent(section.data, creature.sources) + "</section>";
          }).join("") + renderSources(creature.sources) +
        "</div>"
      : "";

    const staged = foilWrap(
      current.src,
      imageTag(current.src, "exhibit-sprite", creature.name, false, 480),
      "creature-foil exhibit-foil"
    );

    const undocumented = !creature.description && !sections.length
      ? '<p class="undocumented">Notice encore à documenter.</p>'
      : "";

    app.innerHTML =
      '<nav class="crumb" aria-label="Fil d’Ariane">' +
        '<a href="' + escapeHtml(back) + '">Catalogue</a>' +
        "<span aria-hidden=\"true\">/</span>" +
        "<span>" + escapeHtml(creature.name) + "</span>" +
      "</nav>" +
      '<div class="creature' + (sections.length ? " has-reading" : "") + '">' +
        '<figure class="exhibit">' +
          '<div class="exhibit-well">' +
            '<img class="specimen-frame" src="/img/ornaments/specimen-frame.svg?v=3" alt="" aria-hidden="true" width="300" height="300">' +
            staged +
          "</div>" +
        "</figure>" +
        '<div class="sheet-copy">' +
          "<h1>" + escapeHtml(creature.name) + "</h1>" +
          dossier +
          (metaItems.length ? '<ul class="meta-list">' + metaItems.join("") + "</ul>" : "") +
          (creature.description ? '<p class="lede">' + escapeHtml(creature.description) + "</p>" : "") +
          undocumented +
        "</div>" +
        noticeHtml +
        toc +
      "</div>" +
      '<nav class="pager" aria-label="Créatures voisines">' +
        '<a href="/creatures/' + encodeURIComponent(prev.slug) + '"><small>Précédente</small><strong>' + escapeHtml(prev.name) + "</strong></a>" +
        '<a class="next" href="/creatures/' + encodeURIComponent(next.slug) + '"><small>Suivante</small><strong>' + escapeHtml(next.name) + "</strong></a>" +
      "</nav>";
    pauseMotion();
  }

  function renderNotFound() {
    catalogNav.removeAttribute("aria-current");
    setTitle("Créature introuvable — Fantasia Fauna", "Cette fiche n’existe pas dans le bestiaire.");
    app.innerHTML =
      '<div class="notfound">' +
        '<svg viewBox="0 0 128 128" aria-hidden="true">' +
          '<g fill="none" stroke="#D2B48C" stroke-linecap="round" stroke-linejoin="round">' +
            '<circle cx="64" cy="64" r="48" stroke-width="1" opacity=".18">' +
              '<animate attributeName="r" values="46;50;46" dur="6s" repeatCount="indefinite"/>' +
            "</circle>" +
            '<path stroke-width="1.35" opacity=".85" d="M40 84c8-28 16-46 24-46 8 0 10 14 16 14s10-14 18-14c8 0 14 20 18 46"/>' +
            '<path stroke-width="1.1" opacity=".4" d="M48 84c6-16 12-24 16-24s8 10 12 10 8-10 12-10 10 8 16 24"/>' +
            '<g class="lost-eye">' +
              '<circle cx="54" cy="58" r="2.4" fill="#D2B48C" stroke="none"/>' +
              '<circle cx="74" cy="58" r="2.4" fill="#D2B48C" stroke="none"/>' +
            "</g>" +
          "</g>" +
        "</svg>" +
        "<h1>Créature introuvable</h1>" +
        "<p>Cette adresse ne correspond à aucune fiche du catalogue.</p>" +
        '<p><a href="/">Retour au catalogue</a></p>' +
      "</div>";
    pauseMotion();
  }

  function openViewer() {
    const route = routeFromLocation();
    if (route.name !== "creature") return;
    const creature = bySlug[route.slug];
    if (!creature || !creature.images || !creature.images[activeImage]) return;
    viewerTrigger = document.activeElement;
    dialogTitle.textContent = creature.name;
    dialogImage.src = assetUrl(creature.images[activeImage].src);
    dialogImage.alt = creature.name;
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    }
  }

  function closeViewer() {
    if (dialog.open) dialog.close();
  }

  function randomCreature() {
    if (!creatures.length) return;
    const pick = creatures[Math.floor(Math.random() * creatures.length)];
    go("/creatures/" + encodeURIComponent(pick.slug));
  }

  function render() {
    const route = routeFromLocation();
    if (route.name === "catalog") {
      if (viewName === "catalog" && document.getElementById("catalog-form")) {
        updateCatalog(route);
      } else {
        viewName = "catalog";
        renderCatalog(route);
        const saved = sessionStorage.getItem("ff-scroll");
        if (saved && sessionStorage.getItem("ff-restore") === "1") {
          window.scrollTo(0, Number(saved));
          sessionStorage.removeItem("ff-restore");
        } else {
          window.scrollTo(0, 0);
        }
      }
      return;
    }
    viewName = route.name;
    window.scrollTo(0, 0);
    if (route.name === "creature") {
      activeImage = 0;
      renderCreature(route.slug);
      return;
    }
    renderNotFound();
  }

  document.addEventListener("click", function (event) {
    const zoom = event.target.closest(".exhibit-sprite");
    if (zoom && app.contains(zoom)) {
      event.preventDefault();
      openViewer();
      return;
    }
    const randomBtn = event.target.closest("#random-btn");
    if (randomBtn) {
      const current = routeFromLocation();
      if (current.name === "catalog") {
        rememberCatalog(current);
        sessionStorage.setItem("ff-restore", "1");
      }
      randomCreature();
      return;
    }
    const link = event.target.closest("a[href]");
    if (!link) return;
    const url = new URL(link.getAttribute("href"), location.origin);
    if (url.origin !== location.origin) return;
    if (/\.[a-z0-9]+$/i.test(url.pathname) && url.pathname !== "/index.html") return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (url.hash && url.pathname === location.pathname && url.search === location.search) return;
    event.preventDefault();
    const current = routeFromLocation();
    if (current.name === "catalog" && url.pathname.indexOf("/creatures/") === 0) {
      rememberCatalog(current);
      sessionStorage.setItem("ff-restore", "1");
    }
    go(url.pathname + url.search);
  });

  document.addEventListener("submit", function (event) {
    if (event.target.id !== "catalog-form") return;
    event.preventDefault();
    const q = document.getElementById("q");
    const sort = document.getElementById("sort");
    go(catalogHref(q ? q.value.trim() : "", sort ? sort.value : "az"), "replace");
  });

  document.addEventListener("input", function (event) {
    if (event.target.id !== "q" && event.target.id !== "sort") return;
    const q = document.getElementById("q");
    const sort = document.getElementById("sort");
    go(catalogHref(q ? q.value.trim() : "", sort ? sort.value : "az"), "replace");
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && dialog.open) {
      closeViewer();
    }
  });

  dialog.addEventListener("close", function () {
    if (viewerTrigger && typeof viewerTrigger.focus === "function") {
      viewerTrigger.focus();
    }
    viewerTrigger = null;
  });

  document.getElementById("viewer-close").addEventListener("click", closeViewer);
  history.scrollRestoration = "manual";
  window.addEventListener("popstate", function () {
    sessionStorage.setItem("ff-restore", "1");
    render();
  });

  document.addEventListener("error", function (event) {
    const target = event.target;
    if (!target || target.tagName !== "IMG") return;
    const mark = document.createElement("span");
    mark.className = "missing-art";
    mark.textContent = "Image absente";
    target.replaceWith(mark);
  }, true);

  function pauseMotion() {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.querySelectorAll("animate, animateTransform").forEach(function (node) {
      node.remove();
    });
  }

  pauseMotion();
  render();
})();

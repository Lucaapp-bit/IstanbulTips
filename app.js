(() => {
  'use strict';

  /* ---------- icons (Lucide, stroke) ---------- */
  const ICONS = {
    eat: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
    cafe: '<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/>',
    bar: '<path d="M8 22h8"/><path d="M12 11v11"/><path d="m19 3-7 8-7-8Z"/>',
    club: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    see: '<path d="M3 22h18"/><path d="M6 18v-7"/><path d="M10 18v-7"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M12 2 20 7H4Z"/>',
    hamam: '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
    area: '<path d="M14.1 5.55a2 2 0 0 0 1.79 0l3.66-1.83A1 1 0 0 1 21 4.62v12.76a1 1 0 0 1-.55.9l-4.55 2.27a2 2 0 0 1-1.79 0l-4.21-2.1a2 2 0 0 0-1.79 0l-3.66 1.83A1 1 0 0 1 3 19.38V6.62a1 1 0 0 1 .55-.9l4.55-2.27a2 2 0 0 1 1.79 0z"/><path d="M15 5.76v15"/><path d="M9 3.24v15"/>',
    stay: '<path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M12 4v6"/><path d="M2 18h20"/>',
    all: '<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-1.8 5.41a2 2 0 0 1-1.27 1.27L7.76 16.24l1.8-5.41a2 2 0 0 1 1.27-1.27z"/>',
    star: '<path d="M11.53 2.3a.53.53 0 0 1 .95 0l2.31 4.68a2.12 2.12 0 0 0 1.6 1.16l5.16.76a.53.53 0 0 1 .3.9l-3.74 3.64a2.12 2.12 0 0 0-.61 1.88l.88 5.14a.53.53 0 0 1-.77.56l-4.62-2.43a2.12 2.12 0 0 0-1.97 0L6.4 21.01a.53.53 0 0 1-.77-.56l.88-5.14a2.12 2.12 0 0 0-.61-1.88L2.16 9.8a.53.53 0 0 1 .3-.91l5.16-.75a2.12 2.12 0 0 0 1.6-1.16z"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    locate: '<path d="M2 12h3"/><path d="M19 12h3"/><path d="M12 2v3"/><path d="M12 19v3"/><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5" fill="currentColor"/>',
    arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    out: '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
    nav: '<polygon points="3 11 22 2 13 21 11 13 3 11"/>'
  };
  const ic = (name, size = 18, fill = false) =>
    `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="${fill ? 1.5 : 2}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;

  /* ---------- categories ---------- */
  const CATS = {
    eat: '#e4572e', cafe: '#8a5a3c', bar: '#7b4bd6', club: '#d6338f',
    see: '#2f6fe0', hamam: '#0f9d93', area: '#43a047', stay: '#3a4a63'
  };
  const catColor = (k) => CATS[k] || CATS.see;
  const CENTER = [41.0369, 28.985];

  /* ---------- i18n ---------- */
  const I18N = {
    it: {
      admin: 'Admin', whereAreYou: 'Dove sei?', searchPlaceholder: 'Dove sei? Es. Taksim',
      search: 'Cerca', useMyLocation: 'Usa la mia posizione', radius: 'Raggio', togglePanel: 'Apri o chiudi l’elenco',
      all: 'Tutti', must: 'Da non perdere', eat: 'Mangiare', cafe: 'Caffè', bar: 'Bar', club: 'Discoteche', see: 'Da vedere',
      hamam: 'Hamam', area: 'Quartieri', stay: 'Dove alloggiare',
      mustSee: 'Da non perdere',
      openMaps: 'Apri in Google Maps', noResultsNear: 'Nessun consiglio entro il raggio scelto. Ecco i più vicini',
      nearYou: 'Vicino a te', allRecs: 'Tutti i consigli', notFound: 'Posizione non trovata. Prova con un altro nome.',
      searching: 'Cerco…', geoDenied: 'Non riesco a trovare la tua posizione. Controlla che il browser possa usarla.',
      locating: 'Cerco la tua posizione…', youAreHere: 'Sei qui',
      adminLogin: 'Accesso admin', password: 'Password', cancel: 'Annulla', login: 'Entra', wrongPw: 'Password errata.',
      adminPanel: 'Pannello admin', logout: 'Esci', close: 'Chiudi', gmapsLink: 'Link Google Maps (opzionale)',
      gmapsHint: 'Incolla il link: nome e coordinate vengono compilati da soli. Oppure clicca sulla mappa per scegliere il punto.',
      name: 'Nome', category: 'Categoria', descIt: 'Descrizione (italiano)', descEn: 'Descrizione (inglese, tradotta in automatico)',
      addPlace: 'Aggiungi posto', allPlaces: 'Tutti i posti', del: 'Elimina', confirmDel: 'Eliminare questo posto?',
      added: 'Posto aggiunto.', deleted: 'Posto eliminato.', parsed: 'Dati letti dal link.',
      shortLink: 'Link abbreviato: apri il link nel browser e copia l’URL completo, oppure clicca sulla mappa.',
      pickedOnMap: 'Coordinate prese dalla mappa.', localOnly: 'Server non raggiungibile: salvato solo in questo browser.',
      saveFail: 'Errore di salvataggio.', mapError: 'Impossibile caricare la mappa.',
      noPlaces: 'Ancora nessun posto in questa categoria.',
      edit: 'Modifica', saveChanges: 'Salva modifiche', cancelEdit: 'Annulla modifica', editing: 'Stai modificando', saved: 'Modifiche salvate.',
      translating: 'Traduco in inglese…', translateFail: 'Traduzione automatica non riuscita: ho copiato il testo italiano.'
    },
    en: {
      admin: 'Admin', whereAreYou: 'Where are you?', searchPlaceholder: 'Where are you? E.g. Taksim',
      search: 'Search', useMyLocation: 'Use my location', radius: 'Radius', togglePanel: 'Open or close the list',
      all: 'All', must: 'Must see', eat: 'Eat', cafe: 'Cafés', bar: 'Bars', club: 'Clubs', see: 'See',
      hamam: 'Hammam', area: 'Neighbourhoods', stay: 'Where to stay',
      mustSee: 'Must see',
      openMaps: 'Open in Google Maps', noResultsNear: 'No tips within the chosen radius. Here are the closest ones',
      nearYou: 'Near you', allRecs: 'All recommendations', notFound: 'Location not found. Try another name.',
      searching: 'Searching…', geoDenied: 'I can’t find your location. Check that the browser is allowed to use it.',
      locating: 'Finding your location…', youAreHere: 'You are here',
      adminLogin: 'Admin login', password: 'Password', cancel: 'Cancel', login: 'Log in', wrongPw: 'Wrong password.',
      adminPanel: 'Admin panel', logout: 'Log out', close: 'Close', gmapsLink: 'Google Maps link (optional)',
      gmapsHint: 'Paste the link: name and coordinates are filled in automatically. Or click the map to pick the spot.',
      name: 'Name', category: 'Category', descIt: 'Description (Italian)', descEn: 'Description (English, auto-translated)',
      addPlace: 'Add place', allPlaces: 'All places', del: 'Delete', confirmDel: 'Delete this place?',
      added: 'Place added.', deleted: 'Place deleted.', parsed: 'Data read from the link.',
      shortLink: 'Shortened link: open it in the browser and copy the full URL, or click the map.',
      pickedOnMap: 'Coordinates taken from the map.', localOnly: 'Server unreachable: saved in this browser only.',
      saveFail: 'Save error.', mapError: 'Could not load the map.',
      noPlaces: 'No places in this category yet.',
      edit: 'Edit', saveChanges: 'Save changes', cancelEdit: 'Cancel edit', editing: 'Editing', saved: 'Changes saved.',
      translating: 'Translating to English…', translateFail: 'Automatic translation failed: the Italian text was copied.'
    }
  };

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
    del(k) { try { localStorage.removeItem(k); } catch { /* ignore */ } }
  };

  let lang = store.get('lang') || ((navigator.language || 'en').toLowerCase().startsWith('it') ? 'it' : 'en');
  const t = (k) => (I18N[lang] && I18N[lang][k]) || k;
  const isMobile = () => window.matchMedia('(max-width: 800px)').matches;

  /* ---------- state ---------- */
  let places = [];
  let userPos = null;      // [lat, lng] — real location or a searched place
  let userMarker = null;
  let watchId = null;
  let filter = 'all';
  let adminPw = null;
  let applied = [];        // ids from data/additions.json already merged into the server data
  let additions = [];
  let needsSync = false;   // additions shown but not yet saved on the server
  const markers = new Map();
  const adminDlg = $('adminDlg'), loginDlg = $('loginDlg');

  /* ---------- helpers ---------- */
  function distKm(a, b) {
    const R = 6371, rad = (x) => (x * Math.PI) / 180;
    const dLat = rad(b[0] - a[0]), dLng = rad(b[1] - a[1]);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  const fmtDist = (km) => (km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`);
  const descOf = (p) => (p.desc && (p.desc[lang] || p.desc.it || p.desc.en)) || '';
  const mapsUrl = (p) => p.url || `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`;

  /* ---------- map (MapLibre + OpenFreeMap, no API key) ---------- */
  const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';
  let map;

  function initMap() {
    if (typeof maplibregl === 'undefined') {
      $('map').innerHTML = `<div class="map-error">${esc(t('mapError'))}</div>`;
      return;
    }
    map = new maplibregl.Map({ container: 'map', style: STYLE_URL, center: [CENTER[1], CENTER[0]], zoom: 11.5, attributionControl: { compact: true } });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
    map.on('click', (e) => {
      if (!adminDlg.open) return;
      $('fLat').value = e.lngLat.lat.toFixed(6);
      $('fLng').value = e.lngLat.lng.toFixed(6);
      $('adminMsg').textContent = t('pickedOnMap');
    });
  }

  function mapPadding() {
    if (isMobile()) {
      const sheet = $('panel').getBoundingClientRect().height;
      return { top: 60, bottom: Math.min(sheet, window.innerHeight * 0.6) + 30, left: 30, right: 30 };
    }
    return { top: 80, bottom: 80, left: 470, right: 60 };
  }

  function pinEl(p) {
    const wrap = document.createElement('div'); // MapLibre positions this element itself
    const color = catColor(p.category);
    wrap.innerHTML = `<div class="pin${p.mustSee ? ' must' : ''}" title="${esc(p.name)}">
      <svg class="shape" viewBox="0 0 40 48" aria-hidden="true"><path d="M20 47S3 31 3 19a17 17 0 0 1 34 0c0 12-17 28-17 28z" fill="${color}" stroke="#fff" stroke-width="2"/></svg>
      <span class="glyph">${ic(p.category in ICONS ? p.category : 'see', 20)}</span>
      ${p.mustSee ? `<span class="star">${ic('star', 12, true)}</span>` : ''}</div>`;
    return wrap;
  }

  function mePinEl() {
    const wrap = document.createElement('div');
    wrap.innerHTML = '<div class="me-pin" role="img"></div>';
    wrap.firstChild.setAttribute('aria-label', t('youAreHere'));
    return wrap;
  }

  function popupHtml(p) {
    return `<div class="info"><strong>${esc(p.name)}</strong><span>${esc(descOf(p))}</span>
      <a href="${esc(mapsUrl(p))}" target="_blank" rel="noopener">${esc(t('openMaps'))}</a></div>`;
  }

  /* ---------- rendering ---------- */
  function applyI18n() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
    document.querySelectorAll('.lang button').forEach((b) => b.classList.toggle('active', b.dataset.lang === lang));
    const sel = $('fCat');
    const cur = sel.value;
    sel.innerHTML = Object.keys(CATS).map((k) => `<option value="${k}">${esc(t(k))}</option>`).join('');
    if (cur) sel.value = cur;
    renderFilters();
    render();
    renderAdminList();
  }

  function renderFilters() {
    const items = [{ k: 'all', i: 'all', c: '' }, { k: 'must', i: 'star', c: '' },
      ...Object.keys(CATS).map((k) => ({ k, i: k, c: CATS[k] }))];
    $('filters').innerHTML = items.map((x) =>
      `<button type="button" class="chip${x.k === 'all' || x.k === 'must' ? ' ' + x.k : ''}${filter === x.k ? ' active' : ''}" data-cat="${x.k}" style="--cc:${x.c || 'var(--ink)'}" aria-pressed="${filter === x.k}">
        <span class="dot">${ic(x.i, 14, x.k === 'must')}</span>${esc(t(x.k))}</button>`
    ).join('');
  }

  function visiblePlaces() {
    let list = places.filter((p) => filter === 'all' || (filter === 'must' ? p.mustSee : p.category === filter));
    if (!userPos) {
      list = [...list].sort((a, b) => Number(!!b.mustSee) - Number(!!a.mustSee));
      return { list, title: t('allRecs') };
    }
    const radius = parseFloat($('radius').value);
    list = list.map((p) => ({ ...p, _d: distKm(userPos, [p.lat, p.lng]) })).sort((a, b) => a._d - b._d);
    const near = list.filter((p) => p._d <= radius);
    if (near.length) return { list: near, title: t('nearYou') };
    return { list: list.slice(0, 3), title: t('noResultsNear') };
  }

  function render() {
    const { list, title } = visiblePlaces();
    markers.forEach((m) => m.remove());
    markers.clear();
    if (map) {
      list.forEach((p) => {
        const m = new maplibregl.Marker({ element: pinEl(p), anchor: 'bottom' })
          .setLngLat([p.lng, p.lat])
          .setPopup(new maplibregl.Popup({ offset: 44, closeButton: false, maxWidth: '260px' }).setHTML(popupHtml(p)))
          .addTo(map);
        markers.set(p.id, m);
      });
    }
    $('listTitle').textContent = title;
    $('count').textContent = list.length ? String(list.length) : '';
    $('results').innerHTML = list.map((p) => {
      const col = catColor(p.category);
      return `<article class="card${p.mustSee ? ' must' : ''}" data-id="${esc(p.id)}" style="--cc:${col}" tabindex="0">
        <div class="badge">${ic(p.category in ICONS ? p.category : 'see', 22)}</div>
        <div>
          <h3>${esc(p.name)}</h3>
          <div class="cat"><b>${esc(t(p.category))}</b>${p.mustSee ? `<span class="tag-must">${ic('star', 12, true)}${esc(t('mustSee'))}</span>` : ''}</div>
          <p>${esc(descOf(p))}</p>
          <div class="meta">
            <span class="dist">${p._d != null ? ic('nav', 13) + esc(fmtDist(p._d)) : ''}</span>
            <a class="gmaps" href="${esc(mapsUrl(p))}" target="_blank" rel="noopener">${esc(t('openMaps'))}${ic('out', 14)}</a>
          </div>
        </div></article>`;
    }).join('') || `<p class="empty">${esc(t('noPlaces'))}</p>`;
  }

  function fitView() {
    if (!map) return;
    const { list } = visiblePlaces();
    const pts = list.map((p) => [p.lng, p.lat]);
    if (userPos) pts.push([userPos[1], userPos[0]]);
    const padding = mapPadding();
    if (pts.length > 1) {
      const b = new maplibregl.LngLatBounds(pts[0], pts[0]);
      pts.forEach((q) => b.extend(q));
      map.fitBounds(b, { padding, maxZoom: 16, duration: 700 });
    } else if (pts.length === 1) map.flyTo({ center: pts[0], zoom: 15, padding });
  }

  /* ---------- user position (blue dot) ---------- */
  function clearUser() { if (userMarker) { userMarker.remove(); userMarker = null; } }
  function stopWatch() { if (watchId != null && navigator.geolocation) navigator.geolocation.clearWatch(watchId); watchId = null; }

  function setUser(pos, { fit = true } = {}) {
    userPos = pos;
    if (!userMarker && map) userMarker = new maplibregl.Marker({ element: mePinEl(), anchor: 'center' }).setLngLat([pos[1], pos[0]]).addTo(map);
    else if (userMarker) userMarker.setLngLat([pos[1], pos[0]]);
    render();
    if (fit) fitView();
  }

  function locateMe() {
    if (!navigator.geolocation) { $('searchMsg').textContent = t('geoDenied'); return; }
    $('searchMsg').textContent = t('locating');
    stopWatch();
    let first = true, last = null;
    watchId = navigator.geolocation.watchPosition(
      (p) => {
        const pos = [p.coords.latitude, p.coords.longitude];
        $('searchMsg').textContent = '';
        if (first) { first = false; last = pos; setUser(pos); setSheet('half'); return; }
        if (distKm(last, pos) < 0.03) return; // ignore GPS jitter (<30 m)
        last = pos; setUser(pos, { fit: false });
      },
      () => { first = false; stopWatch(); $('searchMsg').textContent = t('geoDenied'); },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  /* ---------- search ---------- */
  async function geocode(q) {
    const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&accept-language=' + lang +
      '&viewbox=28.4,41.35,29.6,40.8&q=' + encodeURIComponent(q + ', Istanbul');
    const r = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!r.ok) throw new Error('geocode');
    const data = await r.json();
    return data[0] ? { pos: [parseFloat(data[0].lat), parseFloat(data[0].lon)] } : null;
  }

  $('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const q = $('searchInput').value.trim();
    stopWatch();
    if (!q) { userPos = null; clearUser(); render(); $('searchMsg').textContent = ''; return; }
    $('searchMsg').textContent = t('searching');
    try {
      const res = await geocode(q);
      if (!res) { $('searchMsg').textContent = t('notFound'); return; }
      $('searchMsg').textContent = '';
      setUser(res.pos);
      setSheet('half');
    } catch { $('searchMsg').textContent = t('notFound'); }
  });

  $('geoBtn').addEventListener('click', locateMe);

  $('radius').addEventListener('input', () => {
    $('radiusVal').textContent = $('radius').value;
    render();
    if (userPos) fitView();
  });

  $('filters').addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    filter = b.dataset.cat;
    renderFilters(); render(); fitView();
  });

  function focusCard(card) {
    const m = markers.get(card.dataset.id);
    if (!m || !map) return;
    if (isMobile()) setSheet('peek');
    map.flyTo({ center: m.getLngLat(), zoom: Math.max(map.getZoom(), 16), padding: mapPadding() });
    if (!m.getPopup().isOpen()) m.togglePopup();
  }
  $('results').addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    const c = e.target.closest('.card');
    if (c) focusCard(c);
  });
  $('results').addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('card')) { e.preventDefault(); focusCard(e.target); }
  });

  document.querySelectorAll('.lang button').forEach((b) => b.addEventListener('click', () => {
    lang = b.dataset.lang; store.set('lang', lang); applyI18n();
  }));

  /* ---------- mobile bottom sheet ---------- */
  const SHEET = ['peek', 'half', 'full'];
  function setSheet(state) {
    if (!isMobile()) return;
    $('panel').dataset.state = state;
    setTimeout(() => { if (map) map.resize(); }, 320);
  }
  $('grab').addEventListener('click', () => {
    const cur = SHEET.indexOf($('panel').dataset.state);
    setSheet(SHEET[(cur + 1) % SHEET.length]);
  });
  (() => {
    let y0 = null;
    const g = $('grab');
    g.addEventListener('touchstart', (e) => { y0 = e.touches[0].clientY; }, { passive: true });
    g.addEventListener('touchend', (e) => {
      if (y0 == null) return;
      const dy = e.changedTouches[0].clientY - y0; y0 = null;
      if (Math.abs(dy) < 24) return; // a tap: let the click handler cycle
      const cur = SHEET.indexOf($('panel').dataset.state);
      setSheet(SHEET[Math.max(0, Math.min(2, cur + (dy < 0 ? 1 : -1)))]);
      e.preventDefault();
    });
  })();

  /* ---------- data ---------- */
  const fixLegacy = (list) => list.map((p) => {
    let q = p;
    if (q.category === 'drink') q = { ...q, category: 'cafe' };
    if (q.category === 'other' || !CATS[q.category]) q = { ...q, category: q.category === 'drink' ? 'cafe' : 'see' };
    if (q.category === 'stay' && /^seed-stay-(cihangir|beyoglu|besiktas)$/.test(q.id)) q = { ...q, category: 'area' };
    return q;
  });

  async function loadPlaces() {
    try {
      const r = await fetch('/api/places', { cache: 'no-store' });
      if (r.ok) {
        const j = await r.json();
        if (Array.isArray(j.places)) { places = fixLegacy(j.places); applied = Array.isArray(j.applied) ? j.applied : []; return; }
      }
    } catch { /* fall through */ }
    const local = store.get('places-local');
    if (local) { try { places = fixLegacy(JSON.parse(local)); return; } catch { /* ignore */ } }
    const r = await fetch('data/places.json');
    places = fixLegacy(await r.json());
  }

  // New places added by the developer (data/additions.json) show up for everyone and are
  // saved on the server at the next admin login, after which they can be edited or deleted normally.
  async function mergeAdditions() {
    try {
      const r = await fetch('data/additions.json', { cache: 'no-store' });
      if (!r.ok) return;
      additions = fixLegacy(await r.json());
    } catch { return; }
    const fresh = additions.filter((x) => !applied.includes(x.id) && !places.some((p) => p.id === x.id));
    if (fresh.length) places = places.concat(fresh);
    needsSync = additions.some((x) => !applied.includes(x.id));
  }

  async function savePlaces(next) {
    try {
      const r = await fetch('/api/places', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPw, places: next, applied: [...new Set([...applied, ...additions.map((x) => x.id)])] })
      });
      if (r.status === 401) throw Object.assign(new Error('auth'), { auth: true });
      if (!r.ok) throw new Error('server');
      places = next; store.del('places-local');
      applied = [...new Set([...applied, ...additions.map((x) => x.id)])]; needsSync = false;
      return { ok: true };
    } catch (err) {
      if (err.auth) return { ok: false, auth: true };
      places = next; store.set('places-local', JSON.stringify(next));
      return { ok: true, local: true };
    }
  }

  /* ---------- admin ---------- */
  $('adminBtn').addEventListener('click', () => {
    if (adminPw) openAdmin(); else { $('pwInput').value = ''; $('loginMsg').textContent = ''; loginDlg.showModal(); $('pwInput').focus(); }
  });
  $('loginCancel').addEventListener('click', () => loginDlg.close());

  $('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const pw = $('pwInput').value;
    let ok = false;
    try {
      const r = await fetch('/api/places', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) });
      ok = r.ok;
    } catch { ok = false; }
    if (!ok) { $('loginMsg').textContent = t('wrongPw'); return; }
    adminPw = pw; loginDlg.close(); openAdmin();
    if (needsSync) { await savePlaces(places); renderAdminList(); }
  });

  function openAdmin() {
    document.body.classList.add('admin-open');
    renderAdminList();
    if (!adminDlg.open) adminDlg.show(); // non-modal: the map stays clickable
  }
  function closeAdmin() { adminDlg.close(); document.body.classList.remove('admin-open'); }
  $('adminClose').addEventListener('click', closeAdmin);
  $('logoutBtn').addEventListener('click', () => { adminPw = null; closeAdmin(); });

  function renderAdminList() {
    $('adminList').innerHTML = places.map((p) => `
      <li><div class="who"><span class="mini" style="--cc:${catColor(p.category)}">${ic(p.category in ICONS ? p.category : 'see', 17)}</span>
        <div><strong>${esc(p.name)}${p.mustSee ? ic('star', 14, true) : ''}</strong><small>${esc(descOf(p))}</small></div></div>
      <div class="row-actions"><button type="button" data-edit="${esc(p.id)}">${esc(t('edit'))}</button>
      <button type="button" data-del="${esc(p.id)}">${esc(t('del'))}</button></div></li>`).join('');
  }

  $('adminList').addEventListener('click', async (e) => {
    const eb = e.target.closest('[data-edit]');
    if (eb) { startEdit(eb.dataset.edit); return; }
    const b = e.target.closest('[data-del]');
    if (!b || !confirm(t('confirmDel'))) return;
    if (b.dataset.del === editingId) { $('placeForm').reset(); $('adminMsg').textContent = ''; }
    const res = await savePlaces(places.filter((p) => p.id !== b.dataset.del));
    $('adminMsg').textContent = res.ok ? (res.local ? t('localOnly') : t('deleted')) : t('wrongPw');
    renderAdminList(); render();
  });

  function parseGmaps(url) {
    const out = {};
    const nm = url.match(/\/place\/([^/@?]+)/);
    if (nm) { try { out.name = decodeURIComponent(nm[1].replace(/\+/g, ' ')); } catch { out.name = nm[1].replace(/\+/g, ' '); } }
    const c = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/) || url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (c) { out.lat = parseFloat(c[1]); out.lng = parseFloat(c[2]); }
    return out;
  }

  $('fUrl').addEventListener('input', () => {
    const v = $('fUrl').value.trim();
    if (!v) return;
    if (/goo\.gl|maps\.app/.test(v)) { $('adminMsg').textContent = t('shortLink'); return; }
    const r = parseGmaps(v);
    if (r.lat == null) return;
    if (r.name && !$('fName').value) $('fName').value = r.name;
    $('fLat').value = r.lat; $('fLng').value = r.lng;
    $('adminMsg').textContent = t('parsed');
  });

  /* ---------- auto-translation IT -> EN (MyMemory, free, no key) ---------- */
  const decodeEntities = (s) => { const d = document.createElement('textarea'); d.innerHTML = s; return d.value; };

  async function translateChunk(text) {
    const r = await fetch('https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) + '&langpair=it|en');
    if (!r.ok) throw new Error('translate');
    const j = await r.json();
    const out = j && j.responseData && j.responseData.translatedText;
    if (!out || Number(j.responseStatus) !== 200) throw new Error('translate');
    return decodeEntities(out);
  }

  async function translateIt(text) {
    // MyMemory accepts ~500 bytes per request: split long text by sentence.
    const parts = text.split(/(?<=[.!?])\s+/);
    const chunks = [];
    let cur = '';
    for (const p of parts) {
      if (new TextEncoder().encode(cur + ' ' + p).length > 450 && cur) { chunks.push(cur); cur = p; } else cur = cur ? cur + ' ' + p : p;
    }
    if (cur) chunks.push(cur);
    const out = [];
    for (const c of chunks) out.push(await translateChunk(c));
    return out.join(' ');
  }

  let enManual = false, trSeq = 0, trTimer = null, editingId = null;

  function scheduleTranslate() {
    clearTimeout(trTimer);
    if (enManual) return;
    const txt = $('fDescIt').value.trim();
    if (!txt) { $('fDescEn').value = ''; return; }
    trTimer = setTimeout(async () => {
      const my = ++trSeq;
      $('adminMsg').textContent = t('translating');
      try {
        const en = await translateIt(txt);
        if (my === trSeq && !enManual) { $('fDescEn').value = en; $('adminMsg').textContent = ''; }
      } catch { if (my === trSeq) $('adminMsg').textContent = t('translateFail'); }
    }, 900);
  }

  function setEditing(id) {
    editingId = id;
    const sb = $('submitBtn');
    sb.dataset.i18n = id ? 'saveChanges' : 'addPlace';
    sb.textContent = t(sb.dataset.i18n);
    $('cancelEdit').hidden = !id;
  }

  // Typing in EN = manual (protected); clearing EN re-enables auto-translation from IT.
  $('fDescEn').addEventListener('input', () => { enManual = $('fDescEn').value.trim() !== ''; if (!enManual) scheduleTranslate(); });
  $('fDescIt').addEventListener('input', scheduleTranslate);
  $('placeForm').addEventListener('reset', () => { enManual = false; clearTimeout(trTimer); trSeq++; setEditing(null); });
  $('cancelEdit').addEventListener('click', () => { $('placeForm').reset(); $('adminMsg').textContent = ''; });

  function startEdit(id) {
    const p = places.find((x) => x.id === id);
    if (!p) return;
    $('placeForm').reset(); // also leaves any previous edit
    $('fUrl').value = p.url || '';
    $('fName').value = p.name;
    $('fCat').value = CATS[p.category] ? p.category : 'see';
    $('fDescIt').value = (p.desc && p.desc.it) || '';
    $('fDescEn').value = (p.desc && p.desc.en) || '';
    $('fLat').value = p.lat;
    $('fLng').value = p.lng;
    $('fMust').checked = !!p.mustSee;
    enManual = $('fDescEn').value.trim() !== ''; // keep the existing English unless cleared
    setEditing(id);
    $('adminMsg').textContent = `${t('editing')}: ${p.name}`;
    adminDlg.scrollTop = 0;
    if (map) map.flyTo({ center: [p.lng, p.lat], zoom: Math.max(map.getZoom(), 15), padding: mapPadding() });
  }

  $('placeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    clearTimeout(trTimer); trSeq++;
    const descIt = $('fDescIt').value.trim();
    let descEn = $('fDescEn').value.trim();
    if (!descEn && descIt) {
      $('adminMsg').textContent = t('translating');
      try { descEn = await translateIt(descIt); } catch { descEn = descIt; $('adminMsg').textContent = t('translateFail'); }
    }
    const p = {
      id: editingId || ('p-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)),
      name: $('fName').value.trim(),
      category: $('fCat').value,
      mustSee: $('fMust').checked,
      lat: parseFloat($('fLat').value),
      lng: parseFloat($('fLng').value),
      desc: { it: descIt, en: descEn },
      url: $('fUrl').value.trim() || ''
    };
    if (!p.name || Number.isNaN(p.lat) || Number.isNaN(p.lng)) return;
    const wasEdit = !!editingId;
    const res = await savePlaces(wasEdit ? places.map((x) => (x.id === editingId ? p : x)) : [...places, p]);
    if (!res.ok) { $('adminMsg').textContent = t('wrongPw'); return; }
    $('placeForm').reset();
    $('adminMsg').textContent = res.local ? t('localOnly') : t(wasEdit ? 'saved' : 'added');
    renderAdminList(); render();
    if (map) map.flyTo({ center: [p.lng, p.lat], zoom: 16, padding: mapPadding() });
  });

  /* ---------- init ---------- */
  function hydrateIcons() {
    document.querySelectorAll('[data-icon]').forEach((el) => {
      el.innerHTML = ic(el.dataset.icon, Number(el.dataset.size) || 18, el.dataset.fill === '1');
    });
  }

  (async () => {
    hydrateIcons();
    await loadPlaces();
    await mergeAdditions();
    initMap();
    applyI18n();
    if (map) map.once('load', fitView); else fitView();
  })();
})();

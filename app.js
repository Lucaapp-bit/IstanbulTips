(() => {
  'use strict';

  /* ---------- i18n ---------- */
  const I18N = {
    it: {
      admin: 'Admin', whereAreYou: 'Dove sei?', searchPlaceholder: 'Es. Piazza Taksim, Galata, Kadıköy…',
      search: 'Cerca', useMyLocation: '📍 Usa la mia posizione', radius: 'Raggio',
      all: 'Tutti', eat: 'Mangiare', see: 'Da vedere', hamam: 'Hamam', area: 'Quartieri', stay: 'Dove alloggiare', cafe: 'Caffè', bar: 'Bar', other: 'Altro',
      openMaps: 'Apri in Google Maps', away: 'a', noResultsNear: 'Nessun consiglio entro il raggio scelto. Ecco i più vicini:',
      nearYou: 'Consigli vicino a te', allRecs: 'Tutti i consigli', notFound: 'Posizione non trovata. Prova con un altro nome.',
      searching: 'Cerco…', geoDenied: 'Impossibile ottenere la posizione.', youAreHere: 'Sei qui',
      adminLogin: 'Accesso admin', password: 'Password', cancel: 'Annulla', login: 'Entra', wrongPw: 'Password errata.',
      adminPanel: 'Pannello admin', logout: 'Esci', close: 'Chiudi', gmapsLink: 'Link Google Maps (opzionale)',
      gmapsHint: 'Incolla il link: nome e coordinate vengono compilati da soli. Oppure clicca sulla mappa per scegliere il punto.',
      name: 'Nome', category: 'Categoria', descIt: 'Descrizione (italiano)', descEn: 'Descrizione (inglese, tradotta in automatico)',
      addPlace: 'Aggiungi posto', allPlaces: 'Tutti i posti', del: 'Elimina', confirmDel: 'Eliminare questo posto?',
      added: 'Posto aggiunto!', deleted: 'Posto eliminato.', parsed: 'Dati letti dal link.',
      shortLink: 'Link abbreviato: apri il link nel browser e copia l’URL completo, oppure clicca sulla mappa.',
      pickedOnMap: 'Coordinate prese dalla mappa.', localOnly: 'Salvataggio sul server non disponibile: salvato solo in questo browser.',
      saveFail: 'Errore di salvataggio.',
      mapError: 'Impossibile caricare la mappa.',
      noPlaces: 'Ancora nessun posto in questa categoria.',
      edit: 'Modifica', saveChanges: 'Salva modifiche', cancelEdit: 'Annulla modifica', editing: 'Stai modificando', saved: 'Modifiche salvate.',
      translating: 'Traduco in inglese…', translateFail: 'Traduzione automatica non riuscita: ho copiato il testo italiano.'
    },
    en: {
      admin: 'Admin', whereAreYou: 'Where are you?', searchPlaceholder: 'E.g. Taksim Square, Galata, Kadıköy…',
      search: 'Search', useMyLocation: '📍 Use my location', radius: 'Radius',
      all: 'All', eat: 'Eat', see: 'See', hamam: 'Hammam', area: 'Neighbourhoods', stay: 'Where to stay', cafe: 'Cafés', bar: 'Bars', other: 'Other',
      openMaps: 'Open in Google Maps', away: '', noResultsNear: 'No tips within the chosen radius. Here are the closest ones:',
      nearYou: 'Tips near you', allRecs: 'All recommendations', notFound: 'Location not found. Try another name.',
      searching: 'Searching…', geoDenied: 'Could not get your location.', youAreHere: 'You are here',
      adminLogin: 'Admin login', password: 'Password', cancel: 'Cancel', login: 'Log in', wrongPw: 'Wrong password.',
      adminPanel: 'Admin panel', logout: 'Log out', close: 'Close', gmapsLink: 'Google Maps link (optional)',
      gmapsHint: 'Paste the link: name and coordinates are filled in automatically. Or click the map to pick the spot.',
      name: 'Name', category: 'Category', descIt: 'Description (Italian)', descEn: 'Description (English, auto-translated)',
      addPlace: 'Add place', allPlaces: 'All places', del: 'Delete', confirmDel: 'Delete this place?',
      added: 'Place added!', deleted: 'Place deleted.', parsed: 'Data read from the link.',
      shortLink: 'Shortened link: open it in the browser and copy the full URL, or click the map.',
      pickedOnMap: 'Coordinates taken from the map.', localOnly: 'Server saving unavailable: saved in this browser only.',
      saveFail: 'Save error.',
      mapError: 'Could not load the map.',
      noPlaces: 'No places in this category yet.',
      edit: 'Edit', saveChanges: 'Save changes', cancelEdit: 'Cancel edit', editing: 'Editing', saved: 'Changes saved.',
      translating: 'Translating to English…', translateFail: 'Automatic translation failed: the Italian text was copied.'
    }
  };
  const CATS = { eat: '🍽️', cafe: '☕', bar: '🍸', see: '🏛️', hamam: '🧖', area: '🏘️', stay: '🛏️', other: '⭐' };
  const CENTER = [41.0369, 28.985];

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
    del(k) { try { localStorage.removeItem(k); } catch { /* ignore */ } }
  };

  let lang = store.get('lang') || ((navigator.language || 'en').toLowerCase().startsWith('it') ? 'it' : 'en');
  const t = (k) => (I18N[lang] && I18N[lang][k]) || k;

  /* ---------- state ---------- */
  let places = [];
  let userPos = null;
  let userMarker = null;
  let filter = 'all';
  let adminPw = null;
  const markers = new Map();

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

  function pinEl(emoji, me) {
    const wrap = document.createElement('div'); // MapLibre positions this element itself
    const d = document.createElement('div');
    d.className = 'pin' + (me ? ' me' : '');
    const s = document.createElement('span');
    s.textContent = emoji;
    d.appendChild(s);
    wrap.appendChild(d);
    return wrap;
  }

  function popupHtml(p) {
    return `<div class="info"><strong>${esc(p.name)}</strong><br>${esc(descOf(p))}<br><a href="${esc(mapsUrl(p))}" target="_blank" rel="noopener">${esc(t('openMaps'))}</a></div>`;
  }

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

  /* ---------- rendering ---------- */
  function applyI18n() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
    document.querySelectorAll('.lang button').forEach((b) => b.classList.toggle('active', b.dataset.lang === lang));
    const sel = $('fCat');
    const cur = sel.value;
    sel.innerHTML = Object.keys(CATS).map((k) => `<option value="${k}">${CATS[k]} ${esc(t(k))}</option>`).join('');
    if (cur) sel.value = cur;
    renderFilters();
    render();
    renderAdminList();
  }

  function renderFilters() {
    const keys = ['all', ...Object.keys(CATS)];
    $('filters').innerHTML = keys.map((k) =>
      `<button type="button" class="chip${filter === k ? ' active' : ''}" data-cat="${k}">${k === 'all' ? '' : CATS[k] + ' '}${esc(t(k))}</button>`
    ).join('');
  }

  function visiblePlaces() {
    let list = places.filter((p) => filter === 'all' || p.category === filter);
    if (!userPos) return { list, note: t('allRecs') };
    const radius = parseFloat($('radius').value);
    list = list.map((p) => ({ ...p, _d: distKm(userPos, [p.lat, p.lng]) })).sort((a, b) => a._d - b._d);
    const near = list.filter((p) => p._d <= radius);
    if (near.length) return { list: near, note: t('nearYou') };
    return { list: list.slice(0, 3), note: t('noResultsNear') };
  }

  function render() {
    const { list, note } = visiblePlaces();
    markers.forEach((m) => m.remove());
    markers.clear();
    if (map) {
      list.forEach((p) => {
        const m = new maplibregl.Marker({ element: pinEl(CATS[p.category] || CATS.other), anchor: 'bottom' })
          .setLngLat([p.lng, p.lat])
          .setPopup(new maplibregl.Popup({ offset: 32, closeButton: false }).setHTML(popupHtml(p)))
          .addTo(map);
        markers.set(p.id, m);
      });
    }
    $('results').innerHTML = (list.length ? `<p class="empty"><strong>${esc(note)}</strong></p>` : '') + list.map((p) => `
      <div class="card" data-id="${esc(p.id)}">
        <h3>${CATS[p.category] || CATS.other} ${esc(p.name)}</h3>
        <p>${esc(descOf(p))}</p>
        <div class="meta">
          <span>${p._d != null ? esc(fmtDist(p._d)) : ''}</span>
          <a href="${esc(mapsUrl(p))}" target="_blank" rel="noopener">${esc(t('openMaps'))}</a>
        </div>
      </div>`).join('') || `<p class="empty">${esc(t('noPlaces'))}</p>`;
  }

  function fitView() {
    if (!map) return;
    const { list } = visiblePlaces();
    const pts = list.map((p) => [p.lng, p.lat]);
    if (userPos) pts.push([userPos[1], userPos[0]]);
    if (pts.length > 1) {
      const b = new maplibregl.LngLatBounds(pts[0], pts[0]);
      pts.forEach((q) => b.extend(q));
      map.fitBounds(b, { padding: 70, maxZoom: 16, duration: 600 });
    } else if (pts.length === 1) map.flyTo({ center: pts[0], zoom: 15 });
  }

  function clearUser() { if (userMarker) { userMarker.remove(); userMarker = null; } }

  function setUser(pos) {
    userPos = pos;
    clearUser();
    if (map) userMarker = new maplibregl.Marker({ element: pinEl('📍', true), anchor: 'bottom' }).setLngLat([pos[1], pos[0]]).addTo(map);
    render();
    fitView();
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
    if (!q) { userPos = null; clearUser(); render(); $('searchMsg').textContent = ''; return; }
    $('searchMsg').textContent = t('searching');
    try {
      const res = await geocode(q);
      if (!res) { $('searchMsg').textContent = t('notFound'); return; }
      $('searchMsg').textContent = '';
      setUser(res.pos);
    } catch { $('searchMsg').textContent = t('notFound'); }
  });

  $('geoBtn').addEventListener('click', () => {
    if (!navigator.geolocation) { $('searchMsg').textContent = t('geoDenied'); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => { $('searchMsg').textContent = ''; setUser([p.coords.latitude, p.coords.longitude]); },
      () => { $('searchMsg').textContent = t('geoDenied'); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });

  $('radius').addEventListener('input', () => {
    $('radiusVal').textContent = $('radius').value;
    render();
    if (userPos) fitView();
  });

  $('filters').addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    filter = b.dataset.cat;
    renderFilters(); render();
  });

  $('results').addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    const c = e.target.closest('.card');
    if (!c) return;
    const m = markers.get(c.dataset.id);
    if (m && map) {
      map.flyTo({ center: m.getLngLat(), zoom: Math.max(map.getZoom(), 16) });
      if (!m.getPopup().isOpen()) m.togglePopup();
    }
  });

  document.querySelectorAll('.lang button').forEach((b) => b.addEventListener('click', () => {
    lang = b.dataset.lang; store.set('lang', lang); applyI18n();
  }));

  /* ---------- data ---------- */
  const fixLegacy = (list) => list.map((p) => {
    if (p.category === 'drink') return { ...p, category: 'cafe' };
    if (p.category === 'stay' && /^seed-stay-(cihangir|beyoglu|besiktas)$/.test(p.id)) return { ...p, category: 'area' };
    return p;
  });

  async function loadPlaces() {
    try {
      const r = await fetch('/api/places', { cache: 'no-store' });
      if (r.ok) {
        const j = await r.json();
        if (Array.isArray(j.places)) { places = fixLegacy(j.places); return; }
      }
    } catch { /* fall through */ }
    const local = store.get('places-local');
    if (local) { try { places = fixLegacy(JSON.parse(local)); return; } catch { /* ignore */ } }
    const r = await fetch('data/places.json');
    places = await r.json();
  }

  async function savePlaces(next) {
    try {
      const r = await fetch('/api/places', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPw, places: next })
      });
      if (r.status === 401) throw Object.assign(new Error('auth'), { auth: true });
      if (!r.ok) throw new Error('server');
      places = next; store.del('places-local');
      return { ok: true };
    } catch (err) {
      if (err.auth) return { ok: false, auth: true };
      places = next; store.set('places-local', JSON.stringify(next));
      return { ok: true, local: true };
    }
  }

  /* ---------- admin ---------- */
  const loginDlg = $('loginDlg'), adminDlg = $('adminDlg');

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
      <li><div>${CATS[p.category] || CATS.other} <strong>${esc(p.name)}</strong><small>${esc(descOf(p))}</small></div>
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
    $('fCat').value = CATS[p.category] ? p.category : 'other';
    $('fDescIt').value = (p.desc && p.desc.it) || '';
    $('fDescEn').value = (p.desc && p.desc.en) || '';
    $('fLat').value = p.lat;
    $('fLng').value = p.lng;
    enManual = $('fDescEn').value.trim() !== ''; // keep the existing English unless cleared
    setEditing(id);
    $('adminMsg').textContent = `${t('editing')}: ${p.name}`;
    adminDlg.scrollTop = 0;
    if (map) map.flyTo({ center: [p.lng, p.lat], zoom: Math.max(map.getZoom(), 15) });
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
    if (map) map.flyTo({ center: [p.lng, p.lat], zoom: 16 });
  });

  /* ---------- init ---------- */
  (async () => {
    await loadPlaces();
    initMap();
    applyI18n();
    fitView();
  })();
})();

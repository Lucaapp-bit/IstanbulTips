(() => {
  'use strict';

  /* ---------- i18n ---------- */
  const I18N = {
    it: {
      admin: 'Admin', whereAreYou: 'Dove sei?', searchPlaceholder: 'Es. Piazza Taksim, Galata, Kadıköy…',
      search: 'Cerca', useMyLocation: '📍 Usa la mia posizione', radius: 'Raggio',
      all: 'Tutti', eat: 'Mangiare', see: 'Da vedere', drink: 'Bere & caffè', other: 'Altro',
      openMaps: 'Apri in Google Maps', away: 'a', noResultsNear: 'Nessun consiglio entro il raggio scelto. Ecco i più vicini:',
      nearYou: 'Consigli vicino a te', allRecs: 'Tutti i consigli', notFound: 'Posizione non trovata. Prova con un altro nome.',
      searching: 'Cerco…', geoDenied: 'Impossibile ottenere la posizione.', youAreHere: 'Sei qui',
      adminLogin: 'Accesso admin', password: 'Password', cancel: 'Annulla', login: 'Entra', wrongPw: 'Password errata.',
      adminPanel: 'Pannello admin', logout: 'Esci', close: 'Chiudi', gmapsLink: 'Link Google Maps (opzionale)',
      gmapsHint: 'Incolla il link: nome e coordinate vengono compilati da soli. Oppure clicca sulla mappa per scegliere il punto.',
      name: 'Nome', category: 'Categoria', descIt: 'Descrizione (italiano)', descEn: 'Descrizione (inglese)',
      addPlace: 'Aggiungi posto', allPlaces: 'Tutti i posti', del: 'Elimina', confirmDel: 'Eliminare questo posto?',
      added: 'Posto aggiunto!', deleted: 'Posto eliminato.', parsed: 'Dati letti dal link.',
      shortLink: 'Link abbreviato: apri il link nel browser e copia l’URL completo, oppure clicca sulla mappa.',
      pickedOnMap: 'Coordinate prese dalla mappa.', localOnly: 'Salvataggio sul server non disponibile: salvato solo in questo browser.',
      saveFail: 'Errore di salvataggio.'
    },
    en: {
      admin: 'Admin', whereAreYou: 'Where are you?', searchPlaceholder: 'E.g. Taksim Square, Galata, Kadıköy…',
      search: 'Search', useMyLocation: '📍 Use my location', radius: 'Radius',
      all: 'All', eat: 'Eat', see: 'See', drink: 'Drinks & coffee', other: 'Other',
      openMaps: 'Open in Google Maps', away: '', noResultsNear: 'No tips within the chosen radius. Here are the closest ones:',
      nearYou: 'Tips near you', allRecs: 'All recommendations', notFound: 'Location not found. Try another name.',
      searching: 'Searching…', geoDenied: 'Could not get your location.', youAreHere: 'You are here',
      adminLogin: 'Admin login', password: 'Password', cancel: 'Cancel', login: 'Log in', wrongPw: 'Wrong password.',
      adminPanel: 'Admin panel', logout: 'Log out', close: 'Close', gmapsLink: 'Google Maps link (optional)',
      gmapsHint: 'Paste the link: name and coordinates are filled in automatically. Or click the map to pick the spot.',
      name: 'Name', category: 'Category', descIt: 'Description (Italian)', descEn: 'Description (English)',
      addPlace: 'Add place', allPlaces: 'All places', del: 'Delete', confirmDel: 'Delete this place?',
      added: 'Place added!', deleted: 'Place deleted.', parsed: 'Data read from the link.',
      shortLink: 'Shortened link: open it in the browser and copy the full URL, or click the map.',
      pickedOnMap: 'Coordinates taken from the map.', localOnly: 'Server saving unavailable: saved in this browser only.',
      saveFail: 'Save error.'
    }
  };
  const CATS = { eat: '🍽️', see: '🏛️', drink: '☕', other: '⭐' };
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

  /* ---------- map ---------- */
  const map = L.map('map').setView(CENTER, 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  const markerLayer = L.layerGroup().addTo(map);

  function pinIcon(emoji, me) {
    return L.divIcon({
      className: '', iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -30],
      html: `<div class="pin${me ? ' me' : ''}"><span>${emoji}</span></div>`
    });
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
    markerLayer.clearLayers();
    markers.clear();
    list.forEach((p) => {
      const m = L.marker([p.lat, p.lng], { icon: pinIcon(CATS[p.category] || CATS.other) }).addTo(markerLayer);
      m.bindPopup(`<strong>${esc(p.name)}</strong><br>${esc(descOf(p))}<br><a href="${esc(mapsUrl(p))}" target="_blank" rel="noopener">${esc(t('openMaps'))}</a>`);
      markers.set(p.id, m);
    });
    $('results').innerHTML = `<p class="empty"><strong>${esc(note)}</strong></p>` + list.map((p) => `
      <div class="card" data-id="${esc(p.id)}">
        <h3>${CATS[p.category] || CATS.other} ${esc(p.name)}</h3>
        <p>${esc(descOf(p))}</p>
        <div class="meta">
          <span>${p._d != null ? esc(fmtDist(p._d)) : ''}</span>
          <a href="${esc(mapsUrl(p))}" target="_blank" rel="noopener">${esc(t('openMaps'))}</a>
        </div>
      </div>`).join('');
  }

  function fitView() {
    const { list } = visiblePlaces();
    const pts = list.map((p) => [p.lat, p.lng]);
    if (userPos) pts.push(userPos);
    if (pts.length > 1) map.fitBounds(L.latLngBounds(pts).pad(0.25), { maxZoom: 16 });
    else if (pts.length === 1) map.setView(pts[0], 15);
  }

  function setUser(pos, label) {
    userPos = pos;
    if (userMarker) userMarker.remove();
    userMarker = L.marker(pos, { icon: pinIcon('📍', true) }).addTo(map).bindPopup(esc(label || t('youAreHere')));
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
    return data[0] ? { pos: [parseFloat(data[0].lat), parseFloat(data[0].lon)], label: data[0].display_name } : null;
  }

  $('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const q = $('searchInput').value.trim();
    if (!q) { userPos = null; if (userMarker) userMarker.remove(); render(); $('searchMsg').textContent = ''; return; }
    $('searchMsg').textContent = t('searching');
    try {
      const res = await geocode(q);
      if (!res) { $('searchMsg').textContent = t('notFound'); return; }
      $('searchMsg').textContent = '';
      setUser(res.pos, q);
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
    if (m) { map.setView(m.getLatLng(), Math.max(map.getZoom(), 16)); m.openPopup(); }
  });

  document.querySelectorAll('.lang button').forEach((b) => b.addEventListener('click', () => {
    lang = b.dataset.lang; store.set('lang', lang); applyI18n();
  }));

  /* ---------- data ---------- */
  async function loadPlaces() {
    try {
      const r = await fetch('/api/places', { cache: 'no-store' });
      if (r.ok) {
        const j = await r.json();
        if (Array.isArray(j.places)) { places = j.places; return; }
      }
    } catch { /* fall through */ }
    const local = store.get('places-local');
    if (local) { try { places = JSON.parse(local); return; } catch { /* ignore */ } }
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
      <button type="button" data-del="${esc(p.id)}">${esc(t('del'))}</button></li>`).join('');
  }

  $('adminList').addEventListener('click', async (e) => {
    const b = e.target.closest('[data-del]');
    if (!b || !confirm(t('confirmDel'))) return;
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

  map.on('click', (e) => {
    if (!adminDlg.open) return;
    $('fLat').value = e.latlng.lat.toFixed(6);
    $('fLng').value = e.latlng.lng.toFixed(6);
    $('adminMsg').textContent = t('pickedOnMap');
  });

  $('placeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const p = {
      id: 'p-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: $('fName').value.trim(),
      category: $('fCat').value,
      lat: parseFloat($('fLat').value),
      lng: parseFloat($('fLng').value),
      desc: { it: $('fDescIt').value.trim(), en: $('fDescEn').value.trim() },
      url: $('fUrl').value.trim() || ''
    };
    if (!p.name || Number.isNaN(p.lat) || Number.isNaN(p.lng)) return;
    const res = await savePlaces([...places, p]);
    if (!res.ok) { $('adminMsg').textContent = t('wrongPw'); return; }
    $('adminMsg').textContent = res.local ? t('localOnly') : t('added');
    $('placeForm').reset();
    renderAdminList(); render();
    map.setView([p.lat, p.lng], 16);
  });

  /* ---------- init ---------- */
  (async () => {
    await loadPlaces();
    applyI18n();
    fitView();
  })();
})();

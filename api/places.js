// Vercel serverless function: GET = read places, POST = login check / save places (admin only).
// Persistence uses Vercel Blob (public blob "istanbultips/places.json"). Needs BLOB_READ_WRITE_TOKEN.
// The admin password is read from the ADMIN_PASSWORD env var (falls back to the default below).

const BLOB_PATH = 'istanbultips/places.json';
const CATEGORIES = new Set(['eat', 'see', 'stay', 'cafe', 'bar', 'hamam', 'area', 'other']);

function cleanText(v, max) {
  return typeof v === 'string' ? v.slice(0, max) : '';
}

function sanitize(places) {
  if (!Array.isArray(places) || places.length > 1000) return null;
  const out = [];
  for (const p of places) {
    if (!p || typeof p !== 'object') return null;
    const lat = Number(p.lat), lng = Number(p.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
    const name = cleanText(p.name, 120).trim();
    if (!name) return null;
    const url = cleanText(p.url, 1000);
    out.push({
      id: cleanText(p.id, 64) || 'p-' + Math.random().toString(36).slice(2, 10),
      name,
      category: CATEGORIES.has(p.category) ? p.category : (p.category === 'drink' ? 'cafe' : 'other'),
      lat, lng,
      desc: { it: cleanText(p.desc && p.desc.it, 400), en: cleanText(p.desc && p.desc.en, 400) },
      url: /^https?:\/\//i.test(url) ? url : ''
    });
  }
  return out;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    try {
      const { list } = await import('@vercel/blob');
      const { blobs } = await list({ prefix: BLOB_PATH });
      const blob = blobs.find((b) => b.pathname === BLOB_PATH);
      if (!blob) return res.status(200).json({ places: null });
      const r = await fetch(blob.url + '?t=' + Date.now(), { cache: 'no-store' });
      return res.status(200).json({ places: await r.json() });
    } catch (e) {
      return res.status(200).json({ places: null });
    }
  }

  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const expected = process.env.ADMIN_PASSWORD || 'Luca94';
    if (body.password !== expected) return res.status(401).json({ error: 'unauthorized' });
    if (body.places === undefined) return res.status(200).json({ ok: true }); // login check

    const places = sanitize(body.places);
    if (!places) return res.status(400).json({ error: 'invalid places' });
    try {
      const { put } = await import('@vercel/blob');
      await put(BLOB_PATH, JSON.stringify(places), {
        access: 'public', contentType: 'application/json',
        addRandomSuffix: false, allowOverwrite: true
      });
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: 'storage unavailable' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'method not allowed' });
};

module.exports.sanitize = sanitize;

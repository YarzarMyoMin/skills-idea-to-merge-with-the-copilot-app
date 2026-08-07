// Pure helpers for bookmarks feature — safe to import in tests (no DOM).
const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function normalizeUrl(input) {
  if (!input || typeof input !== 'string') return '';
  let s = input.trim();
  if (!/^[a-z]+:\/\//i.test(s)) {
    s = 'https://' + s;
  }
  try {
    const u = new URL(s);
    // Rebuild href to avoid username/password and to normalise trailing slash.
    let path = u.pathname || '/';
    // remove trailing slash except when path is just '/'
    if (path !== '/' && path.endsWith('/')) path = path.slice(0, -1);
    const href = `${u.protocol}//${u.host}${path}${u.search}${u.hash}`;
    return href;
  } catch (e) {
    // If URL construction fails, fall back to the trimmed input (best-effort)
    return input.trim();
  }
}

export function generateSlug(length = 5) {
  let out = '';
  for (let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * BASE62.length);
    out += BASE62[idx];
  }
  return out;
}

export function isValidBookmarkShape(obj) {
  return obj && typeof obj === 'object' && typeof obj.url === 'string' && typeof obj.slug === 'string';
}

export function parseStoredBookmarks(raw) {
  // raw is the localStorage value (string|null)
  if (raw == null) return [];
  if (typeof raw !== 'string') return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const out = [];
    for (const item of parsed) {
      if (isValidBookmarkShape(item)) {
        // Normalise url server-side for consistency
        out.push({ url: normalizeUrl(item.url), slug: String(item.slug) });
      }
    }
    return out;
  } catch (e) {
    return [];
  }
}

export function formatBookmark(bm) {
  if (!isValidBookmarkShape(bm)) return '';
  return `${bm.url} :: ${bm.slug}`;
}

import { describe, it, expect } from 'vitest';
import { normalizeUrl, parseStoredBookmarks, formatBookmark } from '../src/lib/bookmarks.js';

describe('bookmarks helpers', () => {
  it('normalises URLs with and without https to the same value', () => {
    const a = normalizeUrl('https://example.com');
    const b = normalizeUrl('example.com');
    expect(a).toBe(b);
  });

  it('parses empty, corrupted, legacy, and non-array stored values without throwing', () => {
    expect(parseStoredBookmarks(null)).toEqual([]);
    expect(parseStoredBookmarks(undefined)).toEqual([]);
    expect(parseStoredBookmarks('not a json')).toEqual([]);
    expect(parseStoredBookmarks('{}')).toEqual([]); // legacy object
    expect(parseStoredBookmarks('123')).toEqual([]);
  });

  it('formats a saved bookmark with exact " :: " separator', () => {
    const out = formatBookmark({ url: 'https://www.example.com', slug: 'mona-7fk2' });
    expect(out).toBe('https://www.example.com :: mona-7fk2');
  });
});

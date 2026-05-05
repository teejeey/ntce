const CACHE = new Map();

export function getClientCache(key) {
  return CACHE.get(String(key));
}

export function setClientCache(key, value) {
  CACHE.set(String(key), value);
}

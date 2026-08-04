const DB_NAME = 'renovation-dashboard-cache';
const DB_VERSION = 1;
const STORE_NAME = 'keyval';

function openDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB unavailable'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore(mode, callback) {
  try {
    const db = await openDb();
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    const result = await callback(store);
    return await requestToPromise(result);
  } catch (error) {
    console.warn('[IndexedDB] Fallback to localStorage or ignore', error);
    return null;
  }
}

export async function getDbValue(key) {
  if (typeof indexedDB === 'undefined') {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }

  try {
    const db = await openDb();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    return await requestToPromise(store.get(key));
  } catch (error) {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }
}

export async function setDbValue(key, value) {
  if (typeof indexedDB === 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
    return value;
  }

  try {
    const db = await openDb();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    await requestToPromise(store.put(value, key));
    return value;
  } catch (error) {
    localStorage.setItem(key, JSON.stringify(value));
    return value;
  }
}

export async function removeDbValue(key) {
  if (typeof indexedDB === 'undefined') {
    localStorage.removeItem(key);
    return;
  }

  try {
    const db = await openDb();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    await requestToPromise(store.delete(key));
  } catch {
    localStorage.removeItem(key);
  }
}

// sw.js - ScanStock v4 FIX - Jangan cache data.xlsx
const CACHE = 'scanstock-v4-fix-2';
self.addEventListener('install', e => {
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => {
      if(k !== CACHE) return caches.delete(k);
    }))).then(()=> self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  let url = e.request.url;
  // JANGAN CACHE data.xlsx & index.html, selalu ambil baru dari GitHub
  if(url.includes('data.xlsx') || url.includes('index.html') || url.includes('backup.json')){
    return e.respondWith(fetch(e.request, {cache: 'no-store'}));
  }
  // Yang lain boleh di-cache
  e.respondWith(
    caches.open(CACHE).then(cache => {
      return fetch(e.request).then(res => {
        cache.put(e.request, res.clone());
        return res;
      }).catch(()=> cache.match(e.request));
    })
  );
});

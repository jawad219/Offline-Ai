const C='offline-ai-v5';
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('offline-ai-')&&k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET')return;
  if(u.hostname.includes('huggingface')||u.hostname.includes('hf.co'))return;
  if(u.origin===location.origin||u.hostname==='cdn.jsdelivr.net'){
    // network-first: naya version turant aaye, offline ho to cache se
    e.respondWith(fetch(e.request).then(res=>{
      if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp));}
      return res;
    }).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));
  }
});

const C='offline-ai-v2';
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','manifest.json','icon.svg'])).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET')return;
  // Model files (huggingface) wllama khud cache karta hai
  if(u.hostname.includes('huggingface')||u.hostname.includes('hf.co'))return;
  if(u.origin===location.origin||u.hostname==='cdn.jsdelivr.net'){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
      if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp));}
      return res;
    }).catch(()=>caches.match('index.html'))));
  }
});

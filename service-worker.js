const CACHE_NAME = 'diario-de-bordo-cache-v6';
const URLS_CACHE = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './icons/icon-192x192.png',
    './icons/icon-512x512.png'
];

// 1. Install - Primeira vez que o SW é instalado(Ideal para cache de arquivos estáticos)
self.addEventListener('install', event => {
    console.log('Service Worker: Instalado com sucesso!');

    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(URLS_CACHE);
        })
    )
});
// 2. Activate - Ativado apos a instalação, ideal para limpar cache antigo
self.addEventListener('activate', event => {
    console.log('Service Worker: Ativado com sucesso!');
    event.waitUntil(
        caches.keys().then((keys) => {
           return Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        );
        }).then(() => {
            return self.clients.claim();
        })
    )
});
// 3. Fetch - Intercepta requisições de rede, ideal para cache dinâmico
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((res) => res || fetch(event.request))
    );
})


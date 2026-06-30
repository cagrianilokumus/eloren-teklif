(function(){
"use strict";
if(document.getElementById('erwReelsRoot')) return;

/* =========================================================================
   ELOREN REELS WIDGET
   - widet.js'in floating kabuğu (FAB + panel) korunur.
   - Panelin içi main.html'deki dikey, kaydırmalı reels oynatıcısıdır.
   - Veriyi /eloren-teklif/api/reels ucundan çeker (backend re-host eder).
   - Sunucu yanıt vermezse DEMO_REELS ile çalışır (lokal test için).
   ========================================================================= */

var API_URL = 'https://server.mustakil.co/eloren-teklif/api/reels';

/* Backend ayağa kalkana kadar widget'ın boş kalmaması için yedek veri.
   Backend hazır olunca bu diziyi silebilirsin; fetch başarılıysa zaten kullanılmaz. */
var DEMO_REELS = [
    {
        id: 1,
        videoUrl: "https://videos.pexels.com/video-files/5752729/5752729-hd_1080_1920_30fps.mp4",
        poster: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400",
        username: "elorengiyim",
        caption: "Yeni sezon trençkotlarımız harika! 🍂 #moda",
        music: "Yeni Sezon - Koleksiyon",
        likes: "1.5K",
        product: { title: "Bej Kuşaklı Trençkot", price: "1.299,90 TL", oldPrice: "1.799,90 TL", image: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1", link: "https://elorengiyim.com/bej-trenckot", discount: "%28" }
    },
    {
        id: 2,
        videoUrl: "https://videos.pexels.com/video-files/3205915/3205915-hd_1080_1920_25fps.mp4",
        poster: "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=400",
        username: "elorengiyim",
        caption: "Bu yazın en hit parçaları. 🌊 #yaz",
        music: "Summer Vibes - Music",
        likes: "850",
        product: { title: "Çiçek Desenli Yazlık Elbise", price: "459,90 TL", oldPrice: "699,90 TL", image: "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1", link: "https://elorengiyim.com/yazlik-elbise", discount: "%34" }
    },
    {
        id: 3,
        videoUrl: "https://videos.pexels.com/video-files/4058045/4058045-hd_1080_1920_25fps.mp4",
        poster: "https://images.pexels.com/photos/416754/pexels-photo-416754.jpeg?auto=compress&cs=tinysrgb&w=400",
        username: "elorengiyim",
        caption: "Antrenman için en rahat setler. 💪",
        music: "Power - GymMusic",
        likes: "2.1K",
        product: { title: "Dikişsiz Spor Tayt Takım", price: "699,90 TL", oldPrice: "899,90 TL", image: "https://images.pexels.com/photos/416754/pexels-photo-416754.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1", link: "https://elorengiyim.com/spor-tayt", discount: "%22" }
    },
    {
        id: 4,
        videoUrl: "https://videos.pexels.com/video-files/6981416/6981416-hd_1080_1920_25fps.mp4",
        poster: "https://images.pexels.com/photos/266621/pexels-photo-266621.jpeg?auto=compress&cs=tinysrgb&w=400",
        username: "elorengiyim",
        caption: "El yapımı özel tasarım kolyeler. ✨",
        music: "Shine - Acoustic",
        likes: "3.2K",
        product: { title: "Doğal Taşlı Gümüş Kolye", price: "249,00 TL", oldPrice: "329,00 TL", image: "https://images.pexels.com/photos/266621/pexels-photo-266621.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1", link: "https://elorengiyim.com/gumus-kolye", discount: "%24" }
    }
];

/* ===== CSS ENJEKTE ===== */
var css = `
#erwReelsRoot, #erwReelsRoot * { box-sizing: border-box; }

/* --- Açılış butonu (FAB) --- */
.erw-fab {
    position: fixed; bottom: 24px; left: 24px; z-index: 99997;
    width: 90px; height: 144px; border-radius: 20px; overflow: hidden; padding: 0;
    border: 3px solid transparent;
    background: linear-gradient(#111,#111) padding-box,
                linear-gradient(135deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5) border-box;
    box-shadow: 0 12px 30px rgba(0,0,0,.32);
    cursor: pointer; display: block;
    transition: transform .28s cubic-bezier(.16,1,.3,1), opacity .3s ease, box-shadow .25s ease;
}
.erw-fab:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 16px 38px rgba(0,0,0,.42); }
.erw-fab:active { transform: scale(.97); }
.erw-fab.hidden { transform: scale(0); opacity: 0; pointer-events: none; }
.erw-fab-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none; background: #111; }
.erw-fab-grad { position: absolute; inset: 0; pointer-events: none;
    background: linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.05) 48%, transparent 70%); }
.erw-fab-title { position: absolute; left: 11px; right: 11px; bottom: 11px; z-index: 2; pointer-events: none;
    color: #fff; font-size: 14px; font-weight: 800; line-height: 1.12; letter-spacing: .9px;
    text-shadow: 0 1px 5px rgba(0,0,0,.65); }

/* --- Panel (reels uygulaması) --- */
.erw-panel {
    position: fixed; bottom: 24px; left: 24px;
    width: 424px; max-width: 94vw; height: 724px; max-height: 88vh;
    border-radius: 22px; overflow: hidden;
    border: 4px solid transparent;
    background: linear-gradient(#000,#000) padding-box,
                linear-gradient(135deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5) border-box;
    box-shadow: 0 12px 48px rgba(0,0,0,0.35);
    z-index: 99999; color: #fff; isolation: isolate;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.5; user-select: none; -webkit-user-select: none;
    opacity: 0; visibility: hidden; transform: translateY(16px) scale(.96);
    transition: opacity .35s cubic-bezier(.16,1,.3,1), transform .35s cubic-bezier(.16,1,.3,1), visibility .35s;
}
.erw-panel.active { opacity: 1; visibility: visible; transform: translateY(0) scale(1); }

.erw-topbar {
    position: absolute; top: 0; left: 0; right: 0; height: 54px; z-index: 60;
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 14px; pointer-events: none;
    background: linear-gradient(180deg, rgba(0,0,0,.55), transparent);
}
.erw-title { font-weight: 700; font-size: 15px; text-shadow: 0 1px 3px rgba(0,0,0,.5); }
.erw-topbtns { display: flex; gap: 8px; pointer-events: auto; }
.erw-iconbtn {
    width: 32px; height: 32px; border-radius: 50%; border: none; cursor: pointer;
    background: rgba(0,0,0,.35); color: #fff; backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center; transition: background .15s;
}
.erw-iconbtn:hover { background: rgba(0,0,0,.6); }

/* --- Kaydırmalı reels --- */
.erw-scroll {
    height: 100%; overflow-y: scroll; scroll-snap-type: y mandatory;
    scroll-behavior: smooth; -webkit-overflow-scrolling: touch; position: relative; outline: none;
}
.erw-scroll::-webkit-scrollbar { display: none; }
.erw-scroll { -ms-overflow-style: none; scrollbar-width: none; }

.erw-reel {
    position: relative; height: 100%; width: 100%;
    scroll-snap-align: start; scroll-snap-stop: always;
    display: flex; align-items: center; justify-content: center;
    background: #111; overflow: hidden;
}
.erw-reel video { width: 100%; height: 100%; object-fit: cover; pointer-events: none; display: block; }

.erw-overlay { position: absolute; inset: 0; z-index: 10; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,.01); cursor: grab; }
.erw-overlay:active { cursor: grabbing; }
.erw-ui { position: absolute; inset: 0; pointer-events: none; z-index: 20;
    background: linear-gradient(180deg, rgba(0,0,0,.25) 0%, transparent 22%, transparent 62%, rgba(0,0,0,.85) 100%); }

.erw-loader { width: 30px; height: 30px; border: 3px solid rgba(255,255,255,.2); border-left-color: #fff;
    border-radius: 50%; animation: erw-spin 1s linear infinite; position: absolute; z-index: 5; }
@keyframes erw-spin { 100% { transform: rotate(360deg); } }
.erw-error { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); display: none; z-index: 6;
    color: #ff6b6b; background: rgba(0,0,0,.8); padding: 10px 14px; border-radius: 8px; font-size: 12px; text-align: center; width: 80%; }

.erw-play { font-size: 0; width: 64px; height: 64px; border-radius: 50%; background: rgba(0,0,0,.45);
    display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity .2s; }
.erw-reel.paused .erw-play { opacity: 1; }

.erw-heart { position: absolute; opacity: 0; z-index: 30; }
.erw-heart.pop { animation: erw-pop .6s ease-out forwards; }
@keyframes erw-pop { 0%{transform:scale(0);opacity:0} 50%{transform:scale(1.25);opacity:1} 100%{transform:scale(1);opacity:0} }

/* --- Sağ aksiyon barı --- */
.erw-side { position: absolute; bottom: 96px; right: 10px; z-index: 30;
    display: flex; flex-direction: column; gap: 16px; align-items: center; pointer-events: auto; }
.erw-side-btn { background: none; border: none; padding: 0; cursor: pointer; color: #fff;
    display: flex; flex-direction: column; align-items: center; gap: 4px; text-shadow: 0 2px 4px rgba(0,0,0,.5); }
.erw-side-btn span { font-size: 11px; font-weight: 600; }
.erw-avatar { width: 40px; height: 40px; border-radius: 50%; border: 2px solid #fff; }

/* --- Ürün kartı (buzlu cam) --- */
.erw-product {
    position: absolute; bottom: 96px; left: 14px; right: 14px; z-index: 30;
    display: flex; align-items: center; gap: 12px; padding: 10px;
    background: rgba(255,255,255,.15); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,.2); border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,.2);
    text-decoration: none; cursor: pointer; pointer-events: auto;
    transition: transform .2s, background .2s; animation: erw-slideup .6s cubic-bezier(.16,1,.3,1) both;
}
.erw-product:active { transform: scale(.98); background: rgba(255,255,255,.25); }
@keyframes erw-slideup { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
.erw-prod-img { width: 46px; height: 46px; border-radius: 8px; object-fit: cover; background: #fff; flex-shrink: 0; }
.erw-prod-info { flex: 1; overflow: hidden; }
.erw-prod-title { font-size: 13px; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden;
    text-overflow: ellipsis; text-shadow: 0 1px 2px rgba(0,0,0,.5); }
.erw-prod-price { font-size: 12px; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,.5); display: flex; align-items: baseline; gap: 6px; }
.erw-prod-old { font-size: 11px; opacity: .7; text-decoration: line-through; }
.erw-prod-btn { background: #ff0050; color: #fff; font-size: 12px; font-weight: 700; padding: 8px 12px;
    border-radius: 8px; white-space: nowrap; box-shadow: 0 2px 5px rgba(255,0,80,.4); flex-shrink: 0; }

/* --- Alt bilgi --- */
.erw-info { position: absolute; bottom: 16px; left: 14px; right: 14px; z-index: 25; pointer-events: auto; }
.erw-info .u { font-weight: 700; margin-bottom: 4px; }
.erw-info .c { font-size: 13px; opacity: .92; margin-bottom: 4px; }
.erw-info .m { font-size: 11px; opacity: .8; display: flex; align-items: center; gap: 6px; }

.erw-progress { position: absolute; bottom: 0; left: 0; height: 3px; background: #ff0050; width: 0; z-index: 40; transition: width .1s linear; }

.erw-state { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 12px; z-index: 70; text-align: center; padding: 24px; }
.erw-state span { font-size: 13px; color: #ccc; }
.erw-retry { font-size: 12px; color: #fff; background: none; border: 1px solid #555; padding: 8px 16px;
    border-radius: 8px; cursor: pointer; font-family: inherit; }

/* --- Yukarı/Aşağı navigasyon düğmeleri --- */
.erw-nav { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); z-index: 55;
    display: flex; flex-direction: column; gap: 10px; }
.erw-nav-btn { width: 40px; height: 40px; border-radius: 50%; border: none; cursor: pointer; padding: 0;
    background: rgba(0,0,0,.45); color: #fff; backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 10px rgba(0,0,0,.3);
    transition: background .15s ease, opacity .15s ease, transform .1s ease; }
.erw-nav-btn:hover { background: rgba(0,0,0,.72); }
.erw-nav-btn:active { transform: scale(.9); }
.erw-nav-btn:disabled { opacity: .25; cursor: default; box-shadow: none; }

@media (max-width: 480px) {
    .erw-panel {
        width: 100vw; max-width: 100vw;
        height: 100vh; height: 100dvh; max-height: 100dvh;   /* dvh: URL çubuğunu hesaba katar */
        top: 0; bottom: auto; left: 0; border-radius: 0; border: 0;
    }
    /* Kapat/ses tuşları çentik/URL çubuğunun altında kalsın */
    .erw-topbar { height: auto; padding-top: calc(12px + env(safe-area-inset-top, 0px)); }
    /* Alt içerik de alt çubuğun/home barın üstünde kalsın */
    .erw-product { bottom: calc(96px + env(safe-area-inset-bottom, 0px)); }
    .erw-info { bottom: calc(16px + env(safe-area-inset-bottom, 0px)); }
    .erw-fab { bottom: calc(16px + env(safe-area-inset-bottom, 0px)); left: 16px; }
    .erw-nav-btn { width: 44px; height: 44px; }
}
`;
var styleEl = document.createElement('style');
styleEl.textContent = css;
document.head.appendChild(styleEl);

/* ===== HTML KABUK ENJEKTE ===== */
var ICON_BAG = '<svg width="18" height="18" viewBox="0 0 48 48" fill="#fff"><rect x="2.2" y="22" transform="matrix(.707 -.707 .707 .707 -9.94 24)" width="43.6" height="4"/><path d="M14 22c4.4 0 8-3.6 8-8s-3.6-8-8-8-8 3.6-8 8 3.6 8 8 8zm0-12c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4z"/><path d="M34 42c4.4 0 8-3.6 8-8s-3.6-8-8-8-8 3.6-8 8 3.6 8 8 8zm0-12c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4z"/></svg>';
var ICON_CLOSE = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
var ICON_MUTE = '<svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M3 9v6h4l5 5V4L7 9H3z"/><line x1="16" y1="9" x2="22" y2="15" stroke="#fff" stroke-width="2" stroke-linecap="round"/><line x1="22" y1="9" x2="16" y2="15" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>';
var ICON_UNMUTE = '<svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M3 9v6h4l5 5V4L7 9H3z"/><path d="M16 8a5 5 0 0 1 0 8" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>';
var ICON_HEART = '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
var ICON_SHARE = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
var ICON_MUSIC = '<svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>';
var ICON_UP = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
var ICON_DOWN = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';
var ICON_PLAY = '<svg width="30" height="30" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>';

var root = document.createElement('div');
root.id = 'erwReelsRoot';
root.innerHTML =
    '<div class="erw-fab" id="erwFab" role="button" tabindex="0" aria-label="Sezonun En Yenileri">'
  +   '<video class="erw-fab-video" id="erwFabVideo" muted loop playsinline preload="auto"></video>'
  +   '<div class="erw-fab-grad"></div>'
  +   '<div class="erw-fab-title">YENİ<br>SEZON</div>'
  + '</div>'
  + '<div class="erw-panel" id="erwPanel">'
  +   '<div class="erw-topbar">'
  +     '<span class="erw-title">Reels</span>'
  +     '<div class="erw-topbtns">'
  +       '<button class="erw-iconbtn" id="erwMute" title="Ses">' + ICON_MUTE + '</button>'
  +       '<button class="erw-iconbtn" id="erwClose" title="Kapat">' + ICON_CLOSE + '</button>'
  +     '</div>'
  +   '</div>'
  +   '<div class="erw-scroll" id="erwScroll" tabindex="0"></div>'
  +   '<div class="erw-nav">'
  +     '<button class="erw-nav-btn" id="erwPrev" title="Önceki (↑)">' + ICON_UP + '</button>'
  +     '<button class="erw-nav-btn" id="erwNext" title="Sonraki (↓)">' + ICON_DOWN + '</button>'
  +   '</div>'
  + '</div>';
document.body.appendChild(root);

/* ===== DEĞİŞKENLER ===== */
var reels = [];
var isMuted = true;
var isDragging = false;
var observer = null;
var panelOpen = false;
var rendered = false;
var currentIndex = 0;

var panel  = document.getElementById('erwPanel');
var fab    = document.getElementById('erwFab');
var scroll = document.getElementById('erwScroll');

/* ===== AÇ / KAPAT ===== */
fab.addEventListener('click', acPanel);
fab.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); acPanel(); } });
function acPanel(){
    panel.classList.add('active');
    fab.classList.add('hidden');
    panelOpen = true;
    panelRender();
    setTimeout(oynatAktif, 50);   // tıklayınca aktif reel videosunu oynat
}
function oynatAktif(){
    var el = scroll.querySelectorAll('.erw-reel')[currentIndex];
    if(!el) return;
    var v = el.querySelector('video');
    if(v){ v.muted = isMuted; var p = v.play(); if(p && p.catch) p.catch(function(){}); el.classList.remove('paused'); }
}
document.getElementById('erwClose').addEventListener('click', kapat);
document.addEventListener('keydown', function(e){ if(e.key === 'Escape') kapat(); });
function kapat(){
    panel.classList.remove('active');
    panelOpen = false;
    scroll.querySelectorAll('video').forEach(function(v){ v.pause(); });
    setTimeout(function(){ fab.classList.remove('hidden'); }, 300);
}

/* ===== SES ===== */
document.getElementById('erwMute').addEventListener('click', function(){
    isMuted = !isMuted;
    scroll.querySelectorAll('video').forEach(function(v){ v.muted = isMuted; });
    this.innerHTML = isMuted ? ICON_MUTE : ICON_UNMUTE;
});

/* ===== VERİ (sayfa açılışında çekilir; FAB önizlemesi için) ===== */
function veriYukle(){
    fetch(API_URL)
        .then(function(r){ if(!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(function(veri){
            reels = veri.reels || veri || [];
            if(!reels.length) throw new Error('boş');
            fabKur();
            if(panelOpen) panelRender();
        })
        .catch(function(err){
            // Backend hazır değilse demo ile devam (lokal test)
            console.warn('Reels API kullanılamadı, demo veri gösteriliyor:', err && err.message);
            reels = DEMO_REELS;
            fabKur();
            if(panelOpen) panelRender();
        });
}

// FAB'taki mini önizleme videosunu ilk reel ile başlat (sessiz, loop)
function fabKur(){
    var v = document.getElementById('erwFabVideo');
    if(!v || !reels[0]) return;
    if(reels[0].poster) v.poster = reels[0].poster;
    v.src = reels[0].videoUrl;
    v.play().catch(function(){});
}

// Panel ilk açıldığında (veya veri gelince) içeriği bir kez kur
function panelRender(){
    if(rendered) return;
    if(!reels.length){ durumGoster('<div class="erw-loader" style="position:static"></div><span>Videolar yükleniyor...</span>'); return; }
    rendered = true;
    render();
}

function durumGoster(html){
    scroll.innerHTML = '<div class="erw-state">' + html + '</div>';
}

/* ===== RENDER ===== */
function esc(s){ return String(s == null ? '' : s).replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

// Açıklamayı en fazla N kelimeyle sınırla
function kelimeSinirla(s, n){
    var w = String(s == null ? '' : s).trim().split(/\s+/).filter(Boolean);
    return w.length > n ? w.slice(0, n).join(' ') + '…' : w.join(' ');
}

function render(){
    scroll.innerHTML = reels.map(function(reel){
        var p = reel.product || {};
        var utmLink = urunLinki(p.link, p.title);
        return ''
        + '<section class="erw-reel" data-id="' + esc(reel.id) + '">'
        +   '<div class="erw-loader"></div>'
        +   '<div class="erw-error">Video yüklenemedi.</div>'
        +   '<video loop playsinline webkit-playsinline muted preload="none"'
        +     ' poster="' + esc(reel.poster) + '" src="' + esc(reel.videoUrl) + '"></video>'
        +   '<div class="erw-overlay">'
        +       '<div class="erw-heart" style="width:92px;height:92px;color:#fff">' + ICON_HEART + '</div></div>'
        +   '<div class="erw-ui">'
        +     (p.title ? (
              '<a class="erw-product" href="' + esc(utmLink) + '" target="_blank" rel="noopener">'
        +       '<img class="erw-prod-img" alt="" src="' + esc(p.image) + '">'
        +       '<div class="erw-prod-info">'
        +         '<div class="erw-prod-title">' + esc(p.title) + '</div>'
        +         '<div class="erw-prod-price">' + esc(p.price) + (p.oldPrice ? '<span class="erw-prod-old">' + esc(p.oldPrice) + '</span>' : '') + '</div>'
        +       '</div>'
        +       '<div class="erw-prod-btn">İncele</div>'
        +     '</a>') : '')
        +     '<div class="erw-info">'
        +       '<div class="u">@' + esc(reel.username || 'elorengiyim') + '</div>'
        +       (reel.caption ? '<div class="c">' + esc(kelimeSinirla(reel.caption, 12)) + '</div>' : '')
        +       (reel.music ? '<div class="m">' + ICON_MUSIC + ' ' + esc(reel.music) + '</div>' : '')
        +     '</div>'
        +     '<div class="erw-progress"></div>'
        +   '</div>'
        + '</section>';
    }).join('');

    bindReelEvents();
    setupObserver();
    currentIndex = 0;
    scroll.scrollTop = 0;
    updateNav();
}

function urunLinki(link, isim){
    if(!link) return '#';
    var sep = link.indexOf('?') > -1 ? '&' : '?';
    return link + sep + 'utm_source=website&utm_medium=reels_widget&utm_campaign=' + encodeURIComponent(isim || '');
}

function bindReelEvents(){
    scroll.querySelectorAll('.erw-reel').forEach(function(reel){
        var video = reel.querySelector('video');
        var err   = reel.querySelector('.erw-error');
        var loaderEl = reel.querySelector('.erw-loader');

        video.addEventListener('loadeddata', function(){ loaderEl.style.display = 'none'; });
        video.addEventListener('error', function(){ err.style.display = 'block'; loaderEl.style.display = 'none'; });

        var overlay = reel.querySelector('.erw-overlay');
        // Tek tık: kalp animasyonu (durdurma YOK — video hep oynar)
        overlay.addEventListener('click', function(){
            if(isDragging) return;
            var heart = reel.querySelector('.erw-heart');
            heart.classList.remove('pop'); void heart.offsetWidth; heart.classList.add('pop');
        });
    });
}

function begen(reel, force){
    var icon = reel.querySelector('.erw-like span svg');
    if(!icon) return;
    var on = icon.style.color === 'rgb(255, 0, 80)';
    icon.style.color = (force || !on) ? '#ff0050' : '#fff';
}

/* ===== OTOMATİK OYNATMA ===== */
function setupObserver(){
    if(observer) observer.disconnect();
    observer = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
            var reel  = entry.target;
            var video = reel.querySelector('video');
            var bar   = reel.querySelector('.erw-progress');
            if(entry.isIntersecting){
                video.muted = isMuted;
                video.play().catch(function(){});
                reel.classList.remove('paused');
                video.ontimeupdate = function(){
                    if(video.duration) bar.style.width = (video.currentTime / video.duration * 100) + '%';
                };
            } else {
                video.pause(); video.currentTime = 0; reel.classList.add('paused');
            }
        });
    }, { threshold: 0.6, root: scroll });
    scroll.querySelectorAll('.erw-reel').forEach(function(r){ observer.observe(r); });
}

/* ===== KONTROLLÜ NAVİGASYON (her hareket = tam 1 reel) ===== */
function reelH(){ return scroll.clientHeight; }

function goTo(i){
    currentIndex = Math.max(0, Math.min(reels.length - 1, i));
    scroll.scrollTo({ top: currentIndex * reelH(), behavior: 'smooth' });
    updateNav();
}

function updateNav(){
    var p = document.getElementById('erwPrev'), n = document.getElementById('erwNext');
    if(p) p.disabled = currentIndex <= 0;
    if(n) n.disabled = currentIndex >= reels.length - 1;
}

function setupNav(){
    document.getElementById('erwPrev').addEventListener('click', function(){ goTo(currentIndex - 1); });
    document.getElementById('erwNext').addEventListener('click', function(){ goTo(currentIndex + 1); });

    // Tekerlek: her hareket tam bir reel (kilitli, kaymaz)
    var wheelLock = false;
    scroll.addEventListener('wheel', function(e){
        e.preventDefault();
        if(wheelLock) return;
        wheelLock = true;
        setTimeout(function(){ wheelLock = false; }, 420);
        goTo(currentIndex + (e.deltaY > 0 ? 1 : -1));
    }, { passive: false });

    // Klavye
    scroll.addEventListener('keydown', function(e){
        if(e.key === 'ArrowDown' || e.key === 'PageDown'){ e.preventDefault(); goTo(currentIndex + 1); }
        else if(e.key === 'ArrowUp' || e.key === 'PageUp'){ e.preventDefault(); goTo(currentIndex - 1); }
    });

    // Fare ile sürükleme: canlı takip + bırakınca eşiği geçtiyse geç, geçmediyse geri otur
    var dragging = false, startY = 0, startTop = 0, moved = 0;
    scroll.addEventListener('mousedown', function(e){
        if(e.target.closest('.erw-product') || e.target.closest('.erw-side') || e.target.closest('.erw-nav') || e.target.closest('.erw-topbar')) return;
        dragging = true; isDragging = false; startY = e.clientY; startTop = scroll.scrollTop; moved = 0;
    });
    window.addEventListener('mousemove', function(e){
        if(!dragging) return;
        moved = e.clientY - startY;
        if(Math.abs(moved) > 4){ isDragging = true; scroll.scrollTop = startTop - moved; }
    });
    window.addEventListener('mouseup', function(){
        if(!dragging) return;
        dragging = false;
        var th = reelH() * 0.15;
        if(moved < -th) goTo(currentIndex + 1);
        else if(moved > th) goTo(currentIndex - 1);
        else goTo(currentIndex);
        setTimeout(function(){ isDragging = false; }, 40);
    });

    // Dokunma (mobil): parmakla kaydır, yönüne göre geç
    var tY = 0;
    scroll.addEventListener('touchstart', function(e){ tY = e.touches[0].clientY; }, { passive: true });
    scroll.addEventListener('touchmove', function(e){ e.preventDefault(); }, { passive: false });
    scroll.addEventListener('touchend', function(e){
        var dy = e.changedTouches[0].clientY - tY;
        if(Math.abs(dy) > 40) goTo(currentIndex + (dy < 0 ? 1 : -1));
    }, { passive: false });
}

setupNav();
veriYukle();   // sayfa açılışında veriyi çek + FAB mini önizlemesini başlat

})();

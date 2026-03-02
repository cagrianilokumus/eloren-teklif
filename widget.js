(function(){
"use strict";
if(document.getElementById('teklifWidgetRoot')) return;

// ===== CSS ENJEKTE =====
var css = `
.teklif-widget, .teklif-fab { font-family: inherit; }
.teklif-widget {
    position: fixed; z-index: 99999; bottom: 24px; left: 24px;
    width: 370px; max-width: 92vw; background: #fff; border-radius: 16px;
    overflow: hidden; border: 1px solid #e5e5e5;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    opacity: 0; visibility: hidden;
    transform: translateY(16px) scale(0.96);
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.teklif-widget.active { opacity: 1; visibility: visible; transform: translateY(0) scale(1); }
.teklif-header {
    padding: 14px 16px 12px; display: flex; align-items: center;
    justify-content: space-between; border-bottom: 1px solid #f0f0f0;
}
.teklif-header-left { display: flex; flex-direction: column; gap: 4px; }
.teklif-tag {
    display: inline-flex; align-items: center; gap: 6px;
    background: #111; color: #fff; padding: 4px 10px;
    border-radius: 100px; font-size: 10px; font-weight: 700;
    letter-spacing: 0.5px; text-transform: uppercase; width: fit-content;
}
.teklif-tag-dot {
    width: 5px; height: 5px; background: #ef4444;
    border-radius: 50%; animation: teklif-blink 1.5s ease-in-out infinite;
}
@keyframes teklif-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
.teklif-header-sub { font-size: 11px; color: #999; font-weight: 400; }
.teklif-close {
    width: 28px; height: 28px; background: none; border: 1px solid #e5e5e5;
    border-radius: 8px; color: #aaa; cursor: pointer; display: flex;
    align-items: center; justify-content: center; transition: all 0.15s ease; flex-shrink: 0;
}
.teklif-close:hover { border-color: #ccc; color: #555; }
.teklif-timer {
    padding: 8px 16px; display: flex; align-items: center;
    justify-content: center; gap: 8px; background: #fafafa;
    border-bottom: 1px solid #f0f0f0;
}
.teklif-timer-text { font-size: 11px; color: #999; font-weight: 500; }
.teklif-timer-digits { display: flex; gap: 3px; align-items: center; }
.teklif-timer-digit {
    background: #111; color: #fff; padding: 2px 6px; border-radius: 4px;
    font-size: 11px; font-weight: 700; font-variant-numeric: tabular-nums;
    min-width: 24px; text-align: center;
}
.teklif-timer-sep { color: #bbb; font-weight: 700; font-size: 11px; }
.teklif-slider-wrapper { position: relative; }
.teklif-slider { position: relative; }
.teklif-slide { display: none; }
.teklif-slide.active { display: block; animation: teklif-slideFadeIn 0.25s ease; }
@keyframes teklif-slideFadeIn { from{opacity:0;transform:translateX(8px)} to{opacity:1;transform:translateX(0)} }
.teklif-slider-nav {
    position: absolute; top: 90px; width: 30px; height: 30px;
    background: rgba(255,255,255,0.92); border: 1px solid #e5e5e5;
    border-radius: 50%; display: flex; align-items: center;
    justify-content: center; cursor: pointer; z-index: 3;
    transition: all 0.15s ease; color: #666; backdrop-filter: blur(4px);
}
.teklif-slider-nav:hover { background: #fff; color: #111; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.teklif-slider-nav.disabled { opacity: 0; pointer-events: none; }
.teklif-slider-prev { left: 8px; }
.teklif-slider-next { right: 8px; }
.teklif-dots { display: flex; justify-content: center; gap: 5px; padding: 10px 0 18px; }
.teklif-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #ddd;
    border: none; padding: 0; cursor: pointer; transition: all 0.25s ease;
}
.teklif-dot.active { background: #111; width: 16px; border-radius: 3px; }
.teklif-slide-inner { padding: 0; }
.teklif-product-image { position: relative; width: 100%; overflow: hidden; background: #f5f5f4; }
.teklif-product-image img { width: 100%; height: auto; display: block; max-height: 320px; object-fit: contain; }
.teklif-discount-badge {
    position: absolute; top: 10px; left: 10px; background: #ef4444;
    color: #fff; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 700;
}
.teklif-slide-counter {
    position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.5);
    color: #fff; padding: 2px 8px; border-radius: 10px; font-size: 10px;
    font-weight: 600; backdrop-filter: blur(4px);
}
.teklif-product-info { padding: 14px 16px 0; }
.teklif-product-brand {
    font-size: 10px; text-transform: uppercase; letter-spacing: 1.2px;
    color: #16a34a; font-weight: 700; display: block; margin-bottom: 4px;
}
.teklif-product-name {
    font-size: 14px; font-weight: 600; color: #111; line-height: 1.35;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
    overflow: hidden; margin-bottom: 10px;
}
.teklif-pricing { display: flex; align-items: baseline; gap: 8px; margin-bottom: 4px; }
.teklif-price-current { font-size: 22px; font-weight: 800; color: #111; letter-spacing: -0.5px; }
.teklif-price-old { font-size: 13px; color: #ccc; text-decoration: line-through; font-weight: 400; }
.teklif-savings {
    display: inline-block; font-size: 10px; color: #16a34a; font-weight: 600;
    background: #f0fdf4; padding: 3px 8px; border-radius: 5px;
    border: 1px solid #dcfce7; margin-bottom: 12px;
}
.teklif-actions { display: flex; gap: 8px; padding: 0 16px 14px; }
.teklif-btn-primary {
    flex: 1; padding: 11px 16px; background: #111; color: #fff; border: none;
    border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer;
    font-family: inherit; transition: opacity 0.15s ease;
}
.teklif-btn-primary:hover { opacity: 0.85; }
.teklif-btn-primary:active { opacity: 0.7; }
.teklif-btn-secondary {
    padding: 11px 16px; background: #fff; color: #111; border: 1px solid #e5e5e5;
    border-radius: 10px; font-size: 13px; font-weight: 500; cursor: pointer;
    font-family: inherit; transition: all 0.15s ease;
}
.teklif-btn-secondary:hover { border-color: #ccc; background: #fafafa; }
.teklif-footer {
    display: flex; justify-content: center; gap: 16px; padding: 10px 16px;
    border-top: 1px solid #f0f0f0; background: #fafafa;
}
.teklif-trust-item { display: flex; align-items: center; gap: 4px; font-size: 10px; color: #bbb; font-weight: 400; }
.teklif-trust-icon { width: 12px; height: 12px; stroke: #bbb; fill: none; stroke-width: 1.5; }
.teklif-fab {
    position: fixed; bottom: 24px; left: 24px; height: 44px;
    padding: 0 14px 0 12px; gap: 8px;
    background: linear-gradient(135deg, #8B5A6B, #6B3A5D);
    border: none; border-radius: 22px; color: #fff; cursor: pointer;
    z-index: 99997; box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    display: flex; align-items: center; justify-content: center;
    transition: all 0.3s ease; font-family: inherit;
}
.teklif-fab:hover { opacity: 0.9; }
.teklif-fab.hidden { transform: scale(0); opacity: 0; pointer-events: none; }
.teklif-fab-text { font-size: 11px; font-weight: 700; letter-spacing: 0.3px; white-space: nowrap; }
@keyframes teklif-fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
.teklif-widget.active .teklif-slider-wrapper { animation: teklif-fadeUp 0.3s ease 0.1s both; }
@keyframes teklif-spin { to{transform:rotate(360deg)} }
@media (max-width: 480px) {
    .teklif-widget {
        width: 92vw; max-width: 92vw; border-radius: 16px;
        bottom: 90px; left: 4vw; transform: translateY(20px) scale(0.96);
        border: 1px solid #e5e5e5; max-height: 75vh; overflow-y: auto;
    }
    .teklif-widget.active { transform: translateY(0) scale(1); }
    .teklif-product-image img { max-height: 200px; }
    .teklif-product-info { padding: 10px 12px 0; }
    .teklif-product-name { font-size: 13px; margin-bottom: 6px; }
    .teklif-price-current { font-size: 18px; }
    .teklif-price-old { font-size: 12px; }
    .teklif-actions { padding: 0 12px 10px; gap: 6px; }
    .teklif-btn-primary, .teklif-btn-secondary { padding: 9px 12px; font-size: 12px; }
    .teklif-dots { padding: 6px 0 10px; }
    .teklif-footer { padding: 8px 12px; gap: 10px; }
    .teklif-fab { bottom: 16px; left: 16px; }
}
`;

var styleEl = document.createElement('style');
styleEl.textContent = css;
document.head.appendChild(styleEl);

// ===== HTML ENJEKTE =====
var root = document.createElement('div');
root.id = 'teklifWidgetRoot';
root.innerHTML = '<button class="teklif-fab" id="teklifFab"><svg width="18" height="18" viewBox="0 0 48 48" fill="#fff" xmlns="http://www.w3.org/2000/svg"><rect x="2.201" y="22" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -9.9411 23.9997)" width="43.598" height="4"/><path d="M14,22c4.418,0,8-3.582,8-8s-3.582-8-8-8s-8,3.582-8,8S9.582,22,14,22z M14,10c2.206,0,4,1.794,4,4c0,2.206-1.794,4-4,4 s-4-1.794-4-4C10,11.794,11.794,10,14,10z"/><path d="M34,42c4.418,0,8-3.582,8-8s-3.582-8-8-8s-8,3.582-8,8S29.582,42,34,42z M34,30c2.206,0,4,1.794,4,4c0,2.206-1.794,4-4,4 s-4-1.794-4-4C30,31.794,31.794,30,34,30z"/></svg><span class="teklif-fab-text">Sana \u00D6zel F\u0131rsatlar</span></button>'
+ '<div class="teklif-widget" id="teklifWidget">'
+   '<div class="teklif-header">'
+     '<div class="teklif-header-left">'
+       '<span class="teklif-tag"><span class="teklif-tag-dot"></span> Sana \u00D6zel</span>'
+       '<span class="teklif-header-sub">Senin i\u00E7in se\u00E7ti\u011Fimiz 5 f\u0131rsat</span>'
+     '</div>'
+     '<button class="teklif-close" id="teklifClose"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>'
+   '</div>'
+   '<div class="teklif-slider-wrapper">'
+     '<button class="teklif-slider-nav teklif-slider-prev disabled" id="sliderPrev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>'
+     '<button class="teklif-slider-nav teklif-slider-next" id="sliderNext"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>'
+     '<div class="teklif-slider" id="teklifSlider"></div>'
+   '</div>'
+   '<div class="teklif-dots" id="teklifDots"></div>'
+   '<div class="teklif-footer">'
+     '<div class="teklif-trust-item"><svg class="teklif-trust-icon" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5a2 2 0 01-2 2h0"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> \u00DCcretsiz Kargo</div>'
+     '<div class="teklif-trust-item"><svg class="teklif-trust-icon" viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg> Ayn\u0131 G\u00FCn Kargo</div>'
+     '<div class="teklif-trust-item"><svg class="teklif-trust-icon" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> G\u00FCvenli \u00D6deme</div>'
+   '</div>'
+ '</div>';

document.body.appendChild(root);

// ===== DEĞİŞKENLER =====
var API_URL = 'https://server.mustakil.co/eloren-teklif/api/urunler';
var urunler = [];
var aktifSlide = 0;
var sliderEl = document.getElementById('teklifSlider');
var dotsEl = document.getElementById('teklifDots');
var widget = document.getElementById('teklifWidget');
var fab = document.getElementById('teklifFab');

// ===== EVENT LISTENERS =====
fab.addEventListener('click', teklifWidgetAc);
document.getElementById('teklifClose').addEventListener('click', teklifWidgetKapat);
document.getElementById('sliderPrev').addEventListener('click', function(){ sliderGit(-1); });
document.getElementById('sliderNext').addEventListener('click', function(){ sliderGit(1); });

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') teklifWidgetKapat();
    if (widget.classList.contains('active')) {
        if (e.key === 'ArrowLeft') sliderGit(-1);
        if (e.key === 'ArrowRight') sliderGit(1);
    }
});

// ===== FONKSİYONLAR =====
function teklifWidgetAc() {
    widget.classList.add('active');
    fab.classList.add('hidden');
}

function teklifWidgetKapat() {
    widget.classList.remove('active');
    setTimeout(function(){ fab.classList.remove('hidden'); }, 300);
}

function yuklemeDurumuGoster(goster) {
    if (goster) {
        sliderEl.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;gap:12px;">'
            + '<div style="width:28px;height:28px;border:3px solid #e5e5e5;border-top-color:#111;border-radius:50%;animation:teklif-spin 0.8s linear infinite;"></div>'
            + '<span style="font-size:12px;color:#999;font-weight:500;">F\u0131rsatlar y\u00FCkleniyor...</span>'
            + '</div>';
        dotsEl.innerHTML = '';
    }
}

function hataGoster() {
    sliderEl.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;gap:12px;">'
        + '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
        + '<span style="font-size:12px;color:#999;font-weight:500;">F\u0131rsatlar \u015Fu an y\u00FCklenemiyor</span>'
        + '<button id="teklifRetry" style="font-size:11px;color:#111;background:none;border:1px solid #ddd;padding:6px 14px;border-radius:8px;cursor:pointer;font-family:inherit;font-weight:500;">Tekrar Dene</button>'
        + '</div>';
    document.getElementById('teklifRetry').addEventListener('click', urunleriYukle);
}

function slideOlustur(urun, index) {
    var tasarruf = urun.eskiFiyat - urun.fiyat;
    return '<div class="teklif-slide" data-index="' + index + '">'
        + '<div class="teklif-slide-inner">'
        +   '<div class="teklif-product-image">'
        +     '<img src="' + urun.gorsel + '" alt="' + urun.isim.replace(/"/g,'&quot;') + '" onerror="this.style.display=\'none\'">'
        +     '<div class="teklif-discount-badge">%' + urun.indirimOrani + '</div>'
        +     '<div class="teklif-slide-counter">' + (index+1) + ' / ' + urunler.length + '</div>'
        +   '</div>'
        +   '<div class="teklif-product-info">'
        +     '<span class="teklif-product-brand">' + urun.marka + '</span>'
        +     '<span class="teklif-product-name">' + urun.isim + '</span>'
        +     '<div class="teklif-pricing">'
        +       '<span class="teklif-price-current">\u20BA' + urun.fiyat.toLocaleString('tr-TR') + '</span>'
        +       '<span class="teklif-price-old">\u20BA' + urun.eskiFiyat.toLocaleString('tr-TR') + '</span>'
        +     '</div>'
        +     '<span class="teklif-savings">\u20BA' + tasarruf.toLocaleString('tr-TR') + ' tasarruf</span>'
        +   '</div>'
        +   '<div class="teklif-actions">'
        +     '<button class="teklif-btn-primary" data-idx="' + index + '">Sepete Ekle</button>'
        +     '<button class="teklif-btn-secondary" data-idx="' + index + '">İncele</button>'
        +   '</div>'
        + '</div></div>';
}

function sliderOlustur() {
    aktifSlide = 0;
    sliderEl.innerHTML = urunler.map(function(u,i){ return slideOlustur(u,i); }).join('');
    dotsEl.innerHTML = urunler.map(function(_,i){
        return '<button class="teklif-dot' + (i===0?' active':'') + '" data-dot="' + i + '"></button>';
    }).join('');

    var ilk = sliderEl.querySelector('.teklif-slide');
    if(ilk) ilk.classList.add('active');
    slideGuncelle();

    // Dot click
    dotsEl.addEventListener('click', function(e){
        var dot = e.target.closest('.teklif-dot');
        if(dot) slideGit(parseInt(dot.dataset.dot));
    });

    // Buton click (event delegation)
    sliderEl.addEventListener('click', function(e){
        var primary = e.target.closest('.teklif-btn-primary');
        var secondary = e.target.closest('.teklif-btn-secondary');
        var idx, urun, url;
        if(primary) {
            idx = parseInt(primary.dataset.idx);
            urun = urunler[idx];
            url = urun.link + (urun.link.indexOf('?') > -1 ? '&' : '?') + 'utm_source=website&utm_medium=widget&utm_campaign=' + encodeURIComponent(urun.isim);
            window.open(url, '_blank');
        }
        if(secondary) {
            idx = parseInt(secondary.dataset.idx);
            urun = urunler[idx];
            url = urun.link + (urun.link.indexOf('?') > -1 ? '&' : '?') + 'utm_source=website&utm_medium=widget&utm_campaign=' + encodeURIComponent(urun.isim);
            window.open(url, '_blank');
        }
    });

    // Swipe
    var touchStartX = 0;
    sliderEl.addEventListener('touchstart', function(e){ touchStartX = e.changedTouches[0].screenX; }, {passive:true});
    sliderEl.addEventListener('touchend', function(e){
        var fark = touchStartX - e.changedTouches[0].screenX;
        if(Math.abs(fark) > 50) sliderGit(fark > 0 ? 1 : -1);
    }, {passive:true});
}

function slideGuncelle() {
    var slides = document.querySelectorAll('.teklif-slide');
    var dots = document.querySelectorAll('.teklif-dot');
    for(var i=0; i<slides.length; i++){
        slides[i].classList.toggle('active', i === aktifSlide);
    }
    for(var j=0; j<dots.length; j++){
        dots[j].classList.toggle('active', j === aktifSlide);
    }
    document.getElementById('sliderPrev').classList.toggle('disabled', aktifSlide === 0);
    document.getElementById('sliderNext').classList.toggle('disabled', aktifSlide === urunler.length - 1);
}

function sliderGit(yon) {
    var yeni = aktifSlide + yon;
    if(yeni >= 0 && yeni < urunler.length){ aktifSlide = yeni; slideGuncelle(); }
}

function slideGit(index) {
    aktifSlide = index;
    slideGuncelle();
}

function urunleriYukle() {
    yuklemeDurumuGoster(true);
    return fetch(API_URL)
        .then(function(res){
            if(!res.ok) throw new Error('Sunucu hatas\u0131: ' + res.status);
            return res.json();
        })
        .then(function(veri){
            urunler = veri.urunler || [];
            if(urunler.length === 0) throw new Error('\u0130ndirimli \u00FCr\u00FCn bulunamad\u0131');
            var subEl = document.querySelector('.teklif-header-sub');
            if(subEl) subEl.textContent = 'Senin i\u00E7in se\u00E7ti\u011Fimiz ' + urunler.length + ' f\u0131rsat';
            sliderOlustur();
        })
        .catch(function(hata){
            console.error('Teklif Widget Hata:', hata);
            hataGoster();
        });
}

// ===== BAŞLAT =====
urunleriYukle();

})();

document.getElementById('year').textContent = '2021';

// loader
const loader = document.createElement('div');
loader.className = 'page-loader';
loader.innerHTML = '<div class="orb"></div>';
document.body.appendChild(loader);
window.addEventListener('load', () => setTimeout(() => loader.classList.add('hidden'), 180));
document.body.classList.add('page-enter');

// smooth page transition on internal links
document.querySelectorAll('a[href]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith('http') || href.startsWith('https') || href.startsWith('#') || a.target === '_blank') return;
    e.preventDefault();
    document.body.classList.add('page-fade-out');
    setTimeout(() => { window.location.href = href; }, 240);
  });
});

// glow cursor / touch light
const setGlow = (x, y) => {
  document.body.style.setProperty('--mx', `${x}px`);
  document.body.style.setProperty('--my', `${y}px`);
};
window.addEventListener('mouseleave', () => setGlow(window.innerWidth / 2, window.innerHeight / 2));
window.addEventListener('mousemove', (e) => setGlow(e.clientX, e.clientY));
window.addEventListener('touchstart', (e) => { const t = e.touches[0]; if (t) setGlow(t.clientX, t.clientY); }, { passive: true });
window.addEventListener('touchmove', (e) => { const t = e.touches[0]; if (t) setGlow(t.clientX, t.clientY); }, { passive: true });
setGlow(window.innerWidth / 2, window.innerHeight / 2);

const lightLayer = document.createElement('div');
lightLayer.className = 'light-layer';
const lightAura = document.createElement('div');
lightAura.className = 'light-aura';
const cursorLight = document.createElement('div');
cursorLight.className = 'cursor-light';
lightLayer.appendChild(lightAura);
lightLayer.appendChild(cursorLight);
document.body.appendChild(lightLayer);

const moveCursorLight = (x, y) => {
  lightAura.style.left = `${x}px`;
  lightAura.style.top = `${y}px`;
  cursorLight.style.left = `${x}px`;
  cursorLight.style.top = `${y}px`;
};
moveCursorLight(window.innerWidth / 2, window.innerHeight / 2);
window.addEventListener('mousemove', (e) => moveCursorLight(e.clientX, e.clientY));
window.addEventListener('touchstart', (e) => { const t=e.touches[0]; if(t) moveCursorLight(t.clientX,t.clientY); }, { passive: true });
window.addEventListener('touchmove', (e) => { const t=e.touches[0]; if(t) moveCursorLight(t.clientX,t.clientY); }, { passive: true });

// animated page backgrounds
const paletteMap = {
  'page-home': ['#63d6ff', '#9f5bff', '#2ed8ff'],
  'page-about': ['#62f5ff', '#4f83ff', '#8ee1ff'],
  'page-services': ['#f09dff', '#78b6ff', '#63d6ff'],
  'page-pricing': ['#8cffcf', '#7b8dff', '#63d6ff'],
  'page-results': ['#63d6ff', '#b06bff', '#7ff0ff'],
  'page-contact': ['#63d6ff', '#f09dff', '#9be7ff']
};
const pageClass = [...document.body.classList].find(c => c.startsWith('page-')) || 'page-home';
const palette = paletteMap[pageClass] || paletteMap['page-home'];

const canvas = document.createElement('canvas');
canvas.className = 'fx-canvas';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;
let t = 0;
const dots = Array.from({ length: 65 }, () => ({
  x: Math.random() * w, y: Math.random() * h,
  r: Math.random() * 2.2 + 0.8,
  vx: (Math.random() - 0.5) * 0.35,
  vy: (Math.random() - 0.5) * 0.35,
  c: palette[Math.floor(Math.random() * palette.length)]
}));

function drawNetwork(){
  for (let i=0;i<dots.length;i++){
    const d = dots[i]; d.x += d.vx; d.y += d.vy;
    if (d.x < -20) d.x = w + 20; if (d.x > w + 20) d.x = -20;
    if (d.y < -20) d.y = h + 20; if (d.y > h + 20) d.y = -20;
    ctx.beginPath(); ctx.fillStyle = d.c; ctx.globalAlpha = 0.65; ctx.arc(d.x,d.y,d.r,0,Math.PI*2); ctx.fill();
    for (let j=i+1;j<dots.length;j++){
      const d2 = dots[j]; const dist = Math.hypot(d.x-d2.x,d.y-d2.y);
      if (dist < 130){
        ctx.beginPath(); ctx.strokeStyle = d.c; ctx.globalAlpha = (1 - dist/130) * 0.14;
        ctx.moveTo(d.x,d.y); ctx.lineTo(d2.x,d2.y); ctx.stroke();
      }
    }
  }
}
function drawWaves(){
  for(let k=0;k<3;k++){
    ctx.beginPath(); ctx.strokeStyle = palette[k % palette.length]; ctx.globalAlpha = .2; ctx.lineWidth = 2;
    for(let x=0;x<=w;x+=10){
      const y = h*0.65 + Math.sin((x*0.01)+(t*0.02)+k)*28 + k*18;
      if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.stroke();
  }
}
function drawRisers(){
  for (let i=0;i<dots.length;i++){
    const d=dots[i]; d.y -= Math.abs(d.vy) + .18; d.x += Math.sin((t+i)*0.01)*0.35;
    if (d.y < -10){ d.y = h + 10; d.x = Math.random()*w; }
    ctx.beginPath(); ctx.fillStyle = d.c; ctx.globalAlpha = .55; ctx.arc(d.x,d.y,d.r+0.4,0,Math.PI*2); ctx.fill();
  }
}
function drawOrbits(){
  const cx = parseFloat(getComputedStyle(document.body).getPropertyValue('--mx')) || w/2;
  const cy = parseFloat(getComputedStyle(document.body).getPropertyValue('--my')) || h/2;
  for(let i=0;i<36;i++){
    const a = (i/36)*Math.PI*2 + t*0.01;
    const rr = 70 + (i%6)*16;
    const x = cx + Math.cos(a)*rr;
    const y = cy + Math.sin(a)*rr;
    ctx.beginPath(); ctx.fillStyle = palette[i%palette.length]; ctx.globalAlpha=.35; ctx.arc(x,y,2,0,Math.PI*2); ctx.fill();
  }
}
function frame(){
  t++; ctx.clearRect(0,0,w,h);
  if(pageClass==='page-pricing') drawWaves();
  else if(pageClass==='page-results') drawRisers();
  else if(pageClass==='page-contact') { drawNetwork(); drawOrbits(); }
  else drawNetwork();
  ctx.globalAlpha=1; requestAnimationFrame(frame);
}
frame();
window.addEventListener('resize', () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; });

// counters
const counters = document.querySelectorAll('.count[data-target]');
if (counters.length) {
  const animateCounter = (el) => {
    const target = Number(el.dataset.target || 0);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 50));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = current + (target >= 100 ? '%' : '');
    }, 22);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { animateCounter(entry.target); io.unobserve(entry.target); }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
}

// magnetic buttons
if (document.body.classList.contains('page-contact')) {
  document.querySelectorAll('.magnetic').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
    btn.addEventListener('touchstart', () => { btn.style.transform = 'scale(0.98)'; }, { passive: true });
    btn.addEventListener('touchend', () => { btn.style.transform = 'translate(0,0)'; }, { passive: true });
  });
}

// micro-interaction SFX (short, clean, futuristic)
let sfxCtx = null;
let sfxOn = localStorage.getItem('hkdigital_sfx') !== 'off';
const sfxBtn = document.createElement('button');
sfxBtn.className = 'sound-toggle';
sfxBtn.style.bottom = '64px';
const setSfxBtn = () => { sfxBtn.textContent = sfxOn ? '✨ SFX ON' : '✨ SFX OFF'; };
setSfxBtn();
document.body.appendChild(sfxBtn);

function ensureSfxCtx(){
  if (!sfxCtx) sfxCtx = new (window.AudioContext || window.webkitAudioContext)();
  return sfxCtx;
}

function beep({freq=900, dur=0.12, type='sine', gain=0.02, slide=-120}={}){
  if (!sfxOn) return;
  const ac = ensureSfxCtx();
  const now = ac.currentTime;
  const o = ac.createOscillator();
  const g = ac.createGain();
  const lp = ac.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 2600;
  o.type = type;
  o.frequency.setValueAtTime(freq, now);
  o.frequency.exponentialRampToValueAtTime(Math.max(120, freq + slide), now + dur);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(gain, now + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  o.connect(lp); lp.connect(g); g.connect(ac.destination);
  o.start(now); o.stop(now + dur + 0.02);
}

function playSfx(kind='click'){
  if (kind === 'checkout') {
    beep({freq:740,dur:.09,type:'triangle',gain:.018,slide:80});
    setTimeout(() => beep({freq:980,dur:.11,type:'sine',gain:.02,slide:120}), 80);
  } else if (kind === 'unlock') {
    beep({freq:660,dur:.08,type:'square',gain:.016,slide:140});
    setTimeout(() => beep({freq:1120,dur:.12,type:'triangle',gain:.018,slide:180}), 60);
  } else if (kind === 'tool') {
    beep({freq:860,dur:.1,type:'sine',gain:.017,slide:-40});
  } else {
    beep({freq:920,dur:.09,type:'sine',gain:.014,slide:-80});
  }
}

sfxBtn.addEventListener('click', async () => {
  sfxOn = !sfxOn;
  localStorage.setItem('hkdigital_sfx', sfxOn ? 'on' : 'off');
  setSfxBtn();
  if (sfxOn) {
    try { await ensureSfxCtx().resume(); } catch {}
    playSfx('unlock');
  }
});

window.addEventListener('click', async () => {
  if (!sfxOn) return;
  try { await ensureSfxCtx().resume(); } catch {}
}, { once: true });

// blueprint form -> WhatsApp with filled details
const blueprintForm = document.getElementById('blueprintForm');
if (blueprintForm) {
  blueprintForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(blueprintForm);
    const business = (fd.get('business') || '').toString().trim();
    const contact = (fd.get('contact') || '').toString().trim();
    const offer = (fd.get('offer') || '').toString().trim();

    const text = [
      'Hi HKdigital, I want my growth blueprint.',
      '',
      `Business: ${business || '-'}`,
      `Contact: ${contact || '-'}`,
      `Main offer: ${offer || '-'}`
    ].join('\n');

    const url = `https://wa.me/212656280110?text=${encodeURIComponent(text)}`;
    window.location.href = url;
  });
}

// lightweight analytics tracking
function trackEvent(name, meta = {}) {
  if (!name) return;
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, meta);
    }
    console.log('[analytics]', name, meta);
  } catch {}
}

// map micro interactions
// - Add to cart (if added later): class="add-to-cart"
// - Checkout buttons: class="checkout"
// - Tool toggles: class="tool-action"
// - Unlock feature: class="unlock-feature"
document.addEventListener('click', (e) => {
  const el = e.target.closest('button, a, [data-sfx], [data-analytics], .add-to-cart, .checkout, .tool-action, .unlock-feature');
  if (!el) return;

  const analyticName = el.getAttribute('data-analytics');
  if (analyticName) trackEvent(analyticName, { page: pageClass });

  if (el.matches('.checkout, [data-sfx="checkout"]')) return playSfx('checkout');
  if (el.matches('.tool-action, [data-sfx="tool"]')) return playSfx('tool');
  if (el.matches('.unlock-feature, [data-sfx="unlock"]')) return playSfx('unlock');
  if (el.matches('.add-to-cart, [data-sfx="cart"]')) return playSfx('click');

  // smart fallback by text
  const txt = (el.textContent || '').toLowerCase();
  if (txt.includes('checkout')) return playSfx('checkout');
  if (txt.includes('unlock')) return playSfx('unlock');
  if (txt.includes('tool')) return playSfx('tool');
  playSfx('click');
});
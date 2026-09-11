function stampBadge(){ return `<div class="stamp-sm">SMACKED</div>`; }
function burnOverlay(){
  return `<div class="char-overlay"></div><div class="ember-line"></div><div class="smoke-layer"><span class="puff p1"></span><span class="puff p2"></span><span class="puff p3"></span><span class="puff p4"></span></div>`;
}
function iconWrap(svg, color){
  return `<div class="icon-wrap" style="color:${color}"><div class="icon-float"><div class="icon-tilt">${svg}</div></div>${stampBadge()}</div>`;
}
function kitIconWrap(svg, color){
  return `<div class="icon-wrap burnable" style="color:${color}"><div class="icon-float"><div class="icon-tilt">${svg}</div></div>${stampBadge()}${burnOverlay()}</div>`;
}

function attachTilt(boxEl){
  const moveEl = boxEl.querySelector('.icon-tilt');
  if(!moveEl) return;
  boxEl.addEventListener('mousemove', (e) => {
    const r = boxEl.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    moveEl.style.transform = `rotateY(${x * 150}deg) rotateX(${-y * 12}deg)`;
  });
  boxEl.addEventListener('mouseleave', () => {
    moveEl.style.transform = 'rotateY(0deg) rotateX(0deg)';
  });
}

let kitColors = {hoodie:0, tee:0, shades:0, beanie:0};

function kitBoxInner(item){
  return `
    ${kitIconWrap(item.svg, item.colors[kitColors[item.id]])}
    <div class="kit-name mono">${item.name}</div>
    <div class="kit-price mono">${money(item.price)}</div>
    <div class="swatches">
      ${item.colors.map((c,i) => `<button class="swatch-dot ${i===kitColors[item.id]?'active':''}" style="background:${c}" data-id="${item.id}" data-idx="${i}" aria-label="${item.name} colorway ${i+1}"></button>`).join('')}
    </div>
  `;
}

function renderKit(){
  const grid = document.getElementById('kitGrid');
  grid.innerHTML = KIT.map(item => `<div class="kit-box" data-id="${item.id}">${kitBoxInner(item)}</div>`).join('');
  grid.querySelectorAll('.kit-box').forEach(attachTilt);
  observePop('.kit-box');

  grid.addEventListener('click', (e) => {
    const dot = e.target.closest('.swatch-dot');
    if(!dot) return;
    const id = dot.dataset.id;
    kitColors[id] = Number(dot.dataset.idx);
    const item = KIT.find(k => k.id === id);
    const box = grid.querySelector(`.kit-box[data-id="${id}"]`);
    box.innerHTML = kitBoxInner(item);
    attachTilt(box);
    updateBurn();
  });
}

let productColors = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0};
const SIZES = ['S','M','L','XL'];
const CATS = ['all', 'tees', 'hoodies', 'outerwear'];

let cart = [];

function saveCart(){
  try { localStorage.setItem('smacked_cart', JSON.stringify(cart)); } catch(e) {}
}
function loadCart(){
  try {
    const saved = localStorage.getItem('smacked_cart');
    if(saved) cart = JSON.parse(saved);
  } catch(e) {}
}
let selectedSize = null;
let activeCat = 'all';

function money(n){ return '$' + n.toFixed(2).replace(/\.00$/,''); }

function renderFilters(){
  const el = document.getElementById('filters');
  el.innerHTML = CATS.map(c => `<button class="chip mono ${c===activeCat?'active':''}" data-cat="${c}">${c}</button>`).join('');
  el.querySelectorAll('.chip').forEach(b => {
    b.addEventListener('click', () => { activeCat = b.dataset.cat; renderFilters(); renderGrid(); });
  });
}

function cardInner(p){
  return `
    <div class="img">
      <span class="num mono">0${p.id}</span>
      ${kitIconWrap(CAT_SVG[p.cat], p.colors[productColors[p.id]])}
    </div>
    <div class="body">
      <div class="name">${p.name}</div>
      <div class="cat mono">${p.cat}</div>
      <div class="price mono">${money(p.price)}</div>
      <div class="swatches">
        ${p.colors.map((c,i) => `<button class="swatch-dot ${i===productColors[p.id]?'active':''}" style="background:${c}" data-id="${p.id}" data-idx="${i}" aria-label="${p.name} colorway ${i+1}"></button>`).join('')}
      </div>
      <button class="quick-add" data-id="${p.id}">quick add</button>
    </div>
  `;
}

function renderGrid(){
  const grid = document.getElementById('grid');
  const items = activeCat === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === activeCat);
  document.getElementById('itemCount').textContent = items.length + (items.length === 1 ? ' piece' : ' pieces');
  grid.innerHTML = items.map(p => `<div class="card" data-id="${p.id}">${cardInner(p)}</div>`).join('');
  grid.querySelectorAll('.card').forEach(c => {
    c.addEventListener('click', (e) => {
      if(e.target.classList.contains('quick-add') || e.target.classList.contains('swatch-dot')) return;
      openModal(Number(c.dataset.id));
    });
  });
  grid.querySelectorAll('.quick-add').forEach(b => {
    b.addEventListener('click', (e) => { e.stopPropagation(); openModal(Number(b.dataset.id)); });
  });
  grid.querySelectorAll('.card .img').forEach(attachTilt);
  observePop('.card');
}

document.getElementById('grid').addEventListener('click', (e) => {
  const dot = e.target.closest('.swatch-dot');
  if(!dot) return;
  e.stopPropagation();
  const id = Number(dot.dataset.id);
  productColors[id] = Number(dot.dataset.idx);
  const p = PRODUCTS.find(x => x.id === id);
  const card = document.getElementById('grid').querySelector(`.card[data-id="${id}"]`);
  card.innerHTML = cardInner(p);
  attachTilt(card.querySelector('.img'));
});

function openModal(id){
  const p = PRODUCTS.find(x => x.id === id);
  selectedSize = null;
  const card = document.getElementById('modalCard');
  card.innerHTML = `
    <div class="modal-img">
      ${iconWrap(CAT_SVG[p.cat], p.colors[productColors[p.id]])}
      <button class="close-x" id="closeModal">&times;</button>
    </div>
    <div class="modal-info">
      <h3>${p.name}</h3>
      <div class="price mono">${money(p.price)}</div>
      <div class="label mono">size</div>
      <div class="sizes" id="sizeRow">
        ${SIZES.map(s => `<button class="size-btn" data-size="${s}">${s}</button>`).join('')}
      </div>
      <div class="error-text" id="sizeError">pick a size first.</div>
      <button class="add-btn" id="addBtn">add to bag — ${money(p.price)}</button>
    </div>
  `;
  document.getElementById('overlay').className = 'overlay open';
  document.getElementById('closeModal').addEventListener('click', closeOverlay);
  attachTilt(card.querySelector('.modal-img'));
  card.querySelectorAll('.size-btn').forEach(b => {
    b.addEventListener('click', () => {
      card.querySelectorAll('.size-btn').forEach(x => x.classList.remove('selected'));
      b.classList.add('selected');
      selectedSize = b.dataset.size;
      document.getElementById('sizeError').classList.remove('show');
    });
  });
  document.getElementById('addBtn').addEventListener('click', () => {
    if(!selectedSize){
      document.getElementById('sizeError').classList.add('show');
      return;
    }
    addToCart(p, selectedSize);
    closeOverlay();
    bumpCartIcon();
  });
}

function addToCart(p, size){
  const existing = cart.find(i => i.id === p.id && i.size === size);
  if(existing){ existing.qty += 1; }
  else { cart.push({id:p.id, name:p.name, price:p.price, color:p.colors[productColors[p.id]], cat:p.cat, size, qty:1}); }
  renderCartCount();
  saveCart();
}

function bumpCartIcon(){
  const el = document.getElementById('cartCount');
  el.classList.add('bump');
  setTimeout(() => el.classList.remove('bump'), 250);
}

function renderCartCount(){
  const count = cart.reduce((sum,i) => sum + i.qty, 0);
  document.getElementById('cartCount').textContent = count;
}

function renderDrawer(){
  const itemsEl = document.getElementById('drawerItems');
  const footEl = document.getElementById('drawerFoot');
  if(cart.length === 0){
    itemsEl.innerHTML = `<div class="empty-cart">your bag is empty.<br>go get smacked.</div>`;
    footEl.innerHTML = '';
    return;
  }
  itemsEl.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <div class="thumb">${iconWrap(CAT_SVG[item.cat], item.color)}</div>
      <div class="info">
        <div class="n">${item.name}</div>
        <div class="s mono">size ${item.size}</div>
        <div class="qty-row">
          <button class="qty-btn" data-action="dec" data-idx="${idx}">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" data-action="inc" data-idx="${idx}">+</button>
          <button class="remove-btn" data-action="remove" data-idx="${idx}">remove</button>
        </div>
      </div>
    </div>
  `).join('');
  const subtotal = cart.reduce((sum,i) => sum + i.price * i.qty, 0);
  footEl.innerHTML = `
    <div class="subtotal-row"><span>subtotal</span><span>${money(subtotal)}</span></div>
    <button class="checkout-btn" id="checkoutBtn">checkout</button>
    <div class="checkout-note" id="checkoutNote">this is a demo — checkout would connect to Stripe or Shopify here.</div>
  `;
  itemsEl.querySelectorAll('button').forEach(b => {
    b.addEventListener('click', () => {
      const idx = Number(b.dataset.idx);
      const action = b.dataset.action;
      if(action === 'inc') cart[idx].qty += 1;
      if(action === 'dec') { cart[idx].qty -= 1; if(cart[idx].qty <= 0) cart.splice(idx,1); }
      if(action === 'remove') cart.splice(idx,1);
      renderCartCount();
      renderDrawer();
      saveCart();
    });
  });
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    document.getElementById('checkoutNote').classList.add('show');
  });
}

function closeOverlay(){
  document.getElementById('overlay').className = 'overlay';
}

document.getElementById('cartToggle').addEventListener('click', () => {
  renderDrawer();
  document.getElementById('overlay').className = 'overlay open cart-open';
});
document.getElementById('closeCart').addEventListener('click', closeOverlay);
document.getElementById('overlay').addEventListener('click', (e) => {
  if(e.target.id === 'overlay') closeOverlay();
});

const plusToggle = document.getElementById('plusToggle');
const navDropdown = document.getElementById('navDropdown');
plusToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  navDropdown.classList.toggle('open');
  plusToggle.classList.toggle('open');
});
document.addEventListener('click', (e) => {
  if(!navDropdown.contains(e.target) && e.target !== plusToggle){
    navDropdown.classList.remove('open');
    plusToggle.classList.remove('open');
  }
});

const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinks = document.getElementById('navLinks');
hamburgerBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = navLinks.classList.toggle('mobile-open');
  hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('mobile-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  });
});
document.addEventListener('click', (e) => {
  if(!navLinks.contains(e.target) && e.target !== hamburgerBtn && !hamburgerBtn.contains(e.target)){
    navLinks.classList.remove('mobile-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }
});

function updateBurn(){
  const el = document.querySelector('.brandmark-img');
  if(el){
    const rect = el.getBoundingClientRect();
    let progress = (0 - rect.top) / rect.height;
    progress = Math.max(0, Math.min(1, progress));
    el.style.setProperty('--burn', progress);
  }
  document.querySelectorAll('.icon-wrap.burnable').forEach(box => {
    const rect = box.getBoundingClientRect();
    let progress = (0 - rect.top) / rect.height;
    progress = Math.max(0, Math.min(1, progress));
    box.style.setProperty('--burn', progress);
  });
}
window.addEventListener('scroll', () => requestAnimationFrame(updateBurn), {passive:true});

let transitionPending = false;
function playFireTransition(holdMs, midAction){
  if(transitionPending) return;
  transitionPending = true;
  const overlay = document.getElementById('loopTransition');
  overlay.classList.add('show');
  setTimeout(() => {
    if(midAction) midAction();
    setTimeout(() => {
      overlay.classList.remove('show');
      setTimeout(() => { transitionPending = false; }, 700);
    }, holdMs);
  }, 550);
}

// Site opens already engulfed in flame, then burns away to reveal the page.
transitionPending = true;
setTimeout(() => {
  document.getElementById('loopTransition').classList.remove('show');
  setTimeout(() => { transitionPending = false; }, 700);
}, 1400);

const popObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('pop-in');
      popObserver.unobserve(entry.target);
    }
  });
}, {threshold:0.15});

function observePop(selector){
  document.querySelectorAll(selector).forEach((el, i) => {
    el.style.transitionDelay = (i % 6) * 70 + 'ms';
    popObserver.observe(el);
    // Safety net: if the observer never fires for this element (e.g. it's
    // already on-screen before the browser finishes its first layout pass),
    // force it visible after a short delay instead of leaving it hidden forever.
    setTimeout(() => {
      if(!el.classList.contains('pop-in')){
        el.classList.add('pop-in');
        popObserver.unobserve(el);
      }
    }, 1800);
  });
}

function renderTicker(){
  const track = document.getElementById('tickerTrack');
  const phrase = 'ARE YOU SMACKED YET?';
  const repeats = 8;
  let half = '';
  for(let i = 0; i < repeats; i++){
    half += `<span class="ticker-unit">${phrase}</span>`;
  }
  track.innerHTML = half + half;
}

function safeRun(fn, label){
  try { fn(); }
  catch(err) { console.error('Init step failed:', label, err); }
}

safeRun(loadCart, 'loadCart');
safeRun(renderCartCount, 'renderCartCount');
safeRun(renderTicker, 'renderTicker');
safeRun(renderKit, 'renderKit');
safeRun(renderFilters, 'renderFilters');
safeRun(renderGrid, 'renderGrid');
safeRun(updateBurn, 'updateBurn');

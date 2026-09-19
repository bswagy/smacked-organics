function stampBadge(){ return `<div class="stamp-sm">SMACKED</div>`; }
function iconWrap(svg, color){
  return `<div class="icon-wrap" style="color:${color}"><div class="icon-float"><div class="icon-tilt">${svg}</div></div></div>`;
}
function mediaContent(item, svg, index, color){
  index = index || 0;
  if(item.colorImages && color && item.colorImages[color] && item.colorImages[color].length){
    const imgs = item.colorImages[color];
    return `<img src="${imgs[index % imgs.length]}" alt="${item.name}">`;
  }
  if(item.video) return `<video src="${item.video}" autoplay muted loop playsinline></video>`;
  if(item.images && item.images.length > 0) return `<img src="${item.images[index % item.images.length]}" alt="${item.name}">`;
  return svg;
}

let mediaIndex = {};

const SUPABASE_URL = 'https://fexsevhuufbohcewebzw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZleHNldmh1dWZib2hjZXdlYnp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyMzk2NDksImV4cCI6MjEwNDgxNTY0OX0.lXVR2zQyNTRONyuEZaJP4GGpMcY3-gahhZvBpLEGEd4';
const inventoryClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let inventoryData = [];

async function loadInventoryData(){
  const { data, error } = await inventoryClient.from('inventory').select('*');
  if(!error && data) inventoryData = data;
}

function getStock(productId, size, color){
  const row = inventoryData.find(r =>
    String(r.product_id) === String(productId) && r.size === size && r.color === color
  );
  return row ? row.stock_count : null; // null = not tracked yet, treated as available
}

function isProductSoldOut(item){
  const rows = inventoryData.filter(r => String(r.product_id) === String(item.id));
  if(rows.length === 0) return false; // untracked products default to available
  return rows.every(r => r.stock_count <= 0);
}

async function submitRestockRequest(email, productId, size, color){
  const { error } = await inventoryClient.from('restock_requests').insert({
    email, product_id: String(productId), size, color
  });
  return !error;
}

function kitIconWrap(svg, color){
  return `<div class="icon-wrap" style="color:${color}"><div class="icon-float"><div class="icon-tilt">${svg}</div></div></div>`;
}

function attachTilt(boxEl){
  const moveEl = boxEl.querySelector('.icon-tilt');
  if(!moveEl) return;
  boxEl.addEventListener('mousemove', (e) => {
    const r = boxEl.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    moveEl.style.transform = `translate(${x * 10}px, ${y * 10}px) scale(1.06)`;
  });
  boxEl.addEventListener('mouseleave', () => {
    moveEl.style.transform = 'translate(0px, 0px) scale(1)';
  });
}

let productColors = {7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0, 17:0, 18:0, 19:0, 20:0, 21:0, 22:0};
let organicsColors = {101:0, 102:0, 103:0, 104:0, 105:0, 106:0, 107:0};
const SIZES = ['S','M','L','XL'];

// Size guide measurements (in inches) — edit these numbers anytime, no other code needs to change.
const SIZE_CHART = {
  S:  { chest: 36, length: 27, sleeve: 33 },
  M:  { chest: 40, length: 28, sleeve: 34 },
  L:  { chest: 44, length: 29, sleeve: 35 },
  XL: { chest: 48, length: 30, sleeve: 36 },
};
const CATS = ['all', 'tees', 'hoodies', 'bottoms', 'hats', 'beanies'];

let cart = [];

let wishlist = [];
function saveWishlist(){
  try { localStorage.setItem('smacked_wishlist', JSON.stringify(wishlist)); } catch(e) {}
}
function loadWishlist(){
  try {
    const saved = localStorage.getItem('smacked_wishlist');
    if(saved) wishlist = JSON.parse(saved);
  } catch(e) {}
}
function isWishlisted(id){
  return wishlist.some(w => String(w) === String(id));
}
function toggleWishlist(id){
  if(isWishlisted(id)){
    wishlist = wishlist.filter(w => String(w) !== String(id));
  } else {
    wishlist.push(id);
  }
  saveWishlist();
  renderWishlistCount();
}
function findItemById(id){
  const numericId = Number(id);
  return PRODUCTS.find(p => p.id === numericId) || ORGANICS.find(o => o.id === numericId);
}
function renderWishlistCount(){
  const el = document.getElementById('wishlistCount');
  if(el) el.textContent = wishlist.length;
}

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

let organicsActiveCat = 'all';

function cardInner(p, colorState){
  colorState = colorState || productColors;
  const svg = p.svg || CAT_SVG[p.cat];
  const idx = mediaIndex[p.id] || 0;
  const currentColor = p.colors[colorState[p.id]];
  const content = mediaContent(p, svg, idx, currentColor);
  const hasMultiple = p.images && p.images.length > 1;
  const arrows = hasMultiple ? `
    <button class="media-arrow media-arrow-left" data-id="${p.id}" aria-label="Previous photo">&lsaquo;</button>
    <button class="media-arrow media-arrow-right" data-id="${p.id}" aria-label="Next photo">&rsaquo;</button>
  ` : '';
  const soldOut = isProductSoldOut(p);
  const soldOutBanner = soldOut ? `<div class="sold-out-banner">SOLD OUT</div>` : '';
  const wished = isWishlisted(p.id);
  return `
    <div class="media-wrap">
      ${kitIconWrap(content, p.colors[colorState[p.id]])}
      ${arrows}
      ${soldOutBanner}
      <button class="wishlist-btn ${wished ? 'active' : ''}" data-id="${p.id}" aria-label="Save to wishlist">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="${wished ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 2 5 5.5 5c2 0 3.5 1.2 4.5 2.5C11 6.2 12.5 5 14.5 5 18 5 19.5 8.5 21.5 12.5 19 16.65 12 21 12 21z"/></svg>
      </button>
      <button class="quick-add" data-id="${p.id}" aria-label="${soldOut ? 'Sold out' : 'Quick add'}" ${soldOut ? 'disabled' : ''}>+</button>
    </div>
  `;
}

let sortMode = 'featured';
function renderGrid(){
  const grid = document.getElementById('grid');
  let items = activeCat === 'all' ? PRODUCTS.slice() : PRODUCTS.filter(p => p.cat === activeCat);
  if(sortMode === 'price-low') items.sort((a,b) => a.price - b.price);
  else if(sortMode === 'price-high') items.sort((a,b) => b.price - a.price);
  else if(sortMode === 'name') items.sort((a,b) => a.name.localeCompare(b.name));
  grid.innerHTML = items.map(p => `<div class="card" data-id="${p.id}">${cardInner(p)}</div>`).join('');
  grid.querySelectorAll('.card').forEach(c => {
    c.addEventListener('click', (e) => {
      if(e.target.classList.contains('quick-add') || e.target.classList.contains('media-arrow')) return;
      openModal(Number(c.dataset.id));
    });
  });
  grid.querySelectorAll('.quick-add').forEach(b => {
    b.addEventListener('click', (e) => { e.stopPropagation(); openModal(Number(b.dataset.id)); });
  });
  grid.querySelectorAll('.media-arrow').forEach(b => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = Number(b.dataset.id);
      const p = PRODUCTS.find(x => x.id === id);
      const current = mediaIndex[id] || 0;
      const delta = b.classList.contains('media-arrow-right') ? 1 : -1;
      mediaIndex[id] = (current + delta + p.images.length) % p.images.length;
      const card = grid.querySelector(`.card[data-id="${id}"]`);
      card.innerHTML = cardInner(p);
      attachTilt(card);
    });
  });
  grid.querySelectorAll('.card').forEach(attachTilt);
  observePop('.card');
}

document.getElementById('grid').addEventListener('click', (e) => {
  const wishBtn = e.target.closest('.wishlist-btn');
  if(wishBtn){
    e.stopPropagation();
    toggleWishlist(Number(wishBtn.dataset.id));
    const p = PRODUCTS.find(x => x.id === Number(wishBtn.dataset.id));
    const card = document.getElementById('grid').querySelector(`.card[data-id="${wishBtn.dataset.id}"]`);
    card.innerHTML = cardInner(p);
    attachTilt(card);
  }
});

function renderOrganics(){
  const grid = document.getElementById('organicsGrid');
  const items = organicsActiveCat === 'all' ? ORGANICS : ORGANICS.filter(p => p.cat === organicsActiveCat);
  grid.innerHTML = items.map(p => `<div class="card" data-id="${p.id}">${cardInner(p, organicsColors)}</div>`).join('');
  grid.querySelectorAll('.card').forEach(c => {
    c.addEventListener('click', (e) => {
      if(e.target.classList.contains('quick-add')) return;
      openModal(Number(c.dataset.id));
    });
  });
  grid.querySelectorAll('.quick-add').forEach(b => {
    b.addEventListener('click', (e) => { e.stopPropagation(); openModal(Number(b.dataset.id)); });
  });
  grid.querySelectorAll('.card').forEach(attachTilt);
  observePop('.card');
}

document.getElementById('organicsGrid').addEventListener('click', (e) => {
  const wishBtn = e.target.closest('.wishlist-btn');
  if(wishBtn){
    e.stopPropagation();
    toggleWishlist(Number(wishBtn.dataset.id));
    const p = ORGANICS.find(x => x.id === Number(wishBtn.dataset.id));
    const card = document.getElementById('organicsGrid').querySelector(`.card[data-id="${wishBtn.dataset.id}"]`);
    card.innerHTML = cardInner(p, organicsColors);
    attachTilt(card);
  }
});

let modalOpenedAt = 0;
function relatedProductsHTML(p, organicsItem){
  let pool, colorState;
  if(organicsItem){ pool = ORGANICS.filter(x => x.id !== p.id && x.cat === p.cat); colorState = organicsColors; }
  else { pool = PRODUCTS.filter(x => x.id !== p.id && x.cat === p.cat); colorState = productColors; }
  const picks = pool.slice(0, 3);
  if(picks.length === 0) return '';
  return `
    <div class="related-products">
      <div class="label mono">you may also like</div>
      <div class="related-row">
        ${picks.map(item => {
          const svg = item.svg || CAT_SVG[item.cat];
          const itemColor = item.colors[colorState[item.id] || 0];
          const content = mediaContent(item, svg, 0, itemColor);
          return `
            <div class="related-item" data-id="${item.id}">
              ${iconWrap(content, itemColor)}
              <div class="related-name mono">${item.name}</div>
              <div class="related-price mono">${money(item.price)}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

let modalMediaIndex = 0;

function modalImgHTML(p, color){
  const imgs = p.colorImages && p.colorImages[color];
  const hasMultiple = imgs && imgs.length > 1;
  const content = mediaContent(p, p.svg || CAT_SVG[p.cat], modalMediaIndex, color);
  const arrows = hasMultiple ? `
    <button class="media-arrow media-arrow-left" id="modalArrowLeft" aria-label="Previous photo">&lsaquo;</button>
    <button class="media-arrow media-arrow-right" id="modalArrowRight" aria-label="Next photo">&rsaquo;</button>
  ` : '';
  return `${iconWrap(content, color)}${arrows}<button class="close-x" id="closeModal">&times;</button>`;
}

function bindModalImgEvents(p, color){
  document.getElementById('closeModal').addEventListener('click', closeOverlay);
  const left = document.getElementById('modalArrowLeft');
  const right = document.getElementById('modalArrowRight');
  const cycle = (delta) => {
    const imgs = p.colorImages[color];
    modalMediaIndex = (modalMediaIndex + delta + imgs.length) % imgs.length;
    const box = document.getElementById('modalImgBox');
    box.innerHTML = modalImgHTML(p, color);
    bindModalImgEvents(p, color);
    attachTilt(box);
  };
  if(left) left.addEventListener('click', () => cycle(-1));
  if(right) right.addEventListener('click', () => cycle(1));
}

function openModal(id){
  modalOpenedAt = Date.now();
  const organicsItem = ORGANICS.find(x => x.id === id);
  const p = organicsItem || PRODUCTS.find(x => x.id === id);
  const color = organicsItem ? p.colors[organicsColors[p.id]]
    : p.colors[productColors[p.id]];
  modalMediaIndex = 0;
  const itemSizes = p.sizes || SIZES;
  const usesClothingSizes = !p.sizes;
  selectedSize = null;
  const card = document.getElementById('modalCard');
  card.innerHTML = `
    <div class="modal-img" id="modalImgBox">${modalImgHTML(p, color)}</div>
    <div class="modal-info">
      <h3>${p.name}</h3>
      ${p.description ? `<p class="modal-description">${p.description}</p>` : ''}
      <div class="price mono">${money(p.price)}</div>
      ${p.colors.length > 1 ? `
        <div class="label-row">
          <div class="label mono">color</div>
        </div>
        <div class="swatches modal-swatches">
          ${p.colors.map((c,i) => `<button class="swatch-dot ${c===color?'active':''}" style="background:${c}" data-id="${p.id}" data-idx="${i}" aria-label="${p.name} colorway ${i+1}"></button>`).join('')}
        </div>
      ` : ''}
      <div class="label-row">
        <div class="label mono">size</div>
        ${usesClothingSizes ? `<button class="size-guide-toggle mono" id="sizeGuideToggle" type="button">size guide</button>` : ''}
      </div>
      ${usesClothingSizes ? `
        <div class="size-guide" id="sizeGuideTable">
          <table>
            <tr><th></th><th>chest</th><th>length</th><th>sleeve</th></tr>
            ${itemSizes.map(s => `<tr><td>${s}</td><td>${SIZE_CHART[s].chest}"</td><td>${SIZE_CHART[s].length}"</td><td>${SIZE_CHART[s].sleeve}"</td></tr>`).join('')}
          </table>
        </div>
      ` : ''}
      <div class="sizes" id="sizeRow">
        ${itemSizes.map(s => {
          const stock = getStock(p.id, s, color);
          const outOfStock = stock !== null && stock <= 0;
          return `<button class="size-btn ${outOfStock ? 'unavailable' : ''}" data-size="${s}">${s}</button>`;
        }).join('')}
      </div>
      ${itemSizes.some(s => { const st = getStock(p.id, s, color); return st !== null && st <= 0; }) ? `
        <button class="notify-toggle mono" id="notifyToggle" type="button">hit me up when it's back</button>
        <div class="notify-form" id="notifyForm">
          <input type="email" id="notifyEmail" placeholder="your email">
          <button class="notify-submit" id="notifySubmit" type="button">submit</button>
        </div>
      ` : ''}
      <div class="error-text" id="sizeError">pick a size first.</div>
      <button class="add-btn" id="addBtn">add to bag — ${money(p.price)}</button>
      ${relatedProductsHTML(p, organicsItem)}
    </div>
  `;
  document.getElementById('overlay').className = 'overlay open';
  bindModalImgEvents(p, color);
  const sizeGuideToggle = document.getElementById('sizeGuideToggle');
  if(sizeGuideToggle){
    sizeGuideToggle.addEventListener('click', () => {
      document.getElementById('sizeGuideTable').classList.toggle('show');
    });
  }
  const notifyToggle = document.getElementById('notifyToggle');
  if(notifyToggle){
    notifyToggle.addEventListener('click', () => {
      document.getElementById('notifyForm').classList.toggle('show');
    });
    document.getElementById('notifySubmit').addEventListener('click', async () => {
      const emailInput = document.getElementById('notifyEmail');
      const email = emailInput.value.trim();
      if(!email) return;
      const selectedSizeBtn = card.querySelector('.size-btn.selected');
      const sizeForRequest = selectedSizeBtn ? selectedSizeBtn.dataset.size : itemSizes[0];
      const ok = await submitRestockRequest(email, p.id, sizeForRequest, color);
      document.getElementById('notifyForm').innerHTML = ok
        ? `<span class="notify-confirm">you're locked in — we'll hit your inbox when it drops.</span>`
        : `<span class="notify-confirm">something went wrong, try again.</span>`;
    });
  }
  card.querySelectorAll('.related-item').forEach(el => {
    el.addEventListener('click', () => {
      openModal(Number(el.dataset.id));
    });
  });
  card.querySelectorAll('.modal-swatches .swatch-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = Number(dot.dataset.idx);
      if(organicsItem) organicsColors[p.id] = idx;
      else productColors[p.id] = idx;
      openModal(id);
    });
  });
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
    const stock = getStock(p.id, selectedSize, color);
    if(stock !== null && stock <= 0){
      document.getElementById('sizeError').textContent = 'that size just sold out.';
      document.getElementById('sizeError').classList.add('show');
      return;
    }
    addToCart({...p, color, cat: p.cat || (organicsItem ? 'organics' : 'kit')}, selectedSize);
    closeOverlay();
    bumpCartIcon();
  });
}

function addToCart(p, size){
  const existing = cart.find(i => i.id === p.id && i.size === size);
  const resolvedColor = p.color || p.colors[productColors[p.id]];
  const media = mediaContent(p, p.svg || CAT_SVG[p.cat], 0, resolvedColor);
  if(existing){ existing.qty += 1; }
  else { cart.push({id:p.id, name:p.name, price:p.price, color:resolvedColor, cat:p.cat, media, size, qty:1}); }
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

// Free shipping threshold — edit this one number anytime to change the requirement.
const FREE_SHIPPING_THRESHOLD = 75;

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
      <div class="thumb">${iconWrap(item.media || CAT_SVG[item.cat] || '', item.color)}</div>
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
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const shipBar = remaining > 0
    ? `<div class="ship-bar-wrap">
         <div class="ship-bar-label mono">add ${money(remaining)} more for <span class="ship-bar-highlight">free shipping</span></div>
         <div class="ship-bar-track"><div class="ship-bar-fill" style="width:${pct}%"></div></div>
       </div>`
    : `<div class="ship-bar-wrap ship-bar-unlocked">
         <div class="ship-bar-label mono">✓ free shipping unlocked</div>
       </div>`;
  footEl.innerHTML = `
    ${shipBar}
    <div class="subtotal-row"><span>subtotal</span><span>${money(subtotal)}</span></div>
    <button class="checkout-btn" id="checkoutBtn">checkout</button>
    <div class="checkout-note" id="checkoutNote"></div>
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
  document.getElementById('checkoutBtn').addEventListener('click', async () => {
    const btn = document.getElementById('checkoutBtn');
    btn.disabled = true;
    btn.textContent = 'redirecting...';
    try {
      const response = await fetch('https://fexsevhuufbohcewebzw.supabase.co/functions/v1/create-checkout-session-', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ items: cart }),
      });
      const data = await response.json();
      if(data.url){
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'checkout failed');
      }
    } catch(err) {
      btn.disabled = false;
      btn.textContent = 'checkout';
      document.getElementById('checkoutNote').textContent = 'something went wrong — try again.';
      document.getElementById('checkoutNote').classList.add('show');
    }
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

function renderWishlistDrawer(){
  const itemsEl = document.getElementById('wishlistItems');
  if(wishlist.length === 0){
    itemsEl.innerHTML = `<div class="empty-cart">nothing saved yet.<br>tap the heart on anything you like.</div>`;
    return;
  }
  const items = wishlist.map(id => findItemById(id)).filter(Boolean);
  itemsEl.innerHTML = items.map(item => {
    const svg = item.svg || CAT_SVG[item.cat];
    const content = mediaContent(item, svg, 0);
    return `
      <div class="cart-item">
        <div class="thumb">${iconWrap(content, item.colors[0])}</div>
        <div class="info">
          <div class="n">${item.name}</div>
          <div class="s mono">${money(item.price)}</div>
          <div class="qty-row">
            <button class="remove-btn" data-action="view" data-id="${item.id}">view</button>
            <button class="remove-btn" data-action="remove" data-id="${item.id}">remove</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  itemsEl.querySelectorAll('button').forEach(b => {
    b.addEventListener('click', () => {
      const id = b.dataset.id;
      if(b.dataset.action === 'remove'){
        toggleWishlist(Number(id));
        renderWishlistDrawer();
      } else {
        closeOverlay();
        openModal(Number(id));
      }
    });
  });
}

document.getElementById('wishlistSectionToggle').addEventListener('click', () => {
  renderWishlistDrawer();
  document.getElementById('wishlistItems').classList.toggle('show');
  document.getElementById('wishlistSectionToggle').classList.toggle('open');
});
document.getElementById('overlay').addEventListener('click', (e) => {
  if(e.target.id === 'overlay' && Date.now() - modalOpenedAt > 300) closeOverlay();
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
safeRun(() => {
  const params = new URLSearchParams(window.location.search);
  if(params.get('checkout') === 'success'){
    cart = [];
    saveCart();
    renderCartCount();
    const banner = document.createElement('div');
    banner.className = 'checkout-success-banner mono';
    banner.textContent = 'thanks — your order is on its way. check your email for the receipt.';
    document.body.prepend(banner);
    setTimeout(() => banner.remove(), 6000);
    window.history.replaceState({}, '', window.location.pathname);
  } else if(params.get('checkout') === 'canceled'){
    window.history.replaceState({}, '', window.location.pathname);
  }
}, 'checkoutRedirect');
safeRun(() => {
  const overlay = document.getElementById('ageGateOverlay');
  const AGE_GATE_KEY = 'smacked_age_verified';

  if(!localStorage.getItem(AGE_GATE_KEY)){
    overlay.classList.add('show');
  }

  document.getElementById('ageGateYes').addEventListener('click', () => {
    localStorage.setItem(AGE_GATE_KEY, 'true');
    overlay.classList.remove('show');
  });

  document.getElementById('ageGateNo').addEventListener('click', () => {
    window.location.href = 'https://www.google.com';
  });
}, 'ageGate');

safeRun(renderTicker, 'renderTicker');
(async () => {
  await loadInventoryData().catch(err => console.error('Init step failed: loadInventoryData', err));
  safeRun(renderGrid, 'renderGrid');
  safeRun(renderOrganics, 'renderOrganics');
})();
safeRun(() => {
  document.getElementById('sortSelect').addEventListener('change', (e) => {
    sortMode = e.target.value;
    renderGrid();
  });
}, 'sortSelect');

safeRun(() => {
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');

  function allItems(){
    return [
      ...PRODUCTS.map(i => ({id:i.id, name:i.name, price:i.price})),
      ...ORGANICS.map(i => ({id:i.id, name:i.name, price:i.price})),
    ];
  }

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if(!q){
      results.classList.remove('show');
      results.innerHTML = '';
      return;
    }
    const matches = allItems().filter(i => i.name.toLowerCase().includes(q));
    if(matches.length === 0){
      results.innerHTML = '<div class="search-empty">no matches for "' + q + '"</div>';
    } else {
      results.innerHTML = matches.map(i =>
        `<div class="search-result" data-id="${i.id}"><span>${i.name}</span><span class="sr-price mono">${money(i.price)}</span></div>`
      ).join('');
    }
    results.classList.add('show');
  });

  results.addEventListener('click', (e) => {
    const row = e.target.closest('.search-result');
    if(!row) return;
    const id = row.dataset.id;
    openModal(Number(id));
    navDropdown.classList.remove('open');
    plusToggle.classList.remove('open');
    input.value = '';
    results.classList.remove('show');
    results.innerHTML = '';
  });
}, 'search');

safeRun(() => {
  const homeContent = document.getElementById('homeContent');
  const subpages = document.querySelectorAll('.subpage');
  const subpageIds = ['contact', 'faq', 'returns', 'terms', 'accessibility', 'privacy'];

  function showSubpage(id){
    homeContent.style.display = 'none';
    subpages.forEach(sp => sp.classList.remove('active'));
    const target = document.getElementById(id);
    if(target) target.classList.add('active');
    window.scrollTo({top: 0, behavior: 'auto'});
  }

  function showHome(){
    subpages.forEach(sp => sp.classList.remove('active'));
    homeContent.style.display = '';
    window.scrollTo({top: 0, behavior: 'auto'});
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    const targetId = a.getAttribute('href').slice(1);
    if(subpageIds.includes(targetId)){
      a.addEventListener('click', (e) => {
        e.preventDefault();
        showSubpage(targetId);
        navDropdown.classList.remove('open');
        plusToggle.classList.remove('open');
        navLinks.classList.remove('mobile-open');
      });
    } else if(targetId && homeContent.querySelector('#' + targetId)){
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const wasHidden = homeContent.style.display === 'none';
        if(wasHidden){
          subpages.forEach(sp => sp.classList.remove('active'));
          homeContent.style.display = '';
        }
        const target = document.getElementById(targetId);
        target.scrollIntoView({behavior: wasHidden ? 'auto' : 'smooth'});
        navDropdown.classList.remove('open');
        plusToggle.classList.remove('open');
        navLinks.classList.remove('mobile-open');
      });
    }
  });

  document.querySelectorAll('[data-back]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      showHome();
    });
  });

  document.querySelector('.logo-badge').addEventListener('click', showHome);
  document.querySelector('.logo-badge').style.cursor = 'pointer';
}, 'subpageNav');

safeRun(() => {
  const overlay = document.getElementById('exitPopupOverlay');
  const EXIT_POPUP_KEY = 'smacked_exit_popup_shown';

  function showExitPopup(){
    if(localStorage.getItem(EXIT_POPUP_KEY)) return;
    overlay.classList.add('show');
    localStorage.setItem(EXIT_POPUP_KEY, 'true');
  }

  document.addEventListener('mouseleave', (e) => {
    if(e.clientY <= 0) showExitPopup();
  });

  document.getElementById('exitPopupClose').addEventListener('click', () => {
    overlay.classList.remove('show');
  });
  overlay.addEventListener('click', (e) => {
    if(e.target === overlay) overlay.classList.remove('show');
  });

  document.getElementById('exitPopupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = e.target.querySelector('input[type="email"]');
    const submitBtn = e.target.querySelector('button');
    submitBtn.disabled = true;
    try {
      const response = await fetch('https://fexsevhuufbohcewebzw.supabase.co/functions/v1/newsletter-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ email: emailInput.value.trim() }),
      });
      if(!response.ok) throw new Error('signup failed');
      document.querySelector('.exit-popup').innerHTML = `
        <div class="exit-popup-stamp">SMACKED</div>
        <h2 class="exit-popup-headline">you're in</h2>
        <p class="exit-popup-sub">check your email — your code is on its way.</p>
      `;
    } catch(err) {
      submitBtn.disabled = false;
      document.querySelector('.exit-popup-sub')?.remove();
      e.target.insertAdjacentHTML('afterend', '<p class="exit-popup-sub">something went wrong — try again.</p>');
    }
  });

  document.getElementById('footerSignupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = e.target.querySelector('input[type="email"]');
    const submitBtn = e.target.querySelector('button');
    submitBtn.disabled = true;
    try {
      const response = await fetch('https://fexsevhuufbohcewebzw.supabase.co/functions/v1/newsletter-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ email: emailInput.value.trim() }),
      });
      if(!response.ok) throw new Error('signup failed');
      e.target.innerHTML = '<span class="footer-signup-label mono" style="color:var(--pink)">thanks — check your email for your code.</span>';
    } catch(err) {
      submitBtn.disabled = false;
      e.target.querySelector('.footer-signup-label').textContent = 'something went wrong — try again.';
    }
  });
}, 'exitPopupAndFooterSignup');

safeRun(() => {
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const payload = {
      name: form.querySelector('[name="name"]').value.trim(),
      email: form.querySelector('[name="email"]').value.trim(),
      message: form.querySelector('[name="message"]').value.trim(),
    };
    submitBtn.disabled = true;
    submitBtn.textContent = 'sending...';
    try {
      const response = await fetch('https://fexsevhuufbohcewebzw.supabase.co/functions/v1/send-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify(payload),
      });
      if(!response.ok) throw new Error('send failed');
      form.innerHTML = '<div class="form-note" style="font-size:14px;color:var(--bone);padding:20px 0;">thanks — we\'ll get back to you soon.</div>';
    } catch(err) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'send message';
      form.querySelector('.form-note').textContent = 'something went wrong — try again.';
    }
  });
}, 'contactForm');

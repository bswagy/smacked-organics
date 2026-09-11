const GARMENT_HOODIE = `<svg viewBox="0 0 100 100"><path d="M50 8 C36 8 28 16 26 24 L8 34 L18 48 L28 40 L28 90 L72 90 L72 40 L82 48 L92 34 L74 24 C72 16 64 8 50 8 Z" fill="currentColor"/><path d="M38 24 C38 32 43 36 50 36 C57 36 62 32 62 24" fill="none" stroke="rgba(0,0,0,0.35)" stroke-width="2.2" stroke-linecap="round"/></svg>`;
const GARMENT_TEE = `<svg viewBox="0 0 100 100"><path d="M30 18 L10 30 L20 42 L30 34 L30 88 L70 88 L70 34 L80 42 L90 30 L70 18 C70 26 62 30 50 30 C38 30 30 26 30 18 Z" fill="currentColor"/></svg>`;
const GARMENT_JACKET = `<svg viewBox="0 0 100 100"><path d="M32 16 L14 26 L22 42 L32 34 L32 90 L68 90 L68 34 L78 42 L86 26 L68 16 L58 24 L50 30 L42 24 Z" fill="currentColor"/><path d="M50 30 L50 90" stroke="rgba(0,0,0,0.35)" stroke-width="2"/></svg>`;
const GARMENT_SHADES = `<svg viewBox="0 0 100 100"><rect x="13" y="40" width="30" height="21" rx="6" fill="currentColor"/><rect x="57" y="40" width="30" height="21" rx="6" fill="currentColor"/><path d="M43 48 h14" stroke="rgba(0,0,0,0.4)" stroke-width="2" fill="none"/><path d="M13 46 L4 39" stroke="rgba(0,0,0,0.4)" stroke-width="2" fill="none"/><path d="M87 46 L96 39" stroke="rgba(0,0,0,0.4)" stroke-width="2" fill="none"/></svg>`;
const GARMENT_BEANIE = `<svg viewBox="0 0 100 100"><path d="M20 56 C20 26 80 26 80 56 L80 64 L20 64 Z" fill="currentColor"/><path d="M17 64 L83 64 L83 78 L17 78 Z" fill="currentColor" opacity="0.85"/><circle cx="50" cy="30" r="3.5" fill="rgba(0,0,0,0.4)"/></svg>`;

const KIT = [
  {id:'hoodie', name:'hoodie', price:88, svg:GARMENT_HOODIE, colors:['#F3EFEA','#6B3FA0','#FF2D78','#241B30']},
  {id:'tee', name:'tee', price:38, svg:GARMENT_TEE, colors:['#F3EFEA','#241B30','#FF2D78','#6B3FA0']},
  {id:'shades', name:'shades', price:24, svg:GARMENT_SHADES, colors:['#241B30','#6B3FA0','#FF2D78','#F3EFEA']},
  {id:'beanie', name:'beanie', price:28, svg:GARMENT_BEANIE, colors:['#F3EFEA','#241B30','#FF2D78','#6B3FA0']},
];

const CAT_SVG = { tees: GARMENT_TEE, hoodies: GARMENT_HOODIE, outerwear: GARMENT_JACKET };

const PRODUCTS = [
  {id:1, name:'smacked tee', price:38, colors:['#FF2D78','#F3EFEA','#241B30','#6B3FA0'], cat:'tees'},
  {id:2, name:'organics hoodie', price:88, colors:['#6B3FA0','#F3EFEA','#241B30','#FF2D78'], cat:'hoodies'},
  {id:3, name:'blackout crew', price:60, colors:['#F3EFEA','#241B30','#6B3FA0','#FF2D78'], cat:'hoodies'},
  {id:4, name:'og tank', price:32, colors:['#FF2D78','#241B30','#F3EFEA','#6B3FA0'], cat:'tees'},
  {id:5, name:'neon coach jacket', price:115, colors:['#6B3FA0','#FF2D78','#F3EFEA','#241B30'], cat:'outerwear'},
  {id:6, name:'pocket tee', price:34, colors:['#F3EFEA','#FF2D78','#6B3FA0','#241B30'], cat:'tees'},
];

const ORGANICS_PAPERS = `<svg viewBox="0 0 100 100"><rect x="24" y="12" width="52" height="76" rx="3" fill="currentColor"/><rect x="24" y="12" width="52" height="18" rx="3" fill="rgba(0,0,0,0.25)"/><line x1="32" y1="46" x2="68" y2="46" stroke="rgba(0,0,0,0.3)" stroke-width="2"/><line x1="32" y1="56" x2="68" y2="56" stroke="rgba(0,0,0,0.3)" stroke-width="2"/><line x1="32" y1="66" x2="68" y2="66" stroke="rgba(0,0,0,0.3)" stroke-width="2"/></svg>`;
const ORGANICS_GRINDER = `<svg viewBox="0 0 100 100"><rect x="30" y="14" width="40" height="20" rx="6" fill="currentColor"/><rect x="26" y="38" width="48" height="24" rx="6" fill="currentColor"/><rect x="30" y="66" width="40" height="20" rx="6" fill="currentColor"/><circle cx="50" cy="50" r="9" fill="rgba(0,0,0,0.35)"/></svg>`;
const ORGANICS_TRAY = `<svg viewBox="0 0 100 100"><rect x="10" y="30" width="80" height="42" rx="8" fill="currentColor"/><rect x="18" y="38" width="64" height="26" rx="4" fill="rgba(0,0,0,0.25)"/></svg>`;
const ORGANICS_JAR = `<svg viewBox="0 0 100 100"><rect x="26" y="10" width="48" height="12" rx="3" fill="currentColor"/><path d="M30 22 L70 22 L76 88 C76 92 72 94 68 94 L32 94 C28 94 24 92 24 88 Z" fill="currentColor"/><rect x="32" y="40" width="36" height="30" rx="2" fill="rgba(0,0,0,0.22)"/></svg>`;
const ORGANICS_LIGHTER = `<svg viewBox="0 0 100 100"><rect x="34" y="30" width="32" height="58" rx="6" fill="currentColor"/><rect x="42" y="14" width="16" height="20" rx="3" fill="currentColor"/><rect x="40" y="44" width="20" height="14" rx="2" fill="rgba(0,0,0,0.25)"/></svg>`;
const ORGANICS_ASHTRAY = `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="55" rx="38" ry="20" fill="currentColor"/><ellipse cx="50" cy="50" rx="26" ry="13" fill="rgba(0,0,0,0.3)"/><rect x="16" y="48" width="14" height="5" rx="2" fill="currentColor"/><rect x="70" y="48" width="14" height="5" rx="2" fill="currentColor"/></svg>`;

const ORGANICS = [
  {id:101, name:'rolling papers', price:8, colors:['#F3EFEA','#241B30','#6B3FA0','#FF2D78'], svg:ORGANICS_PAPERS, cat:'accessories'},
  {id:102, name:'grinder', price:24, colors:['#6B3FA0','#241B30','#F3EFEA','#FF2D78'], svg:ORGANICS_GRINDER, cat:'accessories'},
  {id:103, name:'rolling tray', price:32, colors:['#241B30','#6B3FA0','#FF2D78','#F3EFEA'], svg:ORGANICS_TRAY, cat:'accessories'},
  {id:104, name:'stash jar', price:18, colors:['#F3EFEA','#6B3FA0','#241B30','#FF2D78'], svg:ORGANICS_JAR, cat:'accessories'},
  {id:105, name:'torch lighter', price:14, colors:['#FF2D78','#241B30','#6B3FA0','#F3EFEA'], svg:ORGANICS_LIGHTER, cat:'accessories'},
  {id:106, name:'ashtray', price:16, colors:['#241B30','#F3EFEA','#FF2D78','#6B3FA0'], svg:ORGANICS_ASHTRAY, cat:'accessories'},
];
const ORGANICS_CATS = ['all', 'accessories'];

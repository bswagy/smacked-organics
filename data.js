const GARMENT_HOODIE = `<svg viewBox="0 0 100 100"><path d="M50 8 C36 8 28 16 26 24 L8 34 L18 48 L28 40 L28 90 L72 90 L72 40 L82 48 L92 34 L74 24 C72 16 64 8 50 8 Z" fill="currentColor"/><path d="M38 24 C38 32 43 36 50 36 C57 36 62 32 62 24" fill="none" stroke="rgba(0,0,0,0.35)" stroke-width="2.2" stroke-linecap="round"/></svg>`;
const GARMENT_TEE = `<svg viewBox="0 0 100 100"><path d="M30 18 L10 30 L20 42 L30 34 L30 88 L70 88 L70 34 L80 42 L90 30 L70 18 C70 26 62 30 50 30 C38 30 30 26 30 18 Z" fill="currentColor"/></svg>`;
const GARMENT_JACKET = `<svg viewBox="0 0 100 100"><path d="M32 16 L14 26 L22 42 L32 34 L32 90 L68 90 L68 34 L78 42 L86 26 L68 16 L58 24 L50 30 L42 24 Z" fill="currentColor"/><path d="M50 30 L50 90" stroke="rgba(0,0,0,0.35)" stroke-width="2"/></svg>`;
const GARMENT_SHADES = `<svg viewBox="0 0 100 100"><rect x="13" y="40" width="30" height="21" rx="6" fill="currentColor"/><rect x="57" y="40" width="30" height="21" rx="6" fill="currentColor"/><path d="M43 48 h14" stroke="rgba(0,0,0,0.4)" stroke-width="2" fill="none"/><path d="M13 46 L4 39" stroke="rgba(0,0,0,0.4)" stroke-width="2" fill="none"/><path d="M87 46 L96 39" stroke="rgba(0,0,0,0.4)" stroke-width="2" fill="none"/></svg>`;
const GARMENT_BEANIE = `<svg viewBox="0 0 100 100"><path d="M20 56 C20 26 80 26 80 56 L80 64 L20 64 Z" fill="currentColor"/><path d="M17 64 L83 64 L83 78 L17 78 Z" fill="currentColor" opacity="0.85"/><circle cx="50" cy="30" r="3.5" fill="rgba(0,0,0,0.4)"/></svg>`;

const KIT = [
  // colorImages: maps a swatch hex to its own real photo(s), for items with
  // actual product photography instead of the line-art icon. When present,
  // clicking a swatch swaps to that color's photo — so `colors` should only
  // list colors that have a matching entry here.
  {id:'hoodie', name:'hoodie', price:88, svg:GARMENT_HOODIE, colors:['#241B30','#3D1A23'], colorImages:{'#241B30':['images/hoodie-black-front.png'], '#3D1A23':['images/hoodie-maroon-front.png']}, description:'heavyweight fleece hoodie with a boxy fit and dropped shoulder. brushed interior for warmth, kangaroo pocket, ribbed cuffs and hem.'},
  {id:'tee', name:'tee', price:38, svg:GARMENT_TEE, colors:['#F3EFEA','#241B30','#FF2D78','#6B3FA0'], description:'heavyweight 100% cotton tee with the signature front stamp. relaxed fit, garment-washed for a broken-in feel from day one.'},
  {id:'shades', name:'shades', price:24, svg:GARMENT_SHADES, colors:['#241B30','#6B3FA0','#FF2D78','#F3EFEA'], description:'matte-finish frames with UV-protective lenses. spring hinges for a comfortable, secure fit all day.'},
  {id:'beanie', name:'beanie', price:28, svg:GARMENT_BEANIE, colors:['#F3EFEA','#241B30','#FF2D78','#6B3FA0'], description:'ribbed knit beanie, mid-weight and stretchy for a snug, all-day fit. finished with a subtle woven tag.'},
];

const CAT_SVG = { tees: GARMENT_TEE, hoodies: GARMENT_HOODIE, outerwear: GARMENT_JACKET };

const PRODUCTS = [
  // images: array of photo paths for different angles (e.g. ['images/tee-front.jpg', 'images/tee-back.jpg']).
  // video: path to a short clip. Leave images empty and video empty ('') to keep showing the line-art icon until real media is ready.
  // Left/right arrows on the card automatically appear once an item has more than one image.
  {id:1, name:'smacked tee', price:38, colors:['#FF2D78','#F3EFEA','#241B30','#6B3FA0'], cat:'tees', images:[], video:'', description:'heavyweight 100% cotton tee with the signature front stamp. relaxed fit, garment-washed for a broken-in feel from day one.'},
  {id:2, name:'organics hoodie', price:88, colors:['#6B3FA0','#F3EFEA','#241B30','#FF2D78'], cat:'hoodies', images:[], video:'', description:'heavyweight fleece hoodie with a boxy fit and dropped shoulder. brushed interior for warmth, kangaroo pocket, ribbed cuffs and hem.'},
  {id:3, name:'blackout crew', price:60, colors:['#F3EFEA','#241B30','#6B3FA0','#FF2D78'], cat:'hoodies', images:[], video:'', description:'midweight crewneck with a clean, minimal front mark. built for everyday layering, garment-washed for softness.'},
  {id:4, name:'og tank', price:32, colors:['#FF2D78','#241B30','#F3EFEA','#6B3FA0'], cat:'tees', images:[], video:'', description:'lightweight ribbed tank, relaxed drop-armhole fit. breathable cotton blend, built for warm-weather rotation.'},
  {id:5, name:'neon coach jacket', price:115, colors:['#6B3FA0','#FF2D78','#F3EFEA','#241B30'], cat:'outerwear', isNew:true, images:[], video:'', description:'lightweight water-resistant shell with a full front zip and snap collar. interior mesh lining, side pockets, elastic cuffs.'},
  {id:6, name:'pocket tee', price:34, colors:['#F3EFEA','#FF2D78','#6B3FA0','#241B30'], cat:'tees', isNew:true, images:[], video:'', description:'classic-fit tee with a chest pocket detail. soft-washed cotton, tag-free neck label for all-day comfort.'},
  {id:7, name:'smacked sweatpants', price:68, colors:['#241B30','#3D1A23'], colorImages:{'#241B30':['images/sweatpants-black-front.png'], '#3D1A23':['images/sweatpants-maroon-front.png']}, cat:'bottoms', images:[], video:'', description:'relaxed, wide-leg sweatpants with a raw-cut hem and drawstring waist. heavyweight fleece, matches the hoodie.'},
];

const ORGANICS_PAPERS = `<svg viewBox="0 0 100 100"><rect x="24" y="12" width="52" height="76" rx="3" fill="currentColor"/><rect x="24" y="12" width="52" height="18" rx="3" fill="rgba(0,0,0,0.25)"/><line x1="32" y1="46" x2="68" y2="46" stroke="rgba(0,0,0,0.3)" stroke-width="2"/><line x1="32" y1="56" x2="68" y2="56" stroke="rgba(0,0,0,0.3)" stroke-width="2"/><line x1="32" y1="66" x2="68" y2="66" stroke="rgba(0,0,0,0.3)" stroke-width="2"/></svg>`;
const ORGANICS_GRINDER = `<svg viewBox="0 0 100 100"><rect x="30" y="14" width="40" height="20" rx="6" fill="currentColor"/><rect x="26" y="38" width="48" height="24" rx="6" fill="currentColor"/><rect x="30" y="66" width="40" height="20" rx="6" fill="currentColor"/><circle cx="50" cy="50" r="9" fill="rgba(0,0,0,0.35)"/></svg>`;
const ORGANICS_TRAY = `<svg viewBox="0 0 100 100"><rect x="10" y="30" width="80" height="42" rx="8" fill="currentColor"/><rect x="18" y="38" width="64" height="26" rx="4" fill="rgba(0,0,0,0.25)"/></svg>`;
const ORGANICS_JAR = `<svg viewBox="0 0 100 100"><rect x="26" y="10" width="48" height="12" rx="3" fill="currentColor"/><path d="M30 22 L70 22 L76 88 C76 92 72 94 68 94 L32 94 C28 94 24 92 24 88 Z" fill="currentColor"/><rect x="32" y="40" width="36" height="30" rx="2" fill="rgba(0,0,0,0.22)"/></svg>`;
const ORGANICS_LIGHTER = `<svg viewBox="0 0 100 100"><rect x="34" y="30" width="32" height="58" rx="6" fill="currentColor"/><rect x="42" y="14" width="16" height="20" rx="3" fill="currentColor"/><rect x="40" y="44" width="20" height="14" rx="2" fill="rgba(0,0,0,0.25)"/></svg>`;
const ORGANICS_ASHTRAY = `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="55" rx="38" ry="20" fill="currentColor"/><ellipse cx="50" cy="50" rx="26" ry="13" fill="rgba(0,0,0,0.3)"/><rect x="16" y="48" width="14" height="5" rx="2" fill="currentColor"/><rect x="70" y="48" width="14" height="5" rx="2" fill="currentColor"/></svg>`;
const ORGANICS_MYLAR = `<svg viewBox="0 0 100 100"><path d="M22 20 L30 8 L70 8 L78 20 Z" fill="currentColor" opacity="0.85"/><path d="M22 20 L78 20 L78 82 C78 88 72 92 66 92 L34 92 C28 92 22 88 22 82 Z" fill="currentColor"/><rect x="22" y="30" width="56" height="6" fill="rgba(0,0,0,0.3)"/></svg>`;

const ORGANICS = [
  // isLimited: true puts this item in the "limited drop" row at the top of the
  // homepage, alongside new clothing arrivals. Toggle it on whichever items
  // should be featured there.
  // images / video work the same way as PRODUCTS above — add real photo paths
  // once you have them, and the line-art icon will be replaced automatically.
  // sizes: optional. Add this array to give an item its own size options (e.g.
  // weight amounts) instead of the default clothing sizes (S/M/L/XL). When
  // present, the modal also hides the clothing size-guide chart, since it
  // doesn't apply.
  {id:101, name:'rolling papers', price:8, colors:['#F3EFEA','#241B30','#6B3FA0','#FF2D78'], svg:ORGANICS_PAPERS, cat:'accessories', images:[], video:'', description:'slow-burning, natural unbleached papers. 32 leaves per pack, sized for an even, consistent roll.'},
  {id:102, name:'grinder', price:24, colors:['#6B3FA0','#241B30','#F3EFEA','#FF2D78'], svg:ORGANICS_GRINDER, cat:'accessories', isLimited:true, images:[], video:'', description:'4-piece aircraft-grade aluminum grinder with a pollen screen and built-in catcher. sharp diamond teeth for a fine, even grind.'},
  {id:103, name:'rolling tray', price:32, colors:['#241B30','#6B3FA0','#FF2D78','#F3EFEA'], svg:ORGANICS_TRAY, cat:'accessories', images:[], video:'', description:'raised-edge metal tray with a smooth non-stick finish. compact size, easy to wipe clean.'},
  {id:104, name:'stash jar', price:18, colors:['#F3EFEA','#6B3FA0','#241B30','#FF2D78'], svg:ORGANICS_JAR, cat:'accessories', images:[], video:'', sizes:['1/8 oz','1/4 oz','1/2 oz','1 oz'], description:'airtight glass jar with a smell-proof seal. UV-resistant tint to help keep contents fresh longer.'},
  {id:105, name:'torch lighter', price:14, colors:['#FF2D78','#241B30','#6B3FA0','#F3EFEA'], svg:ORGANICS_LIGHTER, cat:'accessories', isLimited:true, images:[], video:'', description:'refillable windproof torch lighter with an adjustable flame. compact, pocket-friendly build.'},
  {id:106, name:'ashtray', price:16, colors:['#241B30','#F3EFEA','#FF2D78','#6B3FA0'], svg:ORGANICS_ASHTRAY, cat:'accessories', images:[], video:'', description:'weighted ceramic ashtray with built-in rest grooves. easy to clean, built to last.'},
  {id:107, name:'mylar bags', price:12, colors:['#241B30','#F3EFEA','#6B3FA0','#FF2D78'], svg:ORGANICS_MYLAR, cat:'accessories', images:[], video:'', sizes:['1/8 oz','1/4 oz','1/2 oz','1 oz'], description:'resealable, smell-proof mylar bags with a child-resistant zip seal. UV-blocking to help protect contents from light exposure.'},
];
const ORGANICS_CATS = ['all', 'accessories'];

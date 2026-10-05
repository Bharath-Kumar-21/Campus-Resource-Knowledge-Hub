const fs = require('fs');

const cssTargets = [
  'D:/CRKH/backend/src/main/resources/static/css/style.css',
  'D:/CRKH/backend/target/classes/static/css/style.css'
];

const newStyles = `
/* ==========================================================================
   ALIGNED PRODUCT CARDS & IMAGE CONTAINER FIXES (APPLE LIQUID GLASS)
   ========================================================================== */

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(285px, 1fr));
  gap: 1.5rem;
  align-items: stretch;
}

.product-card {
  background: var(--liquid-glass-bg);
  backdrop-filter: var(--blur-glass);
  -webkit-backdrop-filter: var(--blur-glass);
  border: 1px solid var(--liquid-glass-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: var(--shadow-liquid-card);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease;
  position: relative;
}

.product-card:hover {
  transform: translateY(-6px);
  background: var(--liquid-glass-hover);
  border-color: rgba(255, 255, 255, 1);
  box-shadow: var(--shadow-liquid-hover);
}

.product-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0) 100%);
  z-index: 4;
}

/* UNIFORM 220PX IMAGE CONTAINER FOR ALL PRODUCTS (FIXES LONG/TALL IMAGES) */
.product-card-media,
.product-img-wrapper {
  position: relative;
  width: 100%;
  height: 220px;
  min-height: 220px;
  max-height: 220px;
  background: linear-gradient(180deg, #ffffff 0%, #f4f6fa 100%);
  overflow: hidden;
  border-bottom: 1px solid var(--liquid-glass-border-light);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  box-sizing: border-box;
}

.product-card-img,
.product-img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  object-position: center;
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  display: block;
}

.product-card:hover .product-card-img,
.product-card:hover .product-img {
  transform: scale(1.06);
}

/* QUICK VIEW HOVER BUTTON */
.quick-view-btn {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.95);
  color: var(--text-main);
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.45rem 1.15rem;
  border-radius: var(--radius-pill);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  opacity: 0;
  pointer-events: none;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 5;
  cursor: pointer;
  white-space: nowrap;
}

.product-card:hover .quick-view-btn {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(-50%) translateY(0);
}

.quick-view-btn:hover {
  background: #ffffff;
  color: var(--accent-blue);
  box-shadow: 0 8px 24px rgba(108, 142, 245, 0.25);
}

/* TOP BADGES BAR - CLEAN & CONFLICT-FREE ALIGNMENT */
.product-badges-bar {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  z-index: 3;
  pointer-events: none;
}

.badge-exchange {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.32rem 0.75rem;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  white-space: nowrap;
}

.badge-exchange.free-borrow {
  background: rgba(235, 252, 246, 0.94);
  color: #0b6143;
  border-color: rgba(121, 201, 176, 0.65);
}

.badge-exchange.item-swap {
  background: rgba(244, 241, 255, 0.94);
  color: #553c9a;
  border-color: rgba(155, 138, 251, 0.65);
}

.badge-exchange.skill-swap {
  background: rgba(254, 243, 240, 0.94);
  color: #9c4221;
  border-color: rgba(244, 182, 166, 0.65);
}

.badge-exchange.pledge {
  background: rgba(238, 242, 255, 0.94);
  color: #2b4c7e;
  border-color: rgba(108, 142, 245, 0.65);
}

.badge-condition {
  display: inline-flex;
  align-items: center;
  padding: 0.28rem 0.65rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  color: var(--text-main);
  border: 1px solid rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  white-space: nowrap;
}

/* PRODUCT CARD BODY & HORIZONTAL ALIGNMENT */
.product-body,
.product-card-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  box-sizing: border-box;
}

.product-meta-row,
.product-card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
}

.product-category,
.product-category-text {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--accent-blue);
}

.product-title,
.product-card-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 0.25rem 0 0.5rem 0;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.7em; /* Equal 2-line title height for all cards */
}

.product-title a,
.product-card-title a {
  color: inherit;
  text-decoration: none;
}

.product-title a:hover,
.product-card-title a:hover {
  color: var(--accent-blue);
}

/* UNIFORM EXCHANGE BOX (FIXES MISALIGNMENT OF CARD BUTTONS) */
.product-exchange-box {
  background: rgba(247, 248, 252, 0.88);
  border: 1px solid rgba(108, 142, 245, 0.2);
  border-radius: 12px;
  padding: 0.65rem 0.85rem;
  margin: 0.5rem 0 0.75rem 0;
  font-size: 0.82rem;
  min-height: 64px; /* Fixes equal height across all cards */
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
}

.product-exchange-box .exchange-label {
  font-weight: 700;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 0.2rem;
  font-size: 0.8rem;
}

.product-exchange-box .exchange-value {
  color: var(--text-muted);
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* FOOTER PINNED TO BOTTOM - ALL BUTTONS PERFECTLY HORIZONTALLY ALIGNED */
.product-footer,
.product-card-footer {
  margin-top: auto; /* Aligns all buttons and owners in a straight horizontal line */
  padding-top: 0.85rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
`;

for (const p of cssTargets) {
  if (fs.existsSync(p)) {
    fs.appendFileSync(p, '\n' + newStyles, 'utf8');
    console.log('Appended product alignment rules to: ' + p);
  }
}

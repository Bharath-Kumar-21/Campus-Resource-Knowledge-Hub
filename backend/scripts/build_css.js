const fs = require('fs');
const path = require('path');

const cssContent = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  /* Apple Liquid Glass Light Palette */
  --primary: #6C8EF5;
  --primary-hover: #587CE8;
  --primary-light: rgba(108, 142, 245, 0.10);
  --primary-subtle: rgba(108, 142, 245, 0.20);

  --secondary: #9B8AFB;
  --secondary-hover: #8672F8;
  --secondary-light: rgba(155, 138, 251, 0.10);
  --secondary-subtle: rgba(155, 138, 251, 0.22);

  --mint: #79C9B0;
  --mint-hover: #62BEA2;
  --mint-light: rgba(121, 201, 176, 0.12);
  --mint-subtle: rgba(121, 201, 176, 0.25);

  --peach: #F4B6A6;
  --peach-hover: #E79E8B;
  --peach-light: rgba(244, 182, 166, 0.14);
  --peach-subtle: rgba(244, 182, 166, 0.28);

  --bg-page: #F6F8FC;
  --text-main: #1D232F;
  --text-muted: #647084;
  --text-subtle: #98A2B3;

  /* Liquid Glass Surface Tokens */
  --liquid-glass-bg: rgba(255, 255, 255, 0.72);
  --liquid-glass-hover: rgba(255, 255, 255, 0.88);
  --liquid-glass-border: rgba(255, 255, 255, 0.82);
  --liquid-glass-border-light: rgba(232, 234, 240, 0.6);
  --liquid-glass-highlight: inset 0 1px 1px 0 rgba(255, 255, 255, 0.95);
  --liquid-glass-caustic: inset 0 -1px 2px 0 rgba(108, 142, 245, 0.06);

  --radius-sm: 10px;
  --radius-md: 14px;
  --radius-lg: 18px;
  --radius-xl: 26px;
  --radius-pill: 9999px;

  /* Refractive Specular Shadows */
  --shadow-liquid-sm: 0 4px 14px rgba(108, 142, 245, 0.05), inset 0 1px 1px rgba(255, 255, 255, 0.9);
  --shadow-liquid-card: 0 8px 30px rgba(108, 142, 245, 0.07), inset 0 1px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(108, 142, 245, 0.04);
  --shadow-liquid-hover: 0 18px 45px rgba(108, 142, 245, 0.14), inset 0 1px 2px rgba(255, 255, 255, 1), inset 0 -1px 3px rgba(155, 138, 251, 0.08);
  --shadow-liquid-modal: 0 24px 60px rgba(32, 36, 45, 0.14), inset 0 1px 2px rgba(255, 255, 255, 1);

  --blur-glass: blur(28px) saturate(190%) contrast(102%);
  --blur-nav: blur(24px) saturate(200%);
  --blur-modal: blur(32px) saturate(200%);

  --transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
  --transition-fast: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ==================================================
   FLUID CAUSTIC LIGHT BACKGROUND (LIQUID GLASS)
================================================== */
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  background-color: var(--bg-page);
  color: var(--text-main);
  min-height: 100vh;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  overflow-x: hidden;
}

/* Dynamic Ambient Liquid Light Blobs (Refracts through cards) */
body::before, body::after {
  content: "";
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  z-index: -1;
  filter: blur(90px);
  opacity: 0.65;
  animation: liquidCaustics 18s ease-in-out infinite alternate;
}

body::before {
  width: 580px;
  height: 580px;
  top: -120px;
  left: 10%;
  background: radial-gradient(circle, rgba(108, 142, 245, 0.22) 0%, rgba(155, 138, 251, 0.18) 60%, transparent 80%);
}

body::after {
  width: 650px;
  height: 650px;
  top: 35%;
  right: -80px;
  background: radial-gradient(circle, rgba(121, 201, 176, 0.22) 0%, rgba(244, 182, 166, 0.16) 60%, transparent 80%);
  animation-delay: -9s;
}

@keyframes liquidCaustics {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(60px, 45px) scale(1.08); }
  100% { transform: translate(-45px, 70px) scale(0.96); }
}

a {
  color: inherit;
  text-decoration: none;
  transition: var(--transition-fast);
}

.container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* ==================================================
   HEADER & LIQUID GLASS NAVIGATION BAR
================================================== */
.header-wrapper {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: var(--blur-nav);
  -webkit-backdrop-filter: var(--blur-nav);
  border-bottom: 1px solid var(--liquid-glass-border);
  box-shadow: 0 4px 20px rgba(108, 142, 245, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.9);
}

.main-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 0.85rem 1.75rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* BRAND LOGO WITH LIQUID EMBLAZON */
.brand {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 800;
  font-size: 1.25rem;
  color: var(--text-main);
  letter-spacing: -0.025em;
  flex-shrink: 0;
}

.brand-icon-box {
  width: 42px;
  height: 42px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, rgba(108, 142, 245, 0.95) 0%, rgba(155, 138, 251, 0.95) 100%);
  display: grid;
  place-items: center;
  color: #fff;
  box-shadow: 0 6px 16px rgba(108, 142, 245, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.6);
  position: relative;
  overflow: hidden;
}

.brand-icon-box::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 100%);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
}

.brand-text-block {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text-main);
  line-height: 1.1;
}

.brand-title span {
  color: var(--primary);
}

.brand-sub {
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* LIQUID SEARCH BAR */
.nav-search-bar {
  flex: 1;
  max-width: 580px;
  position: relative;
}

.nav-search-inner {
  display: flex;
  align-items: center;
  width: 100%;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-pill);
  padding: 0.5rem 1.1rem;
  box-shadow: 0 2px 10px rgba(108, 142, 245, 0.04), inset 0 1px 1px #ffffff;
  transition: var(--transition-fast);
}

.nav-search-inner:focus-within {
  background: rgba(255, 255, 255, 0.92);
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(108, 142, 245, 0.16), 0 4px 14px rgba(108, 142, 245, 0.08);
}

.nav-search-icon {
  width: 18px;
  height: 18px;
  color: var(--text-muted);
  margin-right: 0.65rem;
  flex-shrink: 0;
}

.nav-search-input {
  width: 100%;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 0.9rem;
  color: var(--text-main);
  outline: none;
}

.nav-search-input::placeholder {
  color: var(--text-subtle);
}

.nav-search-badge {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(232, 234, 240, 0.8);
  border-radius: 6px;
  padding: 0.15rem 0.45rem;
  margin-left: 0.5rem;
  flex-shrink: 0;
  box-shadow: inset 0 1px 1px #fff;
}

/* NAV ACTION BUTTONS */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  flex-shrink: 0;
}

.nav-action-link {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-muted);
  padding: 0.5rem 0.85rem;
  border-radius: var(--radius-md);
  position: relative;
  border: 1px solid transparent;
  transition: var(--transition-fast);
}

.nav-action-link:hover, .nav-action-link.active {
  color: var(--primary);
  background: rgba(255, 255, 255, 0.75);
  border-color: rgba(255, 255, 255, 0.9);
  box-shadow: var(--shadow-liquid-sm);
}

.nav-action-icon {
  width: 18px;
  height: 18px;
}

.nav-badge-pill {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #EF4444;
  color: #fff;
  font-size: 0.68rem;
  font-weight: 700;
  min-width: 17px;
  height: 17px;
  border-radius: var(--radius-pill);
  display: grid;
  place-items: center;
  padding: 0 4px;
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.35);
}

/* USER PROFILE LIQUID PILL */
.user-menu-pill {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.35rem 0.85rem 0.35rem 0.45rem;
  border: 1px solid rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(12px);
  cursor: pointer;
  box-shadow: var(--shadow-liquid-sm);
  transition: var(--transition-fast);
}

.user-menu-pill:hover {
  background: rgba(255, 255, 255, 0.92);
  border-color: var(--primary);
  box-shadow: 0 4px 14px rgba(108, 142, 245, 0.12);
}

.user-avatar-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%);
  color: #ffffff;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 0.82rem;
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.7);
}

.user-menu-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-main);
}

.user-rep-tag {
  font-size: 0.72rem;
  font-weight: 700;
  background: var(--mint-light);
  color: #14532D;
  border: 1px solid var(--mint-subtle);
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-pill);
}

/* SECONDARY CATEGORY RIBBON (LIQUID CRYSTAL BAR) */
.category-ribbon {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--liquid-glass-border);
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none;
}

.category-ribbon::-webkit-scrollbar {
  display: none;
}

.category-ribbon-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0.5rem 1.75rem;
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.cat-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.42rem 0.95rem;
  border-radius: var(--radius-pill);
  font-size: 0.84rem;
  font-weight: 500;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.85);
  transition: var(--transition-fast);
  cursor: pointer;
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.8);
}

.cat-pill:hover {
  background: rgba(255, 255, 255, 0.85);
  color: var(--text-main);
  border-color: rgba(255, 255, 255, 1);
  box-shadow: 0 4px 12px rgba(108, 142, 245, 0.08);
}

.cat-pill.active {
  background: rgba(108, 142, 245, 0.14);
  color: var(--primary);
  font-weight: 700;
  border-color: var(--primary-subtle);
  box-shadow: 0 4px 12px rgba(108, 142, 245, 0.12), inset 0 1px 1px #fff;
}

/* ==================================================
   LIQUID GLASS CARDS & PRODUCT GRID
================================================== */
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.75rem;
  margin-top: 1.75rem;
}

@media (max-width: 1120px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 780px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.15rem;
  }
}

@media (max-width: 480px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
}

/* APPLE LIQUID GLASS PRODUCT CARD */
.product-card {
  background: var(--liquid-glass-bg);
  backdrop-filter: var(--blur-glass);
  -webkit-backdrop-filter: var(--blur-glass);
  border: 1px solid var(--liquid-glass-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-liquid-card);
  transition: var(--transition);
  position: relative;
}

.product-card:hover {
  transform: translateY(-5px);
  background: var(--liquid-glass-hover);
  border-color: rgba(255, 255, 255, 1);
  box-shadow: var(--shadow-liquid-hover);
}

/* Specular top rim shine */
.product-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0) 100%);
  z-index: 3;
}

/* IMAGE MEDIA CONTAINER */
.product-card-media {
  position: relative;
  width: 100%;
  padding-top: 72%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(246, 248, 252, 0.6) 100%);
  overflow: hidden;
  border-bottom: 1px solid var(--liquid-glass-border-light);
}

.product-card-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.product-card:hover .product-card-img {
  transform: scale(1.05);
}

/* FLOATING FROSTED BADGES */
.product-tag-borrow {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(239, 249, 245, 0.88);
  backdrop-filter: blur(12px);
  color: #14532D;
  border: 1px solid rgba(255, 255, 255, 0.95);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-pill);
  letter-spacing: 0.02em;
  z-index: 2;
  box-shadow: 0 4px 10px rgba(121, 201, 176, 0.15), inset 0 1px 1px #fff;
}

.product-tag-status {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(12px);
  color: var(--text-main);
  border: 1px solid rgba(255, 255, 255, 0.95);
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-pill);
  z-index: 2;
  box-shadow: 0 4px 10px rgba(0,0,0,0.04), inset 0 1px 1px #fff;
}

.product-tag-status.available {
  color: #15803D;
  background: rgba(240, 253, 244, 0.9);
  border-color: rgba(220, 252, 231, 0.9);
}

.product-tag-status.borrowed {
  color: #B45309;
  background: rgba(254, 243, 199, 0.9);
  border-color: rgba(253, 230, 138, 0.9);
}

/* CARD BODY */
.product-card-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.45rem;
  font-size: 0.75rem;
}

.product-category-text {
  text-transform: uppercase;
  font-weight: 700;
  color: var(--secondary);
  letter-spacing: 0.04em;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #F59E0B;
  font-weight: 700;
}

.product-card-title {
  font-size: 1.02rem;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.35;
  margin-bottom: 0.45rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 2.75rem;
}

.product-card-desc {
  font-size: 0.82rem;
  color: var(--text-muted);
  line-height: 1.45;
  margin-bottom: 0.85rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 2.4rem;
}

.product-card-details {
  border-top: 1px solid var(--liquid-glass-border-light);
  padding-top: 0.75rem;
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.78rem;
  color: var(--text-muted);
}

.product-detail-row {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.product-detail-icon {
  width: 14px;
  height: 14px;
  color: var(--text-subtle);
  flex-shrink: 0;
}

.product-card-footer {
  margin-top: 0.95rem;
  display: flex;
  gap: 0.55rem;
}

/* ==================================================
   LIQUID BUTTONS & CONTROLS
================================================== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  font-family: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  padding: 0.58rem 1.25rem;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  cursor: pointer;
  transition: var(--transition-fast);
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.btn-primary {
  background: linear-gradient(135deg, rgba(108, 142, 245, 0.95) 0%, rgba(155, 138, 251, 0.95) 100%);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow: 0 4px 14px rgba(108, 142, 245, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.65);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(108, 142, 245, 0.38), inset 0 1px 1px #fff;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  color: var(--text-main);
  border: 1px solid rgba(255, 255, 255, 0.95);
  box-shadow: var(--shadow-liquid-sm);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: var(--text-subtle);
  transform: translateY(-1px);
}

.btn-soft-blue {
  background: rgba(108, 142, 245, 0.12);
  color: var(--primary);
  border: 1px solid var(--primary-subtle);
  box-shadow: inset 0 1px 1px #fff;
}

.btn-soft-blue:hover {
  background: var(--primary);
  color: #ffffff;
}

.btn-mint {
  background: linear-gradient(135deg, var(--mint) 0%, #5CB49A 100%);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(121, 201, 176, 0.3), inset 0 1px 1px rgba(255,255,255,0.6);
}

.btn-danger {
  background: #FEE2E2;
  color: #DC2626;
  border-color: #FECACA;
}

.btn-sm {
  padding: 0.4rem 0.85rem;
  font-size: 0.8rem;
  border-radius: var(--radius-sm);
}

.btn-lg {
  padding: 0.78rem 1.6rem;
  font-size: 1rem;
  border-radius: var(--radius-md);
}

/* FROSTED GLASS FORMS */
.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 0.45rem;
}

.form-control {
  width: 100%;
  font-family: inherit;
  font-size: 0.9rem;
  color: var(--text-main);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-md);
  padding: 0.65rem 0.95rem;
  outline: none;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.03), 0 2px 8px rgba(108, 142, 245, 0.03);
  transition: var(--transition-fast);
}

.form-control:focus {
  background: #ffffff;
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(108, 142, 245, 0.16);
}

/* ==================================================
   HERO SECTION (LIQUID GLASS + AMBIENT LIGHT)
================================================== */
.hero-clean {
  padding: 4rem 0 4.5rem;
  position: relative;
  overflow: hidden;
}

.hero-layout {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 3.5rem;
  align-items: center;
}

@media (max-width: 900px) {
  .hero-layout {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
}

.hero-pill-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  color: var(--primary);
  border: 1px solid rgba(255, 255, 255, 0.95);
  font-size: 0.82rem;
  font-weight: 700;
  padding: 0.38rem 0.95rem;
  border-radius: var(--radius-pill);
  margin-bottom: 1.25rem;
  box-shadow: var(--shadow-liquid-sm);
}

.hero-heading {
  font-size: 2.9rem;
  font-weight: 800;
  line-height: 1.16;
  letter-spacing: -0.035em;
  color: var(--text-main);
  margin-bottom: 1.1rem;
}

.hero-heading span {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subheading {
  font-size: 1.1rem;
  color: var(--text-muted);
  line-height: 1.65;
  margin-bottom: 2rem;
  max-width: 550px;
}

.hero-cta-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-trust-row {
  margin-top: 2.25rem;
  display: flex;
  align-items: center;
  gap: 1.75rem;
  font-size: 0.82rem;
  color: var(--text-muted);
  flex-wrap: wrap;
}

.hero-trust-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.hero-trust-item svg {
  color: var(--mint);
  width: 17px;
  height: 17px;
}

/* FLOATING PRODUCT CARDS ON HERO (LIQUID GLASS) */
.hero-visual-stack {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.hero-float-card {
  background: var(--liquid-glass-bg);
  backdrop-filter: var(--blur-glass);
  -webkit-backdrop-filter: var(--blur-glass);
  border: 1px solid var(--liquid-glass-border);
  border-radius: var(--radius-lg);
  padding: 1.1rem;
  display: flex;
  align-items: center;
  gap: 1.1rem;
  box-shadow: var(--shadow-liquid-card);
  transition: var(--transition);
}

.hero-float-card:hover {
  transform: translateX(8px);
  background: var(--liquid-glass-hover);
  border-color: rgba(255, 255, 255, 1);
  box-shadow: var(--shadow-liquid-hover);
}

.hero-float-thumb {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-md);
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 10px rgba(0,0,0,0.06);
  flex-shrink: 0;
}

/* ==================================================
   DISCOVERY & FILTER SIDEBAR
================================================== */
.discovery-layout {
  display: grid;
  grid-template-columns: 270px 1fr;
  gap: 2rem;
  margin-top: 2rem;
  align-items: flex-start;
}

@media (max-width: 880px) {
  .discovery-layout {
    grid-template-columns: 1fr;
  }
}

.filter-sidebar {
  background: var(--liquid-glass-bg);
  backdrop-filter: var(--blur-glass);
  border: 1px solid var(--liquid-glass-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-liquid-card);
  position: sticky;
  top: 90px;
}

.filter-section {
  margin-bottom: 1.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--liquid-glass-border-light);
}

.filter-section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.filter-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 0.55rem;
  cursor: pointer;
}

.filter-option:hover {
  color: var(--text-main);
}

/* TOOLBAR HEADER */
.toolbar-header {
  background: var(--liquid-glass-bg);
  backdrop-filter: var(--blur-glass);
  border: 1px solid var(--liquid-glass-border);
  border-radius: var(--radius-lg);
  padding: 0.95rem 1.4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  box-shadow: var(--shadow-liquid-card);
}

.sort-select {
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-md);
  padding: 0.45rem 0.85rem;
  font-size: 0.85rem;
  font-family: inherit;
  color: var(--text-main);
  background: rgba(255, 255, 255, 0.8);
  outline: none;
  box-shadow: var(--shadow-liquid-sm);
}

/* ==================================================
   PRODUCT DETAIL PAGE (LIQUID GLASS)
================================================== */
.detail-layout {
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 3.5rem;
  background: var(--liquid-glass-bg);
  backdrop-filter: var(--blur-glass);
  -webkit-backdrop-filter: var(--blur-glass);
  border: 1px solid var(--liquid-glass-border);
  border-radius: var(--radius-xl);
  padding: 2.75rem;
  box-shadow: var(--shadow-liquid-modal);
  margin-top: 2rem;
}

@media (max-width: 900px) {
  .detail-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 1.5rem;
  }
}

.detail-gallery {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-main-img-box {
  width: 100%;
  aspect-ratio: 4/3;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: linear-gradient(180deg, #ffffff 0%, #f6f8fc 100%);
  border: 1px solid rgba(255, 255, 255, 0.95);
  box-shadow: var(--shadow-liquid-card);
  position: relative;
}

.detail-main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-meta-box {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-lg);
  padding: 1.35rem;
  margin: 1.5rem 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  box-shadow: var(--shadow-liquid-sm);
}

@media (max-width: 500px) {
  .detail-meta-box {
    grid-template-columns: 1fr;
  }
}

.detail-meta-item {
  display: flex;
  flex-direction: column;
}

.detail-meta-label {
  font-size: 0.74rem;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.04em;
}

.detail-meta-val {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-main);
  margin-top: 0.25rem;
}

.borrow-action-card {
  background: rgba(108, 142, 245, 0.07);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(108, 142, 245, 0.2);
  border-radius: var(--radius-lg);
  padding: 1.6rem;
  margin-top: 1.5rem;
  box-shadow: var(--shadow-liquid-sm);
}

/* ==================================================
   REQUEST TRACKING TIMELINE
================================================== */
.timeline-card {
  background: var(--liquid-glass-bg);
  backdrop-filter: var(--blur-glass);
  border: 1px solid var(--liquid-glass-border);
  border-radius: var(--radius-lg);
  padding: 1.6rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-liquid-card);
}

.stepper-progress {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  margin: 2.2rem 1.25rem 1.5rem;
}

.stepper-line {
  position: absolute;
  top: 16px;
  left: 30px;
  right: 30px;
  height: 3px;
  background: rgba(232, 234, 240, 0.8);
  z-index: 1;
}

.stepper-line-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--mint) 0%, var(--primary) 100%);
  transition: width 0.4s ease;
}

.stepper-step {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stepper-dot {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid rgba(232, 234, 240, 0.9);
  display: grid;
  place-items: center;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-muted);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: var(--transition-fast);
}

.stepper-step.completed .stepper-dot {
  background: var(--mint);
  border-color: var(--mint);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(121, 201, 176, 0.35);
}

.stepper-step.active .stepper-dot {
  background: var(--primary);
  border-color: var(--primary);
  color: #ffffff;
  box-shadow: 0 0 0 4px rgba(108, 142, 245, 0.2);
}

.stepper-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-top: 0.55rem;
  max-width: 85px;
}

/* ==================================================
   MATCHING RADAR & GAUGE
================================================== */
.match-card {
  background: var(--liquid-glass-bg);
  backdrop-filter: var(--blur-glass);
  border: 1px solid var(--liquid-glass-border);
  border-radius: var(--radius-lg);
  padding: 1.6rem;
  display: grid;
  grid-template-columns: 140px 1fr auto;
  gap: 1.6rem;
  align-items: center;
  box-shadow: var(--shadow-liquid-card);
  margin-bottom: 1.35rem;
  transition: var(--transition);
}

.match-card:hover {
  transform: translateY(-3px);
  background: var(--liquid-glass-hover);
  border-color: var(--mint);
  box-shadow: var(--shadow-liquid-hover);
}

.match-gauge-circle {
  width: 92px;
  height: 92px;
  border-radius: 50%;
  background: conic-gradient(var(--mint) var(--match-pct, 90%), rgba(232, 234, 240, 0.7) 0);
  display: grid;
  place-items: center;
  box-shadow: 0 4px 14px rgba(121, 201, 176, 0.2);
  margin: 0 auto;
}

.match-gauge-inner {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.match-pct-text {
  font-size: 1.3rem;
  font-weight: 800;
  color: #059669;
  line-height: 1;
}

.match-pct-label {
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-muted);
}

.match-reasons-box {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.55rem;
}

.match-reason-pill {
  font-size: 0.74rem;
  font-weight: 600;
  color: #14532D;
  background: var(--mint-light);
  border: 1px solid var(--mint-subtle);
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-pill);
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

/* ==================================================
   QR HANDOVER SCREEN (CRYSTAL GLASS)
================================================== */
.handover-card {
  max-width: 600px;
  margin: 2rem auto;
  background: var(--liquid-glass-bg);
  backdrop-filter: var(--blur-modal);
  -webkit-backdrop-filter: var(--blur-modal);
  border: 1px solid var(--liquid-glass-border);
  border-radius: var(--radius-xl);
  padding: 2.75rem;
  text-align: center;
  box-shadow: var(--shadow-liquid-modal);
}

.qr-code-box {
  background: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-lg);
  padding: 1.35rem;
  display: inline-block;
  margin: 1.5rem 0;
  box-shadow: 0 8px 24px rgba(108, 142, 245, 0.12), inset 0 1px 1px #fff;
}

.qr-code-img {
  width: 220px;
  height: 220px;
  display: block;
}

.token-pill-box {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-md);
  padding: 0.6rem 1.1rem;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
  color: var(--primary);
  display: inline-flex;
  align-items: center;
  gap: 0.85rem;
  margin: 0.85rem 0;
  box-shadow: var(--shadow-liquid-sm);
}

/* ==================================================
   KNOWLEDGE VAULT (APPLE NOTION / DRIVE STYLE)
================================================== */
.vault-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.35rem;
  margin-top: 1.5rem;
}

.vault-card {
  background: var(--liquid-glass-bg);
  backdrop-filter: var(--blur-glass);
  border: 1px solid var(--liquid-glass-border);
  border-radius: var(--radius-lg);
  padding: 1.35rem;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-liquid-card);
  transition: var(--transition);
}

.vault-card:hover {
  transform: translateY(-4px);
  background: var(--liquid-glass-hover);
  border-color: var(--secondary-subtle);
  box-shadow: var(--shadow-liquid-hover);
}

.vault-card-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 1.15rem;
  margin-bottom: 0.9rem;
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.8);
}

.vault-icon-pdf { background: #FEE2E2; color: #DC2626; }
.vault-icon-note { background: var(--secondary-light); color: var(--secondary); }
.vault-icon-doc { background: var(--primary-light); color: var(--primary); }

.vault-card-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.4rem;
}

.vault-preview-box {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.9);
  padding: 0.65rem;
  border-radius: var(--radius-sm);
  margin-bottom: 0.85rem;
  line-height: 1.45;
  height: 4.4rem;
  overflow: hidden;
}

/* ==================================================
   TABLES & GENERAL LIQUID CARDS
================================================== */
.card {
  background: var(--liquid-glass-bg);
  backdrop-filter: var(--blur-glass);
  -webkit-backdrop-filter: var(--blur-glass);
  border: 1px solid var(--liquid-glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-liquid-card);
  padding: 1.6rem;
}

.table-responsive {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.88rem;
}

.table th {
  padding: 0.9rem 1rem;
  background: rgba(255, 255, 255, 0.6);
  font-weight: 700;
  color: var(--text-muted);
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid var(--liquid-glass-border-light);
}

.table td {
  padding: 1rem;
  border-bottom: 1px solid var(--liquid-glass-border-light);
  color: var(--text-main);
  vertical-align: middle;
}

.table tr:hover td {
  background: rgba(255, 255, 255, 0.45);
}

/* LIQUID STATS ROW */
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 1.35rem;
  margin-bottom: 2rem;
}

.stat-box {
  background: var(--liquid-glass-bg);
  backdrop-filter: var(--blur-glass);
  border: 1px solid var(--liquid-glass-border);
  border-radius: var(--radius-lg);
  padding: 1.35rem;
  display: flex;
  align-items: center;
  gap: 1.1rem;
  box-shadow: var(--shadow-liquid-card);
  transition: var(--transition);
}

.stat-box:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-liquid-hover);
}

.stat-box-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: grid;
  place-items: center;
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.8);
  flex-shrink: 0;
}

.stat-box-val {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-main);
  line-height: 1.1;
}

.stat-box-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
}

/* ==================================================
   ALERTS & TOASTS
================================================== */
.alert {
  padding: 0.9rem 1.35rem;
  border-radius: var(--radius-md);
  margin-bottom: 1.25rem;
  font-size: 0.88rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  backdrop-filter: blur(12px);
}

.alert-success {
  background: rgba(239, 249, 245, 0.88);
  border: 1px solid var(--mint-subtle);
  color: #14532D;
}

.alert-info {
  background: rgba(238, 243, 254, 0.88);
  border: 1px solid var(--primary-subtle);
  color: #1E40AF;
}

.alert-danger {
  background: rgba(254, 226, 226, 0.88);
  border: 1px solid #FECACA;
  color: #991B1B;
}

/* TOAST FLOATING CONTAINER */
#toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.95);
  box-shadow: var(--shadow-liquid-modal);
  border-radius: var(--radius-md);
  padding: 0.85rem 1.35rem;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-main);
  animation: slideUp 0.25s ease-out;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

/* LIQUID GLASS MODAL */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(29, 35, 47, 0.35);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 200;
  display: none;
  place-items: center;
  padding: 1rem;
}

.modal-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: var(--blur-modal);
  -webkit-backdrop-filter: var(--blur-modal);
  border: 1px solid rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-xl);
  max-width: 580px;
  width: 100%;
  padding: 2.25rem;
  box-shadow: var(--shadow-liquid-modal);
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-close-btn {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.95);
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  cursor: pointer;
  font-size: 1rem;
  color: var(--text-muted);
  box-shadow: var(--shadow-liquid-sm);
  transition: var(--transition-fast);
}

.modal-close-btn:hover {
  background: #FEE2E2;
  color: #DC2626;
  border-color: #FECACA;
}

/* FOOTER */
.site-footer {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(16px);
  border-top: 1px solid var(--liquid-glass-border);
  padding: 2.75rem 0;
  margin-top: 5.5rem;
  font-size: 0.88rem;
  color: var(--text-muted);
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
}

/* MOBILE BOTTOM DOCK */
.mobile-bottom-dock {
  display: none;
  position: fixed;
  bottom: 12px;
  left: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-pill);
  padding: 0.65rem 1.25rem;
  z-index: 99;
  justify-content: space-around;
  box-shadow: 0 10px 30px rgba(108, 142, 245, 0.15), inset 0 1px 1px #fff;
}

@media (max-width: 768px) {
  .mobile-bottom-dock {
    display: flex;
  }
  body {
    padding-bottom: 80px;
  }
}

.dock-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-muted);
  gap: 0.2rem;
}

.dock-item.active {
  color: var(--primary);
}

.dock-icon {
  width: 20px;
  height: 20px;
}
`;

const targetPath = 'D:\\CRKH\\backend\\src\\main\\resources\\static\\css\\style.css';
fs.writeFileSync(targetPath, cssContent, 'utf8');
console.log('style.css written successfully with Apple Liquid Glass design!');

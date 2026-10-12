// Campus Resource & Knowledge Hub (CRKH) - Client Controller & Interactions

// Active Backend URL (Render Cloud Service)
const BACKEND_URL = window.CRKH_BACKEND_URL || 'https://campus-resource-knowledge-hub-3.onrender.com';
window.BACKEND_URL = BACKEND_URL;
if (!window.CRKH) window.CRKH = {};
window.CRKH.backendUrl = BACKEND_URL;

// Fallback images map for categories
const CATEGORY_FALLBACK_IMAGES = {
  'TEXTBOOK': '/images/products/dbms_book.jpg',
  'CALCULATOR': '/images/products/casio_calculator.jpg',
  'HDMI_CABLE': '/images/products/hdmi_cable.jpg',
  'ADAPTER': '/images/products/usbc_adapter.jpg',
  'LAB_EQUIPMENT': '/images/products/breadboard_lab.jpg',
  'NOTES': '/images/products/network_notes.jpg',
  'STUDY_MATERIALS': '/images/products/java_book.jpg',
  'ELECTRONICS': '/images/products/sony_headphones.jpg',
  'SPORTS': '/images/products/basketball.jpg',
  'STATIONERY': '/images/products/network_notes.jpg',
  'HOSTEL_ITEMS': '/images/products/desk_lamp.jpg',
  'OTHER': '/images/products/arduino_kit.jpg'
};

document.addEventListener('DOMContentLoaded', () => {
  initImageFallbacks();
  initDemoLoginFillers();
  initQuickViewModals();
  initSearchShortcuts();
  initCategoryRibbon();
  initCopyButtons();
});

// 1. Guaranteed Image Fallback System (Zero Broken Images)
function initImageFallbacks() {
  document.querySelectorAll('img[data-category]').forEach(img => {
    img.addEventListener('error', function() {
      const cat = this.getAttribute('data-category') || 'OTHER';
      const fallback = CATEGORY_FALLBACK_IMAGES[cat] || '/images/products/default.svg';
      if (this.src !== fallback) {
        this.src = fallback;
      }
    });
  });
}

// 2. Demo Account Quick Filler
function initDemoLoginFillers() {
  const fillBtns = document.querySelectorAll('[data-fill-email]');
  fillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const emailInput = document.getElementById('username');
      const passInput = document.getElementById('password');
      if (emailInput && passInput) {
        emailInput.value = btn.getAttribute('data-fill-email');
        passInput.value = btn.getAttribute('data-fill-pass');
        showToast(`Filled credentials for ${btn.getAttribute('data-fill-email')}`, 'info');
        emailInput.focus();
      }
    });
  });
}

// 3. Search Bar Shortcut (Press "/" or Ctrl+K to search)
function initSearchShortcuts() {
  const searchInput = document.querySelector('.nav-search-input');
  if (searchInput) {
    document.addEventListener('keydown', (e) => {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
    });
  }
}

// 4. Client-side Category Ribbon Filtering
function initCategoryRibbon() {
  const pills = document.querySelectorAll('.cat-pill[data-filter]');
  if (pills.length > 0) {
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        const filter = pill.getAttribute('data-filter');
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const items = document.querySelectorAll('.product-card[data-category]');
        let count = 0;
        items.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (filter === 'ALL' || cardCat === filter) {
            card.style.display = '';
            count++;
          } else {
            card.style.display = 'none';
          }
        });

        const countEl = document.getElementById('visibleResourceCount');
        if (countEl) countEl.innerText = count;
      });
    });
  }
}

// 5. Quick View & Request Modal
function initQuickViewModals() {
  document.querySelectorAll('[data-quick-view]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.product-card');
      if (!card) return;

      const title = card.getAttribute('data-title') || 'Campus Resource';
      const category = card.getAttribute('data-category') || 'OTHER';
      const location = card.getAttribute('data-location') || 'Campus Central';
      const owner = card.getAttribute('data-owner') || 'Student';
      const rep = card.getAttribute('data-rep') || '100';
      const dates = card.getAttribute('data-dates') || 'Available Today';
      const desc = card.getAttribute('data-desc') || 'Shared campus resource in good condition.';
      const resId = card.getAttribute('data-id');
      const imgSrc = card.querySelector('.product-card-img')?.src || CATEGORY_FALLBACK_IMAGES[category];

      document.getElementById('qvTitle').innerText = title;
      document.getElementById('qvCategory').innerText = category;
      document.getElementById('qvLocation').innerText = location;
      document.getElementById('qvOwner').innerText = `${owner} (${rep} pts)`;
      document.getElementById('qvDates').innerText = dates;
      document.getElementById('qvDesc').innerText = desc;
      document.getElementById('qvImg').src = imgSrc;
      document.getElementById('qvResourceId').value = resId;
      document.getElementById('qvDetailLink').href = `/resources/${resId}`;

      openModal('quickViewModal');
    });
  });
}

// 6. Token Copy Helper
function initCopyButtons() {
  const copyBtn = document.getElementById('copyTokenBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const token = copyBtn.getAttribute('data-token') || document.getElementById('qrTokenVal')?.innerText;
      if (token) {
        navigator.clipboard.writeText(token.trim()).then(() => {
          showToast('QR Token copied to clipboard!', 'success');
          copyBtn.innerText = 'Copied!';
          setTimeout(() => copyBtn.innerText = 'Copy Token', 2500);
        });
      }
    });
  }
}

// 7. Toast Notification Engine
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'danger') icon = '⚠️';

  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

// Modal Global Utilities
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = 'grid';
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

// Quick Simulator for QR Handover
function simulateQrScan() {
  const tokenVal = document.getElementById('qrTokenVal')?.innerText?.trim();
  const tokenInput = document.querySelector('input[name="qrToken"]');
  if (tokenInput && tokenVal) {
    tokenInput.value = tokenVal;
    showToast('Simulated QR scan: Token recognized!', 'success');
    setTimeout(() => {
      tokenInput.closest('form')?.submit();
    }, 600);
  }
}

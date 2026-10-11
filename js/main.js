// Campus Resource & Knowledge Hub (CRKH) - Client Controller & Interactions

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

// Global CRKH Namespace
window.CRKH = {
  handleImageFallback: function(img) {
    if (!img) return;
    const cat = img.getAttribute('data-category') || 'OTHER';
    const fallback = CATEGORY_FALLBACK_IMAGES[cat] || '/images/products/default.svg';
    if (!img.dataset.fallbackTried) {
      img.dataset.fallbackTried = 'true';
      img.src = fallback;
    }
  },
  showToast: function(message, type = 'info') {
    showToast(message, type);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initImageFallbacks();
  initDemoLoginFillers();
  initSearchShortcuts();
  initCategoryRibbon();
  initCopyButtons();
  initUrlCategoryFilter();
});

// 1. Guaranteed Image Fallback System (Zero Broken Images)
function initImageFallbacks() {
  document.querySelectorAll('img[data-category]').forEach(img => {
    img.addEventListener('error', function() {
      CRKH.handleImageFallback(this);
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
      pill.addEventListener('click', (e) => {
        const cards = document.querySelectorAll('.product-card[data-category]');
        if (cards.length > 0) {
          e.preventDefault();
          const filter = pill.getAttribute('data-filter');
          pills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');

          let count = 0;
          cards.forEach(card => {
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
        }
      });
    });
  }
}

// Check category parameter in URL on page load
function initUrlCategoryFilter() {
  try {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    if (cat) {
      const pill = document.querySelector(`.cat-pill[data-filter="${cat}"]`);
      if (pill) {
        pill.click();
      }
    }
  } catch (e) {}
}

// 5. Exchange Mode Filter
window.filterByExchange = function(type, btn) {
  const tabs = document.querySelectorAll('#exchangeModeTabs button, .product-filter-bar button');
  if (tabs.length > 0 && btn) {
    tabs.forEach(b => b.classList.remove('active-tab'));
    btn.classList.add('active-tab');
  }

  const cards = document.querySelectorAll('.product-card');
  let count = 0;
  cards.forEach(card => {
    const cardType = card.getAttribute('data-sharing-type') || 'FREE_BORROW';
    if (type === 'ALL' || cardType === type) {
      card.style.display = '';
      count++;
    } else {
      card.style.display = 'none';
    }
  });

  const countEl = document.getElementById('visibleResourceCount');
  if (countEl) countEl.innerText = count;
};

// 6. Quick View Modal Handlers
window.openQuickView = function(btn) {
  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  const id = btn.getAttribute('data-id');
  const title = btn.getAttribute('data-title');
  const loc = btn.getAttribute('data-location');
  const owner = btn.getAttribute('data-owner');
  const cond = btn.getAttribute('data-condition');
  const sharingType = btn.getAttribute('data-sharing-type') || 'FREE_BORROW';
  const pref = btn.getAttribute('data-exchange-pref');
  const sat = btn.getAttribute('data-satisfaction');

  const titleEl = document.getElementById('qvTitle');
  if (titleEl) titleEl.innerText = title || 'Resource Details';
  const locEl = document.getElementById('qvLocation');
  if (locEl) locEl.innerText = loc || 'Campus';
  const ownerEl = document.getElementById('qvOwner');
  if (ownerEl) ownerEl.innerText = owner || 'Verified Student';
  const condEl = document.getElementById('qvCondition');
  if (condEl) condEl.innerText = cond || 'Good';
  const prefEl = document.getElementById('qvExchangePref');
  if (prefEl) prefEl.innerText = pref || 'Free campus community loan';
  const satEl = document.getElementById('qvSatisfaction');
  if (satEl) satEl.innerText = sat || 'Standard student code of conduct inspection on pickup.';

  const linkEl = document.getElementById('qvDetailsLink');
  if (linkEl) linkEl.href = '/resources/' + id;

  modal.style.display = 'grid';
  document.body.style.overflow = 'hidden';
};

window.closeQuickView = function() {
  const modal = document.getElementById('quickViewModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
};

// 7. Token Copy Helper
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

// 8. Toast Notification Engine
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
window.openModal = function(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = 'grid';
    document.body.style.overflow = 'hidden';
  }
};

window.closeModal = function(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
};

// Quick Simulator for QR Handover
window.simulateQrScan = function() {
  const tokenVal = document.getElementById('qrTokenVal')?.innerText?.trim();
  const tokenInput = document.querySelector('input[name="qrToken"]');
  if (tokenInput && tokenVal) {
    tokenInput.value = tokenVal;
    showToast('Simulated QR scan: Token recognized!', 'success');
    setTimeout(() => {
      tokenInput.closest('form')?.submit();
    }, 600);
  }
};

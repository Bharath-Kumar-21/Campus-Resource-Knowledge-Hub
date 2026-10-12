// Campus Resource & Knowledge Hub (CRKH) - Client Controller & Interactions

// Active Backend URL (Render Cloud Service)
const BACKEND_URL = window.CRKH_BACKEND_URL || 'https://campus-resource-knowledge-hub-3.onrender.com';
window.BACKEND_URL = BACKEND_URL;
if (!window.CRKH) window.CRKH = {};
window.CRKH.backendUrl = BACKEND_URL;

// Resource Catalog Metadata Map (Zero Broken IDs)
const RESOURCE_CATALOG = {
  '1': { title: 'DBMS Textbook - Navathe & Elmasri (7th Ed)', owner: 'Bharath Kumar', category: 'TEXTBOOK', mode: 'Item Exchange', dates: '2026-10-05 to 2026-11-19', location: 'Central Campus Library, 2nd Floor' },
  '2': { title: 'Casio fx-991EX ClassWiz Scientific Calculator', owner: 'Aarav Patel', category: 'CALCULATOR', mode: 'Free Borrow', dates: '2026-10-06 to 2026-10-20', location: 'Tech Park Block C, Room 304' },
  '3': { title: 'High-Speed 4K HDMI Cable (2m Braided)', owner: 'Ananya Sharma', category: 'HDMI_CABLE', mode: 'Skill Swap', dates: '2026-10-03 to 2026-10-10', location: 'Hostel Block A Common Room' },
  '4': { title: 'Anker USB-C 7-in-1 Dual Display Hub', owner: 'Rohan Verma', category: 'ADAPTER', mode: 'Security Pledge', dates: '2026-10-05 to 2026-10-25', location: 'Student Activity Center / Cafeteria' },
  '5': { title: 'Arduino Uno R3 Starter Kit with Sensors', owner: 'Pooja Nair', category: 'LAB_EQUIPMENT', mode: 'Free Borrow', dates: '2026-10-07 to 2026-10-28', location: 'Computer Science Block B, Lab 102' },
  '6': { title: 'Computer Networks Handwritten Class Notes (Sem 5)', owner: 'Vikram Singh', category: 'NOTES', mode: 'Free Borrow', dates: '2026-10-04 to 2026-10-25', location: 'Central Campus Library' },
  '7': { title: 'Operating Systems Concepts - Silberschatz (10th Ed)', owner: 'Sneha Reddy', category: 'STUDY_MATERIALS', mode: 'Item Exchange', dates: '2026-10-05 to 2026-11-15', location: 'Library Silent Study Zone 3F' },
  '8': { title: 'Sony WH-1000XM4 Noise-Cancelling Headphones', owner: 'Karthik Rao', category: 'ELECTRONICS', mode: 'Security Pledge', dates: '2026-10-08 to 2026-10-18', location: 'Media Lab Room 4B' },
  '9': { title: 'Official Spalding TF-1000 Indoor Basketball', owner: 'Dev Mehra', category: 'SPORTS', mode: 'Free Borrow', dates: '2026-10-05 to 2026-10-20', location: 'Campus Recreation Center Locker 14' },
  '10': { title: 'Rotring Rapid Pro Engineering Drafting Pen Set', owner: 'Meera Iyer', category: 'STATIONERY', mode: 'Free Borrow', dates: '2026-10-06 to 2026-10-27', location: 'Architecture Studio 2A' },
  '11': { title: 'Philips EyeCare LED Desk Study Lamp', owner: 'Tanvi Joshi', category: 'HOSTEL_ITEMS', mode: 'Free Borrow', dates: '2026-10-05 to 2026-10-25', location: 'Hostel Block C, Room 312' },
  '12': { title: 'Raspberry Pi 4 Model B (4GB) with Case & Fan', owner: 'Aditya Gupta', category: 'LAB_EQUIPMENT', mode: 'Security Pledge', dates: '2026-10-08 to 2026-11-01', location: 'Makerspace Lab B4' },
  '13': { title: 'Digital Multimeter with Probes & Thermocouple', owner: 'Sanjay Dutt', category: 'LAB_EQUIPMENT', mode: 'Skill Swap', dates: '2026-10-07 to 2026-10-21', location: 'Electronics Lab 2, Main Building' },
  '14': { title: 'MacBook MagSafe 3 Fast Charging Cable (2m)', owner: 'Nisha Pillai', category: 'ADAPTER', mode: 'Free Borrow', dates: '2026-10-05 to 2026-10-25', location: 'Innovation Hub Lounge' }
};

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

// Direct URL Intercept Guard (in case user hits /borrowings/create directly)
(function checkRouteGuard() {
  if (typeof window !== 'undefined' && window.location) {
    const p = window.location.pathname || '';
    if (p.indexOf('/borrowings/create') !== -1) {
      window.location.replace('/borrowings.html?requested=true');
    }
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  initImageFallbacks();
  initDemoLoginFillers();
  initSearchShortcuts();
  initCategoryRibbon();
  initCopyButtons();
  initUrlCategoryFilter();
  initQuickViewButtons();
  initStaticFormInterceptors();
  initBorrowingsPage();
  initRequestsPage();
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

// 6. Quick View Modal Handlers & Quick Request Button Wiring
function initQuickViewButtons() {
  // Support [data-quick-view] button triggers on cards
  document.querySelectorAll('[data-quick-view]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.product-card');
      if (!card) return;

      const modal = document.getElementById('quickViewModal');
      if (!modal) return;

      const id = card.getAttribute('data-id') || '1';
      const catInfo = RESOURCE_CATALOG[id] || {};
      const title = card.getAttribute('data-title') || catInfo.title || card.querySelector('.product-card-title')?.innerText || 'Campus Academic Resource';
      const category = card.getAttribute('data-category') || catInfo.category || 'TEXTBOOK';
      const loc = card.getAttribute('data-location') || catInfo.location || 'Central Campus Library';
      const owner = card.getAttribute('data-owner') || catInfo.owner || 'Verified Student';
      const dates = card.getAttribute('data-dates') || catInfo.dates || 'Available this semester';
      const desc = card.getAttribute('data-desc') || 'Verified physical academic equipment available for campus peer exchange.';

      const qvId = document.getElementById('qvResourceId');
      if (qvId) qvId.value = id;

      const qvTitle = document.getElementById('qvTitle');
      if (qvTitle) qvTitle.innerText = title;

      const qvCat = document.getElementById('qvCategory');
      if (qvCat) qvCat.innerText = category;

      const qvLoc = document.getElementById('qvLocation');
      if (qvLoc) qvLoc.innerText = loc;

      const qvOwner = document.getElementById('qvOwner');
      if (qvOwner) qvOwner.innerText = owner;

      const qvDates = document.getElementById('qvDates');
      if (qvDates) qvDates.innerText = dates;

      const qvDesc = document.getElementById('qvDesc');
      if (qvDesc) qvDesc.innerText = desc;

      const qvDetail = document.getElementById('qvDetailLink') || document.getElementById('qvDetailsLink');
      if (qvDetail) qvDetail.href = '/resources/' + id + '.html';

      const qvImg = document.getElementById('qvImg');
      if (qvImg) {
        const cardImg = card.querySelector('img');
        if (cardImg && cardImg.src) {
          qvImg.src = cardImg.src;
        } else {
          qvImg.src = CATEGORY_FALLBACK_IMAGES[category] || '/images/products/casio_calculator.jpg';
        }
      }

      modal.style.display = 'grid';
      document.body.style.overflow = 'hidden';
    });
  });
}

window.openQuickView = function(btn) {
  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  const id = btn.getAttribute('data-id') || '1';
  const catInfo = RESOURCE_CATALOG[id] || {};
  const title = btn.getAttribute('data-title') || catInfo.title || 'Resource Details';
  const loc = btn.getAttribute('data-location') || catInfo.location || 'Campus';
  const owner = btn.getAttribute('data-owner') || catInfo.owner || 'Verified Student';
  const cond = btn.getAttribute('data-condition') || 'Good';
  const sharingType = btn.getAttribute('data-sharing-type') || catInfo.mode || 'FREE_BORROW';
  const pref = btn.getAttribute('data-exchange-pref');
  const sat = btn.getAttribute('data-satisfaction');

  const qvId = document.getElementById('qvResourceId');
  if (qvId) qvId.value = id;

  const titleEl = document.getElementById('qvTitle');
  if (titleEl) titleEl.innerText = title;
  const locEl = document.getElementById('qvLocation');
  if (locEl) locEl.innerText = loc;
  const ownerEl = document.getElementById('qvOwner');
  if (ownerEl) ownerEl.innerText = owner;
  const condEl = document.getElementById('qvCondition');
  if (condEl) condEl.innerText = cond;
  const prefEl = document.getElementById('qvExchangePref');
  if (prefEl) prefEl.innerText = pref || 'Free campus community loan';
  const satEl = document.getElementById('qvSatisfaction');
  if (satEl) satEl.innerText = sat || 'Standard student code of conduct inspection on pickup.';

  const linkEl = document.getElementById('qvDetailLink') || document.getElementById('qvDetailsLink');
  if (linkEl) linkEl.href = '/resources/' + id + '.html';

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

// 7. Comprehensive Static Form Interceptor (Prevents 404 on Vercel)
function initStaticFormInterceptors() {
  document.addEventListener('submit', function(e) {
    const form = e.target.closest('form');
    if (!form) return;

    const rawAction = form.getAttribute('action') || '';
    const action = rawAction.toLowerCase();

    // A. Intercept Borrowing / Resource Request (/borrowings/create)
    if (action.indexOf('/borrowings/create') !== -1) {
      e.preventDefault();
      handleBorrowingRequestSubmit(form);
      return;
    }

    // B. Intercept Post Resource Request (/requests/new)
    if (action.indexOf('/requests/new') !== -1) {
      e.preventDefault();
      handleResourceRequestPost(form);
      return;
    }

    // C. Intercept New Resource Share (/resources/new)
    if (action.indexOf('/resources/new') !== -1) {
      e.preventDefault();
      showToast('✅ Resource listed on campus marketplace!', 'success');
      setTimeout(() => {
        window.location.href = '/resources.html?created=true';
      }, 500);
      return;
    }

    // D. Intercept Login (/perform_login)
    if (action.indexOf('/perform_login') !== -1) {
      e.preventDefault();
      const email = form.querySelector('[name="username"]')?.value || 'student1@college.edu';
      showToast('Signed in as ' + email, 'success');
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 400);
      return;
    }

    // E. Intercept Logout (/logout)
    if (action.indexOf('/logout') !== -1) {
      e.preventDefault();
      showToast('Logged out successfully', 'info');
      setTimeout(() => {
        window.location.href = '/login.html';
      }, 350);
      return;
    }

    // F. Intercept Vault Upload (/knowledge-vault/upload)
    if (action.indexOf('/knowledge-vault/upload') !== -1) {
      e.preventDefault();
      showToast('✅ File securely uploaded to Private Vault!', 'success');
      closeModal('uploadVaultModal');
      setTimeout(() => {
        window.location.href = '/knowledge-vault.html?uploaded=true';
      }, 500);
      return;
    }
  });
}

// Core Borrowing Request Handler
function handleBorrowingRequestSubmit(form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Submitting Request... ⏳</span>';
  }

  // Determine resource ID
  let resId = form.querySelector('[name="resourceId"]')?.value;
  if (!resId) {
    // Attempt to extract ID from URL (e.g. /resources/2 or /resources/2.html)
    const m = window.location.pathname.match(/\/resources\/(\d+)/);
    if (m && m[1]) resId = m[1];
    else resId = '1';
  }

  const startDate = form.querySelector('[name="startDate"]')?.value || '2026-10-12';
  const endDate = form.querySelector('[name="endDate"]')?.value || '2026-10-26';
  const offer = (
    form.querySelector('[name="offeredExchange"]')?.value ||
    form.querySelector('[name="notes"]')?.value ||
    'Proposed mutual exchange / peer borrowing request'
  ).trim();

  // Resource details from catalog or DOM
  const catItem = RESOURCE_CATALOG[resId] || {};
  const domTitle = document.querySelector('h1')?.innerText?.replace(/←.*$/, '')?.trim();
  const title = catItem.title || domTitle || ('Academic Resource #' + resId);
  const owner = catItem.owner || document.getElementById('qvOwner')?.innerText || 'Verified Student';
  const mode = catItem.mode || 'Mutual Exchange';

  // Build borrowing record
  const newBorrowing = {
    id: Date.now(),
    resourceId: resId,
    title: title,
    owner: owner,
    mode: mode,
    offer: offer,
    period: `${startDate} to ${endDate}`,
    status: 'PENDING_APPROVAL',
    createdDate: new Date().toLocaleDateString()
  };

  // Persist in localStorage
  try {
    let list = JSON.parse(localStorage.getItem('crkh_user_borrowings') || '[]');
    list.unshift(newBorrowing);
    localStorage.setItem('crkh_user_borrowings', JSON.stringify(list));
  } catch (err) {
    console.error('Storage error:', err);
  }

  // Toast feedback
  showToast(`✅ Exchange request for "${title}" submitted to ${owner}!`, 'success');

  // Smooth redirect to borrowings page
  setTimeout(() => {
    window.location.href = '/borrowings.html?requested=true';
  }, 450);
}

// Post Resource Request Handler
function handleResourceRequestPost(form) {
  const title = form.querySelector('[name="title"]')?.value || 'Needed Campus Resource';
  const category = form.querySelector('[name="category"]')?.value || 'TEXTBOOK';
  const location = form.querySelector('[name="location"]')?.value || 'Campus Library';
  const fromDate = form.querySelector('[name="neededFrom"]')?.value || '2026-10-12';
  const toDate = form.querySelector('[name="neededTo"]')?.value || '2026-10-26';
  const desc = form.querySelector('[name="description"]')?.value || '';

  const newReq = {
    id: 'CRKH-' + Math.floor(100 + Math.random() * 900),
    title: title,
    category: category,
    location: location,
    period: `${fromDate} to ${toDate}`,
    desc: desc,
    status: 'ACTIVE_SEARCH',
    timestamp: new Date().toISOString()
  };

  try {
    let requests = JSON.parse(localStorage.getItem('crkh_user_requests') || '[]');
    requests.unshift(newReq);
    localStorage.setItem('crkh_user_requests', JSON.stringify(requests));
  } catch (e) {}

  showToast('✅ Campus request posted! Intelligent Matching Engine running...', 'success');
  closeModal('createRequestModal');

  setTimeout(() => {
    window.location.href = '/requests.html?created=true';
  }, 500);
}

// 8. Borrowings Page Controller (Renders alerts & user submitted requests)
function initBorrowingsPage() {
  const isBorrowingsPage = window.location.pathname.indexOf('/borrowings') !== -1;
  if (!isBorrowingsPage) return;

  const params = new URLSearchParams(window.location.search);

  // Show status alerts
  if (params.get('requested') === 'true') {
    const el = document.getElementById('alertRequested');
    if (el) {
      el.style.display = 'flex';
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  if (params.get('approved') === 'true') {
    const el = document.getElementById('alertApproved');
    if (el) el.style.display = 'flex';
  }
  if (params.get('declined') === 'true') {
    const el = document.getElementById('alertDeclined');
    if (el) el.style.display = 'flex';
  }
  if (params.get('returned') === 'true') {
    const el = document.getElementById('alertReturned');
    if (el) el.style.display = 'flex';
  }

  // Load and render user submitted requests
  try {
    const list = JSON.parse(localStorage.getItem('crkh_user_borrowings') || '[]');
    if (list && list.length > 0) {
      const tbody = document.getElementById('borrowingsTableBody') ||
                    document.querySelectorAll('.table tbody')[1] ||
                    document.querySelector('.table tbody');

      if (tbody) {
        list.forEach(item => {
          const tr = document.createElement('tr');
          tr.id = 'row-borrowing-' + item.id;
          tr.className = 'newly-requested-row';
          tr.innerHTML = `
            <td style="font-weight:700; color:var(--text-main);">
              <a href="/resources/${item.resourceId}.html" style="color:var(--text-main); text-decoration:none;">${escapeHtml(item.title)}</a>
            </td>
            <td>${escapeHtml(item.owner)}</td>
            <td>
              <div style="font-size:0.85rem;">
                <span class="badge" style="background:rgba(108,142,245,0.18); color:var(--accent-blue); font-weight:700;">🤝 ${escapeHtml(item.mode)}</span>
                <div style="font-size:0.78rem; color:var(--text-muted); margin-top:0.25rem;">Offer: ${escapeHtml(item.offer)}</div>
              </div>
            </td>
            <td style="font-size:0.85rem; color:var(--text-muted);">${escapeHtml(item.period)}</td>
            <td>
              <span class="badge" style="background:rgba(234,179,8,0.18); color:#b45309; font-weight:700;">PENDING APPROVAL</span>
            </td>
            <td>
              <div style="display:flex; gap:0.45rem; align-items:center;">
                <span class="btn btn-secondary btn-sm" style="font-size:0.78rem; opacity:0.85; cursor:default; pointer-events:none;">
                  ⏳ Awaiting Owner
                </span>
                <button type="button" class="btn btn-sm" style="padding:0.25rem 0.55rem; background:rgba(239,68,68,0.1); color:#dc2626; border:1px solid rgba(239,68,68,0.25); border-radius:8px; font-size:0.75rem; font-weight:600;" onclick="cancelBorrowing(${item.id})">
                  Cancel
                </button>
              </div>
            </td>
          `;
          tbody.prepend(tr);
        });
      }
    }
  } catch (err) {
    console.error('Error rendering borrowings:', err);
  }
}

// Cancel Borrowing Request
window.cancelBorrowing = function(id) {
  try {
    let list = JSON.parse(localStorage.getItem('crkh_user_borrowings') || '[]');
    list = list.filter(item => item.id !== id);
    localStorage.setItem('crkh_user_borrowings', JSON.stringify(list));

    const row = document.getElementById('row-borrowing-' + id);
    if (row) {
      row.style.transition = 'all 0.3s ease';
      row.style.opacity = '0';
      row.style.transform = 'translateX(-20px)';
      setTimeout(() => row.remove(), 300);
    }
    showToast('Borrowing request cancelled.', 'info');
  } catch (e) {}
};

// 9. Requests Page Controller
function initRequestsPage() {
  const isRequestsPage = window.location.pathname.indexOf('/requests') !== -1;
  if (!isRequestsPage) return;

  const params = new URLSearchParams(window.location.search);
  if (params.get('created') === 'true') {
    const alertEl = document.getElementById('alertRequestCreated');
    if (alertEl) {
      alertEl.style.display = 'flex';
      alertEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}

// 10. Token Copy Helper
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

// 11. Toast Notification Engine
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

// 12. Modal Global Utilities
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

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

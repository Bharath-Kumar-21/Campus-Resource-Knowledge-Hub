const fs = require('fs');
const p = 'D:/CRKH/backend/templates_src/index.html';
let html = fs.readFileSync(p, 'utf8');

// Replace product-tag-borrow
const oldTag = '<span class="product-tag-borrow">FREE TO BORROW</span>';
const newTag = '<span th:if="${r.sharingType == \'ITEM_EXCHANGE\'}" class="badge" style="position:absolute; top:12px; left:12px; background:rgba(155,138,251,0.92); color:#fff; font-weight:700; z-index:2;">🔄 Item Exchange</span>' +
  '<span th:if="${r.sharingType == \'SKILL_SWAP\'}" class="badge" style="position:absolute; top:12px; left:12px; background:rgba(224,109,83,0.92); color:#fff; font-weight:700; z-index:2;">💡 Skill Swap</span>' +
  '<span th:if="${r.sharingType == \'SECURITY_PLEDGE\'}" class="badge" style="position:absolute; top:12px; left:12px; background:rgba(108,142,245,0.92); color:#fff; font-weight:700; z-index:2;">🛡️ Security Pledge</span>' +
  '<span th:if="${r.sharingType == null or r.sharingType == \'FREE_BORROW\'}" class="badge" style="position:absolute; top:12px; left:12px; background:rgba(121,201,176,0.92); color:#fff; font-weight:700; z-index:2;">🌿 Free Borrow</span>';

html = html.replace(oldTag, newTag);

// Add exchange box after product-card-desc
const oldDesc = '<p class="product-card-desc" th:text="${r.description}">Resource description and notes...</p>';
const newDesc = '<p class="product-card-desc" th:text="${r.description}">Resource description and notes...</p>' +
  '<div style="background:rgba(108,142,245,0.06); border:1px solid rgba(108,142,245,0.18); border-radius:10px; padding:0.45rem 0.65rem; font-size:0.78rem; margin:0.4rem 0;">' +
  '  <strong style="color:var(--text-main);">Exchange: </strong>' +
  '  <span style="color:var(--text-muted);" th:text="${r.exchangePreference != null ? r.exchangePreference : \'Free community loan\'}">Terms</span>' +
  '</div>';

html = html.replace(oldDesc, newDesc);

fs.writeFileSync(p, html, 'utf8');
console.log('Successfully updated index.html with dynamic exchange terms!');

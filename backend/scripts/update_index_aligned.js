const fs = require('fs');
const p = 'D:/CRKH/backend/templates_src/index.html';
let html = fs.readFileSync(p, 'utf8');

// Find the product card loop inside index.html
const startLoop = html.indexOf('<div th:each="r : ${recentResources}"');
const endLoop = html.indexOf('<!-- Empty State -->', startLoop);

if (startLoop !== -1 && endLoop !== -1) {
  const newCardLoop = `<div th:each="r : \${recentResources}" 
                 class="product-card" 
                 th:data-id="\${r.id}"
                 th:data-title="\${r.title}"
                 th:data-category="\${r.category.name()}"
                 th:data-location="\${r.location}"
                 th:data-owner="\${r.ownerName}"
                 th:data-rep="\${r.ownerReputation}"
                 th:data-dates="\${r.availabilityFrom} + ' to ' + \${r.availabilityTo}"
                 th:data-desc="\${r.description}">
                
                <!-- Product Image Container (Uniform 220px Containment) -->
                <div class="product-card-media">
                    <div class="product-badges-bar">
                        <div>
                            <span th:if="\${r.sharingType == 'ITEM_EXCHANGE'}" class="badge-exchange item-swap">
                                🔄 Item Exchange
                            </span>
                            <span th:if="\${r.sharingType == 'SKILL_SWAP'}" class="badge-exchange skill-swap">
                                💡 Skill Swap
                            </span>
                            <span th:if="\${r.sharingType == 'SECURITY_PLEDGE'}" class="badge-exchange pledge">
                                🛡️ Refundable Pledge
                            </span>
                            <span th:if="\${r.sharingType == null or r.sharingType == 'FREE_BORROW'}" class="badge-exchange free-borrow">
                                🌿 Free Borrow
                            </span>
                        </div>
                        <div>
                            <span class="badge-condition" th:text="\${r.itemCondition}">
                                Like New
                            </span>
                        </div>
                    </div>

                    <img th:src="\${r.imageUrl != null and !r.imageUrl.isEmpty() ? r.imageUrl : '/images/products/default.svg'}" 
                         th:data-category="\${r.category.name()}"
                         th:alt="\${r.title}" 
                         class="product-card-img"
                         loading="lazy"
                         onerror="CRKH.handleImageFallback(this)">
                </div>

                <!-- Product Card Body with Uniform Heights -->
                <div class="product-card-body">
                    <div class="product-card-meta">
                        <span class="product-category-text" th:text="\${r.category}">TEXTBOOK</span>
                        <div class="product-rating">
                            <span>★</span>
                            <span th:text="\${r.ownerReputation}">95</span>
                        </div>
                    </div>

                    <h3 class="product-card-title">
                        <a th:href="@{'/resources/' + \${r.id}}" th:text="\${r.title}">Engineering Mathematics</a>
                    </h3>

                    <!-- Uniform Height Exchange Box -->
                    <div class="product-exchange-box">
                        <div class="exchange-label">
                            <span th:if="\${r.sharingType == 'ITEM_EXCHANGE'}">🔄 Swap Wanted:</span>
                            <span th:if="\${r.sharingType == 'SKILL_SWAP'}">💡 Desired Peer Help:</span>
                            <span th:if="\${r.sharingType == 'SECURITY_PLEDGE'}">🛡️ Deposit Term:</span>
                            <span th:if="\${r.sharingType == null or r.sharingType == 'FREE_BORROW'}">🌿 Lender Note:</span>
                        </div>
                        <div class="exchange-value" th:text="\${r.exchangePreference != null ? r.exchangePreference : 'Free community loan. Return on time (+5 Reputation).'}">
                            Terms
                        </div>
                    </div>

                    <!-- Footer Pinned to Bottom -->
                    <div class="product-card-footer">
                        <div style="display:flex; align-items:center; gap:0.5rem;">
                            <div style="width:24px; height:24px; border-radius:50%; background:linear-gradient(135deg, #6C8EF5, #9B8AFB); color:#fff; display:grid; place-items:center; font-size:0.75rem; font-weight:700;">
                                <span th:text="\${#strings.substring(r.ownerName, 0, 1)}">O</span>
                            </div>
                            <span style="font-size:0.8rem; color:var(--text-muted); font-weight:600;" th:text="\${r.ownerName}">Owner</span>
                        </div>

                        <a th:href="@{'/resources/' + \${r.id}}" class="btn btn-primary btn-sm" style="padding:0.4rem 0.95rem; font-weight:700;">
                            <span th:if="\${r.sharingType == 'ITEM_EXCHANGE'}">Propose Swap →</span>
                            <span th:if="\${r.sharingType != 'ITEM_EXCHANGE'}">View & Request →</span>
                        </a>
                    </div>
                </div>
            </div>
            `;

  html = html.substring(0, startLoop) + newCardLoop + html.substring(endLoop);
  fs.writeFileSync(p, html, 'utf8');
  console.log('Successfully aligned cards and badges in index.html!');
} else {
  console.error('Could not find loop markers in index.html');
}

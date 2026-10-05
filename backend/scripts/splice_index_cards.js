const fs = require('fs');
const p = 'D:/CRKH/backend/templates_src/index.html';
let lines = fs.readFileSync(p, 'utf8').split('\n');

const startIdx = lines.findIndex(l => l.includes('th:each="r : ${recentResources}"'));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.includes('<!-- HOW CRKH WORKS'));

if (startIdx !== -1 && endIdx !== -1) {
  const newCardMarkup = `            <div th:each="r : \${recentResources}" 
                 class="product-card" 
                 th:data-id="\${r.id}"
                 th:data-title="\${r.title}"
                 th:data-category="\${r.category.name()}"
                 th:data-location="\${r.location}"
                 th:data-owner="\${r.ownerName}"
                 th:data-rep="\${r.ownerReputation}"
                 th:data-dates="\${r.availabilityFrom} + ' to ' + \${r.availabilityTo}"
                 th:data-desc="\${r.description}">
                
                <!-- Product Image Container (Uniform 220px Height & Containment) -->
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
                            <span class="badge-condition" th:text="\${r.itemCondition != null ? r.itemCondition : 'Good'}">
                                Good
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

                <!-- Product Card Body with Flex Column -->
                <div class="product-card-body">
                    <div class="product-card-meta">
                        <span class="product-category-text" th:text="\${r.category}">TEXTBOOK</span>
                        <div class="product-rating">
                            <span>★</span>
                            <span th:text="\${r.ownerReputation}">95</span>
                        </div>
                    </div>

                    <h3 class="product-card-title">
                        <a th:href="@{'/resources/' + \${r.id}}" th:text="\${r.title}">Resource Title</a>
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

                    <!-- Details Row -->
                    <div class="product-card-details" style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.75rem;">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span>📍 <span th:text="\${r.location}">Location</span></span>
                            <span>Shared by <strong th:text="\${r.ownerName}">Student</strong></span>
                        </div>
                    </div>

                    <!-- Footer Pinned to Bottom -->
                    <div class="product-card-footer">
                        <a th:href="@{'/resources/' + \${r.id}}" class="btn btn-secondary btn-sm" style="flex:1; text-align:center;">
                            Details
                        </a>
                        <a th:href="@{'/resources/' + \${r.id}}" class="btn btn-primary btn-sm" style="flex:1; text-align:center; font-weight:700;">
                            <span th:if="\${r.sharingType == 'ITEM_EXCHANGE'}">Swap →</span>
                            <span th:if="\${r.sharingType != 'ITEM_EXCHANGE'}">Request →</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
`;

  lines.splice(startIdx, endIdx - startIdx, newCardMarkup);
  fs.writeFileSync(p, lines.join('\n'), 'utf8');
  console.log('Successfully replaced cards in index.html! startIdx=' + startIdx + ' endIdx=' + endIdx);
} else {
  console.error('Markers not found: startIdx=' + startIdx + ' endIdx=' + endIdx);
}

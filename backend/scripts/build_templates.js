const fs = require('fs');
const path = require('path');

const TEMPLATE_DIR = 'D:\\CRKH\\backend\\src\\main\\resources\\templates';

// 1. RESOURCES.HTML
const resourcesHtml = `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Explore Campus Resources — CRKH</title>
    <link rel="stylesheet" th:href="@{/css/style.css}">
</head>
<body>
    <div th:replace="~{fragments/navbar :: header('resources')}"></div>

    <main class="container" style="padding-top: 2rem;">
        <!-- Page Title & Stats -->
        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
            <div>
                <div style="font-size:0.8rem; font-weight:700; color:var(--primary); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;">
                    Campus Resource Exchange
                </div>
                <h1 style="font-size:2.1rem; font-weight:800; letter-spacing:-0.03em;">Explore Campus Resources</h1>
                <p style="color:var(--text-muted); font-size:0.92rem;">
                    Showing <span id="visibleResourceCount" th:text="${resources.size()}">12</span> verified peer resources available on campus.
                </p>
            </div>
            <a th:href="@{/resources/new}" class="btn btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                <span>Share a Resource</span>
            </a>
        </div>

        <div th:if="${param.created}" class="alert alert-success">
            <span>✅</span> Resource listed successfully! Available for campus borrowing.
        </div>
        <div th:if="${param.deleted}" class="alert alert-info">
            <span>ℹ️</span> Resource deactivated.
        </div>

        <!-- Discovery Layout: Left Filter Sidebar + Right Product Grid -->
        <div class="discovery-layout">
            <!-- Sidebar Filters (Liquid Glass) -->
            <aside class="filter-sidebar">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
                    <div style="font-size:1rem; font-weight:700;">Filters</div>
                    <a th:href="@{/resources}" style="font-size:0.8rem; color:var(--primary); font-weight:600;">Reset All</a>
                </div>

                <form th:action="@{/resources}" method="get">
                    <!-- Search Input in Sidebar -->
                    <div class="filter-section">
                        <label class="filter-title">Keyword Search</label>
                        <input type="text" name="q" class="form-control" placeholder="Search title, keywords..." th:value="${query}">
                    </div>

                    <!-- Category Filter -->
                    <div class="filter-section">
                        <label class="filter-title">Category</label>
                        <select name="category" class="form-control" onchange="this.form.submit()">
                            <option value="">All Categories</option>
                            <option th:each="cat : ${categories}" 
                                    th:value="${cat}" 
                                    th:text="${cat}" 
                                    th:selected="${cat == selectedCategory}">
                                CATEGORY
                            </option>
                        </select>
                    </div>

                    <!-- Condition -->
                    <div class="filter-section">
                        <div class="filter-title">Condition</div>
                        <label class="filter-option"><input type="checkbox" checked> Like New</label>
                        <label class="filter-option"><input type="checkbox" checked> Brand New</label>
                        <label class="filter-option"><input type="checkbox" checked> Good Condition</label>
                        <label class="filter-option"><input type="checkbox" checked> Fair / Usable</label>
                    </div>

                    <!-- Distance -->
                    <div class="filter-section">
                        <div class="filter-title">Proximity to You</div>
                        <label class="filter-option"><input type="radio" name="dist" checked> Within 500m (Same Block)</label>
                        <label class="filter-option"><input type="radio" name="dist"> Within 1.5 km (Campus Core)</label>
                        <label class="filter-option"><input type="radio" name="dist"> Entire Campus</label>
                    </div>

                    <!-- Reputation Rating -->
                    <div class="filter-section">
                        <div class="filter-title">Owner Reputation</div>
                        <label class="filter-option"><input type="checkbox" checked> ★ 4.5 & Above (Trusted)</label>
                        <label class="filter-option"><input type="checkbox"> ★ 4.0 & Above</label>
                    </div>

                    <button type="submit" class="btn btn-primary btn-block" style="margin-top:0.5rem;">Apply Filters</button>
                </form>
            </aside>

            <!-- Main Content Area -->
            <div>
                <!-- Top Toolbar with Sort & View Toggle -->
                <div class="toolbar-header">
                    <div style="font-size:0.9rem; font-weight:600; color:var(--text-muted);">
                        Filter: <span style="color:var(--text-main); font-weight:700;" th:text="${selectedCategory != null ? selectedCategory : 'All Categories'}">All</span>
                    </div>

                    <div style="display:flex; align-items:center; gap:0.75rem;">
                        <span style="font-size:0.85rem; color:var(--text-muted);">Sort by:</span>
                        <select class="sort-select">
                            <option>Recommended (Smart Match)</option>
                            <option>Recently Added</option>
                            <option>Nearest to Me</option>
                            <option>Highest Owner Reputation</option>
                        </select>
                    </div>
                </div>

                <!-- Empty State -->
                <div th:if="${#lists.isEmpty(resources)}" class="card" style="text-align:center; padding:3.5rem; margin-top:1.5rem;">
                    <div style="font-size:2.8rem; margin-bottom:1rem;">📦</div>
                    <h3 style="font-size:1.3rem; margin-bottom:0.5rem;">No matching campus resources found</h3>
                    <p style="color:var(--text-muted); margin-bottom:1.5rem;">Try adjusting your keyword search or category filter.</p>
                    <a th:href="@{/resources/new}" class="btn btn-primary btn-sm">Be the first to share one!</a>
                </div>

                <!-- Resource Cards Grid -->
                <div th:unless="${#lists.isEmpty(resources)}" class="product-grid" style="grid-template-columns: repeat(3, 1fr); margin-top:1.5rem;">
                    <div th:each="r : ${resources}" 
                         class="product-card" 
                         th:data-id="${r.id}"
                         th:data-title="${r.title}"
                         th:data-category="${r.category.name()}"
                         th:data-location="${r.location}"
                         th:data-owner="${r.ownerName}"
                         th:data-rep="${r.ownerReputation}"
                         th:data-dates="${r.availabilityFrom} + ' to ' + ${r.availabilityTo}"
                         th:data-desc="${r.description}">
                        
                        <div class="product-card-media">
                            <span class="product-tag-borrow">FREE TO BORROW</span>
                            <span class="product-tag-status" th:classappend="${r.status.name() == 'AVAILABLE'} ? 'available' : 'borrowed'" th:text="${r.status.name() == 'AVAILABLE'} ? 'Available' : 'Borrowed'">
                                Available
                            </span>
                            <img th:src="${r.imageUrl != null and !r.imageUrl.isEmpty()} ? ${r.imageUrl} : '/images/products/default.svg'" 
                                 th:data-category="${r.category.name()}"
                                 th:alt="${r.title}" 
                                 class="product-card-img">
                        </div>

                        <div class="product-card-body">
                            <div class="product-card-meta">
                                <span class="product-category-text" th:text="${r.category}">CATEGORY</span>
                                <div class="product-rating">
                                    <span>★</span>
                                    <span>4.8</span>
                                </div>
                            </div>

                            <h3 class="product-card-title" th:text="${r.title}">Item Title</h3>
                            <p class="product-card-desc" th:text="${r.description}">Description...</p>

                            <div class="product-card-details">
                                <div class="product-detail-row">
                                    <svg class="product-detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                    <span th:text="${r.location}">Location</span>
                                </div>
                                <div class="product-detail-row">
                                    <svg class="product-detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                    <span>Owner: <strong th:text="${r.ownerName}">Owner</strong></span>
                                    <span class="user-rep-tag" style="margin-left:auto;" th:text="${r.ownerReputation + ' pts'}">95 pts</span>
                                </div>
                            </div>

                            <div class="product-card-footer">
                                <a th:href="@{'/resources/' + ${r.id}}" class="btn btn-secondary btn-sm" style="flex:1;">
                                    Details
                                </a>
                                <button type="button" class="btn btn-primary btn-sm" style="flex:1;" data-quick-view>
                                    Quick Request
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- QUICK VIEW MODAL -->
    <div id="quickViewModal" class="modal-overlay" onclick="if(event.target === this) closeModal('quickViewModal');">
        <div class="modal-card">
            <button class="modal-close-btn" onclick="closeModal('quickViewModal')">✕</button>
            <div style="display:grid; grid-template-columns:140px 1fr; gap:1.25rem; margin-bottom:1.25rem;">
                <img id="qvImg" src="" alt="Resource" style="width:100%; aspect-ratio:1; object-fit:cover; border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.95); box-shadow:var(--shadow-liquid-sm);">
                <div>
                    <span id="qvCategory" class="product-category-text">CATEGORY</span>
                    <h3 id="qvTitle" style="font-size:1.15rem; font-weight:800; margin:0.25rem 0;">Resource Title</h3>
                    <div style="font-size:0.82rem; color:var(--text-muted); margin-bottom:0.25rem;">
                        📍 <span id="qvLocation">Location</span>
                    </div>
                    <div style="font-size:0.82rem; color:var(--text-muted);">
                        Owner: <span id="qvOwner">Student</span>
                    </div>
                    <div style="font-size:0.78rem; color:#059669; font-weight:600; margin-top:0.25rem;">
                        📅 Available: <span id="qvDates">Dates</span>
                    </div>
                </div>
            </div>

            <p id="qvDesc" style="font-size:0.85rem; color:var(--text-muted); line-height:1.5; margin-bottom:1.25rem; background:rgba(255,255,255,0.6); padding:0.75rem; border-radius:var(--radius-sm); border:1px solid rgba(255,255,255,0.9);">
                Description
            </p>

            <form th:action="@{/borrowings/create}" method="post">
                <input type="hidden" id="qvResourceId" name="resourceId" value="">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:0.75rem;">
                    <div>
                        <label class="form-label" style="font-size:0.78rem;">Borrow From</label>
                        <input type="date" name="startDate" class="form-control" style="padding:0.4rem 0.6rem;" required>
                    </div>
                    <div>
                        <label class="form-label" style="font-size:0.78rem;">Return By</label>
                        <input type="date" name="endDate" class="form-control" style="padding:0.4rem 0.6rem;" required>
                    </div>
                </div>
                <div class="form-group" style="margin-bottom:1rem;">
                    <label class="form-label" style="font-size:0.78rem;">Purpose / Note for Owner</label>
                    <input type="text" name="notes" class="form-control" placeholder="e.g. Needed for final semester lab presentation..." style="padding:0.45rem 0.75rem;">
                </div>
                <div style="display:flex; gap:0.75rem;">
                    <a id="qvDetailLink" href="#" class="btn btn-secondary" style="flex:1;">Full Details Page</a>
                    <button type="submit" class="btn btn-primary" style="flex:1;">Send Request</button>
                </div>
            </form>
        </div>
    </div>

    <!-- SITE FOOTER -->
    <footer class="site-footer">
        <div class="container footer-inner">
            <div style="font-weight:700;">CRKH — Campus Resource & Knowledge Hub</div>
            <div>© 2026 Verified Campus Exchange Platform</div>
        </div>
    </footer>

    <script th:src="@{/js/main.js}"></script>
</body>
</html>
`;
fs.writeFileSync(path.join(TEMPLATE_DIR, 'resources.html'), resourcesHtml, 'utf8');
console.log('resources.html written!');

// 2. RESOURCE-DETAILS.HTML
const resourceDetailsHtml = `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title th:text="\${resource.title} + ' — CRKH'">Resource Details</title>
    <link rel="stylesheet" th:href="@{/css/style.css}">
</head>
<body>
    <div th:replace="~{fragments/navbar :: header('resources')}"></div>

    <main class="container" style="max-width:1100px; padding-top:2.5rem;">
        <div style="margin-bottom:1.5rem;">
            <a th:href="@{/resources}" class="btn btn-secondary btn-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                <span>Back to All Resources</span>
            </a>
        </div>

        <div th:if="${param.updated}" class="alert alert-success">
            <span>✅</span> Resource details updated successfully.
        </div>

        <!-- 2-Column E-Commerce Style Detail Card (Apple Liquid Glass) -->
        <div class="detail-layout">
            <!-- Left Column: Gallery & Verified Trust Guarantee -->
            <div class="detail-gallery">
                <div class="detail-main-img-box">
                    <img th:src="\${resource.imageUrl != null and !resource.imageUrl.isEmpty()} ? \${resource.imageUrl} : '/images/products/default.svg'" 
                         th:data-category="\${resource.category.name()}"
                         th:alt="\${resource.title}" 
                         class="detail-main-img">
                </div>

                <!-- Verified Campus Trust Badge -->
                <div class="card" style="padding:1.25rem; display:flex; align-items:center; gap:1rem;">
                    <div style="width:40px; height:40px; border-radius:var(--radius-md); background:var(--mint-light); color:#166534; display:grid; place-items:center; flex-shrink:0;">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    </div>
                    <div>
                        <div style="font-size:0.88rem; font-weight:700; color:var(--text-main);">Campus Integrity & Verification</div>
                        <div style="font-size:0.78rem; color:var(--text-muted);">Verified college student item. Handover confirmed via cryptographic single-use QR.</div>
                    </div>
                </div>
            </div>

            <!-- Right Column: Specs, Owner Info & Borrow Action -->
            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
                    <span class="product-category-text" th:text="\${resource.category}">CATEGORY</span>
                    <span class="product-tag-status" th:classappend="\${resource.status.name() == 'AVAILABLE'} ? 'available' : 'borrowed'" th:text="\${resource.status.name() == 'AVAILABLE'} ? '● Available' : '● Borrowed'">
                        Available
                    </span>
                </div>

                <h1 style="font-size:2rem; font-weight:800; letter-spacing:-0.03em; line-height:1.2; margin-bottom:0.75rem;" th:text="\${resource.title}">
                    Resource Title
                </h1>

                <!-- Rating & Borrows -->
                <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1.25rem;">
                    <div class="product-rating" style="font-size:0.95rem;">
                        <span>★</span>
                        <span>4.8</span>
                    </div>
                    <span style="font-size:0.85rem; color:var(--text-muted);">(24 verified on-campus exchanges)</span>
                </div>

                <!-- 3 Spec Meta Boxes -->
                <div class="detail-meta-box">
                    <div class="detail-meta-item">
                        <span class="detail-meta-label">Campus Location</span>
                        <span class="detail-meta-val" th:text="\${resource.location}">Central Library</span>
                    </div>
                    <div class="detail-meta-item">
                        <span class="detail-meta-label">Availability Window</span>
                        <span class="detail-meta-val" th:text="\${resource.availabilityFrom} + ' - ' + \${resource.availabilityTo}">Dates</span>
                    </div>
                    <div class="detail-meta-item">
                        <span class="detail-meta-label">Cost / Policy</span>
                        <span class="detail-meta-val" style="color:#059669;">FREE TO BORROW</span>
                    </div>
                </div>

                <!-- Owner Profile Card -->
                <div style="display:flex; align-items:center; gap:1rem; padding:1rem; background:rgba(255,255,255,0.6); border:1px solid rgba(255,255,255,0.95); border-radius:var(--radius-lg); margin-bottom:1.5rem; box-shadow:var(--shadow-liquid-sm);">
                    <div class="user-avatar-circle" style="width:42px; height:42px; font-size:1.1rem;" th:text="\${#strings.substring(resource.ownerName, 0, 1)}">P</div>
                    <div>
                        <div style="font-size:0.95rem; font-weight:700;" th:text="\${resource.ownerName}">Owner Name</div>
                        <div style="font-size:0.78rem; color:var(--text-muted);" th:text="\${resource.ownerEmail}">owner@college.edu</div>
                    </div>
                    <div style="margin-left:auto; text-align:right;">
                        <span class="user-rep-tag" th:text="\${resource.ownerReputation + ' Rep Score'}">100 Rep Score</span>
                        <div style="font-size:0.72rem; color:var(--text-subtle); margin-top:0.2rem;">Usually replies &lt; 30m</div>
                    </div>
                </div>

                <!-- Description -->
                <div style="margin-bottom:1.5rem;">
                    <h3 style="font-size:1rem; font-weight:700; margin-bottom:0.4rem;">Description & Specifications</h3>
                    <p style="font-size:0.92rem; color:var(--text-muted); line-height:1.6;" th:text="\${resource.description}">
                        Detailed description text.
                    </p>
                </div>

                <!-- Owner Management Controls -->
                <div th:if="\${isOwner}" style="display:flex; gap:0.75rem; border-top:1px solid var(--liquid-glass-border-light); padding-top:1.5rem;">
                    <a th:href="@{'/resources/' + \${resource.id} + '/edit'}" class="btn btn-secondary">Edit Listing</a>
                    <form th:action="@{'/resources/' + \${resource.id} + '/delete'}" method="post" onsubmit="return confirm('Deactivate this listing?');">
                        <button type="submit" class="btn btn-danger">Deactivate Listing</button>
                    </form>
                </div>

                <!-- Non-Owner Borrow Action Card -->
                <div th:unless="\${isOwner}">
                    <div th:if="\${resource.status.name() == 'AVAILABLE'}" class="borrow-action-card">
                        <h3 style="font-size:1.15rem; font-weight:800; margin-bottom:0.4rem;">Request to Borrow This Resource</h3>
                        <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:1rem;">
                            Choose your required dates. The owner will review and prepare the item for QR verification.
                        </p>

                        <form th:action="@{/borrowings/create}" method="post">
                            <input type="hidden" name="resourceId" th:value="\${resource.id}">

                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
                                <div>
                                    <label class="form-label">Needed From</label>
                                    <input type="date" name="startDate" class="form-control" th:value="\${resource.availabilityFrom}" required>
                                </div>
                                <div>
                                    <label class="form-label">Needed Until</label>
                                    <input type="date" name="endDate" class="form-control" th:value="\${resource.availabilityTo}" required>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Purpose / Project Note for Owner</label>
                                <textarea name="notes" class="form-control" placeholder="e.g. Needed for final semester capstone presentation in Seminar Hall 2..." rows="3"></textarea>
                            </div>

                            <button type="submit" class="btn btn-primary btn-block btn-lg">
                                Send Borrowing Request to Owner ➔
                            </button>
                        </form>
                    </div>

                    <div th:unless="\${resource.status.name() == 'AVAILABLE'}" class="card" style="text-align:center; padding:2rem;">
                        <div style="font-size:1.5rem; margin-bottom:0.5rem;">🔒</div>
                        <h4 style="font-size:1.1rem; font-weight:700;">Currently Borrowed</h4>
                        <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.25rem;">This item is active with another student and will be available after return.</p>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <footer class="site-footer">
        <div class="container footer-inner">
            <div style="font-weight:700;">CRKH — Campus Resource & Knowledge Hub</div>
            <div>© 2026 Verified Campus Exchange Platform</div>
        </div>
    </footer>

    <script th:src="@{/js/main.js}"></script>
</body>
</html>
`;
fs.writeFileSync(path.join(TEMPLATE_DIR, 'resource-details.html'), resourceDetailsHtml, 'utf8');
console.log('resource-details.html written!');

// 3. REQUESTS.HTML
const requestsHtml = `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resource Requests & Tracking — CRKH</title>
    <link rel="stylesheet" th:href="@{/css/style.css}">
</head>
<body>
    <div th:replace="~{fragments/navbar :: header('requests')}"></div>

    <main class="container" style="padding-top:2.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:2rem; flex-wrap:wrap; gap:1rem;">
            <div>
                <div style="font-size:0.8rem; font-weight:700; color:var(--primary); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;">
                    Order-Style Tracking System
                </div>
                <h1 style="font-size:2.1rem; font-weight:800; letter-spacing:-0.03em;">Resource Requests & Tracking</h1>
                <p style="color:var(--text-muted); font-size:0.92rem;">
                    Post what you need and let our Intelligent Matching Engine rank suitable campus matches with visual progress tracking.
                </p>
            </div>
            <button onclick="openModal('createRequestModal')" class="btn btn-primary">
                + Post Resource Request
            </button>
        </div>

        <!-- MY ACTIVE REQUESTS WITH E-COMMERCE STYLE TIMELINE STEPPER -->
        <div style="margin-bottom:3rem;">
            <h2 style="font-size:1.35rem; font-weight:800; margin-bottom:1rem;">My Requests & Live Tracking</h2>

            <div th:if="\${#lists.isEmpty(myRequests)}" class="card" style="text-align:center; padding:3rem;">
                <div style="font-size:2.5rem; margin-bottom:0.75rem;">📋</div>
                <h3 style="font-size:1.2rem; font-weight:700;">You haven't posted any requests</h3>
                <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:1.25rem;">Looking for a calculator, textbook or lab probe? Create a request to match campus items.</p>
                <button onclick="openModal('createRequestModal')" class="btn btn-primary btn-sm">+ Post First Request</button>
            </div>

            <div th:unless="\${#lists.isEmpty(myRequests)}">
                <div th:each="req : \${myRequests}" class="timeline-card">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem;">
                        <div>
                            <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.35rem;">
                                <span style="font-family:'JetBrains Mono', monospace; font-size:0.85rem; font-weight:700; color:var(--primary);" th:text="'REQUEST #CRKH-10' + \${req.id}">#CRKH-1024</span>
                                <span class="product-category-text" th:text="\${req.category}">CATEGORY</span>
                            </div>
                            <h3 style="font-size:1.25rem; font-weight:800;" th:text="\${req.title}">Request Title</h3>
                            <div style="font-size:0.82rem; color:var(--text-muted); display:flex; gap:1rem; margin-top:0.35rem; flex-wrap:wrap;">
                                <span>📅 Needed: <strong th:text="\${req.neededFrom} + ' to ' + \${req.neededTo}">Dates</strong></span>
                                <span>📍 Location: <strong th:text="\${req.location}">Library</strong></span>
                                <span th:if="\${req.keywords != null}">🏷️ Keywords: <strong th:text="\${req.keywords}">Keywords</strong></span>
                            </div>
                        </div>

                        <!-- Match Engine Button -->
                        <div>
                            <a th:href="@{'/matches/' + \${req.id}}" class="btn btn-primary btn-sm">
                                <span>⚡ View Intelligent Matches</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </a>
                        </div>
                    </div>

                    <!-- Progress Stepper (Order tracking style) -->
                    <div class="stepper-progress">
                        <div class="stepper-line">
                            <div class="stepper-line-fill" style="width: 50%;"></div>
                        </div>

                        <div class="stepper-step completed">
                            <div class="stepper-dot">✓</div>
                            <span class="stepper-label">Requested</span>
                        </div>

                        <div class="stepper-step completed">
                            <div class="stepper-dot">✓</div>
                            <span class="stepper-label">Matched</span>
                        </div>

                        <div class="stepper-step active">
                            <div class="stepper-dot">3</div>
                            <span class="stepper-label">Approved</span>
                        </div>

                        <div class="stepper-step">
                            <div class="stepper-dot">4</div>
                            <span class="stepper-label">QR Pickup</span>
                        </div>

                        <div class="stepper-step">
                            <div class="stepper-dot">5</div>
                            <span class="stepper-label">Returned</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- COMMUNITY CAMPUS FEED OF REQUESTS -->
        <div>
            <h2 style="font-size:1.35rem; font-weight:800; margin-bottom:1rem;">Campus Requests Feed (Can You Help?)</h2>
            <div class="stats-row" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));">
                <div th:each="r : \${requests}" class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
                            <span class="product-category-text" th:text="\${r.category}">CATEGORY</span>
                            <span class="user-rep-tag" th:text="\${r.requesterReputation + ' Rep'}">95 Rep</span>
                        </div>
                        <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:0.4rem;" th:text="\${r.title}">Title</h3>
                        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.85rem;" th:text="\${r.description}">Description</p>
                    </div>

                    <div style="border-top:1px solid var(--liquid-glass-border-light); padding-top:0.75rem;">
                        <div style="font-size:0.78rem; color:var(--text-muted); display:flex; justify-content:space-between; margin-bottom:0.75rem;">
                            <span>Requested by <strong th:text="\${r.requesterName}">Student</strong></span>
                            <span>📍 <span th:text="\${r.location}">Library</span></span>
                        </div>
                        <a th:href="@{'/matches/' + \${r.id}}" class="btn btn-soft-blue btn-sm btn-block">
                            View Matched Inventory ➔
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- CREATE REQUEST MODAL -->
    <div id="createRequestModal" class="modal-overlay" onclick="if(event.target === this) closeModal('createRequestModal');">
        <div class="modal-card">
            <button class="modal-close-btn" onclick="closeModal('createRequestModal')">✕</button>
            <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:0.5rem;">Post Resource Request</h2>
            <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:1.5rem;">
                Specify the equipment or notes you need. Our algorithm will rank best matches.
            </p>

            <form th:action="@{/requests/new}" method="post">
                <div class="form-group">
                    <label class="form-label">What do you need? *</label>
                    <input type="text" name="title" class="form-control" placeholder="e.g. Need Casio fx-991EX for Midterm Exam" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Category *</label>
                    <select name="category" class="form-control" required>
                        <option th:each="cat : \${categories}" th:value="\${cat}" th:text="\${cat}">CATEGORY</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Search Keywords / Course Code</label>
                    <input type="text" name="keywords" class="form-control" placeholder="e.g. Casio, matrix math, integrals, CS201">
                </div>

                <div class="form-group">
                    <label class="form-label">Pickup Campus Location Preference</label>
                    <input type="text" name="location" class="form-control" placeholder="e.g. Central Library or Tech Park Block C" required>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
                    <div>
                        <label class="form-label">Needed From *</label>
                        <input type="date" name="neededFrom" class="form-control" required>
                    </div>
                    <div>
                        <label class="form-label">Needed Until *</label>
                        <input type="date" name="neededTo" class="form-control" required>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Notes / Details</label>
                    <textarea name="description" class="form-control" placeholder="Briefly describe what you'll use it for..." rows="3"></textarea>
                </div>

                <button type="submit" class="btn btn-primary btn-block btn-lg">
                    Find Campus Matches Now ➔
                </button>
            </form>
        </div>
    </div>

    <footer class="site-footer">
        <div class="container footer-inner">
            <div style="font-weight:700;">CRKH — Campus Resource & Knowledge Hub</div>
            <div>© 2026 Verified Campus Exchange Platform</div>
        </div>
    </footer>

    <script th:src="@{/js/main.js}"></script>
</body>
</html>
`;
fs.writeFileSync(path.join(TEMPLATE_DIR, 'requests.html'), requestsHtml, 'utf8');
console.log('requests.html written!');

// 4. MATCHES.HTML (RECOMMENDED FOR YOU)
const matchesHtml = `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Intelligent Resource Matches — CRKH</title>
    <link rel="stylesheet" th:href="@{/css/style.css}">
</head>
<body>
    <div th:replace="~{fragments/navbar :: header('requests')}"></div>

    <main class="container" style="max-width:1050px; padding-top:2rem;">
        <div style="margin-bottom:1.5rem;">
            <a th:href="@{/requests}" class="btn btn-secondary btn-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                <span>Back to Requests</span>
            </a>
        </div>

        <!-- Request Summary Banner (Liquid Glass) -->
        <div class="card" style="margin-bottom:2rem; border-left:4px solid var(--primary);">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.4rem;">
                <span class="product-category-text" th:text="\${request.category}">CATEGORY</span>
                <span style="font-size:0.82rem; color:var(--text-muted);" th:text="'Requested by ' + \${request.requesterName}">Requester</span>
            </div>
            <h1 style="font-size:1.85rem; font-weight:800; margin-bottom:0.5rem;" th:text="\${request.title}">Request Title</h1>
            <div style="display:flex; gap:1.5rem; font-size:0.85rem; color:var(--text-muted); flex-wrap:wrap;">
                <span>📅 Needed: <strong th:text="\${request.neededFrom} + ' to ' + \${request.neededTo}">Dates</strong></span>
                <span>📍 Location: <strong th:text="\${request.location}">Location</strong></span>
                <span th:if="\${request.keywords != null}">🏷️ Keywords: <strong th:text="\${request.keywords}">Keywords</strong></span>
            </div>
        </div>

        <!-- 6-Factor Formula Explanation Box -->
        <div class="card" style="padding:1.25rem 1.5rem; margin-bottom:2rem; background:rgba(108,142,245,0.06); border-color:var(--primary-subtle);">
            <div style="display:flex; align-items:center; gap:0.6rem; font-weight:700; color:var(--primary); font-size:0.95rem; margin-bottom:0.35rem;">
                <span>⚡</span> Intelligent Recommendation Engine (6-Factor Weighted Composite Model)
            </div>
            <div style="font-size:0.82rem; color:var(--text-muted); line-height:1.6;">
                <strong>Algorithmic Breakdown:</strong> 30% Relevance + 20% Proximity + 20% Availability + 15% Reputation + 10% Recency + 5% HistoryFit. Matches are sorted by highest composite confidence.
            </div>
        </div>

        <!-- Empty Matches -->
        <div th:if="\${#lists.isEmpty(matches)}" class="card" style="text-align:center; padding:3.5rem;">
            <div style="font-size:2.8rem; margin-bottom:0.75rem;">🔍</div>
            <h3 style="font-size:1.3rem; font-weight:700;">No direct campus matches found yet</h3>
            <p style="color:var(--text-muted); margin-bottom:1.5rem;">There are currently no listed resources matching this request window.</p>
            <a th:href="@{/resources}" class="btn btn-primary btn-sm">Browse All Active Listings</a>
        </div>

        <!-- Ranked Results -->
        <div th:unless="\${#lists.isEmpty(matches)}">
            <h2 style="font-size:1.35rem; font-weight:800; margin-bottom:1.25rem;">
                Recommended For You (<span th:text="\${matches.size()}">3</span> ranked items)
            </h2>

            <div th:each="m : \${matches}" 
                 class="match-card" 
                 th:style="'--match-pct:' + \${m.matchingScore} + '%;'">
                
                <!-- Circular Percentage Indicator -->
                <div>
                    <div class="match-gauge-circle">
                        <div class="match-gauge-inner">
                            <span class="match-pct-text" th:text="\${m.matchingScore} + '%'">94%</span>
                            <span class="match-pct-label">Match</span>
                        </div>
                    </div>
                </div>

                <!-- Match Details & Reasons -->
                <div>
                    <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.25rem;">
                        <span class="product-category-text" th:text="\${m.resource.category}">CATEGORY</span>
                        <span class="user-rep-tag" th:text="\${m.resource.ownerReputation + ' Rep'}">100 Rep</span>
                    </div>

                    <h3 style="font-size:1.25rem; font-weight:800;" th:text="\${m.resource.title}">Resource Title</h3>
                    <p style="font-size:0.85rem; color:var(--text-muted); margin:0.25rem 0 0.5rem;" th:text="\${m.resource.description}">Description</p>

                    <!-- Why this matches pills (Prompt Requirement) -->
                    <div class="match-reasons-box">
                        <span class="match-reason-pill">✓ Available nearby (\${m.resource.location})</span>
                        <span class="match-reason-pill">✓ High owner trust score (\${m.resource.ownerReputation} pts)</span>
                        <span class="match-reason-pill">✓ Matches requested category</span>
                        <span class="match-reason-pill">✓ Recently active & verified</span>
                    </div>
                </div>

                <!-- Quick Action Buttons -->
                <div style="display:flex; flex-direction:column; gap:0.5rem; min-width:140px;">
                    <a th:href="@{'/resources/' + \${m.resource.id}}" class="btn btn-primary btn-sm">
                        Request to Borrow
                    </a>
                    <a th:href="@{'/resources/' + \${m.resource.id}}" class="btn btn-secondary btn-sm">
                        View Details
                    </a>
                </div>
            </div>
        </div>
    </main>

    <footer class="site-footer">
        <div class="container footer-inner">
            <div style="font-weight:700;">CRKH — Campus Resource & Knowledge Hub</div>
            <div>© 2026 Verified Campus Exchange Platform</div>
        </div>
    </footer>

    <script th:src="@{/js/main.js}"></script>
</body>
</html>
`;
fs.writeFileSync(path.join(TEMPLATE_DIR, 'matches.html'), matchesHtml, 'utf8');
console.log('matches.html written!');

// 5. BORROWINGS.HTML (MY BORROWINGS & LENDING MANAGEMENT)
const borrowingsHtml = `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Borrowings & Lending — CRKH</title>
    <link rel="stylesheet" th:href="@{/css/style.css}">
</head>
<body>
    <div th:replace="~{fragments/navbar :: header('borrowings')}"></div>

    <main class="container" style="padding-top:2.5rem;">
        <div style="margin-bottom:2rem;">
            <div style="font-size:0.8rem; font-weight:700; color:var(--primary); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;">
                Order History & Exchanges
            </div>
            <h1 style="font-size:2.1rem; font-weight:800; letter-spacing:-0.03em;">My Borrowings & Lending</h1>
            <p style="color:var(--text-muted); font-size:0.92rem;">
                Track physical campus resources in your possession and manage requests for items you shared.
            </p>
        </div>

        <div th:if="${param.requested}" class="alert alert-success">
            <span>✅</span> Borrowing request sent to owner. Waiting for approval.
        </div>
        <div th:if="${param.approved}" class="alert alert-success">
            <span>✅</span> Borrowing approved! Single-use QR handover token is ready for pickup.
        </div>
        <div th:if="${param.declined}" class="alert alert-info">
            <span>ℹ️</span> Borrowing request declined.
        </div>
        <div th:if="${param.returned}" class="alert alert-success">
            <span>✅</span> Return confirmed! Reputation score increased by +5 points.
        </div>
        <div th:if="${param.verified}" class="alert alert-success">
            <span>✅</span> QR token verified successfully! Handover state updated.
        </div>

        <!-- Section 1: Incoming Requests on My Shared Resources (Lender View) -->
        <div class="card" style="margin-bottom:2.5rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
                <div>
                    <h2 style="font-size:1.3rem; font-weight:800;">Incoming Requests for My Resources (Lender)</h2>
                    <p style="font-size:0.82rem; color:var(--text-muted);">Decide to approve or decline peers requesting your shared equipment</p>
                </div>
            </div>

            <div th:if="\${#lists.isEmpty(incomingRequests)}" style="text-align:center; padding:2rem; color:var(--text-subtle);">
                No incoming borrowing requests right now.
            </div>

            <div th:unless="\${#lists.isEmpty(incomingRequests)}" class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Resource</th>
                            <th>Borrower</th>
                            <th>Dates</th>
                            <th>Notes</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr th:each="inReq : \${incomingRequests}">
                            <td style="font-weight:700;" th:text="\${inReq.resourceTitle}">Resource Title</td>
                            <td>
                                <span style="font-weight:600;" th:text="\${inReq.borrowerName}">Student Name</span>
                                <span class="user-rep-tag" style="margin-left:0.35rem;" th:text="\${inReq.borrowerReputation + ' Rep'}">95 Rep</span>
                            </td>
                            <td style="font-size:0.82rem;" th:text="\${inReq.startDate} + ' to ' + \${inReq.endDate}">Dates</td>
                            <td style="font-size:0.82rem; color:var(--text-muted);" th:text="\${inReq.notes}">Notes</td>
                            <td>
                                <span class="product-tag-status" th:classappend="\${inReq.status.name() == 'ACTIVE'} ? 'available' : ''" th:text="\${inReq.status}">PENDING</span>
                            </td>
                            <td>
                                <div th:if="\${inReq.status.name() == 'PENDING'}" style="display:flex; gap:0.4rem;">
                                    <form th:action="@{'/borrowings/' + \${inReq.id} + '/approve'}" method="post">
                                        <button type="submit" class="btn btn-primary btn-sm">Approve</button>
                                    </form>
                                    <form th:action="@{'/borrowings/' + \${inReq.id} + '/decline'}" method="post">
                                        <button type="submit" class="btn btn-secondary btn-sm">Decline</button>
                                    </form>
                                </div>
                                <div th:if="\${inReq.status.name() == 'APPROVED' or inReq.status.name() == 'ACTIVE'}">
                                    <a th:href="@{'/handover/' + \${inReq.id}}" class="btn btn-soft-blue btn-sm">QR Code ➔</a>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Section 2: Items I Am Currently Borrowing (Borrower View) -->
        <div class="card">
            <h2 style="font-size:1.3rem; font-weight:800; margin-bottom:1.25rem;">Items in My Possession / My Borrowings</h2>

            <div th:if="\${#lists.isEmpty(myBorrowings)}" style="text-align:center; padding:2rem; color:var(--text-subtle);">
                You don't have any active borrowings. <a th:href="@{/resources}" style="color:var(--primary); font-weight:600;">Browse Resources</a> to borrow items!
            </div>

            <div th:unless="\${#lists.isEmpty(myBorrowings)}" class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Resource</th>
                            <th>Owner</th>
                            <th>Due Return Date</th>
                            <th>Status</th>
                            <th>Handover / Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr th:each="b : \${myBorrowings}">
                            <td style="font-weight:700;" th:text="\${b.resourceTitle}">Resource Title</td>
                            <td>
                                <span th:text="\${b.ownerName}">Owner</span>
                                <span class="user-rep-tag" style="margin-left:0.35rem;" th:text="\${b.ownerReputation + ' Rep'}">100 Rep</span>
                            </td>
                            <td style="font-size:0.85rem;">
                                <strong th:text="\${b.endDate}">Due Date</strong>
                            </td>
                            <td>
                                <span class="product-tag-status" th:classappend="\${b.status.name() == 'ACTIVE'} ? 'available' : ''" th:text="\${b.status}">ACTIVE</span>
                            </td>
                            <td>
                                <div style="display:flex; gap:0.5rem; align-items:center;">
                                    <a th:if="\${b.status.name() == 'APPROVED' or b.status.name() == 'ACTIVE'}" 
                                       th:href="@{'/handover/' + \${b.id}}" 
                                       class="btn btn-primary btn-sm">
                                        View QR Handover
                                    </a>
                                    <form th:if="\${b.status.name() == 'ACTIVE'}" 
                                          th:action="@{'/borrowings/' + \${b.id} + '/return'}" 
                                          method="post"
                                          onsubmit="return confirm('Confirm that you have returned this item to the owner?');">
                                        <button type="submit" class="btn btn-secondary btn-sm">Mark Returned</button>
                                    </form>
                                    <a th:href="@{'/report?targetUserId=' + \${b.ownerId}}" class="btn btn-secondary btn-sm" title="Report Issue">⚠️</a>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </main>

    <footer class="site-footer">
        <div class="container footer-inner">
            <div style="font-weight:700;">CRKH — Campus Resource & Knowledge Hub</div>
            <div>© 2026 Verified Campus Exchange Platform</div>
        </div>
    </footer>

    <script th:src="@{/js/main.js}"></script>
</body>
</html>
`;
fs.writeFileSync(path.join(TEMPLATE_DIR, 'borrowings.html'), borrowingsHtml, 'utf8');
console.log('borrowings.html written!');

// 6. HANDOVER.HTML (CRYSTAL QR HANDOVER SCREEN)
const handoverHtml = `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Resource Handover — CRKH</title>
    <link rel="stylesheet" th:href="@{/css/style.css}">
</head>
<body>
    <div th:replace="~{fragments/navbar :: header('borrowings')}"></div>

    <main class="container" style="max-width:820px; padding-top:2rem;">
        <div style="margin-bottom:1.5rem;">
            <a th:href="@{/borrowings}" class="btn btn-secondary btn-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                <span>Back to Borrowings</span>
            </a>
        </div>

        <div class="handover-card">
            <!-- Mode Pill -->
            <div class="product-tag-borrow" style="display:inline-block; margin-bottom:1rem; position:static;" th:text="\${handoverType} + ' VERIFICATION'">
                PICKUP VERIFICATION
            </div>

            <h1 style="font-size:2rem; font-weight:800; letter-spacing:-0.03em; margin-bottom:0.4rem;">Verify Resource Handover</h1>
            <h2 style="font-size:1.15rem; font-weight:700; color:var(--primary); margin-bottom:0.5rem;" th:text="\${borrowing.resourceTitle}">Resource Title</h2>
            <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1.75rem;">
                Show this QR code to the resource owner to confirm pickup on campus.
            </p>

            <!-- Translucent Crystal QR Box -->
            <div class="qr-code-box">
                <img th:src="\${handover.qrCodeBase64Image}" alt="Handover QR Code" class="qr-code-img">
            </div>

            <!-- Single-Use Token Display & Copy -->
            <div>
                <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); font-weight:700; letter-spacing:0.04em;">
                    Cryptographic Single-Use Token
                </div>
                <div class="token-pill-box">
                    <span id="qrTokenVal" th:text="\${handover.qrToken}">CRKH-TOKEN</span>
                    <button type="button" class="btn btn-secondary btn-sm" id="copyTokenBtn" th:data-token="\${handover.qrToken}">
                        Copy Token
                    </button>
                </div>
                <div style="font-size:0.78rem; color:var(--text-muted);">
                    ⏱️ Valid until: <strong th:text="\${handover.expiresAt}">Expiration</strong> (Expires in 30 minutes)
                </div>
            </div>

            <!-- Handover Verification Form & Simulator (Proactive Enhancement) -->
            <div style="margin-top:2rem; padding:1.5rem; background:rgba(255,255,255,0.7); border:1px solid rgba(255,255,255,0.95); border-radius:var(--radius-lg); text-align:left; box-shadow:var(--shadow-liquid-sm);">
                <div style="font-size:0.95rem; font-weight:700; margin-bottom:0.35rem;">Complete Handover Confirmation</div>
                <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:1rem;">
                    Confirm by pasting the token or click the instant test simulator below.
                </p>

                <form th:action="@{/handover/verify}" method="post">
                    <div class="form-group" style="margin-bottom:0.85rem;">
                        <input type="text" name="qrToken" class="form-control" placeholder="Enter token..." th:value="\${handover.qrToken}" required>
                    </div>
                    <div style="display:flex; gap:0.5rem;">
                        <button type="submit" class="btn btn-primary" style="flex:1;">
                            Verify & Confirm Handover Now ✓
                        </button>
                        <button type="button" class="btn btn-soft-blue" onclick="simulateQrScan()">
                            ⚡ Simulate Scan
                        </button>
                    </div>
                </form>
            </div>

            <!-- Handover Type Toggle -->
            <div style="margin-top:1.5rem; display:flex; justify-content:center; gap:0.75rem;">
                <a th:href="@{'/handover/' + \${borrowing.id} + '?type=PICKUP'}" 
                   class="btn btn-sm" th:classappend="\${handoverType.name() == 'PICKUP'} ? 'btn-primary' : 'btn-secondary'">
                    Pickup QR Mode
                </a>
                <a th:href="@{'/handover/' + \${borrowing.id} + '?type=RETURN'}" 
                   class="btn btn-sm" th:classappend="\${handoverType.name() == 'RETURN'} ? 'btn-primary' : 'btn-secondary'">
                    Return QR Mode
                </a>
            </div>
        </div>
    </main>

    <footer class="site-footer">
        <div class="container footer-inner">
            <div style="font-weight:700;">CRKH — Campus Resource & Knowledge Hub</div>
            <div>© 2026 Verified Campus Exchange Platform</div>
        </div>
    </footer>

    <script th:src="@{/js/main.js}"></script>
</body>
</html>
`;
fs.writeFileSync(path.join(TEMPLATE_DIR, 'handover.html'), handoverHtml, 'utf8');
console.log('handover.html written!');

// 7. KNOWLEDGE-VAULT.HTML
const vaultHtml = `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Knowledge Vault — CRKH</title>
    <link rel="stylesheet" th:href="@{/css/style.css}">
</head>
<body>
    <div th:replace="~{fragments/navbar :: header('vault')}"></div>

    <main class="container" style="padding-top:2.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
            <div>
                <div style="font-size:0.8rem; font-weight:700; color:var(--secondary); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;">
                    Private Encrypted Academic Storage
                </div>
                <h1 style="font-size:2.1rem; font-weight:800; letter-spacing:-0.03em;">My Knowledge Vault</h1>
                <p style="color:var(--text-muted); font-size:0.92rem;">
                    Upload, organize, and search your personal lecture notes, PDFs, and exam cheatsheets.
                </p>
            </div>
            <button onclick="openModal('uploadDocModal')" class="btn btn-primary">
                + Upload Document
            </button>
        </div>

        <div th:if="${param.uploaded}" class="alert alert-success">
            <span>✅</span> Private academic document securely uploaded and indexed.
        </div>
        <div th:if="${param.deleted}" class="alert alert-info">
            <span>ℹ️</span> Document deleted from your vault.
        </div>

        <!-- Strict Isolation Guarantee Banner -->
        <div class="card" style="padding:1rem 1.4rem; margin-bottom:1.75rem; background:rgba(155,138,251,0.08); border-color:var(--secondary-subtle); display:flex; align-items:center; gap:1rem;">
            <div style="font-size:1.6rem;">🔒</div>
            <div style="font-size:0.86rem; color:var(--text-muted); line-height:1.5;">
                <strong style="color:var(--text-main);">Strict Object-Level Privacy Isolation:</strong>
                All files and notes in your Knowledge Vault are strictly isolated to your authenticated account. No other student can discover or view your documents.
            </div>
        </div>

        <!-- Search Bar -->
        <form th:action="@{/knowledge-vault}" method="get" class="nav-search-bar" style="max-width:100%; margin-bottom:1.5rem;">
            <div class="nav-search-inner" style="padding:0.65rem 1.25rem;">
                <svg class="nav-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" name="q" class="nav-search-input" placeholder="Search notes, PDFs, documents by title, tags, or content..." th:value="\${query}">
            </div>
        </form>

        <!-- Document Grid (Apple Files style) -->
        <div th:if="\${#lists.isEmpty(documents)}" class="card" style="text-align:center; padding:3.5rem;">
            <div style="font-size:2.8rem; margin-bottom:0.75rem;">📁</div>
            <h3 style="font-size:1.25rem; font-weight:700;">No private documents found</h3>
            <p style="color:var(--text-muted); margin-bottom:1.25rem;">Upload your semester notes, exam cheatsheets, or research papers for instant indexing.</p>
            <button onclick="openModal('uploadDocModal')" class="btn btn-primary btn-sm">+ Upload Your First Document</button>
        </div>

        <div th:unless="\${#lists.isEmpty(documents)}" class="vault-grid">
            <div th:each="doc : \${documents}" class="vault-card">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <div class="vault-card-icon" 
                         th:classappend="\${#strings.contains(doc.fileName, '.pdf')} ? 'vault-icon-pdf' : 'vault-icon-note'">
                        📄
                    </div>
                    <span style="font-size:0.72rem; color:var(--text-subtle); text-transform:uppercase; font-weight:700;" th:text="\${doc.contentType}">text/plain</span>
                </div>

                <h3 class="vault-card-title" th:text="\${doc.title}">Document Title</h3>
                
                <div th:if="\${doc.previewText != null}" class="vault-preview-box" th:text="\${doc.previewText}">
                    Preview snippet...
                </div>

                <div style="margin-top:auto; border-top:1px solid var(--liquid-glass-border-light); padding-top:0.75rem;">
                    <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:0.5rem;" th:text="\${doc.metadata}">Metadata</div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:0.75rem; color:var(--text-subtle);" th:text="\${doc.fileName}">file.txt</span>
                        <form th:action="@{'/knowledge-vault/' + \${doc.id} + '/delete'}" method="post" onsubmit="return confirm('Delete this document?');">
                            <button type="submit" class="btn btn-danger btn-sm" style="padding:0.25rem 0.5rem; font-size:0.75rem;">Delete</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- UPLOAD MODAL -->
    <div id="uploadDocModal" class="modal-overlay" onclick="if(event.target === this) closeModal('uploadDocModal');">
        <div class="modal-card">
            <button class="modal-close-btn" onclick="closeModal('uploadDocModal')">✕</button>
            <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:0.5rem;">Upload to Knowledge Vault</h2>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1.5rem;">
                Files are privately encrypted and isolated to your account.
            </p>

            <form th:action="@{/knowledge-vault/upload}" method="post" enctype="multipart/form-data">
                <div class="form-group">
                    <label class="form-label">Document Title *</label>
                    <input type="text" name="title" class="form-control" placeholder="e.g. Operating Systems Scheduling Cheatsheet" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Select File (PDF, TXT, DOCX) *</label>
                    <input type="file" name="file" class="form-control" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Tags (comma separated)</label>
                    <input type="text" name="tags" class="form-control" placeholder="e.g. os, scheduling, round-robin, exam">
                </div>

                <div class="form-group">
                    <label class="form-label">Course / Semester Metadata</label>
                    <input type="text" name="metadata" class="form-control" placeholder="e.g. CSE Semester 5, Prof. Miller">
                </div>

                <button type="submit" class="btn btn-primary btn-block btn-lg">
                    Encrypt & Save to Vault ➔
                </button>
            </form>
        </div>
    </div>

    <footer class="site-footer">
        <div class="container footer-inner">
            <div style="font-weight:700;">CRKH — Campus Resource & Knowledge Hub</div>
            <div>© 2026 Verified Campus Exchange Platform</div>
        </div>
    </footer>

    <script th:src="@{/js/main.js}"></script>
</body>
</html>
`;
fs.writeFileSync(path.join(TEMPLATE_DIR, 'knowledge-vault.html'), vaultHtml, 'utf8');
console.log('knowledge-vault.html written!');

// 8. DASHBOARD.HTML
const dashboardHtml = `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Dashboard — CRKH</title>
    <link rel="stylesheet" th:href="@{/css/style.css}">
</head>
<body>
    <div th:replace="~{fragments/navbar :: header('dashboard')}"></div>

    <main class="container" style="padding-top:2.5rem;">
        <!-- Greeting Header -->
        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:2rem; flex-wrap:wrap; gap:1rem;">
            <div>
                <div style="font-size:0.8rem; font-weight:700; color:var(--primary); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;">
                    Campus Resource Exchange
                </div>
                <h1 style="font-size:2.2rem; font-weight:800; letter-spacing:-0.03em;">
                    Good Morning, <span th:text="\${currentUser.name}">Alex</span> 👋
                </h1>
                <p style="color:var(--text-muted); font-size:0.95rem;">
                    Discover resources available around your campus and manage your academic exchanges.
                </p>
            </div>
            <div style="display:flex; gap:0.6rem;">
                <a th:href="@{/resources/new}" class="btn btn-primary btn-sm">+ Share Item</a>
                <a th:href="@{/requests}" class="btn btn-secondary btn-sm">+ Request</a>
                <a th:href="@{/knowledge-vault}" class="btn btn-secondary btn-sm">Vault</a>
            </div>
        </div>

        <!-- 4 Liquid Glass KPI Widgets -->
        <div class="stats-row">
            <div class="stat-box">
                <div class="stat-box-icon" style="background:var(--primary-light); color:var(--primary);">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                </div>
                <div>
                    <div class="stat-box-val" th:text="\${availableResources.size()}">12</div>
                    <div class="stat-box-label">Available on Campus</div>
                </div>
            </div>

            <div class="stat-box">
                <div class="stat-box-icon" style="background:var(--secondary-light); color:var(--secondary);">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                </div>
                <div>
                    <div class="stat-box-val" style="color:var(--secondary);" th:text="\${activeBorrowings.size()}">1</div>
                    <div class="stat-box-label">Active Borrowings</div>
                </div>
            </div>

            <div class="stat-box">
                <div class="stat-box-icon" style="background:var(--mint-light); color:#166534;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                </div>
                <div>
                    <div class="stat-box-val" style="color:#059669;" th:text="\${currentUser.reputationScore + ' pts'}">95 pts</div>
                    <div class="stat-box-label">Campus Trust Rank</div>
                </div>
            </div>

            <div class="stat-box">
                <div class="stat-box-icon" style="background:var(--peach-light); color:var(--peach-hover);">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>
                </div>
                <div>
                    <div class="stat-box-val" th:text="\${myDocs.size()}">2</div>
                    <div class="stat-box-label">Vault Notes</div>
                </div>
            </div>
        </div>

        <!-- Active Borrowings Handover Banner -->
        <div th:if="\${not #lists.isEmpty(activeBorrowings)}" style="margin-bottom:2.5rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                <h3 style="font-size:1.3rem; font-weight:800;">Active Borrowing & QR Handover</h3>
                <a th:href="@{/borrowings}" class="btn btn-secondary btn-sm">All Borrowings ➔</a>
            </div>

            <div th:each="b : \${activeBorrowings}" class="card" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; border-left:4px solid var(--primary);">
                <div>
                    <span class="product-tag-status available">ACTIVE POSSESSION</span>
                    <h4 style="font-size:1.15rem; font-weight:800; margin:0.35rem 0;" th:text="\${b.resourceTitle}">Resource Title</h4>
                    <div style="font-size:0.82rem; color:var(--text-muted);">
                        Owner: <strong th:text="\${b.ownerName}">Owner</strong> • Return Deadline: <strong th:text="\${b.endDate}">Date</strong>
                    </div>
                </div>
                <div style="display:flex; gap:0.5rem;">
                    <a th:href="@{'/handover/' + \${b.id}}" class="btn btn-primary btn-sm">
                        View QR Handover
                    </a>
                </div>
            </div>
        </div>

        <!-- Recommended Campus Resources -->
        <div style="margin-top:2.5rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                <h3 style="font-size:1.3rem; font-weight:800;">Recommended Campus Resources</h3>
                <a th:href="@{/resources}" class="btn btn-soft-blue btn-sm">Explore All ➔</a>
            </div>

            <div class="product-grid">
                <div th:each="r : \${availableResources}" 
                     class="product-card"
                     th:data-id="\${r.id}"
                     th:data-title="\${r.title}"
                     th:data-category="\${r.category.name()}"
                     th:data-location="\${r.location}"
                     th:data-owner="\${r.ownerName}"
                     th:data-rep="\${r.ownerReputation}"
                     th:data-dates="\${r.availabilityFrom} + ' to ' + \${r.availabilityTo}"
                     th:data-desc="\${r.description}">
                    
                    <div class="product-card-media">
                        <span class="product-tag-borrow">FREE TO BORROW</span>
                        <img th:src="\${r.imageUrl != null and !r.imageUrl.isEmpty()} ? \${r.imageUrl} : '/images/products/default.svg'" 
                             th:data-category="\${r.category.name()}"
                             th:alt="\${r.title}" 
                             class="product-card-img">
                    </div>

                    <div class="product-card-body">
                        <div class="product-card-meta">
                            <span class="product-category-text" th:text="\${r.category}">CATEGORY</span>
                            <div class="product-rating"><span>★</span><span>4.8</span></div>
                        </div>
                        <h4 class="product-card-title" th:text="\${r.title}">Title</h4>
                        <div class="product-card-details">
                            <div class="product-detail-row">
                                <svg class="product-detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path></svg>
                                <span th:text="\${r.location}">Location</span>
                            </div>
                        </div>
                        <div class="product-card-footer">
                            <a th:href="@{'/resources/' + \${r.id}}" class="btn btn-secondary btn-sm" style="flex:1;">Details</a>
                            <button type="button" class="btn btn-primary btn-sm" style="flex:1;" data-quick-view>Quick Request</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- QUICK VIEW MODAL -->
    <div id="quickViewModal" class="modal-overlay" onclick="if(event.target === this) closeModal('quickViewModal');">
        <div class="modal-card">
            <button class="modal-close-btn" onclick="closeModal('quickViewModal')">✕</button>
            <div style="display:grid; grid-template-columns:140px 1fr; gap:1.25rem; margin-bottom:1.25rem;">
                <img id="qvImg" src="" alt="Resource" style="width:100%; aspect-ratio:1; object-fit:cover; border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.95); box-shadow:var(--shadow-liquid-sm);">
                <div>
                    <span id="qvCategory" class="product-category-text">CATEGORY</span>
                    <h3 id="qvTitle" style="font-size:1.15rem; font-weight:800; margin:0.25rem 0;">Resource Title</h3>
                    <div style="font-size:0.82rem; color:var(--text-muted); margin-bottom:0.25rem;">
                        📍 <span id="qvLocation">Location</span>
                    </div>
                    <div style="font-size:0.82rem; color:var(--text-muted);">
                        Owner: <span id="qvOwner">Student</span>
                    </div>
                    <div style="font-size:0.78rem; color:#059669; font-weight:600; margin-top:0.25rem;">
                        📅 Available: <span id="qvDates">Dates</span>
                    </div>
                </div>
            </div>

            <p id="qvDesc" style="font-size:0.85rem; color:var(--text-muted); line-height:1.5; margin-bottom:1.25rem; background:rgba(255,255,255,0.6); padding:0.75rem; border-radius:var(--radius-sm); border:1px solid rgba(255,255,255,0.9);">
                Description
            </p>

            <form th:action="@{/borrowings/create}" method="post">
                <input type="hidden" id="qvResourceId" name="resourceId" value="">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:0.75rem;">
                    <div>
                        <label class="form-label" style="font-size:0.78rem;">Borrow From</label>
                        <input type="date" name="startDate" class="form-control" style="padding:0.4rem 0.6rem;" required>
                    </div>
                    <div>
                        <label class="form-label" style="font-size:0.78rem;">Return By</label>
                        <input type="date" name="endDate" class="form-control" style="padding:0.4rem 0.6rem;" required>
                    </div>
                </div>
                <div class="form-group" style="margin-bottom:1rem;">
                    <label class="form-label" style="font-size:0.78rem;">Purpose / Note for Owner</label>
                    <input type="text" name="notes" class="form-control" placeholder="e.g. Needed for semester exams..." style="padding:0.45rem 0.75rem;">
                </div>
                <div style="display:flex; gap:0.75rem;">
                    <a id="qvDetailLink" href="#" class="btn btn-secondary" style="flex:1;">Full Details Page</a>
                    <button type="submit" class="btn btn-primary" style="flex:1;">Send Request</button>
                </div>
            </form>
        </div>
    </div>

    <footer class="site-footer">
        <div class="container footer-inner">
            <div style="font-weight:700;">CRKH — Campus Resource & Knowledge Hub</div>
            <div>© 2026 Verified Campus Exchange Platform</div>
        </div>
    </footer>

    <script th:src="@{/js/main.js}"></script>
</body>
</html>
`;
fs.writeFileSync(path.join(TEMPLATE_DIR, 'dashboard.html'), dashboardHtml, 'utf8');
console.log('dashboard.html written!');

// 9. ADMIN.HTML (MODERN ANALYTICAL DASHBOARD WITH LIGHT THEME)
const adminHtml = `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Campus Admin Dashboard — CRKH</title>
    <link rel="stylesheet" th:href="@{/css/style.css}">
</head>
<body>
    <div th:replace="~{fragments/navbar :: header('admin')}"></div>

    <main class="container" style="padding-top:2.5rem;">
        <div style="margin-bottom:2rem;">
            <div style="font-size:0.8rem; font-weight:700; color:var(--secondary); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;">
                Campus Operations & Integrity Oversight
            </div>
            <h1 style="font-size:2.2rem; font-weight:800; letter-spacing:-0.03em;">Administrator & Moderator Console</h1>
            <p style="color:var(--text-muted); font-size:0.95rem;">
                Monitor platform health, oversee verified active borrowings, manage user roles, and resolve moderation reports.
            </p>
        </div>

        <div th:if="${param.updated}" class="alert alert-success">
            <span>✅</span> Record updated successfully.
        </div>

        <!-- 6 KPI Stat Cards (Apple Liquid Glass) -->
        <div class="stats-row" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
            <div class="stat-box">
                <div>
                    <div class="stat-box-val" th:text="\${stats.totalStudents}">5</div>
                    <div class="stat-box-label">Total Students</div>
                </div>
            </div>
            <div class="stat-box">
                <div>
                    <div class="stat-box-val" style="color:var(--primary);" th:text="\${stats.activeResources}">12</div>
                    <div class="stat-box-label">Active Resources</div>
                </div>
            </div>
            <div class="stat-box">
                <div>
                    <div class="stat-box-val" style="color:#059669;" th:text="\${stats.activeBorrowings}">1</div>
                    <div class="stat-box-label">Active Borrowings</div>
                </div>
            </div>
            <div class="stat-box">
                <div>
                    <div class="stat-box-val" style="color:#DC2626;" th:text="\${stats.openReports}">0</div>
                    <div class="stat-box-label">Open Reports</div>
                </div>
            </div>
            <div class="stat-box">
                <div>
                    <div class="stat-box-val" style="color:var(--secondary);" th:text="\${stats.totalDocuments}">2</div>
                    <div class="stat-box-label">Vault Docs</div>
                </div>
            </div>
            <div class="stat-box">
                <div>
                    <div class="stat-box-val" th:text="\${stats.openRequests}">1</div>
                    <div class="stat-box-label">Open Requests</div>
                </div>
            </div>
        </div>

        <!-- User Management Table -->
        <div class="card" style="margin-bottom:2.5rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
                <h2 style="font-size:1.3rem; font-weight:800;">Campus Student Directory</h2>
                <span style="font-size:0.85rem; color:var(--text-muted);" th:text="\${users.size()} + ' registered accounts'">Users</span>
            </div>

            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Reputation</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr th:each="u : \${users}">
                            <td>
                                <div style="display:flex; align-items:center; gap:0.6rem;">
                                    <div class="user-avatar-circle" th:text="\${#strings.substring(u.name, 0, 1)}">U</div>
                                    <span style="font-weight:700;" th:text="\${u.name}">Name</span>
                                </div>
                            </td>
                            <td th:text="\${u.email}">Email</td>
                            <td><span class="user-menu-pill" style="padding:0.2rem 0.6rem; font-size:0.75rem;" th:text="\${u.role}">STUDENT</span></td>
                            <td><span class="user-rep-tag" th:text="\${u.reputationScore + ' pts'}">100 pts</span></td>
                            <td>
                                <span class="product-tag-status" th:classappend="\${u.status.name() == 'ACTIVE'} ? 'available' : 'borrowed'" th:text="\${u.status}">ACTIVE</span>
                            </td>
                            <td>
                                <div style="display:flex; gap:0.4rem;">
                                    <form th:action="@{'/admin/users/' + \${u.id} + '/status'}" method="post">
                                        <input type="hidden" name="status" th:value="\${u.status.name() == 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'}">
                                        <button type="submit" class="btn btn-secondary btn-sm" th:text="\${u.status.name() == 'ACTIVE' ? 'Suspend' : 'Activate'}">Toggle</button>
                                    </form>
                                    <form th:action="@{'/admin/users/' + \${u.id} + '/role'}" method="post">
                                        <input type="hidden" name="role" th:value="\${u.role.name() == 'STUDENT' ? 'MODERATOR' : 'STUDENT'}">
                                        <button type="submit" class="btn btn-soft-blue btn-sm" th:text="\${u.role.name() == 'STUDENT' ? 'Make Mod' : 'Demote'}">Role</button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Disciplinary Reports Moderation Queue -->
        <div class="card">
            <h2 style="font-size:1.3rem; font-weight:800; margin-bottom:1.25rem;">Campus Disciplinary & Moderation Queue</h2>
            <div th:if="\${#lists.isEmpty(reports)}" style="text-align:center; padding:2rem; color:var(--text-subtle);">
                No active disciplinary reports. Campus community integrity is 100%!
            </div>
            <div th:unless="\${#lists.isEmpty(reports)}" class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Case #</th>
                            <th>Reporter</th>
                            <th>Target User</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr th:each="rep : \${reports}">
                            <td style="font-weight:700;" th:text="'#' + \${rep.id}">#1</td>
                            <td th:text="\${rep.reporterName}">Reporter</td>
                            <td th:text="\${rep.targetUserName}">Target</td>
                            <td th:text="\${rep.reason}">Reason</td>
                            <td><span class="product-tag-status" th:text="\${rep.status}">OPEN</span></td>
                            <td>
                                <form th:action="@{'/admin/reports/' + \${rep.id}}" method="post" style="display:flex; gap:0.4rem;">
                                    <input type="hidden" name="status" value="RESOLVED">
                                    <input type="number" name="penalty" placeholder="Penalty pts" class="form-control" style="width:110px; padding:0.3rem 0.5rem; font-size:0.78rem;">
                                    <button type="submit" class="btn btn-primary btn-sm">Resolve</button>
                                </form>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </main>

    <footer class="site-footer">
        <div class="container footer-inner">
            <div style="font-weight:700;">CRKH — Campus Resource & Knowledge Hub</div>
            <div>© 2026 Verified Campus Exchange Platform</div>
        </div>
    </footer>

    <script th:src="@{/js/main.js}"></script>
</body>
</html>
`;
fs.writeFileSync(path.join(TEMPLATE_DIR, 'admin.html'), adminHtml, 'utf8');
console.log('admin.html written!');

// 10. LOGIN.HTML (APPLE LIQUID GLASS SPLIT CARD + 1-CLICK DEMO FILLER)
const loginHtml = `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign In — CRKH</title>
    <link rel="stylesheet" th:href="@{/css/style.css}">
</head>
<body style="display:flex; flex-direction:column; min-height:100vh;">
    <div th:replace="~{fragments/navbar :: header('login')}"></div>

    <div class="container" style="flex:1; display:grid; place-items:center; padding:3.5rem 1rem;">
        <div class="card" style="width:100%; max-width:480px; padding:2.75rem; box-shadow:var(--shadow-liquid-modal); position:relative;">
            <div style="text-align:center; margin-bottom:2rem;">
                <div class="brand-icon-box" style="margin:0 auto 1.25rem; width:48px; height:48px;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path></svg>
                </div>
                <h1 style="font-size:1.85rem; font-weight:800; letter-spacing:-0.03em;">Welcome to CRKH</h1>
                <p style="color:var(--text-muted); font-size:0.9rem;">Sign in with your verified campus email</p>
            </div>

            <div th:if="${param.error}" class="alert alert-danger">
                <span>⚠️</span> Invalid college email or password.
            </div>
            <div th:if="${param.logout}" class="alert alert-info">
                <span>✅</span> You have been securely signed out.
            </div>

            <form th:action="@{/perform_login}" method="post">
                <div class="form-group">
                    <label class="form-label" for="username">College Email</label>
                    <input type="email" id="username" name="username" class="form-control" placeholder="name@college.edu" required autofocus>
                </div>

                <div class="form-group">
                    <label class="form-label" for="password">Password</label>
                    <input type="password" id="password" name="password" class="form-control" placeholder="••••••••" required>
                </div>

                <button type="submit" class="btn btn-primary btn-block btn-lg" style="margin-top:0.75rem;">
                    Sign In to Hub ➔
                </button>
            </form>

            <!-- 1-Click Demo Accounts Quick Test (Proactive Improvement) -->
            <div style="margin-top:2rem; padding-top:1.5rem; border-top:1px solid var(--liquid-glass-border-light);">
                <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; font-weight:700; letter-spacing:0.05em; margin-bottom:0.75rem; text-align:center;">
                    ⚡ 1-Click Demo Test Accounts
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem;">
                    <button type="button" class="btn btn-secondary btn-sm" data-fill-email="student1@college.edu" data-fill-pass="Student@123">
                        🎓 Student 1 (Alex)
                    </button>
                    <button type="button" class="btn btn-secondary btn-sm" data-fill-email="student2@college.edu" data-fill-pass="Student@123">
                        🔬 Student 2 (Priya)
                    </button>
                    <button type="button" class="btn btn-secondary btn-sm" data-fill-email="student3@college.edu" data-fill-pass="Student@123">
                        🛠️ Student 3 (Marcus)
                    </button>
                    <button type="button" class="btn btn-secondary btn-sm" data-fill-email="admin@college.edu" data-fill-pass="Admin@123">
                        🛡️ Campus Admin
                    </button>
                </div>
            </div>

            <div style="text-align:center; margin-top:1.5rem; font-size:0.88rem; color:var(--text-muted);">
                Don't have an account? <a th:href="@{/register}" style="color:var(--primary); font-weight:700;">Register here</a>
            </div>
        </div>
    </div>

    <script th:src="@{/js/main.js}"></script>
</body>
</html>
`;
fs.writeFileSync(path.join(TEMPLATE_DIR, 'login.html'), loginHtml, 'utf8');
console.log('login.html written!');

// 11. REGISTER.HTML
const registerHtml = `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Campus Account — CRKH</title>
    <link rel="stylesheet" th:href="@{/css/style.css}">
</head>
<body style="display:flex; flex-direction:column; min-height:100vh;">
    <div th:replace="~{fragments/navbar :: header('register')}"></div>

    <div class="container" style="flex:1; display:grid; place-items:center; padding:3.5rem 1rem;">
        <div class="card" style="width:100%; max-width:480px; padding:2.75rem; box-shadow:var(--shadow-liquid-modal);">
            <div style="text-align:center; margin-bottom:2rem;">
                <div class="brand-icon-box" style="margin:0 auto 1.25rem; width:48px; height:48px;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path></svg>
                </div>
                <h1 style="font-size:1.85rem; font-weight:800; letter-spacing:-0.03em;">Join Campus Hub</h1>
                <p style="color:var(--text-muted); font-size:0.9rem;">Share equipment, match resources, access knowledge</p>
            </div>

            <form id="regForm">
                <div class="form-group">
                    <label class="form-label" for="regName">Full Name</label>
                    <input type="text" id="regName" class="form-control" placeholder="e.g. Bharath Kumar" required>
                </div>

                <div class="form-group">
                    <label class="form-label" for="regEmail">College Email</label>
                    <input type="email" id="regEmail" class="form-control" placeholder="username@college.edu" required>
                </div>

                <div class="form-group">
                    <label class="form-label" for="regPassword">Password (min 6 chars)</label>
                    <input type="password" id="regPassword" class="form-control" placeholder="••••••••" minlength="6" required>
                </div>

                <div class="form-group">
                    <label class="form-label" for="regRole">Role</label>
                    <select id="regRole" class="form-control">
                        <option value="STUDENT">Student</option>
                        <option value="MODERATOR">Campus Moderator</option>
                    </select>
                </div>

                <div id="regAlert" style="display:none;" class="alert"></div>

                <button type="submit" id="regBtn" class="btn btn-primary btn-block btn-lg" style="margin-top:0.75rem;">
                    Complete Registration ➔
                </button>
            </form>

            <div style="text-align:center; margin-top:1.5rem; font-size:0.88rem; color:var(--text-muted);">
                Already have a campus account? <a th:href="@{/login}" style="color:var(--primary); font-weight:700;">Sign in</a>
            </div>
        </div>
    </div>

    <script>
        document.getElementById('regForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('regBtn');
            const alertBox = document.getElementById('regAlert');
            btn.disabled = true;
            btn.innerText = 'Creating account...';

            const payload = {
                name: document.getElementById('regName').value,
                email: document.getElementById('regEmail').value,
                password: document.getElementById('regPassword').value,
                role: document.getElementById('regRole').value
            };

            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (data.success) {
                    alertBox.className = 'alert alert-success';
                    alertBox.style.display = 'flex';
                    alertBox.innerText = 'Registration successful! Redirecting to login...';
                    setTimeout(() => window.location.href = '/login', 1500);
                } else {
                    alertBox.className = 'alert alert-danger';
                    alertBox.style.display = 'flex';
                    alertBox.innerText = data.message || 'Registration failed.';
                    btn.disabled = false;
                    btn.innerText = 'Complete Registration ➔';
                }
            } catch (err) {
                alertBox.className = 'alert alert-danger';
                alertBox.style.display = 'flex';
                alertBox.innerText = 'Network error during registration.';
                btn.disabled = false;
                btn.innerText = 'Complete Registration ➔';
            }
        });
    </script>
</body>
</html>
`;
fs.writeFileSync(path.join(TEMPLATE_DIR, 'register.html'), registerHtml, 'utf8');
console.log('register.html written!');

// 12. CREATE-RESOURCE.HTML
const createResourceHtml = `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Share a Resource — CRKH</title>
    <link rel="stylesheet" th:href="@{/css/style.css}">
</head>
<body>
    <div th:replace="~{fragments/navbar :: header('resources')}"></div>

    <main class="container" style="max-width:760px; padding-top:2.5rem;">
        <div style="margin-bottom:1.5rem;">
            <a th:href="@{/resources}" class="btn btn-secondary btn-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                <span>Back to Resources</span>
            </a>
        </div>

        <div class="card" style="padding:2.5rem;">
            <h1 style="font-size:1.85rem; font-weight:800; margin-bottom:0.5rem; letter-spacing:-0.03em;">Share a Physical Campus Resource</h1>
            <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:2rem;">
                Help fellow students by making unused textbooks, calculators, cables, adapters or lab gear available for borrowing.
            </p>

            <form th:action="@{/resources/new}" method="post">
                <div class="form-group">
                    <label class="form-label" for="title">Resource Title *</label>
                    <input type="text" id="title" name="title" class="form-control" placeholder="e.g. Casio fx-991EX ClassWiz, 4K HDMI Braided Cable, Effective Java 3rd Ed..." required>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                    <div class="form-group">
                        <label class="form-label" for="category">Category *</label>
                        <select id="category" name="category" class="form-control" required>
                            <option th:each="cat : \${categories}" th:value="\${cat}" th:text="\${cat}">CATEGORY</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="itemCondition">Item Condition</label>
                        <select id="itemCondition" name="itemCondition" class="form-control">
                            <option value="Brand New">Brand New</option>
                            <option value="Like New" selected>Like New</option>
                            <option value="Good">Good Condition</option>
                            <option value="Fair">Fair / Usable</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label" for="imageUrl">Product Image URL (Optional - default vector photo provided)</label>
                    <input type="url" id="imageUrl" name="imageUrl" class="form-control" placeholder="https://images.unsplash.com/photo-...">
                </div>

                <div class="form-group">
                    <label class="form-label" for="location">Pickup / Handover Campus Location *</label>
                    <input type="text" id="location" name="location" class="form-control" placeholder="e.g. Central Library 2nd Floor, Tech Park Block C Room 304..." required>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                    <div class="form-group">
                        <label class="form-label" for="availabilityFrom">Available From *</label>
                        <input type="date" id="availabilityFrom" name="availabilityFrom" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="availabilityTo">Available Until *</label>
                        <input type="date" id="availabilityTo" name="availabilityTo" class="form-control" required>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label" for="description">Condition & Description</label>
                    <textarea id="description" name="description" class="form-control" placeholder="Specify edition, included accessories, or pickup guidelines..." rows="4"></textarea>
                </div>

                <button type="submit" class="btn btn-primary btn-block btn-lg" style="margin-top:0.5rem;">
                    Publish Campus Listing ➔
                </button>
            </form>
        </div>
    </main>

    <footer class="site-footer">
        <div class="container footer-inner">
            <div style="font-weight:700;">CRKH — Campus Resource & Knowledge Hub</div>
            <div>© 2026 Verified Campus Exchange Platform</div>
        </div>
    </footer>

    <script th:src="@{/js/main.js}"></script>
</body>
</html>
`;
fs.writeFileSync(path.join(TEMPLATE_DIR, 'create-resource.html'), createResourceHtml, 'utf8');
console.log('create-resource.html written!');

// 13. EDIT-RESOURCE.HTML
const editResourceHtml = `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Resource — CRKH</title>
    <link rel="stylesheet" th:href="@{/css/style.css}">
</head>
<body>
    <div th:replace="~{fragments/navbar :: header('resources')}"></div>

    <main class="container" style="max-width:760px; padding-top:2.5rem;">
        <div style="margin-bottom:1.5rem;">
            <a th:href="@{'/resources/' + \${resource.id}}" class="btn btn-secondary btn-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                <span>Back to Details</span>
            </a>
        </div>

        <div class="card" style="padding:2.5rem;">
            <h1 style="font-size:1.85rem; font-weight:800; margin-bottom:1.5rem; letter-spacing:-0.03em;">Edit Resource Listing</h1>

            <form th:action="@{'/resources/' + \${resource.id} + '/edit'}" method="post">
                <div class="form-group">
                    <label class="form-label" for="title">Title *</label>
                    <input type="text" id="title" name="title" class="form-control" th:value="\${resource.title}" required>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                    <div class="form-group">
                        <label class="form-label" for="category">Category *</label>
                        <select id="category" name="category" class="form-control" required>
                            <option th:each="cat : \${categories}" th:value="\${cat}" th:text="\${cat}" th:selected="\${cat == resource.category}">CATEGORY</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="itemCondition">Item Condition</label>
                        <input type="text" id="itemCondition" name="itemCondition" class="form-control" th:value="\${resource.itemCondition}">
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label" for="imageUrl">Product Image URL</label>
                    <input type="url" id="imageUrl" name="imageUrl" class="form-control" th:value="\${resource.imageUrl}">
                </div>

                <div class="form-group">
                    <label class="form-label" for="location">Pickup Location *</label>
                    <input type="text" id="location" name="location" class="form-control" th:value="\${resource.location}" required>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                    <div class="form-group">
                        <label class="form-label" for="availabilityFrom">Available From *</label>
                        <input type="date" id="availabilityFrom" name="availabilityFrom" class="form-control" th:value="\${resource.availabilityFrom}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="availabilityTo">Available Until *</label>
                        <input type="date" id="availabilityTo" name="availabilityTo" class="form-control" th:value="\${resource.availabilityTo}" required>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label" for="description">Description</label>
                    <textarea id="description" name="description" class="form-control" rows="4" th:text="\${resource.description}"></textarea>
                </div>

                <button type="submit" class="btn btn-primary btn-block btn-lg" style="margin-top:0.5rem;">
                    Save Changes ➔
                </button>
            </form>
        </div>
    </main>

    <footer class="site-footer">
        <div class="container footer-inner">
            <div style="font-weight:700;">CRKH — Campus Resource & Knowledge Hub</div>
            <div>© 2026 Verified Campus Exchange Platform</div>
        </div>
    </footer>

    <script th:src="@{/js/main.js}"></script>
</body>
</html>
`;
fs.writeFileSync(path.join(TEMPLATE_DIR, 'edit-resource.html'), editResourceHtml, 'utf8');
console.log('edit-resource.html written!');

// 14. PROFILE.HTML
const profileHtml = `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Profile & Reputation — CRKH</title>
    <link rel="stylesheet" th:href="@{/css/style.css}">
</head>
<body>
    <div th:replace="~{fragments/navbar :: header('profile')}"></div>

    <main class="container" style="max-width:980px; padding-top:2.5rem;">
        <div class="card" style="padding:2.5rem; margin-bottom:2rem;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1.5rem;">
                <div style="display:flex; align-items:center; gap:1.25rem;">
                    <div class="user-avatar-circle" style="width:76px; height:76px; font-size:2rem; font-weight:800;">
                        <span th:text="\${#strings.substring(user.name, 0, 1)}">A</span>
                    </div>
                    <div>
                        <h1 style="font-size:1.85rem; font-weight:800; margin-bottom:0.25rem;" th:text="\${user.name}">Alex Rivera</h1>
                        <p style="color:var(--text-muted); font-size:0.9rem;" th:text="\${user.email}">student1@college.edu</p>
                        <div style="display:flex; gap:0.5rem; margin-top:0.5rem;">
                            <span class="user-menu-pill" style="padding:0.2rem 0.6rem; font-size:0.75rem;" th:text="\${user.role}">STUDENT</span>
                            <span class="product-tag-status available" th:text="\${user.status}">ACTIVE</span>
                        </div>
                    </div>
                </div>

                <!-- Reputation Score Widget -->
                <div style="background:rgba(255,255,255,0.7); border:1px solid rgba(255,255,255,0.95); border-radius:var(--radius-lg); padding:1.25rem 2rem; text-align:center; box-shadow:var(--shadow-liquid-sm);">
                    <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); font-weight:700; letter-spacing:0.05em; margin-bottom:0.25rem;">
                        Campus Reputation Score
                    </div>
                    <div style="font-size:2.8rem; font-weight:800; color:#059669; letter-spacing:-0.03em;" th:text="\${user.reputationScore}">95</div>
                    <div style="font-size:0.8rem; color:#059669; font-weight:700;">★ Trusted Campus Contributor</div>
                </div>
            </div>
        </div>

        <!-- Reputation Rules Breakdown -->
        <div class="card" style="padding:1.5rem; margin-bottom:2rem;">
            <h3 style="font-size:1.15rem; font-weight:800; margin-bottom:0.75rem;">How Reputation Works in CRKH</h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1rem; font-size:0.85rem; color:var(--text-muted);">
                <div style="background:rgba(255,255,255,0.6); padding:1rem; border-radius:var(--radius-sm); border:1px solid rgba(255,255,255,0.9);">
                    <strong style="color:#059669;">+5 Points:</strong> Completing physical QR handover and on-time return.
                </div>
                <div style="background:rgba(255,255,255,0.6); padding:1rem; border-radius:var(--radius-sm); border:1px solid rgba(255,255,255,0.9);">
                    <strong style="color:var(--primary);">+5 Points:</strong> Listing high-demand equipment for peer borrowing.
                </div>
                <div style="background:rgba(255,255,255,0.6); padding:1rem; border-radius:var(--radius-sm); border:1px solid rgba(255,255,255,0.9);">
                    <strong style="color:#DC2626;">-10 to -25 Points:</strong> Late returns or verified damaged item reports.
                </div>
            </div>
        </div>
    </main>

    <footer class="site-footer">
        <div class="container footer-inner">
            <div style="font-weight:700;">CRKH — Campus Resource & Knowledge Hub</div>
            <div>© 2026 Verified Campus Exchange Platform</div>
        </div>
    </footer>

    <script th:src="@{/js/main.js}"></script>
</body>
</html>
`;
fs.writeFileSync(path.join(TEMPLATE_DIR, 'profile.html'), profileHtml, 'utf8');
console.log('profile.html written!');

// 15. NOTIFICATIONS.HTML
const notificationsHtml = `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notifications — CRKH</title>
    <link rel="stylesheet" th:href="@{/css/style.css}">
</head>
<body>
    <div th:replace="~{fragments/navbar :: header('notifications')}"></div>

    <main class="container" style="max-width:820px; padding-top:2.5rem;">
        <div style="margin-bottom:2rem;">
            <div style="font-size:0.8rem; font-weight:700; color:var(--primary); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;">
                Live Campus Activity
            </div>
            <h1 style="font-size:2.1rem; font-weight:800; letter-spacing:-0.03em;">Notifications & Activity</h1>
            <p style="color:var(--text-muted); font-size:0.92rem;">
                Alerts regarding your resource matches, borrowing approvals, return reminders, and reputation updates.
            </p>
        </div>

        <div th:if="\${#lists.isEmpty(notifications)}" class="card" style="text-align:center; padding:3.5rem;">
            <div style="font-size:2.5rem; margin-bottom:0.75rem;">🔔</div>
            <h3 style="font-size:1.2rem; font-weight:700;">All caught up!</h3>
            <p style="color:var(--text-muted);">You have no pending notifications right now.</p>
        </div>

        <div th:unless="\${#lists.isEmpty(notifications)}">
            <div th:each="n : \${notifications}" class="card" style="margin-bottom:1rem; padding:1.25rem; display:flex; justify-content:space-between; align-items:center; gap:1rem;">
                <div>
                    <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem;">
                        <span style="font-size:1.1rem;">🔔</span>
                        <h4 style="font-size:1rem; font-weight:700;" th:text="\${n.title}">Notification Title</h4>
                    </div>
                    <p style="font-size:0.88rem; color:var(--text-muted);" th:text="\${n.message}">Message</p>
                    <div style="font-size:0.75rem; color:var(--text-subtle); margin-top:0.35rem;" th:text="\${n.createdAt}">Date</div>
                </div>

                <div th:if="\${n.link != null}">
                    <a th:href="@{\${n.link}}" class="btn btn-secondary btn-sm">View ➔</a>
                </div>
            </div>
        </div>
    </main>

    <footer class="site-footer">
        <div class="container footer-inner">
            <div style="font-weight:700;">CRKH — Campus Resource & Knowledge Hub</div>
            <div>© 2026 Verified Campus Exchange Platform</div>
        </div>
    </footer>

    <script th:src="@{/js/main.js}"></script>
</body>
</html>
`;
fs.writeFileSync(path.join(TEMPLATE_DIR, 'notifications.html'), notificationsHtml, 'utf8');
console.log('notifications.html written!');

// 16. REPORT.HTML
const reportHtml = `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Report Suspicious Activity — CRKH</title>
    <link rel="stylesheet" th:href="@{/css/style.css}">
</head>
<body>
    <div th:replace="~{fragments/navbar :: header('dashboard')}"></div>

    <main class="container" style="max-width:820px; padding-top:2.5rem;">
        <div style="margin-bottom:2rem;">
            <div style="font-size:0.8rem; font-weight:700; color:var(--peach-hover); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;">
                Campus Moderation & Trust
            </div>
            <h1 style="font-size:2.1rem; font-weight:800; letter-spacing:-0.03em;">Report Suspicious Activity</h1>
            <p style="color:var(--text-muted); font-size:0.92rem;">
                Report fraudulent activity, damaged equipment, or unreturned resources for campus moderator review.
            </p>
        </div>

        <div th:if="${param.submitted}" class="alert alert-success">
            <span>✅</span> Report submitted successfully. Our campus moderation team has been notified.
        </div>

        <div class="card" style="padding:2.5rem; margin-bottom:2.5rem;">
            <h2 style="font-size:1.3rem; font-weight:800; margin-bottom:1.25rem;">Submit Formal Report</h2>

            <form th:action="@{/report/submit}" method="post">
                <div class="form-group">
                    <label class="form-label" for="reason">Reason / Infraction Category *</label>
                    <select id="reason" name="reason" class="form-control" required>
                        <option value="Damaged Resource">Damaged or Broken Resource</option>
                        <option value="Unreturned Item">Item Not Returned Past Deadline</option>
                        <option value="Fake or Inaccurate Listing">Fake or Inaccurate Resource Details</option>
                        <option value="Suspicious Account">Suspicious or Non-Campus Account</option>
                        <option value="Inappropriate Content">Inappropriate Vault or Listing Content</option>
                        <option value="Other">Other Violation</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label" for="targetUserId">Target User ID (optional)</label>
                    <input type="number" id="targetUserId" name="targetUserId" class="form-control" placeholder="Enter user ID if known..." th:value="\${targetUserId}">
                </div>

                <div class="form-group">
                    <label class="form-label" for="description">Detailed Incident Description *</label>
                    <textarea id="description" name="description" class="form-control" placeholder="Explain the incident with relevant dates, location, and communication details..." rows="5" required></textarea>
                </div>

                <button type="submit" class="btn btn-danger btn-block btn-lg" style="margin-top:0.5rem;">
                    Submit Formal Disciplinary Report ➔
                </button>
            </form>
        </div>

        <div class="card">
            <h3 style="font-size:1.2rem; font-weight:800; margin-bottom:1rem;">My Submitted Reports</h3>
            <div th:if="\${#lists.isEmpty(myReports)}" style="text-align:center; padding:1.5rem; color:var(--text-subtle);">
                You haven't submitted any reports.
            </div>
            <div th:unless="\${#lists.isEmpty(myReports)}" class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Case #</th>
                            <th>Reason</th>
                            <th>Target User</th>
                            <th>Status</th>
                            <th>Submitted</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr th:each="rep : \${myReports}">
                            <td style="font-weight:700;" th:text="'#' + \${rep.id}">#1</td>
                            <td th:text="\${rep.reason}">Reason</td>
                            <td th:text="\${rep.targetUserName}">User</td>
                            <td><span class="product-tag-status" th:text="\${rep.status}">OPEN</span></td>
                            <td style="font-size:0.85rem; color:var(--text-subtle);" th:text="\${rep.createdAt}">Date</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </main>

    <footer class="site-footer">
        <div class="container footer-inner">
            <div style="font-weight:700;">CRKH — Campus Resource & Knowledge Hub</div>
            <div>© 2026 Verified Campus Exchange Platform</div>
        </div>
    </footer>

    <script th:src="@{/js/main.js}"></script>
</body>
</html>
`;
fs.writeFileSync(path.join(TEMPLATE_DIR, 'report.html'), reportHtml, 'utf8');
console.log('report.html written!');

console.log('ALL TEMPLATES SUCCESSFULLY COMPILED AND WRITTEN WITH APPLE LIQUID GLASS DESIGN!');

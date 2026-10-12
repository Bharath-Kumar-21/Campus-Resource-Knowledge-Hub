# Campus Resource & Knowledge Hub (CRKH)

<p align="center">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.3.4-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 21" />
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Thymeleaf-005F0F?style=for-the-badge&logo=thymeleaf&logoColor=white" alt="Thymeleaf" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white" alt="Railway" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License" />
</p>

> **CRKH** is an internal, campus-exclusive utility platform designed for verified college students, faculty, and administrators. Unlike generic commercial or classifieds marketplaces, CRKH is engineered specifically for non-monetary academic resource circulation (textbooks, lab kits, scientific calculators, adapters) and private knowledge vault storage.

---

## 🌟 Core Highlights & Features

### 1. Peer Resource Sharing & Flexible Exchange Modes
Students can list physical academic supplies with location, availability windows, condition tags, and photos. CRKH supports 4 distinct sharing modes:
- 🌿 **Free Borrow**: Standard non-monetary community lending.
- 🔄 **Item Exchange**: Direct swap for another needed item (e.g., swapping a graphing calculator for an audio interface).
- 💡 **Skill Swap**: Borrow an item in exchange for tutoring or project assistance.
- 🛡️ **Security Pledge**: High-value equipment sharing backed by an integrity pledge.

### 2. Weighted 6-Factor Intelligent Matching Engine
Automatically computes and ranks resource candidates using a normalized multi-factor algorithm ($0 - 100$):

$$\text{Score} = 0.30 \times \text{Relevance} + 0.20 \times \text{Location} + 0.20 \times \text{Availability} + 0.15 \times \text{Reputation} + 0.10 \times \text{Recency} + 0.05 \times \text{HistoryFit}$$

- Generates human-readable explanations (e.g., *"94% match — exact category, available on requested dates, same engineering block, owner reputation: 105 pts"*).
- Configurable algorithm weights in `application.properties`.

### 3. Cryptographic QR Handover Verification
- Two-phase verification (`PICKUP` and `RETURN`) powered by server-generated ZXing QR codes.
- Short-lived, single-use cryptographic tokens (30-minute expiration).
- Prevents disputes and guarantees mutual physical presence during exchanges.

### 4. Private Academic Knowledge Vault
- Personal repository for semester notes, cheatsheets, and exam prep files (`PDF`, `DOCX`, `TXT`, `Markdown`, `Images`).
- Full keyword search across titles, subject tags, and file metadata.
- **Strict Object-Level Privacy**: Every student's vault is cryptographically isolated (attempting to view another user's document enforces a strict 403 Forbidden).

### 5. Campus Integrity & Reputation Scoring
- Every student begins with 100 reputation points.
- Timely returns and verified exchanges award reputation boosts (+5).
- Late handovers or infractions trigger penalties and administrative flag reviews.

### 6. Administrative & Moderation Console
- Real-time KPI metrics (Active Borrowers, Resource Inventory, Pending Reports, Vault Storage).
- Account status controls (`ACTIVE`, `SUSPENDED`).
- Disciplinary case resolution with automated reputation adjustments.

### 7. Apple Liquid Glass Design System
- Built on modern visual tokens: translucent liquid glass panels, subtle caustics (`rgba(108, 142, 245, 0.10)`), and crisp typography.
- Fully responsive across mobile, tablet, and desktop viewports.

---

## 🏗️ System Architecture

```mermaid
graph TD
    User([Student / Faculty / Admin]) -->|HTTPS / Browser| UI[Thymeleaf + Apple Liquid Glass UI]
    
    subgraph Spring Boot Backend (Port 8080)
        UI --> Controller[Spring MVC Controllers & REST APIs]
        Controller --> Security[Spring Security & Session Auth]
        Security --> Services[Core Business Logic Services]
        
        Services --> MatchEngine[6-Factor Weighted Matching Engine]
        Services --> QRService[Cryptographic ZXing QR Token Engine]
        Services --> VaultService[Private Knowledge Vault Manager]
        Services --> ResourceService[Resource & Exchange Lifecycle]
    end
    
    subgraph Data & Storage Layer
        Services --> JPA[Spring Data JPA / Hibernate]
        JPA --> MySQL[(MySQL 8.0 Database)]
        VaultService --> LocalDisk[Persistent Upload Volume /uploads]
    end
```

---

## 📁 Repository Structure

```
Campus-Resource-Knowledge-Hub/
├── backend/                     # Spring Boot 3 Java Backend
│   ├── src/main/java/app/
│   │   ├── config/              # WebMvcConfig, Security, DataInitializer
│   │   ├── controller/          # REST API & Web Controllers
│   │   ├── dto/                 # Request/Response Data Transfer Objects
│   │   ├── entity/              # JPA Entities (Resource, User, Borrowing, etc.)
│   │   ├── repository/          # Spring Data JPA Repositories
│   │   └── service/             # MatchingEngine, QRService, ResourceService
│   ├── src/main/resources/
│   │   ├── static/              # Backend static resources & product illustrations
│   │   ├── templates/           # Server-side HTML templates
│   │   └── application.properties # Aiven MySQL, JWT, & matching config
│   ├── uploads/                 # Local directory for uploaded docs & items
│   ├── Dockerfile               # Backend Dockerfile for containerized deployment
│   └── pom.xml                  # Maven dependencies & build configuration
├── frontend/                    # Modern React (Vite) Single Page Application
│   ├── public/                  # Public static assets & product visuals
│   ├── src/
│   │   ├── components/          # Reusable UI components & modals
│   │   ├── context/             # AuthContext & ToastContext
│   │   ├── pages/               # React route pages (Home, Resources, Dashboard, etc.)
│   │   ├── services/api.js      # Centralized REST API client
│   │   ├── App.jsx              # Routing & application shell
│   │   └── index.css            # Modern design system & CSS variables
│   ├── package.json             # Frontend NPM scripts & dependencies
│   └── vite.config.js           # Vite build & backend proxy configuration
├── docker-compose.yml           # Multi-container orchestration (MySQL + Backend)
├── Dockerfile                   # Root Dockerfile for cloud builds (Render/Railway)
├── package.json                 # Root script runner for monorepo operations
├── vercel.json                  # Vercel deployment configuration for frontend
├── render.yaml                  # Render deployment blueprint definition
├── railway.json                 # Railway cloud deployment configuration
├── DEPLOYMENT.md                # Multi-platform deployment manual
└── start-project.bat            # 1-Click local development launcher
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Java 21** (JDK 21)
- **Aiven Cloud MySQL Database** (defaultdb)
- **Git**

### Method A: One-Click Windows Launcher
Double-click `run-crkh.bat` or `start-project.bat`. It will:
1. Connect directly to the Aiven Cloud MySQL Database (`mysql-2c01a104-bk8143116177-55d6.e.aivencloud.com:27465`).
2. Build and start Spring Boot on port 8080.
3. Automatically open `http://localhost:8080` in your browser.

### Method B: Command Line
```bash
# 1. Clone repository
git clone https://github.com/Bharath-Kumar-21/Campus-Resource-CRKH-.git
cd Campus-Resource-CRKH-

# 2. Cloud Database is pre-configured in application.properties
# (Aiven Cloud MySQL: defaultdb)

# 3. Build & Run Backend
cd backend
./mvnw clean spring-boot:run
```

Visit [**http://localhost:8080**](http://localhost:8080).

---

## 🐳 Docker Deployment

To launch both MySQL and Spring Boot in isolated containers:

```bash
docker compose up -d --build
```

- **Web Application**: `http://localhost:8080`
- **MySQL Database**: `localhost:3306`
- **Stop stack**: `docker compose down`

---

## ☁️ Deploy to Railway (Step-by-Step)

1. **Fork or Push** this repository to your GitHub account:
   ```bash
   git remote add origin https://github.com/Bharath-Kumar-21/Campus-Resource-CRKH-.git
   git push -u origin main
   ```
2. Log in to [Railway.app](https://railway.app) and select **New Project** → **Deploy from GitHub repo**.
3. Select `Campus-Resource-CRKH-`.
4. Click **+ New** on your Railway canvas → **Database** → **Add MySQL**.
5. Go to your backend service **Variables** tab and set:
   | Variable | Value |
   | :--- | :--- |
   | `DB_URL` | `jdbc:mysql://${{MySQL.MYSQLHOST}}:${{MySQL.MYSQLPORT}}/${{MySQL.MYSQLDATABASE}}?useSSL=false&allowPublicKeyRetrieval=true` |
   | `DB_USERNAME` | `${{MySQL.MYSQLUSER}}` |
   | `DB_PASSWORD` | `${{MySQL.MYSQLPASSWORD}}` |
   | `JWT_SECRET` | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` |
6. In **Settings** → **Networking**, click **Generate Domain** to receive your live public HTTPS link!

---

## 🔑 Default Seed Credentials

The database automatically seeds test accounts upon startup:

| Account | Role | Email | Password |
| :--- | :--- | :--- | :--- |
| **Student 1** | Standard Student | `student1@college.edu` | `Student@123` |
| **Student 2** | Standard Student | `student2@college.edu` | `Student@123` |
| **Admin** | System Administrator | `admin@college.edu` | `Admin@123` |

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

Developed by [Bharath Kumar](https://github.com/Bharath-Kumar-21).

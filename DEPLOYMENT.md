# Campus Resource & Knowledge Hub (CRKH) — Deployment Guide

This guide covers deploying the CRKH platform using Docker Compose, Cloud Platforms (Railway, Render), or any Linux/Cloud VPS.

---

## Option 1: One-Command Docker Compose (Local or VPS)

This method deploys both the **MySQL 8.0 database** and the **Spring Boot backend** in isolated Docker containers with persistent data volumes.

### Prerequisites
- Docker and Docker Compose installed ([Get Docker Desktop](https://www.docker.com/products/docker-desktop/))

### Steps
1. Navigate to the project root directory:
   ```bash
   cd D:\CRKH
   ```
2. Start all services in the background:
   ```bash
   docker compose up -d --build
   ```
3. Check container logs:
   ```bash
   docker compose logs -f backend
   ```
4. Access the application:
   - **Web Interface**: `http://localhost:8080`
   - **MySQL Port**: `localhost:3306`
5. Stop services:
   ```bash
   docker compose down
   ```

---

## Option 2: Deploy to Railway.app (Recommended Cloud)

Railway provides 1-click database provisioning and Docker deployment with a public HTTPS URL.

### Steps
1. Push your repository to **GitHub**:
   ```bash
   git init
   git add .
   git commit -m "CRKH production deployment configuration"
   git remote add origin https://github.com/YOUR_USERNAME/CRKH.git
   git push -u origin main
   ```
2. Go to [Railway.app](https://railway.app/) and click **New Project** → **Deploy from GitHub repo**.
3. Select your `CRKH` repository.
4. Click **+ New** in the project canvas and select **Database** → **Add MySQL**.
5. In your backend service **Variables** tab, add:
   - `DB_URL`: `jdbc:mysql://${{MySQL.MYSQLHOST}}:${{MySQL.MYSQLPORT}}/${{MySQL.MYSQLDATABASE}}?useSSL=false&allowPublicKeyRetrieval=true`
   - `DB_USERNAME`: `${{MySQL.MYSQLUSER}}`
   - `DB_PASSWORD`: `${{MySQL.MYSQLPASSWORD}}`
   - `JWT_SECRET`: `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970`
6. Click **Generate Domain** in Service Settings to get your public HTTPS URL (e.g. `https://crkh-production.up.railway.app`).

---

## Option 3: Deploy to Render.com

Render offers free web services and managed databases using the included `render.yaml` blueprint.

### Steps
1. Push your project to GitHub.
2. Sign in to [Render.com](https://render.com/).
3. Click **New** → **Blueprint**.
4. Connect your GitHub repository.
5. Render reads `render.yaml` and provisions both the MySQL database and the Docker web service automatically.
6. Once deployed, open your `.onrender.com` public URL.

---

## Option 4: Deploy on Linux VPS (AWS EC2 / DigitalOcean / Ubuntu)

1. Connect to your VPS via SSH:
   ```bash
   ssh ubuntu@your-server-ip
   ```
2. Install Docker & Docker Compose:
   ```bash
   sudo apt update
   sudo apt install -y docker.io docker-compose-v2
   sudo systemctl enable --now docker
   ```
3. Clone your repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/CRKH.git
   cd CRKH
   ```
4. Start the stack:
   ```bash
   sudo docker compose up -d --build
   ```
5. Configure reverse proxy (Nginx) with SSL (Certbot) for a custom domain:
   ```nginx
   server {
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:8080;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

---

## Default Seed Credentials

- **Student Account**: `student1@college.edu` / `Student@123`
- **Admin Account**: `admin@college.edu` / `Admin@123`

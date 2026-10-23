# NE-Dhanya Tours & Travels VPS Deployment Task Checklist & Commands

Run these commands in order on your VPS (logged in as `devuser` with `sudo` privileges).

> **Architecture Overview:**  
> This project is a full-stack **Next.js 14** application. Unlike NC-Electro, it does not require a local PostgreSQL database or Go runtime on the VPS because it integrates with **Firebase** (Firestore & Auth) and **Cloudinary** for cloud data and media storage. It runs as a Node.js service behind Nginx on port `3005` (avoiding collision with ports `3000-3003` and `8080` used by other apps on the server).

---

## 1. DNS Configuration
Before touching the server, add the following **A Records** in your domain registrar or DNS dashboard (GoDaddy, Namecheap, Cloudflare, etc.) for `nedhanyatourandtravels.in`:

- [ ] **A Record:** `@` &rarr; `<YOUR_VPS_IP>` (Apex domain: `nedhanyatourandtravels.in`)
- [ ] **A Record:** `www` &rarr; `<YOUR_VPS_IP>` (Subdomain: `www.nedhanyatourandtravels.in`)

*Verify DNS propagation from your local terminal before proceeding with SSL:*
```bash
dig +short nedhanyatourandtravels.in
dig +short www.nedhanyatourandtravels.in
```

---

## 2. Server Dependencies Check
Verify that the server has Node.js (v18+ or v20+), npm, and Nginx ready:

- [ ] **Verify Core Packages & Runtimes**
  ```bash
  # Check Node and npm
  node -v
  npm -v

  # Check Nginx and Certbot
  nginx -v
  certbot --version
  ```

  *(If Node.js is not installed or version < 18, install Node 20 LTS:)*
  ```bash
  # curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  # sudo apt-get install -y nodejs
  ```

---

## 3. Directory Structure Setup

- [ ] **Create Web Directory Hierarchy**
  ```bash
  # Create application directory
  sudo mkdir -p /var/www/nedhanyatourandtravels.in
  sudo chown -R devuser:devuser /var/www/nedhanyatourandtravels.in
  ```

---

## 4. Application Deployment (Next.js)

- [ ] **Clone Repository**
  ```bash
  cd /var/www/nedhanyatourandtravels.in

  # Clone repo using SSH (Recommended)
  git clone git@github.com:glovadev/NE-Dhanya-Tour-and-Travels.git .

  # (Alternative: using HTTPS with a GitHub Personal Access Token)
  # git clone https://github.com/glovadev/NE-Dhanya-Tour-and-Travels.git .
  ```

- [ ] **Configure Production Environment Variables**
  Create the `.env.production` file with your Firebase and Cloudinary configuration:
  ```bash
  cd /var/www/nedhanyatourandtravels.in

  # (Option A: Copy from example and edit)
  cp .env.example .env.production
  nano .env.production

  # (Option B: Or create directly using your actual credentials)
  cat << 'EOF' > .env.production
  # Firebase Client Config
  NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
  NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

  # Business Details & Site Config
  NEXT_PUBLIC_SITE_URL=https://nedhanyatourandtravels.in
  NEXT_PUBLIC_WHATSAPP_NUMBER=919387843282
  NEXT_PUBLIC_PHONE_NUMBER=+91 93878 43282
  NEXT_PUBLIC_SECONDARY_PHONE_NUMBER=+91 98640 66495
  NEXT_PUBLIC_EMAIL=munin.ghy123@gmail.com

  # Cloudinary Configuration
  CLOUDINARY_CLOUD_NAME=your_cloud_name
  CLOUDINARY_API_KEY=your_api_key
  CLOUDINARY_API_SECRET=your_api_secret
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
  EOF
  ```

- [ ] **Install Dependencies & Build Next.js Application**
  ```bash
  cd /var/www/nedhanyatourandtravels.in

  # Install project dependencies
  npm install

  # Build the Next.js production bundle
  npm run build
  ```

---

## 5. Systemd Service Setup

We will run the Next.js server on **Port 3005** so it doesn't conflict with existing apps (e.g. NC-Electro on ports 3000, 3001, 3002).

- [ ] **Create Systemd Service File**
  ```bash
  sudo tee /etc/systemd/system/nedhanya.service > /dev/null << 'EOF'
  [Unit]
  Description=NE-Dhanya Tour and Travels Next.js Application
  After=network.target

  [Service]
  User=devuser
  WorkingDirectory=/var/www/nedhanyatourandtravels.in
  ExecStart=/usr/bin/npm run start -- -p 3005
  Restart=always
  RestartSec=5
  Environment=NODE_ENV=production
  Environment=PORT=3005

  [Install]
  WantedBy=multi-user.target
  EOF
  ```

- [ ] **Enable & Start Systemd Service**
  ```bash
  sudo systemctl daemon-reload
  sudo systemctl enable nedhanya
  sudo systemctl start nedhanya

  # Verify running status
  sudo systemctl status nedhanya --no-pager
  ```

- [ ] **Verify Service Locally on VPS**
  ```bash
  curl -I http://localhost:3005
  ```

---

## 6. Nginx & SSL Configuration

- [ ] **Configure Nginx Server Block**
  ```bash
  sudo tee /etc/nginx/sites-available/nedhanyatourandtravels.in > /dev/null << 'EOF'
  server {
      listen 80;
      server_name nedhanyatourandtravels.in www.nedhanyatourandtravels.in;

      # Allow file/image uploads up to 25MB
      client_max_body_size 25M;

      location / {
          proxy_pass http://localhost:3005;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
      }
  }
  EOF
  ```

- [ ] **Enable Site & Test Nginx Configuration**
  ```bash
  sudo ln -sf /etc/nginx/sites-available/nedhanyatourandtravels.in /etc/nginx/sites-enabled/
  sudo nginx -t
  sudo systemctl restart nginx
  ```

- [ ] **Generate SSL Certificate with Let's Encrypt (Certbot)**
  ```bash
  sudo certbot --nginx -d nedhanyatourandtravels.in -d www.nedhanyatourandtravels.in
  ```

---

## 7. Verification & Health Checks

- [ ] **Test Web Application in Browser**
  - Public Storefront & Itineraries: `https://nedhanyatourandtravels.in`
  - Cloudinary Image Upload API Healthcheck: `https://nedhanyatourandtravels.in/api/cloudinary/upload` (returns JSON status)
  - Public Tour Packages: `https://nedhanyatourandtravels.in/tour-packages`

- [ ] **Check Logs if Needed**
  ```bash
  # View real-time application logs
  journalctl -u nedhanya -f

  # View Nginx access & error logs
  sudo tail -f /var/log/nginx/error.log
  ```

---

## 8. Ongoing Updates (Pulling Latest Code)

Keep this simple workflow handy whenever you push new changes to the repository:

- [ ] **Deploy Updates**
  ```bash
  cd /var/www/nedhanyatourandtravels.in
  git pull origin main

  # Install any new dependencies & rebuild
  npm install
  npm run build

  # Restart the Next.js service
  sudo systemctl restart nedhanya
  sudo systemctl status nedhanya --no-pager
  ```

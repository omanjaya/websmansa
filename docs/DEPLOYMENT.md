# Deployment Guide

## 🚀 Deployment Overview

Website akan di-deploy menggunakan Docker containers dengan strategi:

- **Frontend**: Next.js di port 3000
- **Backend**: Laravel Octane di port 8000  
- **Database**: MariaDB di port 3306
- **Cache**: Redis di port 6379
- **Reverse Proxy**: Nginx untuk SSL termination

## 📋 Prerequisites

### Server Requirements

**Minimum Specs**:

- CPU: 2 cores
- RAM: 4GB
- Storage: 50GB SSD
- OS: Ubuntu Server 22.04 LTS

**Recommended Specs**:

- CPU: 4 cores
- RAM: 8GB
- Storage: 100GB SSD
- OS: Ubuntu Server 22.04 LTS

### Domain & DNS

- Domain name (e.g., smansadps.sch.id)
- DNS A record pointing to server IP
- SSL certificate (Let's Encrypt)

### Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
sudo apt install git -y

# Install Certbot for SSL
sudo apt install certbot -y
```

## 🏗️ Project Structure

```
/var/www/smansa/
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env
├── frontend/
│   ├── Dockerfile
│   ├── .env.production
│   └── ... (Next.js files)
├── backend/
│   ├── Dockerfile
│   ├── .env
│   └── ... (Laravel files)
├── nginx/
│   ├── nginx.conf
│   └── ssl/
│       ├── fullchain.pem
│       └── privkey.pem
└── scripts/
    ├── deploy.sh
    ├── backup.sh
    └── restore.sh
```

## 🐳 Docker Configuration

### Frontend Dockerfile

```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Backend Dockerfile

```dockerfile
# backend/Dockerfile
FROM php:8.3-cli-alpine

# Install dependencies
RUN apk add --no-cache \
    curl \
    libzip-dev \
    zip \
    unzip \
    git \
    mysql-client \
    && docker-php-ext-install pdo_mysql zip

# Install Swoole
RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && pecl install swoole \
    && docker-php-ext-enable swoole \
    && apk del .build-deps

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy application
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 storage bootstrap/cache

EXPOSE 8000

CMD ["php", "artisan", "octane:start", "--server=swoole", "--host=0.0.0.0", "--port=8000"]
```

### Docker Compose (Production)

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  frontend:
    image: smansa-frontend:latest
    container_name: smansa_frontend
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://smansadps.sch.id/api
    networks:
      - smansa_network

  backend:
    image: smansa-backend:latest
    container_name: smansa_backend
    restart: unless-stopped
    env_file:
      - ./backend/.env
    environment:
      - APP_ENV=production
      - APP_DEBUG=false
      - DB_HOST=db
      - REDIS_HOST=redis
      - OCTANE_SERVER=swoole
    volumes:
      - ./backend/storage:/var/www/storage
      - ./backend/public:/var/www/public
    depends_on:
      - db
      - redis
    networks:
      - smansa_network

  db:
    image: mariadb:11
    container_name: smansa_db
    restart: unless-stopped
    environment:
      - MYSQL_ROOT_PASSWORD=${DB_ROOT_PASSWORD}
      - MYSQL_DATABASE=${DB_DATABASE}
      - MYSQL_USER=${DB_USERNAME}
      - MYSQL_PASSWORD=${DB_PASSWORD}
    volumes:
      - db_data:/var/lib/mysql
      - ./backups:/backups
    networks:
      - smansa_network

  redis:
    image: redis:7-alpine
    container_name: smansa_redis
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - smansa_network

  nginx:
    image: nginx:alpine
    container_name: smansa_nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./backend/public:/var/www/public:ro
    depends_on:
      - frontend
      - backend
    networks:
      - smansa_network

networks:
  smansa_network:
    driver: bridge

volumes:
  db_data:
  redis_data:
```

### Nginx Configuration

```nginx
# nginx/nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 20M;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/rss+xml font/truetype font/opentype 
               application/vnd.ms-fontobject image/svg+xml;

    # HTTP -> HTTPS redirect
    server {
        listen 80;
        server_name smansadps.sch.id www.smansadps.sch.id;
        return 301 https://smansadps.sch.id$request_uri;
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name smansadps.sch.id www.smansadps.sch.id;

        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

        # Frontend (Next.js)
        location / {
            proxy_pass http://frontend:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Backend API
        location /api {
            proxy_pass http://backend:8000;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Laravel public files (images, etc.)
        location /storage {
            alias /var/www/public/storage;
            expires 30d;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

## 🔑 SSL Certificate Setup

```bash
# Install Certbot
sudo apt install certbot -y

# Generate certificate
sudo certbot certonly --standalone -d smansadps.sch.id -d www.smansadps.sch.id

# Copy certificates
sudo cp /etc/letsencrypt/live/smansadps.sch.id/fullchain.pem /var/www/smansa/nginx/ssl/
sudo cp /etc/letsencrypt/live/smansadps.sch.id/privkey.pem /var/www/smansa/nginx/ssl/

# Set permissions
sudo chmod 644 /var/www/smansa/nginx/ssl/fullchain.pem
sudo chmod 600 /var/www/smansa/nginx/ssl/privkey.pem

# Auto-renewal (cron job)
sudo crontab -e
# Add: 0 0 * * * certbot renew --quiet && cp /etc/letsencrypt/live/smansadps.sch.id/*.pem /var/www/smansa/nginx/ssl/ && docker-compose -f /var/www/smansa/docker-compose.prod.yml restart nginx
```

## 🚀 Deployment Steps

### 1. Initial Setup

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/yourorg/smansa.git
cd smansa

# Create .env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.production

# Edit .env files with production values
nano backend/.env
nano frontend/.env.production
```

### 2. Build Docker Images

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Or pull from registry
docker-compose -f docker-compose.prod.yml pull
```

### 3. Run Database Migrations

```bash
# Start database first
docker-compose -f docker-compose.prod.yml up -d db

# Wait for database to be ready
sleep 10

# Run migrations
docker-compose -f docker-compose.prod.yml exec backend php artisan migrate --force

# Seed initial data
docker-compose -f docker-compose.prod.yml exec backend php artisan db:seed --class=ProductionSeeder
```

### 4. Start All Services

```bash
# Start all containers
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 5. Post-Deployment Tasks

```bash
# Clear and optimize Laravel
docker-compose -f docker-compose.prod.yml exec backend php artisan optimize
docker-compose -f docker-compose.prod.yml exec backend php artisan config:cache
docker-compose -f docker-compose.prod.yml exec backend php artisan route:cache
docker-compose -f docker-compose.prod.yml exec backend php artisan view:cache

# Set correct permissions
docker-compose -f docker-compose.prod.yml exec backend chown -R www-data:www-data storage bootstrap/cache
```

## 🔄 CI/CD with GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy via SSH
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/smansa
            git pull origin main
            docker-compose -f docker-compose.prod.yml build
            docker-compose -f docker-compose.prod.yml up -d
            docker-compose -f docker-compose.prod.yml exec -T backend php artisan migrate --force
            docker-compose -f docker-compose.prod.yml exec -T backend php artisan optimize
```

## 💾 Backup Strategy

### Automated Backup Script

```bash
#!/bin/bash
# scripts/backup.sh

BACKUP_DIR="/var/www/smansa/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Database backup
docker-compose -f /var/www/smansa/docker-compose.prod.yml exec -T db \
  mysqldump -u root -p${DB_ROOT_PASSWORD} ${DB_DATABASE} > ${BACKUP_DIR}/db_${DATE}.sql

# Compress
gzip ${BACKUP_DIR}/db_${DATE}.sql

# Storage backup
tar -czf ${BACKUP_DIR}/storage_${DATE}.tar.gz /var/www/smansa/backend/storage

# Keep only last 30 days
find ${BACKUP_DIR} -name "*.sql.gz" -mtime +30 -delete
find ${BACKUP_DIR} -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: ${DATE}"
```

### Cron Job for Daily Backup

```bash
# Add to crontab
sudo crontab -e

# Daily backup at 2 AM
0 2 * * * /var/www/smansa/scripts/backup.sh >> /var/log/backup.log 2>&1
```

## 📊 Monitoring Setup

### Health Check Endpoints

```php
// routes/api.php
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toIso8601String(),
        'database' => DB::connection()->getPdo() ? 'ok' : 'error',
        'cache' => Cache::has('health_check') ? 'ok' : 'error',
    ]);
});
```

### Uptime Monitoring

Use services like:

- UptimeRobot (free tier available)
- Pingdom
- StatusCake

Configure to check: `https://smansadps.sch.id/api/health` every 5 minutes

## 🔧 Troubleshooting

### Common Issues

**1. Container won't start:**

```bash
# Check logs
docker-compose logs backend

# Restart container
docker-compose restart backend
```

**2. Database connection error:**

```bash
# Check DB is running
docker-compose ps db

# Check connection from backend
docker-compose exec backend php artisan tinker
# >>> DB::connection()->getPdo();
```

**3. Storage permissions:**

```bash
docker-compose exec backend chown -R www-data:www-data storage bootstrap/cache
docker-compose exec backend chmod -R 775 storage bootstrap/cache
```

**4. Clear all caches:**

```bash
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan config:clear
docker-compose exec backend php artisan route:clear
docker-compose exec backend php artisan view:clear
```

## 🔄 Update/Rollback

### Update to New Version

```bash
# Pull latest code
cd /var/www/smansa
git pull origin main

# Rebuild & restart
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose -f docker-compose.prod.yml exec backend php artisan migrate --force
```

### Rollback

```bash
# Revert Git
git log # Find commit hash
git reset --hard <commit-hash>

# Rebuild
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Rollback migrations
docker-compose -f docker-compose.prod.yml exec backend php artisan migrate:rollback --step=1
```

## 📈 Scaling

### Horizontal Scaling

```yaml
# docker-compose.prod.yml
services:
  backend:
    deploy:
      replicas: 3
    # ... rest of config
```

### Load Balancer (Nginx)

```nginx
upstream backend {
    least_conn;
    server backend1:8000;
    server backend2:8000;
    server backend3:8000;
}
```

## 🎯 Deployment Checklist

### Pre-Deployment

- [ ] Code tested locally
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] SSL certificate ready
- [ ] Database backup created
- [ ] DNS configured
- [ ] Monitoring setup

### Deployment

- [ ] Deploy to staging first
- [ ] Run smoke tests
- [ ] Deploy to production
- [ ] Run migrations
- [ ] Clear caches
- [ ] Verify all services running

### Post-Deployment

- [ ] Check all pages load
- [ ] Test critical user flows
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify backups working
- [ ] Update documentation

## 🎯 Summary

Deployment menggunakan:

- ✅ **Docker** - Containerized deployment
- ✅ **Docker Compose** - Multi-container orchestration
- ✅ **Nginx** - Reverse proxy & SSL termination
- ✅ **GitHub Actions** - Automated CI/CD
- ✅ **Let's Encrypt** - Free SSL certificates
- ✅ **Automated Backups** - Daily database & storage backups
- ✅ **Health Monitoring** - Uptime checks & alerts

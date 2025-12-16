#!/bin/bash

echo "🚀 Setting up SMANSA Website Project..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backend setup
echo -e "${YELLOW}Setting up backend...${NC}"
cd backend

# Install dependencies
if [ ! -d "vendor" ]; then
    composer install
fi

# Setup environment
if [ ! -f ".env" ]; then
    cp .env.example .env
    php artisan key:generate
fi

# Run migrations
echo -e "${YELLOW}Running migrations...${NC}"
php artisan migrate:fresh --seed

# Storage link
echo -e "${YELLOW}Creating storage link...${NC}"
php artisan storage:link

# Optimize
echo -e "${YELLOW}Optimizing application...${NC}"
php artisan optimize

# Frontend setup
echo -e "${YELLOW}Setting up frontend...${NC}"
cd ../frontend

# Install dependencies
if [ ! -d "node_modules" ]; then
    npm install
fi

# Build
echo -e "${YELLOW}Building frontend...${NC}"
npm run build

echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Backend: cd backend && php artisan serve"
echo "2. Frontend: cd frontend && npm run dev"
echo "3. Or use Docker: docker-compose up -d"
echo ""
echo "📍 URLs:"
echo "- Frontend: http://localhost:3000"
echo "- Backend: http://localhost:8000"
echo "- Database: localhost:3306 (root/secret)"

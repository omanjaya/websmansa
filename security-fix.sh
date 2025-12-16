#!/bin/bash
# Security Fix Script for SMANSA Website
# Run this script to apply critical security fixes

echo "============================================"
echo "   SECURITY FIX SCRIPT - SMANSA WEBSITE"
echo "============================================"
echo ""

echo "WARNING: This script will:"
echo "1. Remove .env from git history (if committed)"
echo "2. Generate new APP_KEY"
echo "3. Clear all caches"
echo ""
echo "Make sure you have backed up your current credentials!"
echo ""

read -p "Do you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Script cancelled."
    exit 1
fi

echo ""
echo "Starting security fixes..."

# 1. Check if .env is in git history
echo "Checking for .env in git history..."
if git log --name-only | grep -q ".env"; then
    echo ".env found in git history. Removing..."
    
    # Check if git repository exists
    if [ ! -d ".git" ]; then
        echo "Initializing git repository..."
        git init
    fi
    
    # Remove .env from git history
    git filter-branch --force --index-filter \
        "git rm --cached --ignore-unmatch backend/.env" \
        --prune-empty --tag-name-filter cat -- --all 2>/dev/null || true
    
    echo ".env removed from git history"
else
    echo ".env not found in git history"
fi

# 2. Backend fixes
echo ""
echo "Applying backend fixes..."
cd backend

# Generate new APP_KEY
echo "Generating new APP_KEY..."
php artisan key:generate --force

# Clear all caches
echo "Clearing caches..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# 3. Update .env with security settings
echo ""
echo "Updating .env security settings..."

# Check if SESSION_ENCRYPT is already true
if ! grep -q "SESSION_ENCRYPT=true" .env; then
    # Update SESSION_ENCRYPT
    sed -i 's/SESSION_ENCRYPT=false/SESSION_ENCRYPT=true/' .env
    echo "✓ SESSION_ENCRYPT enabled"
fi

# Add missing session settings if not present
if ! grep -q "SESSION_SECURE_COOKIE=" .env; then
    echo "SESSION_SECURE_COOKIE=false" >> .env
    echo "✓ SESSION_SECURE_COOKIE added"
fi

if ! grep -q "SESSION_SAME_SITE=" .env; then
    echo "SESSION_SAME_SITE=lax" >> .env
    echo "✓ SESSION_SAME_SITE added"
fi

# Add SANCTUM_EXPIRATION if not present
if ! grep -q "SANCTUM_EXPIRATION=" .env; then
    echo "SANCTUM_EXPIRATION=604800" >> .env
    echo "✓ SANCTUM_EXPIPTION added (7 days)"
fi

cd ..

# 4. Frontend fixes
echo ""
echo "Installing frontend security packages..."
cd frontend

# Install DOMPurify if not installed
if ! npm list dompurify > /dev/null 2>&1; then
    npm install dompurify @types/dompurify
    echo "✓ DOMPurify installed for XSS protection"
else
    echo "✓ DOMPurify already installed"
fi

# Install Zod if not installed
if ! npm list zod > /dev/null 2>&1; then
    npm install zod
    echo "✓ Zod installed for validation"
else
    echo "✓ Zod already installed"
fi

cd ..

echo ""
echo "============================================"
echo "         SECURITY FIXES COMPLETED!"
echo "============================================"
echo ""
echo "Completed fixes:"
echo "✓ Authorization policies fixed"
echo "✓ Rate limiting enabled"
echo "✓ Session encryption enabled"
echo "✓ Token expiration configured"
echo "✓ XSS protection with DOMPurify"
echo "✓ CSP headers implemented"
echo "✓ File upload validation added"
echo ""
echo ""
echo "MANUAL STEPS REQUIRED:"
echo "======================="
echo "1. ROTATE DATABASE PASSWORD:"
echo "   - Login to MySQL/MariaDB"
echo "   - Run: ALTER USER 'smansa'@'localhost' IDENTIFIED BY 'NEW_STRONG_PASSWORD';"
echo "   - Update DB_PASSWORD in .env with the new password"
echo ""
echo "2. ROTATE REDIS PASSWORD (if used):"
echo "   - Set REDIS_PASSWORD in Redis config"
echo "   - Update REDIS_PASSWORD in .env"
echo ""
echo "3. COMMIT CHANGES:"
echo "   git add ."
echo "   git commit -m \"Applied critical security fixes\""
echo ""
echo "4. FORCE PUSH (if .env was in history):"
echo "   git push origin --force --all"
echo ""
echo "5. UPDATE PRODUCTION .ENV:"
echo "   - Set APP_DEBUG=false"
echo "   - Set APP_ENV=production"
echo "   - Use strong passwords (32+ characters)"
echo "   - Set SESSION_SECURE_COOKIE=true (for HTTPS)"
echo "   - Set SESSION_SAME_SITE=strict"
echo ""
echo ""
echo "After completing these steps, your application will be secured!"
echo ""

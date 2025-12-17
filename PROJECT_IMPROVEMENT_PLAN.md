# SMANSA Website - Improvement Plan

## Overview
Realistic improvement plan for SMA Negeri 1 Denpasar school website.

**Tech Stack:**
- **Frontend**: Next.js 14 on Vercel
- **Backend**: Laravel 11 on Railway
- **Database**: MySQL/PostgreSQL on Railway

---

## Phase 1: Production Ready (1-2 Weeks)

### Security Basics
- [ ] Validate all environment variables (APP_KEY, DB credentials, etc.)
- [ ] Configure CORS to only allow production domains
- [ ] Verify rate limiting on login/auth endpoints
- [ ] Add input validation and sanitization on all forms
- [ ] Secure file uploads (validate mime types, max file size)
- [ ] Ensure proper error messages (no sensitive data exposure)

### Code Cleanup
- [ ] Remove all `console.log` statements from production code
- [ ] Remove unused dummy data and fallbacks
- [ ] Fix critical TypeScript errors (warnings can be ignored)
- [ ] Implement consistent API error response format

### Environment Setup
- [ ] Configure environment variables on Vercel
- [ ] Configure environment variables on Railway
- [ ] Setup custom domain (sman1denpasar.sch.id)
- [ ] Verify SSL certificates (automatic on both platforms)

---

## Phase 2: Performance & SEO (1 Week)

### Performance Optimization
- [ ] Verify image optimization (thumbnail system already exists)
- [ ] Confirm lazy loading for images and components
- [ ] Add database indexes for frequently queried columns
- [ ] Enable Laravel response caching for public API endpoints
- [ ] Verify Next.js static generation where applicable

### SEO Implementation
- [ ] Verify meta tags on all public pages
- [ ] Ensure sitemap.xml is generated and accessible
- [ ] Submit sitemap to Google Search Console
- [ ] Verify Open Graph tags for social media sharing
- [ ] Add structured data (JSON-LD) for school organization

### Mobile Optimization
- [ ] Test responsive design across devices
- [ ] Optimize touch targets for mobile users
- [ ] Test loading speed on 3G/4G connections
- [ ] Verify mobile navigation functionality

---

## Phase 3: Monitoring & Backup (3-5 Days)

### Monitoring (Free Tier)
- [ ] Setup UptimeRobot for uptime monitoring
- [ ] Enable Vercel Analytics (built-in)
- [ ] Setup Google Analytics for traffic insights
- [ ] Configure error notifications via email

### Backup Strategy
- [ ] Enable automatic database backup on Railway
- [ ] Create manual backup procedure before major updates
- [ ] Setup periodic backup for uploaded files/storage
- [ ] Document restore procedures

### Error Tracking (Optional)
- [ ] Setup Sentry free tier for error tracking
- [ ] Or simply monitor Laravel logs via Railway dashboard

---

## Phase 4: Ongoing Maintenance

### Regular Tasks
- [ ] Update npm dependencies monthly
- [ ] Update composer dependencies monthly
- [ ] Review security advisories
- [ ] Weekly database backups
- [ ] Monitor disk usage on Railway

### Future Enhancements (Nice to Have)
- [ ] Email notifications for important announcements
- [ ] PWA with push notifications
- [ ] Academic calendar integration
- [ ] Enhanced alumni portal with registration

---

## Deployment Checklist

### Backend (Railway)

**Environment Variables:**
```env
APP_NAME="SMAN 1 Denpasar"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.sman1denpasar.sch.id

DB_CONNECTION=mysql
DB_HOST=<railway-mysql-host>
DB_PORT=3306
DB_DATABASE=smansa
DB_USERNAME=<username>
DB_PASSWORD=<password>

FRONTEND_URL=https://sman1denpasar.sch.id
SESSION_DOMAIN=.sman1denpasar.sch.id
SANCTUM_STATEFUL_DOMAINS=sman1denpasar.sch.id
```

**Post-Deploy Commands:**
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
php artisan storage:link
```

### Frontend (Vercel)

**Environment Variables:**
```env
NEXT_PUBLIC_API_URL=https://api.sman1denpasar.sch.id/api/v1
NEXT_PUBLIC_SITE_URL=https://sman1denpasar.sch.id
```

### Post-Deployment Verification
- [ ] Test all public pages load correctly
- [ ] Test admin login functionality
- [ ] Test image upload in admin panel
- [ ] Test CRUD operations (create post, update, delete)
- [ ] Verify SEO meta tags with browser dev tools
- [ ] Test on mobile devices
- [ ] Verify API responses are correct

---

## Monthly Cost Estimate

| Service | Cost |
|---------|------|
| Vercel (Hobby/Pro) | $0 - $20/month |
| Railway (Starter) | ~$5 - $15/month |
| Domain (.sch.id) | ~$10/year |
| UptimeRobot | Free |
| Google Analytics | Free |
| **Total** | **~$10 - $40/month** |

---

## Timeline Summary

| Phase | Duration | Priority |
|-------|----------|----------|
| Phase 1: Production Ready | 1-2 weeks | High |
| Phase 2: Performance & SEO | 1 week | Medium |
| Phase 3: Monitoring & Backup | 3-5 days | Medium |
| Phase 4: Maintenance | Ongoing | Low |

**Total time to go-live: ~3-4 weeks**

---

## Quick Wins (Do First)

1. Setup environment variables on Vercel & Railway
2. Push code and verify deployment works
3. Configure custom domain with SSL
4. Test all features in production
5. Setup UptimeRobot for monitoring

---

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│  Vercel         │────▶│  Railway        │
│  (Next.js)      │     │  (Laravel API)  │
│                 │     │                 │
└─────────────────┘     └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │                 │
                        │  Railway MySQL  │
                        │  (Database)     │
                        │                 │
                        └─────────────────┘
```

---

## Notes

- This plan is tailored for a **school website** with normal traffic patterns
- No need for Kubernetes, Elasticsearch, or complex infrastructure
- Vercel and Railway handle auto-scaling automatically
- Focus on **stability** and **maintainability**, not over-engineering
- The current codebase is already functional, just needs production hardening

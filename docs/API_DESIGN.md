# API Design Documentation

## 🎯 API Design Principles

1. **RESTful** - Follow REST conventions
2. **Consistent** - Same patterns across all endpoints
3. **Versioned** - API versioning for backward compatibility
4. **Documented** - OpenAPI/Swagger documentation
5. **Secure** - Authentication & authorization
6. **Performant** - Caching, pagination, filtering

## 🔗 Base URL

```
Production:  https://api.smansadps.sch.id/api/v1
Staging:     https://staging-api.smansadps.sch.id/api/v1
Development: http://localhost:8000/api/v1
```

## 🔐 Authentication

### Laravel Sanctum (SPA Authentication)

**Login:**

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}

Response (200 OK):
{
  "data": {
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@example.com"
    },
    "token": "1|abc123..."
  }
}
```

**Authenticated Requests:**

```http
GET /api/v1/posts
Authorization: Bearer 1|abc123...
```

**Logout:**

```http
POST /api/v1/auth/logout
Authorization: Bearer 1|abc123...

Response (204 No Content)
```

## 📋 API Endpoints

### Public Endpoints (No Auth Required)

#### **Posts (Informasi/Berita)**

**List Posts:**

```http
GET /api/v1/posts?page=1&per_page=15&category=news&search=prestasi&sort=-published_at

Response (200 OK):
{
  "data": [
    {
      "id": 1,
      "type": "post",
      "attributes": {
        "title": "Prestasi Siswa di Olimpiade",
        "slug": "prestasi-siswa-di-olimpiade",
        "excerpt": "Siswa SMAN 1 Denpasar meraih...",
        "content": null,
        "image": "https://cdn.example.com/posts/image.jpg",
        "status": "published",
        "views": 150,
        "likes": 25,
        "publishedAt": "2025-01-15T10:00:00Z",
        "createdAt": "2025-01-14T08:00:00Z",
        "updatedAt": "2025-01-14T08:00:00Z"
      },
      "relationships": {
        "author": {
          "data": { "id": 1, "type": "user" }
        },
        "categories": {
          "data": [
            { "id": 2, "type": "category" }
          ]
        }
      }
    }
  ],
  "included": [
    {
      "id": 1,
      "type": "user",
      "attributes": {
        "name": "Admin",
        "avatar": "https://cdn.example.com/avatars/1.jpg"
      }
    },
    {
      "id": 2,
      "type": "category",
      "attributes": {
        "name": "Prestasi",
        "slug": "prestasi"
      }
    }
  ],
  "meta": {
    "total": 100,
    "perPage": 15,
    "currentPage": 1,
    "lastPage": 7,
    "from": 1,
    "to": 15
  },
  "links": {
    "first": "https://api.example.com/posts?page=1",
    "last": "https://api.example.com/posts?page=7",
    "prev": null,
    "next": "https://api.example.com/posts?page=2"
  }
}
```

**Query Parameters:**

- `page` (integer, default: 1) - Page number
- `per_page` (integer, default: 15, max: 100) - Items per page
- `category` (string) - Filter by category slug
- `search` (string) - Full-text search
- `sort` (string) - Sort field (prefix with `-` for DESC)
  - `published_at`, `-published_at`, `views`, `-views`, `title`, `-title`
- `status` (string, admin only) - Filter by status (draft, published, archived)

**Get Single Post:**

```http
GET /api/v1/posts/{slug}

Response (200 OK):
{
  "data": {
    "id": 1,
    "type": "post",
    "attributes": {
      "title": "...",
      "slug": "...",
      "content": "Full content here...", // Included in detail view
      "image": "...",
      "galleries": [
        {
          "id": 1,
          "url": "https://cdn.example.com/gallery/1.jpg",
          "caption": "..."
        }
      ],
      "relatedPosts": [...] // 3-5 related posts
    },
    "relationships": {...}
  }
}
```

**Like Post:**

```http
POST /api/v1/posts/{id}/like

Response (200 OK):
{
  "data": {
    "likes": 26,
    "isLiked": true
  }
}
```

**Increment View Count:**

```http
POST /api/v1/posts/{id}/view

Response (204 No Content)
```

#### **Categories**

```http
GET /api/v1/categories

Response (200 OK):
{
  "data": [
    {
      "id": 1,
      "type": "category",
      "attributes": {
        "name": "Berita",
        "slug": "berita",
        "description": "...",
        "postsCount": 45
      }
    }
  ]
}
```

#### **Announcements (Pengumuman)**

```http
GET /api/v1/announcements?page=1

Response: Similar to posts structure
```

#### **Extracurriculars (Ekstrakurikuler)**

```http
GET /api/v1/extras?category=sports

Response (200 OK):
{
  "data": [
    {
      "id": 1,
      "type": "extra",
      "attributes": {
        "name": "Basket",
        "slug": "basket",
        "description": "...",
        "category": "sports",
        "logo": "...",
        "schedule": "Senin & Rabu, 15:00-17:00",
        "contactPerson": "Bapak Ahmad",
        "contactPhone": "081234567890"
      }
    }
  ]
}

GET /api/v1/extras/{slug} - Get single extra
```

#### **Facilities (Fasilitas)**

```http
GET /api/v1/facilities

Response: Similar structure
GET /api/v1/facilities/{slug}
```

#### **Staff & Teachers**

```http
GET /api/v1/staff?department=mathematics&search=john

Response (200 OK):
{
  "data": [
    {
      "id": 1,
      "type": "staff",
      "attributes": {
        "nip": "196501011990031001",
        "name": "John Doe, S.Pd., M.Pd.",
        "photo": "...",
        "position": "Guru Matematika",
        "department": "Matematika",
        "subjects": ["Matematika Wajib", "Matematika Peminatan"],
        "qualifications": "S2 Pendidikan Matematika"
      }
    }
  ]
}
```

#### **Galleries**

```http
GET /api/v1/galleries?type=photo&year=2024

Response (200 OK):
{
  "data": [
    {
      "id": 1,
      "type": "gallery",
      "attributes": {
        "title": "Penerimaan Siswa Baru 2024",
        "slug": "psb-2024",
        "thumbnail": "...",
        "type": "photo",
        "eventDate": "2024-07-15",
        "itemsCount": 25
      }
    }
  ]
}

GET /api/v1/galleries/{slug}
Response: Include gallery items
```

#### **Alumni**

```http
GET /api/v1/alumni?year=2020&search=john

Response (200 OK):
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "John Alumni",
        "graduationYear": 2020,
        "photo": "...",
        "currentOccupation": "Software Engineer",
        "currentInstitution": "Google"
      }
    }
  ]
}
```

#### **Tracer Study Submission**

```http
POST /api/v1/tracer-study
Content-Type: application/json

{
  "name": "John Doe",
  "graduationYear": 2020,
  "email": "john@example.com",
  "phone": "081234567890",
  "currentStatus": "working",
  "occupation": "Software Engineer",
  "institutionName": "Google",
  "isContinuingEducation": false,
  "satisfactionCurriculum": 5,
  "satisfactionFacilities": 4,
  "satisfactionTeachers": 5,
  "suggestions": "Keep up the good work!"
}

Response (201 Created):
{
  "data": {
    "id": 1,
    "message": "Thank you for your submission!"
  }
}
```

#### **Contact Form**

```http
POST /api/v1/contact
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "081234567890",
  "subject": "Pertanyaan tentang PPDB",
  "message": "Saya ingin bertanya..."
}

Response (201 Created):
{
  "data": {
    "id": 1,
    "message": "Your message has been sent successfully!"
  }
}
```

#### **Settings (Public)**

```http
GET /api/v1/settings/public

Response (200 OK):
{
  "data": {
    "siteName": "SMA Negeri 1 Denpasar",
    "siteTagline": "...",
    "siteLogo": "...",
    "contactEmail": "...",
    "contactPhone": "...",
    "contactAddress": "...",
    "socialMedia": {
      "facebook": "...",
      "instagram": "...",
      "youtube": "..."
    }
  }
}
```

### Admin Endpoints (Auth Required)

#### **Posts Management**

**Create Post:**

```http
POST /api/v1/admin/posts
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "title": "New Post Title",
  "content": "<p>Content...</p>",
  "excerpt": "Short excerpt...",
  "status": "draft",
  "publishedAt": "2025-01-20T10:00:00Z",
  "categories": [1, 2],
  "image": <file>,
  "galleries": [<file1>, <file2>]
}

Response (201 Created):
{
  "data": {
    "id": 1,
    "type": "post",
    "attributes": {...}
  }
}
```

**Update Post:**

```http
PUT /api/v1/admin/posts/{id}
PATCH /api/v1/admin/posts/{id} // Partial update

Response (200 OK)
```

**Delete Post:**

```http
DELETE /api/v1/admin/posts/{id}

Response (204 No Content)
```

**Restore Soft-Deleted Post:**

```http
POST /api/v1/admin/posts/{id}/restore

Response (200 OK)
```

**Publish Post:**

```http
POST /api/v1/admin/posts/{id}/publish

Response (200 OK)
```

#### **Media Library**

```http
POST /api/v1/admin/media
Content-Type: multipart/form-data

{
  "file": <file>,
  "alt_text": "Description"
}

Response (201 Created):
{
  "data": {
    "id": 1,
    "type": "media",
    "attributes": {
      "name": "original-filename.jpg",
      "url": "https://cdn.example.com/media/1.jpg",
      "mimeType": "image/jpeg",
      "size": 1024000,
      "width": 1920,
      "height": 1080
    }
  }
}

GET /api/v1/admin/media?page=1&type=image - List media
DELETE /api/v1/admin/media/{id} - Delete media
```

#### **Users Management**

```http
GET /api/v1/admin/users - List users
POST /api/v1/admin/users - Create user
PUT /api/v1/admin/users/{id} - Update user
DELETE /api/v1/admin/users/{id} - Delete user
POST /api/v1/admin/users/{id}/roles - Assign roles
```

#### **Analytics**

```http
GET /api/v1/admin/analytics/dashboard

Response (200 OK):
{
  "data": {
    "totalPosts": 150,
    "totalViews": 50000,
    "totalLikes": 3500,
    "topPosts": [...],
    "recentActivities": [...],
    "viewsByDate": {
      "2025-01-01": 500,
      "2025-01-02": 650
    }
  }
}

GET /api/v1/admin/analytics/posts/{id} - Post analytics
GET /api/v1/admin/analytics/tracer-study - Tracer study analytics
```

## 📐 Response Format Standards

### Success Response

```json
{
  "data": { /* resource or collection */ },
  "included": [ /* related resources */ ],
  "meta": { /* pagination, counts, etc */ },
  "links": { /* pagination links */ }
}
```

### Error Response

```json
{
  "message": "Error message",
  "errors": {
    "field_name": [
      "Validation error message"
    ]
  },
  "trace": [ /* Only in development */ ]
}
```

### HTTP Status Codes

- `200 OK` - Successful GET, PUT, PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Client error
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation error
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

## 🔒 Rate Limiting

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1640000000
```

**Limits:**

- Public endpoints: 60 requests/minute
- Authenticated: 120 requests/minute
- Admin: 240 requests/minute

## 📄 Pagination

**Default:** 15 items per page
**Max:** 100 items per page

```http
GET /api/v1/posts?page=2&per_page=20
```

**Cursor-based Pagination (for infinite scroll):**

```http
GET /api/v1/posts?cursor=eyJpZCI6MTAwfQ&limit=20

Response:
{
  "data": [...],
  "meta": {
    "nextCursor": "eyJpZCI6MTIwfQ",
    "hasMore": true
  }
}
```

## 🔍 Filtering & Sorting

```http
# Filtering
GET /api/v1/posts?category=news&status=published

# Sorting
GET /api/v1/posts?sort=-published_at,title

# Search
GET /api/v1/posts?search=prestasi+siswa

# Include relationships
GET /api/v1/posts?include=author,categories

# Field selection (sparse fieldsets)
GET /api/v1/posts?fields[posts]=title,excerpt&fields[user]=name
```

## 📊 Batch Operations

```http
POST /api/v1/admin/posts/batch
Content-Type: application/json

{
  "action": "delete",
  "ids": [1, 2, 3, 4, 5]
}

Response (200 OK):
{
  "data": {
    "success": [1, 2, 3],
    "failed": [4, 5],
    "errors": {
      "4": "Post not found",
      "5": "Permission denied"
    }
  }
}
```

## 🔄 Webhooks (Optional)

For real-time notifications:

```http
POST /api/v1/admin/webhooks
Content-Type: application/json

{
  "url": "https://example.com/webhook",
  "events": ["post.created", "post.published"],
  "secret": "webhook_secret_key"
}
```

## 📡 WebSockets (Optional - for real-time features)

Using Laravel Broadcasting:

```javascript
// Frontend
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: process.env.PUSHER_APP_KEY,
  cluster: process.env.PUSHER_APP_CLUSTER,
});

// Listen to events
window.Echo.channel('posts')
  .listen('PostPublished', (e) => {
    console.log('New post:', e.post);
  });
```

## 🧪 API Testing

### Example with cURL

```bash
# List posts
curl -X GET "https://api.example.com/api/v1/posts?page=1" \
  -H "Accept: application/json"

# Create post (admin)
curl -X POST "https://api.example.com/api/v1/admin/posts" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post",
    "content": "Content here",
    "status": "draft"
  }'
```

### Example with JavaScript (Fetch API)

```javascript
// List posts
const response = await fetch('https://api.example.com/api/v1/posts');
const data = await response.json();

// Create post
const response = await fetch('https://api.example.com/api/v1/admin/posts', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Test Post',
    content: 'Content here',
    status: 'draft',
  }),
});
```

## 📖 OpenAPI/Swagger Documentation

Auto-generated API docs available at:

```
https://api.example.com/api/documentation
```

Generated using [L5-Swagger](https://github.com/DarkaOnLine/L5-Swagger):

```php
/**
 * @OA\Get(
 *     path="/api/v1/posts",
 *     summary="List posts",
 *     tags={"Posts"},
 *     @OA\Parameter(
 *         name="page",
 *         in="query",
 *         description="Page number",
 *         required=false,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(response=200, description="Success")
 * )
 */
```

## 🔐 Security Best Practices

1. **Authentication**: Laravel Sanctum tokens
2. **HTTPS Only**: Force SSL in production
3. **CORS**: Configured for frontend domain only
4. **Input Validation**: All inputs validated
5. **Rate Limiting**: Prevent abuse
6. **SQL Injection**: Prevented by Eloquent ORM
7. **XSS**: Output escaping
8. **CSRF**: Sanctum handles this for SPAs

## 📝 Changelog & Versioning

**Versioning Strategy:**

- `/api/v1/` - Current stable version
- `/api/v2/` - Next major version (breaking changes)

**Deprecation Policy:**

- Deprecated endpoints: 6 months notice
- Version support: Minimum 12 months

## 🎯 Summary

API dirancang dengan prinsip:

- ✅ **RESTful** - Following REST conventions
- ✅ **Consistent** - Same patterns everywhere
- ✅ **Documented** - OpenAPI/Swagger docs
- ✅ **Secure** - Authentication & validation
- ✅ **Performant** - Caching & pagination
- ✅ **Developer-Friendly** - Clear responses & errors

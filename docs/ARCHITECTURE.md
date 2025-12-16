# Architecture Documentation

## 🏛️ Arsitektur Anti-Refactor

Prinsip utama arsitektur ini adalah **"Write Once, Scale Forever"** dengan separation of concerns yang jelas dan dependency injection yang proper.

## 📐 Architecture Patterns

### 1. Clean Architecture (Backend)

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│    (Controllers, Resources)         │
└───────────────┬─────────────────────┘
                │
┌───────────────▼─────────────────────┐
│        Application Layer            │
│  (Actions, Services, DTOs)          │
└───────────────┬─────────────────────┘
                │
┌───────────────▼─────────────────────┐
│          Domain Layer               │
│      (Models, Repositories)         │
└───────────────┬─────────────────────┘
                │
┌───────────────▼─────────────────────┐
│      Infrastructure Layer           │
│  (Database, Cache, External APIs)   │
└─────────────────────────────────────┘
```

### 2. Component-Based Architecture (Frontend)

```
┌─────────────────────────────────────┐
│            Pages (Routes)           │
│        (app/*/page.tsx)             │
└───────────────┬─────────────────────┘
                │
┌───────────────▼─────────────────────┐
│         Feature Components          │
│    (Smart/Container Components)     │
└───────────────┬─────────────────────┘
                │
┌───────────────▼─────────────────────┐
│           UI Components             │
│      (Dumb/Presentational)          │
└───────────────┬─────────────────────┘
                │
┌───────────────▼─────────────────────┐
│         Primitive Components        │
│        (shadcn/ui, atoms)           │
└─────────────────────────────────────┘
```

## 🔄 Request Flow

### Frontend → Backend

```
User Action
    ↓
React Component (UI)
    ↓
Custom Hook (useQuery/useMutation)
    ↓
API Service Layer (axios instance)
    ↓
HTTP Request (JSON)
    ↓
Nginx Reverse Proxy
    ↓
Laravel Octane (Swoole)
    ↓
Route → Middleware → Controller
    ↓
Action/Service (Business Logic)
    ↓
Repository (Data Access)
    ↓
Eloquent Model ↔ MariaDB
    ↓
Response (JSON Resource)
    ↓
React Query Cache
    ↓
Component Re-render
```

## 📦 Layered Architecture Detail

### Backend Layers

#### 1. **Presentation Layer**

**Responsibility**: Handle HTTP requests/responses

```php
// app/Http/Controllers/Api/PostController.php
class PostController extends Controller
{
    public function __construct(
        private GetPostsAction $getPostsAction,
        private CreatePostAction $createPostAction
    ) {}

    public function index(IndexPostRequest $request): JsonResponse
    {
        $posts = $this->getPostsAction->execute(
            PostFilterDTO::fromRequest($request)
        );

        return PostResource::collection($posts)->response();
    }
}
```

**Files**:

- Controllers: `app/Http/Controllers/`
- Requests: `app/Http/Requests/`
- Resources: `app/Http/Resources/`
- Middleware: `app/Http/Middleware/`

#### 2. **Application Layer**

**Responsibility**: Business logic orchestration

```php
// app/Actions/Post/GetPostsAction.php
class GetPostsAction
{
    public function __construct(
        private PostRepository $repository,
        private CacheService $cache
    ) {}

    public function execute(PostFilterDTO $filter): LengthAwarePaginator
    {
        $cacheKey = "posts:{$filter->toHash()}";

        return $this->cache->remember($cacheKey, 3600, function () use ($filter) {
            return $this->repository->getFiltered($filter);
        });
    }
}
```

**Files**:

- Actions: `app/Actions/` (single-responsibility operations)
- Services: `app/Services/` (complex business logic)
- DTOs: `app/DTOs/` (data transfer objects)
- Events: `app/Events/`
- Listeners: `app/Listeners/`

#### 3. **Domain Layer**

**Responsibility**: Core business entities

```php
// app/Models/Post.php
class Post extends Model
{
    // Eloquent relationships, scopes, accessors/mutators
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published')
                    ->whereNotNull('published_at')
                    ->where('published_at', '<=', now());
    }
}

// app/Repositories/PostRepository.php
class PostRepository extends BaseRepository
{
    public function getFiltered(PostFilterDTO $filter): LengthAwarePaginator
    {
        return $this->model
            ->published()
            ->when($filter->category, fn($q) => $q->whereHas('category', fn($q) => $q->where('slug', $filter->category)))
            ->when($filter->search, fn($q) => $q->search($filter->search))
            ->latest('published_at')
            ->paginate($filter->perPage);
    }
}
```

**Files**:

- Models: `app/Models/`
- Repositories: `app/Repositories/`
- Enums: `app/Enums/`
- Traits: `app/Traits/`

#### 4. **Infrastructure Layer**

**Responsibility**: External services & data persistence

```php
// app/Services/CacheService.php
class CacheService
{
    public function remember(string $key, int $ttl, Closure $callback): mixed
    {
        return Cache::tags(['posts'])->remember($key, $ttl, $callback);
    }

    public function invalidatePosts(): void
    {
        Cache::tags(['posts'])->flush();
    }
}
```

**Files**:

- Database: `database/`
- Cache configurations
- External API integrations
- File storage handlers

### Frontend Layers

#### 1. **Pages (Route Handlers)**

```typescript
// app/(public)/informasi/page.tsx
export default async function InformasiPage({
  searchParams,
}: {
  searchParams: { category?: string; page?: string };
}) {
  // Server Component - Pre-fetch data for SEO
  const initialData = await getInitialPosts(searchParams);

  return (
    <main>
      <PostsListFeature initialData={initialData} />
    </main>
  );
}
```

#### 2. **Feature Components (Smart)**

```typescript
// components/features/PostsList/PostsList.tsx
'use client';

export function PostsListFeature({ initialData }: Props) {
  const { data, isLoading, error } = usePosts({
    initialData,
    category: searchParams.category,
  });

  return (
    <div>
      <PostFilters />
      <PostGrid posts={data?.posts} />
      <Pagination meta={data?.meta} />
    </div>
  );
}
```

#### 3. **UI Components (Dumb)**

```typescript
// components/ui/PostCard.tsx
export function PostCard({ post }: { post: Post }) {
  return (
    <Card>
      <CardImage src={post.image} alt={post.title} />
      <CardTitle>{post.title}</CardTitle>
      <CardExcerpt>{post.excerpt}</CardExcerpt>
      <CardFooter date={post.publishedAt} views={post.views} />
    </Card>
  );
}
```

## 🗄️ Data Flow Patterns

### 1. **Server-Side Rendering (SSR)**

For SEO-critical pages (Homepage, About, Posts)

```typescript
// Server Component
async function getData() {
  const res = await fetch(`${API_URL}/posts`, {
    next: { revalidate: 60 }, // ISR
  });
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <PostsList initialData={data} />;
}
```

### 2. **Client-Side Fetching**

For dynamic, user-specific data

```typescript
// Client Component
'use client';

function UserDashboard() {
  const { data } = useQuery({
    queryKey: ['user', 'dashboard'],
    queryFn: () => api.user.getDashboard(),
  });

  return <Dashboard data={data} />;
}
```

### 3. **Optimistic Updates**

For better UX on mutations

```typescript
const mutation = useMutation({
  mutationFn: api.posts.like,
  onMutate: async (postId) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['post', postId] });

    // Snapshot previous value
    const previous = queryClient.getQueryData(['post', postId]);

    // Optimistically update
    queryClient.setQueryData(['post', postId], (old) => ({
      ...old,
      likes: old.likes + 1,
      isLiked: true,
    }));

    return { previous };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(['post', variables], context.previous);
  },
});
```

## 🔌 API Design

### RESTful API Conventions

```
GET     /api/posts              → Index (list with pagination)
GET     /api/posts/{id}         → Show (single resource)
POST    /api/posts              → Store (create)
PUT     /api/posts/{id}         → Update (full update)
PATCH   /api/posts/{id}         → Partial update
DELETE  /api/posts/{id}         → Destroy

GET     /api/posts/{id}/comments → Nested resource
POST    /api/posts/{id}/like     → Action endpoint
```

### Response Format (JSON:API inspired)

```json
{
  "data": {
    "id": 1,
    "type": "post",
    "attributes": {
      "title": "...",
      "content": "...",
      "publishedAt": "2025-01-01T00:00:00Z"
    },
    "relationships": {
      "category": {
        "data": { "id": 5, "type": "category" }
      }
    }
  },
  "included": [
    {
      "id": 5,
      "type": "category",
      "attributes": { "name": "..." }
    }
  ],
  "meta": {
    "total": 100,
    "perPage": 15,
    "currentPage": 1
  }
}
```

## ⚡ Performance Architecture

### 1. **Caching Strategy**

```
┌─────────────┐
│   Browser   │ → Service Worker Cache
└──────┬──────┘
       │
┌──────▼──────┐
│    CDN      │ → Edge Caching (Static Assets)
└──────┬──────┘
       │
┌──────▼──────┐
│  Next.js    │ → ISR Cache
└──────┬──────┘
       │
┌──────▼──────┐
│   Nginx     │ → Proxy Cache
└──────┬──────┘
       │
┌──────▼──────┐
│   Laravel   │ → Application Cache (Redis)
└──────┬──────┘
       │
┌──────▼──────┐
│  MariaDB    │ → Query Cache
└─────────────┘
```

### 2. **Laravel Octane Optimization**

```php
// config/octane.php
return [
    'server' => 'swoole',
    'listeners' => [
        WorkerStarting::class => [
            EnsureUploadedFilesAreValid::class,
        ],
        RequestReceived::class => [
            ...Octane::prepareApplicationForNextOperation(),
            ...Octane::prepareApplicationForNextRequest(),
        ],
    ],
    'warm' => [
        'config',
        'routes',
        'views',
    ],
    'cache' => [
        'rows' => 1000,
        'bytes' => 10000,
    ],
];
```

### 3. **Database Query Optimization**

- Eager loading relationships
- Index optimization
- Query result caching
- Database connection pooling (Octane)
- Read/Write splitting for high traffic

## 🔒 Security Architecture

### Authentication Flow

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│  Client  │────────▶│  Laravel │────────▶│  Redis   │
│          │  Login  │  Sanctum │  Store  │  Session │
└────┬─────┘         └────┬─────┘         └──────────┘
     │                    │
     │  Access Token      │
     │◀───────────────────┘
     │
     │  API Request + Token
     ├──────────────────────▶
     │
     │  Validate Token
     │                    ┌─────────────┐
     │                    │  Middleware │
     │                    │  Validation │
     │                    └─────────────┘
     │
     │  Response
     │◀──────────────────────
```

### Authorization (Spatie Permissions)

```php
// Role-based
$user->hasRole('admin');

// Permission-based
$user->can('edit posts');

// Gate-based
Gate::define('update-post', function (User $user, Post $post) {
    return $user->id === $post->user_id || $user->hasRole('admin');
});
```

## 📊 Monitoring & Observability

```
Application Metrics
    ├── Laravel Telescope (Dev)
    ├── Laravel Horizon (Queues)
    └── Custom Metrics (Prometheus)

Error Tracking
    └── Sentry

Performance Monitoring
    ├── New Relic / DataDog
    └── Google Analytics 4

Logs
    ├── Laravel Log (files)
    └── Centralized (ELK/Loki)
```

## 🧪 Testing Architecture

```
Unit Tests (80%+ coverage)
    ├── Models
    ├── Actions
    ├── Services
    └── Repositories

Feature Tests
    ├── API Endpoints
    └── Authentication Flow

Integration Tests
    ├── Database Interactions
    └── External Services

E2E Tests (Cypress/Playwright)
    ├── Critical User Journeys
    └── Admin CMS Workflows

Performance Tests (k6)
    └── Load Testing
```

## 🚀 Deployment Architecture

```
┌─────────────┐
│   GitHub    │
│  Repository │
└──────┬──────┘
       │ Push
       ▼
┌─────────────┐
│   GitHub    │
│   Actions   │ → CI/CD Pipeline
└──────┬──────┘
       │
       ├─────▶ Run Tests
       ├─────▶ Build Frontend
       ├─────▶ Build Docker Images
       │
       ▼
┌─────────────┐
│   Docker    │
│  Registry   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Production  │
│   Server    │
│             │
│ ┌─────────┐ │
│ │  Nginx  │ │
│ └────┬────┘ │
│      │      │
│ ┌────▼────┐ │
│ │ Next.js │ │
│ └─────────┘ │
│      │      │
│ ┌────▼────┐ │
│ │ Laravel │ │
│ │ Octane  │ │
│ └────┬────┘ │
│      │      │
│ ┌────▼────┐ │
│ │ MariaDB │ │
│ │  Redis  │ │
│ └─────────┘ │
└─────────────┘
```

## 📝 Summary

Arsitektur ini dirancang dengan prinsip:

- ✅ **Separation of Concerns**
- ✅ **Dependency Injection**
- ✅ **Single Responsibility**
- ✅ **Open/Closed Principle**
- ✅ **Interface Segregation**
- ✅ **Dependency Inversion**

Sehingga menghasilkan codebase yang **maintainable, testable, dan scalable** tanpa perlu refactor besar di masa depan.

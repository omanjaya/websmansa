# Code Quality & Design Patterns

## 🎯 Code Quality Standards

### 1. SOLID Principles

#### **S - Single Responsibility Principle**

Setiap class harus memiliki satu tanggung jawab.

```php
// ❌ Bad - Multiple responsibilities
class PostController
{
    public function store(Request $request)
    {
        // Validation
        $validated = $request->validate([...]);
        
        // Image processing
        $image = Image::make($request->file('image'))->resize(800, 600);
        $path = $image->save(storage_path('posts/' . time() . '.jpg'));
        
        // Create post
        $post = Post::create([
            'title' => $validated['title'],
            'image' => $path,
            // ...
        ]);
        
        // Send notification
        Mail::to($admin)->send(new PostCreated($post));
        
        // Clear cache
        Cache::tags(['posts'])->flush();
        
        return response()->json($post);
    }
}

// ✅ Good - Single responsibility per class
class PostController
{
    public function __construct(
        private CreatePostAction $createPostAction
    ) {}

    public function store(CreatePostRequest $request): JsonResponse
    {
        $post = $this->createPostAction->execute(
            CreatePostDTO::fromRequest($request)
        );

        return new PostResource($post);
    }
}

class CreatePostAction
{
    public function __construct(
        private PostRepository $repository,
        private ImageService $imageService,
        private CacheService $cacheService,
        private NotificationService $notificationService
    ) {}

    public function execute(CreatePostDTO $dto): Post
    {
        $imagePath = $this->imageService->process($dto->image);
        
        $post = $this->repository->create([
            'title' => $dto->title,
            'image' => $imagePath,
            // ...
        ]);

        $this->cacheService->invalidatePosts();
        $this->notificationService->sendPostCreated($post);

        return $post;
    }
}
```

#### **O - Open/Closed Principle**

Open for extension, closed for modification.

```php
// ❌ Bad - Need to modify class to add new export type
class ReportExporter
{
    public function export(Report $report, string $type)
    {
        if ($type === 'pdf') {
            return $this->exportToPdf($report);
        } elseif ($type === 'excel') {
            return $this->exportToExcel($report);
        } elseif ($type === 'csv') {
            return $this->exportToCsv($report);
        }
    }
}

// ✅ Good - Use interface & strategy pattern
interface ExportStrategy
{
    public function export(Report $report): string;
}

class PdfExporter implements ExportStrategy
{
    public function export(Report $report): string
    {
        // PDF export logic
    }
}

class ExcelExporter implements ExportStrategy
{
    public function export(Report $report): string
    {
        // Excel export logic
    }
}

class ReportExporter
{
    public function __construct(
        private ExportStrategy $strategy
    ) {}

    public function export(Report $report): string
    {
        return $this->strategy->export($report);
    }
}
```

#### **L - Liskov Substitution Principle**

Objects should be replaceable with instances of their subtypes.

```php
interface PostRepository
{
    public function find(int $id): ?Post;
    public function create(array $data): Post;
}

class EloquentPostRepository implements PostRepository
{
    public function find(int $id): ?Post
    {
        return Post::find($id);
    }

    public function create(array $data): Post
    {
        return Post::create($data);
    }
}

class CachedPostRepository implements PostRepository
{
    public function __construct(
        private PostRepository $repository,
        private CacheService $cache
    ) {}

    public function find(int $id): ?Post
    {
        return $this->cache->remember("post:{$id}", 3600, function () use ($id) {
            return $this->repository->find($id);
        });
    }

    public function create(array $data): Post
    {
        $post = $this->repository->create($data);
        $this->cache->forget("post:{$post->id}");
        return $post;
    }
}

// Both can be used interchangeably
```

#### **I - Interface Segregation Principle**

Clients should not be forced to depend on interfaces they don't use.

```php
// ❌ Bad - Fat interface
interface UserRepository
{
    public function find(int $id): ?User;
    public function findByEmail(string $email): ?User;
    public function create(array $data): User;
    public function update(int $id, array $data): User;
    public function delete(int $id): bool;
    public function findWithPosts(int $id): ?User;
    public function findWithPermissions(int $id): ?User;
    // ... 20+ methods
}

// ✅ Good - Segregated interfaces
interface UserFinder
{
    public function find(int $id): ?User;
    public function findByEmail(string $email): ?User;
}

interface UserWriter
{
    public function create(array $data): User;
    public function update(int $id, array $data): User;
    public function delete(int $id): bool;
}

interface UserRelationLoader
{
    public function loadPosts(User $user): User;
    public function loadPermissions(User $user): User;
}
```

#### **D - Dependency Inversion Principle**

Depend on abstractions, not concretions.

```php
// ❌ Bad - Depends on concrete class
class PostService
{
    private EloquentPostRepository $repository;

    public function __construct()
    {
        $this->repository = new EloquentPostRepository();
    }
}

// ✅ Good - Depends on abstraction
class PostService
{
    public function __construct(
        private PostRepository $repository
    ) {}
}

// In AppServiceProvider
$this->app->bind(PostRepository::class, EloquentPostRepository::class);
```

### 2. Design Patterns

#### **Repository Pattern**

```php
// app/Repositories/BaseRepository.php
abstract class BaseRepository
{
    protected Model $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function all(): Collection
    {
        return $this->model->all();
    }

    public function find(int $id): ?Model
    {
        return $this->model->find($id);
    }

    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): Model
    {
        $model = $this->find($id);
        $model->update($data);
        return $model->fresh();
    }

    public function delete(int $id): bool
    {
        return $this->model->destroy($id) > 0;
    }
}

// app/Repositories/PostRepository.php
class PostRepository extends BaseRepository
{
    public function __construct(Post $model)
    {
        parent::__construct($model);
    }

    public function published(): Collection
    {
        return $this->model
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->latest('published_at')
            ->get();
    }

    public function findBySlug(string $slug): ?Post
    {
        return $this->model->where('slug', $slug)->first();
    }

    public function getFiltered(PostFilterDTO $filter): LengthAwarePaginator
    {
        return $this->model
            ->when($filter->category, fn($q) => $q->whereHas('category', fn($q) => $q->where('slug', $filter->category)))
            ->when($filter->search, fn($q) => $q->search($filter->search))
            ->when($filter->status, fn($q) => $q->where('status', $filter->status))
            ->latest('published_at')
            ->paginate($filter->perPage);
    }
}
```

#### **Service Layer Pattern**

```php
// app/Services/PostService.php
class PostService
{
    public function __construct(
        private PostRepository $repository,
        private ImageService $imageService,
        private CacheService $cacheService
    ) {}

    public function createPost(CreatePostDTO $dto): Post
    {
        DB::beginTransaction();
        
        try {
            if ($dto->image) {
                $imagePath = $this->imageService->store($dto->image, 'posts');
            }

            $post = $this->repository->create([
                'title' => $dto->title,
                'slug' => Str::slug($dto->title),
                'content' => $dto->content,
                'image' => $imagePath ?? null,
                'status' => $dto->status,
                'published_at' => $dto->publishedAt,
                'user_id' => $dto->userId,
            ]);

            if ($dto->categories) {
                $post->categories()->sync($dto->categories);
            }

            $this->cacheService->invalidate(['posts', 'homepage']);

            DB::commit();
            return $post->load('categories');
            
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
```

#### **Action Pattern (Single-Use Classes)**

```php
// app/Actions/Post/PublishPostAction.php
class PublishPostAction
{
    public function __construct(
        private PostRepository $repository,
        private CacheService $cacheService,
        private NotificationService $notificationService
    ) {}

    public function execute(int $postId): Post
    {
        $post = $this->repository->find($postId);

        if (!$post) {
            throw new PostNotFoundException();
        }

        if ($post->status === 'published') {
            throw new PostAlreadyPublishedException();
        }

        $post = $this->repository->update($postId, [
            'status' => 'published',
            'published_at' => now(),
        ]);

        $this->cacheService->invalidate(['posts', 'homepage']);
        $this->notificationService->sendPostPublished($post);

        return $post;
    }
}
```

#### **DTO Pattern (Data Transfer Objects)**

```php
// app/DTOs/Post/CreatePostDTO.php
class CreatePostDTO
{
    public function __construct(
        public readonly string $title,
        public readonly string $content,
        public readonly ?UploadedFile $image,
        public readonly string $status,
        public readonly ?Carbon $publishedAt,
        public readonly int $userId,
        public readonly array $categories = [],
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            title: $request->input('title'),
            content: $request->input('content'),
            image: $request->file('image'),
            status: $request->input('status', 'draft'),
            publishedAt: $request->input('published_at') 
                ? Carbon::parse($request->input('published_at')) 
                : null,
            userId: $request->user()->id,
            categories: $request->input('categories', []),
        );
    }

    public function toArray(): array
    {
        return [
            'title' => $this->title,
            'content' => $this->content,
            'status' => $this->status,
            'published_at' => $this->publishedAt?->toDateTimeString(),
            'user_id' => $this->userId,
        ];
    }
}
```

#### **Resource Pattern (API Responses)**

```php
// app/Http/Resources/PostResource.php
class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => 'post',
            'attributes' => [
                'title' => $this->title,
                'slug' => $this->slug,
                'excerpt' => $this->excerpt,
                'content' => $this->when($this->shouldShowFullContent(), $this->content),
                'image' => $this->image ? asset("storage/{$this->image}") : null,
                'status' => $this->status,
                'views' => $this->views,
                'likes' => $this->likes,
                'publishedAt' => $this->published_at?->toIso8601String(),
                'createdAt' => $this->created_at->toIso8601String(),
                'updatedAt' => $this->updated_at->toIso8601String(),
            ],
            'relationships' => [
                'author' => new UserResource($this->whenLoaded('user')),
                'categories' => CategoryResource::collection($this->whenLoaded('categories')),
            ],
            'meta' => [
                'isLiked' => $this->when($request->user(), fn() => $this->isLikedBy($request->user())),
            ],
        ];
    }

    private function shouldShowFullContent(): bool
    {
        return request()->routeIs('api.posts.show');
    }
}
```

#### **Observer Pattern (Event Listeners)**

```php
// app/Observers/PostObserver.php
class PostObserver
{
    public function creating(Post $post): void
    {
        if (empty($post->slug)) {
            $post->slug = Str::slug($post->title);
        }
    }

    public function created(Post $post): void
    {
        event(new PostCreated($post));
    }

    public function updated(Post $post): void
    {
        if ($post->wasChanged('status') && $post->status === 'published') {
            event(new PostPublished($post));
        }
    }

    public function deleted(Post $post): void
    {
        // Delete associated image
        if ($post->image && Storage::exists($post->image)) {
            Storage::delete($post->image);
        }
    }
}
```

### 3. Frontend Patterns (React/TypeScript)

#### **Custom Hooks Pattern**

```typescript
// hooks/usePosts.ts
export function usePosts(options: UsePostsOptions = {}) {
  const { category, search, page = 1, perPage = 15 } = options;

  return useQuery({
    queryKey: ['posts', { category, search, page, perPage }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
        ...(category && { category }),
        ...(search && { search }),
      });

      const response = await api.get(`/posts?${params}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Usage in component
function PostsList() {
  const { data, isLoading, error } = usePosts({
    category: 'news',
    perPage: 12,
  });

  if (isLoading) return <PostsSkeleton />;
  if (error) return <ErrorMessage error={error} />;

  return <PostGrid posts={data.posts} />;
}
```

#### **Composition Pattern**

```typescript
// components/PostCard.tsx
interface PostCardProps {
  post: Post;
  variant?: 'default' | 'featured' | 'compact';
}

export function PostCard({ post, variant = 'default' }: PostCardProps) {
  return (
    <Card className={cn('post-card', `post-card--${variant}`)}>
      <PostCard.Image post={post} />
      <PostCard.Content post={post} />
      <PostCard.Footer post={post} />
    </Card>
  );
}

PostCard.Image = function PostCardImage({ post }: { post: Post }) {
  return (
    <div className="post-card__image">
      <Image
        src={post.image}
        alt={post.title}
        width={600}
        height={400}
        className="object-cover"
      />
      {post.categories[0] && (
        <Badge className="absolute top-2 left-2">
          {post.categories[0].name}
        </Badge>
      )}
    </div>
  );
};

PostCard.Content = function PostCardContent({ post }: { post: Post }) {
  return (
    <div className="post-card__content">
      <h3 className="post-card__title">{post.title}</h3>
      <p className="post-card__excerpt">{post.excerpt}</p>
    </div>
  );
};

PostCard.Footer = function PostCardFooter({ post }: { post: Post }) {
  return (
    <div className="post-card__footer">
      <time dateTime={post.publishedAt}>
        {formatDate(post.publishedAt)}
      </time>
      <div className="flex gap-4">
        <span>{post.views} views</span>
        <span>{post.likes} likes</span>
      </div>
    </div>
  );
};
```

#### **Container/Presenter Pattern**

```typescript
// components/features/Posts/PostsListContainer.tsx (Smart Component)
'use client';

export function PostsListContainer({ initialData }: Props) {
  const [filters, setFilters] = useState<PostFilters>({});
  const { data, isLoading } = usePosts({ ...filters, initialData });

  const handleFilterChange = (newFilters: PostFilters) => {
    setFilters(newFilters);
    // Update URL params
    const params = new URLSearchParams(newFilters);
    router.push(`?${params.toString()}`);
  };

  return (
    <PostsListPresenter
      posts={data?.posts}
      filters={filters}
      isLoading={isLoading}
      onFilterChange={handleFilterChange}
    />
  );
}

// components/features/Posts/PostsListPresenter.tsx (Dumb Component)
export function PostsListPresenter({
  posts,
  filters,
  isLoading,
  onFilterChange,
}: PresenterProps) {
  return (
    <div className="posts-list">
      <PostFilters filters={filters} onChange={onFilterChange} />
      
      {isLoading ? (
        <PostsSkeleton />
      ) : (
        <PostGrid posts={posts} />
      )}
    </div>
  );
}
```

### 4. Code Style Guidelines

#### **Backend (PHP/Laravel)**

```php
// Use strict types
declare(strict_types=1);

// Type hints for all parameters and return types
public function createPost(CreatePostDTO $dto): Post
{
    // ...
}

// Use early returns to reduce nesting
public function getPost(int $id): Post
{
    $post = $this->repository->find($id);
    
    if (!$post) {
        throw new PostNotFoundException();
    }
    
    if (!$post->isPublished()) {
        throw new PostNotPublishedException();
    }
    
    return $post;
}

// Use null coalescing operator
$name = $request->input('name') ?? 'Default Name';

// Use arrow functions for simple callbacks
$ids = collect($posts)->map(fn($post) => $post->id);

// Use match instead of switch (PHP 8+)
$status = match($post->status) {
    'draft' => 'Draft',
    'published' => 'Published',
    'archived' => 'Archived',
    default => 'Unknown',
};

// Organize imports alphabetically
use App\Models\Post;
use App\Repositories\PostRepository;
use App\Services\CacheService;
use Illuminate\Support\Facades\DB;

// Constants in UPPER_CASE
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB

// Class names in PascalCase
class PostService

// Methods in camelCase
public function createPost()

// Properties in camelCase
private string $apiKey;

// Always use /** */ for docblocks
/**
 * Create a new post
 *
 * @param CreatePostDTO $dto
 * @return Post
 * @throws PostCreationException
 */
public function createPost(CreatePostDTO $dto): Post
```

#### **Frontend (TypeScript/React)**

```typescript
// Use const for function components
export const PostCard = ({ post }: PostCardProps) => {
  // ...
};

// Destructure props
const { title, excerpt, image } = post;

// Use TypeScript interfaces
interface Post {
  id: number;
  title: string;
  excerpt: string;
  image: string | null;
  publishedAt: string;
}

// Use type for unions/intersections
type Status = 'draft' | 'published' | 'archived';

// Optional chaining
const category = post.categories?.[0]?.name;

// Nullish coalescing
const title = post.title ?? 'Untitled';

// Early returns in components
if (isLoading) return <Skeleton />;
if (error) return <Error error={error} />;

// Use named exports (not default)
export { PostCard };

// Organize imports
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PostCard } from '@/components/PostCard';
import { api } from '@/lib/api';
import type { Post } from '@/types';

// Component names in PascalCase
const PostCard = () => {};

// Hooks, functions in camelCase
const usePosts = () => {};
const formatDate = () => {};

// Constants in UPPER_CASE
const API_BASE_URL = 'https://api.example.com';

// File names in kebab-case
// post-card.tsx, use-posts.ts
```

### 5. Testing Patterns

#### **Backend Tests (PHPUnit)**

```php
// tests/Feature/PostApiTest.php
class PostApiTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_list_published_posts()
    {
        // Arrange
        $publishedPosts = Post::factory()->published()->count(3)->create();
        Post::factory()->draft()->count(2)->create();

        // Act
        $response = $this->getJson('/api/posts');

        // Assert
        $response->assertOk();
        $response->assertJsonCount(3, 'data');
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'type', 'attributes', 'relationships']
            ],
            'meta' => ['total', 'perPage', 'currentPage']
        ]);
    }

    /** @test */
    public function it_can_create_post_with_valid_data()
    {
        $user = User::factory()->create();
        $data = [
            'title' => 'Test Post',
            'content' => 'Test content',
            'status' => 'draft',
        ];

        $response = $this->actingAs($user)
            ->postJson('/api/posts', $data);

        $response->assertCreated();
        $this->assertDatabaseHas('posts', [
            'title' => 'Test Post',
            'user_id' => $user->id,
        ]);
    }
}
```

#### **Frontend Tests (Jest/React Testing Library)**

```typescript
// __tests__/components/PostCard.test.tsx
describe('PostCard', () => {
  const mockPost: Post = {
    id: 1,
    title: 'Test Post',
    excerpt: 'Test excerpt',
    image: '/test.jpg',
    publishedAt: '2025-01-01T00:00:00Z',
  };

  it('renders post data correctly', () => {
    render(<PostCard post={mockPost} />);

    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('Test excerpt')).toBeInTheDocument();
    expect(screen.getByAltText('Test Post')).toHaveAttribute('src', '/test.jpg');
  });

  it('handles like button click', async () => {
    const user = userEvent.setup();
    const mockLike = jest.fn();

    render(<PostCard post={mockPost} onLike={mockLike} />);

    await user.click(screen.getByRole('button', { name: /like/i }));

    expect(mockLike).toHaveBeenCalledWith(mockPost.id);
  });
});
```

### 6. Error Handling

#### **Backend**

```php
// app/Exceptions/Handler.php
public function render($request, Throwable $exception)
{
    if ($request->is('api/*')) {
        return $this->handleApiException($request, $exception);
    }

    return parent::render($request, $exception);
}

private function handleApiException($request, Throwable $exception): JsonResponse
{
    $status = 500;
    $message = 'Internal Server Error';

    if ($exception instanceof ValidationException) {
        $status = 422;
        $message = 'Validation Error';
        $errors = $exception->errors();
    } elseif ($exception instanceof ModelNotFoundException) {
        $status = 404;
        $message = 'Resource Not Found';
    } elseif ($exception instanceof AuthenticationException) {
        $status = 401;
        $message = 'Unauthenticated';
    }

    return response()->json([
        'message' => $message,
        'errors' => $errors ?? null,
        ...(app()->environment('local') ? ['trace' => $exception->getTrace()] : []),
    ], $status);
}
```

#### **Frontend**

```typescript
// lib/api.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(
        error.message || 'Request failed',
        response.status,
        error.errors
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error', 0);
  }
}
```

### 7. Code Quality Tools

#### **Backend**

- **PHPStan** (Level 8) - Static analysis
- **PHP CS Fixer** - Code style
- **PHPMD** - Mess detector
- **PHPUnit** - Testing
- **Laravel Pint** - Opinionated PHP CS Fixer

```bash
# Run all checks
composer check

# .php-cs-fixer.php
<?php

return (new PhpCsFixer\Config())
    ->setRules([
        '@PSR12' => true,
        'array_syntax' => ['syntax' => 'short'],
        'ordered_imports' => ['sort_algorithm' => 'alpha'],
        'no_unused_imports' => true,
        'not_operator_with_successor_space' => true,
        'trailing_comma_in_multiline' => true,
        'phpdoc_scalar' => true,
        'unary_operator_spaces' => true,
        'binary_operator_spaces' => true,
        'blank_line_before_statement' => [
            'statements' => ['break', 'continue', 'declare', 'return', 'throw', 'try'],
        ],
        'phpdoc_single_line_var_spacing' => true,
        'phpdoc_var_without_name' => true,
    ]);
```

#### **Frontend**

- **ESLint** - Linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Jest** - Unit/Integration tests
- **Playwright** - E2E tests

```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "react/no-unescaped-entities": "off",
    "prefer-const": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

### 8. Git Workflow

```bash
# Branch naming
feature/post-management
bugfix/fix-image-upload
hotfix/security-patch
chore/update-dependencies

# Commit messages (Conventional Commits)
feat: add post creation API
fix: resolve image upload issue
docs: update README
style: format code with prettier
refactor: extract post service
test: add unit tests for PostService
chore: update dependencies

# Example
git checkout -b feature/post-management
git add .
git commit -m "feat: add post creation with image upload"
git push origin feature/post-management
# Create PR on GitHub
```

### 9. Documentation Standards

```php
/**
 * Create a new post
 *
 * This method handles the complete post creation process including:
 * - Image upload and optimization
 * - Slug generation
 * - Cache invalidation
 * - Event dispatching
 *
 * @param CreatePostDTO $dto The post data transfer object
 * @return Post The created post instance
 * @throws PostCreationException If post creation fails
 * @throws ImageUploadException If image upload fails
 *
 * @example
 * $dto = CreatePostDTO::fromRequest($request);
 * $post = $this->postService->createPost($dto);
 */
public function createPost(CreatePostDTO $dto): Post
{
    // Implementation
}
```

## 📊 Code Quality Metrics

### Targets

- **Test Coverage**: > 80%
- **PHPStan Level**: 8
- **Cyclomatic Complexity**: < 10 per method
- **Code Duplication**: < 3%
- **Technical Debt Ratio**: < 5%
- **Maintainability Index**: > 80

### Code Review Checklist

- [ ] Follows SOLID principles
- [ ] Has proper type hints
- [ ] Has unit/feature tests
- [ ] No code duplication
- [ ] Proper error handling
- [ ] Documented complex logic
- [ ] Passes all linters
- [ ] No security vulnerabilities
- [ ] Performance optimized
- [ ] Follows naming conventions

## 🎯 Summary

Code quality adalah foundation dari aplikasi yang maintainable. Dengan mengikuti standards dan patterns di atas, kita memastikan:

✅ **Readable** - Easy to understand
✅ **Maintainable** - Easy to modify  
✅ **Testable** - Easy to test
✅ **Scalable** - Easy to extend
✅ **Robust** - Handles errors gracefully

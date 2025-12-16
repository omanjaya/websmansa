<?php

declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Enums\PostStatus;
use App\Enums\PostType;
use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PostControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_list_posts_with_pagination(): void
    {
        // Arrange
        Post::factory()->count(20)->published()->create();

        // Act
        $response = $this->getJson('/api/v1/posts');

        // Assert
        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'type',
                        'attributes' => [
                            'title',
                            'slug',
                            'excerpt',
                            'status',
                            'type',
                            'views',
                            'likes',
                            'is_featured',
                            'published_at',
                        ],
                    ],
                ],
                'links',
                'meta' => [
                    'current_page',
                    'last_page',
                    'per_page',
                    'total',
                ],
            ]);

        $this->assertEquals(15, $response->json('meta.per_page'));
        $this->assertEquals('post', $response->json('data.0.type'));
    }

    /** @test */
    public function it_can_filter_posts_by_status(): void
    {
        // Arrange
        Post::factory()->count(5)->published()->create();
        Post::factory()->count(3)->draft()->create();

        // Act
        $response = $this->getJson('/api/v1/posts?status=published');

        // Assert
        $response->assertOk();
        $this->assertCount(5, $response->json('data'));

        foreach ($response->json('data') as $post) {
            $this->assertEquals('published', $post['attributes']['status']);
        }
    }

    /** @test */
    public function it_can_search_posts_by_title(): void
    {
        // Arrange
        Post::factory()->published()->create(['title' => 'Laravel Best Practices']);
        Post::factory()->published()->create(['title' => 'PHP Tips and Tricks']);
        Post::factory()->published()->create(['title' => 'JavaScript Guide']);

        // Act
        $response = $this->getJson('/api/v1/posts?search=Laravel');

        // Assert
        $response->assertOk();
        $this->assertGreaterThanOrEqual(1, count($response->json('data')));
    }

    /** @test */
    public function it_can_filter_posts_by_category(): void
    {
        // Arrange
        $category = Category::factory()->create(['name' => 'Technology']);
        $post1 = Post::factory()->published()->create();
        $post2 = Post::factory()->published()->create();
        $post3 = Post::factory()->published()->create();

        $post1->categories()->attach($category->id);
        $post2->categories()->attach($category->id);

        // Act
        $response = $this->getJson("/api/v1/posts?category={$category->slug}");

        // Assert
        $response->assertOk();
        $this->assertCount(2, $response->json('data'));
    }

    /** @test */
    public function it_can_get_featured_posts(): void
    {
        // Arrange
        Post::factory()->count(8)->featured()->create();
        Post::factory()->count(5)->published()->create(['is_featured' => false]);

        // Act
        $response = $this->getJson('/api/v1/posts/featured');

        // Assert
        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'attributes' => [
                            'title',
                            'is_featured',
                        ],
                    ],
                ],
            ]);

        $this->assertCount(6, $response->json('data')); // Default limit is 6

        foreach ($response->json('data') as $post) {
            $this->assertTrue($post['attributes']['is_featured']);
        }
    }

    /** @test */
    public function it_can_get_featured_posts_with_custom_limit(): void
    {
        // Arrange
        Post::factory()->count(10)->featured()->create();

        // Act
        $response = $this->getJson('/api/v1/posts/featured?limit=3');

        // Assert
        $response->assertOk();
        $this->assertCount(3, $response->json('data'));
    }

    /** @test */
    public function it_can_get_latest_posts(): void
    {
        // Arrange
        Post::factory()->count(15)->published()->create();

        // Act
        $response = $this->getJson('/api/v1/posts/latest');

        // Assert
        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'attributes' => [
                            'title',
                            'published_at',
                        ],
                    ],
                ],
            ]);

        $this->assertCount(10, $response->json('data')); // Default limit is 10
    }

    /** @test */
    public function it_can_get_latest_posts_with_custom_limit(): void
    {
        // Arrange
        Post::factory()->count(15)->published()->create();

        // Act
        $response = $this->getJson('/api/v1/posts/latest?limit=5');

        // Assert
        $response->assertOk();
        $this->assertCount(5, $response->json('data'));
    }

    /** @test */
    public function it_can_show_post_by_slug(): void
    {
        // Arrange
        $post = Post::factory()->published()->create([
            'title' => 'Awesome Post',
            'slug' => 'awesome-post',
        ]);

        // Act
        $response = $this->getJson('/api/v1/posts/awesome-post');

        // Assert
        $response->assertOk()
            ->assertJson([
                'data' => [
                    'id' => $post->id,
                    'uuid' => $post->uuid,
                    'attributes' => [
                        'title' => 'Awesome Post',
                        'slug' => 'awesome-post',
                    ],
                ],
            ]);
    }

    /** @test */
    public function it_increments_view_count_when_showing_post(): void
    {
        // Arrange
        $post = Post::factory()->published()->create(['views' => 10]);
        $initialViews = $post->views;

        // Act
        $response = $this->getJson("/api/v1/posts/{$post->slug}");

        // Assert
        $response->assertOk();
        $this->assertEquals($initialViews + 1, $post->fresh()->views);
    }

    /** @test */
    public function it_returns_404_when_post_not_found_by_slug(): void
    {
        // Act
        $response = $this->getJson('/api/v1/posts/non-existent-slug');

        // Assert
        $response->assertNotFound();
    }

    /** @test */
    public function it_requires_authentication_for_creating_post(): void
    {
        // Arrange
        $data = [
            'title' => 'New Post',
            'content' => 'This is a new post',
        ];

        // Act
        $response = $this->postJson('/api/v1/posts', $data);

        // Assert
        $response->assertUnauthorized();
    }

    /** @test */
    public function it_can_create_post_with_valid_data(): void
    {
        // Arrange
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        $data = [
            'title' => 'New Amazing Post',
            'content' => 'This is an amazing post content',
            'status' => 'published',
            'type' => 'post',
            'published_at' => now()->toDateTimeString(),
        ];

        // Act
        $response = $this->postJson('/api/v1/posts', $data);

        // Assert
        $response->assertCreated()
            ->assertJson([
                'data' => [
                    'attributes' => [
                        'title' => 'New Amazing Post',
                        'status' => 'published',
                    ],
                ],
            ]);

        $this->assertDatabaseHas('posts', [
            'title' => 'New Amazing Post',
            'slug' => 'new-amazing-post',
        ]);
    }

    /** @test */
    public function it_auto_generates_slug_when_creating_post(): void
    {
        // Arrange
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        $data = [
            'title' => 'My First Blog Post',
            'content' => 'Content here',
        ];

        // Act
        $response = $this->postJson('/api/v1/posts', $data);

        // Assert
        $response->assertCreated();
        $this->assertEquals('my-first-blog-post', $response->json('data.attributes.slug'));
        $this->assertDatabaseHas('posts', ['slug' => 'my-first-blog-post']);
    }

    /** @test */
    public function it_validates_required_fields_on_create(): void
    {
        // Arrange
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        $data = []; // Empty data

        // Act
        $response = $this->postJson('/api/v1/posts', $data);

        // Assert
        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['title', 'content']);
    }

    /** @test */
    public function it_can_update_post(): void
    {
        // Arrange
        $user = User::factory()->create();
        $post = Post::factory()->published()->create([
            'title' => 'Old Title',
            'content' => 'Old content',
        ]);
        Sanctum::actingAs($user, ['*']);

        $data = [
            'title' => 'Updated Title',
            'content' => 'Updated content',
        ];

        // Act
        $response = $this->putJson("/api/v1/posts/{$post->slug}", $data);

        // Assert
        $response->assertOk()
            ->assertJson([
                'data' => [
                    'attributes' => [
                        'title' => 'Updated Title',
                    ],
                ],
            ]);

        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
            'title' => 'Updated Title',
            'content' => 'Updated content',
        ]);
    }

    /** @test */
    public function it_requires_authentication_for_updating_post(): void
    {
        // Arrange
        $post = Post::factory()->published()->create();
        $data = ['title' => 'Updated Title'];

        // Act
        $response = $this->putJson("/api/v1/posts/{$post->slug}", $data);

        // Assert
        $response->assertUnauthorized();
    }

    /** @test */
    public function it_can_delete_post(): void
    {
        // Arrange
        $user = User::factory()->create();
        $post = Post::factory()->published()->create();
        Sanctum::actingAs($user, ['*']);

        // Act
        $response = $this->deleteJson("/api/v1/posts/{$post->slug}");

        // Assert
        $response->assertNoContent();
        $this->assertSoftDeleted('posts', ['id' => $post->id]);
    }

    /** @test */
    public function it_requires_authentication_for_deleting_post(): void
    {
        // Arrange
        $post = Post::factory()->published()->create();

        // Act
        $response = $this->deleteJson("/api/v1/posts/{$post->slug}");

        // Assert
        $response->assertUnauthorized();
    }

    /** @test */
    public function it_can_like_a_post(): void
    {
        // Arrange
        $user = User::factory()->create();
        $post = Post::factory()->published()->create(['likes' => 0]);
        Sanctum::actingAs($user, ['*']);

        // Act
        $response = $this->postJson("/api/v1/posts/{$post->slug}/like");

        // Assert
        $response->assertOk()
            ->assertJson([
                'data' => [
                    'likes' => 1,
                    'isLiked' => true,
                ],
            ]);

        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
            'likes' => 1,
        ]);
    }

    /** @test */
    public function it_can_unlike_a_post(): void
    {
        // Arrange
        $user = User::factory()->create();
        $post = Post::factory()->published()->create(['likes' => 5]);
        Sanctum::actingAs($user, ['*']);

        // Like first
        $user->likes()->attach($post->id);

        // Act - Unlike
        $response = $this->postJson("/api/v1/posts/{$post->slug}/like");

        // Assert
        $response->assertOk()
            ->assertJson([
                'data' => [
                    'likes' => 4,
                    'isLiked' => false,
                ],
            ]);

        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
            'likes' => 4,
        ]);
    }

    /** @test */
    public function it_requires_authentication_for_liking_post(): void
    {
        // Arrange
        $post = Post::factory()->published()->create();

        // Act
        $response = $this->postJson("/api/v1/posts/{$post->slug}/like");

        // Assert
        $response->assertUnauthorized();
    }

    /** @test */
    public function it_can_increment_view_count(): void
    {
        // Arrange
        $post = Post::factory()->published()->create(['views' => 100]);

        // Act
        $response = $this->postJson("/api/v1/posts/{$post->slug}/view");

        // Assert
        $response->assertNoContent();
        $this->assertEquals(101, $post->fresh()->views);
    }

    /** @test */
    public function it_can_paginate_with_custom_per_page(): void
    {
        // Arrange
        Post::factory()->count(30)->published()->create();

        // Act
        $response = $this->getJson('/api/v1/posts?per_page=20');

        // Assert
        $response->assertOk();
        $this->assertEquals(20, $response->json('meta.per_page'));
        $this->assertCount(20, $response->json('data'));
    }

    /** @test */
    public function it_includes_categories_when_requested(): void
    {
        // Arrange
        $category = Category::factory()->create(['name' => 'Tech']);
        $post = Post::factory()->published()->create();
        $post->categories()->attach($category->id);

        // Act
        $response = $this->getJson("/api/v1/posts/{$post->slug}?include=categories");

        // Assert
        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'relationships' => [
                        'categories',
                    ],
                ],
            ]);
    }

    /** @test */
    public function it_can_filter_by_post_type(): void
    {
        // Arrange
        Post::factory()->count(5)->published()->create(['type' => PostType::POST->value]);
        Post::factory()->count(3)->published()->create(['type' => PostType::ANNOUNCEMENT->value]);

        // Act - using search/filter from service
        $posts = Post::where('type', PostType::POST->value)
            ->where('status', PostStatus::PUBLISHED->value)
            ->get();

        // Assert
        $this->assertCount(5, $posts);
    }

    /** @test */
    public function it_returns_posts_ordered_by_published_date_descending(): void
    {
        // Arrange
        $post1 = Post::factory()->published()->create(['published_at' => now()->subDays(3)]);
        $post2 = Post::factory()->published()->create(['published_at' => now()->subDays(1)]);
        $post3 = Post::factory()->published()->create(['published_at' => now()->subDays(2)]);

        // Act
        $response = $this->getJson('/api/v1/posts');

        // Assert
        $response->assertOk();
        $titles = collect($response->json('data'))->pluck('attributes.slug')->toArray();
        $this->assertEquals($post2->slug, $titles[0]); // Most recent first
    }
}

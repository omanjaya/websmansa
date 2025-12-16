<?php

declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Models\Extra;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ExtraControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_list_extras_with_pagination(): void
    {
        // Arrange
        Extra::factory()->count(20)->create();

        // Act
        $response = $this->getJson('/api/v1/extras');

        // Assert
        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'type',
                        'attributes' => [
                            'name',
                            'slug',
                            'category',
                            'is_active',
                            'is_featured',
                        ],
                        'relationships',
                        'meta',
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

        $this->assertCount(15, $response->json('data')); // Default pagination is 15
        $this->assertEquals('extra', $response->json('data.0.type'));
    }

    /** @test */
    public function it_can_filter_extras_by_category(): void
    {
        // Arrange
        Extra::factory()->count(5)->create(['category' => 'sports']);
        Extra::factory()->count(3)->create(['category' => 'arts']);

        // Act
        $response = $this->getJson('/api/v1/extras?category=sports');

        // Assert
        $response->assertOk();
        $this->assertCount(5, $response->json('data'));

        foreach ($response->json('data') as $extra) {
            $this->assertEquals('sports', $extra['attributes']['category']);
        }
    }

    /** @test */
    public function it_can_filter_extras_by_active_status(): void
    {
        // Arrange
        Extra::factory()->count(5)->create(['is_active' => true]);
        Extra::factory()->count(3)->create(['is_active' => false]);

        // Act
        $response = $this->getJson('/api/v1/extras?is_active=1');

        // Assert
        $response->assertOk();
        $this->assertCount(5, $response->json('data'));
    }

    /** @test */
    public function it_can_get_featured_extras(): void
    {
        // Arrange
        Extra::factory()->count(8)->create(['is_featured' => true, 'is_active' => true]);
        Extra::factory()->count(5)->create(['is_featured' => false]);

        // Act
        $response = $this->getJson('/api/v1/extras/featured');

        // Assert
        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'attributes' => [
                            'name',
                            'is_featured',
                        ],
                    ],
                ],
                'meta' => [
                    'count',
                ],
            ]);

        $this->assertCount(6, $response->json('data')); // Default limit is 6
        $this->assertEquals(6, $response->json('meta.count'));

        foreach ($response->json('data') as $extra) {
            $this->assertTrue($extra['attributes']['is_featured']);
        }
    }

    /** @test */
    public function it_can_get_featured_extras_with_custom_limit(): void
    {
        // Arrange
        Extra::factory()->count(10)->create(['is_featured' => true, 'is_active' => true]);

        // Act
        $response = $this->getJson('/api/v1/extras/featured?limit=3');

        // Assert
        $response->assertOk();
        $this->assertCount(3, $response->json('data'));
        $this->assertEquals(3, $response->json('meta.count'));
    }

    /** @test */
    public function it_can_show_extra_by_slug(): void
    {
        // Arrange
        $extra = Extra::factory()->create([
            'name' => 'Basketball Club',
            'slug' => 'basketball-club',
            'category' => 'sports',
        ]);

        // Act
        $response = $this->getJson('/api/v1/extras/basketball-club');

        // Assert
        $response->assertOk()
            ->assertJson([
                'data' => [
                    'id' => $extra->id,
                    'attributes' => [
                        'name' => 'Basketball Club',
                        'slug' => 'basketball-club',
                        'category' => 'sports',
                    ],
                ],
            ]);
    }

    /** @test */
    public function it_returns_404_when_extra_not_found_by_slug(): void
    {
        // Act
        $response = $this->getJson('/api/v1/extras/non-existent-slug');

        // Assert
        $response->assertNotFound();
    }

    /** @test */
    public function it_can_get_extras_by_category(): void
    {
        // Arrange
        Extra::factory()->count(5)->create(['category' => 'sports', 'is_active' => true]);
        Extra::factory()->count(3)->create(['category' => 'arts', 'is_active' => true]);

        // Act
        $response = $this->getJson('/api/v1/extras/by-category/sports');

        // Assert
        $response->assertOk();
        $this->assertCount(5, $response->json('data'));
        $this->assertEquals(5, $response->json('meta.count'));
    }

    /** @test */
    public function it_requires_authentication_for_creating_extra(): void
    {
        // Arrange
        $data = [
            'name' => 'New Basketball Club',
            'description' => 'A club for basketball enthusiasts',
            'category' => 'sports',
        ];

        // Act
        $response = $this->postJson('/api/v1/extras', $data);

        // Assert
        $response->assertUnauthorized();
    }

    /** @test */
    public function it_can_create_extra_with_valid_data(): void
    {
        // Arrange
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        $data = [
            'name' => 'New Music Club',
            'description' => 'A club for music lovers',
            'category' => 'arts',
            'coach_name' => 'Mr. Smith',
            'schedule' => 'Every Tuesday and Thursday',
            'location' => 'Music Room',
            'max_members' => 30,
            'is_active' => true,
        ];

        // Act
        $response = $this->postJson('/api/v1/extras', $data);

        // Assert
        $response->assertCreated()
            ->assertJson([
                'data' => [
                    'attributes' => [
                        'name' => 'New Music Club',
                        'category' => 'arts',
                        'slug' => 'new-music-club',
                    ],
                ],
            ]);

        $this->assertDatabaseHas('extras', [
            'name' => 'New Music Club',
            'slug' => 'new-music-club',
        ]);
    }

    /** @test */
    public function it_auto_generates_slug_when_creating_extra(): void
    {
        // Arrange
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        $data = [
            'name' => 'Drama Club',
            'description' => 'Acting and theatre',
            'category' => 'arts',
        ];

        // Act
        $response = $this->postJson('/api/v1/extras', $data);

        // Assert
        $response->assertCreated();
        $this->assertEquals('drama-club', $response->json('data.attributes.slug'));
        $this->assertDatabaseHas('extras', ['slug' => 'drama-club']);
    }

    /** @test */
    public function it_validates_required_fields_on_create(): void
    {
        // Arrange
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        $data = []; // Empty data

        // Act
        $response = $this->postJson('/api/v1/extras', $data);

        // Assert
        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'description', 'category']);
    }

    /** @test */
    public function it_can_update_extra(): void
    {
        // Arrange
        $user = User::factory()->create();
        $extra = Extra::factory()->create([
            'name' => 'Old Club',
            'description' => 'Old description',
        ]);
        Sanctum::actingAs($user, ['*']);

        $data = [
            'name' => 'Updated Club',
            'description' => 'Updated description',
        ];

        // Act
        $response = $this->putJson("/api/v1/extras/{$extra->slug}", $data);

        // Assert
        $response->assertOk()
            ->assertJson([
                'data' => [
                    'attributes' => [
                        'name' => 'Updated Club',
                    ],
                ],
            ]);

        $this->assertDatabaseHas('extras', [
            'id' => $extra->id,
            'name' => 'Updated Club',
            'description' => 'Updated description',
        ]);
    }

    /** @test */
    public function it_requires_authentication_for_updating_extra(): void
    {
        // Arrange
        $extra = Extra::factory()->create();
        $data = ['name' => 'Updated Name'];

        // Act
        $response = $this->putJson("/api/v1/extras/{$extra->slug}", $data);

        // Assert
        $response->assertUnauthorized();
    }

    /** @test */
    public function it_can_delete_extra(): void
    {
        // Arrange
        $user = User::factory()->create();
        $extra = Extra::factory()->create();
        Sanctum::actingAs($user, ['*']);

        // Act
        $response = $this->deleteJson("/api/v1/extras/{$extra->slug}");

        // Assert
        $response->assertNoContent();
        $this->assertSoftDeleted('extras', ['id' => $extra->id]);
    }

    /** @test */
    public function it_requires_authentication_for_deleting_extra(): void
    {
        // Arrange
        $extra = Extra::factory()->create();

        // Act
        $response = $this->deleteJson("/api/v1/extras/{$extra->slug}");

        // Assert
        $response->assertUnauthorized();
    }

    /** @test */
    public function it_can_toggle_extra_active_status(): void
    {
        // Arrange
        $user = User::factory()->create();
        $extra = Extra::factory()->create(['is_active' => true]);
        Sanctum::actingAs($user, ['*']);

        // Act
        $response = $this->postJson("/api/v1/extras/{$extra->slug}/toggle-active");

        // Assert
        $response->assertOk();
        $this->assertFalse($response->json('data.attributes.is_active'));
        $this->assertDatabaseHas('extras', [
            'id' => $extra->id,
            'is_active' => false,
        ]);

        // Toggle again
        $response2 = $this->postJson("/api/v1/extras/{$extra->slug}/toggle-active");
        $response2->assertOk();
        $this->assertTrue($response2->json('data.attributes.is_active'));
    }

    /** @test */
    public function it_can_toggle_extra_featured_status(): void
    {
        // Arrange
        $user = User::factory()->create();
        $extra = Extra::factory()->create(['is_featured' => false]);
        Sanctum::actingAs($user, ['*']);

        // Act
        $response = $this->postJson("/api/v1/extras/{$extra->slug}/toggle-featured");

        // Assert
        $response->assertOk();
        $this->assertTrue($response->json('data.attributes.is_featured'));
        $this->assertDatabaseHas('extras', [
            'id' => $extra->id,
            'is_featured' => true,
        ]);

        // Toggle again
        $response2 = $this->postJson("/api/v1/extras/{$extra->slug}/toggle-featured");
        $response2->assertOk();
        $this->assertFalse($response2->json('data.attributes.is_featured'));
    }

    /** @test */
    public function it_requires_authentication_for_toggle_operations(): void
    {
        // Arrange
        $extra = Extra::factory()->create();

        // Act
        $activeResponse = $this->postJson("/api/v1/extras/{$extra->slug}/toggle-active");
        $featuredResponse = $this->postJson("/api/v1/extras/{$extra->slug}/toggle-featured");

        // Assert
        $activeResponse->assertUnauthorized();
        $featuredResponse->assertUnauthorized();
    }

    /** @test */
    public function it_can_paginate_with_custom_per_page(): void
    {
        // Arrange
        Extra::factory()->count(30)->create();

        // Act
        $response = $this->getJson('/api/v1/extras?limit=20');

        // Assert
        $response->assertOk();
        $this->assertCount(20, $response->json('data'));
        $this->assertEquals(20, $response->json('meta.per_page'));
    }

    /** @test */
    public function it_can_disable_pagination(): void
    {
        // Arrange
        Extra::factory()->count(20)->create();

        // Act
        $response = $this->getJson('/api/v1/extras?paginate=false&limit=100');

        // Assert
        $response->assertOk()
            ->assertJsonStructure([
                'data',
                'meta' => ['count'],
            ])
            ->assertJsonMissing(['links', 'meta.current_page']);

        $this->assertCount(20, $response->json('data'));
        $this->assertEquals(20, $response->json('meta.count'));
    }

    /** @test */
    public function it_can_join_extra(): void
    {
        // Arrange
        $user = User::factory()->create();
        $extra = Extra::factory()->create(['is_active' => true]);
        Sanctum::actingAs($user, ['*']);

        // Act
        $response = $this->postJson("/api/v1/extras/{$extra->slug}/join");

        // Assert
        $response->assertOk()
            ->assertJsonStructure([
                'message',
                'data',
            ]);

        $this->assertDatabaseHas('extra_members', [
            'extra_id' => $extra->id,
            'user_id' => $user->id,
        ]);
    }

    /** @test */
    public function it_can_leave_extra(): void
    {
        // Arrange
        $user = User::factory()->create();
        $extra = Extra::factory()->create(['is_active' => true]);
        Sanctum::actingAs($user, ['*']);

        // Join first
        $extra->members()->attach($user->id, ['role' => 'member', 'joined_at' => now()]);

        // Act
        $response = $this->postJson("/api/v1/extras/{$extra->slug}/leave");

        // Assert
        $response->assertOk()
            ->assertJsonStructure([
                'message',
                'data',
            ]);

        $this->assertDatabaseMissing('extra_members', [
            'extra_id' => $extra->id,
            'user_id' => $user->id,
        ]);
    }

    /** @test */
    public function it_can_get_extra_members(): void
    {
        // Arrange
        $extra = Extra::factory()->create();
        $users = User::factory()->count(5)->create();

        foreach ($users as $user) {
            $extra->members()->attach($user->id, [
                'role' => 'member',
                'joined_at' => now(),
            ]);
        }

        // Act
        $response = $this->getJson("/api/v1/extras/{$extra->slug}/members");

        // Assert
        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'email',
                        'role',
                        'joined_at',
                    ],
                ],
                'meta' => [
                    'count',
                ],
            ]);

        $this->assertCount(5, $response->json('data'));
        $this->assertEquals(5, $response->json('meta.count'));
    }

    /** @test */
    public function it_can_filter_members_by_role(): void
    {
        // Arrange
        $extra = Extra::factory()->create();
        $leaders = User::factory()->count(2)->create();
        $members = User::factory()->count(3)->create();

        foreach ($leaders as $user) {
            $extra->members()->attach($user->id, [
                'role' => 'leader',
                'joined_at' => now(),
            ]);
        }

        foreach ($members as $user) {
            $extra->members()->attach($user->id, [
                'role' => 'member',
                'joined_at' => now(),
            ]);
        }

        // Act
        $response = $this->getJson("/api/v1/extras/{$extra->slug}/members?role=leader");

        // Assert
        $response->assertOk();
        $this->assertCount(2, $response->json('data'));

        foreach ($response->json('data') as $member) {
            $this->assertEquals('leader', $member['role']);
        }
    }
}

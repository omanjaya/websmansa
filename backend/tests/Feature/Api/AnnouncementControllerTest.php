<?php

declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Models\Announcement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AnnouncementControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_list_announcements_with_pagination(): void
    {
        // Arrange
        Announcement::factory()->count(20)->create();

        // Act
        $response = $this->getJson('/api/v1/announcements');

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
                            'type',
                            'priority',
                            'is_pinned',
                            'is_active',
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
        $this->assertEquals('announcement', $response->json('data.0.type'));
    }

    /** @test */
    public function it_can_filter_announcements_by_type(): void
    {
        // Arrange
        Announcement::factory()->count(5)->create(['type' => 'info']);
        Announcement::factory()->count(3)->create(['type' => 'event']);

        // Act
        $response = $this->getJson('/api/v1/announcements?type=info');

        // Assert
        $response->assertOk();
        $this->assertCount(5, $response->json('data'));

        foreach ($response->json('data') as $announcement) {
            $this->assertEquals('info', $announcement['attributes']['type']);
        }
    }

    /** @test */
    public function it_can_filter_announcements_by_priority(): void
    {
        // Arrange
        Announcement::factory()->count(5)->create(['priority' => 'high']);
        Announcement::factory()->count(3)->create(['priority' => 'medium']);

        // Act
        $response = $this->getJson('/api/v1/announcements?priority=high');

        // Assert
        $response->assertOk();
        $this->assertCount(5, $response->json('data'));

        foreach ($response->json('data') as $announcement) {
            $this->assertEquals('high', $announcement['attributes']['priority']);
        }
    }

    /** @test */
    public function it_can_filter_announcements_by_pinned_status(): void
    {
        // Arrange
        Announcement::factory()->count(5)->create(['is_pinned' => true]);
        Announcement::factory()->count(3)->create(['is_pinned' => false]);

        // Act
        $response = $this->getJson('/api/v1/announcements?is_pinned=1');

        // Assert
        $response->assertOk();
        $this->assertCount(5, $response->json('data'));
    }

    /** @test */
    public function it_can_filter_announcements_by_active_status(): void
    {
        // Arrange
        Announcement::factory()->count(5)->create(['is_active' => true]);
        Announcement::factory()->count(3)->create(['is_active' => false]);

        // Act
        $response = $this->getJson('/api/v1/announcements?is_active=1');

        // Assert
        $response->assertOk();
        $this->assertCount(5, $response->json('data'));
    }

    /** @test */
    public function it_can_get_featured_announcements(): void
    {
        // Arrange
        Announcement::factory()->count(8)->create(['is_pinned' => true, 'is_active' => true]);
        Announcement::factory()->count(5)->create(['is_pinned' => false]);

        // Act
        $response = $this->getJson('/api/v1/announcements/featured');

        // Assert
        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'attributes' => [
                            'title',
                            'is_pinned',
                        ],
                    ],
                ],
                'meta' => [
                    'count',
                ],
            ]);

        $this->assertCount(5, $response->json('data')); // Default limit is 5
        $this->assertEquals(5, $response->json('meta.count'));

        foreach ($response->json('data') as $announcement) {
            $this->assertTrue($announcement['attributes']['is_pinned']);
        }
    }

    /** @test */
    public function it_can_get_featured_announcements_with_custom_limit(): void
    {
        // Arrange
        Announcement::factory()->count(10)->create(['is_pinned' => true, 'is_active' => true]);

        // Act
        $response = $this->getJson('/api/v1/announcements/featured?limit=3');

        // Assert
        $response->assertOk();
        $this->assertCount(3, $response->json('data'));
        $this->assertEquals(3, $response->json('meta.count'));
    }

    /** @test */
    public function it_can_get_latest_announcements(): void
    {
        // Arrange
        Announcement::factory()->count(15)->create(['is_active' => true]);

        // Act
        $response = $this->getJson('/api/v1/announcements/latest');

        // Assert
        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'attributes' => [
                            'title',
                        ],
                    ],
                ],
                'meta' => [
                    'count',
                ],
            ]);

        $this->assertCount(10, $response->json('data')); // Default limit is 10
        $this->assertEquals(10, $response->json('meta.count'));
    }

    /** @test */
    public function it_can_get_latest_announcements_with_custom_limit(): void
    {
        // Arrange
        Announcement::factory()->count(15)->create(['is_active' => true]);

        // Act
        $response = $this->getJson('/api/v1/announcements/latest?limit=5');

        // Assert
        $response->assertOk();
        $this->assertCount(5, $response->json('data'));
        $this->assertEquals(5, $response->json('meta.count'));
    }

    /** @test */
    public function it_can_show_announcement_by_slug(): void
    {
        // Arrange
        $announcement = Announcement::factory()->create([
            'title' => 'Important Notice',
            'slug' => 'important-notice',
            'type' => 'info',
        ]);

        // Act
        $response = $this->getJson('/api/v1/announcements/important-notice');

        // Assert
        $response->assertOk()
            ->assertJson([
                'data' => [
                    'id' => $announcement->id,
                    'attributes' => [
                        'title' => 'Important Notice',
                        'slug' => 'important-notice',
                        'type' => 'info',
                    ],
                ],
            ]);
    }

    /** @test */
    public function it_returns_404_when_announcement_not_found_by_slug(): void
    {
        // Act
        $response = $this->getJson('/api/v1/announcements/non-existent-slug');

        // Assert
        $response->assertNotFound();
    }

    /** @test */
    public function it_can_get_announcements_by_type(): void
    {
        // Arrange
        Announcement::factory()->count(5)->create([
            'type' => 'info',
            'is_active' => true,
            'published_at' => now()->subDay(),
        ]);
        Announcement::factory()->count(3)->create([
            'type' => 'event',
            'is_active' => true,
            'published_at' => now()->subDay(),
        ]);

        // Act
        $response = $this->getJson('/api/v1/announcements/by-type/info');

        // Assert
        $response->assertOk();
        $this->assertCount(5, $response->json('data'));
        $this->assertEquals(5, $response->json('meta.count'));
    }

    /** @test */
    public function it_requires_authentication_for_creating_announcement(): void
    {
        // Arrange
        $data = [
            'title' => 'New Announcement',
            'content' => 'This is a new announcement',
            'type' => 'info',
        ];

        // Act
        $response = $this->postJson('/api/v1/announcements', $data);

        // Assert
        $response->assertUnauthorized();
    }

    /** @test */
    public function it_can_create_announcement_with_valid_data(): void
    {
        // Arrange
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        $data = [
            'title' => 'New Important Announcement',
            'content' => 'This is an important announcement',
            'type' => 'info',
            'priority' => 'high',
            'published_at' => now()->toDateTimeString(),
            'is_active' => true,
        ];

        // Act
        $response = $this->postJson('/api/v1/announcements', $data);

        // Assert
        $response->assertCreated()
            ->assertJson([
                'data' => [
                    'attributes' => [
                        'title' => 'New Important Announcement',
                        'type' => 'info',
                        'priority' => 'high',
                        'slug' => 'new-important-announcement',
                    ],
                ],
            ]);

        $this->assertDatabaseHas('announcements', [
            'title' => 'New Important Announcement',
            'slug' => 'new-important-announcement',
        ]);
    }

    /** @test */
    public function it_auto_generates_slug_when_creating_announcement(): void
    {
        // Arrange
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        $data = [
            'title' => 'School Holiday Schedule',
            'content' => 'School holiday dates',
            'type' => 'event',
            'priority' => 'medium',
        ];

        // Act
        $response = $this->postJson('/api/v1/announcements', $data);

        // Assert
        $response->assertCreated();
        $this->assertEquals('school-holiday-schedule', $response->json('data.attributes.slug'));
        $this->assertDatabaseHas('announcements', ['slug' => 'school-holiday-schedule']);
    }

    /** @test */
    public function it_validates_required_fields_on_create(): void
    {
        // Arrange
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        $data = []; // Empty data

        // Act
        $response = $this->postJson('/api/v1/announcements', $data);

        // Assert
        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['title', 'content', 'type']);
    }

    /** @test */
    public function it_can_update_announcement(): void
    {
        // Arrange
        $user = User::factory()->create();
        $announcement = Announcement::factory()->create([
            'title' => 'Old Title',
            'content' => 'Old content',
        ]);
        Sanctum::actingAs($user, ['*']);

        $data = [
            'title' => 'Updated Title',
            'content' => 'Updated content',
        ];

        // Act
        $response = $this->putJson("/api/v1/announcements/{$announcement->slug}", $data);

        // Assert
        $response->assertOk()
            ->assertJson([
                'data' => [
                    'attributes' => [
                        'title' => 'Updated Title',
                    ],
                ],
            ]);

        $this->assertDatabaseHas('announcements', [
            'id' => $announcement->id,
            'title' => 'Updated Title',
            'content' => 'Updated content',
        ]);
    }

    /** @test */
    public function it_requires_authentication_for_updating_announcement(): void
    {
        // Arrange
        $announcement = Announcement::factory()->create();
        $data = ['title' => 'Updated Title'];

        // Act
        $response = $this->putJson("/api/v1/announcements/{$announcement->slug}", $data);

        // Assert
        $response->assertUnauthorized();
    }

    /** @test */
    public function it_can_delete_announcement(): void
    {
        // Arrange
        $user = User::factory()->create();
        $announcement = Announcement::factory()->create();
        Sanctum::actingAs($user, ['*']);

        // Act
        $response = $this->deleteJson("/api/v1/announcements/{$announcement->slug}");

        // Assert
        $response->assertNoContent();
        $this->assertSoftDeleted('announcements', ['id' => $announcement->id]);
    }

    /** @test */
    public function it_requires_authentication_for_deleting_announcement(): void
    {
        // Arrange
        $announcement = Announcement::factory()->create();

        // Act
        $response = $this->deleteJson("/api/v1/announcements/{$announcement->slug}");

        // Assert
        $response->assertUnauthorized();
    }

    /** @test */
    public function it_can_toggle_announcement_active_status(): void
    {
        // Arrange
        $user = User::factory()->create();
        $announcement = Announcement::factory()->create(['is_active' => true]);
        Sanctum::actingAs($user, ['*']);

        // Act
        $response = $this->postJson("/api/v1/announcements/{$announcement->slug}/toggle-active");

        // Assert
        $response->assertOk();
        $this->assertFalse($response->json('data.attributes.is_active'));
        $this->assertDatabaseHas('announcements', [
            'id' => $announcement->id,
            'is_active' => false,
        ]);

        // Toggle again
        $response2 = $this->postJson("/api/v1/announcements/{$announcement->slug}/toggle-active");
        $response2->assertOk();
        $this->assertTrue($response2->json('data.attributes.is_active'));
    }

    /** @test */
    public function it_can_toggle_announcement_pinned_status(): void
    {
        // Arrange
        $user = User::factory()->create();
        $announcement = Announcement::factory()->create(['is_pinned' => false]);
        Sanctum::actingAs($user, ['*']);

        // Act
        $response = $this->postJson("/api/v1/announcements/{$announcement->slug}/toggle-pin");

        // Assert
        $response->assertOk();
        $this->assertTrue($response->json('data.attributes.is_pinned'));
        $this->assertDatabaseHas('announcements', [
            'id' => $announcement->id,
            'is_pinned' => true,
        ]);

        // Toggle again
        $response2 = $this->postJson("/api/v1/announcements/{$announcement->slug}/toggle-pin");
        $response2->assertOk();
        $this->assertFalse($response2->json('data.attributes.is_pinned'));
    }

    /** @test */
    public function it_requires_authentication_for_toggle_operations(): void
    {
        // Arrange
        $announcement = Announcement::factory()->create();

        // Act
        $activeResponse = $this->postJson("/api/v1/announcements/{$announcement->slug}/toggle-active");
        $pinnedResponse = $this->postJson("/api/v1/announcements/{$announcement->slug}/toggle-pin");

        // Assert
        $activeResponse->assertUnauthorized();
        $pinnedResponse->assertUnauthorized();
    }

    /** @test */
    public function it_can_paginate_with_custom_per_page(): void
    {
        // Arrange
        Announcement::factory()->count(30)->create();

        // Act
        $response = $this->getJson('/api/v1/announcements?limit=20');

        // Assert
        $response->assertOk();
        $this->assertCount(20, $response->json('data'));
        $this->assertEquals(20, $response->json('meta.per_page'));
    }

    /** @test */
    public function it_can_disable_pagination(): void
    {
        // Arrange
        Announcement::factory()->count(20)->create();

        // Act
        $response = $this->getJson('/api/v1/announcements?paginate=false&limit=100');

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
}

<?php

declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Models\Facility;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class FacilityControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_list_facilities_with_pagination(): void
    {
        // Arrange
        Facility::factory()->count(20)->create();

        // Act
        $response = $this->getJson('/api/v1/facilities');

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
        $this->assertEquals('facility', $response->json('data.0.type'));
    }

    /** @test */
    public function it_can_filter_facilities_by_category(): void
    {
        // Arrange
        Facility::factory()->count(5)->create(['category' => 'classroom']);
        Facility::factory()->count(3)->create(['category' => 'laboratory']);

        // Act
        $response = $this->getJson('/api/v1/facilities?category=classroom');

        // Assert
        $response->assertOk();
        $this->assertCount(5, $response->json('data'));

        foreach ($response->json('data') as $facility) {
            $this->assertEquals('classroom', $facility['attributes']['category']);
        }
    }

    /** @test */
    public function it_can_filter_facilities_by_active_status(): void
    {
        // Arrange
        Facility::factory()->count(5)->create(['is_active' => true]);
        Facility::factory()->count(3)->create(['is_active' => false]);

        // Act
        $response = $this->getJson('/api/v1/facilities?is_active=1');

        // Assert
        $response->assertOk();
        $this->assertCount(5, $response->json('data'));
    }

    /** @test */
    public function it_can_get_featured_facilities(): void
    {
        // Arrange
        Facility::factory()->count(8)->create(['is_featured' => true, 'is_active' => true]);
        Facility::factory()->count(5)->create(['is_featured' => false]);

        // Act
        $response = $this->getJson('/api/v1/facilities/featured');

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

        foreach ($response->json('data') as $facility) {
            $this->assertTrue($facility['attributes']['is_featured']);
        }
    }

    /** @test */
    public function it_can_get_featured_facilities_with_custom_limit(): void
    {
        // Arrange
        Facility::factory()->count(10)->create(['is_featured' => true, 'is_active' => true]);

        // Act
        $response = $this->getJson('/api/v1/facilities/featured?limit=3');

        // Assert
        $response->assertOk();
        $this->assertCount(3, $response->json('data'));
        $this->assertEquals(3, $response->json('meta.count'));
    }

    /** @test */
    public function it_can_show_facility_by_slug(): void
    {
        // Arrange
        $facility = Facility::factory()->create([
            'name' => 'Main Library',
            'slug' => 'main-library',
            'category' => 'library',
        ]);

        // Act
        $response = $this->getJson('/api/v1/facilities/main-library');

        // Assert
        $response->assertOk()
            ->assertJson([
                'data' => [
                    'id' => $facility->id,
                    'attributes' => [
                        'name' => 'Main Library',
                        'slug' => 'main-library',
                        'category' => 'library',
                    ],
                ],
            ]);
    }

    /** @test */
    public function it_returns_404_when_facility_not_found_by_slug(): void
    {
        // Act
        $response = $this->getJson('/api/v1/facilities/non-existent-slug');

        // Assert
        $response->assertNotFound();
    }

    /** @test */
    public function it_can_get_facilities_by_category(): void
    {
        // Arrange
        Facility::factory()->count(5)->create(['category' => 'classroom', 'is_active' => true]);
        Facility::factory()->count(3)->create(['category' => 'laboratory', 'is_active' => true]);

        // Act
        $response = $this->getJson('/api/v1/facilities/by-category/classroom');

        // Assert
        $response->assertOk();
        $this->assertCount(5, $response->json('data'));
        $this->assertEquals(5, $response->json('meta.count'));
    }

    /** @test */
    public function it_can_get_bookable_facilities(): void
    {
        // Arrange
        Facility::factory()->count(6)->create(['booking_url' => 'https://booking.example.com', 'is_active' => true]);
        Facility::factory()->count(4)->create(['booking_url' => null, 'is_active' => true]);

        // Act
        $response = $this->getJson('/api/v1/facilities/bookable');

        // Assert
        $response->assertOk();
        $this->assertCount(6, $response->json('data'));
        $this->assertEquals(6, $response->json('meta.count'));
    }

    /** @test */
    public function it_requires_authentication_for_creating_facility(): void
    {
        // Arrange
        $data = [
            'name' => 'New Classroom',
            'description' => 'A spacious classroom',
            'category' => 'classroom',
        ];

        // Act
        $response = $this->postJson('/api/v1/facilities', $data);

        // Assert
        $response->assertUnauthorized();
    }

    /** @test */
    public function it_can_create_facility_with_valid_data(): void
    {
        // Arrange
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        $data = [
            'name' => 'New Computer Lab',
            'description' => 'Modern computer laboratory with 40 PCs',
            'category' => 'computer',
            'location' => 'Building A, Floor 2',
            'capacity' => 40,
            'is_active' => true,
        ];

        // Act
        $response = $this->postJson('/api/v1/facilities', $data);

        // Assert
        $response->assertCreated()
            ->assertJson([
                'data' => [
                    'attributes' => [
                        'name' => 'New Computer Lab',
                        'category' => 'computer',
                        'slug' => 'new-computer-lab',
                    ],
                ],
            ]);

        $this->assertDatabaseHas('facilities', [
            'name' => 'New Computer Lab',
            'slug' => 'new-computer-lab',
        ]);
    }

    /** @test */
    public function it_auto_generates_slug_when_creating_facility(): void
    {
        // Arrange
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        $data = [
            'name' => 'Science Laboratory',
            'description' => 'Chemistry and Physics lab',
            'category' => 'science',
        ];

        // Act
        $response = $this->postJson('/api/v1/facilities', $data);

        // Assert
        $response->assertCreated();
        $this->assertEquals('science-laboratory', $response->json('data.attributes.slug'));
        $this->assertDatabaseHas('facilities', ['slug' => 'science-laboratory']);
    }

    /** @test */
    public function it_validates_required_fields_on_create(): void
    {
        // Arrange
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        $data = []; // Empty data

        // Act
        $response = $this->postJson('/api/v1/facilities', $data);

        // Assert
        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'description', 'category']);
    }

    /** @test */
    public function it_can_update_facility(): void
    {
        // Arrange
        $user = User::factory()->create();
        $facility = Facility::factory()->create([
            'name' => 'Old Library',
            'description' => 'Old description',
        ]);
        Sanctum::actingAs($user, ['*']);

        $data = [
            'name' => 'Updated Library',
            'description' => 'Updated description',
        ];

        // Act
        $response = $this->putJson("/api/v1/facilities/{$facility->slug}", $data);

        // Assert
        $response->assertOk()
            ->assertJson([
                'data' => [
                    'attributes' => [
                        'name' => 'Updated Library',
                    ],
                ],
            ]);

        $this->assertDatabaseHas('facilities', [
            'id' => $facility->id,
            'name' => 'Updated Library',
            'description' => 'Updated description',
        ]);
    }

    /** @test */
    public function it_requires_authentication_for_updating_facility(): void
    {
        // Arrange
        $facility = Facility::factory()->create();
        $data = ['name' => 'Updated Name'];

        // Act
        $response = $this->putJson("/api/v1/facilities/{$facility->slug}", $data);

        // Assert
        $response->assertUnauthorized();
    }

    /** @test */
    public function it_can_delete_facility(): void
    {
        // Arrange
        $user = User::factory()->create();
        $facility = Facility::factory()->create();
        Sanctum::actingAs($user, ['*']);

        // Act
        $response = $this->deleteJson("/api/v1/facilities/{$facility->slug}");

        // Assert
        $response->assertNoContent();
        $this->assertSoftDeleted('facilities', ['id' => $facility->id]); // Facility uses soft deletes
    }

    /** @test */
    public function it_requires_authentication_for_deleting_facility(): void
    {
        // Arrange
        $facility = Facility::factory()->create();

        // Act
        $response = $this->deleteJson("/api/v1/facilities/{$facility->slug}");

        // Assert
        $response->assertUnauthorized();
    }

    /** @test */
    public function it_can_toggle_facility_active_status(): void
    {
        // Arrange
        $user = User::factory()->create();
        $facility = Facility::factory()->create(['is_active' => true]);
        Sanctum::actingAs($user, ['*']);

        // Act
        $response = $this->postJson("/api/v1/facilities/{$facility->slug}/toggle-active");

        // Assert
        $response->assertOk();
        $this->assertFalse($response->json('data.attributes.is_active'));
        $this->assertDatabaseHas('facilities', [
            'id' => $facility->id,
            'is_active' => false,
        ]);

        // Toggle again
        $response2 = $this->postJson("/api/v1/facilities/{$facility->slug}/toggle-active");
        $response2->assertOk();
        $this->assertTrue($response2->json('data.attributes.is_active'));
    }

    /** @test */
    public function it_can_toggle_facility_featured_status(): void
    {
        // Arrange
        $user = User::factory()->create();
        $facility = Facility::factory()->create(['is_featured' => false]);
        Sanctum::actingAs($user, ['*']);

        // Act
        $response = $this->postJson("/api/v1/facilities/{$facility->slug}/toggle-featured");

        // Assert
        $response->assertOk();
        $this->assertTrue($response->json('data.attributes.is_featured'));
        $this->assertDatabaseHas('facilities', [
            'id' => $facility->id,
            'is_featured' => true,
        ]);

        // Toggle again
        $response2 = $this->postJson("/api/v1/facilities/{$facility->slug}/toggle-featured");
        $response2->assertOk();
        $this->assertFalse($response2->json('data.attributes.is_featured'));
    }

    /** @test */
    public function it_requires_authentication_for_toggle_operations(): void
    {
        // Arrange
        $facility = Facility::factory()->create();

        // Act
        $activeResponse = $this->postJson("/api/v1/facilities/{$facility->slug}/toggle-active");
        $featuredResponse = $this->postJson("/api/v1/facilities/{$facility->slug}/toggle-featured");

        // Assert
        $activeResponse->assertUnauthorized();
        $featuredResponse->assertUnauthorized();
    }

    /** @test */
    public function it_returns_facilities_ordered_by_order_field(): void
    {
        // Arrange
        $facility1 = Facility::factory()->create(['order' => 3, 'name' => 'Third']);
        $facility2 = Facility::factory()->create(['order' => 1, 'name' => 'First']);
        $facility3 = Facility::factory()->create(['order' => 2, 'name' => 'Second']);

        // Act
        $response = $this->getJson('/api/v1/facilities?paginate=false&limit=100');

        // Assert
        $response->assertOk();
        $data = $response->json('data');
        $this->assertEquals('First', $data[0]['attributes']['name']);
        $this->assertEquals('Second', $data[1]['attributes']['name']);
        $this->assertEquals('Third', $data[2]['attributes']['name']);
    }

    /** @test */
    public function it_can_get_facility_categories(): void
    {
        // Act
        $response = $this->getJson('/api/v1/facilities/categories');

        // Assert
        $response->assertOk()
            ->assertJsonStructure([
                'data',
            ]);

        $this->assertIsArray($response->json('data'));
    }

    /** @test */
    public function it_can_paginate_with_custom_per_page(): void
    {
        // Arrange
        Facility::factory()->count(30)->create();

        // Act
        $response = $this->getJson('/api/v1/facilities?limit=20');

        // Assert
        $response->assertOk();
        $this->assertCount(20, $response->json('data'));
        $this->assertEquals(20, $response->json('meta.per_page'));
    }

    /** @test */
    public function it_can_disable_pagination(): void
    {
        // Arrange
        Facility::factory()->count(20)->create();

        // Act
        $response = $this->getJson('/api/v1/facilities?paginate=false&limit=100');

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

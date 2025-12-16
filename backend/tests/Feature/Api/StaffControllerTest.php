<?php

declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Models\Staff;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class StaffControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_list_staff_with_pagination(): void
    {
        // Arrange
        Staff::factory()->count(20)->create();

        // Act
        $response = $this->getJson('/api/v1/staff');

        // Assert
        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'type',
                        'attributes' => [
                            'nip',
                            'name',
                            'slug',
                            'position',
                            'department',
                            'type',
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
        $this->assertEquals('staff', $response->json('data.0.type'));
    }

    /** @test */
    public function it_can_filter_staff_by_type(): void
    {
        // Arrange
        Staff::factory()->teacher()->count(5)->create();
        Staff::factory()->admin()->count(3)->create();

        // Act
        $response = $this->getJson('/api/v1/staff?type=teacher');

        // Assert
        $response->assertOk();
        $this->assertCount(5, $response->json('data'));

        foreach ($response->json('data') as $staff) {
            $this->assertEquals('teacher', $staff['attributes']['type']);
        }
    }

    /** @test */
    public function it_can_filter_staff_by_department(): void
    {
        // Arrange
        Staff::factory()->mathematics()->count(3)->create();
        Staff::factory()->science()->count(2)->create();

        // Act
        $response = $this->getJson('/api/v1/staff?department=mathematics');

        // Assert
        $response->assertOk();
        $this->assertCount(3, $response->json('data'));

        foreach ($response->json('data') as $staff) {
            $this->assertEquals('mathematics', $staff['attributes']['department']);
        }
    }

    /** @test */
    public function it_can_filter_staff_by_active_status(): void
    {
        // Arrange
        Staff::factory()->count(5)->create(['is_active' => true]);
        Staff::factory()->count(3)->create(['is_active' => false]);

        // Act
        $response = $this->getJson('/api/v1/staff?is_active=1');

        // Assert
        $response->assertOk();
        $this->assertCount(5, $response->json('data'));
    }

    /** @test */
    public function it_can_get_featured_staff(): void
    {
        // Arrange
        Staff::factory()->featured()->count(8)->create();
        Staff::factory()->count(5)->create(['is_featured' => false]);

        // Act
        $response = $this->getJson('/api/v1/staff/featured');

        // Assert
        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'attributes' => [
                            'name',
                            'position',
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

        foreach ($response->json('data') as $staff) {
            $this->assertTrue($staff['attributes']['is_featured']);
        }
    }

    /** @test */
    public function it_can_get_featured_staff_with_custom_limit(): void
    {
        // Arrange
        Staff::factory()->featured()->count(10)->create();

        // Act
        $response = $this->getJson('/api/v1/staff/featured?limit=3');

        // Assert
        $response->assertOk();
        $this->assertCount(3, $response->json('data'));
        $this->assertEquals(3, $response->json('meta.count'));
    }

    /** @test */
    public function it_can_show_staff_by_slug(): void
    {
        // Arrange
        $staff = Staff::factory()->create([
            'name' => 'John Doe',
            'slug' => 'john-doe',
            'position' => 'Mathematics Teacher',
        ]);

        // Act
        $response = $this->getJson('/api/v1/staff/john-doe');

        // Assert
        $response->assertOk()
            ->assertJson([
                'data' => [
                    'id' => $staff->id,
                    'attributes' => [
                        'name' => 'John Doe',
                        'slug' => 'john-doe',
                        'position' => 'Mathematics Teacher',
                    ],
                ],
            ]);
    }

    /** @test */
    public function it_returns_404_when_staff_not_found_by_slug(): void
    {
        // Act
        $response = $this->getJson('/api/v1/staff/non-existent-slug');

        // Assert
        $response->assertNotFound();
    }

    /** @test */
    public function it_can_get_staff_by_type(): void
    {
        // Arrange
        Staff::factory()->teacher()->count(5)->create(['is_active' => true]);
        Staff::factory()->admin()->count(3)->create(['is_active' => true]);

        // Act
        $response = $this->getJson('/api/v1/staff/by-type/teacher');

        // Assert
        $response->assertOk();
        $this->assertCount(5, $response->json('data'));
        $this->assertEquals(5, $response->json('meta.count'));
    }

    /** @test */
    public function it_can_get_staff_by_department(): void
    {
        // Arrange
        Staff::factory()->count(3)->create(['department' => 'mathematics']);
        Staff::factory()->count(2)->create(['department' => 'physics']);

        // Act
        $response = $this->getJson('/api/v1/staff/by-department/mathematics');

        // Assert
        $response->assertOk();
        $this->assertCount(3, $response->json('data'));
        $this->assertEquals(3, $response->json('meta.count'));
    }

    /** @test */
    public function it_can_get_teachers(): void
    {
        // Arrange
        Staff::factory()->teacher()->count(8)->create(['is_active' => true]); // Ensure all are active
        Staff::factory()->admin()->count(3)->create(['is_active' => true]);

        // Act
        $response = $this->getJson('/api/v1/staff/teachers');

        // Assert
        $response->assertOk();
        $this->assertCount(8, $response->json('data'));
        $this->assertEquals(8, $response->json('meta.count'));
    }

    /** @test */
    public function it_requires_authentication_for_creating_staff(): void
    {
        // Arrange
        $data = [
            'name' => 'New Teacher',
            'nip' => '199001011990031001',
            'position' => 'Teacher',
            'type' => 'teacher',
            'department' => 'mathematics',
        ];

        // Act
        $response = $this->postJson('/api/v1/staff', $data);

        // Assert
        $response->assertUnauthorized();
    }

    /** @test */
    public function it_can_create_staff_with_valid_data(): void
    {
        // Arrange
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        $data = [
            'name' => 'New Teacher',
            'nip' => '199001011990031001',
            'position' => 'Mathematics Teacher',
            'type' => 'teacher',
            'department' => 'mathematics',
            'email' => 'teacher@example.com',
            'phone' => '081234567890',
            'is_active' => true,
        ];

        // Act
        $response = $this->postJson('/api/v1/staff', $data);

        // Assert
        $response->assertCreated()
            ->assertJson([
                'data' => [
                    'attributes' => [
                        'name' => 'New Teacher',
                        'nip' => '199001011990031001',
                        'position' => 'Mathematics Teacher',
                        'slug' => 'new-teacher',
                    ],
                ],
            ]);

        $this->assertDatabaseHas('staff', [
            'name' => 'New Teacher',
            'slug' => 'new-teacher',
        ]);
    }

    /** @test */
    public function it_auto_generates_slug_when_creating_staff(): void
    {
        // Arrange
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        $data = [
            'name' => 'Jane Smith',
            'nip' => '199101011991032001',
            'position' => 'Physics Teacher',
            'type' => 'teacher',
            'department' => 'physics',
        ];

        // Act
        $response = $this->postJson('/api/v1/staff', $data);

        // Assert
        $response->assertCreated();
        $this->assertEquals('jane-smith', $response->json('data.attributes.slug'));
        $this->assertDatabaseHas('staff', ['slug' => 'jane-smith']);
    }

    /** @test */
    public function it_validates_required_fields_on_create(): void
    {
        // Arrange
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        $data = []; // Empty data

        // Act
        $response = $this->postJson('/api/v1/staff', $data);

        // Assert
        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'type']); // Only name and type are required
    }

    /** @test */
    public function it_can_update_staff(): void
    {
        // Arrange
        $user = User::factory()->create();
        $staff = Staff::factory()->create([
            'name' => 'Old Name',
            'position' => 'Old Position',
        ]);
        Sanctum::actingAs($user, ['*']);

        $data = [
            'name' => 'Updated Name',
            'position' => 'Updated Position',
        ];

        // Act
        $response = $this->putJson("/api/v1/staff/{$staff->slug}", $data);

        // Assert
        $response->assertOk()
            ->assertJson([
                'data' => [
                    'attributes' => [
                        'name' => 'Updated Name',
                        'position' => 'Updated Position',
                    ],
                ],
            ]);

        $this->assertDatabaseHas('staff', [
            'id' => $staff->id,
            'name' => 'Updated Name',
            'position' => 'Updated Position',
        ]);
    }

    /** @test */
    public function it_requires_authentication_for_updating_staff(): void
    {
        // Arrange
        $staff = Staff::factory()->create();
        $data = ['name' => 'Updated Name'];

        // Act
        $response = $this->putJson("/api/v1/staff/{$staff->slug}", $data);

        // Assert
        $response->assertUnauthorized();
    }

    /** @test */
    public function it_can_delete_staff(): void
    {
        // Arrange
        $user = User::factory()->create();
        $staff = Staff::factory()->create();
        Sanctum::actingAs($user, ['*']);

        // Act
        $response = $this->deleteJson("/api/v1/staff/{$staff->slug}");

        // Assert
        $response->assertNoContent();
        $this->assertSoftDeleted('staff', ['id' => $staff->id]); // Staff uses soft deletes
    }

    /** @test */
    public function it_requires_authentication_for_deleting_staff(): void
    {
        // Arrange
        $staff = Staff::factory()->create();

        // Act
        $response = $this->deleteJson("/api/v1/staff/{$staff->slug}");

        // Assert
        $response->assertUnauthorized();
    }

    /** @test */
    public function it_can_toggle_staff_active_status(): void
    {
        // Arrange
        $user = User::factory()->create();
        $staff = Staff::factory()->create(['is_active' => true]);
        Sanctum::actingAs($user, ['*']);

        // Act
        $response = $this->postJson("/api/v1/staff/{$staff->slug}/toggle-active");

        // Assert
        $response->assertOk();
        $this->assertFalse($response->json('data.attributes.is_active'));
        $this->assertDatabaseHas('staff', [
            'id' => $staff->id,
            'is_active' => false,
        ]);

        // Toggle again
        $response2 = $this->postJson("/api/v1/staff/{$staff->slug}/toggle-active");
        $response2->assertOk();
        $this->assertTrue($response2->json('data.attributes.is_active'));
    }

    /** @test */
    public function it_can_toggle_staff_featured_status(): void
    {
        // Arrange
        $user = User::factory()->create();
        $staff = Staff::factory()->create(['is_featured' => false]);
        Sanctum::actingAs($user, ['*']);

        // Act
        $response = $this->postJson("/api/v1/staff/{$staff->slug}/toggle-featured");

        // Assert
        $response->assertOk();
        $this->assertTrue($response->json('data.attributes.is_featured'));
        $this->assertDatabaseHas('staff', [
            'id' => $staff->id,
            'is_featured' => true,
        ]);

        // Toggle again
        $response2 = $this->postJson("/api/v1/staff/{$staff->slug}/toggle-featured");
        $response2->assertOk();
        $this->assertFalse($response2->json('data.attributes.is_featured'));
    }

    /** @test */
    public function it_requires_authentication_for_toggle_operations(): void
    {
        // Arrange
        $staff = Staff::factory()->create();

        // Act
        $activeResponse = $this->postJson("/api/v1/staff/{$staff->slug}/toggle-active");
        $featuredResponse = $this->postJson("/api/v1/staff/{$staff->slug}/toggle-featured");

        // Assert
        $activeResponse->assertUnauthorized();
        $featuredResponse->assertUnauthorized();
    }

    /** @test */
    public function it_can_search_staff_by_name(): void
    {
        // Note: Search functionality is not implemented in getFilteredStaff yet
        // This test is skipped until search is added during refactoring
        $this->markTestSkipped('Search functionality not yet implemented in index endpoint');
    }

    /** @test */
    public function it_returns_staff_ordered_by_order_field(): void
    {
        // Arrange
        $staff1 = Staff::factory()->create(['order' => 3, 'name' => 'Third']);
        $staff2 = Staff::factory()->create(['order' => 1, 'name' => 'First']);
        $staff3 = Staff::factory()->create(['order' => 2, 'name' => 'Second']);

        // Act
        $response = $this->getJson('/api/v1/staff?paginate=false');

        // Assert
        $response->assertOk();
        $data = $response->json('data');
        $this->assertEquals('First', $data[0]['attributes']['name']);
        $this->assertEquals('Second', $data[1]['attributes']['name']);
        $this->assertEquals('Third', $data[2]['attributes']['name']);
    }

    /** @test */
    public function it_includes_relationships_in_response(): void
    {
        // Arrange
        $user = User::factory()->create(['name' => 'Admin User']);
        $staff = Staff::factory()->create(['user_id' => $user->id]);

        // Act
        $response = $this->getJson("/api/v1/staff/{$staff->slug}?include_user=1");

        // Assert
        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'relationships' => [
                        'user' => [
                            'id',
                            'uuid',
                            'type',
                            'attributes' => [
                                'name',
                            ],
                        ],
                    ],
                ],
            ]);

        $this->assertEquals('Admin User', $response->json('data.relationships.user.attributes.name'));
    }

    /** @test */
    public function it_can_paginate_with_custom_per_page(): void
    {
        // Arrange
        Staff::factory()->count(30)->create();

        // Act
        $response = $this->getJson('/api/v1/staff?limit=20');

        // Assert
        $response->assertOk();
        $this->assertCount(20, $response->json('data'));
        $this->assertEquals(20, $response->json('meta.per_page'));
    }

    /** @test */
    public function it_can_disable_pagination(): void
    {
        // Arrange
        Staff::factory()->count(20)->create();

        // Act
        $response = $this->getJson('/api/v1/staff?paginate=false&limit=100'); // Need to pass higher limit when pagination is disabled

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

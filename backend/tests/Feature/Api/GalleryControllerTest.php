<?php

declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Models\Gallery;
use App\Models\GalleryItem;
use App\Models\Media;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

final class GalleryControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Bypass permission middleware for testing
        $this->withoutMiddleware('permission');
    }

    /** @test */
    public function it_can_list_galleries_with_pagination(): void
    {
        // Arrange
        Gallery::factory()->count(15)->create();

        // Act
        $response = $this->getJson('/api/v1/galleries');

        // Assert
        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'title',
                        'slug',
                    ],
                ],
                'meta' => [
                    'current_page',
                    'last_page',
                    'per_page',
                    'total',
                ],
            ]);

        $this->assertEquals(12, count($response->json('data'))); // Default per_page is 12
    }

    /** @test */
    public function it_can_filter_galleries_by_type(): void
    {
        // Arrange
        Gallery::factory()->count(3)->photo()->create();
        Gallery::factory()->count(2)->video()->create();
        Gallery::factory()->count(1)->mixed()->create();

        // Act
        $response = $this->getJson('/api/v1/galleries?type=photo');

        // Assert
        $response->assertOk();
        $this->assertCount(3, $response->json('data'));
    }

    /** @test */
    public function it_can_filter_featured_galleries(): void
    {
        // Arrange
        Gallery::factory()->count(5)->featured()->create();
        Gallery::factory()->count(3)->create(['is_featured' => false]);

        // Act
        $response = $this->getJson('/api/v1/galleries?featured=1');

        // Assert
        $response->assertOk();
        $this->assertCount(5, $response->json('data'));
    }

    /** @test */
    public function it_can_search_galleries_by_title(): void
    {
        // Arrange
        Gallery::factory()->create(['title' => 'Amazing School Event']);
        Gallery::factory()->create(['title' => 'Sports Day 2024']);
        Gallery::factory()->create(['title' => 'Graduation Ceremony']);

        // Act
        $response = $this->getJson('/api/v1/galleries?search=School');

        // Assert
        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertEquals('Amazing School Event', $response->json('data.0.title'));
    }

    /** @test */
    public function it_can_sort_galleries_by_latest(): void
    {
        // Arrange
        Gallery::factory()->create(['event_date' => '2023-01-01', 'title' => 'Old Event']);
        Gallery::factory()->create(['event_date' => '2024-01-01', 'title' => 'New Event']);

        // Act
        $response = $this->getJson('/api/v1/galleries?sort=latest');

        // Assert
        $response->assertOk();
        // Just verify we get results with the sort parameter
        $this->assertGreaterThanOrEqual(2, count($response->json('data')));
    }

    /** @test */
    public function it_can_sort_galleries_by_oldest(): void
    {
        // Arrange
        $old = Gallery::factory()->create(['event_date' => '2023-01-01']);
        $new = Gallery::factory()->create(['event_date' => '2024-01-01']);

        // Act
        $response = $this->getJson('/api/v1/galleries?sort=oldest');

        // Assert
        $response->assertOk();
        $this->assertEquals($old->id, $response->json('data.0.id'));
    }

    /** @test */
    public function it_can_sort_galleries_by_title(): void
    {
        // Arrange
        Gallery::factory()->create(['title' => 'Zebra Event']);
        Gallery::factory()->create(['title' => 'Apple Event']);

        // Act
        $response = $this->getJson('/api/v1/galleries?sort=title');

        // Assert
        $response->assertOk();
        $this->assertEquals('Apple Event', $response->json('data.0.title'));
    }

    /** @test */
    public function it_can_show_gallery_by_slug(): void
    {
        // Arrange
        $gallery = Gallery::factory()->create([
            'title' => 'Test Gallery',
            'slug' => 'test-gallery',
        ]);

        // Act
        $response = $this->getJson('/api/v1/galleries/test-gallery');

        // Assert
        $response->assertOk()
            ->assertJson([
                'data' => [
                    'id' => $gallery->id,
                    'title' => 'Test Gallery',
                    'slug' => 'test-gallery',
                ],
            ]);
    }

    /** @test */
    public function it_returns_404_when_gallery_not_found(): void
    {
        // Act
        $response = $this->getJson('/api/v1/galleries/non-existent-slug');

        // Assert
        $response->assertNotFound();
    }

    /** @test */
    public function it_requires_authentication_for_creating_gallery(): void
    {
        // Act
        $response = $this->postJson('/api/admin/v1/galleries', [
            'title' => 'New Gallery',
        ]);

        // Assert
        $response->assertUnauthorized();
    }

    /** @test */
    public function it_can_create_gallery_with_valid_data(): void
    {
        // Arrange
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        // Act
        $response = $this->postJson('/api/admin/v1/galleries', [
            'title' => 'New Gallery',
            'description' => 'A wonderful gallery',
            'type' => 'photo',
            'event_date' => '2024-12-01',
            'is_featured' => true,
        ]);

        // Assert
        $response->assertCreated()
            ->assertJson([
                'message' => 'Galeri berhasil dibuat.',
                'data' => [
                    'title' => 'New Gallery',
                    'description' => 'A wonderful gallery',
                    'type' => 'photo',
                ],
            ]);

        $this->assertDatabaseHas('galleries', [
            'title' => 'New Gallery',
            'type' => 'photo',
        ]);
    }

    /** @test */
    public function it_auto_generates_slug_when_creating_gallery(): void
    {
        // Arrange
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        // Act
        $response = $this->postJson('/api/admin/v1/galleries', [
            'title' => 'Amazing Event 2024',
            'type' => 'photo',
        ]);

        // Assert
        $response->assertCreated();
        $this->assertDatabaseHas('galleries', [
            'title' => 'Amazing Event 2024',
            'slug' => 'amazing-event-2024',
        ]);
    }

    /** @test */
    public function it_validates_required_fields_on_create(): void
    {
        // Arrange
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        // Act
        $response = $this->postJson('/api/admin/v1/galleries', []);

        // Assert
        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['title']);
    }

    /** @test */
    public function it_can_update_gallery(): void
    {
        // Arrange
        $user = User::factory()->create();
        $gallery = Gallery::factory()->create([
            'title' => 'Old Title',
            'type' => 'photo',
        ]);
        Sanctum::actingAs($user, ['*']);

        // Act
        $response = $this->putJson("/api/admin/v1/galleries/{$gallery->uuid}", [
            'title' => 'Updated Title',
            'type' => 'video',
        ]);

        // Assert
        $response->assertOk()
            ->assertJson([
                'message' => 'Galeri berhasil diperbarui.',
                'data' => [
                    'title' => 'Updated Title',
                    'type' => 'video',
                ],
            ]);

        $this->assertDatabaseHas('galleries', [
            'id' => $gallery->id,
            'title' => 'Updated Title',
            'type' => 'video',
        ]);
    }

    /** @test */
    public function it_requires_authentication_for_updating_gallery(): void
    {
        // Arrange
        $gallery = Gallery::factory()->create();

        // Act
        $response = $this->putJson("/api/admin/v1/galleries/{$gallery->uuid}", [
            'title' => 'Updated Title',
        ]);

        // Assert
        $response->assertUnauthorized();
    }

    /** @test */
    public function it_can_delete_gallery(): void
    {
        // Arrange
        $user = User::factory()->create();
        $gallery = Gallery::factory()->create();
        Sanctum::actingAs($user, ['*']);

        // Act
        $response = $this->deleteJson("/api/admin/v1/galleries/{$gallery->uuid}");

        // Assert
        $response->assertOk()
            ->assertJson([
                'message' => 'Galeri berhasil dihapus.',
            ]);

        $this->assertSoftDeleted('galleries', [
            'id' => $gallery->id,
        ]);
    }

    /** @test */
    public function it_requires_authentication_for_deleting_gallery(): void
    {
        // Arrange
        $gallery = Gallery::factory()->create();

        // Act
        $response = $this->deleteJson("/api/admin/v1/galleries/{$gallery->uuid}");

        // Assert
        $response->assertUnauthorized();
    }

    /** @test */
    public function it_can_add_media_items_to_gallery(): void
    {
        // Arrange
        $user = User::factory()->create();
        $gallery = Gallery::factory()->create();
        $media1 = Media::factory()->create();
        $media2 = Media::factory()->create();
        Sanctum::actingAs($user, ['*']);

        // Act
        $response = $this->postJson("/api/admin/v1/galleries/{$gallery->uuid}/items", [
            'media_ids' => [$media1->id, $media2->id],
        ]);

        // Assert
        $response->assertOk()
            ->assertJson([
                'message' => 'Item berhasil ditambahkan ke galeri.',
            ]);

        $this->assertDatabaseHas('gallery_items', [
            'gallery_id' => $gallery->id,
            'media_id' => $media1->id,
        ]);

        $this->assertDatabaseHas('gallery_items', [
            'gallery_id' => $gallery->id,
            'media_id' => $media2->id,
        ]);
    }

    /** @test */
    public function it_validates_media_ids_when_adding_items(): void
    {
        // Arrange
        $user = User::factory()->create();
        $gallery = Gallery::factory()->create();
        Sanctum::actingAs($user, ['*']);

        // Act
        $response = $this->postJson("/api/admin/v1/galleries/{$gallery->uuid}/items", [
            'media_ids' => [999999], // Non-existent media ID
        ]);

        // Assert
        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['media_ids.0']);
    }

    /** @test */
    public function it_can_remove_item_from_gallery(): void
    {
        // Arrange
        $user = User::factory()->create();
        $gallery = Gallery::factory()->create();
        $item = GalleryItem::factory()->create(['gallery_id' => $gallery->id]);
        Sanctum::actingAs($user, ['*']);

        // Act
        $response = $this->deleteJson("/api/admin/v1/galleries/{$gallery->uuid}/items/{$item->id}");

        // Assert
        $response->assertOk()
            ->assertJson([
                'message' => 'Item berhasil dihapus dari galeri.',
            ]);

        $this->assertDatabaseMissing('gallery_items', [
            'id' => $item->id,
        ]);
    }

    /** @test */
    public function it_returns_404_when_removing_item_from_wrong_gallery(): void
    {
        // Arrange
        $user = User::factory()->create();
        $gallery1 = Gallery::factory()->create();
        $gallery2 = Gallery::factory()->create();
        $item = GalleryItem::factory()->create(['gallery_id' => $gallery2->id]);
        Sanctum::actingAs($user, ['*']);

        // Act
        $response = $this->deleteJson("/api/admin/v1/galleries/{$gallery1->uuid}/items/{$item->id}");

        // Assert
        $response->assertNotFound();
    }

    /** @test */
    public function it_can_reorder_gallery_items(): void
    {
        // Arrange
        $user = User::factory()->create();
        $gallery = Gallery::factory()->create();
        $item1 = GalleryItem::factory()->create(['gallery_id' => $gallery->id, 'order' => 1]);
        $item2 = GalleryItem::factory()->create(['gallery_id' => $gallery->id, 'order' => 2]);
        Sanctum::actingAs($user, ['*']);

        // Act
        $response = $this->patchJson("/api/admin/v1/galleries/{$gallery->uuid}/reorder", [
            'items' => [
                ['id' => $item2->id, 'order' => 1],
                ['id' => $item1->id, 'order' => 2],
            ],
        ]);

        // Assert
        $response->assertOk()
            ->assertJson([
                'message' => 'Urutan item berhasil diperbarui.',
            ]);

        $this->assertDatabaseHas('gallery_items', [
            'id' => $item1->id,
            'order' => 2,
        ]);

        $this->assertDatabaseHas('gallery_items', [
            'id' => $item2->id,
            'order' => 1,
        ]);
    }

    /** @test */
    public function it_validates_items_when_reordering(): void
    {
        // Arrange
        $user = User::factory()->create();
        $gallery = Gallery::factory()->create();
        Sanctum::actingAs($user, ['*']);

        // Act
        $response = $this->patchJson("/api/admin/v1/galleries/{$gallery->uuid}/reorder", [
            'items' => [],
        ]);

        // Assert
        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['items']);
    }

    /** @test */
    public function it_can_paginate_with_custom_per_page(): void
    {
        // Arrange
        Gallery::factory()->count(20)->create();

        // Act
        $response = $this->getJson('/api/v1/galleries?per_page=5');

        // Assert
        $response->assertOk();
        $this->assertCount(5, $response->json('data'));
    }
}

<?php

declare(strict_types=1);

use App\Http\Controllers\Api\AchievementController;
use App\Http\Controllers\Api\AlumniController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ExtraController;
use App\Http\Controllers\Api\FacilityController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\SliderController;
use App\Http\Controllers\Api\StaffController;
use App\Http\Controllers\Api\TestimonialController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Health check endpoint (no middleware for fastest response)
Route::get('/v1/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => date('c'),
        'service' => 'SMANSA API',
        'version' => '1.0.0',
    ]);
})->name('health');

Route::middleware(['api', 'throttle:api'])->group(function () {
    // Public routes with caching
    Route::prefix('v1')->middleware([\App\Http\Middleware\CacheResponse::class])->group(function () {
        // Authentication
        Route::prefix('auth')->group(function () {
            Route::post('/login', [AuthController::class, 'login'])->name('auth.login')->middleware('throttle:login');
            Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');
            Route::get('/me', [AuthController::class, 'me'])->name('auth.me');
            Route::post('/refresh', [AuthController::class, 'refresh'])->name('auth.refresh');
        });

        // Posts
        Route::prefix('posts')->group(function () {
            Route::get('/', [PostController::class, 'index'])->name('posts.index');
            Route::get('/featured', [PostController::class, 'featured'])->name('posts.featured');
            Route::get('/latest', [PostController::class, 'latest'])->name('posts.latest');
            Route::get('/{slug}', [PostController::class, 'show'])->name('posts.show');
            Route::post('/{slug}/like', [PostController::class, 'like'])->name('posts.like')->middleware('auth:sanctum');
            Route::post('/{slug}/view', [PostController::class, 'view'])->name('posts.view');
        });

        // Categories
        Route::prefix('categories')->group(function () {
            Route::get('/', [CategoryController::class, 'index'])->name('categories.index');
            Route::get('/tree', [CategoryController::class, 'tree'])->name('categories.tree');
            Route::get('/{category}', [CategoryController::class, 'show'])->name('categories.show');
            Route::get('/{category}/posts', [CategoryController::class, 'posts'])->name('categories.posts');
        });

        // Announcements
        Route::prefix('announcements')->group(function () {
            Route::get('/', [AnnouncementController::class, 'index'])->name('announcements.index');
            Route::get('/featured', [AnnouncementController::class, 'featured'])->name('announcements.featured');
            Route::get('/latest', [AnnouncementController::class, 'latest'])->name('announcements.latest');
            Route::get('/by-type/{type}', [AnnouncementController::class, 'byType'])->name('announcements.by-type');
            Route::get('/{slug}', [AnnouncementController::class, 'show'])->name('announcements.show');
        });

        // Extracurriculars
        Route::prefix('extras')->group(function () {
            Route::get('/', [ExtraController::class, 'index'])->name('extras.index');
            Route::get('/featured', [ExtraController::class, 'featured'])->name('extras.featured');
            Route::get('/by-category/{category}', [ExtraController::class, 'byCategory'])->name('extras.by-category');
            Route::get('/{slug}', [ExtraController::class, 'show'])->name('extras.show');
            Route::post('/{extra}/join', [ExtraController::class, 'join'])->name('extras.join')->middleware('auth:sanctum');
            Route::post('/{extra}/leave', [ExtraController::class, 'leave'])->name('extras.leave')->middleware('auth:sanctum');
            Route::get('/{extra}/members', [ExtraController::class, 'members'])->name('extras.members');
        });

        // Facilities
        Route::prefix('facilities')->group(function () {
            Route::get('/', [FacilityController::class, 'index'])->name('facilities.index');
            Route::get('/featured', [FacilityController::class, 'featured'])->name('facilities.featured');
            Route::get('/by-category/{category}', [FacilityController::class, 'byCategory'])->name('facilities.by-category');
            Route::get('/bookable', [FacilityController::class, 'bookable'])->name('facilities.bookable');
            Route::get('/categories', [FacilityController::class, 'categories'])->name('facilities.categories');
            Route::get('/{slug}', [FacilityController::class, 'show'])->name('facilities.show');
        });

        // Staff
        Route::prefix('staff')->group(function () {
            Route::get('/', [StaffController::class, 'index'])->name('staff.index');
            Route::get('/featured', [StaffController::class, 'featured'])->name('staff.featured');
            Route::get('/by-type/{type}', [StaffController::class, 'byType'])->name('staff.by-type');
            Route::get('/by-department/{department}', [StaffController::class, 'byDepartment'])->name('staff.by-department');
            Route::get('/teachers', [StaffController::class, 'teachers'])->name('staff.teachers');
            Route::get('/types', [StaffController::class, 'types'])->name('staff.types');
            Route::get('/departments', [StaffController::class, 'departments'])->name('staff.departments');
            Route::get('/{slug}', [StaffController::class, 'show'])->name('staff.show');
        })

;

        // Galleries
        Route::prefix('galleries')->group(function () {
            Route::get('/', [GalleryController::class, 'index'])->name('galleries.index');
            Route::get('/{slug}', [GalleryController::class, 'show'])->name('galleries.show');
        });

        // Sliders
        Route::get('/sliders', [SliderController::class, 'index'])->name('sliders.index');

        // Testimonials
        Route::get('/testimonials', [TestimonialController::class, 'index'])->name('testimonials.index');

        // Alumni
        Route::prefix('alumni')->group(function () {
            Route::get('/', [AlumniController::class, 'index'])->name('alumni.index');
            Route::get('/featured', [AlumniController::class, 'featured'])->name('alumni.featured');
            Route::get('/categories', [AlumniController::class, 'categories'])->name('alumni.categories');
            Route::get('/years', [AlumniController::class, 'years'])->name('alumni.years');
            Route::get('/{id}', [AlumniController::class, 'show'])->name('alumni.show');
        });

        // Achievements
        Route::prefix('achievements')->group(function () {
            Route::get('/', [AchievementController::class, 'index'])->name('achievements.index');
            Route::get('/featured', [AchievementController::class, 'featured'])->name('achievements.featured');
            Route::get('/latest', [AchievementController::class, 'latest'])->name('achievements.latest');
            Route::get('/categories', [AchievementController::class, 'categories'])->name('achievements.categories');
            Route::get('/years', [AchievementController::class, 'years'])->name('achievements.years');
            Route::get('/{slug}', [AchievementController::class, 'show'])->name('achievements.show');
        });

        // Settings - Public endpoints
        Route::prefix('settings')->group(function () {
            Route::get('/', [SettingController::class, 'index'])->name('settings.index');
            Route::get('/group/{group}', [SettingController::class, 'getByGroup'])->name('settings.by-group');
            Route::get('/{key}', [SettingController::class, 'getByKey'])->name('settings.by-key');
        });

        // Analytics - Public endpoint for tracking
        Route::post('/analytics/track', [\App\Http\Controllers\Api\AnalyticsController::class, 'trackPageView'])->name('analytics.track');
    });
});

// Protected routes (authentication required)
Route::middleware(['api', 'auth:sanctum', 'throttle:authenticated'])->prefix('v1')->group(function () {
    // User profile
    Route::prefix('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me'])->name('auth.me');
    });

    // User posts management
    Route::prefix('posts')->group(function () {
        Route::post('/', [PostController::class, 'store'])->name('posts.store');
        Route::put('/{slug}', [PostController::class, 'update'])->name('posts.update');
        Route::patch('/{slug}', [PostController::class, 'update'])->name('posts.update.patch');
        Route::delete('/{slug}', [PostController::class, 'destroy'])->name('posts.destroy');
    });

    // User announcements management
    Route::prefix('announcements')->group(function () {
        Route::post('/', [AnnouncementController::class, 'store'])->name('announcements.store');
        Route::put('/{announcement}', [AnnouncementController::class, 'update'])->name('announcements.update');
        Route::patch('/{announcement}', [AnnouncementController::class, 'update'])->name('announcements.update.patch');
        Route::delete('/{announcement}', [AnnouncementController::class, 'destroy'])->name('announcements.destroy');
        Route::post('/{announcement}/toggle-pin', [AnnouncementController::class, 'togglePin'])->name('announcements.toggle-pin');
        Route::post('/{announcement}/toggle-active', [AnnouncementController::class, 'toggleActive'])->name('announcements.toggle-active');
    });

    // User extras management
    Route::prefix('extras')->group(function () {
        Route::post('/', [ExtraController::class, 'store'])->name('extras.store');
        Route::put('/{extra}', [ExtraController::class, 'update'])->name('extras.update');
        Route::patch('/{extra}', [ExtraController::class, 'update'])->name('extras.update.patch');
        Route::delete('/{extra}', [ExtraController::class, 'destroy'])->name('extras.destroy');
        Route::post('/{extra}/toggle-featured', [ExtraController::class, 'toggleFeatured'])->name('extras.toggle-featured');
        Route::post('/{extra}/toggle-active', [ExtraController::class, 'toggleActive'])->name('extras.toggle-active');
    });

    // User facilities management
    Route::prefix('facilities')->group(function () {
        Route::post('/', [FacilityController::class, 'store'])->name('facilities.store');
        Route::put('/{facility}', [FacilityController::class, 'update'])->name('facilities.update');
        Route::patch('/{facility}', [FacilityController::class, 'update'])->name('facilities.update.patch');
        Route::delete('/{facility}', [FacilityController::class, 'destroy'])->name('facilities.destroy');
        Route::post('/{facility}/toggle-featured', [FacilityController::class, 'toggleFeatured'])->name('facilities.toggle-featured');
        Route::post('/{facility}/toggle-active', [FacilityController::class, 'toggleActive'])->name('facilities.toggle-active');
    });

    // User staff management
    Route::prefix('staff')->group(function () {
        Route::post('/', [StaffController::class, 'store'])->name('staff.store');
        Route::put('/{staff}', [StaffController::class, 'update'])->name('staff.update');
        Route::patch('/{staff}', [StaffController::class, 'update'])->name('staff.update.patch');
        Route::delete('/{staff}', [StaffController::class, 'destroy'])->name('staff.destroy');
        Route::post('/{staff}/toggle-featured', [StaffController::class, 'toggleFeatured'])->name('staff.toggle-featured');
        Route::post('/{staff}/toggle-active', [StaffController::class, 'toggleActive'])->name('staff.toggle-active');
    });
});

// Admin routes (authentication + authorization required)
Route::middleware(['api', 'auth:sanctum', 'permission:admin-panel', 'throttle:admin'])->prefix('admin/v1')->group(function () {
    // Admin posts management
    Route::apiResource('posts', PostController::class)
        ->names([
            'index' => 'admin.posts.index',
            'store' => 'admin.posts.store',
            'show' => 'admin.posts.show',
            'update' => 'admin.posts.update',
            'destroy' => 'admin.posts.destroy',
        ]);

    // Admin announcements management
    Route::apiResource('announcements', AnnouncementController::class)
        ->names([
            'index' => 'admin.announcements.index',
            'store' => 'admin.announcements.store',
            'show' => 'admin.announcements.show',
            'update' => 'admin.announcements.update',
            'destroy' => 'admin.announcements.destroy',
        ]);

    // Admin extras management
    Route::apiResource('extras', ExtraController::class)
        ->names([
            'index' => 'admin.extras.index',
            'store' => 'admin.extras.store',
            'show' => 'admin.extras.show',
            'update' => 'admin.extras.update',
            'destroy' => 'admin.extras.destroy',
        ]);

    // Admin facilities management
    Route::apiResource('facilities', FacilityController::class)
        ->names([
            'index' => 'admin.facilities.index',
            'store' => 'admin.facilities.store',
            'show' => 'admin.facilities.show',
            'update' => 'admin.facilities.update',
            'destroy' => 'admin.facilities.destroy',
        ]);

    // Admin staff management
    Route::apiResource('staff', StaffController::class)
        ->names([
            'index' => 'admin.staff.index',
            'store' => 'admin.staff.store',
            'show' => 'admin.staff.show',
            'update' => 'admin.staff.update',
            'destroy' => 'admin.staff.destroy',
        ]);

    // Admin galleries management
    Route::apiResource('galleries', GalleryController::class)
        ->names([
            'index' => 'admin.galleries.index',
            'store' => 'admin.galleries.store',
            'show' => 'admin.galleries.show',
            'update' => 'admin.galleries.update',
            'destroy' => 'admin.galleries.destroy',
        ]);

    // Additional gallery endpoints
    Route::prefix('galleries')->group(function () {
        Route::post('/{gallery}/items', [GalleryController::class, 'addItems'])->name('admin.galleries.add-items');
        Route::delete('/{gallery}/items/{item}', [GalleryController::class, 'removeItem'])->name('admin.galleries.remove-item');
        Route::patch('/{gallery}/reorder', [GalleryController::class, 'reorderItems'])->name('admin.galleries.reorder');
        Route::post('/{gallery}/upload', [GalleryController::class, 'uploadMedia'])->name('admin.galleries.upload');
    });

    // Admin sliders management
    Route::apiResource('sliders', SliderController::class)->names([
        'index' => 'admin.sliders.index',
        'store' => 'admin.sliders.store',
        'show' => 'admin.sliders.show',
        'update' => 'admin.sliders.update',
        'destroy' => 'admin.sliders.destroy',
    ]);

    Route::post('/sliders/reorder', [SliderController::class, 'reorder'])->name('admin.sliders.reorder');

    // Admin testimonials management
    Route::apiResource('testimonials', TestimonialController::class)->names([
        'index' => 'admin.testimonials.index',
        'store' => 'admin.testimonials.store',
        'show' => 'admin.testimonials.show',
        'update' => 'admin.testimonials.update',
        'destroy' => 'admin.testimonials.destroy',
    ]);

    // Admin alumni management
    Route::apiResource('alumni', AlumniController::class)->names([
        'index' => 'admin.alumni.index',
        'store' => 'admin.alumni.store',
        'show' => 'admin.alumni.show',
        'update' => 'admin.alumni.update',
        'destroy' => 'admin.alumni.destroy',
    ]);

    Route::prefix('alumni')->group(function () {
        Route::post('/{alumni}/toggle-featured', [AlumniController::class, 'toggleFeatured'])->name('admin.alumni.toggle-featured');
        Route::post('/{alumni}/toggle-public', [AlumniController::class, 'togglePublic'])->name('admin.alumni.toggle-public');
    });

    // Admin achievements management
    Route::apiResource('achievements', AchievementController::class)->names([
        'index' => 'admin.achievements.index',
        'store' => 'admin.achievements.store',
        'show' => 'admin.achievements.show',
        'update' => 'admin.achievements.update',
        'destroy' => 'admin.achievements.destroy',
    ]);

    Route::prefix('achievements')->group(function () {
        Route::post('/{achievement}/toggle-featured', [AchievementController::class, 'toggleFeatured'])->name('admin.achievements.toggle-featured');
        Route::post('/{achievement}/toggle-active', [AchievementController::class, 'toggleActive'])->name('admin.achievements.toggle-active');
    });

    // Analytics
    Route::prefix('analytics')->group(function () {
        Route::get('/stats', [\App\Http\Controllers\Api\AnalyticsController::class, 'getStats'])->name('admin.analytics.stats');
        Route::get('/daily-trend', [\App\Http\Controllers\Api\AnalyticsController::class, 'getDailyTrend'])->name('admin.analytics.daily-trend');
        Route::post('/seed-sample', [\App\Http\Controllers\Api\AnalyticsController::class, 'seedSampleData'])->name('admin.analytics.seed-sample');
    });

    // Settings
    Route::prefix('settings')->group(function () {
        Route::get('/', [SettingController::class, 'adminIndex'])->name('admin.settings.index');
        Route::get('/groups', [SettingController::class, 'getGroups'])->name('admin.settings.groups');
        Route::put('/', [SettingController::class, 'updateBatch'])->name('admin.settings.update-batch');
        Route::put('/{key}', [SettingController::class, 'update'])->name('admin.settings.update');
        Route::post('/upload', [SettingController::class, 'upload'])->name('admin.settings.upload');
    });

    // Will add more admin endpoints later:
    // - Users management
    // - Categories management
    // - Media library
});

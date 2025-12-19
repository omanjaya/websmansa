<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            CategorySeeder::class,
            UserSeeder::class,
            AdminUserSeeder::class,
            SettingsSeeder::class,
            PostSeeder::class,
            ExtraSeeder::class,
            StaffSeeder::class,
            FacilitySeeder::class,
            AlumniSeeder::class,
            AchievementSeeder::class,
            GallerySeeder::class,
        ]);
    }
}

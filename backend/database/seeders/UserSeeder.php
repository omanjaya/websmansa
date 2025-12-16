<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::factory()->create([
            'name' => 'Admin SMANSA',
            'email' => 'admin@smansa.sch.id',
            'bio' => 'Administrator SMA Negeri 1 Denpasar',
        ]);

        // Create sample users
        User::factory(5)->create();
    }
}

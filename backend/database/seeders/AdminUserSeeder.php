<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // Check if admin already exists
        $existingAdmin = User::where('email', 'admin@smansa.sch.id')->first();

        if ($existingAdmin) {
            $this->command->info('Admin user already exists, skipping...');
            return;
        }

        // Create super admin user
        $admin = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@smansa.sch.id',
            'password' => Hash::make('SmansaDps2024!'),
            'email_verified_at' => now(),
        ]);

        $this->command->info('Admin user created successfully!');
        $this->command->info('Email: admin@smansa.sch.id');
        $this->command->info('Password: SmansaDps2024!');
    }
}

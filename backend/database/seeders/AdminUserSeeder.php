<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // Create super admin user
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@smansa.sch.id',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        $this->command->info('✅ Admin user created successfully!');
        $this->command->info('📧 Email: admin@smansa.sch.id');
        $this->command->info('🔑 Password: password');
    }
}

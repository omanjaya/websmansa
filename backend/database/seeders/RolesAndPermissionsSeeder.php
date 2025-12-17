<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions (if not exists)
        $permissions = ['admin-panel', 'manage-posts', 'manage-users', 'manage-settings'];
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create admin role (if not exists)
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->syncPermissions(Permission::all());

        // Create editor role (if not exists)
        $editorRole = Role::firstOrCreate(['name' => 'editor']);
        $editorRole->syncPermissions(['admin-panel', 'manage-posts']);

        // Assign admin role to admin user
        $adminUser = User::where('email', 'admin@smansa.sch.id')->first();
        if ($adminUser && !$adminUser->hasRole('admin')) {
            $adminUser->assignRole('admin');
            $this->command->info('Admin role assigned to: ' . $adminUser->email);
        }

        $this->command->info('Roles and permissions seeded successfully!');
    }
}

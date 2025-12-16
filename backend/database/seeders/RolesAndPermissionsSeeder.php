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

        // Create permissions
        Permission::create(['name' => 'admin-panel']);
        Permission::create(['name' => 'manage-posts']);
        Permission::create(['name' => 'manage-users']);
        Permission::create(['name' => 'manage-settings']);

        // Create roles and assign permissions
        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());

        $editorRole = Role::create(['name' => 'editor']);
        $editorRole->givePermissionTo(['admin-panel', 'manage-posts']);

        // Assign admin role to first user (admin user)
        $adminUser = User::where('email', 'admin@smansa.sch.id')->first();
        if ($adminUser) {
            $adminUser->assignRole('admin');
            $this->command->info('✅ Admin role assigned to: ' . $adminUser->email);
        }

        $this->command->info('✅ Roles and permissions seeded successfully!');
    }
}

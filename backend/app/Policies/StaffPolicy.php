<?php

namespace App\Policies;

use App\Models\Staff;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class StaffPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(?User $user): bool
    {
        return true; // Public access untuk view
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(?User $user, Staff $staff): bool
    {
        return true; // Staff data is public
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create-staff') || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Staff $staff): bool
    {
        return $user->hasPermissionTo('update-staff') || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Staff $staff): bool
    {
        return $user->hasPermissionTo('delete-staff') || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Staff $staff): bool
    {
        return $user->hasRole('admin');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Staff $staff): bool
    {
        return $user->hasRole('admin');
    }
}

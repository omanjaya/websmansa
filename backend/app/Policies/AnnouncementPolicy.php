<?php

namespace App\Policies;

use App\Models\Announcement;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class AnnouncementPolicy
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
    public function view(?User $user, Announcement $announcement): bool
    {
        // Published announcements dapat dilihat semua orang
        if ($announcement->status === 'published') {
            return true;
        }

        // Draft/archived hanya bisa dilihat owner atau admin
        return $user && ($user->id === $announcement->user_id || $user->hasRole('admin'));
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create-announcements') || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Announcement $announcement): bool
    {
        return $user->id === $announcement->user_id || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Announcement $announcement): bool
    {
        return $user->id === $announcement->user_id || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Announcement $announcement): bool
    {
        return $user->hasRole('admin');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Announcement $announcement): bool
    {
        return $user->hasRole('admin');
    }
}

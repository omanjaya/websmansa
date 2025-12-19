<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Gallery;
use App\Models\User;

final class GalleryPolicy
{
    /**
     * Determine if the user can view any galleries.
     */
    public function viewAny(?User $user): bool
    {
        return true; // Galleries are public
    }

    /**
     * Determine if the user can view the gallery.
     */
    public function view(?User $user, Gallery $gallery): bool
    {
        return true; // All galleries are public
    }

    /**
     * Determine if the user can create galleries.
     */
    public function create(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'super admin']);
    }

    /**
     * Determine if the user can update the gallery.
     */
    public function update(User $user, Gallery $gallery): bool
    {
        return $user->hasAnyRole(['admin', 'super admin']);
    }

    /**
     * Determine if the user can delete the gallery.
     */
    public function delete(User $user, Gallery $gallery): bool
    {
        return $user->hasAnyRole(['admin', 'super admin']);
    }

    /**
     * Determine if the user can restore the gallery.
     */
    public function restore(User $user, Gallery $gallery): bool
    {
        return $user->hasAnyRole(['admin', 'super admin']);
    }

    /**
     * Determine if the user can permanently delete the gallery.
     */
    public function forceDelete(User $user, Gallery $gallery): bool
    {
        return $user->hasAnyRole(['admin', 'super admin']);
    }
}

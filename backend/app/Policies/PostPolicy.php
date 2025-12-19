<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Post;
use App\Models\User;

final class PostPolicy
{
    /**
     * Determine if the user can view any posts.
     */
    public function viewAny(User $user): bool
    {
        return true; // All authenticated users can view posts list
    }

    /**
     * Determine if the user can view the post.
     */
    public function view(?User $user, Post $post): bool
    {
        // Published posts are public
        if ($post->isPublished()) {
            return true;
        }

        // Draft posts can only be viewed by the author
        return $user && $post->user_id === $user->id;
    }

    /**
     * Determine if the user can create posts.
     */
    public function create(User $user): bool
    {
        // Hanya user dengan permission atau admin
        return $user->hasPermissionTo('add post') || $user->hasAnyRole(['admin', 'super admin']);
    }

    /**
     * Determine if the user can update the post.
     */
    public function update(User $user, Post $post): bool
    {
        // Owner atau admin dapat update
        return $user->id === $post->user_id || $user->hasAnyRole(['admin', 'super admin']);
    }

    /**
     * Determine if the user can delete the post.
     */
    public function delete(User $user, Post $post): bool
    {
        // Owner atau admin dapat delete
        return $user->id === $post->user_id || $user->hasAnyRole(['admin', 'super admin']);
    }

    /**
     * Determine if the user can restore the post.
     */
    public function restore(User $user, Post $post): bool
    {
        return $user->hasAnyRole(['admin', 'super admin']);
    }

    /**
     * Determine if the user can permanently delete the post.
     */
    public function forceDelete(User $user, Post $post): bool
    {
        return $user->hasAnyRole(['admin', 'super admin']);
    }
}

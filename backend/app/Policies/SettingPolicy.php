<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Setting;
use App\Models\User;

class SettingPolicy
{
    /**
     * Determine whether the user can manage settings.
     */
    public function manageSettings(User $user): bool
    {
        return $user->hasPermissionTo('manage-settings') || $user->hasRole('admin');
    }
}

<?php

namespace App\Policies;

use App\Models\{Testimonial, User};

class TestimonialPolicy
{
    public function viewAny(?User $user): bool { return true; }
    public function create(User $user): bool { return $user->hasRole('admin'); }
    public function update(User $user, Testimonial $testimonial): bool { return $user->hasRole('admin'); }
    public function delete(User $user, Testimonial $testimonial): bool { return $user->hasRole('admin'); }
}

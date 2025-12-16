<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactSubmission extends Model
{
    const UPDATED_AT = null;
    protected $fillable = ['name', 'email', 'phone', 'subject', 'message', 'ip_address', 'user_agent', 'status', 'replied_at'];
    protected $casts = ['replied_at' => 'datetime'];
    
    public function scopeNew($query) { return $query->where('status', 'new'); }
    public function scopeLatest($query) { return $query->latest('created_at'); }
}

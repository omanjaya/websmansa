<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class ValidateMimeType implements Rule
{
    public function passes($attribute, $value): bool
    {
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $actualMime = $finfo->file($value->getRealPath());

        $allowedMimes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'video/mp4',
        ];

        return in_array($actualMime, $allowedMimes);
    }

    public function message(): string
    {
        return 'File type tidak valid atau file terdeteksi berbahaya.';
    }
}

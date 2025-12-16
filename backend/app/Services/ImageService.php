<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;

final class ImageService
{
    private const MAX_SIZE = 2048; // 2MB

    private const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];

    public function uploadBase64(string $base64Image, string $directory = 'uploads'): string
    {
        // Extract image data
        if (! str_starts_with($base64Image, 'data:image')) {
            throw new \InvalidArgumentException('Invalid base64 image format');
        }

        $imageParts = explode(';', $base64Image);
        $imageTypeAux = explode(':', $imageParts[0]);
        $imageType = $imageTypeAux[1];
        $imageBase64 = base_decode(explode(',', $imageParts[1])[1]);

        // Validate image type
        if (! in_array($imageType, self::ALLOWED_MIME)) {
            throw new \InvalidArgumentException('Unsupported image type: '.$imageType);
        }

        // Create Intervention Image
        $image = Image::make($imageBase64);

        // Validate size
        if ($image->filesize() > self::MAX_SIZE * 1024) {
            throw new \InvalidArgumentException('Image size exceeds maximum limit');
        }

        // Generate filename
        $filename = Str::random(40).'.'.str_replace('image/', '', $imageType);
        $path = "{$directory}/{$filename}";

        // Store image
        $this->storeImage($image, $path);

        return $filename;
    }

    public function upload($uploadedFile, string $directory = 'uploads'): string
    {
        // Validate
        if (! $uploadedFile->isValid()) {
            throw new \InvalidArgumentException('Invalid uploaded file');
        }

        $mimeType = $uploadedFile->getMimeType();
        if (! in_array($mimeType, self::ALLOWED_MIME)) {
            throw new \InvalidArgumentException('Unsupported image type: '.$mimeType);
        }

        // Create Intervention Image
        $image = Image::make($uploadedFile->getRealPath());

        // Optimize image
        $image = $this->optimizeImage($image);

        // Generate filename
        $filename = Str::uuid().'.'.$uploadedFile->getClientOriginalExtension();
        $path = "{$directory}/{$filename}";

        // Store image
        $this->storeImage($image, $path);

        return $filename;
    }

    public function delete(string $path): bool
    {
        if (Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->delete($path);
        }

        return false;
    }

    public function createThumbnail(string $path, int $width = 300, int $height = 200): string
    {
        $image = Image::make(storage_path("app/public/{$path}"));

        $thumbnail = $image->fit($width, $height, function ($constraint) {
            $constraint->upsize();
        });

        $thumbnailPath = str_replace('.', "_thumb.{$width}x{$height}.", $path);

        $this->storeImage($thumbnail, $thumbnailPath);

        return $thumbnailPath;
    }

    private function optimizeImage($image)
    {
        // Resize if too large
        if ($image->width() > 1920 || $image->height() > 1080) {
            $image->resize(1920, 1080, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });
        }

        // Optimize quality
        $image->encode('jpg', 85);

        return $image;
    }

    private function storeImage($image, string $path): void
    {
        Storage::disk('public')->put($path, $image->encode());
    }
}

<?php

declare(strict_types=1);

namespace App\Traits;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

trait HasUuid
{
    public static function bootHasUuid(): void
    {
        static::creating(function (Model $model) {
            if (empty($model->{$model->getUuidKeyName()})) {
                $model->{$model->getUuidKeyName()} = (string) Str::uuid();
            }
        });
    }

    public function getUuidKeyName(): string
    {
        return 'uuid';
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public function resolveRouteBinding($value, $field = null)
    {
        return $this->where($this->getUuidKeyName(), $value)->firstOrFail();
    }
}

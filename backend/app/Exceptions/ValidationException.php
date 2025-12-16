<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

final class ValidationException extends Exception
{
    /**
     * @var array<string, mixed>
     */
    private array $errors;

    /**
     * @param  array<string, mixed>  $errors
     */
    public function __construct(string $message, array $errors = [], int $code = 422)
    {
        parent::__construct($message, $code);
        $this->errors = $errors;
    }

    /**
     * @return array<string, mixed>
     */
    public function getErrors(): array
    {
        return $this->errors;
    }

    public function render(): JsonResponse
    {
        return response()->json([
            'message' => $this->getMessage(),
            'errors' => $this->errors,
        ], $this->getCode());
    }
}

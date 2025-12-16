<?php

declare(strict_types=1);

namespace App\Http\Requests\Api\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

final class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string', Password::defaults()],
            'remember' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * Get custom error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'password.required' => 'Password wajib diisi',
            'password.min' => 'Password minimal harus :min karakter',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'email' => 'Email',
            'password' => 'Password',
        ];
    }

    /**
     * Authenticate the user with the request credentials.
     */
    public function authenticate(): void
    {
        if (! $this->hasValidCredentials()) {
            abort(response()->json([
                'message' => 'Email atau password salah',
                'errors' => [
                    'email' => ['Kredensial tidak valid'],
                    'password' => ['Kredensial tidak valid'],
                ],
            ], 422));
        }
    }

    /**
     * Check if the request has valid credentials.
     */
    private function hasValidCredentials(): bool
    {
        return auth()->attempt([
            'email' => $this->string('email'),
            'password' => $this->string('password'),
        ], $this->boolean('remember', false));
    }
}

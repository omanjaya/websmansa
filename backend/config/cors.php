<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'storage/*'],

    'allowed_methods' => explode(',', env('CORS_ALLOW_METHODS', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')),

    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:3000'),
        'http://localhost:3000',
        'http://localhost:8000',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => explode(',', env('CORS_ALLOW_HEADERS', 'Content-Type,Authorization,X-Requested-With,Accept,Origin,Access-Control-Request-Method,Access-Control-Request-Headers,X-XSRF-TOKEN')),

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => env('CORS_ALLOW_CREDENTIALS', false),

    /*
    |--------------------------------------------------------------------------
    | Production Origins
    |--------------------------------------------------------------------------
    |
    | In production, you'll want to explicitly set the allowed origins
    | for better security.
    |
    */
    'production_origins' => [
        'https://smansa.id',
        'https://www.smansa.id',
        'https://api.smansa.id',
    ],

];

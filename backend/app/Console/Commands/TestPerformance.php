<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\Staff;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class TestPerformance extends Command
{
    protected $signature = 'test:performance {--endpoint=staff : The endpoint to test}';
    protected $description = 'Test API performance including query count and response time';

    public function handle(): int
    {
        $this->info('🚀 Starting Performance Test...');
        $this->newLine();

        // Test 1: Database Query Count
        $this->testQueryCount();

        // Test 2: API Response Time
        $this->testApiResponseTime();

        // Test 3: Cache Headers
        $this->testCacheHeaders();

        $this->newLine();
        $this->info('✅ Performance test completed!');

        return Command::SUCCESS;
    }

    private function testQueryCount(): void
    {
        $this->info('📊 Test 1: Database Query Count');
        $this->line('─────────────────────────────────');

        // Test Staff queries with eager loading
        DB::enableQueryLog();

        $staff = Staff::with(['media'])->active()->limit(10)->get();
        foreach ($staff as $s) {
            $s->getPhotoUrl(); // This should NOT trigger additional queries
        }

        $queries = DB::getQueryLog();
        $queryCount = count($queries);

        DB::disableQueryLog();

        if ($queryCount <= 3) {
            $this->info("  ✓ Query count: {$queryCount} (Optimal - using eager loading)");
        } else {
            $this->warn("  ⚠ Query count: {$queryCount} (Potential N+1 issue)");
        }

        $this->newLine();
        $this->line('  Queries executed:');
        foreach (array_slice($queries, 0, 5) as $i => $query) {
            $this->line("    " . ($i + 1) . ". " . substr($query['query'], 0, 80) . '...');
        }
        if (count($queries) > 5) {
            $this->line("    ... and " . (count($queries) - 5) . " more queries");
        }

        $this->newLine();
    }

    private function testApiResponseTime(): void
    {
        $this->info('⏱️  Test 2: API Response Time');
        $this->line('─────────────────────────────────');

        $endpoint = $this->option('endpoint');
        $url = config('app.url') . "/api/v1/{$endpoint}";

        $times = [];
        $iterations = 5;

        $this->line("  Testing endpoint: {$url}");
        $this->line("  Iterations: {$iterations}");
        $this->newLine();

        for ($i = 0; $i < $iterations; $i++) {
            $start = microtime(true);

            try {
                $response = Http::timeout(30)->get($url);
                $end = microtime(true);
                $time = round(($end - $start) * 1000, 2);
                $times[] = $time;

                $status = $response->successful() ? '✓' : '✗';
                $this->line("    Request " . ($i + 1) . ": {$status} {$time}ms (Status: {$response->status()})");
            } catch (\Exception $e) {
                $this->error("    Request " . ($i + 1) . ": Failed - " . $e->getMessage());
            }
        }

        if (!empty($times)) {
            $avg = round(array_sum($times) / count($times), 2);
            $min = round(min($times), 2);
            $max = round(max($times), 2);

            $this->newLine();
            $this->line("  Results:");
            $this->line("    Min: {$min}ms");
            $this->line("    Max: {$max}ms");
            $this->line("    Avg: {$avg}ms");

            if ($avg < 200) {
                $this->info("  ✓ Average response time is good (<200ms)");
            } elseif ($avg < 500) {
                $this->warn("  ⚠ Average response time is acceptable (<500ms)");
            } else {
                $this->error("  ✗ Average response time is slow (>500ms)");
            }
        }

        $this->newLine();
    }

    private function testCacheHeaders(): void
    {
        $this->info('📦 Test 3: Cache Headers');
        $this->line('─────────────────────────────────');

        $endpoint = $this->option('endpoint');
        $url = config('app.url') . "/api/v1/{$endpoint}";

        try {
            $response = Http::get($url);
            $headers = $response->headers();

            $cacheControl = $headers['Cache-Control'][0] ?? 'Not set';
            $etag = $headers['ETag'][0] ?? 'Not set';
            $vary = $headers['Vary'][0] ?? 'Not set';

            $this->line("  Cache-Control: {$cacheControl}");
            $this->line("  ETag: {$etag}");
            $this->line("  Vary: {$vary}");

            if (str_contains($cacheControl, 'public')) {
                $this->info("  ✓ Response is cached (public)");
            } elseif (str_contains($cacheControl, 'no-cache')) {
                $this->warn("  ⚠ Response is not cached");
            }

            // Test conditional request with ETag
            if ($etag !== 'Not set') {
                $conditionalResponse = Http::withHeaders([
                    'If-None-Match' => $etag,
                ])->get($url);

                if ($conditionalResponse->status() === 304) {
                    $this->info("  ✓ ETag conditional request works (304 Not Modified)");
                } else {
                    $this->line("  ℹ ETag conditional request returned: " . $conditionalResponse->status());
                }
            }

        } catch (\Exception $e) {
            $this->error("  Failed to test cache headers: " . $e->getMessage());
        }

        $this->newLine();
    }
}

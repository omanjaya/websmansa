<?php

namespace App\Console\Commands;

use App\Models\Post;
use Illuminate\Console\Command;

class ReimportPostImages extends Command
{
    protected $signature = 'posts:reimport-images {--dry-run : Show what would be done without actually doing it}';
    protected $description = 'Re-import post featured images through Media Library for proper optimization';

    public function handle()
    {
        $isDryRun = $this->option('dry-run');
        $storagePath = storage_path('app/public');

        $posts = Post::whereNotNull('featured_image')->get();

        $this->info("Found {$posts->count()} posts with featured images");

        $processed = 0;
        $skipped = 0;
        $errors = 0;

        $bar = $this->output->createProgressBar($posts->count());
        $bar->start();

        foreach ($posts as $post) {
            $imageFilename = $post->featured_image;
            $imagePath = $storagePath . '/' . $imageFilename;

            if (!file_exists($imagePath)) {
                $this->newLine();
                $this->warn("File not found: {$imageFilename}");
                $skipped++;
                $bar->advance();
                continue;
            }

            if ($isDryRun) {
                $this->newLine();
                $this->line("Would process: {$post->title} - {$imageFilename}");
                $bar->advance();
                continue;
            }

            try {
                // Clear existing media
                $post->clearMediaCollection('featured_image');

                // Add the image through media library
                $post->addMedia($imagePath)
                    ->preservingOriginal()
                    ->toMediaCollection('featured_image');

                $processed++;
            } catch (\Exception $e) {
                $this->newLine();
                $this->error("Error processing {$post->title}: {$e->getMessage()}");
                $errors++;
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("Summary:");
        $this->line("  Processed: {$processed}");
        $this->line("  Skipped: {$skipped}");
        $this->line("  Errors: {$errors}");

        return 0;
    }
}

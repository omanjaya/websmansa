<?php

namespace App\Console\Commands;

use App\Models\Staff;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class ReimportStaffPhotos extends Command
{
    protected $signature = 'staff:reimport-photos {--dry-run : Show what would be done without actually doing it}';
    protected $description = 'Re-import staff photos through Media Library for proper optimization';

    public function handle()
    {
        $isDryRun = $this->option('dry-run');
        $storagePath = storage_path('app/public');

        $staff = Staff::whereNotNull('photo')->get();

        $this->info("Found {$staff->count()} staff members with photos");

        $processed = 0;
        $skipped = 0;
        $errors = 0;

        $bar = $this->output->createProgressBar($staff->count());
        $bar->start();

        foreach ($staff as $member) {
            $photoFilename = $member->photo;
            $photoPath = $storagePath . '/' . $photoFilename;

            if (!file_exists($photoPath)) {
                $this->newLine();
                $this->warn("File not found: {$photoFilename}");
                $skipped++;
                $bar->advance();
                continue;
            }

            if ($isDryRun) {
                $this->newLine();
                $this->line("Would process: {$member->name} - {$photoFilename}");
                $bar->advance();
                continue;
            }

            try {
                // Clear existing media
                $member->clearMediaCollection('photo');

                // Add the photo through media library
                $member->addMedia($photoPath)
                    ->preservingOriginal()
                    ->toMediaCollection('photo');

                $processed++;
            } catch (\Exception $e) {
                $this->newLine();
                $this->error("Error processing {$member->name}: {$e->getMessage()}");
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

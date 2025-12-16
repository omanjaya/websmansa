<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VisitorStat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    /**
     * Get visitor statistics summary
     */
    public function getStats(Request $request)
    {
        $days = $request->get('days', 30);
        
        // Get total visitors for the period
        $totalVisitors = VisitorStat::where('date', '>=', now()->subDays($days))
            ->sum('visitors');
        
        $totalPageViews = VisitorStat::where('date', '>=', now()->subDays($days))
            ->sum('page_views');
        
        // Get previous period for comparison
        $previousVisitors = VisitorStat::where('date', '>=', now()->subDays($days * 2))
            ->where('date', '<', now()->subDays($days))
            ->sum('visitors');
        
        // Calculate growth percentage
        $growthPercentage = $previousVisitors > 0
            ? round((($totalVisitors - $previousVisitors) / $previousVisitors) * 100, 1)
            : 0;
        
        // Today's stats
        $today = VisitorStat::where('date', today()->toDateString())->first();
        
        return response()->json([
            'total_visitors' => $totalVisitors,
            'total_page_views' => $totalPageViews,
            'growth_percentage' => $growthPercentage,
            'today_visitors' => $today->visitors ?? 0,
            'today_page_views' => $today->page_views ?? 0,
        ]);
    }

    /**
     * Get daily visitor trend
     */
    public function getDailyTrend(Request $request)
    {
        $days = $request->get('days', 7);
        
        $stats = VisitorStat::where('date', '>=', now()->subDays($days - 1))
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($stat) {
                return [
                    'date' => $stat->date->format('Y-m-d'),
                    'day' => $stat->date->locale('id')->isoFormat('ddd'), // Sen, Sel, etc
                    'visitors' => $stat->visitors,
                    'page_views' => $stat->page_views,
                ];
            });
        
        // Fill missing dates with zero values
        $startDate = now()->subDays($days - 1)->startOfDay();
        $dates = collect();
        
        for ($i = 0; $i < $days; $i++) {
            $date = $startDate->copy()->addDays($i);
            $existing = $stats->firstWhere('date', $date->format('Y-m-d'));
            
            $dates->push($existing ?? [
                'date' => $date->format('Y-m-d'),
                'day' => $date->locale('id')->isoFormat('ddd'),
                'visitors' => 0,
                'page_views' => 0,
            ]);
        }
        
        return response()->json(['data' => $dates]);
    }

    /**
     * Track page view (public endpoint)
     */
    public function trackPageView(Request $request)
    {
        $today = VisitorStat::today();
        $today->incrementPageViews();
        
        // Optionally track unique visitors based on session/IP
        // This is a simplified version
        if (!$request->session()->has('visitor_counted_today')) {
            $today->incrementVisitors();
            $request->session()->put('visitor_counted_today', true);
        }
        
        return response()->json(['success' => true]);
    }

    /**
     * Seed sample data untuk testing
     */
    public function seedSampleData()
    {
        // Generate sample data untuk 30 hari terakhir
        for ($i = 29; $i >= 0; $i--) {
            $date = now()->subDays($i)->toDateString();
            
            // Create with realistic visitor patterns
            $baseVisitors = rand(800, 1500);
            // Weekends have less visitors
            if (now()->subDays($i)->isWeekend()) {
                $baseVisitors = (int)($baseVisitors * 0.6);
            }
            
            VisitorStat::updateOrCreate(
                ['date' => $date],
                [
                    'visitors' => $baseVisitors,
                    'page_views' => $baseVisitors * rand(2, 5),
                ]
            );
        }
        
        return response()->json([
            'message' => 'Sample data seeded successfully',
            'records' => 30
        ]);
    }
}

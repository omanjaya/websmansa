'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useDailyTrend } from '@/hooks/admin/useAnalytics'
import { Skeleton } from '@/components/ui/skeleton'

export function VisitorChart() {
    const { data: trendData, isLoading } = useDailyTrend(7)

    return (
        <Card className="h-full">
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base font-semibold text-gray-900">Statistik Pengunjung</CardTitle>
                <CardDescription className="text-xs">Tren pengunjung 7 hari terakhir</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2">
                {isLoading ? (
                    <div className="space-y-3">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-[250px] w-full" />
                    </div>
                ) : trendData && trendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="day"
                                className="text-xs"
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            />
                            <YAxis
                                className="text-xs"
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '6px',
                                }}
                                formatter={(value: number | undefined) => value ? [`${value} pengunjung`, 'Visitors'] : ['0 pengunjung', 'Visitors']}
                            />
                            <Line
                                type="monotone"
                                dataKey="visitors"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-[250px] flex items-center justify-center text-sm text-muted-foreground">
                        Belum ada data pengunjung
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

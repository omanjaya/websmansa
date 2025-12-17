'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface ContentDistributionChartProps {
    galleries: number
    posts: number
    announcements: number
    staff: number
    extras: number
    facilities: number
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#14b8a6', '#6366f1']

export function ContentDistributionChart({
    galleries,
    posts,
    announcements,
    staff,
    extras,
    facilities,
}: ContentDistributionChartProps) {
    const data = [
        { name: 'Galeri', value: galleries },
        { name: 'Informasi', value: posts },
        { name: 'Pengumuman', value: announcements },
        { name: 'Staff', value: staff },
        { name: 'Ekstrakurikuler', value: extras },
        { name: 'Fasilitas', value: facilities },
    ]

    return (
        <Card className="h-full">
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base font-semibold text-gray-900">Distribusi Konten</CardTitle>
                <CardDescription className="text-xs">Persentase konten per kategori</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2">
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                                `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '6px',
                            }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

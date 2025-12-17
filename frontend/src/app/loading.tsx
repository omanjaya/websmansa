import { Skeleton } from '@/components/ui'

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <div className="relative h-[400px] bg-gray-200 animate-pulse" />

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <Skeleton className="h-48 w-full rounded-none" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-7 w-3/4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

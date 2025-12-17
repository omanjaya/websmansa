import { Skeleton } from '@/components/ui'

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <section className="relative h-[300px] bg-gray-200 animate-pulse" />

      {/* Content Skeleton */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Filter Skeleton */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-24" />
            ))}
          </div>

          {/* List Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

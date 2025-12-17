import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 
      dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

      {/* Hero Skeleton */}
      <div className="relative h-[85vh] bg-gradient-to-br from-slate-200 to-slate-300 
        dark:from-slate-800 dark:to-slate-900 overflow-hidden">
        {/* Shimmer overlay */}
        <div className="absolute inset-0 shimmer-effect" />

        {/* Content placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-6 max-w-4xl mx-auto px-4">
            {/* Badge */}
            <div className="flex justify-center">
              <Skeleton className="w-48 h-10 rounded-full bg-white/30" />
            </div>

            {/* Title */}
            <div className="space-y-4">
              <Skeleton className="w-3/4 h-16 rounded-2xl mx-auto bg-white/40" />
              <Skeleton className="w-1/2 h-12 rounded-2xl mx-auto bg-white/30" />
            </div>

            {/* Subtitle */}
            <Skeleton className="w-2/3 h-6 rounded-xl mx-auto bg-white/30" />

            {/* CTA Buttons */}
            <div className="flex gap-4 justify-center pt-4">
              <Skeleton className="w-40 h-14 rounded-2xl bg-white/40" />
              <Skeleton className="w-32 h-14 rounded-2xl bg-white/30" />
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Stats Section Skeleton */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-3xl 
          border border-white/50 dark:border-slate-700/50 
          shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center space-y-3">
                <Skeleton className="w-14 h-14 rounded-2xl mx-auto" />
                <Skeleton className="w-20 h-8 rounded-lg mx-auto" />
                <Skeleton className="w-24 h-4 rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Skeleton */}
      <div className="container mx-auto px-4 py-24">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <Skeleton className="w-40 h-10 rounded-full mx-auto" />
          <Skeleton className="w-80 h-14 rounded-2xl mx-auto" />
          <Skeleton className="w-96 max-w-full h-6 rounded-xl mx-auto" />
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-feature-card p-8 space-y-4">
              <Skeleton className="w-16 h-16 rounded-2xl" />
              <Skeleton className="w-3/4 h-8 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="w-full h-4 rounded" />
                <Skeleton className="w-5/6 h-4 rounded" />
                <Skeleton className="w-4/6 h-4 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* News Section Skeleton */}
      <div className="container mx-auto px-4 pb-24">
        <div className="text-center space-y-4 mb-12">
          <Skeleton className="w-36 h-10 rounded-full mx-auto" />
          <Skeleton className="w-64 h-12 rounded-2xl mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-morphism p-4">
              <Skeleton className="w-full aspect-video rounded-xl mb-4" />
              <Skeleton className="w-20 h-6 rounded-full mb-3" />
              <Skeleton className="w-full h-6 rounded mb-2" />
              <Skeleton className="w-3/4 h-6 rounded mb-4" />
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="w-24 h-4 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

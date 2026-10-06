interface SkeletonProps {
    className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div className={`animate-pulse bg-gray-800 rounded-lg ${className}`} />
    )
}

export function CVCardSkeleton() {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-36" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                </div>
            </div>
        </div>
    )
}

export function StatCardSkeleton() {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex gap-6">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                </div>
            </div>
        </div>
    )
}

export function DashboardStatSkeleton() {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <Skeleton className="h-3 w-24 mb-2" />
            <Skeleton className="h-8 w-12" />
        </div>
    )
}
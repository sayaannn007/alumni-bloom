import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "circular" | "text" | "card" | "avatar" | "button";
  animate?: "shimmer" | "pulse" | "wave";
}

function Skeleton({ 
  className, 
  variant = "default", 
  animate = "shimmer",
  ...props 
}: SkeletonProps) {
  const variantClasses = {
    default: "rounded-md",
    circular: "rounded-full",
    text: "rounded h-4 w-full",
    card: "rounded-xl",
    avatar: "rounded-full w-10 h-10",
    button: "rounded-lg h-10 w-24",
  };

  const animationClasses = {
    shimmer: "skeleton-shimmer",
    pulse: "animate-pulse",
    wave: "skeleton-wave",
  };

  return (
    <div 
      className={cn(
        "bg-muted/50 relative overflow-hidden",
        variantClasses[variant],
        animationClasses[animate],
        className
      )} 
      {...props} 
    />
  );
}

// Pre-built skeleton components for common patterns
function SkeletonCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-4 rounded-xl bg-card/50 border border-border/50 space-y-4", className)} {...props}>
      <div className="flex items-center gap-3">
        <Skeleton variant="avatar" className="w-12 h-12" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-20 w-full rounded-lg" />
      <div className="flex gap-2">
        <Skeleton variant="button" className="flex-1" />
        <Skeleton variant="button" className="w-10" />
      </div>
    </div>
  );
}

function SkeletonProfile({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-4", className)} {...props}>
      <Skeleton variant="circular" className="w-16 h-16" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-48" />
      </div>
    </div>
  );
}

function SkeletonLeaderboardItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-3 p-3 rounded-xl bg-card/30", className)} {...props}>
      <Skeleton variant="circular" className="w-8 h-8" />
      <Skeleton variant="avatar" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="text-right space-y-1">
        <Skeleton className="h-4 w-12 ml-auto" />
        <Skeleton className="h-3 w-8 ml-auto" />
      </div>
    </div>
  );
}

function SkeletonNotification({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-start gap-3 p-4 rounded-xl bg-card/30", className)} {...props}>
      <Skeleton variant="circular" className="w-10 h-10 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

function SkeletonTable({ rows = 5, cols = 4, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { rows?: number; cols?: number }) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {/* Header */}
      <div className="flex gap-4 p-3 border-b border-border/50">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 p-3">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              className="h-4 flex-1" 
              style={{ animationDelay: `${(rowIndex * cols + colIndex) * 50}ms` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function SkeletonGrid({ count = 6, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { count?: number }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)} {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} style={{ animationDelay: `${i * 100}ms` }} />
      ))}
    </div>
  );
}

function SkeletonStats({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)} {...props}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-4 rounded-xl bg-card/30 space-y-3 text-center">
          <Skeleton variant="circular" className="w-12 h-12 mx-auto" />
          <Skeleton className="h-6 w-16 mx-auto" />
          <Skeleton className="h-4 w-20 mx-auto" />
        </div>
      ))}
    </div>
  );
}

function SkeletonMessage({ isOwn = false, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { isOwn?: boolean }) {
  return (
    <div className={cn("flex gap-3", isOwn && "flex-row-reverse", className)} {...props}>
      <Skeleton variant="avatar" className="flex-shrink-0" />
      <div className={cn("space-y-2 max-w-[70%]", isOwn && "items-end")}>
        <Skeleton className={cn("h-16 rounded-2xl", isOwn ? "w-48" : "w-64")} />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

function SkeletonConversation({ count = 5, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { count?: number }) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonMessage key={i} isOwn={i % 3 === 0} style={{ animationDelay: `${i * 100}ms` }} />
      ))}
    </div>
  );
}

function SkeletonEventCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 rounded-xl bg-card/50 border border-border/50 space-y-4 flex flex-col", className)} {...props}>
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-12 w-full" />
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" className="w-4 h-4" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" className="w-4 h-4" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" className="w-4 h-4" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
      <div className="mt-auto pt-2">
        <Skeleton variant="button" className="w-full h-10" />
      </div>
    </div>
  );
}

function SkeletonJobCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 rounded-xl bg-card/50 border border-border/50", className)} {...props}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-4">
            <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-32" />
              <div className="flex items-center gap-4 mt-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-32" />
              </div>
              <div className="mt-3 space-y-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 md:flex-col md:items-end">
          <Skeleton variant="button" className="w-20 h-8" />
        </div>
      </div>
    </div>
  );
}

function SkeletonEventsGrid({ count = 4, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { count?: number }) {
  return (
    <div className={cn("grid md:grid-cols-2 gap-6", className)} {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonEventCard key={i} style={{ animationDelay: `${i * 100}ms` }} />
      ))}
    </div>
  );
}

function SkeletonJobsList({ count = 5, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { count?: number }) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonJobCard key={i} style={{ animationDelay: `${i * 100}ms` }} />
      ))}
    </div>
  );
}

function SkeletonProfilePage({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-6", className)} {...props}>
      {/* Header skeleton */}
      <div className="flex items-center gap-4 pb-8 border-b border-border/50">
        <Skeleton className="w-20 h-20 rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      
      {/* Tabs skeleton */}
      <div className="flex gap-2 mb-8">
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 flex-1 rounded-lg" />
      </div>
      
      {/* Form fields skeleton */}
      <div className="grid md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2" style={{ animationDelay: `${i * 50}ms` }}>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>
      
      {/* Bio skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    </div>
  );
}

function SkeletonCompletionCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-4 rounded-xl bg-card/50 border border-border/50", className)} {...props}>
      <div className="flex items-start gap-3 mb-3">
        <Skeleton variant="circular" className="w-10 h-10" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <div className="mb-3 space-y-1">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-8" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
      <div className="flex flex-wrap gap-1 mb-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-16 rounded-full" />
        ))}
      </div>
      <Skeleton variant="button" className="w-full h-9" />
    </div>
  );
}

export { 
  Skeleton, 
  SkeletonCard, 
  SkeletonProfile, 
  SkeletonLeaderboardItem, 
  SkeletonNotification,
  SkeletonTable,
  SkeletonGrid,
  SkeletonStats,
  SkeletonMessage,
  SkeletonConversation,
  SkeletonEventCard,
  SkeletonJobCard,
  SkeletonEventsGrid,
  SkeletonJobsList,
  SkeletonProfilePage,
  SkeletonCompletionCard,
};

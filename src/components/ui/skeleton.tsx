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
  SkeletonConversation
};

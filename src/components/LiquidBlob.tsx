import { cn } from "@/lib/utils";

interface LiquidBlobProps {
  className?: string;
  color?: "cyan" | "purple" | "green" | "mixed";
  size?: "sm" | "md" | "lg" | "xl";
  delay?: boolean;
}

const colorClasses = {
  cyan: "bg-gradient-to-br from-aurora-cyan/40 to-aurora-purple/20",
  purple: "bg-gradient-to-br from-aurora-purple/40 to-aurora-cyan/20",
  green: "bg-gradient-to-br from-aurora-green/30 to-aurora-purple/20",
  mixed: "bg-gradient-to-br from-aurora-cyan/30 via-aurora-purple/20 to-aurora-green/30",
};

const sizeClasses = {
  sm: "w-32 h-32",
  md: "w-64 h-64",
  lg: "w-96 h-96",
  xl: "w-[500px] h-[500px]",
};

export function LiquidBlob({ 
  className, 
  color = "cyan", 
  size = "md",
  delay = false 
}: LiquidBlobProps) {
  return (
    <div
      className={cn(
        "absolute blur-3xl opacity-60",
        colorClasses[color],
        sizeClasses[size],
        delay ? "animate-blob-delayed" : "animate-blob",
        className
      )}
    />
  );
}

import { cn } from "@/lib/utils";
import { ReactNode, CSSProperties } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  intense?: boolean;
  style?: CSSProperties;
}

export function GlassCard({ 
  children, 
  className, 
  hover = true,
  glow = false,
  intense = false,
  style
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 transition-all duration-300",
        intense ? "glass-intense" : "glass",
        glow && "glass-glow",
        hover && "hover:scale-[1.02] hover:glass-intense",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}

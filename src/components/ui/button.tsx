import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useHaptics } from "@/hooks/useHaptics";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background/50 backdrop-blur-sm hover:bg-accent/20 hover:text-accent-foreground hover:border-primary/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent/20 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Aurora gradient buttons
        aurora:
          "btn-liquid text-primary-foreground font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105",
        auroraGreen:
          "btn-liquid btn-liquid-green text-primary-foreground font-bold shadow-lg shadow-accent/30 hover:shadow-accent/50 hover:scale-105",
        // Glass buttons
        glass:
          "glass hover:glass-intense hover:scale-105 text-foreground border-0",
        glassGlow:
          "glass glass-glow hover:glass-intense hover:scale-105 text-foreground border-0 animate-glow",
        // New gradient variants
        gradientShift:
          "relative overflow-hidden bg-gradient-to-r from-primary via-secondary to-accent bg-[length:200%_100%] animate-[gradient-flow_3s_linear_infinite] text-primary-foreground font-bold shadow-lg",
        neon:
          "relative bg-transparent border-2 border-primary text-primary shadow-[0_0_20px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.8)] hover:bg-primary/10",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface RippleEffect {
  id: number;
  x: number;
  y: number;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  ripple?: boolean;
  sound?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ripple = true, sound = true, onClick, onMouseEnter, ...props }, ref) => {
    const [ripples, setRipples] = React.useState<RippleEffect[]>([]);
    const { playSound } = useSoundEffects();
    const { vibrate } = useHaptics();
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();
        
        setRipples(prev => [...prev, { id, x, y }]);
        
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== id));
        }, 800);
      }
      
      if (sound) {
        playSound("click");
        vibrate("light");
      }
      
      onClick?.(e);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (sound) {
        playSound("hover");
      }
      onMouseEnter?.(e);
    };
    
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      );
    }
    
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }), "relative overflow-hidden")}
        ref={ref}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        {...props}
      >
        {props.children}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: ripple.x - 5,
                top: ripple.y - 5,
                width: 10,
                height: 10,
                background: "radial-gradient(circle, hsl(var(--foreground) / 0.3), transparent)",
              }}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 20, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

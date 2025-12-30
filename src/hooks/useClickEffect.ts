import { useState, useCallback, MouseEvent } from "react";

interface ClickEffect {
  id: number;
  x: number;
  y: number;
  color: string;
}

const gradientColors = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(280 70% 60%)",
  "hsl(200 80% 60%)",
];

export function useClickEffect() {
  const [effects, setEffects] = useState<ClickEffect[]>([]);

  const createEffect = useCallback((e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    const color = gradientColors[Math.floor(Math.random() * gradientColors.length)];

    setEffects((prev) => [...prev, { id, x, y, color }]);

    setTimeout(() => {
      setEffects((prev) => prev.filter((effect) => effect.id !== id));
    }, 800);
  }, []);

  const removeEffect = useCallback((id: number) => {
    setEffects((prev) => prev.filter((effect) => effect.id !== id));
  }, []);

  return { effects, createEffect, removeEffect };
}

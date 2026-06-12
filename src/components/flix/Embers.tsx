import { useMemo } from "react";

export function Embers({ count = 30 }: { count?: number }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 12,
      drift: (Math.random() - 0.5) * 200,
      size: 2 + Math.random() * 3,
    }));
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {particles.map((p, i) => (
        <span
          key={i}
          className="ember"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            ["--drift" as never]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

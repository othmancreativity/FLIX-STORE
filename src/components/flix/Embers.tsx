export function Embers({ count = 30 }: { count?: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {Array.from({ length: count }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = 8 + Math.random() * 12;
        const drift = (Math.random() - 0.5) * 200;
        const size = 2 + Math.random() * 3;
        return (
          <span
            key={i}
            className="ember"
            style={{
              left: `${left}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              width: `${size}px`,
              height: `${size}px`,
              ["--drift" as never]: `${drift}px`,
            }}
          />
        );
      })}
    </div>
  );
}

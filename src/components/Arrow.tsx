// Drawn rather than typed: the web fonts' Latin subsets have no arrow glyphs,
// so a typed ← / → would fall back to whatever system font has one.
export function Arrow({ left = false, className = "" }: { left?: boolean; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 10"
      className={`inline-block h-[0.62em] w-[1em] align-[0.02em] ${left ? "-scale-x-100" : ""} ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <path d="M0 5h15M10.5 0.75 15 5l-4.5 4.25" />
    </svg>
  );
}

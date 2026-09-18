import chevrons from "@/assets/chevrons.png";

export function ProgressMark({ size }: { size?: number }) {
  return (
    <svg
      className="progress-mark"
      viewBox="0 0 100 100"
      role="img"
      aria-label="جارٍ التحميل"
      style={size ? { width: size } : undefined}
    >
      <defs>
        <radialGradient id="sphereGrad" cx="50%" cy="34%" r="85%">
          <stop offset="0%" stopColor="var(--splash-violet)" />
          <stop offset="60%" stopColor="var(--splash-violet-deep)" />
          <stop offset="100%" stopColor="oklch(0.24 0.19 299)" />
        </radialGradient>
      </defs>

      <circle cx="50" cy="50" r="45" fill="none" stroke="var(--splash-ink)" strokeWidth="5" />
      <circle
        className="progress-arc"
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="var(--splash-orange)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="283"
        transform="rotate(-90 50 50)"
      />
      <circle cx="50" cy="50" r="37" fill="url(#sphereGrad)" />
      <image
        href={chevrons}
        x={35.3}
        y={37.68}
        width={29.41}
        height={24.63}
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  );
}

/**
 * The mark: a conversation's arc that arrives at a point — the next step.
 * The same idea drives the 30-minute dial on the method page, and the point
 * returns as the full stops in "L.E.B.E.N.".
 */
export default function Logo({prefix}: {prefix: string}) {
  return (
    <span className="logo">
      <svg className="logo-mark" viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
        <circle
          cx="16"
          cy="16"
          r="11.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray="76 100"
          transform="rotate(-90 16 16)"
        />
        <circle className="logo-dot" cx="5.2" cy="11.6" r="3.7" />
      </svg>
      <span className="logo-text">
        <span className="logo-pre">{prefix}</span>
        <span className="logo-name" role="img" aria-label="L.E.B.E.N.">
          {'LEBEN'.split('').map((letter, i) => (
            <span key={i} aria-hidden="true">
              {letter}
              <i>.</i>
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}
